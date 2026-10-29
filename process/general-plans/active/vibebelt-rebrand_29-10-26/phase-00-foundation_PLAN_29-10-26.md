---
name: plan:vibebelt-rebrand-phase-00-foundation
description: "vibebelt-kit rebrand — Phase 00: Foundation"
date: 29-10-26
metadata:
  node_type: memory
  type: plan
  feature: general-plans
  phase: phase-00
---

# Phase 00 — Foundation

**Program:** vibebelt-rebrand
**Umbrella plan:** process/general-plans/active/vibebelt-rebrand_29-10-26/vibebelt-rebrand-umbrella_PLAN_29-10-26.md
**Phase status:** ✅ VERIFIED (29-10-26; report: phase-00-foundation_REPORT_29-10-26.md)
**Complexity:** SIMPLE
**Report destination:** process/general-plans/active/vibebelt-rebrand_29-10-26/phase-00-foundation_REPORT_29-10-26.md (flat in the program task folder)

---

## Overview

One phase of the vibebelt-rebrand program; program context lives in the umbrella plan. Context router: process/context/all-context.md (created in Phase 0). Test routing: process/context/tests/all-tests.md (load before assigning tiers).

Date: 29-10-26
Status: PLANNED
Complexity: SIMPLE

## Purpose

Create the safety net before any change: put the kit under git, tag an untouched baseline, record what every validator says today, add the new owner's copyright line (keeping the original), and run `vc-setup` so `process/context/all-context.md` exists (it is missing now, which trips the Bootstrap Guard). Every later phase compares against this baseline.

---

## Entry Gate

- Program start. User decisions in the umbrella Program Goal Charter are locked.
- Runtime decision (LOCKED): this WSL has no `node`. Every `node ...` command in this plan is run as `node.exe ...` unless the user has installed Linux Node 22. Installing Linux Node 22 in WSL is a USER action; the agent never installs it. Exact commands for the user (optional): `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash` then, in a new shell, `nvm install 22 && node -v` (expected: `v22.x`). Until the user does that, the `node --test e2e-kit-flows.test.mjs` gate and any WSL-only gate are recorded as `baseline-red` or `NOT TESTED` (never as pass).
- Runtime rule for every script in this program: runtime name = `node` when a Linux node exists, else `node.exe`. Results are only compared within ONE runtime (see B3). All gates below are run from the repo root and use path variables so a fresh tester shell can paste them.
- Path variables used in the checklist and gates: `P=process/general-plans/active/vibebelt-rebrand_29-10-26`, `B=$P/baseline`, `V=.claude/skills`, `EX=":!$P"`.
- User presence checkpoint (needed twice in this phase): (1) git e-mail confirmation (A0), (2) interactive `vc-setup` (E0, a discovery conversation: the user must be present for it). The implementing agent returns `NEEDS_CONTEXT` to the orchestrator for each; the orchestrator asks the user and re-spawns with the answers.
- Two git binaries (LOCKED wording): every gate in this plan is run with WSL git (git 2.53 on PATH, no global identity). The `node.exe` validators call Windows git against the same repo; one such cross-read was verified in the research pass on a throw-away drvfs copy (WSL-created repo read by Windows git). The plan therefore adds a gate that `git.exe status` and WSL `git status` both come back clean after C3 (see Step C and the Exit Gate). Raw exit codes under `node.exe` are compared only with other `node.exe` runs.
- Screenshots (LOCKED user decision 1): the 53 PNG files under `.claude/skills/vc-agent-browser/screenshots/` (14.6 MB) stay on disk but are NOT put into the baseline commit or the `upstream-baseline` tag; later phases cannot commit them by accident (see A3 and A3c).

---

## Strategy Recommendation (vc-agent-strategy-compare)

- Signals: S2 no, S7 no (about 6 files touched plus baseline scripts) — score about 1/7 (LOW).
- Recommended: **Sequential** — 1 agent per step. Research, innovate, plan-supplement, PVL, UPDATE PROCESS = sonnet; EXECUTE = opus. Alternatives (parallel / workflow / agent team) add cost with no benefit: the steps depend on each other (tag before the symlink repair and LICENSE edit; baseline before vc-setup).

---

## Blast Radius

- `.git/` (new), repo-local config (`core.fileMode=false`, `core.symlinks=false`, `core.autocrlf=false`, `user.name`, `user.email`), tag `upstream-baseline`, index exec bits (mode 100755) for 4 `.sh` files
- `.agents/skills` (stays the 17-byte text file in the work tree; ONLY its index mode changes to 120000, Step C; no directory copy)
- `LICENSE` (one added line only)
- `.git/info/exclude` (one local line for the screenshots path, used only for the baseline commit) and `.gitignore` (one added line `.claude/skills/vc-agent-browser/screenshots/`, follow-up commit A3c; the 53 screenshot files themselves are never touched, moved or deleted)
- `process/context/all-context.md`, `process/context/tests/all-tests.md` and files `vc-setup` generates under `process/context/`
- `process/general-plans/active/vibebelt-rebrand_29-10-26/baseline/` (validator list, runner, TSV/TXT results, `compare.sh`, `resolved_before.<runtime>.txt`, `upstream_baseline_sha.txt`; later phases add `p1_start.txt` and `resolved_p2_start.<runtime>.txt` here)

---

## Implementation Checklist

### Step A — Git baseline (the tag holds ONLY upstream kit files)

- [x] A0. USER CHECKPOINT (identity). LOCKED user decision 2: `user.name` = `Tomwakeupat530amm`; `user.email` = the user's OWN real address (the user chose a real address, not a GitHub noreply one). The agent never invents an address. Return `NEEDS_CONTEXT`; the orchestrator asks the user to confirm the exact address (the account address on file is `ngocthangptit04@gmail.com`; ask the user to confirm it or give another before use, because it becomes PUBLIC in every commit once the repo is pushed). The GitHub noreply form (`<id>+Tomwakeupat530amm@users.noreply.github.com`) is only a mentioned alternative the user may still choose; it is not the recommendation. If the user has not answered, stop with `NEEDS_CONTEXT` and do not continue. Record the confirmed values in the phase report.
- [x] A1. Confirm `git --version` works; after `git init` (A2) set the confirmed identity repo-locally: `git config user.name "<confirmed>"` and `git config user.email "<confirmed>"` (never `--global`; never touch global config). If git reports "dubious ownership" on `/mnt/c`, STOP and ask the user (that fix needs a global setting). Runtime note: use `node.exe` for every `.mjs` command and record the runtime name in every baseline file (G0-7); do not install Node (see Entry Gate).
- [x] A2. `git init -b main` in the repo root. `.gitignore` and `.gitattributes` already exist: leave them untouched. Pin repo-local settings and print them: `git config core.autocrlf false`, `git config core.fileMode false` (the 9p mount shows every file as executable, so mode probing would record ~550 files as 100755), `git config core.symlinks false`; then `git config --local --get-regexp '^core\.(autocrlf|filemode|symlinks)$'` must print exactly three lines, each ending in `false`.
- [x] A3. Commit the untouched kit WITHOUT the program folder and WITHOUT the screenshots (LOCKED user decision 1). First exclude the screenshots locally: `printf '%s\n' '.claude/skills/vc-agent-browser/screenshots/' >> .git/info/exclude` (files stay on disk; this line is local to the clone and not committed). Then stage with an exclude pathspec (`git add -A -- . ':!process/general-plans/active/vibebelt-rebrand_29-10-26'`), then set exec bits in the index (the index mode is the source of truth, not the work tree): `git update-index --chmod=+x install.sh .claude/skills/vc-agent-browser/scripts/install.sh .claude/skills/vc-agent-browser/scripts/install-deps.sh .claude/skills/vc-debug/scripts/find-polluter.sh`. Check the staged count before committing: `git diff --cached --name-only | wc -l` must print `521` (the 574 files measured outside the program folder, minus the 53 screenshot PNGs; recompute with `find . -path ./.git -prune -o -path ./process/general-plans/active/vibebelt-rebrand_29-10-26 -prune -o -type f -print | wc -l` minus `find .claude/skills/vc-agent-browser/screenshots -type f | wc -l` and use that number if the tree has changed; the size is then about 6.4 MB instead of about 21 MB). Commit as `chore: import upstream kit snapshot`, tag it `upstream-baseline`, and save the tag commit id: `git rev-parse upstream-baseline > $B/upstream_baseline_sha.txt` (create `$B` first with `mkdir -p`). The snapshot is a faithful snapshot of the upstream kit MINUS the agent-browser screenshots (all other files unmodified); it keeps `.agents/skills` as the 17-byte text file (committed as a regular file, mode 100644); the repair is Step C, after the tag.
- [x] A3c. Settle the screenshots for good (separate commit, after the tag, BEFORE any later `git add -A`): append the line `.claude/skills/vc-agent-browser/screenshots/` to the tracked `.gitignore` (keep every existing line; end the file with a newline), confirm `git check-ignore -q .claude/skills/vc-agent-browser/screenshots/$(ls .claude/skills/vc-agent-browser/screenshots | head -1); echo $?` prints `0`, and commit `chore: ignore agent-browser screenshots`. Leave the `.git/info/exclude` line in place. This settles the Phase 5 untrack/gitignore question: the screenshots are neither tracked nor deleted, so Phase 5 keeps its non-destructive stance (no files moved or removed) and only needs to reword its proposal (see the report hand-off). Phases 1-8 may therefore use `git add -A` without the risk of committing the screenshots.
- [x] A3b. Commit the program task folder separately AFTER the tag: `process: add vibebelt-rebrand program plans` (this includes `baseline/` files created later, committed with the Phase 0 process commits).

