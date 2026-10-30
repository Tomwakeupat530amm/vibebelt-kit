#!/usr/bin/env node
// scripts/check-docs.mjs: documentation gate for the vibebelt-rebrand Phase 7 README rewrite.
// One-time maintainer tool: manifest kitOnly (never installed); removed with scripts/** at Phase 8 C0b.
//
// Usage: node scripts/check-docs.mjs [--root <dir>] [--golden <dir>] [--self-test]
//   --root <dir>    tree to check (default: the current directory)
//   --golden <dir>  Phase 3 census folder (default: <root>/process/general-plans/active/
//                   vibebelt-rebrand_29-10-26/golden). Its sibling folder ../harness holds
//                   phase7-base-sha.txt and orchestration-plg-before.txt and receives
//                   phase7-census-count-diff.txt.
//   --self-test     run every tree in scripts/fixtures/check-docs/: "pass" must pass every check;
//                   "fail-c<N>-<case>" (an overlay on "pass") must fail check N and pass the others.
// Output: one "CHECK <n> PASS|FAIL <detail>" line per check; problems follow as "  - ..." lines.
// Exit: 0 every check passed; 1 a check failed; 2 usage error.
//
// The quick start and the glossary live INSIDE the two READMEs (umbrella decision C2), between
// marker comments on their own lines: <!-- vibecoder-top:start|end -->, <!-- quick-start:start|end -->
// and <!-- glossary:start|end -->. Vietnamese comes first (user decision 2026-10-30): VI = README.md
// (the page GitHub shows), EN = docs/i18n/README.en.md.
//   1 Structure: each marker pair exactly once per file; ordered heading levels (outside code fences;
//     Markdown "#" and HTML <hN>) equal in EN and VI for the whole file and inside each region; the top
//     region has a heading; glossary table row counts equal.
//   2 Terms: each glossary lists the required terms; every bold term inside a quick-start region is a
//     term of that file's glossary (first bold text of the first cell, case-insensitive); each quick
//     start has at most 1000 words.
//   3 Install command: install.sh has exactly one REPO="https://github.com/<owner>/<repo>" line; every
//     README line containing "install.sh | bash" equals the curl line derived from it; each README has
//     one; no withkynam line without the upstream-attribution tag.
//   4 Signals: (a) fresh agent census (golden/signal-census.mjs) vs golden/signal-census-phase3.txt, both
//     mapped from the old prefix to vb-, count column removed; full-line count changes are written to
//     harness/phase7-census-count-diff.txt for the reviewer. (b) signal-token multiset of the
//     "## Plain-Language Gate Rendering" section of orchestration.md vs harness/orchestration-plg-before.txt.
//   5 Agent edits: for every .claude/agents/vb-*.md and .codex/agents/vb-*.toml changed since the commit
//     in harness/phase7-base-sha.txt, the multisets of backtick spans, file paths, numbers and
//     heading/section lines are unchanged.
//   6 Links: every relative link, href and src in both READMEs resolves to an existing file; the language
//     switcher links EN <-> VI only and names "Tiếng Việt" before "English" in both files; the old
//     Vietnamese path docs/i18n/README.vi-VN.md is gone; no QUICKSTART/GLOSSARY file exists or is
//     referenced.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const USAGE = 'usage: node scripts/check-docs.mjs [--root <dir>] [--golden <dir>] [--self-test]';
const SCRIPT = fileURLToPath(import.meta.url);
const GOLDEN_DEFAULT = 'process/general-plans/active/vibebelt-rebrand_29-10-26/golden';
const VI = 'README.md';
const EN = 'docs/i18n/README.en.md';
const OLD_VI = 'docs/i18n/README.vi-VN.md'; // Vietnamese moved to README.md; a copy here would drift
const SWITCHER = ['Tiếng Việt', 'English']; // required order in the language switcher line
const REGIONS = ['vibecoder-top', 'quick-start', 'glossary'];
const REQUIRED_TERMS = ['plan', 'validate', 'hook', 'agent', 'skill', 'phase', 'gate', 'commit', 'branch'];
const MAX_QUICK_START_WORDS = 1000;
const ORCHESTRATION = 'process/development-protocols/orchestration.md';
const PLG_HEADING = '## Plain-Language Gate Rendering';
const SIGNAL_RES = [
  /PHASE_COMPLETE:[ A-Z-]*/g,
  /Gate: (?:PASS|CONDITIONAL|BLOCKED)/g,
  /SUPPLEMENT_APPLIED:/g,
  /QUICK_FIX_ABORT:/g,
  /VB-[A-Z-]+/g,
];
const AGENT_FILE_RE = /^(?:\.claude\/agents\/vb-[^/]+\.md|\.codex\/agents\/vb-[^/]+\.toml)$/;
const REPO_RE = /^REPO="https:\/\/github\.com\/([^/"]+)\/([^/"]+?)(?:\.git)?"$/;
const SEPARATE_DOC_RE = /^(?:QUICKSTART|GLOSSARY)\b/i;
const SEPARATE_DOC_REF_RE = /\b(?:QUICKSTART|GLOSSARY)(?:\.[A-Za-z-]+)?\.md\b/;

class UsageError extends Error {}

const exists = (p) => fs.existsSync(p);
const readText = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const nonEmptyLines = (s) => s.split('\n').filter(Boolean);
const normTerm = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase();
const byCode = (a, b) => (a < b ? -1 : a > b ? 1 : 0); // code-unit order, same as LC_ALL=C sort for these files
const sorted = (items) => [...items].sort(byCode);
const sameList = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
const result = (n, problems, detail) => ({ n, ok: problems.length === 0, detail, problems });

function parseArgs(argv) {
  const opts = { root: process.cwd(), golden: '', selfTest: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--self-test') {
      opts.selfTest = true;
    } else if (arg === '--root' || arg === '--golden') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) throw new UsageError(`${arg} needs a directory`);
      opts[arg.slice(2)] = value;
      i += 1;
    } else {
      throw new UsageError(`unknown argument: ${arg}`);
    }
  }
  opts.root = path.resolve(opts.root);
  opts.golden = path.resolve(opts.golden || path.join(opts.root, GOLDEN_DEFAULT));
  return opts;
}

