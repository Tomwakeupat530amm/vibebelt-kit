// Unit tests for golden/signal-census.mjs (vibebelt-rebrand Phase 3, Step A1).
// Run by explicit path from the repo root:
//   node --test process/general-plans/active/vibebelt-rebrand_29-10-26/golden/test/signal-census.test.mjs
// Temporary trees live under os.tmpdir() and are removed again; nothing is written into the repo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(HERE, '..', 'signal-census.mjs');
const FIXTURE = path.join(HERE, 'fixtures', 'census');

const EXPECTED = [
  'alpha\tmd\tgate\tGate: CONDITIONAL\t1',
  'alpha\tmd\tmode\t[MODE: PLAN]\t1',
  'alpha\tmd\tphase-complete\tPHASE_COMPLETE: PLAN\t2',
  'alpha\tmd\tphase-complete\tPHASE_COMPLETE: PLAN-SUPPLEMENT\t1',
  'alpha\tmd\tphase-complete\tPHASE_COMPLETE: UPDATE PROCESS\t1',
  'alpha\tmd\tprefix-signal\tVB-FEASIBILITY-VERDICT-READY\t1',
  'alpha\tmd\tprefix-signal\tVC-PREDICT-DEEP-NEEDED\t1',
  'alpha\tmd\tstatus\tBLOCKED\t1',
  'alpha\tmd\tstatus\tDONE_WITH_CONCERNS\t1',
  'alpha\tmd\tstatus\tNEEDS_CONTEXT\t1',
  'alpha\ttoml\tcolon-signal\tSPAWN_REQUEST:\t1',
  'alpha\ttoml\tstatus\tDONE\t1',
  'beta\tmd\tcolon-signal\tQUICK_FIX_ABORT:\t1',
  'beta\tmd\tprefix-signal\tVB-PREDICT-DEEP-NEEDED\t1',
  'beta\tmd\tprefix-signal\tVC-PREDICT-DEEP-NEEDED\t1',
  'beta\tmd\tstatus\tDONE\t1',
  'beta\tmd\tstatus\tNEEDS_CONTEXT\t1',
].join('\n') + '\n';

function census(args, options = {}) {
  return spawnSync(process.execPath, [SCRIPT, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  });
}

function rowsOf(stdout) {
  return stdout.split('\n').filter(Boolean).map((line) => {
    const [key, kind, cls, token, count] = line.split('\t');
    return { key, kind, cls, token, count: Number(count) };
  });
}

function total(rows, where) {
  return rows
    .filter((r) => Object.entries(where).every(([k, v]) => r[k] === v))
    .reduce((sum, r) => sum + r.count, 0);
}

function withTree(files, fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'p3-census-test-'));
  try {
    for (const [rel, text] of Object.entries(files)) {
      const file = path.join(root, rel);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, text);
    }
    return fn(root);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function fixtureFiles() {
  const rels = ['.claude/agents/vc-alpha.md', '.claude/agents/vb-beta.md', '.codex/agents/vc-alpha.toml'];
  return Object.fromEntries(rels.map((rel) => [rel, fs.readFileSync(path.join(FIXTURE, rel), 'utf8')]));
}

test('should census exact signal strings with counts, distinct PHASE_COMPLETE variants, toml SPAWN_REQUEST and no noise', () => {
  const r = census(['--root', FIXTURE]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stderr, '');
  assert.equal(r.stdout, EXPECTED);
});

test('PHASE_COMPLETE variants are three distinct tokens with counts 1/2/1 and never a colon-signal', () => {
  const rows = rowsOf(census(['--root', FIXTURE]).stdout);
  const pc = rows.filter((r) => r.cls === 'phase-complete');
  assert.deepEqual(pc.map((r) => [r.token, r.count]), [
    ['PHASE_COMPLETE: PLAN', 2],
    ['PHASE_COMPLETE: PLAN-SUPPLEMENT', 1],
    ['PHASE_COMPLETE: UPDATE PROCESS', 1],
  ]);
  assert.equal(rows.some((r) => r.token === 'PHASE_COMPLETE:'), false);
});

