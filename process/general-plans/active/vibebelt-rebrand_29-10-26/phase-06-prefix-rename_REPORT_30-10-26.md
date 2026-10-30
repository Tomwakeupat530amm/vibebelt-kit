---
phase: phase-06-prefix-rename
date: 2026-10-30
status: COMPLETE_WITH_GAPS
feature: general-plans
plan: process/general-plans/active/vibebelt-rebrand_29-10-26/phase-06-prefix-rename_PLAN_29-10-26.md
---

# Phase 06 Report: vc- to vb- prefix rename

**Outcome (answer first):** Phase 6 is done and verified. Two commits on `main` (P6_START = `0d33214`): `11b19c2` added the rename tool and the upgrade-safety work, `1e86c12` applied the rename (475 files: 272 edited, 104 paths renamed). Skills, agents, hooks, manifest and state files are now `vb-*` / `vb-manifest.json` / `.vb-version`. An independent EVL run (vb-tester, opus) re-ran Exit Gate G0-G22 and every gate passed; four positive controls were caught. Status is `COMPLETE_WITH_GAPS` because of named residuals (below), not unmet criteria. Nothing is pushed.

## What Was Done

**Commit `11b19c2`** (`feat: add rename tool and upgrade safety`, 58 files):
- `scripts/rename-prefix.mjs` (the only writer), its tests (`scripts/test-rename-prefix.mjs`, `scripts/test-compute-sync-plan.mjs`), fixtures, and both allowlist files.
- `legacy-hashes.json` (generated; manifest `kitOnly`) and read-old fallbacks in `install.sh`, `resolve-manifest.mjs`, `compute-sync-plan.mjs`, skills and hooks, each tagged `legacy-vc-fallback`.
- B4 shared deletion gate, the AC-5 predicate fix (Trial C), a new Trial E (old-to-new upgrade), and the two `AGENTS.md` Skill Registry rows (352, 372) from the Phase 5 hand-off.

**Commit `1e86c12`** (`refactor: rename vc- prefix to vb-`, 475 files, 369 renames):
- 15 agents (`.claude/agents/*.md` + `.codex/agents/*.toml`), 33 skills, hooks in both trees, `vc-manifest.json` to `vb-manifest.json`, `vb-system-behavior/`, `vb-autoresearch-spec.md`, signals `VC-*` to `VB-*`, env vars `VC_*` to `VB_*`, `.vc.json` to `.vb.json`, 19 `author:` lines to `vibebelt-kit`.
- Install/upgrade: an install into an empty target and an upgrade from the upstream baseline both work; `.vb-version` is `1.0.0`, old `.vc-version` and `.vc-installed-files` are removed, user content is kept.

**Who did what (Phase Loop Progress):** 1 RESEARCH done; 2 INNOVATE done; 3 PLAN-SUPPLEMENT done; 4 PVL took 4 passes (the last fix was applied without a V1 re-run, by user decision to go fast); 5 EXECUTE vc-execute-agent (opus), two commits; 6 EVL independent vb-tester (opus); 7 UPDATE PROCESS this report plus the merged local process commit.

## What Was Skipped or Deferred

| Item | Why | Destination |
|---|---|---|
| Env fallback for `VB_INSTALL_TMPDIR` / `VB_UPDATE_TMPDIR` | `rm -rf` safety (an old `VC_*` value must not point a delete at a new path) | accepted deviation |
| Statusline hook files edited | not needed; names there carry no prefix | accepted deviation |
| Fallback in `vb-setup` | setup runs before any install state exists | accepted deviation |
| Renaming `.vibecode-backup/`, `.vibecode-backup*/` gitignore guard, `CLAUDE.md.pre-vibecode` | runtime names no rule matches; renaming moves where users find backups and needs its own migration | named residual (U3) |
| `.vcignore` (scout-block config) and bare `vc` in `subagent-init.cjs` plan-CLI fallback | kept as residuals | named residual |
| Push to the GitHub remote | hard stop; first push of `0d33214` was REJECTED (token lacks the `workflow` scope) | user fixes credentials and gives the go-ahead (Phase 8) |
| Trial D on the Windows-mounted drive | cross-device clone link | Phase 8 A0 (`--no-hardlinks`) |

## Test Gate Outcomes

