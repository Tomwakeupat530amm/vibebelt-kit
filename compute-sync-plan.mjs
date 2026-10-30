#!/usr/bin/env node
/**
 * compute-sync-plan.mjs
 * Pure deterministic computation of the sync plan between a kit and a target project.
 * No side effects — reads files, never writes.
 *
 * Usage (CLI):
 *   node compute-sync-plan.mjs --root <projectRoot> --kit-root <kitRoot> [--json]
 *   node compute-sync-plan.mjs --root <projectRoot> --kit-root <kitRoot> --legacy-gate < candidates
 *     (install.sh interface: one candidate path per stdin line; one output line per decided file:
 *      <candidate> TAB DELETE|KEEP|UNGATED TAB <path> [TAB <reason>])
 *
 * Exports:
 *   default: computeSyncPlan(opts) → { toAdd, toModify, toDelete, toPreserve, staleWarnings }
 *   isKitOwned(filePath) → boolean
 *   legacy gate: loadLegacyHashes, readPriorSnapshot, isLegacyGated, decideLegacy
 *   kit file names: MANIFEST_NAME, SNAPSHOT_FILE, VERSION_FILE and their OLD_ (pre-rename) names
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Kit file names. Projects and kits from before the prefix rename use the old names: they are
// still read as a fallback, and --apply replaces the old state files with the new ones.
export const MANIFEST_NAME = 'vc-manifest.json';
export const OLD_MANIFEST_NAME = 'vc-manifest.json'; // legacy-vc-fallback
export const SNAPSHOT_FILE = '.vc-installed-files';
export const OLD_SNAPSHOT_FILE = '.vc-installed-files'; // legacy-vc-fallback
export const VERSION_FILE = '.vc-version';
export const OLD_VERSION_FILE = '.vc-version'; // legacy-vc-fallback
const OLD_PREFIX = 'vc-'; // legacy-vc-fallback: name prefix of kit paths before the rename

/**
 * Returns true when a relative file path falls within the kit-owned namespace.
 * Only kit-owned files may be deleted during stale removal. Old-prefix paths are kit-owned
 * too, but they are always decided by the legacy gate below before this check is reached.
 */
export function isKitOwned(filePath) {
  return (
    filePath.startsWith('.claude/skills/vc-') ||
    filePath.startsWith('.claude/agents/vc-') ||
    filePath.startsWith(`.claude/skills/${OLD_PREFIX}`) || // legacy-vc-fallback
    filePath.startsWith(`.claude/agents/${OLD_PREFIX}`) || // legacy-vc-fallback
    filePath.startsWith('.claude/hooks/') ||
    filePath.startsWith('.codex/') ||
    filePath.startsWith('process/development-protocols/') ||
    filePath.startsWith('process/context/planning/') ||
    filePath.startsWith('process/_seeds/') ||
    filePath === 'process/context/generated-skills-catalog.json' ||
    filePath === 'CLAUDE.md' ||
    filePath === 'AGENTS.md' ||
    filePath === SNAPSHOT_FILE ||
    filePath === VERSION_FILE ||
    filePath === OLD_SNAPSHOT_FILE ||
    filePath === OLD_VERSION_FILE ||
    filePath.startsWith('.agents/')
  );
}

// ── Legacy gate ──────────────────────────────────────────────────────────────────
// ONE decision for every deletion of an old kit path: compute-sync-plan steps 3 and 4 below, and
// both deletion blocks of install.sh (through --legacy-gate). A file is deleted only when it is
// provably an unchanged kit file:
//   - `hashed` (legacy-hashes.json): its sha256 equals the recorded hash of the old kit file;
//   - `snapshotGated` entry: every file under the entry is listed in the old install snapshot.
// Everything else is kept and reported: modified, unknown, not a regular file, no install
// snapshot, or a kit without legacy-hashes.json (older kit source). Paths the kit itself still
// ships are never treated as legacy. Symlinks are never followed.

