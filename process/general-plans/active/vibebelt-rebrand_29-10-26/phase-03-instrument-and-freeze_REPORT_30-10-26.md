---
phase: phase-03-instrument-and-freeze
date: 2026-10-30
status: COMPLETE_WITH_GAPS
feature: general-plans
plan: process/general-plans/active/vibebelt-rebrand_29-10-26/phase-03-slim-agents_PLAN_29-10-26.md
---

# Phase 03 Report: Instrument and freeze (no slimming)

**Outcome (answer first):** Phase 3 is done and verified. The program now has the measuring tools and the frozen test definitions that Phase 8 needs to prove the new kit is at least as good as the old one: a signal census, a guardrail-section hasher, a run recorder, and 7 frozen golden tasks with a sha256 manifest. No agent file was touched (15 `.claude/agents` and 15 `.codex/agents` are byte-identical to `b17294d`) and no billed model call was made. Execute and the independent EVL run (vc-tester) are both green: 17 of 17 Exit Gate rows PASS, mutation controls pass, `compare.sh` exit 0. Status is `COMPLETE_WITH_GAPS` only because of the named residuals KG1 to KG3 and two small EVL notes below.

**Process rule kept:** Phase 3 made no billed model call. No `claude`, `codex` or API command was run by any agent; the tester repeated the check at EVL.

**Decision on the start marker:** `golden/start.sha` holds `bdf06850ac52598fc3856a06dc1522c22c61b0f2`, not `b17294d`. The two commits have byte-identical agent files (`git diff --stat b17294d -- .claude/agents .codex/agents` is empty), and `bdf0685` is the commit the phase actually started from, so it was kept. The Phase 8 plan wording was corrected to match (see Plan Deviations).

## What Was Done

All 66 files were created under the task folder `golden/` only (new files, nothing else in the repository changed by EXECUTE).

| Group | Files | What it gives |
|---|---|---|
| Census | `golden/signal-census.mjs`, `golden/lib/common.mjs`, `golden/signal-census-phase3.txt` | Counts exact signal strings per agent (`PHASE_COMPLETE:` variants kept distinct, status codes, colon-less `VC-` signals, `Gate:`, `[MODE:]`, `SPAWN_REQUEST:` in toml); `--neutral` maps `VC-`/`VB-` to one token. Baseline: 233 lines, 15 agent keys (prefix stripped), 24 `PHASE_COMPLETE` lines across 10 variants. Deterministic (re-run `cmp` exit 0). |
| Guardrails | `golden/gen-guardrails.mjs`, `golden/guardrails.json` | Hashes the guardrail sections of every agent (`--root`, `--out`; writes no file without `--out`). Baseline `guardrails.json` has 15 agent keys. Deterministic. |
| Run recorder | `golden/run-record.mjs` | `record`, `subagents` and `verify` commands for Phase 8 runs, tested against temp sandboxes with an explicit git identity. `golden/runs/` is not created. |
| Tests | `golden/test/` (3 test files plus fixtures) | 33 `node:test` tests: 16 census, 13 guardrails, 4 run-record. Written before the tools (red first), now green. |
| Frozen tasks | `golden/tasks/` | `tasks.md`, `rubric.md`, `judge.md`, `old-sandbox-recipe.md`, `run-flags.md`, `FROZEN.md`, `FROZEN.sha256` (44 files listed; sha256 of the `.sha256` file is `efdfca99003aabe41259973dc219666cf9a2e4eb428775c9bc5c6fdfc5986211`), and 7 task folders: CORE `task-1-execute`, `task-2-bugfix`, `task-3-plan`; EXTENDED `task-4-research`, `task-5-validate`, `task-6-fast`, `task-7-update-process`. |
| Determinism | `golden/determinism/` | Second-run copies used for the `cmp` checks. |
| Start marker | `golden/start.sha` | `bdf06850ac52598fc3856a06dc1522c22c61b0f2` (agent files identical to `b17294d`). |

**Who did what (Phase Loop Progress):**
1. RESEARCH: done (read-only measurements of census gaps, guardrail headings, headless gate behaviour).
2. INNOVATE: replaced by the user decision of 2026-10-30 (decision D: drop slimming; instrument and freeze).
3. PLAN-SUPPLEMENT: done (plan re-scoped; Inner Loop Refresh Note written).
4. PVL: done, `Gate: PASS` (inner-pvl: phase-3). Cycle 1 was CONDITIONAL (M1 `node --test` directory argument, M2 TOML escapes), fixed by the supplement, then PASS.
5. EXECUTE: one vc-execute-agent (opus), sequential; per-section test gates green.
6. EVL: independent vc-tester (opus) confirmation run: 17/17 Exit Gate rows PASS, mutation controls pass. EVL HANDOFF: closeout WITH_GAPS.
7. UPDATE PROCESS: this report; plan checkboxes, umbrella state, status row and report destination, `results.tsv` row 10, `harness/verification.json`, registry, one Phase 8 wording fix. No commit made here.

