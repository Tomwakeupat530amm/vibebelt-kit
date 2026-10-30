// Unit tests for golden/run-record.mjs (vibebelt-rebrand Phase 3, Step C1). Fixture tests only:
// every test uses a temp sandbox and a temp runs dir (--runs-dir); golden/runs is never written.
// Run by explicit path from the repo root:
//   node --test process/general-plans/active/vibebelt-rebrand_29-10-26/golden/test/run-record.test.mjs
// This machine has no global git identity, so commits pass it on the command line.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GOLDEN = path.join(HERE, '..');
const SCRIPT = path.join(GOLDEN, 'run-record.mjs');
const STREAM = path.join(HERE, 'fixtures', 'stream', 'sample.jsonl');
const IDENTITY = ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false'];

function cleanEnv() {
  const env = { ...process.env };
  for (const name of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR']) delete env[name];
  return env;
}

function git(cwd, args) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: cleanEnv() });
  assert.equal(r.status, 0, `git ${args.join(' ')}: ${r.stderr}`);
  return r.stdout.trim();
}

function recorder(args) {
  return spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

const sha = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

function makeSandbox() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'p3-run-record-sandbox-'));
  const files = {
    '.claude/agents/vc-x.md': '---\nname: vc-x\n---\n\n## Purpose\n\nFake agent.\n',
    '.codex/agents/vc-x.toml': 'developer_instructions = """\n## Purpose\n\nFake agent.\n"""\nname = "vc-x"\n',
    '.claude/agents/sub/ignored.md': 'subfolders are not agent files\n',
    '.claude/agents/notes.txt': 'other extensions are not agent files\n',
  };
  for (const [rel, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), text);
  }
  git(root, ['init', '-q']);
  git(root, ['add', '-A']);
  git(root, [...IDENTITY, 'commit', '-q', '-m', 'fixture']);
  return root;
}

function withSandbox(fn) {
  const sandbox = makeSandbox();
  const runsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p3-run-record-runs-'));
  try {
    return fn(sandbox, runsDir);
  } finally {
    fs.rmSync(sandbox, { recursive: true, force: true });
    fs.rmSync(runsDir, { recursive: true, force: true });
  }
}

function uniqueRunId() {
  return `p3-test-${process.pid}-${crypto.randomBytes(4).toString('hex')}`;
}

