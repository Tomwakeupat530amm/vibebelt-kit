---
phase: phase-00-foundation
date: 2026-10-29
status: COMPLETE_WITH_GAPS
feature: general-plans
plan: process/general-plans/active/vibebelt-rebrand_29-10-26/phase-00-foundation_PLAN_29-10-26.md
---

# Phase 00 Report: Foundation

**Outcome (answer first):** Phase 0 is done and verified. The repo now has a git history with a clean upstream snapshot (tag `upstream-baseline`), a saved validator baseline for two runtimes, the fork copyright line, and a project context layer written by `vc-setup`. The independent EVL run (vc-tester) passed: 38 rows, nothing failing, the E3 allow-list held, no remote, nothing pushed. Two known gaps stay open (K0-1, K0-2) and are carried to Phase 8. Status is `COMPLETE_WITH_GAPS` only because of those named residuals.

## What Was Done

**Commits on `main` (all by `Tomwakeupat530amm <minhnguyentuan31103@gmail.com>`, repo-local identity, no global config touched):**

| Commit | Message | What it holds |
|---|---|---|
| `005744e` (tag `upstream-baseline`) | `chore: import upstream kit snapshot` | 521 upstream files, exec bits set in the index (4 x 100755), no program folder, no screenshots |
| `2627c28` | `chore: ignore agent-browser screenshots` | adds `.claude/skills/vc-agent-browser/screenshots/` to `.gitignore` |
| `b219398` | `process: add vibebelt-rebrand program plans` | the program task folder |
| `3d9167d` | `fix: record .agents/skills as symlink in index` | index-only mode 120000; the work tree keeps the 17-byte text file |
| `8b73f41` | `chore: add fork copyright line` | one new LICENSE line under the original `Copyright (c) 2026 vibecode` |
| `746045b` | `process: add phase 0 baseline kit` | `baseline/` (validators.list, run-validators.sh, compare.sh, TSV/TXT pairs for Linux node and node.exe, resolver lists, `upstream_baseline_sha.txt`) |
| `1e81834` | `process: add project context and process scaffold from vc-setup` | `process/context/all-context.md`, `tests/all-tests.md`, `planning/all-planning.md`, `_GUIDE.md` files, `.seed` companions; legacy `process/general-plans/{reports,references}/` dirs removed |

Upstream baseline SHA: `005744ec7ce72d2e021d3aca860616747af78893` (saved in `baseline/upstream_baseline_sha.txt`).

**Who did what (Phase Loop Progress):**
1. RESEARCH: done, no blocker.
2. INNOVATE: skipped as mechanical. Every step (git baseline, validator baseline, LICENSE line, context bootstrap) has one obvious approach fixed by the locked umbrella decisions, so there was no design choice to compare.
3. PLAN-SUPPLEMENT: done (Inner Loop Refresh Note, 29-10-26).
4. PVL: done, `Gate: PASS` (inner re-run).
5. EXECUTE: steps A-D by vc-execute-agent; step E (`vc-setup`) run interactively in the main session with the user plus a `vc-setup` SCAFFOLD/STUDY agent; F1 (second baseline run) by vc-tester; F2 as the two commits `746045b` and `1e81834`.
6. EVL: independent vc-tester confirmation run, PASS (38 rows).
7. UPDATE PROCESS: this report; umbrella `## Current Execution State` rewritten; plan checkboxes ticked.

**Settings pinned (repo-local):** `core.autocrlf=false`, `core.fileMode=false`, `core.symlinks=false`.

**Why `.agents/skills` is a text file (C1):** on this Windows/drvfs checkout the symlink `.agents/skills -> ../.claude/skills` was materialized as a 17-byte plain text file. A WSL symlink on this mount cannot be read by `node.exe` (lstat EACCES), and a directory copy fails the validator's realpath check and adds ~15 MB. So the work tree keeps the text file and the git index records mode 120000 (`git ls-files -s .agents/skills` prints `120000`). Environment-only; a real install recreates the link from the manifest.

**User decisions taken during the phase:**

