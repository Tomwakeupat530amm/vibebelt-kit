#!/usr/bin/env node
/**
 * e2e-kit-flows.test.mjs
 * Four end-to-end trials for vibebelt-kit (written for upstream v3.0.0).
 * Uses Node built-in node:test — no external test dependencies.
 * ALL writes go to the OS temp folder (os.tmpdir(), /tmp on Linux) — never touches the target/source repo.
 *
 * Run: node e2e-kit-flows.test.mjs
 * Or:  node --test e2e-kit-flows.test.mjs
 *
 * VB_KIT_SOURCE must point to the local kit for all trials.
 * Default: KIT_PATH = the kit repo root (this file's directory)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const KIT_PATH = process.env.VB_KIT_SOURCE
  ?? path.dirname(fileURLToPath(import.meta.url));
const INSTALL_SH = path.join(KIT_PATH, 'install.sh');
// bash (Git Bash or WSL) on Windows needs forward slashes; callers also quote the path.
const toBashPath = (p) => (process.platform === 'win32' ? p.replace(/\\/g, '/') : p);
// Kit manifest: the current name first; kits from before the prefix rename ship the old name.
const KIT_MANIFEST_NEW = path.join(KIT_PATH, 'vb-manifest.json');
const KIT_MANIFEST_OLD = path.join(KIT_PATH, 'vc-manifest.json'); // legacy-vc-fallback
const KIT_MANIFEST = fs.existsSync(KIT_MANIFEST_NEW) ? KIT_MANIFEST_NEW : KIT_MANIFEST_OLD;

/**
 * Create a fresh /tmp project directory, optionally seeded with fixtures.
 * CRITICAL: every project is git-initialized so discover-skills.mjs (git rev-parse) works.
 * Returns the project path. Caller is responsible for cleanup.
 *
 * @param {object} opts
 * @param {'empty'|'with-user-skill'|'v2x-snapshot'} opts.seed
 * @returns {string} projectPath
 */
function seedProject(opts) {
  const projectPath = fs.mkdtempSync(path.join(os.tmpdir(), 'vb-e2e-'));

  // Every project needs git init — discover-skills.mjs runs git rev-parse
  execSync('git init -q', { cwd: projectPath });
  execSync('git commit --allow-empty -m "init" -q', {
    cwd: projectPath,
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'test',
      GIT_AUTHOR_EMAIL: 'test@test.com',
      GIT_COMMITTER_NAME: 'test',
      GIT_COMMITTER_EMAIL: 'test@test.com',
    },
  });

  if (opts.seed === 'with-user-skill') {
    // Seed: user has a non-vc custom skill that must survive install
    const userSkillDir = path.join(projectPath, '.claude/skills/my-custom-skill');
    fs.mkdirSync(userSkillDir, { recursive: true });
    fs.writeFileSync(
      path.join(userSkillDir, 'SKILL.md'),
      '# my-custom-skill\nThis is user-owned. Must survive install.'
    );
    // Seed: user has a non-kit root file
    fs.writeFileSync(path.join(projectPath, 'MY_NOTES.txt'), 'user note file');
    // Seed: user has .claude/settings.json (merge-preserved)
    fs.mkdirSync(path.join(projectPath, '.claude'), { recursive: true });
    fs.writeFileSync(
      path.join(projectPath, '.claude/settings.json'),
      JSON.stringify(
        {
          userCustomSetting: true,
          permissions: { allow: ['Bash(**/my-scripts/**:*)'] },
        },
        null,
        2
      )
    );
  }

  // rename-prefix:keep:start (Trial C seeds an old v2.x install: its old names must not be renamed)
  if (opts.seed === 'v2x-snapshot') {
    // Seed: simulate v2.4.1 install state
    // Has deprecated vc-team skill (in legacyDeletions) present on disk
    const vcTeamDir = path.join(projectPath, '.claude/skills/vc-team');
    fs.mkdirSync(vcTeamDir, { recursive: true });
    fs.writeFileSync(path.join(vcTeamDir, 'SKILL.md'), '# vc-team (deprecated v2.x skill)');
    // Has a user skill that must survive
    const userSkillDir = path.join(projectPath, '.claude/skills/my-tool');
    fs.mkdirSync(userSkillDir, { recursive: true });
    fs.writeFileSync(path.join(userSkillDir, 'SKILL.md'), '# my-tool — user owned');
    // Write a prior .vc-installed-files snapshot (v2.x state)
    // Lists vc-team/SKILL.md as kit-installed (it was, in v2.x)
    const v2Snapshot = [
      '.claude/skills/vc-team/SKILL.md',
      'CLAUDE.md',
      'AGENTS.md',
    ].join('\n');
    fs.writeFileSync(path.join(projectPath, '.vc-installed-files'), v2Snapshot);
    fs.writeFileSync(path.join(projectPath, '.vc-version'), '2.4.1');
  }
  // rename-prefix:keep:end

  return projectPath;
}

