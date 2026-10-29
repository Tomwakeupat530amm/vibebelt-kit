---
phase: phase-01-fix-inconsistencies
date: 2026-10-29
status: COMPLETE_WITH_GAPS
feature: general-plans
plan: process/general-plans/active/vibebelt-rebrand_29-10-26/phase-01-fix-inconsistencies_PLAN_29-10-26.md
---

# Phase 01 Report: Fix inconsistencies

**Outcome (answer first):** Phase 1 is done and verified. The documented model policy now matches the agent files (7 opus, 8 sonnet, no `model:` line changed), the three execution agents moved from `effort: low` to `effort: max`, a new validator (`validate-model-effort-policy.mjs`, the 38th) guards both, the README count says 38 in all 10 files, and both CI workflows now run every validator. The independent EVL run (vc-tester, opus) passed every runnable Exit Gate row, plus a mutation test and a positive control. Status is `COMPLETE_WITH_GAPS` only because of the named residuals below, and the code-reviewer check of the 9 README translations (R1.10/R1.13) has passed.

**Agent-probe status (R1.10/R1.13, 9 translations):** PASS: a code-reviewer agent (read-only) checked all 10 README files against the repo on 2026-10-29: 7 opus / 8 sonnet identical everywhere, research/plan/validate rows say opus, Mermaid diagram skeleton byte-identical to English after blanking quoted strings (static check; not rendered with mermaid-cli), validator count 38 at all 4 sites, the '60-70%' claim removed in every language, no translation damage that changes meaning. Cosmetic only: some English fragments remain in the diagram edge labels (as before); the 8 non-English/non-Vietnamese READMEs are slated for deletion in the clean-tree step.

## What Was Done

**Commits on `main` (author `Tomwakeupat530amm <minhnguyentuan31103@gmail.com>`, one identity, no remote, nothing pushed):**

| Commit | Message | What it holds |
|---|---|---|
| `1733f7b` | `fix: align documented model policy with agent files and run every validator in CI` | 55 files, 675 insertions, 188 deletions: new validator + fixtures, 3 `effort:` lines, 14 doc sites, 10 README files, 2 workflows |
| `e188368` | `process: record phase 1 start marker and add the new validator to the baseline list` | `baseline/p1_start.txt`, new line in `baseline/validators.list` |

`P1_START` = `27d9600` (the start marker for every diff gate).

**Who did what (Phase Loop Progress):**
1. RESEARCH: done (model facts and doc line numbers re-grepped).
2. INNOVATE: skipped as mechanical. Decision B (keep opus, fix the docs) and the exact target wording (F-TEXT-1..7) were already locked, so there was no design choice to compare.
3. PLAN-SUPPLEMENT: done (Inner Loop Refresh Notes 2026-10-29, including inner 3).
4. PVL: done, `Gate: PASS` (inner).
5. EXECUTE: vc-execute-agent (opus) in three groups. A: validator + fixtures + SKILL.md line + 3 effort values. B: 14 doc sites + 10 README files. C: `validate.yml` and `release.yml`.
6. EVL: independent vc-tester (opus), PASS.
7. UPDATE PROCESS: this report; umbrella state, status row, results.tsv, context docs, two backlog stubs and `harness/verification.json` written; no commit made here.

**Group A (new validator).** `.claude/skills/vc-audit-vc/scripts/validate-model-effort-policy.mjs` (104 lines) with `fixtures/model-effort-pass` and `fixtures/model-effort-fail` (15 agent files each) and one line in `.claude/skills/vc-audit-vc/SKILL.md`. Red-first run on the real agents gave exactly 3 effort messages (execute, fast-mode, quick-fix) and no model message. Then only the `effort:` line of those 3 agents moved. `.codex/` untouched.

**15-agent table (A1; models unchanged, Decision B):**

