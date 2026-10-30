// Unit tests for golden/gen-guardrails.mjs (vibebelt-rebrand Phase 3, Step B1).
// Run by explicit path from the repo root:
//   node --test process/general-plans/active/vibebelt-rebrand_29-10-26/golden/test/gen-guardrails.test.mjs
// CRLF variants and broken copies are built in memory under os.tmpdir() (E8), never committed.
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
const SCRIPT = path.join(GOLDEN, 'gen-guardrails.mjs');
const FIXTURE = path.join(HERE, 'fixtures', 'guardrails');
const MD_REL = '.claude/agents/vc-alpha.md';
const TOML_REL = '.codex/agents/vc-alpha.toml';

const sha = (text) => crypto.createHash('sha256').update(text, 'utf8').digest('hex');
const lines = (...parts) => parts.join('\n');

const SESSION = lines('### Session Start — FIRST ACTIONS', '', '1. Read the plan.', '2. Load the context.');
const PURPOSE = lines('## Purpose', '', 'Alpha checks the heading rules.', '', SESSION);
const PHASE_LOCK = lines('## Phase Lock', '', 'Only plan files may change.');
const COMPLETION = lines(
  '## Completion',
  '',
  'Report the result.',
  '',
  '```markdown',
  '## Purpose',
  'This heading sits inside a backtick fence: never a heading, never the end of a section.',
  '```',
  '',
  '~~~text',
  '### Status Reporting',
  'Inside a tilde fence: not a heading either.',
  '~~~',
  '',
  'End of the completion rules.',
);
const AUTONOMOUS = lines('## Autonomous /goal Execution Rules', '', 'Proceed without asking.');
const STATUS = lines('## Status Reporting', '', 'Line one', 'Line two continues here.');
const TOML_PURPOSE = lines('## Purpose', '', 'Alpha checks the heading rules (Codex wording).');

const EXPECTED = {
  schema: 1,
  agents: {
    alpha: {
      md: [
        { heading: '## Purpose', level: 2, sha256: sha(PURPOSE) },
        { heading: '### Session Start — FIRST ACTIONS', level: 3, sha256: sha(SESSION) },
        { heading: '## Phase Lock', level: 2, sha256: sha(PHASE_LOCK) },
        { heading: '## Completion', level: 2, sha256: sha(COMPLETION) },
        { heading: '## Autonomous /goal Execution Rules', level: 2, sha256: sha(AUTONOMOUS) },
        { heading: '## Status Reporting', level: 2, sha256: sha(STATUS) },
      ],
      toml: [
        { heading: '## Purpose', level: 2, sha256: sha(TOML_PURPOSE) },
        { heading: '## Status Reporting', level: 2, sha256: sha(STATUS) },
      ],
    },
  },
};
const EXPECTED_TEXT = `${JSON.stringify(EXPECTED, null, 2)}\n`;

function guardrails(args, options = {}) {
  return spawnSync(process.execPath, [SCRIPT, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  });
}

function fixtureFiles() {
  return Object.fromEntries(
    [MD_REL, TOML_REL].map((rel) => [rel, fs.readFileSync(path.join(FIXTURE, rel), 'utf8')]),
  );
}

function withTree(files, fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'p3-guardrails-test-'));
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

function listTree(root) {
  return fs.readdirSync(root, { recursive: true }).map(String).sort();
}

test('should hash selected guardrail sections deterministically with fences ignored and decoded toml escapes', () => {
  const first = guardrails(['--root', FIXTURE]);
  assert.equal(first.status, 0, first.stderr);
  assert.equal(first.stderr, '');
  assert.equal(first.stdout, EXPECTED_TEXT);
  const second = guardrails(['--root', FIXTURE]);
  assert.equal(second.stdout, first.stdout, 'two runs must be byte-identical');
});

