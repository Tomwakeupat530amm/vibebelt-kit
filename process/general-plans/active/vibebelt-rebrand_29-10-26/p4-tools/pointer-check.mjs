#!/usr/bin/env node
// p4-tools/pointer-check.mjs: broken path / anchor pointers across the repo (vibebelt-rebrand Phase 4, step 0.3).
// Throw-away task-folder tool (C-CLEAN); Phases 6 and 7 call it with the same interface.
// Run from the repo root with Linux node 22.
//
// Usage: node pointer-check.mjs --out <file>
//   Writes ONLY the broken keys to <file>, one line per occurrence (duplicates kept), byte-order
//   sorted (= LC_ALL=C sort): <citing file>\t<target>[§<anchor>]. No line numbers. Summary and
//   info counts go to stdout. Exit 0 = scan done (broken keys are data, not an error); 2 = usage/setup.
//
// Scope: every git-tracked text file (git ls-files; NUL byte = binary, skipped) except the program
// task folder. Extracted pointers:
//   (1) repo-relative paths process/development-protocols/<path>.md; inside
//       process/development-protocols/** also backticked spans that are a whole *.md path.
//       Resolution candidates: repo root, the citing file's folder, process/development-protocols/.
//       OK if one candidate exists.
//   (2) anchors <file>.md§Name and `<file>.md` §Name (optional backtick and one space before §).
//       Name = text after § up to the first backtick, ")", ",", ";", " (", "." followed by
//       whitespace or end of line, or end of line; trimmed; empty names are skipped. The file
//       resolves with the same candidates. A bare §Name (no file before it) binds to the citing
//       file. OK if some Markdown heading of the target, after stripping the #s, starts with Name
//       (case-insensitive).
//   info only (never failures): "Section N" citations and "12-reference.md PHASE-GATES".
// Keys are prefix-neutral (same mapping as the plan's sed: v[cb]- -> v?-, V[CB][-_] -> V?[-_]).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const USAGE = 'usage: node pointer-check.mjs --out <file>';
const TASK_FOLDER = 'process/general-plans/active/vibebelt-rebrand_29-10-26/';
const PROTOCOLS = 'process/development-protocols/';
const PROTOCOL_PATH_RE = /process\/development-protocols\/[A-Za-z0-9_./-]+\.md/g;
const BACKTICK_SPAN_RE = /`([^`]+)`/g;
const WHOLE_MD_PATH_RE = /^[A-Za-z0-9_./-]+\.md$/;
const FILE_BEFORE_ANCHOR_RE = /([A-Za-z0-9_./-]+\.md)$/;
const SECTION_RE = /\bSection \d+/g;
const PHASE_GATES_RE = /12-reference\.md`?\s*PHASE-GATES/g;

function neutral(s) {
  return s.replace(/\bv[cb]-/g, 'v?-').replace(/\bV[CB]([-_])/g, 'V?$1');
}

function byteSort(a, b) {
  return Buffer.compare(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));
}

function isFile(rel) {
  try {
    return fs.statSync(rel).isFile();
  } catch {
    return false;
  }
}

function resolveTarget(cite, target) {
  const candidates = [
    path.posix.normalize(target),
    path.posix.normalize(path.posix.join(path.posix.dirname(cite), target)),
    path.posix.normalize(path.posix.join(PROTOCOLS, target)),
  ];
  return candidates.find((c) => !c.startsWith('..') && isFile(c)) || null;
}

const headingCache = new Map();
function headings(file) {
  if (!headingCache.has(file)) {
    const list = [];
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s{0,3}#{1,6}\s+(.*)$/);
      if (m) list.push(m[1].trim().toLowerCase());
    }
    headingCache.set(file, list);
  }
  return headingCache.get(file);
}

function extractName(rest) {
  let end = rest.length;
  for (const stop of ['`', ')', ',', ';', ' (']) {
    const idx = rest.indexOf(stop);
    if (idx >= 0 && idx < end) end = idx;
  }
  const dot = rest.match(/\.(\s|$)/);
  if (dot && dot.index < end) end = dot.index;
  return rest.slice(0, end).trim();
}

function scanLine(cite, line, inProtocols, broken, info) {
  for (const m of line.matchAll(PROTOCOL_PATH_RE)) {
    if (!resolveTarget(cite, m[0])) broken.push(`${cite}\t${m[0]}`);
  }
  if (inProtocols) {
    for (const m of line.matchAll(BACKTICK_SPAN_RE)) {
      const span = m[1];
      if (!WHOLE_MD_PATH_RE.test(span)) continue;
      if (span.startsWith(PROTOCOLS)) continue; // already checked by rule (1)
      if (!resolveTarget(cite, span)) broken.push(`${cite}\t${span}`);
    }
  }
  let from = 0;
  for (;;) {
    const idx = line.indexOf('§', from);
    if (idx < 0) break;
    from = idx + 1;
    const name = extractName(line.slice(idx + 1));
    if (!name) continue;
    let before = line.slice(0, idx);
    if (before.endsWith(' ')) before = before.slice(0, -1);
    if (before.endsWith('`')) before = before.slice(0, -1);
    const fm = before.match(FILE_BEFORE_ANCHOR_RE);
    let targetFile;
    let label;
    if (fm) {
      targetFile = resolveTarget(cite, fm[1]);
      label = targetFile || fm[1];
    } else {
      targetFile = cite;
      label = cite;
    }
    const ok = targetFile !== null && targetFile.endsWith('.md')
      && headings(targetFile).some((h) => h.startsWith(name.toLowerCase()));
    if (!ok) broken.push(`${cite}\t${label}§${name}`);
  }
  info.section += [...line.matchAll(SECTION_RE)].length;
  info.phaseGates += [...line.matchAll(PHASE_GATES_RE)].length;
}

function main(argv) {
  if (argv[0] !== '--out' || argv.length !== 2) {
    console.error(USAGE);
    return 2;
  }
  const listed = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    .split('\0').filter(Boolean).filter((f) => !f.startsWith(TASK_FOLDER));
  if (listed.length === 0) throw new Error('git ls-files returned nothing (run from the repo root)');
  const broken = [];
  const info = { section: 0, phaseGates: 0 };
  let scanned = 0;
  let skipped = 0;
  for (const cite of listed) {
    if (!isFile(cite)) { skipped += 1; continue; }
    const buf = fs.readFileSync(cite);
    if (buf.includes(0)) { skipped += 1; continue; }
    scanned += 1;
    const inProtocols = cite.startsWith(PROTOCOLS);
    for (const line of buf.toString('utf8').split(/\r?\n/)) scanLine(cite, line, inProtocols, broken, info);
  }
  const keys = broken.map(neutral).sort(byteSort);
  fs.writeFileSync(argv[1], keys.length ? `${keys.join('\n')}\n` : '');
  console.log(`scanned ${scanned} text files (${skipped} skipped: binary or missing)`);
  console.log(`broken occurrences: ${keys.length} (distinct keys: ${new Set(keys).size})`);
  console.log(`info: Section N citations ${info.section}; 12-reference.md PHASE-GATES citations ${info.phaseGates}`);
  return 0;
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (err) {
  console.error(`pointer-check.mjs: ${err.message}`);
  process.exitCode = 2;
}
