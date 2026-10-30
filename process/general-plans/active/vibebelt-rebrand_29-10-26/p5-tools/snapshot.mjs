#!/usr/bin/env node
// Phase 5 Step 0.2 pre-change snapshot (items b and c). Item a (pre-skill-folders.txt) is the
// plan's shell command `ls -d .claude/skills/*/ | LC_ALL=C sort`, so its format matches the
// Exit Gate's post-skill-folders.txt byte for byte.
//
// Usage (from the repo root): node <p5-tools>/snapshot.mjs [--out <dir>]
//   (b) <out>/pre-triggers.json: per skill, the top-3 and the full trigger_keywords list
//       (lowercased, front-matter order), plus description and layer, read from each
//       .claude/skills/*/SKILL.md front-matter (not from the catalog).
//   (c) <out>/pre-catalog.json: copy of process/context/generated-skills-catalog.json, made
//       ONLY when generate-skills-catalog.mjs --check exits 0; otherwise the copy is skipped
//       and the staleness is printed (rely on a + b).
// Safety: exits 2 without writing if .claude/skills has uncommitted changes (the snapshot must
// equal HEAD) or if an output file already exists (a pre-change snapshot is never overwritten).
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { listSkillFolders, readSkill, triggerList, gitTopLevel, parseArgs, here } from "./lib.mjs";

let args;
try {
  args = parseArgs(process.argv.slice(2), ["--out"], []);
} catch (err) {
  console.error(err.message);
  process.exit(2);
}
const root = gitTopLevel();
const outDir = path.resolve(args.out || here(import.meta.url));
const triggersOut = path.join(outDir, "pre-triggers.json");
const catalogOut = path.join(outDir, "pre-catalog.json");

const dirty = execFileSync("git", ["status", "--porcelain", "--", ".claude/skills"], { cwd: root, encoding: "utf8" });
if (dirty.trim()) {
  console.error("refusing: .claude/skills has uncommitted changes; the snapshot must equal HEAD");
  process.exit(2);
}
for (const file of [triggersOut, catalogOut]) {
  if (fs.existsSync(file)) {
    console.error(`refusing: ${file} already exists (a pre-change snapshot is never overwritten)`);
    process.exit(2);
  }
}

const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
const skills = {};
for (const folder of listSkillFolders(root)) {
  const skill = readSkill(root, folder);
  if (!skill || !skill.parsed) {
    console.error(`refusing: ${folder}/SKILL.md missing or has no front-matter`);
    process.exit(2);
  }
  const all = triggerList(skill.parsed.fields);
  skills[folder] = {
    top3: all.slice(0, 3),
    all,
    description: skill.parsed.fields.description || "",
    layer: skill.parsed.fields.layer || "",
  };
}

const snapshot = {
  purpose: "Phase 5 pre-change routing snapshot (plan Step 0.2 b); read by routing-check.mjs",
  sourceHead: head,
  runtime: `node ${process.version}`,
  skillCount: Object.keys(skills).length,
  skills,
};
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(triggersOut, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`wrote ${path.relative(root, triggersOut)} (${snapshot.skillCount} skills, HEAD ${head.slice(0, 7)})`);

const check = spawnSync(process.execPath, [".claude/skills/vc-audit-context/scripts/generate-skills-catalog.mjs", "--check"], {
  cwd: root,
  encoding: "utf8",
});
if (check.status === 0) {
  fs.copyFileSync(path.join(root, "process/context/generated-skills-catalog.json"), catalogOut);
  console.log(`catalog --check exit 0: copied to ${path.relative(root, catalogOut)}`);
} else {
  console.log(`catalog --check exit ${check.status}: catalog is stale, pre-catalog.json NOT written (record this; rely on a + b)`);
}