### Step B — Validator baseline BEFORE any change (records environment-caused reds)

- [x] B1. Create `baseline/validators.list` (single source of truth, one `label<TAB>command` per line; every command is run with the detected runtime in place of the word `node`) containing exactly: the validators from `orchestration.md` §Regression Gate Validators with full paths: `.claude/skills/vc-audit-vc/scripts/validate-agent-parity.mjs`, `validate-skills.mjs`, `validate-kit-portability.mjs`, `validate-guide-sync.mjs`, `validate-protocol-wiring.mjs`, `validate-skill-invocation-wiring.mjs`, `validate-agent-frontmatter.mjs`; `.claude/skills/vc-audit-context/scripts/validate-context-discovery.mjs` (plus `validate-skill-keywords.mjs`, `validate-skill-cross-refs.mjs`, `validate-skill-routing.mjs`, `validate-confusable-skills.mjs`, `validate-protocol-discovery.mjs`); `.claude/skills/vc-audit-plans/scripts/validate-plan-inventory.mjs`; `.claude/skills/vc-generate-context/scripts/validate-all-context.mjs` (all paths verified with ls; `validate-model-effort-policy.mjs` does not exist yet, Phase 1 creates it and appends its own line to this list, so it is EXCLUDED here). Labels are the script base names without `.mjs`; plus `validate-plan-artifact` run on the umbrella plan and each of the 9 phase plans (10 lines, labels `validate-plan-artifact:<file-stem>`), `resolve-manifest` (`resolve-manifest.mjs --json`, exit code only), `e2e-kit-flows` (`node --test e2e-kit-flows.test.mjs`), and `git-diff-check` (`git diff --check HEAD -- . ':!process/general-plans/active/vibebelt-rebrand_29-10-26'`; the program folder is excluded because its checkboxes and reports change while the phases run). Create `baseline/run-validators.sh <out-prefix>`: its first line after the shebang is `cd "$(git rev-parse --show-toplevel)" || exit 2`; it detects the runtime (`node` if on PATH, else `node.exe`), runs EVERY line of the list without stopping on a red one, and writes `<out-prefix>.tsv` (columns: label, exit code, runtime name; exactly 3 tab-separated fields per line) and `<out-prefix>.txt` (full stdout/stderr of each, preceded by one header line `# runtime=<name>`). Exit codes are captured one command at a time (`cmd; rc=$?`); never chain two validators on one line.
- [x] B2. Run it once: `bash $B/run-validators.sh $B/validators_before` -> `validators_before.tsv` + `validators_before.txt`. Also save the resolver list, named by runtime so it is never compared across runtimes: `node.exe resolve-manifest.mjs | sort > $B/resolved_before.node-exe.txt` (use `resolved_before.node.txt` when a Linux node is used). Under `node.exe` the paths come out with backslashes and the exclude filter misbehaves (about 492 lines); that is expected and is why only same-runtime comparison is valid. CORRECTED expectations (measured on the real tree, no repo yet): `validate-skills` = 1 and `validate-context-discovery` = 1, both ONLY because of the `.agents/skills` lines; `validate-all-context` = 0 already (bare-kit mode: "all-context.md absent, skipping per-project checks"), so it is 0 -> 0 with a different mode, NOT red before Step E; `validate-protocol-discovery` was 1 only because no repo existed and is 0 once Step A is done; `e2e-kit-flows` = baseline-red / NOT TESTED under `node.exe`. Any other red is recorded with its cause at the top of `validators_before.txt`; do not fix anything here.
- [x] B3. Create `baseline/compare.sh [--map <file>] [before|after_setup]` (reference defaults to `after_setup`). LOOKUP RULE (Phase 0 guarantee, relied on by Phase 6 C3b and Phase 8): the script first sets `D="$(cd "$(dirname "$0")" && pwd)"` and resolves `validators.list`, `run-validators.sh`, `validators_<reference>.tsv` and the `--map` file relative to `$D` (its OWN directory), never to a hard-coded repo-relative `baseline/` path; only AFTER those lookups does it `cd "$(git rev-parse --show-toplevel)" || exit 2` so validator commands execute from the repo root (works from any directory, and works when the whole `baseline/` folder is copied elsewhere). It re-runs `run-validators.sh` into a temp prefix and compares with `validators_<reference>.tsv` row by row on the label. Rules: (1) a label is WORSE if its reference exit code was 0 and is now non-zero, or if the label is missing from the new run; (2) a label present only in the new run (a validator added by a later phase) prints `NOTE new validator <label>` and is not a failure; (3) RUNTIME RULE: if the runtime column of a row differs from the new run's runtime, that row is not compared; the script prints `NOTE runtime differs for <label> (ref=<a> now=<b>): re-baseline needed` and counts it; if ANY row was skipped this way the script exits 3 (distinct from 1), telling the caller to re-run `run-validators.sh` for the new runtime into a new `validators_after_setup.<runtime>.tsv` and compare against that; (4) `--map <file>`: optional rename map, one `old-label<TAB>new-label` per line, so a phase that renames or moves a validator (Phase 6) can compare the renamed label with its old reference row; (5) LICENSE RULE (C-SAFE-2, runs EVERY time the script runs, independent of the validator rows): it runs `grep -c "Copyright (c) 2026 vibecode" LICENSE` (must be 1), `grep -c "Copyright (c) 2026 Tomwakeupat530amm" LICENSE` (must be 1) and the original-line-preserved check (`git diff upstream-baseline -- LICENSE | grep -c '^-[^-]'` = 0); any miss prints `WORSE LICENSE <check>` and forces a non-zero exit, so every later phase's "not worse than baseline" gate carries C-SAFE-2 (later phases only reference this rule, they do not redefine it); (6) exit 1 and print each worse label by name when any is worse or any LICENSE check failed, otherwise exit 0. "Red validator" in this program means "worse than the Phase 0 baseline": validators already red in `validators_after_setup.tsv` may stay red but may not get worse. All later phases use this script as their regression gate.

### Step C — Record `.agents/skills` as a symlink in git (separate `fix:` commit, after the tag)

