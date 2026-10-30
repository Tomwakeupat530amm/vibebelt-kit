#!/usr/bin/env node
// Phase 5 Step 0.4 conservation check for SKILL.md splits (validate-contract E8).
// Usage (from the repo root):
//   node <p5-tools>/conservation-check.mjs [--root <dir>] [--list <file>] [--baseline <sha>] [--json]
//   --root      tree to check (default: the git top level)
//   --list      oversize list (default: oversize.list next to this script)
//   --baseline  commit holding the "before" SKILL.md (default: the sha in baseline.sha next to this script)
// List format: '#' lines are comments; other lines are `<skill> <bytes> <action>[, <reason>]`,
// action = `split` or `skipped`.
// For each listed skill whose SKILL.md body (text after the front-matter) differs from the baseline:
//   SKIPPED   a skill marked `skipped` must keep its body unchanged
//   C1-H2     every `## ` heading of the baseline body (outside code fences) is still there, same order
//   C2-MOVED  every removed non-empty line (multiset: a line removed k times) occurs at least k times,
//             verbatim, across the files under .claude/skills/<skill>/references/
//   C3-PTR    every H2 section that lost lines names, in backticks, `references/<file>` file(s) that
//             exist and together hold all of that section's removed lines
//   C4-NAME   every references file that is new since the baseline has a name not starting with `vc-`
//             and is named in backticks by SKILL.md
// Exit 0 = all listed skills conserved; 1 = any failure; 2 = usage error or missing input.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { bodyLines, gitShow, gitTopLevel, parseArgs, here } from "./lib.mjs";

let args;
try {
  args = parseArgs(process.argv.slice(2), ["--root", "--list", "--baseline"], ["--json"]);
} catch (err) {
  console.error(err.message);
  process.exit(2);
}
const toolDir = here(import.meta.url);
const root = path.resolve(args.root || gitTopLevel());
const listPath = path.resolve(args.list || path.join(toolDir, "oversize.list"));
let baseline = args.baseline;
if (!baseline) {
  const shaFile = path.join(toolDir, "baseline.sha");
  if (!fs.existsSync(shaFile)) {
    console.error(`missing ${shaFile} (write it at Step 0.6) or pass --baseline <sha>`);
    process.exit(2);
  }
  baseline = fs.readFileSync(shaFile, "utf8").trim();
}
if (!fs.existsSync(listPath)) {
  console.error(`missing oversize list ${listPath}`);
  process.exit(2);
}

const entries = fs.readFileSync(listPath, "utf8").split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"))
  .map((line) => {
    const [skill, bytes, ...rest] = line.split(/\s+/);
    const action = (rest[0] || "").replace(/,$/, "");
    return { skill, bytes, action, line };
  });
if (entries.length === 0) {
  console.error(`no skill lines in ${listPath}`);
  process.exit(2);
}

