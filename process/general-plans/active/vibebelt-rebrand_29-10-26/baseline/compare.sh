#!/usr/bin/env bash
# Usage: compare.sh [--map <file>] [before|after_setup]      (reference defaults to after_setup)
# Re-runs every validator and compares with validators_<reference>.tsv by label.
# Exit codes: 0 = nothing worse; 1 = a label is worse or a LICENSE check failed;
#             3 = some rows were skipped because the runtime differs (re-baseline needed); 2 = usage/setup error.
# LOOKUP RULE: validators.list, run-validators.sh, the reference TSV and the --map file are resolved
# relative to THIS script's own directory ($D), never to a hard-coded repo path. Only after that
# does the script cd to the repo root, so validators run from there.

D="$(cd "$(dirname "$0")" && pwd)" || exit 2

MAP=""
REF="after_setup"
while [ $# -gt 0 ]; do
  case "$1" in
    --map)
      [ -n "$2" ] || { echo "--map needs a file" >&2; exit 2; }
      case "$2" in /*) MAP="$2" ;; *) MAP="$D/$2" ;; esac
      shift 2 ;;
    before|after_setup) REF="$1"; shift ;;
    *) echo "usage: compare.sh [--map <file>] [before|after_setup]" >&2; exit 2 ;;
  esac
done

LIST="$D/validators.list"
RUNNER="$D/run-validators.sh"
REF_TSV="$D/validators_${REF}.tsv"
for f in "$LIST" "$RUNNER" "$REF_TSV"; do
  [ -f "$f" ] || { echo "missing: $f" >&2; exit 2; }
done
if [ -n "$MAP" ] && [ ! -f "$MAP" ]; then echo "missing map: $MAP" >&2; exit 2; fi

# Resolve the repo root from the script's own directory so the caller's cwd does not matter.
cd "$D" || exit 2
cd "$(git rev-parse --show-toplevel)" || exit 2

TMP="$(mktemp -d)" || exit 2
trap 'rm -rf "$TMP"' EXIT
VALIDATORS_LIST="$LIST" bash "$RUNNER" "$TMP/now" >/dev/null 2>&1 || { echo "runner failed" >&2; exit 2; }
NOW_TSV="$TMP/now.tsv"

# Apply rename map (old -> new) to the reference labels.
REF_MAPPED="$TMP/ref.tsv"
if [ -n "$MAP" ]; then
  awk -F'\t' -v OFS='\t' 'NR==FNR { if (NF>=2) m[$1]=$2; next } { if ($1 in m) $1=m[$1]; print }' "$MAP" "$REF_TSV" > "$REF_MAPPED"
else
  cp "$REF_TSV" "$REF_MAPPED"
fi

worse=0
skipped=0

# Reference rows: worse if ref 0 -> now non-zero, or missing now; runtime mismatch -> skip + NOTE.
while IFS=$'\t' read -r label rc rt; do
  [ -z "$label" ] && continue
  line="$(awk -F'\t' -v l="$label" '$1==l {print; exit}' "$NOW_TSV")"
  if [ -z "$line" ]; then
    echo "WORSE $label (missing from new run)"
    worse=1
    continue
  fi
  nrc="$(printf '%s' "$line" | cut -f2)"
  nrt="$(printf '%s' "$line" | cut -f3)"
  if [ "$rt" != "$nrt" ]; then
    echo "NOTE runtime differs for $label (ref=$rt now=$nrt): re-baseline needed"
    skipped=$((skipped + 1))
    continue
  fi
  if [ "$rc" = "0" ] && [ "$nrc" != "0" ]; then
    echo "WORSE $label (ref=0 now=$nrc)"
    worse=1
  fi
done < "$REF_MAPPED"

# Labels only in the new run.
while IFS=$'\t' read -r label rc rt; do
  [ -z "$label" ] && continue
  if ! awk -F'\t' -v l="$label" '$1==l {f=1} END {exit !f}' "$REF_MAPPED"; then
    echo "NOTE new validator $label"
  fi
done < "$NOW_TSV"

# LICENSE RULE (C-SAFE-2): runs every time.
c1="$(grep -c "Copyright (c) 2026 vibecode" LICENSE)"
[ "$c1" = "1" ] || { echo "WORSE LICENSE original-line-count ($c1)"; worse=1; }
c2="$(grep -c "Copyright (c) 2026 Tomwakeupat530amm" LICENSE)"
[ "$c2" = "1" ] || { echo "WORSE LICENSE owner-line-count ($c2)"; worse=1; }
c3="$(git diff upstream-baseline -- LICENSE | grep -c '^-[^-]')"
[ "$c3" = "0" ] || { echo "WORSE LICENSE original-lines-removed ($c3)"; worse=1; }

if [ "$worse" -ne 0 ]; then exit 1; fi
if [ "$skipped" -gt 0 ]; then
  echo "NOTE $skipped row(s) skipped for runtime mismatch: re-run run-validators.sh into validators_after_setup.<runtime>.tsv and compare against it"
  exit 3
fi
echo "OK: nothing worse than validators_${REF}.tsv"
exit 0