| # | Decision |
|---|---|
| 1 | Screenshots (53 PNGs in `.claude/skills/vc-agent-browser/screenshots/`) are excluded from the baseline: neither tracked nor deleted; ignored via `.gitignore` plus a local `.git/info/exclude` line. This settles the Phase 5 question non-destructively. |
| 2 | Real git e-mail is `minhnguyentuan31103@gmail.com`; name `Tomwakeupat530amm` (this supersedes the plan text that named `ngocthangptit04@gmail.com`, finding R0-c). |
| 3 | WhatsApp link removal is deferred to Phase 2. |
| 4 | Delete the legacy `process/general-plans/reports/` and `references/` dirs (done by `vc-setup`, user approved LAYOUT CHANGES). |
| 5 | Block `vc-setup` from touching `.agents/skills` (E3 allow-list held). |
| 6 | Linux Node 22.23.4 was installed by the orchestrator at the user's request, in `~/.local/node` (linked at `~/.local/bin/node`), SHA-256 verified. This unlocked Linux-node baselines and part of the hybrid gates. |
| 7 | Model direction: keep opus on the 7 agents that have it and fix the documentation (Phase 1), not the agents. |
| 8 | Quality equivalence (gate C-EQ) is a hard requirement; Phase 8 runs the final equivalence gate. |

**`vc-setup` run (step E):** interactive, Flow B (merge into the kit-installed `process/`), with the user present. Seed fallback (E2) was not used. Answers followed the prepared set (project = vibebelt kit source repo; stack = Node scripts; validators via `node <script>.mjs`, e2e via `node --test e2e-kit-flows.test.mjs`; solo maintainer; CI = validate workflow only; no external services).

**R0.8 accuracy probe on `all-context.md`:** two lists of corrections were applied to the draft produced by `vc-setup` (facts checked against the real tree, for example agent/skill counts, the model-policy paragraph on line 179, Node/runtime facts, and the pending-rename note). The committed file states the model fact as it is on disk (7 opus, 8 sonnet) and defers the fix to Phase 1.

## What Was Skipped or Deferred

| Item | Why | Destination |
|---|---|---|
| INNOVATE step | Mechanical phase; no design choice | n/a (stated above) |
| E2 seed fallback | `vc-setup` ran with the user present | n/a |
| WhatsApp link removal | User decision | Phase 2 |
| Backlog stubs for native Windows / macOS / Linux-Node 22 e2e | The plan and umbrella assign these stubs to Phase 8's user-run checklist (umbrella lines 301, 428, 616); Phase 0 writes none | Phase 8 |
| Removal of `C:\tmp\vc-e2e-*` folders (see Test Infra Gaps Found) | Deleting those needs the user | user action |
| Tidy of stale A0 / umbrella wording that still names `ngocthangptit04@gmail.com` (R0-c) | Harmless stale text; the plan wording is inside a frozen plan section | optional, any later phase that edits the umbrella |

## Test Gate Outcomes

| Gate | Result |
|---|---|
| Baseline rows (`validators_after_setup.tsv`, Linux node, 28 rows) | 26 green; `validate-skills` = 1, `validate-context-discovery` = 1 (both only because of the `.agents/skills` text file, environment-only) and `e2e-kit-flows` = 1 (baseline-red, see findings). Identical to `validators_before.tsv` (28 rows before and after setup). |
| `bash baseline/compare.sh before` and `bash baseline/compare.sh` | exit 0 (nothing worse than baseline) |
| Independent EVL run (vc-tester) | PASS, 38 rows, nothing failing |
| E3 overreach check | clean; only the allowed `process/context/**`, `_GUIDE.md`, `.seed` and legacy `.gitkeep`/dir removals changed |
| `validate-all-context.mjs` | exit 0, per-project checks active (no "bare-kit mode") |
| `git ls-files -s .agents/skills` | `120000` |
| LICENSE | original line kept (count 1), fork line present below it (count 1), `git diff upstream-baseline -- LICENSE` has 0 removed lines |
| Tag | `upstream-baseline` present; SHA matches `upstream_baseline_sha.txt` |
| Remote / push | no remote configured; nothing pushed |

Process-closeout validators run by this agent are listed under `## Closeout Packet`.

## Plan Deviations