- [x] C1. Document the cause in the phase report: on this Windows/drvfs checkout git's symlink `.agents/skills -> ../.claude/skills` was materialized as a 17-byte plain text file containing `../.claude/skills`; the manifest `symlinks` entry recreates the symlink for real installs, so the problem is environment-only. Measured: a WSL symlink on this mount cannot be read by `node.exe` (lstat fails with EACCES, so validate-skills reports it missing), and a plain directory copy fails validate-skills' realpath check and would add ~15 MB that Phases 5 and 6 must keep in sync. So BOTH real-link and copy approaches are rejected here.
- [x] C2. KEEP the 17-byte text file in the work tree. `core.symlinks=false` was set in A2. Record the correct object in the index only: `BLOB=$(printf '../.claude/skills' | git hash-object -w --stdin)` then `git update-index --add --cacheinfo 120000,$BLOB,.agents/skills`. Verify `git ls-files -s .agents/skills | cut -c1-6` prints `120000` and `git status --porcelain -- .agents` prints nothing. There is NO directory-copy fallback; if the index update fails, stop (BLOCKED) and ask.
- [x] C3. Commit `fix: record .agents/skills as symlink in index`. Run `validate-skills.mjs` and `validate-context-discovery.mjs` and apply the filtered check: `node.exe .claude/skills/vc-audit-vc/scripts/validate-skills.mjs | grep '^    "' | grep -vc '\.agents/skills'` must print `0` (same for `vc-audit-context/scripts/validate-context-discovery.mjs`). Their raw exit code stays 1 under `node.exe` until Linux Node 22 or the ubuntu CI run; record that as an environment red in the baseline files and the phase report (NOT a failure of this phase). Mixed-binary check (WSL git and Windows git read the same repo): `git status --porcelain -- . ':!process/general-plans/active/vibebelt-rebrand_29-10-26'` and `git.exe status --porcelain -- . ':!process/general-plans/active/vibebelt-rebrand_29-10-26'` must BOTH print nothing. If `git.exe` reports changes that WSL git does not (line endings, modes, the 17-byte `.agents/skills` file), record the cause in the phase report and ask the user; do not change global config.

### Step D — LICENSE (separate `chore:` commit)

- [x] D1. Add exactly one new line directly below the original line 3 `Copyright (c) 2026 vibecode`: `Copyright (c) 2026 Tomwakeupat530amm` (LOCKED decision Q1). Never edit or remove the original line or the MIT text. Commit `chore: add fork copyright line`.

### Step E — Context bootstrap (separate `process:` commit)

- [x] E0. USER CHECKPOINT (vc-setup is interactive). `vc-setup` asks questions and waits for approval at each major step, so it cannot run unattended, and its discovery conversation needs the user present. The implementing agent returns `NEEDS_CONTEXT: user presence needed to run vc-setup`; the orchestrator asks the user whether they are present now. If YES: run `vc-setup` with the user and answer its setup questions in order with these PREPARED answers (the user may change any of them; record every question and answer in the phase report): project = "vibebelt-kit source repo (the kit itself, not an app)"; stack = Node scripts (no app framework); validators run as `node <script>.mjs` (use `node.exe` here) and the e2e test as `node --test e2e-kit-flows.test.mjs`; team = solo maintainer; CI = GitHub Actions validate workflow only, no deploys yet; external services = none. Keep `CLAUDE.md` and `AGENTS.md` untouched; never overwrite an existing file. LAYOUT CHANGES: if vc-setup proposes removing the `.gitkeep` files in `process/general-plans/{reports,references}/`, that is expected and the user decides. SYMLINK REPAIR: tell vc-setup NOT to repair `.agents/skills` (its VALIDATE step 3, "`.agents/skills` symlink exists and resolves", will fail on the 17-byte text file; this is known and deliberate, decision b: index-only mode 120000, work tree keeps the text file). Any attempt by vc-setup to replace the text file with a link or a copy is overreach and is caught by E3. If NO (or no answer): use E2 and record "vc-setup not run: user absent".
- [x] E1. (Only when E0 = YES) after vc-setup finishes, go to E3.
- [x] E2. (N/A — vc-setup ran with the user; seed fallback not used) FALLBACK (seed-based, used when E0 = NO or vc-setup asks anything outside the suggested set): write `process/context/all-context.md` and `process/context/tests/all-tests.md` by hand from the templates in `process/_seeds/context/`, filling the project name and the required sections. The seed carries `Last updated: (auto-generated)`, which `validate-all-context.mjs` REJECTS; replace it with the real run date in the form `Last updated: YYYY-MM-DD` (use `$(date +%Y-%m-%d)`). Record "context written from seeds" in the phase report.
- [x] E3. Overreach check scoped away from the program folder: `git status --porcelain -- . ':!process/general-plans/active/vibebelt-rebrand_29-10-26'`. The ONLY writes `vc-setup` is expected to make are: (1) everything under `process/context/**`; (2) `_GUIDE.md` files under `process/general-plans/active/`, `process/general-plans/backlog/`, `process/general-plans/completed/` and `process/features/` (the `_GUIDE.md` in the task folder itself is inside the excluded program folder); (3) `.seed` companion files under `process/`; (4) a possible deletion of `.gitkeep` in `process/general-plans/reports/` and `process/general-plans/references/`, only if the user approved LAYOUT CHANGES at E0. Everything else is overreach, in particular anything under `.agents/`, `.claude/`, `.codex/`, and `LICENSE`, `CLAUDE.md`, `AGENTS.md`, `.gitignore`, `.gitattributes`, and any change to `.agents/skills`: revert that path with `git checkout -- <path>` (for `.agents/skills` use `git checkout -- .agents/skills` and re-check `git ls-files -s .agents/skills | cut -c1-6` = `120000`) and STOP (BLOCKED, ask the user).
- [x] E4. Confirm `process/context/all-context.md` AND `process/context/tests/all-tests.md` exist (the umbrella Global Constraints depend on the second); run `node.exe .claude/skills/vc-generate-context/scripts/validate-all-context.mjs > $B/validate_all_context.txt; echo $?` (expected `0`) and `grep -c 'bare-kit mode' $B/validate_all_context.txt` (expected `0`: the validator must now run the per-project checks, not skip them). Commit `process: context bootstrap`.

### Step F — Second baseline and hand-off

- [x] F1. Re-run `bash $B/run-validators.sh $B/validators_after_setup`. This TSV is the reference all later phases compare against. `bash $B/compare.sh before` must exit 0 right after this step (nothing got worse versus `validators_before.tsv`).
- [x] F2. Commit `baseline/` (validators.list, run-validators.sh, compare.sh, both TSV/TXT pairs, `resolved_before.<runtime>.txt`, `upstream_baseline_sha.txt`) as a SEPARATE `process: record validator baseline` commit; this commit and the phase report are NOT part of the exit-gate cleanliness checks (those exclude the program folder). Write the phase report with the cause of the `.agents/skills` text file, the runtime used, the identity values, the vc-setup questions and answers (or the seed fallback note), and the list of baseline-red / NOT TESTED gates.

---

## Exit Gate

Every line below is a runnable command with an expected value. Run from the repo root; replace `node.exe` by `node` only if a Linux node exists. Paste the variable block first (a fresh tester shell has none of them):

```bash
P=process/general-plans/active/vibebelt-rebrand_29-10-26
B=$P/baseline
V=.claude/skills
EX=":!$P"
git rev-parse --is-inside-work-tree                                   # Expected: true
git config --local --get-regexp '^core\.(autocrlf|filemode|symlinks)$' | grep -c 'false$'   # Expected: 3
git tag -l upstream-baseline                                          # Expected: upstream-baseline
git rev-parse upstream-baseline | diff - $B/upstream_baseline_sha.txt  # Expected: no output
git ls-tree -r --name-only upstream-baseline | grep -c 'vibebelt-rebrand_29-10-26'   # Expected: 0
git ls-tree -r upstream-baseline install.sh | cut -c1-6               # Expected: 100755
git ls-tree -r upstream-baseline | grep -c '^100755'                  # Expected: 4
git ls-tree -r --name-only upstream-baseline | wc -l                  # Expected: 521 (574 minus the 53 screenshot PNGs; recompute from the find commands in A3 if the tree changed)
git ls-tree -r --name-only upstream-baseline | grep -c 'vc-agent-browser/screenshots'   # Expected: 0
find .claude/skills/vc-agent-browser/screenshots -type f | wc -l      # Expected: 53 (files still on disk)
git ls-files .claude/skills/vc-agent-browser/screenshots | wc -l      # Expected: 0
git check-ignore -q .claude/skills/vc-agent-browser/screenshots/$(ls .claude/skills/vc-agent-browser/screenshots | head -1); echo $?   # Expected: 0
git log --format=%s -n 12 | grep -c '^chore: ignore agent-browser screenshots$'   # Expected: 1
test -s $B/validators_before.txt && test -s $B/validators_before.tsv && echo saved   # Expected: saved
awk -F'\t' 'NF!=3' $B/validators_before.tsv $B/validators_after_setup.tsv            # Expected: no output
bash $B/compare.sh before; echo $?                                    # Expected: 0
bash $B/compare.sh; echo $?                                           # Expected: 0
test -f process/context/all-context.md && test -f process/context/tests/all-tests.md && echo present   # Expected: present
node.exe $V/vc-generate-context/scripts/validate-all-context.mjs > $B/validate_all_context.txt; echo $?   # Expected: 0
grep -c 'bare-kit mode' $B/validate_all_context.txt                   # Expected: 0
git ls-files -s .agents/skills | cut -c1-6                            # Expected: 120000
git status --porcelain -- .agents                                     # Expected: no output
node.exe $V/vc-audit-vc/scripts/validate-skills.mjs | grep '^    "' | grep -vc '\.agents/skills'   # Expected: 0 (only .agents/skills environment failures remain)
node.exe $V/vc-audit-context/scripts/validate-context-discovery.mjs | grep '^    "' | grep -vc '\.agents/skills'   # Expected: 0
grep -c '^Copyright (c) 2026 vibecode$' LICENSE                       # Expected: 1 (original kept)
grep -c '^Copyright (c) 2026 Tomwakeupat530amm$' LICENSE              # Expected: 1
awk '/^Copyright \(c\) 2026 vibecode$/{a=NR}/^Copyright \(c\) 2026 Tomwakeupat530amm$/{b=NR}END{exit !(a&&b&&b>a)}' LICENSE; echo $?   # Expected: 0
git diff upstream-baseline -- LICENSE | grep -c '^-[^-]'             # Expected: 0
git status --porcelain -- . "$EX"                                     # Expected: no output
git.exe status --porcelain -- . "$EX"                                  # Expected: no output (Windows git and WSL git agree)
git diff --check upstream-baseline HEAD -- . "$EX"                    # Expected: no output
```

