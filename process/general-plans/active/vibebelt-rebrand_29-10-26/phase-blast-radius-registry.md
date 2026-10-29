# Phase Blast-Radius Registry — vibebelt-rebrand

Phase 0 section refreshed in inner 1b (29-10-26). Append-only in spirit; rewritten in supplement cycle 1b and again in cycle 2b (29-10-26) to match the final (cycle 2) phase plans word for word. Each phase owns the paths below. Phases 4 and 5 may run at the same time (agent team) and MUST NOT overlap. "Task folder" = `process/general-plans/active/vibebelt-rebrand_29-10-26/`.

## Phase 0
- `.git/` (new), repo-local config (`core.fileMode=false`, `core.symlinks=false`, `core.autocrlf=false`, `user.name`, `user.email`), tag `upstream-baseline`, index exec bits (mode 100755) for the 4 `.sh` files, `LICENSE` (one added line), `.git/info/exclude` (local line for the agent-browser screenshots path), `.gitignore` (one added line `.claude/skills/vc-agent-browser/screenshots/`, follow-up commit `chore: ignore agent-browser screenshots`; the 53 screenshot files themselves are never touched, moved or deleted and are NOT in the baseline commit or the tag: 521 files), `.agents/skills` (stays the 17-byte text file in the work tree; git mode 120000 via `git update-index --cacheinfo`, index only; raw exit of validate-skills / validate-context-discovery stays 1 under node.exe; operative rule 'not worse than baseline'; no directory copy, no copy fallback; vc-setup is told not to repair it)
- `process/context/**` (vc-setup output: `all-context.md`, `tests/all-tests.md`, ...)
- Task folder `baseline/`: `validators.list`, `run-validators.sh`, `compare.sh [--map <file>] [before|after_setup]` (`--map` = label rename map, one `old-label<TAB>new-label` per line), `resolved_before.<runtime>.txt` (runtime = `node-exe` or `node`; the old single name `resolved_before.txt` no longer exists), `upstream_baseline_sha.txt`, `validators_before.{tsv,txt}`, `validators_after_setup.tsv` (+ txt), `validate_all_context.txt`
- User checkpoints inside this phase (returned as `NEEDS_CONTEXT`, orchestrator asks the user): (1) git identity: user's real e-mail, exact address confirmed by the user (A0), (2) interactive `vc-setup` with prepared answers, user present (E0; seed-based context is the fallback)
- CLOSED (contradiction C1): Phase 0 B3 rule (5) LICENSE RULE makes `compare.sh` run both LICENSE greps plus the original-line check on every run; later phases only call `compare.sh`/`compare-vb.sh`
- Mixed git binaries: gates use WSL git; node.exe validators use Windows git on the same repo; Phase 0 gates that `git.exe status` and WSL `git status` both print nothing after C3

