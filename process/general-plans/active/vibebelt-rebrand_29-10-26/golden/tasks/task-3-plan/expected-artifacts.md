# task-3-plan: expected artifacts

Entry phase: PLAN (research, SPEC and decision summary already exist in the fixture). Validity agent: plan-agent. A phase-program shape (umbrella plus three phase plans) is acceptable when the agent judges the three dependent requirements to be three phases; a single plan is acceptable too. Variables and procedures: `old-sandbox-recipe.md`, `rubric.md`.

`TF=process/general-plans/active/notes-upgrade_30-10-26` (holds the SPEC, the research summary and the decision summary)

## Fixture facts (before any run)

- `node --test test/notes.test.mjs` from the sandbox root exits 0 (3 of 3 pass).
- No `*_PLAN_*.md` exists anywhere in the fixture.

## Artifacts by role

| Role | Where | Expectation |
|---|---|---|
| Plan or program | one or more new `*_PLAN_*.md` under `process/general-plans/active/` or `process/features/*/active/` | present |
| Inputs | the three files in `TF` | must NOT change |
| Source and tests | `src/`, `test/` | must NOT change (PLAN writes no code) |

List the new plan files with the `plans.txt` procedure in `rubric.md` (a new folder is one `A` line in `changes.txt`; the procedure lists the `*_PLAN_*.md` files inside it).

## Scripted checks (computed, never judged)

- S1 plan present: `plans.txt` (`rubric.md`) lists at least one `*_PLAN_*.md` under `process/general-plans/active/` or `process/features/*/active/`.
- S2 requirements traced: each of `REQ-1`, `REQ-2`, `REQ-3` appears in at least one file of `plans.txt`: `for r in REQ-1 REQ-2 REQ-3; do (cd "$SB" && xargs -r grep -l -- "$r" < "$OUT/plans.txt" | head -n 1 | grep -q . && echo "$r ok" || echo "$r MISSING"); done` prints three `ok` lines.
- S3 status: `grep -cE '\*\*Status:\*\* (DONE|DONE_WITH_CONCERNS|NEEDS_CONTEXT)' "$OUT/stream.neutral.jsonl"` prints 1 or more.
- S4 validators: every new `*_PLAN_*.md` passes the kit's own `validate-plan-artifact.mjs`; a file whose name contains `umbrella` also passes the kit's own `validate-umbrella-artifact.mjs` (`rubric.md` S4).
- S5 tests: `(cd "$SB" && node --test test/notes.test.mjs)` exits 0.
- S6 changed files, with:

```bash
MUST=''
MAY='process/general-plans/active/*
process/features/*'
```

  plus: no `M` or `D` line for a file in `TF` (inputs unchanged): `grep -cE '^[MD] process/general-plans/active/notes-upgrade_30-10-26/notes-upgrade' "$OUT/changes.txt"` prints 0.

- S7 agents: the prefix-stripped `subagent_types` contain `plan-agent`.

## Judged notes (added to J1-J4 in the judge input)

- J1: the plan follows the SPEC and the decision summary (three steps in the order persistence, tags, search; the rejected alternatives are not used; no new dependency).
- J2: every requirement REQ-1 to REQ-3 and every acceptance criterion AC-1 to AC-8 maps to checklist items and to tests.
- J3: checklist items name files, functions and exact test commands (run by explicit path); dependencies between steps are explicit.
- J4: open questions and risks (corrupt-file handling, tag normalisation in one helper) are stated, not hidden; the plan stops before VALIDATE and EXECUTE.
