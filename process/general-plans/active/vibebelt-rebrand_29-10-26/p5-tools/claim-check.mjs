#!/usr/bin/env node
// Phase 5 Step 0.4a claim check (Phase 5's own copy; validate-contract E4).
// Usage: <repo-relative paths, one per line> | node <p5-tools>/claim-check.mjs <claim.globs>
// claim.globs: one glob per line; a leading `!` marks an exclude; blank lines and `#` lines ignored.
// Glob syntax: `**` = any characters including `/`; `*` = any characters except `/`;
// `?` = one character except `/`. Matching is case-sensitive and anchored to the whole path.
// A path is inside the claim when it matches at least one include glob and no exclude glob.
// Prints every input path that is outside the claim, one per line.
// Exit 0 = nothing outside; 1 = at least one path outside; 2 = usage error, an unreadable globs
// file, no include glob, or a glob that still holds a shell variable (`$`; write expanded paths).
import fs from "node:fs";

const globsPath = process.argv[2];
if (!globsPath || process.argv.length > 3) {
  console.error("usage: <paths on stdin> | node claim-check.mjs <claim.globs>");
  process.exit(2);
}
let text;
try {
  text = fs.readFileSync(globsPath, "utf8");
} catch (err) {
  console.error(`cannot read ${globsPath}: ${err.message}`);
  process.exit(2);
}

function toRegExp(glob) {
  let re = "";
  for (let i = 0; i < glob.length; i += 1) {
    const c = glob[i];
    if (c === "*" && glob[i + 1] === "*") {
      re += ".*";
      i += 1;
    } else if (c === "*") {
      re += "[^/]*";
    } else if (c === "?") {
      re += "[^/]";
    } else {
      re += c.replace(/[.+^${}()|[\]\\]/g, "\\$&");
    }
  }
  return new RegExp(`^${re}$`);
}

const include = [];
const exclude = [];
for (const raw of text.split("\n")) {
  const line = raw.trim();
  if (!line || line.startsWith("#")) continue;
  if (line.includes("$")) {
    console.error(`claim glob holds an unexpanded variable, write the expanded path: ${line}`);
    process.exit(2);
  }
  if (line.startsWith("!")) exclude.push(toRegExp(line.slice(1)));
  else include.push(toRegExp(line));
}
if (include.length === 0) {
  console.error(`no include glob in ${globsPath}`);
  process.exit(2);
}

const input = fs.readFileSync(0, "utf8");
const outside = input.split("\n")
  .map((p) => p.trim())
  .filter(Boolean)
  .filter((p) => !(include.some((r) => r.test(p)) && !exclude.some((r) => r.test(p))));
if (outside.length) console.log(outside.join("\n"));
process.exit(outside.length ? 1 : 0);
