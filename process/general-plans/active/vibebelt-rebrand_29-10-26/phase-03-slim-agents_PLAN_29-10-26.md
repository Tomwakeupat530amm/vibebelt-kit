---
name: plan:vibebelt-rebrand-phase-03-slim-agents
description: "vibebelt-kit rebrand — Phase 03: Instrument and freeze (no slimming): signal census, guardrail hashes, frozen golden tasks for the Phase 8 equivalence gate; zero billed model calls"
date: 29-10-26
metadata:
  node_type: memory
  type: plan
  feature: general-plans
  phase: phase-03
---

# Phase 03 — Instrument and freeze (no slimming)

**Program:** vibebelt-rebrand
**Umbrella plan:** process/general-plans/active/vibebelt-rebrand_29-10-26/vibebelt-rebrand-umbrella_PLAN_29-10-26.md
**Phase status:** ⏳ PLANNED (re-scoped 2026-10-30 by user decision: no slimming)
**Complexity:** COMPLEX
**Report destination:** process/general-plans/active/vibebelt-rebrand_29-10-26/phase-03-slim-agents_REPORT_29-10-26.md (flat in the program task folder; the file name keeps the old `slim-agents` slug on purpose so every path already cited by other plans stays valid)

TL;DR: Phase 3 no longer edits any agent. It builds and freezes the measuring tools and the golden task set that the Phase 7 signal check and the Phase 8 FINAL EQUIVALENCE GATE need, with ZERO billed model calls.

---

## Overview

One phase of the vibebelt-rebrand program; program context lives in the umbrella plan. Context router: `process/context/all-context.md`. Test routing: `process/context/tests/all-tests.md` (load before assigning tiers).

Date: 29-10-26 (re-scoped 2026-10-30)
Status: PLANNED
Complexity: COMPLEX (scripts with exact specs + a frozen test asset; no product code)

## Purpose

USER DECISION (LOCKED 2026-10-30): **drop the agent slimming.** Reasons: about 80 billed calls (roughly $150-$1,500), behaviour risk, and the hard quality requirement C-EQ (the new kit must be at least equal to the old kit). Consequences:

- The 15 `.claude/agents/*.md` files and the 15 `.codex/agents/*.toml` mirrors stay **byte-identical to HEAD `b17294d`** through Phase 3. No `references/` folder is created under either agents directory.
- Phase 3 makes **zero billed model calls** (no `claude -p`, no judge, no probe). Billed runs happen only in Phase 8 B4, behind its own cost hard stop.
- Phase 3 now delivers instruments and a frozen asset:
  1. a correct, extended **signal census** (`golden/signal-census.mjs` + baseline `golden/signal-census-phase3.txt`, both pinned paths Phase 7 and Phase 8 read);
  2. a **guardrail hasher** (`golden/gen-guardrails.mjs` with `--root` and `--out`) and its baseline `golden/guardrails.json`;
  3. the **frozen golden task set** `golden/tasks/` (with `FROZEN.md` + `FROZEN.sha256`) that Phase 8 B4 re-runs on the OLD and FINAL kits;
  4. a harness-side **run recorder** `golden/run-record.mjs` used by Phase 8 B4 (tested here on fixtures only).
- Because agents stay unchanged, the real OLD-vs-FINAL differences that C-EQ will measure in Phase 8 are: `effort: max` on the 3 execution agents (`vc-execute-agent`, `vc-fast-mode-agent`, `vc-quick-fix-agent`; already on disk at `b17294d`, verified by `grep -c '^effort: max'`), the Phase 1 doc corrections, the Phase 2 identity edits, the Phase 4/5 doc and skill edits, the Phase 6 `vc-`→`vb-` rename and the Phase 7 prose edits.
- Dropped as slimming-only tools: `size-check.mjs`, `conservation-check.mjs`, `pointer-check.mjs`, `parity-compare.mjs` (and their snapshots `sizes-before.json`, `slimmed.list`, `pointers-before.json`, `agents-list-*.json`, `old/`, `phase1/`, `snapshots/`).

---

## Entry Gate

- Phase 2 exit gate green (DONE; HEAD `b17294d`, clean tree).
- `git diff --stat b17294d -- .claude/agents .codex/agents` prints nothing at phase start (record in the report).
- Phases 4 and 5 run after this phase (strict order 0..8).

---

## Strategy Recommendation (vc-agent-strategy-compare)

- Score: 1/7 (S7 only: about 25 new files, all inside the task folder `golden/**`; no schema/auth/API surface; no billed call).
- Recommended: **Sequential**, ONE `vc-execute-agent` (opus) writes the scripts, unit tests and golden task files in the order of the checklist. Parallel subagents add nothing (the census, hasher and recorder share fixture conventions; the task set must be written by one hand so it stays consistent), and an agent team is not needed (no blast-radius coordination; only one writer).
- Models (front-matter, no override): research / plan / validate / tester = opus; innovate / update-process = sonnet; execute = opus. No ad-hoc judge in this phase (no model runs).

---

## Blast Radius

- ONLY the task folder `golden/**` (new files): `signal-census.mjs`, `gen-guardrails.mjs`, `run-record.mjs`, `lib/` (shared helpers if any), `test/` (unit tests + fixtures), `signal-census-phase3.txt`, `guardrails.json`, `start.sha`, `determinism/` (scratch outputs of the double-run checks), and `tasks/**` (FROZEN).
- NOT touched: `.claude/agents/**`, `.codex/agents/**` (byte-identical to `b17294d`), every other repo file, the backlog folder (no backlog stub is needed any more: the Codex `references/` residual disappears with the slimming).
- Risk class: none of the high-risk classes (no auth, billing, schema, public API, deploy). The only outward cost risk (billed runs) is excluded by design and gated (see Exit Gate "no model call").

### Path variables and conventions (apply to every command in this plan)

```bash
T=process/general-plans/active/vibebelt-rebrand_29-10-26
G=$T/golden
GT=$G/tasks
```

- ALL commands run from the repo root with Linux `node` (v22.23.4; `node.exe` only if Linux node is missing, then normalise backslashes and use one runtime for every before/after pair).
- Agents are listed by DIRECTORY LISTING of top-level regular files only: `.claude/agents/*.md` and `.codex/agents/*.toml` (never a `vc-*` glob; subfolders ignored). Agent KEY = file name without extension, with a leading `vc-` or `vb-` removed (e.g. `vc-plan-agent.md` -> `plan-agent`).
- Sort every list with `LC_ALL=C sort` (scripts sort with a plain code-unit compare, which equals `LC_ALL=C`). No process substitution in gates: write both sides to files, then `diff`/`cmp`.
- Every script: `--root <dir>` (default: current dir), no network, no model call, no timestamps or absolute paths in its output (determinism), exit 0 = success, exit 2 = usage error.

---

## Implementation Checklist

### Step 0 - Start state (no model run anywhere in this phase)

- [ ] 0.1 Re-confirm test tiers from `process/context/tests/all-tests.md` and its routing chain (this phase only needs `node --test`, shell gates and `sha256sum`).
- [ ] 0.2 `mkdir -p $G`; `git rev-parse b17294d > $G/start.sha` (full sha) (Phase 8 B4.6(d) reads it: the agent files at this commit are the guardrail reference).
- [ ] 0.3 Record in the report: `git diff --stat b17294d -- .claude/agents .codex/agents` (empty), `ls .claude/agents | wc -l` = 15, `ls .codex/agents | wc -l` = 15, and `bash $T/baseline/compare.sh; echo $?` (start value).
- [ ] 0.4 Process rule, written into the report header: "Phase 3 makes no billed model call. No `claude`, `codex` or API command is run by any agent in this phase." The tester repeats this check at EVL (see Exit Gate).

### Step A - Signal census, fixed and extended (`$G/signal-census.mjs`)

