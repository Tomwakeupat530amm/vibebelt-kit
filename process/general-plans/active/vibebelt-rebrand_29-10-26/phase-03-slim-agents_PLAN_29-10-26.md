---
name: plan:vibebelt-rebrand-phase-03-slim-agents
description: "vibebelt-kit rebrand — Phase 03: Slim agents without lowering quality"
date: 29-10-26
metadata:
  node_type: memory
  type: plan
  feature: general-plans
  phase: phase-03
---

# Phase 03 — Slim agents without lowering quality

**Program:** vibebelt-rebrand
**Umbrella plan:** process/general-plans/active/vibebelt-rebrand_29-10-26/vibebelt-rebrand-umbrella_PLAN_29-10-26.md
**Phase status:** ⏳ PLANNED
**Complexity:** COMPLEX
**Report destination:** process/general-plans/active/vibebelt-rebrand_29-10-26/phase-03-slim-agents_REPORT_29-10-26.md (flat in the program task folder)

---

## Overview

One phase of the vibebelt-rebrand program; program context lives in the umbrella plan. Context router: process/context/all-context.md (created in Phase 0). Test routing: process/context/tests/all-tests.md (load before assigning tiers).

Date: 29-10-26
Status: PLANNED
Complexity: COMPLEX

## Purpose

Make the agent prompts smaller WITHOUT making their answers worse. Today the biggest are update-process 53KB, plan 38KB, execute 36KB, validate 36KB, research 27KB, fast-mode 26KB, innovate 24KB, spec 23KB. Core rules stay in the prompt; long examples and tables move into `references/` files the agent loads only when needed. Quality is measured, not assumed: a golden baseline from the OLD agents is captured first and every slimmed agent is compared against it.

---

## Entry Gate

- Phase 2 exit gate green. Phases 4/5 do not need to be done (order is strict 0..8 by the umbrella; 4 and 5 run after this phase).

---

## Strategy Recommendation (vc-agent-strategy-compare)

- Signals: S6 no, S7 yes, quality-risk high — score about 3/7 but the work is inherently serial (one agent at a time, then compare).
- Recommended: **Sequential**, one agent per cycle, heaviest first. Research/plan/validate and the comparison judge = sonnet; the editing leg (EXECUTE) = opus. Parallel slimming is rejected on purpose: a regression could not be attributed to one agent, and the rule is "revert that agent only".

---

## Blast Radius

- `.claude/agents/vc-*.md` (15 files, one at a time) and the mirrored `.codex/agents/*.toml` agent definitions
- `.claude/agents/references/` or the location the research step finds valid for on-demand loading (NEW; must be allowed by the parity validator and the manifest `include` globs); `.codex/agents/references/` plain .md (NEW)
- Task-folder evidence and tools under `$G` (see Path variables): `size-check.mjs`, `signal-census.mjs`, `conservation-check.mjs`, `pointer-check.mjs`, `parity-compare.mjs`, `gen-guardrails.mjs`, `run-record.mjs` (new scripts) plus snapshots, `guardrails.json`, `runs/`, `old/`, `phase1/`, `compare.md`
- Outside the task folder: ONE new backlog stub `process/general-plans/backlog/codex-agent-references-load_NOTE_29-10-26.md` (step 0.2f)

### Path variables and conventions (apply to every command in this plan)

```bash
T=process/general-plans/active/vibebelt-rebrand_29-10-26
G=$T/golden
```

- ALL commands run from the repo root as `node.exe $G/<script>` (use `node` where it exists). No command in this plan is task-folder-relative. Every script takes `--root <dir>` (default: current dir) so it can also run against a sandbox.
- Agents are listed by DIRECTORY LISTING of top-level files only: `.claude/agents/*.md` and `.codex/agents/*.toml` (`references/` subfolders are never agents). Names are compared with the `vc-`/`vb-` prefix stripped so Phase 6 renames do not break keys.
- Sort every list with `LC_ALL=C sort`. No process substitution (`<(...)`) in any gate: write both sides to files and `diff`/`cmp` the files.

---

## Implementation Checklist

### Step 0 - Pre-run gates (before any model run or agent edit)

- [ ] 0.0 COST GATE FIRST (this is the A0 gate, executed here BEFORE every other Step 0 item and before any billed run): compute the exact itemised total as defined in A0 below (golden, Phase 1 control, new-agent comparison, judge calls, and the probe calls of 0.2a and the RESEARCH init-field probe, at least 4) and obtain the user's acknowledgement (umbrella hard stop). No acknowledgement: stop. Items 0.2a and the RESEARCH init-field probe run ONLY after this acknowledgement; their calls stay in the A0 total. A0 in Step A is the itemisation spec for this gate, not a second gate.
- [ ] 0.1 Re-confirm test tiers at inner PVL after Phase 0 creates `process/context/tests/all-tests.md` (load its routing chain; re-assign tiers if they differ from the Validate Contract).
- [ ] 0.2 Location decision gate for `references/` (do this right after 0.0; one throwaway agent-less probe). Sub-steps:
  - [ ] 0.2a (only after the 0.0 acknowledgement) Agent list BEFORE: run headless `claude -p "ping" --output-format stream-json --verbose` in the repo and save the `agents` array of the init system event to `$G/agents-list-before.json` (RESEARCH confirms the exact event/field name with this one probe; the call is counted in A0). Add a placeholder `.claude/agents/references/probe.md`, repeat to `$G/agents-list-after.json`, assert the two arrays are identical, remove the placeholder if the location is rejected. (`claude agents --json` lists running sessions, NOT configured agents; do not use it.)
  - [ ] 0.2b Codex location chosen explicitly (default `.codex/agents/references/` plain .md; Codex does not parse it as an agent TOML). No `codex` binary exists here, so Codex loading is a named residual (0.2f).
  - [ ] 0.2c Manifest: `node.exe resolve-manifest.mjs | tr '\\' '/' | grep -F agents/references` lists the new files (node.exe prints backslash paths on NTFS, so normalise first; manifest `include` has `.claude/agents/**` and `.codex/**`).
  - [ ] 0.2d Parity scanners: `validate-agent-parity.mjs`, `validate-agent-frontmatter.mjs`, `validate-protocol-wiring.mjs`, `validate-skill-invocation-wiring.mjs` scan only top-level files (`entry.isFile()`), so a `references/` subfolder is skipped; confirm by running them with the probe file in place.
  - [ ] 0.2e `e2e-kit-flows.test.mjs` is red at baseline under node.exe: mark it NOT TESTED in `$G/compare.md` and carry it to Phase 8 (run it there). Do not claim it as evidence here.
  - [ ] 0.2f Write the backlog stub `process/general-plans/backlog/codex-agent-references-load_NOTE_29-10-26.md` (what: Codex loading of `.codex/agents/references/*.md` is unproven; resolution: run a real Codex session in Phase 8 or later). That Verification Evidence row stays CONDITIONAL (Known-Gap is a residual, never a proving strategy).
  - If any of a-d fails, move the references to a location that passes (e.g. a sibling folder under `process/`) and record the decision in `$G/compare.md`; if no location works, keep content inline and report BLOCKED for that agent. Do NOT disable a validator.
