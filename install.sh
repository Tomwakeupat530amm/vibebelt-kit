#!/usr/bin/env bash
set -euo pipefail

# vibebelt-kit installer
# Clean install with backup for both new and existing projects.
# Replaces .claude/, .codex/, .agents/, CLAUDE.md, AGENTS.md with kit versions.
# Preserves: process/ (user content). Merges .claude/settings.json (not replaced if present).
# After this script, run Claude Code and say "Run vb-setup" to
# auto-detect your project, scaffold process/, and populate context.

REPO="https://github.com/Tomwakeupat530amm/vibebelt-kit.git"
# VB_KIT_SOURCE overrides the default remote.
# Accepts: a local filesystem path OR an alternate git URL.
# - Local directory: working tree is copied as-is (uncommitted changes included).
# - URL (or default remote): git clone --depth 1 is used.
OLD_KIT_SOURCE="${VC_KIT_SOURCE:-}"  # legacy-vc-fallback: the variable name used before the prefix rename still works
REPO="${VB_KIT_SOURCE:-${OLD_KIT_SOURCE:-$REPO}}"
# Fix M6: renamed from TMPDIR (shadows POSIX reserved env var) to VB_INSTALL_TMPDIR
VB_INSTALL_TMPDIR="${TMPDIR:-/tmp}/vb-kit-install-$$"
BACKUP_DIR=".vibecode-backup"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

cleanup() { rm -rf "$VB_INSTALL_TMPDIR" 2>/dev/null; }
trap cleanup EXIT

echo ""
echo "  vibebelt-kit installer"
echo "  ─────────────────────────────────"
echo ""

# Fix M5: Windows/WSL detection notice (early)
if [[ "$OSTYPE" == msys* || "$OSTYPE" == cygwin* ]]; then
  echo "  Note: Windows detected (OSTYPE=$OSTYPE). Enable Developer Mode for true symlink support."
elif grep -qEi microsoft /proc/version 2>/dev/null; then
  echo "  Note: WSL detected. Enable Developer Mode for true symlink support."
  echo "  See: https://docs.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development"
fi

# ══════════════════════════════════════════════════════
# Preflight: Node.js required
# ══════════════════════════════════════════════════════
if ! command -v node &>/dev/null; then
  echo "  Error: Node.js is required but not found in PATH."
  echo "  Install Node.js >= 22 and try again."
  exit 1
fi

# Fix: Node.js major version gate (Node 22+ required for fs.globSync used in resolve-manifest.mjs)
NODE_MAJOR=$(node --version | sed 's/v\([0-9]*\).*/\1/')
if [ "$NODE_MAJOR" -lt 22 ]; then
  echo "  Error: Node.js >= 22 required (found $(node --version))."
  echo "  resolve-manifest.mjs uses fs.globSync which requires Node.js 22+."
  exit 1
fi

# Clone or copy kit to temp
echo "  Fetching kit..."
if [ -d "$REPO" ]; then
  # Local directory: copy working tree as-is (uncommitted changes are included)
  mkdir -p "$VB_INSTALL_TMPDIR"
  ( cd "$REPO" && tar --exclude=.git --exclude=node_modules -cf - . ) | ( cd "$VB_INSTALL_TMPDIR" && tar -xf - )
else
  # Remote URL: shallow clone — verify git is available first
  if ! command -v git &>/dev/null; then
    echo "  Error: git is required to fetch from a remote URL but was not found in PATH."
    echo "  Install git and try again, or set VB_KIT_SOURCE to a local directory."
    exit 1
  fi
  git clone --depth 1 --quiet "$REPO" "$VB_INSTALL_TMPDIR"
fi

# Read version from manifest (current name first; a kit source from before the prefix rename ships the old name)
KIT_MANIFEST="$VB_INSTALL_TMPDIR/vb-manifest.json"
[ -f "$KIT_MANIFEST" ] || KIT_MANIFEST="${KIT_MANIFEST%/*}/vc-manifest.json"  # legacy-vc-fallback
VERSION=$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')).version)" "$KIT_MANIFEST" 2>/dev/null || echo "unknown")
echo "  Kit version: $VERSION"
echo ""