- All checklist items checked; phase report written to the report destination above.
- Overreach check E3 recorded as "clean" in the report.

---

## Blockers That Would Justify BLOCKED Status

- git not installed and cannot be installed by the user, or "dubious ownership" needs a global config change the user declines.
- `vc-setup` fails or wants to overwrite existing user files (stop and ask; never overwrite) and the manual fallback also cannot produce `tests/all-tests.md`.

---

## Phase Completion Rules

- CODE DONE = checklist items done; VERIFIED = Exit Gate commands pass AND `compare.sh` exits 0 (no validator worse than the Phase 0 baseline) AND regression checkpoint passes AND validate-contract exists.
- Known-Gap alone never makes a behavior PASS; write a backlog stub and keep that gate CONDITIONAL.

## Acceptance Criteria

- See the Exit Gate commands and the Verification Evidence table; each row names the charter criterion it proves (proven by + strategy).

## Touchpoints

- Repo root (git init), `LICENSE`, `.gitignore` (one line), `.agents/skills`, `process/context/**` (generated), `baseline/` evidence folder

---

## Public Contracts

- Original MIT text and original copyright line unchanged; no kit behavior changes. `upstream-baseline` contains only upstream files.

---

## Verification Evidence

| Gate / Scenario | Strategy | Proves SPEC criterion |
|---|---|---|
| git repo + pinned config (3 x false) + `upstream-baseline` tag (SHA saved to file), tag has no program plan files, `install.sh` mode 100755, exactly 4 entries at 100755 | Fully-Automated (Exit Gate lines 1-8) | C-P0 (R0.1): git exists |
| `validators_before.tsv/.txt` saved, 3 columns | Fully-Automated | C-P0 (R0.2): validator baseline saved |
| `bash baseline/compare.sh before` and `bash baseline/compare.sh` exit 0 (cwd-independent, same-runtime rule, exit 3 = re-baseline needed) | Fully-Automated | C-P0 (R0.3): "not worse than baseline" is mechanical |
| `all-context.md` + `tests/all-tests.md` exist, `validate-all-context.mjs` exit 0 AND output has no `bare-kit mode` (per-project checks really ran; `Last updated` is a real date) | Fully-Automated | C-P0 (R0.4): context router exists |
| LICENSE: original line = 1, new line = 1, order, no removed lines | Fully-Automated (grep/awk/diff) | C-SAFE-2 (R0.5): MIT notice kept |
| `git status --porcelain` and `git diff --check upstream-baseline HEAD`, both with the program-folder pathspec exclude, print nothing | Fully-Automated | C-P0 (R0.6): no stray changes or whitespace damage outside the program folder |
| `upstream-baseline` holds 521 files and no agent-browser screenshots; 53 PNGs still on disk; path is gitignored by the follow-up commit `chore: ignore agent-browser screenshots` | Fully-Automated (Exit Gate screenshot lines) | C-P0 (R0.9): screenshots excluded, not lost, cannot be committed by accident |
| `git.exe status` and WSL `git status` both print nothing after C3 (mixed git binaries agree) | Hybrid (precondition: Windows git reachable as `git.exe`) | C-P0 (R0.6) |
| `.agents/skills` index mode 120000, work tree unchanged, and no validate-skills / validate-context-discovery failure other than `.agents/skills` (`grep -vc` = 0) | Hybrid (precondition: git only; raw exit 0 needs Linux Node 22 or ubuntu CI) | C-P0 (R0.7): symlink recorded |
| reviewer follows every `all-context.md` routing row to an existing file; E0 vc-setup questions and answers (or seed fallback note) are in the report | Agent-Probe | C-P0 (R0.8): generated context accurate |
| `node --test e2e-kit-flows.test.mjs` under WSL | Known-Gap residual (baseline-red / NOT TESTED without Linux Node 22): backlog stub in Phase 8 user checklist; gate stays CONDITIONAL, never PASS on this alone | C-P0 (R0.2) residual |

---

## Phase Loop Progress

Orchestrator reads this before deciding which subagent to spawn next. The canonical 7-step inner loop
`R → I → P → PVL → E → EVL → UP` SKIPS SPEC (the umbrella plan and the user brief act as the SPEC).

- [x] 1. RESEARCH — research-agent (sonnet): prior phase reports read; test context loaded; plan drift checked (done 29-10-26; no blocker; findings folded into the Inner Loop Refresh Note)
- [x] 2. INNOVATE — SKIPPED as mechanical: git baseline, validator baseline, LICENSE line and context bootstrap have one obvious approach fixed by the locked umbrella decisions, so there was no design choice to compare (Decision Summary not needed)
- [x] 3. PLAN-SUPPLEMENT — plan-agent (sonnet): existing phase plan updated; Inner Loop Refresh Note written 29-10-26 (inner 1b supplement applied)
- [x] 4. PVL — vc-validate-agent (sonnet): full V1-V7; validate-contract written; Gate: PASS (inner re-run, 29-10-26)
- [x] 5. EXECUTE — vc-execute-agent (opus): steps A-D by vc-execute-agent; step E vc-setup run interactively in the main session with the user plus a vc-setup SCAFFOLD/STUDY agent; F1 baseline re-run by vc-tester; F2 two commits (746045b, 1e81834)
- [x] 6. EVL — vc-tester: independent confirmation run PASSED (38 rows, nothing failing, E3 allow-list held, no remote, nothing pushed); EVL HANDOFF SUMMARY written
- [x] 7. UPDATE PROCESS — archived; context updated; committed (phase report written, umbrella state rewritten; process commit by vc-git-manager follows)

**Validate-contract required.** If step 4 (PVL) is unchecked or `## Validate Contract` reads
"(placeholder — vc-validate-agent writes this section before EXECUTE)", the orchestrator must spawn
vc-validate-agent first. A partial contract (missing Plan updates applied / Execute-agent
instructions / Test gates) is treated as a placeholder.

---

## Test Infra Improvement Notes

(none identified yet)

---

## Resume and Execution Handoff

- Selected plan file path: `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-00-foundation_PLAN_29-10-26.md`
- Last completed step: not started
- Validate-contract status: written 29-10-26 (generated-by outer-pvl); PVL cycle 3 re-validation 29-10-26 from V1 on the supplemented plan: Gate: PASS (0 FAIL, 0 MUST-FIX; residuals carried as named Known-Gaps and Execute-agent instructions)
- Supporting context files: umbrella plan, `phase-blast-radius-registry.md`, prior phase report (if any)
- Next step: step 4 PVL (inner re-run from V1: the Inner Loop Refresh Note dated 2026-10-29 is newer than the contract), then step 5 EXECUTE. Phase 0 EXECUTE needs two user checkpoints (A0 git e-mail confirmation, E0 interactive vc-setup).

---

