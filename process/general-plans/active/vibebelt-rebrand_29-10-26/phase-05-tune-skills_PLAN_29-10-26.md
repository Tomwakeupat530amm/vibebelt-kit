---
name: plan:vibebelt-rebrand-phase-05-tune-skills
description: "vibebelt-kit rebrand — Phase 05: Tune the 33 skills"
date: 29-10-26
metadata:
  node_type: memory
  type: plan
  feature: general-plans
  phase: phase-05
---

# Phase 05 — Tune the 33 skills

**Program:** vibebelt-rebrand
**Umbrella plan:** process/general-plans/active/vibebelt-rebrand_29-10-26/vibebelt-rebrand-umbrella_PLAN_29-10-26.md
**Phase status:** ⏳ PLANNED
**Complexity:** COMPLEX
**Report destination:** process/general-plans/active/vibebelt-rebrand_29-10-26/phase-05-tune-skills_REPORT_29-10-26.md (flat in the program task folder)

---

## Overview

One phase of the vibebelt-rebrand program; program context lives in the umbrella plan. Context router: process/context/all-context.md (created in Phase 0). Test routing: process/context/tests/all-tests.md (load before assigning tiers).

Date: 29-10-26
Status: PLANNED
Complexity: COMPLEX

## Purpose

Tune (never remove) the 33 skills: find trigger-keyword overlaps that cause wrong routing, tighten descriptions, flag oversize files, find out why `vc-agent-browser` is about 15MB, and propose (but not add) new skills for the user to approve.

---

## Entry Gate

- Phase 4 committed on `main` and its exit gate green (Phase 3 no longer modifies agents; Phases 4 and 5 run SEQUENTIALLY on `main`, 4 then 5). Handoff text everywhere: "after Phase 4 is committed and its exit gate is green; sequential on main".

---

## Strategy Recommendation (vc-agent-strategy-compare)

- Signals: S4 yes, S7 yes — score 3/7.
- Recommended (2026-10-30, user decision): **Sequential** on `main` after Phase 4. One `vc-execute-agent` (opus) then one `vc-tester` (opus, front-matter; no override); research/plan/validate on their front-matter model (opus). No agent team (TeamCreate is not available), no worktree, no branch. ZERO billed calls.

---

## Blast Radius (disjoint from Phase 4 — see registry)

Scope limit for `.claude/skills/vc-agent-strategy-compare/SKILL.md`: edit front-matter, `trigger_keywords` and `description` only. The `## Model Selection Policy` body and the output-template `Model:` line belong to Phase 1 (F2/F3) and are NOT touched here.

- `.claude/skills/*/SKILL.md` (frontmatter `description`, `trigger_keywords` only; bodies untouched except the `vc-intent-clarify` split, and optionally `vc-generate-phase-program`, see B2) and the new `references/` files those splits create (file names must NOT start with `vc-`)
- `.claude/skills/vc-agent-browser/**` (investigation only; no change, see A3/B3)
- `process/context/generated-skills-catalog.json` (regenerated once at the end of EXECUTE, `--write`)
- New task-folder tools and files: `$P/*` (scripts, `baseline.sha`, `claim.globs`, snapshots, `oversize.list`), `$T/proposed-new-skills.md`; one new backlog note `process/general-plans/backlog/vc-agent-browser-screenshots-untrack_NOTE_29-10-26.md` (outside the task folder, new file)
- NOT touched: `CLAUDE.md`, `AGENTS.md`, `process/development-protocols/**`, and BOTH charter-template mirror copies (frozen in Phases 4/5: `.claude/skills/vc-generate-phase-program/references/program-goal-charter-template.md` and the protocol-side copy; `cmp`-checked at the join)

### Path variables and conventions (apply to every command in this plan)

```bash
T=process/general-plans/active/vibebelt-rebrand_29-10-26
P=$T/p5-tools
```

- ALL commands run from the repo root as `node.exe $P/<script> [--root <dir>]`. No command in this plan is task-folder-relative. `node` may replace `node.exe` where available.
- Bash only (WSL). Sort with `LC_ALL=C sort`. No process substitution (`<(...)`) in any gate: write both sides to files, then `diff` the files.
- Git: sequential on `main` (no worktree, no branch, no merge). `P5_START` = `$(cat $P/baseline.sha)`. Claim check: `git diff --name-only $(cat $P/baseline.sha)..HEAD | node.exe $P/claim-check.mjs $P/claim.globs`. Rollback unit = ONE `fix:`/`chore:` commit with an explicit file list; `git revert <sha>` restores the pre-phase state.
- Coupling to Phase 4 (no edit by Phase 5): Phase 4 (re-scoped 2026-10-30) KEEPS the AGENTS.md Skill Registry (it only trims AGENTS.md under the 32 KiB Codex cap), so `routedFrom` is unaffected. Catalog `routedFrom` is a substring match against AGENTS.md, CLAUDE.md and the catalog itself (`shared-skill-utils.mjs` lines 90-110), so it stays non-empty for all skills; confirm at the join.

---

## Implementation Checklist

### Step 0 - Tools and snapshot (red-first)

- [ ] 0.1 Re-confirm test tiers at inner PVL after Phase 0 creates `process/context/tests/all-tests.md`.
- [ ] 0.2 Save the pre-change snapshot in `$P/` BEFORE any skill edit. Take the data from the SKILL.md frontmatter files themselves (not from a possibly stale catalog; Phase 2 edited vc-update / vc-setup / vc-publish SKILL.md): (a) `$P/pre-skill-folders.txt` = `ls -d .claude/skills/*/ | LC_ALL=C sort`; (b) `$P/pre-triggers.json` = per-skill top-3 `trigger_keywords` in frontmatter order ("main phrase" = these recorded top-3); (c) `$P/pre-catalog.json` = copy of `process/context/generated-skills-catalog.json` ONLY if `node.exe .claude/skills/vc-audit-context/scripts/generate-skills-catalog.mjs --check` exits 0 first; if it is stale, do NOT run `--write` here, record the staleness in the report and rely on (a)+(b). RESEARCH is read-only: it only REPORTS the snapshot approach in its findings; the EXECUTE agent writes `$P/snapshot.mjs` and runs it here in Step 0, before 0.6.
- [ ] 0.3 Write `$P/routing-check.mjs`: for every skill assert its recorded top-3 phrases (from `pre-triggers.json`) are all still in its post-change `trigger_keywords`/description, and none of them now appears in another skill's `trigger_keywords` it did not before ("stolen"); report pairs sharing more than 2 keywords (new overlaps). Exit 1 on any miss.
- [ ] 0.4 Write `$P/conservation-check.mjs` (input list `$P/oversize.list`, see A2): for each skill in the list whose SKILL.md body changed vs `$P/baseline.sha`, every removed non-empty line exists verbatim in that skill's `references/` files; SKILL.md keeps all headings and gains a pointer line; exit 1 otherwise.
- [ ] 0.4a Write `$P/claim-check.mjs` (Phase 5's own copy; same interface as Phase 4's `claim-check.mjs`: changed-path name list on stdin, `$P/claim.globs` as argument with `!` excludes, prints every path outside the claim, exit 1 if any). The EXECUTE agent writes it in Step 0; C3 and the Exit Gate call `$P/claim-check.mjs`, never Phase 4's.
- [ ] 0.5 Record the validator baseline from Phase 0 (validate-skills and validate-context-discovery are red at baseline only because `.agents/skills` is a 17-byte text file kept in the work tree). "Red" in this phase means WORSE than the Phase 0 baseline: validate-skills failure lines excluding `.agents/skills` must be empty.
- [ ] 0.6 After 0.2-0.4 tools are committed as a process commit: `git rev-parse HEAD > $P/baseline.sha`; write the machine-readable claim `$P/claim.globs` (one glob per line, `!` = excluded): `.claude/skills/*/SKILL.md`, `.claude/skills/*/references/**`, `!.claude/skills/vc-generate-phase-program/references/program-goal-charter-template.md`, `process/context/generated-skills-catalog.json`, `$P/**`, `$T/proposed-new-skills.md`, `$T/phase-05-tune-skills_REPORT_29-10-26.md`, `process/general-plans/backlog/vc-agent-browser-screenshots-untrack_NOTE_29-10-26.md`. The orchestrator keeps the registry prose claim equal to this file. Then record `sha256sum` of the charter-template mirror pair in `$P/mirror.sha256`.

