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
- C-CLEAN re-scope (inner step 3, 2026-10-29): Phase 2 edits KEPT files only; DOOMED files are skipped (throw-away, deleted at Phase 8 C0b).
- Group (a): `install.sh` (REPO + banner), `resolve-manifest.mjs` (glob mode by `Array.isArray(manifest.include)`; gate `resolve-manifest --json` files.length > 0), `vc-manifest.json` (version), `.claude/skills/vc-update/SKILL.md` (incl. line about 356: MIGRATION.md link -> CHANGELOG.md pointer) + `references/vc-update.md` (4 version-format lines), `.claude/skills/vc-publish/SKILL.md` + `references/vc-publish.md`, `.claude/skills/vc-setup/SKILL.md`, `e2e-kit-flows.test.mjs` (header comment/display name ONLY)
- Group (b) (kept): `SECURITY.md`, `.github/FUNDING.yml` (DELETE), `.github/ISSUE_TEMPLATE/config.yml`, `.github/ISSUE_TEMPLATE/1.bug_report.yml` (1 line), `.github/workflows/welcome.yml` (display name + WhatsApp removal), `.github/workflows/release.yml` (1 line, about 162, AFTER Phase 1's validator steps), `CONTRIBUTING.md` (display name + WhatsApp bullet; switcher block left for C0b); `process/context/all-context.md` lines 154 and 210 ONLY (lines 137/168 `3.2.5` left for UPDATE PROCESS, line 179 is Phase 1's)
- Group (c): `README.md` (all old-name lines; 'Add a translation' line removed; one tagged upstream-credit line in Credits), `CHANGELOG.md` (header + new top `## [1.0.0]` entry with "Fork origin" note; upstream history lines tagged), `assets/flowser-logo.svg` (DELETE), `assets/` new files only if a license is recorded
- Group (d): ONE file `docs/i18n/README.vi-VN.md` (identity + images, badge 3.0.0 -> 1.0.0, dead relative links fixed to `../../LICENSE`, `../../CHANGELOG.md`, `../../CONTRIBUTING.md`, translation link removed, VI upstream-credit line; switcher block left for C0b)
- SKIPPED (DOOMED, not edited): `docs/i18n/README.{de,es,fr,hi,ja-JP,ko-KR,pt-BR,zh-CN}.md`, `docs/i18n/CONTRIBUTING.*.md` (5), `docs/i18n/SECURITY.*.md` (5), `docs/GITHUB-LABELS.md`, `docs/GITHUB-SETTINGS.md`, `docs/GOOD-FIRST-ISSUES.md`, `MIGRATION.md` (also whole-file protected; not tagged), `.github/ISSUE_TEMPLATE/5.translation.yml`
- Task folder: `baseline/resolved_p2_start.<runtime>.txt`, `baseline/p2_start.txt` (Entry Gate); NEW `harness/doomed.regex` (step A0; ONE shared DOOMED-path filter reused by gates R2.1, R2.2, R2.10, R2.14)
- DROPPED: step D1 (no edit to `docs/GITHUB-SETTINGS.md`, no backlog NOTE); the user-run GitHub settings list goes to the Phase 8 release notes `$TF/RELEASE-NOTES-1.0.0.md`
- NOT touched: `validate-kit-portability.mjs`, the 11 brand-detection lines in the validator and `vc-publish` SKILL/reference; `LICENSE` (Phase 0). Hand-off to Phase 6: `author: vibecode-pro-max-kit` skill metadata in 19 files. Not Phase 2: `scripts/test-compute-sync-plan.mjs`, `legacy-hashes.json` (do not exist yet)
- Strict order: Phase 1 then Phase 2 touch `README.md` and `docs/i18n/README.vi-VN.md`; Phase 7 edits them after Phase 2 (never parallel); Phase 8 C0b trims the switcher blocks