test('status codes have exact counts and BLOCKED-skipped adds nothing to BLOCKED', () => {
  const rows = rowsOf(census(['--root', FIXTURE]).stdout);
  assert.equal(total(rows, { key: 'alpha', kind: 'md', cls: 'status', token: 'DONE_WITH_CONCERNS' }), 1);
  assert.equal(total(rows, { key: 'alpha', kind: 'md', cls: 'status', token: 'NEEDS_CONTEXT' }), 1);
  assert.equal(total(rows, { key: 'alpha', kind: 'md', cls: 'status', token: 'BLOCKED' }), 1);
  assert.equal(rows.some((r) => r.token.startsWith('BLOCKED-')), false);
  // Differential check: dropping the BLOCKED-skipped line leaves the BLOCKED count unchanged.
  const text = fixtureFiles()['.claude/agents/vc-alpha.md'];
  const without = text.split('\n').filter((line) => !line.includes('BLOCKED-skipped')).join('\n');
  assert.notEqual(without, text);
  withTree({ '.claude/agents/vc-alpha.md': without }, (root) => {
    const r = census(['--root', root]);
    assert.equal(r.status, 0, r.stderr);
    assert.equal(total(rowsOf(r.stdout), { cls: 'status', token: 'BLOCKED' }), 1);
  });
});

test('colon-less VC- signal is found; a VB- signal with a colon is a prefix-signal only', () => {
  const rows = rowsOf(census(['--root', FIXTURE]).stdout);
  assert.equal(total(rows, { key: 'alpha', kind: 'md', cls: 'prefix-signal', token: 'VC-PREDICT-DEEP-NEEDED' }), 1);
  assert.equal(total(rows, { key: 'alpha', kind: 'md', cls: 'prefix-signal', token: 'VB-FEASIBILITY-VERDICT-READY' }), 1);
  assert.equal(rows.some((r) => r.cls === 'colon-signal' && /^V[CB]-/.test(r.token)), false);
});

test('SPAWN_REQUEST: is found for kind toml', () => {
  const rows = rowsOf(census(['--root', FIXTURE]).stdout);
  assert.deepEqual(
    rows.filter((r) => r.token === 'SPAWN_REQUEST:').map((r) => [r.key, r.kind, r.cls, r.count]),
    [['alpha', 'toml', 'colon-signal', 1]],
  );
});

test('Gate and MODE tokens are found', () => {
  const rows = rowsOf(census(['--root', FIXTURE]).stdout);
  assert.equal(total(rows, { key: 'alpha', kind: 'md', cls: 'gate', token: 'Gate: CONDITIONAL' }), 1);
  assert.equal(total(rows, { key: 'alpha', kind: 'md', cls: 'mode', token: '[MODE: PLAN]' }), 1);
});

test('noise tokens never appear', () => {
  const r = census(['--root', FIXTURE]);
  for (const noise of ['THIS:', 'SUMMARY:', 'MUST:', 'HIGH:']) {
    assert.equal(r.stdout.includes(noise), false, `${noise} must not be counted`);
  }
});

test('keys are prefix-stripped agent names', () => {
  const keys = [...new Set(rowsOf(census(['--root', FIXTURE]).stdout).map((r) => r.key))];
  assert.deepEqual(keys, ['alpha', 'beta']);
});

test('two runs give byte-identical output', () => {
  const a = census(['--root', FIXTURE]);
  const b = census(['--root', FIXTURE]);
  assert.equal(a.status, 0);
  assert.equal(a.stdout, b.stdout);
});

test('--neutral maps VC-/VB- to the same token and vc-/vb- inside tokens to v?-', () => {
  const r = census(['--root', FIXTURE, '--neutral']);
  assert.equal(r.status, 0, r.stderr);
  const rows = rowsOf(r.stdout);
  assert.deepEqual(
    rows.filter((x) => x.cls === 'prefix-signal').map((x) => [x.key, x.token, x.count]),
    [
      ['alpha', 'V?-FEASIBILITY-VERDICT-READY', 1],
      ['alpha', 'V?-PREDICT-DEEP-NEEDED', 1],
      ['beta', 'V?-PREDICT-DEEP-NEEDED', 2],
    ],
  );
  assert.equal(rows.some((x) => /^V[CB]-/.test(x.token)), false);
  withTree({ '.claude/agents/vc-m.md': '[MODE: vc-plan]\n[MODE: vb-plan]\n' }, (root) => {
    const plain = census(['--root', root]);
    assert.equal(plain.stdout, 'm\tmd\tmode\t[MODE: vb-plan]\t1\nm\tmd\tmode\t[MODE: vc-plan]\t1\n');
    const neutral = census(['--root', root, '--neutral']);
    assert.equal(neutral.stdout, 'm\tmd\tmode\t[MODE: v?-plan]\t2\n');
  });
});