| Gate | Result |
|---|---|
| Exit Gate G0-G22, execute agent, then re-run independently by vb-tester (opus) | all PASS |
| Rename tool tests / sync-plan tests | 10 pass / 9 pass |
| Signal strings `PHASE_COMPLETE:`, `Gate: PASS`, `SUPPLEMENT_APPLIED:`, `QUICK_FIX_ABORT:` | identical counts before and after (G9: 105 named signals) |
| `bash harness/compare-vb.sh` (vb- validator list) | exit 0, "nothing worse than validators_after_setup.tsv", LICENSE rule included |
| Agent parity, frontmatter, model-effort policy | exit 0 (15 md + 15 toml, 7 opus / 8 sonnet) |
| e2e on a native disk | Trials A, B, C, D, E pass |
| e2e on the Windows-mounted drive | A, B, C, E pass; Trial D red (cross-device link), same cause as baseline |
| Leftover `vc-` scan | 739 hits, all in allowed classes (`legacy-hashes.json`, `MIGRATION.md`, `CHANGELOG.md`, `legacyDeletions`, keep-regions, `scripts/**`, tagged lines) |
| `AGENTS.md` size | 31,981 bytes (budget 32,768) |
| `LICENSE` | original `Copyright (c) 2026 vibecode` line kept, user line kept |
| Positive controls (untagged token, deleted toml mirror, corrupted legacy hash, crash-recovery block) | all caught |
| Agent-Probe | `vb-research-agent` loaded and answered; `vb-context-discovery` was only shown by injection, not invoked through the Skill tool |
| Closeout (EVL) | WITH_GAPS |

UPDATE PROCESS re-checks: `validate-umbrella-state.mjs`, `validate-phase-reports.mjs`, the compare wrapper, `git diff --check` (results in the hand-back message).

## Plan Deviations

Accepted deviations of the execute agent, none changing shipped behavior:
- No env fallback for `VB_INSTALL_TMPDIR` / `VB_UPDATE_TMPDIR` (delete safety).
- Statusline hook files not edited.
- No fallback added in `vb-setup`.
- The B3 generator is a mode of `rename-prefix.mjs`, not a separate script.
- One extra guard in the deletion gate.
- Trial E sits in a keep-region.
- Edits count 272, plan said about 270 (two new hook tests).

## Test Infra Gaps Found

| Gap | Detail | Routed to |
|---|---|---|
| Trial D | cross-device `git clone --local` on the drvfs mount | Phase 8 A0 |
| `.codex/hooks/lib/__tests__/usage-limits-cache.test.cjs` | 5 failing cases, same before and after; undocumented until now | added to `process/context/tests/all-tests.md` known baseline failures |
| Trial E | needs the `upstream-baseline` tag in the kit repo | Phase 8 |
| Hooks `__tests__/README.md` | does not list the new `legacy-config-fallback` test | cosmetic, backlog candidate |
| Trailing whitespace | carried over at `vb-system-behavior/08-validate.md:364` | cosmetic; not part of this change |
| Live resolution of `vb-` skills | only one Agent-Probe done | Phase 8 B4 is skipped (see Hand-offs), so unmeasured |

## SPEC Achievement

No separate `*_SPEC_*.md` for Phase 6 (inner loop; umbrella governs). Scored against the Phase 6 criteria:

| Criterion | Verdict |
|---|---|
| Rename is one idempotent script run; second dry run shows `edits=0 renames=0` | met (passing test: G0) |
| No stray `vc-` outside the allowed classes | met (passing test: G1, G5, G7, leftover scan) |
| All validators and e2e not worse than baseline | met (passing test: G13, G13c, G15) |
| Signals, `LICENSE`, `AGENTS.md` budget preserved | met (passing tests: G9, G13b, G19) |
| Old installs upgrade to `vb-` safely | met (passing test: Trial E, upgrade run) |
| Live agent/skill resolution in a fresh session | met for one agent (Agent-Probe), not measured at scale; no automated gate exists |

## SPEC Gaps

None unmet. The last row is a measurement residual owned by Phase 8 and listed in Test Infra Gaps.

## Closeout Packet

