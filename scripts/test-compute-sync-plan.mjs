#!/usr/bin/env node
/**
 * scripts/test-compute-sync-plan.mjs - unit test of the legacy gate in compute-sync-plan.mjs.
 * Run: node scripts/test-compute-sync-plan.mjs   (exit 0 = all pass)
 *
 * Standalone on purpose: it ships with the kit, so it imports nothing under scripts/ and builds its
 * own throwaway kit and project trees under os.tmpdir(). It runs the real CLI
 * `compute-sync-plan.mjs --root <old install> --kit-root <new kit> --json` (plus --legacy-gate, the
 * mode install.sh uses, and --apply) and checks what is deleted, kept and reported:
 *   matching hash -> deleted; modified -> kept + reported; unknown file inside a hashed folder ->
 *   kept + reported; snapshot-gated folder fully in the install snapshot -> deleted; the same folder
 *   with one extra user file -> kept; no snapshot -> kept; user skills are never touched.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CSP = path.join(REPO, 'compute-sync-plan.mjs');
const MANIFEST_NAME = ['vb-manifest.json', 'vc-manifest.json'].find((n) => fs.existsSync(path.join(REPO, n)));
const OLD_SNAPSHOT = '.vc-installed-files'; // what every install made before the prefix rename wrote
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
const { SNAPSHOT_FILE, OLD_SNAPSHOT_FILE, VERSION_FILE, OLD_VERSION_FILE } = await import(pathToFileURL(CSP).href);

const OLD = { // content of the old kit files, as hashed into the kit's legacy-hashes.json
  '.claude/skills/vc-old/SKILL.md': '# vc-old\nold kit skill\n',
  '.claude/skills/vc-mod/SKILL.md': '# vc-mod\nold kit skill\n',
  '.claude/agents/vc-old-agent.md': '# vc-old-agent\nold kit agent\n',
  '.claude/skills/vc-renamed/SKILL.md': '# vc-renamed\nold kit skill (stale via snapshot only)\n',
};
const LEGACY = ['.claude/skills/vc-old', '.claude/skills/vc-mod', '.claude/agents/vc-old-agent.md',
  '.claude/skills/vc-gone', '.claude/skills/vc-gone2', 'process/development-protocols/old-protocol.md'];
const SNAPSHOT_GATED = ['.claude/skills/vc-gone', '.claude/skills/vc-gone2', 'process/development-protocols/old-protocol.md'];

function write(root, rel, text) {
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  fs.writeFileSync(path.join(root, rel), text);
}

function makeKit(base, { withHashes = true } = {}) {
  const kit = path.join(base, 'kit');
  write(kit, MANIFEST_NAME, `${JSON.stringify({
    version: '1.0.0', include: ['.claude/skills/**'], exclude: [], merge: [], copyIfMissing: [], kitOnly: [],
    strip: [], symlinks: {}, legacyDeletions: LEGACY,
  }, null, 2)}\n`);
  fs.copyFileSync(path.join(REPO, 'resolve-manifest.mjs'), path.join(kit, 'resolve-manifest.mjs'));
  write(kit, '.claude/skills/kit-skill/SKILL.md', '# kit-skill\nnew kit skill\n');
  if (withHashes) {
    const hashed = Object.fromEntries(Object.entries(OLD).map(([p, t]) => [p, sha256(t)]));
    write(kit, 'legacy-hashes.json', `${JSON.stringify({ schema: 1, hashed, snapshotGated: SNAPSHOT_GATED }, null, 2)}\n`);
  }
  return kit;
}

const SNAPSHOT_LIST = [
  ...Object.keys(OLD), '.claude/skills/vc-renamed/extra.md',
  '.claude/skills/vc-gone/SKILL.md', '.claude/skills/vc-gone/ref.md', '.claude/skills/vc-gone2/SKILL.md',
  'process/development-protocols/old-protocol.md', '.claude/hooks/old-hook.cjs', 'src/app.js',
];

function makeProject(base, { snapshot = true } = {}) {
  const proj = path.join(base, 'project');
  for (const [p, t] of Object.entries(OLD)) write(proj, p, t);
  write(proj, '.claude/skills/vc-mod/SKILL.md', '# vc-mod\nold kit skill\nmy own edit\n'); // modified
  write(proj, '.claude/skills/vc-old/notes.md', 'user notes inside an old kit folder\n'); // unknown file
  write(proj, '.claude/skills/vc-renamed/extra.md', 'listed in the snapshot but never hashed\n');
  write(proj, '.claude/skills/vc-gone/SKILL.md', '# vc-gone\n');
  write(proj, '.claude/skills/vc-gone/ref.md', 'ref\n');
  write(proj, '.claude/skills/vc-gone2/SKILL.md', '# vc-gone2\n');
  write(proj, '.claude/skills/vc-gone2/mine.md', 'user file, not in the snapshot\n');
  write(proj, 'process/development-protocols/old-protocol.md', 'old protocol\n');
  write(proj, '.claude/hooks/old-hook.cjs', '// old hook\n');
  write(proj, 'src/app.js', '// user app code\n');
  write(proj, '.claude/skills/my-skill/SKILL.md', '# my-skill\n');
  write(proj, '.claude/skills/vc-custom/SKILL.md', '# vc-custom (user skill with the old prefix)\n');
  if (snapshot) {
    write(proj, OLD_SNAPSHOT, `${SNAPSHOT_LIST.join('\n')}\n`);
    write(proj, '.vc-version', '3.2.5\n');
  }
  return proj;
}

function setup(opts = {}) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'csp-gate-test-'));
  return { base, kit: makeKit(base, opts), proj: makeProject(base, opts), cleanup: () => fs.rmSync(base, { recursive: true, force: true }) };
}

function planJson(proj, kit) {
  const out = execFileSync(process.execPath, [CSP, '--root', proj, '--kit-root', kit, '--json'], { encoding: 'utf8' });
  return JSON.parse(out);
}

const warned = (plan, p, reason) => plan.staleWarnings.some((w) => w.includes(`'${p}'`) && w.includes(reason));

test('hash gate: unchanged old files deleted; modified, unknown and user files kept and reported', () => {
  const t = setup();
  try {
    const plan = planJson(t.proj, t.kit);
    for (const p of ['.claude/skills/vc-old/SKILL.md', '.claude/agents/vc-old-agent.md', '.claude/skills/vc-renamed/SKILL.md']) {
      assert.ok(plan.toDelete.includes(p), `matching hash -> deleted: ${p}`);
    }
    assert.ok(!plan.toDelete.includes('.claude/skills/vc-mod/SKILL.md'));
    assert.ok(plan.toPreserve.includes('.claude/skills/vc-mod/SKILL.md'));
    assert.ok(warned(plan, '.claude/skills/vc-mod/SKILL.md', 'modified'), 'modified -> reported');
    for (const p of ['.claude/skills/vc-old/notes.md', '.claude/skills/vc-renamed/extra.md']) {
      assert.ok(!plan.toDelete.includes(p) && plan.toPreserve.includes(p), `unknown file kept: ${p}`);
      assert.ok(warned(plan, p, 'unknown file'), `unknown file reported: ${p}`);
    }
    const touched = [...plan.toDelete, ...plan.toModify];
    for (const p of ['.claude/skills/my-skill/SKILL.md', '.claude/skills/vc-custom/SKILL.md']) {
      assert.ok(!touched.includes(p), `user skill untouched: ${p}`);
    }
    assert.ok(!plan.toDelete.some((p) => p === '.claude/skills/vc-old' || p === '.claude/skills/vc-mod'), 'old folders are never removed whole');
  } finally { t.cleanup(); }
});

test('snapshot gate: deprecated folder deleted only when every file is in the install snapshot', () => {
  const t = setup();
  try {
    const plan = planJson(t.proj, t.kit);
    for (const p of ['.claude/skills/vc-gone/SKILL.md', '.claude/skills/vc-gone/ref.md', 'process/development-protocols/old-protocol.md']) {
      assert.ok(plan.toDelete.includes(p), `fully in the snapshot -> deleted: ${p}`);
    }
    for (const p of ['.claude/skills/vc-gone2/SKILL.md', '.claude/skills/vc-gone2/mine.md']) {
      assert.ok(!plan.toDelete.includes(p) && plan.toPreserve.includes(p), `one extra user file keeps the whole entry: ${p}`);
      assert.ok(warned(plan, p, 'not in the old install snapshot'), `reported: ${p}`);
    }
  } finally { t.cleanup(); }
});

test('existing behaviour outside the gate is unchanged (old hook removed, non-kit file preserved)', () => {
  const t = setup();
  try {
    const plan = planJson(t.proj, t.kit);
    assert.ok(plan.toDelete.includes('.claude/hooks/old-hook.cjs'));
    assert.ok(plan.toPreserve.includes('src/app.js') && !plan.toDelete.includes('src/app.js'));
    assert.ok(plan.toAdd.includes('.claude/skills/kit-skill/SKILL.md'));
  } finally { t.cleanup(); }
});

test('no install snapshot: every old-prefix and snapshot-gated path is kept and reported', () => {
  const t = setup({ snapshot: false });
  try {
    const plan = planJson(t.proj, t.kit);
    for (const p of ['.claude/skills/vc-old/SKILL.md', '.claude/agents/vc-old-agent.md', '.claude/skills/vc-gone/SKILL.md',
      'process/development-protocols/old-protocol.md']) {
      assert.ok(!plan.toDelete.includes(p) && plan.toPreserve.includes(p), `kept without a snapshot: ${p}`);
      assert.ok(warned(plan, p, 'no install snapshot'), `reported: ${p}`);
    }
  } finally { t.cleanup(); }
});

test('kit without legacy-hashes.json (older kit source): old-prefix paths are kept and reported', () => {
  const t = setup({ withHashes: false });
  try {
    const plan = planJson(t.proj, t.kit);
    for (const p of ['.claude/skills/vc-old/SKILL.md', '.claude/agents/vc-old-agent.md', '.claude/skills/vc-gone/ref.md']) {
      assert.ok(!plan.toDelete.includes(p) && plan.toPreserve.includes(p), `kept: ${p}`);
      assert.ok(warned(plan, p, 'legacy-hashes.json'), `reported: ${p}`);
    }
  } finally { t.cleanup(); }
});

test('a path the kit itself still ships is never treated as legacy', () => {
  const t = setup();
  try {
    write(t.kit, '.claude/skills/vc-old/SKILL.md', OLD['.claude/skills/vc-old/SKILL.md']);
    const plan = planJson(t.proj, t.kit);
    assert.ok(!plan.toDelete.includes('.claude/skills/vc-old/SKILL.md'), 'kit-shipped path is not deleted');
    assert.ok(plan.toDelete.includes('.claude/agents/vc-old-agent.md'), 'other legacy files are still decided by the gate');
  } finally { t.cleanup(); }
});

test('--legacy-gate (the install.sh interface) gives the same per-file decisions', () => {
  const t = setup();
  try {
    const input = ['.claude/skills/vc-renamed/SKILL.md', '.claude/skills/vc-mod', '.claude/skills/vc-gone2', '.claude/hooks/old-hook.cjs'].join('\n');
    const r = spawnSync(process.execPath, [CSP, '--legacy-gate', '--root', t.proj, '--kit-root', t.kit], { input, encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    const lines = r.stdout.trim().split('\n').map((l) => l.split('\t'));
    const has = (c, d, f) => lines.some((l) => l[0] === c && l[1] === d && l[2] === f);
    assert.ok(has('.claude/skills/vc-renamed/SKILL.md', 'DELETE', '.claude/skills/vc-renamed/SKILL.md'));
    assert.ok(has('.claude/skills/vc-mod', 'KEEP', '.claude/skills/vc-mod/SKILL.md'));
    assert.ok(has('.claude/skills/vc-gone2', 'KEEP', '.claude/skills/vc-gone2/mine.md'));
    assert.ok(has('.claude/hooks/old-hook.cjs', 'UNGATED', '.claude/hooks/old-hook.cjs'));
    assert.ok(!lines.some((l) => l[1] === 'DELETE' && (l[2].startsWith('.claude/skills/vc-mod') || l[2].startsWith('.claude/skills/vc-gone2'))));
  } finally { t.cleanup(); }
});

test('--apply removes only proven files, prunes empty folders and migrates the state files', () => {
  const t = setup();
  try {
    execFileSync(process.execPath, [CSP, '--root', t.proj, '--kit-root', t.kit, '--apply'], { encoding: 'utf8', stdio: 'pipe' });
    const exists = (p) => fs.existsSync(path.join(t.proj, p));
    for (const p of ['.claude/skills/vc-old/SKILL.md', '.claude/agents/vc-old-agent.md', '.claude/skills/vc-gone']) assert.ok(!exists(p), `removed: ${p}`);
    for (const p of ['.claude/skills/vc-old/notes.md', '.claude/skills/vc-mod/SKILL.md', '.claude/skills/vc-gone2/mine.md',
      '.claude/skills/my-skill/SKILL.md', '.claude/skills/vc-custom/SKILL.md', 'src/app.js', '.claude/skills/kit-skill/SKILL.md']) {
      assert.ok(exists(p), `kept or added: ${p}`);
    }
    assert.equal(fs.readFileSync(path.join(t.proj, VERSION_FILE), 'utf8').trim(), '1.0.0');
    assert.ok(exists(SNAPSHOT_FILE));
    if (SNAPSHOT_FILE !== OLD_SNAPSHOT_FILE) { // after the prefix rename: old state files are migrated away
      assert.ok(!exists(OLD_SNAPSHOT_FILE) && !exists(OLD_VERSION_FILE), 'old state files removed after the new ones were written');
    }
  } finally { t.cleanup(); }
});

test('the new snapshot name wins over the old one when both exist', () => {
  if (SNAPSHOT_FILE === OLD_SNAPSHOT_FILE) return; // before the prefix rename both names are the same file
  const t = setup();
  try {
    write(t.proj, SNAPSHOT_FILE, '.claude/skills/vc-gone/SKILL.md\n'); // vc-gone/ref.md is no longer covered
    const plan = planJson(t.proj, t.kit);
    assert.ok(plan.toPreserve.includes('.claude/skills/vc-gone/ref.md'), 'the new snapshot decides the snapshot gate');
    assert.ok(!plan.toDelete.includes('.claude/skills/vc-gone/SKILL.md'));
  } finally { t.cleanup(); }
});
