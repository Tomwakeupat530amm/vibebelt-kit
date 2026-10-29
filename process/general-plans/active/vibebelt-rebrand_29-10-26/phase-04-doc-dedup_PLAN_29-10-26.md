---
name: plan:vibebelt-rebrand-phase-04-doc-dedup
description: "vibebelt-kit rebrand — Phase 04: Doc de-duplication"
date: 29-10-26
metadata:
  node_type: memory
  type: plan
  feature: general-plans
  phase: phase-04
---

# Phase 04 — Doc de-duplication

**Program:** vibebelt-rebrand
**Umbrella plan:** process/general-plans/active/vibebelt-rebrand_29-10-26/vibebelt-rebrand-umbrella_PLAN_29-10-26.md
**Phase status:** ⏳ PLANNED
**Complexity:** COMPLEX
**Report destination:** process/general-plans/active/vibebelt-rebrand_29-10-26/phase-04-doc-dedup_REPORT_29-10-26.md (flat in the program task folder)

---

## Overview

One phase of the vibebelt-rebrand program; program context lives in the umbrella plan. Context router: process/context/all-context.md (created in Phase 0). Test routing: process/context/tests/all-tests.md (load before assigning tiers).

Date: 29-10-26
Status: PLANNED
Complexity: COMPLEX

## Purpose

Stop saying the same thing in several places. `CLAUDE.md` and `AGENTS.md` share large blocks; protocols such as `orchestration.md` carry "superseded by" leftovers. Choose ONE source for each shared block and make the other file point to it.

---

## Entry Gate

- Phase 3 exit gate green.

---

## Strategy Recommendation (vc-agent-strategy-compare)

- Signals: S4 yes (runs beside Phase 5), shared-file risk — score 3/7.
- Recommended: **Agent team** with Phase 5, because the two phases must prove disjoint files while running: `TeamCreate` ("vibebelt-p4-p5") provisions two named teammates (`p4-docs-dedup`, `p5-skills-tune`); each gets a `TaskCreate` task scoped to its blast radius from `phase-blast-radius-registry.md`; they coordinate with `SendMessage` (for example, "I need to touch X" before editing a shared file); the orchestrator tracks them with `TaskList`. This is NOT parallel subagents (those cannot talk to each other). Research/plan/validate teammates = sonnet; the code-editing leg of each teammate = opus.
- Fallback if the team tooling is unavailable: run Phase 4 then Phase 5 sequentially (still correct, just slower).

---

## Blast Radius (disjoint from Phase 5 — see registry)