## Phase 1
- `.claude/agents/vc-execute-agent.md`, `vc-fast-mode-agent.md`, `vc-quick-fix-agent.md`: the `effort:` line ONLY (`low` -> `max`). NO `model:` line in ANY agent file changes (user decision B, 2026-10-29: keep opus on plan/research/validate/tester as on disk; fix the docs). `.codex/` is NOT claimed (Codex toml has no model/effort fields; `.codex/config.toml` unchanged)
- `.claude/skills/vc-audit-vc/scripts/validate-model-effort-policy.mjs` (new) + fixtures `.claude/skills/vc-audit-vc/scripts/fixtures/model-effort-pass/**` and `model-effort-fail/**`
- `.claude/skills/vc-audit-vc/SKILL.md` (one line listing the new validator)
- `README.md` + `docs/i18n/README.*.md` (9 files; (1) validator count, 4 sites per file, 40 total; (2) the model-fact claim sites: feature cell, model diagram + 2-row table + note, the agent-table model column for research/plan/validate, the "premium model" bullet; FACTS only, wording is Phase 7), `.github/workflows/validate.yml`
- Task folder `baseline/`: `p1_start.txt` (new) and ONE appended line in `baseline/validators.list` (`validate-model-effort-policy<TAB>...`)
- Order: Group (a) agents + validator + fixtures + SKILL.md before group (b) README/i18n/CI
- Model-fact documentation (decision B; line numbers grep-verified 2026-10-29, re-grep before editing): `CLAUDE.md` §Model Selection Policy (lines 128-141); `process/development-protocols/implementation-standards.md` (lines 74-76); `process/development-protocols/orchestration.md` (line 35); `process/development-protocols/vc-system-behavior/04-research.md:23`, `07-plan.md:29`, `08-validate.md:23` and `:25`; `.claude/skills/vc-agent-strategy-compare/SKILL.md` (§Model Selection Policy lines 22-34 and line 186; body text only); `process/context/all-context.md:179` (one paragraph in a Phase 0 file). NO change: `AGENTS.md`, `06-innovate.md`, `09-execute.md`, `autopilot.md`
- Order (3 groups): (a) effort lines + validator + fixtures + `vc-audit-vc/SKILL.md`; (b) README/i18n count + model facts + CI, starting after (a)'s validator exists; (c) model-fact docs, independent of (a)/(b)
- Hand-off: Phase 4 (owner of CLAUDE.md, AGENTS.md, protocols) runs AFTER Phase 1 and MUST PRESERVE the corrected model text; Phase 5 edits skill front-matter only, so the strategy-compare body survives; Phase 7 rewrites README wording but keeps the facts (7 opus / 8 sonnet)

## Phase 2
- Group (a): `install.sh` (REPO + banner), `resolve-manifest.mjs` (glob mode by `Array.isArray(manifest.include)`; gate `resolve-manifest --json` files.length > 0), `vc-manifest.json` (version), `.claude/skills/vc-update/SKILL.md` + `references/vc-update.md`, `.claude/skills/vc-publish/SKILL.md` + `references/vc-publish.md`, `.claude/skills/vc-setup/SKILL.md`, `e2e-kit-flows.test.mjs` (header comment/display name ONLY)
- Group (b): `SECURITY.md`, `docs/i18n/SECURITY.*.md` (5), `.github/FUNDING.yml` (DELETE), `.github/ISSUE_TEMPLATE/config.yml`, `.github/ISSUE_TEMPLATE/1.bug_report.yml` (1 line), `.github/workflows/welcome.yml` (2 lines), `.github/workflows/release.yml` (1 line), `docs/GITHUB-*.md` (incl. `GITHUB-SETTINGS.md`), `docs/GOOD-FIRST-ISSUES.md`, `MIGRATION.md` (identity lines; old-identity history lines tagged `upstream-attribution`), `CONTRIBUTING.md`, `docs/i18n/CONTRIBUTING.{ja-JP,ko-KR,pt-BR,vi-VN,zh-CN}.md` (5 files, display name + clone URLs only). Phase 7 must NOT assume it owns the CONTRIBUTING translations' display name.
- Group (c): `README.md` (ALL old-name lines, not only header/badges), `CHANGELOG.md` (new top `## [1.0.0]` entry with "Fork origin" note; upstream history lines tagged), `assets/flowser-logo.svg` (DELETE), `assets/` new files only if a license is recorded
- Group (d): `docs/i18n/README.*.md` (9 files; identity + images, by one replacement script)
- Task folder `baseline/`: `resolved_p2_start.<runtime>.txt` (e.g. `resolved_p2_start.node-exe.txt`) and `p2_start.txt` (both written at the Entry Gate)
- `process/context/all-context.md` lines 154 and 210 ONLY (flowser-logo.svg mention; withkynam URL note); lines 137/168 (`3.2.5`) are left for UPDATE PROCESS, line 179 is Phase 1's (PVL cycle 5, M2-1)
- NOT touched: `validate-kit-portability.mjs`, the 11 brand-detection lines in `vc-publish` SKILL and reference. Left for later (hand-off line in the report, no phase plan claims it; see contradiction C7): `author: vibecode-pro-max-kit` skill metadata in about 33 files
- Strict order: Phase 1 then Phase 2 both touch the 9 translated READMEs; Phase 7 edits `docs/i18n/README.*.md` after Phase 2 (never parallel)

