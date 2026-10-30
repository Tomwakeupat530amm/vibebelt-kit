---
phase: phase-04-doc-dedup
date: 2026-10-30
status: COMPLETE_WITH_GAPS
feature: general-plans
plan: process/general-plans/active/vibebelt-rebrand_29-10-26/phase-04-doc-dedup_PLAN_29-10-26.md
---

# Phase 04 Report: Safe tidy of the shared docs

**Outcome (answer first):** Phase 4 is done and verified. One `fix:` commit (`5b143f4`) fixed 4 broken pointers, added the missing validator line (K1-1), shrank the leftover "superseded" allowlist from 50 to 45, and cut `AGENTS.md` from 37,885 to 31,983 bytes, under the Codex 32 KiB limit (32,768) and under the 32,000 target. `CLAUDE.md`, `.claude/` and `.codex/` are unchanged. An independent EVL run (vc-tester, opus) passed every Exit Gate row in its literal committed form and caught all three positive controls. Status is `COMPLETE_WITH_GAPS` only because of the small named notes below.

**Process note (not a plan deviation):** the first execute agent was stopped by the user by mistake mid-run. A second execute agent audited the disk state, found every edit complete and correct, and changed nothing. The result is therefore identical to a single clean run.

## What Was Done

Commit `5b143f4` (`fix: tidy shared docs (pointers, leftovers, AGENTS.md under Codex 32 KiB)`, P4_START = `0469f54`) touches exactly three shipped files (38 insertions, 212 deletions):

| File | Change |
|---|---|
| `AGENTS.md` | 37,885 to 31,983 bytes; pointer fix to `## Testing` / `§Testing-and-Quality`; Skill Registry kept byte-identical |
| `process/development-protocols/orchestration.md` | pointer fix to `autopilot.md` §ENTER EXECUTE MODE Consent; K1-1 line (`validate-model-effort-policy.mjs`) added to §Regression Gate Validators |
| `process/development-protocols/all-development-protocols.md` | two archive pointers replaced by "The former single-file monolith was removed" wording |

Measured results:
- 4 broken pointers fixed, 0 new. The contract said pointer occurrences 180 to 176; the tool measures 181 to 177 (same 4 drops).
- Leftover-"superseded" allowlist 50 to 45 (`dedup-allowlist.txt`, `dedup-allowlist.why.txt`, untracked task-folder files).
- Signal census: only the allowed drops: `ENTER EXECUTE MODE` 4 to 2, `ENTER FAST MODE` 2 to 1, `[MODE: ORCHESTRATOR]` 1 to 0.
- Skills catalog `--check` green and unchanged.

**Who did what (Phase Loop Progress):** 1 RESEARCH done; 2 INNOVATE by orchestrator under user delegation (safe tidy); 3 PLAN-SUPPLEMENT done; 4 PVL `Gate: PASS` on the second pass (cycle 1 CONDITIONAL, M4-1 to M4-3, then PASS); 5 EXECUTE one fix commit; 6 EVL independent vc-tester PASS; 7 UPDATE PROCESS this report (no commit made here).

## What Was Skipped or Deferred

| Item | Why | Destination |
|---|---|---|
| Content de-duplication across protocol docs | Out of scope by user decision E (safe tidy only) | none; not planned |
| Fix for the dangling `.claude/memory/MEMORY.md` mention in `AGENTS.md` | Pre-existing, not in the Phase 4 claim | Phase 6 or 7 (observation) |

## Test Gate Outcomes

| Gate | Result |
|---|---|
| Exit Gate, every row in literal committed form (vc-tester, opus) | all PASS |
| Positive controls: size gate, new broken pointer, anchor drop | all caught |
| `AGENTS.md` size | 31,983 bytes (limit 32,768, target 32,000) |
| `CLAUDE.md`, `.claude/`, `.codex/` unchanged | PASS |
| Skills catalog `generate-skills-catalog.mjs --check` | green |
| `validate-context-discovery` | exit 1 = known `.agents/skills` drvfs baseline (not worse) |
| Closeout (EVL) | CLEAN |

UPDATE PROCESS re-checks: `validate-umbrella-state.mjs`, `validate-phase-reports.mjs`, `bash baseline/compare.sh`, `git diff --check` (results in the hand-back message).

## Plan Deviations