| Agent | model before | model after | effort before | effort after | Enforced by validator |
|---|---|---|---|---|---|
| vc-execute-agent | opus | opus | low | **max** | model + effort |
| vc-fast-mode-agent | opus | opus | low | **max** | model + effort |
| vc-quick-fix-agent | opus | opus | low | **max** | model + effort |
| vc-plan-agent | opus | opus | low | low | model |
| vc-research-agent | opus | opus | low | low | model |
| vc-tester | opus | opus | low | low | model |
| vc-validate-agent | opus | opus | high | high | model |
| vc-git-manager | sonnet | sonnet | low | low | model + effort |
| vc-update-process-agent | sonnet | sonnet | medium | medium | model |
| vc-innovate-agent | sonnet | sonnet | medium | medium | model |
| vc-spec-agent | sonnet | sonnet | medium | medium | model |
| vc-ui-ux-designer | sonnet | sonnet | medium | medium | model |
| vc-code-simplifier | sonnet | sonnet | medium | medium | model |
| vc-debugger | sonnet | sonnet | high | high | model |
| vc-code-reviewer | sonnet | sonnet | high | high | model |

Counts: 7 opus, 8 sonnet (`grep -l '^model: opus'` = 7). Source for effort values: `implementation-standards.md` §Agent Frontmatter Conventions.

**Token-cost note (read this before using the lightest lane).** `effort: max` makes an agent think longer, so each run costs more tokens. Three agents change, each `low` -> `max`:
- `vc-quick-fix-agent` - the most visible change, because this is the lightest lane (one small edit plus a scoped check). A max-effort run is now the biggest relative cost jump there and works against the lane's purpose.
- `vc-fast-mode-agent` - compressed R-S-I-P-V-E flow; every run now at max.
- `vc-execute-agent` - the main implementer; largest absolute spend because it does the most work.
This follows the written policy (`max` for the opus execution agents) and is a user-visible cost increase, not a bug. If the lightest lane feels too heavy, the lever is that one `effort:` line, a later decision. Note: `CLAUDE.md` is the orchestrator's own instruction file; sessions started before Phase 1 hold the old text, and spawns of plan, research, validate and tester must not pass a model override (they run on their own front-matter model).

**Group B (documentation, 14 sites + 10 README files).**

| File | Change |
|---|---|
| `CLAUDE.md` | Model Selection Policy paragraph replaced (F-TEXT-1); heading unchanged |
| `.claude/skills/vc-agent-strategy-compare/SKILL.md` | `## Model Selection Policy` body (F-TEXT-2) and output-template `Model:` line (F-TEXT-3) |
| `process/development-protocols/implementation-standards.md` | `effort` bullet (F-TEXT-4) |
| `process/development-protocols/orchestration.md` | effort line (F-TEXT-5) |
| `process/development-protocols/vc-system-behavior/04-research.md` | `(sonnet)` -> `(opus)` |
| `.../07-plan.md` | `(sonnet)` -> `(opus)` |
| `.../08-validate.md` | `(sonnet)` -> `(opus)` and the "runs on sonnet" sentence (F-TEXT-6) |
| `process/context/all-context.md` | line 179 model-policy paragraph (F-TEXT-7) |
| `README.md` + `docs/i18n/README.{de,es,fr,hi,ja-JP,ko-KR,pt-BR,vi-VN,zh-CN}.md` | per file: validator count 36 -> 38 at 4 sites (40 total); feature cell and model diagram/table/note corrected to 7 opus / 8 sonnet (localized diagrams in ko-KR, pt-BR, vi-VN, zh-CN edited per file); three agent-table rows (research, plan, validate) sonnet -> opus; the unmeasured "60-70% cheaper" bullet removed |

**Group C (CI).** `validate.yml`: added `push` on `main` (kept `pull_request`) and 21 validator steps. `release.yml`: the same 21 steps inserted after `Validate skill keywords`, additions only (no existing line removed; tag trigger, permissions and `Create GitHub Release` untouched). Existing `concurrency: cancel-in-progress` unchanged. `validate.yml` now has 42 steps, `release.yml` 44.

**21-row CI table (exit codes re-run by this agent on 2026-10-29, Linux node 22.23.4, repo root, one command per row):**

