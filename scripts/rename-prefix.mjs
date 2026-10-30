#!/usr/bin/env node
/**
 * scripts/rename-prefix.mjs - the only writer of the vc- to vb- prefix rename (vibebelt-kit 1.0.0).
 *
 * Modes (exactly one):
 *   --dry-run            print every path rename and per-file change count; write nothing (dirty tree allowed)
 *   --apply              rewrite file contents, then rename paths deepest first (refused on a dirty tree)
 *   --list-scan-files    print every non-protected text file the apply examines (byte-sorted, one per line)
 *   --print-protected    print the protected set
 *   --gen-legacy <ref>   write legacy-hashes.json and merge the old-name entries of <ref> into legacyDeletions
 * Option: --root <dir>   repository work tree to operate on (default: git top level of the current directory)
 *
 * Last stdout line of --dry-run and --apply: RESULT edits=<files changed> renames=<paths renamed>.
 * Exit codes: 0 ok, 2 usage or git error, 3 dirty tree (apply refused, nothing written), 4 safety stop.
 * Zero dependencies (Node >= 22). Never follows symlinks; never writes outside --root.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

// ---- Protected set (the ONE definition; --print-protected prints it) --------------------------------
const TASK_FOLDER = 'process/general-plans/active/vibebelt-rebrand_29-10-26';
const PROTECTED = {
  segments: ['vibebelt-rebrand_29-10-26', '.git', 'node_modules'], // any path segment (task folder, active or archived)
  prefixes: ['scripts/fixtures/rename-prefix/'],
  exact: [
    'scripts/rename-prefix.mjs', 'scripts/test-rename-prefix.mjs', 'scripts/test-compute-sync-plan.mjs',
    'scripts/rename-prefix.allowlist.txt', 'scripts/rename-prefix.path-allowlist.txt',
    'legacy-hashes.json', 'CHANGELOG.md', 'MIGRATION.md', '.agents/skills',
  ],
  tag: 'legacy-vc-fallback',
  keepStart: 'rename-prefix:keep:start',
  keepEnd: 'rename-prefix:keep:end',
  jsonKey: '"legacyDeletions"',
};

// ---- Rules (case-sensitive, explicit) -----------------------------------------------------------
// Preceder rule: accepted when the previous char is not ASCII [A-Za-z0-9], or the previous two chars are
// the literal text \n (mermaid labels). So `dvc-` is never touched; `_vc-`, `.vc-`, `-vc-`, `/vc-` are.
const PRE = '(?:(?<![A-Za-z0-9])|(?<=\\\\n))';
const RULES = [
  { id: 'vc-', re: new RegExp(`${PRE}vc-`, 'g'), to: 'vb-' },
  { id: 'VC-', re: new RegExp(`${PRE}VC-`, 'g'), to: 'VB-' },
  { id: 'VC_', re: new RegExp(`${PRE}VC_`, 'g'), to: 'VB_' },
  { id: '.vc.json', re: /\.vc\.json/g, to: '.vb.json' },
  { id: 'vc plan check', re: new RegExp(`${PRE}vc plan check`, 'g'), to: 'vb plan check' },
  { id: 'vc plan uncheck', re: new RegExp(`${PRE}vc plan uncheck`, 'g'), to: 'vb plan uncheck' },
];
const AUTHOR_RE = /^([ \t]*)author: vibecode-pro-max-kit[ \t]*$/; // 7th rule: full line, indentation kept

class StopError extends Error {
  constructor(message, code) { super(message); this.code = code; }
}

const byteOrder = (a, b) => Buffer.compare(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));
const depth = (p) => p.split('/').length;

function git(root, args, input) {
  try {
    return execFileSync('git', args, { cwd: root, input, maxBuffer: 256 * 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (err) {
    throw new StopError(`git ${args.join(' ')} failed: ${String(err.stderr || err.message).trim()}`, 2);
  }
}

function isProtected(rel) {
  if (rel.split('/').some((seg) => PROTECTED.segments.includes(seg))) return true;
  if (PROTECTED.exact.includes(rel)) return true;
  return PROTECTED.prefixes.some((p) => rel.startsWith(p));
}

// One line through the 7 rules; returns [newLine, replacementCount, perRuleCounts].
function transformLine(line, tally) {
  let cr = '';
  if (line.endsWith('\r')) { cr = '\r'; line = line.slice(0, -1); }
  let n = 0;
  for (const rule of RULES) {
    line = line.replace(rule.re, () => { n++; tally[rule.id] = (tally[rule.id] || 0) + 1; return rule.to; });
  }
  const m = AUTHOR_RE.exec(line);
  if (m) { line = `${m[1]}author: vibebelt-kit`; n++; tally.author = (tally.author || 0) + 1; }
  return [line + cr, n];
}

// Content transform with the line-level protections (manifest legacyDeletions, tag, keep-regions).
function transformText(rel, text, tally) {
  const isManifest = path.posix.basename(rel).endsWith('manifest.json');
  const lines = text.split('\n');
  let inKeep = false;
  let inLegacy = false;
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (inKeep) { if (line.includes(PROTECTED.keepEnd)) inKeep = false; continue; }
    if (line.includes(PROTECTED.keepStart)) { inKeep = !line.includes(PROTECTED.keepEnd); continue; }
    if (line.includes(PROTECTED.keepEnd)) throw new StopError(`${rel}:${i + 1}: keep-region end without a start`, 4);
    if (inLegacy) { if (/^\s*\]/.test(line)) inLegacy = false; continue; }
    if (isManifest && line.includes(PROTECTED.jsonKey)) {
      inLegacy = !line.slice(line.indexOf(PROTECTED.jsonKey)).includes(']');
      continue;
    }
    if (line.includes(PROTECTED.tag)) continue;
    const [out, n] = transformLine(line, tally);
    if (n) { lines[i] = out; count += n; }
  }
  if (inKeep) throw new StopError(`${rel}: keep-region is never closed`, 4);
  if (inLegacy) throw new StopError(`${rel}: legacyDeletions array is never closed`, 4);
  return { text: lines.join('\n'), count };
}

function renameName(name) {
  let out = name;
  for (const rule of RULES) out = out.replace(rule.re, rule.to);
  return out;
}

// No ancestor of rel may be a symlink, and the real parent must stay inside the real root.
function makeInsideRoot(root) {
  const realRoot = fs.realpathSync(root);
  const cache = new Map();
  return (rel) => {
    const segs = rel.split('/');
    for (let i = 1; i < segs.length; i++) {
      const dir = segs.slice(0, i).join('/');
      if (!cache.has(dir)) {
        let ok = false;
        try { ok = !fs.lstatSync(path.join(root, dir)).isSymbolicLink(); } catch { ok = false; }
        cache.set(dir, ok);
      }
      if (!cache.get(dir)) return false;
    }
    const parent = fs.realpathSync(path.dirname(path.join(root, rel)));
    return parent === realRoot || parent.startsWith(realRoot + path.sep);
  };
}

// Tracked + untracked-not-ignored regular files that exist on disk, minus the protected set.
function candidates(root) {
  const listed = git(root, ['ls-files', '-z', '-c', '-o', '--exclude-standard']).toString('utf8').split('\0');
  const insideRoot = makeInsideRoot(root);
  const files = [];
  for (const rel of new Set(listed)) {
    if (!rel || isProtected(rel) || rel.includes('\\') || rel.split('/').includes('..')) continue;
    let st;
    try { st = fs.lstatSync(path.join(root, rel)); } catch { continue; } // listed but missing on disk (R-w)
    if (!st.isFile()) continue; // symlinks and special files are never followed or edited
    if (!insideRoot(rel)) continue;
    files.push(rel);
  }
  return files.sort(byteOrder);
}

function readText(root, rel) {
  const buf = fs.readFileSync(path.join(root, rel));
  if (buf.subarray(0, 8000).includes(0)) return null; // binary guard
  return buf.toString('latin1'); // byte-exact round trip; all rules are ASCII
}

function scanFiles(root) {
  return candidates(root).filter((rel) => readText(root, rel) !== null);
}

function plan(root) {
  const files = candidates(root);
  const tally = {};
  const edits = [];
  for (const rel of files) {
    const text = readText(root, rel);
    if (text === null) continue;
    const { text: out, count } = transformText(rel, text, tally);
    if (count) edits.push({ rel, count, out });
  }
  const paths = new Set();
  for (const rel of files) {
    const segs = rel.split('/');
    for (let i = 1; i <= segs.length; i++) paths.add(segs.slice(0, i).join('/'));
  }
  const renames = [];
  for (const p of paths) {
    if (isProtected(p)) continue;
    const base = path.posix.basename(p);
    const next = renameName(base);
    if (next !== base) renames.push({ from: p, to: path.posix.join(path.posix.dirname(p), next) });
  }
  renames.sort((a, b) => depth(b.from) - depth(a.from) || byteOrder(a.from, b.from));
  const targets = new Set();
  for (const r of renames) {
    if (targets.has(r.to)) throw new StopError(`two paths would be renamed to ${r.to}`, 4);
    targets.add(r.to);
    let exists = true;
    try { fs.lstatSync(path.join(root, r.to)); } catch { exists = false; }
    if (exists) throw new StopError(`rename target already exists: ${r.to}`, 4);
  }
  return { edits, renames, tally };
}

function report(result) {
  for (const e of result.edits) console.log(`EDIT ${e.count} ${e.rel}`);
  for (const r of result.renames) console.log(`RENAME ${r.from} -> ${r.to}`);
  const t = result.tally;
  console.log(`RULES ${['vc-', 'VC-', 'VC_', '.vc.json', 'vc plan check', 'vc plan uncheck', 'author'].map((k) => `${k}=${t[k] || 0}`).join(' ')}`);
  console.log(`RESULT edits=${result.edits.length} renames=${result.renames.length}`);
}

function dirtyStatus(root) {
  return git(root, ['status', '--porcelain', '--', '.', `:(exclude)${TASK_FOLDER}`]).toString('utf8').trim();
}

function apply(root) {
  const dirty = dirtyStatus(root);
  if (dirty) {
    throw new StopError(`REFUSED: the tree is dirty outside ${TASK_FOLDER} (commit first; nothing was written):\n${dirty}`, 3);
  }
  const result = plan(root); // every check runs before the first write
  for (const e of result.edits) fs.writeFileSync(path.join(root, e.rel), Buffer.from(e.out, 'latin1'));
  for (const r of result.renames) fs.renameSync(path.join(root, r.from), path.join(root, r.to));
  report(result);
}

// ---- --gen-legacy <ref>: generated legacy lists (never edited by hand) ----------------------------
const LEGACY_ENTRY_RES = [
  /^(\.claude\/agents\/vc-[^/]+)$/,
  /^(\.claude\/skills\/vc-[^/]+)(?:\/|$)/,
  /^(\.codex\/agents\/vc-[^/]+\.toml)$/,
  /^(\.(?:claude|codex)\/hooks\/lib\/(?:__tests__\/)?vc-[^/]+)$/,
  /^(process\/development-protocols\/vc-[^/]+)(?:\/|$)/,
];

function legacyEntryOf(p) {
  for (const re of LEGACY_ENTRY_RES) {
    const m = re.exec(p);
    if (m) return m[1];
  }
  return null;
}

function treeEntries(root, commit) {
  const raw = git(root, ['ls-tree', '-r', '-z', '--full-tree', commit]).toString('utf8').split('\0').filter(Boolean);
  return raw.map((line) => {
    const [meta, p] = line.split('\t');
    const [mode, type, sha] = meta.split(' ');
    return { mode, type, sha, path: p };
  });
}

function blobSha256(root, shas) {
  const out = git(root, ['cat-file', '--batch'], shas.join('\n') + '\n');
  const result = new Map();
  let pos = 0;
  for (const sha of shas) {
    const nl = out.indexOf(0x0a, pos);
    const [gotSha, , size] = out.subarray(pos, nl).toString('utf8').split(' ');
    if (gotSha !== sha) throw new StopError(`cat-file returned ${gotSha} for ${sha}`, 2);
    const start = nl + 1;
    const end = start + Number(size);
    result.set(sha, crypto.createHash('sha256').update(out.subarray(start, end)).digest('hex'));
    pos = end + 1; // trailing newline after each object
  }
  return result;
}

function mergeLegacyDeletions(text, additions) {
  const lines = text.split('\n');
  const start = lines.findIndex((l) => l.includes(PROTECTED.jsonKey));
  if (start < 0) throw new StopError('manifest has no legacyDeletions array', 4);
  let end = start + 1;
  while (end < lines.length && !/^\s*\]/.test(lines[end])) end++;
  if (end >= lines.length) throw new StopError('manifest legacyDeletions array is never closed', 4);
  const existing = lines.slice(start + 1, end).map((l) => JSON.parse(l.trim().replace(/,$/, '')));
  const merged = existing.concat(additions.filter((a) => !existing.includes(a)));
  const indent = (lines[start + 1] || '').match(/^\s*/)[0] || `${lines[start].match(/^\s*/)[0]}  `;
  const body = merged.map((e, i) => `${indent}${JSON.stringify(e)}${i < merged.length - 1 ? ',' : ''}`);
  return { text: [...lines.slice(0, start + 1), ...body, ...lines.slice(end)].join('\n'), merged, added: merged.length - existing.length };
}