None. The contract's pointer count (180 to 176) differs from the tool's (181 to 177) by definition only; both show the same 4 drops.

## Test Infra Gaps Found

| Gap | Detail | Routed to |
|---|---|---|
| KG-P4-2 | The pointer-check info line counts 7 of 9 PHASE-GATES citations; informational only | note |
| Control (c) vacuous as briefed | Aimed at `PHASE_COMPLETE` it finds 0 strings in `AGENTS.md`; it passes when aimed at `ENTER RESEARCH MODE` | note for later control design |
| Census tool scope | `golden/signal-census.mjs` reads agents only; `AGENTS.md` drops are visible only with `p4-tools/census.mjs` | Phase 7 must use the right tool |
| Dangling reference | `AGENTS.md` mentions the nonexistent `.claude/memory/MEMORY.md` | Phase 6 or 7 may fix |

## SPEC Achievement

No separate `*_SPEC_*.md` for Phase 4 (inner loop; umbrella governs). Scored against C-P4:

| Criterion | Verdict |
|---|---|
| `CLAUDE.md` byte-identical | met (passing test: Exit Gate diff row) |
| 4 broken pointers fixed, 0 new | met (passing test: `p4-tools/pointer-check.mjs`, new-pointer control caught) |
| No unjustified leftover (allowlist 50 to 45) | met (passing test: leftover scan against allowlist) |
| `AGENTS.md` <= 32,768 bytes (target 32,000), Skill Registry kept | met (31,983; passing test: size gate and byte-identical registry check) |
| Validators not worse | met (passing test: `compare.sh` exit 0) |
| Phase 1 model text preserved | met (passing test: Phase 1 claim grep, no output) |

## SPEC Gaps

None unmet. KG-P4-2 and the notes in Test Infra Gaps Found are observations, not unmet criteria.

## Closeout Packet

1. **Selected plan path:** `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-04-doc-dedup_PLAN_29-10-26.md`
2. **Closeout classification:** Ready for UPDATE PROCESS archival (the plan stays in the shared program task folder, which moves as a unit when the program closes). All developed behavior is proven by passing automated gates.
3. **What was finished:** see `## What Was Done`.
4. **Verified vs unverified:** verified by the independent EVL run, positive controls, `compare.sh` and the catalog check. Unverified: nothing material.
   - 4b. **Validate-contract compliance:** present in the Phase 4 plan, `Gate: PASS` (inner-pvl: phase-4, 2026-10-30). Not edited by this agent.
5. **Cleanup done vs needed:** done: this report, plan checkboxes, umbrella state, status row and report destination, `results.tsv` row 11, `harness/verification.json`, registry. Needed: process commit by vc-git-manager (task-folder files only).
6. **Single best next valid state:** make the process commit; then Phase 5 (`phase-05-tune-skills_PLAN_29-10-26.md`) EXECUTE per its PASS contract (Entry Gate satisfied).
7. **Commit-checkpoint recommendation:** the execution commit `5b143f4` already exists. The process commit belongs after this UPDATE PROCESS: stage this report, the Phase 4 plan, the umbrella, `results.tsv`, `harness/verification.json`, the registry, `p4-tools/` and `dedup-allowlist*.txt`. Nothing else.
8. **Regression status:** `compare.sh` exit 0; Phases 0 to 3 surfaces untouched except the three Phase 4 files.
9. **SPEC achievement:** see `## SPEC Achievement` (6 met, 0 unmet).

**Drift score:** HIGH (signals: (a) 3 files touched, (b2) `AGENTS.md` and protocol docs changed, (d) task-folder files added). Strongly recommend UPDATE PROCESS -- harness/protocol files touched. This is that step.

**Hand-offs for later phases:**
1. Phase 5: Entry Gate satisfied (Phase 4 committed, exit gate green). Must not edit `AGENTS.md` or `CLAUDE.md`.
2. Phase 6: gate `test $(wc -c < AGENTS.md) -le 32768` (now 31,983; `vc-` to `vb-` is the same length, so the rename must not grow it).
3. Phase 7: the pointer-check tool is `p4-tools/pointer-check.mjs` in the task folder (the C-P7-h row must use it, not the nonexistent `$G/pointer-check.mjs`); the pre-flight census compares without counts.
4. `p4-tools/` and `dedup-allowlist*.txt` are in the DOOMED set (removed from the final tree by C-CLEAN).