- [ ] A1. Write the unit test FIRST (red): `$G/test/signal-census.test.mjs` (`node:test`) with fixture `$G/test/fixtures/census/` holding a fake `.claude/agents/vc-alpha.md`, `.claude/agents/vb-beta.md` and `.codex/agents/vc-alpha.toml`. The fixture text MUST contain at least: `PHASE_COMPLETE: PLAN-SUPPLEMENT — ...`, `PHASE_COMPLETE: PLAN — ...` (twice), `PHASE_COMPLETE: UPDATE PROCESS — ...`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, `BLOCKED` (status word), `BLOCKED-skipped` (must NOT count as `BLOCKED`), `VC-PREDICT-DEEP-NEEDED` (no colon), `VB-FEASIBILITY-VERDICT-READY:`, `SPAWN_REQUEST: vc-tester` (inside the toml `developer_instructions`), `Gate: CONDITIONAL`, a `[MODE: PLAN]` line, and the noise tokens `THIS:`, `SUMMARY:`, `MUST:`, `HIGH:`. Assertions: the 3 PHASE_COMPLETE variants are 3 distinct tokens with counts 1/2/1; the 3 status codes appear with exact counts; `BLOCKED-skipped` adds nothing to `BLOCKED`; the colon-less VC- signal is found; `SPAWN_REQUEST:` is found for kind `toml`; Gate and MODE tokens are found; none of the 4 noise tokens appear; keys are `alpha` and `beta` (prefix stripped); two runs give byte-identical output; `--neutral` maps `VC-`/`VB-` to the same token.
- [ ] A2. Implement `signal-census.mjs`. Interface: `node $G/signal-census.mjs [--root <dir>] [--neutral] [--out <file>]` (default: stdout; `--out` writes the same bytes to the file). Input: the directory listing rule above; text = the WHOLE file (`.md` incl. front-matter; `.toml` whole file, which contains `developer_instructions`), `\r\n` normalised to `\n`. Token classes, each matched with explicit boundaries (no letter, digit, `_` or `-` directly before or after the token):
  - `phase-complete`: `PHASE_COMPLETE: ` + phase name = one or more words of `[A-Z][A-Z0-9_-]*` joined by single spaces (so `PLAN`, `PLAN-SUPPLEMENT`, `UPDATE PROCESS`, `EVL` are distinct; the name stops at the first char that is not part of such a word, e.g. ` —`).
  - `colon-signal`: an uppercase token with at least one `_` or `-` inside, directly followed by `:` (`[A-Z][A-Z0-9]*(?:[_-][A-Z0-9]+)+:`), e.g. `SPAWN_REQUEST:`, `SUPPLEMENT_APPLIED:`, `QUICK_FIX_ABORT:`, `AUTOPILOT_ACTIVATED:`, `PHASE_SKIPPED:`. Single words like `THIS:` `SUMMARY:` `MUST:` `HIGH:` can never match. `PHASE_COMPLETE:` is NOT emitted here (it is the phase-complete class).
  - `prefix-signal`: `V[CB]-[A-Z]+(?:-[A-Z]+)+` with or without a trailing colon (colon dropped from the token), e.g. `VC-PREDICT-DEEP-NEEDED`, `VC-FEASIBILITY-PROBE-NEEDED`, `VC-PREDICT-RESEARCH-COMPLETE`, `VC-FEASIBILITY-VERDICT-READY`.
  - `status`: exactly `DONE`, `DONE_WITH_CONCERNS`, `BLOCKED`, `NEEDS_CONTEXT`, `CONTEXT_PARTIAL` as whole tokens (boundary rule above, so `BLOCKED-skipped` and `NEEDS_CONTEXT (partial)` are handled: the second still counts `NEEDS_CONTEXT`).
  - `gate`: `Gate: (PASS|CONDITIONAL|BLOCKED)`.
  - `mode`: `\[MODE: [^\]\n]+\]` (exact text, e.g. `[MODE: AUTOPILOT | <PHASE>]`).
  Output: one line per distinct `(key, kind, class, token)`: `<key>\t<md|toml>\t<class>\t<token>\t<count>`, sorted by code units, final newline, no header, no timestamps. `--neutral` rewrites `VC-`/`VB-` at token start to `V?-` and `vc-`/`vb-` inside tokens to `v?-` (so OLD and renamed trees compare directly). Without `--neutral` tokens are verbatim (Phase 7 normalises with `sed 's/VC-/VB-/g;s/vc-/vb-/g'`; that still works). Exit 1 if zero agent files were found (guards against a vacuous empty census).
- [ ] A3. Make A1 green: `node --test $G/test/signal-census.test.mjs`.
- [ ] A4. Real-tree baseline (agents are at `b17294d` byte-for-byte): `node $G/signal-census.mjs --out $G/signal-census-phase3.txt`. Determinism: `node $G/signal-census.mjs --out $G/determinism/census-2.txt` then `cmp $G/signal-census-phase3.txt $G/determinism/census-2.txt` (exit 0). Sanity in the report: line count, number of distinct keys (= 15), and that `SPAWN_REQUEST:` appears for `execute-agent` kind `toml` (grep-confirmed today in `.codex/agents/vc-execute-agent.toml`).

### Step B - Guardrail hasher (`$G/gen-guardrails.mjs`)