1. The baseline is 521 files, not 574, because the screenshots were excluded by user decision 1 (already written into the plan's refresh note).
2. Linux Node 22.23.4 now exists (the plan assumed `node.exe` only). The default baseline is therefore Linux node; the `node.exe` baseline is kept beside it as `*.node-exe.*`. `compare.sh` refuses cross-runtime comparison by design.
3. The first five commits (`005744e` through `8b73f41`) carry the trailer `Co-Authored-By: Claude Opus 5.5`; `746045b` and `1e81834` carry `Claude Sonnet 5.5`. This is only a cosmetic inconsistency in trailers; it was not rewritten (history is unpushed, so it could be amended later if the user cares, but no action is required).
4. `vc-setup` removed the legacy `process/general-plans/reports/` and `references/` dirs. The plan allowed only `.gitkeep` deletions; the user explicitly approved the layout change (decision 4).

## Test Infra Gaps Found

| Gap | Detail | Routed to |
|---|---|---|
| e2e under Linux node (drvfs) | Trials A and B pass. Trial C fails the AC-5 `legacyDeletions` predicate. Trial D fails with a cross-device git clone link error. | Trial C: Phase 6 task B4. Trial D: Phase 8 (needs a native-Linux or CI run). |
| e2e under `node.exe` | Windows path bug (`new URL(import.meta.url).pathname`, `/tmp` paths). Baseline-red / NOT TESTED. | Phase 8 user-run list (K0-1) |
| `validate-context-discovery` under `node.exe` | 4 spurious failures that do not occur under Linux node (path style differences). The Linux node baseline is the default because of this. | documented in `tests/all-tests.md` |
| `validate-skills` and `validate-context-discovery` red under BOTH runtimes | `.agents/skills` is a text file on drvfs. Only green on a native Linux or CI checkout. | Phase 8 user-run item (real symlink on ubuntu CI) |
| Three hook-lib tests red (Linux node) | `statusline-integration`, `statusline-scenarios`, `transcript-parser-signals` (113 tests, 110 pass, 3 fail). Unrelated to the rebrand. | documented as baseline-red in `tests/all-tests.md`; no owner phase |
| Leaked temp folders | About 16 `C:\tmp\vc-e2e-*` folders left by `node.exe` e2e runs (more than 30 `vc-e2e-*` entries now sit in `C:\tmp`; part of them may be from earlier runs). | Removal needs the user; the repo's `tests/all-tests.md` says delete only folders your own run created. |

## SPEC Achievement

No separate `*_SPEC_*.md` exists for Phase 0 (the inner loop skips SPEC; the umbrella plan governs). Scoring the Phase 0 acceptance criteria and the umbrella criterion C-P0 instead:

| Criterion | Verdict |
|---|---|
| R0.1 git repo and `upstream-baseline` tag with no program plan files in it | met (passing test: `git ls-tree -r --name-only upstream-baseline | grep -c vibebelt-rebrand_29-10-26` = 0; tag SHA matches the saved file) |
| R0.2 validator baseline saved, one row per list line | met (passing test: `awk -F'\t' 'NF!=3'` on both TSVs prints nothing; 28 rows each) |
| R0.3 mechanical comparison of current validators against the baseline | met (passing test: `bash baseline/compare.sh` exit 0; exit 3 on runtime mismatch by design) |
| R0.4 `all-context.md` and `tests/all-tests.md` present and valid | met (passing test: `validate-all-context.mjs` exit 0, no bare-kit mode) |
| R0.5 original copyright line kept, fork line added below | met (passing test: the three LICENSE greps and the diff check) |
| R0.6 no stray changes or whitespace errors outside the program folder | met (passing test: `git status --porcelain` for both git binaries empty; `git diff --check upstream-baseline HEAD`) |
| R0.8 `all-context.md` accuracy probe | met (corrections applied before commit) |
| R0.9 screenshots out of the baseline, on disk and ignored | met (passing test: tag holds 0 screenshot paths; 53 files on disk; `git check-ignore` exit 0) |
| R0.10 confirmed repo-local identity on every commit | met (passing test: `git log` shows the confirmed author on all 7 commits) |
| e2e-kit-flows under WSL (C-P0 R0.2 residual, K0-1) | unmet, named Known-Gap residual (Agent-Probe only; Trials A and B pass under Linux node, C and D fail) -> backlog stub is written in Phase 8 (see `## SPEC Gaps`) |

## SPEC Gaps

- K0-1: `node --test e2e-kit-flows.test.mjs`. The Linux node install (decision 6) partly unlocked this gate (Trials A and B now pass), but Trial C (Phase 6 B4) and Trial D (Phase 8, cross-device clone) still fail, and `node.exe` cannot run it. Gate stays CONDITIONAL. Backlog stub: written in Phase 8 (`process/general-plans/backlog/`, per umbrella line 428, item 1).
- K0-2: native Windows and macOS behavior of git exec bits, symlinks and the interactive `vc-setup` first run. Cannot be tested here. Backlog stubs: written in Phase 8 (user-run checklist, umbrella lines 428 and 616).

Not a SPEC gap but worth recording: the 3 hook-lib test failures predate the program.

## Closeout Packet

1. **Selected plan path:** `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-00-foundation_PLAN_29-10-26.md`
2. **Closeout classification:** Ready for UPDATE PROCESS archival. All developed Phase 0 behavior (git baseline, baseline kit, LICENSE edit, context layer) is proven by passing fully-automated gates. The phase plan stays in the shared program task folder, which moves as a unit when the whole program closes; it is not moved to `completed/` now. K0-1 and K0-2 are named residuals about gates Phase 0 does not develop, not about Phase 0's deliverables.
3. **What was finished:** see `## What Was Done` (7 commits, tag, baseline kit, LICENSE line, context layer).
4. **Verified vs unverified:** verified by the independent EVL run (38 rows PASS) plus baseline comparison. Unverified: e2e on node.exe and native Windows/macOS (K0-1, K0-2), `.agents/skills` as a real symlink (needs a native Linux or CI checkout).
   - 4b. **Validate-contract compliance:** present in the Phase 0 plan, `Gate: PASS`, inner PVL re-run on 29-10-26. Not edited by this agent.
5. **Cleanup done vs needed:** done: plan checkboxes ticked, plan status set to VERIFIED, umbrella `## Current Execution State` rewritten. Needed: process commit of these edits (orchestrator via vc-git-manager); user removal of leaked `C:\tmp\vc-e2e-*` folders.
6. **Single best next valid state:** Phase 1 (`phase-01-fix-inconsistencies_PLAN_29-10-26.md`), loop step 1a RESEARCH. Inner PVL must re-run from V1 for Phase 1, Phase 3, Phase 8 and the umbrella because of the 2026-10-29 Inner Loop Refresh Notes.
7. **Commit-checkpoint recommendation:** Execution commits already made (`005744e` through `8b73f41`). Process commit belongs after this UPDATE PROCESS: stage only the Phase 0 plan, this report and the umbrella; do not stage the unrelated Phase 1/3/8 plan and registry edits unless the orchestrator confirms them as part of the same closeout.
8. **Regression status:** first phase, no earlier verified surface. Regression checked against the saved baseline instead: `compare.sh before` and `compare.sh` exit 0.
9. **SPEC achievement:** see `## SPEC Achievement` (9 met, 1 unmet named residual K0-1; K0-2 recorded as untestable here).

**Drift score:** 3 (signals: (a) many files touched; (c) 3+ memory-worthy observations, for example the node.exe vs Linux node differences, the drvfs symlink limitation, the leaked temp folders; (d) structural change in the process folder: legacy `reports/` and `references/` dirs removed, new `baseline/` folder). No `.claude/`, `README.md`, `CLAUDE.md` or `AGENTS.md` change in this phase. Under /goal drift is informational; the gap items (K0-1, K0-2) already have a forward path as Phase 8 backlog stubs, so no extra stub is created here.

**Tier-1 audits run by this agent (outputs):**

| Command | Result |
|---|---|
| `validate-all-context.mjs` | exit 0, 0 failures, 0 warnings |
| `discover-context.mjs --check-routing` | "routing block is in sync", exit 0 |
| `validate-plan-inventory.mjs` | exit 0 (only note: two `_GUIDE.md` basenames, expected) |
| `validate-phase-reports.mjs <umbrella>` | exit 0, 0 failures (Phase 0 report found) |
| `validate-umbrella-state.mjs <umbrella>` | exit 0, 0 failures |
| `validate-plan-artifact.mjs` Phase 0 plan / umbrella | 0 failures each (advisory warnings only: legacy-shape notes; "VERIFIED without user-confirmation language") |
| `validate-umbrella-artifact.mjs <umbrella>` | 0 failures |
| `bash baseline/compare.sh` | "nothing worse than validators_after_setup.tsv", exit 0 |
| `git diff --check` | no output |

The `vc-audit-vc` harness validators were not re-run: no `.claude/`, agent, skill, README or protocol file was edited in this closeout (the only edits are the Phase 0 plan, this report and the umbrella state), and `compare.sh` already re-runs them against the baseline.

**Context audit (files reviewed):** `process/context/all-context.md` (unchanged: written in this phase, already states Linux node v22.23.4 and node.exe v24.15.0, the pending rename, and the model-policy on-disk fact); `process/context/tests/all-tests.md` (unchanged: already records both runtimes, the baseline reds with causes, and the `/tmp/vc-e2e-*` caution); `process/context/planning/all-planning.md` (unchanged: points to the umbrella `## Current Execution State` for status, so no status fact to update); `process/context/generated-skills-catalog.json` (unchanged, no skill change); `process/context/{_all-group-template.md.seed, all-context.md.seed, tests/all-tests.md.seed}` (seed companions, unchanged). No fact became false.

## Forward Preview

### Test Infra Found
- Default baseline runtime is Linux node 22.23.4; `compare.sh` exits 3 when the runtime differs from the reference row, so run the validators with the same runtime that wrote the baseline. A `node.exe` baseline exists for cross-checks.
- `baseline/run-validators.sh` runs every row in `baseline/validators.list`; Phase 1 appends its own `validate-model-effort-policy` line to that list and Phases 1 and 2 add `p1_start` / `p2_start` / `resolved_p2_start.<runtime>` files in `baseline/`.
- e2e: Trial C fails AC-5 `legacyDeletions` (fix in Phase 6 task B4); Trial D needs a native-Linux or CI checkout.
- Three hook-lib tests are baseline-red (not owned by any phase).

### Blast Radius Changes
No blast-radius deviations from the outer-loop plan, apart from the already documented ones: 521-file baseline (screenshots excluded), the extra Linux-node baseline files, and removal of the legacy `process/general-plans/reports/` and `references/` dirs by `vc-setup`.

### Commands to Stay Green
```
bash process/general-plans/active/vibebelt-rebrand_29-10-26/baseline/compare.sh
bash process/general-plans/active/vibebelt-rebrand_29-10-26/baseline/compare.sh before
node .claude/skills/vc-generate-context/scripts/validate-all-context.mjs
grep -c '^Copyright (c) 2026 vibecode$' LICENSE            # 1
grep -c '^Copyright (c) 2026 Tomwakeupat530amm$' LICENSE   # 1
git ls-files -s .agents/skills | cut -c1-6                 # 120000
git status --porcelain -- . ':!process/general-plans/active/vibebelt-rebrand_29-10-26'   # empty
git diff --check upstream-baseline HEAD -- . ':!process/general-plans/active/vibebelt-rebrand_29-10-26'
```
Validators `validate-skills` and `validate-context-discovery` are allowed to stay red (exit 1) only because of `.agents/skills`; they may not get worse.

### Dependency Changes
- New files downstream phases depend on: `baseline/{validators.list, run-validators.sh, compare.sh, validators_before*, validators_after_setup*, resolved_before.*, upstream_baseline_sha.txt}`; tag `upstream-baseline`.
- New context files: `process/context/all-context.md`, `process/context/tests/all-tests.md`, `process/context/planning/all-planning.md`. Phase 1 must edit `all-context.md` line 179 (model-policy paragraph) as part of its model-fact correction.
- Repo-local git identity and the three `core.*` settings are in `.git/config`; `.git/info/exclude` carries the screenshots line (local only).
- `~/.local/bin/node` (Linux Node 22.23.4) is now present on this machine; it is not part of the repo.
- Before Phase 6 (rename) the working-tree directory name is still `vibecode-pro-max-kit-main`.
