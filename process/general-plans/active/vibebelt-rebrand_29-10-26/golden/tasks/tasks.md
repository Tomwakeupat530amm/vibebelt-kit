# Golden task set (index)

Frozen in Phase 3 of the vibebelt-rebrand program for the Phase 8 FINAL EQUIVALENCE GATE (step B4). OLD (`upstream-baseline`) and FINAL (the v1.0.0 candidate) run the SAME definitions; see `FROZEN.md`.

Design rule: a headless `claude -p` run with a plain feature request stops at the first workflow gate, and autopilot needs a question round that a headless run cannot answer. So every task STARTS AT THE PHASE UNDER TEST: its `fixture/` already holds the earlier artifacts, and its `prompt.md` is the single user message that enters that phase. Prompts are plain user language, identical for OLD and FINAL, and name no kit agent or skill (mode commands such as `ENTER EXECUTE MODE` are the same in both kits).

Agent names below are prefix-free keys: `execute-agent` means `vc-execute-agent` in OLD and `vb-execute-agent` in FINAL. The validity agent of a task is the one `judge.md` requires in the run record (`subagent_types`, prefix removed).

Files per task folder: `prompt.md` (the exact message, nothing else), `fixture/` (complete starting files; never `.claude/`, `.codex/` or `process/context/`: those come from the kit under test), `expected-artifacts.md` (artifacts by role, scripted checks, judged items). Shared files: `rubric.md`, `judge.md`, `old-sandbox-recipe.md`, `run-flags.md`.

## Index

| Task id | Set | Entry phase | Agents it is meant to spawn (validity agent first) | Fixture summary | Budget class |
|---|---|---|---|---|---|
| task-1-execute | CORE | EXECUTE | execute-agent, then tester (EVL confirmation run) | `slugify` stub, 5 failing `node:test` cases, a plan with a PASS validate-contract | M |
| task-2-bugfix | CORE | QUICK FIX lane | quick-fix-agent, or debugger if the router picks it (either is valid; which one is recorded, not failed) | `formatDuration` zero-padding bug, 4 tests (3 fail) | S |
| task-3-plan | CORE | PLAN | plan-agent (phase-program shape if it judges 3 phases) | in-memory notes store, a locked SPEC (REQ-1 to REQ-3), research summary, decision summary | M |
| task-4-research | EXTENDED | RESEARCH | research-agent | small sign-up service (router, validation, handler, in-memory db), passing tests | S |
| task-5-validate | EXTENDED | VALIDATE | validate-agent | notes store and a plan without a validate-contract (it has open points on purpose) | M |
| task-6-fast | EXTENDED | FAST MODE, ends at the mandatory pause after VALIDATE | fast-mode-agent | notes store; the feature request is in the prompt | L |
| task-7-update-process | EXTENDED | UPDATE PROCESS | update-process-agent | `wordCount` implemented, executed plan, execution report with the EVL handoff summary | M |

## Run counts (Phase 8 B4.1)

- CORE, always run: 3 tasks x 2 replicates x 2 kits = 12 task runs + 6 judge calls = 18 billed calls, plus 1 rehearsal run (B4.1a: `task-1-execute` once on FINAL, never judged).
- EXTENDED, run only if the user acknowledges the higher count at B4.1b: each task adds 4 task runs + 2 judge calls.

## Budget classes (per-run cap for `--max-budget-usd`, see `run-flags.md`)

- C = the cost of the B4.1a rehearsal run (a class M task), read from its stream.
- Cap S = 2 x C, M = 3 x C, L = 5 x C, in USD, rounded up to the next 0.50.
- The same cap applies to OLD and FINAL. Caps are fixed and recorded before the first counted run. The cap is a runaway guard, not a quality limit: a run that stops at its cap is INVALID (`judge.md`), reported, and never judged. Raising a cap is a cost change: it needs the user's acknowledgement.

## Fixture test baseline (measured 2026-10-30, before any run, explicit path from the fixture root)

| Task | Command | Exit | Note |
|---|---|---|---|
| task-1-execute | `node --test test/slugify.test.mjs` | 1 | by design: 5 of 5 fail (stub) |
| task-2-bugfix | `node --test test/format-duration.test.mjs` | 1 | by design: 3 of 4 fail (the bug) |
| task-3-plan, task-5-validate, task-6-fast | `node --test test/notes.test.mjs` | 0 | 3 of 3 pass |
| task-4-research | `node --test test/signup.test.mjs` | 0 | 4 of 4 pass |
| task-7-update-process | `node --test test/word-count.test.mjs` | 0 | 5 of 5 pass |

Never run a bare `node --test` at the sandbox root: it also picks up the kit's own tests.

## Coverage of the 15 agents

| Agent key | Covered by |
|---|---|
| execute-agent | task-1-execute (CORE) |
| tester | task-1-execute (CORE, EVL confirmation run; scripted item S7) |
| quick-fix-agent | task-2-bugfix (CORE) |
| debugger | task-2-bugfix only if the router picks it; otherwise mechanical gates only |
| plan-agent | task-3-plan (CORE) |
| research-agent | task-4-research (EXTENDED) |
| validate-agent | task-5-validate (EXTENDED) |
| fast-mode-agent | task-6-fast (EXTENDED) |
| update-process-agent | task-7-update-process (EXTENDED) |
| spec-agent, innovate-agent, code-reviewer, code-simplifier, ui-ux-designer, git-manager | mechanical gates only |

MECHANICAL GATES ONLY (no golden task; named residual): spec-agent, innovate-agent, debugger (unless task-2 routes to it), code-reviewer, code-simplifier, ui-ux-designer, git-manager. In Phase 8 they are covered only by the signal census (`signal-census.mjs`), the guardrail identity (`gen-guardrails.mjs`; quick-fix and ui-ux-designer have no selected section) and the validator baseline. Their output quality is not measured. When only CORE runs, research, validate, fast-mode and update-process are mechanical-only as well.

## Known limits (named residuals)

- KG1 live routing: Phase 3 ran no model. Whether each prompt enters its phase headless and spawns the expected agent is first seen in Phase 8 (B4.1a rehearsal covers task-1 only). A run without its validity agent is INVALID (`judge.md`).
- KG2 stream fields: the subagent tool name (`Task` or `Agent`) and `input.subagent_type` are unverified until B4.1a; `run-record.mjs` writes `subagent_parse: "unverified-schema"`.
- task-2: the quick-fix lane normally asks a one-line confirmation before editing. The prompt pre-authorises in plain words ("Just do it, no need to check with me first"). If a kit still stops at the confirmation, the run has no validity agent and is INVALID.
- task-6: ends at the mandatory pause after VALIDATE by design; nothing is implemented.
- task-7: UPDATE PROCESS may try a commit. A sandbox is a git worktree that shares this repository's configuration, so a commit can succeed; it moves the sandbox HEAD, `run-record.mjs verify` then fails, and the run is INVALID. Recorded, not worked around.
- Sample size: 3 CORE tasks (7 with EXTENDED) cannot prove equivalence on every possible task; the judge is itself a model.
