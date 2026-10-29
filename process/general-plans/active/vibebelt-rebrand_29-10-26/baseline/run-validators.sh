#!/usr/bin/env bash
cd "$(git rev-parse --show-toplevel)" || exit 2
# Usage: run-validators.sh <out-prefix>
# Runs every line of validators.list (label<TAB>command) from the repo root, never stopping on a red one.
# Writes <out-prefix>.tsv (label, exit code, runtime; 3 tab-separated fields) and
# <out-prefix>.txt (header line "# runtime=<name>" + full stdout/stderr of each validator).
# Relative paths (this script, <out-prefix>) are resolved against the caller's directory ($OLDPWD).
# VALIDATORS_LIST may override the list path (used by compare.sh).

CALLER_DIR="${OLDPWD:-$PWD}"
abspath() { case "$1" in /*) printf '%s' "$1" ;; *) printf '%s/%s' "$CALLER_DIR" "$1" ;; esac; }

SCRIPT_DIR="$(cd "$(dirname "$(abspath "${BASH_SOURCE[0]}")")" && pwd)"
LIST="${VALIDATORS_LIST:-$SCRIPT_DIR/validators.list}"

if [ -z "$1" ]; then
  echo "usage: run-validators.sh <out-prefix>" >&2
  exit 2
fi
OUT="$(abspath "$1")"
if [ ! -f "$LIST" ]; then
  echo "validators.list not found: $LIST" >&2
  exit 2
fi

if command -v node >/dev/null 2>&1; then
  RT=node
elif command -v node.exe >/dev/null 2>&1; then
  RT=node.exe
else
  echo "no node runtime found (node or node.exe)" >&2
  exit 2
fi

: > "$OUT.tsv" || exit 2
printf '# runtime=%s\n' "$RT" > "$OUT.txt" || exit 2

while IFS=$'\t' read -r label cmd || [ -n "$label" ]; do
  [ -z "$label" ] && continue
  case "$label" in \#*) continue ;; esac
  case "$cmd" in
    "node "*) cmd="$RT ${cmd#node }" ;;
  esac
  printf '\n===== %s =====\n$ %s\n' "$label" "$cmd" >> "$OUT.txt"
  bash -c "$cmd" </dev/null >> "$OUT.txt" 2>&1
  rc=$?
  printf '[exit %s]\n' "$rc" >> "$OUT.txt"
  printf '%s\t%s\t%s\n' "$label" "$rc" "$RT" >> "$OUT.tsv"
done < "$LIST"

exit 0