function genLegacy(root, ref) {
  const commit = git(root, ['rev-parse', '--verify', `${ref}^{commit}`]).toString('utf8').trim();
  const tree = treeEntries(root, commit);
  const manifestName = ['vb-manifest.json', 'vc-manifest.json'].find((n) => fs.existsSync(path.join(root, n)));
  if (!manifestName) throw new StopError('no vb-manifest.json or vc-manifest.json in --root', 2);
  const manifestPath = path.join(root, manifestName);
  const manifestText = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestText);
  const entries = new Set();
  const hashedBlobs = [];
  for (const e of tree) {
    const entry = legacyEntryOf(e.path);
    if (!entry) continue;
    entries.add(entry);
    if (e.type === 'blob' && (e.mode === '100644' || e.mode === '100755')) hashedBlobs.push(e);
  }
  const shaMap = blobSha256(root, [...new Set(hashedBlobs.map((b) => b.sha))]);
  const hashed = {};
  for (const b of hashedBlobs.sort((a, c) => byteOrder(a.path, c.path))) hashed[b.path] = shaMap.get(b.sha);
  const inTree = (entry) => tree.some((e) => e.path === entry || e.path.startsWith(`${entry}/`));
  const snapshotGated = (manifest.legacyDeletions || []).filter((e) => !inTree(e));
  const additions = [...entries].sort(byteOrder);
  const { text, merged, added } = mergeLegacyDeletions(manifestText, additions);
  const check = JSON.parse(text);
  if (JSON.stringify({ ...check, legacyDeletions: null }) !== JSON.stringify({ ...manifest, legacyDeletions: null })
    || JSON.stringify(check.legacyDeletions) !== JSON.stringify(merged)) {
    throw new StopError('manifest merge changed more than legacyDeletions', 4);
  }
  const out = {
    schema: 1,
    note: 'Generated by scripts/rename-prefix.mjs --gen-legacy from the upstream-baseline tag; never edit by hand. hashed: old kit file -> sha256 of its content in that tag (deleted on update only when byte-identical). snapshotGated: older deprecated entries with no file in that tag (deleted only when every file under them is in the project install snapshot).',
    source: ref,
    sourceCommit: commit,
    hashed,
    snapshotGated,
  };
  fs.writeFileSync(path.join(root, 'legacy-hashes.json'), `${JSON.stringify(out, null, 2)}\n`);
  if (added) fs.writeFileSync(manifestPath, text);
  console.log(`legacy entries=${additions.length} (added ${added}) hashed=${Object.keys(hashed).length} snapshotGated=${snapshotGated.length} manifest=${manifestName}`);
}

