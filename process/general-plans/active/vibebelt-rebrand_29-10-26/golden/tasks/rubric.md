# Golden task rubric (the same for OLD and FINAL)

Two kinds of items:

- Scripted items (S1-S7) are COMPUTED from files, the run record and the stream. They are never judged.
- Judged items (J1-J4) are decided only by the blind pairwise judge (`judge.md`).

Each task's `expected-artifacts.md` gives the task-specific values (paths, `MUST`, `MAY`, commands, judged notes). Variables as in `old-sandbox-recipe.md`: `SB` sandbox root, `SNAP` snapshot of the sandbox taken right after the fixture copy, `OUT` this run's output folder, `RUNS` the runs folder of `run-record.mjs`, `RUN_ID` the run id.

## Kit-name mapping

Before any signal check, map both kits to neutral names, so a renamed signal or agent is not a difference:

```bash
sed -e 's/V[CB]-/V?-/g' -e 's/v[cb]-/v?-/g' "$OUT/stream.jsonl" > "$OUT/stream.neutral.jsonl"
```

All scripted greps on the stream read `stream.neutral.jsonl`.

## Scripted items

| Id | Item | How it is computed |
|---|---|---|
| S1 | Artifacts present | the files named in the task's "Artifacts by role" table exist (task command) |
| S2 | Required headings and lines | grep counts given by the task (for example a `## Validate Contract` section with a `Gate:` line) |
| S3 | Signal strings | grep on `stream.neutral.jsonl` for the task's status or pause strings |
| S4 | Validators green on produced plans | the kit's OWN plan validator, found by glob so it works for both prefixes: `(cd "$SB" && node .claude/skills/*-generate-plan/scripts/validate-plan-artifact.mjs <plan>)` exits 0 for every new or changed `*_PLAN_*.md` under `process/**/active/`; for a plan whose file name contains `umbrella`, also `(cd "$SB" && node .claude/skills/*-generate-phase-program/scripts/validate-umbrella-artifact.mjs <plan>)` |
| S5 | Fixture tests green | the task's test command, by EXPLICIT path from the sandbox root, exits 0 |
| S6 | No file outside the expected set changed | the changed-files procedure below prints 0 |
| S7 | Agents | `subagent_types` from the run record, with a leading `vc-`/`vb-` removed, contain the agents the task lists |

Read the agent list for S7 (and for the validity rule in `judge.md`) with:

```bash
node -e 'const r = require(require("path").resolve(process.argv[1])); console.log((r.subagent_types || []).map((t) => t.replace(/^v[cb]-/, "")).join(" "))' "$RUNS/$RUN_ID.json"
```

Result per item and run: `PASS`, `FAIL` or `N/A`. Phase 8 writes one row per task, replicate, kit and item to `$EQ/scripted.tsv` (task, replicate, kit, item, result, detail).

Combination rule (Phase 8 B4.4): a scripted item that PASSES on OLD and FAILS on FINAL in BOTH replicates of a task makes that task WORSE. An item that fails on both kits is recorded, not a regression. An item that passes only on FINAL is recorded as an improvement and is not a verdict by itself.

## Changed-files procedure (S6), binding

Detection uses `diff -rq` against the snapshot taken right after the fixture copy (recipe step 4a), never `git diff` (fixture files are untracked). It lists every changed, added or removed file, fixture and kit alike, without kit noise. Use different parent folders for `SNAP` and `SB` (the recipe does).

