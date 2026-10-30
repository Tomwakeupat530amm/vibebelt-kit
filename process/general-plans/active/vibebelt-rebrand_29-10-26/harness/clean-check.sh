#!/usr/bin/env bash
# harness/clean-check.sh - C-CLEAN gate (umbrella "## Clean Final Tree (C-CLEAN)", CC1-CC8), Phase 8 step C0a.
#
# Usage: bash clean-check.sh --final <sha> [--repo <dir>] [--quick]
#   --repo   work tree to check; use a fresh clone of the candidate commit (default: git top level of cwd)
#   --final  code reference commit for CC4/CC7. B4 FINAL when B4 runs; B4 was skipped by user decision
#            (2026-10-30), so Phase 8 passes the commit right before the cleanup commit.
#   --quick  CC1-CC4, CC7, CC8 only (skips CC5 validators and CC6 install/e2e smoke)
# Exit: 0 every check passed; 1 at least one check failed; 2 usage or setup error.
# Needs: bash, git, Linux node >= 22. Reads ../baseline/run-validators.sh, ../baseline/validators_before.tsv,
# ./validators.vb.list and ./check-links.mjs next to this script. Writes only to a mktemp folder.
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" || exit 2
B="$HERE/../baseline"
REPO=""; FINAL=""; QUICK=0
while [ $# -gt 0 ]; do
  case "$1" in
    --repo) REPO="${2:-}"; [ -n "$REPO" ] || { echo "--repo needs a folder" >&2; exit 2; }; shift 2 ;;
    --final) FINAL="${2:-}"; [ -n "$FINAL" ] || { echo "--final needs a commit" >&2; exit 2; }; shift 2 ;;
    --quick) QUICK=1; shift ;;
    *) echo "usage: clean-check.sh --final <sha> [--repo <dir>] [--quick]" >&2; exit 2 ;;
  esac
done
[ -n "$REPO" ] || REPO="$(git rev-parse --show-toplevel)" || exit 2
REPO="$(cd "$REPO" && pwd)" || { echo "no such folder: $REPO" >&2; exit 2; }
[ -n "$FINAL" ] || { echo "--final <sha> is required" >&2; exit 2; }
G() { git -C "$REPO" -c core.quotePath=false "$@"; }
G rev-parse --verify --quiet "$FINAL^{commit}" >/dev/null || { echo "unknown commit: $FINAL" >&2; exit 2; }
command -v node >/dev/null 2>&1 || { echo "node not found" >&2; exit 2; }
for f in "$HERE/check-links.mjs" "$HERE/validators.vb.list" "$B/run-validators.sh" "$B/validators_before.tsv"; do
  [ -f "$f" ] || { echo "missing: $f" >&2; exit 2; }
done
W="$(mktemp -d)" || exit 2
trap 'rm -rf "$W"' EXIT
fail=0
ok() { echo "PASS $*"; }
bad() { echo "FAIL $*"; fail=1; }
echo "clean-check: repo=$REPO head=$(G rev-parse --short HEAD) final=$(G rev-parse --short "$FINAL") quick=$QUICK"

G ls-files | LC_ALL=C sort -u > "$W/tracked"

# ---- CC1 allowed-list diff -------------------------------------------------------------------------
# Group A: what the installer copies (resolver output).
if (cd "$REPO" && node resolve-manifest.mjs --root . --json) > "$W/resolved.json" 2> "$W/resolved.err"; then
  node -e 'for (const f of JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")).files) console.log(f)' \
    "$W/resolved.json" | LC_ALL=C sort -u > "$W/groupA"
else
  : > "$W/groupA"; bad "CC1 resolver failed: $(head -3 "$W/resolved.err")"