## Inner Loop Refresh Note: 2026-10-29 — changed sections: Entry Gate, Blast Radius, A0, A3, A3c (new), C3, E0, E3, Exit Gate, Verification Evidence, Touchpoints, Resume and Execution Handoff (Phase 0 research findings and user decisions 1-3: screenshots excluded, 521-file baseline, real e-mail, vc-setup guidance, mixed git binaries). Invalidates prior validate-contract.

## Validate Contract

Status: PASS
Date: 29-10-26
date: 2026-10-29
generated-by: inner-pvl: phase-0
supersedes: 2026-10-29 (outer-pvl) — outer PVL cycle-3 PASS contract, invalidated by the Inner Loop Refresh Note of 2026-10-29 (screenshots excluded, 521-file baseline, A0 identity, vc-setup guidance, mixed git binaries); this inner PVL re-run from V1 has current evidence

Parallel strategy: sequential
Rationale: score 1/7 (only S4, phase-program member). Steps depend on each other (tag before the symlink repair and LICENSE edit; baseline before vc-setup). Model: EXECUTE = opus, everything else sonnet. This pass was ONE fire-and-forget validate-agent that re-checked the real repo directly and ran Steps A-F (plus the 15 validators, the 10 plan-artifact rows and `resolve-manifest`) in a throw-away copy of the repo on the same Windows drive (9p mount), then deleted the copy; it could not spawn Layer 1 / Layer 2 sub-agents. A fan-out re-run would cost 4 (Layer 1) + 6 (Layer 2: Steps A-F) = 10 agents, up to 13 with the 3 optional ones, under the 30-agent guard.

V1 line: `V1 RE-VALIDATE TRIGGERED: Inner Loop Refresh Note dated 2026-10-29 is newer than existing contract.` (the note says "Invalidates prior validate-contract"; both carry the same calendar date, so the note is treated as newer.)

### Real-repo facts checked (V1, inner re-run)

- Real tree has NO `.git` (checked before and after; nothing was written in the project). WSL has git 2.53.0 and no `node`; `node.exe` works from `/mnt/c`; `git.exe` (Windows git) is reachable from WSL. Structural plan check (`validate-plan-artifact.mjs` on this plan): exit 0, 0 failures, 2 advisory "legacy plan shape" warnings. All 16 script paths used by B1 exist (15 validators + `validate-plan-artifact`), as do `resolve-manifest.mjs`, `e2e-kit-flows.test.mjs`, `vc-manifest.json` and both seed files; `validate-model-effort-policy.mjs` is absent as the plan says.
- Counts measured on the real tree: 574 files outside the program folder; 53 PNGs under `.claude/skills/vc-agent-browser/screenshots/` (all `.png`, first file `chat-mock-v1.png`); 574 - 53 = 521. Sizes in bytes: baseline files 5,265,687 (about 5.3 MB), screenshots 14,889,028 (about 14.9 MB). The plan's "about 6.4 MB" is a loose figure (it is a size note, not a gate; see R0-e).
- Program state: `results.tsv` has 6 lines (header + baseline + cycles 1-4); umbrella has `## Stable Program Goal` on disk (BRANCH B: no goal block is written into this phase plan); no `Phase Ordering`, no `Pre-PVL Conflict Resolution`, no BLOCKED registry entry for Phase 0.
- **Dry run of Steps A, C, D, E2 and the validator rows in a copy of the repo** (copy on the same drvfs mount, so exec bits, ownership and Windows-git behaviour are the real ones; no "dubious ownership" stop; copy deleted afterwards):
  - A2/A3: `git config` pinned to three `false` lines; `.git/info/exclude` line added; `git add -A -- . ':!P'` then `git update-index --chmod=+x` on the 4 `.sh` files: `git diff --cached --name-only | wc -l` = `521`, `... | grep -c screenshots` = `0`. After commit and tag: `git ls-tree -r --name-only upstream-baseline | wc -l` = `521`; `... | grep -c 'vc-agent-browser/screenshots'` = `0`; `... | grep -c vibebelt-rebrand_29-10-26` = `0`; `install.sh` mode `100755`; `grep -c '^100755'` = `4`; `.agents/skills` committed as `100644 blob 454b8427...` (17 bytes, `../.claude/skills`, no trailing newline); `upstream_baseline_sha.txt` written after `mkdir -p`.
  - A3c: `.gitignore` ends with a newline; appending the line and running `git check-ignore -q .claude/skills/vc-agent-browser/screenshots/chat-mock-v1.png; echo $?` = `0`; commit `chore: ignore agent-browser screenshots`. With `.git/info/exclude` emptied on purpose, `git add -A -n` still lists 0 screenshot files and `git check-ignore -v` names `.gitignore:10`: the tracked `.gitignore` alone is sufficient, the exclude line is only for the baseline commit. After A3b: `git ls-files .claude/skills/vc-agent-browser/screenshots | wc -l` = `0` and `find ... -type f | wc -l` = `53`.
  - C2/C3: `git update-index --add --cacheinfo 120000,<blob>,.agents/skills` works with `core.symlinks=false`; `git ls-files -s | cut -c1-6` = `120000`; `git status --porcelain -- .agents` prints `T  .agents/skills` before the C3 commit and nothing after it; the work-tree file is untouched (17 bytes).
  - D1: `sed '3a ...'` form gives original line 3 unchanged and the new line 4; the 4 LICENSE assertions print `1`, `1`, order rc `0`, removed-lines `0`.
  - Mixed git binaries: after C3 and D1, `git status --porcelain -- . ':!P'` (WSL) and `git.exe status --porcelain -- . ':!P'` both print nothing; `git.exe ls-files -s .agents/skills` = `120000`. The `git.exe` gate is not vacuous: a probe file created in the copy appeared in BOTH outputs (`?? zz_probe.txt`) and was removed. Running the validators (which use Windows git) leaves both statuses clean.
  - `git diff --check upstream-baseline HEAD -- . ':!P'` prints nothing (rc 0); the history reads, newest first: `process: context bootstrap`, `chore: add fork copyright line`, `fix: record .agents/skills as symlink in index`, `process: add vibebelt-rebrand program plans`, `chore: ignore agent-browser screenshots`, `chore: import upstream kit snapshot` (the `git log -n 12 | grep -c` gate sees exactly 1 ignore commit).
  - Validator rows (B1 list, run one command at a time with stdin closed, `node.exe`, repo present, end state): `validate-skills` 1 and `validate-context-discovery` 1 (only `.agents/skills` lines: filtered `grep -vc '\.agents/skills'` = `0` for both); the other 13 validators 0 (incl. `validate-protocol-discovery` 0 and `validate-all-context` 0); 10 `validate-plan-artifact` rows 0; `resolve-manifest` 0. This matches the corrected B2 expectations. Caveat found while testing: `echo "$(basename $s) $?"` loses the exit code (command substitution runs first); the runner must capture `rc=$?` on its own line before printing, as B1 already says ("`cmd; rc=$?`").
  - E2 (seed path): `all-context.md` and `tests/all-tests.md` written from the seeds with `{{project_name}}` replaced and a real `Last updated: YYYY-MM-DD`: `validate-all-context.mjs` rc `0`, `grep -c 'bare-kit mode'` = `0`, 3 advisory warnings, 0 failures.
- `vc-setup` (SKILL.md and Phase 4 text read, not run): existing-project Merge/Refresh flow writes `process/context/**`, `_GUIDE.md` files in empty process folders, `.seed` companion copies, may offer `.gitkeep`/legacy-dir cleanup under LAYOUT CHANGES (needs user approval), and its VALIDATE step 3 checks that `.agents/skills` is a resolving symlink. The E3 allow-list matches those writes; the symlink check will fail on the text file as E0 warns. Not run, because it is interactive.
- `e2e-kit-flows.test.mjs` under `node.exe` is red here (path bug and `EPERM` cleanup in `C:\tmp`): baseline-red / NOT TESTED, never passed by assumption. The `compare.sh` / `run-validators.sh` text (B1-B3) was NOT changed by this supplement; its cycle-3 behaviour check (cwd independence, exit 3, LICENSE RULE) is carried forward, not re-run in this pass.

### Prior gaps and new-content gates: re-check