| # | Validator | Exit | In CI |
|---|---|---|---|
| 1 | validate-strategy-compare-output | 0 | normal |
| 2 | validate-backlog-notes | 0 | normal |
| 3 | validate-eval-coverage | **1** | `continue-on-error: true` (needs runtime-harness scenarios absent in this kit) |
| 4 | validate-phase-plan-completeness | 0 | normal |
| 5 | validate-phase-reports | 0 | normal (fixture `pass/umbrella.md`; the plan table said "directory", which gives EISDIR, so the workflow passes the file) |
| 6 | validate-umbrella-state | 0 | normal |
| 7 | validate-agent-frontmatter | 0 | normal |
| 8 | validate-model-effort-policy (new) | 0 | normal |
| 9 | validate-autopilot-goal-block | 0 | normal |
| 10 | validate-autoresearch-log | 0 | normal |
| 11 | validate-context-discovery-output | 0 | normal |
| 12 | validate-feasibility-verdict | 0 | normal |
| 13 | validate-closeout-output | 0 | normal |
| 14 | validate-phase-stub | 0 | normal |
| 15 | validate-umbrella-artifact | 0 | normal |
| 16 | validate-intent-clarify-output | 0 | normal |
| 17 | validate-plan-discovery-output | 0 | normal |
| 18 | validate-evidence-pack | 0 | normal |
| 19 | validate-risk-artifacts | **1** | `continue-on-error: true` (no fixtures of its own; stand-in directory) |
| 20 | validate-test-coverage-output | 0 | normal |
| 21 | validate-findings-output | 0 | normal |

19 exit 0; 2 exit 1 (rows 3 and 19), each with a cause comment. Both workflow files carry exactly 2 `continue-on-error: true`. Fixture-based steps test the validator, not the kit; accepted.

**Before / after counts:**

| Measure | Before | After |
|---|---|---|
| Model-claim grep (R1.11) | 14 | 0 |
| README RED (agent-table rows not opus, R1.12) | 30 | 0 |
| `60.70` lines in README files | 10 | 0 |
| `36` validator-count sites | 40 | 0 |
| `38` validator-count sites | 0 | 40 |
| Validators on disk | 37 | 38 |
| CI validator names missing (validate.yml / release.yml) | 20 | 0 |
| `validate.yml` / `release.yml` steps | 21 / 21 | 42 / 44 |

**Decisions:** (1) Decision B: keep opus on the 7 agents, fix the documentation, not the agents. (2) Effort follows the written policy: `max` for the three opus execution agents; every other effort value stays as set. (3) `release.yml` is synced in Phase 1 (inner-3 decision); Phase 2 later edits only its display-name line. (4) Rows 3 and 19 are added with `continue-on-error` and a cause comment instead of being skipped (R1.4 stays satisfiable, nothing silently fails). (5) The unmeasured "60-70% lower cost" claim is removed; Phase 7 may restore a figure only if measured. (6) `orchestration.md` §Regression Gate Validators and registry docs are left for Phase 4 (K1-1).

## What Was Skipped or Deferred

| Item | Why | Destination |
|---|---|---|
| INNOVATE step | Mechanical; Decision B and wording locked | n/a |
| Listing the new validator in `orchestration.md` §Regression Gate Validators and registry docs (K1-1) | Phase 4 owns those files | `process/general-plans/backlog/validator-registry-docs-lag_NOTE_29-10-26.md` |
| CI run on a real ubuntu runner, including the `release.yml` tag path (K1-2) | Cannot be done here | Phase 8 |
| Own fixtures and schema decision for `validate-risk-artifacts` (K1-3, row 19) | Needs a schema decision | `process/general-plans/backlog/risk-artifacts-validator-fixtures_NOTE_29-10-26.md` |
| Review of 9 README translations (R1.10/R1.13) | Reviewer still running | PASS; see the Agent-probe status line above |

## Test Gate Outcomes

