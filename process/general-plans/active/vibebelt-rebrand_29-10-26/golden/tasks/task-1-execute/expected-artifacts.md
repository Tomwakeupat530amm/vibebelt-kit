# task-1-execute: expected artifacts

Entry phase: EXECUTE (the plan already carries a PASS validate-contract). Validity agent: execute-agent. Also expected: tester (EVL confirmation run). Variables and procedures: `old-sandbox-recipe.md`, `rubric.md`.

`PLAN=process/general-plans/active/slugify-helper_30-10-26/slugify-helper_PLAN_30-10-26.md`

## Fixture facts (before any run)

- `node --test test/slugify.test.mjs` from the sandbox root exits 1: 5 of 5 tests fail (`slugify` is a stub). By design.
- `PLAN` passes the plan validator of both kits with 0 failures and 0 warnings, and contains the line `Gate: PASS`.

## Artifacts by role

| Role | Where | Expectation |
|---|---|---|
| Implementation | `src/slugify.mjs` | changed |
| Plan progress | `PLAN` | may change (ticks, status) and must stay valid |
| Execution report | a `*_REPORT_*.md` in `process/general-plans/active/slugify-helper_30-10-26/` | present |
| EVL bookkeeping | other files in the same task folder | may appear |
| Acceptance tests | `test/slugify.test.mjs` | must NOT change |

## Scripted checks (computed, never judged)

- S1 report: `ls "$SB"/process/general-plans/active/slugify-helper_30-10-26/*_REPORT_*.md` lists at least one file.
- S3 status: `grep -cE '\*\*Status:\*\* (DONE|DONE_WITH_CONCERNS)' "$OUT/stream.neutral.jsonl"` prints 1 or more.
- S4 plan still valid: `(cd "$SB" && node .claude/skills/*-generate-plan/scripts/validate-plan-artifact.mjs "$PLAN")` exits 0.
- S5 tests: `(cd "$SB" && node --test test/slugify.test.mjs)` exits 0.
- S6 changed files, with:

```bash
MUST='src/slugify.mjs'
MAY='src/slugify.mjs
process/general-plans/active/slugify-helper_30-10-26/*'
```

- S7 agents: the prefix-stripped `subagent_types` contain `execute-agent` (validity) and `tester` (scripted item: the EVL confirmation run happened).

## Judged notes (added to J1-J4 in the judge input)

- J1: `slugify` follows every rule in the plan's Public Contracts, including the empty result and the `TypeError`, without editing the tests.
- J2: every checklist item is done and reported; the gate command was run and its result reported.
- J3: the report names the changed file, the exact commands run and their results.
- J4: the final status matches the evidence; anything left open is stated plainly.