## Phase 3
- `.claude/agents/vc-*.md` (15 files, ONE at a time, one commit per agent, `refactor(agents): slim <agent>`), `.codex/agents/*.toml` mirrors
- New agent `references/` files: `.claude/agents/references/` (or the location decided in Phase 3 step 0.2, accepted by the parity validator and manifest globs) and `.codex/agents/references/` (plain .md; NEW path; `references/` subfolders are never agents)
- Task folder `golden/**`: `size-check.mjs`, `signal-census.mjs`, `conservation-check.mjs`, `pointer-check.mjs`, `parity-compare.mjs`, `gen-guardrails.mjs`, `run-record.mjs`, `signal-census-phase3.txt`, snapshots (`sizes-before.json`, `slimmed.list`, `signal-census-before.txt`, `pointers-before.json`, `start.sha`, `agents-list-before.json`), `guardrails.json`, `runs/`, `old/` (original models, reported only), `phase1/` (same models, unslimmed; the revert baseline), `compare.md`. Phase 7 reads `signal-census.mjs` + `signal-census-phase3.txt` (hard dependency; Phase 3 must keep them; the census lists agents by directory listing and keys by prefix-stripped names)
- Task folder `golden/tasks/**` (NEW, user decision A, FROZEN after Phase 3 step A5 with `FROZEN.sha256`): `tasks.md`, `task-N-<slug>/{prompt.md,fixture/,expected-artifacts.md}`, `rubric.md`, `judge.md`, `old-sandbox-recipe.md`, `FROZEN.md`. Phase 8 reads them verbatim and never edits them
- Outside the task folder: ONE new backlog stub `process/general-plans/backlog/codex-agent-references-load_NOTE_29-10-26.md` (step 0.2f)
- User checkpoint: cost gate A0 (exact run count; user acknowledgement required before any model run)

## Phase 4 (parallel with Phase 5)
- Works in its OWN `git worktree` + branch (teammate `p4-docs-dedup`), merged at the join by a spawned vc-execute-agent
- `CLAUDE.md`, `AGENTS.md` (incl. the Skill Registry table replaced by a plain-path pointer to the catalog / `discover-skills.mjs`), `process/development-protocols/**` (orchestration, implementation-standards, plan-lifecycle, phase-programs, `vc-system-behavior/*`)
- Task folder: `p4-tools/**` (scripts, `baseline.sha`, `claim.globs`, `pointer-baseline.json`, `overlap-baseline.json`, `cold-read.md`), `dedup-allowlist.txt`, `dedup-allowlist.why.txt`, and the Phase 4 report
- READ-ONLY for Phase 4: `.claude/agents/**`, `.codex/**`, `.claude/skills/**`, `process/context/generated-skills-catalog.json`
- FROZEN in Phases 4 AND 5 (neither edits them; `diff -q`/`cmp` at the join): `process/development-protocols/references/program-goal-charter-template.md` and its skill-side mirror `.claude/skills/vc-generate-phase-program/references/program-goal-charter-template.md`
- Rule: may not rename/delete any protocol file or heading cited from OUTSIDE `process/development-protocols/` (incl. `.claude/**`, `.codex/**`) without a stub or SendMessage to `p5-skills-tune`
- MUST PRESERVE the Phase 1 model-fact text (decision B) in `CLAUDE.md` §Model Selection Policy, `orchestration.md` line 35, `implementation-standards.md` effort bullet, `vc-system-behavior/04-research.md`, `07-plan.md`, `08-validate.md`; its verification re-runs the Phase 1 claim grep (no output expected)
- User checkpoint: cost gate 0.5a (exact probe-call count reported before any probe)
- Fallback when team tooling is unavailable: Phase 4 then Phase 5 sequentially on `main`; claim-check on `git diff --name-only $(cat $T/p4-tools/baseline.sha)..HEAD`

