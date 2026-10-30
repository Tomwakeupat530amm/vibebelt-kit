---
name: plan:vibebelt-rebrand-phase-06-prefix-rename
description: "vibebelt-kit rebrand — Phase 06: Prefix rename vc- to vb-"
date: 29-10-26
metadata:
  node_type: memory
  type: plan
  feature: general-plans
  phase: phase-06
---

# Phase 06 — Prefix rename vc- to vb-

**Program:** vibebelt-rebrand
**Umbrella plan:** process/general-plans/active/vibebelt-rebrand_29-10-26/vibebelt-rebrand-umbrella_PLAN_29-10-26.md
**Phase status:** ✅ VERIFIED (COMPLETE_WITH_GAPS; commits 11b19c2 and 1e86c12; independent EVL PASS, 30-10-26)
**Complexity:** COMPLEX
**Report destination:** process/general-plans/active/vibebelt-rebrand_29-10-26/phase-06-prefix-rename_REPORT_29-10-26.md (flat in the program task folder)

---

## Overview

One phase of the vibebelt-rebrand program; program context lives in the umbrella plan. Context router: process/context/all-context.md (created in Phase 0). Test routing: process/context/tests/all-tests.md (load before assigning tiers).

Date: 29-10-26
Status: PLANNED
Complexity: COMPLEX

## Purpose

Rename the internal prefix to `vb` everywhere, in ONE deterministic, idempotent, dry-run-capable script so nothing is renamed by hand. The rename is CASE-SENSITIVE and ATOMIC (LOCKED): `vc-` -> `vb-`, `VC-` -> `VB-`, `VC_` -> `VB_` in a single apply. That includes the four uppercase signal strings (`VC-PREDICT-DEEP-NEEDED`, `VC-FEASIBILITY-PROBE-NEEDED`, `VC-PREDICT-RESEARCH-COMPLETE`, `VC-FEASIBILITY-VERDICT-READY` become `VB-...`, all emitters and all orchestrator matchers together), the env vars (`VC_KIT_SOURCE`, `VC_UPDATE_TMPDIR`, `VC_INSTALL_TMPDIR`, `VC_USAGE_CACHE_PATH` become `VB_...`), the config file `.vc.json` -> `.vb.json`, and the bare CLI text `vc plan check` -> `vb plan check` (explicit literal rules, decided here; no other bare `vc` token is touched).

Upgrade safety is BUILT, not assumed: old env var names and old state files (`.vc-version`, `.vc-installed-files`, `.vc-publish-config`, `vc-manifest.json`, `.vc.json`) are still READ as fallbacks (new readers prefer `vb-`, fall back to `vc-`) and are migrated on a successful sync. Old `vc-` kit files are removed on update only when byte-identical to the shipped `upstream-baseline` hash list; pre-existing deprecated directories (no hash exists) are removed only when every file in them is listed in the project's old install snapshot; user-modified or unknown files are kept and reported.

**Stray forms — decisions LOCKED in supplement cycle 2** (each form is decided explicitly, each has a fixture in A1, residuals are proven unchanged by a before/after count, not assumed):

| Form (real occurrences) | Decision | Proof |
|---|---|---|
| `vc plan uncheck` (same line as `vc plan check` in `subagent-init.cjs`, `.claude` + `.codex`, line 60) | RENAMED: literal rule `vc plan uncheck` -> `vb plan uncheck` (6th literal rule) | fixture; sweep pattern list includes it |
| `vc:plan`, `vc:cook`, `vc:fix`, ... colon forms (about 20 hits: `AGENTS.md`, `validate-skills.mjs`, `validate-context-discovery.mjs`, autoresearch references) | KEPT unchanged: the validators match them as banned legacy patterns, so renaming them would make the validators blind | gate X-COLON: `vc:[a-z-]*` census saved before and equal after |
| Prose `VC-system` / bare `VC-` (9 hits: `AGENTS.md`, `CLAUDE.md`, `README.md`, a `transcript-parser.cjs` comment) | RENAMED by the uppercase `VC-` rule (becomes `VB-system`); the signal census counts these tokens and maps them 1:1 | census gate |
| Prose `VC harness` (space, no hyphen, 5 hits) and JS identifiers `vcTeamDir`, `hasVcSkills` | KEPT: no rule matches them; listed in the phase report as intentional residuals | not matched by any sweep pattern; listed in report |
| `my-custom-vc-tool` (`vc-update` SKILL.md line 156) and `non-vc-` (preceder `-`) | RENAMED (`my-custom-vb-tool`, `non-vb-`): `-` is not ASCII alphanumeric; harmless prose examples | fixture `-vc-` |
| `vc-audit-vc` (the `-vc` suffix) | Directory becomes `vb-audit-vc`; the trailing `vc` has no hyphen so no rule applies; this is the intended name used by every gate in the program | documented here |

The two `VC_` hits inside a JS token-regex constant are renamed by the `VC_` rule; harmless.

---

## Entry Gate

**Umbrella SWEEP RULE (copied verbatim from the umbrella, Global Constraints; the umbrella is canonical):** SWEEP RULE (canonical wording lives here; Phase 2 and Phase 6 implement it, see their gates): search the whole repo EXCLUDING `.git`, the program task folder `process/general-plans/active/vibebelt-rebrand_29-10-26/` (and its archived copy), `baseline/`, `golden/`, the rename script + its fixtures, `CHANGELOG.md` and `MIGRATION.md` (WHOLE-FILE protection: Phase 6 implements the history rule as a protected set, not as marker regions; in Phase 2 their old-identity lines are instead tagged `upstream-attribution`), and `legacyDeletions`. Old-identity lines that legitimately remain are only: (1) lines carrying the literal tag `upstream-attribution`; (2) the brand-detection lines in `.claude/skills/vc-audit-vc/scripts/validate-kit-portability.mjs`, `.claude/skills/vc-publish/SKILL.md` and `.claude/skills/vc-publish/references/vc-publish.md`. Phase 2 may additionally exclude the whole `process/` directory ONLY because at Phase 2 time `process/` holds no kit text beyond the task folder and Phase 0 generated context; its gate adds `grep -rIn "withkynam\|flowser" process --exclude-dir=vibebelt-rebrand_29-10-26` and expects no output. MECHANISM IMPLEMENTED BY PHASE 6: `CHANGELOG.md` and `MIGRATION.md` are protected WHOLE-FILE (protected set, no marker regions) and the sweeps never scan them; Phase 2 instead tagged their old-identity lines `upstream-attribution`. Gates G5/G7 prove the protected set and the allowlist diffs.

**Metadata author rule (C7, owned by Phase 6):** the `author: vibecode-pro-max-kit` line in 19 `SKILL.md` files (indented two spaces under `metadata:`; verified by grep, NOT ~33) is NOT matched by the generic `vc-` rules (`vibecode-` has no `vc-`), and Phase 2 left it. Decision: the rename tool carries ONE explicit literal rule (7th literal rule, indentation-tolerant: matches `^([ \t]*)author: vibecode-pro-max-kit[ \t]*$` and preserves the captured indentation): `author: vibecode-pro-max-kit` -> `author: vibebelt-kit`. It is protected from generic rules by being an exact full-line literal; fixture proves it; count gate G18 below.

Path variables used in this phase (define once; every gate below runs from the repo root):

```bash
export NODE=${NODE:-node}
TF=process/general-plans/active/vibebelt-rebrand_29-10-26      # task folder (protected; also holds baseline/ golden/ harness/)
H=$TF/harness; B=$TF/baseline
SCAN="$NODE scripts/rename-prefix.mjs --list-scan-files"        # the one definition of "files that are swept"
```

All items are checked and recorded in the phase report before any `--apply`:

1. Phases 0-5 exit gates green: Phase 4 and Phase 5 committed on `main` with their exit gates green (sequential, no team, no join; decision G). `test "$(wc -c < AGENTS.md)" -le 32768` (AGENTS.md byte budget, standing contract from Phase 4).
2. Phase 2 precondition: `resolve-manifest.mjs` chooses glob mode by shape (`Array.isArray(manifest.include)`), not by version. Check on a COPY of the real kit (a bare manifest in an empty root resolves zero files in every mode, so it proves nothing): `R=$HOME/vb-sandbox/resolver-1.0.0; rm -rf $R; mkdir -p $R; git archive HEAD | tar -x -C $R; sed -i '0,/"version": *"[^"]*"/s//"version": "1.0.0"/' $R/vc-manifest.json` then run the resolver on `$R` and on `.` with the accumulate-until-end parse (see Exit Gate G11) and assert both counts are equal and > 0. If Phase 2 did not land it, step B0 lands it here first (the resolver returns `files: []` at 1.0.0 otherwise; reproduced).
3. Clean tree EXCLUDING the task folder (phase reports and `harness/` are written there while working): `test -z "$(git status --porcelain -- . ':(exclude)process/general-plans/active/vibebelt-rebrand_29-10-26')"` on `main`. The rollback point is NOT recorded here; C2c records the SHA of the commit that already contains the tool into `$H/pre-vb-rename.sha` (no git tag: user standing rule; a SHA taken before the tool exists would discard the tool on rollback).
4. Tag `upstream-baseline` exists (`git tag -l upstream-baseline` prints it); it is the source of the legacy name list and hash list.
5. Runner: `$NODE` = Linux Node >= 22 inside WSL (`node --version`). Installing it is a USER action (see Phase 8 P0), never automatic. If absent, `NODE=node.exe` runs the pure-script and validator gates only; every Hybrid gate (Trial E, e2e) is NOT TESTED and stays CONDITIONAL. Sandboxes for Hybrid gates live on the Linux filesystem (for example `$HOME/vb-sandbox`), never under `/mnt/c`. File-list comparisons run on Linux Node only (node.exe returns backslash paths).
6. Baseline reds (`validate-skills`, `validate-context-discovery` red because `.agents/skills` is a text file on this checkout) are read from the Phase 0 `baseline/` record and are NOT counted as Phase 6 regressions.

---

## Strategy Recommendation (vc-agent-strategy-compare)

- Signals: S1, S2, S4, S6, S7 — score 5/7 (HIGH label), dominant signal S6 (destructive updater and installer behavior), but the change is one script run over a closed file set.
- Recommended: **Sequential** — 1 execute agent runs the script; the point is determinism, so fan-out adds risk. Research/plan/validate = opus (front-matter); script authoring + run = opus. Alternative (agent team) rejected: no mid-run coordination needed.
- Restart checkpoint: after the single rename commit the orchestrator STOPS and asks the user to restart Claude Code in the repo, because renamed agents (`vb-*`) may not be spawnable in the same session. Steps 6 (EVL) and 7 (UPDATE PROCESS) of this phase run in the restarted session with `vb-tester` / `vb-update-process-agent`. Phase 7 entry requires that restart.

---

## Blast Radius

Tool and tests (all NEW, all in the protected set):
- `scripts/rename-prefix.mjs`, `scripts/test-rename-prefix.mjs` (fixture runner), `scripts/test-compute-sync-plan.mjs` (unit test of the updater hash gate), `scripts/rename-prefix.allowlist.txt` (content sweep allowlist), `scripts/rename-prefix.path-allowlist.txt` (path-name sweep allowlist), `scripts/fixtures/rename-prefix/{in,out}`.
- `legacy-hashes.json` (NEW, generated, read from the kit by the updater/installer; listed in the manifest `kitOnly`, NOT `include`, so it is never installed into user projects). Root `scripts/**` is also added to `kitOnly` (it is in neither list today).
- Hooks fallback test: `.claude/hooks/lib/__tests__/legacy-config-fallback.test.cjs` and `.codex/hooks/lib/__tests__/legacy-config-fallback.test.cjs` (NEW).
- Task-folder helpers (not in the protected `baseline/`): `$TF/harness/validators.vb.list`, `$TF/harness/compare-vb.sh`, `$TF/harness/signal-census-before.txt`, `$TF/harness/vc-colon-before.txt`, evidence pack.

Renamed and rewritten (the script is the only writer; hand edits are limited to the B-step fallback lines, tags and keep-markers, all committed BEFORE the apply):
- Directories `.claude/skills/vc-*` -> `vb-*`; agent files `.claude/agents/vc-*.md` -> `vb-*.md`; `.codex/agents/vc-*.toml` (`.codex/` has NO skill mirrors: only agents, config.toml, hooks, hooks.json; the phrase ".codex skill mirrors" is a no-op); `.claude/hooks/**` and `.codex/hooks/**` (including `lib/vc-config-utils.cjs` x2 and their 2 tests), `.claude/settings.json`
- `process/development-protocols/vc-system-behavior/` and `vc-autoresearch-spec.md`; all of `process/**` (including `process/_seeds`) except the excluded task folder
- Validators and their fixtures; `process/context/generated-skills-catalog.json` (regenerated, not hand-edited)
- Phase 5 additions are inside the rename set (sync 2026-10-30): the new `.claude/skills/vc-intent-clarify/references/*` files (names do not start with `vc-`; they move with the folder `vc-intent-clarify` -> `vb-intent-clarify`, and any `vc-` text Phase 5 moved into them from SKILL.md is swept like any other text, so `--dry-run` counts and the G7 scan list include them). `vc-update` was NOT split by Phase 5, so its installer coupling is unchanged.
- `.github/workflows/*.yml` (CI paths), `.github/ISSUE_TEMPLATE/**` and other `.github` templates, `CONTRIBUTING.md` + its 5 translations, `.gitignore` (keep-region, see A2), `docs/**` (including i18n), `README.md` + all i18n, `CLAUDE.md`, `AGENTS.md`, `export-benchmark-kit.mjs`
- Manifest chain renamed together in ONE apply (LOCKED Q4): `vc-manifest.json` -> `vb-manifest.json` with ALL its readers: `install.sh`, `resolve-manifest.mjs`, `compute-sync-plan.mjs`, vb-update / vb-publish / vb-setup skills, `export-benchmark-kit.mjs`, `e2e-kit-flows.test.mjs`, `CONTRIBUTING.md` (+ translations), `.github` templates
- `AGENTS.md` Skill Registry rows (hand edit B7, Phase 5 hand-off, committed at C2b BEFORE the apply): line 352 (`vc-generate-plan` drops `spec`) and line 372 (`vc-publish` `update remote` -> `publish to remote`); net -2 bytes (31,983 -> 31,981), G19 budget <= 32,768 kept; gate G21.
- Hooks that read user config at runtime (5 files in each of `.claude/hooks/lib` and `.codex/hooks/lib`): `privacy-checker.cjs`, `vc-config-utils.cjs` (-> `vb-config-utils.cjs`), `statusline-render-modes.cjs`, `statusline-section-registry.cjs` read `.vc.json`; `usage-limits-cache.cjs` reads `VC_USAGE_CACHE_PATH`. They get read-old/write-new fallbacks (B2). These config files are user-owned (the kit does not ship `.claude/.vc.json`), so without the fallback an existing user config would be silently ignored after the update.

