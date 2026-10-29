---
name: plan:vibebelt-rebrand-umbrella
description: "vibebelt-kit rebrand and hardening — umbrella/orchestration plan for the 9-phase program (phases 0-8)"
date: 29-10-26
metadata:
  node_type: memory
  type: plan
  feature: general-plans
  phase: umbrella
---

# vibebelt-kit Rebrand and Hardening — Umbrella Plan

**Date:** 29-10-26
**Complexity:** COMPLEX
**Status:** ⏳ PLANNED

Date: 29-10-26
Status: PLANNED
Complexity: COMPLEX

## Overview

Phase program (9 phases) to fork this kit into vibebelt-kit v1.0.0. Context router: process/context/all-context.md (created in Phase 0); test routing: process/context/tests/all-tests.md. Implementation Checklist = the Phase Ordering table plus each phase plan checklist.

- Program type: PHASE PROGRAM (9 phases, strict order 0..8; phases 4 and 5 may run as an agent team)
- Feature folder: none (general-plans). Task folder: `process/general-plans/active/vibebelt-rebrand_29-10-26/`
- TL;DR: fork this kit into `vibebelt-kit` v1.0.0 for non-developer "vibecoders": safe baseline first, fix contradictions, new identity, slimmer agents (quality measured), de-duplicated docs, tuned skills, `vc-` to `vb-` rename by one script, plain-language docs, real install test, release.

## Locked Decisions (do not reopen)

| Topic | Decision |
|---|---|
| Name / repo | `vibebelt-kit`; `https://github.com/Tomwakeupat530amm/vibebelt-kit` (`REPO` in install.sh) |
| Prefix | `vc-` becomes `vb-` (Phase 6 only) |
| Version | reset to 1.0.0; fork origin recorded in CHANGELOG |
| Workflow | full RIPER-5 unchanged; ALL 33 skills kept (tune only); Claude Code AND Codex both supported |
| Goal | publish for others to install; audience = non-developer vibecoders; user-facing text in plain language |
| License | MIT; keep original line `Copyright (c) 2026 vibecode`; ADD `Copyright (c) 2026 Tomwakeupat530amm` BELOW it (LOCKED Q1; Phase 0 is not blocked) |
| Security contact | SECURITY.md uses GitHub private vulnerability reporting: https://github.com/Tomwakeupat530amm/vibebelt-kit/security/advisories/new; no email invented (LOCKED Q2) |
| FUNDING | Delete `.github/FUNDING.yml` (LOCKED Q2) |
| Golden runs | Phase 3 golden-baseline runs (about 3 sample tasks on old agents) APPROVED; phase reports the run count before starting (LOCKED Q3) |
| Manifest and state-file rename | `vc-manifest.json` becomes `vb-manifest.json` in Phase 6, AND the state files `.vc-version`, `.vc-installed-files`, `.vc-publish-config` become `.vb-version`, `.vb-installed-files`, `.vb-publish-config`; install.sh, resolve-manifest.mjs, compute-sync-plan.mjs, vb-update/vb-publish, `.gitignore`, e2e test and docs change together. Old names are still READ as fallbacks and migrated to the new names (never deleted before the new file is written); Phase 6 B1 gets an upgrader fixture for all four (LOCKED Q4, extended by Gap 5) |
| Execute effort | Execute, fast-mode and quick-fix agents follow `implementation-standards.md` §Agent Frontmatter Conventions as written: `effort: max` for opus execution agents (`high` is for sonnet planners/validators). Earlier wording that said 'high' is corrected. Phase 1 report MUST state the token-cost impact (LOCKED Q5, decision a) |
| Native Windows / macOS | Cannot be tested here; Phase 8 gives the user exact commands; those gates stay CONDITIONAL with a backlog stub (LOCKED Q6) |
| Outward actions | Push, remote tag, GitHub release remain hard stops needing explicit user go-ahead in Phase 8 (LOCKED Q7) |
| Signal strings | `PHASE_COMPLETE:`, `Gate: PASS`, `SUPPLEMENT_APPLIED:`, `QUICK_FIX_ABORT:` and all others stay verbatim |
| Commits | directly on `main`, one execution commit per phase, process/plan commits separate. ONE exception: Phase 3 makes one commit PER AGENT (`refactor(agents): slim <agent>`) so a worse agent can be reverted alone; the Phase 3 report lists them |
| Red validator (decision b) | 'Red' means 'worse than the Phase 0 baseline'. Baseline is recorded BEFORE and AFTER `vc-setup`. `.agents/skills` is a 17-byte text file on this checkout instead of a symlink: Phase 0 records it in git as mode 120000 in the INDEX ONLY (`git update-index --cacheinfo`, `core.symlinks=false`); the work tree keeps the 17-byte text file; there is no symlink and no copy fallback. Raw exit of `validate-skills` / `validate-context-discovery` stays 1 under `node.exe` (environment). The operative rule is 'not worse than baseline' plus the filtered check that no failure other than `.agents/skills` remains. Phase 0 documents the cause. |
| Node in WSL (decision c) | Linux Node 22 in WSL is a USER action: Phase 0 notes give the exact install commands, never auto-installed. If absent, `node.exe` runs the validators and the e2e / WSL install gates are recorded as baseline-red / NOT TESTED with the cause. |
| Version and manifest mode (decision d) | Version stays 1.0.0. `resolve-manifest.mjs` must pick glob mode by manifest shape (`Array.isArray(manifest.include)`) instead of `semverGte(version,'2.1.0')`. Owned by Phase 2, with a gate that `resolve-manifest --json` returns `files.length > 0` after the version bump. Phases 6 and 8 list this as a precondition. |
| Rename rules (decision e) | Phase 6 rename is case-sensitive and atomic: `vc-`/`VC-`/`VC_` all become `vb-`/`VB-`/`VB_` (signals such as `VC-PREDICT-DEEP-NEEDED`, env vars such as `VC_KIT_SOURCE`). Old env var names and old state files (`.vc-version`, `.vc-installed-files`, `.vc-publish-config`, `vc-manifest.json`) are still READ as fallbacks and migrated. ONE program-wide sweep rule with allowlist (canonical text in Charter DoD item 3 and Global Constraints, including the `CHANGELOG.md`/`MIGRATION.md` whole-file protection; names the `upstream-attribution` tag and the brand-detection lines in `validate-kit-portability.mjs`, `vc-publish/SKILL.md`, `vc-publish/references/vc-publish.md`). Restart checkpoint: the orchestrator asks the user to restart Claude Code before Phase 7 because renamed agents may not be spawnable in the same session. Signal strings stay verbatim until Phase 6 and change only as this rule says. The four uppercase signals (`VC-PREDICT-DEEP-NEEDED`, `VC-PREDICT-RESEARCH-COMPLETE`, `VC-FEASIBILITY-PROBE-NEEDED`, `VC-FEASIBILITY-VERDICT-READY`), `VC_*` env vars, `.vc.json` and `vc plan check` are RENAMED to `VB-`/`VB_`/`vb` with old-name fallbacks where code reads them; they are NOT residuals. |
| Phase 4/5 team join (decision f) | The orchestrator only SEQUENCES the join after both teammates report; it runs no command itself. A spawned vc-execute-agent merges the `p4-docs-dedup` and `p5-skills-tune` branches and runs `catalog --write`; a spawned vc-tester runs `catalog --check`, the `diff -q`/`cmp` mirror check on the charter-template pair and the joint validator suite. Phase 4 may not rename or delete any protocol file or heading cited from outside `process/development-protocols/` (including `.claude/**` and `.codex/**`) without leaving a stub or sending a SendMessage to `p5-skills-tune`. Both charter-template copies are FROZEN in Phases 4 and 5. Phase 5 handoff reads 'after Phase 3 exit gate, parallel with Phase 4'. |
| Golden baseline source (Gap 7) | Golden baseline is captured from the `upstream-baseline` tag (worktree checkout, original models) and compared after Phase 3 AND for the Phase 1 model change (opus to sonnet on research/plan/validate/tester). Phase 3 size gate has a numeric floor: at least 25% drop in prompt size on the slimmed agent set. |
| `.agents/skills` (cycle 2, decision 1) | Stays the 17-byte text file in the work tree. Git records mode 120000 via `git update-index --cacheinfo` with `core.symlinks=false`. The gate checks only that no failure OTHER than `.agents/skills` remains (a directory copy and a WSL symlink both fail validate-skills under node.exe, verified). |
| vc-setup (cycle 2, decision 2) | `vc-setup` (later `vb-setup`) in Phase 0 is INTERACTIVE: the user's presence is a checkpoint (ask the user the setup questions); seed-based context is the fallback when the user is absent. |
| Phase 4/5 worktrees (cycle 2, decision 3) | Teammates `p4-docs-dedup` and `p5-skills-tune` each work in their own `git worktree` + branch, merged at the join. |
| Join sequencing (cycle 2, decision 4) | The orchestrator only SEQUENCES the join: a spawned vc-execute-agent runs catalog `--write`; a spawned vc-tester runs `--check` and the joint suite. No inline execution by the orchestrator. |
| Phase 3 judging (cycle 2, decision 5) | Phase 3 judges slimmed agents against `golden/phase1/` (same models, unslimmed) for the revert decision; `golden/old/` (original models) is reported only as the Phase 1 model-change measurement. Sandboxes are built identically so only agent files differ. |
| Baseline after rename (cycle 2, decision 6) | Phase 6 adds a step that writes `validators.vb.list` and a runtime mapping into the TASK FOLDER (not the protected `baseline/`); `compare.sh` accepts a `--map` file. |
| Phase 3 census (cycle 2, decision 7) | Phase 3 census lists agents by directory listing and keys output by prefix-stripped names. |
| Phase 6 manifest (cycle 2, decision 8) | `legacy-hashes.json` and `scripts/**` belong in `kitOnly`, not `include`. |
| Agent-browser screenshots (inner 1b, user decision 1) | The 53 PNGs under `.claude/skills/vc-agent-browser/screenshots/` (14.6 MB) are EXCLUDED from the Phase 0 baseline commit and the `upstream-baseline` tag (excluded via `.git/info/exclude`; files stay on disk). A follow-up commit `chore: ignore agent-browser screenshots` adds the path to the tracked `.gitignore` BEFORE any later `git add -A`, so no later phase can commit them by accident. Baseline = 574 files minus 53 = 521 files (about 6.4 MB). This SETTLES Phase 5's untrack/gitignore proposal: Phase 5 keeps its non-destructive stance (no screenshot file is moved or deleted) and only rewords its proposal. |
| Git identity (inner 1b, user decision 2) | `user.name` = `Tomwakeupat530amm`; `user.email` = the user's OWN real address (not the GitHub noreply form). The agent never invents it: Phase 0 A0 is a user checkpoint where the orchestrator has the user confirm the exact address (account address on file `ngocthangptit04@gmail.com`) because it becomes public in every commit once pushed. Noreply stays a mentioned alternative only. |
| Old owner's WhatsApp invite link (inner 1b, user decision 3) | `chat.whatsapp.com/E42ySo6iGmuAyeh25eAXuu` (measured 8 lines in 7 kit files outside the program folder; the user counted 9 lines) is REMOVED in Phase 2 (not replaced by an invented link). |
| Mixed git binaries (inner 1b) | Gates run with WSL git; `node.exe` validators call Windows git against the same repo (one cross-read verified in research). Phase 0 adds a gate that `git.exe status` and WSL `git status` both print nothing after C3. |

---

## Program Goal Charter