test('--out writes the same bytes to the file and nothing to stdout', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p3-census-out-'));
  try {
    const out = path.join(tmp, 'nested', 'census.txt');
    const r = census(['--root', FIXTURE, '--out', out]);
    assert.equal(r.status, 0, r.stderr);
    assert.equal(r.stdout, '');
    assert.equal(fs.readFileSync(out, 'utf8'), EXPECTED);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('default root is the current directory', () => {
  const r = census([], { cwd: FIXTURE });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout, EXPECTED);
});

test('boundary rules: no letter, digit, _ or - directly before or after a token', () => {
  const md = [
    'XPHASE_COMPLETE: PLAN',
    'BLOCKED_REASON NOT_DONE DONE-ish NEEDS_CONTEXT (partial)',
    'Gate: PASSED and Gate: PASS',
    'xVC-PREDICT-DEEP-NEEDED and VC-PREDICT-RESEARCH-COMPLETE:',
    '[MODE: AUTOPILOT | <PHASE>]',
    'CONTEXT_PARTIAL: note',
    '',
  ].join('\n');
  withTree({ '.claude/agents/vc-t.md': md }, (root) => {
    const r = census(['--root', root]);
    assert.equal(r.status, 0, r.stderr);
    assert.equal(r.stdout, [
      't\tmd\tcolon-signal\tCONTEXT_PARTIAL:\t1',
      't\tmd\tcolon-signal\tXPHASE_COMPLETE:\t1',
      't\tmd\tgate\tGate: PASS\t1',
      't\tmd\tmode\t[MODE: AUTOPILOT | <PHASE>]\t1',
      't\tmd\tprefix-signal\tVC-PREDICT-RESEARCH-COMPLETE\t1',
      't\tmd\tstatus\tCONTEXT_PARTIAL\t1',
      't\tmd\tstatus\tNEEDS_CONTEXT\t1',
    ].join('\n') + '\n');
  });
});

test('lists only top-level regular .md files in .claude/agents and .toml files in .codex/agents', () => {
  const files = {
    '.claude/agents/vc-a.md': 'DONE\n',
    '.claude/agents/vb-d.md': 'DONE\n',
    '.claude/agents/sub/vc-b.md': 'DONE\n',
    '.claude/agents/notes.txt': 'DONE\n',
    '.codex/agents/vc-a.toml': 'developer_instructions = """\nDONE\n"""\n',
    '.codex/agents/vc-c.md': 'DONE\n',
  };
  withTree(files, (root) => {
    const r = census(['--root', root]);
    assert.equal(r.status, 0, r.stderr);
    assert.equal(r.stdout, 'a\tmd\tstatus\tDONE\t1\na\ttoml\tstatus\tDONE\t1\nd\tmd\tstatus\tDONE\t1\n');
  });
});

test('CRLF and LF files give the same census', () => {
  const crlf = Object.fromEntries(
    Object.entries(fixtureFiles()).map(([rel, text]) => [rel, text.replace(/\n/g, '\r\n')]),
  );
  withTree(crlf, (root) => {
    const r = census(['--root', root]);
    assert.equal(r.status, 0, r.stderr);
    assert.equal(r.stdout, EXPECTED);
  });
});

test('exit 1 when no agent file is found; exit 2 on usage errors', () => {
  withTree({ '.claude/agents/sub/vc-x.md': 'DONE\n' }, (root) => {
    const r = census(['--root', root]);
    assert.equal(r.status, 1);
    assert.equal(r.stdout, '');
    assert.match(r.stderr, /no agent files/);
  });
  for (const args of [['--bogus'], ['--root'], ['stray-positional'], ['--root', path.join(FIXTURE, 'does-not-exist')]]) {
    const r = census(args);
    assert.equal(r.status, 2, `args ${JSON.stringify(args)}: ${r.stderr}`);
    assert.equal(r.stdout, '');
  }
});