Task-folder exclusion (sweep and protected set): `golden/` (frozen golden tasks), `eq` (the C-EQ equivalence harness and results), `baseline/` and `harness/` all live inside the protected task folder `$TF`, so the scan list, the SWEEP RULE and the rename script exclude them; they are never rewritten. The rename must also keep the Phase 1 documentation facts intact (7 opus / 8 sonnet, the research/plan/validate README rows, no cost-saving percentage); the Phase 1 claim grep (see Phase 4/7 Exit Gates) stays empty after the apply, with `vc-`/`vb-` path forms both accepted.

**Protected set (never rewritten; defined in ONE place, `PROTECTED` in the script, printable with `--print-protected`):**
1. Whole-path skips: the task folder `process/general-plans/active/vibebelt-rebrand_29-10-26/` (includes `baseline/`, `golden/`, `harness/`), `.git/`, `node_modules/`, `scripts/rename-prefix.mjs`, `scripts/test-rename-prefix.mjs`, `scripts/test-compute-sync-plan.mjs`, `scripts/fixtures/rename-prefix/**`, `scripts/rename-prefix.allowlist.txt`, `scripts/rename-prefix.path-allowlist.txt`, `legacy-hashes.json` (keys are old paths), `CHANGELOG.md` and `MIGRATION.md` (pure history of the original kit; DECISION: whole-file protection, not marker regions; Phase 8 adds the 1.0.0 entry by hand in `vb-` terms; Phase 6 makes no edit to `MIGRATION.md`: no banner, per umbrella C-CLEAN, the release notes live in `$TF`), `.agents/skills` when it is a text file on this checkout (its content is checked separately to hold no `vc-`).
2. JSON-aware skip: in any `*manifest.json`, the string values of the `legacyDeletions` array (line state machine: from the line containing `"legacyDeletions"` to its closing `]` line; formatting is preserved, no re-serialize).
3. Single-line tag: any line containing the token `legacy-vc-fallback` is skipped whole (the old-name fallback readers).
4. Keep-region: lines between a line containing `rename-prefix:keep:start` and a line containing `rename-prefix:keep:end` (markers inclusive) are skipped. Used for `.gitignore` (the `.vc-version`/`.vc-publish-config` lines; the Phase 0 A3c line `.claude/skills/vc-agent-browser/screenshots/` is deliberately OUTSIDE the keep-region so the sweep rewrites it to `.claude/skills/vb-agent-browser/screenshots/`), the e2e Trial C seed block (`e2e-kit-flows.test.mjs` lines 74-92) and the Trial C `vc-team`-removed assertion (lines 241-245). Without this, the assertion would be rewritten to `vb-team`, a path that never existed, and would pass vacuously.
5. Text-only guard: files with a NUL byte in the first 8000 bytes are skipped; symlinks are never followed (`lstat`).

Allowed to keep `vc-` / `VC-` / `VC_` after the apply (enumerated in the allowlist files, nothing else): the protected set above plus the tagged / keep-region lines (their files are listed in `scripts/rename-prefix.allowlist.txt`).

---

## Implementation Checklist

### Step P — Preflight (before any write)

- [ ] P1. Verify Entry Gate items 1-6 and record the output in the phase report.
- [ ] P2. The BEFORE author-metadata count is taken here: `grep -rIlE "^[[:space:]]*author: vibecode-pro-max-kit$" . --exclude-dir=.git --exclude-dir=vibebelt-rebrand_29-10-26 | LC_ALL=C sort > $H/author-before.txt`; assert `wc -l < $H/author-before.txt` is greater than 0 (expected 19 on the current tree; stop if 0 because that means the pattern is vacuous). The `vc:` colon-form census (X-COLON) and the signal census BEFORE are taken at C1 with `$SCAN` (the same file set G9/G10 use, so the two sides cannot drift), not here.
- [ ] P3. Start the destructive-write evidence pack with `vc-risk-evidence-pack` in `$H/` (artifacts per that skill; risk class: destructive writes — one tool edits about 270 files (all rules), renames about 104 paths, and the updater deletes files). Completed before the phase may be VERIFIED; it stays manual-first.

### Step A — Build the tool (test first)

- [ ] A1. Write fixtures under `scripts/fixtures/rename-prefix/in` with the expected tree in `.../out`, plus the runner `scripts/test-rename-prefix.mjs` (red first). They must also contain the lines `author: vibecode-pro-max-kit` (must change to `author: vibebelt-kit`) and `author: someone-else` (must NOT change). They must contain `vc-` in: file names, directory names, front-matter `name:`, markdown links, `Skill(vc-x)` invocations, JSON manifest paths, mermaid labels after a literal `\n` (`\nvc-update-process-agent`), an underscore-preceded token (`_vc-validate-agent`), `.vc-version` / `.vc-installed-files` / `.vc-publish-config`, `.vc.json`, the texts `vc plan check` and `vc plan uncheck` on ONE line, the four uppercase signals, bare `VC-` prose (`VC-system`), `VC_KIT_SOURCE`-style env vars, a `vc:plan` colon form and `VC harness` prose (both must NOT change), `my-custom-vc-tool` and `non-vc-` (must change), the false positive `dvc-` (must NOT change), a manifest with `legacyDeletions` values (must NOT change) next to other `vc-` strings in the same file (must change), a keep-region and a tagged `legacy-vc-fallback` line (must NOT change), a `CHANGELOG.md`/`MIGRATION.md` (whole-file protected, unchanged), a file with a NUL byte (skipped), a symlink pointing outside the root (target untouched), and an untracked file (dirty-tree refusal case). They must also contain a `.gitignore` holding the line `.claude/skills/vc-agent-browser/screenshots/` outside any keep-region (expected `.../out` line: `.claude/skills/vb-agent-browser/screenshots/`) and a gitignored, untracked file inside that directory (expected: it moves with the renamed directory, stays ignored and untracked).
- [ ] A2. Implement `scripts/rename-prefix.mjs` with these rules:
  - Modes: `--dry-run` (prints every path rename and per-file text-change counts; writes nothing; allowed on a dirty tree), `--apply`, `--root <dir>` (default repo root), `--list-scan-files` (R6-6: examines tracked plus untracked-not-ignored text files only and EXCLUDES gitignored paths such as `.claude/hooks/.logs/`, so G7/G9 counts do not drift; the signal count of 105 holds only without that log; the ignored screenshots directory still moves with its directory rename; prints, one per line, LC_ALL=C sorted, `/`-separated, every non-protected text file the apply would examine; used by ALL sweeps and censuses so the exclusion logic lives in one place), `--print-protected` (prints the protected set of the Blast Radius section).
  - CASE-SENSITIVE explicit rules only: `vc-` -> `vb-`, `VC-` -> `VB-`, `VC_` -> `VB_`, `.vc.json` -> `.vb.json`, `vc plan check` -> `vb plan check`, `vc plan uncheck` -> `vb plan uncheck`. PLUS the 7th explicit literal rule `author: vibecode-pro-max-kit` -> `author: vibebelt-kit` (full-line match, optional leading whitespace preserved; fixture in A1 includes an INDENTED `  author: vibecode-pro-max-kit` (changes) next to `  author: claudekit` and `  author: vibecode` (unchanged) and proves it, and that `author: someone-else` and prose mentions of `vibecode-pro-max-kit` elsewhere stay untouched). NOT a plain word-boundary rule: the preceding character is tested as ASCII `[A-Za-z0-9]`; a match is accepted when the preceder is NOT in that class (so `_`, `.`, `-`, `/`, `(`, backtick, quote, space, start of line are fine) OR the preceding two characters are the literal text `\n` (mermaid labels). Deny list: `dvc-` and any other ASCII-letter/digit-preceded `vc-`.
  - Last stdout line contract: `RESULT edits=<n> renames=<n>`; an idempotent second apply prints `RESULT edits=0 renames=0`.
  - Protection: implement the five mechanisms of the Blast Radius "Protected set" exactly (whole-path skips, JSON `legacyDeletions` line state machine, `legacy-vc-fallback` single-line tag, `rename-prefix:keep:start/end` regions, NUL-byte guard + `lstat`). One fixture proves each mechanism.
  - Safety: refuses to `--apply` on a dirty tree (non-zero exit, no writes) where dirty means `git status --porcelain -- . ':(exclude)<task folder>'` is non-empty (so reports written into the task folder do not block the apply); never follows symlinks (`lstat`); refuses any path that resolves outside `--root`.
  - Order: rewrite file CONTENTS first, then rename paths deepest first.
- [ ] A3. Fixture tests (`$NODE scripts/test-rename-prefix.mjs`, exit 0): dry-run on a copy writes nothing; apply on a copy then `diff -r` against `.../out` is empty; second apply prints `RESULT edits=0 renames=0`; dirty-tree and outside-root/symlink cases behave as above; each protection mechanism case and each stray-form row of the Purpose table behaves as decided; the four uppercase signals map to `VB-...` and the census maps 1:1; `--list-scan-files` never lists a task-folder, `.git`, protected or NUL-byte file; the screenshots fixture proves directory rename behaviour: the tool renames directories with a filesystem rename (not per-file `git mv`), so untracked and ignored files move with the directory; after apply `git check-ignore` on the moved file exits 0 against the rewritten `.gitignore` line, and `git status --porcelain` shows no new untracked screenshot file.

### Step B — Upgrade safety (build, then verify)

- [ ] B0. Resolver independence (only if Phase 2 did not land it): in `resolve-manifest.mjs` pick glob mode by shape (`Array.isArray(manifest.include)`); keep legacy mode only when `managed` exists; add a fixture test at version 1.0.0 asserting `files.length` equals the 3.2.5 count and is > 0.
- [ ] B1. Manifest rename in ONE apply (LOCKED Q4): `vc-manifest.json` -> `vb-manifest.json` is performed by the C3 apply; the HAND edits (committed before the apply, C2c) add the readers' fallbacks: every reader (`install.sh`, `resolve-manifest.mjs`, `compute-sync-plan.mjs`, vb-update / vb-publish / vb-setup skills, `export-benchmark-kit.mjs`, `e2e-kit-flows.test.mjs`) prefers `vb-manifest.json` and falls back to `vc-manifest.json`, the fallback line carrying the tag `legacy-vc-fallback`. Also add to the manifest `kitOnly`: `legacy-hashes.json` and `scripts/**` (they are read from the kit clone/temp dir, never installed into a project).
- [ ] B2. State files, env vars and hook readers (all fallback lines tagged `legacy-vc-fallback`, hand-written, committed before the apply): installer/updater read `.vb-installed-files` else `.vc-installed-files`, `.vb-version` else `.vc-version`, `.vb-publish-config` else `.vc-publish-config`, `.vb.json` else `.vc.json`; write only `.vb-*`; remove the `.vc-*` files after a successful sync. Env vars `VB_KIT_SOURCE`, `VB_UPDATE_TMPDIR`, `VB_INSTALL_TMPDIR`, `VB_USAGE_CACHE_PATH` are read first, old `VC_*` accepted as fallback (for example `${VB_KIT_SOURCE:-${VC_KIT_SOURCE:-}}`). Hooks, in BOTH `.claude/hooks/lib` and `.codex/hooks/lib` (5 files each: `privacy-checker.cjs`, `vc-config-utils.cjs`, `statusline-render-modes.cjs`, `statusline-section-registry.cjs`, `usage-limits-cache.cjs`): read `.vb.json` else `.vc.json` (keep the existing `.ck.json` chain; local `.claude/` and global `~/.claude/` lookups both) and `VB_USAGE_CACHE_PATH` else `VC_USAGE_CACHE_PATH`. New test `legacy-config-fallback.test.cjs` in each hooks `__tests__` dir: (a) old `.vc.json` alone is honored, (b) `.vb.json` wins when both exist, (c) `VC_USAGE_CACHE_PATH` is honored when `VB_` is unset. Every line naming an old name in that test carries the tag. `.gitignore` lists both name sets (inside a keep-region).
- [ ] B3. Legacy lists, generated not hand-written (never edit either by hand): from `git ls-tree -r upstream-baseline` generate (i) the old-name entries merged into `vb-manifest.json` `legacyDeletions` (covering `.claude/agents/vc-*`, `.claude/skills/vc-*`, `.codex/agents/vc-*.toml`, hook lib entries in BOTH trees: `.claude/hooks/lib/vc-config-utils.cjs`, `.claude/hooks/lib/__tests__/vc-config-utils.test.cjs`, `.codex/hooks/lib/vc-config-utils.cjs`, `.codex/hooks/lib/__tests__/vc-config-utils.test.cjs`, `process/development-protocols/vc-system-behavior/`, `vc-autoresearch-spec.md`), and (ii) `legacy-hashes.json` with TWO classes:
  - `hashed`: `{ "<old path>": "<sha256>" }` for every file of those entries present in the `upstream-baseline` tree (hash-gated).
  - `snapshotGated`: the pre-existing `legacyDeletions` entries that predate the baseline and have no file in its tree (11 skill dirs such as `.claude/skills/vc-team`, plus old protocol files). They have no sha256 and cannot be hashed; LOCKED rationale: each is "a directory of an old kit version" whose content the kit itself installed, so it is deleted only if EVERY file under it appears in the project's old install snapshot (`.vb-installed-files`, else `.vc-installed-files`); one file not in the snapshot (user-added) keeps the whole entry and reports it. Residual (named, backlog stub): a user EDIT to a file of such a directory is not detectable (no hash exists); accepted because the entries are deprecated for several versions.