test('heading rules: EQUALS for Phase Lock and Completion, prefix rule for the rest, fenced lines ignored', () => {
  const out = JSON.parse(guardrails(['--root', FIXTURE]).stdout);
  const headings = out.agents.alpha.md.map((e) => e.heading);
  assert.deepEqual(headings, [
    '## Purpose',
    '### Session Start — FIRST ACTIONS',
    '## Phase Lock',
    '## Completion',
    '## Autonomous /goal Execution Rules',
    '## Status Reporting',
  ]);
  assert.equal(headings.includes('## Phase Lock Enforcement'), false);
  assert.equal(headings.includes('## Completion and Phase Handoff'), false);
  assert.equal(headings.filter((h) => h === '## Purpose').length, 1, 'the fenced ## Purpose is not a heading');
});

test('a level-2 section includes its level-3 child; editing the child changes both hashes only', () => {
  const files = fixtureFiles();
  const edited = { ...files, [MD_REL]: files[MD_REL].replace('2. Load the context.', '2. Load the context first.') };
  withTree(edited, (root) => {
    const before = JSON.parse(guardrails(['--root', FIXTURE]).stdout).agents.alpha.md;
    const after = JSON.parse(guardrails(['--root', root]).stdout).agents.alpha.md;
    const changed = before.filter((e, i) => e.sha256 !== after[i].sha256).map((e) => e.heading);
    assert.deepEqual(changed, ['## Purpose', '### Session Start — FIRST ACTIONS']);
  });
});

test('toml developer_instructions are decoded: a \\n escape and a line-ending backslash hash like the decoded text', () => {
  const out = JSON.parse(guardrails(['--root', FIXTURE]).stdout).agents.alpha;
  const mdStatus = out.md.find((e) => e.heading === '## Status Reporting');
  const tomlStatus = out.toml.find((e) => e.heading === '## Status Reporting');
  assert.equal(tomlStatus.sha256, mdStatus.sha256);
  assert.equal(tomlStatus.sha256, sha(STATUS));
  const mdPurpose = out.md.find((e) => e.heading === '## Purpose');
  const tomlPurpose = out.toml.find((e) => e.heading === '## Purpose');
  assert.notEqual(tomlPurpose.sha256, mdPurpose.sha256, 'md and toml are hashed independently');
});

test('the other TOML 1.0 escapes decode exactly', () => {
  const decoded = 'Café \u{1F600} "quoted" back\\slash tab\there bell\bform\ffeed';
  const files = {
    '.claude/agents/vc-esc.md': `## Purpose\n\n${decoded}\n`,
    '.codex/agents/vc-esc.toml':
      'developer_instructions = """\n## Purpose\n\nCaf\\u00e9 \\U0001F600 \\"quoted\\" back\\\\slash tab\\there bell\\bform\\ffeed\n"""\n',
  };
  withTree(files, (root) => {
    const r = guardrails(['--root', root]);
    assert.equal(r.status, 0, r.stderr);
    const out = JSON.parse(r.stdout).agents.esc;
    assert.equal(out.toml[0].sha256, out.md[0].sha256);
    assert.equal(out.md[0].sha256, sha(`## Purpose\n\n${decoded}`));
  });
});

test('CRLF and LF variants give the same hashes (CRLF copy built in memory)', () => {
  const crlf = Object.fromEntries(
    Object.entries(fixtureFiles()).map(([rel, text]) => [rel, text.replace(/\n/g, '\r\n')]),
  );
  withTree(crlf, (root) => {
    const r = guardrails(['--root', root]);
    assert.equal(r.status, 0, r.stderr);
    assert.equal(r.stdout, EXPECTED_TEXT);
  });
});

test('should exit 1 with file and line on an invalid toml escape', () => {
  const files = fixtureFiles();
  assert.ok(files[TOML_REL].split('\n')[10].includes('Line one\\nLine two'), 'fixture line 11 holds the \\n escape');
  const broken = { ...files, [TOML_REL]: files[TOML_REL].replace('Line one\\nLine two', 'Line one\\qLine two') };
  withTree(broken, (root) => {
    const r = guardrails(['--root', root]);
    assert.equal(r.status, 1);
    assert.equal(r.stdout, '');
    assert.match(r.stderr, /vc-alpha\.toml:11:/);
    assert.match(r.stderr, /invalid escape/);
  });
});

