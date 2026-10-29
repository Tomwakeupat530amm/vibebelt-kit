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

Remove the contradictions the kit has today so later phases build on a consistent base: agent `model:`/`effort:` front-matter disagrees with the Model Selection Policy in CLAUDE.md (research, plan, validate and tester are `opus`, but the policy says only execute, fast-mode and quick-fix are opus; execute-agent has `effort: low` while the doc calls for max on opus agents); README says both 36 and 37 validators; CI skips some validators. Add a NEW validator that stops this drift from coming back.

---

## Entry Gate

- Phase 0 exit gate green (git, baseline, `all-context.md`, `tests/all-tests.md`).
- Phase 0 step C resolved `.agents/skills` OR the two environment reds (validate-skills, validate-context-discovery) are recorded in `baseline/validators_before.txt` as environment-caused. "Red validator" in this phase means "worse than the Phase 0 baseline", judged mechanically by `bash process/general-plans/active/vibebelt-rebrand_29-10-26/baseline/compare.sh` (exit 0 = not worse).
- Path variables used below: `P=process/general-plans/active/vibebelt-rebrand_29-10-26`, `B=$P/baseline`, `EX=":!$P"`. Before any edit save the start commit to a FILE (a spawned tester shell has no shell variables): `git rev-parse HEAD > $B/p1_start.txt`, and copy the value into the phase report. The diff gates read it back with `P1_START=$(cat $B/p1_start.txt)`.
- Runtime: use `node.exe` in this WSL (no `node`) unless the user has installed Linux Node 22 (user action, see Phase 0 Entry Gate).

---

## Strategy Recommendation (vc-agent-strategy-compare)

- Signals: S7 yes (15 agents + README + 9 i18n + CI + new validator + registry doc) — score about 2/7 (MEDIUM).
- Recommended: **Parallel subagents**, 2 groups with disjoint files, ONE ordering rule: (a) agent front-matter + new validator + fixtures + `vc-audit-vc/SKILL.md` line; (b) README + 9 i18n count fix + CI workflow. Group (b) steps D1 and D2 start only AFTER group (a) step B2 (validator script exists on disk and fixtures pass) is done in the working tree, because the README count (N) and the CI list depend on the new validator. Group (b) may prepare nothing earlier than B2. Alternative: one sequential implementing pass A, B, C, D, E (same result, simpler). Research/plan/validate = sonnet; implementing subagents = opus. Cost note: 4 + 4 + 2 = 10 agents, under the 30-agent guard.

---

## Blast Radius

- `.claude/agents/*.md` (front-matter lines `model:` and `effort:` ONLY). `.codex/` is OUT of this phase: `.codex/agents/*.toml` have no model/effort fields and the Codex model is global in `.codex/config.toml` (stays unchanged).
- `.claude/skills/vc-audit-vc/scripts/validate-model-effort-policy.mjs` (NEW) + `fixtures/model-effort-pass/.claude/agents/*.md` and `fixtures/model-effort-fail/.claude/agents/*.md`
- `.claude/skills/vc-audit-vc/SKILL.md` (one line registering the new validator)
- `README.md`, `docs/i18n/README.*.md` (9 copies) — validator count only (4 sites per file, 40 total)
- `.github/workflows/validate.yml`
- `process/general-plans/active/vibebelt-rebrand_29-10-26/baseline/p1_start.txt` (NEW) and one appended line in `baseline/validators.list` (program evidence folder, not kit code)

---

## Implementation Checklist

### Step A — Decide the policy table (before editing)