fi
# Group C: enumerated kit-source files, plus assets the two READMEs reference.
cat > "$W/groupC.raw" <<'EOF'
README.md
docs/i18n/README.en.md
LICENSE
CHANGELOG.md
SECURITY.md
CONTRIBUTING.md
install.sh
resolve-manifest.mjs
compute-sync-plan.mjs
vb-manifest.json
legacy-hashes.json
e2e-kit-flows.test.mjs
scripts/test-compute-sync-plan.mjs
.gitignore
.gitattributes
.markdownlint.json
.github/workflows/validate.yml
.github/workflows/release.yml
.github/release.yml
.github/workflows/labeler.yml
.github/labeler.yml
.github/workflows/welcome.yml
.github/pull_request_template.md
.github/ISSUE_TEMPLATE/1.bug_report.yml
.github/ISSUE_TEMPLATE/2.feature_request.yml
.github/ISSUE_TEMPLATE/3.skill_submission.yml
.github/ISSUE_TEMPLATE/4.agent_submission.yml
.github/ISSUE_TEMPLATE/config.yml
process/features/.gitkeep
process/general-plans/active/.gitkeep
process/general-plans/backlog/.gitkeep
process/general-plans/completed/.gitkeep
EOF
for d in README.md docs/i18n/README.en.md; do
  [ -f "$REPO/$d" ] && grep -oE '(\.\./)*assets/[^]) "'"'"'>]+' "$REPO/$d" | sed -E 's#^(\.\./)+##'
done >> "$W/groupC.raw"
LC_ALL=C sort -u "$W/groupC.raw" > "$W/groupC"
# Deny patterns (shared by CC1 group B and CC2).
DENY='vibebelt-rebrand|results\.tsv|(^|/)(golden|baseline|eq|harness|p4-tools|p5-tools)/|^process/general-plans/backlog/.*_NOTE_|^process/context/.*\.seed$|QUICKSTART|GLOSSARY'
# Group B: tracked .claude/ and .codex/ paths the manifest does not install (kit tests, lockfiles),
# unless they hit a deny pattern; plus the .agents/skills symlink.
grep -E '^(\.claude|\.codex)/' "$W/tracked" | LC_ALL=C comm -23 - "$W/groupA" | grep -v -E "$DENY" > "$W/groupB"
echo ".agents/skills" >> "$W/groupB"
LC_ALL=C sort -u "$W/groupA" "$W/groupB" "$W/groupC" > "$W/allowed"
LC_ALL=C comm -23 "$W/tracked" "$W/allowed" > "$W/extra"
LC_ALL=C sort -u "$W/groupA" "$W/groupC" | LC_ALL=C comm -23 - "$W/tracked" > "$W/missing"
echo "CC1 counts: tracked=$(wc -l < "$W/tracked") groupA=$(wc -l < "$W/groupA") groupB=$(wc -l < "$W/groupB") groupC=$(wc -l < "$W/groupC") extra=$(wc -l < "$W/extra") missing=$(wc -l < "$W/missing")"
if [ -s "$W/extra" ] || [ -s "$W/missing" ]; then
  sed 's/^/  EXTRA /' "$W/extra" | head -40; sed 's/^/  MISSING /' "$W/missing" | head -40
  bad "CC1 allowed-list diff (extra=$(wc -l < "$W/extra") missing=$(wc -l < "$W/missing"))"
else
  ok "CC1 allowed-list diff (tracked = ALLOWED LIST)"
fi

# ---- CC2 deny patterns -------------------------------------------------------------------------------
{
  grep -v -E '^(\.claude|\.codex)/' "$W/tracked" | grep -E "$DENY"
  grep -E '^process/context/' "$W/tracked" | grep -v -x 'process/context/generated-skills-catalog.json'
  grep -E '^docs/i18n/' "$W/tracked" | grep -v -x 'docs/i18n/README.en.md'
  grep -E 'QUICKSTART|GLOSSARY' "$W/tracked"
} | LC_ALL=C sort -u > "$W/denied"
if [ -s "$W/denied" ]; then
  sed 's/^/  DENIED /' "$W/denied" | head -40; bad "CC2 deny patterns ($(wc -l < "$W/denied") path(s))"
else
  ok "CC2 deny patterns (no program, generated-context, extra-translation or QUICKSTART/GLOSSARY path)"
fi

# ---- CC3 link check ----------------------------------------------------------------------------------
if node "$HERE/check-links.mjs" --repo "$REPO" > "$W/links" 2>&1; then
  ok "CC3 $(tail -1 "$W/links")"