| Gate | Result |
|---|---|
| Independent EVL run (vc-tester, opus), every runnable Exit Gate row | PASS |
| `validate-model-effort-policy.mjs` real agents / pass fixture / fail fixture | 0 / 0 / 1 (fail output names agent + field + expected value) |
| Red-first run before effort edits | exactly 3 effort messages, no model message |
| Mutation test (flip a model/effort line, validator must fail) | PASS |
| Positive control (README row set back to sonnet gives RED) | PASS |
| Agent diff gate (R1.7): 3 files, only `effort:` lines, 0 `model:` lines, `.codex` untouched | PASS |
| `validate-agent-parity.mjs`, `validate-agent-frontmatter.mjs` | exit 0 |
| `bash baseline/compare.sh` (re-run by this agent) | exit 0; `NOTE new validator validate-model-effort-policy`; "nothing worse than validators_after_setup.tsv" |
| Name loop over both workflows, script-set equality, release.yml additions-only, YAML parse | PASS |
| 21 CI commands run locally | 19 x exit 0, rows 3 and 19 x exit 1 (allowed, see table) |
| Identity / remote | one author identity; no remote; nothing pushed |
| R1.10/R1.13 agent-probe on 9 translations | PASS |

## Plan Deviations

1. Row 5 argument: the plan table said a directory; the validator needs the file, so the workflow step passes `pass/umbrella.md`. Result unchanged (exit 0).
2. The plan expected rows 3, 9 and 19 as likely reds; only rows 3 and 19 fail (row 9 passes on its fixture).
3. `release.yml` was added to Phase 1 scope by the inner-3 supplement (not in the outer plan).
4. This agent also corrected stale CI/validator facts in `process/context/all-context.md` and `tests/all-tests.md` (list below); the plan named only `all-context.md:179`.

## Test Infra Gaps Found

| Gap | Detail | Routed to |
|---|---|---|
| `validate-risk-artifacts.mjs` has no fixtures | Row 19 fails in CI on a stand-in directory; the step proves little | backlog `risk-artifacts-validator-fixtures_NOTE_29-10-26.md` |
| `validate-eval-coverage.mjs` needs runtime-harness scenarios | Absent in this kit; exits 1 on a bare checkout (row 3) | continue-on-error with cause comment; separate decision |
| CI never run on a real Ubuntu runner | Workflows validated only by YAML parse and local command runs | Phase 8 (K1-2) |
| Registry docs lag | New validator missing from `orchestration.md` and registry docs | backlog `validator-registry-docs-lag_NOTE_29-10-26.md` (Phase 4) |
| Phase 0 carry-overs unchanged | e2e Trials C and D, `.agents/skills` text file on drvfs, 3 hook-lib tests | see Phase 0 report |

## SPEC Achievement

No separate `*_SPEC_*.md` exists for Phase 1 (the inner loop skips SPEC; the umbrella governs). Scored against the Phase 1 acceptance criteria:

| Criterion | Verdict |
|---|---|
| New validator works on real agents, pass fixture and fail fixture | met (passing test: three commands above, mutation test) |
| Only the 3 `effort:` lines change in agents, no `model:` line | met (passing test: R1.7 diff gate) |
| README validator count correct at all 40 sites | met (passing test: `38` sites = 40, `36` sites = 0, N computed by `find`) |
| Model facts corrected in docs and README (claim grep, R1.12 loop, `60.70`) | met (passing tests: claim grep 0, RED 0, `60.70` 0) |
| Both workflows name every validator, push trigger on `main`, release.yml additions only | met (passing tests: name loop, set equality, YAML parse, additions-only diff) |
| Nothing worse than the Phase 0 baseline | met (passing test: `compare.sh` exit 0) |
| Translations of the model facts are correct in the 9 localized READMEs (R1.10/R1.13 semantic part) | met: reviewer passed; mechanical backstop (anchor and RED loops) also met |
| Registry docs list the new validator (K1-1) | unmet, named residual, owner Phase 4 |
| CI green on a real runner (K1-2) | unmet, named residual, owner Phase 8 |

## SPEC Gaps