### Step A - Audit (read-only)

- [ ] A1. Run `discover-skills.mjs` (accepts only `--json`; no phrase matching) and build a keyword-overlap matrix; list pairs sharing more than 2 trigger words or confusable per `validate-confusable-skills.mjs`.
- [ ] A2. RESEARCH (read-only) REPORTS the numeric threshold (default proposal > 20000 bytes), the per-skill byte sizes and the snapshot approach in its findings; the EXECUTE agent writes `$P/oversize.list` in Step 0 (before 0.6) with the threshold on its first line (`# threshold-bytes: 20000`, re-measured at 0.6) followed by one skill name + byte size per line. Sizes are re-measured at start (`wc -c`); at HEAD b17294d five skills exceed 20000 bytes: vc-setup 27741, vc-intent-clarify 26600, vc-update 25719, vc-generate-phase-program 25426, vc-agent-strategy-compare 21659. `oversize.list` marks vc-setup, vc-update, vc-agent-strategy-compare as `skipped, <reason>` (see B2). Also list descriptions over one line (only `vc-audit-vc`, a `>-` block).
- [ ] A3. `vc-agent-browser` (15M) facts, re-verified with `du -sh .claude/skills/vc-agent-browser/*` and recorded in the report: ALL ~15M is `screenshots/`, which holds 53 PNG files (NOT 7): two audit folders `ui-audit-20260408` (4.3M) and `ui-audit-20260408-v2` (8.9M) = 13.2M, plus five top-level mock PNGs (one, `chat-mock-workspace.png`, is 429 bytes). SKILL.md 12K, `references/` 72K, `scripts/` 216K, no vendored `node_modules`. `vc-manifest.json` `exclude` already lists `**/screenshots/**`, so install weight is zero (source-repo weight only). `scripts/README.md:107` says "Always save screenshots to `.claude/skills/vc-agent-browser/screenshots` directory", so the directory is a RUNTIME OUTPUT PATH and IS referenced (the earlier claim "no file references screenshots/" was false). The screenshots are ALREADY ignored: Phase 0 A3c added `.claude/skills/vc-agent-browser/screenshots/` to the tracked `.gitignore` and the PNGs were never in the `upstream-baseline` tag, so they are on disk (14.6M, 53 PNGs) but untracked. Decision is NON-DESTRUCTIVE: keep the directory and its contents; no file is moved or deleted and Phase 5 does NOT re-propose a `.gitignore` rule or any untracking. Never delete anything in this phase.

### Step B - Tune

- [ ] B1. Minimal safe front-matter tuning (2026-10-30 scope). Edit ONLY where an edit clearly reduces misrouting WITHOUT changing a skill's recorded top-3 phrases (first three comma-separated `trigger_keywords`, lowercase) and WITHOUT adding a phrase another skill already owns. Candidates measured at HEAD: (1) pairs sharing >2 words: vc-docs-seeker (`how does X work, API docs, version, syntax`) vs vc-feasibility-test (`... does this work, ..., api shape check`: both non-top-3, editable); vc-publish (`publish kit, push harness, release kit, update remote`; `update remote` is non-top-3) vs vc-update (`update harness, pull kit, sync harness, upgrade agents`); (2) contained-phrase collisions: `plan` (vc-generate-plan top-1, cannot change) inside 'create plan', 'audit plans', 'umbrella plan', 'test coverage plan'; `complex` vs 'complex problem'; `tests` vs 'test scenarios'; 'update context' vs 'update harness'; `debug`/`root cause`; `auth`. Change only the non-top-3 side; if no safe edit exists, leave it and record "left, reason". Record every change in the report as a table `skill | field | old | new | reason`. Normalize vc-audit-vc's multi-line `>-` description to one line only if `validate-skills`, `validate-skill-routing` and `generate-skills-catalog --check` (after `--write`) accept it; else leave it. Run `node.exe $P/routing-check.mjs` before and after. After each edit run the MID-PHASE validator set only: `$P/routing-check.mjs`, `$P/conservation-check.mjs`, `validate-skill-cross-refs.mjs`, `validate-confusable-skills.mjs`, `validate-skill-routing.mjs`, `validate-skills.mjs` (filtered, not worse than baseline), `validate-skill-invocation-wiring.mjs`. `validate-skill-keywords.mjs` is EXPECTED RED until the final `--write` (it runs `generate-skills-catalog.mjs --check` internally); not a regression mid-phase.
- [ ] B2. Oversize split, ONLY `vc-intent-clarify` (26600 B, no `references/` today): move the example sections `## The 8 Standard Dimensions` (dimension bodies), `## Full Tier 2 Example`, `## Bad vs. Good Question Format`, `## Worked Scoring Examples` into `.claude/skills/vc-intent-clarify/references/` (name not starting with `vc-`, e.g. `references/examples.md`, `references/dimensions.md`), leaving each heading in SKILL.md with a one-line pointer to its references file. Optional: `vc-generate-phase-program` (25426 B) only if a clean example block exists that is NOT the frozen charter template (candidates: `## Kickoff Template`, `## Practical Operator Kickoff`); skip otherwise. DO NOT split `vc-setup` (line 14 'Dual-File Synchronization' rule with `references/vc-setup.md`), `vc-update` (owned by Phases 2 and 6, installer coupling) or `vc-agent-strategy-compare` (front-matter only; Phase 1 owns the Model Selection Policy body): write them in `oversize.list` as `skipped, <reason>`. The >= 30 percent body-drop rule is dropped. Split gate per skill: `conservation-check.mjs` (moved text verbatim in references), headings + pointer retained, `validate-intent-clarify-output.mjs` still passes `fixtures/validate-intent-clarify-output/pass.md` (exit 0) and fails `fail.md` (exit 1), `validate-skill-cross-refs` exit 0. Behaviour note: `layer`, `trigger_keywords` and the way the skill is invoked are unchanged.
- [ ] B3. Agent-browser: nothing to delete (53 PNGs 15 MB are untracked/ignored since Phase 0, manifest excludes `**/screenshots/**`, `scripts/README.md:107` names that dir as runtime output). No change to the skill beyond writing the backlog note (an INTERNAL record only: backlog NOTE files are doomed at cleanup and do not ship) `process/general-plans/backlog/vc-agent-browser-screenshots-untrack_NOTE_29-10-26.md` (records that the screenshots are already ignored by Phase 0 A3c and were never in the baseline tag, with the on-disk size 14.6M / 53 PNGs; no gitignore or untrack proposal, no file moved or deleted; see A3).

### Step C - Proposals and catalog

- [ ] C1. Write `$T/proposed-new-skills.md` (name, one-line purpose, why a vibecoder needs it; internal record, does not ship). Add NOTHING.
- [ ] C2. FINAL STEPS on `main` (no join, no merge): the spawned `vc-execute-agent` runs `node.exe .claude/skills/vc-audit-context/scripts/generate-skills-catalog.mjs --write` as its LAST edit, then commits ONE `fix:`/`chore:` commit with an explicit file list. The spawned `vc-tester` then runs `--check` (exit 0), confirms 33 skills with non-empty `routedFrom`, `cmp`s the charter-template mirror pair, and runs the validator suite INCLUDING `validate-skill-keywords.mjs`. The orchestrator runs no gate and edits no file. Phase 5 never edits CLAUDE.md, AGENTS.md or `process/development-protocols/**`.
- [ ] C3. Claim check on `main`: `git diff --name-only $(cat $P/baseline.sha)..HEAD | node.exe $P/claim-check.mjs $P/claim.globs` prints nothing. `$P/baseline.sha` is taken after Phase 4's commit, so Phase 4 paths are outside the range (no `comm -12` needed). Rollback unit = the single Phase 5 commit (`git revert <sha>`); no merge-revert rehearsal.