- [ ] 0.3 Write the scripted gates BEFORE slimming (red-first; stubs in the Validate Contract). Interfaces (all `node.exe $G/<script> [--root <dir>]`, exit 0 = pass, exit 1 = fail with a per-agent table on stdout):
  - `size-check.mjs`: reads `$G/sizes-before.json` and `$G/slimmed.list`; re-measures bytes of the `.md` and `.toml` of each agent in `slimmed.list` (NOT the stale 348915 total; sizes-before is measured at Phase 3 start, step 0.6). Rule is stated ONCE, both ways: exit 1 if ANY listed agent drops < 25 percent (an agent that cannot reach 25 percent is reverted per B6 and is NOT in `slimmed.list`) OR the slimmed-set total drops < 25 percent. Prints a per-agent table plus the total.
  - `signal-census.mjs`: prints the SORTED SET (`LC_ALL=C`) of distinct `(agent-without-prefix, file-kind, token)` lines (set, not counts) from the PROMPT BODY only (never references), for `.md` bodies and `.toml` `developer_instructions`. Tokens match `[A-Z][A-Z_-]{3,}:`, `Gate: (PASS|CONDITIONAL|BLOCKED)` and `[MODE: ...]`. `--check` compares to `$G/signal-census-before.txt` and exits 1 on any diff (before == after). Default mode prints the set to stdout (used by C1b).
  - `gen-guardrails.mjs` and `conservation-check.mjs`: see 0.4 and 0.5.
  - `pointer-check.mjs`: census of cross-agent pointers (`<agent>.md section`, `#### Heading`, `§Name`) in all agent bodies before (`$G/pointers-before.json`) vs after; every target heading must still exist in a prompt body or a referenced file (example: validate-agent -> plan-agent `#### PVL-supplement: Partial-processing rule`).
  - `parity-compare.mjs`: runs `validate-agent-parity.mjs`, parses `normalized body differs (N% length delta)` per agent plus the warning count, and compares to the Phase 0 artifact `baseline/validators_before.txt` (path as recorded by Phase 0; RESEARCH confirms it). Fails if exit != 0, any agent's absolute delta is larger than baseline, or warning count is higher (15 body-differs warnings at baseline; Phase 0 `compare.sh` checks exit codes only, so this comparator is needed).
  - `run-record.mjs`: harness-side prompt-version proof (see A2/B4).