- [ ] B4. Build the user-modified-file gate (it does not exist today), one shared helper used at ALL FOUR deletion sites: `compute-sync-plan.mjs` step 3 (stale removal from the prior snapshot), step 4 (the `legacyDeletions` loop, lines ~194-199), the `install.sh` "Apply legacyDeletions" block (the real `rm -rf "$legacy_path"`, lines ~337-380, line 365) and the `install.sh` stale-removal block (lines ~225-280). Rules: any path in the legacy `vc-` namespace is decided by the gate no matter which site reaches it (so widening `isKitOwned` / the `case` guard to the `vc-` namespace can never delete without a check): `hashed` path -> delete iff on-disk sha256 equals the entry, else "kept (modified)"; directory entry -> expanded per file, a file not in `hashed` (unknown content) -> "kept (unknown file)"; `snapshotGated` entry -> the snapshot rule of B3; no snapshot or no `legacy-hashes.json` (older kit source) -> keep + report. Empty directories are removed after their files. Make `isKitOwned` and the `install.sh` case guard accept BOTH namespaces for legacy entries. AC-5 predicate redefined (M6-2; hand edit of `e2e-kit-flows.test.mjs` lines ~267-277, tagged `legacy-vc-fallback`): an entry passes when it starts with one of the `isKitOwned` namespaces in BOTH `vc-`/`vb-` spellings (`.claude/skills/`, `.claude/agents/`, `.claude/hooks/`, `.codex/`, `process/development-protocols/`, `process/_seeds/`) or is exactly `process/general-plans/reports` or `process/general-plans/references`. Gate: G15b below runs a node.exe one-liner over the shipped manifest asserting 0 offenders under this predicate (6 offenders under the old predicate). Unit test FIRST (red): `scripts/test-compute-sync-plan.mjs` builds a temp tree (os.tmpdir) and runs `compute-sync-plan.mjs --root <seeded old install> --kit-root <new kit> --json` for these cases, asserting `toDelete` / `toPreserve` / `staleWarnings`: matching hash -> deleted; modified -> kept + reported; unknown file inside a hashed dir -> kept + reported; `snapshotGated` dir fully in the snapshot -> deleted; same dir with one extra user file -> kept; no snapshot -> kept. `scripts/test-compute-sync-plan.mjs` must be STANDALONE: it ships and CC6 runs it on the cleaned tree, so it must not import `scripts/rename-prefix.mjs` or anything under `scripts/fixtures/**` (both are removed at C0b); it builds its own temp fixtures inline. The install.sh block is exercised by Trial E.
- [ ] B5. Add e2e Trial E, test name EXACTLY `Trial E: old install to new install` (G15 counts it by that prefix): seed from `git archive upstream-baseline`, modify one old `vc-` skill file, add `my-skill` and `vc-custom`; run the new `install.sh`; assert unmodified old files removed, the modified one kept and reported, custom skills kept, state files migrated to `.vb-*`, no `vc-x` next to `vb-x` for unmodified files. Record the `.vb-version` value after the old-to-new install (feeds the Phase 8 release note). Add the keep-region markers to the Trial C seed block (74-92) and the `vc-team`-removed assertion (241-245); Trial C stays on `vc-` names and must stay green (AC-7).
- [ ] B6. Remaining hand edits, committed before the apply: `rename-prefix:keep` markers in `.gitignore` (and its new `.vb-*` lines; the A3c screenshots line stays outside the markers) and the `legacy-vc-fallback` tags of B1/B2. No `MIGRATION.md` edit (umbrella C-CLEAN: the banner and residual R4 are dropped; release notes live in `$TF`). Verify each cited line number with grep before editing (the numbers in this plan were checked 29-10-26 and may drift after Phases 1-5).
- [ ] B7. AGENTS.md Skill Registry hand-off from Phase 5 (hand edit, committed at C2b BEFORE the apply; verify the line numbers with `grep -n` first, they were 352 and 372 at HEAD 0d33214): line 352 `plan, PRD, spec, implementation plan` -> `plan, PRD, implementation plan`; line 372 `update remote` -> `publish to remote`. Net -2 bytes (31,983 -> 31,981). The apply then renames the rows to `vb-`; gate G21 checks them and G19 keeps the byte budget.

### Step C — Apply (tool committed first, then ONE rename commit)

- [ ] C1. Read-only passes on the real repo (allowed on a dirty tree): (a) BEFORE signal census into `$H/signal-census-before.txt`: `$SCAN | tr '\n' '\0' | xargs -0 grep -Ioh 'VC-[A-Z-]*' | LC_ALL=C sort | uniq -c` (105 hits for the four named signals = 43 + 40 + 13 + 9, plus stray `VC-` prose tokens; the gate is the 1:1 diff, not the number) and the same pipeline with `'VB-[A-Z-]*'` piped to `wc -l` must print 0 before; (a2) BEFORE colon census (X-COLON) with the same scan list: `$SCAN | tr '\n' '\0' | xargs -0 grep -Ioh 'vc:[a-z-]*' | LC_ALL=C sort | uniq -c > $H/vc-colon-before.txt` (23 hits today); (a3) BEFORE release.yml validator exit codes (see the bash block below) into `$H/release-validators-before.tsv`, one `rc<TAB>command` line per `run: node` line of `.github/workflows/release.yml`, the command already mapped `vc-` -> `vb-` for the after side; (b) `--dry-run`, full output saved to the phase report; review counts against the validate-contract numbers (about 5,092 `vc-` hits in 263 files, about 270 files edited by all rules, about 104 path renames (73 from upstream-baseline + 30 Phase 1 model-effort fixture agent files + 1 Phase 5 backlog note), scan list 567 files (565 + the 2 new hook tests of B2); all excluding the task folder); stop and investigate if they differ materially.

  ```bash
  # C1 (a3): baseline exit codes of every release.yml validator step (stdin closed so no step eats the loop input)
  grep -E '^[[:space:]]*run: node ' .github/workflows/release.yml | sed -E 's/^[[:space:]]*run: //' | while IFS= read -r c; do bash -c "$c" </dev/null >/dev/null 2>&1; rc=$?; printf '%s\t%s\n' "$rc" "$(printf '%s' "$c" | sed 's/vc-/vb-/g')"; done > $H/release-validators-before.tsv
  ```

- [ ] C1b. Trial apply on a throwaway copy to derive the allowlists: `S=$HOME/vb-sandbox/trial; rm -rf $S; mkdir -p $S; tar -c --exclude=.git . | tar -x -C $S; cd $S && git init -q && git add -A && git -c user.email=t@t -c user.name=t commit -qm trial && $NODE scripts/rename-prefix.mjs --apply`. Run the content sweep (Exit Gate G7 pattern list) and the path find (G5) in `$S`; their outputs ARE the candidate allowlists. Review every entry: each must be an intended residual (tagged fallback, keep-region or manifest legacy list); anything else is a rename-rule bug to fix before continuing. Delete `$S` afterwards. `--list-scan-files` must skip paths that no longer exist on disk (an applied but uncommitted sandbox still lists renamed tracked paths; R-w), so the sweep never fails with ENOENT.
- [ ] C2. Write the two allowlist files (content: one path per line; path-name: one path per line, exact, no regex) from the reviewed C1b output, LC_ALL=C sorted. They are in the protected set, so the apply never rewrites them.
- [ ] C2b. Commit the tool, fixtures, runners, allowlists, B-step edits, `legacy-hashes.json` as one commit `feat: add rename tool and upgrade safety`. Rerun the fixture tests and `test-compute-sync-plan.mjs` on this commit (exit 0). Stage by explicit file names (E11). `git add <dir>` silently skips gitignored fixture files (`.vc-version`, `.vc-publish-config`, `.vb-*`), so add those by name with `git add -f --` and assert `test "$(git ls-files scripts/fixtures | wc -l)" = "$(find scripts/fixtures -type f | wc -l)"` (E17). The symlink and untracked-file fixtures are created at run time inside the runner's temp copy, never committed.
- [ ] C2c. Record the rollback point of that commit (NO git tag; user standing rule: never tag without a fresh go-ahead): `git rev-parse HEAD > $H/pre-vb-rename.sha`. The tree is now clean (task-folder exclusion applies).
- [ ] C3. `--apply` from the clean `main` at the commit recorded in `$H/pre-vb-rename.sha` (E13 asserts `test "$(git rev-parse HEAD)" = "$(cat $H/pre-vb-rename.sha)"` before the apply); then regenerate `process/context/generated-skills-catalog.json` with the repo's generator (never by hand): `$NODE .claude/skills/vb-audit-context/scripts/generate-skills-catalog.mjs --write`, then `$NODE .claude/skills/vb-audit-context/scripts/generate-skills-catalog.mjs --check` must exit 0 (gate G22). A crashed or partial apply (M6-17): run the safe recovery block of the Rollback section as one Bash call (it is self-contained; never paste fragments) (never `git reset --hard`, never an unguarded `git clean -fd`; it keeps the 53 gitignored screenshots and uncommitted task-folder edits), then re-run from C1.
- [ ] C3b. Baseline mapping (the Phase 0 `baseline/` is protected; do not touch it): write `$H/validators.vb.list` by mapping ONLY the command column of `$B/validators.list` (labels unchanged): `awk -F'\t' 'BEGIN{OFS="\t"}{gsub(/vc-/,"vb-",$2);print}' $B/validators.list > $H/validators.vb.list`. Write `$H/compare-vb.sh` (body below): the temp copy MUST live INSIDE the repo (`compare.sh` does `cd "$D"` then `git rev-parse --show-toplevel`, so a copy outside the repo exits 2, reproduced): `X=$(mktemp -d "$H/.compare-vb.XXXXXX")`, copy `$B/.` into `$X`, replace `$X/validators.list` with `$H/validators.vb.list`, run `bash $X/compare.sh after_setup` (label-keyed against `validators_after_setup.tsv`), save `$X/validators.list` to `$H/compare-vb.used.list` and the run log to `$H/compare-vb.log`, then re-run `run-validators.sh` on the same list with output kept in `$H/compare-vb.run.txt` (the kept run log with `$ ` command headers; `compare.sh` deletes its own per-validator logs), `rm -rf $X`, return the exit code. Record the mapping command in the phase report. Also write `$H/runtime-map.txt` (`baseline_runtime=<runtime column of validators_after_setup.tsv> current_runtime=$NODE`); if they differ, record a same-runtime reference by running the validators once on a worktree of the commit in `$H/pre-vb-rename.sha` with the current `$NODE` into `$H/validators_pre_rename.tsv` and compare against that instead. Phases 7 and 8 reuse `compare-vb.sh`. PHASE 0 GUARANTEE this wrapper relies on (stated in Phase 0 B3 LOOKUP RULE): `compare.sh` resolves `validators.list`, `run-validators.sh` and the TSVs relative to ITS OWN directory (`dirname "$0"`) and only then `cd`s to the repo root to execute commands; `--map` stays available but is not what this wrapper needs. Proof the swapped list is really used (gate G18b): before deleting the temp dir the wrapper saves the list it ran to `$H/compare-vb.used.list` and the kept run log to `$H/compare-vb.run.txt`. Because `compare.sh` includes the Phase 0 LICENSE RULE (both LICENSE greps + original-line check), `compare-vb.sh` carries C-SAFE-2 too.

  ```bash
  #!/usr/bin/env bash
  # $H/compare-vb.sh — run the Phase 0 compare.sh on the vb- mapped validator list (copy kept inside the repo)
  set -u
  TF=process/general-plans/active/vibebelt-rebrand_29-10-26; H=$TF/harness; B=$TF/baseline
  cd "$(git rev-parse --show-toplevel)" || exit 2
  X=$(mktemp -d "$H/.compare-vb.XXXXXX") || exit 2
  trap 'rm -rf "$X"' EXIT
  cp -a "$B/." "$X/" && cp "$H/validators.vb.list" "$X/validators.list" || { rm -rf "$X"; exit 2; }
  bash "$X/compare.sh" after_setup > "$H/compare-vb.log" 2>&1; rc=$?
  cp "$X/validators.list" "$H/compare-vb.used.list"
  VALIDATORS_LIST="$X/validators.list" bash "$X/run-validators.sh" "$PWD/$H/compare-vb.run" >/dev/null 2>&1 || rc=2
  rm -rf "$X"
  exit $rc
  ```