- K1-1: new validator absent from `orchestration.md` §Regression Gate Validators and registry docs until Phase 4. Backlog stub written.
- K1-2: CI on a real ubuntu runner, including the `release.yml` tag path, is untested. Phase 8.
- K1-3: row 19 `validate-risk-artifacts` needs fixtures and a schema decision. Backlog stub written.
- K1-4: closed; translation review (R1.10/R1.13 semantic) passed.

Accepted notes (not gaps): a push to `main` cancels an in-flight run on `main` (`cancel-in-progress`); sessions started before Phase 1 hold the old `CLAUDE.md`.

## Closeout Packet

1. **Selected plan path:** `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-01-fix-inconsistencies_PLAN_29-10-26.md`
2. **Closeout classification:** Ready for UPDATE PROCESS archival, with the translation review still open. All developed behavior (validator, effort values, doc facts, README count, CI steps) is proven by passing automated gates. The phase plan stays in the shared program task folder, which moves as a unit when the program closes; it is not moved to `completed/` now. The orchestrator should not tick Phase 1 as final until the reviewer result is recorded.
3. **What was finished:** see `## What Was Done`.
4. **Verified vs unverified:** verified by the independent EVL run, the mutation test, the positive control and this agent's re-runs of the 21 CI commands and `compare.sh`. Unverified: real-runner CI (K1-2), registry docs (K1-1).
   - 4b. **Validate-contract compliance:** present in the Phase 1 plan, `Gate: PASS` (inner PVL, 2026-10-29). Not edited by this agent.
5. **Cleanup done vs needed:** done: plan checkboxes, report, two backlog stubs, `harness/verification.json`, umbrella state and status row, `results.tsv` row 7, stale lines in `all-context.md` and `tests/all-tests.md`. Needed: process commit (orchestrator via vc-git-manager); fill the probe placeholder.
6. **Single best next valid state:** Phase 2 (`phase-02-identity-distribution_PLAN_29-10-26.md`), loop step 1 RESEARCH. Its inner PVL contract is `Gate: PASS` dated 2026-10-29; Phase 2 starts from the registry and umbrella claims.
7. **Commit-checkpoint recommendation:** Execution commit already made (`1733f7b`). Process commit belongs after this UPDATE PROCESS: stage the Phase 1 plan, this report, two backlog stubs, `harness/verification.json`, the umbrella, `results.tsv`, `process/context/all-context.md` and `process/context/tests/all-tests.md`. Do not stage unrelated edits.
8. **Regression status:** `bash baseline/compare.sh` exit 0 (nothing worse than the Phase 0 baseline); Phase 0 surfaces (LICENSE, tag, `.agents/skills` mode) not touched by Phase 1.
9. **SPEC achievement:** see `## SPEC Achievement` (7 met, 2 named residuals).