else
  sed 's/^/  /' "$W/links" | head -40; bad "CC3 link check"
fi

# ---- CC4 code byte-identity --------------------------------------------------------------------------
PATHSPEC=(.claude .codex CLAUDE.md AGENTS.md process/development-protocols process/_seeds install.sh resolve-manifest.mjs compute-sync-plan.mjs vb-manifest.json legacy-hashes.json)
G diff --name-only "$FINAL" HEAD -- "${PATHSPEC[@]}" > "$W/codediff"
G diff --name-only --diff-filter=ACMRT "$FINAL" HEAD > "$W/acmrt"
grep -v -E '^(README\.md|SECURITY\.md|CONTRIBUTING\.md|CHANGELOG\.md|docs/.+|\.github/.+)$' "$W/acmrt" > "$W/acmrt.code"
if [ -s "$W/codediff" ] || [ -s "$W/acmrt.code" ]; then
  sed 's/^/  CODE-CHANGED /' "$W/codediff" "$W/acmrt.code" | head -40; bad "CC4 code paths differ from $FINAL"
else
  ok "CC4 code paths byte-identical to $(G rev-parse --short "$FINAL"); added/changed since then: $(tr '\n' ' ' < "$W/acmrt")"
fi

# ---- CC5 validators on the cleaned tree (bare-kit reference) -----------------------------------------
if [ "$QUICK" = 0 ]; then
  # validate-plan-artifact rows target program plans that the cleanup removes by design.
  grep -v -E '^validate-plan-artifact:' "$HERE/validators.vb.list" > "$W/list"
  grep -v -E '^validate-plan-artifact:' "$B/validators_before.tsv" > "$W/ref.tsv"
  if (cd "$REPO" && VALIDATORS_LIST="$W/list" bash "$B/run-validators.sh" "$W/now") >/dev/null 2>&1; then
    worse=0
    while IFS=$'\t' read -r label rc rt; do
      [ -z "$label" ] && continue
      line="$(awk -F'\t' -v l="$label" '$1==l {print; exit}' "$W/now.tsv")"
      if [ -z "$line" ]; then echo "  WORSE $label (missing from new run)"; worse=1; continue; fi
      nrc="$(printf '%s' "$line" | cut -f2)"; nrt="$(printf '%s' "$line" | cut -f3)"
      if [ "$rt" != "$nrt" ]; then echo "  MISMATCH runtime differs for $label (ref=$rt now=$nrt): run with Linux node"; worse=1; continue; fi
      if [ "$rc" = "0" ] && [ "$nrc" != "0" ]; then echo "  WORSE $label (ref=0 now=$nrc)"; worse=1; fi
    done < "$W/ref.tsv"
    sed 's/^/  now /' "$W/now.tsv"
    c1="$(grep -c 'Copyright (c) 2026 vibecode' "$REPO/LICENSE")"
    c2="$(grep -c 'Copyright (c) 2026 Tomwakeupat530amm' "$REPO/LICENSE")"
    c3="$(G diff upstream-baseline -- LICENSE | grep -c '^-[^-]')"
    [ "$c1" = 1 ] && [ "$c2" = 1 ] && [ "$c3" = 0 ] || { echo "  WORSE LICENSE (original=$c1 owner=$c2 removed=$c3)"; worse=1; }
    vac="$(awk -F'\t' '$1=="validate-all-context" {print $2}' "$W/now.tsv")"
    [ "$vac" = 0 ] || { echo "  WORSE validate-all-context exit=$vac in bare-kit mode"; worse=1; }
    grep -q 'bare-kit mode' "$W/now.txt" && echo "  note: validate-all-context ran in bare-kit mode"
    if [ "$worse" = 0 ]; then ok "CC5 validators not worse than bare-kit validators_before.tsv; LICENSE rule holds"; else bad "CC5 validators"; fi
  else
    bad "CC5 run-validators.sh failed"
  fi
else
  echo "SKIP CC5 (--quick)"
fi

