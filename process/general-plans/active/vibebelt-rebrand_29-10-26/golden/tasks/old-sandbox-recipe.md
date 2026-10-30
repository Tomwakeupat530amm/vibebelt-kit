# OLD and FINAL sandbox recipe (Phase 8 B4; used as written)

TL;DR: every counted run gets a fresh throw-away git worktree OUTSIDE the repository, prepared the same way for both kits except for the kit itself. The fixture is copied in, the sandbox is snapshotted, the agent files are recorded, the run happens in a new process, and the run is verified before anything is judged. OLD = tag `upstream-baseline` plus the Phase 0 `process/context/**` from commit `1e81834`. FINAL = the candidate commit in `$EQ/final-sha.txt` without the program task folder.

Run every block with Linux `node` (Node 22) and `bash` from any directory; paths are absolute through `$REPO`.

## Variables (set once per run)

```bash
REPO=/absolute/path/to/the/kit/repository       # main worktree
T=process/general-plans/active/vibebelt-rebrand_29-10-26
G=$T/golden; GT=$G/tasks; EQ=$REPO/$T/eq
WORK=$HOME/vb-eq-work                           # outside the repository, on the Linux filesystem
KIT=old                                         # old | final
TASK=task-1-execute                             # a task folder name under $GT
R=r1                                            # replicate: r1 | r2
RUN_ID=$KIT-$TASK-$R
SB=$WORK/sb/$RUN_ID                             # sandbox root
SNAP=$WORK/snap/$RUN_ID                         # snapshot taken right after the fixture copy
OUT=$EQ/$KIT/$TASK-$R                           # this run's output folder (Phase 8 owns eq/)
RUNS_OPT=""                                     # or RUNS_OPT="--runs-dir $EQ/runs" (step 6, hand-off H5)
RUNS=${RUNS_OPT#--runs-dir }; RUNS=${RUNS:-$REPO/$G/runs}
mkdir -p "$WORK/sb" "$WORK/snap" "$OUT"
```

## Steps

1. Create the worktree (detached HEAD in both cases):

```bash
git -C "$REPO" worktree add "$SB" upstream-baseline                 # OLD
git -C "$REPO" worktree add "$SB" "$(cat "$EQ/final-sha.txt")"      # FINAL
```

2. Project context, OLD only. Copy the Phase 0 `process/context/**` FROM COMMIT `1e81834`, NEVER from the working tree: the working tree would give OLD the FINAL `vb-` catalog, and with no context at all the Bootstrap Guard in `CLAUDE.md` fires. FINAL keeps its own committed `process/context/**`.

```bash
git -C "$REPO" archive 1e81834 process/context | tar -x -C "$SB"    # OLD only
test -f "$SB/process/context/all-context.md" && echo "context OK"   # both kits
```

3. Program task folder: plan discovery must not see the program's own plans. OLD never had it; FINAL removes it after creation.

```bash
test ! -e "$SB/$T" && echo "no program folder"                       # OLD
rm -rf "$SB/process/general-plans/active/vibebelt-rebrand_29-10-26"  # FINAL
ls -A "$SB/process/general-plans/active"                             # both: record the listing
```

   The other by-design differences between the trees are listed in the last section (E3).

4. Copy the task fixture into the sandbox root. First check that no fixture file would overwrite a kit file (expected: no output):

```bash
(cd "$REPO/$GT/$TASK/fixture" && find . -type f) | while IFS= read -r f; do test -e "$SB/$f" && echo "COLLISION $f"; done
cp -a "$REPO/$GT/$TASK/fixture/." "$SB/"
```

   4a. Snapshot for change detection (`rubric.md` S6), right after the copy:

```bash
rsync -a --exclude .git "$SB/" "$SNAP/"
```

5. No model override. Nothing is passed (`run-flags.md`); each kit's own agent front-matter decides.

6. Record which agent files are on disk:

```bash
node "$REPO/$G/run-record.mjs" record "$SB" "$RUN_ID" $RUNS_OPT
```

   With `RUNS_OPT` empty the record lands in `$REPO/$G/runs/` (not covered by `FROZEN.sha256`; the task folder leaves the release tree at C0b). Phase 8 may set `RUNS_OPT="--runs-dir $EQ/runs"` to keep every write under `eq/` (hand-off H5); use the same value for all three subcommands of a run.

7. Run with the exact command in `run-flags.md`: one NEW OS process per run, started from the sandbox root. It writes `$OUT/stream.jsonl`. Note the start time first: `date -u +%FT%TZ > "$OUT/start.txt"`.

8. Before judging, while the sandbox still exists:

```bash
node "$REPO/$G/run-record.mjs" subagents "$OUT/stream.jsonl" "$RUN_ID" $RUNS_OPT
node "$REPO/$G/run-record.mjs" verify "$SB" "$RUN_ID" $RUNS_OPT; echo "verify rc=$?" | tee "$OUT/verify.txt"   # must be 0, else INVALID (judge.md)
```

   Then collect what the rubric and the judge need, into `$OUT`:
   - the changed-files procedure of `rubric.md` with the task's `MUST` and `MAY` (writes `changes.raw.txt`, `changes.txt`, `changes.classified.txt`);
   - `diff -ru -x .git "$SNAP" "$SB" > "$OUT/changes.diff"`;
   - the task's scripted checks (`expected-artifacts.md`), each with its output and exit code;
   - copies of every added or modified path that is not IGNORED:

```bash
mkdir -p "$OUT/files"
grep -E '^(OK|UNEXPECTED) [AM] ' "$OUT/changes.classified.txt" | cut -d' ' -f3- | while IFS= read -r p; do (cd "$SB" && cp -r --parents -- "$p" "$OUT/files/"); done
```

9. Per-run values to record (one row per run in `$EQ/verdict.md` or a table next to it): sandbox path, kit SHA (`sandbox_head` in the record), run id, task, replicate, start time, model (stream init event), cost reported by the stream (final result event), `claude` exit code, verify result.

10. Cleanup. The sandbox holds untracked files, so `git worktree remove` needs `--force`:

```bash
git -C "$REPO" worktree remove --force "$SB"
git -C "$REPO" worktree prune
rm -rf "$SNAP"
git -C "$REPO" worktree list    # expected: the main worktree only (plus any worktree that existed before B4)
```

Shared-repository safety: a worktree shares this repository's objects, refs and configuration, including the local git identity. A run that commits moves only its own detached HEAD, and then `verify` fails (INVALID). A run that creates a branch or a tag creates it in THIS repository. Before the first run save `git -C "$REPO" for-each-ref --format='%(refname)' > "$EQ/refs-before.txt"`; after each run compare and report any new ref; never delete a ref without the user's approval.

## By-design OLD versus FINAL tree differences (E3; input for `$EQ/diff-excluded.txt`)

OLD and FINAL differ in many non-agent files by design (rename, docs, identity, cleanup), so B4 compares JUDGED OUTCOMES and scripted artifact checks, NEVER file equality of the trees.

Measured at the Phase 3 start (commit `bdf0685`, program folder excluded): 93 paths differ from `upstream-baseline` (48 added, 40 modified, 4 deleted, 1 type change); 3 of them are agent files (the `effort: max` lines) and 7 are under `process/context/`. After the Phase 6 rename nearly every kit file differs in name or content.

Every line of `$EQ/diff.txt` must belong to one of these classes; anything else is unexplained: explain it or stop.

| Class | Paths | Why |
|---|---|---|
| Program folder | `process/general-plans/active/vibebelt-rebrand_29-10-26/**` | removed from FINAL in step 3; OLD never had it |
| Project context | `process/context/**` | OLD gets the Phase 0 copy (`1e81834`); FINAL has later edits and regenerated catalogs |
| Setup scaffold | FINAL only: `process/features/_GUIDE.md`, `process/features/_feature-template/**`, `process/general-plans/{active,backlog,completed}/_GUIDE.md`; OLD only: `process/general-plans/{references,reports}/.gitkeep` | Phase 0 setup output (copies of `process/_seeds/**`) |
| Program backlog notes | FINAL only: `process/general-plans/backlog/*_NOTE_*.md` | maintainer notes of this program |
| Phase 0-2 edits (measured) | `LICENSE`, `.gitignore`, `.agents/skills` (index type), `CLAUDE.md`, `README.md`, `docs/i18n/README.*.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`, `.github/**` (`FUNDING.yml` removed, issue templates, workflows), `assets/flowser-logo.svg` (removed), `install.sh`, `resolve-manifest.mjs`, `vc-manifest.json`, `e2e-kit-flows.test.mjs`, `process/development-protocols/{implementation-standards.md,orchestration.md,vc-system-behavior/04-research.md,07-plan.md,08-validate.md}`, `.claude/agents/vc-{execute,fast-mode,quick-fix}-agent.md` (effort only), `.claude/skills/{vc-agent-strategy-compare,vc-audit-vc,vc-publish,vc-setup,vc-update}/**` | identity, docs, CI and model-policy fixes |
| Phase 4 (planned) | `AGENTS.md`, `process/development-protocols/orchestration.md`, `process/development-protocols/all-development-protocols.md` | safe tidy |
| Phase 5 (planned) | `.claude/skills/*/SKILL.md` front-matter, the `vc-intent-clarify` split (new `references/` files), `process/context/generated-skills-catalog.json` | minimal skill tuning |
| Phase 6 (planned) | every name and text carrying `vc-`/`VC-`/`VC_` (`.claude/**`, `.codex/**`, `process/**`, `CLAUDE.md`, `AGENTS.md`, docs, installer files), `vc-manifest.json` to `vb-manifest.json`, new `scripts/**`, `legacy-hashes.json` | the prefix rename |
| Phase 7 (planned) | `README.md`, `docs/i18n/README.vi-VN.md`, agent prose, `scripts/check-docs.mjs` and its fixtures | plain-language docs |
| Phase 8 (planned) | `e2e-kit-flows.test.mjs` (A0), installer fixes, `CHANGELOG.md` | install and release work before B4 |

Recompute the real list at B4.2:

```bash
git -C "$REPO" diff --name-status upstream-baseline "$(cat "$EQ/final-sha.txt")" -- . ":!$T" > "$EQ/diff-by-design.txt"
```