const count = (lines) => {
  const m = new Map();
  for (const line of lines) if (line.trim() !== "") m.set(line, (m.get(line) || 0) + 1);
  return m;
};
const removedLines = (before, after) => {
  const b = count(before);
  const a = count(after);
  const removed = new Map();
  for (const [line, n] of b) {
    const k = n - (a.get(line) || 0);
    if (k > 0) removed.set(line, k);
  }
  return removed;
};
// H2 sections outside fenced code blocks; key = heading text + occurrence number.
function sections(lines) {
  const out = [];
  let current = { key: "(preamble)", heading: null, lines: [] };
  const seen = new Map();
  let fence = null;
  for (const line of lines) {
    const f = line.match(/^\s*(```|~~~)/);
    if (f) fence = fence === f[1] ? null : (fence || f[1]);
    if (!fence && !f && /^## /.test(line)) {
      out.push(current);
      const n = (seen.get(line) || 0) + 1;
      seen.set(line, n);
      current = { key: `${line}#${n}`, heading: line, lines: [] };
      continue;
    }
    current.lines.push(line);
  }
  out.push(current);
  return out;
}
const isSubsequence = (small, big) => {
  let i = 0;
  for (const x of big) if (i < small.length && x === small[i]) i += 1;
  return i === small.length;
};
const pointersIn = (lines) => {
  const found = new Set();
  for (const line of lines) for (const m of line.matchAll(/`(references\/[^`\s)]+)`/g)) found.add(m[1]);
  return [...found];
};
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const failures = [];
const results = [];
for (const entry of entries) {
  const rel = `.claude/skills/${entry.skill}/SKILL.md`;
  const beforeText = gitShow(baseline, rel);
  const file = path.join(root, rel);
  if (beforeText === null) {
    failures.push(`${entry.skill}: not found at baseline ${baseline}`);
    continue;
  }
  if (!fs.existsSync(file)) {
    failures.push(`${entry.skill}: ${rel} missing in ${root}`);
    continue;
  }
  const before = bodyLines(beforeText);
  const after = bodyLines(fs.readFileSync(file, "utf8"));
  if (JSON.stringify(before) === JSON.stringify(after)) {
    results.push({ skill: entry.skill, action: entry.action, status: "body unchanged" });
    continue;
  }
  if (entry.action === "skipped") {
    failures.push(`SKIPPED ${entry.skill}: marked skipped but its SKILL.md body changed`);
    results.push({ skill: entry.skill, action: entry.action, status: "FAIL body changed" });
    continue;
  }
  const errs = [];
  const sb = sections(before);
  const sa = sections(after);
  const h2Before = sb.filter((s) => s.heading).map((s) => s.heading);
  const h2After = sa.filter((s) => s.heading).map((s) => s.heading);
  if (!isSubsequence(h2Before, h2After)) {
    const missing = h2Before.filter((h) => !h2After.includes(h));
    errs.push(`C1-H2 headings lost or reordered: ${JSON.stringify(missing.length ? missing : "order changed")}`);
  }

  const refDir = path.join(root, ".claude/skills", entry.skill, "references");
  const refFiles = walk(refDir);
  const refCount = new Map();
  const perFile = new Map();
  for (const f of refFiles) {
    const lines = fs.readFileSync(f, "utf8").split("\n");
    perFile.set(path.relative(path.join(root, ".claude/skills", entry.skill), f).split(path.sep).join("/"), count(lines));
    for (const [line, n] of count(lines)) refCount.set(line, (refCount.get(line) || 0) + n);
  }

  const removed = removedLines(before, after);
  let movedTotal = 0;
  for (const [line, k] of removed) {
    movedTotal += k;
    const have = refCount.get(line) || 0;
    if (have < k) errs.push(`C2-MOVED line removed ${k}x but found ${have}x in references/: ${JSON.stringify(line.slice(0, 120))}`);
  }

  const afterByKey = new Map(sa.map((s) => [s.key, s]));
  for (const s of sb) {
    const lost = removedLines(s.lines, (afterByKey.get(s.key) || { lines: [] }).lines);
    if (lost.size === 0) continue;
    const now = afterByKey.get(s.key);
    const ptrs = now ? pointersIn(now.lines) : [];
    const label = s.heading || "(preamble)";
    if (ptrs.length === 0) {
      errs.push(`C3-PTR section "${label}" lost lines but names no \`references/<file>\` in backticks`);
      continue;
    }
    const pooled = new Map();
    for (const p of ptrs) {
      const c = perFile.get(p);
      if (!c) {
        errs.push(`C3-PTR section "${label}" points to missing ${p}`);
        continue;
      }
      for (const [line, n] of c) pooled.set(line, (pooled.get(line) || 0) + n);
    }
    for (const [line, k] of lost) {
      if ((pooled.get(line) || 0) < k) {
        errs.push(`C3-PTR section "${label}": moved line not in the file(s) it points to (${ptrs.join(", ")}): ${JSON.stringify(line.slice(0, 120))}`);
      }
    }
  }

  let baselineRefs = [];
  try {
    baselineRefs = execFileSync("git", ["ls-tree", "-r", "--name-only", baseline, "--", `.claude/skills/${entry.skill}/references/`], {
      cwd: gitTopLevel(),
      encoding: "utf8",
    }).split("\n").filter(Boolean).map((p) => p.replace(`.claude/skills/${entry.skill}/`, ""));
  } catch {
    errs.push(`C4-NAME cannot list baseline references for ${entry.skill}`);
  }
  const named = new Set(pointersIn(after));
  for (const relRef of perFile.keys()) {
    if (baselineRefs.includes(relRef)) continue;
    if (path.posix.basename(relRef).startsWith("vc-")) errs.push(`C4-NAME new file ${relRef} starts with vc-`);
    if (!named.has(relRef)) errs.push(`C4-NAME new file ${relRef} is not named in backticks by SKILL.md`);
  }

  for (const e of errs) failures.push(`${entry.skill}: ${e}`);
  results.push({
    skill: entry.skill,
    action: entry.action,
    status: errs.length ? "FAIL" : "conserved",
    movedNonEmptyLines: movedTotal,
    distinctMovedLines: removed.size,
    h2Kept: h2Before.length,
    referencesFiles: [...perFile.keys()],
  });
}

const report = { root, list: listPath, baseline, results, failures };
if (args.json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  for (const r of results) {
    const extra = r.status === "conserved"
      ? ` (${r.movedNonEmptyLines} moved non-empty lines, ${r.h2Kept} H2 kept, references: ${r.referencesFiles.join(", ")})`
      : "";
    console.log(`${r.skill} [${r.action}]: ${r.status}${extra}`);
  }
  console.log(failures.length ? failures.map((f) => `FAIL ${f}`).join("\n") : "OK: every listed skill conserved");
}
process.exit(failures.length ? 1 : 0);