// ──────────────────────────────────────────────────────────────
// Trial A: New install on empty project
// ──────────────────────────────────────────────────────────────
test('Trial A: new install on empty project', async () => {
  const projectPath = seedProject({ seed: 'empty' });
  try {
    execSync(`bash "${toBashPath(INSTALL_SH)}"`, {
      cwd: projectPath,
      env: { ...process.env, VB_KIT_SOURCE: KIT_PATH },
      stdio: 'pipe',
    });

    // AC-3: VB_KIT_SOURCE honored — installed version matches kit manifest version
    const kitVersion = JSON.parse(
      fs.readFileSync(KIT_MANIFEST, 'utf8')
    ).version;
    const installedVersion = fs.readFileSync(
      path.join(projectPath, '.vb-version'),
      'utf8'
    ).trim();
    assert.equal(installedVersion, kitVersion, 'AC-3: installed version matches kit version');

    // AC-2: no rm -rf wipe — .vb-installed-files written
    assert.ok(
      fs.existsSync(path.join(projectPath, '.vb-installed-files')),
      'AC-2: .vb-installed-files written'
    );

    // AC-2 (code audit): install.sh does not contain the wipe line
    const installShContent = fs.readFileSync(INSTALL_SH, 'utf8');
    assert.ok(
      !installShContent.includes('rm -rf .claude .codex .agents'),
      'AC-2: install.sh does not contain rm -rf .claude .codex .agents wipe'
    );

    // vb-* skills directory present
    assert.ok(
      fs.existsSync(path.join(projectPath, '.claude/skills')),
      'kit skills directory present'
    );

    // .agents/skills symlink or directory present
    assert.ok(
      fs.existsSync(path.join(projectPath, '.agents/skills')),
      '.agents/skills exists'
    );

    // discover-skills exits 0 (tests git rev-parse + skill discovery)
    execSync(
      `node ${path.join(KIT_PATH, '.claude/skills/vb-context-discovery/scripts/discover-skills.mjs')}`,
      { cwd: projectPath, stdio: 'pipe' }
    );
    // No assertion needed — execSync throws on non-zero exit
  } finally {
    fs.rmSync(projectPath, { recursive: true, force: true });
  }
});

// ──────────────────────────────────────────────────────────────
// Trial B: Coexistence — user-owned skills survive install
// ──────────────────────────────────────────────────────────────
test('Trial B: coexistence — user skills survive install', async () => {
  const projectPath = seedProject({ seed: 'with-user-skill' });

  // Capture user skill content before install
  const userSkillPath = path.join(
    projectPath,
    '.claude/skills/my-custom-skill/SKILL.md'
  );
  const userSkillBefore = fs.readFileSync(userSkillPath);

  // Capture user settings.json before install
  const settingsPath = path.join(projectPath, '.claude/settings.json');
  const settingsBefore = fs.readFileSync(settingsPath);

  try {
    execSync(`bash "${toBashPath(INSTALL_SH)}"`, {
      cwd: projectPath,
      env: { ...process.env, VB_KIT_SOURCE: KIT_PATH },
      stdio: 'pipe',
    });

    // AC-1: user's custom skill is byte-identical after install
    const userSkillAfter = fs.readFileSync(userSkillPath);
    assert.equal(
      Buffer.compare(userSkillBefore, userSkillAfter),
      0,
      'AC-1: user custom skill byte-identical after install'
    );

    // AC-1: user's non-kit root file untouched
    assert.ok(
      fs.existsSync(path.join(projectPath, 'MY_NOTES.txt')),
      'AC-1: user MY_NOTES.txt untouched'
    );

    // AC-1: settings.json preserved (merge semantics — user version kept)
    const settingsAfter = fs.readFileSync(settingsPath);
    assert.equal(
      Buffer.compare(settingsBefore, settingsAfter),
      0,
      'AC-1: .claude/settings.json merge preserved (user version kept)'
    );

    // AC-17: backup present (HAS_EXISTING=true because we seeded .claude/)
    assert.ok(
      fs.existsSync(path.join(projectPath, '.vibecode-backup')),
      'AC-17: .vibecode-backup directory present'
    );

    // AC-2: kit vb-* skills installed alongside user skill
    const skillDirs = fs.readdirSync(path.join(projectPath, '.claude/skills'));
    const hasVcSkills = skillDirs.some((d) => d.startsWith('vb-'));
    assert.ok(hasVcSkills, 'AC-2: vb-* skills installed');
    assert.ok(
      skillDirs.includes('my-custom-skill'),
      'AC-1: my-custom-skill still present'
    );
  } finally {
    fs.rmSync(projectPath, { recursive: true, force: true });
  }
});