test('bad \\u and \\U code points and non-TOML-1.0 escapes exit 1', () => {
  for (const bad of ['\\uD800', '\\U00110000', '\\u12G4', '\\x41', '\\e', '\\ x']) {
    const files = { '.codex/agents/vc-bad.toml': `developer_instructions = """\n## Purpose\n\nvalue ${bad} end\n"""\n` };
    withTree(files, (root) => {
      const r = guardrails(['--root', root]);
      assert.equal(r.status, 1, `escape ${bad} must be rejected`);
      assert.match(r.stderr, /vc-bad\.toml:4:/);
    });
  }
});

test('unreadable developer_instructions forms exit 1 (never guessed)', () => {
  const cases = {
    missing: 'name = "vc-x"\n',
    singleLine: 'developer_instructions = "## Purpose"\n',
    unterminated: 'developer_instructions = """\n## Purpose\n\nno closing delimiter\n',
  };
  for (const [label, text] of Object.entries(cases)) {
    withTree({ '.codex/agents/vc-x.toml': text }, (root) => {
      const r = guardrails(['--root', root]);
      assert.equal(r.status, 1, `${label}: ${r.stderr}`);
      assert.match(r.stderr, /vc-x\.toml/);
      assert.equal(r.stdout, '');
    });
  }
});

test('--out writes the file and leaves stdout empty', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p3-guardrails-out-'));
  try {
    const out = path.join(tmp, 'nested', 'guardrails.json');
    const r = guardrails(['--root', FIXTURE, '--out', out]);
    assert.equal(r.status, 0, r.stderr);
    assert.equal(r.stdout, '');
    assert.equal(fs.readFileSync(out, 'utf8'), EXPECTED_TEXT);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('without --out it prints to stdout and writes no file (never guardrails.json implicitly)', () => {
  const real = path.join(GOLDEN, 'guardrails.json');
  const before = fs.existsSync(real) ? fs.readFileSync(real, 'utf8') : null;
  withTree(fixtureFiles(), (root) => {
    const listing = listTree(root);
    const r = guardrails([], { cwd: root });
    assert.equal(r.status, 0, r.stderr);
    assert.equal(r.stdout, EXPECTED_TEXT);
    assert.deepEqual(listTree(root), listing);
  });
  const after = fs.existsSync(real) ? fs.readFileSync(real, 'utf8') : null;
  assert.equal(after, before);
});

test('every agent key from the directory listing is emitted, with empty lists when nothing is selected', () => {
  const files = {
    '.claude/agents/vc-none.md': '# None\n\n## Notes\n\nNothing selected here.\n',
    '.codex/agents/vc-none.toml': 'developer_instructions = """\n## Notes\n\nNothing selected.\n"""\n',
    '.claude/agents/vb-solo.md': '## Purpose\n\nSolo.\n',
  };
  withTree(files, (root) => {
    const r = guardrails(['--root', root]);
    assert.equal(r.status, 0, r.stderr);
    assert.deepEqual(JSON.parse(r.stdout), {
      schema: 1,
      agents: {
        none: { md: [], toml: [] },
        solo: { md: [{ heading: '## Purpose', level: 2, sha256: sha('## Purpose\n\nSolo.') }], toml: [] },
      },
    });
  });
});

test('usage errors exit 2', () => {
  for (const args of [['--bogus'], ['--out'], ['positional'], ['--root', path.join(FIXTURE, 'missing-dir')]]) {
    const r = guardrails(args);
    assert.equal(r.status, 2, `args ${JSON.stringify(args)}: ${r.stderr}`);
    assert.equal(r.stdout, '');
  }
});