/** Loads `legacy-hashes.json` from the kit, or null when it is missing or malformed. */
export function loadLegacyHashes(kitRoot) {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(kitRoot, 'legacy-hashes.json'), 'utf8'));
    if (!raw || typeof raw.hashed !== 'object' || raw.hashed === null || !Array.isArray(raw.snapshotGated)) return null;
    return {
      hashed: new Map(Object.entries(raw.hashed).filter(([, v]) => typeof v === 'string')),
      snapshotGated: raw.snapshotGated.filter((e) => typeof e === 'string' && e.length > 0),
    };
  } catch {
    return null;
  }
}

/** Reads the prior install snapshot: the current name first, then the pre-rename name. */
export function readPriorSnapshot(projectRoot) {
  for (const name of [SNAPSHOT_FILE, OLD_SNAPSHOT_FILE]) {
    try {
      const raw = fs.readFileSync(path.join(projectRoot, name), 'utf8');
      return { files: [...new Set(raw.split('\n').map((l) => l.trim()).filter(Boolean))], source: name };
    } catch {
      // not present under this name
    }
  }
  return { files: [], source: null };
}

const underEntry = (rel, entry) => rel === entry || rel.startsWith(`${entry}/`);

/** True when rel must be decided by the legacy gate (old-prefix segment or snapshot-gated entry). */
export function isLegacyGated(rel, legacy) {
  if (rel.split('/').some((seg) => seg.startsWith(OLD_PREFIX))) return true;
  return Boolean(legacy && legacy.snapshotGated.some((e) => underEntry(rel, e)));
}

// Regular files at or under rel, without following symlinks; `odd` = symlinks and special files.
function listFilesNoFollow(projectRoot, rel) {
  const files = [];
  const odd = [];
  (function walk(r) {
    let st;
    try { st = fs.lstatSync(path.join(projectRoot, r)); } catch { return; }
    if (st.isFile()) files.push(r);
    else if (st.isDirectory()) for (const name of fs.readdirSync(path.join(projectRoot, r)).sort()) walk(`${r}/${name}`);
    else odd.push(r);
  })(rel);
  return { files, odd };
}

function sha256File(absPath) {
  return crypto.createHash('sha256').update(fs.readFileSync(absPath)).digest('hex');
}

/**
 * Decides one gated candidate (a file or a folder entry).
 * @returns {{ del: string[], keep: {path: string, reason: string}[] }} files to delete / to keep and report
 */
export function decideLegacy(projectRoot, kitRoot, rel, legacy, snapshotSet) {
  if (!rel || path.isAbsolute(rel) || rel.split('/').includes('..')) {
    return { del: [], keep: [{ path: rel, reason: 'unsafe path' }] };
  }
  const listed = listFilesNoFollow(projectRoot, rel);
  const shippedByKit = (p) => fs.existsSync(path.join(kitRoot, p));
  const files = listed.files.filter((f) => !shippedByKit(f));
  const odd = listed.odd.filter((f) => !shippedByKit(f));
  const keepAll = (reason) => ({ del: [], keep: [...files, ...odd].map((p) => ({ path: p, reason })) });
  if (!legacy) return keepAll('no legacy-hashes.json in the kit (older kit source)');
  if (!snapshotSet) return keepAll('no install snapshot');
  const entry = legacy.snapshotGated.find((e) => underEntry(rel, e));
  if (entry) {
    const all = listFilesNoFollow(projectRoot, entry);
    const extra = [...all.files.filter((f) => !snapshotSet.has(f)), ...all.odd];
    if (extra.length) {
      return keepAll(`not in the old install snapshot: ${extra.slice(0, 3).join(', ')}${extra.length > 3 ? ', ...' : ''}`);
    }
    return { del: files, keep: [] };
  }
  const del = [];
  const keep = odd.map((p) => ({ path: p, reason: 'not a regular file' }));
  for (const f of files) {
    const want = legacy.hashed.get(f);
    if (!want) keep.push({ path: f, reason: 'unknown file' });
    else if (sha256File(path.join(projectRoot, f)) === want) del.push(f);
    else keep.push({ path: f, reason: 'modified' });
  }
  return { del, keep };
}

const keptMessage = (k) =>
  `KEPT (${k.reason}): '${k.path}' is a file from an older kit install that is not provably unchanged — left in place; remove it yourself if you no longer need it.`;

