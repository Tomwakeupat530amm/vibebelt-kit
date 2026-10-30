// Shared helpers for the Phase 5 task-folder tools (snapshot, routing-check,
// conservation-check). Self-contained on purpose: no import from .claude/skills,
// so the tools keep working when run against a copy (--root) and do not depend on
// the skill folder names that Phase 6 renames.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// Same regex and logic as .claude/skills/vc-audit-context/scripts/shared-skill-utils.mjs
// parseFrontmatterText, so these tools read front-matter exactly like the repo tools do.
export function parseFrontmatterText(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fields = {};
  const keys = [];
  const lines = match[1].split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const item = lines[index].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!item) continue;
    const [, key, rawValue] = item;
    keys.push(key);
    if (rawValue === ">-" || rawValue === "|" || rawValue === ">") {
      const blockLines = [];
      let cursor = index + 1;
      while (cursor < lines.length && /^  /.test(lines[cursor])) {
        blockLines.push(lines[cursor].replace(/^  /, ""));
        cursor += 1;
      }
      fields[key] = blockLines.join(" ").trim();
      index = cursor - 1;
      continue;
    }
    fields[key] = rawValue.replace(/^["']|["']$/g, "");
  }
  return { fields, keys };
}

// Lowercased trigger_keywords list in front-matter order (same split as the catalog generator).
export function triggerList(fields) {
  return (fields.trigger_keywords || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

// Body = everything after the closing front-matter delimiter (same cut as the X5 awk gate:
// lines after the second line that is exactly "---").
export function bodyLines(text) {
  const lines = text.split("\n");
  let seen = 0;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i] === "---") {
      seen += 1;
      if (seen === 2) return lines.slice(i + 1);
    }
  }
  return [];
}

export function listSkillFolders(root) {
  const dir = path.join(root, ".claude/skills");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function readSkill(root, folder) {
  const file = path.join(root, ".claude/skills", folder, "SKILL.md");
  if (!fs.existsSync(file)) return null;
  const text = fs.readFileSync(file, "utf8");
  return { text, parsed: parseFrontmatterText(text) };
}

// Repo-root git helpers (always the real repo the tool is called from, never --root).
export function gitTopLevel() {
  return execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
}

export function gitShow(sha, relPath) {
  try {
    return execFileSync("git", ["show", `${sha}:${relPath}`], {
      cwd: gitTopLevel(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

// Minimal flag parser: --name value pairs plus bare --flags.
export function parseArgs(argv, valueFlags, boolFlags) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (valueFlags.includes(a)) {
      if (i + 1 >= argv.length) throw new Error(`${a} needs a value`);
      out[a.slice(2)] = argv[i + 1];
      i += 1;
    } else if (boolFlags.includes(a)) {
      out[a.slice(2)] = true;
    } else if (a.startsWith("--")) {
      throw new Error(`unknown flag: ${a}`);
    } else {
      out._.push(a);
    }
  }
  return out;
}

// Directory of the calling script; fileURLToPath keeps node.exe (Windows) paths valid.
export const here = (importMetaUrl) => path.dirname(fileURLToPath(importMetaUrl));