---

## Exit Gate

ORDER: edits -> `--write` (spawned vc-execute-agent, last EXECUTE step) -> `--check` -> validators (spawned vc-tester). Run from the repo root on `main`.

```bash
T=process/general-plans/active/vibebelt-rebrand_29-10-26; P=$T/p5-tools
node.exe .claude/skills/vc-audit-context/scripts/generate-skills-catalog.mjs --write   # Expected: exit 0 (spawned vc-execute-agent, final EXECUTE step)
node.exe .claude/skills/vc-audit-context/scripts/generate-skills-catalog.mjs --check   # Expected: exit 0 (fresh)
ls -d .claude/skills/*/ | wc -l                                              # Expected: 33
ls -d .claude/skills/*/ | LC_ALL=C sort > $P/post-skill-folders.txt
diff $P/pre-skill-folders.txt $P/post-skill-folders.txt                      # Expected: empty (names unchanged)
node.exe .claude/skills/vc-audit-vc/scripts/validate-skills.mjs                  # Expected: not worse than Phase 0 baseline (exit 0 once .agents/skills repaired)
node.exe .claude/skills/vc-audit-context/scripts/validate-skill-routing.mjs      # Expected: exit 0
node.exe .claude/skills/vc-audit-context/scripts/validate-confusable-skills.mjs  # Expected: exit 0
node.exe .claude/skills/vc-audit-context/scripts/validate-skill-keywords.mjs     # Expected: exit 0 (only after the --write above)
node.exe .claude/skills/vc-audit-context/scripts/validate-skill-cross-refs.mjs   # Expected: exit 0
node.exe .claude/skills/vc-audit-vc/scripts/validate-skill-invocation-wiring.mjs # Expected: exit 0
node.exe $P/routing-check.mjs                                                # Expected: exit 0; every recorded top-3 phrase retained, none stolen
node.exe $P/conservation-check.mjs                                           # Expected: exit 0 for every split skill in oversize.list
test -s $T/proposed-new-skills.md                                            # Expected: exit 0
node.exe .claude/skills/vc-intent-clarify/scripts/validate-intent-clarify-output.mjs .claude/skills/vc-intent-clarify/scripts/fixtures/validate-intent-clarify-output/pass.md   # Expected: exit 0
node.exe .claude/skills/vc-intent-clarify/scripts/validate-intent-clarify-output.mjs .claude/skills/vc-intent-clarify/scripts/fixtures/validate-intent-clarify-output/fail.md   # Expected: exit 1
git diff --name-only $(cat $P/baseline.sha)..HEAD | node.exe $P/claim-check.mjs $P/claim.globs   # Expected: no output (inside Phase 5 claim)
cmp process/development-protocols/references/program-goal-charter-template.md .claude/skills/vc-generate-phase-program/references/program-goal-charter-template.md   # Expected: exit 0 (mirror pair identical, equal to mirror.sha256)
test -s process/general-plans/backlog/vc-agent-browser-screenshots-untrack_NOTE_29-10-26.md   # Expected: exit 0
git diff --check                                                             # Expected: no output
```

(Use `node` where `node.exe` is unnecessary. Script paths of validate-skill-keywords/cross-refs/invocation-wiring: confirm in RESEARCH with `ls .claude/skills/*/scripts/validate-skill-*.mjs`.)

- `proposed-new-skills.md` exists; no skill added or removed; the vc-agent-browser decision cites the restated numbers (53 PNGs, 13.2M in two audit folders of 15M, manifest-excluded, referenced by `scripts/README.md:107` as the runtime output dir) and keeps the directory.

---

## Blockers That Would Justify BLOCKED Status

- Trimming a keyword makes a skill unreachable (revert that skill only).
- agent-browser size comes from a dependency required at runtime (report; no removal).

---

## Phase Completion Rules

- CODE DONE = checklist items done; VERIFIED = Exit Gate commands pass AND full validator suite is not worse than the Phase 0 baseline AND regression checkpoint passes AND validate-contract exists.
- Known-Gap alone never makes a behavior PASS; write a backlog stub and keep that gate CONDITIONAL.

## Acceptance Criteria

- See the Exit Gate commands and the Verification Evidence table; each row names the charter criterion it proves (proven by + strategy).

## Touchpoints

- 33 skill front-matters, a few references folders, agent-browser investigation, catalog JSON

---

## Public Contracts

- Skill names, directories, and the commands they expose unchanged (renaming happens only in Phase 6).

---

## Verification Evidence

| Gate / Scenario | Strategy | Proves SPEC criterion |
|---|---|---|
| 33 skills remain: `ls -d .claude/skills/*/ \| wc -l` == 33 and sorted folder-name file diff vs `$P/pre-skill-folders.txt` empty | Fully-Automated | C-P5: keep all |
| Skill validators in the right ORDER: catalog `--write` then `--check` first (join), then validate-skills, skill-routing, confusable, skill-keywords, skill-cross-refs, invocation-wiring, not worse than Phase 0 baseline; mid-phase set excludes skill-keywords (expected red until the join) | Fully-Automated | C-P5: validators green |
| `node.exe $P/routing-check.mjs` vs frontmatter-sourced `pre-triggers.json`: top-3 phrases retained, none stolen, new overlaps reported | Hybrid (needs saved snapshot) | C-P5: no skill lost from routing |
| `node.exe $P/conservation-check.mjs` over `$P/oversize.list` (vc-intent-clarify split; optional vc-generate-phase-program; 3 skipped with reason) + validate-skill-cross-refs + intent-clarify fixture pair | Fully-Automated | C-P5: splits lose nothing (KG2: behaviour of split skills measured by conservation only) |
| Catalog `--write` (spawned vc-execute-agent, last step) then `--check` (spawned vc-tester) on `main` | Fully-Automated | C-P5: catalog fresh |
| Live model routing after keyword edits | Known-Gap KG1 (not measured; zero billed calls; residual, backlog stub) | C-EQ: routing not worse (CONDITIONAL; routing-check.mjs is the deterministic proxy) |
| agent-browser decision cites the corrected numbers (53 PNGs, 13.2M in two audit folders of 15M, manifest-excluded, `scripts/README.md:107` runtime output dir), keeps the directory, states they are already ignored (Phase 0 A3c) and never in the baseline tag, backlog note records this only | Agent-Probe | C-P5: 15MB explained |
| Proposed skills listed, none added: `test -s $T/proposed-new-skills.md` + folder count 33 | Fully-Automated | C-P5: proposals only |
| `git diff --name-only <P5_START>..HEAD` inside `$P/claim.globs`; single `fix:`/`chore:` commit revertable; charter-template mirror pair `cmp` | Fully-Automated | C-P5: own claim only, rollback unit exists; C-CLEAN: references ship, p5-tools/backlog notes do not |

---

## Phase Loop Progress

Orchestrator reads this before deciding which subagent to spawn next. The canonical 7-step inner loop
`R → I → P → PVL → E → EVL → UP` SKIPS SPEC (the umbrella plan and the user brief act as the SPEC).