**Drift score:** HIGH (signals: (a) 55 files in the execution commit; (b1) `.claude/` agents, skill files and workflows changed; (b2) `README.md`, `CLAUDE.md` and `process/development-protocols/` changed; (d) backlog notes written; (e) the plan's blast radius was extended to `release.yml` and two context docs). Strongly recommend UPDATE PROCESS -- harness/protocol files touched. Gap items K1-1 and K1-3 already have backlog stubs; K1-2 and K1-4 have owners, so no extra stub is needed.

**Tier-1 audits run by this agent (2026-10-29, Linux node 22.23.4):**

| Command | Result |
|---|---|
| `validate-plan-inventory.mjs` | exit 0, 0 failures |
| `validate-phase-reports.mjs <umbrella>` | exit 0 |
| `validate-umbrella-state.mjs <umbrella>` | exit 0 |
| `validate-plan-artifact.mjs` Phase 1 plan / umbrella | exit 0 each, 0 failures (advisory warnings only) |
| `validate-umbrella-artifact.mjs <umbrella>` | exit 0 |
| `validate-all-context.mjs` | exit 0, 0 failures, 0 warnings |
| `discover-context.mjs --check-routing` | "routing block is in sync", exit 0 |
| `bash baseline/compare.sh` | exit 0, "nothing worse than validators_after_setup.tsv", NOTE new validator |
| `validate-model-effort-policy.mjs` | exit 0 |
| `validate-context-discovery.mjs` | exit 1: the known Phase 0 baseline red (`.agents/skills` is a text file on drvfs), same as baseline, not worse |
| `git diff --check` | no output |

Incident, recorded for honesty: while rewriting the umbrella `## Current Execution State`, a first edit matched an earlier inline mention of that heading and cut about 290 lines. It was caught by `validate-umbrella-state.mjs`, the file was restored with `git checkout` from the committed version (the tree was clean before this closeout) and the edit was redone with a line-anchored match. Final diff of the umbrella: 16 insertions, 11 deletions; both umbrella validators exit 0.

**Mirror / surface review:** Claude `.claude/agents` changed (3 effort lines); Codex `.codex/agents` intentionally unchanged (no such fields there; `git diff --stat 27d9600 -- .codex` empty). `AGENTS.md` not edited (no model-policy text there to correct, per the plan). `README.md` and 9 translations edited in Phase 1 by EXECUTE. `CLAUDE.md` edited by EXECUTE (not by this agent).

**CLAUDE.md note:** `CLAUDE.md` §Model Selection Policy now says each named vc-agent runs on the model in its own front-matter (7 opus, 8 sonnet). Sessions started before Phase 1 still hold the old text ("EXECUTE = opus; every other phase = sonnet"). Spawns of plan, research, validate and tester must not pass a model override; restart or re-read `CLAUDE.md` in a long session.

**Context audit (files reviewed):**

| File | Outcome |
|---|---|
| `process/context/all-context.md` | edited: `37` -> `38` validators (2 places), CI line now "pull_request and push to main, 42 steps" and release.yml 44 steps; line 179 was already fixed by EXECUTE |
| `process/context/tests/all-tests.md` | edited: `37` -> `38`; CI paragraph rewritten (triggers, 42 and 44 steps, the two `continue-on-error` steps, real-runner gap) |
| `process/context/planning/all-planning.md` | unchanged: points to the umbrella state, no stale fact |
| `process/context/generated-skills-catalog.json` | unchanged: no skill added or renamed (a new script in an existing skill does not alter the catalog) |
| `process/context/{_all-group-template.md.seed, all-context.md.seed, tests/all-tests.md.seed}` | unchanged: seed companions |

## Forward Preview

### Test Infra Found
- `baseline/validators.list` now has 29 rows including `validate-model-effort-policy`; the Phase 0 TSV has no row for it, so `compare.sh` prints `NOTE new validator` and does not count it as worse.
- Fixture-based CI steps test the validators, not the kit.

### Blast Radius Changes
Added versus the outer plan: `release.yml` (inner-3), `.claude/skills/vc-audit-vc/SKILL.md` one line, and the two context docs touched by this closeout (`all-context.md`, `tests/all-tests.md`).

### Commands to Stay Green
```
bash process/general-plans/active/vibebelt-rebrand_29-10-26/baseline/compare.sh
node .claude/skills/vc-audit-vc/scripts/validate-model-effort-policy.mjs
node .claude/skills/vc-audit-vc/scripts/validate-agent-parity.mjs
node .claude/skills/vc-audit-vc/scripts/validate-agent-frontmatter.mjs
node .claude/skills/vc-generate-context/scripts/validate-all-context.mjs
grep -c '^model: opus' ... # 7 opus / 8 sonnet across .claude/agents/*.md
```
Later phases (4, 7) that rewrite docs must keep the corrected model facts (7 opus / 8 sonnet) and the 38 validator count.

### Dependency Changes
- New script: `.claude/skills/vc-audit-vc/scripts/validate-model-effort-policy.mjs` plus two fixture folders. Phase 6 (rename) must carry its fixtures and the workflow step names; Phase 4 adds it to the registry docs.
- Phase 2 edits one display-name line in `release.yml` (Phase 1 is first writer).
- No package or runtime dependency changes.
