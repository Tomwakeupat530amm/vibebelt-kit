---
name: plan:vibebelt-rebrand-phase-08-install-release
description: "vibebelt-kit rebrand — Phase 08: Real install test and release"
date: 29-10-26
metadata:
  node_type: memory
  type: plan
  feature: general-plans
  phase: phase-08
---

# Phase 08 — Real install test and release

**Program:** vibebelt-rebrand
**Umbrella plan:** process/general-plans/active/vibebelt-rebrand_29-10-26/vibebelt-rebrand-umbrella_PLAN_29-10-26.md
**Phase status:** ⏳ PLANNED (PVL cycle 5: CONDITIONAL; MUST-FIX M8-2 addressed by the cycle-5 supplement; re-validate from V1)
**Complexity:** COMPLEX
**Report destination:** process/general-plans/active/vibebelt-rebrand_29-10-26/phase-08-install-release_REPORT_29-10-26.md (flat in the program task folder)

---

## Overview

One phase of the vibebelt-rebrand program; program context lives in the umbrella plan. Context router: process/context/all-context.md (created in Phase 0). Test routing: process/context/tests/all-tests.md (load before assigning tiers).

Date: 29-10-26
Status: PLANNED
Complexity: COMPLEX

## Purpose

Prove it really installs and updates on the environments reachable from this machine, then release v1.0.0. It also owns the FINAL EQUIVALENCE GATE (step B4, user decision A, a hard program requirement): before ANY release step the final tree must be shown to keep the same behaviour, ways of working and output quality as the old kit, at least equal, by re-running the golden tasks that Phase 3 froze. This is the only phase that reaches outside the repo (creating the remote, pushing `main`, pushing the tag, GitHub release), so it contains the program's two outward-facing HARD STOPS. Native Windows and macOS are NOT TESTED here (LOCKED Q6).

---

## Entry Gate

Path variables (define once; every gate runs from the repo root):

```bash
export NODE=${NODE:-node}
TF=process/general-plans/active/vibebelt-rebrand_29-10-26; H=$TF/harness; B=$TF/baseline
SB=$HOME/vb-sandbox; KIT=$(pwd)        # sandboxes on the Linux filesystem; KIT = absolute path of the checkout
```

