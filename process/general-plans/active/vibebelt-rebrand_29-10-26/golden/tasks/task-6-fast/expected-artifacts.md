# task-6-fast: expected artifacts

Entry phase: FAST MODE (compressed research, spec, innovate, plan and validate in one run), ending at the mandatory pause after VALIDATE. Nothing is implemented. Validity agent: fast-mode-agent. Variables and procedures: `old-sandbox-recipe.md`, `rubric.md`.

## Fixture facts (before any run)

- `node --test test/notes.test.mjs` from the sandbox root exits 0 (3 of 3 pass).
- `listNotes(store)` returns notes oldest first; there is no option yet.

## Artifacts by role

| Role | Where | Expectation |
|---|---|---|
| Plan with validate-contract | a new `*_PLAN_*.md` under `process/general-plans/active/` or `process/features/*/active/` | present |
| Pause | the final message | asks for `ENTER EXECUTE MODE` |
| Source and tests | `src/`, `test/` | must NOT change (the pause comes before EXECUTE) |

## Scripted checks (computed, never judged)

- S1 plan present: `plans.txt` (`rubric.md`) lists at least one `*_PLAN_*.md` under `process/general-plans/active/` or `process/features/*/active/`.
- S2 contract written: the plans in `plans.txt` contain `Gate: PASS`, `Gate: CONDITIONAL` or `Gate: BLOCKED`: `(cd "$SB" && xargs -r cat < "$OUT/plans.txt") | grep -cE 'Gate: (PASS|CONDITIONAL|BLOCKED)'` prints 1 or more.
- S3 pause: `grep -c 'ENTER EXECUTE MODE' "$OUT/stream.neutral.jsonl"` prints 1 or more.
- S4 validators: every new `*_PLAN_*.md` passes the kit's own `validate-plan-artifact.mjs` (`rubric.md` S4).
- S5 tests: `(cd "$SB" && node --test test/notes.test.mjs)` exits 0.
- S6 changed files, with:

```bash
MUST=''
MAY='process/general-plans/*
process/features/*'
```

- S7 agents: the prefix-stripped `subagent_types` contain `fast-mode-agent`.

## Judged notes (added to J1-J4 in the judge input)

- J1: the plan solves the request (newest first, as an option, the default order unchanged, ties handled) and the contract matches the plan.
- J2: the plan names the test cases (default order, the new option, ties) with an exact test command.
- J3: concrete file, function and option names.
- J4: the run stops at the pause and does not claim the feature is implemented.