/**
 * Compute a surgical sync plan between a kit and a target project.
 *
 * @param {object} opts
 * @param {string} opts.projectRoot       — absolute path to the user's project
 * @param {string} opts.kitRoot           — absolute path to the cloned kit (tmpdir)
 * @param {string[]} opts.ownedPaths      — from resolve-manifest --json .ownedPaths
 * @param {string[]} opts.managedFiles    — from resolve-manifest --json .files
 * @param {string[]} opts.mergeFiles      — from resolve-manifest --json .merge
 * @param {string[]} opts.copyIfMissing   — from resolve-manifest --json .copyIfMissing
 * @param {string[]} opts.legacyDeletions — from resolve-manifest --json .legacyDeletions
 * @returns {{ toAdd: string[], toModify: string[], toDelete: string[], toPreserve: string[], staleWarnings: string[] }}
 */
export default function computeSyncPlan(opts) {
  const {
    projectRoot,
    kitRoot,
    ownedPaths = [],
    managedFiles = [],
    mergeFiles = [],
    copyIfMissing = [],
    legacyDeletions = [],
    missingDeclared = [],
    legacyHashes = null,
  } = opts;

  // 1. Read the prior install snapshot (current name first, then the pre-rename name).
  //    No snapshot at all = first install or pre-snapshot install.
  const prior = readPriorSnapshot(projectRoot);
  const priorSnapshot = prior.files;
  const snapshotSet = prior.source ? new Set(priorSnapshot) : null;

  const priorSet = new Set(priorSnapshot);
  const ownedSet = new Set(ownedPaths);
  const mergeSet = new Set(mergeFiles);
  const copyIfMissingSet = new Set(copyIfMissing);

  const toAdd = [];
  const toModify = [];
  const toDelete = [];
  const toPreserve = [];
  const staleWarnings = [];

  // Shared legacy gate: deletes only provably unchanged old kit files, keeps + reports the rest.
  const gateDeleted = new Set();
  const applyGate = (rel) => {
    const { del, keep } = decideLegacy(projectRoot, kitRoot, rel, legacyHashes, snapshotSet);
    for (const f of del) {
      if (gateDeleted.has(f)) continue;
      gateDeleted.add(f);
      toDelete.push(f);
    }
    for (const k of keep) {
      if (toPreserve.includes(k.path)) continue;
      toPreserve.push(k.path);
      staleWarnings.push(keptMessage(k));
    }
  };

  // 2. toAdd / toModify: classify managed files
  for (const rel of managedFiles) {
    const projectFile = path.join(projectRoot, rel);
    const kitFile = path.join(kitRoot, rel);

    // Skip merge files that already exist (never overwrite merge-category files)
    if (mergeSet.has(rel)) {
      const exists = fileExists(projectFile);
      if (exists) {
        toPreserve.push(rel);
      } else {
        toAdd.push(rel);
      }
      continue;
    }

    // Skip copyIfMissing files that already exist
    if (copyIfMissingSet.has(rel)) {
      if (fileExists(projectFile)) {
        toPreserve.push(rel);
      } else {
        toAdd.push(rel);
      }
      continue;
    }

    const existsOnDisk = fileExists(projectFile);
    const inPrior = priorSet.has(rel);

    if (!existsOnDisk) {
      // Not on disk at all — add
      toAdd.push(rel);
    } else if (inPrior) {
      // Was previously installed — check if content differs
      if (contentDiffers(projectFile, kitFile)) {
        toModify.push(rel);
      } else {
        toPreserve.push(rel);
      }
    } else {
      // On disk but not in prior snapshot — treat as user-owned; preserve
      toPreserve.push(rel);
    }
  }

  // 3. toDelete: stale removal — files in prior snapshot NOT in ownedPaths
  //    Safety guard: if ownedPaths is empty but the prior snapshot is large,
  //    a full mass-deletion would silently destroy the user's project. Hard-abort.
  const OWNED_EMPTY_THRESHOLD = 5;
  if (ownedPaths.length === 0 && priorSnapshot.length > OWNED_EMPTY_THRESHOLD && !opts.forceEmptyOwned) {
    const msg =
      `ABORT: ownedPaths is empty but prior snapshot has ${priorSnapshot.length} files — ` +
      `refusing to mass-delete (likely a stale/incomplete kit clone, e.g. missing ` +
      `resolve-manifest ownedPaths or untracked compute-sync-plan). ` +
      `Re-clone a complete kit or pass --force-empty-owned to override.`;
    staleWarnings.push(msg);
    return { toAdd, toModify, toDelete, toPreserve, staleWarnings, aborted: true, abortReason: msg };
  }

  // Kit-integrity guard: warn about declared kit files that were absent at resolution time.
  // These are paths the manifest DECLARED as exact entries but that were missing on disk
  // (partial/corrupt kit clone). Guard with || [] for backward-compat with older resolver output.
  const missingDeclaredSet = new Set(missingDeclared || []);
  if (missingDeclaredSet.size > 0) {
    process.stderr.write(
      `\nWARNING: Kit integrity check failed — the following declared kit files were not found on disk.\n` +
      `The kit clone may be partial or corrupt. Re-clone the kit before updating.\n` +
      `Missing declared kit files:\n` +
      [...missingDeclaredSet].sort().map((p) => `  ${p}`).join('\n') + '\n\n'
    );
  }

  for (const rel of priorSnapshot) {
    if (ownedSet.has(rel)) {
      // Still in current ownedPaths — not stale
      continue;
    }

    const projectFile = path.join(projectRoot, rel);
    if (!fileExists(projectFile)) {
      // Already gone — skip
      continue;
    }

    // Kit-integrity guard: if this deletion candidate matches a declared kit file
    // that was absent on disk at resolution time, preserve it instead of deleting.
    // The kit clone is likely incomplete; deleting the project copy would be data loss.
    if (missingDeclaredSet.has(rel)) {
      staleWarnings.push(
        `PRESERVED (kit integrity): '${rel}' was scheduled for deletion but is declared in the kit manifest and missing from the kit clone — preserved to avoid data loss. Re-clone the kit to get the correct version. Original is recoverable from .vibecode-backup/ if a backup was made.`
      );
      toPreserve.push(rel);
      continue;
    }

    // Old kit paths are decided by the shared legacy gate, never by the namespace alone.
    if (isLegacyGated(rel, legacyHashes)) {
      applyGate(rel);
      continue;
    }

    if (isKitOwned(rel)) {
      toDelete.push(rel);
    } else {
      staleWarnings.push(
        `'${rel}' in prior snapshot but not in kit namespace — preserved (verify manually)`
      );
      toPreserve.push(rel);
    }
  }

  // 4. legacyDeletions: entries that exist on disk. Old kit paths go through the shared
  //    legacy gate (per file); other entries keep the namespace guard.
  for (const rel of legacyDeletions) {
    if (toDelete.includes(rel)) continue; // already scheduled
    const projectFile = path.join(projectRoot, rel);
    const existsAsFile = fileExists(projectFile);
    const existsAsDir = !existsAsFile && dirExists(projectFile);
    if (!existsAsFile && !existsAsDir) continue;
    if (isLegacyGated(rel, legacyHashes)) {
      applyGate(rel);
      continue;
    }
    if (isKitOwned(rel)) {
      toDelete.push(rel);
    }
  }

  // 5. Warn about suspicious deletes: isKitOwned but not in known ownedPaths or legacyDeletions
  //    (files proven unchanged by the legacy gate are known kit files, so they are not warned about)
  const legacySet = new Set(legacyDeletions);
  for (const rel of toDelete) {
    if (!ownedSet.has(rel) && !legacySet.has(rel) && !gateDeleted.has(rel)) {
      staleWarnings.push(
        `WARNING: ${rel} will be removed (matches vc- namespace) but is not a known kit file — if this is YOUR custom skill, rename it without the vc- prefix to protect it.`
      );
    }
  }

  return { toAdd, toModify, toDelete, toPreserve, staleWarnings };
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function fileExists(absPath) {
  try {
    return fs.statSync(absPath).isFile();
  } catch {
    return false;
  }
}

function dirExists(absPath) {
  try {
    return fs.statSync(absPath).isDirectory();
  } catch {
    return false;
  }
}

function contentDiffers(absA, absB) {
  try {
    const a = fs.readFileSync(absA);
    const b = fs.readFileSync(absB);
    return !a.equals(b);
  } catch {
    // If kit file doesn't exist, treat as no-differ (skip modification)
    return false;
  }
}

// ── Apply mode ────────────────────────────────────────────────────────────────

/**
 * Execute the computed sync plan against projectRoot.
 * Called when --apply is passed on the CLI.
 *
 * @param {{ toAdd: string[], toModify: string[], toDelete: string[], toPreserve: string[], staleWarnings: string[] }} plan
 * @param {string} projectRoot   — absolute path to the user's project
 * @param {string} kitRoot       — absolute path to the cloned kit
 * @param {string[]} ownedPaths  — full ownedPaths from the resolved manifest (used for stale-removal)
 * @param {string} version       — manifest version string (written to .vc-version)
 * @param {string[]} managedFiles — managed files only (written to .vc-installed-files snapshot)
 */
function applyPlan(plan, projectRoot, kitRoot, ownedPaths, version, managedFiles) {
  // Fall back to ownedPaths if managedFiles not supplied (backward-compat)
  const snapshotFiles = managedFiles || ownedPaths;
  const { toAdd, toModify, toDelete, staleWarnings } = plan;

  // 1. Print stale warnings to stderr (never act on them)
  for (const w of staleWarnings) {
    process.stderr.write(`staleWarning: ${w}\n`);
  }

  // 2. Copy additions (toAdd)
  for (const rel of toAdd) {
    const src = path.join(kitRoot, rel);
    const dst = path.join(projectRoot, rel);
    try {
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      fs.copyFileSync(src, dst);
      console.log(`  added: ${rel}`);
    } catch (err) {
      process.stderr.write(
        `  ERROR: failed to add '${rel}': ${err.message} — skipping (original recoverable from .vibecode-backup/ if a backup was made)\n`
      );
    }
  }

  // 3. Copy modifications (toModify)
  for (const rel of toModify) {
    const src = path.join(kitRoot, rel);
    const dst = path.join(projectRoot, rel);
    try {
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      fs.copyFileSync(src, dst);
      console.log(`  modified: ${rel}`);
    } catch (err) {
      process.stderr.write(
        `  ERROR: failed to modify '${rel}': ${err.message} — skipping (original recoverable from .vibecode-backup/ if a backup was made)\n`
      );
    }
  }

  // 4. Remove stale entries (toDelete) — directories get rm -rf, files get rm
  const deletedParents = new Set();
  for (const rel of toDelete) {
    const target = path.join(projectRoot, rel);
    let stat;
    try { stat = fs.statSync(target); } catch { continue; /* already gone */ }

    if (stat.isDirectory()) {
      fs.rmSync(target, { recursive: true, force: true });
      console.log(`  removed dir: ${rel}`);
    } else {
      fs.rmSync(target, { force: true });
      console.log(`  removed: ${rel}`);
    }

    // Collect all ancestor dirs for empty-parent sweep
    let parent = path.dirname(target);
    while (parent !== projectRoot && parent !== path.dirname(parent)) {
      deletedParents.add(parent);
      parent = path.dirname(parent);
    }
  }

  // 5. Empty-parent cleanup — deepest-first (longest path first)
  // Also collect any subdirectories that still exist under deleted ancestor dirs
  // (e.g. empty references/, scripts/, templates/ left behind when their parent
  //  skill dir had files deleted but the empty subdirs were never in the snapshot).
  const allDirsToTry = new Set(deletedParents);
  for (const dir of deletedParents) {
    // Walk any surviving child directories under this dir and add them deepest-first
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const child = path.join(dir, entry.name);
          allDirsToTry.add(child);
          // One more level (e.g. references/sub/)
          try {
            const subEntries = fs.readdirSync(child, { withFileTypes: true });
            for (const sub of subEntries) {
              if (sub.isDirectory()) allDirsToTry.add(path.join(child, sub.name));
            }
          } catch { /* ignore */ }
        }
      }
    } catch { /* dir may already be gone */ }
  }

  const sortedParents = [...allDirsToTry].sort((a, b) => b.length - a.length);
  for (const dir of sortedParents) {
    try {
      fs.rmdirSync(dir); // throws ENOTEMPTY or ENOENT — both are fine
    } catch {
      // ENOTEMPTY = still has contents; ENOENT = already gone; both are expected
    }
  }

  // 6. Write snapshot — sorted managed files only (not legacyDeletions phantoms),
  //    one per line. This matches install.sh which writes FILES (= managedFiles).
  //    legacyDeletions are re-derived from the manifest each run and do not need
  //    to be persisted in the snapshot.
  const snapshotPath = path.join(projectRoot, SNAPSHOT_FILE);
  const snapshotContent = [...snapshotFiles].sort().join('\n') + '\n';
  fs.writeFileSync(snapshotPath, snapshotContent, 'utf8');
  console.log(`  snapshot written: ${SNAPSHOT_FILE}`);

  // 7. Write version (matches install.sh line ~342)
  const versionPath = path.join(projectRoot, VERSION_FILE);
  fs.writeFileSync(versionPath, version + '\n', 'utf8');
  console.log(`  version written: ${VERSION_FILE} (${version})`);

  // 7b. Migrate: the pre-rename state files are removed only now, after both new ones were written.
  for (const [oldName, newName] of [[OLD_SNAPSHOT_FILE, SNAPSHOT_FILE], [OLD_VERSION_FILE, VERSION_FILE]]) {
    if (oldName !== newName && fs.existsSync(path.join(projectRoot, oldName))) {
      fs.rmSync(path.join(projectRoot, oldName), { force: true });
      console.log(`  migrated: ${oldName} -> ${newName}`);
    }
  }

  // 8. Ensure .gitignore excludes .vibecode-backup*/ (additive — never overwrites user content)
  try {
    const gitignorePath = path.join(projectRoot, '.gitignore');
    const backupPattern = '.vibecode-backup*/';
    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath, backupPattern + '\n', 'utf8');
      console.log(`  Added ${backupPattern} to .gitignore (created)`);
    } else {
      const existing = fs.readFileSync(gitignorePath, 'utf8');
      const alreadyPresent = existing.split('\n').some(line => line.trim().includes('.vibecode-backup*'));
      if (!alreadyPresent) {
        const withNewline = existing.endsWith('\n') ? existing : existing + '\n';
        fs.writeFileSync(gitignorePath, withNewline + backupPattern + '\n', 'utf8');
        console.log(`  Added ${backupPattern} to .gitignore`);
      }
    }
  } catch (err) {
    process.stderr.write(`  Warning: could not update .gitignore: ${err.message}\n`);
  }
}

