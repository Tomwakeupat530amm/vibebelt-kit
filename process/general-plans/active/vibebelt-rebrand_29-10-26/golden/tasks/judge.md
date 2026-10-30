# Blind pairwise judge protocol (Phase 8 B4.5)

Applies verbatim to every judged comparison of OLD (`upstream-baseline`) and FINAL (the v1.0.0 candidate). One judge call per task x replicate (CORE: 3 tasks x 2 replicates = 6 calls). Scripted items (`rubric.md` S1-S7) are computed, never judged.

## 1. Validity (decided before any judging)

A run counts only if ALL of these hold:

1. `node $G/run-record.mjs verify <sandbox> <run-id>` exited 0, before the sandbox was removed (recipe step 8).
2. Its record's `subagent_types`, with a leading `vc-`/`vb-` removed (`rubric.md`, S7 command), contain the task's validity agent (`tasks.md`; for task-2 either quick-fix-agent or debugger).
3. The stream ends with a final result event that reports no error; a run that stopped at its budget cap or crashed is not complete.

Otherwise the run is INVALID: re-run it once if the user-acknowledged run count still allows it, otherwise report it. Never judge an INVALID run and never pay for an extra run without a new acknowledgement. A task whose pair has an INVALID run after the one re-run gets no judged verdict for that replicate; report it.

## 2. Pairing and order (blind, seeded)

- A pair is OLD replicate r and FINAL replicate r of the same task (r1 with r1, r2 with r2).
- Seed per task and replicate, from the FINAL commit the verdict is bound to:

```bash
SEED="$TASK|$R|$(cat "$EQ/final-sha.txt")"
D=$(printf '%s' "$SEED" | sha256sum | cut -c1)
case "$D" in [0-7]) echo "A=OLD B=FINAL" ;; *) echo "A=FINAL B=OLD" ;; esac
```

- Record `SEED`, `D` and the mapping in the task table of `$EQ/verdict.md`. The judge never sees the mapping.

## 3. Material shown to the judge (per output)

Built from the run's output folder only:

1. The final assistant message (the text of the stream's final result event; if it has none, the last assistant text block).
2. The changed-files list (`changes.txt`, `rubric.md`) and the unified diff of the changed text files: `diff -ru -x .git "$SNAP" "$SB"`.
3. The full text of every produced artifact that the task's `expected-artifacts.md` names under "Artifacts by role".

Nothing else: no cost, timing, model name, run id, commit id, stream metadata or scripted results.

Mask kit names in all material so that the wording cannot reveal the kit:

```bash
sed -E -e 's/\bv[cb]-/v?-/g' -e 's/\bV[CB]([-_])/V?\1/g' -e 's/vibecode-pro-max-kit|vibebelt-kit/KIT/g' -e 's/[Vv]ibecode|[Vv]ibebelt/KIT/g' "$IN" > "$IN.masked"
```

## 4. Judge call

- Judge = an ad-hoc sonnet agent with no kit agent file and no project instructions. Run it from an empty temporary folder outside any repository (so no `CLAUDE.md` is loaded), one new process per call, the same command for every call:

```bash
JD=$(mktemp -d)
(cd "$JD" && claude -p --model sonnet --output-format json --max-budget-usd "$JUDGE_CAP" < "$EQ/judge/$TASK-$R.input.md" > "$EQ/judge/$TASK-$R.output.json" 2> "$EQ/judge/$TASK-$R.stderr.txt")
rm -rf "$JD"
```

- `--model sonnet` is passed on purpose: the judge is not a kit run. `$JUDGE_CAP` is fixed at B4.1 with the other caps.
- The input goes in on stdin (print mode's default text input format), because the material can exceed the size limit of a single command-line argument.
- `$EQ/judge/$TASK-$R.input.md` = the prompt template below, filled with: the task prompt (verbatim `prompt.md`), the judged items J1-J4 (`rubric.md`) and the task's judged notes (`expected-artifacts.md`), masked material A, masked material B.

## 5. Prompt template (verbatim)

```text
You are judging two outputs, A and B. Two versions of the same AI coding workflow kit produced them for the same task and the same starting files. You do not know which version produced which output; kit names in the material are masked on purpose. Judge only the quality of the work, not wording style or length.

TASK GIVEN TO THE KIT (verbatim):
<<<TASK
{prompt.md}
TASK>>>

JUDGED ITEMS (decide each one separately):
{J1-J4 from rubric.md}
{judged notes from expected-artifacts.md}

OUTPUT A:
<<<A
{material A}
A>>>

OUTPUT B:
<<<B
{material B}
B>>>

Rules: compare A with B on each item. Answer EQUAL for an item unless one output is clearly better on it. OVERALL is A or B only if that output is clearly better on at least one item and not worse on any item; otherwise OVERALL is EQUAL.

Answer with exactly these six lines and nothing else:
J1: A|B|EQUAL
J2: A|B|EQUAL
J3: A|B|EQUAL
J4: A|B|EQUAL
OVERALL: A|B|EQUAL
REASON: <one paragraph>
```

If the answer does not have exactly these lines, record NO-VERDICT for that call (EQUAL is NOT assumed) and report it; a second call needs the user's acknowledgement.

## 6. Verdicts

- Per call: map OVERALL through the recorded order: the FINAL side clearly better = BETTER, the OLD side clearly better = WORSE, EQUAL = EQUAL.
- Per task (judged): WORSE only if WORSE in BOTH replicates; BETTER only if BETTER in both; otherwise EQUAL (a tie is EQUAL). A task that is WORSE in one replicate only is EQUAL by rule and is listed under "watch".
- Scripted (`rubric.md`, B4.4): a scripted item that passes on OLD and fails on FINAL in BOTH replicates makes the task WORSE.
- Final task verdict: WORSE if the judged verdict or the scripted rule says WORSE; else BETTER if the judged verdict is BETTER; else EQUAL.
- Record in `$EQ/verdict.md` (owned by Phase 8): per task and replicate the run ids, validity, seed and mapping, the six answer lines verbatim and the mapped verdict; per task the final verdict.
