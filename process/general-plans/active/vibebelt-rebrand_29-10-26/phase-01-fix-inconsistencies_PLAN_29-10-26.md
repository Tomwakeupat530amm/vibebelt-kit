---
name: plan:vibebelt-rebrand-phase-01-fix-inconsistencies
description: "vibebelt-kit rebrand — Phase 01: Fix inconsistencies"
date: 29-10-26
metadata:
  node_type: memory
  type: plan
  feature: general-plans
  phase: phase-01
---

# Phase 01 — Fix inconsistencies

**Program:** vibebelt-rebrand
**Umbrella plan:** process/general-plans/active/vibebelt-rebrand_29-10-26/vibebelt-rebrand-umbrella_PLAN_29-10-26.md
**Phase status:** ⏳ PLANNED
**Complexity:** COMPLEX
**Report destination:** process/general-plans/active/vibebelt-rebrand_29-10-26/phase-01-fix-inconsistencies_REPORT_29-10-26.md (flat in the program task folder)

---

## Overview

One phase of the vibebelt-rebrand program; program context lives in the umbrella plan. Context router: process/context/all-context.md (created in Phase 0). Test routing: process/context/tests/all-tests.md (load before assigning tiers).

Date: 29-10-26
Status: PLANNED
Complexity: COMPLEX

## Purpose

Remove the contradictions the kit has today so later phases build on a consistent base. The documents (CLAUDE.md, the strategy-compare skill, the protocols, the README in 10 languages) say only the code-writing agents use `opus` and every other agent `sonnet`; the agent files themselves set `opus` on 7 agents (execute, fast-mode, quick-fix, plan, research, tester, validate) and `sonnet` on 8 (code-reviewer, code-simplifier, debugger, git-manager, innovate, spec, ui-ux-designer, update-process). **USER DECISION B (2026-10-29, LOCKED): keep opus as it is on disk and correct the DOCUMENTATION to match reality. No agent's `model:` line changes in this phase.** The only agent edit left is `effort:` on execute, fast-mode and quick-fix (`low` -> `max`, exactly as `implementation-standards.md` says and as the user already accepted); no effort is lowered anywhere; every other agent keeps its `effort:`. Also: README says both 36 and 37 validators, and CI skips some validators. Add a NEW validator that enforces the real policy table (documented rows only) so drift cannot come back.

(A measurement of sonnet versus opus on the golden tasks, and only then a possible cost-saving model change, is a deferred optional follow-up outside this program; see the umbrella.)

---

## Entry Gate

- Phase 0 exit gate green (git, baseline, `all-context.md`, `tests/all-tests.md`).
- Phase 0 step C resolved `.agents/skills` OR the two environment reds (validate-skills, validate-context-discovery) are recorded in `baseline/validators_before.txt` as environment-caused. "Red validator" in this phase means "worse than the Phase 0 baseline", judged mechanically by `bash process/general-plans/active/vibebelt-rebrand_29-10-26/baseline/compare.sh` (exit 0 = not worse).
- Path variables used below: `P=process/general-plans/active/vibebelt-rebrand_29-10-26`, `B=$P/baseline`, `EX=":!$P"`. Before any edit save the start commit to a FILE (a spawned tester shell has no shell variables): `git rev-parse HEAD > $B/p1_start.txt`, and copy the value into the phase report. The diff gates read it back with `P1_START=$(cat $B/p1_start.txt)`. **Commit order (inner-3 supplement, 2026-10-29):** the task folder carries other uncommitted plan edits; the orchestrator commits them as a SEPARATE `process:` commit BEFORE Phase 1 EXECUTE, so `P1_START` = that commit (record it; never take `HEAD` from a dirty task folder).
- Runtime (updated 2026-10-29): Linux `node` v22.23.4 now exists in this WSL; use `node`. `node.exe` also works; every command below that says `node.exe` may use `node`. Record which runtime ran in the phase report; the Phase 0 baseline files exist for both runtimes (`baseline/*.node.*` and `baseline/*.node-exe.*`).

---

## Strategy Recommendation (vc-agent-strategy-compare)

- Signals: S7 yes (3 agent files edited, 15 read + README + 9 i18n + CI + new validator + about 9 doc files with model claims) — score about 2/7 (MEDIUM).
- Recommended: **Parallel subagents**, 3 groups with disjoint files, ONE ordering rule: (a) the 3 execution-agent `effort:` lines + new validator + fixtures + `vc-audit-vc/SKILL.md` line; (b) README + 9 i18n (validator count D1 AND model-fact correction D2, in ONE pass per file, each file edited by grep-located anchors, never by one shared find-and-replace) + CI workflows `validate.yml` AND `release.yml` (Step E, same 21-row command table); (c) model-fact corrections in the non-README docs (Step F). Group (b) steps D1 and E start only AFTER group (a) step B2 (validator script exists on disk and fixtures pass) because the README count (N) and the CI list depend on the new validator; group (b) may prepare nothing earlier than B2 (D2 text itself needs only the A1 table). Group (c) needs only the A1 table and may start at once. Alternative: one sequential implementing pass A, B, C, D, E, F (same result, simpler). Models: named agents run on the model in their own front-matter (plan, research, validate, tester = opus; innovate, update-process = sonnet; this phase changes none of them); the implementing subagents are opus; any ad-hoc helper defaults to sonnet. Cost note: 4 + 4 + 3 = 11 agents, under the 30-agent guard.

---

## Blast Radius

- `.claude/agents/vc-execute-agent.md`, `vc-fast-mode-agent.md`, `vc-quick-fix-agent.md` (the `effort:` line ONLY, `low` -> `max`). NO `model:` line in any agent file changes (Decision B). The other 12 agent files are read-only. `.codex/` is OUT of this phase: `.codex/agents/*.toml` have no model/effort fields and the Codex model is global in `.codex/config.toml` (stays unchanged).
- `.claude/skills/vc-audit-vc/scripts/validate-model-effort-policy.mjs` (NEW) + `fixtures/model-effort-pass/.claude/agents/*.md` and `fixtures/model-effort-fail/.claude/agents/*.md`
- `.claude/skills/vc-audit-vc/SKILL.md` (one line registering the new validator)
- `README.md`, `docs/i18n/README.*.md` (9 copies) — (1) validator count (4 sites per file, 40 total) and (2) the model-fact claim sites listed in Step D2 (this phase corrects the FACT only; Phase 7 rewrites the wording)
- `.github/workflows/validate.yml` AND `.github/workflows/release.yml` (inner-3 decision: release.yml duplicates the validator list today, 18 script names identical to validate.yml, and would stay behind at the v1.0.0 tag; Phase 1 adds the same validator steps, keeps its `on: push: tags: ['v*']` trigger and the `Create GitHub Release` step untouched). Ordering with Phase 2: Phase 1 runs FIRST; Phase 2 later changes one display-name line in release.yml (the release `--title`); the two edits are disjoint lines.
- Model-fact documentation fixes (Step F; line numbers verified by grep on 2026-10-29, re-grep before editing): `CLAUDE.md` (§Model Selection Policy, lines 128-141); `process/development-protocols/implementation-standards.md` (effort bullet, lines 74-76); `process/development-protocols/orchestration.md` (line 35); `process/development-protocols/vc-system-behavior/04-research.md:23`, `07-plan.md:29`, `08-validate.md:23` and `:25`; `.claude/skills/vc-agent-strategy-compare/SKILL.md` (§Model Selection Policy, lines 22-34, and the output template line 186); `process/context/all-context.md:179` (Phase 0 file, one paragraph). Verified NO change needed: `AGENTS.md` (no model/opus/sonnet text), `06-innovate.md:27` (innovate = sonnet, correct), `09-execute.md:23` (OPUS, correct), `autopilot.md:129` (an ad-hoc teammate example), `orchestration.md:575` and `CLAUDE.md:219` (quick-fix = opus, correct).
- `process/general-plans/active/vibebelt-rebrand_29-10-26/baseline/p1_start.txt` (NEW) and one appended line in `baseline/validators.list` (program evidence folder, not kit code)

---

## Implementation Checklist

### Step A — Decide the policy table (before editing)