## Phase 5 (parallel with Phase 4)
- Works in its OWN `git worktree` + branch (teammate `p5-skills-tune`, `git worktree add ../vibebelt-p5 -b p5-skills-tune $(cat $P/baseline.sha)`), merged at the orchestrator join
- Front-matter-only edits also on SKILL.md files owned by Phases 1, 2, 6 (`vc-audit-vc`, `vc-setup`, `vc-update`, `vc-publish`)
- `.claude/skills/*/SKILL.md` (front-matter `description` / `trigger_keywords` only; oversize splits into new `references/*`), `.claude/skills/vc-agent-browser/**` (non-destructive only; investigation, no change)
- `process/context/generated-skills-catalog.json`: regenerated ONLY at the join (spawned vc-execute-agent runs `catalog --write`; spawned vc-tester runs `--check`), not by the teammate
- Task folder: `p5-tools/**` (scripts, `baseline.sha`, `claim.globs`, snapshots, `oversize.list`, `pre-skill-folders.txt`), `proposed-new-skills.md`, and the Phase 5 report
- New backlog note (outside the task folder): `process/general-plans/backlog/vc-agent-browser-screenshots-untrack_NOTE_29-10-26.md`
- FROZEN: the skill-side charter-template mirror copy (and the protocol-side copy); see Phase 4
- Handoff: after Phase 3 exit gate, parallel with Phase 4
- NOT: `CLAUDE.md`, `AGENTS.md`, `process/development-protocols/**`
- `.claude/skills/vc-agent-strategy-compare/SKILL.md`: front-matter only; its `## Model Selection Policy` body is Phase 1's (decision B) and must survive unchanged
- The registry prose above is the human form of the machine-readable `claim.globs` of each phase (`$T/p4-tools/claim.globs`, `$P/claim.globs`); if they ever disagree, the globs file is fixed to match this registry in the same step.

## Phase 6
- Tool and tests (all NEW): `scripts/rename-prefix.mjs` (only writer), `scripts/test-rename-prefix.mjs`, `scripts/test-compute-sync-plan.mjs`, `scripts/rename-prefix.allowlist.txt`, `scripts/rename-prefix.path-allowlist.txt`, `scripts/fixtures/rename-prefix/{in,out}`
- `legacy-hashes.json` (NEW, generated) goes in manifest `kitOnly`, NOT `include`; root `scripts/**` also goes in `kitOnly`
- Hooks (both trees): `.claude/hooks/**` and `.codex/hooks/**`; the 5 hook lib files per tree (`privacy-checker.cjs`, `vc-config-utils.cjs` -> `vb-config-utils.cjs`, `statusline-render-modes.cjs`, `statusline-section-registry.cjs`, `usage-limits-cache.cjs`) get `.vc.json` / `VC_USAGE_CACHE_PATH` read-old/write-new fallbacks; new tests `.claude/hooks/lib/__tests__/legacy-config-fallback.test.cjs` and `.codex/hooks/lib/__tests__/legacy-config-fallback.test.cjs`
- Task folder `harness/` (NOT the protected `baseline/`): `validators.vb.list`, `compare-vb.sh`, `runtime-map.txt`, `signal-census-before.txt`, `vc-colon-before.txt`, evidence pack
- Whole kit rename set: `.claude/skills/vc-*`, `.claude/agents/vc-*.md`, `.codex/agents/vc-*.toml` (`.codex/` has NO skill mirrors), `.claude/hooks/**`, `.codex/hooks/**`, `.claude/settings.json`, `process/**` except the task folder (incl. `process/_seeds`, `vc-system-behavior/`, `vc-autoresearch-spec.md`), `.github/**` (workflows, ISSUE_TEMPLATE), `CONTRIBUTING.md` + 5 translations, `.gitignore` (keep-region), `docs/**`, `README.md`, `CLAUDE.md`, `AGENTS.md`, `export-benchmark-kit.mjs`, `e2e-kit-flows.test.mjs` (keep-regions for Trial C seed block and the `vc-team`-removed assertion)
- `MIGRATION.md` and `CHANGELOG.md` are NOT in the rename set: whole-file protection. The ONLY Phase 6 edit to `MIGRATION.md` is one hand-added banner line at the top (step B6) pointing to `docs/RELEASE-NOTES-1.0.0.md`
- `vc-manifest.json` -> `vb-manifest.json` with ALL readers (`install.sh`, `resolve-manifest.mjs`, `compute-sync-plan.mjs`, vb-update/vb-publish/vb-setup, `e2e-kit-flows.test.mjs`, `.gitignore`, `export-benchmark-kit.mjs`, CONTRIBUTING, `.github` templates); state files `.vc-version`/`.vc-installed-files`/`.vc-publish-config` -> `.vb-*` (old names READ as fallbacks and migrated)
- Uppercase signals `VC-*`, env vars `VC_*`, `.vc.json`, `vc plan check`, `vc plan uncheck` are RENAMED (not residuals); `vc:*` colon forms, prose `VC harness` and JS identifiers `vcTeamDir`/`hasVcSkills` are KEPT (listed in the phase report)
- Protected set (never rewritten): task folder, `.git/`, `node_modules/`, the rename script + test files + fixtures + both allowlist files, `legacy-hashes.json`, `CHANGELOG.md`, `MIGRATION.md`, `.agents/skills` text file, manifest `legacyDeletions` values, lines tagged `legacy-vc-fallback`, `rename-prefix:keep:start/end` regions, binary files and symlinks
- Preconditions: Phases 4+5 exit met, join step green, `resolve-manifest --json` files.length > 0 (Phase 2; Phase 6 B0 is the fallback), clean tree excluding the task folder, local tag `pre-vb-rename` (created at C2c on the tool commit)
- Restart checkpoint: Claude Code restart after the rename commit; Phase 6 EVL/UP and Phase 7 run in the restarted session