- [ ] 0.4 `gen-guardrails.mjs` (run once at Phase 3 start, output reviewed once and the reviewed list pasted into `$G/compare.md`): for each agent (`.md` file and the `.toml` `developer_instructions` string) collect the headings matching `Purpose|Entry Requirement|Strictly Forbidden|Violation Prevention|Phase Lock|Session Start|Context Loading|Completion|Status Reporting|Autonomous /goal` and write the per-agent list plus a sha256 of each section body to `$G/guardrails.json`. Real agents differ (update-process has no `Strictly Forbidden` or `Session Start`; fast-mode lacks both; validate lacks `Session Start`), so the list is generated per agent, never one fixed 4-heading list.
- [ ] 0.5 `conservation-check.mjs`: (a) line-multiset diff old prompt vs (new prompt + that agent's references) minus pointer lines: every removed non-empty line must exist verbatim in references; (b) FAIL if any heading listed for that agent in `guardrails.json` is missing from the new prompt, and FAIL if its section body hash changed (applies to the `.md` body AND the `.toml` `developer_instructions`); (c) YAML frontmatter byte-identical (hash compare); (d) toml keys other than `developer_instructions` byte-identical.
- [ ] 0.6 Phase 3 start snapshots, taken BEFORE any agent edit (record the unslimmed Phase 1/2 state): `git rev-parse HEAD > $G/start.sha`; `$G/sizes-before.json` (bytes per agent .md and .toml, directory-listing based); `$G/signal-census-before.txt` (`node.exe $G/signal-census.mjs > $G/signal-census-before.txt`); `$G/pointers-before.json`; `$G/guardrails.json` (0.4); empty `$G/slimmed.list` (appended after each kept agent commit, B6).
- [ ] 0.7 Record the Phase 0 validator baseline per agent: parity `normalized body differs` delta percent and warning count (15 body-differs warnings at baseline), frontmatter, protocol-wiring, skill-invocation-wiring, validate-skills, validate-context-discovery. "Red validator" in this phase means WORSE than this baseline (validate-skills and validate-context-discovery are red at baseline only because `.agents/skills` is a 17-byte text file; Phase 0 repairs it).

### Step A - Golden baseline (before touching any agent)

- [ ] A0. COST GATE: before starting any model run, compute and report to the user the exact run count, itemised: golden baseline runs on the original models (3 tasks x 2 replicates) PLUS Phase 1 same-model control runs (3 x 2) PLUS new-agent comparison runs (per slimmed agent, the tasks that exercise it x 2 replicates) PLUS judge calls (one pairwise judge call per task x replicate x compared pair, incl. the old-vs-phase1 pairs) PLUS probe calls (0.2a agent-list headless calls, at least 3), and the TOTAL. Golden baseline runs are APPROVED (user, LOCKED Q3); everything else and the total are NOT covered by that wording, so the total must be reported and acknowledged by the user (hard stop "beyond approved golden set") before starting. No ack: stop, do not run.
- [ ] A1. Define 3 sample tasks in `$G/tasks.md`: (1) small feature, (2) bug fix, (3) multi-phase program (plan stage only is enough for #3). Fixed inputs, fixed expected artifacts.
- [ ] A2. Build THREE sandboxes with `git worktree add` OUTSIDE this repo, constructed identically so ONLY `.claude/agents` and `.codex/agents` differ: (i) OLD = tag `upstream-baseline` with the Phase 0 `process/context/**` copied in (the tag tree has no `process/context/all-context.md`, so CLAUDE.md's Bootstrap Guard would otherwise fire and confound the run); (ii) PHASE1 = commit in `$G/start.sha` (post-Phase 2, same models, unslimmed); (iii) NEW = the commit under test, per agent (B4). Record in `$G/compare.md`: the baseline SHA, and the output of `diff -r` between each pair EXCLUDING `.claude/agents` and `.codex/agents` (known differences listed, so a non-agent confound is visible). Save outputs (plan files, validate-contract, final summaries) under `$G/old/` (original models, tag frontmatter) and `$G/phase1/` (same models as NEW, unslimmed). ROLES: `$G/phase1/` is the JUDGED control for the revert decision; `$G/old/` is reported ONLY as the Phase 1 model-change measurement (opus-to-sonnet), never as the revert criterion.
- [ ] A3. Write the rubric `$G/rubric.md`: required sections present, every signal string present, validators green (scripted: `validate-plan-artifact.mjs` on produced plans; grep of contract headings), checklist atomic/specific, no lost gate. Same rubric for old, phase1 and new.
- [ ] A4. Judge protocol in `$G/judge.md`: blind pairwise (judge does not know which output is which, order randomised), 2 replicates per task, sonnet judge; verdict per agent: tie = EQUAL; WORSE only if reproduced in BOTH replicates; scripted rubric items are scripted, not judged. The judge compares NEW vs PHASE1. The judge considers a run only if `$G/runs/<run-id>.json` exists and `run-record.mjs --verify <run-id>` passes (A2/B4); runs without a matching record are ignored.

### Step B - Slim one agent at a time (repeat B1..B6 per agent; ONE commit per agent)

Order: update-process, plan, execute, validate, research, fast-mode, innovate, spec, then the smaller ones only if the first eight show the method is safe.

- [ ] B1. Record the agent's snapshot ref with `git rev-parse HEAD > $G/snapshots/<agent>.ref` (NO snapshot commit: Phase 1 is already committed, so an empty commit would fail with exit 1) and its size and signal strings.
- [ ] B2. Move examples/tables/long how-to into `references/<agent>-*.md` (location from 0.2); leave in the prompt: purpose, phase lock, mandatory-first actions, forbidden list, signal strings, status block, and a one-line pointer "read references/X when doing Y". Guardrail text (every heading in `guardrails.json` for that agent, tool grants, write guards) stays in the prompt.
- [ ] B3. Mirror to the Codex definition (.toml); run `node.exe $G/signal-census.mjs --check`, `node.exe $G/conservation-check.mjs`, `node.exe $G/pointer-check.mjs`, `node.exe $G/size-check.mjs` (with this agent temporarily in `slimmed.list`), and the validators: `node.exe $G/parity-compare.mjs` (NOT-WORSE-than-baseline: exit 0 AND this agent's body-differs delta not larger AND warning count not higher; strict parity is red at baseline and is not used), frontmatter, protocol-wiring, skill-invocation-wiring.
- [ ] B4. Re-run the sample task(s) that exercise this agent, each in a NEW OS PROCESS per run (fresh `claude -p`; a changed agent file may not be picked up by a running session), inside a NEW sandbox (A2 iii). BEFORE each run, `node.exe $G/run-record.mjs <sandbox> <run-id>` writes `$G/runs/<run-id>.json` containing sha256 of every sandbox agent `.md`/`.toml` plus `git rev-parse HEAD` (a model cannot hash its loaded prompt, so the proof is harness-side). Compare NEW vs `$G/phase1/` per `$G/judge.md`; write EQUAL / BETTER / WORSE. Also run `node.exe $G/run-record.mjs --verify <run-id>` before the judge sees the output.
- [ ] B6. WORSE (reproduced) or any scripted check red -> `git revert` this agent only, record why, continue. Otherwise commit `refactor(agents): slim <agent>` and append the agent to `$G/slimmed.list`. EXCEPTION to the umbrella "one execution commit per phase" rule: this phase makes one commit PER AGENT (so a regression reverts alone); the report states this exception.
- [ ] B5. Immediately after the FIRST B6 commit (update-process) on a clean tree (`git status --porcelain` empty): rehearse revert: `git revert --no-commit <agent-commit>`, assert `git diff --cached --name-only | LC_ALL=C sort` equals exactly that agent's md, toml and references files, then `git revert --abort` and assert `git status --porcelain` is empty again (verified working in a scratch repo with git 2.53). Record in `$G/compare.md`.

### Step C - Totals

- [ ] C1. Run `node.exe $G/size-check.mjs` (before/after bytes per agent and total, .md and .toml; per agent AND total >= 25 percent drop on the slimmed set) and `node.exe $G/signal-census.mjs --check` over all agents; write the table in the phase report.
- [ ] C1b. Save the Phase 7 hard-dependency artifact: `node.exe $G/signal-census.mjs > $G/signal-census-phase3.txt` (sorted set of `(prefix-stripped agent, file-kind, token)` lines after slimming). Phase 7 depends on this exact path and on the prefix-stripped keys; do not rename or move.

---

## Exit Gate

Hard dependency: `$G/signal-census.mjs` and `$G/signal-census-phase3.txt` MUST be kept at exactly these paths (Phase 7 depends on them); do not rename or move. Gate: `test -f $G/signal-census.mjs && test -f $G/signal-census-phase3.txt` exits 0 at Phase 3 exit.

```bash
T=process/general-plans/active/vibebelt-rebrand_29-10-26; G=$T/golden   # run everything from the repo root
test -f $G/signal-census.mjs && test -f $G/signal-census-phase3.txt                       # Expected: exit 0
node.exe $G/size-check.mjs                        # Expected: exit 0; per agent AND slimmed-set total drop >= 25 percent, table printed
node.exe $G/signal-census.mjs --check             # Expected: exit 0; set diff vs signal-census-before.txt empty for .md and .toml prompt bodies
node.exe $G/conservation-check.mjs                # Expected: exit 0; every removed line present verbatim in references; guardrails.json headings present and hashes identical (md and toml); frontmatter identical
node.exe $G/pointer-check.mjs                     # Expected: exit 0; every cross-agent heading pointer resolves
node.exe $G/parity-compare.mjs                    # Expected: exit 0; per-agent body-differs delta and warning count not worse than the Phase 0 baseline
node.exe .claude/skills/vc-audit-vc/scripts/validate-agent-parity.mjs        # Expected: exit 0 (warnings judged by parity-compare)
node.exe .claude/skills/vc-audit-vc/scripts/validate-agent-frontmatter.mjs   # Expected: exit 0
node.exe .claude/skills/vc-audit-vc/scripts/validate-protocol-wiring.mjs     # Expected: exit 0
node.exe .claude/skills/vc-audit-vc/scripts/validate-skill-invocation-wiring.mjs  # Expected: exit 0
node.exe resolve-manifest.mjs | tr '\\' '/' | grep -F agents/references       # Expected: references files listed (if a location outside .claude/agents is chosen, grep that path)
git diff --check                                                          # Expected: no output
```

(Use `node` where `node.exe` is not needed. validate-skills and validate-context-discovery are compared to the Phase 0 baseline, not required absolute green. `e2e-kit-flows.test.mjs` is NOT TESTED here and is carried to Phase 8.)

- `$G/compare.md` shows EQUAL or BETTER for every kept agent (NEW vs PHASE1, blind pairwise, 2 replicates, tie = EQUAL, WORSE only if reproduced), the baseline SHA, the `diff -r` outputs excluding agent files, the proven prompt version (`$G/runs/<run-id>.json`) per run, the references-location decision, the revert rehearsal result, and the OLD-vs-PHASE1 model-change measurement (reported only); reverted agents listed with reason.
- Claude agent list unchanged: `$G/agents-list-before.json` equals `$G/agents-list-after.json` (no `references/*` listed as agents).
- Signal-string census before == after.
- Codex loading of `references/` stays a named residual: backlog stub `process/general-plans/backlog/codex-agent-references-load_NOTE_29-10-26.md` exists; that Verification Evidence row remains CONDITIONAL.

---

## Blockers That Would Justify BLOCKED Status

- Claude Code or Codex cannot load a referenced file on demand (then keep that content inline and report).
- Golden runs impossible (no model access): phase cannot start; ask user.
- Parity validator forbids a `references/` location (decide location in RESEARCH; do not disable the validator).

---

## Phase Completion Rules

- CODE DONE = checklist items done; VERIFIED = Exit Gate commands pass AND full validator suite is not worse than the Phase 0 baseline AND regression checkpoint passes AND validate-contract exists.
- Known-Gap alone never makes a behavior PASS; write a backlog stub and keep that gate CONDITIONAL.

## Acceptance Criteria

- See the Exit Gate commands and the Verification Evidence table; each row names the charter criterion it proves (proven by + strategy).

## Touchpoints

- 8 to 15 agent prompts + Codex mirrors, new references files, golden evidence folder

---

## Public Contracts

- Agent names, triggers, tool grants, status codes, and every signal string unchanged and verbatim.
- Behavior contract: same artifacts produced, same phase locks, same gates.

---

## Verification Evidence

| Gate / Scenario | Strategy | Proves SPEC criterion |
|---|---|---|
| Size drop: `node.exe $G/size-check.mjs` (>= 25 percent per agent AND on the slimmed-set total, vs `sizes-before.json`) | Fully-Automated | C-P3: prompt size drops materially |
| Signal-string census identical: `node.exe $G/signal-census.mjs --check` (.md and .toml, body only, set of prefix-stripped pairs) | Fully-Automated | C-P3: signal strings intact |
| Signal-census artifact for Phase 7: `test -f $G/signal-census.mjs && test -f $G/signal-census-phase3.txt` (created by step C1b) | Fully-Automated | C-P3: signal strings intact (Phase 7 hand-off) |
| Conservation: `node.exe $G/conservation-check.mjs` (removed lines exist in references; per-agent `guardrails.json` headings present and hashes identical, md and toml) | Fully-Automated | C-P3: nothing lost, only moved |
| Cross-agent pointers resolve: `node.exe $G/pointer-check.mjs` | Fully-Automated | C-P3: no dangling section pointer |
| Parity/frontmatter/wiring/invocation-wiring + `node.exe $G/parity-compare.mjs` not worse than Phase 0 baseline | Fully-Automated | C-P3: Claude/Codex parity not worse |
| Sample tasks NEW vs PHASE1 (same models; OLD reported only as the model-change measurement): blind pairwise, 2 replicates, tie = EQUAL, WORSE only if reproduced, prompt version proven harness-side by `golden/runs/<run-id>.json` | Agent-Probe | C-P3: output equal or better |
| Revert-on-worse: `git revert --no-commit` rehearsal right after the first B6 commit, then `--abort` | Hybrid (needs git from Phase 0 and per-agent commits) | C-P3: any drop -> revert that agent only |
| references/ location: headless `claude -p` init `agents` array before == after; `node.exe resolve-manifest.mjs \| tr '\\' '/' \| grep -F agents/references`; e2e NOT TESTED (carried to Phase 8) | Hybrid (needs node and headless claude) | C-P3: references ship and are not mistaken for agents |
| Codex loads/ignores `.codex/agents/references/*.md`: no codex binary here; named residual, backlog stub `process/general-plans/backlog/codex-agent-references-load_NOTE_29-10-26.md`; row stays CONDITIONAL (Known-Gap is never a proving strategy) | Known-Gap residual (CONDITIONAL) | C-P3: references not mistaken for agents (Codex side) |

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

- Selected plan file path: `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-03-slim-agents_PLAN_29-10-26.md`
- Last completed step: not started
- Validate-contract status: written 29-10-26 (CONDITIONAL, outer-pvl, PVL cycle 4 re-run: 0 FAIL, 0 MUST-FIX, 13 RESIDUAL incl. 2 named Known Gaps; EXECUTE legal via mechanical gate (b), 3 recorded fix cycles)
- Supporting context files: umbrella plan, `phase-blast-radius-registry.md`, prior phase report (if any)
- Next step: after PVL re-run, spawn vc-research-agent (sonnet) for step 1 RESEARCH (after Phase 2 exit gate is green). Phase 3 runs strictly before Phases 4/5.

---

## Validate Contract

Status: CONDITIONAL
Date: 29-10-26
date: 2026-10-29
generated-by: outer-pvl
supersedes: 2026-10-29 (outer-pvl, PVL cycle 3 CONDITIONAL) — PVL cycle 4 re-ran V1-V7 against the real repo and has current evidence

Parallel strategy: sequential
Rationale: Plan mandates sequential, one agent per cycle (a regression must be attributable to one agent). Score 3/7; dominant signal S7 (15 agent files plus Codex mirrors), quality-risk high. Opus only for the editing leg; sonnet for judge, plan, validate. This pass ran Layer 1 (4 dimensions) and Layer 2 (Step 0 gates, Step A golden baseline, Step B slim loop, Step C totals) inline in one session (no spawn tool). Evidence = real-repo reads (plan, umbrella hard stops, registry, `vc-research-agent` frontmatter, agent counts and sizes), `validate-plan-artifact.mjs` (exit 0, 0 failures, 2 advisory legacy-shape warnings). V1: existing contract was CONDITIONAL (not PASS) and no `## Inner Loop Refresh Note` exists, so no auto-proceed; V1-V7 re-ran in full. Prior verdicts were not trusted.

Cycle-3 MUST-FIX closure check (1 item), verified against the real plan text and the umbrella:
- CLOSED (M1, A0 cost gate order): Step 0 now opens with item 0.0 "COST GATE FIRST". It computes the itemised total (golden, Phase 1 control, new-agent comparison, judge calls, 0.2a and RESEARCH init-field probes), requires the user's acknowledgement, says "No acknowledgement: stop", and states that 0.2a and the RESEARCH init-field probe run ONLY after it, with their calls kept in the A0 total. 0.2a itself repeats "(only after the 0.0 acknowledgement)". A0 in Step A is labelled the itemisation spec, not a second gate. This matches the umbrella hard stop (lines 101, 140, 203, 300-301: "billed model runs beyond the approved golden set: ask the user first", cost acknowledgement at Phase 3 A0). No other billed run exists in Step 0 before 0.0. Regression check: 0.0 introduces no new command; the 0.1-0.7 numbering and cross-references (0.2f, 0.4, 0.5, 0.6, A0, B4, B5, B6, C1b) are intact; the registry Phase 3 entry still matches the blast radius (`golden/**`, `.codex/agents/references/`, one backlog stub).

New-MUST-FIX scan (gate unsatisfiable, unsafe or irreversible step, protocol violated, cost hard-stop ordering, phase locks): none found. Items examined and classified RESIDUAL: probe-count wording (E10), RESEARCH probe timing relative to the EXECUTE-time acknowledgement (E11). Everything else from cycle 3 (E1-E9, KG1, KG2) is unchanged and carried.

Plan updates applied: none in this pass except the handoff status line.

Test gates (C3 5-column table):

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P3 | Prompt size drops >= 25 percent per kept agent and on the slimmed-set total | Fully-Automated | `node.exe $G/size-check.mjs` vs `sizes-before.json`/`slimmed.list`, exit 1 if any listed agent or the total drops < 25 percent | B |
| C-P3 | Every signal string, mode marker and status code intact in each slimmed prompt body (.md and .toml) | Fully-Automated | `node.exe $G/signal-census.mjs --check` (sorted set of prefix-stripped (agent, file-kind, token) lines vs `signal-census-before.txt`) | B |
| C-P3 | `signal-census.mjs` and `signal-census-phase3.txt` kept at the exact paths Phase 7 reads | Fully-Automated | `test -f $G/signal-census.mjs && test -f $G/signal-census-phase3.txt` (created by step C1b) | B |
| C-P3 | Nothing lost, only moved; guardrail sections byte-identical in md and toml | Fully-Automated | `node.exe $G/conservation-check.mjs` with per-agent `guardrails.json` | B |
| C-P3 | Cross-agent section pointers still resolve | Fully-Automated | `node.exe $G/pointer-check.mjs` before vs after | B |
| C-P3 | Claude/Codex parity, frontmatter, protocol-wiring, invocation-wiring not worse than Phase 0 baseline | Fully-Automated | four validators exit 0 (they exit 0 today; parity has 15 body-differs warnings) plus `node.exe $G/parity-compare.mjs` (see E1 for the comparison unit) | A (validators exit 0 today) + B (comparator) |
| C-P3 | Slimmed agent output equal or better than the same-model unslimmed agent | Agent-Probe | blind pairwise judge per `$G/judge.md`, 2 replicates, NEW vs `golden/phase1/`, runs valid only with `golden/runs/<run-id>.json` verified (see E3 for proof the target agent actually ran) | B |
| C-P3 | Billed runs happen only after the user acknowledges the itemised total | Hybrid | item 0.0 precedes 0.2a and every billed run; precondition: user acknowledgement recorded in `$G/compare.md` before the first `claude -p` call | B |
| C-P3 | Revert-on-worse works for one agent only | Hybrid | precondition git + per-agent commit; `git revert --no-commit <agent-commit>` then `--abort`, asserting only that agent's md/toml/references change | B (see E5) |
| C-P3 | `references/` ships and is not mistaken for an agent | Hybrid | manifest grep `node.exe resolve-manifest.mjs \| tr '\\' '/' \| grep -F agents/references` (mechanism verified on `.claude/agents/` today); headless `claude -p` init `agents` array before == after (see E2, E8) | A (manifest mechanism) + B |
| C-P3 | Codex loads/ignores `.codex/agents/references/*.md` correctly | none (no proving strategy; named residual, no `codex` binary) | Known-Gap residual KG1, never a proving strategy | D (backlog stub `process/general-plans/backlog/codex-agent-references-load_NOTE_29-10-26.md`, written by step 0.2f) |

Failing stubs (Fully-Automated rows, red-first for execute-agent):
- test("should drop slimmed-set bytes by at least 25 percent", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should drop slimmed-set bytes by at least 25 percent") })
- test("should keep signal-string census identical before and after", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep signal-string census identical before and after") })
- test("should save signal-census-phase3.txt for Phase 7", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should save signal-census-phase3.txt for Phase 7") })
- test("should conserve every removed line in a references file and keep guardrail headings identical", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should conserve every removed line in a references file and keep guardrail headings identical") })
- test("should resolve every cross-agent section pointer", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should resolve every cross-agent section pointer") })
- test("should not worsen Claude/Codex parity divergence or warning count", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should not worsen Claude/Codex parity divergence or warning count") })

Legacy line form:
- agents size: [Fully-automated: node.exe $G/size-check.mjs]
- signals/conservation/pointers: [Fully-automated: node.exe $G/signal-census.mjs --check && node.exe $G/conservation-check.mjs && node.exe $G/pointer-check.mjs]
- parity/frontmatter/wiring: [Fully-automated: validate-agent-parity.mjs + validate-agent-frontmatter.mjs + validate-protocol-wiring.mjs + validate-skill-invocation-wiring.mjs + $G/parity-compare.mjs]
- output quality: [agent-probe: blind pairwise rubric judge vs same-model control]
- cost gate + revert + install: [hybrid: user ack of the itemised total before any billed run; git revert rehearsal after first agent commit; resolve-manifest listing; headless init agent list]
- Codex references load: [known-gap: documented as NEW PLAN REQUIRED — see backlog/codex-agent-references-load_NOTE_29-10-26.md]

Dimension findings:
- Infra fit: PASS — A0 now runs first (0.0) so no billed probe precedes the acknowledgement; manifest grep, top-level validator scans, parity parser format and worktree/revert mechanics were verified in earlier cycles and no item that touches them changed.
- Test coverage: PASS — scripted gates, harness-side run record and the blind judge are specified; fragilities are carried as RESIDUAL E1-E3.
- Breaking changes: PASS — agent names, triggers, tool grants, status codes and signal strings are held verbatim by the contract, the census and the guardrail hashes; Phase 7 hard dependency has a creating step (C1b) and a prefix-neutral key format.
- Security surface: PASS — guardrail text (Entry Requirement, Strictly Forbidden, Violation Prevention, tool grants, write guards) is hash-protected per agent for md and toml; frontmatter byte-identical; user cost hard stop now ordered before every billed run.
- Step 0 (pre-run gates) feasibility: PASS — 0.0 first; RESIDUAL E10, E11.
- Section A (golden baseline) feasibility: PASS — A0 is the itemisation spec for 0.0; sandboxes per E4.
- Section B (slim loop) feasibility: PASS — per-agent commit exception, revert rehearsal, expected reverts for guardrail-heavy agents (E6).
- Section C (totals) feasibility: PASS — C1/C1b create the census artifact at the pinned path.

Net gate derivation: 0 FAIL / 0 MUST-FIX / 13 RESIDUAL (2 named Known Gaps, 11 execute-agent instructions). By the vacuous-green ban the terminal verdict is CONDITIONAL, not PASS, because one developed behavior (Codex runtime loading of `references/`, KG1) has no automated or hybrid gate, only the named residual and its backlog stub. No other behavior rests on Known-Gap alone. The missing coverage is named: a real Codex session, planned for Phase 8 or later.

Signal legality: PHASE_COMPLETE: VALIDATE is LEGAL for this contract. Reason: Gate is CONDITIONAL, so it needs one of (a) PASS, (b) N>=1 recorded fix cycles, (c) explicit user acceptance. Condition (b) holds: `wc -l < results.tsv` = 5 (header, baseline, three cycle rows) which is >= 3, so three PVL fix cycles are recorded. Condition (c) is not claimed. Emit the N>=1 variant: `PHASE_COMPLETE: VALIDATE — validate-contract written (after 3 validate-fix loop(s)). Proceed to EXECUTE.` The SUPPLEMENT REQUEST path is not needed: there is no MUST-FIX to supplement.

Known Gaps (named residuals, excluded from the CONCERN/FAIL count):
- KG1 Codex runtime loading of `.codex/agents/references/*.md` is unproven (no `codex` binary): known-gap: documented as NEW PLAN REQUIRED — see backlog/codex-agent-references-load_NOTE_29-10-26.md (written by step 0.2f; resolution: a real Codex session in Phase 8 or later).
- KG2 e2e `e2e-kit-flows.test.mjs` is red at baseline under node.exe: NOT TESTED here, carried to Phase 8 (plan 0.2e).

Execute-agent instructions (RESIDUAL, no plan edit needed):
- E1 `parity-compare.mjs`: compare the ABSOLUTE character divergence `|len(normalize(md body)) - len(normalize(toml developer_instructions))|` (recompute with the validator's own `normalize`, snapshot per agent into `$G/parity-before.json` at step 0.6) with after <= before; print the validator's percent only as information. Reason: a rounded relative percent rises when bodies shrink even with zero new divergence (validate 1.15 to 1.54 percent at the 25 percent floor, execute 1.94 to 2.59, fast-mode 5.29 to 7.05). If the percent rule is kept, move or equalise the md-only/toml-only divergent lines (fast-mode SPEC, execute Specialist Delegation, validate V6 template) into references first; do not move signal-bearing V2/V7 lines.
- E2 Re-capture the Claude agent list a third time at C1 with the real references files present (`$G/agents-list-final.json`, one more counted probe in the 0.0 total) and assert equal to before; 0.2a only proved the location with a placeholder.
- E3 `run-record.mjs` also parses the run's stream-json and records which `subagent_type` values were invoked; the judge ignores a run in which the agent under test never ran (otherwise EQUAL could be vacuous).
- E4 Build the three sandboxes without `process/general-plans/active/vibebelt-rebrand_29-10-26` (or identically in all three) so plan-discovery does not read the program's own plans; list this in the `diff -r` record.
- E5 Commits are path-limited (`git commit -- <agent md, toml, references>`); commit `$G` evidence in a separate `process:` commit before the first agent commit; in B5 assert `git status --porcelain` is unchanged by the rehearsal (empty only if everything is committed) instead of assuming empty.
- E6 Expect reverts for execute (about 45 percent guardrail text), innovate (49), research (41); revert per B6, do not force.
- E7 Keep the one trailing-whitespace line of vc-innovate-agent in the prompt body (or normalise it in `.md` and `.toml` together) so `git diff --check` stays clean.
- E8 The single RESEARCH probe to confirm the init `agents` field runs only after the 0.0 acknowledgement. If the field is absent or no acknowledgement exists yet: NEEDS_CONTEXT (the umbrella lists the cost acknowledgement as a user checkpoint) and the references-location row stays CONDITIONAL (the top-level-only validator scans still hold).
- E9 Remove the three sandbox worktrees (`git worktree remove`, `git worktree prune`) after the judge evidence is saved.
- E10 Probe count: 0.0 says "at least 4" probe calls, A0 says "at least 3"; use the larger, and add the E2 re-capture, so the acknowledged total is a maximum (it is a ceiling, not a promise).
- E11 0.0 sits in EXECUTE Step 0 while the RESEARCH init-field probe happens in the earlier RESEARCH step: RESEARCH must not run the billed probe unless the user has already acknowledged the total; otherwise RESEARCH reports "init field unconfirmed" and the EXECUTE agent confirms it in 0.2a after 0.0. Counts in 0.0 are computed from the A1 task list (3 tasks x 2 replicates) and the per-agent task mapping as a ceiling.

Open gaps:
- none blocking (0 MUST-FIX)
- codex-agent-references-load: known-gap: documented as NEW PLAN REQUIRED — see backlog/codex-agent-references-load_NOTE_29-10-26.md

What this coverage does NOT prove (What This Coverage Does NOT Prove):
- Size, census, conservation and pointer scripts prove nothing about whether an agent FOLLOWS a "read references/X when doing Y" pointer at run time; only the golden comparison can show it, over about 3 tasks and 2 replicates, so BLOCKED, abort and /goal branches stay unexercised.
- Parity commands do not prove Codex runtime behavior; Codex was never run here and no binary is installed.
- The judge does not prove cost or latency per run; with 2 replicates and "tie = EQUAL" it favors keeping the slim version, so a small real regression can pass; unless E3 is applied it also does not prove the slimmed agent was invoked.
- The headless init `agents` array proves the loader tolerates the location, not that Claude Code never warns about frontmatter-less files.
- The cost-gate ordering is a plan-text rule; nothing mechanical stops an executor from skipping 0.0, so it relies on the EXECUTE agent and the umbrella hard stop.
- Node validators ran through node.exe on NTFS; Linux/macOS path behavior is unproven.
- The revert rehearsal does not prove a real regression would be detected.

Gate: CONDITIONAL (0 FAIL / 0 MUST-FIX / 13 RESIDUAL; PVL cycle 4; vacuous-green ban applies because of KG1, so the terminal verdict is CONDITIONAL, not PASS; EXECUTE is legal on this contract via the mechanical gate (3 recorded PVL fix cycles))
Accepted by: PVL cycle 4 mechanical gate (b) — `results.tsv` records 3 fix cycles; no separate user acceptance is claimed. Accepted-as-residual by name: KG1 (Codex references loading), KG2 (e2e NOT TESTED), E1-E11 execute-agent instructions.

---

## Supplement cycle 1 (PVL-supplement, 29-10-26)

Addressed G1-G7 (+ pre-run item): A0 cost gate incl. new-agent comparison runs (user ack of total); A2 baseline from `upstream-baseline` tag in throwaway worktree with original models, SHA recorded, Phase 1 model change measured separately; 0.2 references location decision gate; 0.3 scripted gates (size floor 25 percent, signal-census body-only .md/.toml, conservation, pointer-check); 0.4 and Exit Gate use "not worse than Phase 0 baseline" (strict parity red at baseline); A4/B4 blind pairwise judge, 2 replicates, tie = EQUAL, WORSE only if reproduced, prompt version proven; B5 revert rehearsal; B6 per-agent commit exception; 0.1 tier re-confirm after Phase 0. Registry change needed: add the golden/ scripts to Phase 3 claim (task-folder files, no conflict). Validate-contract above retained unchanged.
- Supplement cycle 1c: stated the hard Phase 7 dependency on `golden/signal-census.mjs` and `golden/signal-census-phase3.txt` (exact paths) and added an existence gate at Phase 3 exit.

---

## PVL cycle 2 supplement request (29-10-26)

Issued by vc-validate-agent (outer-pvl re-run from V1). Gate was CONDITIONAL with 0 FAIL; the orchestrator spawns vc-plan-agent (PVL-supplement mode) with this block, then re-spawns vc-validate-agent from V1.

SUPPLEMENT REQUEST:
- Gap 1: Section implementation-checklist (items A2, B4) | Concern: B4 judges each slimmed agent against `golden/old/` (original models, tag tree) so the Phase 1 opus-to-sonnet change is confounded with slimming (a worse result would revert an agent that slimming did not hurt); and the `upstream-baseline` tree has no `process/context/all-context.md` (Bootstrap Guard fires in CLAUDE.md) while new runs execute in a bootstrapped tree | Severity: CONCERN | Suggested addition: revert decision compares slimmed vs `golden/phase1/` (same models, unslimmed); `golden/old/` is only the Phase 1 model-change report; build all sandboxes identically (copy Phase 0 `process/context/**` into the baseline sandbox so only `.claude/agents` and `.codex/agents` differ) and record a `diff -r` excluding agent files in `golden/compare.md`.
- Gap 2: Section implementation-checklist + exit-gate (items 0.3) | Concern: gate scripts have no defined interface: `node golden/x.mjs` is task-folder-relative while other commands are repo-root; no named before-snapshots (`sizes-before.json`, `slimmed.list`, `signal-census-before.txt`); per-agent vs set-total 25 percent rule is stated both ways; census count-vs-set undefined and keys would break after Phase 6 renames; NO checklist step creates `golden/signal-census-phase3.txt` (Phase 7 hard dependency); parity "not worse" has no comparator (Phase 0 `compare.sh` is exit-code only) | Severity: CONCERN | Suggested addition: define `G=process/general-plans/active/vibebelt-rebrand_29-10-26/golden` and call `node.exe $G/<script>` from repo root; list the three snapshot files and their producing step; say per-agent AND total; census = set of (agent-without-prefix, token) pairs, sorted; add step C1b `node.exe $G/signal-census.mjs > $G/signal-census-phase3.txt`; add `$G/parity-compare.mjs` parsing `normalized body differs (N% length delta)` and warning count against `baseline/validators_before.txt`.
- Gap 3: Section implementation-checklist (items 0.3 conservation-check) | Concern: byte-identical sections are named Purpose / Session Start / Strictly Forbidden / Status Reporting, but update-process (first target) has no Strictly Forbidden or Session Start (its guardrails are Entry Requirement, Plan File Archiving Pattern - CRITICAL, Autonomous /goal Execution Rules, Violation Prevention, Completion); fast-mode lacks both; validate lacks Session Start; behavior on a missing heading is undefined | Severity: CONCERN | Suggested addition: generate a per-agent `$G/guardrails.json` from headings matching Purpose|Entry Requirement|Strictly Forbidden|Violation Prevention|Phase Lock|Session Start|Context Loading|Completion|Status Reporting|Autonomous /goal, review it once at 0.3, make conservation-check fail on a listed-but-missing heading, and apply the same sections inside the toml `developer_instructions`.
- Gap 4: Section implementation-checklist (items 0.2, A0) | Concern: probes are not runnable as written: `node.exe resolve-manifest.mjs | grep agents/references` cannot match (this checkout prints `.claude\agents\...`); `claude agents --json` (2.1.312) lists running sessions, not configured agents; no `codex` binary exists to show Codex ignores `.codex/agents/references/*.md`; e2e is baseline-red under node.exe; A0 omits judge calls and the 0.2 probe call | Severity: CONCERN | Suggested addition: use `| tr '\\' '/' | grep -F agents/references`; name the agent-list mechanism (headless `claude -p` init event `agents` array before/after, counted in A0); record Codex loading as a named Known-Gap residual with backlog stub `process/general-plans/backlog/codex-agent-references-load_NOTE_29-10-26.md` and keep that row CONDITIONAL; mark e2e NOT TESTED and carry to Phase 8; add judge and probe calls to the A0 total.
- Gap 5: Section implementation-checklist (items A2, B4) | Concern: prompt-version proof is "file hash printed by the agent or visible in the transcript"; a model cannot hash its loaded prompt and transcripts do not show it | Severity: CONCERN | Suggested addition: harness-side proof: before each run a script writes `sha256sum` of the sandbox agent .md/.toml and `git rev-parse HEAD` to `golden/runs/<run-id>.json`; every run is a NEW OS process; the judge ignores runs without a matching record.
- Gap 6: Section implementation-checklist (items B1, B5) | Concern: B1 "snapshot the agent file (commit)" is an empty commit (exit 1) because Phase 1 is already committed; B5 rehearses reverting `<agent-commit>` which only exists after B6 | Severity: CONCERN | Suggested addition: B1 records `git rev-parse HEAD` as the snapshot ref; run the B5 revert rehearsal right after the first B6 commit on a clean tree (`git revert --no-commit` then `--abort` verified working in a scratch repo, git 2.53).

---

## Supplement cycle 2 (PVL-supplement, 29-10-26)

Addressed all 6 gaps of the cycle-2 request. G1: revert decision judges NEW vs `golden/phase1/` (same models, unslimmed); `golden/old/` is only the Phase 1 model-change report; all sandboxes built identically (Phase 0 `process/context/**` copied into the OLD sandbox) and a `diff -r` excluding agent files recorded in `golden/compare.md` (A2, A4, B4). G2: path variables T/G, `node.exe $G/<script>` from repo root, interfaces for size/signal/conservation/pointer/parity scripts, snapshots made at step 0.6 (`sizes-before.json`, `slimmed.list`, `signal-census-before.txt`, `pointers-before.json`, `start.sha`), per-agent AND total 25 percent rule stated once, census = sorted set of prefix-stripped pairs, step C1b creates `signal-census-phase3.txt`, `parity-compare.mjs` added (0.3). G3: per-agent `guardrails.json` generated by `gen-guardrails.mjs` (0.4), conservation-check fails on a listed-but-missing heading and covers toml `developer_instructions` (0.5). G4: backslash-normalised manifest grep, headless `claude -p` init `agents` array before/after (counted in A0 with judge and probe calls), Codex residual with backlog stub (0.2f, row CONDITIONAL), e2e NOT TESTED carried to Phase 8. G5: harness-side `run-record.mjs` writes sha256 of sandbox agent files plus git HEAD to `golden/runs/<run-id>.json`, each run a new OS process, judge ignores runs without a matching record (B4, A4). G6: B1 records `git rev-parse HEAD` (no empty commit); B5 revert rehearsal runs right after the first B6 commit.

Registry/umbrella changes needed (orchestrator): add to the Phase 3 claim the new task-folder scripts/snapshots (`golden/**`) and the one backlog stub `process/general-plans/backlog/codex-agent-references-load_NOTE_29-10-26.md` (outside the task folder, new file, no conflict); `.codex/agents/references/` is a new Phase 3 path. No umbrella change.

---

## PVL cycle 3 supplement request (29-10-26)

Issued by vc-validate-agent (outer-pvl re-run from V1, PVL cycle 3). Gate was CONDITIONAL with 0 FAIL and 1 MUST-FIX; the orchestrator spawns vc-plan-agent (PVL-supplement mode) with this block, then re-spawns vc-validate-agent from V1. Everything else found this cycle is carried as RESIDUAL (Known Gaps KG1-KG2, execute-agent instructions E1-E9 in the Validate Contract) and needs no plan edit.

SUPPLEMENT REQUEST:
- Gap 1: Section implementation-checklist (items 0.2a, A0) | Concern: step 0.2a (plan line 75) runs headless `claude -p` probe calls (billed model runs, at least 3) and says RESEARCH confirms the init field with one probe, but the cost gate A0 (report the exact total, user acknowledgement, umbrella hard stop "billed model runs beyond the approved golden set") sits in Step A (plan line 96), AFTER Step 0; followed in document order the probe calls run before the acknowledgement | Severity: CONCERN (MUST-FIX: protocol/hard stop violated) | Suggested addition: move the A0 cost gate to the first item of Step 0 (for example 0.0) so the acknowledgement precedes 0.2a and the RESEARCH field-name probe, or add "run only after the A0 acknowledgement" to 0.2a and to the RESEARCH note; keep the 0.2a probe calls in the A0 total.

## Supplement cycle 3 (PVL-supplement, 29-10-26)

Addressed 1 gap (MUST-FIX M1): the A0 cost gate is now the first item of Step 0 (0.0); 0.2a and the RESEARCH init-field probe run only after the user acknowledges the A0 total, and their calls remain in that total. Validate-contract above retained unchanged.

## PVL cycle 4 note (29-10-26)

vc-validate-agent re-ran V1-V7 (outer-pvl). The cycle-3 MUST-FIX (A0 cost gate order, now item 0.0) is closed and no new MUST-FIX was found. Validate-contract above supersedes the cycle-3 contract. No plan edit made in this pass.
