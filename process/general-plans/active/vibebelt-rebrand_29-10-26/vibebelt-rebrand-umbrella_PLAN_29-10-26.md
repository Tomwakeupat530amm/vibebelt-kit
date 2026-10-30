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

- Program type: PHASE PROGRAM (9 phases, strict order 0..8; Phase 4 then Phase 5 run sequentially on `main`, no agent team, decision G)
- Feature folder: none (general-plans). Task folder: `process/general-plans/active/vibebelt-rebrand_29-10-26/`
- TL;DR: fork this kit into `vibebelt-kit` v1.0.0 for non-developer "vibecoders": safe baseline first, fix contradictions, new identity, golden instruments and frozen tasks (agents unchanged), safely tidied shared docs, tuned skills, `vc-` to `vb-` rename by one script, plain-language docs, real install test, release.

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
| Golden runs | SUPERSEDED 2026-10-30 for Phase 3: Phase 3 makes ZERO billed model calls (no slimming, decision D). The only billed golden runs are Phase 8 B4 (3 CORE tasks: 12 task runs + 6 judge calls = 18, plus 1 rehearsal run), acknowledged by the user at B4.1 (LOCKED Q3 wording kept as history) |
| Manifest and state-file rename | `vc-manifest.json` becomes `vb-manifest.json` in Phase 6, AND the state files `.vc-version`, `.vc-installed-files`, `.vc-publish-config` become `.vb-version`, `.vb-installed-files`, `.vb-publish-config`; install.sh, resolve-manifest.mjs, compute-sync-plan.mjs, vb-update/vb-publish, `.gitignore`, e2e test and docs change together. Old names are still READ as fallbacks and migrated to the new names (never deleted before the new file is written); Phase 6 B1 gets an upgrader fixture for all four (LOCKED Q4, extended by Gap 5) |
| Execute effort | Execute, fast-mode and quick-fix agents follow `implementation-standards.md` §Agent Frontmatter Conventions as written: `effort: max` for opus execution agents (execute, fast-mode and quick-fix move from `low` to `max`). Earlier wording that said 'high' is corrected. No other agent's `effort:` is changed or lowered (user decision B). Phase 1 report MUST state the token-cost impact (LOCKED Q5, decision a) |
| Native Windows / macOS | Cannot be tested here; Phase 8 gives the user exact commands; those gates stay CONDITIONAL with a backlog stub (LOCKED Q6) |
| Outward actions | Push, remote tag, GitHub release remain hard stops needing explicit user go-ahead in Phase 8 (LOCKED Q7) |
| Signal strings | `PHASE_COMPLETE:`, `Gate: PASS`, `SUPPLEMENT_APPLIED:`, `QUICK_FIX_ABORT:` and all others stay verbatim |
| Commits | directly on `main`, one execution commit per phase, process/plan commits separate. No exception any more: Phase 3 edits no agent (decision D, 2026-10-30), so it has only a process commit for `golden/**` and its report |
| Red validator (decision b) | 'Red' means 'worse than the Phase 0 baseline'. Baseline is recorded BEFORE and AFTER `vc-setup`. `.agents/skills` is a 17-byte text file on this checkout instead of a symlink: Phase 0 records it in git as mode 120000 in the INDEX ONLY (`git update-index --cacheinfo`, `core.symlinks=false`); the work tree keeps the 17-byte text file; there is no symlink and no copy fallback. Raw exit of `validate-skills` / `validate-context-discovery` stays 1 under `node.exe` (environment). The operative rule is 'not worse than baseline' plus the filtered check that no failure other than `.agents/skills` remains. Phase 0 documents the cause. |
| Node in WSL (decision c) | Linux Node 22 in WSL is a USER action: Phase 0 notes give the exact install commands, never auto-installed. If absent, `node.exe` runs the validators and the e2e / WSL install gates are recorded as baseline-red / NOT TESTED with the cause. |
| Version and manifest mode (decision d) | Version stays 1.0.0. `resolve-manifest.mjs` must pick glob mode by manifest shape (`Array.isArray(manifest.include)`) instead of `semverGte(version,'2.1.0')`. Owned by Phase 2, with a gate that `resolve-manifest --json` returns `files.length > 0` after the version bump. Phases 6 and 8 list this as a precondition. |
| Rename rules (decision e) | Phase 6 rename is case-sensitive and atomic: `vc-`/`VC-`/`VC_` all become `vb-`/`VB-`/`VB_` (signals such as `VC-PREDICT-DEEP-NEEDED`, env vars such as `VC_KIT_SOURCE`). Old env var names and old state files (`.vc-version`, `.vc-installed-files`, `.vc-publish-config`, `vc-manifest.json`) are still READ as fallbacks and migrated. ONE program-wide sweep rule with allowlist (canonical text in Charter DoD item 3 and Global Constraints, including the `CHANGELOG.md`/`MIGRATION.md` whole-file protection; names the `upstream-attribution` tag and the brand-detection lines in `validate-kit-portability.mjs`, `vc-publish/SKILL.md`, `vc-publish/references/vc-publish.md`). Restart checkpoint: the orchestrator asks the user to restart Claude Code before Phase 7 because renamed agents may not be spawnable in the same session. Signal strings stay verbatim until Phase 6 and change only as this rule says. The four uppercase signals (`VC-PREDICT-DEEP-NEEDED`, `VC-PREDICT-RESEARCH-COMPLETE`, `VC-FEASIBILITY-PROBE-NEEDED`, `VC-FEASIBILITY-VERDICT-READY`), `VC_*` env vars, `.vc.json` and `vc plan check` are RENAMED to `VB-`/`VB_`/`vb` with old-name fallbacks where code reads them; they are NOT residuals. |
| Phase 4 then Phase 5 sequential (decisions F, G; replaces the obsolete 'Phase 4/5 team join (decision f)' row) | Phase 4 then Phase 5 sequential on `main`; Phase 5 regenerates the catalog itself (no join): its spawned vc-execute-agent runs `generate-skills-catalog.mjs --write` as its last edit and commits; its spawned vc-tester runs `--check`, the charter-template `cmp` and the validators. No team, worktree, branch, merge, join or SendMessage; the orchestrator runs no gate and edits no file. Phase 4 renames or deletes NO protocol file and NO heading at all. Both charter-template copies are FROZEN in Phases 4 and 5. Phase 5 starts after the Phase 4 exit gate is green and its `fix:` commit is on `main`. |
| Golden baseline source (Gap 7) | Golden baseline is captured from the `upstream-baseline` tag (worktree checkout, original models) and run ONLY in the Phase 8 FINAL EQUIVALENCE GATE (decision A); Phase 3 only freezes the task definitions and the OLD-sandbox recipe (decision D, 2026-10-30: no slimming, no size floor, no Phase 3 runs). There is no Phase 1 model-change measurement: Phase 1 changes no `model:` (decision B). |
| `.agents/skills` (cycle 2, decision 1) | Stays the 17-byte text file in the work tree. Git records mode 120000 via `git update-index --cacheinfo` with `core.symlinks=false`. The gate checks only that no failure OTHER than `.agents/skills` remains (a directory copy and a WSL symlink both fail validate-skills under node.exe, verified). |
| vc-setup (cycle 2, decision 2) | `vc-setup` (later `vb-setup`) in Phase 0 is INTERACTIVE: the user's presence is a checkpoint (ask the user the setup questions); seed-based context is the fallback when the user is absent. |
| Phase 4/5 worktrees (cycle 2, decision 3) | OBSOLETE 2026-10-30 (decision G): replaced by 'Phase 4 then Phase 5 sequential on main; Phase 5 regenerates the catalog itself (no join)'. No worktree or branch is created. |
| Join sequencing (cycle 2, decision 4) | OBSOLETE 2026-10-30 (decision G): there is no join. The no-inline-execution rule it carried still holds: Phase 5's spawned vc-execute-agent runs `catalog --write`, Phase 5's spawned vc-tester runs `--check` and the suite. |
| Phase 3 judging (cycle 2, decision 5) | SUPERSEDED 2026-10-30 (decision D): Phase 3 runs no judge; `golden/old/` and `golden/phase1/` are not produced. Judging happens only in Phase 8 B4 (OLD vs FINAL) per the frozen `golden/tasks/judge.md`. |
| Baseline after rename (cycle 2, decision 6) | Phase 6 adds a step that writes `validators.vb.list` and a runtime mapping into the TASK FOLDER (not the protected `baseline/`); `compare.sh` accepts a `--map` file. |
| Phase 3 census (cycle 2, decision 7; extended 2026-10-30) | Phase 3 census lists agents by directory listing and keys output by prefix-stripped names; it records exact signal strings WITH counts (PHASE_COMPLETE variants distinct, status codes, colon-less VC- signals, Gate, MODE, toml incl. `SPAWN_REQUEST:`), optional `--neutral` VC-/VB- mapping; baseline `golden/signal-census-phase3.txt` taken on agents byte-identical to `b17294d`. |
| Phase 6 manifest (cycle 2, decision 8) | `legacy-hashes.json` and `scripts/**` belong in `kitOnly`, not `include`. |
| Agent-browser screenshots (inner 1b, user decision 1) | The 53 PNGs under `.claude/skills/vc-agent-browser/screenshots/` (14.6 MB) are EXCLUDED from the Phase 0 baseline commit and the `upstream-baseline` tag (excluded via `.git/info/exclude`; files stay on disk). A follow-up commit `chore: ignore agent-browser screenshots` adds the path to the tracked `.gitignore` BEFORE any later `git add -A`, so no later phase can commit them by accident. Baseline = 574 files minus 53 = 521 files (about 6.4 MB). This SETTLES Phase 5's untrack/gitignore proposal: Phase 5 keeps its non-destructive stance (no screenshot file is moved or deleted) and only rewords its proposal. |
| Git identity (inner 1b, user decision 2) | `user.name` = `Tomwakeupat530amm`; `user.email` = the user's OWN real address (not the GitHub noreply form). The agent never invents it: Phase 0 A0 is a user checkpoint where the orchestrator has the user confirm the exact address (the user confirmed `minhnguyentuan31103@gmail.com` in chat, 2026-10-29; A0 satisfied) because it becomes public in every commit once pushed. Noreply stays a mentioned alternative only. |
| Old owner's WhatsApp invite link (inner 1b, user decision 3) | `chat.whatsapp.com/E42ySo6iGmuAyeh25eAXuu` (measured 8 lines in 7 kit files outside the program folder; the user counted 9 lines) is REMOVED in Phase 2 (not replaced by an invented link). |
| Mixed git binaries (inner 1b) | Gates run with WSL git; `node.exe` validators call Windows git against the same repo (one cross-read verified in research). Phase 0 adds a gate that `git.exe status` and WSL `git status` both print nothing after C3. |
| QUALITY EQUIVALENCE (user decision A, 2026-10-29, LOCKED, HARD program requirement) | The new kit must keep the same behaviour, ways of working and output quality as the old kit, at least equal. Recorded as north star + definition-of-done item 8 + criterion C-EQ + a Charter hard safety constraint. Mechanism: Phase 3 FREEZES the golden task definitions (3 tasks: small feature, bug fix, multi-phase program; prompts, expected artifacts, rubric, judge protocol, exact old-kit sandbox recipe) in `golden/tasks/` with a sha256 manifest; Phase 8 step B4 (FINAL EQUIVALENCE GATE) re-runs the SAME frozen tasks, same judge protocol (blind pairwise, 2 replicates, tie = EQUAL, WORSE only if reproduced) on (i) the `upstream-baseline` tag tree built as an identically prepared sandbox with original models and (ii) the final v1.0.0 candidate tree, plus the mechanical evidence re-run on the final tree (Phase 0 validator baseline not worse via `compare-vb.sh`, signal census 1:1 after the VC-/VB- mapping, e2e trials, guardrail-section identity modulo the rename). ANY reproduced WORSE blocks every release step (no tag, no push) until fixed or until the user explicitly accepts it in chat. The exact run count and cost are reported and acknowledged by the user before the gate starts (Phase 8 B4.1, the program's single billed hard stop; Phase 3 has no cost gate any more, decision D). Fully-Automated parts: scripted rubric items, validator baseline, signal census, guardrail identity; Hybrid: e2e trials; Agent-Probe: the blind judge verdict, a NAMED RESIDUAL that is never the sole proof |
| NO AGENT SLIMMING (user decision D, 2026-10-30, LOCKED) | Phase 3 is re-scoped to "Instrument and freeze (no slimming)": the 15 `.claude/agents/*.md` and 15 `.codex/agents/*.toml` stay byte-identical to `b17294d` through Phase 3, no `references/` folder under agents, ZERO billed model calls in Phase 3. Reason: about 80 billed calls (roughly $150-$1,500), behaviour risk, and C-EQ. Phase 3 delivers: extended `golden/signal-census.mjs` + `signal-census-phase3.txt`, `golden/gen-guardrails.mjs` (`--root`, `--out`) + `guardrails.json`, `golden/run-record.mjs`, frozen `golden/tasks/` (phase-entry tasks, `old-sandbox-recipe.md`, `run-flags.md`, `FROZEN.sha256`). Dropped: size/conservation/pointer/parity-compare scripts, per-agent commits, revert rehearsal, Phase 3 cost gate A0. Real OLD-vs-FINAL differences C-EQ measures: `effort: max` on 3 execution agents, Phases 1/2/4/5/7 doc/identity/skill edits, the Phase 6 rename. Phases 4 and 5 run SEQUENTIALLY (4 then 5) on `main`. |
| PHASE 4 SAFE TIDY (decision E, 2026-10-30, user-delegated, LOCKED) | Phase 4 is a safe tidy, not a content de-duplication: `CLAUDE.md` byte-identical; the `AGENTS.md` Skill Registry is KEPT; 4 broken pointer occurrences fixed (`orchestration.md:320` -> `autopilot.md` §ENTER EXECUTE MODE Consent, `AGENTS.md:385` §Testing-and-Quality, the archive pointer twice in `all-development-protocols.md`), 0 new; the K1-1 line (`validate-model-effort-policy.mjs`) added to `orchestration.md` §Regression Gate Validators; the stale `orchestration.md:203` 'Superseded by Section 6' paragraph reworded; `AGENTS.md` trimmed from 37,885 to about 31.9 KB (hard limit 32,768 bytes because Codex reads only the first 32 KiB; target <= 32,000); the cold-read billed probe and its 0.5a cost gate are dropped; no worktree, branch, join or SendMessage; ONE revertable `fix:` commit with exactly 3 files. Known gaps: KG-P4-1 (AGENTS.md lacks 7 of 10 core rules, same as the old kit), KG-P4-2 (`12-reference.md PHASE-GATES` dangling citation, 9x in 8 files), KG-P4-4 ('14 validators registered in all-context.md' wording in frozen `CLAUDE.md:331` / `AGENTS.md:385`). |
| PHASE 5 MINIMAL SAFE TUNING (decision F, 2026-10-30, LOCKED) | Phase 5 runs SEQUENTIALLY after Phase 4 on `main`: front-matter keyword fixes for terms outside each skill's top-3 routing hits; ONLY `vc-intent-clarify` is split (new `references/` files whose names do not start with `vc-`); `vc-setup`, `vc-update` and `vc-agent-strategy-compare` are NOT split; `generate-skills-catalog.mjs --write` is Phase 5's LAST execute step, then the tester runs `--check` and the validators; no team, worktree or join; Phase 5 never edits `AGENTS.md`, `CLAUDE.md` or `process/development-protocols/**`. |
| NO AGENT TEAM (decision G, 2026-10-30, LOCKED) | `TeamCreate` is unavailable in this environment. Every 'Phase 4/5 team', teammate name, worktree, branch, join, merge, SendMessage, `comm -12` disjointness, TeamCreate/TaskList item in this program is OBSOLETE. Phases run one at a time on `main`. |
| MODEL DIRECTION (user decision B, 2026-10-29, LOCKED) | KEEP the models on disk: opus on 7 agents (`vc-execute-agent`, `vc-fast-mode-agent`, `vc-quick-fix-agent`, `vc-plan-agent`, `vc-research-agent`, `vc-tester`, `vc-validate-agent`), sonnet on 8 (`vc-code-reviewer`, `vc-code-simplifier`, `vc-debugger`, `vc-git-manager`, `vc-innovate-agent`, `vc-spec-agent`, `vc-ui-ux-designer`, `vc-update-process-agent`); verified by grep 2026-10-29. Phase 1 changes NO `model:` line; it fixes the DOCUMENTATION that says only the code-writing leg uses opus (CLAUDE.md, strategy-compare SKILL.md, implementation-standards.md, orchestration.md, vc-system-behavior 04/07/08, all-context.md line 179, and the README claim sites in 10 files; wording rewritten later by Phase 7). The Phase 1 validator enforces this real table (documented rows only). Ad-hoc helper agents with no vc-agent file default to sonnet. The Codex model stays global in `.codex/config.toml` |
| CLEAN FINAL TREE (user decision C, 2026-10-29, LOCKED, hard criterion C-CLEAN) | The FINAL state on git (the tagged v1.0.0 tree) is a complete, working kit with NOTHING extra: no program plans, reports, baselines, golden/eq evidence, generated project context, internal maintainer docs or unneeded translations. Mechanism: Phase 8 CLEANUP STEP C0b (section `## Clean Final Tree (C-CLEAN)`) = ONE commit `chore: prepare clean release tree`, placed AFTER B4 (verdict commit stays in history as a `process:` commit) and BEFORE the local tag C2a; the tag points at that commit. Gate: the tracked files at the tag must equal the ALLOWED LIST in that section |
| Git history (user decision C1, LOCKED) | KEEP the FULL history: every working commit stays, nothing is squashed, rebased or rewritten (no force-push). Only the final TREE is cleaned, by the dedicated cleanup commit. The task folder is dropped from the index with `git rm -r --cached` (files stay on disk, ignored through `.git/info/exclude`) so the C0 evidence (`eq/verdict.md`) and the history stay intact |
| Documentation kept MINIMAL (user decision C2, LOCKED) | Final docs: README.md (English), `docs/i18n/README.vi-VN.md` (Vietnamese, synced with English), LICENSE, CHANGELOG.md, SECURITY.md (English), CONTRIBUTING.md (English), with NO separate QUICKSTART/GLOSSARY files (user decision, LOCKED 2026-10-29: Phase 7 folds a short 'Quick start' section and a plain-language glossary table INTO README.md and docs/i18n/README.vi-VN.md; both stay concise and navigable). REMOVED at C0b: `docs/GITHUB-LABELS.md`, `docs/GITHUB-SETTINGS.md`, `docs/GOOD-FIRST-ISSUES.md`, `MIGRATION.md`, the 8 other READMEs (`docs/i18n/README.{de,es,fr,hi,ja-JP,ko-KR,pt-BR,zh-CN}.md`) and every `docs/i18n/CONTRIBUTING.*` and `docs/i18n/SECURITY.*` translation. README language switchers in README.md, README.vi-VN.md and CONTRIBUTING.md are cut to existing files; the Vietnamese README stays in sync with English |
| DOOMED SET (derived from C2, LOCKED) | Paths that exist during Phases 1-8 but are deleted by C0b (list in the C-CLEAN section). Edits to them are throw-away: Phases 2 and 7 skip the 8 languages (and the other doomed docs) at their own PVL; Phase 1 still edits all 10 READMEs as validated; Phase 6 runs on them automatically (zero effort). The sweeps (Phase 2 R2.1, Phase 6 G5/G7) may exclude the DOOMED SET before C0b; at the tag it no longer exists, so DoD 3 holds on the final tree without exclusions |
| Deferred, optional follow-up (NOT in this program unless the user asks) | Measure sonnet versus opus on the golden tasks and only then consider lowering any agent's model for cost |

---

## Program Goal Charter

```
vibebelt-kit Rebrand and Hardening — Program Goal Charter

North star:
- Ship vibebelt-kit v1.0.0: the same proven RIPER-5 workflow, rebranded, internally consistent, leaner, and installable by a non-coder from the README alone, and proven (by the same golden tasks run on old and new kit) to keep the old kit's behaviour, ways of working and output quality, at least equal. The tagged tree contains the kit and nothing else (C-CLEAN); the full working history stays in git.

Definition of done (an unattended agent must be able to do all of these):
1. Show a git history with tag `upstream-baseline` and a saved before/after validator comparison.
2. Run the full validator suite (including the new model/effort policy validator) with no validator worse than the Phase 0 baseline (the operative rule; `.agents/skills` is recorded as index-only mode 120000 and stays a text file in the work tree, so raw exit of `validate-skills` / `validate-context-discovery` stays 1 under `node.exe` and is expected to be 0 only on Linux Node 22 or ubuntu CI), and CI runs the same suite.
3. Show that grep for `withkynam|flowser` finds only attribution lines and grep for `vc-` finds only legacyDeletions and changelog history, using ONE program-wide sweep rule. SWEEP RULE (canonical wording lives here; Phase 2 and Phase 6 implement it, see their gates): search the whole repo EXCLUDING `.git`, the program task folder `process/general-plans/active/vibebelt-rebrand_29-10-26/` (and its archived copy), `baseline/`, `golden/`, the rename script + its fixtures, `CHANGELOG.md` and `MIGRATION.md` (WHOLE-FILE protection: Phase 6 implements the history rule as a protected set, not as marker regions; in Phase 2 their old-identity lines are instead tagged `upstream-attribution`), and `legacyDeletions`. Old-identity lines that legitimately remain are only: (1) lines carrying the literal tag `upstream-attribution`; (2) the brand-detection lines in `.claude/skills/vc-audit-vc/scripts/validate-kit-portability.mjs`, `.claude/skills/vc-publish/SKILL.md` and `.claude/skills/vc-publish/references/vc-publish.md`. Phase 2 may additionally exclude the whole `process/` directory ONLY because at Phase 2 time `process/` holds no kit text beyond the task folder and Phase 0 generated context; its gate adds `grep -rIn "withkynam\|flowser" process --exclude-dir=vibebelt-rebrand_29-10-26` and expects no output. Phase 2 (gate R2.1 plus the `process/` grep) and Phase 6 (protected set + allowlist diffs G5/G7) implement this rule; they do not repeat the text verbatim.
4. Show the agents unchanged by Phase 3 (no slimming, decision D; byte-identical to `b17294d`), the Phase 3 signal-census and guardrail baselines, signal strings intact and Claude/Codex parity green; output quality is proven by the Phase 8 equivalence gate (item 8).
5. Show 33 skills intact with tuned triggers, a regenerated catalog, an agent-browser size explanation, and a proposed-new-skills list (none added).
6. Show README top + the Quick start section + the glossary table (both inside README.md and README.vi-VN.md, no separate files) in plain language, EN and VI synced; the 8 other languages are NOT shipped (removed at C0b; C-CLEAN), and README language switchers link only to files that exist.
7. Show an install-test matrix (fresh + existing project; Windows Git Bash, WSL, macOS/Linux; untested ones documented) and a local tag `v1.0.0` (on the cleanup commit) with plain-language release notes.
8. Show the FINAL EQUIVALENCE GATE verdict (Phase 8 step B4, last line of `eq/verdict.md` = `EQ gate: PASS` or `EQ gate: ACCEPTED-BY-USER`): the frozen golden tasks re-run on the old (`upstream-baseline`) and the final tree with no reproduced WORSE, plus the mechanical equivalence evidence (validator baseline not worse, signal census 1:1 after the VC-/VB- mapping, e2e trials, guardrail-section identity). No release step happens before this.
9. Show the CLEAN FINAL TREE verdict (C-CLEAN, Phase 8 step C0b): `git ls-tree -r --name-only v1.0.0` equals the ALLOWED LIST (section `## Clean Final Tree (C-CLEAN)`); no program artifacts; no dead README/CONTRIBUTING/CHANGELOG/SECURITY link; code paths byte-identical to the B4 FINAL commit; full history preserved.

What "verified" means (program level):
- A phase is VERIFIED only when: its exit-gate commands exit as expected, the full validator suite is not worse than the Phase 0 baseline (pre-existing reds are not blamed on us), the regression checkpoint against earlier verified surfaces passes, and a validate-contract exists (or a documented skip reason).
- Known-Gap is a named residual, never a proof. The Agent-Probe judge verdict of the equivalence gate is likewise a named residual and never the sole proof. A behavior covered only by Known-Gap keeps its gate CONDITIONAL and gets a backlog stub.

Scope tiers → phase mapping:
- Tier 1 Safety net and consistency → Phases 0, 1
- Tier 2 Identity, golden instruments, safely tidied docs, tuned skills → Phases 2, 3, 4, 5
- Tier 3 Rename, vibecoder docs, release → Phases 6, 7, 8
- This program retires Tiers 1-3.

Explicitly out of scope (deferred tier):
- Removing any skill or any RIPER-5 phase; adding new skills (proposals only); translating the 8 non-EN/VI languages; marketing site; publishing to package registries; changing agent behavior (agent slimming dropped, decision D; only the Phase 6 rename and Phase 7 plain-language prose touch agent text).

Hard safety constraints (non-negotiable, per phase):
- Never delete user content (including in the updater/legacyDeletions: kit-owned, unmodified files only).
- Never remove or alter the original MIT notice and the line "Copyright (c) 2026 vibecode".
- No phase proceeds on a red validator, where 'red' means worse than the Phase 0 baseline (recorded before AND after vc-setup).
- Commit each phase's execution changes to `main` before the next phase. Keep process/plan/context commits separate from execution commits.
- Pushing, tagging remotely, GitHub release, billed model runs beyond the approved golden set: ask the user first.
- No tag, push or GitHub release while the C-CLEAN gate fails (tracked files at the tag differ from the ALLOWED LIST, a dead link, or code paths differ from the B4 FINAL commit). Git history is never rewritten, squashed or force-pushed.
- No release step (release notes finalisation, local tag, push, GitHub release) while the FINAL EQUIVALENCE GATE has a reproduced WORSE or a mechanical failure, unless the user explicitly accepts it in chat; the exact run count and cost of the gate are acknowledged by the user before it starts.
```

### Acceptance criteria (the user brief acts as the SPEC; each criterion names its proof)

| ID | Criterion | proven by | strategy |
|---|---|---|---|
| C-P0 | git exists, validator baseline saved, all-context.md exists | Phase 0 Exit Gate commands | Fully-Automated |
| C-P1 | new policy validator + fixtures (enforces the real table: 7 opus / 8 sonnet, `effort: max` on the three execution agents; no `model:` changed), documentation states the real model policy, CI covers full suite, counts consistent | Phase 1 Exit Gate | Fully-Automated |
| C-P2 | grep finds only attribution; images local; version 1.0.0 | Phase 2 Exit Gate | Fully-Automated |
| C-P3 | agents and toml byte-identical to `b17294d` (no slimming, no `references/`); extended signal census deterministic with baseline `golden/signal-census-phase3.txt`; `golden/gen-guardrails.mjs` (`--root`, `--out`) deterministic for 15 agents; `golden/run-record.mjs` tested; golden task definitions frozen in `golden/tasks/` (`sha256sum -c`); zero billed model calls; `compare.sh` not worse | Phase 3 Exit Gate | Fully-Automated |
| C-P4 | safe tidy: CLAUDE.md byte-identical; 4 broken pointers fixed, 0 new; no unjustified leftover; AGENTS.md <= 32,768 bytes (target <= 32,000) with Skill Registry kept; validators not worse (compare.sh); Phase 1 model text preserved | Phase 4 Exit Gate | Fully-Automated |
| C-P5 | 33 skills, validators green, proposals listed; only `vc-intent-clarify` split; catalog regenerated by Phase 5 itself (`--check` exit 0); AGENTS.md untouched | Phase 5 Exit Gate | Fully-Automated + Hybrid |
| C-P6 | one idempotent dry-run-capable script, no stray `vc-`, all validators green | Phase 6 Exit Gate | Fully-Automated + Hybrid |
| C-P7 | non-coder can install from README unaided; EN+VI synced (the 8 other languages are skipped and removed at C0b; the former '8 banners' check is replaced by 'README switchers link only to existing files') | Phase 7 Exit Gate | Fully-Automated + Agent-Probe |
| C-P8 | FINAL EQUIVALENCE GATE (C-EQ) passed first; cleanup commit C0b (C-CLEAN) passed second; clean install on tested environments; tag v1.0.0 on the cleanup commit | Phase 8 Exit Gate | Fully-Automated + Hybrid (macOS/Windows native = Known Gap, CONDITIONAL, backlog stub) |
| C-EQ | the final v1.0.0 kit keeps the same behaviour, ways of working and output quality as the old kit, at least equal (user decision A) | Phase 8 step B4: frozen golden tasks re-run on `upstream-baseline` vs final tree (blind pairwise, 2 replicates, tie = EQUAL, WORSE only if reproduced) + validator baseline + signal census + e2e + guardrail identity; last line of `eq/verdict.md` | Fully-Automated (scripted rubric, validator baseline, signal census, guardrail identity) + Hybrid (e2e) + Agent-Probe (blind judge; named residual, never the sole proof) |
| C-CLEAN | the tagged v1.0.0 tree is a complete working kit with nothing extra (user decision C): tracked files at the tag = ALLOWED LIST; no program/plan/report/baseline/golden/eq/generated-context/internal docs/extra translations; no dead relative link in README.md, README.vi-VN.md, CONTRIBUTING.md, CHANGELOG.md, SECURITY.md; code paths byte-identical to the B4 FINAL commit; full history preserved | Phase 8 step C0b + gate `harness/clean-check.sh` (allowed-list diff, deny-pattern grep, link check, B4.8 pathspec diff, validators on the cleaned tree, install smoke, history ancestry) | Fully-Automated (allowed-list diff, deny patterns, link check, byte-identity, ancestry) + Hybrid (install smoke + e2e on the cleaned tree) |
| C-SAFE-1 | never delete user content | Phase 6 B1 + Phase 8 B1 | Hybrid |
| C-SAFE-2 | MIT notice and original copyright kept | both LICENSE greps run after every phase by Phase 0 `baseline/compare.sh` (Global Constraints) | Fully-Automated |

---

## Stable Program Goal (copy-paste this to start autonomous execution)

```
SESSION GOAL: vibebelt-kit rebrand + hardening to v1.0.0 for non-coder vibecoders
Ref: process/general-plans/active/vibebelt-rebrand_29-10-26/vibebelt-rebrand-umbrella_PLAN_29-10-26.md

TARGET: all 9 phases (0-8, strict order) done, each exit gate green:
- QUALITY (hard, C-EQ): new kit >= old kit in behaviour, ways of working, output quality; Phase 8 re-runs Phase 3's frozen golden tasks old vs final BEFORE any release step
- CLEAN (hard, C-CLEAN): v1.0.0 tag tree = umbrella ALLOWED LIST only (no program, generated or internal files); history kept; Phase 8 C0b cleanup after B4, before tag
- no validator worse than Phase 0 baseline (red = worse than baseline), git diff --check clean
- grep withkynam|flowser = attribution only; grep vc- = legacyDeletions/CHANGELOG only (sweep rule in umbrella)
- 33 skills kept, RIPER-5 unchanged, Claude+Codex parity, clean install tested, tag v1.0.0
- tiers: automated / hybrid / agent-probe

AUTONOMY: before ANY spawn read umbrella Current Execution State, then the phase plan Phase Loop Progress (first unchecked box = next agent). Phases 4 then 5 run sequentially on main (no team, decisions F, G).

PER-PHASE LOOP (7-step, never skip/reorder, SKIPS SPEC): 1 RESEARCH, 2 INNOVATE, 3 PLAN-SUPPLEMENT, 4 PVL, 5 EXECUTE, 6 EVL, 7 UPDATE-PROCESS. PVL never skipped; placeholder or partial contract = blocked. Every subagent FIRST ACTION: vc-context-discovery + vc-plan-discovery. Every phase-END: vc-agent-strategy-compare. Models: 7 opus, 8 sonnet, none changed. After Phase 6 use vb- names (restart Claude Code between Phase 6 and 7).

HARD STOPS (pause for user):
- push, remote tag, GitHub release, publish
- any deletion of user content; billed model runs beyond approved golden set
- Phase 8 EQUIVALENCE GATE: reproduced WORSE vs old kit blocks release until fixed or user accepts; user acks run count+cost first
- C0b: harness/clean-check.sh must exit 0 (tree = ALLOWED LIST, links, code = B4 FINAL) before the tag; never rewrite history
- a validator worse than baseline (never advance), cascade BLOCKED, placeholder contract
- Linux Node install = user action
- single billed stop: user acks run count+cost at Phase 8 B4.1 (1 rehearsal + 18 core calls); Phases 3-5 zero billed calls
- after Phase 6 rename commit: stop, user restarts Claude Code

SAFETY (never override):
- never delete user content; keep MIT notice + "Copyright (c) 2026 vibecode"
- signal strings verbatim until the Phase 6 rename rule
- Phase 3: agents byte-identical to b17294d; zero billed calls
- commit each phase on main before the next; process commits separate; VC-/VC_ signals+env vars become VB-/VB_ in Phase 6

TEST GATES (every phase exit; compare to baseline):
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
  C-CLEAN (Phase 8 C0b/C2a): bash harness/clean-check.sh = 0

VALIDATE CONTRACT: per phase, by vc-validate-agent, before EXECUTE.

START: Phase 3, step 4 PVL (Phases 0-2 DONE). Spawn vc-validate-agent (opus).
```

---

## Phase Ordering

| Phase | Plan file | Scope summary | Depends on |
|---|---|---|---|
| 0 — Foundation | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-00-foundation_PLAN_29-10-26.md` | git init, baseline tag, validator baseline, LICENSE line, vc-setup | — |
| 1 — Fix inconsistencies | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-01-fix-inconsistencies_PLAN_29-10-26.md` | model-policy docs corrected to the real assignment (no `model:` change), execute-class effort max, README counts, CI coverage, new policy validator | Phase 0 |
| 2 — Identity and distribution | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-02-identity-distribution_PLAN_29-10-26.md` | withkynam/flowser replaced, local images, version 1.0.0 | Phase 1 |
| 3 — Instrument and freeze (no slimming) | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-03-slim-agents_PLAN_29-10-26.md` | Instrument and freeze (no slimming): extended signal census, guardrail hashes, run recorder, frozen golden task set for Phase 8; agents unchanged; zero billed calls | Phase 2 |
| 4 — Doc de-duplication | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-04-doc-dedup_PLAN_29-10-26.md` | safe tidy: CLAUDE.md byte-identical, 4 broken pointers fixed, K1-1 line, AGENTS.md <= 32,768 bytes (Skill Registry kept), leftovers allowlist; one `fix:` commit | Phase 3 |
| 5 — Tune skills | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-05-tune-skills_PLAN_29-10-26.md` | minimal safe tuning: front-matter keyword fixes, split only `vc-intent-clarify`, agent-browser facts, proposals, catalog regenerated as the last step; no AGENTS.md edit | Phase 4 (sequential, decision F) |
| 6 — Prefix rename | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-06-prefix-rename_PLAN_29-10-26.md` | vc- to vb- by one idempotent script, legacyDeletions | Phases 4 + 5 |
| 7 — Vibecoder docs | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-07-vibecoder-docs_PLAN_29-10-26.md` | README top, Quick start section, glossary table (inside README.md and README.vi-VN.md), plain messages, EN+VI | Phase 6 |
| 8 — Install test and release | `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-08-install-release_PLAN_29-10-26.md` | FINAL EQUIVALENCE GATE, real installs, update/publish flows, cleanup commit C0b (clean tree), v1.0.0 | Phase 7 |

Ordering rationale (checked step by step): the baseline tag must precede every edit (0); the policy validator and CI must exist before big edits so later phases are guarded (1); identity changes touch installer constants the rename (6) must carry along (2 before 6); the Phase 3 instruments and baselines (3) are taken on the untouched agents before any later phase edits text; 4 and 5 touch disjoint files (see registry) and run sequentially, 4 then 5, on `main` (no team, decision G); the rename (6) needs both done so one script sees the final file set; docs (7) must use final `vb-` names; install testing (8) must test the final build. No phase depends on a later phase's output.

### Join Conditions

- Each phase MUST NOT start until the previous phase exit gate passes (Phase 5 waits for Phase 4; Phase 6 waits for Phase 5, which runs after Phase 4).
- Phases 4 and 5 run sequentially on `main`: Phase 4 first, then Phase 5 (decisions F, G). Their claims stay disjoint, but no concurrency is planned.
- Phase 5 starts only after the Phase 4 exit gate is green and the Phase 4 `fix:` commit is on `main`.
- No join step (decision G). Phase 5's own last execute step runs `generate-skills-catalog.mjs --write` (spawned vc-execute-agent); its spawned vc-tester then runs `--check`, `cmp process/development-protocols/references/program-goal-charter-template.md .claude/skills/vc-generate-phase-program/references/program-goal-charter-template.md` (exit 0; both copies frozen in Phases 4 and 5) and the validator suite (protocol-wiring, guide-sync, agent-parity, skills, skill-routing, confusable-skills, skill-keywords).
- No worktree, branch or merge for Phases 4 and 5: each phase commits on `main`; Phase 4's rollback unit is `git revert` of its one `fix:` commit; Phase 5's is its own commit.
- Meaning-level rule: Phase 4 renames or deletes NO protocol file and NO heading at all (no exception, no stub route); Phase 4 runs protocol-wiring and its pointer-check before reporting.
- Phase 6 preconditions: Phase 4 and Phase 5 committed on `main` with their exit gates green, `AGENTS.md` <= 32,768 bytes, and `resolve-manifest --json` returns `files.length > 0` (decision d). Phase 8 lists the same precondition.
- Restart checkpoint: Phase 6 stops after its rename commit; the user restarts Claude Code; Phase 6 EVL/UPDATE-PROCESS and all of Phase 7 run in the restarted session (renamed `vb-*` agents may not be spawnable in the same session).
- Hard dependency of Phase 7 on Phase 3: Phase 7 reads `golden/signal-census.mjs` and `golden/signal-census-phase3.txt` (task folder, excluded from the rename sweep). Phase 3 must keep both; Phase 7 compares after `sed 's/VC-/VB-/g'`.
- Phase 0 owns the baseline kit used by every later gate: `baseline/compare.sh [--map <file>]` (label rename map), `baseline/run-validators.sh`, `baseline/validators.list`, `baseline/resolved_before.<runtime>.txt`, `baseline/upstream_baseline_sha.txt`, `baseline/validators_before.*`, `baseline/validators_after_setup.tsv`, and the `.agents/skills` repair. Phase 1 adds `baseline/p1_start.txt` and one line in `validators.list`; Phase 2 adds `baseline/p2_start.txt` and `resolved_p2_start.<runtime>.txt`; Phase 6 never writes into `baseline/` (its helpers live in `harness/`).
- Phase 4/5 task-folder tools (`p4-tools/**` incl. `claim.txt`, `p4_start.txt`, `census.mjs`, `pointer-check.mjs`, `dedup-allowlist*.txt`, `p5-tools/**` incl. `claim.globs` and `baseline.sha`, `proposed-new-skills.md`, both phase reports) are single-owner files; the registry prose must match each phase's machine-readable claim file (Phase 4 `p4-tools/claim.txt`, Phase 5 `p5-tools/claim.globs`). Catalog regeneration happens only as Phase 5's last execute step.
- User checkpoints (returned as `NEEDS_CONTEXT`, then re-spawned with the answer): Phase 0 git identity email (A0) and interactive `vc-setup` (E0); ONE cost acknowledgement, at Phase 8 B4.1 (the rehearsal run, the 18 CORE calls and any EXTENDED tasks the user approves); Phases 3, 4 and 5 make zero billed calls.

---

## Strategy Recommendation per Phase (vc-agent-strategy-compare)

Phase plans' own Strategy sections are authoritative if this table and a phase plan ever differ. Model rule (decision B): each named vc-agent runs on the model in its own front-matter (opus: execute, fast-mode, quick-fix, plan, research, validate, tester; sonnet: innovate, spec, update-process, debugger, code-reviewer, code-simplifier, ui-ux-designer, git-manager); ad-hoc helpers (judge, probe) default to sonnet; implementing subagents are opus.

| Phase | Strategy | Why | Models |
|---|---|---|---|
| 0 | Sequential | steps depend on each other | named agents on their front-matter models; EXECUTE opus |
| 1 | Parallel subagents (3 groups, ordered: (a) validator + execution-agent effort, (b) README/i18n/CI, (c) model-fact docs): group (b) README/i18n/CI starts only after group (a) validator exists (Phase 1 ordering rule); the Phase 1 plan is authoritative | agents+validator first, then README/i18n/CI; no cross-talk needed | named planning agents on front-matter models; 3 opus implementers |
| 2 | Parallel subagents (4 disjoint groups a-d, with ordering: (c)/(d) wait for the resolver fix before version text); Phase 2 plan is authoritative | install scripts / community docs / README+assets / i18n READMEs | sonnet planning; 4 opus implementers |
| 3 | Sequential, ONE vc-execute-agent | only task-folder scripts and a frozen task set; one writer keeps them consistent; no billed calls | research/plan/validate/tester on front-matter (opus); execute opus; no judge |
| 4 | Sequential, ONE vc-execute-agent on `main` (no team, decision G); Phase 4 plan is authoritative | 3 shipped files and task-folder tools; one writer; one revertable `fix:` commit | named agents on front-matter models; execute opus |
| 5 | Sequential after Phase 4, ONE vc-execute-agent on `main` (catalog `--write` as its last step), then vc-tester (`--check`, `cmp`, validators); Phase 5 plan is authoritative | front-matter edits plus one split; catalog must be regenerated after all edits | named agents on front-matter models; execute opus |
| 6 | Sequential | one script, determinism is the point | sonnet planning; opus script author/runner |
| 7 | Mixed, ordered (glossary follows the quick start; VI follows EN); Phase 7 plan is authoritative | files are disjoint but wording depends on the English text | sonnet prose; opus only for agent-prompt edits |
| 8 | Sequential | each environment fix feeds the next test | tester on its front-matter model (opus); ad-hoc sonnet judge for the equivalence gate; opus fixes |

---

## Per-Phase Entry / Exit Gates

| Phase | Entry | Exit gate |
|---|---|---|
| 0 | Program start | git exists; `upstream-baseline` tag; validator baseline saved before AND after vc-setup; `.agents/skills` repaired; all-context.md exists; `grep -c "Copyright (c) 2026 vibecode" LICENSE` = 1 and `grep -c "Copyright (c) 2026 Tomwakeupat530amm" LICENSE` = 1 |
| 1 | Phase 0 exit met | new policy validator + pass/fail fixtures (real table); no `model:` line changed, `effort: max` on the 3 execution agents; model-fact docs corrected (claim grep prints nothing); CI lists every validator; counts consistent |
| 2 | Phase 1 exit met | grep (program-wide sweep rule) finds only attribution lines; no hotlinked images; version 1.0.0; `resolve-manifest --json` returns files.length > 0 |
| 3 | Phase 2 exit met | `git diff --stat b17294d -- .claude/agents .codex/agents` empty, no agents `references/`; `node --test golden/test/` green (census covers PHASE_COMPLETE variants, DONE_WITH_CONCERNS, VC-PREDICT-DEEP-NEEDED); census and guardrails double-run identical (15 agents, `--out` works); `golden/tasks` `sha256sum -c` OK; `golden/runs` empty (no model call); `compare.sh` exit 0 |
| 4 | Phase 3 exit met | `CLAUDE.md` byte-identical; pointer-check 4 fixed and 0 new; `AGENTS.md` <= 32,768 bytes with Skill Registry kept (catalog `--check` 0); no unjustified leftover (allowlist diff); `compare.sh` exit 0; Phase 1 claim grep empty; exactly 3 files in the `fix:` commit (the Phase 4 plan is authoritative) |
| 5 | Phase 4 exit met and committed (sequential) | 33 skills; validate-skills, skill-routing, confusable-skills, skill-keywords green; catalog regenerated by Phase 5 (`--check` 0); charter-template `cmp` 0; AGENTS.md unchanged by Phase 5 |
| 6 | Phases 4 and 5 committed with exit gates green, `AGENTS.md` <= 32,768 bytes, resolve-manifest precondition | script idempotent; no stray `vc-`; all validators and e2e green; `AGENTS.md` still <= 32,768 bytes |
| 7 | Phase 6 exit met, Claude Code restarted, `golden/signal-census.mjs` + `golden/signal-census-phase3.txt` present | non-coder install walkthrough passes; EN+VI synced; the 8 other languages are not touched (throw-away, C-CLEAN); README switcher links resolve |
| 8 | Phase 7 exit met | `e2e-kit-flows.test.mjs` `.pathname` Windows bug fixed first (Phase 8 owns it); FINAL EQUIVALENCE GATE B4 (`eq/verdict.md` last line `EQ gate: PASS` or `ACCEPTED-BY-USER`) BEFORE any release step; cleanup step C0b AFTER B4 and BEFORE the tag (`harness/clean-check.sh` exit 0: tracked files = ALLOWED LIST, links resolve, code byte-identical to B4 FINAL); clean install on tested environments; 6 user-run known-gaps listed; local tag v1.0.0 on the cleanup commit; release notes |

---

## Per-Phase Loop

Each phase executes the canonical 7-step inner loop `R → I → P → PVL → E → EVL → UP`. It SKIPS SPEC: the user brief and this umbrella are the SPEC.

1. **RESEARCH** — vc-research-agent (opus, front-matter): load context, read prior phase reports, check drift
2. **INNOVATE** — vc-innovate-agent (sonnet): decide approach; Decision Summary
3. **PLAN-SUPPLEMENT** — vc-plan-agent (opus, front-matter): update the existing phase plan or mark "n/a — research clean"
4. **PVL** — vc-validate-agent (opus, front-matter): V1-V7; validate-contract per `example-validate-output.md`
5. **EXECUTE** — vc-execute-agent (opus): implement the phase plan only
6. **EVL** — vc-tester: re-run contract gates independently; follow-up stubs; EVL HANDOFF SUMMARY
7. **UPDATE-PROCESS** — vc-update-process-agent (sonnet): phase report, rewrite `## Current Execution State`, commit on main

PVL is NEVER skipped. A placeholder or partial `## Validate Contract` = blocked.

---

## Pre-PVL Conflict Resolution

Checked against `phase-blast-radius-registry.md`. Phases 4 and 5 run sequentially (4 then 5, decision G) and their claims are disjoint anyway: 4 owns `AGENTS.md`, `orchestration.md`, `all-development-protocols.md` (CLAUDE.md frozen byte-identical); 5 owns `.claude/skills/*/SKILL.md` front-matter, the `vc-intent-clarify` split and the skills catalog. Files touched by more than one phase are all `parallel-safe` only because phases run strictly in order (single writer at a time); owner of the final shape in brackets:

| File / area | Phases touching it | Owner (winning phase) |
|---|---|---|
| README.md | 1, 2, 6, 7 | 7 (final wording); 1 = validator count + model-fact correction (facts only), 6 only renames prefix |
| `.claude/agents/*.md` and `.codex/` mirrors | 1, 3, 6, 7 | 3 (content); 1 touches ONLY the `effort:` line of the 3 execution agents (no `model:`), 6 rename only, 7 message prose only |
| `install.sh`, vc-update/vc-publish skills (`SKILL.md` + `references/`) | 2, 5 (front-matter only, SKILL.md files), 6, 8 | 2 (REPO); 5 front-matter only; 6 rename + manifest name; 8 small fixes only |
| `vc-manifest.json` / `vb-manifest.json` | 2 (version), 6 (file rename) | 6 |
| `CHANGELOG.md` | 2 (new `## [1.0.0]` fork-origin entry, upstream history tagged), 6 (whole-file PROTECTED, no rewrite), 8 (hand-written release entry; must extend, not duplicate, the Phase 2 `## [1.0.0]` entry, see contradiction C4) | 8 for the release text; 2 for the fork-origin entry |
| `LICENSE` | 0 only (checked after EVERY phase by `baseline/compare.sh`) | 0 |
| `SECURITY.md`, `.github/FUNDING.yml` | 2 only | 2 |
| `docs/i18n/README.*.md` (9 files; Vietnamese is `README.vi-VN.md`) | 1 (counts, all 9 files), 2 (identity + images: `README.vi-VN.md` ONLY), 6 (rename, automatic), 7 (VI sync; no banners), 8 C0b (deletes the 8 other files) | 7 for `README.vi-VN.md` (final); Phase 2 group C owns identity + images for `README.vi-VN.md` only (the 8 others are DOOMED, throw-away); Phase 1 owns the count and the model FACTS (7 opus / 8 sonnet), which Phase 7 must keep |
| `MIGRATION.md` | DOOMED: deleted by Phase 8 C0b. Phase 2 identity tagging and Phase 6 banner step B6 are throw-away (skip B6 and residual R4) | 8 (C0b) |
| `docs/GOOD-FIRST-ISSUES.md`, `docs/GITHUB-LABELS.md`, `docs/GITHUB-SETTINGS.md` | DOOMED: deleted by Phase 8 C0b; Phases 2, 6, 7 spend no effort on them | 8 (C0b) |
| `.claude/skills/vc-setup/**` | 2 (identity), 5 (front-matter only), 6 (rename) | 2 |
| `.claude/skills/vc-audit-vc/SKILL.md` | 1 (new validator listing), 5 (front-matter only), 6 (rename) | 1 |
| `.github/workflows/validate.yml` | 1 (new validator listing), 6 (rename) | 1 |
| `.github/workflows/release.yml` (R1-f) | 1 (ADDITIONS ONLY: the new validator steps), 2 (display-name line, AFTER Phase 1), 6 (rename), 8 (kept; release notes via `gh`) | 2 for the display-name line; 1's claim is additions only, strictly ordered 1 then 2; Phase 1 must list this file in its claim and the registry |
| `CLAUDE.md` (§Model Selection Policy), `process/development-protocols/{implementation-standards,orchestration}.md`, `vc-system-behavior/{04-research,07-plan,08-validate}.md`, `.claude/skills/vc-agent-strategy-compare/SKILL.md` (§Model Selection Policy), `process/context/all-context.md` line 179 (model-policy paragraph) | 1 (model-fact correction, decision B), 4 (does NOT touch CLAUDE.md, which stays byte-identical; among these files edits only `orchestration.md`), 5 (strategy-compare front-matter only), 6 (rename) | 1 for the model facts; 4 MUST PRESERVE the corrected model text (its gate re-runs Phase 1's claim grep); 5 and 6 do not alter the facts; `AGENTS.md` has no model text and is Phase 4's alone |
| `eq/**` (task folder: FINAL EQUIVALENCE GATE evidence) and read access to `golden/tasks/**` | 8 (author of `eq/**`); 3 (author of `golden/tasks/**`, frozen after its step D8) | 8 for `eq/**`; 3 for `golden/tasks/**` (Phase 8 only reads, never edits) |
| `resolve-manifest.mjs` | 2 (manifest-shape fix), 6 (rename) | 2 |
| `.vc-version`, `.vc-installed-files`, `.vc-publish-config`, `.gitignore`, `export-benchmark-kit.mjs`, `process/_seeds`, CONTRIBUTING + 5 translations | 6 (rename + migration fallbacks) | 6 |
| `program-goal-charter-template.md` (mirror pair under `process/development-protocols/references/` and `.claude/skills/vc-generate-phase-program/references/`) | 6 (rename only) | FROZEN in Phases 4 and 5 (neither edits either copy); Phase 5's tester runs `cmp` on the pair (exit 0) |
| `.codex/agents/vb-*.toml` mirrors | 3 (content), 6 (rename), 7 (prose) | 3; Phase 1 does NOT claim `.codex/` (Codex toml has no model/effort fields) |
| `e2e-kit-flows.test.mjs` | 2 (comment/display name only), 6 (rename; keep-regions for Trial C seed block and `vc-team`-removed assertion), 8 (A0 BEFORE install tests: `fileURLToPath`, `os.tmpdir()` instead of `/tmp`, quoted forward-slash `bash` path) | 8 for the fix; 2 and 6 text only |
| `CONTRIBUTING.md` (+ switcher block cut to nothing at C0b), `docs/i18n/CONTRIBUTING.{ja-JP,ko-KR,pt-BR,vi-VN,zh-CN}.md` and `docs/i18n/SECURITY.*.md` (DOOMED, deleted by C0b), `.github/ISSUE_TEMPLATE/**` (`5.translation.yml` DOOMED), `.github/workflows/welcome.yml` | 2 (identity: English files only), 6 (rename), 8 C0b (deletions + CONTRIBUTING switcher) | 2; Phase 7 does NOT own the CONTRIBUTING translations' display name |
| `harness/clean-check.sh`, `harness/check-links.mjs` (task folder; C-CLEAN gate) and the C0b cleanup commit (deletions, README/README.vi-VN/CONTRIBUTING switcher cuts, CHANGELOG dead-link fix, `.gitignore`/`.git/info/exclude` entry) | 8 only (after B4 and its verdict commit, before C2a) | 8 |
| `README.md` Quick start + glossary sections (never separate files), `docs/i18n/README.vi-VN.md`, `scripts/check-docs.mjs`, `scripts/fixtures/check-docs/**`, `harness/phase7-*` helpers, `process/general-plans/backlog/vi-native-review_NOTE_29-10-26.md` | 7 | 7 (Phase 7 edits `docs/i18n/README.*.md` after Phase 2 and the Phase 6 rename; strictly ordered) |
| `golden/**` (task folder): scripts (`size-check.mjs`, `signal-census.mjs`, `conservation-check.mjs`, `pointer-check.mjs`, `parity-compare.mjs`, `gen-guardrails.mjs`, `run-record.mjs`), snapshots, `signal-census-phase3.txt`, `guardrails.json`, `runs/`, `old/`, `phase1/`; plus new `.codex/agents/references/` and backlog stub `process/general-plans/backlog/codex-agent-references-load_NOTE_29-10-26.md` | 3 (author; includes the frozen `golden/tasks/**`), 7 (reads `signal-census.mjs` + `signal-census-phase3.txt`), 8 (reads `tasks/**`, `run-record.mjs`, `gen-guardrails.mjs`, `guardrails.json`, `signal-census*.txt`, `start.sha`) | 3 |
| `p4-tools/**` (incl. `claim.txt`, `p4_start.txt`, `pointer-check.mjs`), `dedup-allowlist*.txt`, Phase 4 report / `p5-tools/**` (incl. `claim.globs`, `baseline.sha`), `proposed-new-skills.md`, Phase 5 report, backlog note `process/general-plans/backlog/vc-agent-browser-screenshots-untrack_NOTE_29-10-26.md` | 4 / 5 | 4 / 5 respectively (sequential on `main`; no branches) |
| `baseline/**` (task folder) | 0 (author); 1 adds `p1_start.txt` + one `validators.list` line; 2 adds `p2_start.txt` + `resolved_p2_start.<runtime>.txt`; all later phases read | 0 (Phase 6 never writes here) |
| `scripts/rename-prefix.mjs`, `scripts/test-rename-prefix.mjs`, `scripts/test-compute-sync-plan.mjs`, `.allowlist.txt`, `.path-allowlist.txt`, `scripts/fixtures/rename-prefix/**`, `legacy-hashes.json` and root `scripts/**` (manifest `kitOnly`, NOT `include`), hooks `legacy-config-fallback.test.cjs` in `.claude/hooks/lib/__tests__/` and `.codex/hooks/lib/__tests__/`, the 5 hook lib files per tree, `.gitignore`, `harness/` helpers and evidence pack (task folder) | 6 | 6 |
| `vc-manifest.json` readers (`install.sh`, `resolve-manifest.mjs`, `compute-sync-plan.mjs`, vb-update/vb-publish/vb-setup, `.gitignore`, `export-benchmark-kit.mjs`, `e2e-kit-flows.test.mjs`) | 2, 6, 8 | 6 (rename + fallbacks) |
| backlog stubs: native Windows, macOS, Linux-Node refusal | 8 | 8 |
| `harness/validators.vb.list`, `harness/compare-vb.sh`, `harness/runtime-map.txt`, `harness/signal-census-before.txt`, `harness/vc-colon-before.txt` (task folder, NOT protected `baseline/`) | 6 (author), 7, 8 (read) | 6 |
| `.agents/skills` | 0 (git mode 120000 via `update-index --cacheinfo`, text file in work tree) | 0 |
| `process/context/all-context.md` (Phase 0 vc-setup output; row added by PVL cycle 5 because the file holds 2 old-identity lines the Phase 2 `process/` grep would print: line 154 `flowser-logo.svg` in the repo tree, line 210 the `withkynam/vibecode-pro-max-kit` repo-URL note) | 1 (line 179, model-policy paragraph), 2 (identity lines 154 and 210 ONLY; edit BEFORE the Phase 2 `process/` grep), 6 (rename only, via the program rename set) | 1 for line 179; 2 for lines 154 and 210; all other lines are kept current at each phase's UPDATE PROCESS. Phase 2 must add this file to its claim in its PLAN-SUPPLEMENT (hand-off H1); Phases 4 and 5 do not touch it |

Verdict: no `reassign` needed. Phase 3 must not start while Phase 1 edits are uncommitted. Phase 1 no longer claims `.codex/` mirrors.

Planner's note (kept for reference): shared files are README.md (phases 1, 2, 6, 7), agent files (1, 3, 6, 7), `validate.yml` (1 only). These are safe because the phases are strictly ordered. No two phases overlap in time any more (Phase 4 then Phase 5, decision G); their claims are also disjoint in `phase-blast-radius-registry.md`.

---

## Autonomous Execution Rules (During /goal)

- The agent self-decides at V5 gates; CONDITIONAL proceeds with gaps on record; BLOCKED goes to backlog and continues where a path exists.
- Hard stops: push/remote tag/release/publish; any deletion of user content; billed model runs beyond the approved golden set (including the Phase 8 equivalence runs: count and cost acknowledged by the user first); a reproduced WORSE in the FINAL EQUIVALENCE GATE (blocks every release step until fixed or accepted by the user in chat); a red validator; cascade BLOCKED.
- User checkpoints that autonomy cannot skip: Phase 0 git identity email and interactive `vc-setup`; user acknowledgement of the exact run count and cost at Phase 8 B4.1, the single billed hard stop (rehearsal run + 18 CORE calls + any approved EXTENDED tasks); Phases 3, 4 and 5 have no billed call.
- Phase reports are the communication channel for conflicts and learnings.
- Subagent delegation (no inline execution) stays mandatory under autonomy.

---

## Global Constraints

- Never lower or delete a validator check; only add.
- QUALITY EQUIVALENCE (decision A): the golden task definitions in `golden/tasks/` are frozen after Phase 3 step D8 and are reused verbatim by Phase 8 step B4; no release step happens before `eq/verdict.md` ends with `EQ gate: PASS` or `EQ gate: ACCEPTED-BY-USER` for the commit being tagged.
- AGENTS.md BYTE BUDGET (decision E, standing contract from Phase 4 on): `test "$(wc -c < AGENTS.md)" -le 32768` holds at every later phase exit (Phases 5-8) and in the final tagged tree, because Codex reads only the first 32 KiB of `AGENTS.md`. The Phase 6 rename is length-neutral (`vc-` and `vb-` have the same length); any prose added later must keep the file within the limit.
- MODEL DIRECTION (decision B): no phase changes any agent's `model:`; no phase lowers any `effort:`; the only effort edit is execute, fast-mode, quick-fix `low` -> `max` in Phase 1.
- C-CLEAN (user decision C): the tagged tree equals the ALLOWED LIST (section `## Clean Final Tree (C-CLEAN)`); the cleanup commit C0b changes ONLY non-code paths (code paths byte-identical to the B4 FINAL commit); history is never rewritten; no commit lands on `main` after C0b except a fix followed by a full re-run of the C0b gate.
- SWEEP RULE corollary (C-CLEAN): before C0b the sweeps (Phase 2 R2.1, Phase 6 G5/G7) may exclude the DOOMED SET (list in the C-CLEAN section); the canonical SWEEP RULE wording is unchanged. After C0b the DOOMED SET does not exist, so DoD 3 holds without exclusions on the tagged tree.
- LICENSE guard (mandatory line of EVERY phase exit gate, carried by Phase 0 `baseline/compare.sh` so one place runs it after every phase): `grep -c "Copyright (c) 2026 vibecode" LICENSE` = 1 and `grep -c "Copyright (c) 2026 Tomwakeupat530amm" LICENSE` = 1. Proves C-SAFE-2 after each phase. Realization: Phases 0, 1, 2, 6, 7, 8 call `compare.sh`/`compare-vb.sh` in their exit-gate blocks and Phase 4 in its verification table; Phases 3 and 5 do not claim LICENSE and get the explicit `bash $B/compare.sh` line at their own PVL (residual R1); the goal-block TEST GATES apply the greps at every phase exit and the check is cumulative (the next `compare.sh` run catches any earlier damage).
- SWEEP RULE (canonical wording lives here; Phase 2 and Phase 6 implement it, see their gates): search the whole repo EXCLUDING `.git`, the program task folder `process/general-plans/active/vibebelt-rebrand_29-10-26/` (and its archived copy), `baseline/`, `golden/`, the rename script + its fixtures, `CHANGELOG.md` and `MIGRATION.md` (WHOLE-FILE protection: Phase 6 implements the history rule as a protected set, not as marker regions; in Phase 2 their old-identity lines are instead tagged `upstream-attribution`), and `legacyDeletions`. Old-identity lines that legitimately remain are only: (1) lines carrying the literal tag `upstream-attribution`; (2) the brand-detection lines in `.claude/skills/vc-audit-vc/scripts/validate-kit-portability.mjs`, `.claude/skills/vc-publish/SKILL.md` and `.claude/skills/vc-publish/references/vc-publish.md`. Phase 2 may additionally exclude the whole `process/` directory ONLY because at Phase 2 time `process/` holds no kit text beyond the task folder and Phase 0 generated context; its gate adds `grep -rIn "withkynam\|flowser" process --exclude-dir=vibebelt-rebrand_29-10-26` and expects no output.
- SWEEP RULE corollary (PVL cycle 5; the canonical wording above is unchanged): the Phase 2 `process/` grep expects NO output, but the Phase 0 generated `process/context/all-context.md` holds 2 old-identity lines (154 and 210, measured 2026-10-29). Phase 2 therefore OWNS those two lines (ownership table) and edits them before its `process/` grep. Until the Phase 2 plan carries that claim its exit gate is unsatisfiable; the Phase 2 PLAN-SUPPLEMENT / inner PVL must add it (hand-off H1).
- `.agents/skills` gate rule: the gate checks only that no failure OTHER than `.agents/skills` remains.
- `validate-all-context.mjs` is exit 0 in bare-kit mode BEFORE vc-setup (it is not a baseline red); after vc-setup it must still exit 0 with no `bare-kit mode` text (Phase 0 exit gate). The only expected baseline reds are `validate-skills` and `validate-context-discovery`, both caused by `.agents/skills`.
- After every phase that touches agent files, parity validator exits 0 before the phase is DONE.
- Vacuous-green ban: a developed behavior proven only by Known-Gap is never PASS; write a backlog stub and keep the gate CONDITIONAL.
- Test planning must load `process/context/tests/all-tests.md` (created by Phase 0 vc-setup) and its routing chain before assigning tiers; if it is empty or missing, emit `TIER_ASSIGNMENTS_BLOCKED` and return to RESEARCH.
- Commit each phase's execution changes before starting the next phase. Keep process/plan/context commits separate from execution commits.

---

## Clean Final Tree (C-CLEAN)

User decision C (2026-10-29, LOCKED): the tagged v1.0.0 tree is a complete, working kit with NOTHING extra. Full history is kept (no squash, no rebase, no force-push); only the final TREE is cleaned, by one dedicated commit `chore: prepare clean release tree` (step C0b, owned by Phase 8). Measured 2026-10-29 at HEAD 7845316: 561 tracked files; the original kit (`upstream-baseline`) shipped only `process/context/generated-skills-catalog.json` under `process/context/` and `.gitkeep` files under `process/features` and `process/general-plans`, so everything else under `process/` that is tracked today is Phase 0/program output.

### Step order inside Phase 8 (the Phase 8 plan must carry this verbatim)

`A0 -> A -> B1-B3 -> B4 (verdict commit `process: ...` stays in history) -> B4.8 -> C0 (EQ verdict line) -> C1 (release notes, CHANGELOG) -> C0a (write harness/clean-check.sh + harness/check-links.mjs, red first) -> C0b (cleanup commit) -> C0c (clean-check.sh + validators + smoke on the cleaned tree) -> C2-pre -> C2a (local tag on the cleanup commit) -> C2b -> C2c`. After C0b no commit lands on `main` unless it is a fix followed by a full re-run of C0a-C0c (then the tag is created or re-created on the final cleanup commit). Phase 8 UPDATE PROCESS bookkeeping after the tag stays on disk in the (untracked) task folder; it is not committed to `main` (CONCERN for the user: the final Phase 8 report then lives only on disk and in earlier `process:` commits).

C0b commands (executed by a spawned vc-execute-agent; gate run by a spawned vc-tester):

- `git rm -r --cached process/general-plans/active/vibebelt-rebrand_29-10-26` (and any archived copy under `process/general-plans/completed/`), then add the folder to `.git/info/exclude` (local only; files stay on disk; C0 evidence stays readable).
- `git rm` (work tree + index) of every other DOOMED path below.
- Edits (non-code, text only): cut the language-switcher block in `README.md`, `docs/i18n/README.vi-VN.md` and `CONTRIBUTING.md` to links that exist (README: English + Vietnamese only; VI README: English link + Vietnamese; CONTRIBUTING: remove the block; SECURITY.md: remove the block at the top of the file, found by content); fix every `CHANGELOG.md` link to MIGRATION.md (found by content; now about lines 217 and 234, dead once MIGRATION.md is gone) to plain text without a link; keep the Vietnamese README in sync with English after these edits.
- Re-run `harness/clean-check.sh` (below) and the validators; fix in the same commit until green; ONE commit.
- Also on the cleaned tree (sync 2026-10-30): `test "$(wc -c < AGENTS.md)" -le 32768` (AGENTS.md byte budget, decision E) and the Phase 2 CHANGELOG hooks-block deep-equality one-liner (expects `true`; text in the Phase 2 report) re-run because `.claude/settings.json` hooks may change in Phase 6.

### DOOMED SET (deleted by C0b; throw-away until then)

| Path / glob | Reason |
|---|---|
| `process/general-plans/active/vibebelt-rebrand_29-10-26/**` (plans, reports, `baseline/`, `golden/`, `eq/`, `harness/`, `p4-tools/`, `p5-tools/`, `results.tsv`, registry; plus any archived copy in `process/general-plans/completed/`) | program artifacts; stay in history and on disk |
| `process/general-plans/backlog/*_NOTE_*.md` (Phase 3/5/7/8 stubs) | internal maintainer notes; the user-run checklist must be in the release notes |
| `process/context/all-context.md`, `process/context/*.seed`, `process/context/planning/**`, `process/context/tests/**` | Phase 0 `vc-setup` output for THIS repo; the manifest excludes `all-context.md`, installed projects generate their own; the original kit did not track them |
| `process/features/_GUIDE.md`, `process/features/_feature-template/**`, `process/general-plans/{active,backlog,completed}/_GUIDE.md` | copies of `process/_seeds/**` (which ships) |
| `docs/GITHUB-LABELS.md`, `docs/GITHUB-SETTINGS.md`, `docs/GOOD-FIRST-ISSUES.md`, `MIGRATION.md` | user decision C2 (minimal docs) |
| `docs/i18n/README.{de,es,fr,hi,ja-JP,ko-KR,pt-BR,zh-CN}.md` | user decision C2 (8 languages removed) |
| `docs/i18n/CONTRIBUTING.*.md` (5), `docs/i18n/SECURITY.*.md` (5) | user decision C2 (translations removed) |
| `.github/ISSUE_TEMPLATE/5.translation.yml` | translation contributions no longer offered (only English and Vietnamese ship) |
| `scripts/rename-prefix.mjs`, `scripts/rename-prefix.*.txt`, `scripts/test-rename-prefix.mjs`, `scripts/fixtures/**`, `scripts/check-docs.mjs`, `docs/RELEASE-NOTES-1.0.0.md` | one-time maintainer tooling / evidence; release notes are written to `$TF/RELEASE-NOTES-1.0.0.md` instead of `docs/` and C2c uses `gh release create v1.0.0 -F $TF/RELEASE-NOTES-1.0.0.md` |

### ALLOWED LIST (the tracked files at the tag; anything else FAILS the gate)

Names are the final `vb-` names. Group A is mechanical (computed), B is a path rule, C is enumerated.

| Group | Item | One-line reason |
|---|---|---|
| A | every path in `node resolve-manifest.mjs --json` `.files` (include minus exclude of `vb-manifest.json`: `.claude/agents|skills|hooks/**`, `.claude/settings.json`, `.codex/**`, `CLAUDE.md`, `AGENTS.md`, `process/development-protocols/**`, `process/context/generated-skills-catalog.json`, `process/_seeds/**`; 415 files today) | this is what the installer copies |
| B | any tracked path under `.claude/**` or `.codex/**` that the manifest excludes from install (kit regression tests `__tests__/`, `tests/`, `*.test.*`, `package-lock.json`, `.gitignore`/`package.json` of the sequential-thinking skill; 48 such tracked paths at HEAD) provided it is not a DOOMED/deny-pattern path; plus `.agents/skills` (manifest `symlinks`, index mode 120000) | the original kit tracked them; they are kit source, not program artifacts |
| C | `README.md` | English front door |
| C | `docs/i18n/README.vi-VN.md` | Vietnamese README (user decision C2) |
| C | `LICENSE`, `CHANGELOG.md`, `SECURITY.md`, `CONTRIBUTING.md` | user decision C2 (English only) |
| C | `install.sh`, `resolve-manifest.mjs`, `compute-sync-plan.mjs`, `vb-manifest.json`, `legacy-hashes.json` | installer, resolver, updater, manifest, updater hash table (read at runtime from the kit; manifest `kitOnly`) |
| C | `e2e-kit-flows.test.mjs`, `scripts/test-compute-sync-plan.mjs` | tests of the shipped installer/updater (kept only if standalone: the gate runs both on the cleaned tree) |
| C | `.gitignore`, `.gitattributes`, `.markdownlint.json` | repository hygiene present in the original kit |
| C | `.github/workflows/validate.yml`, `.github/workflows/release.yml`, `.github/release.yml` | CI validator suite; release workflow and notes categories |
| C | `.github/workflows/labeler.yml`, `.github/labeler.yml` | path-based PR labels; verified independent of the removed docs (globs `.claude/skills/**`, `*.md`, `docs/**` only, no file names) so KEPT |
| C | `.github/workflows/welcome.yml` | greets first-time contributors; links only `CONTRIBUTING.md` (kept) once Phase 2 removes the WhatsApp link, so KEPT |
| C | `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/{1.bug_report,2.feature_request,3.skill_submission,4.agent_submission}.yml`, `.github/ISSUE_TEMPLATE/config.yml` | contribution intake for a published repo |
| C | `assets/<files>` that `README.md` or `docs/i18n/README.vi-VN.md` reference (the Phase 2 local images; today `assets/flowser-logo.svg`, whose replacement is a Phase 2 matter) | images the README actually shows; any unreferenced asset FAILS |
| C | `process/features/.gitkeep`, `process/general-plans/{active,backlog,completed}/.gitkeep` | empty skeleton the original kit shipped |

### Gate `harness/clean-check.sh` (written by C0a red-first; run on HEAD after C0b, again on the tag; exit 0 required)

1. CC1 allowed-list diff: `git ls-files | sort` minus (Group A resolver output + Group B rule + Group C list) must be EMPTY, and every Group A and Group C path must be tracked (no MISSING).
2. CC2 deny patterns over `git ls-files` outside `.claude/` and `.codex/`: no `vibebelt-rebrand`, no `results.tsv`, no `(^|/)(golden|baseline|eq|harness|p4-tools|p5-tools)/`, no `process/context/` path except `generated-skills-catalog.json`, no `*.seed` under `process/context`, no `process/general-plans/backlog/*_NOTE_*`, no `docs/i18n/` file other than `README.vi-VN.md`; and no `QUICKSTART`/`GLOSSARY` path anywhere (never created).
3. CC3 link check (`harness/check-links.mjs`): every relative `](target)`, `href="target"` and `src="target"` in `README.md`, `docs/i18n/README.vi-VN.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `SECURITY.md` (skip http(s)/mailto/#anchors, strip `#fragment`) resolves, relative to the file, to a tracked file (`git ls-files --error-unmatch`). Switcher blocks: README.md lists no `docs/i18n/README.` link other than `README.vi-VN.md`.
4. CC4 byte identity of code: `git diff --name-only $(cat $EQ/final-sha.txt) HEAD -- .claude .codex CLAUDE.md AGENTS.md process/development-protocols process/_seeds install.sh resolve-manifest.mjs compute-sync-plan.mjs vb-manifest.json legacy-hashes.json` prints nothing (the B4.8 pathspec plus `legacy-hashes.json`; reuse B4.8); and `git diff --name-only --diff-filter=ACMRT $(cat $EQ/final-sha.txt) HEAD` lists only non-code paths (`README.md`, `docs/**`, `CONTRIBUTING.md`, `CHANGELOG.md`, `.github/**`).
5. CC5 validators on the cleaned tree: the Phase 8 validator suite via `compare-vb.sh` against the BARE-KIT reference (`validators_before`, mapped), because the cleaned tree carries no `vb-setup` output; `validate-all-context` must still exit 0 in bare-kit mode; plus `git diff --check`. After C0b the validators on the cleaned tree compare against the bare-kit baseline `validators_before` (Linux node), mapped. Phase 8 MUST pin the exact `compare-vb.sh` argument/CLI after Phase 6 creates it (no guessing before then); not worse than the bare-kit baseline is the rule.
6. CC6 smoke: re-run the Phase 8 fresh-install trial (B1) from the cleaned tree (`VB_KIT_SOURCE=<path>`) and `node --test e2e-kit-flows.test.mjs` plus `node scripts/test-compute-sync-plan.mjs` under Linux Node 22; failures not worse than the B3 results.
7. CC7 history: `git merge-base --is-ancestor $(cat $EQ/final-sha.txt) HEAD` true; `git rev-list --count HEAD` is at least the count recorded at B4.7 plus 1; `git tag -l upstream-baseline` still present; no `git push --force` anywhere.
8. CC8 tag: after C2a, `git ls-tree -r --name-only v1.0.0 | sort` equals `git ls-files | sort` at HEAD and passes CC1-CC3.

Proof mapping: C-CLEAN is Fully-Automated (CC1-CC4, CC7, CC8) plus Hybrid (CC5-CC6). Known-Gap rows: none; native Windows/macOS install of the cleaned tree stays inside C-P8r.

### Phase-plan wording needed (owners add at their own PVL; this umbrella does not edit them)

- Phase 2: identity, image and WhatsApp edits cover `README.md`, `docs/i18n/README.vi-VN.md`, English `CONTRIBUTING.md`, `SECURITY.md`, `.github/**` (except `5.translation.yml`); SKIP the 8 other README languages, the 10 CONTRIBUTING/SECURITY translations, `docs/GITHUB-*.md`, `docs/GOOD-FIRST-ISSUES.md` and `MIGRATION.md` (DOOMED). Gates R2.1, R2.2, R2.10 and R2.14 exclude the DOOMED SET through ONE shared filter file `$P/harness/doomed.regex` (`grep -vE -f`); WhatsApp gate R2.14 works ONLY with that filter (the 5 doomed CONTRIBUTING translations keep the link until C0b).
- Phase 6: no edit effort for doomed files (the script processes them automatically); drop step B6 (MIGRATION banner) and residual R4; keep `legacy-hashes.json` in `kitOnly`.
- Phase 7: README.md and README.vi-VN.md only; QUICKSTART/GLOSSARY files are NEVER created (user decision): a short 'Quick start' section and a plain-language glossary table go INTO both READMEs, concise so the README stays navigable; `check-docs.mjs` checks apply to those README sections (EN/VI heading parity for them, term coverage, exactly one install command, signal census); remove the 8 "may be outdated" banners from scope and `check-docs.mjs` check for them; replace with "switcher links resolve to existing files"; Phase 1 still edits all 10 READMEs as validated.
- Phase 8: add steps C0a, C0b, C0c as above between C1 and C2-pre; C1 writes release notes to `$TF/RELEASE-NOTES-1.0.0.md`, not `docs/`; C2c uses `-F $TF/RELEASE-NOTES-1.0.0.md`; C2a tags the cleanup commit; Exit Gate adds `bash harness/clean-check.sh` (exit 0) and `git ls-tree` equality at the tag; the user-run known-gap checklist is copied into the release notes body because the backlog stubs leave the tree.

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
| 0 — Foundation | ✅ VERIFIED |
| 1 — Fix inconsistencies | ✅ VERIFIED |
| 2 — Identity and distribution | ✅ VERIFIED |
| 3 — Instrument and freeze (no slimming) | ⏳ PLANNED |
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
| Phase 3 instruments are wrong or blind (census misses a signal class, guardrail heading rule too loose) so later checks pass vacuously | Medium | fixture unit tests with named token classes and heading cases; non-empty and 15-agent guards; double-run determinism |
| Rename misses a computed `vc-` string (Phase 6) | Medium | dry-run review, fixtures, grep sweep, e2e test, Phase 8 real install |
| Updater deletes user-edited files | Low, severe | delete only unmodified kit-owned files; Hybrid test with modified file |
| Windows/macOS cannot be tested here | High | documented residual, user-run checklist, gate CONDITIONAL for those |
| Golden runs cost money/time | Medium | cap at 3 tasks, report run count before starting |
| Headless golden tasks stop at a RIPER-5 gate or never spawn the intended agent | Medium | tasks start at the phase under test with fixture artifacts (Phase 3 D1-D2); Phase 8 runs ONE acknowledged rehearsal first; `run-record.mjs subagents` + judge rule marks such runs INVALID |
| Baseline already red (`.agents/skills` plain file; Linux node v22.23.4 is installed, so WSL gates are runnable) | High | red = worse than Phase 0 baseline; Phase 0 repairs `.agents/skills`; node.exe fallback; e2e recorded baseline-red / NOT TESTED with cause |
| Final kit is worse than the old kit in behaviour or output quality (any phase, esp. rename, doc rewording, effort max) | Medium | agents untouched in Phase 3 (decision D); Phase 8 FINAL EQUIVALENCE GATE re-runs the same frozen tasks on old vs final before any release step; mechanical evidence re-run; reproduced WORSE blocks release |
| Cleanup (C0b) deletes something the kit needs, or leaves a dead link / program artifact in the tag | Medium | explicit ALLOWED LIST + mechanical `clean-check.sh` (allowed-list diff, deny patterns, link check), code byte-identity against the B4 FINAL commit, validators + install smoke + e2e re-run on the cleaned tree, tag only after the gate; history untouched so any deletion is revertible |
| Golden tasks drift between Phase 3 and Phase 8, or the old-kit sandbox cannot be rebuilt | Medium | definitions frozen with sha256 in `golden/tasks/` (Phase 3 D8); exact sandbox recipe and run flags recorded (D5, D6); Phase 8 checks the freeze before starting; both kits re-run at Phase 8 time |
| Phase 4 breaks references from 44 skill files and 32 agent/codex files | Low | Phase 4 renames or deletes no file and no heading; repo-wide pointer-check before/after (4 fixed, 0 new); protocol-wiring before reporting |
| Renamed agents not spawnable in the same session | Medium | restart checkpoint before Phase 7 |
| `resolve-manifest.mjs` returns no files after version bump to 1.0.0 | Medium | manifest-shape detection in Phase 2 with `files.length > 0` gate |

---

## Touchpoints

- Phase 0: git, LICENSE, process/context/**; Phase 1: 3 agent `effort:` lines (no model change), new validator, model-policy docs, README/i18n counts and model facts, CI
- Phase 2: install/update/publish scripts, community docs, README header, assets, manifest/CHANGELOG
- Phase 3: task-folder `golden/**` only (agents read-only); Phase 4: AGENTS.md, orchestration.md, all-development-protocols.md (CLAUDE.md byte-identical)
- Phase 5: skill front-matters, `vc-intent-clarify` split, catalog; Phase 6: whole kit via one script
- Phase 7: README top, Quick start section and glossary table inside README (no separate files), message wording; Phase 8: FINAL EQUIVALENCE GATE (`eq/**`), temp sandboxes, release docs, tag

---

## Public Contracts

- RIPER-5 workflow, phase locks, status codes and every signal string unchanged.
- Installer behavior and manifest schema unchanged (only source repo, version, and renamed paths change).
- Names change deliberately once: `vc-` to `vb-`, with upgrade cleanup.

---

## Blast Radius

Program-level: essentially the whole kit repository. Per-phase claims live in `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-blast-radius-registry.md` (phases 4 and 5 are disjoint and run sequentially).

---

## Verification Evidence

| Gate / Scenario | Strategy | Proves SPEC criterion |
|---|---|---|
| Per-phase Exit Gate command blocks (each phase plan) | Fully-Automated | C-P0..C-P8 |
| Full validator suite vs Phase 0 baseline after every phase | Fully-Automated | all (regression checkpoint) |
| Phase 3 instruments: `node --test golden/test/`, census/guardrails double-run `cmp`, agents `git diff --stat b17294d` empty, `golden/runs` empty | Fully-Automated | C-P3 |
| Golden task definitions frozen (`golden/tasks/` + `FROZEN.sha256`, Phase 3 D8; re-verified at Phase 8) | Fully-Automated | C-P3, C-EQ (inputs) |
| FINAL EQUIVALENCE GATE (Phase 8 B4): scripted rubric, `compare-vb.sh` exit 0, signal census diff after VC-/VB- mapping, guardrail identity | Fully-Automated | C-EQ |
| FINAL EQUIVALENCE GATE e2e trials (Linux Node) | Hybrid | C-EQ |
| FINAL EQUIVALENCE GATE blind pairwise judge, old vs final, 3 tasks x 2 replicates | Agent-Probe (judgement; named residual, never the sole proof) | C-EQ |
| C-CLEAN gate (Phase 8 C0b): allowed-list diff (`git ls-files` vs resolver output + enumerated set), deny-pattern grep, link check on 5 docs, B4.8 pathspec diff, `git merge-base --is-ancestor` history check | Fully-Automated | C-CLEAN |
| C-CLEAN smoke on the cleaned tree: validators not worse than the bare-kit baseline, fresh-install trial and e2e re-run | Hybrid | C-CLEAN, C-EQ (no code drift) |
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
- Last completed phase: Phase 0 (Foundation) COMPLETE_WITH_GAPS (EVL green; closeout commit `7845316`); report `phase-00-foundation_REPORT_29-10-26.md`
- Validate-contract status: umbrella = written (2026-10-29), Gate: PASS (PVL cycle 5, generated-by outer-pvl, re-validated after user decisions A and B and after Phase 0 closed); the earlier cycle-3 contract and the Inner Loop Refresh Note are superseded. Phase 0 = consumed. Phases 1, 3 and 8 carry refresh notes: their inner PVL restarts at V1. Phases 2, 4, 5, 6, 7 each still need their own PVL before EXECUTE. Phase 2 needs hand-off H1 (the `process/context/all-context.md` claim) first
- Supporting context files: phase-blast-radius-registry.md, CLAUDE.md, `process/development-protocols/phase-programs.md`
- Next step for a fresh agent: the orchestrator emits the /goal block (the Stable Program Goal above), commits the pending plan-only edits as a separate process commit (R6), then spawns vc-research-agent (opus, front-matter) for Phase 1 (RESEARCH, step 1 of the 7-step loop). Phase 1 PVL (step 4) happens inside the Phase 1 loop.
- Current phase: Phase 1 - Fix inconsistencies
- Next action: "Spawn vc-research-agent (opus, front-matter) for Phase 1"

---

## Current Execution State

Last updated: 2026-10-29
Completed phases: Phase 0 (Foundation) COMPLETE_WITH_GAPS; Phase 1 (Fix inconsistencies) COMPLETE_WITH_GAPS; Phase 2 (Identity and distribution) COMPLETE_WITH_GAPS
Current phase: 3 of 9
Phase 3 name: Instrument and freeze (no slimming)
Phase 3 status: IN_PROGRESS (inner loop, step 4 PVL)
Phase 0 name: Foundation
Phase 0 status: DONE (COMPLETE_WITH_GAPS; named residuals K0-1 and K0-2 carried to Phase 8 backlog stubs)
Phase 0 EVL: green (independent vc-tester run PASS, 38 rows)
Phase 0 report: process/general-plans/active/vibebelt-rebrand_29-10-26/phase-00-foundation_REPORT_29-10-26.md
Phase 1 name: Fix inconsistencies
Phase 1 status: DONE (COMPLETE_WITH_GAPS; execution commit 1733f7b, baseline commit e188368; residuals K1-1 registry docs in Phase 4, K1-2 real-runner CI in Phase 8, K1-3 risk-artifacts fixtures backlog; translation probe R1.10/R1.13 PASS)
Phase 1 EVL: green (independent vc-tester run PASS on every runnable Exit Gate row; mutation test and positive control passed; compare.sh exit 0)
Phase 1 report: process/general-plans/active/vibebelt-rebrand_29-10-26/phase-01-fix-inconsistencies_REPORT_29-10-26.md
Phase 2 name: Identity and distribution
Phase 2 status: DONE (COMPLETE_WITH_GAPS; P2_START a3cc0cf; execution commit b80abad, process commit 0812325, follow-up fix commit 0333ed8; version reset to 1.0.0; residuals K2-1 e2e Trial C in Phase 6 B4 and Trial D plus native runs in Phase 8, K2-2 GitHub-side settings and live links in Phase 8)
Phase 2 EVL: green (independent vc-tester PASS on 0812325: every runnable row, 4 mutation tests, resolver negative control, local install trial 416 = 416 files; Agent-Probe R2.12/R2.13 passed after fixes in 0333ed8). EVL addendum for 0333ed8: PASS (independent vc-tester re-run on 2026-10-29)
Phase 2 report: process/general-plans/active/vibebelt-rebrand_29-10-26/phase-02-identity-distribution_REPORT_29-10-26.md
Next phase: 3 - Instrument and freeze (no slimming) (phase-03-slim-agents_PLAN_29-10-26.md)
Current loop step: PVL (Phase 3, step 4). The user resumed on 2026-10-30. Phase 3 inner PVL cycle 1 was CONDITIONAL (M1 `node --test` directory argument, M2 TOML escapes); both fixed by the PVL supplement of 2026-10-30, so re-validate Phase 3 from V1. Phases 4 and 5 were re-scoped on 2026-10-30: Phase 5 inner PVL = Gate: PASS; Phase 4 second PVL pass pending. Phase 3 has no cost gate and makes no billed call (decision D, 2026-10-30); the only billed hard stop is Phase 8 B4.1.
Validate-contract status: umbrella = written (2026-10-29), Gate: PASS (outer-pvl); Phases 0, 1 and 2 = Gate: PASS (inner), consumed; Phases 3-8 = outer-pvl contracts, each needs its own inner PVL before EXECUTE
Program Net Gate: PASS at umbrella level; C-P8r (native Windows / macOS) stays CONDITIONAL inside Phase 8
Latest validator run: `bash baseline/compare.sh` exit 0 on 2026-10-29 after Phase 2 (Linux node 22.23.4; NOTE new validator validate-model-effort-policy; 29 rows in baseline/validators.list; validate-skills and validate-context-discovery red only because `.agents/skills` is a text file on drvfs; e2e-kit-flows red, K0-1). 38 validators on disk. Reference files: `baseline/validators_after_setup.tsv` (Linux node) and `.node-exe.tsv` (node.exe).
Git state: branch main, HEAD 0333ed8, no remote, nothing pushed; tag `upstream-baseline` = 005744e; Phase 2 start marker a3cc0cf; Phase 2 commits b80abad (chore, 21 files), 0812325 (process), 0333ed8 (fix); uncommitted: this UPDATE PROCESS closeout (Phase 2 report and plan checkboxes, umbrella state and C0b line, results.tsv, harness/verification.json, two context docs) - commit as a process commit
Phase 2 hand-offs: (1) `author: vibecode-pro-max-kit` in 19 files -> Phase 6; (2) CHANGELOG hooks block is a COPY of `.claude/settings.json` hooks: Phase 8 re-runs the deep-equality one-liner (expects true) after any Phase 6 hook change; (3) Phase 8 C0b removes the language switchers and dead MIGRATION.md links in CHANGELOG.md, SECURITY.md, CONTRIBUTING.md and both READMEs (found by content); (4) user-run GitHub settings (Private vulnerability reporting, Discussions, Sponsorship OFF, replacement community channel) go to RELEASE-NOTES-1.0.0.md in Phase 8.
Model facts after Phase 1: 7 opus (execute, fast-mode, quick-fix, plan, research, tester, validate) and 8 sonnet; effort low -> max on execute, fast-mode, quick-fix. Sessions started before Phase 1 hold the old CLAUDE.md: spawns of plan, research, validate and tester must not pass a model override.

Loop step values: RESEARCH | INNOVATE | PLAN-SUPPLEMENT | PVL | EXECUTE | EVL | UPDATE-PROCESS
Orchestrator rule: read "Current loop step" and "Validate-contract status" before spawning any subagent. Never spawn execute-agent when loop step is RESEARCH, INNOVATE, PLAN-SUPPLEMENT, or PVL.

Note: the Stable Program Goal above is fixed. This section is the only part that changes — update-process-agent rewrites it after every phase closeout (overwrite, not append).

---

## Inner Loop Refresh Note: 2026-10-29 — changed sections: Locked Decisions, Program Goal Charter, Acceptance criteria, Stable Program Goal, Phase Ordering, Strategy Recommendation per Phase, Per-Phase Entry / Exit Gates, Per-Phase Loop, Pre-PVL Conflict Resolution, Autonomous Execution Rules, Global Constraints, Risk Predictions, Touchpoints, Verification Evidence, Resume and Execution Handoff. Invalidates prior validate-contract.

User decisions A (quality-equivalence is a hard requirement; Phase 8 FINAL EQUIVALENCE GATE) and B (keep opus, fix the documentation). The Validate Contract below predates both and must be re-run from V1; statements in it about a Phase 1 model downgrade (opus to sonnet) or its Phase 3 measurement are superseded.

RESOLVED by the Validate Contract below (PVL cycle 5, 2026-10-29, written after this note): the contract was re-run from V1 on the real repo and replaces the earlier one.

---


## Validate Contract

Status: PASS
Date: 29-10-26
date: 2026-10-29
generated-by: outer-pvl
supersedes: 2026-10-29 (outer-pvl, PVL cycle 3 PASS) - this PVL cycle 5 contract REPLACES it entirely and also supersedes the two refresh notes: the "Inner Loop Refresh Note: 2026-10-29" (user decisions A and B) and the later "Supplement (user decisions 2026-10-29)" blocks. Same calendar day (the session date is 2026-10-29, so no later date can be justified); order is established by position in the file (this contract was written after the refresh note and after Phase 0 closed at commit 7845316) and by the `Evaluated-after` line below.
Evaluated-after: Inner Loop Refresh Note 2026-10-29 (resolved by this contract); HEAD 7845316 plus uncommitted plan-only edits to the umbrella and phase plans 2, 4, 5, 6, 7
Scope: UMBRELLA plan only. The registry, `results.tsv`, the Phase 0 report and phase plans 1-8 were read to cross-check umbrella claims; no phase plan and no registry file was edited. Each phase plan still needs its own PVL pass before that phase's EXECUTE, and Phases 1, 3 and 8 carry refresh notes that force their inner PVL to restart at V1. This contract does not authorize EXECUTE of any phase.

Parallel strategy: sequential (read-only re-validation by one agent that has no spawn tool; Layer 1 and Layer 2 ran in-line)
Rationale: score 4/7 (S1 multi-area, S4 phase program, S6 installer/runtime surface, S7 many files); dominant signal S4. The evidence was targeted file and command checks on the real repo, so no fan-out was needed. Next fan-out: a per-phase PVL (agent team, one validator per phase plan, disjoint plan files; for Phase 1 the inner PVL restarts at V1).

Evidence base (re-measured in this pass, not taken from earlier verdicts; Linux `node` v22.23.4, WSL git):
- Repo: HEAD `7845316`; tag `upstream-baseline` = `005744e` (521 files); `.agents/skills` is a 17-byte text file in the work tree and mode 120000 in the index; `git config user.name` = `Tomwakeupat530amm`, `user.email` = `minhnguyentuan31103@gmail.com`; no remote; `.claude/skills/vc-agent-browser/screenshots/` is in `.gitignore` (line 10) and 0 screenshot files are tracked; uncommitted: 7 plan files in the task folder (umbrella, phases 1-2 and 4-7 (phase 1 was edited by another actor while this pass ran; this agent did not touch it)), process-only.
- `bash $T/baseline/compare.sh` exit 0 ("nothing worse than validators_after_setup.tsv"); `grep -c "Copyright (c) 2026 vibecode" LICENSE` = 1; `grep -c "Copyright (c) 2026 Tomwakeupat530amm" LICENSE` = 1; `compare.sh` lines 83-89 carry the LICENSE RULE (both greps and `git diff upstream-baseline -- LICENSE | grep -c '^-[^-]'` = 0).
- `validate-plan-artifact.mjs` on this umbrella: 0 failures, 0 warnings; `validate-umbrella-artifact.mjs`: 0 failures (the expected "not under process/features" warning only).
- Stable Program Goal: 3969 characters before the START-line fix and 3957 after it (limit 4000; ASCII only, so characters = bytes); sections in order SESSION GOAL, TARGET, AUTONOMY, PER-PHASE LOOP, HARD STOPS, SAFETY, TEST GATES, VALIDATE CONTRACT, START (the 7 required sections in the required order plus the extra AUTONOMY block); it carries the C-EQ TARGET bullet, the EQUIVALENCE GATE hard stop, the three cost acknowledgements (Phase 3 A0, Phase 4 0.5a, Phase 8 B4.1) and the Phase 6 restart stop.
- Agents on disk: 7 opus (execute, fast-mode, quick-fix, plan, research, tester, validate) and 8 sonnet; the three execution agents are `effort: low` today (Phase 1 moves them to `max`); `.codex/config.toml` is a single global model; 15 agents, 33 skills, 9 `docs/i18n/README.*.md`, 37 `validate-*.mjs` on disk (Phase 1 adds the 38th); README model-claim grep prints 14 hits and 30 RED agent-table lines today (Phase 1 targets, as planned); every model-fact line number in the registry and Phase 1 (CLAUDE.md 128-141, implementation-standards 74-76, orchestration 35, 04-research 23, 07-plan 29, 08-validate 23 and 25, strategy-compare 22-34 and 186, all-context 179) was found at exactly those lines.
- Every script path named in a gate exists now (the validators in `vc-audit-vc`, `vc-audit-context`, `vc-audit-plans`, `vc-generate-plan`, `vc-generate-phase-program`, `generate-skills-catalog.mjs`, `resolve-manifest.mjs`, `e2e-kit-flows.test.mjs`) or is created by a named earlier step (`validate-model-effort-policy.mjs` + fixtures: Phase 1 B1/B2; `golden/**` incl. `golden/tasks/**` + `FROZEN.sha256`: Phase 3; `p4-tools`, `p5-tools`: Phases 4-5; `scripts/rename-prefix.mjs`, `harness/compare-vb.sh`, `validators.vb.list`: Phase 6; `scripts/check-docs.mjs`: Phase 7; `eq/**`: Phase 8). `baseline/` holds `compare.sh`, `run-validators.sh`, `validators.list`, both runtime reference sets.
- Old-identity text: 28 files outside the task folder (27 in the Phase 2 groups plus `process/context/all-context.md`); the `process/` grep prints 2 lines (all-context.md 154 and 210). WhatsApp invite: 8 lines in 7 files.

Closure of the points the caller asked to verify:

| Point | Result | Evidence |
|---|---|---|
| Charter, DoD item 8, C-EQ, hard safety constraint agree with Phases 1, 3, 8 | CONSISTENT | Phase 3 A1-A5 freeze `golden/tasks/` with `FROZEN.sha256` before the first model run; Phase 8 P5, B4.0-B4.8, C0 re-check the freeze, ack cost (12 task runs + 6 judge calls = 18), bind the verdict to `eq/final-sha.txt`, and C0 requires `grep -cE '^EQ gate: (PASS\|ACCEPTED-BY-USER)' eq/verdict.md` = 1; DoD 8 last-line contract matches; Phase 1 plan has no `model:` change (diff gate counts 0 `^[+-]model:`) |
| Decision B (keep opus, fix docs) | CONSISTENT | umbrella locked rows, Strategy table, goal block ("7 opus, 8 sonnet; none changed"), Phase 1 A1 table and F-TEXT-1..7, Phases 2, 4, 5, 6, 7 supplements (each re-runs or preserves the Phase 1 claim grep); no phase plan still carries an opus-to-sonnet downgrade (the "downgrade" hits in Phases 2 and 8 are about version downgrades) |
| Phase 1 runs before Phases 2 and 4 on model-fact sites | CONSISTENT | Phase Ordering; registry "Order" lines; Pre-PVL row for CLAUDE.md / protocols / strategy-compare / all-context; Phase 2 and Phase 4 supplement gates re-run the exact Phase 1 grep |
| Screenshots excluded, 521-file baseline, follow-up ignore commit | VERIFIED on disk | tag tree 521 files; `.gitignore` line 10; 0 tracked; Phase 5 reworded to non-destructive note only |
| WhatsApp link removal | CONSISTENT | Phase 2 B2c + gate R2.14 (`grep -rn "chat.whatsapp.com" . --exclude-dir=...` no output); count wording differs (8 measured, 9 in the plan) but the gate is count-independent |
| Real e-mail | VERIFIED | `git config user.email` = the confirmed address; Phase 0 A0 ticked |
| golden/ and eq/ inside the protected task folder | CONSISTENT | Phase 6 sweep and protected set exclude `$TF` (`golden`, `eq`, `baseline`, `harness`); registry and Pre-PVL rows own `golden/**` (Phase 3) and `eq/**` (Phase 8) |
| MIT line protection | VERIFIED | `compare.sh` enforces both greps and the zero-removed-lines diff on every run; Phases 0, 1, 2, 6, 7, 8 call `compare.sh` / `compare-vb.sh`; Phases 3, 4, 5 do not (RESIDUAL R1; backstop = next phase run + goal-block TEST GATES) |
| Cost acknowledgements and outward actions | COVERED | goal block HARD STOPS and Autonomous Execution Rules list push, remote tag, GitHub release, publish, user-content deletion, billed runs beyond the approved set, Phase 3 A0 / Phase 4 0.5a / Phase 8 B4.1, the equivalence gate, Linux Node install, the restart stop; Phase 8 hard-stop hygiene keeps each push behind its own go |
| Registry vs phase plans | CONSISTENT except R2 | claim lists for Phases 0-8 match the umbrella ownership table; one claim was missing (M1 below) |

Defects found in this pass and FIXED in place in the umbrella (MUST-FIX 3 found, 3 closed, 0 unresolved at umbrella scope):
- M1 (gate unsatisfiable as written): the Phase 2 `process/` grep (`grep -rIn "withkynam\|flowser" process --exclude-dir=vibebelt-rebrand_29-10-26`, expected no output, part of the SWEEP RULE justification) prints 2 lines today, both in the Phase 0 generated `process/context/all-context.md` (line 154 `flowser-logo.svg`, line 210 the `withkynam/vibecode-pro-max-kit` repo-URL note), and no phase claims that file for identity edits. The earlier contract's statement "`process/` holds zero old-identity text" was true before Phase 0 and is now false. Fix: new ownership row (Phase 1 keeps line 179, Phase 2 owns lines 154 and 210, edit before its `process/` grep) and a SWEEP RULE corollary in Global Constraints (canonical SWEEP RULE wording is unchanged, so Phase 2 B0b's verbatim copy still matches). CARRIED HAND-OFF H1 (not an umbrella defect): the Phase 2 plan and registry do not yet list the file; Phase 2's PLAN-SUPPLEMENT or inner PVL must add the claim and the two-line edit, otherwise Phase 2's own exit gate cannot pass. This does not affect the umbrella gate.
- M2 (state inaccurate, would mis-route the first spawn): the Stable Program Goal START said "Phase 0, ... Spawn vc-research-agent for Phase 0"; Resume handoff said "planning is the last completed phase, current phase 0"; Current Execution State said the closeout commit was pending, listed the commit range `005744e..1e81834` as the Phase 0 execution commits (1e81834 and 746045b are process commits; the real execution commits are 005744e, 2627c28, 8b73f41, 3d9167d), used the legacy label `1a-research`, and called the umbrella contract stale. All rewritten to the verified state (Phase 0 DONE at 7845316; next = Phase 1, step RESEARCH).
- M3 (contract contradicted locked decision B): the superseded contract still said Phase 1 downgrades research/plan/validate/tester to sonnet, that the downgrade is measured by Phase 3, and that `golden/old/` is the "Phase 1 model-change measurement". This contract replaces it; the "What this coverage does NOT prove" and test-gate rows now state the real mechanism.

Test gates (C3 5-column table; developed behaviors and the gate that proves each):

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P0 | git history, `upstream-baseline` tag (521 files), baseline before and after `vc-setup`, `.agents/skills` mode 120000, `all-context.md` + `all-tests.md`, both LICENSE lines | Fully-Automated | already green (EVL 38 rows PASS; re-checked here): `bash $T/baseline/compare.sh` exit 0, `git tag -l upstream-baseline`, `git ls-files -s .agents/skills \| cut -c1-6` = 120000, both LICENSE greps = 1 | A (proven now) |
| C-P1 | model/effort policy validator fails on drift, passes on the real table (7 opus / 8 sonnet, `effort: max` on the three execution agents, `low` on git-manager); no `model:` line changes; model-fact docs and README say the real policy; CI lists every validator; one validator count | Fully-Automated | Phase 1 Exit Gate: `validate-model-effort-policy.mjs` on `--root fixtures/model-effort-pass` (0), `--root fixtures/model-effort-fail` (non-zero), real agents (0); `git diff -U0 $P1_START -- .claude/agents \| grep -cE '^[+-]model:'` = 0; claim grep R prints nothing; 30 RED loop prints nothing; `bash $B/compare.sh` exit 0 | B (built by Phase 1) |
| C-P2 | no old identity outside tagged attribution and brand-detection lines (incl. the `process/` grep), no hotlinked images, WhatsApp link gone, version 1.0.0, resolver returns files | Fully-Automated | Phase 2 Exit Gate R2.1-R2.14 (R2.1 pipeline, `process/` companion grep, `grep -rn "chat.whatsapp.com"`, `resolve-manifest --json` `files.length > 0`, `grep -c '^## \[1.0.0\]' CHANGELOG.md` = 1); the `process/` row needs hand-off H1 | B (built by Phase 2; H1 required) |
| C-P3 | agents at least 25 percent smaller, signal census identical, conservation and guardrail hashes identical, parity green, golden task definitions frozen | Fully-Automated | `golden/size-check.mjs`, `signal-census.mjs`, `conservation-check.mjs`, `pointer-check.mjs`, `parity-compare.mjs`, `(cd golden/tasks && sha256sum -c FROZEN.sha256)`, `validate-agent-parity.mjs`, `validate-agent-frontmatter.mjs`, `validate-protocol-wiring.mjs` | B (built by Phase 3) |
| C-P3q | each slimmed agent answers equal or better than the same-model unslimmed agent (revert only the worse agent) | Agent-Probe | blind pairwise judge per `golden/tasks/judge.md`, 2 replicates, NEW vs `golden/phase1/`; `golden/old/` reported as pre-program control only; cost acknowledged at Phase 3 A0 first. Named residual (never the sole proof: C-P3 scripted gates must also be green) | B (built by Phase 3); judge verdict = named residual, gap D (recorded in the Phase 3 report) |
| C-P4 | one source for shared docs, wiring intact, no unjustified leftovers, Phase 1 model text preserved | Fully-Automated | `validate-protocol-wiring.mjs`, `validate-guide-sync.mjs`, `validate-agent-parity.mjs`, line-anchored allowlist diff, Phase 1 claim grep R (no output), pointer and signal checks in `p4-tools` | B (built by Phase 4) |
| C-P5 | 33 skills kept, trigger routing reaches each skill, catalog fresh at the join, strategy-compare body untouched | Fully-Automated + Hybrid (routing phrase run) | `ls -d .claude/skills/*/ \| wc -l` = 33; `validate-skills.mjs` (not worse), `validate-skill-routing.mjs`, `validate-confusable-skills.mjs`, `validate-skill-keywords.mjs`, `validate-skill-cross-refs.mjs`; join by spawned agents: `generate-skills-catalog.mjs --write` (execute-agent) then `--check`, charter-template `cmp`, joint suite (tester) | B (built by Phase 5) |
| C-P6 | one idempotent, dry-run-capable rename script; no stray `vc-`; upgrader keeps user-edited files and the four old state names; uppercase signals and env vars renamed with fallbacks | Fully-Automated + Hybrid | Phase 6 Exit Gate: `scripts/rename-prefix.mjs --dry-run` 0 edits, allowlist diffs G5/G7 empty, `vb-manifest.json` only, uppercase-signal census diff, `bash $H/compare-vb.sh` exit 0; Hybrid: `compute-sync-plan.mjs` on a tree with a modified legacy file and old state files | B (built by Phase 6) |
| C-P7 | non-coder can install from README alone (Quick start + glossary sections inside README.md and README.vi-VN.md); EN and VI synced; 8 outdated banners; Phase 1 facts kept | Fully-Automated + Agent-Probe | `scripts/check-docs.mjs` (5 checks incl. signal census and agent-edit invariants), `validate-guide-sync.mjs`, `grep -c "may be outdated"`, Phase 1 claim grep, `bash $H/compare-vb.sh`; fresh-agent walkthrough in the report (Agent-Probe, named residual) | B (built by Phase 7); R5 hand-off |
| C-P8 | clean install and update on WSL/Linux; local tag `v1.0.0` after the equivalence gate | Hybrid | `node --test e2e-kit-flows.test.mjs` (after Phase 8 A0 path fix, Linux Node 22 present), install matrix (fresh + existing project), `git tag -l v1.0.0`, `git status --porcelain` empty | B (built by Phase 8) |
| C-P8r | install on native Windows and macOS; 6 user-run items | Hybrid | user-run command list in the Phase 8 report and release notes (NOT run here, LOCKED Q6); Known-Gap rows, never a proof | D (backlog stubs written by Phase 8; gate stays CONDITIONAL) |
| C-EQ | final v1.0.0 kit keeps old behaviour, ways of working and output quality, at least equal (decision A); no release step before the verdict | Fully-Automated + Hybrid + Agent-Probe | Phase 8 B4: scripted rubric on 12 outputs (`eq/scripted.tsv`), `bash $H/compare-vb.sh` exit 0, signal census diff after the VC-/VB- mapping empty, guardrail-section identity modulo rename, FROZEN re-check; Hybrid e2e trials copied from B3 (Linux node v22.23.4 is installed, WSL install gates are runnable; only native Windows/macOS remain NOT TESTED); Agent-Probe blind pairwise judge old vs final (named residual, never the sole proof); last line of `eq/verdict.md` = `EQ gate: PASS` or `EQ gate: ACCEPTED-BY-USER`, enforced by C0 before any release step; user acknowledges 12 task runs + 6 judge calls and the cost first | B (built by Phases 3 and 8); judge = named residual, gap D |
| C-SAFE-1 | updater never deletes user-modified files | Hybrid | Phase 6 B1 and Phase 8 B1 fixture with a modified legacy file | B |
| C-SAFE-2 | MIT notice and original copyright kept in every phase | Fully-Automated | `compare.sh` LICENSE RULE (both greps + zero removed lines vs the tag), called by the exit gates of Phases 0, 1, 2, 6, 7, 8 and applied at every phase exit by the goal-block TEST GATES | A for Phases 0-2, 6-8; C for the explicit exit-gate line of Phases 3, 4, 5 (R1) |

Failing stubs (Fully-Automated rows; TDD red-first starting points for EXECUTE):

Failing stub (C-P0):
test("should have git history, upstream-baseline tag, baseline file, all-context.md and both LICENSE lines", () => { throw new Error("NOT IMPLEMENTED - TDD stub: Phase 0 exit gate") })

Failing stub (C-P1):
test("should fail the model-effort policy validator on the drift fixture and pass on the pass fixture with no model line changed", () => { throw new Error("NOT IMPLEMENTED - TDD stub: model/effort policy validator") })

Failing stub (C-P2):
test("should find no withkynam/flowser outside attribution (including process/) and no hotlinked images; version is 1.0.0", () => { throw new Error("NOT IMPLEMENTED - TDD stub: identity sweep") })

Failing stub (C-P3):
test("should shrink agent prompts at least 25 percent with identical signal-string census, identical guardrail hashes and frozen golden tasks", () => { throw new Error("NOT IMPLEMENTED - TDD stub: slim agents") })

Failing stub (C-P4):
test("should keep protocol-wiring, guide-sync and agent-parity green with only allowlisted leftovers and the Phase 1 model text", () => { throw new Error("NOT IMPLEMENTED - TDD stub: doc dedup") })

Failing stub (C-P5):
test("should keep 33 skills with green skills/routing/confusable validators", () => { throw new Error("NOT IMPLEMENTED - TDD stub: tune skills") })

Failing stub (C-P6):
test("should rename vc- to vb- idempotently with a no-op second apply", () => { throw new Error("NOT IMPLEMENTED - TDD stub: rename script") })

Failing stub (C-P7):
test("should have README Quick start + glossary sections, synced EN/VI README and 8 outdated banners", () => { throw new Error("NOT IMPLEMENTED - TDD stub: vibecoder docs") })

Failing stub (C-EQ):
test("should end eq/verdict.md with EQ gate: PASS or ACCEPTED-BY-USER before any release step", () => { throw new Error("NOT IMPLEMENTED - TDD stub: final equivalence gate") })

Failing stub (C-SAFE-2):
test("should keep the original MIT notice and the vibecode copyright line in every phase", () => { throw new Error("NOT IMPLEMENTED - TDD stub: license guard") })

Legacy line form (retained so existing validate-contract consumers still parse):
- Phase 0: [Fully-automated: DONE, compare.sh, git/LICENSE greps] | [hybrid: vc-setup run interactively, done] | [agent-probe: none] | [known-gap: K0-1 e2e Trials C and D under Linux node; K0-2 native Windows/macOS]
- Phase 1: [Fully-automated: new policy validator + fixtures, no-model-change diff gate, claim grep, parity, frontmatter, compare.sh] | [hybrid: none] | [agent-probe: none] | [known-gap: none]
- Phase 2: [Fully-automated: identity/image/WhatsApp greps incl. process/, version, portability validator, resolver files.length, compare.sh] | [hybrid: e2e where runnable] | [agent-probe: none] | [known-gap: none; hand-off H1]
- Phase 3: [Fully-automated: size, census, conservation, guardrail hashes, parity, golden freeze] | [hybrid: golden runs need model access and a cost acknowledgement] | [agent-probe: golden blind judge] | [known-gap: none; explicit compare.sh line is R1]
- Phase 4: [Fully-automated: wiring, guide-sync, parity, leftovers allowlist diff, claim grep] | [hybrid: probe calls after cost acknowledgement] | [agent-probe: cold read] | [known-gap: none; explicit compare.sh line is R1]
- Phase 5: [Fully-automated: skill count, 4 skill validators, catalog join] | [hybrid: routing phrase run] | [agent-probe: agent-browser report] | [known-gap: none; explicit compare.sh line is R1]
- Phase 6: [Fully-automated: fixture test, idempotence, allowlist diff, validators via compare-vb.sh] | [hybrid: updater with modified file and old state files; e2e needs Linux node] | [agent-probe: none] | [known-gap: computed vc- strings (backlog if found)]
- Phase 7: [Fully-automated: README Quick start/glossary section presence + EN/VI heading parity, banners, guide-sync, census, agent-edit invariants, compare-vb.sh] | [hybrid: none] | [agent-probe: non-coder walkthrough] | [known-gap: VI native review; R5]
- Phase 8: [Fully-automated: equivalence scripted evidence, validators, tag] | [hybrid: WSL/Linux install matrix, e2e] | [agent-probe: blind equivalence judge] | [known-gap: native Windows and macOS, 6 user-run items: documented checklist]

Dimension findings:
- Infra fit: PASS - repo, tag, baseline kit, Linux Node 22, mixed git binaries and every gate script path verified on disk or traced to a named earlier step; red = worse than the Phase 0 baseline and `compare.sh` exits 0 now
- Test coverage: PASS (with RESIDUALs R1, R5) - no vacuous green: every developed behavior has a Fully-Automated or Hybrid gate; the two Agent-Probe verdicts (C-P3q, C-EQ judge) are named residuals backed by scripted gates; Known-Gap rows (native Windows/macOS, 6 user-run items, K0-1, K0-2) are named residuals with backlog stubs; the Phase 2 `process/` gate was unsatisfiable (M1, fixed at umbrella level, hand-off H1)
- Breaking changes: PASS - state names, uppercase signals and env vars are read-old-write-new with a Phase 6 fixture; resolver fix owned by Phase 2 and repeated as a Phase 6/8 precondition; Phase 4 cannot delete cited protocol files or headings without a stub or SendMessage; no `model:` line changes anywhere
- Security surface: PASS - original MIT notice protected by `compare.sh` every phase; SECURITY uses the GitHub advisory URL (no invented e-mail); the public git e-mail is the user-confirmed address; push, remote tag, GitHub release, `gh release create` and publish are Phase 8 HARD STOPS behind the equivalence gate and each need their own go; billed runs need a cost acknowledgement; Linux Node install is a user action; quick STRIDE scan only (vc-security not spawned)
- Section: charter, DoD item 8, C-EQ and hard constraints: PASS - consistent with Phases 1, 3, 8; FROZEN freeze and C0 gate mechanics verified in the plans
- Section: locked decisions A and B: PASS - no stale downgrade text in any plan; Phase 1 enforces the real 7/8 table
- Section: Stable Program Goal: PASS - 3957 characters, 7 required sections in order, agent-team machinery named, new hard stops present, START corrected (M2)
- Section: file-ownership table and registry: PASS after fix - M1 closed in the umbrella; registry prose refresh is R2; hand-off H1 to Phase 2
- Section: Current Execution State and Resume handoff: PASS after fix (M2) - Phase 0 DONE at 7845316, next Phase 1 RESEARCH
- Section: hard stops, cost acknowledgements, outward actions: PASS - goal block, Autonomous Execution Rules and phase plans agree
- Section: phase ordering and joins: PASS - strict 0..8, Phase 5 after Phase 3, Phase 6 after 4+5, join sequenced by the orchestrator and RUN by spawned agents, worktree removal now present in Phase 4 and Phase 5 (old R3 closed)

Open gaps: MUST-FIX 0 unresolved at umbrella scope (3 found and fixed this pass: M1, M2, M3). RESIDUAL 6 open (R1, R2, R4, R5, R6, R7) plus mandatory hand-off H1 and the program-level residuals below:
- H1 (HAND-OFF, mandatory before Phase 2 EXECUTE; classified MUST-FIX for the Phase 2 PVL, not for this umbrella gate): Phase 2 plan + registry add `process/context/all-context.md` lines 154 and 210 to Phase 2's claim and edit them before the `process/` grep; otherwise the Phase 2 exit gate prints 2 lines. Owner: Phase 2 PLAN-SUPPLEMENT / inner PVL (ownership already decided in the umbrella)
- R1 explicit `compare.sh` / LICENSE line missing from the exit-gate blocks of Phases 3, 4 and 5: known-gap: documented as NEW PLAN REQUIRED - add `bash $B/compare.sh; echo $?` (= 0) to each at its own PVL; backstop is the next phase's `compare.sh` run (cumulative) plus the goal-block TEST GATES
- R2 stale prose notes in `phase-blast-radius-registry.md` (Phase 2 C7 "no phase plan claims it", Phase 8 backup-stub wording, `validate_all_context.txt` listed but not on disk): known-gap: documented as NEW PLAN REQUIRED - refresh at the next UPDATE PROCESS or registry rewrite; `claim.globs` and phase plans govern
- R4 MIGRATION.md pointer banner (Phase 6 B6) links to `docs/RELEASE-NOTES-1.0.0.md`, which exists only after Phase 8: accepted
- R5 Phase 7 may reword sentences inside guardrail sections of agent prompts (its check 5 compares only backtick spans, paths, numbers and headings), while Phase 8 B4.6(d) requires guardrail-section hash identity modulo the rename: known-gap: documented as NEW PLAN REQUIRED - at Phase 7's PVL add the guardrail sections (`golden/guardrails.json`) to check 5 as untouchable, or record any deliberate change for the user to accept at B4.6(d)
- R6 seven plan files (umbrella and phases 1-2 and 4-7 (phase 1 was edited by another actor while this pass ran; this agent did not touch it)) carry uncommitted edits: commit them as a separate process commit before Phase 1 EXECUTE (Phase 1's clean-tree gate excludes the task folder, so it is not blocking)
- R7 historical text kept on purpose: goal-block hard stop "user needed in Phase 0 (confirm real git e-mail; interactive vb-setup)" (satisfied), and Phase 0's own plan Resume text still says its PVL is pending; refresh at the next UPDATE PROCESS; no effect on gates
- Program-level residuals (named Known-Gaps; backlog stubs written in Phase 8; C-P8r stays CONDITIONAL): native Windows and macOS installs; the 6 Phase 8 user-run items (Linux Node 22 + e2e, GitHub private vulnerability reporting/Discussions/Sponsorship settings, real symlink `.agents/skills` on ubuntu CI, exec bits on Windows-native checkouts, Phase 2 resolver check R2.5 under Linux Node 22, `.agents/skills` mode 120000 on a real Linux checkout); K0-1 (e2e Trials C and D fail under Linux node until Phase 6 B4 / Phase 8 fixes) and K0-2; `install.sh` overwrites managed `process/development-protocols/**` and `process/_seeds/**` without backup and skips an existing `.claude/settings.json` (documented in the release notes, out of scope for 1.0.0); the equivalence judge verdict (named residual, 3 tasks x 2 replicates)
- Scope reminder: this contract validates the umbrella text and its cross-claims. The Phase 1, 3 and 8 contracts predate decisions A and B (inner PVL restarts at V1 for each); Phases 2, 4, 5, 6, 7 carry ripple supplements and still need their own PVL before EXECUTE. EXECUTE of Phase 1 additionally requires Phase 1's own PVL contract to be PASS.

## Known Gaps (Resolved via Backlog)

- H1: documented hand-off, not a backlog item - Phase 2 PLAN-SUPPLEMENT adds the `all-context.md` claim (above)
- R1: known-gap: documented as NEW PLAN REQUIRED - Phase 3/4/5 own PVL (carry-forward line, above)
- R2: known-gap: documented as NEW PLAN REQUIRED - registry prose refresh (above)
- R4: accepted residual (banner link)
- R5: known-gap: documented as NEW PLAN REQUIRED - Phase 7 PVL guardrail-section rule (above)
- Native Windows / macOS / 6 user-run items / K0-1 / K0-2: known-gap: documented as NEW PLAN REQUIRED - Phase 8 writes one backlog stub each (`process/general-plans/backlog/`)

What this coverage does NOT prove:
- C-P0/C-SAFE-2 greps do not prove the LICENSE text is legally correct, only that the two copyright lines exist, the MIT body is unchanged versus the tag, and the original line sits above the added one.
- C-P1 does not prove the chosen model/effort table is the best one; it proves the agent files match the documented table. Whether sonnet would be good enough for any of the 7 opus agents is NOT measured in this program (deferred optional follow-up). The `effort: max` change on three agents raises token use per run; it is stated, not measured.
- C-P2 greps do not prove every upstream mention is gone from binary files; the tagged-line mechanism relies on a literal tag.
- C-P3 size, census and hash gates do not prove answer quality; only the golden blind judge does, and only for the 3 sample tasks. C-EQ re-runs the same 3 tasks x 2 replicates: it cannot prove equivalence on every possible task, the judge is itself a model, and a tie counts as EQUAL.
- C-P4/C-P5 validators do not prove an agent finds each rule in one place, or that every real user phrase still routes to the right skill.
- C-P6 fixture test does not prove computed (string-built) `vc-` references are renamed; the allowlist diff and the Phase 8 real install are the only backstops.
- C-P7 agent walkthrough does not prove a real non-coder succeeds; Vietnamese wording has no native review.
- C-P8 WSL/Linux installs do not prove native Windows, Git Bash or macOS behavior, nor the real GitHub raw download path; Linux node v22.23.4 is installed, so WSL install gates are runnable; only native Windows/macOS remain NOT TESTED.
- Nothing here proves how Claude Code or Codex load renamed agents and skills in a live session beyond what the Phase 8 sandbox runs exercise.
- This contract does not prove that the gate commands inside each phase plan run green on the real repo (that is each phase's PVL and EVL); in particular it does not prove the Phase 2 `process/` grep until hand-off H1 is applied.

Gate: PASS (0 FAILs unresolved; MUST-FIX 3 found and fixed in the umbrella, 0 unresolved at umbrella scope; RESIDUAL 6 open items R1, R2, R4, R5, R6, R7, all listed as Known Gaps or housekeeping with no effect on the net gate; mandatory hand-off H1 to the Phase 2 PLAN-SUPPLEMENT; PVL cycle 5, decisions A and B verified)
Accepted by: not required for PASS. RESIDUALs and the program-level residuals are recorded by name; C-P8r keeps its own CONDITIONAL status inside Phase 8. Phase 1 EXECUTE additionally requires Phase 1's own inner PVL contract to be PASS.

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


## Supplement (user decisions 2026-10-29: quality-equivalence + model direction)

- Decision A recorded in: Locked Decisions (QUALITY EQUIVALENCE row), Charter (north star, DoD item 8, verified-means bullet, hard safety constraint), criterion C-EQ, Stable Program Goal (TARGET bullet + HARD STOPS bullet, block re-counted <= 4000 characters, 7 required sections in order), exit-gate table rows 3 and 8, Pre-PVL table (golden/** and new eq/** ownership), Global Constraints, Risk Predictions, Verification Evidence. Mechanism: Phase 3 A2b/A5 freeze `golden/tasks/`; Phase 8 B4/C0 gate every release step.
- Decision B recorded in: Locked Decisions (MODEL DIRECTION row, Execute effort row, golden baseline rows), Phase 1 description, strategy table model lines, loop labels, Pre-PVL table (CLAUDE.md/protocols/strategy-compare/all-context ownership: Phase 1 first, Phase 4 preserves). Deferred, optional, not in this program: measure sonnet versus opus on the golden tasks before ever lowering a model.
- Wording to adjust in plans this supplement did not own (list sent to the caller): Phase 2 (README/i18n identity edits must not touch the model-fact sites that Phase 1 corrected), Phase 4 (preserve Phase 1's model text in CLAUDE.md, orchestration.md, implementation-standards.md, vc-system-behavior 04/07/08; re-run the Phase 1 claim grep), Phase 5 (strategy-compare front-matter only, body of Model Selection Policy is Phase 1's), Phase 6 (rename of the new text only; golden/tasks and eq are inside the protected task folder), Phase 7 (keep facts 7 opus / 8 sonnet when rewording; model labels in the loop sections), Phase 0 (the `model-policy` paragraph of `all-context.md` is edited once by Phase 1; baseline/validators.list gains one row in Phase 1).
- The earlier Validate Contract (with its Phase 1 opus-to-sonnet downgrade lines) was replaced by the PVL cycle 5 contract; no stale downgrade text remains in the contract.

Supplement (ripple of 2026-10-29 decisions): locked-decision row for git identity now names the confirmed address `minhnguyentuan31103@gmail.com`; nothing else changed.

- Supplement 29-10-26 (tiny): Linux node v22.23.4 installed; only native Windows/macOS NOT TESTED.

## Supplement (user decisions 2026-10-29: clean final tree)

PLAN-SUPPLEMENT on the umbrella only; the Validate Contract above is kept unchanged. Phase plans, `phase-blast-radius-registry.md` and `results.tsv` were NOT edited (other agents are re-validating Phases 1, 2, 4, 6, 7, 8).

- Recorded: user decision C (clean final tree, hard criterion C-CLEAN), C1 (full history kept; only the final tree is cleaned), C2 (documentation minimal; 8 languages and the listed docs removed) in Locked Decisions (4 new rows incl. the DOOMED SET), Charter (north star, DoD items 6, 7 and new 9, hard safety constraint), Acceptance criteria (new C-CLEAN row; C-P7 and C-P8 reworded), Stable Program Goal (TARGET bullet, HARD STOPS bullet, TEST GATES line; re-counted 3984 characters, limit 4000, the 7 required sections still in order), Phase Ordering (Phase 8 scope), Per-Phase Entry / Exit Gates (rows 7 and 8), Pre-PVL ownership table (rows for README i18n, MIGRATION.md, docs/GITHUB-*, CONTRIBUTING translations; new row for `harness/clean-check.sh` and the C0b commit), Global Constraints (C-CLEAN line and a SWEEP RULE corollary), Risk Predictions, Verification Evidence, and the new section `## Clean Final Tree (C-CLEAN)` (step order, DOOMED SET, ALLOWED LIST with a one-line reason per item, gate CC1-CC8, phase-plan wording).
- Contract status: the Validate Contract above predates this supplement. Statements in it about "8 outdated banners" (C-P7 row, failing stub, Phase 7 legacy line) and about Phase 8 steps ending at C2a/C2c are SUPERSEDED by this section. The orchestrator must re-run the umbrella PVL (V1 onward) before the next EXECUTE so the contract covers C-CLEAN; the first-pass verdict for the new content is not claimed here.
- Phase plans needing wording (owners add at their own PVL): Phase 2 (skip the 8 languages and the other DOOMED docs; R2.1 excludes the DOOMED SET), Phase 6 (drop B6 and residual R4), Phase 7 (README.md and README.vi-VN.md only; no banners; switcher links), Phase 8 (steps C0a/C0b/C0c, release notes in `$TF`, tag on the cleanup commit, Exit Gate adds the clean-check). Registry: new lines for C0b and the scope reductions. Phase 1 is unchanged (still edits all 10 READMEs).

## Supplement 2026-10-29 (QUICKSTART/GLOSSARY folded into README; R1-f; cleanup compare)

- LOCKED user decision: QUICKSTART and GLOSSARY (4 files: `docs/QUICKSTART.md`, `docs/GLOSSARY.md`, `docs/i18n/QUICKSTART.vi-VN.md`, `docs/i18n/GLOSSARY.vi-VN.md`) are never created. Removed from the ALLOWED LIST, CC2 deny pattern, C-P7, DoD 6, ownership rows and Clean Final Tree wording. Stable Program Goal unchanged by this supplement (does not mention them); the Validate Contract text above is kept unchanged and stays stale on "8 outdated banners"/QUICKSTART until phase PVLs re-run.
- R1-f: `.github/workflows/release.yml` added to the Pre-PVL ownership table (Phase 1 additions only, Phase 2 display-name line afterwards).
- Wording needed in Phase 7: fold a short 'Quick start' section and glossary table into README.md and README.vi-VN.md (concise); `check-docs.mjs` checks (heading parity EN/VI for these sections, term coverage, one install command, signal census) apply to README sections; drop all QUICKSTART/GLOSSARY file steps, fixtures and gates.
- Wording needed in Phase 8: C0b/CC1-CC2 use the shorter ALLOWED LIST (no QUICKSTART/GLOSSARY); CC5 pins the exact `compare-vb.sh` argument vs `validators_before` (Linux node) after Phase 6 creates it.
- Registry: Phase 7 drops the 4 files; Phase 1 gains `.github/workflows/release.yml` (additions only); Phase 2 keeps it for the display-name line.

## Supplement (inner 3 for Phase 3, user decision D 2026-10-30: no slimming)

- Phase 3 re-scoped to "Instrument and freeze (no slimming)" (plan file name kept). Updated here: Locked Decisions (new row D; Golden runs, Commits, Golden baseline source, Phase 3 judging, Phase 3 census rows), out-of-scope line, C-P3, Stable Program Goal (AUTONOMY 4/5 sequential, HARD STOPS cost line, SAFETY Phase 3 lines, START = Phase 3 step 4 PVL; re-counted <= 4000 chars, 7 required sections in order), Phase Ordering row + rationale, Join Conditions user-checkpoint line, Strategy row 3, Entry/Exit row 3, Autonomous Execution Rules checkpoint line, Program Status row 3, Risk rows, Touchpoints, Verification Evidence rows.
- NOT updated here (owned elsewhere, listed in the plan-agent report): Phase 4/5 team wording in Strategy row "4 + 5", Join Conditions team/worktree lines and the Phase 5 plan (now sequential; worktree/join/TeamCreate moot); Phase 7 C2/exit `pointer-check.mjs` (dropped in Phase 3); Phase 8 B4.1 "per-run cost from the Phase 3 report" (no Phase 3 runs); `## Current Execution State` (update-process writes it); the umbrella Validate Contract text (history; re-validated by the next PVL).

## Supplement (sync after scope decisions 2026-10-30)

- Decisions E (Phase 4 safe tidy), F (Phase 5 minimal safe tuning, sequential after Phase 4) and G (no agent team) added to Locked Decisions next to decision D. The rows 'Phase 4/5 team join (decision f)', 'Phase 4/5 worktrees' and 'Join sequencing' are replaced or marked OBSOLETE by 'Phase 4 then Phase 5 sequential on main; Phase 5 regenerates the catalog itself (no join)'.
- Updated: Overview, Charter DoD item 4 and Tier 2 wording, C-P4, C-P5, Stable Program Goal (AUTONOMY line; HARD STOPS now name ONE billed stop at Phase 8 B4.1, Phase 4 0.5a removed; re-counted <= 4000 characters, 7 required sections in order), Phase Ordering rows 4/5 and rationale, Join Conditions (sequential-order conditions, no join, no SendMessage, no heading or file rename by Phase 4), Strategy rows 4 and 5 (replacing "4 + 5"), Entry/Exit rows 4, 5, 6, Pre-PVL text and CLAUDE.md row (Phase 4 does not touch CLAUDE.md), Autonomous checkpoint line, Global Constraints (new standing contract AGENTS.md <= 32,768 bytes; A5 -> D8), C0b (AGENTS.md budget + CHANGELOG hooks deep-equality re-check), Risk row, Touchpoints, Blast Radius, `## Current Execution State` (Phase 3 name and the stale A0 sentence, line-anchored).
- Kept verbatim: the umbrella `## Validate Contract` and every earlier supplement (history; they still mention teams, joins, 0.5a and A0).
- Not changed here: the Phase 3, 4 and 5 plans (their re-scoped content governs) and `results.tsv`.

## Supplement (PVL, 2026-10-30)
- H3: `## Current Execution State` "Current loop step" and "Phase 3 status" lines rewritten to the current state (user resumed 2026-10-30; Phase 3 PVL cycle 1 CONDITIONAL fixed, re-validate from V1; Phase 5 PASS; Phase 4 second pass pending). Whole-line exact matches only; nothing else changed; Stable Program Goal untouched.
