# task-7-update-process: expected artifacts

Entry phase: UPDATE PROCESS (the plan is executed, EVL is green, and the execution report holds the EVL handoff summary). Validity agent: update-process-agent. Variables and procedures: `old-sandbox-recipe.md`, `rubric.md`.

`TF=process/general-plans/active/word-count-helper_30-10-26`; archive target `CF=process/general-plans/completed/word-count-helper_30-10-26`

## Fixture facts (before any run)

- `node --test test/word-count.test.mjs` from the sandbox root exits 0 (5 of 5 pass).
- `TF` holds the executed plan (all items ticked, `Gate: PASS`) and `word-count-helper_REPORT_30-10-26.md` with the EVL handoff summary (`closeout_classification: Ready for UPDATE PROCESS archival`).
- Limit: a commit made by the run moves the sandbox HEAD, `run-record.mjs verify` fails and the run is INVALID (`tasks.md`, known limits).

## Artifacts by role

| Role | Where | Expectation |
|---|---|---|
| Archived task folder | `CF` with the plan file inside; `TF` gone | present |
| Closeout | the final message or a report in `CF` | present |
| Context updates | `process/context/**` | may change |
| Source and tests | `src/`, `test/` | must NOT change |

## Scripted checks (computed, never judged)

- S1 archived: `test -f "$SB/$CF/word-count-helper_PLAN_30-10-26.md" && test ! -e "$SB/$TF"` exits 0.
- S3 status: `grep -cE '\*\*Status:\*\* (DONE|DONE_WITH_CONCERNS)' "$OUT/stream.neutral.jsonl"` prints 1 or more.
- S5 tests: `(cd "$SB" && node --test test/word-count.test.mjs)` exits 0.
- S6 changed files, with:

```bash
MUST=''
MAY='process/general-plans/*
process/context/*'
```

- S7 agents: the prefix-stripped `subagent_types` contain `update-process-agent`.

## Judged notes (added to J1-J4 in the judge input)

- J1: the archive is correct (whole task folder moved, nothing lost) and any context update is accurate for this project.
- J2: the closeout covers what was done, what was verified versus not, what remains, and the next valid state.
- J3: concrete paths and commands.
- J4: the status matches the evidence; nothing is claimed that the run did not do (for example a commit that did not happen).