- F0-A, G0-8 to G0-11 stay CLOSED (index-only 120000, program-folder pathspec exclude, 4 exec bits, seed path with real date, corrected B2 premise, `compare.sh` rules).
- New gates verified satisfiable and non-vacuous: 521 / 0 / 53 / 0 counts, `git check-ignore` = 0, tag has no screenshot and no program paths, `.git/info/exclude` removes the screenshots from `git add -A` (and the tracked `.gitignore` does the same on its own), `git.exe` and WSL status agree and both detect a real change.
- The stated counts (574, 53, 521) are measured on today's tree; the plan already tells the executor to re-derive them with the `find` commands if the tree changes (instruction E12 repeats it).

### Plan updates applied

None in this pass (validate-agent writes the contract only). The remaining wording issues (R0-a, R0-b, R0-c, R0-d, R0-e) are bounded and are resolved by the Execute-agent instructions below, which override the plan text where they differ and do not change the Exit Gate.

### Execute-agent instructions

- E1. Runtime: every `node ...` in the plan is `node.exe ...`; record the runtime name in every baseline file. Do not install Node.
- E2. Never run `git config --global`. Repo-local identity only.
- E3. `upstream-baseline` must contain ONLY upstream kit files (no program folder, no screenshots). Verify with the `git ls-tree` gates before moving on.
- E4. Before writing any backlog stub run `mkdir -p process/general-plans/backlog` (the directory is empty and git does not store it).
- E5. R0-a (C2 wording): `git status --porcelain -- .agents` prints `T  .agents/skills` until the C3 commit is made. That is expected, not a failure. Treat the C2 check as `git ls-files -s .agents/skills | cut -c1-6` = `120000`, and run the "prints nothing" form AFTER the C3 commit (also an Exit Gate line). Only a failed `git update-index` is a BLOCKED stop.
- E6. R0-b (runner hardening): in `run-validators.sh` start every validator with stdin closed (`bash -c "$c" </dev/null`) and capture the exit code on its own line (`cmd; rc=$?`) before printing it. After B2 and again after F1 check `test "$(wc -l < $B/validators_before.tsv)" -eq "$(wc -l < $B/validators.list)"` and the same for `validators_after_setup.tsv` (a one-row baseline would make every later "not worse than baseline" check vacuous).
- E7. Take the first baseline AFTER Step A (init, tag, ignore commit) and BEFORE any other change; take the second after Step E. One command per exit code; never chain two validators on one line.
- E8. After vc-setup or the seed write, run the E3 overreach check scoped away from the program folder; on a hit revert that path and stop.
- E9. Clean up `C:\tmp\vc-e2e-*` folders that `e2e-kit-flows` leaves outside the repo only if they were created by your own run; never touch other folders there.
- E10. R0-c (A0 identity, supersedes the A0 wording): the USER ALREADY CONFIRMED the git identity in chat on 2026-10-29: `user.name` = `Tomwakeupat530amm`, `user.email` = `minhnguyentuan31103@gmail.com`. Do NOT return `NEEDS_CONTEXT` for the address and do NOT use `ngocthangptit04@gmail.com`. Set both repo-locally in A1 right after `git init`, before the first commit, and record the values in the phase report. The orchestrator may pass this instruction verbatim in the spawn prompt. (The A0 text in the plan body and the umbrella locked-decision row still say "ask the user"; they are stale, not a gate.)
- E11. R0-d (A3c staging): stage ONLY the tracked file: `git add .gitignore` (never `git add -A`) and commit `chore: ignore agent-browser screenshots`. The program folder is still untracked at that moment and belongs to the next commit (A3b); sweeping it into the ignore commit would leave A3b with nothing to commit.
- E12. Re-derive the counts at execution: `find . -path ./.git -prune -o -path ./process/general-plans/active/vibebelt-rebrand_29-10-26 -prune -o -type f -print | wc -l` and `find .claude/skills/vc-agent-browser/screenshots -type f | wc -l`; expected staged count = first minus second (574 - 53 = 521 on 29-10-26). If the tree changed, use the new numbers in the A3 check and in the Exit Gate lines; if the difference cannot be explained, stop and ask. Report the real byte sizes (about 5.3 MB baseline, about 14.9 MB screenshots on 29-10-26), not the plan's rounded figure.

### Test gates

Test context: `process/context/tests/all-tests.md` does not exist yet (Phase 0 creates it). Tiers come from the real validator scripts and the dry run above; re-check against the generated `all-tests.md` at execution time.

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P0 (R0.1) | repo is under git, config pinned, untouched upstream snapshot tagged, no program plan files in it, exec bits right | Fully-Automated | Exit Gate lines 1-8: `git rev-parse --is-inside-work-tree` = `true`; `git config --local --get-regexp '^core\.(autocrlf\|filemode\|symlinks)$' \| grep -c 'false$'` = `3`; `git tag -l upstream-baseline` = `upstream-baseline`; tag SHA equals `$B/upstream_baseline_sha.txt`; `git ls-tree -r --name-only upstream-baseline \| grep -c 'vibebelt-rebrand_29-10-26'` = `0`; `install.sh` mode `100755`; `git ls-tree -r upstream-baseline \| grep -c '^100755'` = `4` | A (dry run reproduced every value) |
| C-P0 (R0.2) | validator baseline saved with real exit codes, every list line present | Fully-Automated | `test -s $B/validators_before.txt && test -s $B/validators_before.tsv && echo saved` = `saved`; `awk -F'\t' 'NF!=3' $B/validators_before.tsv $B/validators_after_setup.tsv` prints nothing; row-count rows (E6): `test "$(wc -l < $B/validators_before.tsv)" -eq "$(wc -l < $B/validators.list)" && echo rows-ok` = `rows-ok` and the same for `validators_after_setup.tsv` | B (row-count rows added by this contract, E6) |
| C-P0 (R0.3) | "not worse than baseline" is a command | Fully-Automated | `bash $B/compare.sh before; echo $?` = `0` and `bash $B/compare.sh; echo $?` = `0` right after Step F (3 = runtime changed, re-baseline) | A (cycle-3 behaviour check carried forward; B3 text unchanged) |
| C-P0 (R0.4) | context router exists, routes to a test doc, validator green in per-project mode | Fully-Automated | `test -f process/context/all-context.md && test -f process/context/tests/all-tests.md && echo present` = `present`; `node.exe .claude/skills/vc-generate-context/scripts/validate-all-context.mjs > $B/validate_all_context.txt; echo $?` = `0`; `grep -c 'bare-kit mode' $B/validate_all_context.txt` = `0` | A (seed path reproduced; interactive vc-setup output is gated by the same commands at E4) |
| C-SAFE-2 (R0.5) | original MIT line kept, new owner line added below it, nothing removed | Fully-Automated | `grep -c '^Copyright (c) 2026 vibecode$' LICENSE` = 1; `grep -c '^Copyright (c) 2026 Tomwakeupat530amm$' LICENSE` = 1; order awk exits 0; `git diff upstream-baseline -- LICENSE \| grep -c '^-[^-]'` = 0; and `compare.sh` repeats them on every run | A |
| C-P0 (R0.6) | no stray changes and no whitespace damage outside the program folder | Fully-Automated | `git status --porcelain -- . ':!process/general-plans/active/vibebelt-rebrand_29-10-26'` prints nothing; `git diff --check upstream-baseline HEAD -- . ':!process/general-plans/active/vibebelt-rebrand_29-10-26'` prints nothing | A |
| C-P0 (R0.6, mixed git binaries) | Windows git (used inside the `node.exe` validators) and WSL git read the same repo and both see it clean | Hybrid | precondition: `git.exe` reachable from WSL. `git.exe status --porcelain -- . ':!process/general-plans/active/vibebelt-rebrand_29-10-26'` prints nothing AND the WSL form prints nothing (after C3 and again at the Exit Gate). Dry run showed both also detect a real probe file, so "nothing" is not a silent error | A |
| C-P0 (R0.7) | `.agents/skills` is committed as a symlink (mode 120000) and the only remaining validate-skills / validate-context-discovery failures are the environment ones | Hybrid | precondition: git only. `git ls-files -s .agents/skills \| cut -c1-6` = `120000`; `git status --porcelain -- .agents` prints nothing (after the C3 commit, E5); `node.exe .../validate-skills.mjs \| grep '^    "' \| grep -vc '\.agents/skills'` = `0`, same for `validate-context-discovery.mjs`. Raw exit 0 only with Linux Node 22 or on ubuntu CI | A |
| C-P0 (R0.8) | generated context is accurate (describes this kit, routes to files that exist) | Agent-Probe | reviewer follows every `all-context.md` routing row to its target, confirms the file exists and matches its one-line description; pass/fail per row in the phase report; the vc-setup questions and answers (or the "written from seeds" note) are in the report | A |
| C-P0 (R0.9) | agent-browser screenshots are excluded from the baseline and the tag, stay on disk, and cannot be committed by accident | Fully-Automated | Exit Gate screenshot lines: `git ls-tree -r --name-only upstream-baseline \| wc -l` = `521`; `... \| grep -c 'vc-agent-browser/screenshots'` = `0`; `find .claude/skills/vc-agent-browser/screenshots -type f \| wc -l` = `53`; `git ls-files .claude/skills/vc-agent-browser/screenshots \| wc -l` = `0`; `git check-ignore -q .claude/skills/vc-agent-browser/screenshots/$(ls .claude/skills/vc-agent-browser/screenshots \| head -1); echo $?` = `0`; `git log --format=%s -n 12 \| grep -c '^chore: ignore agent-browser screenshots$'` = `1` | A (dry run reproduced every value; counts re-derived at execution, E12) |
| C-P0 (R0.10) | every commit carries the confirmed repo-local identity (nothing invented, global config untouched) | Fully-Automated | `git log --format='%an <%ae>%n%cn <%ce>' \| sort -u` prints exactly one line: `Tomwakeupat530amm <minhnguyentuan31103@gmail.com>`; `git config --local user.email` prints the same address | B (gate row added by this contract, E10; the behavior had no automated gate before) |
| C-P0 (R0.11) | vc-setup wrote nothing outside the expected paths (E3 allow-list) | Agent-Probe | reviewer compares `git status --porcelain -- . ':!process/general-plans/active/vibebelt-rebrand_29-10-26'` after Step E with the four E3 allow-list items; "clean" or the reverted path is recorded in the phase report; `.agents/skills` index mode stays `120000` | A |
| C-P0 (R0.2 residual) | `node --test e2e-kit-flows.test.mjs` under WSL | Agent-Probe | recorded baseline-red / NOT TESTED with cause (see "does NOT prove"); named residual, not a proof | D (backlog stub in the Phase 8 user checklist; gate must not be read as PASS on this alone) |

