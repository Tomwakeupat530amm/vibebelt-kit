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

Make the agent prompts smaller WITHOUT making their answers worse. Today the biggest are update-process 53KB, plan 38KB, execute 36KB, validate 36KB, research 27KB, fast-mode 26KB, innovate 24KB, spec 23KB. Core rules stay in the prompt; long examples and tables move into `references/` files the agent loads only when needed. Quality is measured, not assumed: a golden baseline from the OLD agents is captured first and every slimmed agent is compared against it. This phase also FREEZES the golden task definitions (prompts, expected artifacts, rubric, judge protocol, old-kit sandbox recipe) under `$G/tasks/`; the Phase 8 FINAL EQUIVALENCE GATE (user decision A: the new kit must behave and answer at least as well as the old kit) re-uses them verbatim.

---

## Entry Gate

- Phase 2 exit gate green. Phases 4/5 do not need to be done (order is strict 0..8 by the umbrella; 4 and 5 run after this phase).

---

## Strategy Recommendation (vc-agent-strategy-compare)

- Signals: S6 no, S7 yes, quality-risk high — score about 3/7 but the work is inherently serial (one agent at a time, then compare).
- Recommended: **Sequential**, one agent per cycle, heaviest first. Named vc-agents run on the model in their own front-matter (research, plan, validate, tester = opus; innovate, update-process = sonnet; Phase 1 changed none); the blind comparison judge is an ad-hoc sonnet agent; the editing leg (EXECUTE) = opus. Parallel slimming is rejected on purpose: a regression could not be attributed to one agent, and the rule is "revert that agent only".

---

## Blast Radius

- `.claude/agents/vc-*.md` (15 files, one at a time) and the mirrored `.codex/agents/*.toml` agent definitions
- `.claude/agents/references/` or the location the research step finds valid for on-demand loading (NEW; must be allowed by the parity validator and the manifest `include` globs); `.codex/agents/references/` plain .md (NEW)
- Task-folder evidence and tools under `$G` (see Path variables): `size-check.mjs`, `signal-census.mjs`, `conservation-check.mjs`, `pointer-check.mjs`, `parity-compare.mjs`, `gen-guardrails.mjs`, `run-record.mjs` (new scripts) plus snapshots, `guardrails.json`, `runs/`, `old/`, `phase1/`, `compare.md`
- FROZEN golden task definitions (new, steps A1-A5): `$G/tasks/` (`tasks.md`, one `task-N-<slug>/` folder per task with `prompt.md`, `fixture/`, `expected-artifacts.md`; `rubric.md`; `judge.md`; `old-sandbox-recipe.md`; `FROZEN.md`; `FROZEN.sha256`). Read-only for every later phase; Phase 8 reads them verbatim. The task folder is excluded from the Phase 6 rename sweep, so they are never rewritten.
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