- `CLAUDE.md`, `AGENTS.md`
- `process/development-protocols/*.md` (orchestration, implementation-standards, plan-lifecycle, phase-programs, vc-system-behavior/*)
- NOT touched (read-only for Phase 4): anything under `.claude/skills/**`, `.claude/agents/**`, `.codex/**`, `process/context/generated-skills-catalog.json` (regenerated only at the join), and BOTH charter-template mirror copies (`process/development-protocols/references/program-goal-charter-template.md` and `.claude/skills/vc-generate-phase-program/references/program-goal-charter-template.md`): frozen in Phases 4 and 5, `cmp`-checked at the join
- New task-folder tools and files: `$T/p4-tools/*` (scripts, `baseline.sha`, `claim.globs`, `pointer-baseline.json`, `overlap-baseline.json`, `cold-read.md`), `$T/dedup-allowlist.txt`, `$T/dedup-allowlist.why.txt`

### Path variables and conventions (apply to every command in this plan)

```bash
T=process/general-plans/active/vibebelt-rebrand_29-10-26
```

- ALL commands run from the repo root (or from the teammate's worktree root, which is the same layout) as `node.exe $T/p4-tools/<script> [--root <dir>]`. No command in this plan is task-folder-relative. `node` may replace `node.exe` where available.
- Bash only (WSL). Sort with `LC_ALL=C sort`. No process substitution (`<(...)`) in any gate: write both sides to files, then `diff` the files.
- Git: each teammate works in its OWN worktree + branch (`p4-docs-dedup`, `p5-skills-tune`) created from the baseline commit (step 0.7); the branches are merged at the join. Fallback (team tooling unavailable): run Phase 4 then Phase 5 sequentially on `main` with a path-limited commit per phase; claim-check then runs on `git diff --name-only $(cat $T/p4-tools/baseline.sha)..HEAD`.

---

## Implementation Checklist

### Step 0 - Gates and probes defined first (red-first)

- [ ] 0.1 Re-confirm test tiers at inner PVL after Phase 0 creates `process/context/tests/all-tests.md`.
- [ ] 0.2 Write `$T/p4-tools/pointer-check.mjs` (`--root`, `--write-baseline`). Scope: scan EVERY repo file except the task folder `$T`, `.git` and `node_modules` (not just CLAUDE.md, AGENTS.md, protocols, `.claude/agents`, `.codex`, `.claude/skills`): this includes `.claude/hooks/lib/context-builder.cjs` (resolves `implementation-standards.md` and `orchestration.md` by file name at runtime: checked as a named runtime-lookup list), `docs/**` (14 files), `process/_seeds/**`, README.md, CONTRIBUTING.md, `.github/labeler.yml`, `install.sh`, `compute-sync-plan.mjs`, `e2e-kit-flows.test.mjs`. It extracts citations of `process/development-protocols/...` paths and these anchor forms: `§Name` (heading text after the section sign), `#### Name` / `### Name` (explicit heading references), `Section N` (resolves to the numbered section in `vc-system-behavior/*`). Assert the cited file exists and the cited heading exists. `--write-baseline` (run BEFORE editing) stores every currently failing citation in `$T/p4-tools/pointer-baseline.json`; the after-run fails only on citations NOT in the baseline. Fix the known dangling pointer in `all-development-protocols.md` to `archive/vc-system-behavior-reference_ARCHIVED_09-06-26.md` (file absent; manifest `legacyDeletions` retires it): remove or reword the pointer (C2).
- [ ] 0.3 Write `$T/p4-tools/signal-census.mjs` over the UNION of CLAUDE.md + AGENTS.md + `process/development-protocols/**`: signal strings (`PHASE_COMPLETE:` etc.), `[MODE: ...]` markers, status codes, Bootstrap guard text (case-insensitive, per file), `@process/...` imports, the mandatory `find process/context/ -type f` / `find process/development-protocols/ -type f` gate text, PLUS a skill-name census (every `.claude/skills/*/` directory name) and an agent-name census (every `.claude/agents/*.md` stem and `.codex/agents/*.toml` stem, prefix included). `--write-baseline` (before editing) saves `$T/p4-tools/census-before.txt` (sorted set, `LC_ALL=C`); the after-run (`--check`) must show an empty set diff. EXEMPTION: the skill names that appear ONLY as rows of the AGENTS.md Skill Registry table are listed in `$T/p4-tools/registry-exempt.txt` (generated in A1); for those the check instead asserts the name is present in `process/context/generated-skills-catalog.json` (the table is replaced by a pointer, see A1/B2).
- [ ] 0.4 Build the leftovers allowlist for `LC_ALL=C grep -rniE "superseded|compatibility note|legacy" process/development-protocols CLAUDE.md AGENTS.md | sed -E 's/:[0-9]+:/:/' | LC_ALL=C sort`. TODAY this returns 50 hits (not 3), including the case-insensitive `SUPERSEDED` status-enum lines `orchestration.md:644`, `vc-system-behavior/11-phase-programs.md:95` and `:98`. Save the 50-hit list as `$T/p4-tools/leftovers-before.txt`; write `$T/dedup-allowlist.txt` (one line per KEPT hit in the same `path:text` form, sorted) and the sidecar `$T/dedup-allowlist.why.txt` (`path:text<TAB>one-line justification`, one per hit; justifications live ONLY in the sidecar because the allowlist is diffed). Known: `vc-system-behavior/02-skill-tiers.md:93` legitimate ("superseded by higher-priority"); `vc-system-behavior/09-execute.md:214` is legitimate prose (keep, justify); `orchestration.md:203` is the clear leftover (remove, C2); the three `SUPERSEDED` enum lines are kept (status vocabulary). The final allowlist is produced after C2 (it equals the 50 hits minus the removed ones).
- [ ] 0.5 Define the cold-read probe in `$T/p4-tools/cold-read.md`: a fixed list of 10 named rules chosen in A1 (must include: Bootstrap Guard, mandatory find gate, QUICK FIX scope guard, /goal block format, PVL/EVL gate rule, no-inline-execution, commit branch policy, strategy-compare at transitions, model selection policy, communication standards) with the per-entry applicability from A1 (CLAUDE.md = all 10; AGENTS.md = the applicable subset). Pass = for each applicable rule the fresh sonnet agent names exactly one source file (plus pointers). Run protocol:
  - [ ] 0.5a COST GATE: before any probe call, report the exact probe-call count to the user (4 calls: baseline CLAUDE.md entry, baseline AGENTS.md-only entry, after CLAUDE.md entry, after AGENTS.md-only entry; +4 if a replicate is needed to confirm a FAIL). These are billed runs beyond the approved golden set (umbrella hard stop): acknowledgement required, no ack = do not run, and the cold-read stays CONDITIONAL.
  - [ ] 0.5b BASELINE FIRST (before any edit): run the probe on the UNMODIFIED files. Expectation: at least one rule resolves to 2 sources. If every rule is already single-source, the probe cannot show a drop: record that and treat `overlap-check.mjs` (0.5c) as the authoritative duplication gate; the cold-read row stays CONDITIONAL.
  - [ ] 0.5c AGENTS.md-only entry runs from a TEMP COPY without CLAUDE.md (copy `AGENTS.md`, `process/development-protocols/**`, `process/context/**` into a fresh temp dir with no `CLAUDE.md` and no `.claude/`, run headless `claude -p` there), because a Claude subagent auto-loads CLAUDE.md and would contaminate the Codex-side entry.
- [ ] 0.5d Write `$T/p4-tools/overlap-check.mjs` (`--root`, `--write-baseline`): normalise lines (lowercase, strip markdown punctuation and table pipes, collapse whitespace, drop lines under 4 tokens) of CLAUDE.md and AGENTS.md (INCLUDING the AGENTS.md Skill Registry rows) and compute (1) the fraction of normalized lines of the smaller file that also occur in the other, and (2) the 8-token-shingle overlap `|S_claude ∩ S_agents| / min(|S_claude|, |S_agents|)`. `--write-baseline` stores both metrics in `$T/p4-tools/overlap-baseline.json` (before edit). Named reduction floor: exit 1 unless BOTH metrics after are <= 50 percent of their baseline value (a floor change needs a numeric justification recorded in A1 before editing, and may only go in the stricter direction unless 0.5b shows the baseline is already low).
- [ ] 0.6 Disjointness tool: `$T/p4-tools/claim-check.mjs <claim.globs>` reads `git diff --name-only` lines from stdin and fails if any path is outside the claim. `$T/p4-tools/claim.globs` is the machine-readable form of the registry Phase 4 claim (one glob per line, `!` prefix = excluded): `CLAUDE.md`, `AGENTS.md`, `process/development-protocols/**`, `!process/development-protocols/references/program-goal-charter-template.md`, `$T/p4-tools/**`, `$T/dedup-allowlist*.txt`, `$T/phase-04-doc-dedup_REPORT_29-10-26.md`. The orchestrator keeps the registry prose claim equal to this file.
- [ ] 0.7 Baselines and worktrees (after 0.2-0.6 tools are committed as a process commit): `git rev-parse HEAD > $T/p4-tools/baseline.sha`; `sha256sum` of both charter-template mirror copies to `$T/p4-tools/mirror.sha256` (must be equal to each other); run `--write-baseline` for pointer-check, signal-census, overlap-check; then create the teammate worktree `git worktree add ../vibebelt-p4 -b p4-docs-dedup $(cat $T/p4-tools/baseline.sha)` (the Phase 5 teammate creates `../vibebelt-p5` / `p5-skills-tune` from the same sha).

### Step A - Map duplicates

- [ ] A1. Define a SEMANTIC block list: CLAUDE.md and AGENTS.md are paraphrases (only 18 long lines are byte-identical), so a raw diff under-finds. List shared blocks by topic (orchestrator role, phase table, QUICK FIX, strategy-compare, model policy, communication principles, shared process folder, validators, Skill Registry) and mark Claude-only / Codex-only. Grep protocols for `superseded`, `legacy`, `compatibility note`. Choose the 10 cold-read rules here and classify EACH as both / Claude-only / Codex-only, recorded in `cold-read.md`: CLAUDE.md must hit 10 of 10; AGENTS.md must hit every rule classed both or Codex-only. TODAY AGENTS.md says "Bootstrap guard" (lowercase g) and lacks the `find process/context/ -type f` / `find process/development-protocols/ -type f` gate text, `PHASE_COMPLETE` and `ENTER VALIDATE MODE`; for a rule classed both that AGENTS.md lacks, add an explicit item in B2 that gives AGENTS.md a plain-path pointer to the protocol file holding the rule (or keeps the text inline if a pointer would make it unreachable for Codex). DECISION to make and record here: the AGENTS.md "Skill Registry" table (30 rows, "Trigger Keywords" column, about line 435; 3 of 33 skills missing) duplicates SKILL.md `trigger_keywords` that Phase 5 edits, so REPLACE the table by a plain-path pointer to `process/context/generated-skills-catalog.json` (A1 verifies the catalog carries each skill's trigger keywords; if not, point only to `node .claude/skills/vc-context-discovery/scripts/discover-skills.mjs`, which prints them). Write the table's skill names to `$T/p4-tools/registry-exempt.txt` (used by 0.3). Note `validate-skill-routing.mjs` counts a skill as routed if its name is in AGENTS.md, CLAUDE.md OR the catalog, so it cannot detect a dropped name: the skill-name census (0.3) is the guard.

### Step B - Pick sources

- [ ] B1. For each shared block choose the source file (default: protocols under `process/development-protocols/` hold content; CLAUDE.md/AGENTS.md hold only tool-specific bootstrap + pointers). Record decisions in the phase report.
- [ ] B2. Replace duplicates with a one-line pointer; keep all signal strings, mode markers, and the Bootstrap Guard text working in BOTH top-level files. Pointers in AGENTS.md are plain repo-relative paths (Codex cannot rely on Claude `@` imports; `test "$(grep -c '@process' AGENTS.md)" = 0`); if a pointer would make a rule unreachable by Codex, keep the text inline there. Apply the A1 decisions (rule pointers AGENTS.md lacks, Skill Registry replacement).

### Step C - Remove leftovers

- [ ] C1. Delete superseded text only when a current replacement exists in the same file set; never delete the only copy of a rule. HARD RULE: do NOT rename or delete any protocol file, heading or anchor that is CITED FROM ANYWHERE OUTSIDE `process/development-protocols/` (the whole repo except the task folder: `.claude/**`, `.codex/**`, `.claude/hooks/**`, `docs/**`, `process/_seeds/**`, README.md, CONTRIBUTING.md, `.github/**`, `install.sh`, `compute-sync-plan.mjs`, `e2e-kit-flows.test.mjs`) unless a stub/redirect heading is left in place OR, for citations from `.claude/skills/**`, you `SendMessage` `p5-skills-tune` first and log the message in the phase report; `pointer-check.mjs` enforces this mechanically. Do NOT edit `.claude/skills/**`, `.claude/agents/**` or `.claude/hooks/**` from this phase. BOTH charter-template mirror copies are frozen (not edited, not deleted) in Phases 4 and 5.
- [ ] C2. Remove `orchestration.md:203` leftover; keep `09-execute.md:214` (justified); fix the router `archive/` pointer (0.2); finalise `$T/dedup-allowlist.txt` and `.why.txt` (50 hits minus removals).

### Step D - Validate (and team join)

- [ ] D1. Per-teammate check on EACH branch diff (never on shared `main`): `git diff --name-only $(cat $T/p4-tools/baseline.sha)..p4-docs-dedup | node.exe $T/p4-tools/claim-check.mjs $T/p4-tools/claim.globs` prints nothing; the same for `p5-skills-tune` with `$T/p5-tools/claim.globs`; write each name list to a file and assert `comm -12` of the two sorted lists is empty. Rollback unit = the branch: after the merge, rehearse `git revert -m 1 --no-commit <p4-merge-commit>`, assert the changed set is inside the Phase 4 claim, then `git revert --abort` (same for Phase 5).
- [ ] D2. JOIN STEP (one join serves Phases 4 and 5; executed once, after BOTH teammates report quiesced). The ORCHESTRATOR ONLY SEQUENCES; it runs no gate command and edits no file itself: (1) spawn `vc-execute-agent` (opus) to merge `p4-docs-dedup` and `p5-skills-tune` into `main` (`git merge --no-ff`, disjoint paths) and run `node.exe .claude/skills/vc-audit-context/scripts/generate-skills-catalog.mjs --write`; (2) spawn `vc-tester` (sonnet) to run `... --check`, the `cmp` of the charter-template mirror pair, and the joint validator suite below. Validators that read Phase 5 files (guide-sync, skill-routing, invocation-wiring) run only here, not mid-edit. Any `SendMessage` "I need to touch X" is logged in the phase report.

---

## Exit Gate

Run at the join, from the repo root, on merged `main`.

```bash
T=process/general-plans/active/vibebelt-rebrand_29-10-26
node.exe .claude/skills/vc-audit-vc/scripts/validate-protocol-wiring.mjs   # Expected: exit 0, not worse than Phase 0 baseline
node.exe .claude/skills/vc-audit-vc/scripts/validate-guide-sync.mjs        # Expected: exit 0 (run at the join)
node.exe .claude/skills/vc-audit-vc/scripts/validate-agent-parity.mjs      # Expected: exit 0, warnings not above baseline (strict is red at baseline)
node.exe .claude/skills/vc-audit-context/scripts/validate-protocol-discovery.mjs   # Expected: exit 0 (frontmatter on every protocol file)
node.exe .claude/skills/vc-audit-context/scripts/validate-context-discovery.mjs    # Expected: not worse than Phase 0 baseline
node.exe .claude/skills/vc-audit-context/scripts/validate-skill-routing.mjs        # Expected: exit 0 (read-only here, at join)
node.exe .claude/skills/vc-audit-vc/scripts/validate-skill-invocation-wiring.mjs   # Expected: exit 0
node.exe $T/p4-tools/pointer-check.mjs                                    # Expected: exit 0; no failure outside pointer-baseline.json; archive pointer fixed; repo-wide scope
node.exe $T/p4-tools/signal-census.mjs --check                            # Expected: exit 0; before == after over CLAUDE.md+AGENTS.md+protocols incl. skill-name and agent-name census (registry-exempt names resolved via the catalog)
node.exe $T/p4-tools/overlap-check.mjs                                    # Expected: exit 0; both overlap metrics <= 50 percent of baseline
grep -ci "bootstrap guard" CLAUDE.md && grep -ci "bootstrap guard" AGENTS.md   # Expected: exit 0, count >= 1 for each file (case-insensitive; AGENTS.md has 0 case-sensitive matches today)
test "$(grep -c '@process' AGENTS.md)" = 0                               # Expected: exit 0 (no Claude @ imports in AGENTS.md)
LC_ALL=C grep -rniE "superseded|compatibility note|legacy" process/development-protocols CLAUDE.md AGENTS.md | sed -E 's/:[0-9]+:/:/' | LC_ALL=C sort > $T/p4-tools/leftovers-now.txt
LC_ALL=C sort $T/dedup-allowlist.txt > $T/p4-tools/allow-sorted.txt
diff $T/p4-tools/leftovers-now.txt $T/p4-tools/allow-sorted.txt            # Expected: empty (line-anchored, sorted, file-to-file; replaces "superseded == 0")
cut -f1 $T/dedup-allowlist.why.txt | LC_ALL=C sort > $T/p4-tools/why-keys.txt
diff $T/p4-tools/why-keys.txt $T/p4-tools/allow-sorted.txt                 # Expected: empty (every allowlisted hit has a justification)
git diff --name-only $(cat $T/p4-tools/baseline.sha)..p4-docs-dedup | node.exe $T/p4-tools/claim-check.mjs $T/p4-tools/claim.globs   # Expected: no output
cmp process/development-protocols/references/program-goal-charter-template.md .claude/skills/vc-generate-phase-program/references/program-goal-charter-template.md   # Expected: exit 0 (mirror pair identical and still equal to mirror.sha256)
git diff --check                                                           # Expected: no output
```

(Use `node` where `node.exe` is unnecessary. Validators red at baseline (validate-context-discovery, validate-protocol-discovery without git) are compared to the Phase 0 baseline.)

- Cold-read probe (0.5): baselined first on the unmodified files; after edits 10 of 10 rules (CLAUDE.md entry) and every applicable rule (AGENTS.md-only entry from the temp copy) resolve to a single source. Probe call count reported before running and again in the phase report. If the baseline was already single-source (0.5b) or no ack was given, the row stays CONDITIONAL and `overlap-check.mjs` carries the duplication claim.
- Phase report lists every SendMessage exchange with `p5-skills-tune`, the per-branch claim-check outputs, and the revert rehearsal results.

---

## Blockers That Would Justify BLOCKED Status

- Registry shows a Phase 5 claim overlapping a Phase 4 file (resolve before editing; add `## Potential Blast Radius Conflicts`).
- A pointer would make a rule unreachable by Codex (keep the text inline there).

---

## Phase Completion Rules

- CODE DONE = checklist items done; VERIFIED = Exit Gate commands pass AND full validator suite is not worse than the Phase 0 baseline AND regression checkpoint passes AND validate-contract exists.
- Known-Gap alone never makes a behavior PASS; write a backlog stub and keep that gate CONDITIONAL.

## Acceptance Criteria

- See the Exit Gate commands and the Verification Evidence table; each row names the charter criterion it proves (proven by + strategy).

## Touchpoints

- CLAUDE.md, AGENTS.md, protocol docs

---

## Public Contracts

- Rules' meaning unchanged; every signal string, mode marker, status code verbatim.

---

## Verification Evidence

| Gate / Scenario | Strategy | Proves SPEC criterion |
|---|---|---|
| protocol-wiring + guide-sync + agent-parity + protocol-discovery + context-discovery + skill-routing + invocation-wiring, baseline-compared, run at the join by a spawned vc-tester | Fully-Automated | C-P4: single source, nothing broken |
| Line-anchored, sorted allowlist file diff + justification sidecar diff (not `superseded == 0`) | Fully-Automated (grep diff in bash) | C-P4: no unjustified leftovers |
| `pointer-check.mjs` repo-wide (all files except the task folder) vs `pointer-baseline.json` incl. archive pointer fix | Fully-Automated | C-P4: every pointer still resolves |
| `signal-census.mjs --check` union before == after incl. skill-name and agent-name census; `grep -ci "bootstrap guard"` per file chained with `&&` | Fully-Automated | C-P4: nothing normative lost |
| `overlap-check.mjs`: CLAUDE.md vs AGENTS.md normalized-line and 8-token-shingle overlap <= 50 percent of baseline (incl. Skill Registry rows) | Fully-Automated | C-P4: duplication actually dropped |
| Per-teammate worktree/branch `git diff --name-only` through `claim-check.mjs <claim.globs>`, empty intersection; revert rehearsal of each merge | Fully-Automated | C-P4: own claim only, rollback unit exists |
| AGENTS.md pointers are plain paths: `test "$(grep -c '@process' AGENTS.md)" = 0` plus pointer-check on AGENTS.md | Fully-Automated | C-P4: Codex can reach moved rules |
| Charter-template mirror pair: `cmp` at the join and sha256 equal to `mirror.sha256` | Fully-Automated | C-P4: mirror untouched |
| Cold read: fresh sonnet agent per entry, 10 rules (CLAUDE.md) / applicable subset (AGENTS.md from a temp copy without CLAUDE.md), baselined first, 4 counted calls | Agent-Probe (CONDITIONAL if baseline already single-source or no cost ack) | C-P4: de-duplicated |

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

- Selected plan file path: `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-04-doc-dedup_PLAN_29-10-26.md`
- Last completed step: not started
- Validate-contract status: written 29-10-26 (PASS, outer-pvl, PVL cycle 3 re-run: 0 FAIL, 0 MUST-FIX, 8 RESIDUAL as 3 Known Gaps + 5 execute-agent instructions); next: the Phase 4 inner loop starts at step 1 RESEARCH after the Phase 3 exit gate; inner PVL re-validates only if an Inner Loop Refresh Note newer than this contract is written
- Supporting context files: umbrella plan, `phase-blast-radius-registry.md`, prior phase report (if any)
- Next step: Spawn vc-research-agent (sonnet) for step 1 RESEARCH of this phase (after Phase 3 exit gate is green)

---

## Validate Contract

Status: PASS
Date: 29-10-26
date: 2026-10-29
generated-by: outer-pvl
supersedes: 2026-10-29 (outer-pvl, PVL cycle 2 CONDITIONAL) — PVL cycle 3 re-ran V1-V7 against the real repo and has current evidence

Parallel strategy: vc-team
Rationale: Plan mandates an agent team with Phase 5 (`p4-docs-dedup` and `p5-skills-tune`: TeamCreate + TaskCreate + SendMessage + TaskList; NOT parallel subagents); sequential 4-then-5 is the valid fallback. Score 3/7; dominant signal: shared-file risk with concurrent overlap. Sonnet for research/plan/validate, opus only for the editing leg. This pass ran Layer 1 (4) and Layer 2 (Step 0, A, B, C, D) inline in one session (no spawn tool); evidence = real-repo reads, `node.exe` validator runs, grep counts, `cmp`, throw-away scripts in the session scratchpad (overlap measure, leftover grep, validator source reads). V1: existing contract was CONDITIONAL (not PASS) and no `## Inner Loop Refresh Note` exists, so no auto-proceed; V1-V7 re-ran in full. `validate-plan-artifact.mjs` on this plan: exit 0, 2 advisory warnings.

Cycle-2 gap closure check (7 gaps), verified against the real repo:
- CLOSED (S1): Bootstrap check is `grep -ci` per file chained with `&&`; it exits 0 today (CLAUDE.md 1, AGENTS.md 1). AGENTS.md really lacks the `find process/context/ -type f` and `find process/development-protocols/ -type f` text, `PHASE_COMPLETE`, `ENTER VALIDATE MODE`, `Model Selection` (grep counts 0); A1 classifies each of the 10 rules both / Claude-only / Codex-only and adds plain-path pointers.
- CLOSED (S2): `overlap-check.mjs` is satisfiable and meaningful. Measured here with the planned normalisation: CLAUDE.md 256 normalized lines vs AGENTS.md 405, 29 shared (11.3 percent of the smaller); 8-token shingles 4039 vs 5041, 445 shared (11.0 percent). The floor (<= 50 percent of baseline) needs about 15 of the 29 shared lines and 223 shingles removed from one file, which pointer replacement of the duplicated Key-Principles, Resources, Reference-docs and skill-bullet lines achieves. Cold-read is baselined first, the AGENTS.md entry runs from a temp copy without CLAUDE.md, the probe count is reported at 0.5a before any call.
- CLOSED (S3): pointer-check scope is the whole repo except the task folder; verified missing protocol paths today (archive monolith, `intent-clarification.md`, `note.md`, `parallel-fan-out.md`, two `references/example-*-prd.md`) are cited only from CHANGELOG, MIGRATION, `vc-manifest.json` and a validator, so the baseline absorbs them; none sit in the five SKILL.md files Phase 5 may split. Hook file `context-builder.cjs` really maps `implementation-standards.md` and `orchestration.md` by file name (lines 34-35, 767).
- CLOSED (S4): the leftover grep returns exactly 50 hits today, no tabs, no duplicate lines; sorted file-to-file diff mechanics verified (`LC_ALL=C grep -rniE ... | sed -E 's/:[0-9]+:/:/' | LC_ALL=C sort`); `orchestration.md:203` is the "Superseded by Section 6 canonical format" leftover.
- CLOSED (S5): one worktree + branch per teammate, branch diff through claim-check, merge revert rehearsal, sequential fallback. Ordering details: E1, E2.
- CLOSED (S6): the Skill Registry in AGENTS.md (heading "Skill Registry:" at line 432, 30 table rows) is replaced by a plain-path pointer. Precedent: CLAUDE.md already replaced its own table by `discover-skills.mjs`; the generated catalog carries `triggerKeywords` for all 33 skills (verified), so no information is lost. Both charter-template copies are byte-identical today (`cmp` exit 0).
- CLOSED (S7): the orchestrator only sequences the join; spawned vc-execute-agent merges and runs `--write`; spawned vc-tester runs `--check`, the `cmp` and the suite.

New real-repo evidence this cycle:
- Disjointness re-verified: Phase 4 claim (CLAUDE.md, AGENTS.md, `process/development-protocols/**`, task-folder tools) vs Phase 5 claim (`.claude/skills/*/SKILL.md` + `references/**`, catalog, task-folder tools) share no path; the charter-template pair is excluded from both. No validator reads CLAUDE.md/AGENTS.md CONTENT (only name lists in `validate-context-discovery` and `validate-kit-portability`); the catalog `routedFrom` is a substring match over AGENTS.md, CLAUDE.md and the catalog itself (`skill-routing-policy.json`), so it stays non-empty after the registry table is removed.
- Semantic coupling points all covered: AGENTS.md Skill Registry (A1 pointer), catalog `routedFrom` (join `--write` then `--check`), charter-template pair (`cmp`), 32 SKILL.md citations of protocols (HARD RULE + pointer-check at the join). `validate-skill-keywords.mjs` is not in Phase 4's mid-phase set (it runs catalog `--check` internally).
- `validate-protocol-wiring` under node.exe prints "references ... which does not exist on disk" warnings for files that do exist (backslash path artifact); exit code 0; compare to the Phase 0 baseline by exit code, not warning text.

Plan updates applied: none in this pass except the handoff status line. No MUST-FIX found.

Test gates (C3 5-column table):

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P4 | Wiring, guide-sync, parity, protocol-discovery, context-discovery, skill-routing, invocation-wiring not worse than Phase 0 baseline | Fully-Automated | the seven validators at the JOIN by a spawned vc-tester (validate-protocol-wiring, guide-sync, agent-parity, skill-routing, invocation-wiring exit 0 today) | A (commands) + B (join ordering) |
| C-P4 | No unjustified leftovers | Fully-Automated | `LC_ALL=C grep -rniE "superseded\|compatibility note\|legacy" ... \| sed ... \| LC_ALL=C sort` vs sorted `dedup-allowlist.txt` (file-to-file `diff`), plus sidecar key diff | A (50 hits verified) + B (allowlist files) |
| C-P4 | Every file/anchor pointer still resolves across the WHOLE repo | Fully-Automated | `node.exe $T/p4-tools/pointer-check.mjs` vs `pointer-baseline.json`, no new failures; archive pointer fixed | B |
| C-P4 | Nothing normative lost (signals, mode markers, status codes, Bootstrap guard, `@process` imports, find-gate text, skill and agent names) | Fully-Automated | `node.exe $T/p4-tools/signal-census.mjs --check` (union before == after; registry-only names resolved through the catalog); `grep -ci "bootstrap guard" CLAUDE.md && grep -ci "bootstrap guard" AGENTS.md` | A (bootstrap chain exits 0 today) + B |
| C-P4 | Duplication actually dropped | Fully-Automated | `node.exe $T/p4-tools/overlap-check.mjs`: normalized-line and 8-token-shingle overlap <= 50 percent of baseline (baseline about 11 percent each) | B |
| C-P4 | Each teammate touched only its claim; rollback unit exists | Fully-Automated | branch diff through `claim-check.mjs <claim.globs>`, empty `comm -12` between branch lists, merge revert rehearsal | B |
| C-P4 | AGENTS.md pointers are plain repo paths, resolvable by Codex | Fully-Automated | `test "$(grep -c '@process' AGENTS.md)" = 0` (0 today) plus pointer-check on AGENTS.md | A + B |
| C-P4 | A fresh agent finds each applicable rule in exactly one source | Agent-Probe | cold-read per `$T/p4-tools/cold-read.md`, baselined first, AGENTS.md entry from a copy without CLAUDE.md, 4 counted calls reported before running | B (CONDITIONAL only if baseline already single-source or no cost ack; then `overlap-check.mjs` carries the claim) |
| C-P4 | Charter-template mirror pair identical after both phases | Fully-Automated | `cmp` of the two copies at the join (identical today) and sha256 equal to `mirror.sha256` | A + B |

Failing stubs (Fully-Automated rows, red-first for execute-agent):
- test("should keep wiring, sync and parity validators not worse than baseline at the join", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep wiring, sync and parity validators not worse than baseline at the join") })
- test("should leave only allowlisted superseded hits in sorted order", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should leave only allowlisted superseded hits in sorted order") })
- test("should resolve every file and anchor pointer repo-wide", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should resolve every file and anchor pointer repo-wide") })
- test("should keep signal, Bootstrap guard and skill-name census identical", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep signal, Bootstrap guard and skill-name census identical") })
- test("should reduce CLAUDE.md and AGENTS.md overlap below the floor", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should reduce CLAUDE.md and AGENTS.md overlap below the floor") })
- test("should keep each teammate diff inside its claim globs", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep each teammate diff inside its claim globs") })
- test("should keep AGENTS.md pointers plain paths", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep AGENTS.md pointers plain paths") })
- test("should keep the charter-template mirror pair identical", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep the charter-template mirror pair identical") })

Legacy line form:
- validators: [Fully-automated: validate-protocol-wiring + validate-guide-sync + validate-agent-parity + validate-protocol-discovery + validate-context-discovery + validate-skill-routing + validate-skill-invocation-wiring, at the join, baseline-compared]
- leftovers: [Fully-automated: sorted grep allowlist diff in bash]
- pointers/census/overlap/disjointness: [Fully-automated: pointer-check + signal-census + overlap-check + claim-check]
- single source: [agent-probe: baselined cold read of the applicable rules]

Dimension findings:
- Infra fit: PASS — every gate command exists and runs (leftover grep 50 hits, bootstrap chain, `@process` count, `cmp`, validators via node.exe); tool paths use `$T` from the repo root; worktree/branch, `baseline.sha`, `claim.globs` and the sorted allowlist are defined.
- Test coverage: PASS — overlap-check, cold-read (baselined, uncontaminated, counted) and the census give mechanical and probed evidence; limits are Known Gaps KG1-KG3.
- Breaking changes: PASS — HARD RULE covers anything cited from outside `process/development-protocols/`; pointer-check is repo-wide; the registry replacement loses no data (catalog carries `triggerKeywords`).
- Security surface: PASS — documentation only; no tool grants or secrets; hard-stop wording protected by the census and cold-read.
- Step 0 (gates first) feasibility: PASS — see E1, E2 for commit ordering.
- Section A/B (map, pick sources) feasibility: PASS — rule applicability per entry file and the Skill Registry decision are made on paper.
- Section C (leftovers) feasibility: PASS — targets confirmed (`orchestration.md:203`, dangling archive pointer at `all-development-protocols.md:38`, `09-execute.md:214` legitimate).
- Section D (validate and join) feasibility: PASS — join sequenced by the orchestrator, executed by spawned agents; see E3.

Disjointness verdict (Phase 4 vs Phase 5): file-level claims DISJOINT (re-verified against the registry and both `claim.globs` descriptions); runtime coupling limited to the join and covered.

Net gate derivation: 0 FAIL / 0 MUST-FIX / 8 RESIDUAL (3 named Known Gaps, 5 execute-agent instructions). RESIDUALs are bounded measurement limits or execution-order notes; none leaves a developed behavior covered by Known-Gap alone (every behavior has a Fully-Automated gate or a probe), so the vacuous-green ban does not apply. Net gate: PASS.

Known Gaps (named residuals, excluded from the CONCERN/FAIL count; bounded measurement limits, no new plan required, recorded in the phase report):
- KG1 `overlap-check.mjs` measures verbatim normalized-line and shingle overlap only (baseline about 11 percent); rewording can lower it without real de-duplication. Semantic de-duplication rests on the A1 block list and the cold-read.
- KG2 The cold-read is an Agent-Probe that stays CONDITIONAL if the baseline is already single-source (0.5b) or no cost acknowledgement is given.
- KG3 No gate proves Codex runtime behavior with the new AGENTS.md pointers; AGENTS.md was never executed under Codex here.

Execute-agent instructions (RESIDUAL, no plan edit needed):
- E1 Step 0.7 order: the baseline outputs written after `baseline.sha` (`pointer-baseline.json`, `census-before.txt`, `overlap-baseline.json`, `leftovers-before.txt`, `mirror.sha256`, later `registry-exempt.txt`) do not exist in a worktree created from `baseline.sha`. Commit them in a second path-limited `process:` commit and create the teammate worktree from that HEAD (keep `baseline.sha` = the tools commit), or copy them into the worktree untracked; never leave the same path untracked on `main` while the branch also adds it (the join merge would abort).
- E2 The step-0 tools commits of the two teammates share the `main` working tree: use path-limited commits (`git commit -- <paths>`) and serialize them (`SendMessage` "tools committed") to avoid `index.lock` races and cross-staging.
- E3 The joint suite at the join is the UNION of the Phase 4 and Phase 5 Exit Gate lists (including `validate-skills`, `validate-skill-keywords` after `--write`, confusable, cross-refs, `routing-check`, `conservation-check`), run once by the spawned vc-tester after the catalog `--write`.
- E4 Record the script's own overlap baseline in A1 (the figures in this contract are an approximation); do not add new identical pointer lines to BOTH files (they count as shared).
- E5 After the join and all Exit Gate commands, `git worktree remove` the two teammate worktrees (branches stay until the gate has run); in the sequential fallback the join is just the catalog `--write` then `--check` on `main`.

Open gaps: none (Known Gaps KG1-KG3 above are bounded residuals).
What this coverage does NOT prove (What This Coverage Does NOT Prove):
- Validators and pointer scripts prove references resolve, not that a reader (Claude or Codex) finds and applies the rule from its new location; the cold read samples only 10 rules.
- No gate proves Codex behavior; AGENTS.md was never executed under Codex here.
- Disjointness proof is post-hoc (diff vs claim) and does not prove no race on shared reads mid-run.
- The overlap metric proves verbatim text overlap fell, not that meaning is preserved or that paraphrased duplicates are gone.
- Node validators ran through node.exe on NTFS; Linux/macOS behavior is unproven.

Gate: PASS (0 FAIL / 0 MUST-FIX; 8 RESIDUAL carried as 3 Known Gaps + 5 execute-agent instructions; PVL cycle 3)
Accepted by: n/a — Gate is PASS; Known Gaps KG1-KG3 are listed residuals, not accepted CONCERNs.

---

## Supplement cycle 1 (PVL-supplement, 29-10-26)

Addressed G1-G7: pointer-check.mjs and signal-census.mjs (0.2, 0.3); C1 inbound-reference rule rewritten (no rename/delete of cited files/headings without stub or SendMessage to p5-skills-tune; no edits to skills/agents); line-anchored allowlist replaces `superseded == 0` (0.4); 10-rule cold-read probe defined (0.5) and semantic block list (A1); archive pointer fix (0.2, C2) and charter-template skill copy kept (C1); join step by orchestrator (catalog --write, --check, joint validators) and per-teammate diff-vs-claim (0.6, D1, D2); protocol-discovery, context-discovery, skill-routing, invocation-wiring and CLAUDE.md/AGENTS.md-reading validators added to gate; tier re-confirm (0.1). Registry change needed: Phase 4 claim to list `p4-tools/` and `dedup-allowlist.txt` in the task folder, and state that `.claude/agents/**` and `.codex/**` are read-only for Phase 4. Validate-contract above retained unchanged.

---

## PVL cycle 2 supplement request (29-10-26)

Issued by vc-validate-agent (outer-pvl re-run from V1). Gate was CONDITIONAL with 0 FAIL; the orchestrator spawns vc-plan-agent (PVL-supplement mode) with this block, then re-spawns vc-validate-agent from V1.

SUPPLEMENT REQUEST:
- Gap 1: Section implementation-checklist + exit-gate (items A1, 0.5) | Concern: `grep -c "Bootstrap Guard" CLAUDE.md AGENTS.md` is CLAUDE.md:1, AGENTS.md:0 today (AGENTS.md says "Bootstrap guard"), so the gate is red at baseline; AGENTS.md also lacks the `find process/context/ -type f` gate text, `PHASE_COMPLETE` and `ENTER VALIDATE MODE`, so cold-read "10 of 10 from both entries" is unreachable without adding content to AGENTS.md | Severity: CONCERN | Suggested addition: use `grep -ci` per file chained with `&&`; in A1 mark each of the 10 rules both / Claude-only / Codex-only and require 10 for CLAUDE.md and the applicable subset for AGENTS.md; if Codex needs a rule it lacks, add it as an explicit plain-path pointer item.
- Gap 2: Section implementation-checklist + verification-evidence (items 0.5) | Concern: no mechanical proof that duplication DROPPED (census proves nothing lost; cold-read is the only "single source" evidence); the probe is never run on the unmodified files so it could be vacuously green; a Claude subagent auto-loads CLAUDE.md, contaminating the AGENTS.md-only entry; probe calls are billed runs beyond the golden set and are not counted | Severity: CONCERN | Suggested addition: `$T/overlap-check.mjs` (normalized-line and 8-token-shingle overlap CLAUDE.md vs AGENTS.md, including Skill Registry rows) with a named reduction floor; run cold-read on the baseline first (expect at least one rule with 2 sources); run the AGENTS.md entry from a temp copy without CLAUDE.md; report the probe call count to the user before running.
- Gap 3: Section implementation-checklist (items 0.2; C1) | Concern: pointer-check and the no-rename/delete rule cover only CLAUDE.md, AGENTS.md, protocols, `.claude/agents`, `.codex`, `.claude/skills`; real inbound references also live in `.claude/hooks/lib/context-builder.cjs` (looks up `implementation-standards.md`, `orchestration.md` by name at runtime), `docs/**` (14 files), `process/_seeds/**`, README.md, CONTRIBUTING.md, `.github/labeler.yml`, `install.sh`, `compute-sync-plan.mjs`, `e2e-kit-flows.test.mjs`; anchor forms parsed and the baseline file are undefined | Severity: CONCERN | Suggested addition: scan ALL repo files except the task folder; extend the rule to "cited from anywhere outside `process/development-protocols/`"; name the parsed anchor forms (`§Name`, `#### Name`, `Section N`) and `$T/pointer-baseline.json`; add the hook file names to the check.
- Gap 4: Section implementation-checklist + exit-gate (items script interfaces) | Concern: `p4-tools/…` and `dedup-allowlist.txt` are task-folder-relative but mixed with repo-root commands; `<p4-baseline>` and `<phase-4-claim>` are placeholders no step defines and the registry claim is prose; `diff <(grep -r …) dedup-allowlist.txt` depends on `grep -r` directory order (NTFS vs ext4) and on bash; the hit list is 50 lines (not 3), incl. `SUPERSEDED` enum lines orchestration.md:644 and 11-phase-programs.md:95,98; per-hit justifications cannot live inside a file that is diffed | Severity: CONCERN | Suggested addition: `T=process/general-plans/active/vibebelt-rebrand_29-10-26`, call `node.exe $T/p4-tools/…` from repo root; step 0.7 `git rev-parse HEAD > $T/p4-tools/baseline.sha`; machine-readable `$T/p4-tools/claim.globs`; `LC_ALL=C sort` both sides in bash; justifications in sidecar `dedup-allowlist.why.txt`.
- Gap 5: Section implementation-checklist (items D1) | Concern: nothing says how the two teammates share git: both commit to `main` in one tree, so `git diff --name-only <p4-baseline>..HEAD` contains Phase 5's files (claim-check fails) and parallel `git add/commit` races on `index.lock`; no rollback unit is defined for either teammate | Severity: CONCERN | Suggested addition: one `git worktree` + branch per teammate merged at the join (or path-limited commits with a `Teammate: p4` trailer and `git log --grep`); claim-check runs on each branch diff; revert rehearsal of a teammate merge; fallback sequential 4 then 5 stays valid.
- Gap 6: Section implementation-checklist (items A1) | Concern: AGENTS.md "Skill Registry" (30 rows with a Trigger Keywords column, 3 skills missing) duplicates SKILL.md `trigger_keywords` that Phase 5 edits; `validate-skill-routing` cannot catch a dropped skill name because the catalog lists every skill; the charter-template mirror pair is byte-identical today but no plan checks equality at the join | Severity: CONCERN | Suggested addition: decide in A1 to replace the table with a plain-path pointer to `process/context/generated-skills-catalog.json` or `discover-skills.mjs`; add a skill-name and agent-name census to signal-census; freeze both mirror copies in Phases 4/5 and add `cmp` of the pair to the join.
- Gap 7: Section implementation-checklist (items D2) | Concern: the join is "run by the ORCHESTRATOR"; `catalog --write` edits a generated source file and the joint suite is gate running, both inline in the orchestrator shell, which CLAUDE.md and orchestration.md forbid | Severity: CONCERN | Suggested addition: the orchestrator only sequences; spawn vc-execute-agent for `--write` and vc-tester for `--check` plus the joint suite; fix the same wording in Phase 5 C2 and umbrella decision (f).

---

## Supplement cycle 2 (PVL-supplement, 29-10-26)

Addressed all 7 gaps of the cycle-2 request. G1: Bootstrap check is `grep -ci` per file chained with `&&`; A1 classifies each of the 10 cold-read rules as both / Claude-only / Codex-only (CLAUDE.md = 10, AGENTS.md = applicable subset) and adds plain-path pointer items for rules AGENTS.md lacks. G2: `overlap-check.mjs` (normalized-line plus 8-token-shingle overlap incl. Skill Registry rows, floor <= 50 percent of baseline), cold-read baselined first, AGENTS.md-only entry from a temp copy without CLAUDE.md, probe call count reported in cost gate 0.5a. G3: pointer-check scans all repo files except the task folder (hooks, docs, _seeds, README, CONTRIBUTING, .github, install.sh, compute-sync-plan.mjs, e2e test), no-rename/delete rule = anything cited from outside `process/development-protocols/`, anchor forms `§Name` / `#### Name` / `Section N` named, `pointer-baseline.json` defined. G4: `T` variable, `node.exe $T/p4-tools/...` from repo root, `baseline.sha` and `claim.globs` defined (0.6, 0.7), sorted file-to-file allowlist diff (50 hits incl. SUPERSEDED enum lines) with justification sidecar `dedup-allowlist.why.txt`. G5: one git worktree + branch per teammate merged at the join, claim-check on each branch diff, merge revert rehearsal, sequential fallback kept. G6: AGENTS.md Skill Registry replaced by a plain-path pointer to the generated catalog / `discover-skills.mjs`, skill-name and agent-name census added, both charter-template mirror copies frozen and `cmp`-checked at the join. G7: the orchestrator only sequences the join; spawned vc-execute-agent runs the merge and catalog `--write`, spawned vc-tester runs `--check`, the `cmp` and the joint suite.

Registry/umbrella changes needed (orchestrator): Phase 4 claim gains `process/general-plans/active/vibebelt-rebrand_29-10-26/p4-tools/**`, `dedup-allowlist*.txt` and the phase report, with `process/development-protocols/references/program-goal-charter-template.md` explicitly frozen/excluded; record teammate branches `p4-docs-dedup` / `p5-skills-tune`; umbrella Locked Decision (f) wording: "the orchestrator sequences the join; a spawned vc-execute-agent runs the catalog `--write`, a spawned vc-tester runs `--check` and the joint suite" (same fix needed in Phase 5 C2).