- [ ] C4. Run the validator suite (the validator commands in `.github/workflows/release.yml`, now under `vb-` paths; read the count from the file at run time (`grep -c 'run: node' .github/workflows/release.yml`), do not hard-code it: after Phase 1 release.yml carries the same ~40 validator steps as validate.yml) through `bash $H/compare-vb.sh` (the 29-row baseline list only) AND gate G13c (re-runs EVERY `run: node` step of release.yml from `$H/release-validators-before.tsv` and diffs the exit codes; this covers the 22 release.yml validators that are not in `validators.list`), plus `e2e-kit-flows.test.mjs` (with Trial E), the hook tests (`legacy-config-fallback.test.cjs` x2, `vb-config-utils.test.cjs` x2) and `test-compute-sync-plan.mjs`.
- [ ] C5. Final sweeps (Exit Gate G1-G11): content grep against the allowlist, path-name find, directory counts, signal census after vs before mapped, X-COLON residual census, tagged-fallback check, resolver check.
- [ ] C5b. Pointer regression with the Phase 4 tool (its inputs are read from the tree at run time, so it can be re-run after the rename): at C1 (before `--apply`) run `$NODE $TF/p4-tools/pointer-check.mjs --out $H/p6-pointers-before.txt`; the after-pass (`--out $H/p6-pointers-after.txt`) is taken by G20 itself, after the C6 commit (the tool reads `git ls-files`, so an uncommitted tree under-scans; G20 guards this: clean tree -> no output, dirty tree prints `G20 SETUP FAILED`); G20 must print nothing: no NEW broken pointer. Both sides drop the files that cite old `vc-` paths BY DESIGN, as CITING files, with one ERE: `G20X="^(MIGRATION\.md|CHANGELOG\.md|legacy-hashes\.json|v\?-manifest\.json|scripts/[^[:space:]]*)$(printf '\t')"` and `grep -vE "$G20X"` (M6-16): the whole-file protected history files (e.g. `MIGRATION.md` -> `process/development-protocols/vc-autoresearch-spec.md`), `legacy-hashes.json` (18 rows of old protocol keys), the manifest (`legacyDeletions` entry `vc-autoresearch-spec.md`; keys are prefix-neutral, hence `v?-manifest.json`) and `scripts/**` fixtures citing protocol paths. Tested: clean tree after C6 prints nothing; an injected new broken pointer in `README.md` is printed; a dirty tree prints `G20 SETUP FAILED`. A new broken pointer INSIDE those excluded files is not caught (accepted). If the tool turns out to hard-code a `vc-` path, record that in the report and fix the gate wording, not the Phase 4 tool.
- [ ] C6. Complete the evidence pack in `$H/`. Commit as ONE commit `refactor: rename vc- prefix to vb-` directly on `main`, staged by the EXPLICIT file list of contract E11 (never `git add -A`, user standing rule): `git ls-files -z --modified --deleted --others --exclude-standard -- . ':(exclude)process/general-plans/active/vibebelt-rebrand_29-10-26' | LC_ALL=C sort -zu | xargs -0 git add --`, then `git diff --cached --name-only | grep -c vibebelt-rebrand_29-10-26` must print 0, so task-folder process files (evidence pack, phase report, harness) stay OUT of the execution commit (umbrella: process commits separate); they go into the UPDATE PROCESS commit. It is the LAST execution commit of the phase, so G17 (`git log -1`) holds at EVL.
- [ ] C7. RESTART CHECKPOINT: stop and ask the user to restart Claude Code in this repo so `vb-*` agents and skills resolve; then run EVL and UPDATE PROCESS from the new session. (Agent-Probe row below.)

### Rollback

- Before the rename commit: run the safe recovery block below (moves the ignored screenshots back first, restores tracked files from HEAD outside the task folder, previews `git clean` and STOPS if anything other than a `vb-` path would be removed), then re-run from C1. Agents never run `git reset --hard` or an unguarded `git clean -fd`; any other rollback is the USER's decision.
  ```bash
  # safe pre-commit crash recovery (self-contained, fail-closed; agents never run `git reset --hard` or an unguarded `git clean -fd`)
  cd "$(git rev-parse --show-toplevel)" || exit 1
  TF=process/general-plans/active/vibebelt-rebrand_29-10-26; H=$TF/harness; TFX=":(exclude)$TF"
  if [ -d .claude/skills/vb-agent-browser/screenshots ]; then
    [ ! -e .claude/skills/vc-agent-browser/screenshots ] || { echo "RECOVERY STOP: both screenshot dirs exist"; exit 1; }
    mkdir -p .claude/skills/vc-agent-browser && mv .claude/skills/vb-agent-browser/screenshots .claude/skills/vc-agent-browser/ || exit 1
  fi
  git restore --source=HEAD --staged --worktree -- . "$TFX" || exit 1
  git clean -nd -- . "$TFX" > "$H/recover-preview.txt" || { echo "RECOVERY STOP: preview failed"; exit 1; }
  grep -v '^Would remove .*vb-' "$H/recover-preview.txt"; rc=$?
  [ "$rc" -eq 1 ] || { echo "RECOVERY STOP: unexpected untracked paths or unreadable preview"; exit 1; }
  git clean -fd -- . "$TFX"
  ```
- After the rename commit but before any push: the USER decides the rollback; agents never run `git reset --hard` here: show the SHA in `$H/pre-vb-rename.sha` (the tool commit, so the tool survives) and offer `git revert <rename-commit>`; delete the sandboxes. After a push or release: `git revert` the single commit (no history rewrite, no force-push). `$H/pre-vb-rename.sha` stays until Phase 8 completes. The only tag in the program is Phase 8's final local `v1.0.0`, with its own explicit go-ahead.

---

## Exit Gate

`$NODE` is Linux Node >= 22 (WSL). All commands run from the repo root after the apply commit, with the path variables of the Entry Gate (`TF`, `H`, `B`, `SCAN`). Expected values are mechanical. `grep -c` exits 1 when the count is 0, so counts are compared with `test`, never by exit code.

```bash
export NODE=${NODE:-node}; TF=process/general-plans/active/vibebelt-rebrand_29-10-26; H=$TF/harness; B=$TF/baseline
SCAN="$NODE scripts/rename-prefix.mjs --list-scan-files"
$NODE scripts/rename-prefix.mjs --dry-run | tail -1                          # G0  Expected: RESULT edits=0 renames=0 (idempotent)
test "$(ls .claude/skills | grep -c '^vc-')" = 0 && test "$(ls .claude/agents | grep -c '^vc-')" = 0 && test "$(ls .codex/agents | grep -c '^vc-')" = 0; echo $?   # G1  Expected: 0
test -f vb-manifest.json && test ! -f vc-manifest.json; echo $?              # G2  Expected: 0
$NODE scripts/test-rename-prefix.mjs; echo $?                                 # G3  Expected: 0 (fixtures: rules, protection mechanisms, stray forms, safety)
$NODE scripts/test-compute-sync-plan.mjs; echo $?                             # G4  Expected: 0 (hash gate: matching deleted; modified/unknown/no-snapshot kept and reported)
find . \( -path ./.git -o -path ./$TF \) -prune -o \( -name 'vc-*' -o -name '.vc-*' -o -name '.vc.json' \) -print | LC_ALL=C sort | diff - <(LC_ALL=C sort scripts/rename-prefix.path-allowlist.txt)   # G5  Expected: empty diff (exact list, no regex)
test "$($SCAN | grep -c 'vibebelt-rebrand_29-10-26')" = 0; echo $?            # G6  Expected: 0 (the sweep never enumerates task-folder files)
$SCAN | tr '\n' '\0' | xargs -0 grep -Il -e 'vc-' -e 'VC-' -e 'VC_' -e '\.vc\.json' -e 'vc plan check' -e 'vc plan uncheck' | LC_ALL=C sort | diff - <(LC_ALL=C sort scripts/rename-prefix.allowlist.txt)   # G7  Expected: empty diff (single-file allowlist; protected files are not scanned)
test "$(grep -n 'vc-\|VC_\|\.vc\.json' install.sh compute-sync-plan.mjs resolve-manifest.mjs .claude/hooks/lib/{privacy-checker,statusline-render-modes,statusline-section-registry,usage-limits-cache,vb-config-utils}.cjs .codex/hooks/lib/{privacy-checker,statusline-render-modes,statusline-section-registry,usage-limits-cache,vb-config-utils}.cjs .claude/skills/vb-update/SKILL.md .claude/skills/vb-publish/SKILL.md | grep -vc 'legacy-vc-fallback')" = 0; echo $?   # G8  Expected: 0 (only tagged lines keep old names in the readers)
$SCAN | tr '\n' '\0' | xargs -0 grep -Ioh 'VB-[A-Z-]*' | LC_ALL=C sort | uniq -c | diff - <(sed 's/VC-/VB-/' $H/signal-census-before.txt)   # G9  Expected: empty diff (105 named-signal hits + stray prose tokens, byte-identical apart from the prefix)
$SCAN | tr '\n' '\0' | xargs -0 grep -Ioh 'vc:[a-z-]*' | LC_ALL=C sort | uniq -c | diff - $H/vc-colon-before.txt   # G10 Expected: empty diff (the kept `vc:*` colon forms are unchanged)
$NODE resolve-manifest.mjs --root . --json | $NODE -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const f=JSON.parse(s).files;const bad=f.filter(x=>/^(scripts[\\\\/]|legacy-hashes\.json$)/.test(x)).length;process.exit(f.length>0&&bad===0?0:1)})"; echo $?   # G11 Expected: exit 0, 418 shipped files today (whole-output accumulate parse, ~76 KB; files > 0 at version 1.0.0; legacy-hashes.json and scripts/** are not installed)
$NODE .claude/hooks/lib/__tests__/legacy-config-fallback.test.cjs && $NODE .codex/hooks/lib/__tests__/legacy-config-fallback.test.cjs; echo $?   # G12 Expected: 0 (old `.vc.json` and VC_USAGE_CACHE_PATH still honored)
bash $H/compare-vb.sh; echo $?                                                # G13 Expected: 0 (all validators of the 29-row list NOT WORSE than baseline via the vb- mapped list; label-keyed; compare-vb.sh runs the Phase 0 compare.sh from a temp copy INSIDE the repo, so this includes the LICENSE greps)
diff <(cut -f2 $H/release-validators-before.tsv) <(grep -E '^[[:space:]]*run: node ' .github/workflows/release.yml | sed -E 's/^[[:space:]]*run: //') && cut -f2 $H/release-validators-before.tsv | while IFS= read -r c; do bash -c "$c" </dev/null >/dev/null 2>&1; rc=$?; printf '%s\t%s\n' "$rc" "$c"; done | diff $H/release-validators-before.tsv -   # G13c Expected: no output (same release.yml step list after mapping; every exit code unchanged; today 20x0 + 2x1 [validate-eval-coverage, validate-risk-artifacts red at baseline] among the 22 not in validators.list)
$NODE .claude/skills/vb-audit-vc/scripts/validate-agent-parity.mjs; echo $?   # G14 Expected: 0
$NODE --test --test-name-pattern 'Trial [ABCE]' e2e-kit-flows.test.mjs > $H/g15.tap 2>&1; echo "$? $(grep -cE '^ok [0-9]+ - Trial [ABCE]:' $H/g15.tap)"   # G15 Expected (Linux Node): `0 4` (Trials A, B, C after B4, E pass; the count proves Trial E ran; today prints `1 2`). Trial D (publish-flow clone) is baseline-red on this host (cross-device `git clone --local`) and is Phase 8 A0's to fix: record its line separately with `--test-name-pattern 'Trial D'`, not worse than baseline, NOT required green here. NOT TESTED + CONDITIONAL only if the shell lacks Linux Node
$NODE -e "const m=require('./vb-manifest.json'),ok=e=>/^(\.claude\/(skills|agents|hooks)\/|\.codex\/|process\/development-protocols\/|process\/_seeds\/)/.test(e)||e==='process/general-plans/reports'||e==='process/general-plans/references';const bad=m.legacyDeletions.filter(e=>!ok(e));console.log(bad.length);process.exit(bad.length?1:0)"   # G15b Expected: 0 (AC-5 predicate offenders; adjust the manifest path to the real file)
test "$(grep -c "vb-" $H/compare-vb.used.list)" -gt 0 && test "$(grep -c "vc-" $H/compare-vb.used.list)" = 0 && test "$(grep '^\$ ' $H/compare-vb.run.txt | grep -c '/vc-')" = 0 && test "$(grep '^\$ ' $H/compare-vb.run.txt | grep -c '/vb-')" -gt 0; echo $?   # G18b Expected: 0 (the swapped list was used: vb- command paths, zero vc- in the list and in the log COMMAND HEADER lines `$ ...`; output lines legitimately print legacyDeletions/ownedPaths with /vc-; measured 0 and 26 on compare-vb.run.txt)
grep -c "Copyright (c) 2026 vibecode" LICENSE; grep -c "Copyright (c) 2026 Tomwakeupat530amm" LICENSE   # G13b Expected: 1 and 1 (also enforced inside compare-vb.sh via the Phase 0 LICENSE RULE; G13 exit 0 includes it)
AP='^[[:space:]]*author: vibecode-pro-max-kit$'; AN='^[[:space:]]*author: vibebelt-kit$'; test "$(wc -l < $H/author-before.txt)" -gt 0 && test "$(grep -rIlE "$AP" . --exclude-dir=.git --exclude-dir=fixtures --exclude-dir=vibebelt-rebrand_29-10-26 | wc -l)" = 0 && test "$(grep -rIlE "$AN" . --exclude-dir=.git --exclude-dir=fixtures --exclude-dir=vibebelt-rebrand_29-10-26 | wc -l)" = "$(wc -l < $H/author-before.txt)"; echo $?   # G18 Expected: 0 (before-count > 0, expected 19; old text 0 after; new count equals before count)   # M6-3: both AFTER greps exclude `fixtures` (the protected scripts/fixtures/rename-prefix tree that deliberately holds both author spellings); the BEFORE-count in P2 is unaffected
test "$(wc -c < AGENTS.md)" -le 32768; echo $?                              # G19 Expected: 0 (AGENTS.md byte budget kept; vc- -> vb- is length-neutral)
G20X="^(MIGRATION\.md|CHANGELOG\.md|legacy-hashes\.json|v\?-manifest\.json|scripts/[^[:space:]]*)$(printf '\t')"; { test -z "$(git status --porcelain -- . ":(exclude)$TF")" && $NODE $TF/p4-tools/pointer-check.mjs --out $H/p6-pointers-after.txt >/dev/null || echo "G20 SETUP FAILED"; }; LC_ALL=C comm -13 <(sed 's/vc-/vb-/g' $H/p6-pointers-before.txt | grep -vE "$G20X" | LC_ALL=C sort) <(grep -vE "$G20X" $H/p6-pointers-after.txt | LC_ALL=C sort)   # G20 Expected: no output (no NEW broken pointer; citing files that keep old paths by design are dropped on both sides: MIGRATION.md, CHANGELOG.md, legacy-hashes.json, the manifest, scripts/**)
test "$(grep -c '^| `vb-publish` .*publish to remote' AGENTS.md)" = 1 && test "$(grep '^| `vb-generate-plan`' AGENTS.md | grep -c spec)" = 0; echo $?   # G21 Expected: 0 (AGENTS.md registry rows match the catalog after B7 + apply)
$NODE .claude/skills/vb-audit-context/scripts/generate-skills-catalog.mjs --check; echo $?   # G22 Expected: 0 (catalog regenerated after the apply)
git diff --check                                                              # G16 Expected: no output
git log --oneline -1                                                          # G17 Expected: refactor: rename vc- prefix to vb-
```