- [ ] A1. Write this EXPLICIT table into the phase report (it follows `process/development-protocols/implementation-standards.md` §Agent Frontmatter Conventions as written — LOCKED decision; Q5 wording "high" is superseded by the document's `max` for opus execution agents):

  | Agent | model | effort |
  |---|---|---|
  | vc-execute-agent, vc-fast-mode-agent, vc-quick-fix-agent | opus | max |
  | vc-plan-agent, vc-validate-agent | sonnet | high |
  | vc-update-process-agent | sonnet | medium |
  | vc-git-manager | sonnet | low |
  | every other agent (research, tester, spec, innovate, debugger, code-reviewer, code-simplifier, ui-ux-designer) | sonnet | left as it is today (no document defines it; the validator does not check it) |

  The validator enforces ONLY the documented rows above plus "model is opus if and only if the agent is one of the three execution agents". Before editing, re-read the doc in research and confirm the rows still match; a mismatch is a stop (ask the user). The phase report MUST state the token-cost impact: execute, fast-mode, quick-fix effort low -> max (more tokens per run, higher quality), plan low -> high, research/plan/validate/tester opus -> sonnet (cheaper); net effect to be described in plain words with the old and new value for all 15 agents.

### Step B — New validator (test first)

- [ ] B1. Write failing fixtures first: `fixtures/model-effort-pass/.claude/agents/*.md` (correct values per the table) and `fixtures/model-effort-fail/.claude/agents/*.md` (drifted values: e.g. a sonnet agent set to opus, execute set to low). Save the red-first output (validator absent or exit non-zero on fail fixture) in the phase report.
- [ ] B2. Implement `validate-model-effort-policy.mjs`: reads `<root>/.claude/agents/*.md` front-matter, where `--root <dir>` is optional and defaults to the repo root (same convention as `validate-kit-portability.mjs`); compares with the table; exit 1 on drift; error text in plain words naming agent + field + expected value ("vc-plan-agent: model is opus, expected sonnet"). Additive only: never edit another validator's checks. Make the fail fixture exit 1 and the pass fixture exit 0.
- [ ] B3. Add one line for the new script to `.claude/skills/vc-audit-vc/SKILL.md` (audit validator list). Registry note: the SKILL.md file is added to Phase 1's registry claim; `orchestration.md` §Regression Gate Validators stays unchanged until Phase 4 (known-gap, backlog stub written at UPDATE PROCESS in `process/general-plans/backlog/model-effort-validator-registry_NOTE_29-10-26.md`; that gate stays CONDITIONAL).

- [ ] B4. Append one line `validate-model-effort-policy<TAB>node .claude/skills/vc-audit-vc/scripts/validate-model-effort-policy.mjs` to `baseline/validators.list` so later phases keep running it. The Phase 0 reference TSV has no row for it: `compare.sh` prints `NOTE new validator` and does not count it as worse; Phase 1 EVL records its first exit code (0).

### Step C — Fix agents (only two lines per file change)

- [ ] C1. First run the new validator on the real agents and confirm exit 1 (red-first, save output). Then edit ONLY the `model:` and `effort:` lines of each drifted `.claude/agents/*.md` per the table (drift confirmed: research, plan, validate, tester model; execute, fast-mode, quick-fix, plan effort). `.codex/` is NOT touched (agents there have no such fields).
- [ ] C2. Run the diff gate (R1.7); any other changed line in any agent file means revert that file and stop. Then run agent-parity + agent-frontmatter + the new validator: all exit 0.

### Step D — README count (starts after B2)

- [ ] D1. Compute `N=$(find .claude -name 'validate-*.mjs' -not -path '*/fixtures/*' | wc -l)` AFTER B2 (expected 38; today 37). Do not hand-count. Update ALL 4 sites in each of the 10 files (README.md and `docs/i18n/README.*.md`, 40 sites) found by `grep -nE '(<h3>|\*\*|🛡️ )36\b' README.md docs/i18n/README.*.md`; write N in each. Line numbers differ per file (README.md 61/270/1009/1011; de/es/fr/pt-BR/vi-VN 61/268/1006/1008; hi/ja-JP/ko-KR/zh-CN differ again): use the grep, not line numbers. Prose elsewhere (for example "14 VC-system behavior validators") is out of scope.

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
for f in $(find .claude -name 'validate-*.mjs' -not -path '*/fixtures/*'); do b=$(basename $f); grep -q "$b" .github/workflows/validate.yml || echo "MISSING $b"; done   # Expected: no output
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/validate.yml')); o=d.get('on', d.get(True)); assert 'push' in o and 'pull_request' in o and o['push']['branches']==['main']; print('ok')"   # Expected: ok (YAML 1.1 reads the key on as True)
grep -c 'continue-on-error: true' .github/workflows/validate.yml                   # Expected: equals the number of "CI steps allowed to fail" in the phase report (record it)
git diff -U0 $P1_START -- .claude/agents | grep -E '^[+-]' | grep -vE '^(\+\+\+|---)' | grep -vE '^[+-](model|effort):'   # Expected: no output
git diff --stat $P1_START -- .codex                                                # Expected: no output
bash $B/compare.sh; echo $?                                                        # Expected: 0 (not worse than the Phase 0 baseline; prints NOTE new validator for the new script)
git diff --check $P1_START -- . "$EX"                                              # Expected: no output
```

- New validator proven on both fixtures (pass exits 0, fail exits non-zero) and on the real agents.
- The phase report contains the 15-agent old/new table and the token-cost note, citing `implementation-standards.md` §Agent Frontmatter Conventions.

---

## Blockers That Would Justify BLOCKED Status

- The policy table in `implementation-standards.md` no longer matches Step A1 (ask; do not guess).
- Parity validator was already red at baseline for an unrelated reason (record, ask).
- A validator step cannot be added to CI without failing locally and the failure cannot be explained (record, do not add silently).

---

## Phase Completion Rules

- CODE DONE = checklist items done; VERIFIED = Exit Gate commands pass AND `compare.sh` exits 0 (suite not worse than the Phase 0 baseline) AND regression checkpoint passes AND validate-contract exists.
- Known-Gap alone never makes a behavior PASS; write a backlog stub and keep that gate CONDITIONAL.

## Acceptance Criteria

- See the Exit Gate commands and the Verification Evidence table; each row names the charter criterion it proves (proven by + strategy).

## Touchpoints

- Agent front-matter (`model:`/`effort:` lines only), one new script + fixtures, `vc-audit-vc/SKILL.md`, README + 9 translations, CI workflow

---

## Public Contracts

- Agent names, tool grants, signal strings, and prompt bodies unchanged. Only `model:`/`effort:` values move; proven mechanically by the diff gate (R1.7). Codex agent set and `.codex/config.toml` unchanged (R1.8).

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
| diff gate: only `model:`/`effort:` lines change | Fully-Automated | C-P1 (R1.7): public contract held |
| `.codex` untouched | Fully-Automated | C-P1 (R1.8): Codex scope |
| `compare.sh` exit 0 + `git diff --check $P1_START -- . ":!$P"` prints nothing (`P1_START` read from `baseline/p1_start.txt`) | Fully-Automated | C-P1 (R1.9): not worse than baseline |
| phase report table + token-cost note vs the doc | Agent-Probe | C-P1 (R1.10): effort documented |
| CI steps actually pass on ubuntu runner | Known-Gap residual (needs a real push, Phase 8); backlog stub, gate stays CONDITIONAL, never PASS on this alone | C-P1 (R1.4) residual |

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

- Selected plan file path: `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-01-fix-inconsistencies_PLAN_29-10-26.md`
- Last completed step: not started
- Validate-contract status: written 29-10-26 (generated-by outer-pvl); PVL cycle 3 re-validation 29-10-26 from V1 on the supplemented plan: Gate: PASS (0 FAIL, 0 MUST-FIX; residuals carried as named Known-Gaps and Execute-agent instructions)
- Supporting context files: umbrella plan, `phase-blast-radius-registry.md`, prior phase report (if any)
- Next step: step 1 RESEARCH of this phase when its turn comes (strict phase order); the inner PVL re-runs only if an Inner Loop Refresh Note newer than the contract is written. EXECUTE starts after the Phase 0 exit gate is green.

---

## Validate Contract

Status: PASS
Date: 29-10-26
date: 2026-10-29
generated-by: outer-pvl
supersedes: 2026-10-29 (outer-pvl) — cycle-2 CONDITIONAL contract (G1-9, G1-10); PVL cycle 3 re-validation from V1 has current evidence

Parallel strategy: parallel-subagents (2 groups, one ordering rule: README and CI start after the validator exists)
Rationale: score 2/7 (S4 phase program, S7 five or more files: 15 agents + README + 9 translations + CI + new script). Dominant signal S7. Group (b) README/CI steps D and E depend on step B2 of group (a), so a single sequential implementing pass A, B, C, D, E is an equally valid choice. Models: planning/validation sonnet, implementing subagents opus. Fan-out cost if used: 4 (Layer 1) + 5 (Layer 2: Steps A-E) + 2 implementers = 11, up to 14 with optional reviewer/tester/security (under the 30-agent guard). This cycle-3 pass was ONE fire-and-forget validate-agent with direct repo inspection plus a throw-away dry run (no sub-agent fan-out possible).

### Real-repo facts checked (V1, cycle 3)

- Agent front-matter today matches the A1 policy table input: opus = research (low), plan (low), validate (high), tester (low), execute (low), fast-mode (low), quick-fix (low); sonnet = code-reviewer (high), code-simplifier (medium), debugger (high), git-manager (low), innovate (medium), spec (medium), ui-ux-designer (medium), update-process (medium). Structural plan check: exit 0, two advisory "legacy plan shape" warnings.
- **Dry run in a copy of the repo (same drive type, git repo present, Phase 0 state):**
  - Applying exactly the A1 table (execute/fast-mode/quick-fix effort `max`; plan/validate `sonnet` + `high`; research/tester `sonnet`) leaves `validate-agent-parity`, `validate-agent-frontmatter`, `validate-protocol-wiring` and `validate-guide-sync` at exit 0, and the diff gate (`git diff -U0 ... -- .claude/agents | grep -E '^[+-]' | grep -vE '^(\+\+\+|---)' | grep -vE '^[+-](model|effort):'`) prints nothing.
  - Fixtures laid out as `.claude/skills/vc-audit-vc/scripts/fixtures/model-effort-{pass,fail}/.claude/agents/*.md` do not disturb any other validator (parity, skills, portability, guide-sync, protocol-wiring, invocation-wiring, frontmatter, context-discovery, skill-keywords/cross-refs/routing, confusable, protocol-discovery, plan-inventory all unchanged), and `resolve-manifest.mjs` does NOT list them (dot-directory); a new script `validate-model-effort-policy.mjs` adds exactly one line to the resolver list. One added line in `vc-audit-vc/SKILL.md` leaves the skill validators at exit 0.
  - `find .claude -name 'validate-*.mjs' -not -path '*/fixtures/*' | wc -l` = 37 (38 after B2); the README regex `(<h3>|\*\*|🛡️ )36\b` hits exactly 4 sites in each of the 10 files (40 total) and `37`/`38` have no pre-existing hits at those sites; there are 9 translated READMEs.
  - `validate.yml` parses with PyYAML 6.0.3 as `on = {pull_request: {branches: [main]}}` today; the missing-name loop lists exactly the 20 names that rows 1-7 and 9-21 of the E2 table cover (checked name by name).
- **The 21-row CI table, every command run locally (exit codes on the real files):** rows 1, 2, 4, 6, 7, 9 (prints a WARN about `TBD` test gates but exits 0), 10-18, 20, 21 exit 0. Row 3 (`validate-eval-coverage`) exits 1 ("scenarios directory not found / coverage map empty"): the plan already expects this red. Row 19 (`validate-risk-artifacts` on the evidence-pack pass directory) exits 1 ("risk-gate.json missing", the fixture uses a different file layout): the plan already expects this red. **Row 5 (`validate-phase-reports ... /pass` with a DIRECTORY) exits 1 with `EISDIR`: that validator takes an umbrella plan FILE.** With `.../validate-phase-reports/pass/umbrella.md` it exits 0 (see R1-a).

### Prior gaps G1-9, G1-10: re-check against the real repo

- G1-9 CLOSED (with one correction, R1-a): the 21-row table gives an exact command per validator; the E3 rule (exit 0 -> normal step, non-zero -> same step with `continue-on-error: true` and a cause comment) makes R1.4 satisfiable without hiding anything; all 20 absent names are covered.
- G1-10 CLOSED: each validator has its own `; echo $?`; the PyYAML check asserts `push` on `main` plus `pull_request`; `P1_START` is persisted to `baseline/p1_start.txt` and read back.

### Plan updates applied

None in this pass (validate-agent writes the contract only). No plan edit is required: the one wrong cell found (R1-a) is bounded and is resolved by Execute-agent instruction E9, which overrides the plan text and does not change the Exit Gate.

### Execute-agent instructions

- E1. Runtime: use `node.exe` (no `node` in WSL); keep fixtures and commands runtime-neutral.
- E2. Write the red state first: run the new validator on the real agents and on the fail fixture, confirm non-zero, save the output; then edit.
- E3. Per agent file touch only the `model:` and `effort:` lines; run the R1.7 diff gate after editing; any other changed line means revert that file and stop.
- E4. Do NOT touch `.codex/**`; gate R1.8 proves it.
- E5. Compute N with the `find` command AFTER the new script exists; write the same N in all 40 sites; do not hand-count.
- E6. For each validator added to `validate.yml`, run the exact command locally first. A step that fails locally is added as `continue-on-error: true` with a comment naming the cause (so the R1.4 name check still passes and CI is not broken), and listed in the phase report; never add a failing step silently and never remove or weaken an existing step. Write the comment so that it does NOT contain the text `continue-on-error: true` (the Exit Gate counts that text).
- E7. The new validator is additive only; never edit another validator's checks.
- E8. Save `P1_START` to `process/general-plans/active/vibebelt-rebrand_29-10-26/baseline/p1_start.txt` as well as the phase report, so a spawned tester shell can read it.
- E9. R1-a (E2 table row 5 correction): the CI command for `validate-phase-reports.mjs` takes the umbrella FILE: `node .claude/skills/vc-audit-plans/scripts/validate-phase-reports.mjs .claude/skills/vc-audit-plans/scripts/fixtures/validate-phase-reports/pass/umbrella.md` (exit 0 on this tree). Use that, not the directory form in the table. Row 19 and row 3 are expected red and take the E6 `continue-on-error` rule; row 9 exits 0 and gets a normal step. In all rows trust the exit code you measure, not the plan's expectation.

### Test gates

Test context: `process/context/tests/all-tests.md` does not exist until Phase 0; tiers come from the real validator scripts. Re-check against the generated doc at execution time.

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P1 (R1.1) | new policy validator accepts a correct agent set and rejects a drifted one | Fully-Automated | `node.exe .claude/skills/vc-audit-vc/scripts/validate-model-effort-policy.mjs --root .claude/skills/vc-audit-vc/scripts/fixtures/model-effort-pass; echo $?` = `0`; same with `.../model-effort-fail` = `1` and the message names agent + field + expected value | B |
| C-P1 (R1.2) | the real agents follow the policy | Fully-Automated | `node.exe .claude/skills/vc-audit-vc/scripts/validate-model-effort-policy.mjs; echo $?` = `0` | B |
| C-P1 (R1.3) | front-matter valid and Claude/Codex names match | Fully-Automated | `node.exe .../validate-agent-parity.mjs; echo $?` = `0` and `node.exe .../validate-agent-frontmatter.mjs; echo $?` = `0` (each with its own `echo $?`) | A (both 0 today and after the A1 values, dry run) |
| C-P1 (R1.4) | CI names every validator that exists | Fully-Automated | the missing-name loop over `validate.yml` prints nothing | B (E2 table and E3 rule; row 5 corrected by E9) |
| C-P1 (R1.5) | CI triggers on the branch we commit to, YAML still valid | Fully-Automated | `python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/validate.yml')); o=d.get('on', d.get(True)); assert 'push' in o and 'pull_request' in o and o['push']['branches']==['main']; print('ok')"` = `ok` | B |
| C-P1 (R1.6) | validator count is the same real number everywhere | Fully-Automated | `N=$(find .claude -name 'validate-*.mjs' -not -path '*/fixtures/*' \| wc -l)` = 38; `grep -rnE '(<h3>\|\*\*\|🛡️ )36\b' README.md docs/i18n/README.*.md` prints nothing; the same regex with `$N` counts 40 lines | A (regex verified on the real files) |
| C-P1 (R1.7) | only `model:` / `effort:` lines moved in agent files | Fully-Automated | `git diff -U0 $P1_START -- .claude/agents \| grep -E '^[+-]' \| grep -vE '^(\+\+\+\|---)' \| grep -vE '^[+-](model\|effort):'` prints nothing | A (dry run) |
| C-P1 (R1.8) | Codex agent set untouched | Fully-Automated | `git diff --stat $P1_START -- .codex` prints nothing | A |
| C-P1 (R1.9) | whole suite not worse than the Phase 0 baseline | Fully-Automated | `bash process/general-plans/active/vibebelt-rebrand_29-10-26/baseline/compare.sh; echo $?` = `0` (prints `NOTE new validator` for the new script) and `git diff --check $P1_START -- . ':!process/general-plans/active/vibebelt-rebrand_29-10-26'` prints nothing | A (Phase 0 `compare.sh` behaviour reproduced) |
| C-P1 (R1.10) | effort table and cost impact documented and match the docs | Agent-Probe | reviewer reads the phase report: 15-agent old/new table, execute effort change, token-cost note, citation of `implementation-standards.md` §Agent Frontmatter Conventions | A |
| C-P1 (R1.4 residual) | the added CI steps actually pass on an ubuntu runner | Agent-Probe | cannot run here; needs a real push (Phase 8) | D (backlog stub; named residual, not a proof) |

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
test("should change only model and effort lines in agent files", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should change only model and effort lines in agent files")
})
Failing stub (R1.8):
test("should leave the Codex agent files untouched", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should leave the Codex agent files untouched")
})
Failing stub (R1.9):
test("should not be worse than the Phase 0 validator baseline", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should not be worse than the Phase 0 validator baseline")
})
```

Legacy line form (kept for existing consumers):
- policy validator: [Fully-automated: `node.exe .../validate-model-effort-policy.mjs --root <pass-fixture>` exit 0 | fail-fixture exit 1]
- agents match policy: [Fully-automated: validate-model-effort-policy.mjs + validate-agent-parity.mjs + validate-agent-frontmatter.mjs]
- CI coverage: [Fully-automated: missing-name loop over validate.yml + PyYAML trigger check]
- README counts: [Fully-automated: regex count 40 of N]
- cost / effort table: [agent-probe: phase report review]
- CI passes on ubuntu: [known-gap: documented as NEW PLAN REQUIRED, Phase 8]

High-risk class: none (no auth, billing, schema, public API, secrets). The change alters runtime behavior of spawned agents (model and effort), which is the intended effect; the quality effect of the opus-to-sonnet move is measured by the Phase 3 golden comparison. No evidence pack needed.

### Dimension findings

- Infra fit: PASS — Codex scope correct (no model/effort fields); `push` trigger planned; policy table matches both source documents and the frontmatter validator accepts `max`; dry run shows the fixtures and the A1 values disturb no other validator and no resolver output.
- Test coverage: PASS — every developed behavior has a Fully-Automated gate; all 21 CI commands were run: the two expected reds (rows 3, 19) take the E6 rule; the one wrong argument form (row 5, R1-a) is corrected by instruction E9.
- Breaking changes: PASS — the only behavior change is agent model/effort, documented with a cost note; the diff gate proves nothing else moves; Codex untouched; prose and signal strings unchanged.
- Security surface: PASS — no auth, secrets or data; the new validator is read-only.
- Section A (Policy table): PASS — explicit table, verified against the docs and the 15 real front-matter blocks.
- Section B (New validator, test first): PASS — TDD order, `--root` convention verified, registry line in `vc-audit-vc/SKILL.md` verified harmless.
- Section C (Fix agents): PASS — drift confirmed for exactly the agents the plan names; two-line diff gate valid and empty in the dry run.
- Section D (README count): PASS — regex, 40 sites and N=38 verified on the real files.
- Section E (CI): PASS — 20 absent validators exactly as listed; commands run; R1.4 vs "no silently failing step" reconciled by E3/E6/E9.

Net gate derivation: Layer 1 = 0 FAIL / 0 CONCERN / 4 PASS; Layer 2 = 0 FAIL / 0 CONCERN / 5 PASS. MUST-FIX count: 0. RESIDUAL (bounded, named): 1 wrong table cell resolved by instruction (R1-a) and 2 Known-Gaps (K1-1, K1-2). Net gate: PASS.
Vacuous-green check: every developed behavior has a Fully-Automated gate; R1.10 is Agent-Probe for judgment only; CI-on-ubuntu is a named residual with a backlog stub and never the sole proof. No behavior rests on a residual alone.

### Open gaps

- R1-a (RESIDUAL, resolved by instruction E9): E2 table row 5 passes a directory; the validator takes the umbrella file.
- K1-1: orchestration.md §Regression Gate Validators and the validator registry docs will not list the new validator until Phase 4 (it owns those files): known-gap: documented as NEW PLAN REQUIRED — see backlog stub to be written by this phase's UPDATE PROCESS (`process/general-plans/backlog/model-effort-validator-registry_NOTE_29-10-26.md`; run `mkdir -p process/general-plans/backlog` first)
- K1-2: added CI steps passing on ubuntu: known-gap: documented as NEW PLAN REQUIRED — Phase 8 (needs a real push)

### What This Coverage Does NOT Prove

- R1.1/R1.2 prove the validator enforces the table written in it; they do not prove the table is the right policy (R1.10 and the user's recorded Q5 decision cover that).
- R1.3 proves the front-matter is well formed and Claude/Codex names match; it does not prove model behavior or cost changes.
- R1.4 proves the NAME of each validator appears in `validate.yml`; it does not prove each step passes on ubuntu or that arguments are right (E6/E9 and the Phase 8 push cover that). Fixture-based steps test the validator, not the kit.
- R1.5 proves the trigger block parses and contains `push` on `main` and `pull_request`; not that GitHub accepts the whole workflow.
- R1.6 proves the number is the same at the 40 matched sites; not that prose elsewhere (for example "14 VC-system behavior validators") is accurate.
- R1.7/R1.8 compare against `P1_START` and prove nothing about earlier phases.
- Nothing here measures answer quality of the re-modeled agents (Phase 3 golden comparison, for the model change separately from the slimming).

Gate: PASS (0 FAIL, 0 MUST-FIX; 1 wrong table cell resolved by contract instruction and 2 named Known-Gaps carried). Not subject to the first-pass CONDITIONAL rule: PVL cycles 1 and 2 are recorded in `results.tsv`.
Accepted by: not required for PASS; Known-Gaps K1-1 and K1-2 are recorded above as named residuals (session: outer-pvl cycle 3, autonomous /goal execution).

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
