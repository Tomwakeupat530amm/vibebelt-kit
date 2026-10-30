#!/usr/bin/env node
// p4-tools/census.mjs: signal / anchor / name census of the shared docs (vibebelt-rebrand Phase 4, step 0.2).
// Throw-away task-folder tool (C-CLEAN). Run from the repo root with Linux node 22.
//
// Usage:
//   node census.mjs --out <file>
//       Census of CLAUDE.md, AGENTS.md and every process/development-protocols/**/*.md.
//       One line per (file, token) with count >= 1: <file>\t<token>\t<count>, byte-order sorted.
//   node census.mjs --compare-agents <before> <after>
//       Compares the AGENTS.md rows of two census files. Exit 1 if a signal or anchor row
//       decreases (except the 3 allowed exact drops below), or if a skill:/agent: name row
//       that existed before is below 1 after. Exit 0 otherwise. Exit 2 on usage error.
//
// Row classes:
//   (a) signal tokens by regex, matched per line, token = the matched text (case-sensitive):
//       PHASE_COMPLETE[: A-Z-]*, Gate: (PASS|CONDITIONAL|BLOCKED), QUICK_FIX_ABORT, [MODE: ...],
//       ENTER [A-Z ]+ MODE, status codes DONE_WITH_CONCERNS|NEEDS_CONTEXT|BLOCKED|DONE (word
//       boundaries), @process/..., [Bb]ootstrap [Gg]uard, find process/(context|development-protocols)/ -type f
//   (b) the 10 rule anchors of the Phase 4 anchor matrix, case-insensitive fixed strings,
//       rows "anchor:<anchor>"
//   (c) skill names (directories of .claude/skills) and agent names (.claude/agents/*.md stems),
//       rows "skill:<name>" / "agent:<name>", counted with boundaries: no [A-Za-z0-9_-]
//       directly before or after the name.
// Prefix-neutral: file paths and tokens are written through the same mapping as the plan's sed
// (s/\bv[cb]-/v?-/g; s/\bV[CB]([-_])/V?\1/g); fixed strings (anchors, names) are matched on the
// mapped text, so the tool gives the same keys before and after the Phase 6 prefix rename.
import fs from 'node:fs';
import path from 'node:path';

const USAGE = 'usage: node census.mjs --out <file> | --compare-agents <before> <after>';