Notes: G7/G9/G10 use the scan list, which excludes the task folder, `.git`, protected files and binaries by construction (G6 proves it), so files created later (harness, iteration reports) cannot break the EVL re-run; `LC_ALL=C` fixes the sort order. The G11 command uses the accumulate-until-`end` form because `resolve-manifest --json` is about 76 KB, larger than one pipe chunk: a single-chunk `JSON.parse` fails with `Unterminated string in JSON` (reproduced).

- Evidence pack artifacts present in `harness/` (destructive-write risk class).
- Restart checkpoint recorded in the phase report; EVL ran from the restarted session.

---

## Blockers That Would Justify BLOCKED Status

- A runtime reference to `vc-` is computed (string concatenation) so the script cannot see it (dry-run review and sweep must show none).
- Upgrader cannot tell kit-owned from user-modified files (do not ship; B4 must pass first).
- Claude Code or Codex resolves agent/skill names by something the rename breaks (the restart-checkpoint probe; if found earlier, stop).

---

## Phase Completion Rules

- CODE DONE = checklist items done; VERIFIED = Exit Gate commands pass AND full validator suite is not worse than the Phase 0 baseline AND regression checkpoint passes AND validate-contract exists.
- Known-Gap alone never makes a behavior PASS; write a backlog stub and keep that gate CONDITIONAL.

## Acceptance Criteria

- C-P6-a deterministic tool: dry-run writes nothing, apply matches the expected tree, second apply is a no-op. proven by: fixture test A3. strategy: Fully-Automated
- C-P6-b safe tool: refuses dirty tree, never follows symlinks or leaves the root. proven by: fixture safety cases. strategy: Fully-Automated
- C-P6-c resolver independent of manifest version. proven by: resolve-manifest --json at 1.0.0 gate. strategy: Fully-Automated
- C-P6-d signals and env names mapped atomically, none lost. proven by: signal census gate. strategy: Fully-Automated
- C-P6-e all validators not worse than baseline; no stray prefix. proven by: validator suite and allowlist sweep. strategy: Fully-Automated
- C-P6 + C-SAFE-1 upgraders cleaned, user content safe, state migrated. proven by: Trial E old-to-new upgrader. strategy: Hybrid
- C-P6-f install/update flows still work: e2e Trials A, B, E pass and Trial C passes after B4 (AC-5); Trial D (publish-flow `git clone --local` across `/mnt/c` and tmpfs) is carved out: baseline-red, fixed in Phase 8 A0, must not get worse. proven by: e2e-kit-flows (G15, Linux Node), G15b. strategy: Hybrid
- C-P6-g fresh session resolves renamed agents. proven by: restart-checkpoint probe. strategy: Agent-Probe
- C-P6-h hook config and env fallbacks: an existing `.vc.json` and `VC_USAGE_CACHE_PATH` are still honored after the rename. proven by: Exit Gate G12 (`legacy-config-fallback.test.cjs` x2). strategy: Fully-Automated
- C-P6-i updater hash gate at the code level: matching legacy file deleted; modified, unknown and no-snapshot cases kept and reported; Trial C (v2.x `vc-team`) still cleaned. proven by: `scripts/test-compute-sync-plan.mjs` (G4) + Trial C/E (G15). strategy: Fully-Automated (G4), Hybrid (G15)
- C-P6-j stray forms decided and proven: `vc plan uncheck` renamed, `vc:*` colon forms unchanged, protection mechanisms work. proven by: G3 fixtures + G10 colon census. strategy: Fully-Automated

## Touchpoints

- Essentially every file in the kit; the script is the single writer. See Blast Radius for the enumerated list.

---

## Public Contracts

- Slash/skill/agent names change by design (`vc-` -> `vb-`); old names are cleaned on update through `legacyDeletions`, only when byte-identical to the shipped baseline hashes (`hashed` class) or, for deprecated directories that predate the baseline, only when every file is in the old install snapshot (`snapshotGated` class); otherwise kept and reported.
- The four uppercase signal strings DO change (`VC-...` -> `VB-...`) in every emitter and every orchestrator matcher together; every other signal (`PHASE_COMPLETE:` family) is unchanged. The census proves a 1:1 mapping.
- Env vars `VB_*` are the new names; the old `VC_*` names are still read as fallbacks. State files `.vb-*` and `vb-manifest.json` are the new names; the old ones are still read and then migrated. Manifest schema unchanged.

---

## Verification Evidence

| Gate / Scenario | Strategy | Proves SPEC criterion |
|---|---|---|
| Fixture test: dry-run, apply, idempotent re-run (incl. `\nvc-`, `_vc-`, state files, `dvc-`) | Fully-Automated | C-P6-a: deterministic, idempotent, dry-run capable |
| Fixture safety: dirty tree refused, symlink untouched, outside-root refused | Fully-Automated | C-P6-b: safe tool |
| `resolve-manifest --json` at version 1.0.0 returns files.length > 0 | Fully-Automated | C-P6-c: resolver independent of version |
| Signal census before/after (VC- -> VB- mapped, 105 hits) | Fully-Automated | C-P6-d: signals intact |
| Full validator suite (every validator step in release.yml; count read from the file) no worse than `baseline/` under `vb-` paths | Fully-Automated | C-P6-e: all validators green |
| Content grep and path find against allowlist files; directory counts; tagged-fallback check | Fully-Automated | C-P6-e: no stray prefix |
| Trial E: upgrader from `upstream-baseline` install (modified file kept, unmodified removed, custom kept, state migrated) | Hybrid (Linux Node >= 22; Linux-filesystem sandbox) | C-P6 + C-SAFE-1: upgraders cleaned, user content safe |
| `node e2e-kit-flows.test.mjs` (Linux Node): Trials A, B, E pass, Trial C passes after B4; Trial D carved out (baseline-red cross-device clone, Phase 8 A0) | Hybrid (Linux Node >= 22) | C-P6-f: install/update flows still work (A, B, C, E) |
| Fresh session spawns `vb-research-agent` and invokes `vb-context-discovery` | Agent-Probe (after the restart checkpoint) | C-P6-g: renamed agents resolvable |
| `vc-risk-evidence-pack` artifacts in `harness/` | Hybrid (manual-first review) | C-P6 + C-SAFE-1: destructive-write evidence |
| `scripts/test-compute-sync-plan.mjs`: matching hash deleted; modified / unknown file / no snapshot kept and reported; snapshot-gated dir deleted only when fully in the snapshot | Fully-Automated | C-P6-i: updater hash gate (G4) |
| `legacy-config-fallback.test.cjs` in `.claude` and `.codex` hooks (old `.vc.json` and `VC_USAGE_CACHE_PATH` still honored; `.vb.json` wins) | Fully-Automated | C-P6-h: hook fallbacks (G12) |
| `vc:*` colon-form census before/after equal; stray-form fixtures | Fully-Automated | C-P6-j: stray forms decided and proven (G3, G10) |
| `bash harness/compare-vb.sh` (label-keyed, vb- mapped list) | Fully-Automated | C-P6-e: validators not worse than baseline (G13) |
| G13c: every `run: node` step of release.yml re-run after the apply, exit codes diffed against `$H/release-validators-before.tsv` (covers the 22 validators not in `validators.list`) | Fully-Automated | C-P6-e: validators not worse than baseline (G13c) |
| G21: AGENTS.md registry rows (`vb-publish` `publish to remote`; `vb-generate-plan` without `spec`) + G19 byte budget | Fully-Automated | C-P6-reg: registry matches the catalog (G21, G19) |
| G22: `generate-skills-catalog.mjs --check` after the apply | Fully-Automated | C-P6-e: catalog current (G22) |

---

## Phase Loop Progress

Orchestrator reads this before deciding which subagent to spawn next. The canonical 7-step inner loop
`R → I → P → PVL → E → EVL → UP` SKIPS SPEC (the umbrella plan and the user brief act as the SPEC).

- [x] 1. RESEARCH — vc-research-agent (opus, front-matter): prior phase reports read; test context loaded; plan drift checked (done 30-10-26: done)
- [x] 2. INNOVATE — innovate-agent (sonnet): approach decided; Decision Summary written (done 30-10-26: done)
- [x] 3. PLAN-SUPPLEMENT — vc-plan-agent (opus, front-matter): existing phase plan updated; Inner Loop Refresh Note if sections changed (or "n/a — research clean") (done 30-10-26: done)
- [x] 4. PVL — vc-validate-agent (opus, front-matter): full V1-V7; validate-contract written per `.claude/skills/vc-validate-findings/references/example-validate-output.md` (done 30-10-26: 4 passes; last fix applied without V1 re-run by user decision; CONDITIONAL accepted)
- [x] 5. EXECUTE — vc-execute-agent (opus): all checklist items done; per-section test gates run and green (or gaps documented); ends at the rename commit + restart checkpoint (done 30-10-26: commits 11b19c2 and 1e86c12)
- [x] 6. EVL — vc-tester (vb-tester after the restart): all EVL gates green; follow-up stubs registered; EVL HANDOFF SUMMARY written (done 30-10-26: independent vb-tester PASS, closeout WITH_GAPS)
- [x] 7. UPDATE PROCESS — vc-update-process-agent (vb-update-process-agent after the restart; sonnet): phase report written, umbrella state updated, commit done on main (done 30-10-26: report written; umbrella updated; process commit made)

**Validate-contract required.** If step 4 (PVL) is unchecked or `## Validate Contract` reads
"(placeholder — vc-validate-agent writes this section before EXECUTE)", the orchestrator must spawn
vc-validate-agent first. A partial contract (missing Plan updates applied / Execute-agent
instructions / Test gates) is treated as a placeholder.

---

## Test Infra Improvement Notes

- Linux Node v22.23.4 is installed (`/home/tom/.local/bin/node`): Hybrid gates (Trial E, e2e) are runnable; NOT TESTED / CONDITIONAL with a backlog stub only if the execute agent's shell lacks `node`.
- Measured e2e baseline on Linux node is 2 of 4: Trials A and B pass, Trial C fails on AC-5 (fixed by B4), Trial D fails on the cross-device `git clone --local` (fixed in Phase 8 A0). Via `node.exe` the file fails on Windows path handling (Phase 8 A0 edits 1-3); a Windows-path-safe runner stays a backlog candidate.
- `.agents/skills` is a text file on this checkout (baseline red); a symlink-safe checkout note belongs in the Phase 0 baseline.

---

## Phase 6 UPDATE PROCESS Hand-off

Phase 6 UPDATE PROCESS (step 7, restarted session) MUST do:
- [x] U1. Rewrite the rename-talk lines that become nonsense after the sweep ("prefix `vb-` becomes `vb-`"): `process/context/all-context.md` lines ~25 and ~168, `process/context/planning/all-planning.md` lines ~11 and ~57 (grep for `becomes` first; state the rename as done).
- [x] U2. Record in the phase report that `vb-system-behavior/12-reference.md` Removed Skills / merged-skill history now shows cosmetic `vb-` names that never existed (vc-team, vc-tech-graph, ...); kept by design.
- [x] U3. Document the named residuals: `.vibecode-backup/`, the `.vibecode-backup*/` gitignore guard and `CLAUDE.md.pre-vibecode` (runtime names no rule matches, KEPT by design: renaming moves where users find backups and needs its own migration); `VC harness` prose, `vcTeamDir`, `hasVcSkills`, `vc:*` colon forms.
- [x] U4. Phase 8 note: `gen-guardrails.mjs` hashes raw text, so the OLD side of the B4.6(d) guardrail identity needs a rename-mapped OLD tree.
- [x] U5. Update the `vc-` name of the renamed backlog note `vb-agent-browser-screenshots-untrack_NOTE_29-10-26.md` where the umbrella, registry and Phase 5 report cite it.
- [x] U6. Flag to the umbrella owner: umbrella DoD 3 ("grep vc- finds only legacyDeletions and changelog history") is narrower than the designed residual set (`legacy-hashes.json` keys, `legacy-vc-fallback` lines, keep-regions incl. `.gitignore` and e2e Trial C), and the allowlist files are deleted at C0b; align DoD 3 / Phase 8 wording.
- [x] U7. Phase 8 runs without the B4 quality-equivalence run (user decision 2026-10-30, quota); C-EQ unmeasured is a named known-gap in the Phase 8 report and release notes.
- [x] U8. Carry residuals: R-aa (run P2 BEFORE the A1 fixtures exist: after them it counts 20 not 19 and G18 goes red), R-ab (guard `rm -rf ${R:?}` / `${S:?}`), R-ac (variables do not persist between Bash calls: each gate/step block must set its own variables), R-ad (the recovery guard treats any untracked path containing `vb-` as apply output).