// ---- CLI ---------------------------------------------------------------------------------------
function printProtected() {
  for (const s of PROTECTED.segments) console.log(`path segment: ${s}`);
  for (const p of PROTECTED.prefixes) console.log(`path prefix: ${p}`);
  for (const e of PROTECTED.exact) console.log(`exact path: ${e}`);
  console.log(`json: string values of the legacyDeletions array in any *manifest.json (line state machine)`);
  console.log(`tag: any line containing ${PROTECTED.tag}`);
  console.log(`keep-region: lines from ${PROTECTED.keepStart} to ${PROTECTED.keepEnd} (markers inclusive)`);
  console.log('text-only: files with a NUL byte in the first 8000 bytes; symlinks are never followed (lstat)');
}

function main(argv) {
  const modes = ['--dry-run', '--apply', '--list-scan-files', '--print-protected', '--gen-legacy'];
  const chosen = modes.filter((m) => argv.includes(m));
  const rootIdx = argv.indexOf('--root');
  if (chosen.length !== 1 || (rootIdx !== -1 && !argv[rootIdx + 1])) {
    throw new StopError(`usage: rename-prefix.mjs (${modes.join(' | ')} <ref>) [--root <dir>]`, 2);
  }
  const mode = chosen[0];
  if (mode === '--print-protected') return printProtected();
  const start = rootIdx !== -1 ? path.resolve(argv[rootIdx + 1]) : process.cwd();
  if (!fs.existsSync(start) || !fs.statSync(start).isDirectory()) throw new StopError(`--root is not a directory: ${start}`, 2);
  const root = rootIdx !== -1 ? start : git(start, ['rev-parse', '--show-toplevel']).toString('utf8').trim();
  git(root, ['rev-parse', '--is-inside-work-tree']);
  if (mode === '--list-scan-files') { for (const f of scanFiles(root)) console.log(f); return; }
  if (mode === '--dry-run') return report(plan(root));
  if (mode === '--apply') return apply(root);
  const ref = argv[argv.indexOf('--gen-legacy') + 1];
  if (!ref || ref.startsWith('--')) throw new StopError('--gen-legacy needs a git ref (for example upstream-baseline)', 2);
  return genLegacy(root, ref);
}

try {
  main(process.argv.slice(2));
} catch (err) {
  if (err instanceof StopError) { console.error(err.message); process.exit(err.code); }
  console.error(err.stack || String(err));
  process.exit(4);
}