- [ ] B1. Unit test FIRST: `$G/test/gen-guardrails.test.mjs` with fixture `$G/test/fixtures/guardrails/` (one `.md` and one `.toml`). Fixture covers: `## Phase Lock` (selected) and `## Phase Lock Enforcement` (NOT selected); `## Completion` (selected) and `## Completion and Phase Handoff` (NOT selected); `### Session Start — FIRST ACTIONS` (level 3, selected); `## Autonomous /goal Execution Rules` (selected, prefix rule); a `## Purpose` line INSIDE a ``` fence (ignored) and a `~~~` fence; a level-2 section with a level-3 child (child bytes included in the parent hash); `\r\n` vs `\n` variants giving the same hash; inside the toml `developer_instructions`, one `\n` escape and one line-ending backslash inside a selected section, asserted to hash equal to the same section written with the decoded text (and one invalid escape `\q` in a separate temp copy, asserted exit 1); `--out` writing to a temp path while stdout stays empty; two runs byte-identical.
- [ ] B2. Implement `gen-guardrails.mjs`. Interface: `node $G/gen-guardrails.mjs [--root <dir>] [--out <file>]`; without `--out` it prints to stdout and writes NO file (it never writes `guardrails.json` implicitly, so Phase 8 B4.6(d) can run it against any tree safely). Rules:
  - Sources per agent key: the `.md` file text, and the `.toml` `developer_instructions` value (TOML multi-line basic string `"""..."""`). The value is DECODED per TOML 1.0 basic-string rules before hashing: `\b \t \n \f \r \" \\ \uXXXX \UXXXXXXXX`, and a line-ending backslash (backslash, optional trailing whitespace, newline) trims that newline plus all following whitespace and newlines. The script exits 1 with the file name and line ONLY on an INVALID escape (any other `\x`, or a bad/out-of-range `\u`/`\U` code point); it never guesses. Fact (grep-verified 2026-10-30): 7 escapes exist inside `developer_instructions` today: `vc-update-process-agent.toml` lines 416, 419, 560, 564 (line-ending backslashes in bash fences) and `vc-validate-agent.toml` line 433 (three `\n`); `\n` in other files sits only in `'''...'''` literal `description` strings (not decoded, not hashed). The selected sections hash identically raw or decoded today (the escapes sit outside them).
  - Lines inside fenced code blocks (opened by a line starting with ``` or `~~~`, closed by the same fence) are never headings.
  - Selected headings: ATX level 2 or 3 (`## ` / `### `) whose text, after the hashes and one space, either EQUALS `Phase Lock` or `Completion`, or STARTS WITH one of `Purpose`, `Entry Requirement`, `Strictly Forbidden`, `Violation Prevention`, `Session Start`, `Context Loading`, `Status Reporting`, `Autonomous /goal`. (Today's real headings, grep-confirmed: `Phase Lock` x4, `Phase Lock Enforcement` x1 not selected, `Completion` x5, `Completion and Phase Handoff` x1 not selected, 6 `Session Start ...` variants incl. one level 3, 4 `Autonomous /goal ...` variants.)
  - Section bytes: from the heading line up to (not including) the next heading OUTSIDE a fence whose level is less than or equal to the section's own level, or end of text. A level-2 section therefore INCLUDES its level-3 children; a selected level-3 section is also recorded on its own. Normalise `\r\n` to `\n`, strip trailing whitespace at the end of the section, then sha256 (hex) of the UTF-8 bytes.
  - Agent keys: the output ALWAYS has all 15 prefix-stripped agent keys (from the directory listing), with `"md":[]`/`"toml":[]` when an agent has no selected heading (today quick-fix and ui-ux-designer have none).
  - Output JSON: `{"schema":1,"agents":{"<key>":{"md":[{"heading":"<full heading line>","level":2,"sha256":"<hex>"}],"toml":[...]}}}`; agents sorted by key, entries in document order, 2-space indent, final newline, no root path or time.
- [ ] B3. Make B1 green: `node --test $G/test/gen-guardrails.test.mjs`.
- [ ] B4. Real-tree baseline: `node $G/gen-guardrails.mjs --out $G/guardrails.json`; determinism `node $G/gen-guardrails.mjs --out $G/determinism/guardrails-2.json && cmp $G/guardrails.json $G/determinism/guardrails-2.json`; `node -e` check that `Object.keys(require('./'+process.argv[1]).agents).length === 15` (argument `$G/guardrails.json`). Paste the per-agent heading list into the report once (reviewed by the executor).

### Step C - Run recorder (`$G/run-record.mjs`; used for real only in Phase 8)

- [ ] C1. Unit test FIRST: `$G/test/run-record.test.mjs` using a temp sandbox dir (created by the test with `fs.mkdtemp`, two fake agent files, `git init` + one commit made with an explicit identity on the command line, `git -c user.name=t -c user.email=t@t commit`, because this machine has no global git identity) and a synthetic stream file `$G/test/fixtures/stream/sample.jsonl`.
- [ ] C2. Implement. Interface:
  - `node $G/run-record.mjs record <sandbox-dir> <run-id> [--runs-dir <dir>]` (default runs dir `$G/runs`): writes `<runs-dir>/<run-id>.json` = `{run_id, sandbox_head (git rev-parse HEAD in the sandbox), agents: {<relative path>: sha256} for every top-level `.claude/agents/*.md` and `.codex/agents/*.toml` of the sandbox, runtime (process.version), recorded_at}` and refuses to overwrite an existing record (exit 1).
  - `node $G/run-record.mjs verify <sandbox-dir> <run-id> [--runs-dir <dir>]`: recomputes and exits 1 on any difference.
  - `node $G/run-record.mjs subagents <stream.jsonl> <run-id> [--runs-dir <dir>]`: reads a `claude -p --output-format stream-json --verbose` transcript line by line and adds `subagent_types: [sorted unique]` to the record, taken from `tool_use` content blocks whose `name` is `Task` or `Agent` (`input.subagent_type`). The real field names are UNVERIFIED (no billed probe in Phase 3): the parser accepts both tool names, ignores unknown lines, and records `subagent_parse: "unverified-schema"` until Phase 8's acknowledged rehearsal run confirms them.
  - Limitation written in the script header and the report: the record proves which agent FILES were on disk in the sandbox, not which prompt the model actually loaded.
- [ ] C3. Make C1 green: `node --test $G/test/run-record.test.mjs`. `$G/runs/` must not exist or be empty at phase end (tests use temp dirs only).

### Step D - Frozen golden task set (`$GT/`, written once, frozen in D8)

Design rule (found by RESEARCH): headless `claude -p` with a plain feature prompt stops at the first RIPER-5 gate (after RESEARCH, or before ENTER EXECUTE MODE), and autopilot needs an `AskUserQuestion` round a headless run cannot answer. Therefore each task STARTS AT THE PHASE UNDER TEST: its `fixture/` already contains the earlier artifacts, and its prompt is the single user message that enters that phase. Prompts are plain user language, identical for OLD and FINAL, and name NO `vc-`/`vb-` agent or skill (mode commands such as `ENTER EXECUTE MODE` are allowed: they are the same in both kits).

- [ ] D1. `$GT/tasks.md` (index): per task id, the agent(s) it is meant to spawn, entry phase, fixture summary, run budget class, CORE or EXTENDED. Fixed set:
  - CORE (always run in Phase 8 B4; these 3 keep the acknowledged count 3 tasks x 2 replicates x 2 kits = 12 task runs + 6 judge calls = 18, plus 1 rehearsal run):
    - `task-1-execute`: fixture = tiny Node project (one function, one failing-by-design `node --test` file) + a plan file with a PASS validate-contract under `process/general-plans/active/<slug>_<date>/`. Prompt: `ENTER EXECUTE MODE for <plan path>`. Expected agents: execute-agent, then tester (EVL confirmation run).
    - `task-2-bugfix`: fixture = tiny project with one reproducible bug and a test that shows it. Prompt: a plain bug report plus "quick fix, please" (routes to the quick-fix lane; if the router picks the debugger instead, that is recorded, not failed). Expected agents: quick-fix agent (or debugger).
    - `task-3-plan`: fixture = a research summary, a locked SPEC and a Decision Summary for a small 3-phase change. Prompt: `ENTER PLAN MODE` + "use the SPEC and decision summary in <paths>". Expected agent: plan-agent (phase-program shape if it judges 3 phases).
  - EXTENDED (frozen now, run in Phase 8 ONLY if the user acknowledges a higher count at B4.1; each adds 4 task runs + 2 judge calls): `task-4-research` (plain "how does X work here" question; research-agent), `task-5-validate` (fixture = plan without contract; `ENTER VALIDATE MODE for <plan path>`; validate-agent), `task-6-fast` (`ENTER FAST MODE - <small feature>`; fast-mode-agent, ends at its mandatory pause after VALIDATE), `task-7-update-process` (fixture = executed plan with EVL summary; `ENTER UPDATE PROCESS MODE for <plan path>`; update-process-agent).
  - MECHANICAL GATES ONLY (no golden task; residual recorded in `tasks.md` and the report): spec-agent, innovate-agent, debugger (unless task 2 routes to it), code-reviewer, code-simplifier, ui-ux-designer, git-manager. These are covered at Phase 8 only by the signal census, guardrail identity and validator baseline.
- [ ] D2. Per task folder `$GT/task-N-<slug>/`: `prompt.md` (the exact single user message, nothing else), `fixture/` (complete starting files; no `.claude`, `.codex` or `process/context` content: those come from the kit under test), `expected-artifacts.md` (artifacts by ROLE, not by kit file name, each with HOW the judge decides success: scripted checks first, e.g. "a `*_PLAN_*.md` exists under `process/**/active/` and `node <kit>/.claude/skills/*-generate-plan/scripts/validate-plan-artifact.mjs <plan>` exits 0", "`node --test` in the fixture exits 0 after the run", "the final message contains `PHASE_COMPLETE: EXECUTE` (VC-/VB- mapped)", "`git diff --stat` touches only files listed in the plan"; then the judged items). Binding forms: fixture tests run by EXPLICIT path (`node --test <path>.test.mjs` or a quoted glob), never a bare `node --test` at the sandbox root (it also picks up kit tests); changed files are detected with `diff -rq <frozen fixture copy> <sandbox>` (kit dirs excluded), never `git diff` (fixture files are untracked).
- [ ] D3. `$GT/rubric.md`: scripted items (artifacts present, required headings, signal strings present after the `VC-`->`VB-` / `vc-`->`vb-` mapping, validators green on produced plans, fixture tests green, no file outside the expected set changed) and judged items (correctness, completeness, plan/checklist specificity, honest status). The same rubric for OLD and FINAL.
- [ ] D4. `$GT/judge.md`: blind pairwise protocol for Phase 8: outputs labelled A/B with random order (seeded per task+replicate, seed recorded), judge = ad-hoc sonnet agent, one judge call per task x replicate; verdict per task EQUAL / BETTER / WORSE for FINAL vs OLD; tie = EQUAL; WORSE only if reproduced in BOTH replicates; scripted rubric items are computed, never judged; a run counts only if `run-record.mjs verify` passes and its `subagent_types` contain the task's expected agent (else the run is INVALID and re-run once, still inside the acknowledged count, or reported).
- [ ] D5. `$GT/old-sandbox-recipe.md` (runnable commands, used as written by Phase 8): (1) `git worktree add <dir-outside-repo>/old upstream-baseline`; (2) copy the Phase 0 `process/context/**` into it FROM COMMIT `1e81834` (`git -C <repo> archive 1e81834 process/context | tar -x -C <sandbox>`), NEVER from the working tree (the working tree would give OLD the FINAL `vb-` catalog; else CLAUDE.md's Bootstrap Guard fires); (3) the OLD sandbox has no program task folder; the FINAL sandbox REMOVES `process/general-plans/active/vibebelt-rebrand_29-10-26/` after creation (`rm -rf <sandbox>/process/general-plans/active/vibebelt-rebrand_29-10-26`; plan discovery must not see the program's own plans); (4) copy the task `fixture/` into the sandbox root; (5) no model override; (6) `node <repo>/$G/run-record.mjs record <sandbox> <run-id>`; (7) run per `run-flags.md`, one NEW OS process per run, from the sandbox root; (8) `run-record.mjs subagents <stream> <run-id>` and `verify` before judging; (9) per-run values to record (sandbox path, kit SHA, run-id, task, replicate, start time, cost reported by the stream); (10) cleanup `git worktree remove` + `git worktree prune`. Note in the recipe: OLD and FINAL differ in about 86 non-agent files by design (rename, docs, identity, cleanup), so B4 compares JUDGED OUTCOMES and scripted artifact checks, never file equality of the trees.
- [ ] D6. `$GT/run-flags.md`: the exact command for every B4 run: `claude -p "$(cat prompt.md)" --output-format stream-json --verbose --max-budget-usd <per-run cap> --model <the kit's own default: none passed, record the default>` and one permission mode chosen ONCE and used for both kits (`--permission-mode acceptEdits` plus an explicit `--allowedTools` list that permits Bash, Read, Write, Edit, Glob, Grep and the subagent tool; `--dangerously-skip-permissions` is allowed only inside the throw-away sandbox and only if the rehearsal shows edits are otherwise blocked; the choice is recorded). NEVER `--bare` (it skips CLAUDE.md discovery, so the kit would not be under test). The per-run cap and the flag set are confirmed by Phase 8's single acknowledged rehearsal run before the 18 calls; flag names are re-checked with `claude --help` at that time (no billed call needed for that).
- [ ] D7. Self-checks before freezing: `grep -rnE 'vc-|vb-' $GT/task-*/prompt.md | wc -l` = 0; every `task-*/` has `prompt.md`, `fixture/` and `expected-artifacts.md`; every task in `tasks.md` has a folder and vice versa; each fixture's own tests behave as described (`node --test` in task-1 and task-2 fixtures FAILS before any run, by design; record exit codes).
- [ ] D8. FREEZE (no model run has happened or will happen in Phase 3): write `$GT/FROZEN.md` ("These golden task definitions are frozen. Phase 8 reuses them verbatim. Any change needs a recorded reason in a phase report and the user's approval, because OLD and FINAL must be judged on identical definitions.") and `$GT/FROZEN.sha256` via `(cd $GT && find . -type f ! -name FROZEN.sha256 | LC_ALL=C sort | xargs sha256sum > FROZEN.sha256)`; verify `(cd $GT && sha256sum -c FROZEN.sha256)` exit 0; record `sha256sum $GT/FROZEN.sha256` in the report.

### Step E - Close

- [ ] E1. Run the whole unit suite: `node --test "$G/test/*.test.mjs"` (exit 0; quoted glob, because Node 22.23.4 rejects a directory argument).
- [ ] E2. Exit Gate commands below; write the report (incl. the start/end `compare.sh` values, the census and guardrail counts, the coverage table from D1 with the mechanical-only residual list, and the "no billed call" statement).
- [ ] E3. One process commit on `main` for `golden/**` + report (UPDATE PROCESS step); agents untouched, so there is no execution commit and no per-agent commit exception any more.

---

## Exit Gate

Hard dependencies kept at exact paths: `$G/signal-census.mjs`, `$G/signal-census-phase3.txt` (Phase 7, Phase 8), `$G/gen-guardrails.mjs`, `$G/guardrails.json`, `$G/start.sha`, `$G/run-record.mjs`, `$GT/**` (Phase 8). Do not rename or move.

```bash
T=process/general-plans/active/vibebelt-rebrand_29-10-26; G=$T/golden; GT=$G/tasks   # run from the repo root, Linux node
git diff --stat b17294d -- .claude/agents .codex/agents | wc -l                  # Expected: 0 (agents and toml byte-identical)
test ! -e .claude/agents/references && test ! -e .codex/agents/references; echo $?   # Expected: 0
ls .claude/agents | wc -l; ls .codex/agents | wc -l                               # Expected: 15 and 15
node --test "$G/test/*.test.mjs"; echo $?                                         # Expected: 0 (census incl. PHASE_COMPLETE: PLAN-SUPPLEMENT, DONE_WITH_CONCERNS, VC-PREDICT-DEEP-NEEDED; guardrails; run-record)
node $G/signal-census.mjs --out $G/determinism/census-gate.txt && cmp $G/signal-census-phase3.txt $G/determinism/census-gate.txt; echo $?   # Expected: 0 (deterministic, and the baseline matches the untouched agents)
test -s $G/signal-census-phase3.txt && cut -f1 $G/signal-census-phase3.txt | LC_ALL=C sort -u | wc -l   # Expected: 15
grep -c "PHASE_COMPLETE: " $G/signal-census-phase3.txt                            # Expected: > 1 (variants distinguished)
node $G/gen-guardrails.mjs --out $G/determinism/guardrails-gate.json && cmp $G/guardrails.json $G/determinism/guardrails-gate.json; echo $?   # Expected: 0
node -e "const j=require(require('path').resolve(process.argv[1]));process.exit(Object.keys(j.agents).length===15?0:1)" $G/guardrails.json; echo $?   # Expected: 0
node $G/gen-guardrails.mjs > $G/determinism/guardrails-stdout.json && cmp $G/guardrails.json $G/determinism/guardrails-stdout.json; echo $?   # Expected: 0 (stdout == --out bytes)
(cd $GT && sha256sum -c FROZEN.sha256 >/dev/null); echo $?                         # Expected: 0
test -f $GT/tasks.md && test -f $GT/rubric.md && test -f $GT/judge.md && test -f $GT/old-sandbox-recipe.md && test -f $GT/run-flags.md && test -f $GT/FROZEN.md; echo $?   # Expected: 0
grep -rnE 'vc-|vb-' $GT/task-*/prompt.md | wc -l                                  # Expected: 0
grep -- '--bare' $GT/run-flags.md | grep -vc NEVER                                 # Expected: 0 (--bare only appears in NEVER sentences)
test ! -d $G/runs || test -z "$(ls -A $G/runs)"; echo $?                           # Expected: 0 (no model run recorded)
bash $T/baseline/compare.sh; echo $?                                              # Expected: 0 (not worse than the Phase 0 baseline)
git diff --check                                                                  # Expected: no output
```

- Process check at EVL (vc-tester): no `claude -p`, `codex` or provider call appears in the Phase 3 execute or EVL transcripts; the report states "0 billed model calls".
- Validators unchanged: the validator suite is not worse than the Phase 0 baseline (`compare.sh` exit 0); no validator file was edited.

---

## Blockers That Would Justify BLOCKED Status

- A `.toml` `developer_instructions` uses escapes or a form the minimal parser cannot read exactly (script exits 1): fix the parser, never guess.
- A golden task cannot be made to start at its phase with only fixture files (e.g. a mode command needs state outside the fixture): record it, move the task to "mechanical gates only", keep the CORE set at 3 by substituting an EXTENDED task (task 5 first).
- Any step would need a billed model call: stop; that belongs to Phase 8 B4 behind its hard stop.

---

## Phase Completion Rules

- CODE DONE = checklist items done; VERIFIED = Exit Gate commands pass AND `compare.sh` exit 0 AND regression checkpoint passes AND validate-contract exists.
- Known-Gap alone never makes a behavior PASS; write a backlog stub and keep that gate CONDITIONAL.

## Acceptance Criteria (C-P3, re-scoped)

- C-P3a agents unchanged: `.claude/agents` and `.codex/agents` byte-identical to `b17294d`, no `references/` dir. proven by: Exit Gate lines 1-3. strategy: Fully-Automated
- C-P3b signal census correct and complete: exact strings with counts, PHASE_COMPLETE variants distinct, colon-less and status signals, Gate/MODE, `.toml` incl. `SPAWN_REQUEST:`, no noise, prefix-neutral keys, deterministic, baseline at the pinned path. proven by: `node --test $G/test/signal-census.test.mjs` + census `cmp` + 15-key check. strategy: Fully-Automated
- C-P3c guardrail hashes: exact heading rules, fences ignored, level-2 includes level-3 children, md + toml, `--root` and `--out` work, deterministic, 15 agents. proven by: `node --test $G/test/gen-guardrails.test.mjs` + two `cmp` gates + count gate. strategy: Fully-Automated
- C-P3d golden tasks frozen, kit-name-neutral, phase-entry design, recipe and run flags present. proven by: `sha256sum -c`, prompt grep = 0, file `test -f` chain, `--bare` grep. strategy: Fully-Automated (that the tasks really spawn the intended agents is only provable by Phase 8's rehearsal run: named residual, see Verification Evidence)
- C-P3e run recorder works harness-side. proven by: `node --test $G/test/run-record.test.mjs`. strategy: Fully-Automated (stream-json field names: residual until the Phase 8 rehearsal)
- C-P3f zero billed calls, nothing worse. proven by: empty `$G/runs`, EVL transcript check, `compare.sh` exit 0. strategy: Fully-Automated + Agent-Probe (transcript check)

## Touchpoints

- New: `$G/signal-census.mjs`, `$G/gen-guardrails.mjs`, `$G/run-record.mjs`, `$G/test/**`, `$G/signal-census-phase3.txt`, `$G/guardrails.json`, `$G/start.sha`, `$G/determinism/**`, `$GT/**`, the Phase 3 report.
- Read only: `.claude/agents/*.md`, `.codex/agents/*.toml`, `$T/baseline/compare.sh`, `process/context/**`.

---

## Public Contracts

- Agent files: unchanged (names, triggers, tool grants, status codes, signal strings, effort, models).
- `signal-census.mjs` CLI and line format (`key\tkind\tclass\ttoken\tcount`) and the file `signal-census-phase3.txt` are a contract for Phase 7 check 4 and Phase 8 B4.6(b).
- `gen-guardrails.mjs` CLI (`--root`, `--out`, stdout default, never writes implicitly) and the JSON schema 1 are a contract for Phase 8 B4.6(d).
- `run-record.mjs` subcommands `record`/`verify`/`subagents` are a contract for Phase 8 B4.
- `$GT/**` is frozen after D8; Phase 8 reads it verbatim.

---

## Verification Evidence

| Gate / Scenario | Strategy | Proves SPEC criterion |
|---|---|---|
| `git diff --stat b17294d -- .claude/agents .codex/agents` empty; no `references/` dirs; 15 + 15 files | Fully-Automated | C-P3a; C-EQ (agents are not a source of OLD-vs-FINAL difference before Phase 6) |
| `node --test $G/test/signal-census.test.mjs` (fixture with PHASE_COMPLETE: PLAN-SUPPLEMENT, DONE_WITH_CONCERNS, VC-PREDICT-DEEP-NEEDED, SPAWN_REQUEST in toml, noise tokens) | Fully-Automated | C-P3b |
| Census double run `cmp` + 15 keys + PHASE_COMPLETE variants in `signal-census-phase3.txt` | Fully-Automated | C-P3b; Phase 7 / Phase 8 hand-off |
| `node --test $G/test/gen-guardrails.test.mjs` + `--out` vs stdout `cmp` + double run `cmp` + 15 agents | Fully-Automated | C-P3c; Phase 8 B4.6(d) input |
| `node --test $G/test/run-record.test.mjs` (temp sandbox, synthetic stream) | Fully-Automated | C-P3e |
| `(cd $GT && sha256sum -c FROZEN.sha256)`, prompt grep = 0, required files, `--bare` only in the NEVER line | Fully-Automated | C-P3d; C-EQ (inputs re-runnable verbatim) |
| No model run: `$G/runs` empty; tester reads the execute/EVL transcripts for `claude -p`/provider calls | Fully-Automated + Agent-Probe | C-P3f |
| `bash $T/baseline/compare.sh` exit 0; `git diff --check` clean | Fully-Automated | C-P3f (nothing worse) |
| Golden tasks really reach and spawn the intended agent headless; stream-json `subagent_type` field names | Named residual (CONDITIONAL until Phase 8): proven only by Phase 8's ONE user-acknowledged rehearsal run; backlog-equivalent tracking is Phase 8 B4 itself (already a planned, gated step), so no extra stub | C-P3d, C-P3e |

---

## Phase Loop Progress

Orchestrator reads this before deciding which subagent to spawn next. The canonical 7-step inner loop
`R → I → P → PVL → E → EVL → UP` SKIPS SPEC (the umbrella plan and the user brief act as the SPEC).

- [x] 1. RESEARCH — vc-research-agent (opus, front-matter): read-only measurements of the census gaps, guardrail headings, headless gate behaviour (2026-10-30)
- [x] 2. INNOVATE — replaced by the USER DECISION of 2026-10-30 (drop slimming; instrument and freeze); recorded in Purpose and the Refresh Note
- [x] 3. PLAN-SUPPLEMENT — vc-plan-agent (opus, front-matter): plan re-scoped 2026-10-30; Inner Loop Refresh Note written
- [x] 4. PVL — vc-validate-agent (opus, front-matter): full V1-V7 from V1 (the 2026-10-30 Refresh Note invalidates the earlier contract); validate-contract written per `.claude/skills/vc-validate-findings/references/example-validate-output.md` (Gate: PASS, inner-pvl, 2026-10-30)
- [x] 5. EXECUTE — vc-execute-agent (opus): all checklist items done; per-section test gates run and green (done 2026-10-30; 66 files under golden/, per-section gates green)
- [x] 6. EVL — vc-tester (opus, front-matter): Exit Gate re-run; no-billed-call check; EVL HANDOFF SUMMARY written (independent vc-tester PASS 17/17; closeout WITH_GAPS)
- [x] 7. UPDATE PROCESS — vc-update-process-agent (sonnet): phase report written, umbrella state updated, process commit on main (report phase-03-instrument-and-freeze_REPORT_30-10-26.md written; process commit pending by vc-git-manager)

**Validate-contract required.** If step 4 (PVL) is unchecked or `## Validate Contract` reads
"(placeholder — vc-validate-agent writes this section before EXECUTE)", the orchestrator must spawn
vc-validate-agent first. A partial contract (missing Plan updates applied / Execute-agent
instructions / Test gates) is treated as a placeholder. The contract below (PVL cycle 5) describes the SLIMMING scope and is SUPERSEDED by the 2026-10-30 Refresh Note; it is kept as history only.

---

## Test Infra Improvement Notes

- The new `signal-census.mjs` and `gen-guardrails.mjs` are reusable harness checks; after the program, consider promoting them into `vc-audit-vc` (out of scope here).
- The headless golden-task design (start at the phase under test with fixture artifacts) is the only way found to exercise phase agents with `claude -p`; Phase 8's rehearsal run will tell whether mode commands work headless.

---

## Resume and Execution Handoff

- Selected plan file path: `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-03-slim-agents_PLAN_29-10-26.md`
- Last completed step: inner step 3 PLAN-SUPPLEMENT (2026-10-30, re-scope to "Instrument and freeze (no slimming)")
- Validate-contract status: PENDING re-run. The cycle-5 contract below (2026-10-29, slimming scope) is superseded by the 2026-10-30 Inner Loop Refresh Note; PVL must restart at V1.
- Supporting context files: umbrella plan (Locked Decisions incl. the 2026-10-30 row, C-EQ, C-CLEAN), `phase-blast-radius-registry.md` (Phase 3 section), Phase 2 report, Phase 7 plan (check 4, C2), Phase 8 plan (P5, B4).
- Next step: spawn vc-validate-agent (opus, front-matter) for inner PVL from V1 on this plan. Then EXECUTE with ONE vc-execute-agent (opus). No step of this phase may run a billed model call.

---

## Inner Loop Refresh Note: 2026-10-29 — changed sections: Purpose, Strategy Recommendation, Blast Radius, Implementation Checklist (A0, A1, A2, A2b, A3, A4, A5), Exit Gate, Public Contracts, Verification Evidence, Phase Loop Progress, Resume and Execution Handoff. Invalidates prior validate-contract.

User decisions of 2026-10-29: (A) quality-equivalence is a hard program requirement, so the golden task definitions become a frozen, reusable asset for the Phase 8 FINAL EQUIVALENCE GATE; (B) models stay as on disk, so Phase 1 no longer changes any `model:` and `golden/old/` is only a pre-program control (not a model-change measurement). The Validate Contract below predates both and must be re-run from V1; its gate paths `$G/tasks.md`, `$G/rubric.md`, `$G/judge.md` are now `$G/tasks/tasks.md`, `$G/tasks/rubric.md`, `$G/tasks/judge.md`.

---


## Inner Loop Refresh Note: 2026-10-30 — changed sections: Purpose, Entry Gate, Strategy Recommendation, Blast Radius, Implementation Checklist (fully replaced: Steps 0, A-E), Exit Gate, Blockers, Acceptance Criteria, Touchpoints, Public Contracts, Verification Evidence, Phase Loop Progress, Test Infra Improvement Notes, Resume and Execution Handoff (user decision: no slimming). Invalidates prior validate-contract.

User decision of 2026-10-30 (LOCKED): drop the agent slimming; Phase 3 becomes "Instrument and freeze" with zero billed model calls. Everything in the Validate Contract below that concerns slimming (size floor, conservation, pointer-check, parity-compare, references/ location, per-agent commits, revert rehearsal, A0 cost gate, golden/old and golden/phase1 runs, KG1 Codex references, E1-E11) is void. PVL restarts at V1 against the checklist above.

## Validate Contract

Status: PASS
Date: 30-10-26
date: 2026-10-30
generated-by: inner-pvl: phase-3
supersedes: 2026-10-30 (inner-pvl: phase-3, first pass on the no-slimming scope, Gate CONDITIONAL, MUST-FIX M1 and M2) AND the Inner Loop Refresh Note of 2026-10-30 AND the `Supplement (PVL, 2026-10-30)` note (M1, M2, E1, E2, E4, E5) — inner PVL has current evidence. The first-pass contract is replaced in full; the Refresh Note and the PVL supplement are consumed by this validation. The older cycle-5 slimming contract (2026-10-29, outer-pvl) was already superseded and stays in git history at `b17294d`. The supplement logs below stay as history only.

V1 line: `V1 RE-VALIDATE TRIGGERED: the Supplement (PVL, 2026-10-30) was applied after the existing contract (2026-10-30, inner-pvl: phase-3, Gate CONDITIONAL); the orchestrator treats it as newer than that same-date contract. V1 AUTO-PROCEED does not apply.`

TL;DR: both MUST-FIX items from the first pass are closed and proven in a fresh scratch copy. The TOML-decoding hasher, the census, the quoted-glob unit suite, the OLD/FINAL recipe and every Exit Gate line work as written. No new MUST-FIX. Gate PASS. Five new RESIDUAL facts are recorded below as execute-agent instructions and cross-plan hand-offs; none blocks a gate.

Parallel strategy: sequential
Rationale: score 1/7 (S7 only: about 25 new task-folder files; no schema, auth, API or billing surface; no billed call). EXECUTE = ONE vc-execute-agent (opus, front-matter). The census, hasher, recorder and frozen task set share fixture conventions and must be written by one hand. Agent counts: sequential 1; parallel subagents 3-4 with no gain; workflow 5 steps x 1 agent x 1 iteration = 5 with no gain; agent team not needed (one writer, no blast-radius coordination; decision G). Cost guard: not triggered (0 billed calls, far under 30 agents). This validation pass was ONE fire-and-forget vc-validate-agent (opus). Layer 1 (4 dimensions) and Layer 2 (Steps 0, A, B, C, D, E + Exit Gate) ran inline. Every runnable check ran in a unique throw-away scratch clone (`git clone --no-hardlinks`, tmpfs), deleted afterwards. No prior verdict was trusted.

### Real-repo checks (second pass, 2026-10-30)

- **V1 situation:** branch `main`, HEAD `b17294d`, one worktree, no stash. Uncommitted edits exist only in the 8 program plan/registry files of the task folder. `validate-plan-artifact.mjs` on this plan: exit 0, 0 failures, 2 advisory legacy-shape warnings. All referenced paths and refs resolve: umbrella, registry, `baseline/compare.sh`, `process/context/tests/all-tests.md`, tag `upstream-baseline` = `005744e`, commits `1e81834` and `b17294d`. The plan has no `## Phase Ordering` section, so the dependency guard does not apply. The Pre-PVL action check is skipped (inner PVL). An umbrella with `## Stable Program Goal` exists, so this is BRANCH B: no goal block goes in this phase plan. Agents: `git diff --stat b17294d -- .claude/agents .codex/agents` is empty; 15 + 15 files.
- **(1) Guardrail hasher (M2 closed).** The B2 prototype was written exactly to spec, including TOML 1.0 multi-line basic-string decoding (`\b \t \n \f \r \" \\ \uXXXX \UXXXXXXXX`, plus a line-ending backslash that trims the newline and all following whitespace and newlines). Real-tree results:
  - Exit 0; 15 keys; quick-fix and ui-ux-designer have `"md":[]` and `"toml":[]`. Two `--out` runs are byte-identical, and stdout equals `--out`.
  - The 7 real escapes decode without error: `vc-update-process-agent.toml` lines 416/419/560/564 (line-ending backslashes) and `vc-validate-agent.toml` line 433 (three `\n`). Every one of the 15 `developer_instructions` is a single `"""` basic string (exactly 2 delimiters per file, no CR bytes).
  - A raw (undecoded) run gives identical JSON, which confirms that the escapes sit outside every selected section.
  - Heading census matches B2 exactly: `Phase Lock` x4, `Completion` x5, 6 `Session Start` incl. the level-3 update-process one, 4 `Autonomous /goal` variants. 60 selected sections in md and 60 in toml.
  - **md vs toml (fact, not stated in the plan):** the heading lists are identical for all 15 agents, but only 50 of the 60 section hashes are equal. The other 10 differ because the Codex mirrors are deliberately reworded: `vc-execute-agent` instead of `execute-agent`, `SPAWN_REQUEST:` instead of "spawn", "coordinated parallel subagents" instead of "vc-team"/"agent-team". The 10 are: code-reviewer, code-simplifier, debugger and tester `Autonomous /goal Behavior`; execute `Session Start` and `Autonomous /goal Execution`; innovate `Session Start` and `Completion`; research `Session Start`; spec `Session Start`. The plan hashes md and toml as separate lists, and no consumer compares md with toml (Phase 8 B4.6(d) compares md with md and toml with toml across trees), so no gate is affected (N2).
  - **B1 fixture as specified:** EQUALS vs prefix rules hold (`Phase Lock Enforcement` and `Completion and Phase Handoff` are not selected); both fence styles are ignored; the level-3 child is included in the parent hash; a CRLF copy gives the same hashes; a toml section with one `\n` escape and one line-ending backslash hashes the same as the md section written with the decoded text; an invalid `\q` exits 1 and names the file and the correct line (`vc-alpha.toml:15`); `--out` leaves stdout empty.
- **(2) Signal census (unchanged, re-proved).** The A2 prototype run on the real tree matches the first pass exactly: 233 lines, already `LC_ALL=C` sorted; 15 keys; 10 `PHASE_COMPLETE:` variants (EXECUTE, FAST, GIT-COMMIT, INNOVATE, PLAN, PLAN-SUPPLEMENT, RESEARCH, SPEC, UPDATE PROCESS, VALIDATE); `SPAWN_REQUEST:` in toml only (execute 9; innovate, research, update-process, validate 1 each). No noise tokens. Two runs byte-identical.
  - Class counts: 49 colon-signal, 4 gate, 22 mode, 24 phase-complete, 12 prefix-signal, 122 status lines.
  - A1 fixture as specified: PLAN-SUPPLEMENT 1 / PLAN 2 / UPDATE PROCESS 1; `BLOCKED-skipped` not counted; colon-less `VC-PREDICT-DEEP-NEEDED` found; `SPAWN_REQUEST:` in kind toml; `Gate: CONDITIONAL` and `[MODE: PLAN]` found; the 4 noise tokens absent; keys `alpha`/`beta`; `--neutral` gives `V?-`. An empty tree exits 1; an unknown flag exits 2.
- **(3) Unit suite form (M1 closed).** In the scratch copy, `node --test "$G/test/*.test.mjs"` with explicit-path fixture tests exits 0. Breaking one fixture gives exit 1; the directory form `node --test $G/test/` still exits 1 on Node 22.23.4.
  - **New fact:** a quoted glob that matches NO file also exits 0. A missing test file would therefore not turn the suite line red. The explicit per-file commands (A3, B3, C3) do exit 1 when the file is missing, so they are added to the gate table below (N3).
- **(4) Golden recipe.**
  - OLD sandbox per D5: `git worktree add <outside>/old upstream-baseline`, then `git archive 1e81834 process/context | tar -x -C <old>`. Result: `all-context.md` is present (Bootstrap Guard satisfied), and there is no program folder under `process/general-plans/active/`. OLD census (count column removed) and OLD guardrails are identical to `b17294d`'s. `git diff --stat upstream-baseline b17294d -- .claude/agents .codex/agents` = 3 files, 3 lines (the `effort: max` lines).
  - FINAL sandbox: a worktree of HEAD contains the program folder until `rm -rf <sandbox>/process/general-plans/active/vibebelt-rebrand_29-10-26`; after that only `_GUIDE.md` remains in `active/`.
  - Git identity: this machine has no global identity, so a commit without one exits 128; `git -c user.name=t -c user.email=t@t commit` exits 0 (C1).
  - Fixture behaviour: the task-1 style fixture test, run by explicit path, exits 1 before the simulated run and 0 after it. A bare `node --test` at the sandbox root picks up 5 kit tests (1 failing), which confirms the explicit-path rule.
  - **`diff -rq` detection (fact):** the literal D2 form `diff -rq <frozen fixture copy> <sandbox>` does catch an edited fixture file and a new file inside a fixture directory. But even with `-x .git -x .claude -x .codex` it prints 22 kit-only `Only in <sandbox>:` lines at the root plus kit subfolders such as `process/context`. It also does NOT see an edit to a kit file (a `CLAUDE.md` edit is visible only to `git status`). See N1.
- **(5) Gates.** The Exit Gate block (18 lines) and the checklist snippets (0.2, E1, D8, the B4 `node -e` check) pass `bash -n`.
  - The full Exit Gate was run from the scratch repo root against a simulated finished `golden/` tree (spec-conformant prototypes, 2 unit tests, one task folder, the 6 index files, `FROZEN.sha256`). Every line printed its expected value: 0 / 0 / 15 15 / suite 0 / census cmp 0 / 15 keys / 24 `PHASE_COMPLETE: ` lines (> 1) / guardrail cmp 0 / 15-key check 0 / stdout cmp 0 / FROZEN 0 / required files 0 / prompt grep 0 / `--bare` 0 / runs 0 / `compare.sh` "OK: nothing worse" exit 0 / `git diff --check` silent.
  - `compare.sh` also exits 0 with the golden tree present. No gate line calls `claude`, `codex` or a provider.
  - Mutation 1: one line in plan-agent md `## Phase Lock` and one in validate-agent toml `## Purpose` were changed. Guardrail `cmp` exits 1 and exactly 2 hashes change.
  - Mutation 2: `BRAND_NEW_SIGNAL:` and `VC-TOTALLY-NEW-THING` were appended to tester md. Census `cmp` exits 1; the diff shows exactly those 2 new lines, and the Phase 7 count-free compare also differs.
  - `claude` 2.1.314 `--help` (no model call) still lists all D6 flags: `--print --output-format --verbose --max-budget-usd --model --permission-mode --allowedTools --dangerously-skip-permissions --bare`.
- **(6) Consumers.**
  - Phase 7 check 4a runs `$G/signal-census.mjs` on stdout with root = cwd, maps `VC-`/`vc-`, and uses `cut -f1-4 | LC_ALL=C sort -u` (counts removed). This is consistent with the 5-column format. Phase 7 uses Phase 4's `p4-tools/pointer-check.mjs` (Phase 3 builds none).
  - Phase 8 P5 lists exactly the Phase 3 outputs. B4.3 uses `record`/`subagents`/`verify <sandbox> <run-id>` (first-pass H1 adopted). B4.6(b) drops the count column (H2 adopted). B4.6(d) uses `--root <tmp> --out $EQ/...` and `start.sha` (consistent; the stdout-default/no-implicit-write rule holds in the prototype).
  - C-CLEAN: `golden/` lives in the doomed task folder; B4 runs before C0b; Phase 6 excludes the whole task folder (Phase 6 plan line 102), so frozen files and the census baseline are never renamed.
  - The registry's Phase 3 section matches this plan's Blast Radius and Touchpoints.

### Status of the first-pass items

- M1 CLOSED: E1 and the Exit Gate use `node --test "$G/test/*.test.mjs"` (plan lines 152, 167); proven exit 0 when green and exit 1 when a fixture breaks.
- M2 CLOSED: B2 decodes TOML 1.0 escapes and exits 1 only on an invalid escape; the false "no escapes" sentence is replaced by the verified fact (plan line 112); the B1 fixture covers `\n`, a line-ending backslash and `\q` (line 110). Proven on the real tree and on the fixture.
- E1 folded (B2 "always has all 15 keys"), E2 folded (D5 step 2, commit `1e81834`), E4 folded (D2 binding forms), E5 folded (C1 identity). All verified in the plan text. E3's removal step is folded into D5 step (3).
- H1, H2 closed in Phase 8 (B4.3, B4.6(b)). H3 closed (the umbrella shows Phase 3 at step 4 PVL). H4 superseded by H-P7 below.

### MUST-FIX / RESIDUAL classification

MUST-FIX: 0.

RESIDUAL: execute-agent instructions E3, E6-E12 (kept from the first pass) and N1-N3 (new); cross-plan hand-offs H-P7, H5-H7; Known Gaps KG1-KG3. None blocks a gate.

### Plan updates applied

None in this pass. This pass wrote only this contract.

### Test gates (C3 5-column table)

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P3a | agents and toml byte-identical to `b17294d`; no `references/`; 15 + 15 | Fully-Automated | `git diff --stat b17294d -- .claude/agents .codex/agents \| wc -l` = 0; `test ! -e .claude/agents/references && test ! -e .codex/agents/references`; `ls .claude/agents \| wc -l` and `ls .codex/agents \| wc -l` = 15 and 15 | A (green today; re-run at exit) |
| C-P3b | census: exact strings with counts, PHASE_COMPLETE variants distinct, status/colon-less/Gate/MODE classes, toml `SPAWN_REQUEST:`, no noise, prefix-stripped keys, `--neutral`, deterministic, baseline at pinned path | Fully-Automated | `node --test $G/test/signal-census.test.mjs` (explicit path, exit 0); `node $G/signal-census.mjs --out $G/determinism/census-gate.txt && cmp $G/signal-census-phase3.txt $G/determinism/census-gate.txt`; `cut -f1 $G/signal-census-phase3.txt \| LC_ALL=C sort -u \| wc -l` = 15; `grep -c "PHASE_COMPLETE: " $G/signal-census-phase3.txt` > 1 | B |
| C-P3c | guardrail hasher: heading rules, fences, level-2 includes level-3, md + decoded toml, invalid escape exit 1, `--root`/`--out`, stdout == `--out`, deterministic, 15 keys | Fully-Automated | `node --test $G/test/gen-guardrails.test.mjs` (explicit path, exit 0); the two `cmp` gates; stdout `cmp`; `node -e` 15-key check | B |
| C-P3e | run recorder record/verify/subagents on fixtures; no run recorded | Fully-Automated | `node --test $G/test/run-record.test.mjs` (explicit path, exit 0); `test ! -d $G/runs \|\| test -z "$(ls -A $G/runs)"` | B |
| C-P3 suite | whole unit suite green, and all 3 test files present | Fully-Automated | `node --test "$G/test/*.test.mjs"` exit 0 AND the 3 explicit-path commands above (N3: an empty glob also exits 0) | B |
| C-P3d | golden tasks frozen and complete, kit-name-neutral prompts, recipe and run flags present, `--bare` only in NEVER lines | Fully-Automated | `(cd $GT && sha256sum -c FROZEN.sha256)`; `test -f` chain; `grep -rnE 'vc-\|vb-' $GT/task-*/prompt.md \| wc -l` = 0; `--bare` grep; D7 completeness: `for d in $GT/task-*/; do test -f "$d/prompt.md" && test -d "$d/fixture" && test -f "$d/expected-artifacts.md" \|\| echo "INCOMPLETE $d"; done; ls -d $GT/task-*/ \| wc -l` = no INCOMPLETE line, then 7 | B |
| C-P3f | nothing worse; zero billed calls | Fully-Automated + Agent-Probe | `bash $T/baseline/compare.sh` exit 0; `git diff --check` silent; vc-tester reads the execute/EVL transcripts for `claude -p` / `codex` / provider calls | A (compare.sh exit 0 today) + B |
| C-P3d/C-P3e runtime | golden prompts reach their phase and spawn the expected agent headless; stream-json `subagent_type` field names | Agent-Probe (Phase 8 B4.1a rehearsal, 1 acknowledged billed run) | Phase 8 B4.1a; never run in Phase 3 | C (deferred to Phase 8 B4.1a; KG1, KG2) |

Failing stubs (Fully-Automated rows, red-first for execute-agent):
- test("should keep agents and toml byte-identical to b17294d", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep agents and toml byte-identical to b17294d") })
- test("should census exact signal strings with counts, distinct PHASE_COMPLETE variants, toml SPAWN_REQUEST and no noise", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should census exact signal strings with counts, distinct PHASE_COMPLETE variants, toml SPAWN_REQUEST and no noise") })
- test("should hash selected guardrail sections deterministically with fences ignored and decoded toml escapes", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should hash selected guardrail sections deterministically with fences ignored and decoded toml escapes") })
- test("should exit 1 with file and line on an invalid toml escape", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should exit 1 with file and line on an invalid toml escape") })
- test("should record, verify and parse subagent types for a sandbox without writing golden/runs", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should record, verify and parse subagent types for a sandbox without writing golden/runs") })
- test("should freeze a complete golden task set with a verifiable sha256 and kit-name-neutral prompts", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should freeze a complete golden task set with a verifiable sha256 and kit-name-neutral prompts") })

Legacy line form:
- agents unchanged: [Fully-automated: git diff --stat b17294d -- .claude/agents .codex/agents | wc -l = 0]
- census: [Fully-automated: node --test $G/test/signal-census.test.mjs + census cmp + 15 keys]
- guardrails: [Fully-automated: node --test $G/test/gen-guardrails.test.mjs + cmp gates + 15 keys]
- run recorder: [Fully-automated: node --test $G/test/run-record.test.mjs + empty runs dir]
- unit suite: [Fully-automated: node --test "$G/test/*.test.mjs" + the 3 explicit-path commands]
- frozen tasks: [Fully-automated: sha256sum -c FROZEN.sha256 + prompt grep = 0 + test -f chain + D7 completeness loop = 7]
- nothing worse: [Fully-automated: bash $T/baseline/compare.sh exit 0] | [agent-probe: tester transcript check for billed calls]
- golden runtime routing and stream fields: [known-gap: documented, deferred to Phase 8 B4.1a rehearsal]

### Known Gaps (named residuals, excluded from the CONCERN/FAIL count)

- KG1 Live routing not measured. Open: whether each frozen prompt really enters its phase headless and spawns the expected agent, and whether the final message carries `PHASE_COMPLETE:`. Proven only by Phase 8 B4.1a (one user-acknowledged rehearsal run). That is a planned, gated step, so no extra backlog stub is written (gap-resolution C).
- KG2 stream-json field names (`tool_use` named `Task` or `Agent`, `input.subagent_type`) stay unverified until the Phase 8 rehearsal. Until then `run-record.mjs` records `subagent_parse: "unverified-schema"` (C).
- KG3 Native Windows / macOS: scripts and gates were exercised only with Linux node 22.23.4 on WSL (drvfs repo, tmpfs clone). Native runs stay with C-P8r in Phase 8 (LOCKED Q6).

### Execute-agent instructions (binding)

Kept from the first pass (not folded into the plan text):
- E3 D5 step (3): besides the `rm -rf` of the program folder, list in the recipe the remaining by-design OLD-vs-FINAL tree differences (e.g. `process/general-plans/backlog/*_NOTE_*`, later `process/context` edits) for Phase 8 `diff-excluded.txt`.
- E6 D6: write the run command WITHOUT `--model` (none passed; record the default reported by the stream). `--bare` appears only in a NEVER sentence.
- E7 D1/D2: the task-1 fixture plan contains the literal gate line "Gate", colon, space, "PASS" and passes `validate-plan-artifact.mjs` of both kits.
- E8 B1: build the `\r\n` variant inside the test (in memory), not as a committed CRLF file (`.gitattributes` has `* text=auto`).
- E9 D8: no whitespace in any `$GT` file name (the `xargs sha256sum` form splits on whitespace).
- E10 Report note: `vc-plan-discovery` lists golden fixture plans (`golden/tasks/*/fixture/process/...`) as active plans for Phases 4-8, so the orchestrator must keep passing explicit plan paths. Validators and `compare.sh` are unaffected (re-verified: exit 0 with a fixture plan present).
- E11 Report the guardrail coverage limits as seen in B4: no section for quick-fix or ui-ux-designer; fast-mode `## Phase Lock Enforcement` and research `## Completion and Phase Handoff` are excluded by the EQUALS rule; five agents carry one section only. Do not extend the heading list.
- E12 A2: `V[CB]-...:` tokens also match the colon-signal pattern. State in the script header whether they are dropped there (as `PHASE_COMPLETE:` is; the prototype dropped them) or kept in both classes. Both are deterministic and compatible with Phase 7 and Phase 8.

New from this pass:
- N1 D2/D5 change detection (implements D2's "kit dirs excluded"; still `diff -rq`, never `git diff`). Measured: the literal `diff -rq <task fixture/> <sandbox>` prints 22+ kit-only lines and does not see edits to kit files. Write the check in `expected-artifacts.md` and the recipe as follows:
  - Right after recipe step (4) (fixture copied into the sandbox), snapshot the whole sandbox without `.git`, e.g. `rsync -a --exclude .git <sandbox>/ <snapshot>/`.
  - After the run, compare with `diff -rq -x .git <snapshot> <sandbox>`. This lists every changed, added or removed file (fixture and kit) and prints no kit noise.
  - The expected set per task is then compared against that list.
- N2 Report note: md and toml guardrail sections are hashed independently. Heading lists match for all 15 agents, but 10 of 60 section bodies differ by deliberate Codex wording (list in check (1) above). Never "sync" them; do not compare md hashes with toml hashes.
- N3 E1/E2: an empty quoted glob makes `node --test` exit 0. Before the report, also run the 3 explicit-path commands (A3, B3, C3) and `ls $G/test/*.test.mjs | wc -l` (= 3). vc-tester re-runs them at EVL (they are gate rows above).

### Cross-plan hand-offs (orchestrator; not Phase 3 edits)

- H-P7 Phase 7's PASS contract test-gate row C-P7-h (Phase 7 plan line 277) still names `$NODE $G/pointer-check.mjs`. Phase 3 never builds that tool (decision D), so an EVL re-run of that exact row would fail. Phase 7's live checklist and Exit Gate already use `$TF/p4-tools/pointer-check.mjs`; its next inner PVL must replace the contract row. The history text at Phase 7 line 264 is the same issue.
- H5 Phase 8 B4.3 calls `run-record.mjs record <sandbox> <run-id>` without `--runs-dir`, so records land in the Phase 3 default `golden/runs/`. Phase 8 states "write only under eq/" (E6). Phase 8's inner PVL should pass `--runs-dir $EQ/runs` to all three subcommands, or explicitly allow `golden/runs/` (not covered by `FROZEN.sha256`; doomed folder).
- H6 Phase 8 B4.6(d) does `git init` + one commit in a temp copy with no identity. This machine has none (a commit exits 128, measured), so Phase 8 should use `git -c user.name=t -c user.email=t@t commit` as Phase 3 C1 does.
- H7 Bookkeeping for the orchestrator / update-process:
  - The task folder `results.tsv` has no row for this plan's 2026-10-30 PVL cycle, and the folder has no `pvl-iteration` report (last row: iteration 8, Phase 2 EVL). Write them per `vc-autoresearch` §PVL Wiring.
  - Tick Phase Loop Progress step 4 and refresh the stale `Validate-contract status: PENDING` line (Resume section) and the cycle-5 sentence under Phase Loop Progress. This pass may edit only this contract.

### Dimension findings

- Infra fit: PASS — Linux node 22.23.4, git, `sha256sum`, `rsync` (for N1) present, and `claude` 2.1.314 flags all present. The OLD recipe is buildable from `upstream-baseline` + `1e81834`; FINAL loses the program folder via `rm -rf`. Nested fixtures leave `compare.sh` at exit 0.
- Test coverage: PASS — every Exit Gate line reaches its expected value in simulation and turns red under mutation (guardrail section edit, unknown signal, broken fixture). The empty-glob vacuity is closed by explicit-path gate rows (N3). Runtime routing is deferred to the named Phase 8 rehearsal (C), not resting on Known-Gap alone.
- Breaking changes: PASS — agents and toml untouched (`git diff --stat` empty). The Phase 7 and Phase 8 consumers match the CLI and line formats. Consumer-side items H-P7, H5 and H6 are handed off; C-CLEAN order holds (B4 before C0b; task folder excluded from Phase 6).
- Security surface: PASS — no auth, billing, schema, secret or API surface. No gate or step invokes `claude` (except `--help`, read-only), `codex` or a provider. `--dangerously-skip-permissions` is limited to throw-away sandboxes and decided at the Phase 8 rehearsal. No high-risk evidence pack is needed.
- Step 0 (start state) feasibility: PASS — commands valid; `start.sha` gets the full sha.
- Step A (signal census) feasibility: PASS — the spec prototype matches every A1 assertion and the real tree (233 lines, 15 keys, 10 variants); mutation detected. RESIDUAL E12.
- Step B (guardrail hasher) feasibility: PASS — M2 closed: the 7 real escapes decode, `\q` exits 1 with file:line, 15 keys, deterministic, mutation detected. RESIDUAL E8, E11, N2.
- Step C (run recorder) feasibility: PASS — interface matches the recipe and Phase 8; command-line identity proven necessary and sufficient. Field names are KG2. Hand-offs H5, H6.
- Step D (frozen golden tasks) feasibility: PASS — phase-entry design buildable from fixtures; OLD/FINAL recipe proven; flags exist. RESIDUAL E3, E6, E7, E9, E10, N1. Runtime routing is KG1.
- Step E / Exit Gate: PASS — M1 closed; all 18 lines pass `bash -n` and reach their expected values. RESIDUAL N3.

Net gate derivation: Layer 1 = 0 FAIL / 0 CONCERN / 4 PASS; Layer 2 = 0 FAIL / 0 CONCERN / 6 PASS. MUST-FIX 0. RESIDUAL: 11 execute-agent instructions (E3, E6-E12, N1-N3) and 4 hand-offs (H-P7, H5-H7). Known Gaps: 3, excluded from the count. Net gate: PASS.

Signal legality: `PHASE_COMPLETE: VALIDATE — validate-contract written (after 1 validate-fix loop(s)). Proceed to EXECUTE.` is legal under condition (a) Gate = PASS. The loop count is 1: first pass CONDITIONAL → `Supplement (PVL, 2026-10-30)` → this re-validation. Before spawning vc-execute-agent the orchestrator must still (i) write the missing PVL bookkeeping (H7) and (ii) have the user's resume for EXECUTE, as the program requires.

What this coverage does NOT prove (What This Coverage Does NOT Prove):
- Agents unchanged: proves bytes, not that Claude Code or Codex loads them the same way in a headless run. An untracked new file in an agents dir is caught only by the 15/15 counts, not by `git diff`.
- Census: proves the listed token classes and counts in agent files only. Signal strings in `CLAUDE.md`, `AGENTS.md` and `process/development-protocols/**` are outside it (Phase 7 check 4b covers one `orchestration.md` section). A reworded plain sentence that drops a rule without touching a token is invisible.
- Guardrails: proves byte identity of the listed sections only. Quick-fix and ui-ux-designer have none, and unlisted guardrail-like sections (e.g. quick-fix `## Hard scope guard`) are not protected. md and toml are separate lists; the hasher does not prove the Codex mirror says the same thing as the md (10 of 60 differ by design today).
- TOML decoding: proven on the 7 real escapes and on fixture escapes (`\n`, line-ending backslash, `\q`). `\u`/`\U` and the other short escapes are implemented per spec but do not occur in today's files.
- Run recorder: proves which agent FILES were on disk in a sandbox, not which prompt the model loaded. The stream parser is tested only on a synthetic stream (KG2).
- Frozen tasks: `sha256sum -c` proves the definitions did not change after D8. It does not prove that the 3 CORE tasks are representative, that prompts route as intended (KG1), or that the rubric is unbiased. The prompt grep, `--bare` grep and runs check are vacuously 0 before any file exists; the D7 completeness loop (= 7) is the proof that the task folders are complete.
- Unit suite glob: exits 0 on zero matches; only the explicit-path rows prove that each test file exists and passes.
- `compare.sh`: proves no validator is worse than the Phase 0 baseline under Linux node; validators do not inspect `golden/**` content.
- Zero billed calls: rests on the vc-tester transcript read (Agent-Probe) plus the empty runs dir. No mechanical guard stops a `claude -p` call.
- Native Windows/macOS behaviour is untested (KG3).

Gate: PASS (second inner PVL pass on the 2026-10-30 scope, after 1 validate-fix loop: 0 FAIL / 0 MUST-FIX / 11 RESIDUAL execute-agent instructions + 4 hand-offs / 3 Known Gaps; M1 and M2 closed)
Accepted by: n/a — Gate PASS, so no CONDITIONAL concern needs acceptance. Named residuals carried by name, not accepted as passing behaviour: KG1 (live routing), KG2 (stream-json field names), KG3 (native Windows/macOS), E3, E6-E12, N1-N3, H-P7, H5-H7.

### Execute-agent handoff (inline)

- Plan: `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-03-slim-agents_PLAN_29-10-26.md`. Contract: inline (this section). Gate: PASS.
- ONE vc-execute-agent (opus, front-matter), sequential, checklist order 0 → A → B → C → D → E, red-first per the stubs above. Run every command from the repo root with Linux `node`.
- Write ONLY under `$G` (task folder `golden/**`) plus the Phase 3 report. Never touch `.claude/agents/**`, `.codex/agents/**` or any other repo file.
- ZERO billed model calls: no `claude -p`, `codex` or provider call; `claude --help` is allowed.
- Follow E3, E6-E12 and N1-N3. Run the full Exit Gate plus the 3 explicit-path tests and the D7 completeness loop before reporting DONE.
- EVL: vc-tester (opus) re-runs every proving-test command in the table above and checks the transcripts for billed calls.

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

### Supplement (inner 3, user decision 2026-10-30: no slimming)

- Re-scoped to "Instrument and freeze (no slimming)". Agents and Codex mirrors stay byte-identical to `b17294d`; no `references/` dir; zero billed calls in Phase 3.
- Kept and improved: `signal-census.mjs` (exact strings with counts, PHASE_COMPLETE variants, status codes, colon-less VC- signals, Gate, MODE, toml incl. SPAWN_REQUEST, noise excluded, prefix-stripped keys, `--neutral`, deterministic) + `signal-census-phase3.txt`; `gen-guardrails.mjs` with `--root` and `--out` and exact heading rules; `run-record.mjs` (record/verify/subagents, fixture-tested only); frozen `golden/tasks/` with phase-entry tasks (3 CORE = the acknowledged 18 calls + 1 rehearsal in Phase 8; 4 EXTENDED, optional), `old-sandbox-recipe.md`, `run-flags.md` (never `--bare`), FROZEN.md/FROZEN.sha256.
- Dropped: `size-check.mjs`, `conservation-check.mjs`, `pointer-check.mjs`, `parity-compare.mjs`, A0 cost gate (no billed call here; the Phase 8 B4.1 acknowledgement stays a hard stop there), references/ location probes and the Codex references residual + its backlog stub, per-agent commits and revert rehearsal, 25 percent size floor, judge-against-phase1 runs.
- Real OLD-vs-FINAL differences C-EQ will measure in Phase 8: `effort: max` on 3 execution agents, the rename and the doc/identity/skill edits of Phases 1, 2, 4, 5, 6, 7.
- Cross-plan wording that other plans must adopt (not edited here): see the plan-agent report of 2026-10-30 (Phase 5 entry/strategy, Phase 7 pointer-check source, Phase 8 B4.1 per-run cost source and rehearsal).

## Supplement (PVL, 2026-10-30)
- M1: checklist E1 and the Exit Gate unit-suite line now use `node --test "$G/test/*.test.mjs"` (Node 22.23.4 rejects a directory argument).
- M2: B2 decodes TOML 1.0 basic-string escapes (incl. line-ending backslash) and exits 1 only on an INVALID escape; the false "no escapes" sentence is replaced by the grep-verified fact (7 escapes: update-process 4, validate 3). B1 fixture gains one `\n` escape, one line-ending backslash and an invalid-escape case. The three guardrail Exit Gate lines are unchanged and now reachable; Phase 8 B4.6(d) is consistent (same script, same decoding).
- Residuals folded as binding steps: E1 all 15 keys emitted (B2); E2 OLD `process/context/**` from commit 1e81834, FINAL removes the program folder (D5); E4 explicit-path tests and `diff -rq` (D2); E5 command-line git identity (C1).
- Validate Contract left verbatim; re-validate from V1.
