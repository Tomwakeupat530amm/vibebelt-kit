#!/usr/bin/env node
/**
 * check-links.mjs - C-CLEAN gate CC3 (umbrella "Clean Final Tree", Phase 8 step C0a).
 *
 * Every relative link target in the five kept front-door docs must resolve to a TRACKED path:
 *   README.md (Vietnamese), docs/i18n/README.en.md (English), CONTRIBUTING.md, CHANGELOG.md, SECURITY.md
 * Link forms: markdown `](target)`, `href="target"`, `src="target"`.
 * Skipped: http(s)://, mailto:, other URI schemes, `#anchor`-only targets, fenced code blocks.
 * A `#fragment` or `?query` is stripped; the rest is resolved relative to the file's folder.
 * A target resolves when it is a tracked file, or a folder holding at least one tracked file.
 * Switcher rule: README.md links to no docs/i18n/README.* page other than docs/i18n/README.en.md.
 *
 * Usage: node check-links.mjs [--repo <dir>]      (default: the current directory)
 * Exit: 0 all links resolve; 1 dead link or switcher violation; 2 usage or git error.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DOCS = ['README.md', 'docs/i18n/README.en.md', 'CONTRIBUTING.md', 'CHANGELOG.md', 'SECURITY.md'];
const LINK_RES = [/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g, /href="([^"]+)"/g, /src="([^"]+)"/g];

function usage(msg) {
  console.error(`check-links: ${msg}\nusage: node check-links.mjs [--repo <dir>]`);
  process.exit(2);
}

const argv = process.argv.slice(2);
let repo = process.cwd();
for (let i = 0; i < argv.length; i += 1) {
  if (argv[i] === '--repo' && argv[i + 1]) { repo = path.resolve(argv[i + 1]); i += 1; }
  else usage(`unknown argument ${argv[i]}`);
}

let tracked;
try {
  tracked = execFileSync('git', ['-C', repo, 'ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
} catch (e) {
  usage(`git ls-files failed in ${repo}: ${e.message}`);
}
const trackedFiles = new Set(tracked);
const trackedDirs = new Set();
for (const f of tracked) {
  const parts = f.split('/');
  for (let i = 1; i < parts.length; i += 1) trackedDirs.add(parts.slice(0, i).join('/'));
}

const problems = [];
let checked = 0;
for (const doc of DOCS) {
  const abs = path.join(repo, doc);
  if (!trackedFiles.has(doc) || !fs.existsSync(abs)) { problems.push(`MISSING-DOC ${doc}`); continue; }
  const lines = fs.readFileSync(abs, 'utf8').split('\n');
  let inFence = false;
  lines.forEach((line, idx) => {
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; return; }
    if (inFence) return;
    for (const re of LINK_RES) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line)) !== null) {
        const raw = m[1].trim();
        if (/^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith('#') || raw.startsWith('//')) continue;
        const target = decodeURI(raw.split('#')[0].split('?')[0]);
        if (!target) continue;
        const rel = path.posix.normalize(path.posix.join(path.posix.dirname(doc), target)).replace(/\/$/, '');
        checked += 1;
        if (rel.startsWith('..') || !(trackedFiles.has(rel) || trackedDirs.has(rel))) {
          problems.push(`DEAD ${doc}:${idx + 1} ${raw} -> ${rel}`);
        }
        if (doc === 'README.md' && /^docs\/i18n\/README\./.test(rel) && rel !== 'docs/i18n/README.en.md') {
          problems.push(`SWITCHER ${doc}:${idx + 1} links ${rel} (only docs/i18n/README.en.md is allowed)`);
        }
      }
    }
  });
}

for (const p of problems) console.log(p);
if (problems.length) {
  console.log(`CC3 FAIL: ${problems.length} problem(s) in ${checked} relative link(s)`);
  process.exit(1);
}
console.log(`CC3 OK: ${checked} relative link(s) in ${DOCS.length} docs resolve to tracked paths`);