- [ ] A1. Write this EXPLICIT table into the phase report. It is the REAL current assignment (re-read every agent's front-matter first; a mismatch with the table is a stop: ask the user). USER DECISION B: models stay as they are on disk; only the three effort values marked CHANGE move. Effort follows `implementation-standards.md` §Agent Frontmatter Conventions as written (`max` for the opus execution agents; LOCKED earlier).

  | Agent | model (enforced by the validator) | effort today | effort target / enforced? |
  |---|---|---|---|
  | vc-execute-agent | opus | low | CHANGE to `max`; enforced |
  | vc-fast-mode-agent | opus | low | CHANGE to `max`; enforced |
  | vc-quick-fix-agent | opus | low | CHANGE to `max`; enforced |
  | vc-plan-agent | opus | low | unchanged; not enforced |
  | vc-research-agent | opus | low | unchanged; not enforced |
  | vc-tester | opus | low | unchanged; not enforced |
  | vc-validate-agent | opus | high | unchanged; not enforced |
  | vc-git-manager | sonnet | low | unchanged; enforced (`low` is a documented row) |
  | vc-update-process-agent | sonnet | medium | unchanged; not enforced |
  | vc-innovate-agent, vc-spec-agent, vc-ui-ux-designer, vc-code-simplifier | sonnet | medium | unchanged; not enforced |
  | vc-debugger, vc-code-reviewer | sonnet | high | unchanged; not enforced |

  Counts: 7 opus (execute, fast-mode, quick-fix, plan, research, tester, validate) and 8 sonnet. The validator enforces ONLY: (1) each agent's `model:` equals the table (7 opus / 8 sonnet; the corrected policy text written in Step F is the documentation for these rows), (2) `effort: max` on the three execution agents, (3) `effort: low` on vc-git-manager. It enforces no other effort value (no document defines one). No effort is lowered by this phase. Before editing, re-read `implementation-standards.md` and confirm the `max` and `low` rows still match; a mismatch is a stop. The phase report MUST state the token-cost impact in plain words: execute, fast-mode and quick-fix move from effort low to max (more tokens per run, higher quality); nothing else changes in cost terms because no `model:` changes; list old and new value for all 15 agents.

### Step B — New validator (test first)

- [ ] B1. Write failing fixtures first: `fixtures/model-effort-pass/.claude/agents/*.md` (all 15 agents with correct values per the A1 table, 7 opus / 8 sonnet, execute-class `effort: max`) and `fixtures/model-effort-fail/.claude/agents/*.md` (drifted values: e.g. `vc-plan-agent` set to sonnet, `vc-innovate-agent` set to opus, `vc-execute-agent` effort `low`, `vc-git-manager` effort `high`). Save the red-first output (validator absent or exit non-zero on fail fixture) in the phase report.
- [ ] B2. Implement `validate-model-effort-policy.mjs`: reads `<root>/.claude/agents/*.md` front-matter, where `--root <dir>` is optional and defaults to the repo root (same convention as `validate-kit-portability.mjs`); compares with the A1 table (model for all 15 agents; effort only for the 4 enforced rows); exit 1 on drift; error text in plain words naming agent + field + expected value ("vc-plan-agent: model is sonnet, expected opus"). Additive only: never edit another validator's checks. Make the fail fixture exit 1 and the pass fixture exit 0.
- [ ] B3. Add one line for the new script to `.claude/skills/vc-audit-vc/SKILL.md` (audit validator list). Registry note: the SKILL.md file is added to Phase 1's registry claim; `orchestration.md` §Regression Gate Validators stays unchanged until Phase 4 (known-gap, backlog stub written at UPDATE PROCESS in `process/general-plans/backlog/model-effort-validator-registry_NOTE_29-10-26.md`; that gate stays CONDITIONAL).

- [ ] B4. Append one line `validate-model-effort-policy<TAB>node .claude/skills/vc-audit-vc/scripts/validate-model-effort-policy.mjs` to `baseline/validators.list` so later phases keep running it. The Phase 0 reference TSV has no row for it: `compare.sh` prints `NOTE new validator` and does not count it as worse; Phase 1 EVL records its first exit code (0).

### Step C — Fix agents (only the three `effort:` lines change; no `model:` line)

- [ ] C1. First run the new validator on the real agents and confirm exit 1 (red-first, save output; expected drift: exactly the 3 effort values of execute, fast-mode, quick-fix; no model drift). Then edit ONLY the `effort:` line of `.claude/agents/vc-execute-agent.md`, `vc-fast-mode-agent.md` and `vc-quick-fix-agent.md` (`low` -> `max`). `.codex/` is NOT touched (agents there have no such fields).
- [ ] C2. Run the diff gate (R1.7): no `model:` line changed anywhere, only the 3 named files changed, only `effort:` lines moved; any other changed line in any agent file means revert that file and stop. Then run agent-parity + agent-frontmatter + the new validator: all exit 0.

### Step D — README count (starts after B2)

- [ ] D1. Compute `N=$(find .claude -name 'validate-*.mjs' -not -path '*/fixtures/*' | wc -l)` AFTER B2 (expected 38; today 37). Do not hand-count. Update ALL 4 sites in each of the 10 files (README.md and `docs/i18n/README.*.md`, 40 sites) found by `grep -nE '(<h3>|\*\*|🛡️ )36\b' README.md docs/i18n/README.*.md`; write N in each. Line numbers differ per file (README.md 61/270/1009/1011; de/es/fr/pt-BR/vi-VN 61/268/1006/1008; hi/ja-JP/ko-KR/zh-CN differ again): use the grep, not line numbers. Prose elsewhere (for example "14 VC-system behavior validators") is out of scope.
- [ ] D2. Model-fact correction in the same pass over the same 10 files (README.md and `docs/i18n/README.*.md`). Phase 1 corrects the FACT only; Phase 7 rewrites the wording in plain language. Find the sites by grep, never by line number (line numbers differ per file; EN today: 57, 857-858, 866-867, 886-889, 1524-1528, 1683; de: 854-886, 1520-1528, 1679; zh-CN: 855-887, 1509-1517, 1668): (1) the feature cell `🧮 ...` (EN "Smart model use", `grep -n '🧮' file`); (2) the Mermaid model diagram and table (`grep -n 'OPUS\|SONNET' file`, then the 2-row table and the `>` note below it); (3) the "Core workflow agents" table rows `vc-research-agent`, `vc-plan-agent`, `vc-validate-agent`: model column `sonnet` -> `opus` (these rows only; spec, innovate, update-process stay sonnet); (4) the bullet that starts "It uses the premium AI model only where it matters" (translated in the other 9; locate with `grep -nE '60.70'`). Target English wording is in Step F ("Exact target wording"); the 9 translations carry the same facts in their language (numbers 7 and 8, the model names opus and sonnet stay untranslated). **Per-file rule (inner-3, verified by grep 2026-10-29):** the diagram, note, feature cell and bullet text is localized differently in the translations, so D2 is a per-file edit located by grep, NEVER one shared find-and-replace across files. Every one of the 10 files has exactly: 2 `🧮` lines (feature cell near line 57, heading `### 🧮 ...` near 879-882), 3 `OPUS`/`SONNET` pairs (`OPUS[`, `SONNET[`, and the two `MC -->|...| OPUS` / `| SONNET` edge lines plus the `style` lines), 1 `60.70` line, and 3 agent-table rows (`vc-research-agent`, `vc-plan-agent`, `vc-validate-agent`). Language differences to respect: ko-KR, pt-BR, vi-VN and zh-CN have LOCALIZED node text (`OPUS["...(EXECUTE만)"]`, `(somente EXECUTE)`, `(chỉ EXECUTE)`, `（仅 EXECUTE）`) and ko-KR/zh-CN also localized edge labels; de, es, fr, hi, ja-JP keep the English node/edge text; zh-CN uses full-width parentheses `（ ）` and `60–70%` with an en dash; ja-JP, ko-KR and zh-CN line offsets differ by 1 to 12 lines from README.md (the `60.70` bullet is at README.md 1683, zh-CN 1668, de/es/fr/hi/pt-BR/vi-VN 1679, ja-JP/ko-KR 1681). Anchor list to locate per file: (a) `grep -n '🧮' f` (feature cell + heading); (b) `grep -nE 'OPUS\[|SONNET\[' f` (node ids); (c) `grep -nE 'MC -->' f` (edge labels; EN: `EXECUTE / fast-mode\nquick-fix (real code)` and `Research / Spec\nInnovate / Plan\nValidate / Update\nall reviewers`); (d) the heading `### 🧮 ...` then the 2-row model table below it; (e) the `>` note paragraph that starts after the table (EN: `> When work is split across several agents, only the *coding* agent uses opus.`); (f) `grep -nE '^\| [^|`]*`vc-(research|plan|validate)-agent` \|' f` (the three agent-table rows; model column `sonnet` -> `opus`); (g) `grep -nE '60.70' f` (the "premium model" bullet). The gate loops per file (R1.12, R1.13 mechanical backstop). The unmeasured claim "roughly 60-70% lower cost" is REMOVED (it was derived from the false policy); Phase 7 may reintroduce a figure only if measured.

### Step E — CI (starts after B2)