// ──────────────────────────────────────────────────────────────
// Trial C: v2.x → v3 migration via install
// ──────────────────────────────────────────────────────────────
test('Trial C: v2.x to v3 migration via install', async () => {
  const projectPath = seedProject({ seed: 'v2x-snapshot' });

  // Capture user tool before install
  const userToolPath = path.join(
    projectPath,
    '.claude/skills/my-tool/SKILL.md'
  );
  const userToolBefore = fs.readFileSync(userToolPath);

  try {
    execSync(`bash "${toBashPath(INSTALL_SH)}"`, {
      cwd: projectPath,
      env: { ...process.env, VB_KIT_SOURCE: KIT_PATH },
      stdio: 'pipe',
    });

    // rename-prefix:keep:start (the old vc-team folder must be gone; a renamed path never existed)
    // AC-7: deprecated vc-team removed (legacyDeletion — full dir)
    assert.ok(
      !fs.existsSync(path.join(projectPath, '.claude/skills/vc-team')),
      'AC-7: .claude/skills/vc-team removed (legacyDeletion)'
    );
    // rename-prefix:keep:end

    // AC-7: .vb-version updated to current kit version
    const kitVersion = JSON.parse(
      fs.readFileSync(KIT_MANIFEST, 'utf8')
    ).version;
    const installedVersion = fs.readFileSync(
      path.join(projectPath, '.vb-version'),
      'utf8'
    ).trim();
    assert.equal(installedVersion, kitVersion, 'AC-7: .vb-version updated to v3.0.0');

    // AC-7 / AC-1: user-owned my-tool untouched
    const userToolAfter = fs.readFileSync(userToolPath);
    assert.equal(
      Buffer.compare(userToolBefore, userToolAfter),
      0,
      'AC-7: user tool byte-identical after migration install'
    );

    // AC-5: legacyDeletions audit — every path must be in a kit-owned namespace (the isKitOwned
    // namespaces of compute-sync-plan.mjs, old and new prefix) or be one of the two old process dirs
    const manifest = JSON.parse(
      fs.readFileSync(KIT_MANIFEST, 'utf8')
    );
    const legacyDeletions = manifest.legacyDeletions || [];
    const KIT_NAMESPACES = [
      '.claude/skills/vc-', '.claude/agents/vc-', // legacy-vc-fallback: entries of the kit before the prefix rename
      '.claude/skills/vb-', '.claude/agents/vb-',
      '.claude/hooks/', '.codex/', 'process/development-protocols/', 'process/_seeds/',
    ];
    const KIT_DIRS = ['process/general-plans/reports', 'process/general-plans/references'];
    for (const p of legacyDeletions) {
      const isKitOwned = KIT_NAMESPACES.some((ns) => p.startsWith(ns)) || KIT_DIRS.includes(p);
      assert.ok(
        isKitOwned,
        `AC-5: legacyDeletion '${p}' must be under a kit-owned namespace (.claude/skills/, .claude/agents/, .claude/hooks/, .codex/, process/development-protocols/, process/_seeds/) or be process/general-plans/reports or references`
      );
    }
  } finally {
    fs.rmSync(projectPath, { recursive: true, force: true });
  }
});

