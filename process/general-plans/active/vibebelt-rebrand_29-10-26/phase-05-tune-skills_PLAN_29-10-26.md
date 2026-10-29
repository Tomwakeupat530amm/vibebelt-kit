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

- Phase 3 exit gate green (Phase 4 may run at the same time, as a team). Handoff text everywhere: "after Phase 3 exit gate, parallel with Phase 4".

---

## Strategy Recommendation (vc-agent-strategy-compare)

- Signals: S4 yes, S7 yes — score 3/7.
- Recommended: **Agent team**, same team as Phase 4 (`TeamCreate` "vibebelt-p4-p5", teammate `p5-skills-tune`, its own `TaskCreate` task, `SendMessage` to `p4-docs-dedup` before touching anything outside the registry claim, `TaskList` to track). Not parallel subagents. Sonnet for research/plan/validate/audit; opus for the teammate leg that edits skill files. Fallback: sequential after Phase 4.

---

## Blast Radius (disjoint from Phase 4 — see registry)

- `.claude/skills/*/SKILL.md` (frontmatter `description`, `trigger_keywords` only; bodies untouched except oversize splitting into `references/`) and new `.claude/skills/*/references/*` files created by those splits
- `.claude/skills/vc-agent-browser/**` (investigation only; no change, see A3/B3)
- `process/context/generated-skills-catalog.json` (regenerated only at the join)
- New task-folder tools and files: `$P/*` (scripts, `baseline.sha`, `claim.globs`, snapshots, `oversize.list`), `$T/proposed-new-skills.md`; one new backlog note `process/general-plans/backlog/vc-agent-browser-screenshots-untrack_NOTE_29-10-26.md` (outside the task folder, new file)
- NOT touched: `CLAUDE.md`, `AGENTS.md`, `process/development-protocols/**`, and BOTH charter-template mirror copies (frozen in Phases 4/5: `.claude/skills/vc-generate-phase-program/references/program-goal-charter-template.md` and the protocol-side copy; `cmp`-checked at the join)

### Path variables and conventions (apply to every command in this plan)

```bash
T=process/general-plans/active/vibebelt-rebrand_29-10-26
P=$T/p5-tools
```