# ---- CC6 smoke: fresh install, e2e trials, sync-plan tests -------------------------------------------
if [ "$QUICK" = 0 ]; then
  mkdir -p "$W/fresh"
  if (cd "$W/fresh" && VB_KIT_SOURCE="$REPO" bash "$REPO/install.sh" </dev/null > "$W/install.log" 2>&1); then
    v="$(cat "$W/fresh/.vb-version" 2>/dev/null)"; mv="$(node -e 'console.log(require(process.argv[1]).version)' "$REPO/vb-manifest.json")"
    na="$(ls "$W/fresh/.claude/agents/"*.md 2>/dev/null | wc -l)"; nt="$(ls "$W/fresh/.codex/agents/"*.toml 2>/dev/null | wc -l)"
    ns="$(ls -d "$W/fresh/.claude/skills/vb-"*/ 2>/dev/null | wc -l)"
    nvc="$(cd "$W/fresh" && find . \( -name 'vc-*' -o -name '.vc-*' \) | wc -l)"
    if [ "$v" = "$mv" ] && [ "$na" = 15 ] && [ "$nt" = 15 ] && [ "$ns" = 33 ] && [ "$nvc" = 0 ] && [ -f "$W/fresh/.vb-installed-files" ]; then
      ok "CC6 fresh install: .vb-version=$v agents=$na toml=$nt skills=$ns old-prefix-paths=$nvc"
    else
      bad "CC6 fresh install: .vb-version=$v (manifest $mv) agents=$na toml=$nt skills=$ns old-prefix-paths=$nvc"
    fi
  else
    tail -5 "$W/install.log" | sed 's/^/  /'; bad "CC6 fresh install exit non-zero"
  fi
  if (cd "$REPO" && node --test e2e-kit-flows.test.mjs </dev/null > "$W/e2e.tap" 2>&1); then
    ok "CC6 e2e $(grep -E '^# (pass|fail) ' "$W/e2e.tap" | tr '\n' ' ')"
  else
    grep -E '^(not )?ok ' "$W/e2e.tap" | sed 's/^/  /'; bad "CC6 e2e $(grep -E '^# (pass|fail) ' "$W/e2e.tap" | tr '\n' ' ')"
  fi
  if (cd "$REPO" && node scripts/test-compute-sync-plan.mjs </dev/null > "$W/csp.tap" 2>&1); then
    ok "CC6 test-compute-sync-plan $(grep -E '^# (pass|fail) ' "$W/csp.tap" | tr '\n' ' ')"
  else
    tail -15 "$W/csp.tap" | sed 's/^/  /'; bad "CC6 test-compute-sync-plan"
  fi
else
  echo "SKIP CC6 (--quick)"
fi

# ---- CC7 history ---------------------------------------------------------------------------------------
nf="$(G rev-list --count "$FINAL")"; nh="$(G rev-list --count HEAD)"
if G merge-base --is-ancestor "$FINAL" HEAD && [ "$nh" -ge $((nf + 1)) ] && [ -n "$(G tag -l upstream-baseline)" ]; then
  ok "CC7 history kept: $FINAL is an ancestor of HEAD; commits $nf -> $nh; tag upstream-baseline present"
else
  bad "CC7 history (ancestor check, commit count $nf -> $nh, or upstream-baseline tag missing)"
fi

# ---- CC8 tag tree --------------------------------------------------------------------------------------
G ls-tree -r --name-only HEAD | LC_ALL=C sort -u > "$W/headtree"
if G rev-parse --verify --quiet "refs/tags/v1.0.0" >/dev/null; then
  G ls-tree -r --name-only v1.0.0 | LC_ALL=C sort -u > "$W/tagtree"
  if cmp -s "$W/tagtree" "$W/tracked"; then ok "CC8 v1.0.0 tree equals the checked index"; else bad "CC8 v1.0.0 tree differs from the checked index"; fi
else
  if cmp -s "$W/headtree" "$W/tracked"; then
    echo "SKIP CC8 (no local tag v1.0.0: tagging waits for the user's go-ahead); proxy: HEAD tree equals the checked index"
  else
    bad "CC8 proxy: HEAD tree differs from the checked index"
  fi
fi

if [ "$fail" = 0 ]; then echo "CLEAN-CHECK: PASS"; exit 0; fi
echo "CLEAN-CHECK: FAIL"; exit 1