## Phase 7
- `README.md` top section only (between the `vibecoder-top` marker comments), `docs/QUICKSTART.md` (new), `docs/GLOSSARY.md` (new), `scripts/check-docs.mjs` (new) + `scripts/fixtures/check-docs/**` (new; `scripts/` is `kitOnly`)
- `docs/i18n/README.vi-VN.md` (real file; no banner), `docs/i18n/QUICKSTART.vi-VN.md` (new), `docs/i18n/GLOSSARY.vi-VN.md` (new); banner only on `docs/i18n/README.{zh-CN,ja-JP,ko-KR,pt-BR,es,de,fr,hi}.md` (8)
- `.claude/agents/vb-*.md` + `.codex/agents/vb-*.toml` mirrors (human prose around signal strings only; md and toml in the same step)
- `process/development-protocols/orchestration.md` §Plain-Language Gate Rendering ONLY
- `process/general-plans/backlog/vi-native-review_NOTE_29-10-26.md` (new backlog stub)
- Task folder `harness/phase7-*` helpers (`phase7-base-sha.txt`, `phase7-claim.patterns`, `phase7-agent-diffs/`) and `orchestration-plg-before.txt`
- Reads (hard dependency): `golden/signal-census.mjs`, `golden/signal-census-phase3.txt` (compared after `sed 's/VC-/VB-/g;s/vc-/vb-/g'` on both sides); reuses Phase 6 `harness/compare-vb.sh`
- NOT claimed: `CONTRIBUTING*` (Phase 2 owns identity, Phase 6 owns the rename)