## Resume and Execution Handoff

- Selected plan file path: `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-06-prefix-rename_PLAN_29-10-26.md`
- Last completed step: step 7 UPDATE PROCESS (report phase-06-prefix-rename_REPORT_30-10-26.md written, process commit made, 30-10-26)
- Validate-contract status: written; inner PVL pass 2 CONDITIONAL (30-10-26); supplement then re-validate from V1 before EXECUTE
- Supporting context files: umbrella plan, `phase-blast-radius-registry.md`, prior phase report (if any), Phase 3 `golden/signal-census.mjs`
- Next step: re-run PVL (vc-validate-agent) from V1 on this plan; then vc-execute-agent (opus) only after a passing or accepted-CONDITIONAL inner contract. Registry/umbrella changes requested of the orchestrator are listed in the supplement sections below. Before Phase 7: Claude Code restart.

---

## Validate Contract

Status: CONDITIONAL
Date: 30-10-26
date: 2026-10-30
generated-by: inner-pvl: phase-6
supersedes: 2026-10-30 (inner-pvl: phase-6, pass 3 CONDITIONAL, MUST-FIX M6-16, M6-17) — inner PVL pass 4 has current evidence. This contract REPLACES the pass-3 section entirely. Pass 4 runs after 3 recorded supplement cycles (`## Supplement (inner PVL pass 1/2/3, 30-10-26)`). Verdict: M6-16, M6-17 and residuals R-v, R-w, R-x, R-z are closed by measurement; 1 new MUST-FIX (M6-18) was found in the cycle-3 recovery block by running it the way an agent runs it (a fresh shell). EXECUTE is NOT legal on this contract: one more supplement cycle, then PVL re-runs from V1.

Parallel strategy: sequential
Rationale: signals S1, S2, S4, S6, S7 = 5/7 (HIGH label), dominant signal S6 (destructive updater/installer writes). Sequential still fits EXECUTE: one deterministic script over a closed file set; fan-out adds risk. Models: named agents on their own front-matter (execute, tester, plan, validate = opus; git-manager, update-process = sonnet). This PVL ran Layer 1 and Layer 2 inline and sequentially in one validate agent; every finding below comes from commands run on fresh scratch clones of HEAD 0d33214 with the current uncommitted plan copied in (`pvl4-1793344449-sim`, `-trial`, `-crash`, `-crashB`, `-crashM`, `-crashH`, `-crashT2` under the session scratchpad). The real repo was not modified except this section.

Evidence gathered (30-10-26, Linux node v22.23.4):
- Structure: `validate-plan-artifact.mjs` exit 0, 0 failures, 2 legacy-shape warnings. All 6 fenced bash blocks of the plan (incl. the cycle-3 recovery block) pass `bash -n`. The PASS-gate string count on this plan was 0 before this contract was written; this contract keeps it at 0.
- Simulated flow, in plan order, on a fresh clone with the 53 gitignored screenshots copied in. Stand-ins (NOT the real tools): the pass-3 simulator with two additions the plan now requires (marker keep-regions; skip paths missing on disk, R-w), the pass-3 B3 generator (69 entries; 340 `hashed` + 20 `snapshotGated`), the B4 AC-5 predicate edit, a B5 Trial E stub, B7, B6 `.gitignore` (keep-region around `.vc-version`/`.vc-publish-config`, new `.vb-*` lines, screenshots line outside), stub G3/G4/G12 runners, a fixture tree with 4 gitignored fixture files (`in/.vc-version`, `in/.vc-publish-config`, `out/.vb-version`, `out/.vb-publish-config`). Results: P2 19; C1 (a) 105 named signals + 9 bare `VC-` + `VC-S` + `VC-PREDICT`, `VB-` 0; (a2) 23; (a3) 38 steps = 36 x 0 + 2 x 1; C5b before 178; dry run `RESULT edits=270 renames=104`; scan list 567.
- C1b on an applied but NOT committed sandbox (R-w): no ENOENT; path allowlist = 3 fixture paths, content allowlist = 2 hook tests, `.gitignore`, `e2e-kit-flows.test.mjs`, `vb-manifest.json`.
- C2b (R-x, E17): explicit `git add --` left the fixture tree at 2 tracked / 6 on disk (count check red, rc 1); after `git add -f --` of the 4 ignored fixtures 6 / 6 (rc 0). 0 task-folder files staged. Fixture runners exit 0 on the commit.
- C2c SHA file written; C3 E13 assert rc 0 (R-v); apply 270/104; catalog `--write` then `--check` 0; screenshots moved to `vb-agent-browser/screenshots/` (53) and still ignored.
- C6 (E11): 473 staged, 0 task-folder, 0 `^scripts/` (pass 3: 474 incl. one un-ignored fixture; R-x closed).
- Exit Gate block verbatim on the committed simulated apply: G0 `RESULT edits=0 renames=0`; G1 0; G2 0; G3 0 (stub); G4 0 (stub); G5 empty; G6 0; G7 empty; G8 0; G9 empty; G10 empty; G11 0; G12 0 (stub); G13 0 (`OK: nothing worse`, 29 headers, 26 `/vb-`, no `.compare-vb.*` left); G13c no output; G14 0; G15 `0 4`; G15b 0; G18b 0; G13b 1 and 1; G18 0; G19 0; G20 no output; G21 0; G22 0; G16 no output; G17 `refactor: rename vc- prefix to vb-`. `git tag -l` lists only `upstream-baseline`.
- G20 (M6-16) mutation checks: clean tree after C6 prints nothing; dirty tree prints `G20 SETUP FAILED`; a committed new broken pointer in `README.md` is printed; a new broken pointer inside `scripts/` is silent (the accepted gap); unset `TF/H/NODE` prints `G20 SETUP FAILED` (fails closed). Filtered rows: before 12, after 33 (8 `MIGRATION.md`, 18 `legacy-hashes.json`, 6 `v?-manifest.json`, 1 fixture); the literal `v\?` matches the tool's prefix-neutral key `v?-manifest.json`.
- Recovery block (M6-17) run verbatim with the Entry Gate variables set: full-apply crash -> rc 0, 0 changes outside the task folder, 53 screenshots back at `vc-agent-browser/screenshots/` and ignored, the ticked plan checkbox and an untracked task-folder note kept, dry run `270/104` again; partial crash (60 of 104 renames) -> same result; mutation with an untracked non-`vb-` user file -> `RECOVERY STOP`, rc 1, file kept, nothing cleaned.

Closure of the pass-3 MUST-FIX list and residuals (measured):

| Gap | Verdict | Evidence |
|---|---|---|
| M6-16 G20 filter | CLOSED | silent on a correct apply; catches a new broken pointer; dirty tree and unset variables print `G20 SETUP FAILED` |
| M6-17 no `reset --hard`, keep ignored files and task-folder edits | CLOSED when the variables are set; see M6-18 | full and partial crash recovered; guard stops on a non-`vb-` path |
| R-v C3 at the SHA-file commit | CLOSED | E13 assert rc 0 |
| R-w scan list skips missing paths | CLOSED (requirement in C1b/E8; stand-in implements it) | no ENOENT on an uncommitted applied sandbox |
| R-x gitignored fixtures | CLOSED | count check red without `-f`, green with it; C6 stages 0 `scripts/` files |
| R-z scan list 567 | CLOSED | 567 measured |

New MUST-FIX found in pass 4 (reproduced):
- M6-18: the Rollback recovery block fails OPEN when `$H` is unset, and in Claude Code every Bash call starts a fresh shell (variables do not persist), so an agent pasting the block alone has `H` empty. Then `git clean -nd ... > $H/recover-preview.txt` targets `/recover-preview.txt` (permission denied, the preview never runs), `grep -v` on the missing file exits 2, the `&& { STOP }` branch is skipped and the unguarded `git clean -fd` runs. Measured on `-crashH`: rc 0, and an untracked user file `user-notes.txt` was DELETED. This is a step that can destroy data. Fix (tested: unset `H`/`TF` + user file -> `RECOVERY STOP`, rc 1, file kept; without the user file it recovers, rc 0, 53 screenshots kept, dry run `270/104`; run from a subdirectory -> recovers, plan tick kept; partial crash (30 renames) -> recovers; both screenshot dirs present -> `RECOVERY STOP`; `bash -n` OK). Replace the Rollback block body with:

  ```bash
  # safe pre-commit crash recovery (self-contained, fail-closed; agents never run `git reset --hard` or an unguarded `git clean -fd`)
  cd "$(git rev-parse --show-toplevel)" || exit 1
  TF=process/general-plans/active/vibebelt-rebrand_29-10-26; H=$TF/harness; TFX=":(exclude)$TF"
  if [ -d .claude/skills/vb-agent-browser/screenshots ]; then
    [ ! -e .claude/skills/vc-agent-browser/screenshots ] || { echo "RECOVERY STOP: both screenshot dirs exist"; exit 1; }
    mkdir -p .claude/skills/vc-agent-browser && mv .claude/skills/vb-agent-browser/screenshots .claude/skills/vc-agent-browser/ || exit 1
  fi
  git restore --source=HEAD --staged --worktree -- . "$TFX" || exit 1
  git clean -nd -- . "$TFX" > "$H/recover-preview.txt" || { echo "RECOVERY STOP: preview failed"; exit 1; }
  grep -v '^Would remove .*vb-' "$H/recover-preview.txt"; rc=$?
  [ "$rc" -eq 1 ] || { echo "RECOVERY STOP: unexpected untracked paths or unreadable preview"; exit 1; }
  git clean -fd -- . "$TFX"
  ```

Remaining executable `git tag` / `reset --hard` / `clean -fd` / `git add -A` outside this contract (all justified):
- Entry Gate 4 `git tag -l upstream-baseline`: read-only listing; creates nothing.
- C1b `git add -A` and `git -c user.* commit`: inside a throwaway `git init` repo under `$HOME/vb-sandbox/trial`, never the real repo; the user rule (explicit lists, repo-local identity) applies to real commits only (E12).
- Rollback `git clean -fd -- . "$TFX"`: the last line of the recovery block, reached only after the preview guard; safe once M6-18 makes the guard fail closed.
- No `git reset --hard` and no tag creation remain in any executable step; the remaining mentions are prohibitions in prose.

Test gates (C3 5-column table):

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P6-a | Rename tool: dry-run writes nothing; apply matches expected tree; second apply `RESULT edits=0 renames=0`; stray forms and protection mechanisms as decided | Fully-Automated | G3 `$NODE scripts/test-rename-prefix.mjs`; G0 `--dry-run \| tail -1` | B (A1-A3) |
| C-P6-b | Tool refuses a dirty tree, never follows symlinks, never leaves the root | Fully-Automated | fixture safety cases inside G3 | B (A2/A3) |
| C-P6-c | Resolver independent of manifest version; `scripts/**` and `legacy-hashes.json` not installed | Fully-Automated | G11 (418 files today, 0 bad, exit 0) | A (resolver), B (kitOnly) |
| C-P6-d | Four uppercase signals mapped 1:1 (105 named hits) | Fully-Automated | G9 census diff | B (C1) |
| C-P6-e | Validators not worse under `vb-` paths (29-row baseline list AND all 38 release.yml steps); no stray prefix | Fully-Automated | G13, G13c, G18b, G14, G5 + G7, G22 | B |
| C-P6-h | Hook config and env fallbacks honored | Fully-Automated | G12 `legacy-config-fallback.test.cjs` x2 | B (B2) |
| C-P6-i | Updater hash/snapshot gate at all four deletion sites | Fully-Automated | G4 `scripts/test-compute-sync-plan.mjs` | B (B3/B4) |
| C-P6-j | Stray forms decided and proven | Fully-Automated | G3 + G10 | B |
| C-P6-author | `author: vibecode-pro-max-kit` -> `author: vibebelt-kit` in 19 SKILL.md | Fully-Automated | G18 | A |
| C-P6-reg | AGENTS.md registry rows; AGENTS.md <= 32,768 bytes | Fully-Automated | G21 + G19 | B (B7) |
| C-P6-ptr | No new broken pointer outside the files that hold old paths by design | Fully-Automated | G20 | B |
| C-P6-rec | Pre-commit crash recovery restores the tree, keeps ignored files and task-folder edits, stops on unexpected paths, fails closed in a fresh shell | Fully-Automated | Rollback block on a scratch clone in a crashed state (full and partial), plus the non-`vb-` and unset-variable mutations (after M6-18) | B |
| C-P6, C-SAFE-1 | Old install to new install: unmodified removed, modified kept and reported, custom kept, state migrated | Hybrid | Trial E via G15 `0 4` (Linux Node 22.23.4, Linux-fs sandbox) | B (B5) |
| C-P6-f | Install/update flows A, B, C (after B4), E; Trial D carved out (Phase 8 A0) | Hybrid | G15 + G15b (0 offenders) | B; C (Trial D) |
| C-P6-g | Fresh session resolves `vb-*` agents and skills | Agent-Probe | after the C7 restart: spawn `vb-research-agent`, invoke `vb-context-discovery` | C (C7) |
| C-P6 + C-SAFE-1 | Destructive-write evidence pack complete | Hybrid | five artifacts in `harness/` (P3, C6) | B |

