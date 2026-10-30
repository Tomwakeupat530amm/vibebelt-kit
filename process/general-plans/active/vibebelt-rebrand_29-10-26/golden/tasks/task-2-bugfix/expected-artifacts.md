# task-2-bugfix: expected artifacts

Entry phase: QUICK FIX lane (a plain bug report plus "Quick fix, please"; the prompt pre-authorises the edit in plain words). Validity agent: quick-fix-agent, or debugger if the router picks it (both are valid; record which one ran). Variables and procedures: `old-sandbox-recipe.md`, `rubric.md`.

## Fixture facts (before any run)

- `node --test test/format-duration.test.mjs` from the sandbox root exits 1: 3 of 4 tests fail (seconds are not zero-padded). By design.

## Artifacts by role

| Role | Where | Expectation |
|---|---|---|
| Fix | `src/format-duration.mjs` | changed |
| Acceptance tests | `test/format-duration.test.mjs` | must NOT change |
| Plan or validate-contract | anywhere | none expected (the quick-fix lane writes no plan) |

## Scripted checks (computed, never judged)

- S2 no plan written: `grep -cE '^[AM] .*_PLAN_' "$OUT/changes.txt"` prints 0.
- S3 status: `grep -cE '\*\*Status:\*\* (DONE|DONE_WITH_CONCERNS)' "$OUT/stream.neutral.jsonl"` prints 1 or more.
- S5 tests: `(cd "$SB" && node --test test/format-duration.test.mjs)` exits 0.
- S6 changed files, with:

```bash
MUST='src/format-duration.mjs'
MAY='src/format-duration.mjs'
```

- S7 agents: the prefix-stripped `subagent_types` contain `quick-fix-agent` or `debugger` (validity); record which.

## Judged notes (added to J1-J4 in the judge input)

- J1: the fix pads the seconds to two digits and changes nothing else (for example 3599 gives `59:59`, 59 still gives `0:59`).
- J2: the cause is named (missing zero-padding) and the test command result is reported.
- J3: the report names the file and line and the exact command run.
- J4: the status matches the evidence.