Failing stubs (Fully-Automated rows only; red-first starting points, not on-disk test files):

```
Failing stub (R0.1):
test("should have git repo and upstream-baseline tag with no program plan files in it", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should have git repo and upstream-baseline tag with no program plan files in it")
})
Failing stub (R0.2):
test("should save validator baseline with exit codes as tsv with one row per list line", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should save validator baseline with exit codes as tsv with one row per list line")
})
Failing stub (R0.3):
test("should compare current validators against the baseline mechanically", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should compare current validators against the baseline mechanically")
})
Failing stub (R0.4):
test("should have all-context.md and tests/all-tests.md present and valid", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should have all-context.md and tests/all-tests.md present and valid")
})
Failing stub (R0.5):
test("should keep original copyright line and add Tomwakeupat530amm line below it", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should keep original copyright line and add Tomwakeupat530amm line below it")
})
Failing stub (R0.6):
test("should leave no stray changes or whitespace errors outside the program folder", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should leave no stray changes or whitespace errors outside the program folder")
})
Failing stub (R0.9):
test("should keep the 53 agent-browser screenshots out of the baseline tag, on disk and ignored", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should keep the 53 agent-browser screenshots out of the baseline tag, on disk and ignored")
})
Failing stub (R0.10):
test("should carry the confirmed repo-local git identity on every commit", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should carry the confirmed repo-local git identity on every commit")
})
```

Legacy line form (kept for existing consumers):
- git baseline: [Fully-automated: `git rev-parse --is-inside-work-tree` + `git tag -l upstream-baseline` + ls-tree checks incl. 521 files, 0 screenshot paths]
- screenshots: [Fully-automated: 53 on disk, 0 tracked, `git check-ignore` = 0, ignore commit present]
- git identity: [Fully-automated: `git log --format='%an <%ae>' | sort -u` = the confirmed identity]
- validator baseline: [Fully-automated: `test -s .../baseline/validators_before.txt` + row-count check]
- context bootstrap: [Fully-automated: `test -f process/context/all-context.md`] | [agent-probe: routing rows resolve; vc-setup overreach allow-list]
- LICENSE: [Fully-automated: grep both lines + order check]
- symlink repair: [hybrid: `git ls-files -s .agents/skills` + filtered validate-skills output]
- mixed git binaries: [hybrid: `git.exe status` and WSL `git status` both empty]
- e2e under WSL: [known-gap: documented as baseline-red / NOT TESTED]

High-risk class: none (no auth, billing, schema, public API, container or secret surface; the git e-mail is a public identity chosen by the user, repo-local only). No evidence pack needed.

### Dimension findings

- Infra fit: PASS — Steps A, C, D, E2 and the validator rows reproduced on the real drive type with WSL git, Windows git and `node.exe`; 521-file baseline, exclude/ignore behaviour, index-only symlink, pinned config, exec-bit count and seed context behave as written; no dubious-ownership stop.
- Test coverage: PASS — every developed behavior has a Fully-Automated or Hybrid gate (identity gate row R0.10 added by this contract); R0.8 and R0.11 are Agent-Probe for judgment only; e2e under WSL is a named residual.
- Breaking changes: PASS — no consumers; LICENSE gets one added line; `.gitignore` gets one line; `upstream-baseline` holds the untouched kit minus the screenshots (which stay on disk).
- Security surface: PASS — no secrets or auth; repo-local git identity only (never global); the user-confirmed e-mail becomes public once pushed, which is the user's explicit choice; second copyright line sits under the unchanged MIT text.
- Section A (Git baseline, A3c screenshots): PASS — verified, see facts (R0-d staging wording handled by E11).
- Section B (Validator baseline): PASS — list, expected reds and rows verified again; B3 text unchanged (cycle-3 evidence carried forward); runner pitfalls covered by E6.
- Section C (`.agents/skills` repair, mixed-binary check): PASS — verified; the `git status` expectation is time-dependent (E5); `git.exe` gate proven non-vacuous.
- Section D (LICENSE): PASS — one inserted line, all 5 LICENSE gates correct.
- Section E (Context bootstrap, vc-setup guidance): PASS — interactive checkpoint plus tested seed fallback; E0 prepared answers and E3 allow-list match what the vc-setup skill text writes; overreach check scoped away from the program folder.
- Section F (Second baseline and hand-off): PASS — rows and exit codes reproduce the corrected expectations; `compare.sh` unchanged since cycle 3.

Net gate derivation: Layer 1 = 0 FAIL / 0 CONCERN / 4 PASS; Layer 2 = 0 FAIL / 0 CONCERN / 6 PASS. MUST-FIX count: 0. RESIDUAL (bounded, named): 5 wording/hardening items resolved by instructions (R0-a, R0-b, R0-c, R0-d, R0-e) and 2 Known-Gaps (K0-1, K0-2). Net gate: PASS.
Vacuous-green check: every developed behavior has a Fully-Automated or Hybrid gate; R0.8 and R0.11 are Agent-Probe for judgment only; the e2e-under-WSL residual is a named Known-Gap and never a proof. No behavior rests on a residual alone.

### Open gaps

- R0-a (RESIDUAL, resolved by instruction E5): C2 "status prints nothing" is only true after the C3 commit.
- R0-b (RESIDUAL, resolved by instruction E6 and the R0.2 row-count rows): runner must close stdin for each validator and capture each exit code on its own line; a one-row baseline would be vacuous.
- R0-c (RESIDUAL, resolved by instruction E10): A0 text and the umbrella locked-decision row still say the orchestrator must ask the user to confirm the address and name `ngocthangptit04@gmail.com` as the account address; the user has already confirmed `minhnguyentuan31103@gmail.com`. Stale text only; worst case is one redundant question. Optional tidy of A0 / umbrella wording at UPDATE PROCESS.
- R0-d (RESIDUAL, resolved by instruction E11): A3c says "commit" without naming what to stage.
- R0-e (RESIDUAL, cosmetic, instruction E12): "about 6.4 MB" / "14.6 MB" size figures are loose (measured 5.3 MB and 14.9 MB); counts, not sizes, are gated.
- K0-1: `node --test e2e-kit-flows.test.mjs` under WSL: known-gap: documented as NEW PLAN REQUIRED — see backlog stub to be written in Phase 8 (user-run checklist; needs Linux Node 22)
- K0-2: native Windows / macOS behavior of git exec bits, symlinks and the interactive `vc-setup` first run: known-gap: documented as NEW PLAN REQUIRED — see backlog stub in the Phase 8 user-run checklist