```bash
diff -rq -x .git "$SNAP" "$SB" > "$OUT/changes.raw.txt"; echo "diff rc=$?"   # 0 nothing changed, 1 changes listed, 2 trouble: stop and report
awk -v a="$SNAP" -v b="$SB" '
  function rest(s, p) { return substr(s, length(p) + 1) }
  function joined(s,   n) { n = index(s, ": "); return substr(s, 1, n - 1) "/" substr(s, n + 2) }
  index($0, "Files " a "/") == 1 { s = rest($0, "Files " a "/"); sub(/ and .*$/, "", s); print "M " s; next }
  index($0, "Only in " b ": ") == 1 { print "A " rest($0, "Only in " b ": "); next }
  index($0, "Only in " b "/") == 1 { print "A " joined(rest($0, "Only in " b "/")); next }
  index($0, "Only in " a ": ") == 1 { print "D " rest($0, "Only in " a ": "); next }
  index($0, "Only in " a "/") == 1 { print "D " joined(rest($0, "Only in " a "/")); next }
  { print "? " $0 }
' "$OUT/changes.raw.txt" | LC_ALL=C sort > "$OUT/changes.txt"
```

`changes.txt` holds one line per path relative to the sandbox root: `M` modified, `A` added, `D` removed (a whole new or removed folder is one line), `?` anything diff reported in another form (always unexpected).

Classify with the task's `MUST` (space-separated paths that must change) and `MAY` (one shell pattern per line; `*` also matches `/`; every `MUST` path is also in `MAY`):

```bash
: > "$OUT/changes.classified.txt"
while read -r kind path; do
  verdict=UNEXPECTED
  while IFS= read -r glob; do
    [ -n "$glob" ] || continue
    case "$path" in $glob) verdict=OK; break ;; esac
  done <<EOF
$MAY
EOF
  if [ "$verdict" = UNEXPECTED ] && [ "$kind" != "?" ] && git -C "$SB" check-ignore -q -- "$path"; then verdict=IGNORED; fi
  echo "$verdict $kind $path" >> "$OUT/changes.classified.txt"
done < "$OUT/changes.txt"
for p in $MUST; do
  grep -qxF "M $p" "$OUT/changes.txt" || grep -qxF "A $p" "$OUT/changes.txt" || echo "MISSING $p" >> "$OUT/changes.classified.txt"
done
grep -cE '^(UNEXPECTED|MISSING) ' "$OUT/changes.classified.txt"   # S6 PASS only when this prints 0
```

`IGNORED` = runtime state that the sandbox's own git ignore rules exclude (for example hook logs); it never fails S6.

## New or changed plan files (S1, S4)

A new task folder appears in `changes.txt` as one `A` line, so list the plan files inside added folders too:

```bash
grep -E '^[AM] ' "$OUT/changes.txt" | cut -d' ' -f2- | while IFS= read -r p; do
  if [ -d "$SB/$p" ]; then (cd "$SB" && find "$p" -type f -name '*_PLAN_*.md'); else case "$p" in *_PLAN_*.md) echo "$p" ;; esac; fi
done | LC_ALL=C sort > "$OUT/plans.txt"
grep -cE '^(process/general-plans/active/|process/features/[^/]+/active/)' "$OUT/plans.txt"   # S1 for plan-writing tasks: 1 or more
while IFS= read -r plan; do
  (cd "$SB" && node .claude/skills/*-generate-plan/scripts/validate-plan-artifact.mjs "$plan" > /dev/null); echo "$? $plan"
done < "$OUT/plans.txt" > "$OUT/plans.validated.txt"   # S4: every line starts with 0 (umbrella files: also the umbrella validator, see S4)
```

## Judged items (blind judge, `judge.md`)

| Id | Item | What the judge decides |
|---|---|---|
| J1 | Correctness | The work does what the task asks, and what it states is true (code meets the contract, answers match the code, plans match the SPEC). |
| J2 | Completeness | Every part of the task is covered (all checklist items, requirements, questions or closeout parts). |
| J3 | Specificity | Concrete files, functions, commands and results instead of vague statements; plans and checklists can be followed as written. |
| J4 | Honest status | The final status and every claim match the evidence; gaps and concerns are stated plainly; no success claim while something is red. |

Task-specific judged notes are in each `expected-artifacts.md`. Length and wording style are not quality.