// ── CLI ────────────────────────────────────────────────────────────────────────

/**
 * --legacy-gate: the shared gate for install.sh. Reads candidate paths (one per stdin line) and
 * prints one line per file: <candidate>\t<DELETE|KEEP|UNGATED>\t<path>[\t<reason>]. A file decided
 * for an earlier candidate is not repeated. UNGATED = not an old kit path; install.sh keeps its
 * own namespace rules for it. Writes nothing to the project.
 */
function runLegacyGateCli(args) {
  const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : undefined; };
  const projectRoot = get('--root');
  const kitRoot = get('--kit-root');
  if (!projectRoot || !kitRoot) {
    console.error('Usage: node compute-sync-plan.mjs --root <projectRoot> --kit-root <kitRoot> --legacy-gate < candidates');
    process.exitCode = 1;
    return;
  }
  const root = path.resolve(projectRoot);
  const kit = path.resolve(kitRoot);
  const legacy = loadLegacyHashes(kit);
  const prior = readPriorSnapshot(root);
  const snapshotSet = prior.source ? new Set(prior.files) : null;
  const candidates = fs.readFileSync(0, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
  const seen = new Set();
  const out = [];
  for (const c of candidates) {
    if (!isLegacyGated(c, legacy)) { out.push(`${c}\tUNGATED\t${c}`); continue; }
    const { del, keep } = decideLegacy(root, kit, c, legacy, snapshotSet);
    for (const f of del) if (!seen.has(f)) { seen.add(f); out.push(`${c}\tDELETE\t${f}`); }
    for (const k of keep) if (!seen.has(k.path)) { seen.add(k.path); out.push(`${c}\tKEEP\t${k.path}\t${k.reason}`); }
  }
  if (out.length) fs.writeSync(1, `${out.join('\n')}\n`);
}