const SIGNAL_RES = [
  /PHASE_COMPLETE[: A-Z-]*/g,
  /Gate: (PASS|CONDITIONAL|BLOCKED)/g,
  /QUICK_FIX_ABORT/g,
  /\[MODE: [^\]]*\]/g,
  /ENTER [A-Z ]+ MODE/g,
  /\b(DONE_WITH_CONCERNS|NEEDS_CONTEXT|BLOCKED|DONE)\b/g,
  /@process\/[^ )`]*/g,
  /[Bb]ootstrap [Gg]uard/g,
  /find process\/(context|development-protocols)\/ -type f/g,
];

// The 10 core-rule anchors (anchor matrix, Phase 4 plan), case-insensitive fixed strings.
const ANCHORS = [
  'bootstrap guard',
  'find process/context/ -type f',
  'QUICK_FIX_ABORT',
  '/goal block',
  'Gate: PASS',
  'no inline execution',
  'commit branch policy',
  'vc-agent-strategy-compare',
  'Model Selection Policy',
  'communication-standards.md',
];

// Allowed AGENTS.md drops (exact token, exact before -> after counts), all inside the deleted Quick Start.
const ALLOWED_DROPS = new Map([
  ['ENTER EXECUTE MODE', [4, 2]],
  ['ENTER FAST MODE', [2, 1]],
  ['[MODE: ORCHESTRATOR]', [1, 0]],
]);

function neutral(s) {
  return s.replace(/\bv[cb]-/g, 'v?-').replace(/\bV[CB]([-_])/g, 'V?$1');
}

function byteSort(a, b) {
  return Buffer.compare(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));
}

function listMarkdown(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.posix.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listMarkdown(rel));
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(rel);
  }
  return out;
}

function countFixed(text, needle, bounded) {
  if (!needle) return 0;
  const edge = /[A-Za-z0-9_-]/;
  let count = 0;
  let from = 0;
  for (;;) {
    const idx = text.indexOf(needle, from);
    if (idx < 0) return count;
    const before = idx > 0 ? text[idx - 1] : '';
    const after = text[idx + needle.length] || '';
    if (!bounded || (!edge.test(before) && !edge.test(after))) {
      count += 1;
      from = idx + needle.length;
    } else {
      from = idx + 1;
    }
  }
}

function census() {
  for (const required of ['CLAUDE.md', 'AGENTS.md', 'process/development-protocols', '.claude/skills', '.claude/agents']) {
    if (!fs.existsSync(required)) throw new Error(`missing ${required} (run from the repo root)`);
  }
  const files = ['CLAUDE.md', 'AGENTS.md', ...listMarkdown('process/development-protocols')].sort(byteSort);
  const skills = fs.readdirSync('.claude/skills', { withFileTypes: true })
    .filter((e) => e.isDirectory()).map((e) => e.name).sort(byteSort);
  const agents = fs.readdirSync('.claude/agents', { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md')).map((e) => e.name.slice(0, -3)).sort(byteSort);
  if (skills.length === 0 || agents.length === 0) throw new Error('no skills or agents found');

  const rows = new Map();
  const add = (file, token, n) => {
    if (n <= 0) return;
    const key = `${neutral(file)}\t${neutral(token)}`;
    rows.set(key, (rows.get(key) || 0) + n);
  };

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    for (const line of text.split('\n')) {
      for (const re of SIGNAL_RES) {
        re.lastIndex = 0;
        for (const m of line.matchAll(re)) add(file, m[0], 1);
      }
    }
    const mapped = neutral(text);
    const lower = mapped.toLowerCase();
    for (const anchor of ANCHORS) add(file, `anchor:${anchor}`, countFixed(lower, neutral(anchor).toLowerCase(), false));
    for (const name of skills) add(file, `skill:${name}`, countFixed(mapped, neutral(name), true));
    for (const name of agents) add(file, `agent:${name}`, countFixed(mapped, neutral(name), true));
  }

  const lines = [...rows.entries()].map(([key, n]) => `${key}\t${n}`).sort(byteSort);
  return `${lines.join('\n')}\n`;
}

function parseCensus(file) {
  const map = new Map();
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line) continue;
    const parts = line.split('\t');
    if (parts.length !== 3 || !/^\d+$/.test(parts[2])) throw new Error(`bad census line in ${file}: ${line}`);
    if (parts[0] !== 'AGENTS.md') continue;
    map.set(parts[1], Number(parts[2]));
  }
  return map;
}

function compareAgents(beforeFile, afterFile) {
  const before = parseCensus(beforeFile);
  const after = parseCensus(afterFile);
  if (before.size === 0) throw new Error(`no AGENTS.md rows in ${beforeFile}`);
  let violations = 0;
  const report = [];
  for (const [token, b] of [...before.entries()].sort((x, y) => byteSort(x[0], y[0]))) {
    const a = after.get(token) || 0;
    if (a >= b) continue;
    if (token.startsWith('skill:') || token.startsWith('agent:')) {
      if (a < 1) { violations += 1; report.push(`VIOLATION name row below 1: ${token} ${b}->${a}`); }
      else report.push(`name-drop-ok ${token} ${b}->${a}`);
      continue;
    }
    const allowed = ALLOWED_DROPS.get(token);
    if (allowed && allowed[0] === b && allowed[1] === a) report.push(`allowed-drop ${token} ${b}->${a}`);
    else { violations += 1; report.push(`VIOLATION signal/anchor drop: ${token} ${b}->${a}`); }
  }
  for (const [token, a] of [...after.entries()].sort((x, y) => byteSort(x[0], y[0]))) {
    const b = before.get(token) || 0;
    if (a > b) report.push(`increase ${token} ${b}->${a}`);
  }
  for (const line of report) console.log(line);
  console.log(violations === 0 ? 'compare-agents: OK (0 violations)' : `compare-agents: FAIL (${violations} violation(s))`);
  return violations === 0 ? 0 : 1;
}

function main(argv) {
  if (argv[0] === '--out' && argv.length === 2) {
    fs.writeFileSync(argv[1], census());
    return 0;
  }
  if (argv[0] === '--compare-agents' && argv.length === 3) return compareAgents(argv[1], argv[2]);
  console.error(USAGE);
  return 2;
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (err) {
  console.error(`census.mjs: ${err.message}`);
  process.exitCode = 2;
}