## Phase 3 (status: DONE, 2026-10-30)
- Re-scoped 2026-10-30 (user decision D): "Instrument and freeze (no slimming)". NO agent files: `.claude/agents/**` and `.codex/agents/**` are READ-ONLY and stay byte-identical to `b17294d`; no `references/` folder under either agents dir; no backlog stub; zero billed model calls
- Task folder `golden/**` ONLY (new files): `signal-census.mjs`, `gen-guardrails.mjs`, `run-record.mjs`, `lib/`, `test/**` (unit tests + fixtures), `signal-census-phase3.txt`, `guardrails.json`, `start.sha`, `determinism/**`. Phase 7 reads `signal-census.mjs` + `signal-census-phase3.txt` (hard dependency; agents listed by directory listing, keys prefix-stripped); Phase 8 reads all of them read-only
- Task folder `golden/tasks/**` (FROZEN after Phase 3 step D8 with `FROZEN.sha256`): `tasks.md`, `task-N-<slug>/{prompt.md,fixture/,expected-artifacts.md}`, `rubric.md`, `judge.md`, `old-sandbox-recipe.md`, `run-flags.md`, `FROZEN.md`. Phase 8 reads them verbatim and never edits them
- Phase 3 report `phase-03-instrument-and-freeze_REPORT_30-10-26.md`
- Removed from the claim (slimming dropped): agent `.md`/`.toml` content, `.claude/agents/references/`, `.codex/agents/references/`, `process/general-plans/backlog/codex-agent-references-load_NOTE_29-10-26.md`, `size-check.mjs`, `conservation-check.mjs`, `pointer-check.mjs`, `parity-compare.mjs`, `sizes-before.json`, `slimmed.list`, `pointers-before.json`, `agents-list-*.json`, `old/`, `phase1/`, `runs/` content, `snapshots/`
- User checkpoint: none (the cost gate A0 is gone; Phase 8 B4.1 keeps its own)

## Phase 4 (status: DONE, 2026-10-30; sequential, before Phase 5; decision E safe tidy, decision G no team)
- Shipped files (exactly these 3, in ONE revertable `fix:` commit on `main`): `AGENTS.md` (trim to <= 32,768 bytes, target <= 32,000; Skill Registry KEPT; pointer fix at line 385), `process/development-protocols/orchestration.md` (pointer fix at line 320, K1-1 line in §Regression Gate Validators, line 203 reworded), `process/development-protocols/all-development-protocols.md` (archive pointer fixed twice)
- Task folder: `p4-tools/**` (`p4_start.txt`, `claim.txt`, `census.mjs`, `pointer-check.mjs`, before/after captures, `p4_fix_sha.txt`), `dedup-allowlist.txt`, `dedup-allowlist.why.txt`, and the Phase 4 report
- FROZEN / read-only for Phase 4: `CLAUDE.md` (byte-identical to `b17294d`), the other 20 files under `process/development-protocols/` (no file added, removed or renamed; no heading renamed or removed), the charter-template mirror pair (`process/development-protocols/references/program-goal-charter-template.md` and `.claude/skills/vc-generate-phase-program/references/program-goal-charter-template.md`), `.claude/**`, `.codex/**`, `process/context/**`, `MIGRATION.md`, `vc-manifest.json`
- MUST PRESERVE the Phase 1 model-fact text (decision B) in `orchestration.md`; its exit gate re-runs the Phase 1 claim grep (no output expected)
- No worktree, no branch, no join, no SendMessage. Rollback = `git revert` of the one `fix:` commit. No cost gate (zero billed calls; the 0.5a gate is gone)
- Standing contract from Phase 4 on: `AGENTS.md` <= 32,768 bytes (Phases 5-8 keep it)