```
vibebelt-kit Rebrand and Hardening — Program Goal Charter

North star:
- Ship vibebelt-kit v1.0.0: the same proven RIPER-5 workflow, rebranded, internally consistent, leaner, and installable by a non-coder from the README alone.

Definition of done (an unattended agent must be able to do all of these):
1. Show a git history with tag `upstream-baseline` and a saved before/after validator comparison.
2. Run the full validator suite (including the new model/effort policy validator) with no validator worse than the Phase 0 baseline (the operative rule; `.agents/skills` is recorded as index-only mode 120000 and stays a text file in the work tree, so raw exit of `validate-skills` / `validate-context-discovery` stays 1 under `node.exe` and is expected to be 0 only on Linux Node 22 or ubuntu CI), and CI runs the same suite.
3. Show that grep for `withkynam|flowser` finds only attribution lines and grep for `vc-` finds only legacyDeletions and changelog history, using ONE program-wide sweep rule. SWEEP RULE (canonical wording lives here; Phase 2 and Phase 6 implement it, see their gates): search the whole repo EXCLUDING `.git`, the program task folder `process/general-plans/active/vibebelt-rebrand_29-10-26/` (and its archived copy), `baseline/`, `golden/`, the rename script + its fixtures, `CHANGELOG.md` and `MIGRATION.md` (WHOLE-FILE protection: Phase 6 implements the history rule as a protected set, not as marker regions; in Phase 2 their old-identity lines are instead tagged `upstream-attribution`), and `legacyDeletions`. Old-identity lines that legitimately remain are only: (1) lines carrying the literal tag `upstream-attribution`; (2) the brand-detection lines in `.claude/skills/vc-audit-vc/scripts/validate-kit-portability.mjs`, `.claude/skills/vc-publish/SKILL.md` and `.claude/skills/vc-publish/references/vc-publish.md`. Phase 2 may additionally exclude the whole `process/` directory ONLY because at Phase 2 time `process/` holds no kit text beyond the task folder and Phase 0 generated context; its gate adds `grep -rIn "withkynam\|flowser" process --exclude-dir=vibebelt-rebrand_29-10-26` and expects no output. Phase 2 (gate R2.1 plus the `process/` grep) and Phase 6 (protected set + allowlist diffs G5/G7) implement this rule; they do not repeat the text verbatim.
4. Show per-agent before/after size plus golden-baseline comparison proving output equal or better, signal strings intact, Claude/Codex parity green.
5. Show 33 skills intact with tuned triggers, a regenerated catalog, an agent-browser size explanation, and a proposed-new-skills list (none added).
6. Show README top + quickstart + glossary in plain language, EN and VI synced, other 8 languages marked "may be outdated".
7. Show an install-test matrix (fresh + existing project; Windows Git Bash, WSL, macOS/Linux; untested ones documented) and a local tag `v1.0.0` with plain-language release notes.

What "verified" means (program level):
- A phase is VERIFIED only when: its exit-gate commands exit as expected, the full validator suite is not worse than the Phase 0 baseline (pre-existing reds are not blamed on us), the regression checkpoint against earlier verified surfaces passes, and a validate-contract exists (or a documented skip reason).
- Known-Gap is a named residual, never a proof. A behavior covered only by Known-Gap keeps its gate CONDITIONAL and gets a backlog stub.

Scope tiers → phase mapping:
- Tier 1 Safety net and consistency → Phases 0, 1
- Tier 2 Identity, leaner agents, cleaner docs, tuned skills → Phases 2, 3, 4, 5
- Tier 3 Rename, vibecoder docs, release → Phases 6, 7, 8
- This program retires Tiers 1-3.

Explicitly out of scope (deferred tier):
- Removing any skill or any RIPER-5 phase; adding new skills (proposals only); translating the 8 non-EN/VI languages; marketing site; publishing to package registries; changing agent behavior beyond slimming.

Hard safety constraints (non-negotiable, per phase):
- Never delete user content (including in the updater/legacyDeletions: kit-owned, unmodified files only).
- Never remove or alter the original MIT notice and the line "Copyright (c) 2026 vibecode".
- No phase proceeds on a red validator, where 'red' means worse than the Phase 0 baseline (recorded before AND after vc-setup).
- Commit each phase's execution changes to `main` before the next phase. Keep process/plan/context commits separate from execution commits.
- Pushing, tagging remotely, GitHub release, billed model runs beyond the approved golden set: ask the user first.
```

### Acceptance criteria (the user brief acts as the SPEC; each criterion names its proof)

| ID | Criterion | proven by | strategy |
|---|---|---|---|
| C-P0 | git exists, validator baseline saved, all-context.md exists | Phase 0 Exit Gate commands | Fully-Automated |
| C-P1 | new policy validator + fixtures, CI covers full suite, counts consistent | Phase 1 Exit Gate | Fully-Automated |
| C-P2 | grep finds only attribution; images local; version 1.0.0 | Phase 2 Exit Gate | Fully-Automated |
| C-P3 | size drops, output equal/better, signals intact, parity green | Phase 3 Exit Gate + golden compare | Fully-Automated + Agent-Probe |
| C-P4 | single source for shared docs, wiring/sync/parity green | Phase 4 Exit Gate | Fully-Automated |
| C-P5 | 33 skills, validators green, proposals listed | Phase 5 Exit Gate | Fully-Automated + Hybrid |
| C-P6 | one idempotent dry-run-capable script, no stray `vc-`, all validators green | Phase 6 Exit Gate | Fully-Automated + Hybrid |
| C-P7 | non-coder can install from README unaided; EN+VI synced | Phase 7 Exit Gate | Fully-Automated + Agent-Probe |
| C-P8 | clean install on tested environments; tag v1.0.0 | Phase 8 Exit Gate | Fully-Automated + Hybrid (macOS/Windows native = Known Gap, CONDITIONAL, backlog stub) |
| C-SAFE-1 | never delete user content | Phase 6 B1 + Phase 8 B1 | Hybrid |
| C-SAFE-2 | MIT notice and original copyright kept | both LICENSE greps run after every phase by Phase 0 `baseline/compare.sh` (Global Constraints) | Fully-Automated |

---

## Stable Program Goal (copy-paste this to start autonomous execution)

```
SESSION GOAL: vibebelt-kit rebrand + hardening to v1.0.0 for non-coder vibecoders
Ref: process/general-plans/active/vibebelt-rebrand_29-10-26/vibebelt-rebrand-umbrella_PLAN_29-10-26.md

TARGET: all 9 phases (0-8, strict order) done, each exit gate green:
- no validator worse than Phase 0 baseline (red = worse than baseline), git diff --check clean
- grep withkynam|flowser = attribution only; grep vc- = legacyDeletions/CHANGELOG/MIGRATION only (sweep allowlist in umbrella)
- 33 skills kept, RIPER-5 unchanged, Claude+Codex parity, clean install tested, tag v1.0.0
- tiers: automated (iterate-until-green) / hybrid (fix-if-in-blast-radius) / agent-probe (record-judgment)

AUTONOMY: before ANY spawn read umbrella Current Execution State, then the phase plan Phase Loop Progress (first unchecked box = next agent). Phases 4+5 = agent team (TeamCreate, TaskCreate, SendMessage, TaskList), disjoint per phase-blast-radius-registry.md; orchestrator only sequences the join: spawned execute-agent merges + catalog --write, spawned tester runs --check + suite.

PER-PHASE LOOP (7-step, never skip/reorder, SKIPS SPEC): 1 RESEARCH, 2 INNOVATE, 3 PLAN-SUPPLEMENT, 4 PVL, 5 EXECUTE, 6 EVL, 7 UPDATE-PROCESS. PVL never skipped; placeholder or partial contract = blocked. Every subagent FIRST ACTION: vc-context-discovery + vc-plan-discovery. Every phase-END: vc-agent-strategy-compare. EXECUTE = opus, all else sonnet. After Phase 6 use vb- names (restart Claude Code between Phase 6 and 7).

HARD STOPS (pause for user):
- push, remote tag, GitHub release, publish
- any deletion of user content; billed model runs beyond approved golden set
- a validator worse than baseline (never advance), cascade BLOCKED, unresolvable placeholder contract
- Linux Node install in WSL = user action (never auto-install)
- user needed in Phase 0 (confirm real git e-mail; interactive vb-setup) and cost OK before Phase 3 A0 golden runs and Phase 4 0.5a probes
- after Phase 6 rename commit: stop, ask user to restart Claude Code

SAFETY (never override):
- never delete user content; keep MIT notice + "Copyright (c) 2026 vibecode"
- signal strings verbatim (PHASE_COMPLETE:, Gate: PASS, SUPPLEMENT_APPLIED:, QUICK_FIX_ABORT:) until Phase 6 rename rule
- Phase 3: revert only the agent whose output drops vs golden
- commit each phase on main before the next (Phase 3: one commit per agent); process commits separate
- VC-/VC_ signals+env vars renamed to VB-/VB_ in Phase 6 (not residuals)

TEST GATES (every phase exit; node.exe if no Linux node; compare to baseline):
  node .claude/skills/vc-audit-vc/scripts/validate-agent-parity.mjs
  node .claude/skills/vc-audit-vc/scripts/validate-skills.mjs
  node .claude/skills/vc-audit-vc/scripts/validate-kit-portability.mjs
  node .claude/skills/vc-audit-vc/scripts/validate-guide-sync.mjs
  node .claude/skills/vc-audit-vc/scripts/validate-protocol-wiring.mjs
  node .claude/skills/vc-audit-vc/scripts/validate-skill-invocation-wiring.mjs
  node .claude/skills/vc-audit-vc/scripts/validate-agent-frontmatter.mjs
  node .claude/skills/vc-audit-vc/scripts/validate-model-effort-policy.mjs (from Phase 1)
  node .claude/skills/vc-audit-context/scripts/validate-context-discovery.mjs
  node .claude/skills/vc-audit-plans/scripts/validate-plan-inventory.mjs
  (after Phase 6 paths read vb-audit-*; plus git diff --check)
  LICENSE (via baseline/compare.sh, every phase): grep -c "Copyright (c) 2026 vibecode" LICENSE = 1; grep -c Tomwakeupat530amm LICENSE = 1

VALIDATE CONTRACT: per-phase, written by vc-validate-agent into each phase plan before EXECUTE.

START: Phase 0, loop step 1 RESEARCH (pending). Spawn vc-research-agent (sonnet) for Phase 0.
```

---

## Phase Ordering