// Lines outside fenced code blocks (``` or ~~~; a fence closes on the same character, same or longer run).
function unfenced(lines) {
  const out = [];
  let fence = '';
  for (const line of lines) {
    const m = /^ {0,3}(`{3,}|~{3,})/.exec(line);
    if (m) {
      if (!fence) fence = m[1];
      else if (m[1][0] === fence[0] && m[1].length >= fence.length) fence = '';
      continue;
    }
    if (!fence) out.push(line);
  }
  return out;
}

function headingLevels(lines) {
  const levels = [];
  for (const line of unfenced(lines)) {
    const atx = /^ {0,3}(#{1,6})(?:[ \t]|$)/.exec(line);
    if (atx) levels.push(atx[1].length);
    for (const m of line.matchAll(/<h([1-6])[\s>]/gi)) levels.push(Number(m[1]));
  }
  return levels;
}

function findRegion(lines, name) {
  const at = (tag) => lines.flatMap((line, i) => (line.trim() === `<!-- ${name}:${tag} -->` ? [i] : []));
  const [start, end] = [at('start'), at('end')];
  if (start.length !== 1 || end.length !== 1) {
    return { error: `${name} marker pair not found exactly once (start ${start.length}, end ${end.length})` };
  }
  if (start[0] > end[0]) return { error: `${name} end marker comes before its start marker` };
  return { lines: lines.slice(start[0] + 1, end[0]) };
}

function loadDoc(root, rel) {
  const abs = path.join(root, rel);
  if (!exists(abs)) {
    return { rel, missing: true, lines: [], regions: Object.fromEntries(REGIONS.map((n) => [n, { error: `${rel} not found` }])) };
  }
  const lines = readText(abs).split('\n');
  return { rel, missing: false, lines, regions: Object.fromEntries(REGIONS.map((n) => [n, findRegion(lines, n)])) };
}

// Glossary terms: first bold text of the first cell of every table row after the |---| separator row.
function glossaryTerms(lines) {
  const rows = unfenced(lines).map((l) => l.trim()).filter((l) => l.startsWith('|'));
  const sep = rows.findIndex((l) => /^\|(?:\s*:?-{3,}:?\s*\|)+$/.test(l));
  if (sep < 0) return [];
  return rows.slice(sep + 1).map((row) => {
    const cell = row.split('|')[1] ?? '';
    const bold = /\*\*([^*]+)\*\*/.exec(cell);
    return normTerm(bold ? bold[1] : cell.replace(/`/g, ''));
  });
}