// ──────────────────────────────────────────────────────────────
// Trial D: Publish dry-run — no git push occurs without explicit approval
// ──────────────────────────────────────────────────────────────
test('Trial D: publish dry-run — no git push occurs without explicit approval', async () => {
  // This trial is a proxy for "agent paused at push gate."
  // We cannot automate the full vb-publish prose flow (it requires Claude Code).
  // The proxy: assert SKILL.md contains the required gate language, then run
  // compute-sync-plan.mjs in publish direction and assert git state unchanged.

  const publishSkillPath = path.join(
    KIT_PATH,
    '.claude/skills/vb-publish/SKILL.md'
  );
  const skillContent = fs.readFileSync(publishSkillPath, 'utf8');

  // AC-14: SKILL.md has explicit separate push gate (Step 9b)
  assert.ok(
    skillContent.includes('Explicit Push Approval') ||
      (skillContent.includes('explicit') &&
        skillContent.includes('push') &&
        skillContent.includes('Step 9')),
    'AC-14: vb-publish SKILL.md contains explicit push gate step'
  );

  // AC-14: NEVER auto-push rule present in SKILL.md Rules section
  assert.ok(
    skillContent.includes('NEVER auto-push') ||
      skillContent.includes('never auto-push'),
    'AC-14: vb-publish SKILL.md Rules section has NEVER auto-push rule'
  );

  // AC-15: leak detection step precedes commit/push step in the flow
  const leakPos = skillContent.indexOf('Leak Detection');
  const commitPos = skillContent.indexOf('Commit and Tag');
  assert.ok(leakPos !== -1, 'AC-15: Leak Detection step present in vb-publish SKILL.md');
  assert.ok(
    commitPos !== -1,
    'AC-15: Commit and Tag step present in vb-publish SKILL.md'
  );
  assert.ok(
    leakPos < commitPos,
    'AC-15: Leak Detection appears before Commit and Tag in the flow'
  );

  // Proxy: run compute-sync-plan.mjs in publish direction and assert git state unchanged
  const tmpKitClone = fs.mkdtempSync(path.join(os.tmpdir(), 'vb-e2e-publish-'));
  try {
    // Clone the local kit to a tmpdir (simulates kitRepoPath in vb-publish).
    // --no-hardlinks: the kit checkout and the temp folder may be on different drives.
    execSync(`git clone --local --no-hardlinks --quiet "${KIT_PATH}" "${tmpKitClone}"`, {
      stdio: 'pipe',
    });

    // Capture git log before
    const logBefore = execSync('git log --oneline', {
      cwd: tmpKitClone,
      encoding: 'utf8',
    });
    const tagsBefore = execSync('git tag -l', {
      cwd: tmpKitClone,
      encoding: 'utf8',
    });

    // Run compute-sync-plan.mjs (publish direction: project=tmpKitClone, kit=KIT_PATH)
    // Pure computation — no git ops
    execSync(
      `node "${path.join(KIT_PATH, 'compute-sync-plan.mjs')}" --root "${tmpKitClone}" --kit-root "${KIT_PATH}" --json`,
      { stdio: 'pipe' }
    );

    // Capture git log after
    const logAfter = execSync('git log --oneline', {
      cwd: tmpKitClone,
      encoding: 'utf8',
    });
    const tagsAfter = execSync('git tag -l', {
      cwd: tmpKitClone,
      encoding: 'utf8',
    });

    // AC-14: no commit or tag happened during computation
    assert.equal(
      logBefore,
      logAfter,
      'AC-14: git log unchanged after compute-sync-plan.mjs run'
    );
    assert.equal(
      tagsBefore,
      tagsAfter,
      'AC-14: git tags unchanged after compute-sync-plan.mjs run'
    );
  } finally {
    fs.rmSync(tmpKitClone, { recursive: true, force: true });
  }
});

// rename-prefix:keep:start (Trial E is written in post-rename terms: vc- names describe the old
// install, vb- names describe this kit; the rename tool must not rewrite anything in this test)
// ──────────────────────────────────────────────────────────────
// Trial E: an install of the old kit (upstream-baseline tag, vc- names) upgraded by this installer
// ──────────────────────────────────────────────────────────────
function listFiles(root, rel) {
  const out = [];
  (function walk(r) {
    for (const d of fs.readdirSync(path.join(root, r), { withFileTypes: true })) {
      const p = `${r}/${d.name}`;
      if (d.isDirectory()) walk(p);
      else out.push(p);
    }
  })(rel);
  return out.sort();
}