## Phase 8
- Temp install sandboxes on the Linux filesystem (outside repo, deleted after each case)
- `e2e-kit-flows.test.mjs` (step A0, BEFORE any install test): `fileURLToPath` at line ~21, `os.tmpdir()` instead of hard-coded `/tmp` (lines ~34, ~330), quoted forward-slash `bash` path at every `bash ${INSTALL_SH}` call (umbrella assigns it to Phase 8)
- `CHANGELOG.md` (hand-written entry in `vb-` terms; see contradiction C4), `docs/RELEASE-NOTES-1.0.0.md` (new), small `install.sh` fixes. `MIGRATION.md` is NOT claimed by Phase 8 (the pointer banner is Phase 6 B6)
- Backlog stubs under `process/general-plans/backlog/`: native Windows/macOS user-run checklist, Linux-Node refusal (if it happens); possible backup-extension / JSON-merge candidates for `install.sh` (stub "to be written at EXECUTE" per Phase 8 notes; not in scope for v1.0.0)
- Tag `v1.0.0` local only; push / remote tag / release = hard stops (C2a-C2c, one go each)
- Precondition: `resolve-manifest --json` files.length > 0; uses Phase 6 `harness/compare-vb.sh`
- FINAL EQUIVALENCE GATE (user decision A, step B4): task-folder evidence `eq/**` (`shas.txt`, `final-sha.txt`, `diff.txt`, `diff-excluded.txt`, `old/`, `final/`, `scripted.tsv`, `census-*.txt`, `guardrails-*.json`, `verdict.md`) is Phase 8 owned; READ-ONLY inputs `golden/tasks/**`, `golden/*.mjs`, `golden/guardrails.json`, `golden/signal-census-phase3.txt`, `golden/start.sha` (Phase 3); two throw-away worktrees outside the repo. User checkpoint: exact run count and cost acknowledged before any model run (B4.1). Gate result is the last line of `eq/verdict.md`; Step C0 stops on anything but `EQ gate: PASS` or `ACCEPTED-BY-USER`

## Potential Blast Radius Conflicts
- Phase 4 vs 5: none (disjoint). Both regenerate nothing shared; catalog regeneration is the orchestrator-sequenced join step.
- README.md: Phases 1, 2, 6, 7 touch it; safe only because those phases run strictly in order.
- CLAUDE.md / protocols / strategy-compare SKILL.md / all-context.md (model-policy paragraph): Phase 1 (model facts, first), then Phase 4 (dedup, must preserve), Phase 5 (strategy-compare front-matter only), Phase 6 (rename); strictly ordered, single writer at a time.
- `docs/i18n/README.*.md`: Phases 1, 2, 6, 7 in order.
- Agents (`.claude/agents`, `.codex/agents`): Phases 1 (front-matter), 3 (content), 6 (rename), 7 (prose); strictly ordered; Phase 3 must not start while Phase 1 edits are uncommitted.
- `e2e-kit-flows.test.mjs`: Phases 2 (text), 6 (rename), 8 (path fix).
- `install.sh`, `resolve-manifest.mjs`: Phases 2, 6, 8.
- `CHANGELOG.md`: Phase 2 (1.0.0 entry), Phase 8 (release entry); Phase 6 whole-file protected. `MIGRATION.md`: Phase 2 (identity), Phase 6 (banner line only).
- `baseline/` (Phase 0 owned): Phases 1 and 2 ADD files there (listed above); Phase 6 does not touch it.
- Charter-template mirror pair: frozen in Phases 4 and 5; the join step checks equality.

## Pre-PVL resolution (29-10-26)
- No reassignment needed. Phases 4 and 5 stay disjoint. Multi-phase files are single-writer at a time (see umbrella Pre-PVL Conflict Resolution).
- Locked Q2: Phase 2 deletes `.github/FUNDING.yml`. Locked Q4: Phase 6 owns the manifest and state-file renames and the files that read them.
- PVL cycle 1 / supplement 1b (29-10-26): registry aligned with phase plans 0-8; Phase 1 no longer claims `.codex/`.

## Supplement cycle 2 (29-10-26)
- Registry updated: Phase 2 now also owns `docs/i18n/CONTRIBUTING.*.md`, `.github/workflows/welcome.yml`, `release.yml`, `.github/ISSUE_TEMPLATE/1.bug_report.yml`; Phases 4 and 5 use separate worktrees/branches; Phase 5 front-matter-only on Phase 1/2/6-owned SKILL.md files; Phase 6 owns hooks `.vc.json`/`VC_USAGE_CACHE_PATH` renames, `validators.vb.list` in the task folder, and `kitOnly` for `legacy-hashes.json` + `scripts/**`; Phase 0 `.agents/skills` via `update-index --cacheinfo`.
- Still disjoint: Phase 4 vs Phase 5.