Failing stubs (Fully-Automated rows; red-first starting points for EXECUTE):
- C-P6-a: `test("should rename vc- to vb- idempotently with dry-run and protected inputs", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should rename vc- to vb- idempotently with dry-run and protected inputs") })`
- C-P6-b: `test("should refuse a dirty tree and never follow symlinks or leave the root", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should refuse a dirty tree and never follow symlinks or leave the root") })`
- C-P6-c: `test("should resolve the same file list regardless of manifest version", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should resolve the same file list regardless of manifest version") })`
- C-P6-d: `test("should map the four uppercase VC- signals to VB- one to one", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should map the four uppercase VC- signals to VB- one to one") })`
- C-P6-e: `test("should keep every validator no worse than baseline under vb- paths", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep every validator no worse than baseline under vb- paths") })`
- C-P6-h: `test("should still honor an old .vc.json and VC_USAGE_CACHE_PATH", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should still honor an old .vc.json and VC_USAGE_CACHE_PATH") })`
- C-P6-i: `test("should delete only hash-matching legacy files and keep modified or unknown ones", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should delete only hash-matching legacy files and keep modified or unknown ones") })`
- C-P6-j: `test("should leave vc: colon forms unchanged and rename vc plan uncheck", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should leave vc: colon forms unchanged and rename vc plan uncheck") })`
- C-P6-author: `test("should rename indented author: vibecode-pro-max-kit lines and report a non-zero count", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should rename indented author: vibecode-pro-max-kit lines and report a non-zero count") })`
- C-P6-reg: `test("should align the AGENTS.md registry rows with the catalog", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should align the AGENTS.md registry rows with the catalog") })`
- C-P6-ptr: `test("should add no broken pointer outside the by-design old-path files", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should add no broken pointer outside the by-design old-path files") })`
- C-P6-rec: `test("should recover a crashed apply without deleting user files, even in a fresh shell", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should recover a crashed apply without deleting user files, even in a fresh shell") })`

Legacy line form (retained so existing consumers still parse):
- Rename tool: [Fully-automated: `$NODE scripts/test-rename-prefix.mjs`, dry-run/apply/idempotent]
- Resolver: [Fully-automated: G11 accumulate-until-end parse]
- Censuses: [Fully-automated: G9/G10 on the `--list-scan-files` set]
- Validators: [Fully-automated: `bash $H/compare-vb.sh` (repo-internal temp copy) + G13c release.yml exit-code diff + G18b on the kept run log]
- Hash gate: [Fully-automated: `scripts/test-compute-sync-plan.mjs`]
- Crash recovery: [Fully-automated: Rollback block on a crashed scratch clone + mutations]
- Upgrader and e2e: [hybrid: Trial E / e2e Trials A, B, C, E on Linux Node 22, `0 4` form; Trial D carved out]
- Renamed agents resolvable: [agent-probe: new session after the C7 restart]

Dimension findings:
- Infra fit: PASS — compare wrapper rc 0 with no temp leftovers; hooks, state files, manifest chain, Codex mirrors, catalog regeneration and the screenshots move behave on the simulated apply.
- Test coverage: PASS — every Exit Gate row produces its expected value on a correct apply; G20, G15, G18b, G19, G21, E17 and the recovery guard were mutation-checked this pass (plus the pass-2/3 rows); none is vacuous.
- Breaking changes: PASS — `vc-`/`VC-`/`VC_`/`.vc.json` renamed atomically with read-old fallbacks; signal census 1:1; colon forms unchanged; `PHASE_COMPLETE:` family untouched.
- Security surface: CONCERN — M6-18: the recovery guard fails open in a fresh shell and deleted an untracked user file. Everything else holds: no `reset --hard`, no tag, explicit-list staging, dirty-tree refusal, `lstat`, root confinement, hash/snapshot gate, protected set, evidence pack.
- Entry Gate / Preflight: PASS — all six items hold on HEAD 0d33214; P2 19 (when run before A1, see R-aa).
- Section A (build the tool): PASS — rules, protection mechanisms, keep-region markers and missing-path skip reproduce the intended end state.
- Section B (upgrade safety): PASS — B5 name, B4 predicate (Trial C green), B6 keep-region, B7 correct.
- Section C (apply): CONCERN — M6-18 (Rollback block). C1b, C2b, C2c, C3, C3b, C6 and the Exit Gate pass as written.

Net gate derivation: Layer 1 = 0 FAIL / 1 CONCERN / 3 PASS; Layer 2 = 0 FAIL / 1 CONCERN / 3 PASS. MUST-FIX 1 (M6-18). Net gate: CONDITIONAL, not terminal (a MUST-FIX remains). Vacuous-green check: every developed behavior has a Fully-Automated or Hybrid gate (C-P6-g alone is Agent-Probe); nothing rests on Known-Gap alone.

Open gaps (MUST-FIX, carried in the SUPPLEMENT REQUEST of this pass):
- M6-18 The Rollback recovery block must be self-contained (cd to the repo root, define `TF`/`H` itself) and fail closed (stop unless the preview was written and `grep -v` returned exactly 1); tested block above.

Known Gaps / RESIDUALs (bounded; excluded from the gate count; record in the phase report):
- R6-1, R6-2, R6-3, R6-4, R6-5, R6-7 carried (other kit versions; cosmetic bare-`vc` forms; node contingency; compare-vb working dir; cosmetic wording; model-docs prose).
- RES-A carried: Trial D baseline-red on `/mnt/c`; Phase 8 A0 owns it.
- R-e, R-f, R-g, R-h, R-i, R-k live in `## Phase 6 UPDATE PROCESS Hand-off` (U1-U7).
- R-j G8's file list omits `vb-setup/SKILL.md`, the skill references, `e2e-kit-flows.test.mjs`, `export-benchmark-kit.mjs` (G7 covers them).
- R-n AGENTS.md dangling `.claude/memory/MEMORY.md` mention: Phase 7.
- R-o kept old-identity occurrences verified correct to keep (carried unchanged).
- R-t orchestrator-owned: registry lines 68 and 72 still describe the `MIGRATION.md` banner and a `pre-vb-rename` tag; both should follow the plan.
- R-u C1b `cd $S` leaves the shell in the sandbox; return to the repo root before C2 (E18).
- R-y symlink and untracked-file fixtures created at run time (E17).
- R-aa (new) P2 must run BEFORE A1: once the A1 fixture exists, the P2 grep counts its `author:` line (measured 20 instead of 19) and G18 goes red (fails closed, not vacuous). E20.
- R-ab (new) Entry Gate 2 and C1b use `rm -rf $R` / `rm -rf $S` on variables assigned on the same line from `$HOME`; safe as written, but `${R:?}` / `${S:?}` would guard a split paste. E19.
- R-ac (new) shell variables do not persist between agent Bash calls: C1, C3b, C5b and C6 commands that use `$H`, `$TF`, `$NODE`, `$SCAN` must re-define the Entry Gate variables in the same call. Measured: when unset they fail closed (writes to `/` are refused, so G9/G13c/G18/G20 go red), so only the recovery block (M6-18) was destructive. E19.
- R-ad (new) the recovery guard treats any untracked path containing `vb-` as apply output; a user file whose path contains `vb-` created after the crash would be removed. The tree is clean at C3 (dirty-tree refusal), so only post-crash files are exposed.

What This Coverage Does NOT Prove:
- The scratch stand-ins are not the real tools. The simulated flow proves the RULES, PROTECTION design, gate commands and their order on HEAD 0d33214. Only G3/G0 prove `scripts/rename-prefix.mjs`, only G4 proves the hash gate, only G12 proves the hook fallbacks, only the real Trial E proves the old-to-new install.
- B-step hand edits other than B6 (`.gitignore`), B7 and the B4 AC-5 predicate were not simulated; G4, G8, G12, G15 (Trial E) prove them at EXECUTE.
- Fixture test and sweeps: no proof that no computed (string-built) `vc-` reference exists.
- G13/G13c: validators not worse; not that fallbacks or the hash gate are correct.
- G4 and Trial E: `upstream-baseline` content only; not other kit versions, not native Windows/macOS.
- Censuses: text identity, not that a live Claude Code or Codex session loads `vb-` agents (Agent-Probe after the restart).
- G18: author lines outside `fixtures` dirs only. G19: byte budget only.
- G15: Trials A, B, C, E only; Trial D is Phase 8's. What Trial E asserts is set by B5, not by G15.
- G15b: namespace shape of legacy entries, not that each one is safe to delete.
- G20: no NEW broken pointer outside `MIGRATION.md`, `CHANGELOG.md`, `legacy-hashes.json`, the manifest and `scripts/**`; a new broken pointer inside those files is not caught (measured); the 178 pre-existing broken occurrences stay.
- Crash recovery: tested for a full apply and a partial apply (30 and 60 of 104 renames) with the simulator's crash points; not for a crash inside a single file write (the tracked-file restore covers it, not run), and not for crashes after the C6 commit (user's decision).

