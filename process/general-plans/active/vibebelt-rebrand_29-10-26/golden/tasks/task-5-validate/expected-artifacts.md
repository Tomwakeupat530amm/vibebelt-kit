# task-5-validate: expected artifacts

Entry phase: VALIDATE (the plan exists; its `## Validate Contract` section is only a placeholder). Validity agent: validate-agent. Variables and procedures: `old-sandbox-recipe.md`, `rubric.md`.

`PLAN=process/general-plans/active/note-length-limit_30-10-26/note-length-limit_PLAN_30-10-26.md`

## Fixture facts (before any run)

- `node --test test/notes.test.mjs` from the sandbox root exits 0 (3 of 3 pass).
- `PLAN` passes the plan validator; its contract section holds only the sentence "Not written yet: the VALIDATE step writes this section before EXECUTE."
- Open points left in `PLAN` on purpose (a careful validation finds them): whether exactly 280 characters is still allowed (no boundary test for 280 and 281); whether the limit is checked before or after trimming; whether "characters" means UTF-16 code units (`text.length`) or code points (an emoji counts as 2 code units); the only planned test uses 500 characters.

## Artifacts by role

| Role | Where | Expectation |
|---|---|---|
| Validate-contract | the `## Validate Contract` section of `PLAN` | written (placeholder gone) |
| Plan updates | `PLAN` | may change |
| Source and tests | `src/`, `test/` | must NOT change (VALIDATE writes no code) |

## Scripted checks (computed, never judged)

- S2 contract written: in `$SB/$PLAN`, `grep -cE 'Gate: (PASS|CONDITIONAL|BLOCKED)'` prints 1 or more, `grep -c 'generated-by:'` prints 1 or more, and `grep -c 'Not written yet: the VALIDATE step'` prints 0.
- S3 status: `grep -cE '\*\*Status:\*\* (DONE|DONE_WITH_CONCERNS|BLOCKED|NEEDS_CONTEXT)' "$OUT/stream.neutral.jsonl"` prints 1 or more.
- S4 plan still valid: `(cd "$SB" && node .claude/skills/*-generate-plan/scripts/validate-plan-artifact.mjs "$PLAN")` exits 0.
- S5 tests: `(cd "$SB" && node --test test/notes.test.mjs)` exits 0.
- S6 changed files, with:

```bash
MUST='process/general-plans/active/note-length-limit_30-10-26/note-length-limit_PLAN_30-10-26.md'
MAY='process/general-plans/active/note-length-limit_30-10-26/*
process/general-plans/backlog/*'
```

- S7 agents: the prefix-stripped `subagent_types` contain `validate-agent`.

## Judged notes (added to J1-J4 in the judge input)

- J1: the gate verdict is justified by the plan's real state; the open points listed above are found and resolved (plan updated) or recorded as concerns.
- J2: the contract has exact test commands per behaviour (run by explicit path), including the boundary cases.
- J3: plan updates and execute-agent instructions are concrete (values, file names, test names).
- J4: no PASS while a found gap is neither fixed nor recorded; the run stops before EXECUTE.
