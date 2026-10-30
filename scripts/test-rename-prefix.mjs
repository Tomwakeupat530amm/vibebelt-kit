#!/usr/bin/env node
/**
 * scripts/test-rename-prefix.mjs - fixture tests for scripts/rename-prefix.mjs.
 * Run: node scripts/test-rename-prefix.mjs   (exit 0 = all pass)
 *
 * Each test copies scripts/fixtures/rename-prefix/in into a throwaway git repo under os.tmpdir(),
 * adds the run-time-only fixtures (a symlink to a file outside the root, a symlink to an outside
 * folder, a task-folder note), commits, and runs the tool with --root on that copy. The expected
 * result is the hand-written tree scripts/fixtures/rename-prefix/out. The real repo is never written.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOOL = path.join(REPO, 'scripts', 'rename-prefix.mjs');
const FIX = path.join(REPO, 'scripts', 'fixtures', 'rename-prefix');
const TASK_NOTE = 'process/general-plans/active/vibebelt-rebrand_29-10-26/note.md';
const RUNTIME_ONLY = new Set(['link-out', 'dir-out', 'process']);
const GIT_ENV = {
  ...process.env,
  GIT_AUTHOR_NAME: 'fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
  GIT_COMMITTER_NAME: 'fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
};

const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const git = (root, args) => execFileSync('git', args, { cwd: root, env: GIT_ENV, encoding: 'utf8' });
const commitAll = (root, msg) => {
  git(root, ['add', '-A']);
  git(root, ['-c', 'commit.gpgsign=false', 'commit', '-q', '--no-verify', '--allow-empty', '-m', msg]);
};
const tool = (root, ...args) => spawnSync(process.execPath, [TOOL, ...args, '--root', root], { encoding: 'utf8' });
const lastLine = (s) => s.trim().split('\n').pop();

function makeCopy() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'rename-prefix-test-'));
  const root = path.join(base, 'repo');
  const outside = path.join(base, 'outside');
  fs.cpSync(path.join(FIX, 'in'), root, { recursive: true });
  fs.mkdirSync(path.join(outside, 'dir'), { recursive: true });
  fs.writeFileSync(path.join(outside, 'outside.md'), 'vc-outside text must stay\n');
  fs.writeFileSync(path.join(outside, 'dir', 'vc-inside.md'), 'vc-inside stays\n');
  fs.symlinkSync(path.join(outside, 'outside.md'), path.join(root, 'link-out'));
  fs.symlinkSync(path.join(outside, 'dir'), path.join(root, 'dir-out'));
  fs.mkdirSync(path.dirname(path.join(root, TASK_NOTE)), { recursive: true });
  fs.writeFileSync(path.join(root, TASK_NOTE), 'task folder note: vc-scout stays\n');
  git(root, ['init', '-q']);
  commitAll(root, 'fixture');
  return { base, root, outside, cleanup: () => fs.rmSync(base, { recursive: true, force: true }) };
}

// Every entry under root (files hashed, symlinks with their target), .git excluded.
function snapshot(root, skipTop = new Set()) {
  const out = new Map();
  (function walk(rel) {
    for (const d of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
      const r = rel ? `${rel}/${d.name}` : d.name;
      if (r === '.git' || (!rel && skipTop.has(d.name))) continue;
      const abs = path.join(root, r);
      if (d.isSymbolicLink()) out.set(r, `link ${fs.readlinkSync(abs)}`);
      else if (d.isDirectory()) walk(r);
      else out.set(r, `file ${sha(fs.readFileSync(abs))}`);
    }
  })('');
  return out;
}

function census(root, files, prefix) {
  const counts = new Map();
  const re = new RegExp(`${prefix}-[A-Z-]*`, 'g');
  for (const f of files) {
    for (const m of fs.readFileSync(path.join(root, f), 'latin1').match(re) || []) counts.set(m, (counts.get(m) || 0) + 1);
  }
  return counts;
}

const read = (root, rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('dry-run writes nothing and reports the planned counts', () => {
  const c = makeCopy();
  try {
    const before = snapshot(c.root);
    const r = tool(c.root, '--dry-run');
    assert.equal(r.status, 0, r.stderr);
    assert.equal(lastLine(r.stdout), 'RESULT edits=12 renames=10');
    assert.match(r.stdout, /^RULES .*author=3$/m, 'author rule reports a non-zero count');
    assert.deepEqual(snapshot(c.root), before, 'dry-run must not write');
  } finally { c.cleanup(); }
});

test('apply matches the expected tree and a second apply is a no-op', () => {
  const c = makeCopy();
  try {
    const r = tool(c.root, '--apply');
    assert.equal(r.status, 0, r.stderr);
    assert.equal(lastLine(r.stdout), 'RESULT edits=12 renames=10');
    assert.deepEqual(snapshot(c.root, RUNTIME_ONLY), snapshot(path.join(FIX, 'out')), 'applied tree equals out/');
    commitAll(c.root, 'applied');
    const again = tool(c.root, '--apply');
    assert.equal(again.status, 0, again.stderr);
    assert.equal(lastLine(again.stdout), 'RESULT edits=0 renames=0');
  } finally { c.cleanup(); }
});

test('protection mechanisms and stray forms behave as decided', () => {
  const c = makeCopy();
  try {
    assert.equal(tool(c.root, '--apply').status, 0);
    const keep = [
      ['vb-manifest.json', '".claude/skills/vc-team",'], // legacyDeletions values (JSON state machine)
      ['vb-manifest.json', '".claude/skills/vb-agent-browser/scripts/package-lock.json"'], // same file, other strings renamed
      ['docs/protected-lines.md', 'when .vb-version is missing. <!-- legacy-vc-fallback -->'], // tagged line
      ['docs/protected-lines.md', 'This old name stays: vc-team and .vc-version and VC_KIT_SOURCE.'], // keep-region
      ['.gitignore', '.vc-keep-old'], ['.gitignore', '.claude/skills/vb-agent-browser/screenshots/'],
      ['CHANGELOG.md', 'VC-PREDICT-DEEP-NEEDED'], ['MIGRATION.md', 'vc-manifest.json'], // whole-file protection
      ['.claude/skills/vb-scout/SKILL.md', 'vc:plan and vc:cook'], ['.claude/skills/vb-scout/SKILL.md', 'The VC harness prose'],
      ['.claude/skills/vb-scout/SKILL.md', 'vcTeamDir and hasVcSkills'],
      ['.claude/skills/vb-scout/references/vb-scout-notes.md', 'dvc-tool and abcvc-x and MVC-pattern and XVC_FLAG'],
      ['.claude/skills/vb-scout/references/vb-scout-notes.md', '\\nvb-update-process-agent'],
      ['.claude/skills/vb-scout/references/vb-scout-notes.md', '_vb-validate-agent and my-custom-vb-tool and non-vb-thing'],
      ['.claude/agents/vb-tester.md', '`vb plan check <id>` = done | `vb plan uncheck <id>` = revert | bare `vc` stays'],
      ['.claude/agents/vb-tester.md', 'VB_KIT_SOURCE and VB_USAGE_CACHE_PATH'], ['.claude/agents/vb-tester.md', '.claude/.vb.json'],
      ['.claude/agents/vb-tester.md', 'PHASE_COMPLETE: EXECUTE and Gate: PASS'],
      ['docs/author-lines.md', 'author: vibebelt-kit\n  author: vibebelt-kit\n  author: claudekit\n  author: vibecode\nauthor: someone-else\n'],
      ['docs/author-lines.md', 'named vibecode-pro-max-kit (prose stays)'],
    ];
    for (const [file, text] of keep) assert.ok(read(c.root, file).includes(text), `${file} should contain ${JSON.stringify(text)}`);
    assert.equal(fs.readFileSync(path.join(c.root, 'data/nul-sample.bin')).toString('latin1'), 'vc-tool\0binary vc-data\n');
    assert.equal(read(c.root, TASK_NOTE), 'task folder note: vc-scout stays\n');
  } finally { c.cleanup(); }
});

test('the four uppercase signals map to VB- one to one', () => {
  const c = makeCopy();
  try {
    const scan = (root) => tool(root, '--list-scan-files').stdout.trim().split('\n');
    const before = census(c.root, scan(c.root), 'VC');
    assert.equal(census(c.root, scan(c.root), 'VB').size, 0, 'no VB- token before the apply');
    assert.equal(tool(c.root, '--apply').status, 0);
    const after = census(c.root, scan(c.root), 'VB');
    const residual = census(c.root, scan(c.root), 'VC');
    for (const s of ['PREDICT-DEEP-NEEDED', 'FEASIBILITY-PROBE-NEEDED', 'PREDICT-RESEARCH-COMPLETE', 'FEASIBILITY-VERDICT-READY']) {
      assert.equal(after.get(`VB-${s}`), before.get(`VC-${s}`), `VC-${s} maps 1:1`);
      assert.equal(before.get(`VC-${s}`), 1);
    }
    assert.deepEqual([...residual], [['VC-', 1]], 'only the deny-listed MVC- token keeps VC-');
    const mapped = new Map();
    for (const [k, v] of before) mapped.set(k.replace(/^VC-/, 'VB-'), v);
    for (const [k, v] of after) assert.equal(v + (residual.get(k.replace(/^VB-/, 'VC-')) || 0), mapped.get(k), `census ${k}`);
  } finally { c.cleanup(); }
});

test('refuses a dirty tree and writes nothing; task-folder files do not count as dirty', () => {
  const c = makeCopy();
  try {
    fs.writeFileSync(path.join(c.root, 'untracked-note.txt'), 'vc-dirty\n');
    let before = snapshot(c.root);
    let r = tool(c.root, '--apply');
    assert.equal(r.status, 3);
    assert.match(r.stderr, /REFUSED/);
    assert.deepEqual(snapshot(c.root), before, 'refused apply must not write');
    fs.rmSync(path.join(c.root, 'untracked-note.txt'));
    fs.appendFileSync(path.join(c.root, 'docs/author-lines.md'), 'tracked edit\n');
    before = snapshot(c.root);
    assert.equal(tool(c.root, '--apply').status, 3, 'a modified tracked file is dirty too');
    assert.deepEqual(snapshot(c.root), before);
    git(c.root, ['checkout', '--', 'docs/author-lines.md']);
    fs.writeFileSync(path.join(c.root, path.dirname(TASK_NOTE), 'report.md'), 'vc-report in the task folder\n');
    r = tool(c.root, '--apply');
    assert.equal(r.status, 0, r.stderr);
    assert.equal(read(c.root, path.join(path.dirname(TASK_NOTE), 'report.md')), 'vc-report in the task folder\n');
  } finally { c.cleanup(); }
});

test('never follows symlinks and never touches files outside the root', () => {
  const c = makeCopy();
  try {
    const listed = tool(c.root, '--list-scan-files').stdout.split('\n');
    assert.ok(!listed.some((l) => l === 'link-out' || l.startsWith('dir-out')), 'symlinks are not scanned');
    assert.equal(tool(c.root, '--apply').status, 0);
    assert.equal(fs.readlinkSync(path.join(c.root, 'link-out')), path.join(c.outside, 'outside.md'));
    assert.equal(fs.readlinkSync(path.join(c.root, 'dir-out')), path.join(c.outside, 'dir'));
    assert.equal(fs.readFileSync(path.join(c.outside, 'outside.md'), 'utf8'), 'vc-outside text must stay\n');
    assert.deepEqual(fs.readdirSync(path.join(c.outside, 'dir')), ['vc-inside.md']);
    assert.equal(fs.readFileSync(path.join(c.outside, 'dir', 'vc-inside.md'), 'utf8'), 'vc-inside stays\n');
    assert.equal(tool(path.join(c.root, 'link-out'), '--dry-run').status, 2, '--root must be a directory');
  } finally { c.cleanup(); }
});

test('--list-scan-files lists only non-protected text files, sorted, and skips missing paths', () => {
  const c = makeCopy();
  try {
    const r = tool(c.root, '--list-scan-files');
    assert.equal(r.status, 0, r.stderr);
    const listed = r.stdout.trim().split('\n');
    const sorted = [...listed].sort((a, b) => Buffer.compare(Buffer.from(a), Buffer.from(b)));
    assert.deepEqual(listed, sorted, 'byte-order (LC_ALL=C) sorted');
    for (const bad of ['vibebelt-rebrand_29-10-26', '.git/', 'CHANGELOG.md', 'MIGRATION.md', 'data/nul-sample.bin', 'screenshots/shot.png', '\\']) {
      assert.ok(!listed.some((l) => l.includes(bad)), `must not list ${bad}`);
    }
    for (const good of ['.gitignore', '.claude/agents/vc-tester.md', 'vc-manifest.json', '.vc-version']) assert.ok(listed.includes(good), `lists ${good}`);
    fs.rmSync(path.join(c.root, '.claude/agents/vc-tester.md')); // tracked but missing on disk (R-w)
    const again = tool(c.root, '--list-scan-files');
    assert.equal(again.status, 0, again.stderr);
    assert.ok(!again.stdout.split('\n').includes('.claude/agents/vc-tester.md'));
  } finally { c.cleanup(); }
});

test('ignored screenshots move with their renamed folder and stay ignored and untracked', () => {
  const c = makeCopy();
  try {
    assert.equal(git(c.root, ['status', '--porcelain']).trim(), '', 'shot.png is ignored before the apply');
    assert.equal(tool(c.root, '--apply').status, 0);
    const moved = '.claude/skills/vb-agent-browser/screenshots/shot.png';
    assert.ok(fs.existsSync(path.join(c.root, moved)));
    assert.ok(!fs.existsSync(path.join(c.root, '.claude/skills/vc-agent-browser')));
    assert.match(read(c.root, moved), /vc-unchanged/, 'ignored files are moved, never edited');
    assert.equal(spawnSync('git', ['check-ignore', '-q', moved], { cwd: c.root }).status, 0, 'still ignored');
    assert.ok(!git(c.root, ['status', '--porcelain']).includes('shot.png'), 'no new untracked screenshot');
  } finally { c.cleanup(); }
});

test('stops before writing on an unterminated keep-region', () => {
  const c = makeCopy();
  try {
    fs.appendFileSync(path.join(c.root, 'docs/author-lines.md'), '<!-- rename-prefix:keep:start -->\nvc-open\n');
    commitAll(c.root, 'open region');
    const before = snapshot(c.root);
    const r = tool(c.root, '--apply');
    assert.equal(r.status, 4);
    assert.match(r.stderr, /never closed/);
    assert.deepEqual(snapshot(c.root), before);
  } finally { c.cleanup(); }
});

test('--print-protected names the five protection mechanisms', () => {
  const r = spawnSync(process.execPath, [TOOL, '--print-protected'], { encoding: 'utf8' });
  assert.equal(r.status, 0);
  for (const s of ['vibebelt-rebrand_29-10-26', 'scripts/fixtures/rename-prefix/', 'CHANGELOG.md', 'MIGRATION.md', 'legacy-hashes.json',
    'legacyDeletions', 'legacy-vc-fallback', 'rename-prefix:keep:start', 'NUL byte', 'symlinks']) {
    assert.ok(r.stdout.includes(s), `--print-protected mentions ${s}`);
  }
});