## Supplement cycle 2b (29-10-26)
- Registry aligned with the cycle-2 phase plans: added Phase 0 files and user checkpoints; Phase 1 `baseline/p1_start.txt` + validators.list line; Phase 2 baseline start files and CONTRIBUTING translations; Phase 3 `golden/**` (full list), `.codex/agents/references/`, codex backlog stub; Phase 4 `p4-tools/**`, dedup allowlists, report, frozen charter template, branch `p4-docs-dedup`; Phase 5 `p5-tools/**`, proposed-new-skills, report, backlog note, frozen skill-side mirror, branch `p5-skills-tune`; Phase 6 full tool/test/hook/harness list, `kitOnly`, `MIGRATION.md`/`CHANGELOG.md` whole-file protection; Phase 7 `scripts/fixtures/check-docs/**` and `harness/phase7-*`; Phase 8 e2e fixes and backlog stubs.
- `resolved_before.txt` renamed to `resolved_before.<runtime>.txt` everywhere.
- Still disjoint: Phase 4 vs Phase 5 (both freeze both charter-template copies).


## Supplement (user decisions 2026-10-29: quality-equivalence + model direction)
- Decision B: Phase 1 claim rewritten (no `model:` edits; effort lines of 3 execution agents; model-fact docs in CLAUDE.md, 5 protocol files, strategy-compare SKILL.md, all-context.md, README x10). Ownership conflict resolution: Phase 1 first, Phase 4 preserves, Phase 5 front-matter only, Phase 7 keeps the facts.
- Decision A: Phase 3 now also owns the frozen `golden/tasks/**`; Phase 8 owns `eq/**` and only reads `golden/**`. Still disjoint: Phase 4 vs Phase 5.

## Supplement (PVL cycle 5 MUST-FIX, 29-10-26)
- Phase 2 claim gains `process/context/all-context.md` lines 154 and 210 ONLY (checklist step B7). Phase 1 keeps line 179; lines 137/168 stay for UPDATE PROCESS. Still disjoint from Phases 4 and 5 (neither claims `process/context/all-context.md`).

## Supplement (sync with Phase 1/6/8 cycle-5 edits, 29-10-26)
- Phase 1 also owns `.github/workflows/release.yml`: ADDITIONS only (the same validator steps as `validate.yml`; the `on: push: tags: ['v*']` trigger, permissions and the `Create GitHub Release` step are untouched). It runs BEFORE Phase 2's one display-name line in that file. The E3 exit-code table (`continue-on-error` rule) covers both workflow files.
- Phase 1 README/i18n edits are per-file, grep-located anchors (no shared find-and-replace): ko-KR, pt-BR, vi-VN, zh-CN have localized diagram text; zh-CN uses full-width parentheses.
- Phase 2: the `release.yml` display-name line (and the `release.yml (1 line)` entry above) runs AFTER Phase 1's validator steps.
- Phase 6: `e2e-kit-flows.test.mjs` edit is limited to the AC-5 predicate lines (~267-277, step B4); Trial D is untouched (Phase 8 A0). Its e2e gate (G15) covers trials A, B, E, and C after B4.
- Phase 8: `e2e-kit-flows.test.mjs` A0 edits at ~21 (`fileURLToPath`), ~34 and ~330 (`os.tmpdir()`), the Trial D clone at ~333 (`--no-hardlinks`) and the quoted `bash ${INSTALL_SH}` calls. Linux-node e2e baseline is 2 of 4 (A, B pass; C fails AC-5; D fails cross-device clone), not 0/4 via node.exe.
- Stale-prose check: the registry contains no 'OPEN C1', 'Phase 7 owns README.vi.md' or 'no Linux Node' text (grep-verified); the only hits are in Phase 2/8/umbrella plans (Phase 8 R8-7 notes, Phase 8 line 113, umbrella C-EQ row), outside this edit's scope.
- Still disjoint: Phase 4 vs Phase 5.