- Phase 7 exit gate green; working tree clean on `main` EXCLUDING the task folder (reports are written there): `test -z "$(git status --porcelain -- . ':(exclude)process/general-plans/active/vibebelt-rebrand_29-10-26')"`.
- Validator rule, used consistently in this phase: the full validator suite is NOT WORSE than the Phase 0 `baseline/`, compared through the Phase 6 mapping (`bash $H/compare-vb.sh`, built from `$H/validators.vb.list`; the baseline files hold `vc-` paths and would read every validator as WORSE after the rename). Baseline reds such as `validate-skills` / `validate-context-discovery` caused by `.agents/skills` being a text file are recorded, not failures of this phase. `test -f $H/compare-vb.sh && test -f $H/validators.vb.list` must pass before B3.
- Preconditions (check and record each in the report before any install test):
  - P0 Linux Node >= 22 in WSL: run `node --version` inside WSL. If missing, this is a USER action; the agent never installs it. Give the user these exact commands (userland, no sudo): `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash`, then `exec bash`, then `nvm install 22`, then `node --version` (expect v22.x). If the user does not install it, every WSL install gate and the e2e gate are NOT TESTED, C-P8 stays CONDITIONAL, and a backlog stub records it.
  - P1 resolver glob-mode fix landed (owned by Phase 2; Phase 6 B0 is the fallback): `node resolve-manifest.mjs --root . --json` returns `files.length` > 0 at manifest version 1.0.0.
  - P2 Tag `upstream-baseline` exists (`git tag -l upstream-baseline`) and the Phase 6 old-install fixture (Trial E) is reused for the update test.
  - P3 Sandboxes live on the Linux filesystem (for example `$HOME/vb-sandbox/<case>`), never under `/mnt/c`, because symlink behavior differs. They are deleted after each case; no install ever targets a real user project.
  - P4 Post-rename agent names: this phase runs after the Phase 6 rename and restart, so the agents are `vb-validate-agent`, `vb-execute-agent`, `vb-tester`, `vb-update-process-agent` (see Phase Loop Progress).
  - P5 Frozen golden definitions from Phase 3 exist and are untouched: `(cd $TF/golden/tasks && sha256sum -c FROZEN.sha256)` exits 0; `$TF/golden/tasks/old-sandbox-recipe.md`, `$TF/golden/run-record.mjs`, `$TF/golden/signal-census.mjs`, `$TF/golden/signal-census-phase3.txt` and `$TF/golden/gen-guardrails.mjs` exist. If any is missing, the equivalence gate (B4) cannot run and release stays blocked (ask the user).
  - P6 Model runs are billed: the exact run count and cost of B4 are reported and acknowledged by the user BEFORE any model run (B4.1; the program's single billed hard stop; Phase 3 made no model run, decision D).

---

## Strategy Recommendation (vc-agent-strategy-compare)

- Signals: S2, S6 and outward-facing steps — score 3/7 (MEDIUM), dominant signal S6.
- Recommended: **Sequential** — 1 agent per step; each environment test depends on the previous fix and the outward steps are hard stops. Named agents run on the model in their own front-matter (research, plan, validate, tester = opus; update-process = sonnet); the blind equivalence judge is an ad-hoc sonnet agent; execute (installer fixes) = opus. The equivalence gate (B4) is sequential and billed. Untestable environments are documented, not simulated.

---

## Blast Radius

- `e2e-kit-flows.test.mjs` (Windows-safe edits, step A0: `fileURLToPath` at line ~21, `os.tmpdir()` instead of the hard-coded `/tmp` at lines ~34 and ~330, quoted and forward-slash `bash` path at every `bash ${INSTALL_SH}` call; edit 4: Trial D's `git clone --local` made cross-device safe with `--no-hardlinks`)
- Temp directories on the Linux filesystem for install tests (deleted afterwards; never inside the user's real projects)
- FINAL EQUIVALENCE GATE evidence (NEW, task folder, Phase 8 owned): `$TF/eq/**` (`shas.txt`, `final-sha.txt`, `diff.txt`, `diff-excluded.txt`, `old/`, `final/`, `scripted.tsv`, `census-*.txt`, `guardrails-*.json`, `verdict.md`). READ-ONLY inputs from Phase 3: `$TF/golden/tasks/**`, `$TF/golden/*.mjs`, `$TF/golden/guardrails.json`, `$TF/golden/signal-census-phase3.txt`, `$TF/golden/start.sha`. Two throw-away `git worktree` sandboxes outside the repo (deleted afterwards).
- `CHANGELOG.md`, `docs/RELEASE-NOTES-1.0.0.md` (NEW), possible small installer fixes in `install.sh`
- Backlog stubs under `process/general-plans/backlog/` (native Windows/macOS user-run checklist; Linux Node refusal if it happens)
- Outward-facing (HARD STOPS, need the user's explicit go in this session): creating the remote repo, `git push` of `main`, `git push` of tag `v1.0.0`, GitHub release. Local annotated tag `v1.0.0` is local only.

---

## Implementation Checklist

### Step A0 — Fix e2e Windows path bugs (before any install test)

- [ ] A0. In `e2e-kit-flows.test.mjs` (verify the line numbers with grep first; after the Phase 6 rename the names are `vb-`): (1) replace `path.dirname(new URL(import.meta.url).pathname)` (~line 21) with `path.dirname(fileURLToPath(import.meta.url))`, importing `fileURLToPath` from `node:url`; this removes the doubled `\C:\...` path; (2) replace both hard-coded `fs.mkdtempSync('/tmp/vb-e2e-')` calls (~lines 34 and 330) with `fs.mkdtempSync(path.join(os.tmpdir(), 'vb-e2e-'))` (import `os`), because `/tmp` resolves to `C:\tmp` under node.exe; (3) quote the installer path at every `bash ${INSTALL_SH}` call and pass it with forward slashes (`INSTALL_SH.replace(/\\/g, '/')` on win32); (4) Trial D (~line 333) clones the checkout with `git clone --local --quiet`, which fails with `Invalid cross-device link` when the checkout is on `/mnt/c` and the temp dir is tmpfs (reproduced: `--local` rc 128, `--local --no-hardlinks` rc 0): change it to `git clone --local --no-hardlinks --quiet` (or create the clone dir on the same mount as the checkout). Gate (static, runnable anywhere): `test "$(grep -c 'new URL(import.meta.url).pathname' e2e-kit-flows.test.mjs)" = 0`, `test "$(grep -c "mkdtempSync('/tmp" e2e-kit-flows.test.mjs)" = 0`, `test "$(grep -c 'bash \${INSTALL_SH}' e2e-kit-flows.test.mjs)" = 0` (all print 0 → pass), and for edit 4 `test "$(grep -c 'no-hardlinks' e2e-kit-flows.test.mjs)" -ge 1` (static); plus `node.exe e2e-kit-flows.test.mjs 2>&1 | grep -cF '\C:\'` = 0. LIMIT, stated plainly: this gate proves only that the doubled-path error and the hard-coded `/tmp` / unquoted path are gone; whether the trials then pass under `node.exe` is NOT claimed. The authoritative proof for edit 4 and for the e2e file is the Linux Node run in B3 (trials A-E: A, B, D green now, C green after Phase 6 B4, E per Phase 6); if there is no Linux Node the trials are NOT TESTED and C-P8-a stays CONDITIONAL.

### Step A — Install matrix (fresh project AND existing project; WSL/Linux only gated)

Facts about the real `install.sh` (read 29-10-26, all 472 lines; the assertions below follow the code, not the header comment): it backs up `.claude/`, `.codex/`, `.agents/`, `CLAUDE.md`, `AGENTS.md`, `GUIDE.md` into `.vibecode-backup/` (a prior backup is rotated, not overwritten); it then copies each kit-managed file ONE BY ONE (`cp`, line ~215), it does NOT replace directories, so unmanaged files such as `.claude/skills/my-skill/SKILL.md` and `process/x.md` stay in place; kit-managed files (agents, kit skills, hooks, `CLAUDE.md`, `AGENTS.md`, `.codex/**`, and the kit's own `process/development-protocols/**` and `process/_seeds/**`) are overwritten; `.claude/settings.json` is in the `merge` list and is SKIPPED when it already exists (counted as preserved; there is no JSON merge in `install.sh`). Managed files under `process/` are overwritten and are NOT part of the backup set.

- [ ] A1. Native Windows (Git Bash): NOT a gate and NOT TESTED here (LOCKED Q6). Put exact user commands in the release notes (checklist in the backlog stub). An optional best-effort smoke through the host Git for Windows (`C:\Program Files\Git\bin\bash.exe`) and `node.exe` may be recorded as extra evidence only; it never counts toward the gate.
- [ ] A2. WSL Linux (needs P0): two cases, each with an explicit command and expected output, each in a sandbox on the Linux filesystem that is deleted afterwards. A4 gives the install form. If P0 is missing: NOT TESTED.
  - (i) Fresh empty folder: `rm -rf $SB/fresh && mkdir -p $SB/fresh && cd $SB/fresh && VB_KIT_SOURCE="$KIT" bash "$KIT/install.sh"` → exit 0. Assertions (each printing the expected value): `test -f .vb-installed-files && test -f .vb-version && echo state-ok` → `state-ok`; `test "$(find . \( -name 'vc-*' -o -name '.vc-*' \) | wc -l)" = 0; echo $?` → `0`; `test "$(cat .vb-version)" = "$($NODE -e "console.log(JSON.parse(require('fs').readFileSync('$KIT/vb-manifest.json','utf8')).version)")"; echo $?` → `0`. Cleanup: `cd "$KIT"; rm -rf $SB/fresh; test ! -d $SB/fresh; echo $?` → `0`.
  - (ii) Existing project: seed `$SB/existing` with `CLAUDE.md`, `AGENTS.md`, `process/x.md`, `.claude/skills/my-skill/SKILL.md`, `.claude/settings.json` (content `{"mine":true}`) and keep a pristine copy of the seed in `$SB/orig`; run the install (`cd $SB/existing && VB_KIT_SOURCE="$KIT" bash "$KIT/install.sh"`). Assertions (each prints nothing or the stated value): (a) backups byte-identical: `for f in CLAUDE.md AGENTS.md .claude/skills/my-skill/SKILL.md .claude/settings.json; do cmp "$SB/orig/$f" ".vibecode-backup/$f" || echo "FAIL backup $f"; done` → no output; (b) kit-managed files overwritten with the kit version: `cmp "$KIT/CLAUDE.md" CLAUDE.md; echo $?` → `0`; (c) unmanaged files unchanged IN PLACE: `for f in process/x.md .claude/skills/my-skill/SKILL.md; do cmp "$SB/orig/$f" "$f" || echo "FAIL in-place $f"; done` → no output; (d) existing `settings.json` left as the user's (skipped, not merged): `cmp "$SB/orig/.claude/settings.json" .claude/settings.json; echo $?` → `0`; (e) user files are never recorded as kit-owned: `grep -c 'my-skill' .vb-installed-files` → `0`. Cleanup: `cd "$KIT"; rm -rf $SB/existing $SB/orig; test ! -d $SB/existing; echo $?` → `0`.
- [ ] A3. macOS: NOT TESTED here; exact user commands in the release notes and the backlog stub. Linux = the WSL case above.
- [ ] A4. Each install is run through the local-source form: `VB_KIT_SOURCE=<local checkout> bash install.sh` (the variable after the Phase 6 rename; the old `VC_KIT_SOURCE` is only a fallback). The real GitHub raw-URL install is verified in step C2b, after the user approves publishing `main`.

### Step B — Update and publish flows

- [ ] B1. Update flow (needs P0, P2): `git archive upstream-baseline` into a sandbox kit, install it, then update to this build (reuse Phase 6 Trial E); confirm `legacyDeletions` removes only unmodified old kit files (sha256 match) and keeps and reports modified ones; custom skills untouched. Record, from that run: (1) the value of `.vb-version` after the old-to-new install and whether `.vc-version` is gone (`cat .vb-version; test ! -f .vc-version; echo $?`); (2) which command, if any, prints the downgrade warning (candidates: the new `vb-update` against the new source; the OLD `vc-update` skill pointed at the new source). These observations, not assumptions, word the C1 release note.
- [ ] B2. Publish flow, "dry-run" defined: follow the `vb-publish` SKILL.md steps up to the Step 6 confirm INSIDE A TEMP CLONE of the kit on the Linux filesystem and stop there (no Step 9a commit/tag, no push). Assert in the real repo that `git tag -l v1.0.0` is still empty and `git log -1 --format=%H` is unchanged. e2e Trial D remains the static text check.
- [ ] B3. Run `$NODE e2e-kit-flows.test.mjs` (Linux Node, includes Trial E) and the full validator suite through `bash $H/compare-vb.sh` (Phase 6 vb- mapping, label-keyed; "not worse than baseline").

### Step B4 — FINAL EQUIVALENCE GATE (HARD GATE: runs after B3 and BEFORE every Step C item, including the local tag)

Why (user decision A, LOCKED): the new kit must keep the same behaviour, ways of working and output quality as the old kit, at least equal. Path variables: `EQ=$TF/eq; G=$TF/golden; GT=$G/tasks; mkdir -p $EQ`.

- [ ] B4.0 Preconditions: P5 holds; B3 is green (or its NOT TESTED reason is recorded); `git status --porcelain` clean excluding the task folder.
- [ ] B4.1 COST GATE (hard stop; the program's ONLY billed hard stop): Phase 3 made no model run (decision D), so no per-run cost exists yet. Two parts, each waits for the user in chat:
  - B4.1a REHEARSAL (1 billed run, acknowledged first): ask the user to acknowledge ONE rehearsal run, then run `task-1-execute` once in a FINAL sandbox built by the recipe, with the exact `$GT/run-flags.md` command (flag names re-checked with `claude --help` first; no billed call needed for that). Purpose: (1) measure the real per-run cost from the stream; (2) confirm the stream-json field names that `run-record.mjs subagents` reads (`tool_use` blocks named `Task` or `Agent`, `input.subagent_type`); (3) confirm `run-flags.md` lets the run edit files and spawn the expected agent. The rehearsal output is never judged. If the field names or flags differ from what the frozen Phase 3 files expect, STOP and report: a change to `golden/run-record.mjs` or `run-flags.md` needs a recorded reason and the user's approval (E6).
  - B4.1b COUNT AND CHOICE: report the itemised count and cost estimate (rehearsal cost x runs, plus judge calls): CORE = the 3 frozen CORE tasks (`task-1-execute`, `task-2-bugfix`, `task-3-plan`) = 3 x 2 replicates x 2 kits = 12 task runs + 6 judge calls = 18. OPTIONAL EXTENDED (each +4 task runs + 2 judge calls): `task-4-research`, `task-5-validate`, `task-6-fast`, `task-7-update-process`; they run ONLY if the user explicitly approves the higher count. The other 7 agents are covered only by the mechanical gates (census, guardrail identity, validators). Record the user's choice verbatim. No acknowledgement: stop; the gate stays OPEN and release stays blocked. Both kits are run now, so model drift cancels out.
- [ ] B4.2 Build two sandboxes by `$GT/old-sandbox-recipe.md`, constructed identically so only the kit files differ (R8-6: the FINAL worktree contains the program task folder and OLD does not, so build BOTH sandboxes WITHOUT the task folder `process/general-plans/active/vibebelt-rebrand_29-10-26/`, or equally with it, so an "existing active plan" cannot confound task runs; explain any remaining `diff.txt` line): OLD = tag `upstream-baseline` (original agents, original models, plus the Phase 0 `process/context/**` copy exactly as the recipe says); FINAL = this repo's current `HEAD` commit (the candidate that C2a will tag). Write `$EQ/shas.txt` (both commit ids) and `$EQ/final-sha.txt` (the FINAL commit id). Write `$EQ/diff-excluded.txt` (the kit paths that differ by design, from the recipe) and `$EQ/diff.txt` = `diff -r OLD FINAL` outside those paths: expected empty or explained line by line.
- [ ] B4.3 Runs: the 12 CORE task runs (plus 4 per EXTENDED task the user approved at B4.1b), each a NEW OS process, prompt = `$GT/task-N-*/prompt.md` VERBATIM, fixture = the frozen fixture. Before each run `node $G/run-record.mjs record <sandbox> <run-id>`; after the run `node $G/run-record.mjs subagents <stream.jsonl> <run-id>`; before judging `node $G/run-record.mjs verify <sandbox> <run-id>` must exit 0 (Phase 3 C2 interface) (a run without a matching record is ignored). OLD and FINAL for the same task and replicate run back to back. Outputs to `$EQ/old/` and `$EQ/final/`.
- [ ] B4.4 Scripted rubric items (Fully-Automated): apply the scripted items of `$GT/rubric.md` to all task outputs (signal strings with the mapping `VC-` -> `VB-` for FINAL; plan structure through each tree's own `validate-plan-artifact.mjs`; contract headings by grep). Write `$EQ/scripted.tsv`. A scripted item that passes on OLD and fails on FINAL in BOTH replicates of a task makes that task WORSE.
- [ ] B4.5 Judge (Agent-Probe, judgement): follow `$GT/judge.md` VERBATIM: blind pairwise (judge does not know which output is which, order randomised), 2 replicates per task, ad-hoc sonnet judge, one call per task x replicate. Verdict per task: EQUAL / BETTER / WORSE; tie = EQUAL; WORSE only if reproduced in BOTH replicates. A task that is WORSE in one replicate only is EQUAL by rule and is listed under "watch" in the report.
- [ ] B4.6 Mechanical equivalence evidence, re-run now on the FINAL tree (not copied from earlier phases); all of it is part of the gate:
  - (a) Validator baseline not worse: `bash $H/compare-vb.sh; echo $?` = 0 (Phase 0 baseline of 28 rows, plus rows added since, through the Phase 6 mapping). Fully-Automated.
  - (b) Signal census 1:1 after the rename mapping: `node $G/signal-census.mjs --out $EQ/census-final.txt; sed 's/VC-/VB-/g;s/vc-/vb-/g' $G/signal-census-phase3.txt | cut -f1-4 | LC_ALL=C sort -u > $EQ/census-expected.txt; sed 's/VC-/VB-/g;s/vc-/vb-/g' $EQ/census-final.txt | cut -f1-4 | LC_ALL=C sort -u > $EQ/census-final-nocount.txt; diff $EQ/census-expected.txt $EQ/census-final-nocount.txt; echo $?` = empty diff, 0 (same check as Phase 7 check 4a; Phase 3 census lines are `<key>\t<md|toml>\t<class>\t<token>\t<count>`). Strictness: the COUNT column is NOT compared (Phase 7 prose rewording may legitimately change how often `BLOCKED`/`DONE` occur); every (key, kind, class, token) must appear on both sides. The full with-count diff is written to `$EQ/census-count-diff.txt` for the record. Fully-Automated.
  - (c) e2e trials: the B3 result line (Linux Node, trials A-E incl. Trial D after A0 edit 4) is copied into `$EQ/verdict.md`; Linux Node v22.23.4 is installed on this host, so the trials run; the baseline is 2 of 4 (A, B pass; C fails AC-5, fixed by Phase 6 B4; D fails the cross-device clone, fixed by A0 edit 4); any trial not run is recorded as NOT TESTED, never as PASS. Native Windows/macOS remain NOT TESTED. Hybrid.
  - (d) Guardrail-section identity modulo the rename: for every agent the guardrail headings and section-body hashes of FINAL equal those taken at the Phase 3 start. Procedure: back up the real file (`cp $G/guardrails.json $EQ/guardrails-original.json`); make a temp copy of the agent files at `$(cat $G/start.sha)` (`b17294d`) outside the repo, `git init` + one commit in it (the rename tool refuses a dirty tree), and apply the Phase 6 rename to that temp copy ONLY (`$NODE scripts/rename-prefix.mjs --apply --root <tmp>`, same allowlist), never to the repo; then `node $G/gen-guardrails.mjs --root <tmp> --out $EQ/guardrails-old-renamed.json` and `node $G/gen-guardrails.mjs --root . --out $EQ/guardrails-final.json` (Phase 3 B2: without `--out` it writes no file; it never touches `guardrails.json` implicitly); `diff $EQ/guardrails-old-renamed.json $EQ/guardrails-final.json`; afterwards `cmp $G/guardrails.json $EQ/guardrails-original.json` (exit 0). Agents were not slimmed, so the expected differences are none: OLD vs FINAL agents differ only by `effort: max` front-matter on 3 agents (not a guardrail section), the rename and any Phase 7 prose. Any difference is listed per agent and section and counts as a mechanical failure unless it traces to a deliberate change recorded in a phase report AND the user accepts it. Fully-Automated.
- [ ] B4.7 Verdict. Write `$EQ/verdict.md` with the task table, the scripted table, (a)-(d), the run count and cost acknowledged, the FROZEN check result, and ONE last line: `EQ gate: PASS` (no task WORSE; (a), (b), (d) green; (c) green or recorded NOT TESTED; acknowledgement recorded), or `EQ gate: BLOCKED` (any reproduced WORSE or mechanical failure), or `EQ gate: ACCEPTED-BY-USER` (a WORSE or a mechanical failure the user explicitly accepted in chat; quote the user's words and the exact tasks or checks they cover). A reproduced WORSE or mechanical failure blocks release: NO Step C item runs and no outward action happens until the cause is fixed (new commit on `main`, then B4.2-B4.6 re-run for the affected tasks plus all mechanical evidence, with a fresh cost acknowledgement) OR the user explicitly accepts it in chat.
- [ ] B4.8 Re-run rule: the verdict is bound to `$EQ/final-sha.txt`. Immediately before C2a run `git diff --name-only $(cat $EQ/final-sha.txt) HEAD -- .claude .codex CLAUDE.md AGENTS.md process/development-protocols process/_seeds install.sh resolve-manifest.mjs compute-sync-plan.mjs vb-manifest.json`; it must print nothing, otherwise re-run B4.2-B4.6 (fresh cost acknowledgement). Documentation-only changes (README, release notes, CHANGELOG, `docs/`) do not require a re-run. Cleanup: remove both worktrees (`git worktree remove`), keep `$EQ/`.
- Strategy split, stated plainly: scripted rubric items and (a), (b), (d) are Fully-Automated; (c) is Hybrid; the blind judge verdict is Agent-Probe (judgement) and stays a NAMED RESIDUAL: it is never the sole proof, every Fully-Automated part must also be green, and 3 tasks x 2 replicates cannot prove equivalence on every possible task.

### Step C — Release

- [ ] C0. Gate check, before any other Step C item: `grep -cE '^EQ gate: (PASS|ACCEPTED-BY-USER)' $TF/eq/verdict.md` must print `1`. Any other result (file missing, `EQ gate: BLOCKED`, zero or two matching lines) means STOP: no release notes finalisation, no local tag, no push, no release.

- [ ] C1. Plain-language release notes `docs/RELEASE-NOTES-1.0.0.md` and an EXTENSION of the existing `## [1.0.0]` entry that Phase 2 C2 created in `CHANGELOG.md` (add the release-notes summary under that heading; never create a second `## [1.0.0]`; hand-written in `vb-` terms; `CHANGELOG.md` is protected from the rename tool): what it is, how to install, what changed from the original, and:
  - What the installer does to an existing project, in plain words: "kit files are overwritten, your own files stay, and the files most likely to matter (`.claude/`, `.codex/`, `.agents/`, `CLAUDE.md`, `AGENTS.md`, `GUIDE.md`) are copied into `.vibecode-backup/` first". Also state: your own skills and notes next to kit files are not removed; an existing `.claude/settings.json` is left untouched (so the kit's hook settings are not added automatically; say how to add them); the kit's own documents under `process/development-protocols/` and `process/_seeds/` are overwritten and are not part of the backup.
  - Original-kit users: worded from the B1 observation. Expected wording if B1 confirms it: running the vibebelt install command in an existing project replaces `.vc-version` with `.vb-version` (1.0.0) and later `vb-update` shows no downgrade warning; a downgrade warning (3.2.5 to 1.0.0) appears only if you point the OLD `vc-update` skill at this repository, and then it is expected and you answer yes.
  - Known limits: native Windows and macOS NOT TESTED (user-run commands included), Linux Node requirement, Vietnamese not native-reviewed.
  - User-only GitHub settings (cannot be set by the agent): repository description and topics, Issues/Discussions toggles, branch protection, Pages if used, release visibility.
  - Quality check (from B4, plain words): which 3 tasks, 2 replicates each, how the old and new kit were compared (blind), the verdict per task, what the check does NOT prove (only 3 tasks; the judge is itself a model), and that the result was `PASS` or the user's explicit acceptance (quote it).
- [ ] C0a-C0c. CLEANUP (C-CLEAN), carried from the umbrella section `## Clean Final Tree (C-CLEAN)` (canonical there: step order, C0b commands, DOOMED SET, ALLOWED LIST, gate `harness/clean-check.sh` CC1-CC8). Sync 2026-10-30 additions that C0c checks on the cleaned tree: (1) `test "$(wc -c < AGENTS.md)" -le 32768` (AGENTS.md byte budget, standing contract from Phase 4; must also hold in the final tagged tree); (2) the Phase 2 CHANGELOG hooks-block deep-equality one-liner (text in the Phase 2 report, expects `true`), re-run because `.claude/settings.json` hooks may have changed in Phase 6; (3) the C0b trim list includes the `SECURITY.md` language switcher (lines 1-8 today, the `<p align="center">` block linking `docs/i18n/SECURITY.*.md`; found by content), already named in the umbrella C0b edits line.
- [ ] C2-pre. Leak detection BEFORE the tag and before any push, as standalone commands (the `vb-publish` Step 8 flow needs its Step 7 Apply first, so its checks are run directly): `$NODE .claude/skills/vb-audit-vc/scripts/validate-kit-portability.mjs; echo $?` → `0`; `grep -ri "flowser\|tRPC\|Prisma\|Supabase\|CloakBrowser\|OpenClaw" CLAUDE.md AGENTS.md | wc -l` → `0`; `git ls-files -z | grep -zv -e '^process/general-plans/active/vibebelt-rebrand' -e '/__tests__/' -e '^\.claude/skills/vb-publish/' | xargs -0 grep -Il '/Users/' | wc -l` → `0` (the 6 known benign tracked files are excluded explicitly: the 4 hook-test fixtures under `__tests__` in `.claude/hooks/lib` and `.codex/hooks/lib`, and `vb-publish/SKILL.md` + its reference, which document this check; verified by grep; any other hit stops the phase); badge counts, explicit commands (R8-4: the skill's own regex `[0-9]+-Agents` is stale): `actual_agents=$(ls .claude/agents/*.md | wc -l); actual_skills=$(ls -d .claude/skills/vb-*/ | wc -l); readme_agents=$(grep -oE 'badge/agents-[0-9]+' README.md | grep -oE '[0-9]+$'); readme_skills=$(grep -oE 'badge/skills-[0-9]+' README.md | grep -oE '[0-9]+$'); test "$actual_agents" = "$readme_agents" && test "$actual_skills" = "$readme_skills"; echo $?` → `0` (15 and 33 today; both variables must be non-empty). Backlog note: fix the stale regex in the `vb-publish` skill text. Any hit stops the phase (fix first, no tag).
- [ ] C2a. Local annotated tag only: after the final commit on a clean `main` (task folder excluded), `git tag -a v1.0.0 -m "v1.0.0"`. Nothing is pushed. If any fix commit lands after the tag and before C2c, delete and re-create the LOCAL tag on the fixed commit (`git tag -d v1.0.0` then `git tag -a v1.0.0 -m "v1.0.0"`); the remote tag does not exist yet, so no remote tag is ever moved.
- [ ] C2b. HARD STOP 1 (needs the user's explicit go in this session; the go covers THIS one push only): ask the user to approve (or perform) creating the remote repo (`Tomwakeupat530amm/vibebelt-kit`) and add `origin`; then push `main` only (`git push origin main`, plain push, never `--force`, `--force-with-lease`, `+ref` or `--tags`). Then verify the REAL raw-URL install in a fresh Linux-filesystem temp dir with the README's install command, and record the result. C2-pre has already passed.
- [ ] C2c. HARD STOP 2 (needs a second, separate explicit go): push the tag (`git push origin v1.0.0`) and create the GitHub release (`gh release create v1.0.0 -F docs/RELEASE-NOTES-1.0.0.md`). Never run these without the go-ahead in this session. After C2c the process/report commit made by UPDATE PROCESS stays local until the user gives a further explicit go for another plain `git push origin main`.

### Hard-stop hygiene (applies to every push in this phase)

- EVERY `git push` is its own hard stop with its own explicit go in this session. A re-push after a fix (for example after a failed raw-URL install) needs a FRESH go-ahead; the earlier go does not carry over.
- The equivalence gate (B4) is a hard gate that sits BEFORE the first hard stop: HARD STOP 1 and HARD STOP 2 cannot be asked for while `EQ gate:` is not `PASS` or `ACCEPTED-BY-USER` for the commit being released. Model runs in B4 are billed and need the user's acknowledgement of the exact count first (B4.1).
- Force-push in any form is FORBIDDEN, including during rollback. Fixes go forward as new commits on `main`.
- The remote-tag expectation changes with the step: `git ls-remote --tags origin v1.0.0 2>/dev/null | wc -l` is `0` until C2c, and `1` after C2c. The Exit Gate records which state the run ended in. Before C2b the remote does not exist at all (`git remote | grep -c '^origin$'` → `0`).

### Rollback

- Before any push: `git tag -d v1.0.0`, revert any installer fix commit, delete all sandboxes and temp clones. Nothing is pushed before approval, so the remote is untouched.
- After HARD STOP 1 but before HARD STOP 2: `git tag -d v1.0.0` remains local-only; if the raw-URL install fails, fix on `main` with a normal commit, then ask for a NEW explicit go before pushing again (never force-push), re-verify; the user may delete the remote repo if they wish.
- After HARD STOP 2: delete the remote tag (`git push origin :refs/tags/v1.0.0`) and the GitHub release (`gh release delete v1.0.0`) only with the user's go-ahead (each is its own push-class action); the release notes carry the failing details.

---

## Exit Gate

```bash
export NODE=${NODE:-node}; TF=process/general-plans/active/vibebelt-rebrand_29-10-26; H=$TF/harness
$NODE e2e-kit-flows.test.mjs                                          # Expected: Trials A-E all pass on Linux Node >= 22 in WSL (A, B, D after A0 edit 4; C after Phase 6 B4/M6-2 AC-5 predicate fix, red at baseline without it; E per Phase 6); if P0 is missing: NOT TESTED, gate CONDITIONAL
$NODE .claude/skills/vb-audit-vc/scripts/validate-agent-parity.mjs; echo $?   # Expected: 0
bash $H/compare-vb.sh; echo $?                                        # Expected: 0 (rest of the validator suite NOT WORSE than baseline/, via the Phase 6 vb- mapping; compare-vb.sh runs the Phase 0 compare.sh, so this includes the Phase 0 LICENSE RULE greps: both LICENSE lines = 1 and original line preserved, C-SAFE-2)
$NODE .claude/skills/vb-audit-vc/scripts/validate-kit-portability.mjs; echo $?  # Expected: 0 (leak/portability standing check)
grep -cE '^EQ gate: (PASS|ACCEPTED-BY-USER)' $TF/eq/verdict.md                   # Expected: 1 (FINAL EQUIVALENCE GATE; BLOCKED or missing = phase NOT done, no release)
(cd $TF/golden/tasks && sha256sum -c FROZEN.sha256); echo $?                     # Expected: every line OK, then 0 (golden definitions unchanged since Phase 3)
git diff --name-only $(cat $TF/eq/final-sha.txt) HEAD -- .claude .codex CLAUDE.md AGENTS.md process/development-protocols process/_seeds install.sh resolve-manifest.mjs compute-sync-plan.mjs vb-manifest.json   # Expected: no output (the verdict still describes the tree being tagged)
test "$(grep -c '^## \[1.0.0\]' CHANGELOG.md)" = 1; echo $?          # Expected: 0 (exactly one 1.0.0 entry: Phase 8 extended the Phase 2 entry)
test "$(wc -c < AGENTS.md)" -le 32768; echo $?                       # Expected: 0 (AGENTS.md byte budget, also in the final tree)
node -e "const fs=require('fs'),u=require('util');const m=fs.readFileSync('CHANGELOG.md','utf8');const h=m.indexOf('### Hooks block to paste into .claude/settings.json');const a=m.indexOf('```json\n',h)+8;const b=m.indexOf('\n```',a);console.log(u.isDeepStrictEqual(JSON.parse(m.slice(a,b)),JSON.parse(fs.readFileSync('.claude/settings.json','utf8')).hooks))"   # Expected: true (CHANGELOG hooks block still equals the settings hooks)
$NODE scripts/rename-prefix.mjs --list-scan-files | tr '\n' '\0' | xargs -0 grep -Il -e 'vc-' -e 'VC-' -e 'VC_' -e '\.vc\.json' -e 'vc plan check' -e 'vc plan uncheck' | LC_ALL=C sort | diff - <(LC_ALL=C sort scripts/rename-prefix.allowlist.txt)   # Expected: empty diff (R8-8 late Phase 6 sweep G7 re-run: Phases 7 and 8 edit files after Phase 6; use the Phase 6 gate G7 text verbatim if it differs)
find . \( -path ./.git -o -path ./$TF \) -prune -o \( -name 'vc-*' -o -name '.vc-*' -o -name '.vc.json' \) -print | LC_ALL=C sort | diff - <(LC_ALL=C sort scripts/rename-prefix.path-allowlist.txt)   # Expected: empty diff (R8-8 late G5 re-run)
git tag -l v1.0.0                                                     # Expected: v1.0.0 (local annotated)
git cat-file -t v1.0.0                                                # Expected: tag
git status --porcelain -- . ':(exclude)process/general-plans/active/vibebelt-rebrand_29-10-26'   # Expected: empty
git ls-remote --tags origin v1.0.0 2>/dev/null | wc -l                # Expected: 0 before C2c is approved; 1 after C2c. Record which state the run ended in (R=0 stopped before C2c, R=1 released)
```

- Install matrix table in the phase report: environment, case, result, evidence. WSL/Linux rows are PASS or NOT TESTED (P0). Native Windows and macOS rows are listed as NOT TESTED (CONDITIONAL, backlog stub with exact user commands); a best-effort Git Bash smoke, if run, is marked extra evidence.
- Clean install succeeds on every environment actually tested (WSL/Linux fresh and existing-project cases), with the A2 assertions printed in the report and each sandbox confirmed deleted.
- Release notes contain the overwrite-and-backup note (worded as in C1), the downgrade-warning explanation (worded from the B1 observation) and the user-only GitHub settings list.
- User-run known-gap list (6 items, one backlog stub each, gates CONDITIONAL, copied into the release notes and the phase report): (1) Linux Node 22 install + `node --test e2e-kit-flows.test.mjs`; (2) GitHub private vulnerability reporting, Discussions and Sponsorship settings; (3) real symlink `.agents/skills` on ubuntu CI; (4) exec bits on Windows-native checkouts; (5) re-run the Phase 2 resolver check R2.5 under Linux Node 22; (6) check that `.agents/skills` has git mode 120000 on a real Linux checkout.
- The raw-URL install result is recorded after HARD STOP 1 (or marked NOT RUN if the user has not approved publishing).

---

## Blockers That Would Justify BLOCKED Status

- Native Windows / macOS not reachable from this machine (LOCKED Q6: give the user exact commands; those gates stay CONDITIONAL with a backlog stub; not a BLOCKED reason).
- Install works only with files not yet pushed to GitHub (needs user approval to publish; HARD STOP 1).
- Linux Node refused: WSL gates become NOT TESTED and C-P8 stays CONDITIONAL (not BLOCKED, but the program cannot claim VERIFIED install proof).
- FINAL EQUIVALENCE GATE shows a reproduced WORSE or a mechanical failure, or the user does not acknowledge the run count and cost: release is blocked (the phase is not VERIFIED, no tag, no push) until the cause is fixed and the gate re-run, or the user explicitly accepts the result in chat. Install testing (Step A, B1-B3) is not blocked by this.

---

## Phase Completion Rules

- CODE DONE = checklist items done; VERIFIED = Exit Gate commands pass AND full validator suite is not worse than the Phase 0 baseline AND regression checkpoint passes AND validate-contract exists.
- VERIFIED additionally requires `EQ gate: PASS` or `EQ gate: ACCEPTED-BY-USER` in `$TF/eq/verdict.md` for the commit that is tagged (user decision A). The judge verdict (Agent-Probe) is a named residual and never the sole proof.
- Known-Gap alone never makes a behavior PASS; write a backlog stub and keep that gate CONDITIONAL.

## Acceptance Criteria

- C-P8-a install, update and publish-text flows pass. proven by: `node e2e-kit-flows.test.mjs` (Trials A-E). strategy: Hybrid
- C-P8-b clean install on WSL/Linux (fresh and existing project). proven by: A2 sandbox cases. strategy: Hybrid
- C-SAFE-1 existing project: backups byte-identical, `process/` and custom content preserved; update keeps modified files. proven by: A2(ii) and B1. strategy: Hybrid
- C-P8-c publish flow needs approval and creates no tag in the real repo. proven by: B2 temp-clone probe. strategy: Agent-Probe
- C-P8-d local annotated tag on a clean `main`. proven by: tag gate commands. strategy: Fully-Automated
- C-P8-e native Windows / macOS documented as NOT TESTED (named residual, gate CONDITIONAL, backlog stub). proven by: install matrix rows + backlog stub (no proving strategy; residual only).
- C-P8-f installer behavior is described truthfully and asserted by command (managed files overwritten, unmanaged files in place, existing `settings.json` untouched, backups byte-identical, sandboxes deleted). proven by: A2(i)/(ii) command assertions. strategy: Hybrid
- C-P8-g hard stops: each push has its own go, no force-push, remote-tag state recorded (0 before C2c, 1 after), leak detection run before tag. proven by: C2-pre commands + Exit Gate remote-tag line + protocol review of the session log. strategy: Fully-Automated (C2-pre commands, remote-tag count), Agent-Probe (go-ahead log)
- C-EQ the final kit keeps the same behaviour, ways of working and output quality as the old kit, at least equal. proven by: B4 (frozen golden tasks re-run on OLD and FINAL, scripted rubric items, validator baseline via `compare-vb.sh`, signal census 1:1 after the VC-/VB- mapping, guardrail-section identity modulo the rename, e2e trials) and the last line of `$TF/eq/verdict.md`. strategy: Fully-Automated (scripted rubric, validator baseline, signal census, guardrail identity), Hybrid (e2e trials; needs Linux Node), Agent-Probe (blind pairwise judge; named residual, never the sole proof)

## Touchpoints

- Temp install sandboxes, installer, release docs, local tag, remote/push steps behind hard stops

---

## Public Contracts

- The published install command, `vb-update`, `vb-publish`, manifest schema (`vb-manifest.json`); nothing outside these changes. Installer variable is `VB_KIT_SOURCE` after the Phase 6 rename (old `VC_KIT_SOURCE` accepted as fallback).

---

## Verification Evidence

| Gate / Scenario | Strategy | Proves SPEC criterion |
|---|---|---|
| e2e-kit-flows test (Trials A-E), Linux Node in WSL | Hybrid (needs Linux Node >= 22) | C-P8-a: install/update flows work |
| Fresh + existing-project installs on WSL/Linux (sandbox on Linux filesystem, backups `cmp`) | Hybrid (needs Linux Node >= 22) | C-P8-b and C-SAFE-1: clean install; originals backed up, `process/` preserved |
| Update from `upstream-baseline` keeps modified user files, removes only unmodified old kit files | Hybrid (old-install fixture, Linux Node) | C-SAFE-1: never delete user content |
| `vb-publish` followed to the Step 6 confirm in a temp clone; no tag or push in the real repo | Agent-Probe | C-P8-c: publish needs approval |
| Local annotated tag `v1.0.0` on clean `main` | Fully-Automated | C-P8-d: tag gate |
| A2(i)/(ii) command assertions: `find` for `vc-*`, `test -f .vb-version`, `cmp` backups and in-place files, `settings.json` untouched, sandbox deleted | Hybrid (needs Linux Node >= 22) | C-P8-f and C-P8-b: installer behavior truthful and asserted |
| C2-pre leak commands + remote-tag count (0 before C2c, 1 after) + one-go-per-push log | Fully-Automated (commands), Agent-Probe (log review) | C-P8-g: hard-stop hygiene |
| FINAL EQUIVALENCE GATE B4: scripted rubric items on 12 outputs (`$EQ/scripted.tsv`), `compare-vb.sh` exit 0, signal census diff empty after VC-/VB- mapping, guardrail-section identity modulo the rename, frozen-definition `sha256sum -c`, `EQ gate:` last line | Fully-Automated | C-EQ: mechanical equivalence evidence |
| B4 e2e trials result copied from B3 | Hybrid (needs Linux Node >= 22; NOT TESTED recorded if absent) | C-EQ: install/update behaviour unchanged |
| B4 blind pairwise judge: 3 frozen tasks x 2 replicates, OLD (`upstream-baseline`, original models) vs FINAL, tie = EQUAL, WORSE only if reproduced | Agent-Probe (judgement; named residual, never the sole proof) | C-EQ: output quality at least equal |
| Native Windows / macOS clean install | NOT TESTED (named residual; backlog stub with user-run commands; gate CONDITIONAL; no proving strategy) | C-P8-e: documented what was not tested |

---

## Phase Loop Progress

Orchestrator reads this before deciding which subagent to spawn next. The canonical 7-step inner loop
`R → I → P → PVL → E → EVL → UP` SKIPS SPEC (the umbrella plan and the user brief act as the SPEC).

- [ ] 1. RESEARCH — vb-research-agent (opus, front-matter): prior phase reports read; test context loaded; plan drift checked; Phase 3 frozen golden definitions and Phase 6/7 rename artifacts located
- [ ] 2. INNOVATE — innovate-agent (sonnet): approach decided; Decision Summary written
- [ ] 3. PLAN-SUPPLEMENT — vb-plan-agent (opus, front-matter): existing phase plan updated; Inner Loop Refresh Note if sections changed (or "n/a — research clean"); the 2026-10-29 Refresh Note below is already written
- [ ] 4. PVL — vb-validate-agent (opus, front-matter; vb- names after the Phase 6 rename and restart): full V1-V7; validate-contract written per `.claude/skills/vb-validate-findings/references/example-validate-output.md`
- [ ] 5. EXECUTE — vb-execute-agent (opus): all checklist items done; per-section test gates run and green (or gaps documented)
- [ ] 6. EVL — vb-tester: all EVL gates green; follow-up stubs registered; EVL HANDOFF SUMMARY written
- [ ] 7. UPDATE PROCESS — vb-update-process-agent (sonnet): phase report written, umbrella state updated, commit done on main

**Validate-contract required.** If step 4 (PVL) is unchecked or `## Validate Contract` reads
"(placeholder — vc-validate-agent writes this section before EXECUTE)", the orchestrator must spawn
vc-validate-agent first. A partial contract (missing Plan updates applied / Execute-agent
instructions / Test gates) is treated as a placeholder.

---

## Test Infra Improvement Notes

- Linux Node v22.23.4 is installed on this host (`/home/tom/.local/bin/node`). Measured e2e baseline on Linux node is 2 of 4: A and B pass, C fails on AC-5 (Phase 6 B4), D fails on the cross-device `git clone --local` (A0 edit 4). Via `node.exe` the file also fails on Windows path handling (A0 edits 1-3). Backlog candidate: a Windows-path-safe runner.
- Native Windows / macOS install checks have no automated harness; the backlog stub carries the user-run checklist.

---

## Resume and Execution Handoff

- Selected plan file path: `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-08-install-release_PLAN_29-10-26.md`
- Last completed step: not started (supplement cycle 2 applied to the plan, 29-10-26)
- Validate-contract status: PVL cycle 5 CONDITIONAL, MUST-FIX M8-2 addressed by the cycle-5 supplement, re-validate from V1. Earlier: PARTLY SUPERSEDED by the Inner Loop Refresh Note 2026-10-29 (new Step B4 FINAL EQUIVALENCE GATE, C0, C-EQ); inner PVL must re-run from V1. Earlier text: written (29-10-26, outer-pvl cycle 4: PASS, 0 MUST-FIX); EXECUTE allowed once the Phase 7 exit gate is green; hard stops need an explicit go per push
- Supporting context files: umbrella plan, `phase-blast-radius-registry.md`, Phase 6 and Phase 7 reports (if any), `baseline/`, `harness/validators.vb.list` and `harness/compare-vb.sh` (Phase 6)
- Next step: re-run PVL (vb-validate-agent after the rename) from V1 on this plan; EXECUTE only after Phase 7 exit gate green and the gate is PASS or accepted CONDITIONAL. HARD STOP 1 and HARD STOP 2 need the user's explicit go-ahead, one go per push.

---

## Inner Loop Refresh Note: 2026-10-29 — changed sections: Purpose, Entry Gate (P5, P6), Strategy Recommendation, Blast Radius, Implementation Checklist (new Step B4, C0, C1 quality bullet), Hard-stop hygiene, Exit Gate, Blockers, Phase Completion Rules, Acceptance Criteria (C-EQ), Verification Evidence, Phase Loop Progress, Resume and Execution Handoff. Invalidates prior validate-contract.

User decision A (2026-10-29): quality-equivalence with the old kit is a hard program requirement; the FINAL EQUIVALENCE GATE (B4) sits before every release step. The Validate Contract below predates it and must be re-run from V1.

---


## Validate Contract

Status: CONDITIONAL
Date: 29-10-26
date: 2026-10-29
generated-by: outer-pvl
supersedes: 2026-10-29 (outer-pvl, PVL cycle 5, Gate: CONDITIONAL, 1 MUST-FIX M8-2) — PVL cycle 6 re-validated from V1 against the real repo and the full post-note plan; this contract REPLACES the cycle-5 contract entirely (same calendar date, ordering is by PVL cycle: 6 follows 5) and consumes the 2026-10-29 Inner Loop Refresh Note a second time (every changed section it lists was re-read; a later V1 must not re-trigger on that note unless a newer note is written). M8-2 is verified CLOSED; 1 NEW MUST-FIX (M8-3, introduced by the cycle-5 fix R8-8); 7 RESIDUALs carried. The "Validate-contract status" line in Resume and Execution Handoff still quotes the cycle-5 text; this contract governs.

V1 line: `V1 RE-VALIDATE TRIGGERED: the cycle-5 supplement (A0 edit 4 --no-hardlinks, B4.2 sandboxes built equally, B4.6(c), late G5/G7 sweep in the Exit Gate, refreshed Linux-Node wording) was applied after the cycle-5 CONDITIONAL contract, and the plan still carries the Inner Loop Refresh Note of 2026-10-29; the orchestrator instruction treats both as newer than the same-date contract. V1 AUTO-PROCEED does not apply.`

Parallel strategy: sequential
Rationale: Signals S2, S6 and the outward-facing steps = 3/7 (MEDIUM); dominant signal S6 (installer/runtime plus push, tag and release). Sequential fits: each environment test depends on the previous fix, the equivalence gate (B4) is billed and ordered, and the outward steps are hard stops. Models: named agents run on their own front-matter (research, plan, validate, tester = opus; update-process = sonnet); the blind equivalence judge is an ad-hoc sonnet agent; execute (installer fixes) = opus. Note on this run: Layer 1 + Layer 2 checks ran inline and sequentially by one validate agent (no spawn tool); findings come from real greps and runs on the real tree (read-only) and on a scratch clone of HEAD 41b24eb under the scratchpad with Linux Node v22.23.4; the project tree was not modified. Prior verdicts were not trusted.

Evidence gathered in cycle 6 (29-10-26):
- **Structure:** `validate-plan-artifact.mjs` exit 0, 0 failures (2 advisory legacy-shape warnings). The Exit Gate fenced block passes `bash -n` (rc 0).
- **M8-2 closed (A0 edit 4):** reproduced from the `/mnt/c` checkout to tmpfs: `git clone --local` rc 128, `git clone --local --no-hardlinks` rc 0; e2e Trial D clones with `git clone --local --quiet "${KIT_PATH}" ...` at line 333 (scratch clone confirms the line). Static gates behave: `grep -c 'no-hardlinks' e2e-kit-flows.test.mjs` = 0 today and must become >= 1; the three other A0 static greps print 1 (`new URL(import.meta.url).pathname`), 2 (`mkdtempSync('/tmp`) and 3 (`bash ${INSTALL_SH}`) today and go to 0. Saved baseline text on Linux node (drvfs checkout): `# pass 2 / # fail 2` (A, B ok; C = AC-5 fixed by Phase 6 B4; D = cross-device fixed by A0 edit 4), the plan's "2 of 4" claim is accurate. Native-fs scratch clone: A, B, D ok, C fails AC-5 only; with the Phase 6 B4 predicate applied Trial C passes, so "A-E all pass" is reachable after Phases 6 and 8 A0.
- **Coherence with Phase 3 golden/tasks:** every artifact B4 and P5 name is produced by the Phase 3 plan under `$G`: `tasks/` (`tasks.md`, per-task `prompt.md`, `fixture/`, `expected-artifacts.md`, `rubric.md`, `judge.md`, `old-sandbox-recipe.md`, `FROZEN.md`, `FROZEN.sha256`), `run-record.mjs`, `signal-census.mjs`, `signal-census-phase3.txt`, `gen-guardrails.mjs`, `guardrails.json`, `start.sha`. The Phase 3 recipe builds OLD from `upstream-baseline` plus `process/context/**` with no model override; B4.2 builds OLD and FINAL equally (task folder removed from FINAL or present in both), which matches the recipe's "excluding the kit files that differ by design" diff rule.
- **Other command checks re-run in the clone:** C2-pre badge equality `15/33` vs README `agents-15`/`skills-33` rc 0; the `/Users/` scan with the six benign paths excluded prints 0; `validate-kit-portability.mjs` rc 0; `grep -c '^## \[1.0.0\]'` logic unchanged; the registry Phase 8 lines (e2e A0 with the Trial D clone, `CHANGELOG.md`, `docs/RELEASE-NOTES-1.0.0.md`, small `install.sh` fixes) agree with the plan.
- **NEW defect M8-3 (late G7 line of the Exit Gate cannot be empty with the planned release notes):** the cycle-5 fix for R8-8 added to the Exit Gate the Phase 6 content sweep G7 (`--list-scan-files | xargs grep -Il -e 'vc-' -e 'VC-' -e 'VC_' ... | diff - allowlist`, "Expected: empty diff"). The scan list contains every non-protected text file, and only `CHANGELOG.md` and `MIGRATION.md` are protected whole-file. The new file `docs/RELEASE-NOTES-1.0.0.md` (C1) is scanned, and C1's own expected wording quotes the original names: "replaces `.vc-version` with `.vb-version` ... the OLD `vc-update` skill". `grep -Il` ignores tags, so that file is printed, it is not in `scripts/rename-prefix.allowlist.txt` (that list is written at Phase 6 C2 from the trial apply, before the file exists), and the diff is non-empty. Neither Phase 8 Blast Radius nor the registry claims the allowlist file. So the gate as written fails against the plan's own planned content. It is fixable without redesign (see SUPPLEMENT REQUEST).

Test gates (C3 5-column table):

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P8-a | Install, update and publish-text flows (Trials A-E) pass | Hybrid | `$NODE e2e-kit-flows.test.mjs` on Linux Node 22.23.4 (A, B, D after A0 edit 4; C after Phase 6 B4; E per Phase 6); static gate `grep -c 'no-hardlinks'` >= 1 | A (M8-2 closed); proof of D is the Linux run in B3 |
| C-P8-b | Fresh empty project install on WSL/Linux | Hybrid | A2(i) commands: exit 0, `test -f .vb-installed-files && test -f .vb-version`, `find . \( -name 'vc-*' -o -name '.vc-*' \)` count 0, `.vb-version` equals `vb-manifest.json` version, sandbox deleted | B |
| C-P8-b, C-SAFE-1 | Existing project: backups byte-identical; managed files overwritten; `process/x.md` and `my-skill` unchanged in place; `settings.json` untouched; user files not in `.vb-installed-files` | Hybrid | A2(ii) assertions (a)-(e) (reproduced on the real checkout in cycle 5) | A (assertions satisfiable); B for the `vb-` run |
| C-SAFE-1 | Update from the `upstream-baseline` install keeps modified files and removes only unmodified old kit files | Hybrid | Phase 6 Trial E reuse (B1); Linux Node available; Phase 6 hash gate | B |
| C-P8-c | Publish flow stops at approval and creates no tag in the real repo | Agent-Probe | B2: `vb-publish` followed to Step 6 in a temp clone; `git tag -l v1.0.0` empty and `git log -1 --format=%H` unchanged | B |
| C-P8-d | Local annotated tag `v1.0.0` on a clean `main` | Fully-Automated | `git tag -l v1.0.0`, `git cat-file -t v1.0.0` = `tag`, clean porcelain (task folder excluded) | B |
| C-P8-A0 | Windows path defects removed from the e2e file (proves ONLY that) | Fully-Automated | the three static greps = 0 plus `node.exe e2e-kit-flows.test.mjs 2>&1 \| grep -cF '\C:\'` = 0 | B |
| C-P8-g | Leak detection before tag and push gives a real answer, hard-stop hygiene holds | Fully-Automated (commands), Agent-Probe (go-ahead log) | C2-pre commands (re-run: `/Users/` scan 0, badge equality rc 0, portability rc 0, product-name grep 0) + Exit Gate remote-tag count | A (commands run today); B for the `vb-` names |
| C-P8-sweep | No stray old prefix after Phases 7 and 8 edit files | Fully-Automated | Exit Gate late G5 (path find) and late G7 (content allowlist diff) | B - see SUPPLEMENT REQUEST M8-3 (G7 is unsatisfiable with the planned release notes until the allowlist step is added) |
| C-EQ (scripted) | Scripted rubric items hold on all 12 outputs; no task WORSE on a scripted item in BOTH replicates | Fully-Automated | B4.4: `$TF/eq/scripted.tsv` from `$GT/rubric.md` | B (B4.4) |
| C-EQ (mechanical) | (a) `bash $H/compare-vb.sh` exit 0; (b) signal census diff empty after the `VC-`/`VB-` and `vc-`/`vb-` mapping; (d) guardrail-section identity modulo the rename; FROZEN hashes OK; `EQ gate:` last line | Fully-Automated | B4.6 (a), (b), (d); `(cd $TF/golden/tasks && sha256sum -c FROZEN.sha256)`; `grep -cE '^EQ gate: (PASS\|ACCEPTED-BY-USER)' $TF/eq/verdict.md` = 1 | B (B4.6-B4.7) |
| C-EQ (e2e) | e2e result copied from B3 into the verdict; NOT TESTED recorded as NOT TESTED | Hybrid | B3 result line in `$TF/eq/verdict.md` (B4.6(c)) | B |
| C-EQ (quality) | Output quality at least equal to the old kit on the 3 frozen tasks (blind pairwise, 2 replicates, tie = EQUAL, WORSE only if reproduced) | Agent-Probe | B4.5 per `$GT/judge.md` on OLD (`upstream-baseline`) vs FINAL; named residual, never the sole proof | B (B4.5); D if the user does not acknowledge the cost |

Failing stubs (Fully-Automated rows only):
- Row C-P8-d: `test("should create an annotated v1.0.0 tag on a clean main", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should create an annotated v1.0.0 tag on a clean main") })`
- Row C-P8-A0: `test("should not fail with a doubled C:\\ path under node.exe", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should not fail with a doubled C:\\ path under node.exe") })`
- Row C-P8-g: `test("should report zero real leaks and a passing badge check before any tag or push", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should report zero real leaks and a passing badge check before any tag or push") })`
- Row C-P8-sweep: `test("should leave only allowlisted files holding the old vc prefix after Phases 7 and 8", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should leave only allowlisted files holding the old vc prefix after Phases 7 and 8") })`
- Row C-EQ (scripted): `test("should pass every scripted rubric item on all twelve outputs without a reproduced regression", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should pass every scripted rubric item on all twelve outputs without a reproduced regression") })`
- Row C-EQ (mechanical): `test("should keep validators, signal census and guardrail sections equal modulo the rename and end verdict.md with EQ gate PASS or ACCEPTED-BY-USER", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep validators, signal census and guardrail sections equal modulo the rename and end verdict.md with EQ gate PASS or ACCEPTED-BY-USER") })`

Legacy line form (retained so existing consumers still parse):
- e2e flows: [hybrid: `$NODE e2e-kit-flows.test.mjs`, Linux Node 22 available; Trial D fixed by A0 edit 4]
- Fresh + existing project install: [hybrid: Linux-filesystem temp dir + local `VB_KIT_SOURCE`, per-assertion commands]
- Update from baseline: [hybrid: Phase 6 Trial E; hash gate]
- Publish flow: [agent-probe: stop at Step 6 in a temp clone]
- Tag and leak checks: [Fully-automated: `git tag -l v1.0.0`, `git cat-file -t v1.0.0`, `validate-kit-portability.mjs`, repaired C2-pre commands]
- Late sweeps: [Fully-automated: Phase 6 G5/G7 re-run in the Exit Gate; needs the M8-3 allowlist step]
- FINAL EQUIVALENCE GATE: [Fully-automated: scripted rubric, `compare-vb.sh`, signal census, guardrail identity, FROZEN hashes] | [hybrid: e2e result] | [agent-probe: blind judge, named residual]
- Native Windows / macOS: [known-gap: documented — no machine here; user-run checklist in release notes; gate CONDITIONAL for those environments]

Dimension findings:
- Infra fit: PASS — installer facts verified by running; Linux Node present; sandboxes on the Linux filesystem; B4 sandboxes and worktrees outside the repo; Phase 3 artifacts named by B4 exist in the Phase 3 plan.
- Test coverage: CONCERN — M8-3 (late G7 line cannot print an empty diff with the planned `docs/RELEASE-NOTES-1.0.0.md`). M8-2 closed; C2-pre, A2, B4 arithmetic and order are sound.
- Breaking changes: PASS — release-note wording follows the verified installer behavior and the B1 observation.
- Security surface: PASS — two separate hard stops, one go per push, no force-push, cost acknowledgement before any billed run, C0 stops all of Step C, remote-tag count recorded.
- Section A0/A (install matrix): PASS.
- Section B (update, publish): PASS.
- Section B4 (equivalence gate): PASS — implementable as written; B4.2 now builds both sandboxes equally; (d) assumptions have stated fallbacks (R8-5).
- Section C (release): CONCERN — C1 writes `docs/RELEASE-NOTES-1.0.0.md` with old names and nothing records them in the allowlist (M8-3); C0 first, hard stops sound.
- Exit Gate: CONCERN — late G7 line (M8-3); all other lines run.

Net gate derivation: Layer 1 = 0 FAIL / 1 CONCERN / 3 PASS; Layer 2 = 0 FAIL / 2 CONCERN (same defect seen from Section C and the Exit Gate) / 3 PASS. MUST-FIX 1 (M8-3). RESIDUAL 7 (R8-1..R8-5, R8-6 resolved in text, R8-7 resolved; RES-A, RES-B below). Net gate: CONDITIONAL. Vacuous-green check: every developed behavior has a Fully-Automated or Hybrid gate; the blind judge is an Agent-Probe and a named residual, never the sole proof; native Windows/macOS are named residuals with no proving strategy.

Open gaps:
- MUST-FIX: M8-3 (in the SUPPLEMENT REQUEST below).
- RESIDUAL (bounded, carried as Known Gaps below).

Known Gaps (RESIDUAL, bounded, each with a backlog stub or documented user action; excluded from the gate count):
- R8-1 known-gap: native Windows (Git Bash) and macOS clean install are NOT TESTED (locked decision Q6); exact user commands in the release notes and backlog stub; gates for those environments stay CONDITIONAL after the phase.
- R8-2 known-gap: the real GitHub raw-URL install is provable only after HARD STOP 1; recorded as NOT RUN until then.
- R8-3 known-gap: Linux Node 22.23.4 is installed, so the WSL install gates, Trial E, e2e and the B4 mechanical checks are runnable; the NOT TESTED branch stays only as a contingency; the six user-run items in the Exit Gate carry the rest.
- R8-4 known-gap: the `vb-publish` Step 8 check (c) regex is stale in the skill itself (`[0-9]+-Agents` vs the real `agents-15` badges); this phase works around it with its own repaired command; fixing the skill text is a backlog note.
- R8-5 known-gap: B4.6(d) assumes `gen-guardrails.mjs` can write elsewhere (Phase 3 gives `--root` but no output option; the fallback copy in `$EQ/` is in the plan) and that the rename script runs on a temp copy (git init + one commit first, as in Phase 6 C1b). RESEARCH confirms; the real `guardrails.json` is protected by backup + `cmp`.
- RES-A (new): Trial D is proven only by the Linux Node run on the actual checkout (cross-device clone fixed by `--no-hardlinks`; same-device passes, the clone command itself returns 0 cross-device); no other drvfs-specific failure inside Trial D was observable without writing outside the scratchpad.
- RES-B (new): the Resume-and-Handoff status line and the validate-contract boilerplate in Phase Loop Progress quote cycle-5 / `vc-validate-agent` text; this contract governs.
- Resolved in text since cycle 5: R8-6 (B4.2 builds both sandboxes equally), R8-7 (Linux Node wording and 2-of-4 baseline refreshed).

What This Coverage Does NOT Prove:
- WSL/Linux installs: nothing about native Windows paths, Git Bash symlink fallbacks, macOS BSD tools or PowerShell users.
- Local `VB_KIT_SOURCE` installs: not that the public `curl | bash` URL works or that the pushed repo contains every managed file.
- Baseline-tree update test: behavior for `upstream-baseline` content only, not other historic kit versions.
- e2e Trial D / publish probe: a static text check and a stopped flow, not that a real publish (push, tag, release) succeeds.
- Existing-project test: preservation for the seeded files only; other user layouts (monorepos, customized `.codex/`) are not covered.
- Leak commands: known product names and absolute paths only, not every possible project-specific string; the `/Users/` scan skips the 6 named benign paths by design.
- Equivalence gate: 3 frozen tasks x 2 replicates; the blind judge is itself a model (Agent-Probe, named residual); it does not prove equivalence on other tasks, prompts or models; both kits are re-run now so model drift cancels, a one-sided provider change would not.
- Guardrail identity (d): section headings and body hashes of the agents' guardrail sections, not that reworded non-guardrail sentences keep their meaning (Phase 7's reviewer pass).
- A green verdict binds to `eq/final-sha.txt`; docs-only commits after it are not re-tested.

Execute-agent instructions:
- E1: Start only after the Phase 7 exit gate is green and Phase 6 (including the M6-2/M6-3 repairs and the M6-4 wording) is verified.
- E2: Before any WSL test check `node --version` inside WSL (v22.x expected on this host); if it is missing in the agent's shell, give the user the exact nvm commands and wait; if refused, mark WSL gates NOT TESTED and keep the gate CONDITIONAL. Never install Node yourself.
- E3: Never run the real `vb-publish` flow in the real repo; never run `git push` (including re-pushes and force-push), `git push --tags`, or `gh release create` without the user's explicit go-ahead in this session; one go per push.
- E4: Delete every temp sandbox and worktree after use and assert it is gone; never install into a real user project.
- E5: B4.1 is a hard stop: report the itemised count (12 task runs + 6 judge calls = 18) with the per-run cost from the Phase 3 report and wait for the user's acknowledgement in chat before any model run; B4.8 and C0 are mechanical stops.
- E6: Never edit `golden/tasks/**`, `golden/*.mjs` or the real `golden/guardrails.json` (back it up and `cmp` it after B4.6(d)); write only under `eq/`.
- E7: Run every gate block with `bash -n` first (the Exit Gate block passes today); build the B4 sandboxes without the program task folder (or equally in both) and explain any `diff.txt` line.
- E8: After A0 edit 4, `git clone --local --no-hardlinks --quiet` (or a clone dir on the same mount) is the only change to Trial D; do not touch the rest of the publish probe.

Plan updates applied: none (the one MUST-FIX goes to the SUPPLEMENT REQUEST).
Autonomous Goal Block: not written here (BRANCH B: the umbrella plan carries `## Stable Program Goal`, so the umbrella /goal governs).
Gate: CONDITIONAL (0 FAILs; 1 MUST-FIX CONCERN M8-3; 7 RESIDUAL known-gaps; M8-2 verified closed)
Accepted by: none — no concern is accepted; PHASE_COMPLETE: VALIDATE is NOT emitted for this plan (first-pass-style CONDITIONAL with an open MUST-FIX outranks the numeric `results.tsv` count). Named concern: M8-3 the late G7 Exit Gate line cannot print an empty diff once `docs/RELEASE-NOTES-1.0.0.md` quotes `.vc-version` / `vc-update`.

SUPPLEMENT REQUEST:
- Gap M8-3: Section exit-gate (late G7 line, "Expected: empty diff") and implementation-checklist C1 (release notes) and Blast Radius | Concern: the late G7 sweep lists every scanned file containing `vc-`/`VC-`/`VC_`/`.vc.json`/`vc plan check`; `docs/RELEASE-NOTES-1.0.0.md` (new in C1, not protected) is expected to quote `.vc-version` and the OLD `vc-update` skill, `grep -Il` ignores tags, and the allowlist (`scripts/rename-prefix.allowlist.txt`, written at Phase 6 C2) cannot already hold a file that does not exist yet, so the diff is non-empty and the line cannot go green; the allowlist file is also not in the Phase 8 Blast Radius or registry claim | Severity: CONCERN (MUST-FIX) | Suggested addition: add to C1 (or a new C1b) "after writing the release notes run the late G7; if `docs/RELEASE-NOTES-1.0.0.md` is the only extra line (it quotes the original names on purpose), append that one path to `scripts/rename-prefix.allowlist.txt` (keep `LC_ALL=C` order) in the same docs commit and record it in the report; any other extra file is a stray old name and is fixed instead"; add `scripts/rename-prefix.allowlist.txt` (one appended line) to the Phase 8 Blast Radius and the registry Phase 8 line (it does not touch the B4.8 code pathspec).

Next step: PVL supplement cycle (vc-plan-agent PVL-supplement mode, one checklist sentence plus a blast-radius entry), then re-validate from V1. Not routed to EXECUTE.

---

## Supplement cycle 1

Date: 29-10-26 | Mode: PVL-supplement | Gaps addressed: 6 of 6 | Validate contract above is the first-pass record; re-validate from V1.
- Gap 1 -> A1/A3, Evidence table and Exit Gate reworded: native Windows and macOS NOT TESTED (CONDITIONAL, backlog stub); Git Bash smoke is extra evidence only.
- Gap 2 -> Entry Gate P0 (Linux Node in WSL is a USER action with exact commands; otherwise NOT TESTED) and P3 (sandboxes on the Linux filesystem).
- Gap 3 -> B2 defined as stop at the Step 6 confirm inside a temp clone; asserts no tag or push in the real repo.
- Gap 4 -> A2(ii) states the real installer behavior (replace with `.vibecode-backup/` copies, settings.json merged, `process/` preserved) and the release notes explain it.
- Gap 5 -> C2 split into C2a/C2b/C2c with two hard stops; A4 uses `VB_KIT_SOURCE`; Rollback section added.
- Gap 6 -> preconditions P1/P2 listed; wording "not worse than Phase 0 baseline" used consistently; downgrade-warning and user-only GitHub settings added to C1.
- Supplement cycle 1c: added A0 (fix `fileURLToPath` Windows path bug in e2e-kit-flows.test.mjs, in blast radius) and reworded Entry Gate P1 to the Phase 2 resolver glob-mode fix (Phase 6 B0 fallback).


---

## Supplement cycle 2

Date: 29-10-26 | Mode: PVL-supplement | Gaps addressed: 5 of 5 | The Validate Contract above is the cycle-2 record; re-validate from V1.
- Gap 1 -> Step A preamble records the real `install.sh` behavior (per-file copy, no directory replacement, `settings.json` skipped when present, backup set, managed `process/` files overwritten without backup); A2(ii) and C1 rewritten to match; C1 additionally warns that the kit's hook settings are not added when a `settings.json` already exists.
- Gap 2 -> A2(i)/(ii) carry a command and an expected value per assertion plus sandbox-deleted checks; A0 now also fixes `os.tmpdir()` (lines ~34, ~330) and the unquoted/backslash `bash` path, and states that its gate proves only the absence of those defects, not that node.exe trials pass.
- Gap 3 -> new "Hard-stop hygiene" section and C2a/C2b/C2c: one go per push, re-push needs a fresh go, force-push forbidden, remote-tag count 0 before C2c and 1 after (recorded), tag re-created locally if a fix lands before C2c; C2-pre names the leak commands (`validate-kit-portability.mjs`, the narrow `CLAUDE.md`/`AGENTS.md` grep, the `/Users/` grep outside the task folder, the Step 8 check (c) badge block).
- Gap 4 -> B1 records `.vb-version` and which command prints the downgrade warning; C1 words the original-kit bullet from that observation (default: no warning for the new installer; warning only when the OLD `vc-update` skill is pointed at this repository).
- Gap 5 -> Phase Loop Progress steps 4-7 name `vb-*` agents; Entry Gate, B3 and Exit Gate use `bash $H/compare-vb.sh` (Phase 6 C3b mapping); Entry Gate P4 added.
- Concern for the orchestrator (not a plan gap): `install.sh` overwrites managed `process/development-protocols/**` and `process/_seeds/**` files without backing them up. Phase 8 documents it in the release notes; a backup extension or warning is a backlog candidate, out of scope; stub written at EXECUTE only as a NOTE.
- No registry change needed for Phase 8 (all touched files were already claimed).
- C1/C4/C5 (cycle 2c): Exit Gate compare-vb.sh line states it includes the Phase 0 LICENSE greps; C1 now EXTENDS the Phase 2 `## [1.0.0]` entry with gate `grep -c '^## \[1.0.0\]' CHANGELOG.md` = 1; Exit Gate lists the 6 user-run known-gap items; backup-extension stub wording changed to 'backlog candidate, out of scope; stub written at EXECUTE only as a NOTE'.

## Supplement cycle 3
- M8-1 applied: C2-pre (b) `/Users/` scan excludes the 6 known benign tracked paths explicitly (`__tests__` fixtures and the `vb-publish` skill and reference), expected 0 otherwise; (c) replaced with explicit badge commands comparing the real `badge/agents-N` / `badge/skills-N` values to the on-disk counts; R8-4 backlog note recorded.
- M6-2 dependency recorded: the first Exit Gate line (Trial C) depends on the Phase 6 AC-5 predicate fix.


### Supplement (user decisions 2026-10-29: quality-equivalence + model direction)

- Decision A: new hard gate B4 (cost ack, two identically prepared sandboxes, 12 verbatim task runs, scripted rubric, blind pairwise judge, mechanical evidence (a)-(d)), verdict file with a last-line contract (`EQ gate: PASS | BLOCKED | ACCEPTED-BY-USER`), C0 stop check before Step C, re-run rule bound to the FINAL commit, C-EQ criterion, Exit Gate and Verification Evidence rows. Agent-Probe stays a named residual; Fully-Automated parts must also be green.
- Decision B: no change to Phase 8 steps except model labels (research, plan, validate, tester are opus per front-matter). The OLD kit keeps its original models; both kits use the models in their own front-matter, so nothing differs by model.
- Open points for the PVL re-run: (1) B4.6(d) depends on `gen-guardrails.mjs` having a way to direct its output away from `golden/guardrails.json` (RESEARCH confirms; fallback is a copy of the script in `eq/`); (2) B4.6(d) depends on the Phase 6 rename script being runnable on a temp copy; (3) cost: 18 billed calls with 3 tasks (12 runs + 6 judge calls), to be acknowledged before starting.

## Supplement (PVL cycle 5 MUST-FIX)
- M8-2 applied: A0 gains a fourth edit (Trial D `git clone --local` made cross-device safe with `--no-hardlinks`) with a static grep gate; the Linux Node e2e run (trials A-E; A, B, D now, C after Phase 6 B4) is the proof. Exit Gate line 1, B3 wording (via A0), B4.6(c) and the Blast Radius line are updated.
- Residuals: Test Infra notes refreshed (Linux Node v22.23.4; baseline 2 of 4); R8-6 sandboxes built without the task folder; R8-8 late Phase 6 G5/G7 sweep re-run added to the Exit Gate.
- Validate Contract above is kept unchanged; status: cycle 5 CONDITIONAL, MUST-FIX addressed, re-validate from V1.

- Supplement 29-10-26 (tiny): Linux node v22.23.4 facts and 2/4 e2e baseline refreshed.

## Supplement (sync after scope decisions 2026-10-30)

- P6 and B4.1: Phase 3 made no runs and has no cost gate (decision D). B4.1 now starts with ONE acknowledged REHEARSAL run (B4.1a) that measures the per-run cost and confirms the stream-json `subagent_type` field names and `run-flags.md`; B4.1b reports the 3 CORE tasks (12 runs + 6 judge calls = 18) and the optional 4 EXTENDED tasks, and records the user's choice. `golden/old/` and `golden/phase1/` references removed (never produced).
- B4.3/B4.4 counts generalised to CORE + approved EXTENDED.
- B4.6(d) uses `gen-guardrails.mjs --root <tmp> --out $EQ/...` (Phase 3 B2 interface); the copy-the-script fallback and residual R8-5 are dropped; expected differences stated (agents unchanged; effort max on 3 agents is front-matter; rename; Phase 7 prose). The freeze step is Phase 3 D8 (not A5).
- New C0a-C0c item (pointing at the umbrella C-CLEAN section) plus Exit Gate lines: AGENTS.md <= 32,768 bytes and the CHANGELOG hooks deep-equality one-liner; SECURITY.md switcher named in the C0b trim list.
- Kept verbatim: the Validate Contract (E5 there still says 'per-run cost from the Phase 3 report' and R8-5 is listed; both are superseded by this note).
- Not changed here (Phase 8 PVL owns it): C1 still writes `docs/RELEASE-NOTES-1.0.0.md` and C2c uses `-F docs/RELEASE-NOTES-1.0.0.md`, while the umbrella C-CLEAN section moves the notes to `$TF/RELEASE-NOTES-1.0.0.md`.

## Supplement (PVL, 2026-10-30)
- H1: B4.3 uses the real Phase 3 C2 interface: `run-record.mjs record <sandbox> <run-id>`, `subagents <stream.jsonl> <run-id>`, `verify <sandbox> <run-id>`.
- H2: B4.6(b) aligned with Phase 7 check 4a: both sides VC->VB mapped, count column removed (`cut -f1-4 | LC_ALL=C sort -u`), strictness stated, with-count diff kept as a record.
- H4 (history text about a Phase 3 pointer-check): no action. Validate Contract left verbatim.