### What This Coverage Does NOT Prove

- R0.1 does not prove the tag is a faithful copy of the ORIGINAL upstream download; it proves it holds this working tree at import time, minus the 53 agent-browser screenshots.
- R0.9 proves the screenshots are not in the tag, not tracked, still on disk and ignored; it does not prove the PNGs are identical to the upstream ones or that a later `git add -f` cannot add them.
- R0.10 proves the identity on commits made in this repo; it does not prove the address is deliverable or that the GitHub account owns it.
- R0.2/R0.3 prove validator exit codes only, not that the validators are correct, and under `node.exe` not that results equal ubuntu CI (path-separator bugs seen in protocol-wiring and in `resolve-manifest.mjs`).
- R0.4 proves the files exist and pass `validate-all-context.mjs`; not that the prose is accurate (R0.8 covers that only by sampling routing rows).
- R0.5 proves the two lines and their order; it is not legal advice that a two-line copyright block is the right notice.
- R0.6 (mixed binaries) proves WSL git and Windows git agree on a clean tree after C3; it does not prove agreement after later phases' line-ending or mode changes.
- R0.7 proves the committed object is a symlink and that no other validate-skills failure exists; it does NOT prove `validate-skills` exits 0 (that needs Linux Node 22 or the ubuntu CI run in Phase 8).
- The dry run used a copy of the tree before any Phase 1+ edit and the seed path for context; it does not prove behaviour of the real interactive `vc-setup` (R0.11 checks its writes after the fact).
- Nothing here proves Windows-native or macOS behavior of git, exec bits or symlinks, nor the e2e install flow.

Gate: PASS (0 FAIL, 0 MUST-FIX; 5 wording/hardening residuals resolved by contract instructions and 2 named Known-Gaps carried). Not subject to the first-pass CONDITIONAL rule: this is a PASS, and PVL cycles 1-4 are recorded in `results.tsv`.
Accepted by: not required for PASS; Known-Gaps K0-1 and K0-2 are recorded above as named residuals (session: inner-pvl phase-0 re-run, autonomous /goal execution).

### Supplement cycle 1 (29-10-26)

Plan sections updated (validate-contract above kept unchanged). Gaps addressed:

- G0-1: A3 now stages with an exclude pathspec so the program folder is not in `upstream-baseline`, exec bits restored via `git update-index --chmod=+x` for 4 `.sh` files; A3b commits the plan folder separately; gate `git ls-tree ... | grep -c` = 0 and `install.sh` mode 100755.
- G0-2: new Step C repairs `.agents/skills` (symlink, copy fallback + backlog stub, cause documented); gates `git ls-files -s` = 120000 and validate-skills exit 0.
- G0-3: B1 names the validator list (`validators.list`, `run-validators.sh`), TSV with 3 columns, Step F second baseline `validators_after_setup.tsv`, B3 `compare.sh` (worse = 0 to non-zero).
- G0-4: Exit Gate has the 5 LICENSE assertions incl. `grep -c "Copyright (c) 2026 Tomwakeupat530amm" LICENSE` = 1, order and no-removal checks.
- G0-5: E1 fixed vc-setup answer set, E2 manual fallback, E3 `git status --porcelain` overreach check, E4/Exit Gate require `tests/all-tests.md` and `validate-all-context.mjs`.
- G0-6: vacuous bare `git diff --check` replaced by `git status --porcelain` (empty) and `git diff --check upstream-baseline HEAD`.
- G0-7: Entry Gate and A1 runtime note (`node.exe`, runtime recorded; Linux Node 22 is a USER action with exact commands; e2e/WSL gates = baseline-red / NOT TESTED).
- Also: Verification Evidence rows carry criterion ids R0.1-R0.8; Known-Gap (e2e under WSL) is a named residual that keeps its gate CONDITIONAL.
- Supplement cycle 1c: B1 validators.list now gives full verified paths per skill folder (vc-audit-vc, vc-audit-context, vc-audit-plans, vc-generate-plan, vc-generate-context); validate-model-effort-policy.mjs excluded (created in Phase 1).

### Supplement cycle 2 (29-10-26)

Plan body updated (validate-contract above kept unchanged). Gaps addressed:

- F0-A (FAIL): Step C rewritten. `.agents/skills` stays the 17-byte text file; `core.symlinks=false`; the index records mode 120000 via `git update-index --add --cacheinfo 120000,<blob>,.agents/skills`; directory-copy fallback and WSL `ln -s` deleted; Exit Gate asserts only that no validate-skills / validate-context-discovery failure other than `.agents/skills` remains (`grep '^    "' | grep -vc '\.agents/skills'` = 0).
- G0-8: `git status --porcelain`, `git diff --check` and the E3 overreach check use the pathspec exclude for the program folder; `git-diff-check` in validators.list uses it too; F2 baseline commit is outside the gate.
- G0-9: A2 pins `core.fileMode=false`, `core.symlinks=false`, `core.autocrlf=false` and gates them; Exit Gate counts `^100755` = 4; A0 user checkpoint gives `user.name` = `Tomwakeupat530amm` and a noreply e-mail placeholder the user confirms.
- G0-10: E0 makes the user's presence an explicit checkpoint for interactive vc-setup (record questions and answers); E2 seed fallback now fills a real `Last updated: YYYY-MM-DD`; E4 gates on no `bare-kit mode` in the validator output.
- G0-11: B2 premise corrected (validate-all-context is 0 today in bare-kit mode); B3 `compare.sh` gets cwd rule (`cd` to repo root), runtime rule (rows compared only within one runtime, exit 3 = re-baseline), `--map` rename option, new-validator NOTE rule; resolver reference files are named by runtime.
- All gates use path variables (P, B, V, EX) and one command per exit code; SHAs are saved to `baseline/upstream_baseline_sha.txt`.
- Hand-offs to the owner/registry: later phases add `baseline/p1_start.txt` (Phase 1) and `baseline/resolved_p2_start.<runtime>.txt` (Phase 2); `resolved_before.txt` is now `resolved_before.<runtime>.txt`; Phase 1 appends its validator to `validators.list`.
- C1/C2 (cycle 2c): B3 `compare.sh` now states the own-directory LOOKUP RULE (Phase 6 C3b guarantee, `--map` kept) and a LICENSE RULE that runs both LICENSE greps plus the original-line check on every run and exits non-zero otherwise.

### PVL cycle 3 note (29-10-26)

Re-validated from V1 by running the phase commands in a throw-away copy of the repo (deleted afterwards). Result: Gate PASS, no plan-body change needed; the residual items are carried in the contract as Execute-agent instructions and named Known-Gaps (see the contract's Open gaps).

### Supplement (inner 1b) (29-10-26)

Plan body updated from the Phase 0 research findings and three LOCKED user decisions; the Validate Contract text above is kept unchanged (PVL re-runs because of the Refresh Note below). Changes:

- User decision 1: agent-browser screenshots (53 PNGs, 14.6 MB) are excluded from the baseline commit and the tag (A3, `.git/info/exclude`) and then ignored in the tracked `.gitignore` by the follow-up commit `chore: ignore agent-browser screenshots` (new step A3c) BEFORE any later `git add -A`. Expected counts recomputed: 574 files minus 53 = 521 files in the baseline (about 6.4 MB). A3 'faithful snapshot' wording now says "minus the agent-browser screenshots". Gates added for 521 files, 0 screenshot paths in the tag, 53 files still on disk, 0 tracked, `git check-ignore` = 0.
- User decision 2: A0 asks for the user's real e-mail; the orchestrator confirms the exact address (account address on file `ngocthangptit04@gmail.com`) before use; noreply is only a mentioned alternative.
- (a) E3 names the expected vc-setup writes and treats everything else as overreach. (b) E0 tells vc-setup NOT to repair `.agents/skills`. (c) E0 carries the prepared answers and states the user must be present. (e) Entry Gate states the mixed git binaries (WSL git for gates, Windows git inside `node.exe` validators); new gate `git.exe status` + WSL `git status` both clean after C3.
- The validate-contract gate row 'git baseline' keeps its meaning; added Verification Evidence rows carry criterion R0.9 (screenshots) and the mixed-binary check.
