#!/usr/bin/env bash
# $H/compare-vb.sh — run the Phase 0 compare.sh on the vb- mapped validator list (copy kept inside the repo)
set -u
TF=process/general-plans/active/vibebelt-rebrand_29-10-26; H=$TF/harness; B=$TF/baseline
cd "$(git rev-parse --show-toplevel)" || exit 2
X=$(mktemp -d "$H/.compare-vb.XXXXXX") || exit 2
trap 'rm -rf "$X"' EXIT
cp -a "$B/." "$X/" && cp "$H/validators.vb.list" "$X/validators.list" || { rm -rf "$X"; exit 2; }
bash "$X/compare.sh" after_setup > "$H/compare-vb.log" 2>&1; rc=$?
cp "$X/validators.list" "$H/compare-vb.used.list"
VALIDATORS_LIST="$X/validators.list" bash "$X/run-validators.sh" "$PWD/$H/compare-vb.run" >/dev/null 2>&1 || rc=2
rm -rf "$X"
exit $rc