- [ ] 1. RESEARCH — vc-research-agent (opus, front-matter): prior phase reports read; test context loaded; plan drift checked
- [ ] 2. INNOVATE — innovate-agent (sonnet): approach decided; Decision Summary written
- [ ] 3. PLAN-SUPPLEMENT — vc-plan-agent (opus, front-matter): existing phase plan updated; Inner Loop Refresh Note if sections changed (or "n/a — research clean")
- [ ] 4. PVL — vc-validate-agent (opus, front-matter): full V1-V7; validate-contract written per `.claude/skills/vc-validate-findings/references/example-validate-output.md`
- [ ] 5. EXECUTE — vc-execute-agent (opus): all checklist items done; per-section test gates run and green (or gaps documented)
- [ ] 6. EVL — vc-tester: all EVL gates green; follow-up stubs registered; EVL HANDOFF SUMMARY written
- [ ] 7. UPDATE PROCESS — vc-update-process-agent (sonnet): phase report written, umbrella state updated, commit done on main

**Validate-contract required.** If step 4 (PVL) is unchecked or `## Validate Contract` reads
"(placeholder — vc-validate-agent writes this section before EXECUTE)", the orchestrator must spawn
vc-validate-agent first. A partial contract (missing Plan updates applied / Execute-agent
instructions / Test gates) is treated as a placeholder.

---

## Test Infra Improvement Notes

(none identified yet)

---

## Resume and Execution Handoff

- Selected plan file path: `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-05-tune-skills_PLAN_29-10-26.md`
- Last completed step: not started
- Validate-contract status: inner PVL phase 5 (inner-pvl: phase-5, 2026-10-30, from V1) supersedes the outer-pvl 2026-10-29 contract and the 2026-10-30 Inner Loop Refresh Note: Gate: PASS (0 FAIL / 0 MUST-FIX / 15 RESIDUAL incl. KG1, KG2 and E1-E13); EXECUTE legal once the E1 entry check holds (Phase 4 committed, exit gate green).
- Supporting context files: umbrella plan, `phase-blast-radius-registry.md`, prior phase report (if any)
- Next step: Spawn vc-research-agent (opus, front-matter) for step 1 RESEARCH of this phase (after Phase 4 is committed and its exit gate is green; sequential on main)

---

## Inner Loop Refresh Note: 2026-10-30 — Entry Gate, Strategy, Blast Radius, conventions, A2, B1-B3, C1-C3, Exit Gate, Verification Evidence, Handoff re-scoped (sequential run + minimal-safe scope)

## Validate Contract

Status: PASS
Date: 30-10-26
date: 2026-10-30
generated-by: inner-pvl: phase-5
supersedes: 2026-10-29 (outer-pvl, PVL cycle 5 PASS) AND the `## Inner Loop Refresh Note: 2026-10-30` above. The old contract was written for the agent-team design (teammate, worktree, merge, join), which decision G removed; the refresh note re-scoped this phase (sequential run, minimal safe tuning). This inner contract replaces both in full. The supplement logs below stay as history only.

V1 line: `V1 RE-VALIDATE TRIGGERED: Inner Loop Refresh Note dated 2026-10-30 is newer than existing contract.` (the old contract is outer-pvl dated 2026-10-29). V1 AUTO-PROCEED did not apply. V1 checks done: `validate-plan-artifact.mjs` on this plan = exit 0, 0 failures, 2 advisory legacy-shape warnings; branch `main`, HEAD b17294d, one worktree; every path the plan names exists. No `## Phase Ordering` in this plan, so there is no dependency-BLOCKED guard to apply. No `## Pre-PVL Conflict Resolution` in this plan.

Parallel strategy: sequential
Rationale: score 3/7 (S4 phase program, S6 none, S7 5+ files; dominant signal S7). User decision G: no agent team. The run is 1 `vc-execute-agent` (opus, front-matter) then 1 `vc-tester` (opus, front-matter) on `main` after Phase 4, so the agent count is 2 and the cost guard is not triggered. This validate pass was ONE fire-and-forget validate-agent (it has no spawn tool). Layer 1 (4 dimensions) and Layer 2 (Step 0, A, B, C, Exit Gate) ran inline, one after another. Every check below was run in a throw-away copy of the real work tree under the scratchpad (deleted afterwards), using Linux `node` v22.23.4. Prior verdicts were not trusted.

### Real-repo facts and checks (V1-V7, inner pass 1)