## Phase 5 (status: DONE, 2026-10-30; sequential, after Phase 4; decision F minimal safe tuning)
- `.claude/skills/*/SKILL.md`: front-matter (`description`, `trigger_keywords`) only; body only for `vc-intent-clarify` (the split leaves each heading plus a one-line pointer). This includes front-matter-only edits on SKILL.md files owned by Phases 1, 2, 6 (`vc-audit-vc`, `vc-setup`, `vc-update`, `vc-publish`); `vc-agent-strategy-compare` front-matter only (its Model Selection Policy body is Phase 1's)
- `.claude/skills/vc-intent-clarify/references/**` (NEW; file names do not start with `vc-`)
- `process/context/generated-skills-catalog.json`: regenerated by Phase 5's own LAST execute step (spawned vc-execute-agent runs `--write`; spawned vc-tester runs `--check`); no join
- Task folder: `$T/p5-tools/**` (scripts, `baseline.sha`, `claim.globs`, snapshots, `oversize.list`, `mirror.sha256`), `$T/proposed-new-skills.md`, the Phase 5 report
- Backlog note (outside the task folder): `process/general-plans/backlog/vb-agent-browser-screenshots-untrack_NOTE_29-10-26.md`
- Excluded: the charter-template mirror pair (frozen, `cmp`-checked by the Phase 5 tester), `CLAUDE.md`, `AGENTS.md`, `process/development-protocols/**`. `vc-setup`, `vc-update` and `vc-agent-strategy-compare` are NOT split
- No team, worktree, branch or join; commits on `main` after the Phase 4 commit
- The registry prose above is the human form of each phase's machine-readable claim file (`$T/p4-tools/claim.txt`, `$T/p5-tools/claim.globs`); if they ever disagree, the claim file is fixed to match this registry in the same step.

## Phase 6 (status: DONE, 2026-10-30; tools 11b19c2, rename 1e86c12)
- Tool and tests (all NEW): `scripts/rename-prefix.mjs` (only writer), `scripts/test-rename-prefix.mjs`, `scripts/test-compute-sync-plan.mjs`, `scripts/rename-prefix.allowlist.txt`, `scripts/rename-prefix.path-allowlist.txt`, `scripts/fixtures/rename-prefix/{in,out}`
- `legacy-hashes.json` (NEW, generated) goes in manifest `kitOnly`, NOT `include`; root `scripts/**` also goes in `kitOnly`
- Hooks (both trees): `.claude/hooks/**` and `.codex/hooks/**`; the 5 hook lib files per tree (`privacy-checker.cjs`, `vc-config-utils.cjs` -> `vb-config-utils.cjs`, `statusline-render-modes.cjs`, `statusline-section-registry.cjs`, `usage-limits-cache.cjs`) get `.vc.json` / `VC_USAGE_CACHE_PATH` read-old/write-new fallbacks; new tests `.claude/hooks/lib/__tests__/legacy-config-fallback.test.cjs` and `.codex/hooks/lib/__tests__/legacy-config-fallback.test.cjs`
- Task folder `harness/` (NOT the protected `baseline/`): `validators.vb.list`, `compare-vb.sh`, `runtime-map.txt`, `signal-census-before.txt`, `vc-colon-before.txt`, evidence pack
- Whole kit rename set: `.claude/skills/vc-*`, `.claude/agents/vc-*.md`, `.codex/agents/vc-*.toml` (`.codex/` has NO skill mirrors), `.claude/hooks/**`, `.codex/hooks/**`, `.claude/settings.json`, `process/**` except the task folder (incl. `process/_seeds`, `vc-system-behavior/`, `vc-autoresearch-spec.md`), `.github/**` (workflows, ISSUE_TEMPLATE), `CONTRIBUTING.md` + 5 translations, `.gitignore` (keep-region), `docs/**`, `README.md`, `CLAUDE.md`, `AGENTS.md`, `export-benchmark-kit.mjs`, `e2e-kit-flows.test.mjs` (keep-regions for Trial C seed block and the `vc-team`-removed assertion)
- `MIGRATION.md` and `CHANGELOG.md` are NOT in the rename set: whole-file protection. There is no edit to `MIGRATION.md` in Phase 6
- `vc-manifest.json` -> `vb-manifest.json` with ALL readers (`install.sh`, `resolve-manifest.mjs`, `compute-sync-plan.mjs`, vb-update/vb-publish/vb-setup, `e2e-kit-flows.test.mjs`, `.gitignore`, `export-benchmark-kit.mjs`, CONTRIBUTING, `.github` templates); state files `.vc-version`/`.vc-installed-files`/`.vc-publish-config` -> `.vb-*` (old names READ as fallbacks and migrated)
- Uppercase signals `VC-*`, env vars `VC_*`, `.vc.json`, `vc plan check`, `vc plan uncheck` are RENAMED (not residuals); `vc:*` colon forms, prose `VC harness` and JS identifiers `vcTeamDir`/`hasVcSkills` are KEPT (listed in the phase report)
- Protected set (never rewritten): task folder, `.git/`, `node_modules/`, the rename script + test files + fixtures + both allowlist files, `legacy-hashes.json`, `CHANGELOG.md`, `MIGRATION.md`, `.agents/skills` text file, manifest `legacyDeletions` values, lines tagged `legacy-vc-fallback`, `rename-prefix:keep:start/end` regions, binary files and symlinks
- Preconditions: Phase 4 and Phase 5 committed on `main` with exit gates green (no join), `AGENTS.md` <= 32,768 bytes, `resolve-manifest --json` files.length > 0 (Phase 2; Phase 6 B0 is the fallback), clean tree excluding the task folder, rollback point recorded in the SHA file `harness/pre-vb-rename.sha` (no tag)
- Restart checkpoint: Claude Code restart after the rename commit; Phase 6 EVL/UP and Phase 7 run in the restarted session

## Phase 7
- `README.md` top section only (between the `vibecoder-top` marker comments), `docs/QUICKSTART.md` (new), `docs/GLOSSARY.md` (new), `scripts/check-docs.mjs` (new) + `scripts/fixtures/check-docs/**` (new; `scripts/` is `kitOnly`)
- `docs/i18n/README.vi-VN.md` (real file; no banner), `docs/i18n/QUICKSTART.vi-VN.md` (new), `docs/i18n/GLOSSARY.vi-VN.md` (new); banner only on `docs/i18n/README.{zh-CN,ja-JP,ko-KR,pt-BR,es,de,fr,hi}.md` (8)
- `.claude/agents/vb-*.md` + `.codex/agents/vb-*.toml` mirrors (human prose around signal strings only; md and toml in the same step)
- `process/development-protocols/orchestration.md` §Plain-Language Gate Rendering ONLY
- `process/general-plans/backlog/vi-native-review_NOTE_29-10-26.md` (new backlog stub)
- Task folder `harness/phase7-*` helpers (`phase7-base-sha.txt`, `phase7-claim.patterns`, `phase7-agent-diffs/`) and `orchestration-plg-before.txt`
- Reads (hard dependency): `golden/signal-census.mjs`, `golden/signal-census-phase3.txt` (compared after `sed 's/VC-/VB-/g;s/vc-/vb-/g'` on both sides, counts removed); reuses Phase 6 `harness/compare-vb.sh` and Phase 4 `p4-tools/pointer-check.mjs` (read-only; Phase 3 builds no pointer-check)
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
- Phase 4 vs 5: none (disjoint) and sequential (4 then 5). Only Phase 5 regenerates the catalog, as its last execute step.
- README.md: Phases 1, 2, 6, 7 touch it; safe only because those phases run strictly in order.
- CLAUDE.md / protocols / strategy-compare SKILL.md / all-context.md (model-policy paragraph): Phase 1 (model facts, first), then Phase 4 (dedup, must preserve), Phase 5 (strategy-compare front-matter only), Phase 6 (rename); strictly ordered, single writer at a time.
- `docs/i18n/README.*.md`: Phases 1, 2, 6, 7 in order.
- Agents (`.claude/agents`, `.codex/agents`): Phases 1 (front-matter), 3 (content), 6 (rename), 7 (prose); strictly ordered; Phase 3 must not start while Phase 1 edits are uncommitted.
- `e2e-kit-flows.test.mjs`: Phases 2 (text), 6 (rename), 8 (path fix).
- `install.sh`, `resolve-manifest.mjs`: Phases 2, 6, 8.
- `CHANGELOG.md`: Phase 2 (1.0.0 entry), Phase 8 (release entry); Phase 6 whole-file protected. `MIGRATION.md`: Phase 2 (identity), Phase 6 (banner line only).
- `baseline/` (Phase 0 owned): Phases 1 and 2 ADD files there (listed above); Phase 6 does not touch it.
- Charter-template mirror pair: frozen in Phases 4 and 5; the Phase 5 tester checks equality with `cmp`.

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

## Supplement (Phase 3 inner 3, user decision D 2026-10-30: no slimming)
- Phase 3 claim reduced to task-folder `golden/**` (scripts, tests, baselines, frozen tasks) and its report; agent files leave the Phase 3 claim. Agents are now edited only by Phase 1 (front-matter, done), Phase 6 (rename) and Phase 7 (prose). The "Agents" conflict line above still holds with Phase 3 read-only. Phase 4/5 sequential order (not team) is reflected in those phases' own sections by their owners.

## Supplement (sync after scope decisions 2026-10-30)
- Phase 4 section replaced (decision E safe tidy: 3 shipped files, task-folder tools, frozen list, no worktree/branch, rollback = revert of the one `fix:` commit, no cost gate). Phase 5 section replaced (decision F: front-matter only, body only for `vc-intent-clarify`, new references files, catalog regenerated by Phase 5 itself; excluded charter-template pair, CLAUDE.md, AGENTS.md, protocols). Decision G: all teammate, worktree, branch, join and SendMessage text above this note in the Phase 4/5 sections is gone; older supplements keep it as history.
- Phase 6 precondition and Phase 7 reads updated; Potential Conflicts lines for Phase 4 vs 5 and the charter pair updated.