- [ ] A0. COST GATE: before starting any model run, compute and report to the user the exact run count, itemised: golden baseline runs on the original models (3 tasks x 2 replicates) PLUS Phase 1 same-model control runs (3 x 2) PLUS new-agent comparison runs (per slimmed agent, the tasks that exercise it x 2 replicates) PLUS judge calls (one pairwise judge call per task x replicate x compared pair, incl. the old-vs-phase1 pairs) PLUS probe calls (0.2a agent-list headless calls, at least 3), and the TOTAL. Golden baseline runs are APPROVED (user, LOCKED Q3); everything else and the total are NOT covered by that wording, so the total must be reported and acknowledged by the user (hard stop "beyond approved golden set") before starting. No ack: stop, do not run. Also report, for information only, the estimated run count and cost of the Phase 8 FINAL EQUIVALENCE GATE (same frozen tasks x 2 replicates x 2 kits = 12 task runs + 6 judge calls for 3 tasks); the user acknowledges that gate's exact count again at Phase 8 before it starts. The user may choose at this gate between the full OLD control (3 tasks x 2 replicates) and a recipe rehearsal only (1 task x 1 replicate on the OLD sandbox, to prove the recipe in `old-sandbox-recipe.md` works); the default is the full control as written.
- [ ] A1. Define 3 sample tasks as FROZEN golden definitions under `$G/tasks/` (a stable folder; Phase 8 reuses them VERBATIM): `$G/tasks/tasks.md` (index) and, per task, a folder `$G/tasks/task-N-<slug>/` with `prompt.md` (the exact user prompt, in plain user language; it names NO kit agent or skill by `vc-`/`vb-` name, so the identical prompt works on the old kit and on the renamed kit), `fixture/` (the fixed starting project files, if any) and `expected-artifacts.md` (which artifacts must appear, by role, not by `vc-`/`vb-` file name: e.g. a plan file with named sections, validate-contract headings, a final summary). The tasks: (1) small feature, (2) bug fix, (3) multi-phase program (plan stage only is enough for #3). Fixed inputs, fixed expected artifacts.
- [ ] A2. Build THREE sandboxes with `git worktree add` OUTSIDE this repo, constructed identically so ONLY `.claude/agents` and `.codex/agents` differ: (i) OLD = tag `upstream-baseline` with the Phase 0 `process/context/**` copied in (the tag tree has no `process/context/all-context.md`, so CLAUDE.md's Bootstrap Guard would otherwise fire and confound the run); (ii) PHASE1 = commit in `$G/start.sha` (post-Phase 2, same models, unslimmed); (iii) NEW = the commit under test, per agent (B4). Record in `$G/compare.md`: the baseline SHA, and the output of `diff -r` between each pair EXCLUDING `.claude/agents` and `.codex/agents` (known differences listed, so a non-agent confound is visible). Save outputs (plan files, validate-contract, final summaries) under `$G/old/` (original models, tag frontmatter) and `$G/phase1/` (same models as NEW, unslimmed). ROLES: `$G/phase1/` is the JUDGED control for the revert decision; `$G/old/` is reported ONLY as a pre-program control (all three trees now use the same agent models, because user decision B keeps opus as it is on disk and Phase 1 changes no `model:`), never as the revert criterion.
- [ ] A2b. Write the exact OLD-kit sandbox recipe to `$G/tasks/old-sandbox-recipe.md` as runnable commands (Phase 8 follows it as written): (1) `git worktree add <path> upstream-baseline` outside this repo; (2) copy the Phase 0 `process/context/**` into it (so CLAUDE.md's Bootstrap Guard does not fire); (3) copy the task `fixture/` into the working directory and nothing else; (4) NO model override (original agent models); (5) each run is a NEW OS process: `claude -p "$(cat prompt.md)"` with the output format and flags used in B4, run from the sandbox root; (6) `run-record.mjs <sandbox> <run-id>` before each run and `--verify` before judging; (7) the `diff -r` check against the second tree EXCLUDING `.claude/agents` and `.codex/agents` for Phase 3 (for Phase 8: excluding the kit files that differ by design, listed in the recipe); (8) cleanup (`git worktree remove`). Include the values that must be recorded per run (sandbox path, baseline SHA, run-id, replicate number, start time).
- [ ] A3. Write the rubric `$G/tasks/rubric.md`: required sections present, every signal string present, validators green (scripted: `validate-plan-artifact.mjs` on produced plans; grep of contract headings), checklist atomic/specific, no lost gate. Same rubric for old, phase1 and new. Signal-string checks for an output from the renamed kit apply the mapping `VC-` -> `VB-` (prefix-stripped agent keys), so the same rubric works for the Phase 8 final tree.
- [ ] A4. Judge protocol in `$G/tasks/judge.md`: blind pairwise (judge does not know which output is which, order randomised), 2 replicates per task, sonnet judge; verdict per agent: tie = EQUAL; WORSE only if reproduced in BOTH replicates; scripted rubric items are scripted, not judged. The judge compares NEW vs PHASE1. The judge considers a run only if `$G/runs/<run-id>.json` exists and `run-record.mjs --verify <run-id>` passes (A2/B4); runs without a matching record are ignored. The protocol text in `judge.md` is written so that Phase 8 can apply it unchanged to the pair OLD vs FINAL (verdict per task: EQUAL / BETTER / WORSE; tie = EQUAL; WORSE only if reproduced in BOTH replicates).
- [ ] A5. FREEZE (after A1-A4 and A2b, BEFORE the first model run): write `$G/tasks/FROZEN.md` ("These golden task definitions are frozen. Phase 8 reuses them verbatim. Any edit after the first model run invalidates the Phase 8 comparison; if a change is unavoidable, record why in the Phase 3 report and ask the user, because the Phase 3 and Phase 8 comparisons must use identical definitions.") and `$G/tasks/FROZEN.sha256` (`cd $G/tasks && find . -type f ! -name FROZEN.sha256 | LC_ALL=C sort | xargs sha256sum > FROZEN.sha256`). Verify with `cd $G/tasks && sha256sum -c FROZEN.sha256` (exit 0). Phase 8 re-verifies the same file before it starts. Record the hash of `FROZEN.sha256` itself in the Phase 3 report.

### Step B - Slim one agent at a time (repeat B1..B6 per agent; ONE commit per agent)

Order: update-process, plan, execute, validate, research, fast-mode, innovate, spec, then the smaller ones only if the first eight show the method is safe.

- [ ] B1. Record the agent's snapshot ref with `git rev-parse HEAD > $G/snapshots/<agent>.ref` (NO snapshot commit: Phase 1 is already committed, so an empty commit would fail with exit 1) and its size and signal strings.
- [ ] B2. Move examples/tables/long how-to into `references/<agent>-*.md` (location from 0.2); leave in the prompt: purpose, phase lock, mandatory-first actions, forbidden list, signal strings, status block, and a one-line pointer "read references/X when doing Y". Guardrail text (every heading in `guardrails.json` for that agent, tool grants, write guards) stays in the prompt.
- [ ] B3. Mirror to the Codex definition (.toml); run `node.exe $G/signal-census.mjs --check`, `node.exe $G/conservation-check.mjs`, `node.exe $G/pointer-check.mjs`, `node.exe $G/size-check.mjs` (with this agent temporarily in `slimmed.list`), and the validators: `node.exe $G/parity-compare.mjs` (NOT-WORSE-than-baseline: exit 0 AND this agent's body-differs delta not larger AND warning count not higher; strict parity is red at baseline and is not used), frontmatter, protocol-wiring, skill-invocation-wiring.
- [ ] B4. Re-run the sample task(s) that exercise this agent, each in a NEW OS PROCESS per run (fresh `claude -p`; a changed agent file may not be picked up by a running session), inside a NEW sandbox (A2 iii). BEFORE each run, `node.exe $G/run-record.mjs <sandbox> <run-id>` writes `$G/runs/<run-id>.json` containing sha256 of every sandbox agent `.md`/`.toml` plus `git rev-parse HEAD` (a model cannot hash its loaded prompt, so the proof is harness-side). Compare NEW vs `$G/phase1/` per `$G/tasks/judge.md`; write EQUAL / BETTER / WORSE. Also run `node.exe $G/run-record.mjs --verify <run-id>` before the judge sees the output.
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
test -f $G/tasks/tasks.md && test -f $G/tasks/rubric.md && test -f $G/tasks/judge.md && test -f $G/tasks/old-sandbox-recipe.md && test -f $G/tasks/FROZEN.md   # Expected: exit 0
(cd $G/tasks && sha256sum -c FROZEN.sha256); echo $?                              # Expected: every line OK, then 0 (golden task definitions frozen for Phase 8)
grep -rnE 'vc-|vb-' $G/tasks/task-*/prompt.md | wc -l                               # Expected: 0 (prompts name no kit agent/skill)
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

- `$G/compare.md` shows EQUAL or BETTER for every kept agent (NEW vs PHASE1, blind pairwise, 2 replicates, tie = EQUAL, WORSE only if reproduced), the baseline SHA, the `diff -r` outputs excluding agent files, the proven prompt version (`$G/runs/<run-id>.json`) per run, the references-location decision, the revert rehearsal result, and the OLD-vs-PHASE1 pre-program control (reported only; same models in both trees); reverted agents listed with reason.
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
- The golden task definitions under `$G/tasks/` are frozen after A5 and are reused verbatim by the Phase 8 FINAL EQUIVALENCE GATE; any change after the first model run needs a recorded reason and the user's approval.

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
| Sample tasks NEW vs PHASE1 (same models; OLD reported only as a pre-program control): blind pairwise, 2 replicates, tie = EQUAL, WORSE only if reproduced, prompt version proven harness-side by `golden/runs/<run-id>.json` | Agent-Probe | C-P3: output equal or better |
| Golden task definitions frozen: `cd $G/tasks && sha256sum -c FROZEN.sha256` exit 0; prompts contain no `vc-`/`vb-` name (grep count 0); `old-sandbox-recipe.md` exists | Fully-Automated | C-P3: frozen inputs; C-EQ (input to the Phase 8 gate): the same tasks can be re-run verbatim |
| Revert-on-worse: `git revert --no-commit` rehearsal right after the first B6 commit, then `--abort` | Hybrid (needs git from Phase 0 and per-agent commits) | C-P3: any drop -> revert that agent only |
| references/ location: headless `claude -p` init `agents` array before == after; `node.exe resolve-manifest.mjs \| tr '\\' '/' \| grep -F agents/references`; e2e NOT TESTED (carried to Phase 8) | Hybrid (needs node and headless claude) | C-P3: references ship and are not mistaken for agents |
| Codex loads/ignores `.codex/agents/references/*.md`: no codex binary here; named residual, backlog stub `process/general-plans/backlog/codex-agent-references-load_NOTE_29-10-26.md`; row stays CONDITIONAL (Known-Gap is never a proving strategy) | Known-Gap residual (CONDITIONAL) | C-P3: references not mistaken for agents (Codex side) |

---

## Phase Loop Progress

Orchestrator reads this before deciding which subagent to spawn next. The canonical 7-step inner loop
`R → I → P → PVL → E → EVL → UP` SKIPS SPEC (the umbrella plan and the user brief act as the SPEC).

- [ ] 1. RESEARCH — vc-research-agent (opus, front-matter): prior phase reports read; test context loaded; plan drift checked
- [ ] 2. INNOVATE — innovate-agent (sonnet): approach decided; Decision Summary written
- [ ] 3. PLAN-SUPPLEMENT — vc-plan-agent (opus, front-matter): existing phase plan updated; Inner Loop Refresh Note if sections changed (or "n/a — research clean"); the 2026-10-29 Refresh Note below is already written
- [ ] 4. PVL — vc-validate-agent (opus, front-matter): full V1-V7 from V1 (the 2026-10-29 Refresh Note invalidates the earlier contract); validate-contract written per `.claude/skills/vc-validate-findings/references/example-validate-output.md`
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
- Validate-contract status: PVL cycle 5 (outer-pvl, 2026-10-29, from V1) re-validated against the Inner Loop Refresh Note of 2026-10-29 and decisions A and B: Gate: CONDITIONAL (0 FAIL / 0 MUST-FIX / 16 RESIDUAL incl. 2 named Known Gaps: Codex references loading, e2e NOT TESTED); EXECUTE legal via the mechanical gate (results.tsv records 4 fix cycles, `wc -l` = 6). Earlier cycle-4 contract superseded.
- Supporting context files: umbrella plan, `phase-blast-radius-registry.md`, prior phase report (if any)
- Next step: after PVL re-run, spawn vc-research-agent (opus, front-matter) for step 1 RESEARCH (after Phase 2 exit gate is green). Phase 3 runs strictly before Phases 4/5.

---

## Inner Loop Refresh Note: 2026-10-29 — changed sections: Purpose, Strategy Recommendation, Blast Radius, Implementation Checklist (A0, A1, A2, A2b, A3, A4, A5), Exit Gate, Public Contracts, Verification Evidence, Phase Loop Progress, Resume and Execution Handoff. Invalidates prior validate-contract.

User decisions of 2026-10-29: (A) quality-equivalence is a hard program requirement, so the golden task definitions become a frozen, reusable asset for the Phase 8 FINAL EQUIVALENCE GATE; (B) models stay as on disk, so Phase 1 no longer changes any `model:` and `golden/old/` is only a pre-program control (not a model-change measurement). The Validate Contract below predates both and must be re-run from V1; its gate paths `$G/tasks.md`, `$G/rubric.md`, `$G/judge.md` are now `$G/tasks/tasks.md`, `$G/tasks/rubric.md`, `$G/tasks/judge.md`.

---


## Validate Contract

Status: CONDITIONAL
Date: 29-10-26
date: 2026-10-29
generated-by: outer-pvl
supersedes: 2026-10-29 (outer-pvl, PVL cycle 4 CONDITIONAL) — same-day re-validation from V1 (PVL cycle 5) against the Inner Loop Refresh Note of 2026-10-29 and the user decisions A and B. The cycle-4 contract and the "PVL cycle 4 note" below predate those decisions in part (the Refresh Note itself says the earlier contract is invalidated), so this contract replaces BOTH in full; the cycle supplement logs below stay as history only. The date is the same calendar day, so ordering rests on this explicit statement and on the "PVL cycle 5" label.

V1 line: `V1 RE-VALIDATE TRIGGERED: Inner Loop Refresh Note dated 2026-10-29 is newer than existing contract (same day; the Refresh Note states it invalidates the prior contract). V1 AUTO-PROCEED does not apply.`

Parallel strategy: sequential
Rationale: the plan mandates one agent per cycle (a regression must be attributable to one agent; "revert that agent only"). Score about 3/7, dominant signal S7 (15 agents plus Codex mirrors), quality risk high. Models: named vc-agents run on their front-matter (verified now: 7 opus = execute, fast-mode, quick-fix, plan, research, tester, validate; 8 sonnet), the blind judge is an ad-hoc sonnet agent, the editing leg is opus. This pass was ONE fire-and-forget validate-agent (no spawn tool): Layer 1 (4 dimensions) and Layer 2 (Step 0, Step A incl. A5 freeze, Step B, Step C, Exit Gate) inline, with throw-away checks in a scratch clone. Prior verdicts were not trusted.

### Real-repo facts and checks (V1-V7, cycle 5)

- **Entry state:** Phase 0 is done (HEAD 7845316, `upstream-baseline` tag, baselines for Linux node and node.exe, `process/context/**` present); Phase 1 is planned to change no `model:` line (user decision B), so `golden/old/` and `golden/phase1/` share the same agent models. The Entry Gate "Phase 2 exit gate green" is the correct single dependency (strict order 0..8). `claude` 2.1.312 is installed (the 0.2a headless probe is feasible); no `codex` binary exists.
- **Decision A (C-EQ) mechanism, checked item by item against the plan text:** A1 freezes 3 tasks under `$G/tasks/` with `tasks.md`, per task `prompt.md` / `fixture/` / `expected-artifacts.md`, prompts in plain user language that name no `vc-`/`vb-` item (gate: `grep -rnE 'vc-|vb-' $G/tasks/task-*/prompt.md | wc -l` = 0); A2b writes `old-sandbox-recipe.md` as 8 runnable steps with the per-run values to record; A3 `rubric.md` with the `VC-` to `VB-` mapping; A4 `judge.md` written so Phase 8 applies it unchanged (EQUAL / BETTER / WORSE, tie = EQUAL, WORSE only if reproduced in both replicates); A5 writes `FROZEN.md` and `FROZEN.sha256` BEFORE the first model run and verifies with `sha256sum -c`. I rehearsed the exact A5 commands in a scratch folder: `find . -type f ! -name FROZEN.sha256 | LC_ALL=C sort | xargs sha256sum > FROZEN.sha256` then `sha256sum -c FROZEN.sha256` = every line `OK`, exit 0; the prompt grep prints 0. The registry (`golden/tasks/**` owned by Phase 3, read-only for Phase 8) and the umbrella (C-P3, C-EQ, Phase 7/8 dependencies) agree with the plan.
- **A0 cost gate:** it is the FIRST Step 0 item (0.0); billed calls (0.2a probes, the RESEARCH init-field probe, golden/control/new-agent runs, judge calls) come only after the user's acknowledgement ("No acknowledgement: stop"). A0 reports the Phase 8 FINAL EQUIVALENCE GATE estimate "12 task runs + 6 judge calls for 3 tasks" (3 tasks x 2 replicates x 2 kits = 12; 3 x 2 judge pairs = 6), which matches Phase 8 B4.3 ("the 12 task runs"), and offers the control choice: full OLD control (3 x 2, default) or a recipe rehearsal only (1 task x 1 replicate on the OLD sandbox). Correct and consistent with the umbrella hard stop.
- **Decision B coherence:** the live checklist is coherent: the Strategy line ("Phase 1 changed none"), A2 ROLES (`$G/phase1/` is the judged control for the revert decision; `$G/old/` is a reported-only pre-program control because all three trees use the same models), A4 (judge compares NEW vs PHASE1), B4, the Exit Gate bullets and the Verification Evidence rows all say the same. No live checklist or gate item still measures a "model change", so nothing dangles. The only "Phase 1 model change" wording left is in the historical supplement-cycle logs (cycle 1/2 summaries and the old PVL cycle 2 request, below), which the closing "Supplement (user decisions 2026-10-29)" block explicitly supersedes; treat them as history (E12). The umbrella's own old contract still has two stale sentences (C-P3q row "reported only as the Phase 1 model-change measurement", and a line about the "sonnet downgrade of research/plan/validate/tester"); they are outside this plan and are reported to the orchestrator.
- **Gate runnability:** all Exit Gate scripts are created by 0.3/0.4/0.5/C1b before use (red-first); `sha256sum`, `LC_ALL=C sort`, `xargs` exist; `git worktree add` + `git revert --no-commit` + `--abort` was rehearsed (see Phase 4 contract) and works on this git; the manifest grep needs `tr '\\' '/'` under node.exe only and is harmless under Linux node. The parity baseline files `baseline/validators_before.txt` (Linux, first line `# runtime=node`) and `.node-exe.txt` both hold 15 `normalized body differs` lines, so `parity-compare.mjs` can read either.
- **Structural check:** `validate-plan-artifact.mjs` on this plan: exit 0, 0 failures, 2 advisory legacy-shape warnings.

### MUST-FIX / RESIDUAL classification

MUST-FIX: 0. (No gate is unsatisfiable, no step is unsafe or irreversible, the cost hard stop is ordered first, phase locks hold.)
RESIDUAL (14 execute-agent instructions E1-E14, plus the Known Gaps KG1 and KG2; none blocks a gate): E1-E11 carried from the cycle-4 contract (re-read, still valid) plus three new items that became E12-E14:
- RES-A Stale parenthetical in 0.7: "(validate-skills and validate-context-discovery are red at baseline only because `.agents/skills` is a 17-byte text file; Phase 0 repairs it)". Phase 0 did NOT repair it: both validators stay red (exit 1) in both baseline TSVs and only go green on a native Linux or CI checkout. The operative rule in the same sentence ("red = WORSE than this baseline") and the Exit Gate ("compared to the Phase 0 baseline, not required absolute green") are correct, so no gate breaks (E13).
- RES-B Runtime wording: scripts are written as `node.exe $G/<script>` with "use `node` where it exists"; Linux node exists now. Sandboxes live outside the repo, where Linux `node` is the natural runtime; `node.exe` also works but reports UNC paths (E14). The e2e remark "red at baseline under node.exe" (0.2e, Exit Gate note) is now "red at baseline: Trial C everywhere, Trial D on drvfs" (still NOT TESTED here and carried to Phase 8).
- RES-C Historical supplement logs still contain the superseded "Phase 1 model change" wording (see Decision B above); no action beyond E12.

### Plan updates applied

None in this pass except the handoff status line (validate-agent writes the contract only).

### Test gates (C3 5-column table)

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P3 | prompt size drops >= 25 percent per kept agent and on the slimmed-set total | Fully-Automated | `node.exe $G/size-check.mjs` vs `sizes-before.json` / `slimmed.list`, exit 1 if any listed agent or the total drops < 25 percent | B |
| C-P3 | every signal string, mode marker, status code intact in each slimmed prompt body (.md and .toml) | Fully-Automated | `node.exe $G/signal-census.mjs --check` (sorted set of prefix-stripped (agent, file-kind, token) lines vs `signal-census-before.txt`) | B |
| C-P3 | `signal-census.mjs` and `signal-census-phase3.txt` kept at the exact paths Phase 7 reads | Fully-Automated | `test -f $G/signal-census.mjs && test -f $G/signal-census-phase3.txt` (step C1b) | B |
| C-P3 | nothing lost, only moved; guardrail sections byte-identical (md and toml) | Fully-Automated | `node.exe $G/conservation-check.mjs` with per-agent `guardrails.json` | B |
| C-P3 | cross-agent section pointers still resolve | Fully-Automated | `node.exe $G/pointer-check.mjs` before vs after | B |
| C-P3 | Claude/Codex parity, frontmatter, protocol-wiring, invocation-wiring not worse than Phase 0 baseline | Fully-Automated | four validators exit 0 today (parity has 15 body-differs warnings) plus `node.exe $G/parity-compare.mjs` (comparison unit per E1) | A (validators exit 0 today) + B (comparator) |
| C-P3 / C-EQ input | golden task definitions frozen, kit-name-neutral and re-runnable verbatim in Phase 8 | Fully-Automated | `test -f` on tasks.md, rubric.md, judge.md, old-sandbox-recipe.md, FROZEN.md; `(cd $G/tasks && sha256sum -c FROZEN.sha256)` exit 0; `grep -rnE 'vc-\|vb-' $G/tasks/task-*/prompt.md \| wc -l` = 0 (A5 procedure rehearsed in scratch) | B |
| C-P3 | slimmed agent output equal or better than the same-model unslimmed agent | Agent-Probe | blind pairwise judge per `$G/tasks/judge.md`, 2 replicates, NEW vs `golden/phase1/`, runs valid only with a verified `golden/runs/<run-id>.json` and (E3) proof the agent under test ran; `golden/old/` reported only | B |
| C-P3 / C-EQ | billed runs only after the user acknowledges the itemised total; A0 also reports the Phase 8 count (12 runs + 6 judge calls) and offers the full-3x2 or 1x1-rehearsal OLD control | Hybrid | item 0.0 precedes 0.2a and every billed run; precondition: user acknowledgement recorded in `$G/compare.md` before the first `claude -p` call | B |
| C-P3 | revert-on-worse works for one agent only | Hybrid | precondition git + per-agent commit; `git revert --no-commit <agent-commit>` then `--abort` asserting only that agent's md/toml/references change (mechanics rehearsed in scratch) | B (see E5) |
| C-P3 | `references/` ships and is not mistaken for an agent (Claude side) | Hybrid | `node.exe resolve-manifest.mjs \| tr '\\' '/' \| grep -F agents/references`; headless `claude -p` init `agents` array before == after (E2, E8) | A (manifest mechanism) + B |
| C-P3 | Codex loads/ignores `.codex/agents/references/*.md` correctly | none (named residual KG1, never a proving strategy; no `codex` binary) | backlog stub `process/general-plans/backlog/codex-agent-references-load_NOTE_29-10-26.md` (step 0.2f) | D |

Failing stubs (Fully-Automated rows, red-first for execute-agent):
- test("should drop slimmed-set bytes by at least 25 percent", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should drop slimmed-set bytes by at least 25 percent") })
- test("should keep signal-string census identical before and after", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep signal-string census identical before and after") })
- test("should save signal-census-phase3.txt for Phase 7", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should save signal-census-phase3.txt for Phase 7") })
- test("should conserve every removed line in a references file and keep guardrail headings identical", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should conserve every removed line in a references file and keep guardrail headings identical") })
- test("should resolve every cross-agent section pointer", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should resolve every cross-agent section pointer") })
- test("should not worsen Claude/Codex parity divergence or warning count", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should not worsen Claude/Codex parity divergence or warning count") })
- test("should freeze the golden task definitions with a verifiable sha256 and kit-name-neutral prompts", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should freeze the golden task definitions with a verifiable sha256 and kit-name-neutral prompts") })

Legacy line form:
- agents size: [Fully-automated: node.exe $G/size-check.mjs]
- signals/conservation/pointers: [Fully-automated: node.exe $G/signal-census.mjs --check && node.exe $G/conservation-check.mjs && node.exe $G/pointer-check.mjs]
- parity/frontmatter/wiring: [Fully-automated: validate-agent-parity.mjs + validate-agent-frontmatter.mjs + validate-protocol-wiring.mjs + validate-skill-invocation-wiring.mjs + $G/parity-compare.mjs]
- frozen golden definitions: [Fully-automated: sha256sum -c FROZEN.sha256 + prompt grep = 0]
- output quality: [agent-probe: blind pairwise rubric judge, NEW vs PHASE1 (same models)]
- cost gate + revert + install: [hybrid: user ack of the itemised total before any billed run; git revert rehearsal after the first agent commit; resolve-manifest listing; headless init agent list]
- Codex references load: [known-gap: documented as NEW PLAN REQUIRED — see backlog/codex-agent-references-load_NOTE_29-10-26.md]

### Known Gaps (named residuals, excluded from the CONCERN/FAIL count)

- KG1 Codex runtime loading of `.codex/agents/references/*.md` is unproven (no `codex` binary): known-gap: documented as NEW PLAN REQUIRED — see backlog/codex-agent-references-load_NOTE_29-10-26.md (written by step 0.2f; resolution: a real Codex session in Phase 8 or later).
- KG2 e2e `e2e-kit-flows.test.mjs` stays red at baseline (Trial C everywhere, Trial D on drvfs; node.exe has a Windows path bug): NOT TESTED here, carried to Phase 8 (plan 0.2e).

### Execute-agent instructions (RESIDUAL, no plan edit needed)

- E1 `parity-compare.mjs`: compare the ABSOLUTE character divergence `|len(normalize(md body)) - len(normalize(toml developer_instructions))|` (recompute with the validator's own `normalize`, snapshot per agent into `$G/parity-before.json` at step 0.6) with after <= before; print the validator's percent only as information (a rounded relative percent rises when bodies shrink even with zero new divergence). If the percent rule is kept, equalise md-only/toml-only divergent lines into references first; do not move signal-bearing V2/V7 lines.
- E2 Re-capture the Claude agent list a third time at C1 with the real references files present (`$G/agents-list-final.json`, one more counted probe in the 0.0 total) and assert equal to before.
- E3 `run-record.mjs` also parses the run's stream-json and records which `subagent_type` values were invoked; the judge ignores a run in which the agent under test never ran.
- E4 Build the three sandboxes without `process/general-plans/active/vibebelt-rebrand_29-10-26` (or identically in all three) so plan-discovery does not read the program's own plans; list this in the `diff -r` record.
- E5 Commits are path-limited (`git commit -- <agent md, toml, references>`); commit `$G` evidence in a separate `process:` commit before the first agent commit; in B5 assert `git status --porcelain` is unchanged by the rehearsal instead of assuming empty.
- E6 Expect reverts for execute (about 45 percent guardrail text), innovate (49), research (41); revert per B6, do not force.
- E7 Keep the one trailing-whitespace line of vc-innovate-agent in the prompt body (or normalise it in `.md` and `.toml` together) so `git diff --check` stays clean.
- E8 The single RESEARCH probe to confirm the init `agents` field runs only after the 0.0 acknowledgement. If the field is absent or no acknowledgement exists yet: NEEDS_CONTEXT, and the references-location row stays CONDITIONAL.
- E9 Remove the three sandbox worktrees (`git worktree remove`, `git worktree prune`) after the judge evidence is saved.
- E10 Probe count: 0.0 says "at least 4", A0 says "at least 3"; use the larger and add the E2 re-capture so the acknowledged total is a ceiling.
- E11 0.0 sits in EXECUTE Step 0 while the RESEARCH init-field probe happens earlier: RESEARCH must not run the billed probe unless the user has already acknowledged the total; otherwise RESEARCH reports "init field unconfirmed" and the EXECUTE agent confirms it in 0.2a after 0.0. Counts in 0.0 are a ceiling computed from the A1 task list and the per-agent task mapping.
- E12 Treat the "Phase 1 model change" sentences in the historical supplement logs (cycle 1/2 summaries, old PVL cycle 2 request) as superseded by the 2026-10-29 supplement; do not build any model-change measurement step. `golden/old/` = reported-only pre-program control.
- E13 Ignore the false clause "Phase 0 repairs it" in 0.7: `.agents/skills` stays a 17-byte text file in this work tree; validate-skills and validate-context-discovery stay red (exit 1) at baseline and are judged "not worse".
- E14 Use Linux `node` for the `$G` scripts (sandbox cwd outside the repo, `git` calls) and record the runtime per run; if `node.exe` is used, normalise backslash paths first. Keep one runtime for before and after of every comparison.

Open gaps:
- none blocking (0 MUST-FIX)
- codex-agent-references-load: known-gap: documented as NEW PLAN REQUIRED — see backlog/codex-agent-references-load_NOTE_29-10-26.md
- e2e-kit-flows: known-gap: documented as NEW PLAN REQUIRED — carried to the Phase 8 user-run list (Trial C: Phase 6 B4; native-Linux run: Phase 8)

### Dimension findings

- Infra fit: PASS — cost gate ordered first, manifest/validator scan mechanics and git worktree/revert mechanics verified; frozen-task procedure rehearsed.
- Test coverage: PASS — scripted gates, harness-side run record, blind judge and the freeze/hash gate are specified; fragilities carried as RESIDUAL E1-E3.
- Breaking changes: PASS — agent names, triggers, tool grants, status codes and signal strings held verbatim by census and guardrail hashes; Phase 7 hard dependency has a creating step (C1b) and prefix-neutral keys; Phase 8 reuses the frozen tasks verbatim.
- Security surface: PASS — guardrail text hash-protected per agent for md and toml; frontmatter byte-identical; the user cost hard stop precedes every billed run.
- Step 0 (pre-run gates) feasibility: PASS — 0.0 first; RESIDUAL E10, E11, RES-A.
- Section A (golden baseline, freeze) feasibility: PASS — A0, A1, A2, A2b, A3, A4, A5 consistent with decision A and with Phase 8 B4.
- Section B (slim loop) feasibility: PASS — per-agent commit exception, revert rehearsal, expected reverts (E6).
- Section C (totals) feasibility: PASS — C1/C1b create the census artifact at the pinned path.
- Exit Gate: PASS — commands exist or are created earlier in the phase; expected values are stated.

Net gate derivation: Layer 1 = 0 FAIL / 0 CONCERN / 4 PASS; Layer 2 = 0 FAIL / 0 CONCERN / 5 PASS. MUST-FIX 0; RESIDUAL 16 (2 named Known Gaps + 14 execute-agent instructions E1-E14, incl. the 3 new items RES-A/B/C folded into E13/E14/E12). By the vacuous-green ban the terminal verdict is CONDITIONAL, not PASS: one developed behavior (Codex runtime loading of `references/`, KG1) has no automated or hybrid gate, only a named residual and its backlog stub. No other behavior rests on Known-Gap alone.

Signal legality: `PHASE_COMPLETE: VALIDATE` is LEGAL for this contract. Gate is CONDITIONAL, so it needs (a) PASS, (b) N>=1 recorded fix cycles, or (c) explicit user acceptance. Condition (b) holds: `wc -l < process/general-plans/active/vibebelt-rebrand_29-10-26/results.tsv` = 6 (header, baseline, four cycle rows) which is >= 3. Condition (c) is not claimed. Emit the N>=1 variant: `PHASE_COMPLETE: VALIDATE — validate-contract written (after 4 validate-fix loop(s)). Proceed to EXECUTE.` No SUPPLEMENT REQUEST is needed (0 MUST-FIX). The orchestrator appends the PVL iteration-5 bookkeeping row.

What this coverage does NOT prove (What This Coverage Does NOT Prove):
- Size, census, conservation and pointer scripts prove nothing about whether an agent FOLLOWS a "read references/X when doing Y" pointer at run time; only the golden comparison can show it, over about 3 tasks and 2 replicates, so BLOCKED, abort and /goal branches stay unexercised.
- Parity commands do not prove Codex runtime behavior; Codex was never run here and no binary is installed.
- The judge does not prove cost or latency per run; with 2 replicates and "tie = EQUAL" it favors keeping the slim version, so a small real regression can pass; unless E3 is applied it also does not prove the slimmed agent was invoked.
- The freeze hash proves the definitions did not change after A5, not that 3 tasks are representative of every behavior the Phase 8 gate cares about.
- The headless init `agents` array proves the loader tolerates the location, not that Claude Code never warns about frontmatter-less files.
- The cost-gate ordering is a plan-text rule; nothing mechanical stops an executor from skipping 0.0, so it relies on the EXECUTE agent and the umbrella hard stop.
- Validators were exercised under Linux node and node.exe on a drvfs checkout; macOS and native-Windows path behavior is unproven.
- The revert rehearsal does not prove a real regression would be detected.

Gate: CONDITIONAL (0 FAIL / 0 MUST-FIX / 16 RESIDUAL; PVL cycle 5; vacuous-green ban applies because of KG1, so the terminal verdict is CONDITIONAL, not PASS; EXECUTE is legal on this contract via the mechanical gate (b), 4 recorded PVL fix cycles)
Accepted by: PVL mechanical gate (b) — `results.tsv` records 4 fix cycles; no separate user acceptance is claimed. Accepted-as-residual by name: KG1 (Codex references loading), KG2 (e2e NOT TESTED), E1-E14 execute-agent instructions.

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


### Supplement (user decisions 2026-10-29: quality-equivalence + model direction)

- Decision A: new step A5 freezes `$G/tasks/` (tasks.md, per-task prompt/fixture/expected-artifacts, rubric, judge, old-sandbox-recipe, FROZEN.md, FROZEN.sha256) before the first model run; new A2b records the exact old-kit sandbox recipe; rubric and judge written so Phase 8 applies them unchanged (signal mapping VC- -> VB-); prompts are kit-name-neutral; Exit Gate and Verification Evidence check the freeze; A0 also reports the Phase 8 gate's estimated run count for information and offers a full OLD control or a 1x1 recipe rehearsal.
- Decision B: `golden/old/` is no longer the "Phase 1 model-change measurement" (no model changes); it is a pre-program control. Revert criterion unchanged (`golden/phase1/`).
- Deferred, optional, NOT in this program: measure sonnet versus opus on the golden tasks before ever lowering a model.