const isCli = process.argv[1] && fs.realpathSync(fileURLToPath(import.meta.url)) === fs.realpathSync(process.argv[1]);
const legacyGateCli = Boolean(isCli && process.argv.includes('--legacy-gate'));
if (legacyGateCli) {
  runLegacyGateCli(process.argv.slice(2));
}
if (isCli && !legacyGateCli) {
  const args = process.argv.slice(2);

  const getFlag = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : undefined;
  };
  const hasFlag = (flag) => args.includes(flag);

  const projectRoot = getFlag('--root');
  const kitRoot = getFlag('--kit-root');
  const resolverOverride = getFlag('--resolver');
  const jsonMode = hasFlag('--json');
  const applyMode = hasFlag('--apply');
  const forceEmptyOwned = hasFlag('--force-empty-owned');

  if (!projectRoot || !kitRoot) {
    console.error('Usage: node compute-sync-plan.mjs --root <projectRoot> --kit-root <kitRoot> [--json] [--apply] [--resolver <resolverPath>]');
    process.exit(1);
  }

  if (applyMode && !projectRoot) {
    console.error('--apply requires --root to be specified');
    process.exit(1);
  }

  // Load manifest from kit root (current name first, the pre-rename name as a fallback)
  const manifestPath = [MANIFEST_NAME, OLD_MANIFEST_NAME]
    .map((name) => path.join(kitRoot, name))
    .find((candidate) => fs.existsSync(candidate)) || path.join(kitRoot, MANIFEST_NAME);
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (e) {
    console.error(`Failed to read ${path.basename(manifestPath)} from ${kitRoot}: ${e.message}`);
    process.exit(1);
  }

  // Run resolve-manifest from kitRoot to get ownedPaths + managedFiles.
  // Uses top-level await (ESM) so stdout flushes synchronously before exit.
  // --resolver overrides the default path (useful for vc-publish dev→kit direction).
  const { execFileSync } = await import('node:child_process');
  const resolverScript = resolverOverride
    ? path.resolve(resolverOverride)
    : path.join(kitRoot, 'resolve-manifest.mjs');
  let resolvedJson;
  try {
    const out = execFileSync(
      process.execPath,
      [resolverScript, '--root', kitRoot, '--json'],
      { encoding: 'utf8' }
    );
    resolvedJson = JSON.parse(out);
  } catch (e) {
    console.error(`Failed to run resolve-manifest.mjs: ${e.message}`);
    process.exit(1);
  }

  const resolvedProjectRoot = path.resolve(projectRoot);
  const resolvedKitRoot = path.resolve(kitRoot);

  const result = computeSyncPlan({
    projectRoot: resolvedProjectRoot,
    kitRoot: resolvedKitRoot,
    ownedPaths: resolvedJson.ownedPaths || [],
    managedFiles: resolvedJson.files || [],
    mergeFiles: resolvedJson.merge || [],
    copyIfMissing: resolvedJson.copyIfMissing || [],
    legacyDeletions: resolvedJson.legacyDeletions || [],
    missingDeclared: resolvedJson.missingDeclared || [],
    legacyHashes: loadLegacyHashes(resolvedKitRoot),
    forceEmptyOwned,
  });

  if (result.aborted) {
    process.stderr.write(`\n${result.abortReason}\n`);
    process.exit(1);
  }

  if (applyMode) {
    applyPlan(
      result,
      resolvedProjectRoot,
      resolvedKitRoot,
      resolvedJson.ownedPaths || [],
      manifest.version || '0.0.0',
      resolvedJson.files || []
    );
  } else if (jsonMode) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`toAdd (${result.toAdd.length}): ${result.toAdd.join(', ') || '(none)'}`);
    console.log(`toModify (${result.toModify.length}): ${result.toModify.join(', ') || '(none)'}`);
    console.log(`toDelete (${result.toDelete.length}): ${result.toDelete.join(', ') || '(none)'}`);
    console.log(`toPreserve (${result.toPreserve.length}): ${result.toPreserve.join(', ') || '(none)'}`);
    if (result.staleWarnings.length) {
      console.warn('staleWarnings:');
      for (const w of result.staleWarnings) console.warn(' ', w);
    }
  }
}
