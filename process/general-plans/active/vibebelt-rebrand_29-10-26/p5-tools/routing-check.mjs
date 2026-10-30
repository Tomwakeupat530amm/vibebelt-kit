#!/usr/bin/env node
// Phase 5 Step 0.3 routing check (validate-contract E7).
// Usage (from the repo root): node <p5-tools>/routing-check.mjs [--root <dir>] [--pre <file>] [--json]
//   --root  tree whose .claude/skills/*/SKILL.md is checked (default: the git top level)
//   --pre   snapshot from snapshot.mjs (default: pre-triggers.json next to this script)
// FAILS (exit 1) when, compared with the snapshot:
//   SKILLSET  a skill folder was added or removed
//   TOP3      a skill's first three trigger_keywords are not exactly its recorded top-3 (same phrases,
//             same order; lowercased) - covers a lost phrase and a reordered one
//   STOLEN    a recorded top-3 phrase p of skill A and a phrase q of another skill B are in a NEW
//             containment relation (q inside p, p inside q, or q == p; word-bounded, lowercased)
//             that did not exist before - B now competes for A's main wording
// REPORTS (no effect on the exit code): skill pairs sharing more than 2 keyword words, and every
// cross-skill contained-phrase pair, before and after, with NEW / GONE marks.
// Exit 2 on a usage error or a missing/invalid snapshot.
import fs from "node:fs";
import path from "node:path";
import { listSkillFolders, readSkill, triggerList, gitTopLevel, parseArgs, here } from "./lib.mjs";

let args;
try {
  args = parseArgs(process.argv.slice(2), ["--root", "--pre"], ["--json"]);
} catch (err) {
  console.error(err.message);
  process.exit(2);
}
const root = path.resolve(args.root || gitTopLevel());
const prePath = path.resolve(args.pre || path.join(here(import.meta.url), "pre-triggers.json"));

let pre;
try {
  pre = JSON.parse(fs.readFileSync(prePath, "utf8"));
  if (!pre.skills || typeof pre.skills !== "object") throw new Error("no skills object");
} catch (err) {
  console.error(`cannot read snapshot ${prePath}: ${err.message}`);
  process.exit(2);
}

const preLists = new Map(Object.entries(pre.skills).map(([name, s]) => [name, { top3: s.top3, all: s.all }]));
const postLists = new Map();
for (const folder of listSkillFolders(root)) {
  const skill = readSkill(root, folder);
  const all = skill && skill.parsed ? triggerList(skill.parsed.fields) : [];
  postLists.set(folder, { top3: all.slice(0, 3), all });
}

const failures = [];

// SKILLSET
for (const name of preLists.keys()) if (!postLists.has(name)) failures.push(`SKILLSET ${name}: skill folder missing`);
for (const name of postLists.keys()) if (!preLists.has(name)) failures.push(`SKILLSET ${name}: new skill folder`);

// TOP3
for (const [name, p] of preLists) {
  const q = postLists.get(name);
  if (!q) continue;
  if (JSON.stringify(q.top3) !== JSON.stringify(p.top3)) {
    const lost = p.top3.filter((phrase) => !q.all.includes(phrase));
    const detail = lost.length ? `lost ${JSON.stringify(lost)}` : "order or position changed";
    failures.push(`TOP3 ${name}: recorded ${JSON.stringify(p.top3)}, now ${JSON.stringify(q.top3)} (${detail})`);
  }
}

// Word-bounded containment: is `inner` a whole-word run inside `outer`?
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const contains = (outer, inner) => new RegExp(`(^|[^a-z0-9'])${escape(inner)}($|[^a-z0-9'])`).test(outer);