| Phase | Plan file | Scope summary | Depends on |
|---|---|---|---|
| 0 — Foundation | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-00-foundation_PLAN_29-10-26.md` | git init, baseline tag, validator baseline, LICENSE line, vc-setup | — |
| 1 — Fix inconsistencies | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-01-fix-inconsistencies_PLAN_29-10-26.md` | model/effort drift, README counts, CI coverage, new policy validator | Phase 0 |
| 2 — Identity and distribution | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-02-identity-distribution_PLAN_29-10-26.md` | withkynam/flowser replaced, local images, version 1.0.0 | Phase 1 |
| 3 — Slim agents | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-03-slim-agents_PLAN_29-10-26.md` | golden baseline, slim one agent at a time, revert on quality drop | Phase 2 |
| 4 — Doc de-duplication | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-04-doc-dedup_PLAN_29-10-26.md` | single source for CLAUDE.md/AGENTS.md, remove unjustified "superseded"/legacy leftovers (allowlist diff) | Phase 3 |
| 5 — Tune skills | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-05-tune-skills_PLAN_29-10-26.md` | keywords/descriptions, oversize files, agent-browser 15MB, proposals | Phase 3 |
| 6 — Prefix rename | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-06-prefix-rename_PLAN_29-10-26.md` | vc- to vb- by one idempotent script, legacyDeletions | Phases 4 + 5 |
| 7 — Vibecoder docs | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-07-vibecoder-docs_PLAN_29-10-26.md` | README top, quickstart, glossary, plain messages, EN+VI | Phase 6 |
| 8 — Install test and release | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-08-install-release_PLAN_29-10-26.md` | real installs, update/publish flows, v1.0.0 | Phase 7 |

Ordering rationale (checked step by step): the baseline tag must precede every edit (0); the policy validator and CI must exist before big edits so later phases are guarded (1); identity changes touch installer constants the rename (6) must carry along (2 before 6); slimming (3) before dedup/skills so the rename and docs act on the final text; 4 and 5 touch disjoint files (see registry) so they may run as a team; the rename (6) needs both done so one script sees the final file set; docs (7) must use final `vb-` names; install testing (8) must test the final build. No phase depends on a later phase's output.

### Join Conditions

- Each phase MUST NOT start until the previous phase exit gate passes (Phase 6 waits for BOTH 4 and 5).
- Phases 4 and 5 are independent and may run concurrently only as an agent team with disjoint blast radii; otherwise run 4 then 5.
- Phase 5 handoff reads 'after Phase 3 exit gate, parallel with Phase 4' (not 'after Phase 4').
- Join step (SEQUENCED by the orchestrator once both teammates report; each command is RUN by a spawned agent, never inline): (1) a spawned vc-execute-agent merges the `p4-docs-dedup` and `p5-skills-tune` worktree branches; (2) the same vc-execute-agent runs `generate-skills-catalog.mjs --write`; (3) vc-tester runs `--check`; (4) vc-tester runs `diff -q process/development-protocols/references/program-goal-charter-template.md .claude/skills/vc-generate-phase-program/references/program-goal-charter-template.md` (expected: no output, or `cmp` exit 0; both copies are frozen in Phases 4 and 5, so any difference is a claim breach); (5) vc-tester runs the joint validator suite (protocol-wiring, guide-sync, agent-parity, skills, skill-routing, confusable-skills).
- Phase 4 and Phase 5 teammates each work in their own `git worktree` + branch (claim-check runs on each branch diff; a teammate merge can be reverted alone); sequential 4 then 5 stays a valid fallback.
- Meaning-level rule: Phase 4 must not rename or delete any protocol file or heading cited from outside `process/development-protocols/` (including `.claude/**` and `.codex/**`) without leaving a one-line stub or sending SendMessage to `p5-skills-tune` first; both teammates run protocol-wiring before reporting.
- Phase 6 preconditions: Phase 4 + 5 exits met, join step green, and `resolve-manifest --json` returns `files.length > 0` (decision d). Phase 8 lists the same precondition.
- Restart checkpoint: Phase 6 stops after its rename commit; the user restarts Claude Code; Phase 6 EVL/UPDATE-PROCESS and all of Phase 7 run in the restarted session (renamed `vb-*` agents may not be spawnable in the same session).
- Hard dependency of Phase 7 on Phase 3: Phase 7 reads `golden/signal-census.mjs` and `golden/signal-census-phase3.txt` (task folder, excluded from the rename sweep). Phase 3 must keep both; Phase 7 compares after `sed 's/VC-/VB-/g'`.
- Phase 0 owns the baseline kit used by every later gate: `baseline/compare.sh [--map <file>]` (label rename map), `baseline/run-validators.sh`, `baseline/validators.list`, `baseline/resolved_before.<runtime>.txt`, `baseline/upstream_baseline_sha.txt`, `baseline/validators_before.*`, `baseline/validators_after_setup.tsv`, and the `.agents/skills` repair. Phase 1 adds `baseline/p1_start.txt` and one line in `validators.list`; Phase 2 adds `baseline/p2_start.txt` and `resolved_p2_start.<runtime>.txt`; Phase 6 never writes into `baseline/` (its helpers live in `harness/`).
- Phase 4/5 task-folder tools (`p4-tools/**` incl. `claim.globs` and `baseline.sha`, `dedup-allowlist*.txt`, `p5-tools/**` incl. `claim.globs` and `baseline.sha`, `proposed-new-skills.md`, both phase reports) are single-owner files; the registry prose must match each phase's machine-readable `claim.globs`. Catalog regeneration happens only at the orchestrator-sequenced join step.
- User checkpoints (returned as `NEEDS_CONTEXT`, then re-spawned with the answer): Phase 0 git identity email (A0) and interactive `vc-setup` (E0); cost acknowledgements for the exact run counts at Phase 3 A0 (golden runs) and Phase 4 0.5a (probe calls).

---

## Strategy Recommendation per Phase (vc-agent-strategy-compare)

Phase plans' own Strategy sections are authoritative if this table and a phase plan ever differ. Model rule: EXECUTE = opus; research, innovate, plan, validate, EVL tester, update-process = sonnet.

| Phase | Strategy | Why | Models |
|---|---|---|---|
| 0 | Sequential | steps depend on each other | all sonnet except EXECUTE opus |
| 1 | Parallel subagents (2 groups, ordered): group (b) README/i18n/CI starts only after group (a) validator exists (Phase 1 ordering rule); the Phase 1 plan is authoritative | agents+validator first, then README/i18n/CI; no cross-talk needed | sonnet planning; 2 opus implementers |
| 2 | Parallel subagents (4 disjoint groups a-d, with ordering: (c)/(d) wait for the resolver fix before version text); Phase 2 plan is authoritative | install scripts / community docs / README+assets / i18n READMEs | sonnet planning; 4 opus implementers |
| 3 | Sequential, one agent per cycle | regression must be attributable to one agent | sonnet judge/plan; opus editor |
| 4 + 5 | Agent team: `TeamCreate` team "vibebelt-p4-p5" with named teammates `p4-docs-dedup` and `p5-skills-tune`, one `TaskCreate` task each scoped to its registry claim, `SendMessage` to ask before touching anything outside the claim, `TaskList` to track; orchestrator-SEQUENCED join afterwards (spawned execute-agent: merge + catalog --write; spawned tester: --check, mirror `diff -q`, joint validators); each teammate in its own worktree + branch | blast radii must stay disjoint while both run; parallel subagents cannot coordinate | sonnet teammates for research/audit; opus only for the editing leg |
| 6 | Sequential | one script, determinism is the point | sonnet planning; opus script author/runner |
| 7 | Mixed, ordered (glossary follows the quick start; VI follows EN); Phase 7 plan is authoritative | files are disjoint but wording depends on the English text | sonnet prose; opus only for agent-prompt edits |
| 8 | Sequential | each environment fix feeds the next test | sonnet tester; opus fixes |

---

## Per-Phase Entry / Exit Gates

| Phase | Entry | Exit gate |
|---|---|---|
| 0 | Program start | git exists; `upstream-baseline` tag; validator baseline saved before AND after vc-setup; `.agents/skills` repaired; all-context.md exists; `grep -c "Copyright (c) 2026 vibecode" LICENSE` = 1 and `grep -c "Copyright (c) 2026 Tomwakeupat530amm" LICENSE` = 1 |
| 1 | Phase 0 exit met | new policy validator + pass/fail fixtures; CI lists every validator; counts consistent |
| 2 | Phase 1 exit met | grep (program-wide sweep rule) finds only attribution lines; no hotlinked images; version 1.0.0; `resolve-manifest --json` returns files.length > 0 |
| 3 | Phase 2 exit met | per-agent commits; prompt size at least 25% lower on the slimmed set; golden compare EQUAL/BETTER; signals intact; parity green |
| 4 | Phase 3 exit met | protocol-wiring, guide-sync, agent-parity green; no unjustified "superseded"/legacy leftovers (line-anchored allowlist diff; the Phase 4 plan is authoritative) |
| 5 | Phase 3 exit met (parallel with Phase 4) | 33 skills; validate-skills, skill-routing, confusable-skills green; catalog regenerated |
| 6 | Phases 4 and 5 exit met, join step green, resolve-manifest precondition | script idempotent; no stray `vc-`; all validators and e2e green |
| 7 | Phase 6 exit met, Claude Code restarted, `golden/signal-census.mjs` + `golden/signal-census-phase3.txt` present | non-coder install walkthrough passes; EN+VI synced; 8 banners |
| 8 | Phase 7 exit met | `e2e-kit-flows.test.mjs` `.pathname` Windows bug fixed first (Phase 8 owns it); clean install on tested environments; 6 user-run known-gaps listed; local tag v1.0.0; release notes |

---

## Per-Phase Loop

Each phase executes the canonical 7-step inner loop `R → I → P → PVL → E → EVL → UP`. It SKIPS SPEC: the user brief and this umbrella are the SPEC.

1. **RESEARCH** — vc-research-agent (sonnet): load context, read prior phase reports, check drift
2. **INNOVATE** — vc-innovate-agent (sonnet): decide approach; Decision Summary
3. **PLAN-SUPPLEMENT** — vc-plan-agent (sonnet): update the existing phase plan or mark "n/a — research clean"
4. **PVL** — vc-validate-agent (sonnet): V1-V7; validate-contract per `example-validate-output.md`
5. **EXECUTE** — vc-execute-agent (opus): implement the phase plan only
6. **EVL** — vc-tester: re-run contract gates independently; follow-up stubs; EVL HANDOFF SUMMARY
7. **UPDATE-PROCESS** — vc-update-process-agent (sonnet): phase report, rewrite `## Current Execution State`, commit on main

PVL is NEVER skipped. A placeholder or partial `## Validate Contract` = blocked.

---

## Pre-PVL Conflict Resolution

Checked against `phase-blast-radius-registry.md`. Phases 4 and 5 are `parallel-safe` (disjoint: 4 owns CLAUDE.md, AGENTS.md, process/development-protocols/**; 5 owns .claude/skills/**, skills catalog). Files touched by more than one phase are all `parallel-safe` only because phases run strictly in order (single writer at a time); owner of the final shape in brackets:

| File / area | Phases touching it | Owner (winning phase) |
|---|---|---|
| README.md | 1, 2, 6, 7 | 7 (final wording); 6 only renames prefix |
| `.claude/agents/*.md` and `.codex/` mirrors | 1, 3, 6, 7 | 3 (content); 1 front-matter only, 6 rename only, 7 message prose only |
| `install.sh`, vc-update/vc-publish skills (`SKILL.md` + `references/`) | 2, 5 (front-matter only, SKILL.md files), 6, 8 | 2 (REPO); 5 front-matter only; 6 rename + manifest name; 8 small fixes only |
| `vc-manifest.json` / `vb-manifest.json` | 2 (version), 6 (file rename) | 6 |
| `CHANGELOG.md` | 2 (new `## [1.0.0]` fork-origin entry, upstream history tagged), 6 (whole-file PROTECTED, no rewrite), 8 (hand-written release entry; must extend, not duplicate, the Phase 2 `## [1.0.0]` entry, see contradiction C4) | 8 for the release text; 2 for the fork-origin entry |
| `LICENSE` | 0 only (checked after EVERY phase by `baseline/compare.sh`) | 0 |
| `SECURITY.md`, `.github/FUNDING.yml` | 2 only | 2 |
| `docs/i18n/README.*.md` (9 files; Vietnamese is `README.vi-VN.md`) | 1 (counts), 2 (identity + images), 6 (rename), 7 (banner / VI sync) | 7 (final); Phase 2 group C owns identity + images |
| `MIGRATION.md` | 2 (identity lines, history lines tagged), 6 (whole-file PROTECTED; one hand-added banner line, step B6, pointing to `docs/RELEASE-NOTES-1.0.0.md`) | 2; Phase 8 does NOT claim it |
| `docs/GOOD-FIRST-ISSUES.md`, `docs/GITHUB-*.md` | 2, 6, 7 (docs) | 7 for wording; 2 identity; 6 rename only |
| `.claude/skills/vc-setup/**` | 2 (identity), 5 (front-matter only), 6 (rename) | 2 |
| `.claude/skills/vc-audit-vc/SKILL.md` | 1 (new validator listing), 5 (front-matter only), 6 (rename) | 1 |
| `.github/workflows/validate.yml` | 1 (new validator listing), 6 (rename) | 1 |
| `resolve-manifest.mjs` | 2 (manifest-shape fix), 6 (rename) | 2 |
| `.vc-version`, `.vc-installed-files`, `.vc-publish-config`, `.gitignore`, `export-benchmark-kit.mjs`, `process/_seeds`, CONTRIBUTING + 5 translations | 6 (rename + migration fallbacks) | 6 |
| `program-goal-charter-template.md` (mirror pair under `process/development-protocols/references/` and `.claude/skills/vc-generate-phase-program/references/`) | 6 (rename only) | FROZEN in Phases 4 and 5 (neither edits either copy); join step runs `diff -q`/`cmp` on the pair (expected no output) |
| `.codex/agents/vb-*.toml` mirrors | 3 (content), 6 (rename), 7 (prose) | 3; Phase 1 does NOT claim `.codex/` (Codex toml has no model/effort fields) |
| `e2e-kit-flows.test.mjs` | 2 (comment/display name only), 6 (rename; keep-regions for Trial C seed block and `vc-team`-removed assertion), 8 (A0 BEFORE install tests: `fileURLToPath`, `os.tmpdir()` instead of `/tmp`, quoted forward-slash `bash` path) | 8 for the fix; 2 and 6 text only |
| `CONTRIBUTING.md` + `docs/i18n/CONTRIBUTING.{ja-JP,ko-KR,pt-BR,vi-VN,zh-CN}.md`, `.github/ISSUE_TEMPLATE/**` (incl. `1.bug_report.yml`), `.github/workflows/{welcome,release}.yml` | 2 (identity), 6 (rename) | 2; Phase 7 does NOT own the CONTRIBUTING translations' display name |
| `docs/QUICKSTART.md`, `docs/GLOSSARY.md`, `docs/i18n/README.vi-VN.md`, `docs/i18n/{QUICKSTART,GLOSSARY}.vi-VN.md`, `scripts/check-docs.mjs`, `scripts/fixtures/check-docs/**`, `harness/phase7-*` helpers, `process/general-plans/backlog/vi-native-review_NOTE_29-10-26.md` | 7 | 7 (Phase 7 edits `docs/i18n/README.*.md` after Phase 2 and the Phase 6 rename; strictly ordered) |
| `golden/**` (task folder): scripts (`size-check.mjs`, `signal-census.mjs`, `conservation-check.mjs`, `pointer-check.mjs`, `parity-compare.mjs`, `gen-guardrails.mjs`, `run-record.mjs`), snapshots, `signal-census-phase3.txt`, `guardrails.json`, `runs/`, `old/`, `phase1/`; plus new `.codex/agents/references/` and backlog stub `process/general-plans/backlog/codex-agent-references-load_NOTE_29-10-26.md` | 3 (author), 7 (reads `signal-census.mjs` + `signal-census-phase3.txt`) | 3 |
| `p4-tools/**` (incl. `claim.globs`, `baseline.sha`), `dedup-allowlist*.txt`, Phase 4 report / `p5-tools/**` (incl. `claim.globs`, `baseline.sha`), `proposed-new-skills.md`, Phase 5 report, backlog note `process/general-plans/backlog/vc-agent-browser-screenshots-untrack_NOTE_29-10-26.md` | 4 / 5 | 4 / 5 respectively (teammate branches `p4-docs-dedup` / `p5-skills-tune`) |
| `baseline/**` (task folder) | 0 (author); 1 adds `p1_start.txt` + one `validators.list` line; 2 adds `p2_start.txt` + `resolved_p2_start.<runtime>.txt`; all later phases read | 0 (Phase 6 never writes here) |
| `scripts/rename-prefix.mjs`, `scripts/test-rename-prefix.mjs`, `scripts/test-compute-sync-plan.mjs`, `.allowlist.txt`, `.path-allowlist.txt`, `scripts/fixtures/rename-prefix/**`, `legacy-hashes.json` and root `scripts/**` (manifest `kitOnly`, NOT `include`), hooks `legacy-config-fallback.test.cjs` in `.claude/hooks/lib/__tests__/` and `.codex/hooks/lib/__tests__/`, the 5 hook lib files per tree, `.gitignore`, `harness/` helpers and evidence pack (task folder) | 6 | 6 |
| `vc-manifest.json` readers (`install.sh`, `resolve-manifest.mjs`, `compute-sync-plan.mjs`, vb-update/vb-publish/vb-setup, `.gitignore`, `export-benchmark-kit.mjs`, `e2e-kit-flows.test.mjs`) | 2, 6, 8 | 6 (rename + fallbacks) |
| backlog stubs: native Windows, macOS, Linux-Node refusal | 8 | 8 |
| `harness/validators.vb.list`, `harness/compare-vb.sh`, `harness/runtime-map.txt`, `harness/signal-census-before.txt`, `harness/vc-colon-before.txt` (task folder, NOT protected `baseline/`) | 6 (author), 7, 8 (read) | 6 |
| `.agents/skills` | 0 (git mode 120000 via `update-index --cacheinfo`, text file in work tree) | 0 |

Verdict: no `reassign` needed. Phase 3 must not start while Phase 1 edits are uncommitted. Phase 1 no longer claims `.codex/` mirrors.

Planner's note (kept for reference): shared files are README.md (phases 1, 2, 6, 7), agent files (1, 3, 6, 7), `validate.yml` (1 only). These are safe because the phases are strictly ordered. Only phases 4 and 5 can overlap in time and their claims are disjoint in `phase-blast-radius-registry.md`.

---

## Autonomous Execution Rules (During /goal)

- The agent self-decides at V5 gates; CONDITIONAL proceeds with gaps on record; BLOCKED goes to backlog and continues where a path exists.
- Hard stops: push/remote tag/release/publish; any deletion of user content; billed model runs beyond the approved golden set; a red validator; cascade BLOCKED.
- User checkpoints that autonomy cannot skip: Phase 0 git identity email and interactive `vc-setup`; user acknowledgement of exact run/probe counts at Phase 3 A0 and Phase 4 0.5a.
- Phase reports are the communication channel for conflicts and learnings.
- Subagent delegation (no inline execution) stays mandatory under autonomy.

---

## Global Constraints

- Never lower or delete a validator check; only add.
- LICENSE guard (mandatory line of EVERY phase exit gate, carried by Phase 0 `baseline/compare.sh` so one place runs it after every phase): `grep -c "Copyright (c) 2026 vibecode" LICENSE` = 1 and `grep -c "Copyright (c) 2026 Tomwakeupat530amm" LICENSE` = 1. Proves C-SAFE-2 after each phase. Realization: Phases 0, 1, 2, 6, 7, 8 call `compare.sh`/`compare-vb.sh` in their exit-gate blocks and Phase 4 in its verification table; Phases 3 and 5 do not claim LICENSE and get the explicit `bash $B/compare.sh` line at their own PVL (residual R1); the goal-block TEST GATES apply the greps at every phase exit and the check is cumulative (the next `compare.sh` run catches any earlier damage).
- SWEEP RULE (canonical wording lives here; Phase 2 and Phase 6 implement it, see their gates): search the whole repo EXCLUDING `.git`, the program task folder `process/general-plans/active/vibebelt-rebrand_29-10-26/` (and its archived copy), `baseline/`, `golden/`, the rename script + its fixtures, `CHANGELOG.md` and `MIGRATION.md` (WHOLE-FILE protection: Phase 6 implements the history rule as a protected set, not as marker regions; in Phase 2 their old-identity lines are instead tagged `upstream-attribution`), and `legacyDeletions`. Old-identity lines that legitimately remain are only: (1) lines carrying the literal tag `upstream-attribution`; (2) the brand-detection lines in `.claude/skills/vc-audit-vc/scripts/validate-kit-portability.mjs`, `.claude/skills/vc-publish/SKILL.md` and `.claude/skills/vc-publish/references/vc-publish.md`. Phase 2 may additionally exclude the whole `process/` directory ONLY because at Phase 2 time `process/` holds no kit text beyond the task folder and Phase 0 generated context; its gate adds `grep -rIn "withkynam\|flowser" process --exclude-dir=vibebelt-rebrand_29-10-26` and expects no output.
- `.agents/skills` gate rule: the gate checks only that no failure OTHER than `.agents/skills` remains.
- `validate-all-context.mjs` is exit 0 in bare-kit mode BEFORE vc-setup (it is not a baseline red); after vc-setup it must still exit 0 with no `bare-kit mode` text (Phase 0 exit gate). The only expected baseline reds are `validate-skills` and `validate-context-discovery`, both caused by `.agents/skills`.
- After every phase that touches agent files, parity validator exits 0 before the phase is DONE.
- Vacuous-green ban: a developed behavior proven only by Known-Gap is never PASS; write a backlog stub and keep the gate CONDITIONAL.
- Test planning must load `process/context/tests/all-tests.md` (created by Phase 0 vc-setup) and its routing chain before assigning tiers; if it is empty or missing, emit `TIER_ASSIGNMENTS_BLOCKED` and return to RESEARCH.
- Commit each phase's execution changes before starting the next phase. Keep process/plan/context commits separate from execution commits.

---

## Durable Report Destinations

| Phase | Report path (inside task folder) |
|---|---|
| 0 | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-00-foundation_REPORT_29-10-26.md` |
| 1 | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-01-fix-inconsistencies_REPORT_29-10-26.md` |
| 2 | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-02-identity-distribution_REPORT_29-10-26.md` |
| 3 | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-03-slim-agents_REPORT_29-10-26.md` |
| 4 | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-04-doc-dedup_REPORT_29-10-26.md` |
| 5 | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-05-tune-skills_REPORT_29-10-26.md` |
| 6 | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-06-prefix-rename_REPORT_29-10-26.md` |
| 7 | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-07-vibecoder-docs_REPORT_29-10-26.md` |
| 8 | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-08-install-release_REPORT_29-10-26.md` |

---

## Program Status Table

| Phase | Status |
|---|---|
| 0 — Foundation | ⏳ PLANNED |
| 1 — Fix inconsistencies | ⏳ PLANNED |
| 2 — Identity and distribution | ⏳ PLANNED |
| 3 — Slim agents | ⏳ PLANNED |
| 4 — Doc de-duplication | ⏳ PLANNED |
| 5 — Tune skills | ⏳ PLANNED |
| 6 — Prefix rename | ⏳ PLANNED |
| 7 — Vibecoder docs | ⏳ PLANNED |
| 8 — Install test and release | ⏳ PLANNED |

Status values: ⏳ PLANNED | 🔨 CODE DONE | 🧪 TESTING | ✅ VERIFIED | 🚧 BLOCKED | ✅ COMPLETE

---

## Risk Predictions

| Risk | Likelihood | Mitigation |
|---|---|---|
| Slimming lowers answer quality (Phase 3) | Medium | golden baseline, one agent at a time, revert that agent only |
| Rename misses a computed `vc-` string (Phase 6) | Medium | dry-run review, fixtures, grep sweep, e2e test, Phase 8 real install |
| Updater deletes user-edited files | Low, severe | delete only unmodified kit-owned files; Hybrid test with modified file |
| Windows/macOS cannot be tested here | High | documented residual, user-run checklist, gate CONDITIONAL for those |
| Golden runs cost money/time | Medium | cap at 3 tasks, report run count before starting |
| Parity validator blocks the new `references/` location | Medium | decide location in Phase 3 RESEARCH; never relax the validator |
| Baseline already red (`.agents/skills` plain file, no Linux node) | High | red = worse than Phase 0 baseline; Phase 0 repairs `.agents/skills`; node.exe fallback; e2e recorded baseline-red / NOT TESTED with cause |
| Phase 1 model downgrade (opus to sonnet) is unmeasured | Medium | golden baseline from `upstream-baseline` tag covers it; compared after Phase 3 |
| Phase 4 breaks references from 44 skill files and 32 agent/codex files | Medium | stub-or-SendMessage rule, protocol-wiring before reporting, join step |
| Renamed agents not spawnable in the same session | Medium | restart checkpoint before Phase 7 |
| `resolve-manifest.mjs` returns no files after version bump to 1.0.0 | Medium | manifest-shape detection in Phase 2 with `files.length > 0` gate |

---

## Touchpoints

- Phase 0: git, LICENSE, process/context/**; Phase 1: agent front-matter, new validator, README/i18n counts, CI
- Phase 2: install/update/publish scripts, community docs, README header, assets, manifest/CHANGELOG
- Phase 3: agent prompts + references + Codex mirrors; Phase 4: CLAUDE.md, AGENTS.md, protocols
- Phase 5: skill front-matters, catalog; Phase 6: whole kit via one script
- Phase 7: README top, quickstart, glossary, message wording; Phase 8: temp sandboxes, release docs, tag

---

## Public Contracts

- RIPER-5 workflow, phase locks, status codes and every signal string unchanged.
- Installer behavior and manifest schema unchanged (only source repo, version, and renamed paths change).
- Names change deliberately once: `vc-` to `vb-`, with upgrade cleanup.

---

## Blast Radius

Program-level: essentially the whole kit repository. Per-phase claims live in `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-blast-radius-registry.md` (phases 4 and 5 are provably disjoint).

---

## Verification Evidence

| Gate / Scenario | Strategy | Proves SPEC criterion |
|---|---|---|
| Per-phase Exit Gate command blocks (each phase plan) | Fully-Automated | C-P0..C-P8 |
| Full validator suite vs Phase 0 baseline after every phase | Fully-Automated | all (regression checkpoint) |
| Golden-baseline rubric comparison (Phase 3) | Agent-Probe | C-P3 |
| Non-coder README walkthrough (Phase 7) | Agent-Probe | C-P7 |
| Install matrix + updater safety (Phase 8, Phase 6 B1) | Hybrid | C-P8, C-SAFE-1 |
| macOS and native Windows installs | Known gap (named residual); backlog stub = user-run checklist; gate CONDITIONAL | C-P8 residual |
| Phase 8 user-run known-gap list (6 items): (1) Linux Node 22 install + `node --test e2e-kit-flows.test.mjs`; (2) GitHub private vulnerability reporting, Discussions and Sponsorship settings; (3) real symlink `.agents/skills` on ubuntu CI; (4) exec bits on Windows-native checkouts; (5) re-run the Phase 2 resolver check (R2.5) under Linux Node 22; (6) check that `.agents/skills` has git mode 120000 on a real Linux checkout | Known gap (named residuals); one backlog stub each; gates CONDITIONAL | C-P8 residual |
| `install.sh` overwrites managed `process/development-protocols/**` and `process/_seeds/**` files without backup, and skips an existing `.claude/settings.json` (kit hooks are not registered there) | Known gap (named residual, documented in the Phase 8 release notes); backlog candidates (backup extension, JSON merge of settings) are NOT in scope for v1.0.0 | C-P8 residual |

```bash
node .claude/skills/vc-generate-phase-program/scripts/validate-umbrella-artifact.mjs process/general-plans/active/vibebelt-rebrand_29-10-26/vibebelt-rebrand-umbrella_PLAN_29-10-26.md
node .claude/skills/vc-generate-phase-program/scripts/validate-phase-stub.mjs process/general-plans/active/vibebelt-rebrand_29-10-26/phase-00-foundation_PLAN_29-10-26.md
# Expected: exit 0 (a "not under process/features" warning is expected for general-plans)
```

---

## Test Infra Improvement Notes

- `process/context/tests/all-tests.md` does not exist until Phase 0 runs vc-setup; each phase's test-tier assignment must load it (or report it empty) before assigning tiers.
- Linux Node 22 in WSL is a USER action; Phase 0 notes give the exact commands (never auto-installed). Without it, node.exe runs validators; `e2e-kit-flows.test.mjs` also fails under Windows node (`new URL(import.meta.url).pathname` gives `C:\C:\...`), so e2e / WSL install gates are baseline-red / NOT TESTED with cause until fixed (fix: `fileURLToPath`, OWNED BY PHASE 8 and applied before any install test; Phase 2 and Phase 6 touch that file for text only).
- `vc-setup` is interactive (cycle 2, decision 2): Phase 0 E0 treats the user's presence as a checkpoint (returns `NEEDS_CONTEXT`, the orchestrator asks the user); seed-based context from `process/_seeds/context/` is the fallback when the user is absent. The validator baseline is saved both before and after it. `validate-all-context.mjs` is exit 0 in bare-kit mode before vc-setup and must stay 0 after (no `bare-kit mode` text).
- No CI exists for Windows/macOS: candidate backlog item after v1.0.0 (a GitHub Actions matrix install test).

---

## Resume and Execution Handoff

- Selected plan file path: `process/general-plans/active/vibebelt-rebrand_29-10-26/vibebelt-rebrand-umbrella_PLAN_29-10-26.md`
- Last completed phase: planning (this umbrella and 9 phase plans written)
- Validate-contract status: written (2026-10-29), Gate: PASS (PVL cycle 3, umbrella scope; N1-N6 and contradictions C1-C8 verified closed; residuals R1-R4 listed as Known Gaps). Each phase still needs its own PVL before its EXECUTE
- Supporting context files: phase-blast-radius-registry.md, CLAUDE.md, `process/development-protocols/phase-programs.md`
- Next step for a fresh agent: the orchestrator emits the /goal block (the Stable Program Goal above), then spawns vc-research-agent (sonnet) for Phase 0 (RESEARCH, step 1 of the 7-step loop). Phase 0 PVL (step 4) happens inside the Phase 0 loop.
- Current phase: Phase 0 — Foundation
- Next action: "Spawn vc-research-agent (sonnet) for Phase 0"

---

## Current Execution State

Last updated: 29-10-26
Completed phases: none (planning artifacts written)
Current phase: Phase 0 of 9 (Foundation)
Current loop step: RESEARCH (umbrella PVL cycle 3 = Gate: PASS; Phase 0 RESEARCH is next)
Validate-contract status: written (2026-10-29), Gate: PASS (umbrella scope, PVL cycle 3; phase plans validated per phase)
Program Net Gate: PASS at umbrella level; C-P8r (native Windows / macOS) stays CONDITIONAL inside Phase 8
Latest validator run: not yet run (Phase 0 saves the baseline; known baseline-red: validate-skills and validate-context-discovery because `.agents/skills` is a plain file; validate-all-context is exit 0 in bare-kit mode before vc-setup)

Loop step values: RESEARCH | INNOVATE | PLAN-SUPPLEMENT | PVL | EXECUTE | EVL | UPDATE-PROCESS
Orchestrator rule: read "Current loop step" and "Validate-contract status" before spawning any subagent. Never spawn execute-agent when loop step is RESEARCH, INNOVATE, PLAN-SUPPLEMENT, or PVL.

Note: the Stable Program Goal above is fixed. This section is the only part that changes — update-process-agent rewrites it after every phase closeout (overwrite, not append).

---

## Validate Contract

Status: PASS
Date: 29-10-26
date: 2026-10-29
generated-by: outer-pvl
supersedes: 2026-10-29 (outer-pvl, PVL cycle 2 CONDITIONAL with concerns N1-N6) - PVL cycle 3 re-ran V1-V7 from the real repo after supplement cycles 2, 2b and 2c and has current evidence
Scope: UMBRELLA plan only (registry, `results.tsv` and the 9 phase plans were read to cross-check umbrella claims; no phase plan and no registry file edited; each phase plan still needs its own PVL pass before that phase's EXECUTE)

Parallel strategy: sequential (read-only re-validation by one agent; Layer 1 and Layer 2 run in-line, this agent has no spawn tool)
Rationale: score 4/7 (S1 multi-area, S4 phase program, S6 installer/runtime surface, S7 many files); dominant signal S4. The work was targeted file and command evidence, so no fan-out was needed. Next step is a per-phase PVL (agent team, one validator per phase plan, disjoint plan files).

Evidence base re-checked in this pass (WSL, `node.exe` only; Linux node absent): `.agents/skills` is 17 bytes (`../.claude/skills`); `validate-agent-parity` exit 0; `validate-protocol-wiring` exit 0; `validate-umbrella-artifact` 0 failures; `validate-plan-artifact` 0 failures (1 advisory warning about the word VERIFIED); Stable Program Goal 3671 characters (limit 4000) with SESSION GOAL, TARGET, AUTONOMY, PER-PHASE LOOP, HARD STOPS, SAFETY, TEST GATES, VALIDATE CONTRACT, START (the 7 required sections in the required order, plus the extra AUTONOMY block); no `.git` yet (Phase 0 creates it); LICENSE line 3 is exactly `Copyright (c) 2026 vibecode`; 33 skills, 15 agents, 9 `docs/i18n/README.*.md`, manifest version 3.2.5, `resolve-manifest.mjs` line 68 still `semverGte(version,"2.1.0")`; 27 files carry `withkynam|flowser` outside the task folder and every one is in a registry Phase 2 group or is a brand-detection line matched by the Phase 2 R2.1 `-e` patterns (checked line by line for the three brand-detection files); `process/` outside the task folder holds zero old-identity text; `results.tsv` has 4 lines (header, baseline, cycle 1, cycle 2); no registry entry carries `status: BLOCKED`.

Closure check of the prior concern list (verified against the phase plans on disk, not against earlier verdicts):

| Item | Status | Evidence |
|---|---|---|
| N1 sweep rule wording | CLOSED | Canonical SWEEP RULE in Charter DoD 3 and Global Constraints; Phase 2 B0b and Phase 6 line 53 copy it verbatim; Phase 2 adds the `grep ... process --exclude-dir=vibebelt-rebrand_29-10-26` gate; brand-detection lines named by file and match the R2.1 patterns |
| N2 LICENSE guard every phase | CLOSED at umbrella and Phase 0; wiring gap in phases 3, 4 (exit block) and 5 recorded as RESIDUAL R1 | Phase 0 B3 now has the LICENSE RULE (both greps + original-line check, non-zero exit on miss) and the own-directory LOOKUP RULE; Phases 1, 2, 6, 7, 8 call `compare.sh` or `compare-vb.sh` (which runs it) in their exit gates; the goal-block TEST GATES apply the greps at every phase exit |
| N3 strategy rows | CLOSED | rows 1, 2, 7 rewritten; phase plans declared authoritative |
| N4 charter-template mirror check and Phase 5 front-matter ownership | CLOSED | `diff -q`/`cmp` is in the join step; Phase 4 D2 and Phase 5 C2 and exit gate carry `cmp`; ownership rows list Phase 5 front-matter-only |
| N5 restart hard stop | CLOSED | goal block HARD STOPS has "after Phase 6 rename commit: stop, ask user to restart Claude Code" |
| N6 state sync | CLOSED in this pass | Resume handoff and Current Execution State rewritten to the cycle-3 result |
| C1 Phase 0 B3 LICENSE greps | CLOSED | Phase 0 B3 rule (5) LICENSE RULE; Phase 6 G13/G13b and Phase 8 exit gate state that `compare-vb.sh` runs it |
| C2 `compare.sh` own-directory lookup / Phase 6 wrapper | CLOSED | Phase 0 B3 LOOKUP RULE (`D="$(cd "$(dirname "$0")" && pwd)"`, lookups before `cd` to repo root); Phase 6 C3b copies `baseline/.` and swaps the list |
| C3 sweep wording in phases | CLOSED | verbatim copies in Phase 2 B0b and Phase 6; mechanisms differ on purpose (Phase 2 tags lines, Phase 6 protects files) and the umbrella text states both |
| C4 single `## [1.0.0]` CHANGELOG entry | CLOSED | Phase 2 C2 creates it (gate `grep -c '^## \[1.0.0\]' CHANGELOG.md` = 1); Phase 8 C1 extends it and repeats the gate |
| C5 Phase 8 user-run list | CLOSED | Phase 8 lists the 6 user-run items; backup-extension is "backlog candidate, out of scope" |
| C6 charter-template frozen pair | CLOSED | Phase 4 and Phase 5 freeze both copies; umbrella and registry agree |
| C7 `author: vibecode-pro-max-kit` metadata | CLOSED | Phase 2 hands it to Phase 6; Phase 6 line 55 adds an explicit rename rule; the `.claude/skills/vc-*` rename set covers the files |
| C8 MIGRATION banner link dead until Phase 8 | ACCEPTED residual R4 | Phase 6 B6 banner points at a file Phase 8 creates |
| decision (d) manifest-shape glob | VERIFIED NEEDED | `resolve-manifest.mjs` line 68 would resolve zero files at version 1.0.0; Phase 2 gate R2.5 and the Phase 6 B0 fallback and Phase 8 precondition cover it |

Defects found in the UMBRELLA text during this pass and FIXED in place (none remain; count 5):
- U1 C-P3q proving text still said slimmed agents are judged against the `upstream-baseline` tag; locked decision 5 and Phase 3 B4 judge the revert decision against `golden/phase1/` (same models, unslimmed) and only report `golden/old/`. Corrected below.
- U2 C-P4 proving command `grep -rn "superseded" process/development-protocols | wc -l` = 0 cannot pass: the real tree has 6 hits (the `SUPERSEDED` registry status value is legitimate vocabulary). The Phase 4 plan already replaced it with a line-anchored allowlist diff over `superseded|compatibility note|legacy`. Contract row, Phase Ordering row and Exit Gate row corrected to name the allowlist diff.
- U3 C-P8r, the legacy line for Phase 8 and Open gaps said "4 user-run items"; the program has 6 (Phase 8 plan agrees). Corrected.
- U4 Resume handoff, Current Execution State and the contract itself still said "PVL cycle 3 pending after supplement cycles 2 and 2b" and listed N1-N6 as open. Rewritten.
- U5 Global Constraints LICENSE guard claimed the greps are "a mandatory line of EVERY phase exit gate"; phases 3, 4 (exit block) and 5 do not call `compare.sh`. Wording now states the real mechanism and the carry-forward (R1).

Test gates (C3 5-column table):

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P0 | git history, `upstream-baseline` tag, baseline saved before and after `vc-setup`, `.agents/skills` recorded as mode 120000 in the index, `all-context.md` + `all-tests.md`, both LICENSE lines | Fully-Automated | Phase 0 Exit Gate block (`git rev-parse`, `git tag -l upstream-baseline`, `bash $B/compare.sh before` and `bash $B/compare.sh` exit 0, `test -f process/context/all-context.md`, `git ls-files -s .agents/skills \| cut -c1-6` = 120000, `grep -c '^Copyright (c) 2026 vibecode$' LICENSE` = 1, `grep -c '^Copyright (c) 2026 Tomwakeupat530amm$' LICENSE` = 1, `git diff upstream-baseline -- LICENSE \| grep -c '^-[^-]'` = 0) | B (built by Phase 0) |
| C-P1 | model/effort policy validator fails on drift and passes on correct agents | Fully-Automated | `node .claude/skills/vc-audit-vc/scripts/validate-model-effort-policy.mjs` (created by Phase 1) on `fixtures/model-effort-pass` (exit 0), `fixtures/model-effort-fail` (non-zero), then on the real agents (exit 0) | B |
| C-P1b | CI runs every validator on disk; README says one validator count | Fully-Automated | listing diff of validator scripts on disk vs `.github/workflows/validate.yml`; `grep -rn "3[6-8] validators" README.md docs/i18n \| sort -u` = one number; `bash $B/compare.sh` exit 0 | B |
| C-P2 | no old identity outside tagged attribution and brand-detection lines, no hotlinked images, version 1.0.0, resolver returns files | Fully-Automated | Phase 2 gates R2.1-R2.11 (`grep` pipeline with the `process/` companion grep, `grep -rIn "tenor\|skillicons" README.md docs`, `resolve-manifest --json` `files.length > 0`, `grep -c '^## \[1.0.0\]' CHANGELOG.md` = 1) | B |
| C-P3 | agents at least 25 percent smaller, signal strings intact, parity green | Fully-Automated | `golden/size-check.mjs`, `golden/signal-census.mjs`, `golden/conservation-check.mjs`, `golden/pointer-check.mjs`, `golden/parity-compare.mjs` (created by Phase 3), `validate-agent-parity.mjs`, `validate-agent-frontmatter.mjs`, `validate-protocol-wiring.mjs` | B |
| C-P3q | slimmed agents answer equal or better than the same-model unslimmed agents | Agent-Probe | blind pairwise judge per `golden/judge.md`, 2 replicates; revert decision against `golden/phase1/`; `golden/old/` (original models from the `upstream-baseline` tag) is reported only as the Phase 1 model-change measurement | B |
| C-P4 | one source for shared docs, wiring intact, no unjustified leftovers | Fully-Automated | `validate-protocol-wiring.mjs`; `validate-guide-sync.mjs`; `validate-agent-parity.mjs`; line-anchored sorted allowlist diff over `superseded\|compatibility note\|legacy` (`diff $T/p4-tools/leftovers-now.txt $T/p4-tools/allow-sorted.txt` empty); Phase 4 `p4-tools` pointer and signal census checks; `bash $B/compare.sh` | B |
| C-P5 | 33 skills kept, trigger routing reaches each skill, catalog fresh at the join | Fully-Automated + Hybrid | `ls -d .claude/skills/*/ \| wc -l` (=33); `validate-skills.mjs` (not worse than baseline); `.claude/skills/vc-audit-context/scripts/validate-skill-routing.mjs`, `validate-confusable-skills.mjs`, `validate-skill-keywords.mjs`, `validate-skill-cross-refs.mjs` (after the join); join step by spawned agents: `generate-skills-catalog.mjs --write` (vc-execute-agent), then `--check`, `cmp` of the charter-template pair, joint validator suite (vc-tester) | B |
| C-P6 | rename script idempotent and dry-run capable; no stray `vc-`; upgrader keeps user-edited files and state files | Fully-Automated + Hybrid | Phase 6 Exit Gate (`scripts/rename-prefix.mjs --dry-run` = 0 edits, allowlist diffs G5/G7 empty, `vb-manifest.json` only, uppercase-signal census diff, `bash $H/compare-vb.sh` exit 0 incl. LICENSE greps); Hybrid: `compute-sync-plan.mjs` against a tree with a modified legacy file and old state files | B |
| C-P7 | non-coder can install from README alone; EN and VI synced; 8 outdated banners | Fully-Automated + Agent-Probe | `test -f docs/QUICKSTART.md`; `scripts/check-docs.mjs` (created by Phase 7); `validate-guide-sync.mjs`; `grep -c "may be outdated" docs/i18n/README.*.md`; `bash $H/compare-vb.sh`; fresh-agent walkthrough recorded in the report | B |
| C-P8 | clean install and update on WSL/Linux; local tag `v1.0.0` | Hybrid | `node e2e-kit-flows.test.mjs` (after the Phase 8 A0 path fix; Linux Node is a user action); install matrix (fresh + existing project); `git tag -l v1.0.0`; `git status --porcelain` empty | B |
| C-P8r | install on native Windows and macOS; 6 user-run items | Hybrid | user-run command list in the Phase 8 report and release notes (NOT run here, LOCKED Q6) | D (backlog stubs written by Phase 8; gate stays CONDITIONAL) |
| C-SAFE-1 | updater never deletes user-modified files | Hybrid | Phase 6 B1 + Phase 8 B1 fixture with a modified legacy file | B |
| C-SAFE-2 | MIT notice and original copyright kept in every phase | Fully-Automated | the Phase 0 `baseline/compare.sh` LICENSE RULE (both greps + `git diff upstream-baseline -- LICENSE \| grep -c '^-[^-]'` = 0), called by the exit gates of Phases 0, 1, 2, 4 (verification), 6, 7, 8 and applied at every phase exit by the goal-block TEST GATES; Phases 3 and 5 do not claim LICENSE | A for Phases 0-2, 4, 6-8; C for the explicit exit-gate line of Phases 3 and 5 (R1, carried to each phase's own PVL) |

Failing stubs (Fully-Automated rows; TDD red-first starting points for EXECUTE):

Failing stub (C-P0):
test("should have git history, upstream-baseline tag, baseline file, all-context.md and both LICENSE lines", () => { throw new Error("NOT IMPLEMENTED - TDD stub: Phase 0 exit gate") })

Failing stub (C-P1):
test("should fail the model-effort policy validator on the drift fixture and pass on the pass fixture", () => { throw new Error("NOT IMPLEMENTED - TDD stub: model/effort policy validator") })

Failing stub (C-P1b):
test("should reference every validator script on disk in validate.yml and show one validator count", () => { throw new Error("NOT IMPLEMENTED - TDD stub: CI coverage + count") })

Failing stub (C-P2):
test("should find no withkynam/flowser outside attribution and no hotlinked images; version is 1.0.0", () => { throw new Error("NOT IMPLEMENTED - TDD stub: identity sweep") })

Failing stub (C-P3):
test("should shrink agent prompts with identical signal-string census and green parity", () => { throw new Error("NOT IMPLEMENTED - TDD stub: slim agents") })

Failing stub (C-P4):
test("should keep protocol-wiring, guide-sync and agent-parity green with only allowlisted leftovers", () => { throw new Error("NOT IMPLEMENTED - TDD stub: doc dedup") })

Failing stub (C-P5):
test("should keep 33 skills with green skills/routing/confusable validators", () => { throw new Error("NOT IMPLEMENTED - TDD stub: tune skills") })

Failing stub (C-P6):
test("should rename vc- to vb- idempotently with a no-op second apply", () => { throw new Error("NOT IMPLEMENTED - TDD stub: rename script") })

Failing stub (C-P7):
test("should have QUICKSTART, GLOSSARY, synced EN/VI README and 8 outdated banners", () => { throw new Error("NOT IMPLEMENTED - TDD stub: vibecoder docs") })

Failing stub (C-SAFE-2):
test("should keep the original MIT notice and the vibecode copyright line in every phase", () => { throw new Error("NOT IMPLEMENTED - TDD stub: license guard") })

Legacy line form (retained so existing validate-contract consumers still parse):
- Phase 0: [Fully-automated: git/LICENSE/context greps, compare.sh] | [hybrid: vc-setup run interactively with the user, seed fallback] | [agent-probe: none] | [known-gap: Linux Node 22 in WSL is a user action]
- Phase 1: [Fully-automated: new policy validator + fixtures, parity, frontmatter, compare.sh] | [hybrid: none] | [agent-probe: none] | [known-gap: none]
- Phase 2: [Fully-automated: identity/image greps, version, portability validator, resolver files.length, compare.sh] | [hybrid: e2e where runnable] | [agent-probe: none] | [known-gap: none]
- Phase 3: [Fully-automated: size, census, parity] | [hybrid: golden runs need model access and a cost acknowledgement] | [agent-probe: golden rubric compare] | [known-gap: none; explicit compare.sh line is R1]
- Phase 4: [Fully-automated: wiring, guide-sync, parity, leftovers allowlist diff, compare.sh] | [hybrid: probe calls after cost acknowledgement] | [agent-probe: cold read] | [known-gap: none]
- Phase 5: [Fully-automated: skill count, 4 skill validators, catalog join] | [hybrid: routing phrase run] | [agent-probe: agent-browser report] | [known-gap: none; explicit compare.sh line is R1]
- Phase 6: [Fully-automated: fixture test, idempotence, allowlist diff, validators via compare-vb.sh] | [hybrid: updater with modified file and old state files; e2e needs Linux node] | [agent-probe: none] | [known-gap: computed vc- strings (backlog if found)]
- Phase 7: [Fully-automated: file presence, banners, guide-sync, census, compare-vb.sh] | [hybrid: none] | [agent-probe: non-coder walkthrough] | [known-gap: VI native review]
- Phase 8: [Fully-automated: e2e, validators, tag] | [hybrid: WSL/Linux install matrix] | [agent-probe: none] | [known-gap: native Windows and macOS, 6 user-run items: documented checklist]

Dimension findings:
- Infra fit: PASS - baseline reds reproduced earlier and re-checked (`.agents/skills` 17-byte text file; parity 0, protocol-wiring 0 under `node.exe`); "red" means worse than the Phase 0 baseline; every script path named in a gate exists now or is created by a named earlier phase (validate-model-effort-policy Phase 1; `golden/*` Phase 3; `p4-tools`, `p5-tools` Phases 4-5; `scripts/rename-prefix.mjs` Phase 6; `scripts/check-docs.mjs` Phase 7; `baseline/*` Phase 0); `compare.sh` is cwd-independent and own-directory based (Phase 0 B3)
- Test coverage: PASS (with RESIDUAL R1) - no vacuous green: every developed behavior has a Fully-Automated, Hybrid or Agent-Probe gate; Known-Gap rows are named residuals with backlog stubs; the unsatisfiable C-P4 `superseded == 0` gate was replaced by the allowlist diff; R1 is a wiring-only residual (the LICENSE greps are enforced cumulatively at the next `compare.sh` run and by the goal-block TEST GATES)
- Breaking changes: PASS - Q4/(e) cover the four old state names, the uppercase signals and env vars with read-old-write-new fallbacks and a Phase 6 fixture; resolver bug owned by Phase 2 with a `files.length > 0` gate and repeated as a Phase 6/8 precondition; Phase 4 cannot delete cited protocol files or headings without a stub or SendMessage
- Security surface: PASS - original MIT notice protected (Phase 0 D1 add-only, diff against the tag shows 0 removed lines, only Phase 0 claims LICENSE, guarded after every phase by `compare.sh`); SECURITY uses the GitHub advisory URL, no invented email; push, remote tag, GitHub release and `gh release create` are Phase 8 HARD STOPS C2b/C2c (each push needs its own go, re-push needs a fresh go) and are in the goal block; `release.yml` fires on a pushed `v*` tag with `contents: write`, which is why the tag push stays behind hard stop 2; golden runs and probe calls need a user cost acknowledgement; Linux Node install is a user action; quick STRIDE scan only (vc-security not spawned)
- Section: charter completeness: PASS - north star, 7-item DoD, "verified" meaning, tier map, out-of-scope tier, hard constraints; `validate-umbrella-artifact.mjs` 0 failures
- Section: locked decisions consistency: PASS - Q1-Q7, (a)-(f), Gap 5, Gap 7 and cycle-2 decisions 1-8 agree with phases 0, 1, 2, 3, 6, 8 and with `implementation-standards.md` (`effort: max` for opus execution agents)
- Section: Stable Program Goal: PASS - 3671 characters, the 7 required sections in order (plus AUTONOMY), agent-team machinery named (TeamCreate, TaskCreate, SendMessage, TaskList), EXECUTE=opus rule, hard stops include push/remote tag/release/publish, user-content deletion, billed runs, worse-than-baseline validator, cascade BLOCKED, Node install, the Phase 0 / Phase 3 / Phase 4 user checkpoints and the Phase 6 restart; TEST GATES lists 10 validators with full paths plus the LICENSE greps
- Section: blast-radius overlaps (phases 4 and 5): PASS - disjoint registry claims, own worktree and branch each, stub-or-SendMessage rule, charter-template pair frozen with `cmp` at the join, join sequenced by the orchestrator and RUN by spawned agents; minor residual R3 (worktree cleanup unspecified)
- Section: registry vs phase claims: PASS with residual R2 - machine-readable `claim.globs` and the phase plans agree with the registry on every multi-phase file and on all 27 old-identity files; three prose notes in the registry are stale (Phase 0 "OPEN C1", Phase 2 "no phase plan claims" the `author:` metadata, Phase 8 C4 wording); registry carries no `status: BLOCKED`
- Section: file-ownership table (Pre-PVL Conflict Resolution): PASS - includes Phase 5 front-matter-only rows, the e2e file (2/6/8), CHANGELOG/MIGRATION whole-file protection, `.agents/skills` (Phase 0 only), `harness/` vs `baseline/`
- Section: Strategy Recommendation per Phase: PASS - rows 1, 2, 7 match the phase plans, phase plans declared authoritative, agent-team named with full machinery for Phases 4+5, model rule stated
- Section: phase ordering/dependencies: PASS - strict 0..8, Phase 5 after Phase 3, Phase 6 after 4+5, no backward dependency, join step defined, restart checkpoint defined
- Section: state sync: PASS - Resume handoff and Current Execution State rewritten in this pass

Open gaps: none MUST-FIX. RESIDUAL gaps (named, bounded, accepted as Known Gaps; counts: MUST-FIX 0, RESIDUAL 4 plan-text residuals R1-R4 plus the program-level residuals below):
- R1 explicit `compare.sh` / LICENSE line missing from the exit-gate blocks of Phases 3, 4 and 5: known-gap: documented as NEW PLAN REQUIRED - carry to each of those phases' own PVL (one line `bash $B/compare.sh; echo $?` = 0); backstop is the next phase's `compare.sh` run plus the goal-block TEST GATES; those phases do not claim LICENSE
- R2 stale prose notes in `phase-blast-radius-registry.md` (Phase 0 "OPEN C1", Phase 2 C7 "no phase plan claims it", Phase 8 C4/backup-stub wording): known-gap: documented as NEW PLAN REQUIRED - refresh at the next UPDATE PROCESS or any registry rewrite; the `claim.globs` and phase plans govern
- R3 Phase 4/5 worktrees (`../vibebelt-p5` etc.) have no removal step after the join: known-gap: documented as NEW PLAN REQUIRED - add `git worktree remove` for both worktrees to the join step in Phase 4 D2 / Phase 5 C2 at their PVL (non-destructive; branches are local)
- R4 MIGRATION.md pointer banner (Phase 6 B6) links to `docs/RELEASE-NOTES-1.0.0.md`, which exists only after Phase 8: accepted
- Program-level residuals (named Known-Gaps, backlog stubs written in Phase 8, gate C-P8r stays CONDITIONAL): native Windows and macOS installs; the 6 Phase 8 user-run items (Linux Node 22 + e2e, GitHub private vulnerability reporting/Discussions/Sponsorship settings, real symlink `.agents/skills` on ubuntu CI, exec bits on Windows-native checkouts, Phase 2 resolver check R2.5 under Linux Node 22, `.agents/skills` git mode 120000 on a real Linux checkout); `install.sh` overwrites managed `process/development-protocols/**` and `process/_seeds/**` without backup and skips an existing `.claude/settings.json` (documented in the release notes, out of scope for 1.0.0)
- Scope reminder: the 9 phase plans carry their own earlier contracts (cycle 2 pre-fix counts: Phase 2 3F/2C and Phase 0 1F/4C were the only plans with FAILs before the cycle-2c fixes); each phase needs its own PVL pass before that phase's EXECUTE. This umbrella contract does not authorize EXECUTE of any phase.

## Known Gaps (Resolved via Backlog)

- R1: known-gap: documented as NEW PLAN REQUIRED - see Phase 3/4/5 own PVL (carry-forward line, above)
- R2: known-gap: documented as NEW PLAN REQUIRED - registry prose refresh (above)
- R3: known-gap: documented as NEW PLAN REQUIRED - worktree cleanup in join step (above)
- R4: accepted residual (banner link)
- Native Windows / macOS / 6 user-run items: known-gap: documented as NEW PLAN REQUIRED - Phase 8 writes one backlog stub each (`process/general-plans/backlog/`)

What this coverage does NOT prove:
- C-P0/C-SAFE-2 greps do not prove the LICENSE text is legally correct, only that the two copyright lines exist, the MIT body is unchanged versus the tag, and the original line sits above the added one.
- C-P1 does not prove the chosen model/effort table is best; it proves files match the documented table. The sonnet downgrade of research/plan/validate/tester is measured only by the Phase 3 golden compare (about 3 sample tasks).
- C-P2 greps do not prove every upstream mention is gone from binary files; the tagged-line mechanism relies on a literal tag.
- C-P3 size/census gates do not prove answer quality; only the golden Agent-Probe does, and only for the sample tasks.
- C-P4/C-P5 validators do not prove an agent finds each rule in one place, or that every real user phrase still routes to the right skill.
- C-P6 fixture test does not prove computed (string-built) `vc-` references are renamed; the allowlist diff and the Phase 8 real install are the only backstops.
- C-P7 agent walkthrough does not prove a real non-coder succeeds; Vietnamese wording has no native review.
- C-P8 WSL/Linux installs do not prove native Windows, Git Bash or macOS behavior, nor the real GitHub raw download path.
- Nothing here proves behavior of Claude Code or Codex loading renamed agents and skills in a live session beyond what Phase 8 exercises.
- This contract validates the umbrella text and its cross-claims; it does not prove that the gate commands inside each phase plan run green (that is each phase's PVL and EVL).

Gate: PASS (0 FAILs; MUST-FIX 0; RESIDUAL 4 plan-text items R1-R4, all listed as Known Gaps with no effect on the net gate; 5 umbrella-text defects found and fixed in this pass; prior concerns N1-N6 and contradictions C1-C8 verified closed; PVL cycle 3)
Accepted by: not required for PASS. RESIDUALs R1-R4 and the program-level residuals are recorded as Known Gaps by name; C-P8r keeps its own CONDITIONAL status inside Phase 8. EXECUTE of Phase 0 additionally requires Phase 0's own PVL contract to be PASS.

Autonomous Goal Block: not written - BRANCH B (this umbrella contains `## Stable Program Goal`; its /goal governs).

## Supplement cycle 1

Date: 29-10-26 (PVL-supplement, umbrella only; the validate-contract above is kept unchanged)

| Gap | Addressed in umbrella | Phase-plan follow-up (other agents) |
|---|---|---|
| 1 | Red = worse than Phase 0 baseline (Locked Decisions, charter, Stable Program Goal); TEST GATES now lists the full suite; goal block re-counted under 4000 chars; `.agents/skills` repair owned by Phase 0 | Phase 0: repair step, baseline before + after vc-setup |
| 2 | Q5 reworded to `max` per implementation-standards.md; Phase 1 report must state token-cost impact | Phase 1: use `max`, state token cost |
| 3 | Ownership table + registry extended with i18n README x9, MIGRATION.md, GOOD-FIRST-ISSUES, GITHUB-*.md, vc-setup | Phase 2: widen claim, name group owners |
| 4 | One sweep rule (DoD item 3, Locked Decisions, gates) | Phases 2 and 6: reuse the wording |
| 5 | Q4 extended to the three state files + fallbacks and migration | Phase 6: upgrader fixture in B1 |
| 6 | Join Conditions: stub/SendMessage rule, join step, Phase 5 handoff text | Phase 4, Phase 5 handoff text |
| 7 | Golden baseline from `upstream-baseline` tag; numeric 25% size floor | Phase 3 A2 |
| 8 | Node/e2e/vc-setup notes, Phase 0 gate adds second LICENSE grep | Phase 0 |
| 9 | Filename `README.vi-VN.md` in ownership table and registry | Phase 7 claim |
| decision d | Locked row; Phase 2 gate; Phase 6/8 precondition | Phase 2, 6, 8 |

Unresolved: none at umbrella level. Phase-plan edits are owned by parallel agents and not verified here.

## Supplement cycle 1b

Date: 29-10-26 (PVL-supplement, registry + umbrella only; phase plans read, not edited)

Applied: Q5 wording confirmed as `max`; Locked Decisions rows for Phase 3 per-agent commits and for the four uppercase signals / `VC_*` env vars renamed (not residuals); Join Conditions: restart checkpoint wording (Phase 6 stops, restart, Phase 6 EVL/UP + Phase 7 in new session), Phase 3 `golden/signal-census*` hard dependency of Phase 7, Phase 0 baseline-kit ownership, Phase 4/5 task-folder tool ownership; Entry/Exit table updated for Phases 3, 7, 8; ownership table gained 9 rows (e2e test, CONTRIBUTING, Phase 7 files, golden, p4/p5 tools, baseline, rename script files, manifest readers, Phase 8 stubs); Phase 8 four user-run known-gaps; registry rewritten to match every phase plan.

Open contradictions / path errors found in phase plans (not edited here):
1. Phase 8 plan does not contain the `e2e-kit-flows.test.mjs` `.pathname` -> `fileURLToPath` fix (line 21 of that file); umbrella assigns it to Phase 8. Phase 8 supplement must add it before the install tests.
2. Phase 5 gate uses `.claude/skills/vc-audit-vc/scripts/validate-skill-keywords.mjs` and `validate-skill-cross-refs.mjs`; the real location is `.claude/skills/vc-audit-context/scripts/`.
3. Phase 8 Entry Gate P1 says "Phase 6 resolver fix landed"; the umbrella assigns the resolver fix to Phase 2 (Phase 6 B0 is only a fallback). Wording should say "Phase 2 (or Phase 6 B0)".
4. Phase 7 hard-depends on `golden/signal-census*`; Phase 3 plan does not state that it must keep them for Phase 7 (it only authors them).
5. Phase 3 claims `.codex/` mirrors (content) while Phase 6/7 also edit them; consistent with the ownership table, no action.
6. Phase 0 `validators.list` has no script paths in its plan text (names only); when it is written it must use `.claude/skills/vc-audit-vc/scripts/` for parity, skills, kit-portability, guide-sync, protocol-wiring, skill-invocation-wiring, agent-frontmatter; `vc-audit-context/scripts/` for context-discovery; `vc-audit-plans/scripts/` for plan-inventory; `vc-generate-plan/scripts/` for plan-artifact; `vc-generate-context/scripts/` for all-context.

## Supplement cycle 2

Date: 29-10-26 (PVL-supplement, umbrella + registry only; phase plans NOT edited here)

| Gap | Addressed |
|---|---|
| N1 | Canonical SWEEP RULE text in Charter DoD 3 and Global Constraints; names the `upstream-attribution` tag and brand-detection lines (`validate-kit-portability.mjs`, `vc-publish/SKILL.md`, `vc-publish/references/vc-publish.md`); states why Phase 2 may exclude `process/` and adds a `process/` grep gate for Phase 2. Locked row (e) points to it |
| N2 | Both LICENSE greps in Global Constraints (mandatory in every phase exit gate, carried by Phase 0 `compare.sh`) and in goal-block TEST GATES; C-SAFE-2 criterion reworded |
| N3 | Strategy rows 1, 2, 7 rewritten (ordered groups; Phase 2 = 4 groups; Phase 7 mixed/ordered); phase plans declared authoritative |
| N4 | Join step now includes `diff -q` on the charter-template mirror pair; ownership table lists Phase 5 front-matter-only edits on vc-setup, vc-audit-vc, vc-update, vc-publish SKILL.md files |
| N5 | HARD STOPS line for the Phase 6 -> 7 Claude Code restart added to the goal block |
| N6 | Resume handoff and Current Execution State status text refreshed to "PVL cycle 3 pending after supplement cycle 2" |
| Locked (cycle 2) | Decisions 1-8 recorded in Locked Decisions (`.agents/skills`, interactive vb-setup, worktrees for Phases 4/5, join sequencing, Phase 3 judging, `validators.vb.list` + `--map`, census keying, `kitOnly`) |

Phase-plan changes needed (owned by other agents): Phase 0 `compare.sh` runs both LICENSE greps every phase and accepts `--map`, `.agents/skills` via `update-index --cacheinfo` and interactive vc-setup; Phase 2 and Phase 6 use the canonical SWEEP RULE wording verbatim; Phase 2 adds the `process/` grep gate; Phase 3 uses `golden/phase1/` for revert and prefix-stripped census; Phase 4/5 use own worktree + branch and cite the `diff -q` join check; Phase 6 writes `validators.vb.list` + mapping in the task folder, places `legacy-hashes.json` and `scripts/**` in `kitOnly`; Phase 8 uses `--map` and vb- names in steps 4-7.

Contradictions noted: phase plans still carry earlier items from cycle 1b (Phase 8 `.pathname` fix, Phase 5 validator paths in `vc-audit-context/scripts/`, Phase 8 "Phase 6 resolver fix" wording, Phase 3 must keep `golden/signal-census*`); verify each is closed in the next PVL pass.

## Supplement cycle 2b

Date: 29-10-26 (PVL-supplement, umbrella + registry only; the nine phase plans were read as FINAL and not edited). Stable Program Goal re-counted: 3670 characters (limit 4000), 7 required sections verified in order TARGET, PER-PHASE LOOP, HARD STOPS, SAFETY, TEST GATES, VALIDATE CONTRACT, START.

| Item | Applied |
|---|---|
| Registry | Rewritten to match the cycle-2 phase plans: Phase 0 files (`resolved_before.<runtime>.txt`, `upstream_baseline_sha.txt`, `compare.sh --map`) and the two user checkpoints; Phase 1 `baseline/p1_start.txt` + `validators.list` line; Phase 2 CONTRIBUTING translations, `welcome.yml`, `release.yml`, `1.bug_report.yml`, `baseline/resolved_p2_start.<runtime>.txt`, `baseline/p2_start.txt`; Phase 3 `golden/**`, `.codex/agents/references/`, codex backlog stub; Phase 4 `p4-tools/**`, `dedup-allowlist*.txt`, report, branch `p4-docs-dedup`; Phase 5 `p5-tools/**`, `proposed-new-skills.md`, report, agent-browser backlog note, branch `p5-skills-tune`; Phase 6 tool/test/hook/harness list, `kitOnly` (`legacy-hashes.json`, `scripts/**`), `.gitignore`, MIGRATION banner; Phase 7 `scripts/fixtures/check-docs/**`, `harness/phase7-*`; Phase 8 e2e fixes and backlog stubs |
| Locked Decision (f) | Orchestrator only SEQUENCES the join; spawned vc-execute-agent merges and runs `catalog --write`; spawned vc-tester runs `--check`, the `diff -q`/`cmp` mirror check and the joint suite |
| Charter-template pair | Corrected: BOTH copies are frozen in Phases 4 and 5 (earlier text said each phase edits its own copy) |
| Sweep rule | `CHANGELOG.md` and `MIGRATION.md` named as WHOLE-FILE protection (Phase 6 protected set); Phase 2 tags their old-identity lines instead; "identical in umbrella, Phase 2 and Phase 6" corrected to "implemented by" |
| Global Constraints / Test Infra | `validate-all-context` exit 0 in bare-kit mode before vc-setup; vc-setup is interactive with seed fallback |
| Phase 8 known gaps | 6 user-run items (added: re-run Phase 2 resolver check R2.5 under Linux Node 22; check `.agents/skills` mode 120000 on a real Linux checkout) plus a row for `install.sh` overwriting managed `process/development-protocols/**` and `process/_seeds/**` without backup and skipping an existing `.claude/settings.json` (documented in Phase 8 release notes; backup extension and JSON merge are backlog candidates, not in scope) |
| Goal block | HARD STOPS gained the Phase 0 user checkpoints and the Phase 3 A0 / Phase 4 0.5a cost acknowledgements; join wording aligned |

Contradictions between phase plans and the umbrella/other phases (NOT fixed here; owners must resolve or the orchestrator accepts them before PVL cycle 3):
- C1 LICENSE greps: the umbrella (C-SAFE-2, Global Constraints, goal block) and the registry say Phase 0 `compare.sh` runs both LICENSE greps after every phase. Phase 0 B3 does not contain them (only the Phase 0 Exit Gate does) and no phase 1-8 exit gate has them, so C-SAFE-2 is unproven after Phase 0 (gap N2 stays open until Phase 0 B3 adds the two greps, or each phase gate does).
- C2 `compare.sh` vs Phase 6 wrapper: Phase 0 B3 says `cd` to the repo root and defines `--map` as an old-label to new-label rename map, but never says `validators.list`, `run-validators.sh` and the TSVs are resolved relative to the script's own directory. Phase 6 C3b copies `baseline/.` to a temp dir, swaps in `harness/validators.vb.list` and runs the copy's `compare.sh after_setup` (labels unchanged, so `--map` is not what it needs). That works only with own-directory resolution; if `compare.sh` hard-codes the repo-relative `baseline/` path, the swapped list is ignored and the old `vc-` commands run. Phase 6 only "requests" the behavior; Phase 0 must state it (or offer `--list <file>`).
- C3 Sweep wording: Phase 2 and Phase 6 contain no verbatim SWEEP RULE text (the umbrella formerly demanded it). Mechanisms differ: Phase 2 R2.1 does not exclude `CHANGELOG.md`/`MIGRATION.md` (lines tagged `upstream-attribution`, stricter), Phase 6 protects both whole files. Umbrella wording now describes both; no phase edit needed unless the owners want a verbatim copy.
- C4 CHANGELOG 1.0.0 entry: Phase 2 C2 adds `## [1.0.0]` (its gate expects exactly 1); Phase 8 C1 adds "a CHANGELOG.md entry" and Phase 6 says Phase 8 "adds the 1.0.0 entry by hand". Phase 8 must extend the Phase 2 entry, not create a second `## [1.0.0]`.
- C5 Phase 8 plan does not carry the umbrella's user-run list: its Exit Gate and Verification Evidence name native Windows/macOS and the raw-URL install; items (3) real symlink on ubuntu CI, (4) exec bits on Windows-native, (5) R2.5 under Linux Node 22, (6) `.agents/skills` mode 120000 on Linux are absent (items (1) and (2) appear in P0 and the release-notes settings list). It also says a backup-extension stub is "to be written at EXECUTE" while the umbrella treats that as out of scope; Phase 8 should write one stub per umbrella item and either drop or explicitly allow the backup-extension stub.
- C6 Phase 4 text freezes BOTH charter-template copies and uses `cmp`; the umbrella join uses `diff -q`/`cmp` (equivalent). Only the old umbrella/registry text ("each edits its own copy") disagreed; corrected here, no phase edit.
- C7 Unowned residual: `author: vibecode-pro-max-kit` skill metadata in about 33 files. Phase 2 gate R2.2 excludes it and hands it to "Phase 6/5"; Phase 5 edits only `description`/`trigger_keywords`, and no Phase 6 rule matches the string. No phase will change it; it ships in v1.0.0 unless an owner is named.
- C8 Phase 6 states `MIGRATION.md`/`CHANGELOG.md` are protected and `MIGRATION.md` gets a pointer banner to `docs/RELEASE-NOTES-1.0.0.md`, which Phase 8 creates; Phase 8 does not claim `MIGRATION.md`. The banner link is dead between Phase 6 and Phase 8 (acceptable; recorded).

Verified closed from earlier contradiction lists: Phase 8 `.pathname` fix is in A0; Phase 5 validator paths use `vc-audit-context/scripts/`; Phase 8 P1 says "owned by Phase 2; Phase 6 B0 is the fallback"; Phase 3 C1b/Hard dependency keep `golden/signal-census*` for Phase 7.

Resolution (PVL cycle 3, 2026-10-29): contradictions C1-C8 above were closed by phase-plan supplement cycle 2c except C8 (accepted, residual R4); see the Validate Contract closure table. The registry prose notes about C1/C4/C7 are stale (residual R2).

## Supplement (inner 1b, Phase 0) (29-10-26)

Applied from Phase 0 research findings and user decisions 1-3: Locked Decisions gained rows for the screenshots exclusion (521-file baseline), git identity (real e-mail, confirmed by the user), the WhatsApp link removal (Phase 2) and the mixed git binaries; Locked Decision (b) and Charter DoD item 2 now say index-only 120000, work tree keeps the text file, raw exit stays 1 under `node.exe`, operative rule 'not worse than baseline'; the goal block hard-stop line names the real e-mail (re-counted, see below). The Phase 0 plan carries an Inner Loop Refresh Note dated 2026-10-29, so its inner PVL re-runs from V1. The registry Phase 0 'OPEN (C1)' note is closed (B3 rule (5) carries the LICENSE greps). Contradiction notes C1-C8 above are historical; their resolution stays in the Validate Contract closure table.