test('should record, verify and parse subagent types for a sandbox without writing golden/runs', () => {
  withSandbox((sandbox, runsDir) => {
    const runId = uniqueRunId();
    const file = path.join(runsDir, `${runId}.json`);

    const rec = recorder(['record', sandbox, runId, '--runs-dir', runsDir]);
    assert.equal(rec.status, 0, rec.stderr);
    const record = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.deepEqual(Object.keys(record), ['run_id', 'sandbox_head', 'agents', 'runtime', 'recorded_at']);
    assert.equal(record.run_id, runId);
    assert.equal(record.sandbox_head, git(sandbox, ['rev-parse', 'HEAD']));
    assert.deepEqual(record.agents, {
      '.claude/agents/vc-x.md': sha(fs.readFileSync(path.join(sandbox, '.claude/agents/vc-x.md'))),
      '.codex/agents/vc-x.toml': sha(fs.readFileSync(path.join(sandbox, '.codex/agents/vc-x.toml'))),
    });
    assert.equal(record.runtime, process.version);
    assert.match(record.recorded_at, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    assert.equal(rec.stdout.includes(sandbox), false, 'no absolute sandbox path in the output');

    const bytes = fs.readFileSync(file);
    const again = recorder(['record', sandbox, runId, '--runs-dir', runsDir]);
    assert.equal(again.status, 1, 'an existing record is never overwritten');
    assert.match(again.stderr, /refus/);
    assert.deepEqual(fs.readFileSync(file), bytes);

    const ok = recorder(['verify', sandbox, runId, '--runs-dir', runsDir]);
    assert.equal(ok.status, 0, ok.stderr);

    const sub = recorder(['subagents', STREAM, runId, '--runs-dir', runsDir]);
    assert.equal(sub.status, 0, sub.stderr);
    const updated = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.deepEqual(updated.subagent_types, ['vc-execute-agent', 'vc-tester']);
    assert.equal(updated.subagent_parse, 'unverified-schema');
    for (const key of ['run_id', 'sandbox_head', 'agents', 'runtime', 'recorded_at']) {
      assert.deepEqual(updated[key], record[key], `${key} unchanged by subagents`);
    }
    assert.equal(recorder(['verify', sandbox, runId, '--runs-dir', runsDir]).status, 0);

    const twice = recorder(['subagents', STREAM, runId, '--runs-dir', runsDir]);
    assert.equal(twice.status, 1, 'subagent types are added once, never overwritten');

    assert.equal(fs.existsSync(path.join(GOLDEN, 'runs', `${runId}.json`)), false, 'golden/runs untouched');
  });
});

test('verify exits 1 when an agent file changes, appears or disappears, or when HEAD moves', () => {
  withSandbox((sandbox, runsDir) => {
    const runId = uniqueRunId();
    assert.equal(recorder(['record', sandbox, runId, '--runs-dir', runsDir]).status, 0);
    const verify = () => recorder(['verify', sandbox, runId, '--runs-dir', runsDir]);
    const md = path.join(sandbox, '.claude/agents/vc-x.md');
    const toml = path.join(sandbox, '.codex/agents/vc-x.toml');
    const original = fs.readFileSync(md);
    const originalToml = fs.readFileSync(toml);

    fs.appendFileSync(md, 'edited\n');
    let r = verify();
    assert.equal(r.status, 1);
    assert.match(r.stderr, /changed: \.claude\/agents\/vc-x\.md/);
    fs.writeFileSync(md, original);
    assert.equal(verify().status, 0);

    fs.writeFileSync(path.join(sandbox, '.claude/agents/vc-new.md'), 'new agent\n');
    r = verify();
    assert.equal(r.status, 1);
    assert.match(r.stderr, /added: \.claude\/agents\/vc-new\.md/);
    fs.rmSync(path.join(sandbox, '.claude/agents/vc-new.md'));
    assert.equal(verify().status, 0);

    fs.rmSync(toml);
    r = verify();
    assert.equal(r.status, 1);
    assert.match(r.stderr, /missing: \.codex\/agents\/vc-x\.toml/);
    fs.writeFileSync(toml, originalToml);
    assert.equal(verify().status, 0);

    git(sandbox, [...IDENTITY, 'commit', '-q', '--allow-empty', '-m', 'moves HEAD']);
    r = verify();
    assert.equal(r.status, 1);
    assert.match(r.stderr, /sandbox_head/);
  });
});

test('record refuses trees that cannot prove anything', () => {
  const runsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p3-run-record-runs-'));
  const plain = fs.mkdtempSync(path.join(os.tmpdir(), 'p3-run-record-plain-'));
  try {
    // not a git work tree
    fs.mkdirSync(path.join(plain, '.claude/agents'), { recursive: true });
    fs.writeFileSync(path.join(plain, '.claude/agents/vc-x.md'), 'x\n');
    assert.equal(recorder(['record', plain, uniqueRunId(), '--runs-dir', runsDir]).status, 1);
    withSandbox((sandbox) => {
      // a subfolder of a work tree is not the sandbox root, even when it holds agent files
      const nested = path.join(sandbox, 'nested');
      fs.mkdirSync(path.join(nested, '.claude/agents'), { recursive: true });
      fs.writeFileSync(path.join(nested, '.claude/agents/vc-y.md'), 'y\n');
      const sub = recorder(['record', nested, uniqueRunId(), '--runs-dir', runsDir]);
      assert.equal(sub.status, 1);
      assert.match(sub.stderr, /top level/);
      // a work tree without agent files
      fs.rmSync(path.join(sandbox, '.claude'), { recursive: true, force: true });
      fs.rmSync(path.join(sandbox, '.codex'), { recursive: true, force: true });
      assert.equal(recorder(['record', sandbox, uniqueRunId(), '--runs-dir', runsDir]).status, 1);
    });
    assert.deepEqual(fs.readdirSync(runsDir), [], 'no record was written');
  } finally {
    fs.rmSync(runsDir, { recursive: true, force: true });
    fs.rmSync(plain, { recursive: true, force: true });
  }
});

test('missing record or stream exits 1; usage errors exit 2', () => {
  withSandbox((sandbox, runsDir) => {
    const runId = uniqueRunId();
    assert.equal(recorder(['verify', sandbox, runId, '--runs-dir', runsDir]).status, 1);
    assert.equal(recorder(['subagents', STREAM, runId, '--runs-dir', runsDir]).status, 1);
    assert.equal(recorder(['record', sandbox, runId, '--runs-dir', runsDir]).status, 0);
    assert.equal(recorder(['subagents', path.join(runsDir, 'missing.jsonl'), runId, '--runs-dir', runsDir]).status, 1);
    const usage = [
      [],
      ['bogus', sandbox, runId],
      ['record', sandbox],
      ['record', sandbox, runId, 'extra'],
      ['record', sandbox, '../escape', '--runs-dir', runsDir],
      ['record', sandbox, 'has space', '--runs-dir', runsDir],
      ['record', path.join(sandbox, 'missing-dir'), uniqueRunId(), '--runs-dir', runsDir],
      ['record', sandbox, uniqueRunId(), '--runs-dir'],
      ['record', sandbox, uniqueRunId(), '--bogus', 'x'],
    ];
    for (const args of usage) {
      const r = recorder(args);
      assert.equal(r.status, 2, `args ${JSON.stringify(args)}: ${r.stderr}`);
    }
  });
});