// Relations between recorded top-3 phrases of A and any phrase of another skill B.
function topRelations(lists) {
  const rel = new Set();
  for (const [a, p] of preLists) {
    for (const top of p.top3) {
      for (const [b, q] of lists) {
        if (b === a) continue;
        for (const phrase of q.all) {
          if (phrase === top) rel.add(`${a}|${top}|${b}|${phrase}|same`);
          else if (contains(top, phrase)) rel.add(`${a}|${top}|${b}|${phrase}|inside-top3`);
          else if (contains(phrase, top)) rel.add(`${a}|${top}|${b}|${phrase}|contains-top3`);
        }
      }
    }
  }
  return rel;
}
const relBefore = topRelations(preLists);
const relAfter = topRelations(postLists);
for (const r of relAfter) {
  if (relBefore.has(r)) continue;
  const [a, top, b, phrase, kind] = r.split("|");
  failures.push(`STOLEN ${b} phrase "${phrase}" ${kind} of ${a} top-3 "${top}" (new relation)`);
}

// Reports.
const words = (list) => new Set(list.flatMap((phrase) => phrase.split(/[^a-z0-9']+/).filter(Boolean)));
function overlaps(lists) {
  const names = [...lists.keys()].sort();
  const out = new Map();
  for (let i = 0; i < names.length; i += 1) {
    for (let j = i + 1; j < names.length; j += 1) {
      const wa = words(lists.get(names[i]).all);
      const shared = [...words(lists.get(names[j]).all)].filter((w) => wa.has(w)).sort();
      if (shared.length > 2) out.set(`${names[i]} vs ${names[j]}`, shared);
    }
  }
  return out;
}
function containedPairs(lists) {
  const out = new Set();
  for (const [a, p] of lists) {
    p.all.forEach((inner, i) => {
      for (const [b, q] of lists) {
        if (b === a) continue;
        q.all.forEach((outer, j) => {
          if (inner !== outer && contains(outer, inner)) {
            out.add(`"${inner}" (${a} #${i + 1}${i < 3 ? " top-3" : ""}) inside "${outer}" (${b} #${j + 1}${j < 3 ? " top-3" : ""})`);
          } else if (inner === outer && a < b) {
            out.add(`"${inner}" in both ${a} #${i + 1} and ${b} #${j + 1}`);
          }
        });
      }
    });
  }
  return out;
}
const ovBefore = overlaps(preLists);
const ovAfter = overlaps(postLists);
const cpBefore = containedPairs(preLists);
const cpAfter = containedPairs(postLists);

const report = {
  root,
  snapshot: { path: prePath, sourceHead: pre.sourceHead, skillCount: preLists.size },
  checkedSkills: postLists.size,
  failures,
  overlapsOver2Words: {
    before: Object.fromEntries(ovBefore),
    after: Object.fromEntries(ovAfter),
    new: [...ovAfter.keys()].filter((k) => !ovBefore.has(k)),
    gone: [...ovBefore.keys()].filter((k) => !ovAfter.has(k)),
  },
  containedPhrases: {
    before: [...cpBefore].sort(),
    after: [...cpAfter].sort(),
    new: [...cpAfter].filter((x) => !cpBefore.has(x)).sort(),
    gone: [...cpBefore].filter((x) => !cpAfter.has(x)).sort(),
  },
};

if (args.json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`routing-check: ${report.checkedSkills} skills vs snapshot ${String(pre.sourceHead).slice(0, 7)} (${preLists.size} skills)`);
  console.log(failures.length ? failures.map((f) => `FAIL ${f}`).join("\n") : "OK: every recorded top-3 kept in order; no phrase stolen; skill set unchanged");
  console.log(`pairs sharing >2 words: before ${ovBefore.size}, after ${ovAfter.size}`);
  for (const [k, v] of ovAfter) console.log(`  after  ${k}: ${v.join("|")}`);
  for (const k of report.overlapsOver2Words.new) console.log(`  NEW    ${k}`);
  for (const k of report.overlapsOver2Words.gone) console.log(`  GONE   ${k}: ${ovBefore.get(k).join("|")}`);
  console.log(`cross-skill contained phrases: before ${cpBefore.size}, after ${cpAfter.size}`);
  for (const x of report.containedPhrases.new) console.log(`  NEW    ${x}`);
  for (const x of report.containedPhrases.gone) console.log(`  GONE   ${x}`);
}
process.exit(failures.length ? 1 : 0);