1. **Selected plan path:** `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-06-prefix-rename_PLAN_29-10-26.md`
2. **Closeout classification:** Ready for UPDATE PROCESS archival (the plan stays in the shared program task folder, which moves as a unit when the program closes). All developed behavior is proven by passing automated gates.
3. **What was finished:** see `## What Was Done`.
4. **Verified vs unverified:** verified by the independent EVL run, positive controls, e2e trials and `compare-vb.sh`. Unverified: native Windows/macOS runs, live skill resolution at scale.
   - 4b. **Validate-contract compliance:** present in the Phase 6 plan (inner-pvl: phase-6, CONDITIONAL accepted after 4 passes). Not edited by this agent.
5. **Cleanup done vs needed:** done: this report, plan checkboxes, umbrella state, status row and report destination, `results.tsv` row 13, `harness/verification.json`, registry, context docs, Phase 7/8 hand-offs. Needed: nothing local; push waits for the user.
6. **Single best next valid state:** Phase 7 (`phase-07-vibecoder-docs_PLAN_29-10-26.md`). By user decision it skips its separate PVL (existing contract is used), with an independent check after writing.
7. **Commit-checkpoint recommendation:** the execution commits `11b19c2` and `1e86c12` exist. The process commit is made in this same step (task-folder files plus three context docs only).
8. **Regression status:** `compare-vb.sh` exit 0; Phases 0 to 5 surfaces re-verified by the Exit Gate (G13, G14, G19, G22).
9. **SPEC achievement:** see `## SPEC Achievement` (5 met, 1 met without an automated gate; 0 unmet).

**Drift score:** HIGH (signals: (a) 533 files touched across both commits, (b1) `.claude/`, `.codex/` and hooks changed, (b2) `AGENTS.md`, `README.md`-class and protocol files changed, (d) task-folder files added). Strongly recommend UPDATE PROCESS -- harness/protocol files touched. This is that step.

## Hand-offs for Later Phases

1. **U2:** `vb-system-behavior/12-reference.md` Removed Skills and merged-skill history now shows cosmetic `vb-` names that never existed (vc-team, vc-tech-graph, ...); kept by design.
2. **U3 named residuals (kept on purpose):** `.vibecode-backup/` (installer backup folder), the `.vibecode-backup*/` gitignore guard, `CLAUDE.md.pre-vibecode`, `.vcignore`, bare `vc` in the `subagent-init.cjs` plan-CLI fallback, prose `VC harness`, `vcTeamDir`, `hasVcSkills`, `vc:*` colon forms (23 hits).
3. **U4 Phase 8:** `gen-guardrails.mjs` hashes raw text, so the OLD side of any guardrail identity check needs a rename-mapped OLD tree.
4. **U5:** the backlog note is now `process/general-plans/backlog/vb-agent-browser-screenshots-untrack_NOTE_29-10-26.md`; citations in the umbrella, registry and the Phase 5 report point at the new name.
5. **U6 umbrella owner:** Definition of Done 3 ("grep vc- finds only legacyDeletions and changelog history") is narrower than the designed residual set (`legacy-hashes.json` keys, `legacy-vc-fallback` lines, keep-regions incl. `.gitignore` and e2e Trial C). Align the wording in Phase 8.
6. **U7 Phase 8:** runs WITHOUT B4 (quality-equivalence run skipped by user decision 2026-10-30, quota). Release notes must list C-EQ unmeasured, KG1 (live routing) and KG2 (split-skill behavior) as known gaps.
7. **U8 carried residuals:** R-aa (run P2 before the A1 fixtures exist), R-ab (guard `rm -rf ${R:?}` / `${S:?}`), R-ac (variables do not persist between Bash calls), R-ad (recovery guard treats any untracked path containing `vb-` as apply output).
8. **Git state:** a remote `origin` (`https://github.com/Tomwakeupat530amm/vibebelt-kit.git`) exists; nothing is on it. The first push of `0d33214` was rejected because the token lacks the `workflow` scope. Fixing credentials and pushing are the user's call (hard stop).
9. **Phase 7:** pointer check is `$TF/p4-tools/pointer-check.mjs`; QUICKSTART and GLOSSARY are folded into the README; a Vietnamese README is required per user request; all names are `vb-` now.
10. **Phase 8:** Trial D fix (`--no-hardlinks`), installer backup-folder name residual, Trial E needs the `upstream-baseline` tag, push needs token scope `workflow` plus the user's go-ahead.