## What Was Skipped or Deferred

| Item | Why | Destination |
|---|---|---|
| Agent slimming, `references/` folders under agents, size/conservation/pointer/parity scripts, per-agent commits, revert rehearsal, Phase 3 cost gate | Dropped by user decision D (2026-10-30) | n/a (removed from the claim) |
| Any billed golden run or judge call | Phase 3 makes zero billed calls | Phase 8 B4.1 (the program's single billed hard stop) |
| Live routing measurement, stream-json field verification, native Windows/macOS runs | Cannot be tested without model runs or other OSes | Phase 8 rehearsal (KG1 to KG3, below) |

## Test Gate Outcomes

| Gate | Result |
|---|---|
| Unit tests (`node --test` on the three files in `golden/test/`) | 33/33 PASS (16 census + 13 guardrails + 4 run-record) |
| Independent EVL run (vc-tester, opus), Exit Gate | 17/17 rows PASS |
| Mutation controls (EVL) | pass (tampered input is caught by the gates) |
| Determinism: census, guardrails second-run `cmp` | exit 0 each |
| `FROZEN.sha256` check (`sha256sum -c` from `golden/tasks`) | 0 failures; 44 files listed |
| `git diff --stat b17294d -- .claude/agents .codex/agents` | empty; 15 + 15 agent files |
| Billed-call check | zero billed calls |
| `bash baseline/compare.sh` | exit 0 (re-run by this agent) |

## Plan Deviations

1. `golden/start.sha` holds `bdf0685`, not `b17294d` (the plan said `git rev-parse b17294d`). Agent files are byte-identical between the two; the decision was to keep `bdf0685`. This agent corrected the Phase 8 plan wording to match (line 116 only).
2. The plan said OLD and FINAL differ in "about 86" non-agent files; the measured value at `P3_START` is 93 paths. Informational; the recipe note says B4 compares judged outcomes, never file equality.
3. The Exit Gate determinism rows write into `golden/determinism/` (harmless identical rewrite, outside the FROZEN set).

## Test Infra Gaps Found

| Gap | Detail | Routed to |
|---|---|---|
| KG1: live routing unmeasured | Whether the headless task start at a given phase routes to the expected agent is only knowable from a real run | Phase 8 rehearsal run (B4) |
| KG2: stream-json field names unverified | `run-record.mjs subagents` assumes field names that only a real stream confirms | Phase 8 rehearsal |
| KG3: native Windows and macOS untested | Tools were run on Linux node 22 (WSL) only | Phase 8 (K0-1, K2-1 family) |
| Plan discovery sees fixture plans | `vc-plan-discovery` now finds 3 fixture plans under `golden/`; keep passing explicit plan paths | note for all later phases |
| Sandboxes share the repo git identity | A kit run can commit or create refs in the repo | Phase 8: keep the `for-each-ref` before/after check; treat `task-7` (UPDATE PROCESS) as most exposed |
| Phase 8 B4.3 runs directory | `--runs-dir` must point under `eq/` (the recipe offers `RUNS_OPT`) | Phase 8 |

## SPEC Achievement

No separate `*_SPEC_*.md` exists for Phase 3 (the inner loop skips SPEC; the umbrella governs). Scored against the Phase 3 acceptance criteria (C-P3):

| Criterion | Verdict |
|---|---|
| Agents and toml byte-identical to `b17294d`; no agents `references/` | met (passing test: Exit Gate diff row, empty) |
| Extended signal census deterministic, baseline `signal-census-phase3.txt` | met (passing tests: 16 census unit tests, determinism `cmp`) |
| `gen-guardrails.mjs` (`--root`, `--out`) deterministic for 15 agents | met (passing tests: 13 unit tests, determinism `cmp`, 15 keys) |
| `run-record.mjs` tested | met (passing tests: 4 unit tests) |
| Golden task definitions frozen in `golden/tasks/` (`sha256sum -c`) | met (passing test: `sha256sum -c`, 0 failures) |
| Zero billed model calls | met (EVL check) |
| `compare.sh` not worse | met (exit 0) |
| Live routing of the frozen tasks, stream-json fields, native OS runs (KG1 to KG3) | unmet, named residuals; cannot be tested before the Phase 8 rehearsal (owner Phase 8) |

## SPEC Gaps

- KG1: live routing unmeasured. Owner Phase 8 rehearsal. Already covered by the Phase 8 plan B4; no new stub needed.
- KG2: stream-json field names unverified. Owner Phase 8 rehearsal.
- KG3: native Windows and macOS untested. Owner Phase 8 (same family as K0-1, K2-1).

Accepted notes (not gaps): the `golden/determinism/` rewrite by Exit Gate rows is harmless and outside the FROZEN set.

## Closeout Packet

1. **Selected plan path:** `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-03-slim-agents_PLAN_29-10-26.md`
2. **Closeout classification:** Ready for UPDATE PROCESS archival, with EVL closeout WITH_GAPS. All developed behavior (census, guardrails, recorder, frozen tasks) is proven by passing automated gates; the residuals KG1 to KG3 are environment limits that only the Phase 8 rehearsal can test. The plan stays in the shared program task folder, which moves as a unit when the program closes.
3. **What was finished:** see `## What Was Done`.
4. **Verified vs unverified:** verified by 33 unit tests, the independent EVL run (17/17 rows, mutation controls), determinism `cmp` checks, `sha256sum -c`, the empty agent diff and `compare.sh`. Unverified: KG1, KG2, KG3.
   - 4b. **Validate-contract compliance:** present in the Phase 3 plan, `Gate: PASS` (inner-pvl: phase-3, 2026-10-30). Not edited by this agent.
5. **Cleanup done vs needed:** done: plan checkboxes, this report, umbrella state, status row and report destination, `results.tsv` row 10, `harness/verification.json`, registry. Needed: process commit by vc-git-manager (the `golden/` folder is still untracked; no commit was made here).
6. **Single best next valid state:** make the process commit; then Phase 4 (`phase-04-doc-dedup_PLAN_29-10-26.md`) loop step per its PASS contract (Phase 4 inner PVL passed on its second pass, so EXECUTE is next after its step 1a/RESEARCH refresh as the plan states).
7. **Commit-checkpoint recommendation:** Process commit belongs after this UPDATE PROCESS. There is no execution commit for Phase 3 (no source or agent file changed). Stage `golden/` (66 files), this report, the Phase 3 and Phase 8 plans, the umbrella, `results.tsv`, `harness/verification.json` and the registry. Do not stage unrelated edits.
8. **Regression status:** `bash baseline/compare.sh` exit 0; agents byte-identical to `b17294d`; Phase 1 to 2 surfaces untouched (Phase 3 wrote only under `golden/`).
9. **SPEC achievement:** see `## SPEC Achievement` (7 met, 1 row of named residuals KG1 to KG3).

**Drift score:** LOW (signals: (d) a new task folder tree `golden/` was created, 66 files all inside the program task folder; no `.claude/`, `.codex/` or protocol file changed). UPDATE PROCESS available if you want. Gap items KG1 to KG3 have an owner (Phase 8), so no extra stub is needed.

**Hand-offs for later phases:**
1. Phase 6: golden fixtures contain no `vc-` or `vb-` text by design, but `golden/**` is in the DOOMED set of the C-CLEAN cleanup (removed from the final tree). Phase 7 reads `signal-census.mjs` and `signal-census-phase3.txt` (hard dependency); Phase 8 reads everything under `golden/` read-only.
2. Phase 8: B4.3 needs `--runs-dir` under `eq/`; keep the `for-each-ref` before/after check; task-7 is most exposed; pass explicit plan paths because plan discovery sees 3 fixture plans; re-run the rehearsal to settle KG1 and KG2.
3. Phase 7 and 8 pending hand-offs from earlier phases are unchanged (pointer-check path, B4.6(d) git identity, and the others listed in their plans).

**Tier-1 audits run by this agent (2026-10-30, Linux node 22.23.4):** see the commands below, run after the edits; results are in the hand-back message of this session.

| Command | Purpose |
|---|---|
| `validate-umbrella-state.mjs <umbrella>` | umbrella `## Current Execution State` shape |
| `validate-phase-reports.mjs <umbrella>` | every VERIFIED phase has its report on disk |
| `bash baseline/compare.sh` | validator baseline not worse |