function boldTerms(lines) {
  const terms = [];
  for (const line of unfenced(lines)) {
    for (const m of line.replace(/`[^`]*`/g, '').matchAll(/\*\*([^*\n]+?)\*\*/g)) terms.push(normTerm(m[1]));
  }
  return terms;
}

function check1(ctx) {
  const problems = [];
  for (const doc of [ctx.vi, ctx.en]) {
    for (const name of REGIONS) if (doc.regions[name].error) problems.push(`${doc.rel}: ${doc.regions[name].error}`);
  }
  const compare = (what, a, b) => {
    if (sameList(a, b)) return;
    const i = a.findIndex((x, k) => x !== b[k]);
    const at = i < 0 ? Math.min(a.length, b.length) : i;
    problems.push(`${what}: heading levels differ at heading ${at + 1} (EN h${a[at] ?? '-'}, VI h${b[at] ?? '-'}; EN ${a.length} headings, VI ${b.length})`);
  };
  const whole = [headingLevels(ctx.en.lines), headingLevels(ctx.vi.lines)];
  if (!ctx.en.missing && !ctx.vi.missing) compare('whole file', ...whole);
  for (const name of REGIONS) {
    const [a, b] = [ctx.en.regions[name].lines, ctx.vi.regions[name].lines];
    if (!a || !b) continue;
    compare(`${name} region`, headingLevels(a), headingLevels(b));
    if (name === 'vibecoder-top' && headingLevels(a).length === 0) problems.push('vibecoder-top region has no heading');
    if (name === 'glossary') {
      const [x, y] = [glossaryTerms(a).length, glossaryTerms(b).length];
      if (x !== y) problems.push(`glossary rows differ (EN ${x}, VI ${y})`);
    }
  }
  return result(1, problems, `EN and VI share ${whole[0].length} heading levels in order; 3 marker regions and glossary rows match`);
}

function check2(ctx) {
  const problems = [];
  const words = {};
  let terms = 0;
  for (const doc of [ctx.vi, ctx.en]) {
    const quick = doc.regions['quick-start'].lines;
    const glossary = doc.regions.glossary.lines;
    if (!quick || !glossary) {
      problems.push(`${doc.rel}: quick-start or glossary region missing`);
      continue;
    }
    const known = new Set(glossaryTerms(glossary));
    if (known.size === 0) {
      problems.push(`${doc.rel}: the glossary table has no rows`);
      continue;
    }
    for (const t of REQUIRED_TERMS) if (!known.has(t)) problems.push(`${doc.rel}: required term "${t}" is not in the glossary`);
    for (const t of new Set(boldTerms(quick))) {
      if (!known.has(t)) problems.push(`${doc.rel}: bold term "${t}" in the quick start is not in the glossary`);
    }
    // Whitespace split: for Vietnamese this counts syllables, so the same limit is stricter there.
    words[doc.rel] = quick.join('\n').split(/\s+/).filter(Boolean).length;
    if (words[doc.rel] > MAX_QUICK_START_WORDS) problems.push(`${doc.rel}: the quick start has ${words[doc.rel]} words (limit ${MAX_QUICK_START_WORDS})`);
    if (doc === ctx.vi) terms = known.size;
  }
  return result(2, problems, `VI glossary has ${terms} terms incl. the ${REQUIRED_TERMS.length} required; every quick-start bold term is defined (VI and EN); quick start VI ${words[VI]} / EN ${words[EN]} words <= ${MAX_QUICK_START_WORDS}`);
}

function check3(ctx) {
  const problems = [];
  let expected = '';
  const installFile = path.join(ctx.root, 'install.sh');
  if (!exists(installFile)) {
    problems.push('install.sh not found');
  } else {
    const repos = readText(installFile).split('\n').map((l) => REPO_RE.exec(l)).filter(Boolean);
    if (repos.length !== 1) problems.push(`install.sh: ${repos.length} REPO="https://github.com/<owner>/<repo>" lines (need exactly 1)`);
    else expected = `curl -fsSL https://raw.githubusercontent.com/${repos[0][1]}/${repos[0][2]}/main/install.sh | bash`;
  }
  let count = 0;
  for (const doc of [ctx.vi, ctx.en]) {
    const lines = doc.lines.filter((l) => l.includes('install.sh | bash'));
    count += lines.length;
    if (lines.length === 0) problems.push(`${doc.rel}: no install command line`);
    if (expected) for (const l of lines) if (l !== expected) problems.push(`${doc.rel}: install line is not "${expected}": ${l.trim()}`);
    const owner = doc.lines.filter((l) => l.includes('withkynam') && !l.includes('upstream-attribution')).length;
    if (owner) problems.push(`${doc.rel}: ${owner} withkynam line(s) without the upstream-attribution tag`);
  }
  return result(3, problems, `${count} install line(s) in VI and EN, all equal to the line derived from install.sh; old owner only on tagged lines`);
}

function censusCheck(ctx, problems) {
  const script = path.join(ctx.golden, 'signal-census.mjs');
  const baseFile = path.join(ctx.golden, 'signal-census-phase3.txt');
  if (!exists(script) || !exists(baseFile)) {
    problems.push(`(a) census script or baseline not found under ${ctx.golden}`);
    return '(a) not run';
  }
  const run = spawnSync(process.execPath, [script, '--root', ctx.root], { encoding: 'utf8', maxBuffer: 64 << 20 });
  if (run.status !== 0 || !run.stdout.trim()) {
    problems.push(`(a) census run failed (exit ${run.status}): ${(run.stderr || '').trim()}`);
    return '(a) failed';
  }
  const toNew = (s) => s.replace(/VC-/g, 'VB-').replace(/vc-/g, 'vb-'); // legacy-vc-fallback: the Phase 3 baseline predates the prefix rename
  const fresh = nonEmptyLines(toNew(run.stdout));
  const base = nonEmptyLines(toNew(readText(baseFile)));
  const key = (line) => line.split('\t').slice(0, 4).join('\t');
  const [freshKeys, baseKeys] = [new Set(fresh.map(key)), new Set(base.map(key))];
  for (const k of sorted(baseKeys)) if (!freshKeys.has(k)) problems.push(`(a) census entry gone: ${k.replaceAll('\t', ' | ')}`);
  for (const k of sorted(freshKeys)) if (!baseKeys.has(k)) problems.push(`(a) census entry new: ${k.replaceAll('\t', ' | ')}`);
  const [freshSet, baseSet] = [new Set(fresh), new Set(base)];
  const countDiff = [
    ...base.filter((l) => !freshSet.has(l)).map((l) => `-${l}`),
    ...fresh.filter((l) => !baseSet.has(l)).map((l) => `+${l}`),
  ].sort((a, b) => byCode(a.slice(1), b.slice(1)) || byCode(a, b));
  fs.mkdirSync(ctx.harness, { recursive: true });
  fs.writeFileSync(path.join(ctx.harness, 'phase7-census-count-diff.txt'), countDiff.length ? `${countDiff.join('\n')}\n` : '');
  return `(a) ${freshKeys.size} census entries equal the Phase 3 baseline, ${countDiff.length} count-diff line(s)`;
}

function plgSection(text) {
  const lines = text.split('\n');
  const start = lines.indexOf(PLG_HEADING);
  if (start < 0) return '';
  const out = [lines[start]];
  for (const line of lines.slice(start + 1)) {
    if (/^## /.test(line)) break;
    out.push(line);
  }
  return out.join('\n');
}

const signalTokens = (text) => sorted(SIGNAL_RES.flatMap((re) => [...text.matchAll(re)].map((m) => m[0])));

function check4(ctx) {
  const problems = [];
  const detailA = censusCheck(ctx, problems);
  let detailB = '(b) not run';
  const orchestration = path.join(ctx.root, ORCHESTRATION);
  const beforeFile = path.join(ctx.harness, 'orchestration-plg-before.txt');
  if (!exists(orchestration) || !exists(beforeFile)) {
    problems.push(`(b) ${ORCHESTRATION} or ${beforeFile} not found`);
  } else {
    const [now, was] = [plgSection(readText(orchestration)), readText(beforeFile)];
    if (!now) problems.push(`(b) "${PLG_HEADING}" section not found in ${ORCHESTRATION}`);
    else if (!was.trim()) problems.push(`(b) saved section ${beforeFile} is empty`);
    else {
      const [a, b] = [signalTokens(was), signalTokens(now)];
      if (sameList(a, b)) detailB = `(b) ${b.length} signal tokens in the gate-rendering section unchanged`;
      else problems.push(`(b) gate-rendering signal tokens changed: before [${a.join(', ')}] now [${b.join(', ')}]`);
    }
  }
  return result(4, problems, `${detailA}; ${detailB}`);
}

function invariants(text) {
  const all = (re) => sorted([...text.matchAll(re)].map((m) => m[0]));
  return {
    'backtick spans': all(/`[^`\n]+`/g),
    'file paths': all(/[A-Za-z0-9_./-]+\.(?:md|mjs|cjs|toml|json)/g),
    numbers: all(/\d+(?:\.\d+)?/g),
    'heading/section lines': sorted(text.split('\n').filter((l) => /^#{1,6}\s/.test(l) || /^\[[^\]\n]+\]\s*$/.test(l))),
  };
}

function check5(ctx) {
  const shaFile = path.join(ctx.harness, 'phase7-base-sha.txt');
  if (!exists(shaFile)) return result(5, [`base SHA file not found: ${shaFile}`], '');
  const sha = readText(shaFile).trim();
  if (!/^[0-9a-f]{7,40}$/.test(sha)) return result(5, [`no commit id in ${shaFile}`], '');
  const git = (...args) => spawnSync('git', ['-c', 'core.quotepath=off', ...args], { cwd: ctx.root, encoding: 'utf8', maxBuffer: 64 << 20 });
  const changed = git('diff', '--name-only', '--relative', sha, '--', '.claude/agents', '.codex/agents');
  const added = git('ls-files', '--others', '--exclude-standard', '--', '.claude/agents', '.codex/agents');
  if (changed.status !== 0 || added.status !== 0) return result(5, [`git failed: ${(changed.stderr || added.stderr || '').trim()}`], '');
  const files = sorted(new Set([...nonEmptyLines(changed.stdout), ...nonEmptyLines(added.stdout)].filter((f) => AGENT_FILE_RE.test(f))));
  const problems = [];
  for (const file of files) {
    const before = git('show', `${sha}:./${file}`);
    const was = before.status === 0 ? before.stdout.replace(/\r\n/g, '\n') : '';
    const now = exists(path.join(ctx.root, file)) ? readText(path.join(ctx.root, file)) : '';
    const [a, b] = [invariants(was), invariants(now)];
    for (const kind of Object.keys(a)) if (!sameList(a[kind], b[kind])) problems.push(`${file}: ${kind} changed`);
  }
  return result(5, problems, `${files.length} agent file(s) changed since ${sha.slice(0, 7)}; backtick spans, paths, numbers and heading lines unchanged`);
}

function linkTargets(lines) {
  const out = [];
  for (const line of unfenced(lines)) {
    const text = line.replace(/`[^`]*`/g, '');
    for (const m of text.matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+["'(][^)]*)?\)/g)) out.push(m[1]);
    for (const m of text.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) out.push(m[1]);
    const ref = /^ {0,3}\[[^\]]+\]:\s*<?([^\s>]+)>?/.exec(text);
    if (ref) out.push(ref[1]);
  }
  return out;
}

function separateDocFiles(root) {
  const found = [];
  for (const e of fs.readdirSync(root, { withFileTypes: true })) if (e.isFile() && SEPARATE_DOC_RE.test(e.name)) found.push(e.name);
  const walk = (rel) => {
    for (const e of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
      const child = `${rel}/${e.name}`;
      if (e.isDirectory()) walk(child);
      else if (SEPARATE_DOC_RE.test(e.name)) found.push(child);
    }
  };
  if (exists(path.join(root, 'docs'))) walk('docs');
  return sorted(found);
}

// The first line outside code fences that names both languages is the switcher; Vietnamese must come first.
function switcherProblem(doc) {
  const line = unfenced(doc.lines).find((l) => SWITCHER.every((name) => l.includes(name)));
  if (!line) return `${doc.rel}: no language-switcher line naming ${SWITCHER.join(' and ')}`;
  const [first, second] = SWITCHER.map((name) => line.indexOf(name));
  return first < second ? '' : `${doc.rel}: the language switcher lists ${SWITCHER[1]} before ${SWITCHER[0]}`;
}

function check6(ctx) {
  const problems = [];
  const reached = new Map([[EN, new Set()], [VI, new Set()]]);
  let count = 0;
  for (const doc of [ctx.vi, ctx.en]) {
    if (doc.missing) {
      problems.push(`${doc.rel} not found`);
      continue;
    }
    const order = switcherProblem(doc);
    if (order) problems.push(order);
    for (const target of linkTargets(doc.lines)) {
      if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(target)) continue;
      let clean;
      try {
        clean = decodeURI(target.replace(/[?#].*$/, ''));
      } catch {
        problems.push(`${doc.rel}: malformed link ${target}`);
        continue;
      }
      if (!clean) continue;
      const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(doc.rel), clean));
      count += 1;
      reached.get(doc.rel).add(resolved);
      if (resolved === '..' || resolved.startsWith('../') || !exists(path.join(ctx.root, resolved))) problems.push(`${doc.rel}: dead link ${target}`);
      if (/^docs\/i18n\/README\.[^/]+\.md$/.test(resolved) && resolved !== EN) problems.push(`${doc.rel}: links another language README ${resolved}`);
    }
    if (SEPARATE_DOC_REF_RE.test(doc.lines.join('\n'))) problems.push(`${doc.rel}: refers to a separate QUICKSTART/GLOSSARY file`);
  }
  if (!reached.get(EN).has(VI)) problems.push(`${EN}: no language-switcher link to ${VI}`);
  if (!reached.get(VI).has(EN)) problems.push(`${VI}: no language-switcher link to ${EN}`);
  if (exists(path.join(ctx.root, OLD_VI))) problems.push(`${OLD_VI} still exists; the Vietnamese README is ${VI}`);
  for (const rel of separateDocFiles(ctx.root)) problems.push(`separate QUICKSTART/GLOSSARY file exists: ${rel}`);
  return result(6, problems, `${count} relative links resolve; switcher links VI <-> EN only, Tiếng Việt first; no ${OLD_VI}; no QUICKSTART/GLOSSARY file`);
}

function runChecks(opts) {
  const ctx = {
    root: opts.root,
    golden: opts.golden,
    harness: path.join(opts.golden, '..', 'harness'),
    en: loadDoc(opts.root, EN),
    vi: loadDoc(opts.root, VI),
  };
  let failed = 0;
  [check1, check2, check3, check4, check5, check6].forEach((check, i) => {
    let r;
    try {
      r = check(ctx);
    } catch (err) {
      r = result(i + 1, [`check crashed: ${err && err.stack ? err.stack : err}`], '');
    }
    if (r.ok) {
      console.log(`CHECK ${r.n} PASS ${r.detail}`);
      return;
    }
    failed += 1;
    console.log(`CHECK ${r.n} FAIL ${r.problems.length} problem(s)`);
    for (const p of r.problems) console.log(`  - ${p}`);
  });
  return failed ? 1 : 0;
}

// Self-test: each fixture tree is copied to a temp git repo whose first commit is the base for check 5.
function gitBase(dir) {
  const git = (...args) => {
    const r = spawnSync('git', ['-c', 'init.defaultBranch=main', '-c', 'user.name=check-docs', '-c', 'user.email=check-docs@example.invalid',
      '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', '-c', 'core.autocrlf=false', ...args], { cwd: dir, encoding: 'utf8' });
    if (r.status !== 0) throw new Error(`git ${args[0]} failed: ${(r.stderr || '').trim()}`);
    return r.stdout.trim();
  };
  git('init', '-q');
  git('add', '-A');
  git('commit', '-q', '-m', 'check-docs fixture base');
  return git('rev-parse', 'HEAD');
}

function judge(run, expect) {
  const states = new Map();
  for (const line of (run.stdout || '').split('\n')) {
    const m = /^CHECK ([1-6]) (PASS|FAIL)\b/.exec(line);
    if (m) states.set(Number(m[1]), m[2]);
  }
  if (states.size !== 6) return { ok: false, why: `expected 6 CHECK lines, got ${states.size} (exit ${run.status})` };
  const wrong = [...states].filter(([n, s]) => s !== (n === expect ? 'FAIL' : 'PASS')).map(([n, s]) => `CHECK ${n} ${s}`);
  const exitOk = expect ? run.status === 1 : run.status === 0;
  if (wrong.length || !exitOk) return { ok: false, why: `exit ${run.status}; unexpected ${wrong.join(', ') || 'exit code'}` };
  return { ok: true, why: expect ? `exit 1, CHECK ${expect} FAIL, the other checks PASS` : 'exit 0, CHECK 1-6 PASS' };
}

function runSelfTest(opts) {
  const fixtures = path.join(path.dirname(SCRIPT), 'fixtures', 'check-docs');
  const census = path.join(opts.golden, 'signal-census.mjs');
  const censusLib = path.join(opts.golden, 'lib', 'common.mjs');
  for (const need of [path.join(fixtures, 'pass'), census, censusLib]) {
    if (!exists(need)) {
      console.log(`SELFTEST FAIL missing ${need}`);
      return 1;
    }
  }
  const cases = fs.readdirSync(fixtures).filter((n) => n === 'pass' || /^fail-c[1-6]-/.test(n)).sort();
  const covered = new Set();
  let good = 0;
  for (const name of cases) {
    const expect = name === 'pass' ? 0 : Number(name[6]);
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'check-docs-'));
    let verdict;
    let run = { stdout: '' };
    try {
      fs.cpSync(path.join(fixtures, 'pass'), tmp, { recursive: true });
      const sha = gitBase(tmp);
      fs.mkdirSync(path.join(tmp, 'harness'), { recursive: true });
      fs.writeFileSync(path.join(tmp, 'harness', 'phase7-base-sha.txt'), `${sha}\n`);
      fs.mkdirSync(path.join(tmp, 'golden', 'lib'), { recursive: true });
      fs.copyFileSync(census, path.join(tmp, 'golden', 'signal-census.mjs'));
      fs.copyFileSync(censusLib, path.join(tmp, 'golden', 'lib', 'common.mjs'));
      if (expect) fs.cpSync(path.join(fixtures, name), tmp, { recursive: true });
      run = spawnSync(process.execPath, [SCRIPT, '--root', tmp, '--golden', path.join(tmp, 'golden')], { encoding: 'utf8' });
      verdict = judge(run, expect);
    } catch (err) {
      verdict = { ok: false, why: err.message };
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
    if (verdict.ok) {
      good += 1;
      if (expect) covered.add(expect);
    }
    console.log(`SELFTEST ${name} ${verdict.ok ? 'PASS' : 'FAIL'} ${verdict.why}`);
    if (!verdict.ok) for (const line of nonEmptyLines(run.stdout || '')) console.log(`    ${line}`);
  }
  const missing = [1, 2, 3, 4, 5, 6].filter((n) => !covered.has(n));
  if (missing.length) console.log(`SELFTEST FAIL no passing failing-tree for check(s) ${missing.join(', ')}`);
  if (!cases.includes('pass')) console.log('SELFTEST FAIL no "pass" tree');
  const ok = good === cases.length && missing.length === 0 && cases.includes('pass');
  console.log(`SELFTEST ${ok ? 'PASS' : 'FAIL'} ${good}/${cases.length} trees behaved as expected`);
  return ok ? 0 : 1;
}

function main(argv) {
  let opts;
  try {
    opts = parseArgs(argv);
  } catch (err) {
    if (!(err instanceof UsageError)) throw err;
    console.error(`check-docs: ${err.message}\n${USAGE}`);
    return 2;
  }
  return opts.selfTest ? runSelfTest(opts) : runChecks(opts);
}

process.exitCode = main(process.argv.slice(2));