- [ ] E1. In `.github/workflows/validate.yml` add `push:` with `branches: [main]` under `on:` WITHOUT removing `pull_request` (the program commits straight to `main`, so a pull_request-only trigger would never run).
- [ ] E2. Add the missing validators, one step per validator, using EXACTLY the command in this table (run from the repo root; `S=.claude/skills`). Every step name must contain the script base name so the R1.4 name loop finds it. `validate-kit-portability` is ALREADY a step: do not re-add it.

  | # | Validator (script under `$S/...`) | Command after `node` | Argument form |
  |---|---|---|---|
  | 1 | `vc-agent-strategy-compare/scripts/validate-strategy-compare-output.mjs` | `<script> $S/vc-agent-strategy-compare/scripts/fixtures/validate-strategy-compare-output/pass.md` | file |
  | 2 | `vc-audit-plans/scripts/validate-backlog-notes.mjs` | `<script> $S/vc-audit-plans/scripts/fixtures/validate-backlog-notes/pass` | directory |
  | 3 | `vc-audit-plans/scripts/validate-eval-coverage.mjs` | `<script>` (flags only; reads harness scenarios, calls `git rev-parse`) | none, no fixtures |
  | 4 | `vc-audit-plans/scripts/validate-phase-plan-completeness.mjs` | `<script> $S/vc-audit-plans/scripts/fixtures/validate-phase-plan-completeness/pass.md` | file |
  | 5 | `vc-audit-plans/scripts/validate-phase-reports.mjs` | `<script> $S/vc-audit-plans/scripts/fixtures/validate-phase-reports/pass` | directory |
  | 6 | `vc-audit-plans/scripts/validate-umbrella-state.mjs` | `<script> $S/vc-audit-plans/scripts/fixtures/validate-umbrella-state/pass.md` | file |
  | 7 | `vc-audit-vc/scripts/validate-agent-frontmatter.mjs` | `<script>` | none |
  | 8 | `vc-audit-vc/scripts/validate-model-effort-policy.mjs` (NEW) | `<script>` | none (defaults to repo root) |
  | 9 | `vc-autopilot/scripts/validate-autopilot-goal-block.mjs` | `<script> $S/vc-autopilot/fixtures/pass-autopilot-goal-block.md` (the fixture sits in `vc-autopilot/fixtures/`, not `scripts/fixtures/`) | file |
  | 10 | `vc-autoresearch/scripts/validate-autoresearch-log.mjs` | `<script> $S/vc-autoresearch/scripts/fixtures/validate-autoresearch-log/pass.tsv` | `.tsv` file |
  | 11 | `vc-context-discovery/scripts/validate-context-discovery-output.mjs` | `<script> $S/vc-context-discovery/scripts/fixtures/validate-context-discovery-output/pass.md` | file |
  | 12 | `vc-feasibility-test/scripts/validate-feasibility-verdict.mjs` | `<script> $S/vc-feasibility-test/scripts/fixtures/validate-feasibility-verdict/pass.md` (a second step may use `pass-pvl.md`) | file |
  | 13 | `vc-generate-closeout/scripts/validate-closeout-output.mjs` | `<script> $S/vc-generate-closeout/scripts/fixtures/validate-closeout-output/pass.md` | file |
  | 14 | `vc-generate-phase-program/scripts/validate-phase-stub.mjs` | `<script> $S/vc-generate-phase-program/scripts/fixtures/validate-phase-stub/pass.md` | file |
  | 15 | `vc-generate-phase-program/scripts/validate-umbrella-artifact.mjs` | `<script> $S/vc-generate-phase-program/scripts/fixtures/validate-umbrella-artifact/pass.md` | file |
  | 16 | `vc-intent-clarify/scripts/validate-intent-clarify-output.mjs` | `<script> $S/vc-intent-clarify/scripts/fixtures/validate-intent-clarify-output/pass.md` | file |
  | 17 | `vc-plan-discovery/scripts/validate-plan-discovery-output.mjs` | `<script> $S/vc-plan-discovery/scripts/fixtures/validate-plan-discovery-output/pass.md` | file |
  | 18 | `vc-risk-evidence-pack/scripts/validate-evidence-pack.mjs` | `<script> $S/vc-risk-evidence-pack/scripts/fixtures/validate-evidence-pack/pass` | directory |
  | 19 | `vc-risk-evidence-pack/scripts/validate-risk-artifacts.mjs` | `<script> $S/vc-risk-evidence-pack/scripts/fixtures/validate-evidence-pack/pass` (takes an artifact directory; ships NO fixtures of its own, so the evidence-pack pass directory is the stand-in) | directory, no own fixtures |
  | 20 | `vc-test-coverage-plan/scripts/validate-test-coverage-output.mjs` | `<script> $S/vc-test-coverage-plan/scripts/fixtures/validate-test-coverage-output/pass.md` | file |
  | 21 | `vc-validate-findings/scripts/validate-findings-output.mjs` | `<script> $S/vc-validate-findings/scripts/fixtures/validate-findings-output/pass.md` | file |

  (Rows 1-7 and 9-21 are the 20 names missing from CI today plus the new row 8; row 8 exists only after B2.) Expected local result is exit 0 for every row EXCEPT the likely reds: row 3 (needs harness/git context), row 9 and row 19 (no own fixtures, arguments to be confirmed by reading the script's usage line). The implementing agent confirms each exit code locally (E3) and does not trust this expectation.
- [ ] E3. Per-step local run and `continue-on-error` rule (reconciles R1.4 with "never add a silently failing step"): for each row run the exact command locally with its own `; echo $?` (one command per exit code) and record the table of 21 exit codes in the phase report. Exit 0 -> add a normal step. Non-zero -> add the SAME step with `continue-on-error: true` and a YAML comment on the line above naming the cause (for example `# continue-on-error: needs harness scenarios; fails on a bare kit checkout`), and list it under "CI steps allowed to fail" in the phase report. The step name still contains the script base name, so R1.4 stays satisfiable and CI stays green. Never remove or weaken an existing step; a validator that is red at baseline for a reason outside this phase is recorded the same way. Fixture-based steps test the validator, not the kit; that is accepted and stated in the report.
- [ ] E4. `.github/workflows/release.yml` (inner-3 decision): add the SAME validator steps (the 21-row E2 table, same command, same step names containing the script base name, same E3 `continue-on-error: true` rule and cause comment for the rows that fail locally; reuse the E3 exit-code table, no second run needed because the commands are identical). Insert them after the existing `Validate skill keywords` step and before `Validate plan artifacts (if any)`; keep the existing steps, the `on: push: tags: ['v*']` trigger, `permissions: contents: write`, the `Create GitHub Release` step and its `--title` line untouched (Phase 2 owns the display-name line). Do NOT add a `pull_request` or `branches` trigger to release.yml. Result: release.yml names every `validate-*.mjs` script, and the validator-name set of release.yml equals that of validate.yml (including `generate-skills-catalog.mjs`). Known fact, not a defect: `validate.yml` has `concurrency: cancel-in-progress: true` keyed on `github.head_ref || github.ref_name`; with the new `push` trigger a second push to `main` cancels the in-flight run on `main`. Accepted (the later push re-runs everything); do not change it in this phase.

### Step F — Model-fact documentation fixes (Decision B; group (c); needs only the A1 table)

- [ ] F1. `CLAUDE.md` §Model Selection Policy (lines 128-141 today; the "Model Selection Policy (All Spawned Agents)" heading): replace the block with the F-TEXT-1 wording below. Heading text stays as is so cross-references hold.
- [ ] F2. `.claude/skills/vc-agent-strategy-compare/SKILL.md`: replace the body of `## Model Selection Policy` (lines 22-34 today, up to the next `---`) with F-TEXT-2, and the output-template line 186 (`Model: [sonnet for all spawned agents; opus ONLY ...]`) with F-TEXT-3. Front-matter and every other section unchanged (Phase 5 later edits front-matter only).
- [ ] F3. `process/development-protocols/implementation-standards.md` lines 74-76 (the `effort` bullet): replace with F-TEXT-4. `process/development-protocols/orchestration.md` line 35 ("max for opus agents, high for sonnet planners/validators, medium/low for lighter roles"): replace with F-TEXT-5.
- [ ] F4. `process/development-protocols/vc-system-behavior/04-research.md:23` `(sonnet)` -> `(opus)`; `07-plan.md:29` `(sonnet)` -> `(opus)`; `08-validate.md:23` `(sonnet)` -> `(opus)` and `08-validate.md:25` ("VALIDATE is planning/analysis work, not source-code execution, so it runs on sonnet. Only phases that carry out real code or build execution (EXECUTE) run on opus.") -> F-TEXT-6. Leave `06-innovate.md:27` (sonnet) and `09-execute.md:23` (OPUS) as they are.
- [ ] F5. `process/context/all-context.md:179` (the "**Model policy:**" paragraph written by Phase 0): replace with F-TEXT-7 (this single paragraph is the only Phase 0 file Phase 1 touches).
- [ ] F6. Ownership hand-off (registry): Phase 4 owns CLAUDE.md/AGENTS.md/protocols and runs AFTER this phase; it must PRESERVE the corrected text of F1, F3, F4 (its gate re-runs the R1.11 claim grep). Phase 5 edits skill front-matter only, so F2 survives. Phase 7 rewrites the README wording but must keep the facts (7 opus / 8 sonnet, the agent-table rows).

### Exact target wording (English; the README translations carry the same facts)

- F-TEXT-1 (CLAUDE.md): "Each named vc-agent runs on the model set in its own `.claude/agents/*.md` front-matter (enforced by `validate-model-effort-policy.mjs`): **opus on 7** — `vc-execute-agent`, `vc-fast-mode-agent`, `vc-quick-fix-agent` (write code, run builds) and `vc-plan-agent`, `vc-research-agent`, `vc-validate-agent`, `vc-tester` (planning, research, validation and independent test runs, where a miss is most expensive) — and **sonnet on 8**: `vc-innovate-agent`, `vc-spec-agent`, `vc-update-process-agent`, `vc-debugger`, `vc-code-reviewer`, `vc-code-simplifier`, `vc-ui-ux-designer`, `vc-git-manager`. An ad-hoc agent with no vc-agent file (an unnamed parallel subagent, a workflow `agent()` helper) defaults to **sonnet**, and uses **opus** only when it writes source code or runs builds/migrations. The orchestrator MUST name the model when spawning and when recommending a strategy. Codex uses the single model in `.codex/config.toml`. Full rules: `.claude/skills/vc-agent-strategy-compare/SKILL.md` §Model Selection Policy." Keep the bullet "The orchestrator MUST name the model..." form if the original is a bullet list; do not keep the sentences "EXECUTE = opus; every other phase = sonnet" and "all reviewers, researchers, validators, and planners are sonnet".
- F-TEXT-2 (strategy-compare body): the same facts as F-TEXT-1, as: an intro sentence (named vc-agents use their own front-matter model under ALL four strategies), a 7-opus / 8-sonnet list, then "Concrete rules": named vc-agent teammate/subagent/workflow step (`agent(..., {agentType: 'vc-...'})`) = the agent's own model, stated when spawning; ad-hoc agent with no vc-agent file = sonnet, opus only when it writes code or runs builds; dynamic workflows pass `model: 'sonnet'` on ad-hoc `agent()` calls and `model: 'opus'` only for an ad-hoc code/build stage; rationale = the agents whose misses cost most stay on opus, the rest on the cheaper tier, and "whether sonnet is good enough for some of the 7 is NOT measured; measure on golden tasks before lowering any".
- F-TEXT-3: `Model: [front-matter model for named vc-agents; sonnet for ad-hoc agents, opus only for ad-hoc code/build execution — see §Model Selection Policy]`
- F-TEXT-4 (effort bullet): "Use `max` for the opus execution agents (vc-execute-agent, vc-fast-mode-agent, vc-quick-fix-agent), `low` for vc-git-manager, and leave every other agent at the effort already set in its own file (today: plan, research and tester low; validate high; innovate, spec, ui-ux-designer, code-simplifier, update-process medium; debugger and code-reviewer high). No other effort rule is documented."
- F-TEXT-5: "(max for the opus execution agents, low for vc-git-manager; every other agent keeps the effort set in its own file)"
- F-TEXT-6 (08-validate.md:25): "VALIDATE runs on opus (the model set in `vc-validate-agent`'s front-matter) because a gap missed here reaches EXECUTE; it writes no source code."
- F-TEXT-7 (all-context.md): "**Model policy:** each Claude agent runs on the model in its own `.claude/agents/*.md` front-matter: opus on 7 (`vc-execute-agent`, `vc-fast-mode-agent`, `vc-quick-fix-agent`, `vc-plan-agent`, `vc-research-agent`, `vc-tester`, `vc-validate-agent`), sonnet on the other 8; `effort: max` on the three execution agents. Codex uses the single model in `.codex/config.toml`. `validate-model-effort-policy.mjs` enforces the model table; the documents were aligned to the files in the rebrand program Phase 1 (user decision 2026-10-29: keep opus as set)."
- README target facts (EN): feature cell: "Smart model use — the strongest model (opus) builds, plans, researches, validates and tests; the lighter model (sonnet) handles requirements, option comparison, closeout, review and commits." Diagram nodes: `OPUS["🔴 opus\n(7 agents: build, plan,\nresearch, validate, test)"]`, `SONNET["🔵 sonnet\n(8 agents: spec, innovate,\nupdate, debug, review,\nsimplify, UI, commits)"]`, edge labels list those roles. Table: row 1 "EXECUTE (+ fast-mode, quick-fix) · Plan · Research · Validate · tester (EVL)" = opus; row 2 "Spec · Innovate · Update · debugger · reviewers · UI/UX · git-manager" = sonnet. Note: "Each named agent uses the model set in its own file (7 on opus, 8 on sonnet). An unnamed helper agent defaults to sonnet and uses opus only when it writes code or runs a build." Bullet: "It matches the model to the job. Seven agents run on the strongest model (the three that write code, plus plan, research, validate and test); eight run on the lighter, cheaper model. The saving depends on your mix of work; no percentage is claimed until it is measured."

---

## Exit Gate

Run from the repo root (`node` = `node.exe` without Linux Node). Paste the variable block first; every validator gets its own exit-code line:

```bash
P=process/general-plans/active/vibebelt-rebrand_29-10-26
B=$P/baseline
EX=":!$P"
V=.claude/skills/vc-audit-vc/scripts
P1_START=$(cat $B/p1_start.txt)                                                   # Expected: a 40-character commit id
node.exe $V/validate-model-effort-policy.mjs; echo $?                              # Expected: 0
node.exe $V/validate-model-effort-policy.mjs --root $V/fixtures/model-effort-pass; echo $?   # Expected: 0
node.exe $V/validate-model-effort-policy.mjs --root $V/fixtures/model-effort-fail; echo $?   # Expected: output names agent + field + expected value, then 1
node.exe $V/validate-agent-parity.mjs; echo $?                                     # Expected: 0
node.exe $V/validate-agent-frontmatter.mjs; echo $?                                # Expected: 0
N=$(find .claude -name 'validate-*.mjs' -not -path '*/fixtures/*' | wc -l); echo $N          # Expected: 38
grep -rnE '(<h3>|\*\*|🛡️ )36\b' README.md docs/i18n/README.*.md                              # Expected: no output
grep -rnE "(<h3>|\*\*|🛡️ )$N\b" README.md docs/i18n/README.*.md | wc -l                     # Expected: 40
for w in validate release; do for f in $(find .claude -name 'validate-*.mjs' -not -path '*/fixtures/*'); do b=$(basename $f); grep -q "$b" .github/workflows/$w.yml || echo "MISSING $w $b"; done; done   # Expected: no output (both workflow files name every validator)
diff <(grep -oE '[a-z-]+\.mjs' .github/workflows/validate.yml | sort -u) <(grep -oE '[a-z-]+\.mjs' .github/workflows/release.yml | sort -u); echo $?   # Expected: no diff output, then 0 (same script-name set; today 18 = 18, after Phase 1 39 = 39)
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/release.yml')); o=d.get('on', d.get(True)); assert o['push']['tags']==['v*'] and 'pull_request' not in o; print('ok')"   # Expected: ok (tag trigger kept; YAML 1.1 reads on as True)
for w in validate release; do grep -c 'continue-on-error: true' .github/workflows/$w.yml; done | sort -u | wc -l   # Expected: 1 (both files carry the same number of continue-on-error steps)
git diff -U0 $P1_START -- .github/workflows/release.yml | grep -E '^[+-]' | grep -vE '^(\+\+\+|---)' | grep -E '^-' ; echo done   # Expected: only "done" (release.yml: additions only, no existing line removed)
for f in README.md docs/i18n/README.*.md; do echo "$f $(grep -c '🧮' $f) $(grep -cE 'OPUS\[|SONNET\[' $f) $(grep -c '60.70' $f)"; done   # Expected: every line ends "2 2 0" (per-file: 2 calc lines, OPUS+SONNET node ids kept, percentage gone)
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/validate.yml')); o=d.get('on', d.get(True)); assert 'push' in o and 'pull_request' in o and o['push']['branches']==['main']; print('ok')"   # Expected: ok (YAML 1.1 reads the key on as True)
grep -c 'continue-on-error: true' .github/workflows/validate.yml                   # Expected: equals the number of "CI steps allowed to fail" in the phase report (record it)
git diff -U0 $P1_START -- .claude/agents | grep -E '^[+-]' | grep -vE '^(\+\+\+|---)' | grep -vE '^[+-]effort:'   # Expected: no output (only effort lines moved)
git diff -U0 $P1_START -- .claude/agents | grep -cE '^[+-]model:'                  # Expected: 0 (no model line changed, Decision B)
git diff --name-only $P1_START -- .claude/agents | LC_ALL=C sort                   # Expected: exactly .claude/agents/vc-execute-agent.md, vc-fast-mode-agent.md, vc-quick-fix-agent.md
grep -c '^effort: max' .claude/agents/vc-execute-agent.md .claude/agents/vc-fast-mode-agent.md .claude/agents/vc-quick-fix-agent.md   # Expected: three lines, each ending :1
grep -l '^model: opus' .claude/agents/*.md | wc -l; grep -l '^model: sonnet' .claude/agents/*.md | wc -l   # Expected: 7 then 8
R='EXECUTE = opus; every other phase|only (the )?(EXECUTE|coding|code-writing)|every other phase = sonnet|all other vc-agents sonnet|EXECUTE only|only (the )?\*coding\* agent|opus ONLY|\(sonnet\)|expensive model only writes|premium AI model only'
grep -rnIE "$R" CLAUDE.md AGENTS.md process/development-protocols/orchestration.md process/development-protocols/implementation-standards.md process/development-protocols/vc-system-behavior/04-research.md process/development-protocols/vc-system-behavior/07-plan.md process/development-protocols/vc-system-behavior/08-validate.md .claude/skills/vc-agent-strategy-compare/SKILL.md process/context/all-context.md README.md   # Expected: no output (R1.11; today 14 hits in these files; 06-innovate.md and 09-execute.md are not in the list on purpose)
for f in README.md docs/i18n/README.*.md; do for a in research plan validate; do grep -E "^\| [^|\`]*\`vc-${a}-agent\` \|" $f | grep -qE "^\| [^|]*\| \*{0,2}opus\*{0,2} \|" || echo "RED $f $a"; done; done   # Expected: no output (R1.12; today 30 RED lines = 10 files x 3 agents)
for f in README.md docs/i18n/README.*.md; do grep -cE "^\| [^|\`]*\`vc-(spec|innovate|update-process)-agent\` \| sonnet \|" $f; done | sort | uniq -c   # Expected: 10 3 (the three real sonnet rows stay sonnet in all 10 files)
git diff --stat $P1_START -- .codex                                                # Expected: no output
bash $B/compare.sh; echo $?                                                        # Expected: 0 (not worse than the Phase 0 baseline; prints NOTE new validator for the new script)
git diff --check $P1_START -- . "$EX"                                              # Expected: no output
```

- New validator proven on both fixtures (pass exits 0, fail exits non-zero) and on the real agents.
- The phase report contains the 15-agent old/new table (all `model:` values unchanged; three `effort:` values `low` -> `max`), the token-cost note, and the list of documentation sites corrected (file:line before/after), citing `implementation-standards.md` §Agent Frontmatter Conventions. The report states that Decision B (keep opus, fix docs) was applied and that the sonnet-versus-opus cost measurement is a deferred follow-up outside this program.
- Report requirements added by the inner-3 supplement: (i) the token-cost note names `vc-quick-fix-agent` (the lightest lane; effort `max` raises its per-run token cost most visibly against its purpose), `vc-fast-mode-agent` and `vc-execute-agent` explicitly, old and new value each; (ii) a note that `CLAUDE.md` is the orchestrator's own governing text: sessions started before the Step F1 change still hold the old model text, and spawns of plan, research, validate and tester after Phase 1 must NOT pass a `model:` override (they use their own front-matter, opus); (iii) the registry claim note: Phase 1 also owns `.github/workflows/release.yml` (additions only; Phase 2 keeps the display-name line, Phase 1 runs first) and the E3 exit-code table covers both workflow files (the owner of the registry applies it; this phase does not edit the registry); (iv) the accepted CI note: `push` plus `cancel-in-progress: true` on `main` means a second push cancels an in-flight run, accepted and not a defect; (v) commit hygiene: the `fix:` commit is staged by an explicit file list only (never `git add -A`); `baseline/validators.list` append and `baseline/p1_start.txt` go in the later `process:` evidence commit.

---

## Blockers That Would Justify BLOCKED Status

- The policy table in `implementation-standards.md` no longer matches Step A1 (ask; do not guess).
- An agent's `model:` on disk no longer matches the A1 table, or a documentation site found by the Step F greps says something different from the grep-verified list above (ask; do not guess; do not change any `model:` line to make the table true).
- Parity validator was already red at baseline for an unrelated reason (record, ask).
- A validator step cannot be added to CI without failing locally and the failure cannot be explained (record, do not add silently).

---

## Phase Completion Rules

- CODE DONE = checklist items done; VERIFIED = Exit Gate commands pass AND `compare.sh` exits 0 (suite not worse than the Phase 0 baseline) AND regression checkpoint passes AND validate-contract exists.
- Known-Gap alone never makes a behavior PASS; write a backlog stub and keep that gate CONDITIONAL.

## Acceptance Criteria

- See the Exit Gate commands and the Verification Evidence table; each row names the charter criterion it proves (proven by + strategy).

## Touchpoints

- Three agent front-matter `effort:` lines (no `model:`), one new script + fixtures, `vc-audit-vc/SKILL.md`, model-fact corrections in CLAUDE.md / 5 protocol files / strategy-compare SKILL.md / all-context.md, README + 9 translations (count + model facts), CI workflows (`validate.yml` and `release.yml`)

---

## Public Contracts

- Agent names, tool grants, signal strings, prompt bodies and every `model:` value unchanged. Only three `effort:` values move (execute-class low -> max); proven mechanically by the diff gate (R1.7). Codex agent set and `.codex/config.toml` unchanged (R1.8). Documentation now states the real model policy (7 opus / 8 sonnet; ad-hoc helpers default to sonnet).

---

## Verification Evidence

| Gate / Scenario | Strategy | Proves SPEC criterion |
|---|---|---|
| New validator: pass fixture exit 0, fail fixture exit 1 with plain message (`--root`) | Fully-Automated | C-P1 (R1.1): new validator + fixtures |
| Validator on real agents exit 0 | Fully-Automated | C-P1 (R1.2): agents follow policy |
| Parity + frontmatter validators exit 0 | Fully-Automated | C-P1 (R1.3): no drift left |
| missing-name loop over `validate.yml` prints nothing (21-row per-validator command table in E2; locally failing steps carry `continue-on-error: true` + cause comment) | Fully-Automated | C-P1 (R1.4): CI covers full suite |
| PyYAML parse of `validate.yml`: `push` on `main` and `pull_request` both present (prints `ok`) | Fully-Automated | C-P1 (R1.5): CI actually runs |
| `36` count gone, N appears 40 times, N=38 | Fully-Automated | C-P1 (R1.6): counts fixed |
| diff gate: no `model:` line changes; only the 3 execution agents change; only their `effort:` lines (plus `effort: max` count 3 and 7 opus / 8 sonnet count) | Fully-Automated | C-P1 (R1.7): public contract held |
| `.codex` untouched | Fully-Automated | C-P1 (R1.8): Codex scope |
| `compare.sh` exit 0 + `git diff --check $P1_START -- . ":!$P"` prints nothing (`P1_START` read from `baseline/p1_start.txt`) | Fully-Automated | C-P1 (R1.9): not worse than baseline |
| phase report table (model unchanged, 3 effort values changed) + token-cost note vs the doc | Agent-Probe | C-P1 (R1.10): effort documented |
| claim-regex grep over CLAUDE.md / AGENTS.md / protocols / strategy-compare / all-context / README prints nothing (R1.11) | Fully-Automated | C-P1 (R1.11): English docs state the real model policy |
| README agent-table loop over the 10 README files prints nothing; sonnet-row count is 3 in each (R1.12) | Fully-Automated | C-P1 (R1.12): table facts correct in all 10 languages |
| translated prose, diagram text, feature cell and "premium model" bullet in 9 translations state 7 opus / 8 sonnet and the removed percentage | Agent-Probe (judgement of wording in 9 languages; named residual, never the sole proof) | C-P1 (R1.13): translations carry the same facts |
| release.yml carries the same validator set as validate.yml (name loop over both files, script-name sets equal, YAML parses with `push.tags == ['v*']`, additions only) | Fully-Automated | C-P1 (R1.4): CI covers full suite (release path) |
| per-file README anchors: each of the 10 files keeps 2 `🧮` lines and the OPUS/SONNET node ids and has 0 `60.70` | Fully-Automated | C-P1 (R1.12/R1.13 mechanical backstop) |
| CI steps actually pass on ubuntu runner | Known-Gap residual (needs a real push, Phase 8); backlog stub, gate stays CONDITIONAL, never PASS on this alone | C-P1 (R1.4) residual |

---

## Phase Loop Progress

Orchestrator reads this before deciding which subagent to spawn next. The canonical 7-step inner loop
`R → I → P → PVL → E → EVL → UP` SKIPS SPEC (the umbrella plan and the user brief act as the SPEC).

- [ ] 1. RESEARCH — vc-research-agent (opus, front-matter): prior phase reports read; test context loaded; plan drift checked; model facts and doc line numbers re-grepped
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

- Selected plan file path: `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-01-fix-inconsistencies_PLAN_29-10-26.md`
- Last completed step: not started
- Validate-contract status: written 29-10-26 (generated-by inner-pvl: phase-1; Gate: PASS; supersedes the earlier outer-pvl PASS contract and the Inner Loop Refresh Note of 2026-10-29). The earlier contract text is replaced (git history only). Inner steps 1-3 (RESEARCH, INNOVATE, PLAN-SUPPLEMENT) are still unchecked; a newer Inner Loop Refresh Note from them re-triggers the PVL (instruction E15).
- Supporting context files: umbrella plan, `phase-blast-radius-registry.md`, prior phase report (if any)
- Inner steps 1-3 status: inner 3 (PLAN-SUPPLEMENT) applied 2026-10-29 (release.yml sync, per-file README anchors, report requirements); the Inner Loop Refresh Note dated 2026-10-29 (inner 3) re-triggers the PVL from V1.
- Next step: step 1 RESEARCH of this phase when its turn comes (strict phase order), then the inner PVL from V1 (Refresh Note newer in effect than the contract; see the note on same-day dates in the Supplement). EXECUTE starts after the Phase 0 exit gate is green.

---

## Inner Loop Refresh Note: 2026-10-29 — changed sections: Purpose, Entry Gate (runtime), Strategy Recommendation, Blast Radius, Implementation Checklist (A1, B1, B2, C, D2, new Step F), Exit Gate, Blockers, Touchpoints, Public Contracts, Verification Evidence, Phase Loop Progress, Resume and Execution Handoff. Invalidates prior validate-contract.

User decision B (2026-10-29): keep `opus` on research, plan, validate, tester as on disk; fix the documentation instead of the files. The Validate Contract below was written for the old plan (opus -> sonnet on 4 agents) and its A1-table-based gates (R1.2, R1.7, R1.10, E1-E9 items about model lines, the dry run) are superseded by this note; the PVL must re-run from V1 and rewrite the contract.

---


## Inner Loop Refresh Note: 2026-10-29 (inner 3) — changed sections: Strategy Recommendation, Blast Radius, Implementation Checklist (D2 per-file anchors, new E4 release.yml sync), Exit Gate (name loop over both workflows, script-set equality, release.yml YAML gate, per-file README anchor loop, report requirements), Verification Evidence (2 rows), Touchpoints, Entry Gate (commit order), Resume and Execution Handoff (research findings: release.yml sync, per-file README diagram edits). Invalidates the validate-contract below for the new gates; the PVL must re-run from V1.

### Supplement (inner 3, research findings)

Scope: research findings folded in; no umbrella decision changed (Decision B, Decision A and the 7 opus / 8 sonnet facts are untouched).

- S1 release.yml: verified 2026-10-29 that `release.yml` and `validate.yml` name the same 18 scripts today (17 validators plus `generate-skills-catalog.mjs`) and that no phase syncs release.yml. Orchestrator decision: Phase 1 syncs it (new Step E4, blast radius, gates). Phase 2 later edits one display-name line there; Phase 1 first.
- S2 README: verified that all 10 README files have the same counts (2 `🧮`, 3 OPUS/SONNET node lines, 1 `60.70`, 3 agent rows) but localized text differs (ko-KR/pt-BR/vi-VN/zh-CN node text, ko-KR/zh-CN edge labels, zh-CN full-width parentheses and en dash, per-file line offsets). D2 is per-file, grep-located, with a per-file gate.
- S3 token cost: the report names quick-fix, fast-mode and execute explicitly.
- S4 commit hygiene: separate `process:` commit BEFORE EXECUTE (so `P1_START` is that commit); `fix:` commit by explicit file list; evidence files in the later `process:` commit.
- S5 CLAUDE.md governs the orchestrator: stale-session note and no `model:` override on plan/research/validate/tester spawns after Phase 1 (report requirement).
- S6 CI `push` + `cancel-in-progress: true` on `main`: accepted note, not a defect.
- Wording to adjust in files this supplement does not own (hand-off): registry Phase 1 section needs `.github/workflows/release.yml` (additions only; runs before Phase 2's display-name line) and the 10-file per-language anchor note; Phase 2 plan/registry line `release.yml (1 line)` should say "after Phase 1's validator steps"; Phase 6 plan line 155 ("the 18 commands in `.github/workflows/release.yml`") will be about 39 script names after Phase 1 and should read the count from the file rather than say 18.


## Validate Contract

Status: PASS
Date: 29-10-26
date: 2026-10-29
generated-by: inner-pvl: phase-1
supersedes: 2026-10-29 (outer-pvl) — the earlier PASS contract (cycle 3, written for the old plan: opus -> sonnet on 4 agents) AND the Inner Loop Refresh Note dated 2026-10-29. The note and the old contract carry the same calendar date, so the date comparison cannot order them; this contract was written AFTER the note in the same session, was produced by a full V1-V7 pass on the rewritten plan (Decision B), and is the only contract with current evidence. The earlier contract text is replaced, not appended (inner-PVL overwrite rule); it survives only in git history (HEAD 7845316).

V1 line (relayed): `V1 RE-VALIDATE TRIGGERED: Inner Loop Refresh Note dated 2026-10-29 is newer than existing contract.` (V1 AUTO-PROCEED did not apply.)

Parallel strategy: parallel-subagents (3 groups, ONE ordering rule: README/i18n/CI start after the validator exists on disk) — or one sequential implementing pass A, B, C, D, E, F (same result, simpler)
Rationale: score 2/7 (S4 phase program, S7 five or more files). Dominant signal S7. Group (b) depends on step B2 (validator + N); group (c) needs only the A1 table. Models: named agents keep their own front-matter model (plan, research, validate, tester = opus; innovate, update-process = sonnet; this phase changes none); implementing subagents opus; any ad-hoc helper sonnet. Fan-out cost if used: 4 (Layer 1) + 6 (Layer 2: Steps A-F) + 3 implementers = 13, up to 16 with optional reviewer/tester/security (under the 30-agent guard). This pass was ONE fire-and-forget validate-agent (no sub-agent fan-out possible): all four dimensions and six sections were checked by direct inspection plus a full dry run of the phase in a throw-away copy (deleted afterwards).

### Real-repo facts checked (V1-V3, this pass; Linux node v22.23.4, HEAD 7845316)

- Structural check of this plan: `validate-plan-artifact.mjs` exit 0 (0 failures, 2 advisory legacy-shape warnings). No `## Phase Ordering`, no `## Pre-PVL Conflict Resolution` in the plan; registry has no `status: BLOCKED`; Phase 0 report exists (COMPLETE_WITH_GAPS), so the dependency guard does not fire. Umbrella has `## Stable Program Goal` (so no goal block is written into this plan: BRANCH B).
- **Agent inventory** (`grep '^model:\|^effort:' .claude/agents/*.md`) equals the A1 table exactly: opus = execute (low), fast-mode (low), quick-fix (low), plan (low), research (low), tester (low), validate (high); sonnet = code-reviewer (high), code-simplifier (medium), debugger (high), git-manager (low), innovate (medium), spec (medium), ui-ux-designer (medium), update-process (medium). 7 opus / 8 sonnet. The F-TEXT-4 effort sentence matches these values. `.codex/agents/*.toml` have no `model`/`effort` fields (0 files); `.codex/config.toml` has the single `model = "gpt-5.4"`.
- **Every cited doc site exists and says what the plan says**: `CLAUDE.md` 128-141 (heading at 128, "Full rules" at 141); `implementation-standards.md` 74-76; `orchestration.md` 35; `04-research.md:23`, `07-plan.md:29`, `08-validate.md:23` and `:25` (all `(sonnet)` / the "runs on sonnet" sentence); `vc-agent-strategy-compare/SKILL.md` section at 22-34 and template line 186; `process/context/all-context.md:179` (Phase 0 "Model policy" paragraph). `AGENTS.md` has no opus/sonnet text; `06-innovate.md:27`, `09-execute.md:23`, `autopilot.md:129`, `orchestration.md:575`, `CLAUDE.md:219` are correct as the plan says. A repo-wide scan of md/toml/json/mjs/yml for opus|sonnet found no stale model claim outside the plan's list.
- **Claim grep R1.11 today: 14 hits** (CLAUDE.md 3, 04/07/08 one each, strategy-compare 3, all-context 1, README 4) = the author's count. **README agent-table loop R1.12 today: 30 RED lines** (10 files x 3 agents; every file has exactly one row per agent in the expected format); sonnet-row loop prints `10 3`.
- README count: `find .claude -name 'validate-*.mjs' -not -path '*/fixtures/*' | wc -l` = 37 today (38 after B2); the regex `(<h3>|\*\*|🛡️ )36\b` hits 4 lines in each of the 10 files (40).
- **Dry run in a throw-away copy of the repo (git repo present, Phase 0 state), Steps A-F executed with the plan's wording:**
  - B1/B2/C1: a prototype validator (`--root`, defaults to `git rev-parse --show-toplevel`, same convention as `validate-kit-portability.mjs`; note `validate-agent-frontmatter.mjs` has NO `--root`, which the plan correctly does not claim) gives: real agents BEFORE the edit exit 1 with exactly 3 messages (execute, fast-mode, quick-fix: effort is low, expected max) and ZERO model messages; pass fixture (15 files, 7 opus / 8 sonnet) exit 0; fail fixture exit 1 with 4 plain-language lines (plan model, innovate model, execute effort, git-manager effort). After the 3 `effort:` edits the real agents exit 0.
  - R1.7 gates after the edit: diff gate prints nothing; `model:` changed lines = 0; changed files = exactly `vc-execute-agent.md`, `vc-fast-mode-agent.md`, `vc-quick-fix-agent.md`; `effort: max` x3; 7 opus / 8 sonnet; `.codex` diff empty. parity, frontmatter, seeds, skill-dependencies, skills-catalog `--check` all exit 0.
  - Fixtures at `.claude/skills/vc-audit-vc/scripts/fixtures/model-effort-{pass,fail}/.claude/agents/` do not disturb any validator; `resolve-manifest.mjs --json` lists the new script (1 added line, 416 files) and no fixture file.
  - B4: appending the `validate-model-effort-policy` line to `baseline/validators.list` (the file ends with a newline, so the append is clean) and running `bash baseline/compare.sh`: prints `NOTE new validator validate-model-effort-policy`, then `OK: nothing worse than validators_after_setup.tsv`, exit 0 (36 s). Run again after ALL edits (agents, README x10, CI, Step F docs): same, exit 0. `git diff --check <P1_START> -- . ':!<task folder>'` prints nothing.
  - D: after replacing, regex `36` has 0 hits and `38` has exactly 40 hits (see R1-c for one tooling trap).
  - E: the PyYAML check passes after adding `push` (`ok`); `validate.yml` still parses (29 steps in the simulation with 8 rows added); the missing-name loop today lists exactly 20 names (rows 1-7 and 9-21 of E2 cover them name by name).
  - F: with the plan's F-TEXT-1..7 and README target wording applied, the R1.11 grep prints nothing EXCEPT one hit (R1-b below); the R1.12 loop prints nothing (0 RED) and the sonnet loop stays `10 3`.
- **The 21-row CI table, every command run locally with Linux node** (exit codes): rows 1, 2, 4, 6, 7, 9 (prints a `TBD` WARN, exit 0), 10-18, 20, 21 = 0; row 8 (new validator) = 0 after B2. Row 3 `validate-eval-coverage` = 1 ("Coverage map is empty"; expected red). Row 19 `validate-risk-artifacts` on the evidence-pack pass directory = 1 (expected red). **Row 5 as written in the table (directory form) = 1 with `EISDIR`; with `.../validate-phase-reports/pass/umbrella.md` = 0** (R1-a). So: 18 zero, 3 non-zero as written.

### Plan updates applied

None to the plan body. This pass writes only the contract and refreshes the one stale status line in "Resume and Execution Handoff" (it still said the inner PVL must re-run). The defects found (R1-a, R1-b, R1-c) are bounded and are resolved by the Execute-agent instructions below, which override the plan text and do not change the Exit Gate.

### Execute-agent instructions

- E1. Runtime: Linux `node` (v22.23.4) or `node.exe`; record which ran in the phase report. Gate commands that say `node.exe` may use `node`.
- E2. Red first (A1 re-read, B1, C1): before any edit re-read all 15 front-matters (a mismatch with the A1 table = stop and ask) and re-read `implementation-standards.md` §Agent Frontmatter Conventions (`max` / `low` rows). Write fixtures, run the new validator on the fail fixture and (once it exists) on the real agents BEFORE the effort edit: expect exit 1 with exactly 3 messages (execute, fast-mode, quick-fix effort) and no model message; save the output in the report.
- E3. Agent files: touch ONLY the `effort:` line of `vc-execute-agent.md`, `vc-fast-mode-agent.md`, `vc-quick-fix-agent.md` (`low` -> `max`). No `model:` line anywhere, no other agent file, no `.codex/**`, no `AGENTS.md`, no `06-innovate.md` / `09-execute.md` / `autopilot.md`. Run the R1.7 gates after editing; any other changed line means revert that file and stop.
- E4. `P1_START` is written to `baseline/p1_start.txt` (Entry Gate) before any edit AND copied into the phase report; read it back in every diff gate (a spawned tester shell has no variables).
- E5. Compute N with the `find` command AFTER the new script exists (expect 38; do not hand-count). Replace in all 40 sites with a pattern that does NOT use `\b` (GNU `sed -E ...\b` leaves the `docs/i18n/README.ja-JP.md` and `README.ko-KR.md` sites untouched because `36` is followed by a CJK character; use `s/(<h3>|\*\*|🛡️ )36/\1N/g` or a short Python replace). The grep gates are authoritative: `36` -> no output, `N` -> 40 lines.
- E6. CI: add `push: branches: [main]` keeping `pull_request`. For each of the 21 rows run the exact command locally with its own `echo $?`, record the 21 exit codes in the report; exit 0 -> normal step; non-zero -> same step with `continue-on-error: true` plus a cause comment on the line above. The comment MUST NOT contain the text `continue-on-error: true` (the Exit Gate counts that text; the plan's example comment `# continue-on-error: needs harness ...` is fine because it is followed by `needs`). Never remove or weaken an existing step; each step name contains the script base name. Trust the exit code you measure: rows 3 and 19 were red here, row 9 was green.
- E7. R1-a (E2 row 5 correction, overrides the table): use `node .claude/skills/vc-audit-plans/scripts/validate-phase-reports.mjs .claude/skills/vc-audit-plans/scripts/fixtures/validate-phase-reports/pass/umbrella.md` (exit 0 here), not the directory form.
- E8. R1-b (README feature cell vs the R1.11 gate): the plan's target feature-cell wording contains the literal `(sonnet)`, which matches the R1.11 regex alternative `\(sonnet\)` over `README.md`. Write it as "...; the lighter model, sonnet, handles requirements, option comparison, closeout, review and commits." (no parentheses around the model name; `(opus)` is fine). Re-run the R1.11 grep after the README edit; it must print nothing. Keep the facts (7 opus / 8 sonnet) identical in the 9 translations; do not write `(sonnet)` there either.
- E9. Step F: replace with the exact F-TEXT-1..7 and keep headings as they are; re-grep every line number first (a site that says something different from the plan = stop and ask). For the agent-table rows in the 10 README files write `**opus**` (bold, like the execute rows) for research, plan, validate only; spec, innovate, update-process stay `sonnet`. Remove the `60-70%` claim in all 10 files (EN bullet and the 9 translations).
- E10. The new validator is additive only: never edit another validator's checks; it enforces only the documented rows (15 models; `effort: max` x3; `effort: low` for vc-git-manager); error text names agent + field + expected value.
- E11. Commits (umbrella rule: one execution commit per phase, process commits separate): ONE `fix:` commit on `main` for the execution changes (3 agent effort lines, validator + fixtures, `vc-audit-vc/SKILL.md`, README x10, `validate.yml`, Step F docs); a SEPARATE `process:` commit for the task-folder evidence (`baseline/p1_start.txt`, the `validators.list` line, the phase report, umbrella state, backlog stub). Phase 2's Entry Gate depends on the `fix:` commit existing. The gates diff against `P1_START`, so they stay valid after the commits.
- E12. K1-1 stub: `mkdir -p process/general-plans/backlog` then write `process/general-plans/backlog/model-effort-validator-registry_NOTE_29-10-26.md` at UPDATE PROCESS (frontmatter plus `NEW PLAN REQUIRED`).
- E13. R1-e (UPDATE PROCESS, not a Phase 1 gate): after the phase, `process/context/all-context.md` (lines 158 and 205 say "37 validators") and `process/context/tests/all-tests.md` (line 83 describes CI as `pull_request` only with 21 steps) become stale; vc-update-process-agent reconciles them with `vc-audit-context` (the phase's own gates do not check them).
- E14. The phase report states the token-cost impact in plain words (execute, fast-mode, quick-fix move from effort low to max: more tokens per run, higher quality; nothing else changes in cost terms because no `model:` changes), lists old/new for all 15 agents, lists the 21 CI exit codes and "CI steps allowed to fail", and says Decision B (keep opus, fix docs) was applied and that the sonnet-versus-opus measurement is a deferred follow-up outside this program.
- E15. If the Phase 1 inner RESEARCH or PLAN-SUPPLEMENT (steps 1-3, still unchecked) adds a newer `## Inner Loop Refresh Note`, this contract must be re-run from V1.

### Test gates

Test context: `process/context/tests/all-tests.md` (created by Phase 0; validators, CI, baseline `compare.sh`) was read; every Fully-Automated gate below is a validator, a grep or a diff run from the repo root, each with its own exit code and an expected value.

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P1 (R1.1) | new policy validator accepts a correct agent set and rejects a drifted one | Fully-Automated | `node $V/validate-model-effort-policy.mjs --root $V/fixtures/model-effort-pass; echo $?` = `0`; same with `.../model-effort-fail` = `1` and output names agent + field + expected value | B |
| C-P1 (R1.2) | the real agents follow the policy (7 opus / 8 sonnet, effort max x3, git-manager low) | Fully-Automated | `node $V/validate-model-effort-policy.mjs; echo $?` = `0` (was 1 with exactly 3 effort messages before C1: dry run) | A (reproduced) |
| C-P1 (R1.3) | front-matter valid and Claude/Codex names match | Fully-Automated | `node $V/validate-agent-parity.mjs; echo $?` = `0` and `node $V/validate-agent-frontmatter.mjs; echo $?` = `0` (each its own `echo $?`) | A (reproduced after the edit) |
| C-P1 (R1.4) | CI names every validator that exists | Fully-Automated | the missing-name loop over `validate.yml` prints nothing (21-row table E2 + E3/E6/E7) | B |
| C-P1 (R1.5) | CI triggers on the branch we commit to, YAML still valid | Fully-Automated | `python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/validate.yml')); o=d.get('on', d.get(True)); assert 'push' in o and 'pull_request' in o and o['push']['branches']==['main']; print('ok')"` = `ok`; `grep -c 'continue-on-error: true' .github/workflows/validate.yml` = the "CI steps allowed to fail" count in the report | A (reproduced) |
| C-P1 (R1.6) | validator count is the same real number everywhere | Fully-Automated | `N=$(find .claude -name 'validate-*.mjs' -not -path '*/fixtures/*' \| wc -l)` = 38; `grep -rnE '(<h3>\|\*\*\|🛡️ )36\b' README.md docs/i18n/README.*.md` prints nothing; the same regex with `$N` counts 40 lines | A (reproduced) |
| C-P1 (R1.7) | only 3 `effort:` lines moved in agent files; no `model:` line | Fully-Automated | diff gate (`grep -vE '^[+-]effort:'`) prints nothing; `grep -cE '^[+-]model:'` = `0`; `git diff --name-only $P1_START -- .claude/agents` = exactly the 3 execution agents; `grep -c '^effort: max'` = 1 each; 7 then 8 | A (reproduced) |
| C-P1 (R1.8) | Codex untouched | Fully-Automated | `git diff --stat $P1_START -- .codex` prints nothing | A |
| C-P1 (R1.9) | whole suite not worse than the Phase 0 baseline | Fully-Automated | `bash $B/compare.sh; echo $?` = `0` (prints `NOTE new validator validate-model-effort-policy`); `git diff --check $P1_START -- . ":!$P"` prints nothing | A (reproduced twice) |
| C-P1 (R1.10) | effort table and cost impact documented | Agent-Probe | reviewer reads the phase report: 15-agent old/new table (models unchanged, 3 efforts low -> max), token-cost note, citation of `implementation-standards.md` §Agent Frontmatter Conventions, Decision B statement | A |
| C-P1 (R1.11) | English docs state the real model policy | Fully-Automated | `grep -rnIE "$R" CLAUDE.md AGENTS.md ... README.md` prints nothing (14 hits today; 0 after Step F with E8 applied) | A (reproduced) |
| C-P1 (R1.12) | agent-table facts correct in all 10 README files | Fully-Automated | the research/plan/validate loop prints nothing (30 RED today); the sonnet-row loop prints `10 3` | A (reproduced on README.md; the other 9 have the same row shape) |
| C-P1 (R1.13) | translated prose, diagram, feature cell and bullet in 9 translations state 7 opus / 8 sonnet and drop the percentage | Agent-Probe | reviewer reads the 9 translated sites against the EN target facts; the R1.12 loop and `grep -c '60.70'` = 0 per file are the mechanical backstop; named residual, never the sole proof | D (named residual) |
| C-P1 (R1.4 residual) | the added CI steps pass on a real ubuntu runner | Agent-Probe | cannot run here; needs a real push (Phase 8) | D (named residual) |

Failing stubs (Fully-Automated rows only; red-first starting points, not on-disk test files):

```
Failing stub (R1.1):
test("should accept the pass fixture and reject the drifted fixture with a plain-language message", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should accept the pass fixture and reject the drifted fixture with a plain-language message")
})
Failing stub (R1.2):
test("should find no model/effort drift in the real agents", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should find no model/effort drift in the real agents")
})
Failing stub (R1.3):
test("should keep parity and frontmatter validators at exit 0", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should keep parity and frontmatter validators at exit 0")
})
Failing stub (R1.4):
test("should reference every validate-*.mjs script in validate.yml", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should reference every validate-*.mjs script in validate.yml")
})
Failing stub (R1.5):
test("should trigger CI on push to main as well as pull_request", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should trigger CI on push to main as well as pull_request")
})
Failing stub (R1.6):
test("should state the same validator count in README and all 9 translations", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should state the same validator count in README and all 9 translations")
})
Failing stub (R1.7):
test("should change only the effort line of the three execution agents and no model line", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should change only the effort line of the three execution agents and no model line")
})
Failing stub (R1.8):
test("should leave the Codex agent files untouched", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should leave the Codex agent files untouched")
})
Failing stub (R1.9):
test("should not be worse than the Phase 0 validator baseline", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should not be worse than the Phase 0 validator baseline")
})
Failing stub (R1.11):
test("should state the real model policy in the English docs", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should state the real model policy in the English docs")
})
Failing stub (R1.12):
test("should show opus for research, plan and validate in the agent table of all 10 README files", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should show opus for research, plan and validate in the agent table of all 10 README files")
})
```

Legacy line form (kept for existing consumers):
- policy validator: [Fully-automated: `node $V/validate-model-effort-policy.mjs --root <pass-fixture>` exit 0 | fail-fixture exit 1]
- agents match policy: [Fully-automated: validate-model-effort-policy.mjs + validate-agent-parity.mjs + validate-agent-frontmatter.mjs]
- diff gate: [Fully-automated: effort-only diff, no model line, 3 files, `.codex` empty]
- CI coverage: [Fully-automated: missing-name loop over validate.yml + PyYAML trigger check]
- README counts and model facts: [Fully-automated: regex count 40 of N; R1.11 claim grep; R1.12 table loop]
- suite not worse: [Fully-automated: compare.sh exit 0]
- cost / effort table, translations: [agent-probe: phase report review; 9-language wording]
- CI passes on ubuntu: [known-gap: documented as NEW PLAN REQUIRED, Phase 8]

High-risk class: none (no auth, billing, schema, public API, secrets). The only runtime-behavior change is `effort` on three agents (more tokens per run, intended); no model changes. No evidence pack needed.

### Dimension findings

- Infra fit: PASS — only front-matter `effort:` lines move; `.codex/` untouched; `push` trigger planned and parses; the new validator follows the `--root` convention of `validate-kit-portability.mjs`; fixtures are inert for every validator and the resolver; `max` is accepted by the frontmatter validator.
- Test coverage: PASS — every developed behavior has a Fully-Automated gate, each runnable with an expected value and reproduced in the dry run; the two Agent-Probe rows (R1.10, R1.13) are judgment-only with a mechanical backstop or a named residual; CI-on-ubuntu is a named residual with a backlog stub.
- Breaking changes: PASS — no `model:` changes, no tool grants, signals or prose touched; the diff gate proves it; the README/docs now state the real policy (7 opus / 8 sonnet); the documented ownership hand-off (Phase 4 preserves F1/F3/F4/F5 text, Phase 5 front-matter only, Phase 7 keeps the facts) is in the registry.
- Security surface: PASS — no auth, secrets or data; the validator is read-only; CI keeps `permissions: contents: read`; `push` on `main` adds no new secret exposure.
- Section A (Policy table): PASS — equals the 15 real front-matters and both source documents; the validator enforces documented rows only.
- Section B (New validator, test first): PASS — red-first ordering reproduced (3 effort messages, 0 model messages); B4 baseline interplay reproduced (`NOTE new validator`, exit 0).
- Section C (Fix agents): PASS — exactly 3 files, effort-only; diff gates empty/0/3 reproduced.
- Section D (README count and model facts): PASS — 40 sites, N=38; model-fact sites exist in all 10 files (one `🧮`, one `60.70`, 3 agent rows, 18 opus/sonnet lines each); tooling trap R1-c and wording trap R1-b carried as instructions.
- Section E (CI): PASS — 21-row table verified, 3 rows non-zero as written (3, 5, 19) all covered by E3/E6/E7; trigger and name loop reproduced.
- Section F (Model-fact docs): PASS — all 9 cited sites verified, 14 hits today, 0 after the edit (with E8); no other stale claim exists in the repo.

Net gate derivation: Layer 1 = 0 FAIL / 0 CONCERN / 4 PASS; Layer 2 = 0 FAIL / 0 CONCERN / 6 PASS. MUST-FIX count: 0. RESIDUAL (bounded, each resolved by an instruction above): R1-a, R1-b, R1-c, R1-d (commit split, E11), R1-e (stale Phase 0 context counts, E13). Known-Gaps (named residuals): K1-1, K1-2. Net gate: PASS.
Vacuous-green check: every developed behavior has a Fully-Automated gate (R1.1-R1.9, R1.11, R1.12); R1.10 and R1.13 are Agent-Probe for judgment only; CI-on-ubuntu is a named residual with a backlog stub and never the sole proof. No behavior rests on a residual alone.

### Open gaps

- R1-a (RESIDUAL, E7): E2 table row 5 passes a directory; `validate-phase-reports.mjs` takes the umbrella FILE (directory form exits 1 with `EISDIR`).
- R1-b (RESIDUAL, E8): the plan's README feature-cell target wording contains `(sonnet)`, which the plan's own R1.11 regex flags; reword without parentheses.
- R1-c (RESIDUAL, E5): `sed -E '...\b'` skips the ja-JP and ko-KR count sites; use a pattern without `\b`; the 0/40 grep gates catch it.
- R1-d (RESIDUAL, E11): the plan names no execution-commit step; the umbrella rule (execution commit separate from process commits) is carried as an instruction.
- R1-e (RESIDUAL, E13): `all-context.md:158,205` ("37 validators") and `tests/all-tests.md:83` (CI description) go stale after this phase; UPDATE PROCESS reconciles them.
- K1-1: `orchestration.md` §Regression Gate Validators and the validator registry docs will not list the new validator until Phase 4 (it owns those files): known-gap: documented as NEW PLAN REQUIRED — see backlog stub to be written by this phase's UPDATE PROCESS (`process/general-plans/backlog/model-effort-validator-registry_NOTE_29-10-26.md`; run `mkdir -p process/general-plans/backlog` first)
- K1-2: added CI steps passing on ubuntu: known-gap: documented as NEW PLAN REQUIRED — Phase 8 (needs a real push)

### What This Coverage Does NOT Prove

- R1.1/R1.2 prove the validator enforces the table written in it; they do not prove the table is the right policy (the user's recorded decision B and R1.10 cover that), nor that opus or sonnet is the better choice for any agent (deferred, unmeasured).
- R1.3 proves the front-matter is well formed and Claude/Codex names match; it does not prove model behavior or cost changes.
- R1.4 proves the NAME of each validator appears in `validate.yml`; it does not prove each step passes on ubuntu or that arguments are right (E6/E7 and the Phase 8 push cover that). Fixture-based steps test the validator, not the kit.
- R1.5 proves the trigger block parses and contains `push` on `main` and `pull_request`; not that GitHub accepts the whole workflow.
- R1.6 proves the number is the same at the 40 matched sites; not that prose elsewhere (for example "14 VC-system behavior validators", or the Phase 0 context docs, R1-e) is accurate.
- R1.7/R1.8 compare against `P1_START` and prove nothing about earlier phases; R1.7 proves effort values moved, not the quality effect of `effort: max`.
- R1.11 is a regex over 10 files: it proves the known wrong phrasings are gone, not that no differently worded wrong claim exists elsewhere (a repo-wide scan in this pass found none); R1.12 proves the table cells, not the surrounding prose.
- R1.13 (translations) rests on judgment and the mechanical backstop; native-speaker quality is Phase 7's concern.
- Nothing here measures answer quality of any agent (no `model:` changed; the program-level equivalence gate is Phase 8, C-EQ).
- This contract is not valid evidence for Phase 1 inner steps 1-3 (RESEARCH, INNOVATE, PLAN-SUPPLEMENT), which are still unchecked; a newer Inner Loop Refresh Note from them re-triggers V1 (E15).

Gate: PASS (0 FAIL, 0 MUST-FIX; 5 RESIDUAL items resolved by contract instruction and 2 named Known-Gaps carried). Not subject to the first-pass CONDITIONAL rule. PVL cycles 1-4 are recorded in `results.tsv` (6 lines); this inner pass adds no plan supplement, so the orchestrator's bookkeeping row for it is a plain confirmation row.
Accepted by: not required for PASS; Known-Gaps K1-1 and K1-2 and residuals R1-a..R1-e are recorded above as named items (session: inner-pvl phase-1, autonomous /goal execution).

History note: the "Supplement cycle 1", "Supplement cycle 2", "PVL cycle 3 note" and "Supplement (user decisions 2026-10-29 ...)" sections below were written against earlier contracts; where they say "validate-contract above kept unchanged" they refer to that earlier text, which is replaced by this contract (git history, HEAD 7845316).


### Supplement cycle 1 (29-10-26)

Plan sections updated (validate-contract above kept unchanged). Gaps addressed:

- G1-1: A1 holds the explicit policy table (execute/fast-mode/quick-fix opus+max, plan/validate sonnet+high, update-process sonnet+medium, git-manager sonnet+low, rest sonnet unchanged); locked decision `max` per implementation-standards.md; validator enforces only documented rows; token-cost note required in the report.
- G1-2: `.codex/` removed from Blast Radius and from C1; gate R1.8 `git diff --stat $P1_START -- .codex` prints nothing.
- G1-3: B2 defines `--root <dir>` and fixture layout `fixtures/model-effort-pass|fail/.claude/agents/*.md`, plain-language error text; B3 registers the script in `vc-audit-vc/SKILL.md` (added to Blast Radius; registry change requested).
- G1-4: D1 rewritten: N computed after B2 (expected 38), 4 sites x 10 files, regex `(<h3>|\*\*|🛡️ )36\b`; Exit Gate uses the two regex commands (no 36; N appears 40 times).
- G1-5: E1 adds `push` on main; E2 lists the absent validators, drops kit-portability from the to-add list, adds the missing-name loop; E3 local run first.
- G1-6: Strategy states group (b) D/E start after B2.
- G1-7: diff gate (R1.7) added to Exit Gate using `$P1_START`.
- G1-8: Entry Gate records `.agents/skills` reds as environment-caused or resolved; regression judged by `baseline/compare.sh`.
- Open registry/umbrella changes requested of the owner: Phase 1 claim drops `.codex/`, adds `.claude/skills/vc-audit-vc/SKILL.md`; Phase 1 also touches `.claude/skills/vc-audit-vc/scripts/fixtures/model-effort-*`.

### Supplement cycle 2 (29-10-26)

Plan body updated (validate-contract above kept unchanged). Gaps addressed:

- G1-9: E2 now holds a 21-row table giving the exact CI command and argument form of every validator to add (files, directories, `.tsv`, flag-only, no-fixture cases, the autopilot fixture's different folder); E3 reconciles R1.4 with "no silently failing step": run each locally, exit 0 -> normal step, non-zero -> same step with `continue-on-error: true` plus a cause comment, listed in the phase report. B4 appends the new validator to `baseline/validators.list`.
- G1-10: Exit Gate gives each validator its own `; echo $?`; the trigger check parses the YAML with PyYAML (`on` read as key `True` under YAML 1.1) and asserts `push` on `main` plus `pull_request`; `P1_START` is written to `baseline/p1_start.txt` in the Entry Gate and read back in the Exit Gate; `git diff --check` excludes the program folder.
- Hand-offs to the owner/registry: Phase 1 now also writes `baseline/p1_start.txt` and appends one line to `baseline/validators.list` (Phase 0 evidence folder); registry Phase 1 claim should list both.

### PVL cycle 3 note (29-10-26)

Re-validated from V1 by running the phase commands in a throw-away copy of the repo (deleted afterwards). Result: Gate PASS, no plan-body change needed; the residual items are carried in the contract as Execute-agent instructions and named Known-Gaps (see the contract's Open gaps).


### Supplement (user decisions 2026-10-29: quality-equivalence + model direction)

- Decision B applied: no agent `model:` changes (7 opus / 8 sonnet stay); A1 table rewritten to the real assignment; validator enforces documented rows only (model for 15 agents, `effort: max` x3, `effort: low` for git-manager); fixtures, B1/B2, C1/C2, diff gate and Exit Gate updated; new Step D2 (README model facts in 10 files) and Step F (CLAUDE.md, strategy-compare SKILL.md, implementation-standards.md, orchestration.md, vc-system-behavior 04/07/08, all-context.md); `AGENTS.md` verified to have no model text.
- Decision A (hard quality requirement for the whole program) does not change this phase's steps. It does remove the Phase 1 model change from the golden measurement (Phase 3 plan) and adds a FINAL EQUIVALENCE GATE in Phase 8. This phase's contribution: the validator and the corrected docs are part of the mechanical evidence the Phase 8 gate re-runs.
- Known date caveat for the PVL re-run: `vc-validate-agent` V1 compares the Refresh Note date with the contract date; both are 2026-10-29 (date-only format), so the orchestrator must route this plan to vc-validate-agent explicitly (do not rely on the date comparison) and the new contract must carry a later `Date:` than this note's content.
- Deferred, optional, NOT in this program: measure sonnet versus opus on the golden tasks and only then consider lowering any model for cost.
