#!/usr/bin/env node
// Model and effort policy check for the Claude agents.
//
// Reads the front-matter of every `.claude/agents/*.md` file and compares it with
// the documented policy table below. It checks:
//   1. the `model:` of all 15 named vc-agents (7 on opus, 8 on sonnet);
//   2. `effort: max` on the three code-writing agents (execute, fast-mode, quick-fix);
//   3. `effort: low` on vc-git-manager.
// No other effort value is checked, because no document defines one.
//
// Source of the table: CLAUDE.md §Model Selection Policy and
// process/development-protocols/implementation-standards.md §Agent Frontmatter Conventions.
//
// Usage:
//   node .claude/skills/vc-audit-vc/scripts/validate-model-effort-policy.mjs [--root <dir>]
// `--root` is optional and defaults to the repository root (same convention as
// validate-kit-portability.mjs). Exit 0 = everything matches, exit 1 = something differs.

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const POLICY = {
  "vc-execute-agent": { model: "opus", effort: "max" },
  "vc-fast-mode-agent": { model: "opus", effort: "max" },
  "vc-quick-fix-agent": { model: "opus", effort: "max" },
  "vc-plan-agent": { model: "opus" },
  "vc-research-agent": { model: "opus" },
  "vc-tester": { model: "opus" },
  "vc-validate-agent": { model: "opus" },
  "vc-git-manager": { model: "sonnet", effort: "low" },
  "vc-update-process-agent": { model: "sonnet" },
  "vc-innovate-agent": { model: "sonnet" },
  "vc-spec-agent": { model: "sonnet" },
  "vc-ui-ux-designer": { model: "sonnet" },
  "vc-code-simplifier": { model: "sonnet" },
  "vc-debugger": { model: "sonnet" },
  "vc-code-reviewer": { model: "sonnet" },
};

const rootFlagIndex = process.argv.indexOf("--root");
let root;
if (rootFlagIndex !== -1) {
  root = path.resolve(process.argv[rootFlagIndex + 1] ?? "");
} else {
  try {
    root = execSync("git rev-parse --show-toplevel", { stdio: ["pipe", "pipe", "pipe"] }).toString().trim();
  } catch {
    root = process.cwd();
  }
}

const agentsDir = path.join(root, ".claude", "agents");
if (!fs.existsSync(agentsDir)) {
  console.error(`Cannot check the agent model policy: the folder ${agentsDir} does not exist.`);
  process.exit(1);
}

function readFrontMatter(file) {
  const text = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*?)\s*$/);
    if (m) fields[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return fields;
}

const problems = [];
let checked = 0;

for (const [agent, expected] of Object.entries(POLICY)) {
  const file = path.join(agentsDir, `${agent}.md`);
  if (!fs.existsSync(file)) {
    problems.push(`${agent}: the agent file is missing, expected .claude/agents/${agent}.md`);
    continue;
  }
  const fm = readFrontMatter(file);
  if (!fm) {
    problems.push(`${agent}: the file has no front-matter block at the top, expected model ${expected.model}`);
    continue;
  }
  checked += 1;
  for (const field of ["model", "effort"]) {
    if (!(field in expected)) continue;
    const actual = fm[field];
    if (actual === undefined || actual === "") {
      problems.push(`${agent}: ${field} is not set, expected ${expected[field]}`);
    } else if (actual !== expected[field]) {
      problems.push(`${agent}: ${field} is ${actual}, expected ${expected[field]}`);
    }
  }
}

if (problems.length > 0) {
  console.error("Agent model/effort policy check FAILED. These agents differ from the documented policy:");
  for (const p of problems) console.error(`  - ${p}`);
  console.error(`${problems.length} problem(s) found. Fix the front-matter line named above (or update the policy table and its documentation together).`);
  process.exit(1);
}

console.log(`Agent model/effort policy check passed: ${checked} agents match the documented policy (7 on opus, 8 on sonnet; effort max on execute, fast-mode and quick-fix; effort low on git-manager).`);