Execute-agent instructions (valid once M6-18 is closed and a re-validated contract allows EXECUTE; where they differ from plan wording, these win):
- E1: Start only after this plan has a re-validated contract that allows EXECUTE (no MUST-FIX open).
- E2: First action: `bash -n` every fenced bash block of the plan, the C3b wrapper and the crash-recovery block. Stop on any syntax error.
- E3: `LC_ALL=C` on every sort/comm/count gate (as written); count gates are compared with `test`, never by `grep -c` exit code.
- E4: Commit tool, fixtures, B-step edits and allowlists (C2b) BEFORE `--apply`; save the reviewed `--dry-run` output first; stop if counts differ materially from 565-567 scan files / 5,092 hits in 263 files / 270 edited / 104 renames.
- E5: Sandboxes on the Linux filesystem; Linux Node v22 for e2e and file-list comparisons; install nothing.
- E6: Generate `legacyDeletions` additions and `legacy-hashes.json` from `git ls-tree -r upstream-baseline`; never hand-edit them.
- E7: Never lower or edit a validator; never touch `baseline/`; use the `harness/` mapping layer. Do not edit Trial D.
- E8: `--list-scan-files` = tracked + untracked-not-ignored text files that exist on disk, minus the protected set; confirm once against `git ls-files -co --exclude-standard` (565 today, 567 after B2).
- E9: Regenerate the catalog right after `--apply` (`--write`, then G22 `--check` = 0); without it `validate-skill-keywords` is WORSE.
- E10: `scripts/test-compute-sync-plan.mjs` is standalone (no import of `scripts/rename-prefix.mjs` or `scripts/fixtures/**`).
- E11: Commits go through `vc-git-manager` with an EXPLICIT file list (user standing rule: never `git add -A`). C2b: name each file. C6: `git ls-files -z --modified --deleted --others --exclude-standard -- . ':(exclude)process/general-plans/active/vibebelt-rebrand_29-10-26' | LC_ALL=C sort -zu | xargs -0 git add --`, then assert `git diff --cached --name-only | grep -c vibebelt-rebrand_29-10-26` prints 0 AND `git diff --cached --name-only | grep -c '^scripts/'` prints 0 (tool files belong to C2b). Conventional prefixes as in the plan; commit trailer per the user's standing rule.
- E12: Git identity is repo-local `Tomwakeupat530amm <minhnguyentuan31103@gmail.com>`; verify `git config user.name` / `user.email` before the first commit; never pass `-c user.*` overrides on the real repo (C1b's sandbox override is fine).
- E13: NO TAG. C2c records the rollback point with `git rev-parse HEAD > $H/pre-vb-rename.sha`; never run `git tag` (create or `-f`). Before C3 assert `test "$(git rev-parse HEAD)" = "$(cat $H/pre-vb-rename.sha)"`. Never push, never force-push. Agents never run `git reset --hard`: a crash before the rename commit uses the Rollback recovery block (M6-17 as fixed by M6-18); after the rename commit, rollback is the user's decision (show the SHA, offer `git revert <rename-commit>`).
- E14: C7 RESTART CHECKPOINT: after the rename commit (C6), stop and ask the user to restart Claude Code in the repo. EVL (vb-tester) and UPDATE PROCESS (vb-update-process-agent) run only in the restarted session.
- E15: Run the Exit Gate only after the C6 commit, on a clean tree (task folder excluded), as ONE block (it defines its own variables); G3, G4, G11, G12 are exit-code rows: record their exit codes explicitly.
- E16: Before any process commit, delete leftover `$H/.compare-vb.*` temp dirs (none expected: the wrapper has a trap) and keep harness/evidence/report files out of the execution commit (they go into the UPDATE PROCESS commit).
- E17: Fixture files whose names match `.gitignore` (`.vc-version`, `.vc-publish-config`, `.vb-*`) are added at C2b by name with `git add -f --`; then assert `git ls-files scripts/fixtures | wc -l` equals `find scripts/fixtures -type f | wc -l`. The symlink and the untracked-file fixtures are created at run time inside the runner's temp copy, never committed.
- E18: C1b: commit inside the sandbox (or use a tool that skips missing paths) before running the G5/G7 sweeps there; return to the repo root before C2.
- E19: Every Bash call starts a fresh shell: begin each call that uses `$NODE`, `$TF`, `$H`, `$B` or `$SCAN` with the Entry Gate variable block (R-ac); guard variable `rm -rf` targets with `${VAR:?}` (R-ab).
- E20: Run P2 before writing any A1 fixture (R-aa); if P2 must be re-run later, add `--exclude-dir=fixtures` so the before-count stays 19.

Plan updates applied: none by this agent (SUPPLEMENT REQUEST returned to the orchestrator).
Autonomous Goal Block: not written (BRANCH B: the umbrella carries `## Stable Program Goal`; the umbrella /goal governs).
Gate: CONDITIONAL (inner PVL pass 4, after 3 supplement cycles; 0 FAIL, 1 MUST-FIX M6-18). Not terminal: the orchestrator runs one more PVL supplement cycle (vc-plan-agent) and re-spawns vc-validate-agent from V1.
Accepted by: not accepted — MUST-FIX open (M6-18); RESIDUALs recorded by name only (R-aa, R-ab, R-ac are handled by E19, E20; R-ad is bounded by the dirty-tree refusal).

---

## Supplement cycle 1

Date: 29-10-26 | Mode: PVL-supplement | Gaps addressed: 8 of 8 (Gap 1-8) | Validate contract above is kept as the first-pass record; re-validate from V1.
- Gap 1 -> Entry Gate item 2 and checklist B0 (resolver glob-mode-by-shape, fixture at 1.0.0) plus an Exit Gate command.
- Gap 2 -> B3 + B4 (hash list from `upstream-baseline`, user-modified check built, both namespaces accepted by `isKitOwned`, install.sh case guard and e2e assertion).
- Gap 3 -> B1 (manifest rename with all readers in one apply) + B2 (state files and env vars: read-new-else-old, write new, migrate) + B5 (Trial E).
- Gap 4 -> A1/A2 (case-sensitive explicit rules, `\n` and `_` preceders, `dvc-` deny, uppercase `VC-` -> `VB-` mapped atomically, lstat, dirty-tree and outside-root refusal, content-then-paths order); Public Contracts corrected.
- Gap 5 -> allowlist files + exit-gate commands with expected values; `ls | grep -c` exit-code trap fixed by comparing the count.
- Gap 6 -> Entry Gate (clean tree, rollback point (now `$H/pre-vb-rename.sha`, no tag)), Rollback, restart checkpoint C7, Node prerequisite as a user action, Trial C fixtures protected.
- Gap 7 -> Blast Radius expanded; decision LOCKED: all of `VC_*`, `.vc.json`, `vc plan check` are renamed with old-name fallbacks (not kept as residuals).
- Gap 8 -> P3 and C6 evidence pack via `vc-risk-evidence-pack` in `harness/`; verification row added.
- Registry change needed (owned by another agent): Phase 6 line should list the new files and the expanded set above (see Blast Radius).


---

## Supplement cycle 2

Date: 29-10-26 | Mode: PVL-supplement | Gaps addressed: 7 of 7 | The Validate Contract above is the cycle-2 record; re-validate from V1. Line numbers cited were verified with grep on 29-10-26 (install.sh 337-380 legacy block with `rm -rf` at 365, stale block ~225-280; e2e lines 21, 34, 74-92, 241-245, 267-277; `subagent-init.cjs` line 60 in both trees; hook files: 5 per tree).
- Gap 1 -> Entry Gate 3 (task-folder-excluded clean check, no early tag), C1/C1b/C2/C2b/C2c/C3 reordered: tool and allowlists are committed (`feat: add rename tool and upgrade safety`) BEFORE the rollback point (now `$H/pre-vb-rename.sha`, no tag); rollback and crash recovery (`git reset --hard HEAD && git clean -fd -e <task folder>`) added; the rename commit stays the last execution commit.
- Gap 2 -> B3 splits the generated list into `hashed` and `snapshotGated` (pre-existing legacy dirs deleted only when every file is in the old install snapshot; Trial C/AC-7 stays green); B4 applies one shared gate at four deletion sites including the real `install.sh` "Apply legacyDeletions" block and adds `scripts/test-compute-sync-plan.mjs`; `legacy-hashes.json` and `scripts/**` go to `kitOnly` (G11 proves they are not installed).
- Gap 3 -> B2 and Blast Radius cover the 5 hook files x 2 trees plus a new fallback test (G12); all fallback lines use the `legacy-vc-fallback` tag (G8).
- Gap 4 -> Blast Radius "Protected set" defines the 5 mechanisms (whole-path skips including the two allowlist files, JSON `legacyDeletions` state machine, tag, keep-region, NUL/`lstat` guard); CHANGELOG.md and MIGRATION.md are whole-file protected; preceder test is ASCII `[A-Za-z0-9]`.
- Gap 5 -> Purpose table decides every stray form (`vc plan uncheck` renamed; `vc:*`, `VC harness`, identifiers kept; `my-custom-vc-tool` renamed; `vb-audit-vc` kept); fixtures in A1; G10 proves the kept colon forms unchanged.
- Gap 6 -> G11 uses the accumulate-until-end parse; census and sweeps use `--list-scan-files` (excludes task folder, scripts under protection, fixtures; G6 proves it; `LC_ALL=C`); Entry Gate 2 uses a copy of the real kit at version 1.0.0.
- Gap 7 -> C3b writes `harness/validators.vb.list`, `compare-vb.sh` and `runtime-map.txt` in the task folder (baseline/ untouched); G13 uses them; Phases 7 and 8 reuse them.
- Requests to the orchestrator (files I do not own): (1) registry Phase 6 line: `legacy-hashes.json` goes to `kitOnly` (not `include`) and root `scripts/**` to `kitOnly`; add `scripts/test-rename-prefix.mjs`, `scripts/test-compute-sync-plan.mjs`, the two hooks `legacy-config-fallback.test.cjs`, `.claude/hooks/lib/*` + `.codex/hooks/lib/*` (5 files each), `MIGRATION.md` banner line, `.gitignore`, and `harness/` helper files; (2) umbrella: the sweep rule "CHANGELOG/MIGRATION history lines" is implemented as whole-file protection; (3) Phase 0 `compare.sh` should resolve its sibling files relative to its own directory (and may offer `--map`); (4) Phase 3: the signal-census script must list agents by directory listing and key output by prefix-stripped names (Phase 7 depends on it).
- C1/C2/C3/C7 (cycle 2c): Exit Gate G13 states it calls compare-vb.sh which runs the Phase 0 compare.sh incl. the LICENSE greps (G13b shows them); C3b cites the Phase 0 own-directory guarantee and adds gate G18b (used list/log has vb- paths, zero vc-); verbatim umbrella SWEEP RULE added with the Phase 6 whole-file mechanism; `author: vibecode-pro-max-kit` -> `author: vibebelt-kit` rule (7th literal rule), P2 before-count, fixture, gate G18.

## Supplement cycle 3
- M6-1 applied: the `author: vibecode-pro-max-kit` rule 7 is indentation-tolerant (preserves leading whitespace); A1 fixture gains an indented case; P2 and G18 use `^[[:space:]]*author:`, assert before-count > 0 (19 expected, verified by grep) and old text 0 after; "about 33" corrected to 19.
- M6-2 applied: B4 redefines the AC-5 predicate to the full `isKitOwned` namespaces in both spellings plus the two `process/general-plans/{reports,references}` dirs; gate G15b added. B5/Trial C was red at baseline because of AC-5 and is made green by this edit; Phase 8 depends on it.

## Supplement cycle 4 (PVL-supplement)
- M6-3 applied: both AFTER-greps of G18 now add `--exclude-dir=fixtures` (same exclusion idea as G7/G9/G10), because A1 puts `author: vibecode-pro-max-kit` in `scripts/fixtures/rename-prefix/in` and `author: vibebelt-kit` in `.../out`, and that tree is protected so the apply never rewrites it. Without the exclusion the old-text count could never reach 0 and the new-text count could never equal the before-count. The before-count in P2 is unaffected (taken before the fixtures exist). Scratch simulation: a tree with 1 SKILL.md author line plus a `fixtures/in` (old spelling) and `fixtures/out` (new spelling) copy gives, with the exclusion, old=0 and new=1 = before-count; without it old=1 (never reaches 0).

Supplement (screenshots decision): .gitignore's A3c screenshots line sits outside the keep-region so it becomes `vb-agent-browser/screenshots/`, the on-disk directory (53 untracked PNGs) moves with the directory rename, and a fixture plus the A3 fixture test prove the ignore line still matches the renamed path; the C1b trial copy (`git add -A`) is safe because the line is already ignored. Gates must not assume the screenshots are tracked or counted.

Supplement (ripple of 2026-10-29 decisions): model labels corrected to front-matter reality (research, plan, validate, tester = opus; innovate, spec, update-process = sonnet; EXECUTE = opus; Phase 1 A1 table, Decision B). sweep and protected-set wording now excludes golden/, eq (equivalence harness), baseline/ and harness/ (all inside the protected task folder); the rename must keep the Phase 1 doc facts (7 opus / 8 sonnet) intact.

## Supplement (PVL cycle 5 MUST-FIX)
- M6-4 applied: G15, C-P6-f, the Verification Evidence row and the C-P6-f matrix row now expect Trials A, B, E to pass and Trial C to pass after B4; Trial D (cross-device `git clone --local`, reproduced: `--local` rc 128, `--no-hardlinks` rc 0) is Phase 8's (A0 edit 4), not worse than baseline. Trial C/AC-5 (B4) stays Phase 6's.
- Residuals refreshed: Test Infra notes (Linux Node v22.23.4 present; Linux-node e2e baseline 2 of 4); C4 reads the validator-step count from release.yml; R6-6 scan definition now states that gitignored runtime text (e.g. `.claude/hooks/.logs/`) is excluded.
- Validate Contract above is kept unchanged; status: cycle 5 CONDITIONAL, MUST-FIX addressed, re-validate from V1.

## Supplement (sync after scope decisions 2026-10-30)

- Entry Gate item 1: the 'join green / team disbanded' precondition is now 'Phase 4 and Phase 5 committed on `main` with their exit gates green' (decision G), plus the AGENTS.md byte-budget check.
- Blast Radius: the rename sweep covers the new `vc-intent-clarify/references/*` files and any `vc-` text Phase 5 moved into them; `vc-update` was not split.
- New C5b and Exit Gate G19 (`AGENTS.md` <= 32,768 bytes) and G20 (re-run of Phase 4's prefix-neutral `pointer-check.mjs`, before/after mapped).
- The Validate Contract and earlier supplements are kept verbatim (E1 there still says 'team disbanded'; read it as 'Phases 4 and 5 committed').


## Supplement (inner PVL pass 1, 30-10-26)

Mode: PVL-supplement | Gaps addressed: 8 of 8 (M6-5..M6-12) plus residual hardenings | Validate Contract above kept unchanged; re-validate from V1.
- M6-5 -> C3b: compare-vb.sh body given; temp copy `mktemp -d "$H/.compare-vb.XXXXXX"` inside the repo; used list and log saved; `rm -rf $X`.
- M6-6 -> G18b: log check limited to command header lines (`^\$ `): 0 `/vc-` and > 0 `/vb-`.
- M6-7 -> C5b + G20: MIGRATION.md / CHANGELOG.md dropped as citing files on both sides (real TAB).
- M6-8 -> C1 (a3) writes `$H/release-validators-before.tsv`; C4 and new gate G13c re-run every release.yml validator and diff exit codes; Verification Evidence row added.
- M6-9 -> Blast Radius AGENTS.md line, step B7 (lines 352/372, net -2 bytes, 31,981), gate G21; G19 kept.
- M6-10 -> MIGRATION.md banner removed from protected-set item 1 and B6.
- M6-11 -> C1(b) and P3 counts refreshed (5,092 hits / 263 files / ~270 edited / ~104 renames / 565 scan files); G11 says 418.
- M6-12 -> handoff wording no longer contains the literal PASS-gate string; status lines 16/302 updated.
- Residuals: G15 mechanical (`node --test --test-name-pattern 'Trial [ABCE]'`); P2 colon census moved to C1 (a2) with `$SCAN`; C6 stages with the task-folder exclude; B4 standalone note for `scripts/test-compute-sync-plan.mjs`; B3 names hook-lib entries in both trees; catalog `--check` (C3, G22). New `## Phase 6 UPDATE PROCESS Hand-off` section.
- Request to the orchestrator (not edited here): registry Phase 6 line "ONLY Phase 6 edit to MIGRATION.md ... banner" -> "no edit to MIGRATION.md".


## Supplement (inner PVL pass 2, 30-10-26)
- M6-13 -> compare-vb.sh re-runs `run-validators.sh` into `$H/compare-vb.run.txt` (kept log with `$ ` headers) and has `trap 'rm -rf "$X"' EXIT`; C3b names it; G18b reads `compare-vb.run.txt`.
- M6-14 -> G20 takes the after-pass itself after the C6 commit, with a clean-tree guard printing `G20 SETUP FAILED`; C5b updated.
- M6-15 -> B5 names the test `Trial E: old install to new install`; G15 prints `<rc> <ok count>`, expected `0 4`.
- Residuals -> C6 stages by the explicit E11 file list (no `git add -A`); G11 appends `; echo $?`.
- Orchestrator decision -> no rollback tag: C2c records `$H/pre-vb-rename.sha`; rollback is the user's decision (agents show the SHA); only tag in the program is Phase 8 `v1.0.0`.
- U7 added: Phase 8 runs without the B4 quality-equivalence run (user decision 2026-10-30).
## Supplement (inner PVL pass 3, 30-10-26)

- M6-16 -> G20 and C5b: one ERE `G20X` drops the by-design old-path citing files (`MIGRATION.md`, `CHANGELOG.md`, `legacy-hashes.json`, `v?-manifest.json`, `scripts/**`) on both sides of the `comm -13`; clean-tree guard `G20 SETUP FAILED` kept.
- M6-17 -> C3 and Rollback: `git reset --hard HEAD && git clean -fd -e <TF>` replaced by the tested safe recovery block (screenshots moved back, `git restore` outside the task folder, `git clean -nd` preview that stops on non-`vb-` paths, then clean); agents never run `reset --hard`; other rollbacks are the user's decision.
- Residuals: C3 names the SHA-file commit (E13 assert); C1b scan list skips missing paths (R-w); C2b force-adds gitignored fixtures and checks counts, run-time-only symlink/untracked fixtures (R-x, E17); C1 scan list 567 (R-z).

## Supplement (inner PVL pass 4, 30-10-26)
- M6-18 -> Rollback: recovery block replaced by the self-contained, fail-closed version (cd to repo root, sets `TF`/`H`/`TFX` itself, checks every step, preview failure or grep rc != 1 -> `RECOVERY STOP`, screenshot-collision stop). C3 says to run it as one Bash call. Hand-off U8 carries residuals R-aa..R-ad. Applied WITHOUT a V1 re-run on purpose (user instruction to go fast; the validator tested the fix on 6 scenarios).