- **(1) Baseline green except `.agents/skills`:** in the copy at HEAD b17294d, `validate-skills` reported 34 failures and `validate-context-discovery` 38 failures; every one contains `.agents/skills`, so the filtered count is 0 for both. Exit 0 for skill-routing, confusable-skills, skill-keywords, skill-cross-refs, skill-invocation-wiring, agent-parity, guide-sync and protocol-wiring. `generate-skills-catalog.mjs --check` = exit 0, so the 0.2(c) `pre-catalog.json` copy is allowed. Sizes match A2: vc-setup 27741, vc-intent-clarify 26600, vc-update 25719, vc-generate-phase-program 25426, vc-agent-strategy-compare 21659. vc-audit-vc is the only multi-line (`>-`) description.
- **(2) Keyword edits keep top-3 and steal nothing:** I computed top-3 for all 33 skills from front-matter. The pairs sharing more than 2 words are exactly the plan's two: vc-docs-seeker vs vc-feasibility-test (`does|work|api`) and vc-publish vs vc-update (`kit|harness|update`). Edits applied mechanically in the copy: feasibility-test `does this work` -> `viability probe` and `api shape check` -> `response shape probe` (positions 7 and 9); publish `update remote` -> `publish to remote` (position 4); generate-plan `generate spec` removed (position 4); vc-audit-vc description made one double-quoted line. Results: my routing check (top-3 kept, none stolen, top-3 order unchanged) = 0 problems; no pair shares more than 2 words any more. The mid-phase set exited 0 (routing, confusable, cross-refs, invocation-wiring, validate-skills filtered). `validate-skill-keywords` = exit 1 ("catalog stale") between the edits and `--write`, then exit 0 after `--write`. `--check` = exit 1 before `--write` and 0 after. `routedFrom` is non-empty for all 33. The vc-audit-vc catalog `description` string is identical before and after.
- **Measured contained-phrase collisions:** `plan` (generate-plan #1) appears inside 7 phrases, `spec` (generate-spec #1) inside `harden spec` (autoresearch #2) and `generate spec` (generate-plan #4), `complex` (problem-solving #3) inside `complex problem` (sequential-thinking #1), `feasibility` (feasibility-test #1) inside `layer 2 feasibility` (validate-findings #3), and `goal block` (autopilot #5) inside `session goal block` (generate-phase-program #3). Only `generate spec` and `goal block` sit on a non-top-3 side, so only those two can be edited safely under B1. The rest are "left, reason: both sides top-3".
- **(3) The vc-intent-clarify split works:** the four H2 headings exist as named (lines 256, 347, 422, 581). In the copy, their bodies (including their `###` subheadings) moved to `references/dimensions.md` and `references/examples.md`, and each H2 stayed with a one-line pointer. SKILL.md went from 26600 to 18208 bytes. A conservation check passed, and went red when one unique moved line was deleted. Fixtures: `pass.md` exit 0, `fail.md` exit 1. `validate-intent-clarify-output.mjs` reads only its argument file, never SKILL.md. No other validator script names vc-intent-clarify. Protocol docs cite "Dimension 6 of vc-intent-clarify" by name only. All 38 validators gave identical exit codes at pristine HEAD and after all edits plus `--write`. `bash $T/baseline/compare.sh` printed `OK: nothing worse than validators_after_setup.tsv` (exit 0). The manifest `include` has `.claude/skills/**` and no `exclude` pattern matches `references/`, so the new files ship (C-CLEAN Group A). The moved text contains no `vc-`/`VC-` token.
- **(4) Gates and claim check:** `bash -n` passes on the Exit Gate block and on every extra command in this contract. Claim check rehearsed on the sequential model in the copy (Phase 4 stand-in commit, then the `process:` tools commit, then `baseline.sha`, then the `fix:` commit). The real Phase 5 diff gives no output (exit 0). AGENTS.md, this plan file and the frozen charter template are each caught (exit 1). A `claim.globs` holding the literal text `$P/**` breaks the gate (E4). `git revert --no-commit` of the fix commit restores the pre-phase skills and catalog exactly. The charter-template pair gives `cmp` exit 0. Both `node` and `node.exe` exist.
- **(5) Leftovers and entry gate:** the live sections (lines 1-219) contain no team, worktree, merge, SendMessage, TaskList or `comm -12` step. The words "join"/"at the join" remain on lines 57, 69 and 172; they are cosmetic (E11). The entry gate is NOT met today (Phase 4 is not executed: AGENTS.md is 37,885 bytes and there is no `p4-tools/p4_fix_sha.txt`). That is expected at PVL time; E1 makes the check mechanical.
- **(6) Interplay:** Phase 6 line 97 already puts `vc-intent-clarify/references/*` in its rename set. The new names do not start with `vc-`, so Phase 6 G5 (`find -name 'vc-*'`) is unaffected. Phase 3's census and guardrail tools read agent files only. C-CLEAN: the references files ship; `p5-tools/**`, `proposed-new-skills.md`, the report and `process/general-plans/backlog/*_NOTE_*` are in the DOOMED SET / CC2 deny patterns. vc-agent-browser facts re-verified read-only in the real tree: 15M, 53 PNGs, the audit folders are 8.9M and 4.3M, `.gitignore:10` ignores the folder, 0 tracked paths, 0 paths in `upstream-baseline`, named by `scripts/README.md:107`, no `node_modules`. The plan stays non-destructive.
- **Real-YAML hazard found:** a one-line vc-audit-vc description WITHOUT quotes passes every repo validator (their parser is line-based), but PyYAML rejects it ("mapping values are not allowed here", because of `health: Claude`). Today all 33 front-matters parse as real YAML. E3 makes the quoted form mandatory.

### MUST-FIX / RESIDUAL classification

MUST-FIX: 0. No gate is unsatisfiable, no step is unsafe once E1-E13 are followed, and no protocol rule is broken.
RESIDUAL (15): Known Gaps KG1, KG2 and execute/tester instructions E1-E13 below. None needs a plan edit; the contract instructions bind EXECUTE and EVL.

### Plan updates applied

None, except this contract and the handoff status line.

### Test gates (C3 5-column table)

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P5 | 33 skills remain, folder names unchanged | Fully-Automated | `ls -d .claude/skills/*/ \| wc -l` == 33 AND `diff $P/pre-skill-folders.txt $P/post-skill-folders.txt` empty | B |
| C-P5 | skill validators not worse than Phase 0, in the right order | Fully-Automated | after `--write`: `--check` exit 0, then skill-routing, confusable, skill-keywords, skill-cross-refs, invocation-wiring exit 0, and validate-skills filtered (X1) exit 0; mid-phase set excludes skill-keywords | B |
| C-P5 | full validator suite not worse than Phase 0 baseline | Fully-Automated | X4 `bash $T/baseline/compare.sh` exit 0 (green with the planned edits in the copy) | A (rehearsed) + B |
| C-P5 | catalog fresh | Fully-Automated | `--write` (executor, last edit) then `--check` exit 0 (tester); `routedFrom` non-empty for 33 | B |
| C-P5 | each skill still reachable by its recorded top-3 phrases, none stolen | Hybrid (needs the saved snapshot) | `node $P/routing-check.mjs` exit 0 against `pre-triggers.json` (E7) | B |
| C-P5 | split loses nothing; fixtures unchanged | Fully-Automated | `node $P/conservation-check.mjs` exit 0 (E8), H2 headings plus pointers kept, `validate-skill-cross-refs` exit 0, `pass.md` exit 0, `fail.md` exit 1 | B |
| C-P5 | front-matter only on every skill except vc-intent-clarify (covers strategy-compare and the vc-generate-phase-program no-split decision) | Fully-Automated | X5 body gate below exit 0 | B (row added by this contract) |
| C-P5 | vc-audit-vc description still valid YAML and unchanged in meaning | Fully-Automated | X2 below exit 0 | B (row added by this contract) |
| C-P5 | own claim only, rollback unit exists, mirror pair frozen | Fully-Automated | claim check prints nothing; one `fix:`/`chore:` commit; `cmp` of the charter-template pair exit 0 | A (rehearsed) + B |
| C-P5 / decision E | AGENTS.md byte budget kept | Fully-Automated | X3 `test "$(wc -c < AGENTS.md)" -le 32768` | B |
| C-P5 | proposals only | Fully-Automated | `test -s $T/proposed-new-skills.md` AND folder count 33 | B |
| C-P5 | 15MB of vc-agent-browser explained with correct numbers, directory kept | Agent-Probe | judge checks the report and the backlog note against the facts in (6) above | A (facts verified now) + B |
| C-EQ | live model routing after keyword edits; split-skill behaviour | Known-Gap (KG1, KG2) | not a proving strategy; residual row | C (Phase 8 B4 golden run old vs final) + D (recorded in the Phase 5 report, E9) |

Extra gate commands (bash, from the repo root, run by the spawned vc-tester after `--check`; `T`, `P` as in the plan; all passed `bash -n`; X1, X2, X4, X5 green in the rehearsal; X3 red until Phase 4 has run):

```bash
T=process/general-plans/active/vibebelt-rebrand_29-10-26; P=$T/p5-tools
# X1 validate-skills, failures other than .agents/skills must be none
node .claude/skills/vc-audit-vc/scripts/validate-skills.mjs | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const f=JSON.parse(s).failures.filter(x=>!x.includes(".agents/skills"));console.log(f.join("\n"));process.exit(f.length?1:0)})'   # Expected: exit 0
# X2 vc-audit-vc description: unchanged >- block, or ONE double-quoted line; catalog string identical
grep -qE '^description: >-$|^description: "[^"\\]*"$' .claude/skills/vc-audit-vc/SKILL.md && node -e 'const a=require(process.argv[1]).skills.find(s=>s.folder==="vc-audit-vc").description,b=require(process.argv[2]).skills.find(s=>s.folder==="vc-audit-vc").description;process.exit(a===b?0:1)' "$PWD/$P/pre-catalog.json" "$PWD/process/context/generated-skills-catalog.json"   # Expected: exit 0
# X3 AGENTS.md byte budget (decision E standing contract)
test "$(wc -c < AGENTS.md)" -le 32768   # Expected: exit 0
# X4 full suite not worse than the Phase 0 baseline
bash $T/baseline/compare.sh   # Expected: exit 0 (OK: nothing worse)
# X5 front-matter only for every skill except vc-intent-clarify; vc-generate-phase-program gains no file
B=$(cat $P/baseline.sha); bad=0
for f in .claude/skills/*/SKILL.md; do
  case "$f" in .claude/skills/vc-intent-clarify/SKILL.md) continue ;; esac
  git show "$B:$f" | awk 'c>=2{print;next} /^---$/{c++}' > $P/body-before.txt
  awk 'c>=2{print;next} /^---$/{c++}' "$f" > $P/body-after.txt
  cmp -s $P/body-before.txt $P/body-after.txt || { echo "BODY CHANGED: $f"; bad=1; }
done
test -z "$(git diff --name-only $B..HEAD -- .claude/skills/vc-generate-phase-program/ ':!.claude/skills/vc-generate-phase-program/SKILL.md')" || { echo "vc-generate-phase-program: extra file"; bad=1; }
test "$bad" = 0   # Expected: exit 0
```

Failing stubs (Fully-Automated rows, red-first for the execute-agent):
- test("should keep exactly 33 skill folders with unchanged names", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep exactly 33 skill folders with unchanged names") })
- test("should keep skill validators not worse than Phase 0 and run skill-keywords only after --write", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep skill validators not worse than Phase 0 and run skill-keywords only after --write") })
- test("should keep the full validator suite not worse than the Phase 0 baseline", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep the full validator suite not worse than the Phase 0 baseline") })
- test("should regenerate the catalog with --write and pass --check", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should regenerate the catalog with --write and pass --check") })
- test("should conserve every line moved out of vc-intent-clarify and keep the fixture pair", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should conserve every line moved out of vc-intent-clarify and keep the fixture pair") })
- test("should change only front-matter in every skill except vc-intent-clarify", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should change only front-matter in every skill except vc-intent-clarify") })
- test("should keep the vc-audit-vc description valid YAML with an identical catalog string", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep the vc-audit-vc description valid YAML with an identical catalog string") })
- test("should keep phase 5 diff inside its claim globs with the mirror pair unchanged", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep phase 5 diff inside its claim globs with the mirror pair unchanged") })
- test("should keep AGENTS.md at or under 32768 bytes", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep AGENTS.md at or under 32768 bytes") })
- test("should list proposed skills without adding any", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should list proposed skills without adding any") })

Legacy line form:
- skill count/names: [Fully-automated: ls -d .claude/skills/*/ | wc -l == 33 + sorted folder-list diff]
- validators: [Fully-automated: mid-phase set without skill-keywords; after --write: --check, skill-keywords and the rest; X1 filter; X4 compare.sh]
- catalog: [Fully-automated: generate-skills-catalog.mjs --write (executor) then --check (tester)]
- front-matter scope: [Fully-automated: X5 body gate, X2 YAML-safe description]
- routing: [hybrid: routing-check.mjs vs pre-triggers.json snapshot]
- split: [Fully-automated: conservation-check.mjs + fixture pair + cross-refs]
- claim/rollback: [Fully-automated: claim-check.mjs, one revertable commit, cmp mirror pair, X3]
- agent-browser: [agent-probe: decision report with verified numbers]
- live routing / split behaviour: [known-gap: KG1, KG2, measured only by Phase 8 B4]

### Known Gaps (named residuals, excluded from the CONCERN/FAIL count)

- KG1 Live model routing after the keyword edits is not measured (zero billed calls). routing-check proves the recorded top-3 phrases stay on their skill and no phrase moved to another skill; it does not prove a model picks the skill for a user's wording. Non-top-3 phrases are not protected. Resolution: C (Phase 8 B4 golden run old vs final) + D (recorded in the Phase 5 report).
- KG2 Behaviour of the split vc-intent-clarify is measured by conservation only (text moved verbatim, headings and pointers kept); it is not proven that the skill behaves the same when the dimensions and examples load on demand. Resolution: C (Phase 8 B4) + D (Phase 5 report).

### Execute-agent and tester instructions (RESIDUAL; binding; no plan edit needed)

- E1 Entry check (orchestrator before spawning; executor repeats it first). Phase 3 and Phase 4 must be done with Phase 4 committed and its EVL green: `test -s $T/p4-tools/p4_fix_sha.txt && git merge-base --is-ancestor "$(cat $T/p4-tools/p4_fix_sha.txt)" HEAD && test -s $T/phase-04-doc-dedup_REPORT_29-10-26.md && test "$(wc -c < AGENTS.md)" -le 32768 && node .claude/skills/vc-audit-context/scripts/generate-skills-catalog.mjs --check && test -z "$(git status --porcelain -- .claude process/context/generated-skills-catalog.json AGENTS.md CLAUDE.md)"`. All must hold, and the Phase 4 UPDATE PROCESS commit must already be on `main`, before Step 0. If not: stop with NEEDS_CONTEXT.
- E2 ORCHESTRATOR DECISION: `vc-generate-phase-program` is NOT split. This overrides the optional split sentence still in B2 ("Optional: `vc-generate-phase-program` ... only if a clean example block exists") and the matching words in Blast Radius and Verification Evidence. In `oversize.list` write it as `vc-generate-phase-program 25426 skipped, orchestrator decision (no split in Phase 5)`. Its SKILL.md may change only in front-matter, and no new file may appear under its folder (gate X5). The only split is vc-intent-clarify.
- E3 vc-audit-vc description: either leave the `>-` block unchanged (default), or make it ONE line wrapped in double quotes with the same words joined by single spaces: `description: "Audit agent harness health: ... split, or drift."`. Never write it unquoted: that passes the repo validators but breaks real YAML parsing (verified with PyYAML). Gate X2.
- E4 Write `$P/claim.globs` with EXPANDED repo-relative paths (`process/general-plans/active/vibebelt-rebrand_29-10-26/p5-tools/**` and so on), never the literal text `$P` or `$T`; the claim-check reads lines literally (rehearsed: a literal `$P/**` makes the gate fail). The globs are the 0.6 list plus nothing else.
- E5 Between `baseline.sha` and the tester's claim check, commit ONLY claim paths: no plan file, `results.tsv`, iteration report, umbrella or registry edit (a plan-file commit in that range fails the gate, rehearsed). The checklist ticks and bookkeeping go into the UPDATE PROCESS commit after EVL.
- E6 Order: the executor runs `generate-skills-catalog.mjs --write` as its last edit, then makes ONE `fix:` (or `chore:`) commit with an explicit file list. The tester does NOT run the Exit Gate's first line (`--write`); it starts at `--check`. For `validate-skills.mjs` the tester uses X1 (the raw command exits 1 because of `.agents/skills`). The tester also runs X2-X5 and `node --version` (record which runtime: `node` or `node.exe`).
- E7 Step 0.2(b): `pre-triggers.json` stores BOTH each skill's top-3 AND its full `trigger_keywords` list. The "stolen" rule ("appears in another skill's list where it did not before") needs the full pre-lists; top-3 alone cannot answer it. `routing-check.mjs` also fails if a skill's first three phrases change order.
- E8 `conservation-check.mjs`: "headings" means the `## ` (H2) lines. The `###` subheadings inside a moved section move with its body and count as moved lines. Count removed lines as a multiset (a line that occurs k times must occur at least k times across the references files), so repeated lines such as code fences are counted too. Reference file names must not start with `vc-` (proposal: `references/dimensions.md`, `references/examples.md`). Each pointer line names its file in backticks as `references/<name>.md` so `validate-skill-cross-refs` resolves it.
- E9 Record KG1 and KG2 in the Phase 5 report (a claim path). Do NOT create another backlog file: only the screenshots note is in the claim.
- E10 B1 edits are limited to non-top-3 phrases and must not add a phrase any other skill lists. The measured candidates are feasibility-test #7 `does this work` and #9 `api shape check`, and publish #4 `update remote`. Also allowed under the same rule (measured here): generate-plan #4 `generate spec` and autopilot #5 `goal block`. Every other contained-phrase collision is "left, reason: both sides top-3". Report each decision in the `skill | field | old | new | reason` table.
- E11 Read the remaining words "join"/"at the join" (lines 57, 69, 172) as "after the final `--write` on `main`". There is no join step.
- E12 vc-agent-browser: run the A3 measurements in the real work tree (the screenshots are untracked and ignored). Never move, delete or `git add` anything under `screenshots/`. Give the backlog note the same front-matter keys as the existing notes (`status:`, `item:`, `reason:`).
- E13 Phase 5 never edits `CLAUDE.md`, `AGENTS.md`, `process/development-protocols/**` or either charter-template copy. No billed model call anywhere in this phase.

Open gaps: none (0 MUST-FIX). KG1 and KG2 are named residuals with resolution C + D.

### Dimension findings

- Infra fit: PASS — every validator, the catalog generator, `compare.sh` and both node runtimes exist and behave as the plan says (reproduced); the `--write` -> `--check` order is right; nothing touches containers, ports or runtime surfaces.
- Test coverage: PASS — every developed behavior has a Fully-Automated or Hybrid gate (folder count, validators, full-suite compare, catalog, routing-check, conservation plus fixtures, X2, X5, claim, X3). Agent-Probe covers the screenshots report. KG1/KG2 are measurement limits resolved at Phase 8 B4, so this is not a vacuous green.
- Breaking changes: PASS — skill names, folders and invoked commands are unchanged. Top-3 phrases are kept and protected. The split keeps every H2 heading. The new references files ship. Protocol citations of "Dimension 6" still resolve by name. The catalog is regenerated in the same commit.
- Security surface: PASS — skill front-matter and prose only: no tool grants, secrets, auth, billing, schema, public API or deploy surface (vc-risk-evidence-pack not required); zero billed calls; nothing deleted. The one hazard found (unquoted YAML) is closed by E3/X2.
- Step 0 (tools and snapshot) feasibility: PASS — mechanics rehearsed (snapshot, routing, conservation and claim tools); E4, E7, E8.
- Section A (audit) feasibility: PASS — sizes, overlap matrix and vc-agent-browser numbers re-verified; E12.
- Section B (tune) feasibility: PASS — the keyword edits and the split were applied in the copy with all validators green after `--write`; E2, E3, E10.
- Section C (proposals and catalog) feasibility: PASS — the sequential claim check and the revert of the single commit were rehearsed; E5, E6, E9.
- Exit Gate feasibility: PASS — `bash -n` clean; every command runnable; the order is fixed by E6; X1-X5 added.

Net gate derivation: Layer 1 = 0 FAIL / 0 CONCERN / 4 PASS; Layer 2 = 0 FAIL / 0 CONCERN / 5 PASS. MUST-FIX 0; RESIDUAL 15 (KG1, KG2, E1-E13). Contradiction check: the plan's "optional vc-generate-phase-program split" vs the orchestrator decision is resolved by E2 (the decision wins); the plan's Verification row label "CONDITIONAL" for KG1 refers to that criterion row, which this contract carries as a named residual with resolution C + D. Net gate: PASS.

Signal legality: Gate = PASS, condition (a), so `PHASE_COMPLETE: VALIDATE` is legal. This is inner pass 1 with 0 inner validate-fix loops (the task-folder `results.tsv` holds the program's 8 outer cycle rows): emit `PHASE_COMPLETE: VALIDATE — validate-contract written. Proceed to EXECUTE.` EXECUTE may start only after the E1 entry check passes (Phase 4 committed, its exit gate green).

Autonomous goal block: BRANCH B (the umbrella has `## Stable Program Goal`), so no Autonomous Goal Block section is written to this phase plan. Reference for latest state: `process/general-plans/active/vibebelt-rebrand_29-10-26/vibebelt-rebrand-umbrella_PLAN_29-10-26.md`.

What This Coverage Does NOT Prove (What this coverage does NOT prove):
- Folder count and name diff: prove no skill was added, removed or renamed; not that each skill still works.
- Validator gates and compare.sh: prove the repo's own structural checks are not worse; those checks use a line-based front-matter parser, so they do not prove real YAML validity (X2 covers only vc-audit-vc; all other edits are keyword lists without colons).
- routing-check: proves recorded top-3 phrases stay and are not taken by another skill; not that a live model routes a user's wording to the right skill (KG1); non-top-3 phrases are unprotected.
- conservation-check, fixtures, cross-refs: prove the moved text exists verbatim and the pointers resolve; not that vc-intent-clarify behaves the same when its dimensions and examples load on demand (KG2); the fixture pair tests the output validator, not the skill.
- X5 body gate: proves bodies are unchanged except vc-intent-clarify; not that Phase 1's text inside them is correct (Phase 1's gates do that).
- Claim check and revert: prove the committed paths stay inside the claim and the one commit reverts cleanly; not uncommitted work-tree changes.
- Agent-browser Agent-Probe: proves the explanation matches verified numbers; not anything about the untracked PNG contents.
- All checks ran under Linux node on a WSL drvfs checkout; macOS and native Windows are unproven.

Gate: PASS (0 FAIL / 0 MUST-FIX / 15 RESIDUAL; inner PVL pass 1; EXECUTE legal once the E1 entry check holds)
Accepted by: not required for PASS; KG1, KG2 and E1-E13 recorded as named residuals (session, inner PVL phase 5, 2026-10-30).

---

## Supplement cycle 1 (PVL-supplement, 29-10-26)

Addressed G1-G7: catalog gate = `--write` then `--check` once at the join after Phase 4 (C2); routing-check.mjs plus pre-change snapshot, "main phrase" = recorded top-3 trigger_keywords (0.2, 0.3); conservation check and numeric threshold (> 20000 bytes proposal, >= 30 percent body drop) for oversize splits (0.4, A2, B2); validate-skills judged against Phase 0 baseline (0.5); keywords, cross-refs, invocation-wiring validators added to gate; agent-browser facts recorded, non-destructive only (A3); entry gate and handoff text now "after Phase 3 exit gate, parallel with Phase 4"; tier re-confirm (0.1). Registry change needed: Phase 5 claim to list `p5-tools/`, `proposed-new-skills.md` and the catalog regeneration at the orchestrator join. Validate-contract above retained unchanged.
- Supplement cycle 1c: Exit Gate validator paths corrected (validate-skill-keywords and validate-skill-cross-refs live under `.claude/skills/vc-audit-context/scripts/`; validate-skills and validate-skill-invocation-wiring under `vc-audit-vc/scripts/`); Verification Evidence rows refer to these real paths.

---

## PVL cycle 2 supplement request (29-10-26)

Issued by vc-validate-agent (outer-pvl re-run from V1). Gate was CONDITIONAL with 0 FAIL; the orchestrator spawns vc-plan-agent (PVL-supplement mode) with this block, then re-spawns vc-validate-agent from V1.

SUPPLEMENT REQUEST:
- Gap 1: Section implementation-checklist + exit-gate (items B1, B2) | Concern: `validate-skill-keywords.mjs` runs `generate-skills-catalog.mjs --check` internally, so any `description`/`trigger_keywords` edit makes it exit 1 until `--write`; the Exit Gate runs it BEFORE the `--write` line and B1/B2 run "the validators" per skill while the catalog is regenerated only at the join | Severity: CONCERN | Suggested addition: Exit Gate order = join (`--write`, `--check`) first, then validators; mid-phase set = routing-check, conservation-check, validate-skill-cross-refs, confusable, skill-routing, skills, invocation-wiring; state `validate-skill-keywords` is expected-red until the join.
- Gap 2: Section implementation-checklist + verification-evidence (items A3) | Concern: facts are wrong: the screenshots dir holds 53 PNG files (two audit folders 4.3M + 8.9M of the 15M, one 0-byte mock), not 7; `scripts/README.md:107` says "Always save screenshots to `.claude/skills/vc-agent-browser/screenshots`", so the dir is a runtime output path and "no file references screenshots/" is false; the Agent-Probe would force the judge to accept false facts | Severity: CONCERN | Suggested addition: restate the numbers (53 PNGs, 13.2M in two audit folders, manifest-excluded, referenced by scripts/README.md:107); decision stays non-destructive and keeps the directory (for example proposal: gitignore plus untrack contents, backlog note for user approval).
- Gap 3: Section implementation-checklist + exit-gate (items 0.2, 0.4, A2) | Concern: `p5-tools/…`, `proposed-new-skills.md` are task-folder-relative but mixed with repo-root commands; `<p5-baseline>` is never recorded; the gate uses `p5-tools/pre-skill-folders.txt` but 0.2 never names that file; the snapshot copies the catalog, which may be stale at start (Phase 2 edited vc-update/vc-setup/vc-publish SKILL.md); the oversize list is five skills (vc-agent-strategy-compare 21645 also > 20000) and no list file is named | Severity: CONCERN | Suggested addition: `P=process/general-plans/active/vibebelt-rebrand_29-10-26/p5-tools`, call `node.exe $P/…` from repo root; step 0.6 `git rev-parse HEAD > $P/baseline.sha`; 0.2 names `pre-skill-folders.txt` and takes top-3 phrases from SKILL.md frontmatter (or runs `--check` first); RESEARCH writes `$P/oversize.list` with the numeric threshold.
- Gap 4: Section implementation-checklist (items C3) | Concern: `git diff --name-only <p5-baseline>..HEAD` on a shared `main` contains Phase 4's files; no worktree/branch or rollback unit for the teammate | Severity: CONCERN | Suggested addition: same as Phase 4 Gap 5: one worktree + branch per teammate merged at the join, claim-check on each branch diff, revert rehearsal.
- Gap 5: Section implementation-checklist (items C2) | Concern: the join is run by the orchestrator in its own shell (`--write` edits a generated file, joint suite is gate running); AGENTS.md Skill Registry duplicates the keywords being edited; the charter-template pair has no equality check | Severity: CONCERN | Suggested addition: orchestrator sequences only; spawned vc-execute-agent runs `--write`, spawned vc-tester runs `--check` and the suite; add `cmp` of the charter-template pair and a pointer to Phase 4's Skill Registry decision (Phase 4 Gap 6).

---

## Supplement cycle 2 (PVL-supplement, 29-10-26)

Addressed all 5 gaps of the cycle-2 request. G1: Exit Gate order = join (`--write`, `--check`) first, then validators; mid-phase set = routing-check, conservation-check, validate-skill-cross-refs, confusable, skill-routing, skills, invocation-wiring; `validate-skill-keywords` stated as expected-red until the join (B1, B2, Exit Gate). G2: agent-browser facts restated (53 PNGs, 13.2M in two audit folders of 15M, manifest-excluded, referenced by `scripts/README.md:107` as runtime output dir); decision stays non-destructive and keeps the directory; gitignore + untrack proposed via backlog note for user approval (A3, B3). G3: `T`/`P` variables, `node.exe $P/...` from repo root, `$P/baseline.sha` and `claim.globs` (0.6), `pre-skill-folders.txt` named (0.2), top-3 phrases from SKILL.md frontmatter (catalog copy only if `--check` passes), `$P/oversize.list` written by RESEARCH with numeric threshold and five skills incl. vc-agent-strategy-compare 21645 (A2). G4: worktree + branch `p5-skills-tune` merged at the join, claim-check on the branch diff, merge revert rehearsal (C3). G5: orchestrator only sequences the join; spawned vc-execute-agent runs `--write`, spawned vc-tester runs `--check`, mirror-pair `cmp` and the suite; pointer to Phase 4's Skill Registry decision recorded in the conventions block (C2).

Registry/umbrella changes needed (orchestrator): Phase 5 claim gains `process/general-plans/active/vibebelt-rebrand_29-10-26/p5-tools/**`, `proposed-new-skills.md`, the phase report and the new backlog note `process/general-plans/backlog/vc-agent-browser-screenshots-untrack_NOTE_29-10-26.md`, with the protocol- and skill-side charter-template mirror copies explicitly frozen/excluded; record teammate branch `p5-skills-tune`; umbrella Locked Decision (f) wording as stated in the Phase 4 supplement note (orchestrator sequences the join; spawned vc-execute-agent runs `--write`, spawned vc-tester runs `--check` and the suite).

---

## PVL cycle 3 supplement request (29-10-26)

Issued by vc-validate-agent (outer-pvl re-run from V1, PVL cycle 3). Gate was CONDITIONAL with 0 FAIL and 1 MUST-FIX; the orchestrator spawns vc-plan-agent (PVL-supplement mode) with this block, then re-spawns vc-validate-agent from V1. Everything else found this cycle is carried as RESIDUAL (Known Gaps KG1-KG2, execute-agent instructions E1-E5 in the Validate Contract) and needs no plan edit.

SUPPLEMENT REQUEST:
- Gap 1: Section implementation-checklist (items 0.2, A2, C3) | Concern: A2 says "RESEARCH writes `$P/oversize.list`" and 0.2 says "RESEARCH may script this as `$P/snapshot.mjs`", but `vc-research-agent` has `disallowedTools: Write` and a Strictly Forbidden entry "Modifying any files"; as written either the file is never created (the `conservation-check.mjs` input is missing, Exit Gate red) or RESEARCH breaks its phase lock. Also the Exit Gate and C3 run `node.exe $P/claim-check.mjs` but no Step 0 item creates that tool (C3 only says RESEARCH "may reuse" Phase 4's `p4-tools/claim-check.mjs`, which lives in the other teammate's worktree/branch) | Severity: CONCERN (MUST-FIX: phase lock violated, gate tool missing) | Suggested addition: in A2 and 0.2 say RESEARCH only REPORTS the numeric threshold, the per-skill byte sizes and the snapshot approach in its findings, and the EXECUTE agent writes `$P/oversize.list` and `$P/snapshot.mjs` in Step 0 (before 0.6); add a Step 0 item creating `$P/claim-check.mjs` (same interface as Phase 4: name list on stdin, `claim.globs` with `!` excludes, prints paths outside the claim) and have C3 and the Exit Gate call that path.

## Supplement cycle 3 (PVL-supplement, 29-10-26)

Addressed 1 gap (MUST-FIX M1) plus 2 residuals: RESEARCH only reports threshold, sizes and snapshot approach; EXECUTE writes `$P/oversize.list` and `$P/snapshot.mjs` in Step 0 before 0.6 (0.2, A2); new item 0.4a creates `$P/claim-check.mjs`, called by C3 and the Exit Gate; A3 fact corrected (429 bytes); 0.5 wording now 'not worse than baseline, work tree keeps the text file'. Validate-contract above retained unchanged.

## PVL cycle 4 note (29-10-26)

vc-validate-agent re-ran V1-V7 (outer-pvl). The cycle-3 MUST-FIX (Step 0 ownership of `oversize.list`, `snapshot.mjs` and `claim-check.mjs`) is closed and no new MUST-FIX was found. Validate-contract above supersedes the cycle-3 contract. No plan edit made in this pass.

Supplement (screenshots decision): Phase 5 now treats the agent-browser screenshots as already ignored (Phase 0 A3c) and never in the baseline tag; the backlog note only records that, no `.gitignore`/untrack proposal. Earlier supplement-log lines saying `.gitignore` has no screenshots rule are historical (pre-decision) and superseded.

Supplement (ripple of 2026-10-29 decisions): model labels corrected to front-matter reality (research, plan, validate, tester = opus; innovate, spec, update-process = sonnet; EXECUTE = opus; Phase 1 A1 table, Decision B). for .claude/skills/*agent-strategy-compare/SKILL.md this phase edits front-matter / trigger_keywords / description ONLY; its Model Selection Policy body belongs to Phase 1 (F2) and must stay intact.

Supplement (inner 3, scope decision, 2026-10-30): user decision = Phases 4 and 5 run SEQUENTIALLY on `main` (no agent team; TeamCreate unavailable); C-EQ quality floor. Orchestrator scope (delegated): minimal safe tuning, ZERO billed calls. Changes: Entry Gate = Phase 4 committed + exit gate green; all team/worktree/branch/merge/`git revert -m 1`/`comm -12`/join items removed (E3, E5 retired); B1 = front-matter edits only on non-top-3 phrases for the measured overlaps, change table required, vc-audit-vc `>-` normalized only if validators accept; B2 = split ONLY vc-intent-clarify (optional vc-generate-phase-program, not the charter template), vc-setup/vc-update/vc-agent-strategy-compare `skipped, reason`, new reference names not `vc-`, 30-percent rule dropped, fixture pair added to the gate; A2 sizes re-measured (vc-update 25719, vc-agent-strategy-compare 21659); B3/C1 notes are internal records (do not ship); `--write` is the last EXECUTE step, then `--check` + validators by vc-tester; claim check `baseline.sha..HEAD`; rollback = one revertable commit. Residuals: KG1 live model routing not measured; KG2 split skills measured only by conservation. The Validate Contract below predates this note (outer-pvl, 2026-10-29) and must be re-run (inner PVL).