test('Trial E: old install to new install', async (t) => {
  try {
    execSync('git rev-parse --verify --quiet "upstream-baseline^{commit}"', { cwd: KIT_PATH, stdio: 'pipe' });
  } catch {
    throw new Error('Trial E needs the upstream-baseline tag of the kit repo (git fetch --tags)');
  }
  const oldKit = fs.mkdtempSync(path.join(os.tmpdir(), 'vb-e2e-oldkit-'));
  const projectPath = seedProject({ seed: 'empty' });
  const cleanEnv = { ...process.env };
  delete cleanEnv.VB_KIT_SOURCE;
  delete cleanEnv.VC_KIT_SOURCE;
  try {
    // 1. The old kit, exactly as released, installed by its own installer.
    execSync(`git archive upstream-baseline | tar -x -C "${oldKit}"`, { cwd: KIT_PATH, stdio: 'pipe' });
    execSync(`bash "${toBashPath(path.join(oldKit, 'install.sh'))}"`, {
      cwd: projectPath, env: { ...cleanEnv, VC_KIT_SOURCE: oldKit }, stdio: 'pipe',
    });
    const oldSnapshot = fs.readFileSync(path.join(projectPath, '.vc-installed-files'), 'utf8').split('\n').filter(Boolean);
    assert.ok(oldSnapshot.length > 100, 'the old installer wrote its install snapshot');

    // 2. The user edits one old kit file and adds two skills of their own.
    const modified = '.claude/skills/vc-scout/SKILL.md';
    assert.ok(oldSnapshot.includes(modified), `${modified} came from the old install`);
    fs.appendFileSync(path.join(projectPath, modified), '\nMy own note in an old kit skill.\n');
    const userSkills = {
      '.claude/skills/my-skill/SKILL.md': '# my-skill (user owned)\n',
      '.claude/skills/vc-custom/SKILL.md': '# vc-custom (user owned, old prefix)\n',
    };
    for (const [p, text] of Object.entries(userSkills)) {
      fs.mkdirSync(path.dirname(path.join(projectPath, p)), { recursive: true });
      fs.writeFileSync(path.join(projectPath, p), text);
    }

    // 3. This kit installed over it.
    const output = execSync(`bash "${toBashPath(INSTALL_SH)}"`, {
      cwd: projectPath, env: { ...cleanEnv, VB_KIT_SOURCE: KIT_PATH }, stdio: 'pipe', encoding: 'utf8',
    }).replace(/\x1b\[[0-9;]*m/g, '');
    const exists = (p) => fs.existsSync(path.join(projectPath, p));

    // Unmodified old files are removed: no old vc- path of the old snapshot survives except the edited one.
    const leftovers = oldSnapshot.filter((p) => p !== modified && p.split('/').some((s) => s.startsWith('vc-')) && exists(p));
    assert.deepEqual(leftovers, [], 'unmodified old vc- files removed');

    // The edited file is kept and reported; nothing else is left in its old folder.
    assert.ok(exists(modified), 'the edited old file is kept');
    assert.ok(output.includes(`kept (modified): ${modified}`), 'the edited old file is reported');
    assert.deepEqual(listFiles(projectPath, '.claude/skills/vc-scout'), [modified], 'only the edited file remains');

    // Custom skills are untouched.
    for (const [p, text] of Object.entries(userSkills)) {
      assert.equal(fs.readFileSync(path.join(projectPath, p), 'utf8'), text, `${p} untouched`);
    }

    // State files migrated to the new names.
    const kitVersion = JSON.parse(fs.readFileSync(KIT_MANIFEST, 'utf8')).version;
    const vbVersion = fs.readFileSync(path.join(projectPath, '.vb-version'), 'utf8').trim();
    assert.equal(vbVersion, kitVersion, '.vb-version holds the new kit version');
    assert.ok(exists('.vb-installed-files'), '.vb-installed-files written');
    assert.ok(!exists('.vc-version') && !exists('.vc-installed-files'), 'old state files removed after the migration');

    // No vc-x next to vb-x for unmodified files.
    for (const dir of ['.claude/skills', '.claude/agents', '.codex/agents']) {
      for (const name of fs.readdirSync(path.join(projectPath, dir))) {
        if (!name.startsWith('vb-')) continue;
        const old = `${dir}/vc-${name.slice(3)}`;
        if (old === '.claude/skills/vc-scout') continue; // holds only the kept, edited file
        assert.ok(!exists(old), `${old} must not remain next to ${dir}/${name}`);
      }
    }
    t.diagnostic(`.vb-version after the old-to-new install: ${vbVersion}`);
  } finally {
    fs.rmSync(projectPath, { recursive: true, force: true });
    fs.rmSync(oldKit, { recursive: true, force: true });
  }
});
// rename-prefix:keep:end