# ══════════════════════════════════════════════════════
# Resolve manifest to get file list + metadata
# ══════════════════════════════════════════════════════
# Fix M7: capture stderr to a temp file so we can surface it on failure
_MANIFEST_ERR_FILE="$VB_INSTALL_TMPDIR/_manifest_stderr.txt"
MANIFEST_JSON=""
set +e
MANIFEST_JSON=$(node "$VB_INSTALL_TMPDIR/resolve-manifest.mjs" --root "$VB_INSTALL_TMPDIR" --json 2>"$_MANIFEST_ERR_FILE")
_MANIFEST_EXIT=$?
set -e
if [ -z "$MANIFEST_JSON" ] || [ "$_MANIFEST_EXIT" -ne 0 ]; then
  echo "  Error: Failed to resolve manifest (exit code $_MANIFEST_EXIT)."
  if [ -s "$_MANIFEST_ERR_FILE" ]; then
    echo "  Node error output:"
    sed 's/^/    /' "$_MANIFEST_ERR_FILE"
  fi
  echo "  Check: Node.js >= 22 is installed, and vb-manifest.json exists in the kit."
  exit 1
fi

# Extract file list, merge list, copyIfMissing list, and symlinks from JSON
FILES=$(echo "$MANIFEST_JSON" | node -e "
  const d = JSON.parse(require('fs').readFileSync(0,'utf8'));
  d.files.forEach(f => console.log(f));
")
MERGE_FILES=$(echo "$MANIFEST_JSON" | node -e "
  const d = JSON.parse(require('fs').readFileSync(0,'utf8'));
  d.merge.forEach(f => console.log(f));
")
COPY_IF_MISSING=$(echo "$MANIFEST_JSON" | node -e "
  const d = JSON.parse(require('fs').readFileSync(0,'utf8'));
  d.copyIfMissing.forEach(f => console.log(f));
")
SYMLINKS_JSON=$(echo "$MANIFEST_JSON" | node -e "
  const d = JSON.parse(require('fs').readFileSync(0,'utf8'));
  for (const [k,v] of Object.entries(d.symlinks)) console.log(k + '|' + v);
")
LEGACY_DELETIONS=$(echo "$MANIFEST_JSON" | node -e "
  const d = JSON.parse(require('fs').readFileSync(0,'utf8'));
  (d.legacyDeletions || []).forEach(f => console.log(f));
")
OWNED_PATHS=$(echo "$MANIFEST_JSON" | node -e "
  const d = JSON.parse(require('fs').readFileSync(0,'utf8'));
  (d.ownedPaths || []).forEach(f => console.log(f));
")
MISSING_DECLARED=$(echo "$MANIFEST_JSON" | node -e "
  const d = JSON.parse(require('fs').readFileSync(0,'utf8'));
  (d.missingDeclared || []).forEach(f => console.log(f));
")

# ── Kit-integrity guard: warn when manifest-declared files are absent from source ──
if [ -n "$MISSING_DECLARED" ]; then
  echo -e "  ${YELLOW}⚠ WARNING: Kit integrity check failed — the following declared kit files were not found on disk.${NC}" >&2
  while IFS= read -r mdf; do
    [ -z "$mdf" ] && continue
    echo -e "    ${YELLOW}missing:${NC} $mdf" >&2
  done <<< "$MISSING_DECLARED"
  echo -e "  ${YELLOW}  → The kit clone may be partial or corrupt. Re-clone the kit before updating.${NC}" >&2
  echo "" >&2
fi

# ══════════════════════════════════════════════════════
# Read prior installed-files snapshot (before backup)
# ══════════════════════════════════════════════════════
# Kit state files: current names first; installs made before the prefix rename wrote the old names.
SNAPSHOT_FILE=".vb-installed-files"
OLD_SNAPSHOT_FILE=".vc-installed-files"  # legacy-vc-fallback
VERSION_FILE=".vb-version"
OLD_VERSION_FILE=".vc-version"  # legacy-vc-fallback
PRIOR_SNAPSHOT=""
if [ -f "$SNAPSHOT_FILE" ]; then
  PRIOR_SNAPSHOT=$(cat "$SNAPSHOT_FILE")
elif [ -f "$OLD_SNAPSHOT_FILE" ]; then
  PRIOR_SNAPSHOT=$(cat "$OLD_SNAPSHOT_FILE")
fi

# ══════════════════════════════════════════════════════
# Backup existing setup (if any)
# ══════════════════════════════════════════════════════
HAS_EXISTING=false
if [ -d ".claude" ] || [ -d ".codex" ] || [ -d ".agents" ] || [ -f "CLAUDE.md" ] || [ -f "AGENTS.md" ]; then
  HAS_EXISTING=true
  echo -e "  ${YELLOW}Existing setup detected.${NC} Backing up..."
  # Rotate any prior backup so re-runs never silently overwrite it
  if [ -d "$BACKUP_DIR" ] && [ -n "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]; then
    ROTATED_DIR="${BACKUP_DIR}-$(date +%s)"
    mv "$BACKUP_DIR" "$ROTATED_DIR"
    echo -e "  ${YELLOW}Existing backup rotated to ${CYAN}${ROTATED_DIR}/${NC}"
  fi
  mkdir -p "$BACKUP_DIR"
  # Fix M7 (backup): use cp -f so re-runs overwrite read-only files from a prior backup
  chmod -R u+w "$BACKUP_DIR" 2>/dev/null || true

  # Back up directories
  [ -d ".claude" ] && cp -Rf .claude "$BACKUP_DIR/.claude" && echo -e "    ${YELLOW}Backed up${NC} .claude/"
  [ -d ".codex" ] && cp -Rf .codex "$BACKUP_DIR/.codex" && echo -e "    ${YELLOW}Backed up${NC} .codex/"
  [ -d ".agents" ] && cp -Rf .agents "$BACKUP_DIR/.agents" && echo -e "    ${YELLOW}Backed up${NC} .agents/"

  # Back up root protocol files
  [ -f "CLAUDE.md" ] && cp -f CLAUDE.md "$BACKUP_DIR/CLAUDE.md" && echo -e "    ${YELLOW}Backed up${NC} CLAUDE.md"
  [ -f "AGENTS.md" ] && cp -f AGENTS.md "$BACKUP_DIR/AGENTS.md" && echo -e "    ${YELLOW}Backed up${NC} AGENTS.md"
  [ -f "GUIDE.md" ] && cp -f GUIDE.md "$BACKUP_DIR/GUIDE.md" && echo -e "    ${YELLOW}Backed up${NC} GUIDE.md"

  echo -e "    Backup at: ${CYAN}$BACKUP_DIR/${NC}"
  echo ""
fi

# ══════════════════════════════════════════════════════
# Install kit — resolver-driven copy
# ══════════════════════════════════════════════════════
INSTALLED_COUNT=0
SKIPPED_MERGE=0
SKIPPED_COPY_IF_MISSING=0

echo "  Installing files..."

while IFS= read -r file; do
  [ -z "$file" ] && continue

  # Check if this file is in the merge list AND exists locally
  IS_MERGE=false
  while IFS= read -r mf; do
    [ "$file" = "$mf" ] && IS_MERGE=true && break
  done <<< "$MERGE_FILES"

  if [ "$IS_MERGE" = true ] && [ -f "$file" ]; then
    SKIPPED_MERGE=$((SKIPPED_MERGE + 1))
    continue
  fi

  # Check if this file is in the copyIfMissing list AND exists locally
  IS_COPY_IF_MISSING=false
  while IFS= read -r cim; do
    [ "$file" = "$cim" ] && IS_COPY_IF_MISSING=true && break
  done <<< "$COPY_IF_MISSING"

  if [ "$IS_COPY_IF_MISSING" = true ] && [ -f "$file" ]; then
    SKIPPED_COPY_IF_MISSING=$((SKIPPED_COPY_IF_MISSING + 1))
    continue
  fi

  # Create parent directory and copy
  mkdir -p "$(dirname "$file")"
  cp "$VB_INSTALL_TMPDIR/$file" "$file"
  INSTALLED_COUNT=$((INSTALLED_COUNT + 1))
done <<< "$FILES"

# ══════════════════════════════════════════════════════
# Shared legacy gate — files of an older kit install are removed only when
# they are provably unchanged kit files; everything else is kept and reported.
# One decision for both deletion blocks below (stale removal and
# legacyDeletions), computed once by compute-sync-plan.mjs --legacy-gate,
# the same rules vb-update applies. Bash 3 compatible.
# ══════════════════════════════════════════════════════
GATE_LINES=""
GATE_OK=false
GATE_REMOVED=0
GATE_KEPT=0
gate_run() {  # $1 = file with one candidate path per line
  if GATE_LINES=$(node "$VB_INSTALL_TMPDIR/compute-sync-plan.mjs" --legacy-gate --root "$PWD" --kit-root "$VB_INSTALL_TMPDIR" < "$1" 2>/dev/null); then
    GATE_OK=true
  else
    GATE_OK=false
    GATE_LINES=""
    echo -e "  ${YELLOW}Warning${NC}: the legacy gate could not run (kit source too old?); files of an older kit install are kept." >&2
  fi
}
gate_decide() {  # $1 = candidate; prints its decision lines: candidate TAB DELETE|KEEP|UNGATED TAB path [TAB reason]
  [ "$GATE_OK" = true ] || return 0
  C="$1" awk -F'\t' '$1 == ENVIRON["C"]' <<< "$GATE_LINES"
}
is_gated() {  # $1 = candidate, $2 = its decision lines
  if [ "$GATE_OK" = true ]; then
    case "$2" in *$'\t'UNGATED$'\t'*) return 1 ;; esac
    return 0
  fi
  case "/$1" in */vc-*) return 0 ;; esac  # legacy-vc-fallback: without the gate, old-prefix paths are never deleted
  return 1
}
apply_gate() {  # $1 = candidate, $2 = its decision lines
  local _c decision gfile reason
  if [ "$GATE_OK" != true ]; then
    GATE_KEPT=$((GATE_KEPT + 1))
    echo -e "    ${YELLOW}kept${NC} (legacy gate unavailable): $1"
    return 0
  fi
  while IFS=$'\t' read -r _c decision gfile reason; do
    case "$decision" in
      DELETE)
        if [ -f "$gfile" ] && [ ! -L "$gfile" ]; then
          rm -f -- "$gfile"
          GATE_REMOVED=$((GATE_REMOVED + 1))
          echo "    removed old kit file (unchanged): $gfile"
        fi
        ;;
      KEEP)
        GATE_KEPT=$((GATE_KEPT + 1))
        echo -e "    ${YELLOW}kept${NC} ($reason): $gfile"
        ;;
    esac
  done <<< "$2"
  return 0
}

# ══════════════════════════════════════════════════════
# Stale removal — remove kit-owned files that are no
# longer in the new manifest (snapshot-diff approach).
# NEVER removes user-owned files.
# ══════════════════════════════════════════════════════
STALE_CANDIDATES=""
if [ -n "$PRIOR_SNAPSHOT" ]; then
  while IFS= read -r prior_file; do
    [ -z "$prior_file" ] && continue

    # Is this file still in the new ownedPaths?
    STILL_OWNED=false
    while IFS= read -r owned; do
      [ "$prior_file" = "$owned" ] && STILL_OWNED=true && break
    done <<< "$OWNED_PATHS"

    if [ "$STILL_OWNED" = false ] && [ -f "$prior_file" ]; then
      STALE_CANDIDATES="${STALE_CANDIDATES}${prior_file}"$'\n'
    fi
  done <<< "$PRIOR_SNAPSHOT"
fi
GATE_CANDIDATES_FILE="$VB_INSTALL_TMPDIR/_legacy_gate_candidates.txt"
printf '%s%s\n' "$STALE_CANDIDATES" "$LEGACY_DELETIONS" > "$GATE_CANDIDATES_FILE"
gate_run "$GATE_CANDIDATES_FILE"

if [ -n "$PRIOR_SNAPSHOT" ]; then
  echo "  Checking for stale kit files..."
  STALE_COUNT=0
  while IFS= read -r prior_file; do
    [ -z "$prior_file" ] && continue

    # Old kit paths: the shared legacy gate decides (unchanged -> removed; otherwise kept and reported)
    GATE_DECISIONS=$(gate_decide "$prior_file")
    if is_gated "$prior_file" "$GATE_DECISIONS"; then
      apply_gate "$prior_file" "$GATE_DECISIONS"
      continue
    fi

    # Kit-owned namespace guard: only delete if it matches the kit namespace
    IS_KIT_NAMESPACE=false
    case "$prior_file" in
      .claude/skills/vb-*|.claude/agents/vb-*|.claude/hooks/*|.codex/*|\
      process/development-protocols/*|process/context/planning/*|\
      process/context/generated-skills-catalog.json|\
      process/_seeds/*|CLAUDE.md|AGENTS.md|\
      .vb-installed-files|.vb-version|.agents/*)
        IS_KIT_NAMESPACE=true
        ;;
      .claude/skills/vc-*|.claude/agents/vc-*|.vc-installed-files|.vc-version)  # legacy-vc-fallback (old namespace; normally decided by the gate above)
        IS_KIT_NAMESPACE=true
        ;;
    esac

    if [ "$IS_KIT_NAMESPACE" = true ]; then
      # Fix M4: warn when a vb-* prefixed path is about to be removed as stale
      # (it matched kit namespace but is NOT in the new manifest — warn before delete)
      case "$prior_file" in
        .claude/skills/vb-*|.claude/agents/vb-*)
          echo -e "    ${YELLOW}WARNING${NC}: removing vb-* prefixed path '$prior_file' as stale kit file."
          echo "    If this is a custom skill/agent you added, restore it from $BACKUP_DIR/."
          ;;
      esac
      rm -f "$prior_file"
      STALE_COUNT=$((STALE_COUNT + 1))
      echo "    removed stale: $prior_file"
    else
      echo -e "    ${YELLOW}WARN${NC}: '$prior_file' in old snapshot but not kit-namespace — preserved (check manually)"
    fi
  done <<< "$STALE_CANDIDATES"

  # Clean empty parent directories (deepest-first)
  while IFS= read -r prior_file; do
    [ -z "$prior_file" ] && continue
    parent=$(dirname "$prior_file")
    while [ "$parent" != "." ] && [ "$parent" != "/" ]; do
      [ -d "$parent" ] && rmdir "$parent" 2>/dev/null || true
      parent=$(dirname "$parent")
    done
  done <<< "$PRIOR_SNAPSHOT"

  if [ "$STALE_COUNT" -gt 0 ]; then
    echo "    $STALE_COUNT stale kit file(s) removed."
  else
    echo "    No stale kit files."
  fi
elif [ -n "$LEGACY_DELETIONS" ]; then
  # No prior snapshot (first install or pre-snapshot install).
  # Print the pre-snapshot fallback caveat.
  echo ""
  echo -e "  ${YELLOW}Note:${NC} No prior .vb-installed-files snapshot found."
  echo "  Stale removal will rely on legacyDeletions only."
  echo "  If you have custom skills/agents whose names begin with 'vb-',"
  echo "  verify they were not removed in the legacyDeletions step below."
fi

# ══════════════════════════════════════════════════════
# Symlinks
# ══════════════════════════════════════════════════════
echo "  Setting up symlinks..."
while IFS= read -r line; do
  [ -z "$line" ] && continue
  LINK_PATH="${line%%|*}"
  LINK_TARGET="${line##*|}"
  mkdir -p "$(dirname "$LINK_PATH")"
  # Idempotent symlink setup with backup for displaced real paths.
  if [ -L "$LINK_PATH" ]; then
    # Already a symlink — check if it points to the correct target.
    CURRENT_TARGET=$(readlink "$LINK_PATH")
    if [ "$CURRENT_TARGET" = "$LINK_TARGET" ]; then
      # Already correct — leave it alone (no churn).
      continue
    else
      # Wrong symlink target — remove and recreate.
      rm -f "$LINK_PATH"
    fi
  elif [ -e "$LINK_PATH" ]; then
    # Real file or real directory — back it up before displacing.
    mkdir -p "$BACKUP_DIR/$(dirname "$LINK_PATH")"
    cp -r "$LINK_PATH" "$BACKUP_DIR/$LINK_PATH"
    rm -rf "$LINK_PATH"
    echo "  ⚠ replaced existing $LINK_PATH (backed up to $BACKUP_DIR/$LINK_PATH)"
  fi
  # Fix M1: symlink with fallback copy on failure (e.g. Windows without Developer Mode)
  if ln -sf "$LINK_TARGET" "$LINK_PATH" 2>/dev/null; then
    : # symlink created successfully
  else
    # Fallback: copy the target contents to the link path
    # LINK_TARGET is relative (e.g. ../.claude/skills); resolve from LINK_PATH's parent dir
    _LINK_PARENT_DIR="$(cd "$(dirname "$LINK_PATH")" && pwd)"
    _LINK_TARGET_ABS="$_LINK_PARENT_DIR/$LINK_TARGET"
    rm -rf "$LINK_PATH" 2>/dev/null || true
    if cp -r "$_LINK_TARGET_ABS" "$LINK_PATH" 2>/dev/null; then
      echo "  ⚠ ln -sf failed (Windows without Developer Mode?). Copied skills to $LINK_PATH; Codex discovery works but won't auto-reflect vb-update changes. Enable Developer Mode for true symlinks."
    else
      echo "  ⚠ WARNING: could not create $LINK_PATH (symlink and copy both failed)."
    fi
  fi
done <<< "$SYMLINKS_JSON"

# ══════════════════════════════════════════════════════
# Apply legacyDeletions — remove deprecated skill dirs + protocol files
# ══════════════════════════════════════════════════════
if [ -n "$LEGACY_DELETIONS" ]; then
  echo "  Removing deprecated paths (legacyDeletions)..."
  DELETED_DIRS=()
  DEFERRED_LAYOUT=()
  while IFS= read -r legacy_path; do
    [ -z "$legacy_path" ] && continue
    # Old kit paths: the shared legacy gate decides per file (unchanged -> removed;
    # changed, unknown or unprovable -> kept and reported); emptied folders are pruned.
    if [ -e "$legacy_path" ] || [ -L "$legacy_path" ]; then
      GATE_DECISIONS=$(gate_decide "$legacy_path")
      if is_gated "$legacy_path" "$GATE_DECISIONS"; then
        apply_gate "$legacy_path" "$GATE_DECISIONS"
        if [ -d "$legacy_path" ] && [ ! -L "$legacy_path" ]; then
          find "$legacy_path" -depth -type d -empty -exec rmdir {} \; 2>/dev/null || true
        fi
        DELETED_DIRS+=("$legacy_path")
        continue
      fi
    fi
    if [ -d "$legacy_path" ]; then
      # ── Content-safety guard ──────────────────────────────────────────────
      # install.sh is deterministic (no agent) and cannot run the adaptive
      # safe-migration that vb-update Part D performs. A process-layout content
      # dir (reports/ or references/ under process/) may hold real user files
      # (plans, reports, references). NEVER rm -rf such a dir when it is
      # non-empty — defer it to vb-update, which migrates the contents into
      # task folders BEFORE removing the empty dir. Deprecated harness dirs
      # (e.g. .claude/skills/vb-*) carry no user content and are still removed.
      base=$(basename "$legacy_path")
      case "$legacy_path" in
        process/*)
          if { [ "$base" = "reports" ] || [ "$base" = "references" ]; } \
             && [ -n "$(find "$legacy_path" -type f -print -quit 2>/dev/null)" ]; then
            echo "    deferred (has content — vb-update will migrate then remove): $legacy_path"
            DEFERRED_LAYOUT+=("$legacy_path")
            continue
          fi
          ;;
      esac
      rm -rf "$legacy_path"
      echo "    removed dir: $legacy_path"
      DELETED_DIRS+=("$legacy_path")
    elif [ -f "$legacy_path" ]; then
      rm -f "$legacy_path"
      echo "    removed file: $legacy_path"
      DELETED_DIRS+=("$(dirname "$legacy_path")")
    fi
  done <<< "$LEGACY_DELETIONS"
  # Clean empty parent directories deepest-first
  for dir in "${DELETED_DIRS[@]+"${DELETED_DIRS[@]}"}"; do
    parent="$dir"
    while [ "$parent" != "." ] && [ "$parent" != "/" ]; do
      parent=$(dirname "$parent")
      [ -d "$parent" ] && rmdir "$parent" 2>/dev/null || true
    done
  done
  if [ "${#DEFERRED_LAYOUT[@]}" -gt 0 ]; then
    echo "  ${#DEFERRED_LAYOUT[@]} legacy content dir(s) preserved (have files) — run vb-update to migrate them into task folders."
  fi
fi

# ══════════════════════════════════════════════════════
# Write snapshot + version
# ══════════════════════════════════════════════════════
if [ "$GATE_REMOVED" -gt 0 ]; then
  echo "  $GATE_REMOVED unchanged file(s) of an older kit install removed."
fi
if [ "$GATE_KEPT" -gt 0 ]; then
  echo -e "  ${YELLOW}$GATE_KEPT file(s) of an older kit install kept${NC} (changed, unknown or not provable; listed above as 'kept')."
  echo "  Remove them yourself if you no longer need them."
fi

echo "$FILES" | sort > "$SNAPSHOT_FILE"
echo "$VERSION" > "$VERSION_FILE"
# Migrate: the pre-rename state files are removed only after both new ones were written.
if [ "$OLD_SNAPSHOT_FILE" != "$SNAPSHOT_FILE" ]; then rm -f "$OLD_SNAPSHOT_FILE"; fi
if [ "$OLD_VERSION_FILE" != "$VERSION_FILE" ]; then rm -f "$OLD_VERSION_FILE"; fi

# Ensure .gitignore excludes .vibecode-backup*/ (additive — never overwrites user content)
BACKUP_PATTERN=".vibecode-backup*/"
if [ ! -f ".gitignore" ]; then
  echo "$BACKUP_PATTERN" > .gitignore
  echo "  Added $BACKUP_PATTERN to .gitignore (created)"
elif ! grep -q '\.vibecode-backup\*' .gitignore 2>/dev/null; then
  # Ensure trailing newline before appending
  if [ -s ".gitignore" ] && [ "$(tail -c1 .gitignore | wc -c)" -gt 0 ] && [ "$(tail -c1 .gitignore | od -An -tx1 | tr -d ' ')" != "0a" ]; then
    echo "" >> .gitignore
  fi
  echo "$BACKUP_PATTERN" >> .gitignore
  echo "  Added $BACKUP_PATTERN to .gitignore"
fi

cleanup

# ══════════════════════════════════════════════════════
# Post-install self-check: verify discover-skills works
# ══════════════════════════════════════════════════════
if node .claude/skills/vb-context-discovery/scripts/discover-skills.mjs >/dev/null 2>&1; then
  echo "  install.sh: discover-skills OK"
else
  echo "  Warning: discover-skills.mjs returned non-zero exit. Run manually to diagnose."
fi

# ══════════════════════════════════════════════════════
# Summary
# ══════════════════════════════════════════════════════
AGENT_COUNT=$(find .claude/agents -maxdepth 1 -name '*.md' 2>/dev/null | wc -l | tr -d ' ')
SKILL_COUNT=$(find .claude/skills -maxdepth 1 -mindepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
HOOK_COUNT=$(find .claude/hooks -maxdepth 1 \( -name '*.cjs' -o -name '*.mjs' \) 2>/dev/null | wc -l | tr -d ' ')

echo ""
echo -e "  ${GREEN}Install complete.${NC} (v$VERSION)"
echo ""
echo -e "    ${CYAN}Agents${NC}:     $AGENT_COUNT (Claude Code + Codex)"
echo -e "    ${CYAN}Skills${NC}:     $SKILL_COUNT"
echo -e "    ${CYAN}Hooks${NC}:      $HOOK_COUNT"
echo -e "    ${CYAN}Files${NC}:      $INSTALLED_COUNT installed"
if [ "$SKIPPED_MERGE" -gt 0 ]; then
  echo -e "    ${CYAN}Merge${NC}:      $SKIPPED_MERGE preserved (user config)"
fi
if [ "$SKIPPED_COPY_IF_MISSING" -gt 0 ]; then
  echo -e "    ${CYAN}Existing${NC}:   $SKIPPED_COPY_IF_MISSING skipped (already present)"
fi

if [ "$HAS_EXISTING" = true ]; then
  echo ""
  echo -e "  ${YELLOW}Previous setup backed up to ${CYAN}$BACKUP_DIR/${NC}"
  echo -e "  ${YELLOW}Your process/ directory was preserved (plans, context, features).${NC}"
fi

if [ "$HAS_EXISTING" = true ] && [ -z "$PRIOR_SNAPSHOT" ]; then
  echo ""
  echo -e "  ${YELLOW}Note:${NC} No prior snapshot found. Custom vb-prefixed skills/agents"
  echo "  (if any) may have been treated as kit-owned during legacyDeletions."
  echo "  Run: ls .claude/skills/ .claude/agents/ to verify your custom files."
fi

echo ""
if [ "$HAS_EXISTING" = true ]; then
  # Upgrade path: existing harness detected before install — route to vb-update
  echo "  Next (upgrade detected):"
  echo "    1. Run: claude"
  echo '    2. Say: "Run vb-update"'
  echo ""
  echo "  vb-update will sync the new version and, if it finds old-format plans,"
  echo "  context docs, or folders, hand you a ready-to-paste prompt to finish"
  echo "  the migration."
else
  # Fresh install path: no prior harness — route to vb-setup
  echo "  Next:"
  echo "    1. Run: claude"
  echo '    2. Say: "Run vb-setup"'
  echo ""
  echo "  vb-setup will auto-detect your project, scaffold the process/"
  echo "  directory, deep-scan your codebase, and populate context with"
  echo "  your real architecture, patterns, test commands, and conventions."
fi
echo ""
