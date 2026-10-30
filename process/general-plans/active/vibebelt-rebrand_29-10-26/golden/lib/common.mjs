// golden/lib/common.mjs: shared helpers for the Phase 3 harness scripts of the vibebelt-rebrand
// program (signal-census.mjs, gen-guardrails.mjs, run-record.mjs). No network, no model call.
import fs from 'node:fs';
import path from 'node:path';

/** Thrown for bad command-line input; callers print usage and exit 2. */
export class UsageError extends Error {}

/**
 * Agent files are found by DIRECTORY LISTING of top-level regular files only (never a vc-* glob):
 * `.claude/agents/*.md` and `.codex/agents/*.toml`. Subfolders and other extensions are ignored.
 */
export const AGENT_DIRS = Object.freeze([
  Object.freeze({ kind: 'md', dir: '.claude/agents', ext: '.md' }),
  Object.freeze({ kind: 'toml', dir: '.codex/agents', ext: '.toml' }),
]);

/** Plain UTF-16 code-unit comparison (same order as `LC_ALL=C sort` for this text). */
export function compareCodeUnits(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/** Agent key = file name without extension, with a leading `vc-` or `vb-` removed. */
export function agentKey(fileName, ext) {
  return fileName.slice(0, fileName.length - ext.length).replace(/^v[cb]-/, '');
}

/**
 * Lists the agent files of a tree, sorted by relative path.
 * @param {string} root absolute tree root
 * @returns {{kind: 'md'|'toml', rel: string, abs: string, key: string}[]}
 */
export function listAgentFiles(root) {
  const files = [];
  for (const { kind, dir, ext } of AGENT_DIRS) {
    let entries;
    try {
      entries = fs.readdirSync(path.join(root, dir), { withFileTypes: true });
    } catch (err) {
      if (err.code === 'ENOENT' || err.code === 'ENOTDIR') continue;
      throw err;
    }
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(ext)) continue;
      files.push({
        kind,
        rel: `${dir}/${entry.name}`,
        abs: path.join(root, dir, entry.name),
        key: agentKey(entry.name, ext),
      });
    }
  }
  return files.sort((a, b) => compareCodeUnits(a.rel, b.rel));
}

/** Normalises Windows line endings to `\n`. */
export function toLf(text) {
  return text.replace(/\r\n/g, '\n');
}

/**
 * Minimal option parser. `spec` maps an option name to 'value' or 'bool'.
 * Unknown options, a missing value or too many positional arguments throw UsageError.
 */
export function parseFlags(argv, spec, maxPositionals = 0) {
  const flags = {};
  const positionals = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) {
      positionals.push(arg);
      continue;
    }
    const type = spec[arg];
    if (type === undefined) throw new UsageError(`unknown option ${arg}`);
    if (type === 'bool') {
      flags[arg] = true;
      continue;
    }
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) throw new UsageError(`${arg} needs a value`);
    flags[arg] = value;
    i += 1;
  }
  if (positionals.length > maxPositionals) {
    throw new UsageError(`unexpected argument ${positionals[maxPositionals]}`);
  }
  return { flags, positionals };
}

/** Resolves `--root` (default: current directory); it must be an existing directory. */
export function resolveRoot(value) {
  const root = path.resolve(value ?? process.cwd());
  let stat = null;
  try {
    stat = fs.statSync(root);
  } catch {
    stat = null;
  }
  if (!stat || !stat.isDirectory()) throw new UsageError(`not a directory: ${value}`);
  return root;
}

/** Writes `text` to `outFile` (parent folders created) or, without a file, to stdout. */
export function writeResult(text, outFile) {
  if (outFile === undefined) {
    process.stdout.write(text);
    return;
  }
  fs.mkdirSync(path.dirname(path.resolve(outFile)), { recursive: true });
  fs.writeFileSync(outFile, text);
}