- ALL commands run from the repo root (or from the teammate's worktree root, same layout) as `node.exe $P/<script> [--root <dir>]`. No command in this plan is task-folder-relative. `node` may replace `node.exe` where available.
- Bash only (WSL). Sort with `LC_ALL=C sort`. No process substitution (`<(...)`) in any gate: write both sides to files, then `diff` the files.
- Git: the Phase 5 teammate works in its OWN worktree + branch (`p5-skills-tune`, `git worktree add ../vibebelt-p5 -b p5-skills-tune $(cat $P/baseline.sha)`), merged at the join together with `p4-docs-dedup`. Fallback (no team tooling): run Phase 5 sequentially after Phase 4 on `main`; claim-check then runs on `git diff --name-only $(cat $P/baseline.sha)..HEAD`.
- Coupling to Phase 4 (no edit by Phase 5): Phase 4 A1 replaces the AGENTS.md "Skill Registry" table (30 rows, duplicates the `trigger_keywords` edited here) with a plain-path pointer to the generated catalog / `discover-skills.mjs`. Catalog `routedFrom` is a substring match against AGENTS.md, CLAUDE.md and the catalog itself (`shared-skill-utils.mjs` lines 90-110), so it stays non-empty for all skills; confirm at the join.

---

## Implementation Checklist

### Step 0 - Tools and snapshot (red-first)

- [ ] 0.1 Re-confirm test tiers at inner PVL after Phase 0 creates `process/context/tests/all-tests.md`.
- [ ] 0.2 Save the pre-change snapshot in `$P/` BEFORE any skill edit. Take the data from the SKILL.md frontmatter files themselves (not from a possibly stale catalog; Phase 2 edited vc-update / vc-setup / vc-publish SKILL.md): (a) `$P/pre-skill-folders.txt` = `ls -d .claude/skills/*/ | LC_ALL=C sort`; (b) `$P/pre-triggers.json` = per-skill top-3 `trigger_keywords` in frontmatter order ("main phrase" = these recorded top-3); (c) `$P/pre-catalog.json` = copy of `process/context/generated-skills-catalog.json` ONLY if `node.exe .claude/skills/vc-audit-context/scripts/generate-skills-catalog.mjs --check` exits 0 first; if it is stale, do NOT run `--write` here, record the staleness in the report and rely on (a)+(b). RESEARCH is read-only: it only REPORTS the snapshot approach in its findings; the EXECUTE agent writes `$P/snapshot.mjs` and runs it here in Step 0, before 0.6.
- [ ] 0.3 Write `$P/routing-check.mjs`: for every skill assert its recorded top-3 phrases (from `pre-triggers.json`) are all still in its post-change `trigger_keywords`/description, and none of them now appears in another skill's `trigger_keywords` it did not before ("stolen"); report pairs sharing more than 2 keywords (new overlaps). Exit 1 on any miss.
- [ ] 0.4 Write `$P/conservation-check.mjs` (input list `$P/oversize.list`, see A2): for each skill in the list whose SKILL.md body changed vs `$P/baseline.sha`, every removed non-empty line exists verbatim in that skill's `references/` files; SKILL.md keeps all headings and gains a pointer line; exit 1 otherwise.
- [ ] 0.4a Write `$P/claim-check.mjs` (Phase 5's own copy; same interface as Phase 4's `claim-check.mjs`: changed-path name list on stdin, `$P/claim.globs` as argument with `!` excludes, prints every path outside the claim, exit 1 if any). The EXECUTE agent writes it in Step 0; C3 and the Exit Gate call `$P/claim-check.mjs`, never Phase 4's.
- [ ] 0.5 Record the validator baseline from Phase 0 (validate-skills and validate-context-discovery are red at baseline only because `.agents/skills` is a 17-byte text file kept in the work tree). "Red" in this phase means WORSE than the Phase 0 baseline: validate-skills failure lines excluding `.agents/skills` must be empty.
- [ ] 0.6 After 0.2-0.4 tools are committed as a process commit: `git rev-parse HEAD > $P/baseline.sha`; write the machine-readable claim `$P/claim.globs` (one glob per line, `!` = excluded): `.claude/skills/*/SKILL.md`, `.claude/skills/*/references/**`, `!.claude/skills/vc-generate-phase-program/references/program-goal-charter-template.md`, `process/context/generated-skills-catalog.json`, `$P/**`, `$T/proposed-new-skills.md`, `$T/phase-05-tune-skills_REPORT_29-10-26.md`, `process/general-plans/backlog/vc-agent-browser-screenshots-untrack_NOTE_29-10-26.md`. The orchestrator keeps the registry prose claim equal to this file. Then create the worktree/branch (see conventions) and record `sha256sum` of the charter-template mirror pair in `$P/mirror.sha256`.

### Step A - Audit (read-only)

- [ ] A1. Run `discover-skills.mjs` (accepts only `--json`; no phrase matching) and build a keyword-overlap matrix; list pairs sharing more than 2 trigger words or confusable per `validate-confusable-skills.mjs`.
- [ ] A2. RESEARCH (read-only) REPORTS the numeric threshold (default proposal > 20000 bytes), the per-skill byte sizes and the snapshot approach in its findings; the EXECUTE agent writes `$P/oversize.list` in Step 0 (before 0.6) with the threshold on its first line (`# threshold-bytes: 20000`, re-measured at 0.6) followed by one skill name + byte size per line. TODAY five skills exceed 20000 bytes: vc-setup 27741, vc-intent-clarify 26600, vc-update 25663, vc-generate-phase-program 25426, vc-agent-strategy-compare 21645. Also list descriptions over one line.
- [ ] A3. `vc-agent-browser` (15M) facts, re-verified with `du -sh .claude/skills/vc-agent-browser/*` and recorded in the report: ALL ~15M is `screenshots/`, which holds 53 PNG files (NOT 7): two audit folders `ui-audit-20260408` (4.3M) and `ui-audit-20260408-v2` (8.9M) = 13.2M, plus five top-level mock PNGs (one, `chat-mock-workspace.png`, is 429 bytes). SKILL.md 12K, `references/` 72K, `scripts/` 216K, no vendored `node_modules`. `vc-manifest.json` `exclude` already lists `**/screenshots/**`, so install weight is zero (source-repo weight only). `scripts/README.md:107` says "Always save screenshots to `.claude/skills/vc-agent-browser/screenshots` directory", so the directory is a RUNTIME OUTPUT PATH and IS referenced (the earlier claim "no file references screenshots/" was false). The screenshots are ALREADY ignored: Phase 0 A3c added `.claude/skills/vc-agent-browser/screenshots/` to the tracked `.gitignore` and the PNGs were never in the `upstream-baseline` tag, so they are on disk (14.6M, 53 PNGs) but untracked. Decision is NON-DESTRUCTIVE: keep the directory and its contents; no file is moved or deleted and Phase 5 does NOT re-propose a `.gitignore` rule or any untracking. Never delete anything in this phase.

### Step B - Tune

- [ ] B1. Edit trigger_keywords/descriptions to remove overlaps while keeping every skill reachable by its main phrases; run `node.exe $P/routing-check.mjs` before and after, record results. After each edit run the MID-PHASE validator set only: `$P/routing-check.mjs`, `$P/conservation-check.mjs`, `validate-skill-cross-refs.mjs`, `validate-confusable-skills.mjs`, `validate-skill-routing.mjs`, `validate-skills.mjs`, `validate-skill-invocation-wiring.mjs`. `validate-skill-keywords.mjs` is EXPECTED RED until the join (it runs `generate-skills-catalog.mjs --check` internally, source lines 45-54, and fails with "generated-skills-catalog.json is stale" after any description/trigger_keywords edit); do NOT treat that as a regression mid-phase.
- [ ] B2. Move oversize SKILL.md detail (skills in `$P/oversize.list`, over the numeric threshold) into `references/` per skill, one skill at a time; after each run `node.exe $P/conservation-check.mjs` and `validate-skill-cross-refs.mjs`, plus the mid-phase validator set (B1). A skill is split only if the SKILL.md body drops by >= 30 percent; otherwise leave it. Do not touch the frozen charter-template mirror copy.
- [ ] B3. Agent-browser: no change to the skill beyond writing the backlog note `process/general-plans/backlog/vc-agent-browser-screenshots-untrack_NOTE_29-10-26.md` (records that the screenshots are already ignored by Phase 0 A3c and were never in the baseline tag, with the on-disk size 14.6M / 53 PNGs; no gitignore or untrack proposal, no file moved or deleted; see A3).

### Step C - Proposals and catalog

- [ ] C1. Write `$T/proposed-new-skills.md` (name, one-line purpose, why a vibecoder needs it). Add NOTHING.
- [ ] C2. JOIN STEP (ONE join serves Phases 4 and 5; executed once, after BOTH teammates report quiesced; the catalog `routedFrom` derives from CLAUDE.md/AGENTS.md text). The ORCHESTRATOR ONLY SEQUENCES; it runs no gate command and edits no file itself: (1) spawn `vc-execute-agent` (opus) to merge `p4-docs-dedup` and `p5-skills-tune` (`git merge --no-ff`, disjoint paths) and run `node.exe .claude/skills/vc-audit-context/scripts/generate-skills-catalog.mjs --write`; (2) spawn `vc-tester` (sonnet) to run `... --check` (exit 0), confirm the skill count is still 33 and every skill has non-empty `routedFrom`, `cmp` the charter-template mirror pair, and then the joint validator suite INCLUDING `validate-skill-keywords.mjs` (green only after `--write`). Phase 5 never edits CLAUDE.md, AGENTS.md or `process/development-protocols/**` (including the protocol-side charter-template mirror).
- [ ] C3. Per-teammate diff-vs-claim on the BRANCH diff (never shared `main`): `git diff --name-only $(cat $P/baseline.sha)..p5-skills-tune | node.exe $P/claim-check.mjs $P/claim.globs` prints nothing (the tool is Phase 5's own `$P/claim-check.mjs` from 0.4a), and its name list has an empty `comm -12` intersection with the Phase 4 branch list. Rollback unit = the branch: after the merge, rehearse `git revert -m 1 --no-commit <p5-merge-commit>`, assert the changed set is inside the claim, then `git revert --abort`.

---

## Exit Gate

ORDER MATTERS: the join (`--write`, `--check`) runs FIRST, then the validators. Run from the repo root on merged `main`, by a spawned vc-tester (the `--write` by a spawned vc-execute-agent).

```bash
T=process/general-plans/active/vibebelt-rebrand_29-10-26; P=$T/p5-tools
node.exe .claude/skills/vc-audit-context/scripts/generate-skills-catalog.mjs --write   # Expected: exit 0 (join step, spawned vc-execute-agent, after Phase 4 reports quiesced)
node.exe .claude/skills/vc-audit-context/scripts/generate-skills-catalog.mjs --check   # Expected: exit 0 (fresh)
ls -d .claude/skills/*/ | wc -l                                              # Expected: 33
ls -d .claude/skills/*/ | LC_ALL=C sort > $P/post-skill-folders.txt
diff $P/pre-skill-folders.txt $P/post-skill-folders.txt                      # Expected: empty (names unchanged)
node.exe .claude/skills/vc-audit-vc/scripts/validate-skills.mjs                  # Expected: not worse than Phase 0 baseline (exit 0 once .agents/skills repaired)
node.exe .claude/skills/vc-audit-context/scripts/validate-skill-routing.mjs      # Expected: exit 0
node.exe .claude/skills/vc-audit-context/scripts/validate-confusable-skills.mjs  # Expected: exit 0
node.exe .claude/skills/vc-audit-context/scripts/validate-skill-keywords.mjs     # Expected: exit 0 (only after the --write above; expected red before the join)
node.exe .claude/skills/vc-audit-context/scripts/validate-skill-cross-refs.mjs   # Expected: exit 0
node.exe .claude/skills/vc-audit-vc/scripts/validate-skill-invocation-wiring.mjs # Expected: exit 0
node.exe $P/routing-check.mjs                                                # Expected: exit 0; every recorded top-3 phrase retained, none stolen
node.exe $P/conservation-check.mjs                                           # Expected: exit 0 for every split skill in oversize.list
test -s $T/proposed-new-skills.md                                            # Expected: exit 0
git diff --name-only $(cat $P/baseline.sha)..p5-skills-tune | node.exe $P/claim-check.mjs $P/claim.globs   # Expected: no output (inside Phase 5 claim)
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
| `node.exe $P/conservation-check.mjs` over `$P/oversize.list` (numeric threshold 20000, five skills today) + validate-skill-cross-refs | Fully-Automated | C-P5: splits lose nothing |
| Catalog `--write` (spawned vc-execute-agent) then `--check` (spawned vc-tester) at the single join after Phase 4 quiesces | Fully-Automated | C-P5: catalog fresh |
| agent-browser decision cites the corrected numbers (53 PNGs, 13.2M in two audit folders of 15M, manifest-excluded, `scripts/README.md:107` runtime output dir), keeps the directory, states they are already ignored (Phase 0 A3c) and never in the baseline tag, backlog note records this only | Agent-Probe | C-P5: 15MB explained |
| Proposed skills listed, none added: `test -s $T/proposed-new-skills.md` + folder count 33 | Fully-Automated | C-P5: proposals only |
| Phase 5 BRANCH diff inside `$P/claim.globs`, disjoint from Phase 4 branch diff; merge revert rehearsal; charter-template mirror pair `cmp` at the join | Fully-Automated | C-P5: own claim only, rollback unit exists |

---

## Phase Loop Progress

Orchestrator reads this before deciding which subagent to spawn next. The canonical 7-step inner loop
`R → I → P → PVL → E → EVL → UP` SKIPS SPEC (the umbrella plan and the user brief act as the SPEC).

- [ ] 1. RESEARCH — research-agent (sonnet): prior phase reports read; test context loaded; plan drift checked
- [ ] 2. INNOVATE — innovate-agent (sonnet): approach decided; Decision Summary written
- [ ] 3. PLAN-SUPPLEMENT — plan-agent (sonnet): existing phase plan updated; Inner Loop Refresh Note if sections changed (or "n/a — research clean")
- [ ] 4. PVL — vc-validate-agent (sonnet): full V1-V7; validate-contract written per `.claude/skills/vc-validate-findings/references/example-validate-output.md`
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
- Validate-contract status: written 29-10-26 (PASS, outer-pvl, PVL cycle 4 re-run: 0 FAIL, 0 MUST-FIX, 7 RESIDUAL incl. 2 bounded Known Gaps); EXECUTE legal
- Supporting context files: umbrella plan, `phase-blast-radius-registry.md`, prior phase report (if any)
- Next step: Spawn vc-research-agent (sonnet) for step 1 RESEARCH of this phase (after Phase 3 exit gate, parallel with Phase 4)

---

## Validate Contract

Status: PASS
Date: 29-10-26
date: 2026-10-29
generated-by: outer-pvl
supersedes: 2026-10-29 (outer-pvl, PVL cycle 3 CONDITIONAL) — PVL cycle 4 re-ran V1-V7 against the real repo and has current evidence

Parallel strategy: vc-team
Rationale: Plan mandates the same agent team as Phase 4 (`p5-skills-tune`; TeamCreate + TaskCreate + SendMessage + TaskList; NOT parallel subagents); sequential after Phase 4 is the valid fallback. Score 3/7; dominant signals S4 and S7 plus the need to keep blast radii disjoint. Sonnet for research/audit/validate; opus only for the teammate leg that edits skill files. This pass ran Layer 1 (4) and Layer 2 (Step 0, A, B, C) inline in one session (no spawn tool); evidence = real-repo reads and measurements (`ls`, `wc -c`, `du`, `find`, `.claude/skills` and script paths, manifest and `.gitignore` greps, `vc-research-agent` frontmatter, registry), `validate-plan-artifact.mjs` (exit 0, 0 failures, 2 advisory legacy-shape warnings). V1: existing contract was CONDITIONAL (not PASS) and no `## Inner Loop Refresh Note` exists, so no auto-proceed; V1-V7 re-ran in full. Prior verdicts were not trusted.

Cycle-3 MUST-FIX closure check (M1 plus 2 residuals), verified against the real plan text and repo:
- CLOSED (M1, phase lock and missing tool): A2 and 0.2 now say RESEARCH is read-only and only REPORTS the numeric threshold, per-skill byte sizes and the snapshot approach; the EXECUTE agent writes `$P/oversize.list` (threshold on line 1, re-measured at 0.6) and `$P/snapshot.mjs` in Step 0 before 0.6. This matches `vc-research-agent` (`disallowedTools: Write, Edit, MultiEdit`, verified). New item 0.4a creates `$P/claim-check.mjs` (same interface as Phase 4: names on stdin, `claim.globs` with `!` excludes, prints paths outside the claim, exit 1); C3, the Exit Gate and the Verification Evidence row call that Phase 5 path, never Phase 4's. `$P/**` and `$P/claim.globs` cover the new tools, so the claim-check passes on them.
- CLOSED (residual E1): A3 now says `chat-mock-workspace.png` is 429 bytes. Verified with `ls -la`: 429.
- CLOSED (residual E2 wording): 0.5 says "Red" means worse than the Phase 0 baseline, and "validate-skills failure lines excluding `.agents/skills` must be empty", with the 17-byte text file kept in the work tree.
- Facts re-verified in the real repo this pass: 33 skill folders; five SKILL.md over 20000 bytes (vc-setup 27741, vc-intent-clarify 26600, vc-update 25663, vc-generate-phase-program 25426, vc-agent-strategy-compare 21645); `vc-agent-browser` screenshots hold 53 PNGs, `ui-audit-20260408` 4.3M and `ui-audit-20260408-v2` 8.9M (13.2M), five top-level mock PNGs, `vc-manifest.json` `exclude` has `**/screenshots/**`, `scripts/README.md:107` says "Always save screenshots to `.claude/skills/vc-agent-browser/screenshots` directory", `.gitignore` has no screenshots rule; all six `validate-skill-*`, confusable and catalog scripts exist at the paths named in the Exit Gate; the registry Phase 5 entry matches `claim.globs` and is still disjoint from Phase 4.

New-MUST-FIX scan (gate unsatisfiable, unsafe or irreversible step, protocol violated, cost hard-stop ordering, phase locks): none found. Phase 5 runs no billed model call and does nothing irreversible (the agent-browser decision is a backlog note only; nothing is deleted or ignored). Items examined and classified RESIDUAL: E6 (where the `oversize.list` instruction lives), E7 (0.6 wording).

Plan updates applied: none in this pass except the handoff status line.

Test gates (C3 5-column table):

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P5 | 33 skills remain, folder names unchanged | Fully-Automated | `ls -d .claude/skills/*/ \| wc -l` == 33 (33 today) AND sorted folder-name file diff vs `$P/pre-skill-folders.txt` empty | A (count) + B (snapshot) |
| C-P5 | Skill validators not worse than Phase 0 baseline, in the right ORDER | Fully-Automated | after the join: validate-skills (failure lines excluding `.agents/skills` must be empty), skill-routing, confusable, skill-keywords, skill-cross-refs, invocation-wiring; mid-phase set excludes skill-keywords | A (all green today except validate-skills baseline) + B |
| C-P5 | Catalog regenerated and fresh at the join | Fully-Automated | `generate-skills-catalog.mjs --write` (spawned vc-execute-agent) then `--check` exit 0 (spawned vc-tester) after Phase 4 reports quiesced | B |
| C-P5 | Each skill still reachable by its main phrases | Hybrid | `node.exe $P/routing-check.mjs`: recorded top-3 `trigger_keywords` retained, none stolen, new overlaps reported; snapshot from SKILL.md frontmatter written by the EXECUTE agent (`$P/snapshot.mjs`) | B |
| C-P5 | Oversize splits lose nothing | Fully-Automated | `node.exe $P/conservation-check.mjs` over `$P/oversize.list` (written by the EXECUTE agent in Step 0) plus `validate-skill-cross-refs` | B |
| C-P5 | 15MB of vc-agent-browser explained with CORRECT numbers and a safe decision | Agent-Probe | judge checks 15M in `screenshots/` (53 PNGs; 13.2M in two audit folders), manifest-excluded, `scripts/README.md:107` runtime output dir, 429-byte mock, decision keeps the directory, no .gitignore re-proposal (already ignored by Phase 0 A3c) | A (facts verified now) + B (report) |
| C-P5 | Proposals only | Fully-Automated | `test -s $T/proposed-new-skills.md` AND folder count == 33 | B |
| C-P5 | Each teammate touched only its claim; rollback unit exists | Fully-Automated | branch diff through `$P/claim-check.mjs $P/claim.globs` (tool created by 0.4a), empty `comm -12`, merge revert rehearsal, charter-template pair `cmp` at the join (identical today) | B |

Failing stubs (Fully-Automated rows, red-first for execute-agent):
- test("should keep exactly 33 skill folders with unchanged names", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep exactly 33 skill folders with unchanged names") })
- test("should run skill-keywords only after the catalog join", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should run skill-keywords only after the catalog join") })
- test("should regenerate the catalog with --write and pass --check", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should regenerate the catalog with --write and pass --check") })
- test("should conserve every line moved out of an oversize SKILL.md", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should conserve every line moved out of an oversize SKILL.md") })
- test("should list proposed skills without adding any", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should list proposed skills without adding any") })
- test("should keep phase 5 diff inside its claim globs", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep phase 5 diff inside its claim globs") })

Legacy line form:
- skill count/names: [Fully-automated: ls -d .claude/skills/*/ | wc -l == 33 + sorted name-list diff in bash]
- validators: [Fully-automated: validate-skills + validate-skill-routing + validate-confusable-skills + validate-skill-cross-refs + validate-skill-invocation-wiring mid-phase; plus validate-skill-keywords after the join]
- catalog: [Fully-automated: generate-skills-catalog.mjs --write then --check at the join, spawned executor]
- routing: [hybrid: routing-check.mjs vs top-3 snapshot from frontmatter]
- agent-browser: [agent-probe: decision report with corrected numbers]

Dimension findings:
- Infra fit: PASS — gate commands and validator paths exist and run; ordering around the catalog is correct; tool paths use `$P` from the repo root; every tool the gates call (`snapshot.mjs`, `routing-check.mjs`, `conservation-check.mjs`, `claim-check.mjs`) now has a creating Step 0 item and an EXECUTE-agent owner.
- Test coverage: PASS — routing-check and conservation-check are well specified; the validate-skills guard is stated in 0.5; fragilities are bounded measurement limits (KG1, KG2).
- Breaking changes: PASS — names/directories unchanged, headings kept in split skills (so CLAUDE.md `§Model Selection Policy` style citations of `vc-agent-strategy-compare` still resolve), catalog fresh at the join, mirror pair frozen and `cmp`-checked.
- Security surface: PASS — skill prose/frontmatter only; no tool grants or secrets; no billed run; `vc-security` and `vc-agent-browser/scripts` untouched; RESEARCH phase lock respected.
- Step 0 (tools and snapshot) feasibility: PASS — EXECUTE-owned tools and snapshot; RESIDUAL E6, E7.
- Section A (audit) feasibility: PASS — numbers verified, including the 429-byte fix.
- Section B (tune) feasibility: PASS — mid-phase validator set excludes skill-keywords; split rule >= 30 percent body drop.
- Section C (proposals and catalog) feasibility: PASS — join executed by spawned agents, per-branch claim-check with Phase 5's own tool.

Disjointness verdict (Phase 4 vs Phase 5): file-level claims DISJOINT (re-verified against the registry); the registry prose for Phase 5 matches `claim.globs`; coupling points covered (Phase 4 AGENTS.md Skill Registry pointer, catalog `routedFrom`).

Net gate derivation: 0 FAIL / 0 MUST-FIX / 0 unresolved CONCERN / 7 RESIDUAL (2 bounded Known Gaps, 5 execute-agent instructions). Net gate: PASS. Vacuous-green ban check: every developed behavior has a Fully-Automated, Hybrid or Agent-Probe gate; KG1 and KG2 are bounded measurement limits, not the only coverage of any behavior.

Signal legality: PHASE_COMPLETE: VALIDATE is LEGAL (Gate is PASS, condition (a)). Emit `PHASE_COMPLETE: VALIDATE — validate-contract written (after 3 validate-fix loop(s)). Proceed to EXECUTE.`

Known Gaps (named residuals, excluded from the CONCERN/FAIL count; bounded measurement limits, no new plan required):
- KG1 Keyword checks prove a skill is still listed under its recorded top-3 phrases, not that a live model picks it for a user's wording; non-top-3 keywords trimmed in B1 are not protected.
- KG2 Conservation proves text moved to `references/`, not that a split skill behaves identically when its details load on demand.

Execute-agent instructions (RESIDUAL, no plan edit needed):
- E3 Step 0.6 order: files written after `baseline.sha` (`claim.globs`, `mirror.sha256`) do not exist in a worktree created from it; commit them in a second path-limited `process:` commit and create the worktree from that HEAD, or copy them; step-0 tool commits are path-limited and serialized with Phase 4 (`SendMessage`) to avoid `index.lock` races.
- E4 The joint suite at the join is the UNION of the Phase 4 and Phase 5 Exit Gate lists, run once by a spawned vc-tester after the catalog `--write` (see the Phase 4 contract E3).
- E5 After the join and all Exit Gate commands, `git worktree remove` the teammate worktree; in the sequential fallback the join is just `--write` then `--check` on `main`.
- E6 The instruction to write `$P/oversize.list` lives in A2 (Step A, labelled read-only) but is executed in Step 0 before 0.6 by the EXECUTE agent; write it with `snapshot.mjs` in Step 0 and do not wait for Step A.
- E7 0.6 says "after 0.2-0.4 tools are committed"; include 0.4a (`claim-check.mjs`) and `oversize.list` in that process commit so they exist in the worktree created from `baseline.sha`.

Open gaps: none (0 MUST-FIX)

What this coverage does NOT prove (What This Coverage Does NOT Prove):
- Keyword checks prove a skill is still listed under its top-3 recorded phrases, not that a live model chooses it for a user's wording; non-top-3 keywords trimmed in B1 are not protected.
- Conservation checks prove text moved, not that a skill behaves identically when its details are loaded on demand.
- The agent-browser report proves explanation quality, not that untracking the PNGs is harmless to unknown external readers.
- Node validators ran through node.exe on NTFS; Linux/macOS behavior is unproven.

Gate: PASS (0 FAIL / 0 MUST-FIX / 7 RESIDUAL; PVL cycle 4; EXECUTE is legal on this contract)
Accepted by: not required for PASS; KG1, KG2 and E3-E7 are recorded as named residuals (PVL cycle 4, session).

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
