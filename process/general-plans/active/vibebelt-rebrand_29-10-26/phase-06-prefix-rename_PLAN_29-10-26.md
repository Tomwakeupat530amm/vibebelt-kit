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
**Phase status:** ⏳ PLANNED (supplement cycle 3 applied 29-10-26; PVL cycle 4: CONDITIONAL, M6-3 open)
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

1. Phases 0-5 exit gates green (Phases 4 and 5 finished; their team is disbanded).
2. Phase 2 precondition: `resolve-manifest.mjs` chooses glob mode by shape (`Array.isArray(manifest.include)`), not by version. Check on a COPY of the real kit (a bare manifest in an empty root resolves zero files in every mode, so it proves nothing): `R=$HOME/vb-sandbox/resolver-1.0.0; rm -rf $R; mkdir -p $R; git archive HEAD | tar -x -C $R; sed -i '0,/"version": *"[^"]*"/s//"version": "1.0.0"/' $R/vc-manifest.json` then run the resolver on `$R` and on `.` with the accumulate-until-end parse (see Exit Gate G11) and assert both counts are equal and > 0. If Phase 2 did not land it, step B0 lands it here first (the resolver returns `files: []` at 1.0.0 otherwise; reproduced).
3. Clean tree EXCLUDING the task folder (phase reports and `harness/` are written there while working): `test -z "$(git status --porcelain -- . ':(exclude)process/general-plans/active/vibebelt-rebrand_29-10-26')"` on `main`. The rollback tag `pre-vb-rename` is NOT created here; it is created at C2c, on the commit that already contains the tool (a tag taken before the tool exists would discard the tool on rollback).
4. Tag `upstream-baseline` exists (`git tag -l upstream-baseline` prints it); it is the source of the legacy name list and hash list.
5. Runner: `$NODE` = Linux Node >= 22 inside WSL (`node --version`). Installing it is a USER action (see Phase 8 P0), never automatic. If absent, `NODE=node.exe` runs the pure-script and validator gates only; every Hybrid gate (Trial E, e2e) is NOT TESTED and stays CONDITIONAL. Sandboxes for Hybrid gates live on the Linux filesystem (for example `$HOME/vb-sandbox`), never under `/mnt/c`. File-list comparisons run on Linux Node only (node.exe returns backslash paths).
6. Baseline reds (`validate-skills`, `validate-context-discovery` red because `.agents/skills` is a text file on this checkout) are read from the Phase 0 `baseline/` record and are NOT counted as Phase 6 regressions.

---

## Strategy Recommendation (vc-agent-strategy-compare)

- Signals: S1, S2, S4, S6, S7 — score 5/7 (HIGH label), dominant signal S6 (destructive updater and installer behavior), but the change is one script run over a closed file set.
- Recommended: **Sequential** — 1 execute agent runs the script; the point is determinism, so fan-out adds risk. Research/plan/validate = sonnet; script authoring + run = opus. Alternative (agent team) rejected: no mid-run coordination needed.
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
- `.github/workflows/*.yml` (CI paths), `.github/ISSUE_TEMPLATE/**` and other `.github` templates, `CONTRIBUTING.md` + its 5 translations, `.gitignore` (keep-region, see A2), `docs/**` (including i18n), `README.md` + all i18n, `CLAUDE.md`, `AGENTS.md`, `export-benchmark-kit.mjs`
- Manifest chain renamed together in ONE apply (LOCKED Q4): `vc-manifest.json` -> `vb-manifest.json` with ALL its readers: `install.sh`, `resolve-manifest.mjs`, `compute-sync-plan.mjs`, vb-update / vb-publish / vb-setup skills, `export-benchmark-kit.mjs`, `e2e-kit-flows.test.mjs`, `CONTRIBUTING.md` (+ translations), `.github` templates
- Hooks that read user config at runtime (5 files in each of `.claude/hooks/lib` and `.codex/hooks/lib`): `privacy-checker.cjs`, `vc-config-utils.cjs` (-> `vb-config-utils.cjs`), `statusline-render-modes.cjs`, `statusline-section-registry.cjs` read `.vc.json`; `usage-limits-cache.cjs` reads `VC_USAGE_CACHE_PATH`. They get read-old/write-new fallbacks (B2). These config files are user-owned (the kit does not ship `.claude/.vc.json`), so without the fallback an existing user config would be silently ignored after the update.

**Protected set (never rewritten; defined in ONE place, `PROTECTED` in the script, printable with `--print-protected`):**
1. Whole-path skips: the task folder `process/general-plans/active/vibebelt-rebrand_29-10-26/` (includes `baseline/`, `golden/`, `harness/`), `.git/`, `node_modules/`, `scripts/rename-prefix.mjs`, `scripts/test-rename-prefix.mjs`, `scripts/test-compute-sync-plan.mjs`, `scripts/fixtures/rename-prefix/**`, `scripts/rename-prefix.allowlist.txt`, `scripts/rename-prefix.path-allowlist.txt`, `legacy-hashes.json` (keys are old paths), `CHANGELOG.md` and `MIGRATION.md` (pure history of the original kit; DECISION: whole-file protection, not marker regions; Phase 8 adds the 1.0.0 entry by hand in `vb-` terms; B6 adds a one-line banner at the top of `MIGRATION.md` pointing to `docs/RELEASE-NOTES-1.0.0.md`), `.agents/skills` when it is a text file on this checkout (its content is checked separately to hold no `vc-`).
2. JSON-aware skip: in any `*manifest.json`, the string values of the `legacyDeletions` array (line state machine: from the line containing `"legacyDeletions"` to its closing `]` line; formatting is preserved, no re-serialize).
3. Single-line tag: any line containing the token `legacy-vc-fallback` is skipped whole (the old-name fallback readers).
4. Keep-region: lines between a line containing `rename-prefix:keep:start` and a line containing `rename-prefix:keep:end` (markers inclusive) are skipped. Used for `.gitignore` (the `.vc-version`/`.vc-publish-config` lines; the Phase 0 A3c line `.claude/skills/vc-agent-browser/screenshots/` is deliberately OUTSIDE the keep-region so the sweep rewrites it to `.claude/skills/vb-agent-browser/screenshots/`), the e2e Trial C seed block (`e2e-kit-flows.test.mjs` lines 74-92) and the Trial C `vc-team`-removed assertion (lines 241-245). Without this, the assertion would be rewritten to `vb-team`, a path that never existed, and would pass vacuously.
5. Text-only guard: files with a NUL byte in the first 8000 bytes are skipped; symlinks are never followed (`lstat`).

Allowed to keep `vc-` / `VC-` / `VC_` after the apply (enumerated in the allowlist files, nothing else): the protected set above plus the tagged / keep-region lines (their files are listed in `scripts/rename-prefix.allowlist.txt`).

---

## Implementation Checklist

### Step P — Preflight (before any write)

- [ ] P1. Verify Entry Gate items 1-6 and record the output in the phase report.
- [ ] P2. Take the BEFORE `vc:` colon-form census (residual proof, X-COLON) into `$H/vc-colon-before.txt`: `grep -rIoh 'vc:[a-z-]*' . --exclude-dir=.git --exclude-dir=vibebelt-rebrand_29-10-26 | LC_ALL=C sort | uniq -c` (about 20 hits). The BEFORE author-metadata count is also taken here: `grep -rIlE "^[[:space:]]*author: vibecode-pro-max-kit$" . --exclude-dir=.git --exclude-dir=vibebelt-rebrand_29-10-26 | LC_ALL=C sort > $H/author-before.txt`; assert `wc -l < $H/author-before.txt` is greater than 0 (expected 19 on the current tree; stop if 0 because that means the pattern is vacuous). The signal census BEFORE is taken at C1 (it needs the tool's scan list, see C1), not here.
- [ ] P3. Start the destructive-write evidence pack with `vc-risk-evidence-pack` in `$H/` (artifacts per that skill; risk class: destructive writes — one tool rewrites about 227 files, renames about 73 paths, and the updater deletes files). Completed before the phase may be VERIFIED; it stays manual-first.

### Step A — Build the tool (test first)

- [ ] A1. Write fixtures under `scripts/fixtures/rename-prefix/in` with the expected tree in `.../out`, plus the runner `scripts/test-rename-prefix.mjs` (red first). They must also contain the lines `author: vibecode-pro-max-kit` (must change to `author: vibebelt-kit`) and `author: someone-else` (must NOT change). They must contain `vc-` in: file names, directory names, front-matter `name:`, markdown links, `Skill(vc-x)` invocations, JSON manifest paths, mermaid labels after a literal `\n` (`\nvc-update-process-agent`), an underscore-preceded token (`_vc-validate-agent`), `.vc-version` / `.vc-installed-files` / `.vc-publish-config`, `.vc.json`, the texts `vc plan check` and `vc plan uncheck` on ONE line, the four uppercase signals, bare `VC-` prose (`VC-system`), `VC_KIT_SOURCE`-style env vars, a `vc:plan` colon form and `VC harness` prose (both must NOT change), `my-custom-vc-tool` and `non-vc-` (must change), the false positive `dvc-` (must NOT change), a manifest with `legacyDeletions` values (must NOT change) next to other `vc-` strings in the same file (must change), a keep-region and a tagged `legacy-vc-fallback` line (must NOT change), a `CHANGELOG.md`/`MIGRATION.md` (whole-file protected, unchanged), a file with a NUL byte (skipped), a symlink pointing outside the root (target untouched), and an untracked file (dirty-tree refusal case). They must also contain a `.gitignore` holding the line `.claude/skills/vc-agent-browser/screenshots/` outside any keep-region (expected `.../out` line: `.claude/skills/vb-agent-browser/screenshots/`) and a gitignored, untracked file inside that directory (expected: it moves with the renamed directory, stays ignored and untracked).
- [ ] A2. Implement `scripts/rename-prefix.mjs` with these rules:
  - Modes: `--dry-run` (prints every path rename and per-file text-change counts; writes nothing; allowed on a dirty tree), `--apply`, `--root <dir>` (default repo root), `--list-scan-files` (prints, one per line, LC_ALL=C sorted, `/`-separated, every non-protected text file the apply would examine; used by ALL sweeps and censuses so the exclusion logic lives in one place), `--print-protected` (prints the protected set of the Blast Radius section).
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
- [ ] B3. Legacy lists, generated not hand-written (never edit either by hand): from `git ls-tree -r upstream-baseline` generate (i) the old-name entries merged into `vb-manifest.json` `legacyDeletions` (covering `.claude/agents/vc-*`, `.claude/skills/vc-*`, `.codex/agents/vc-*.toml`, hook lib `vc-config-utils.cjs` + its test, `process/development-protocols/vc-system-behavior/`, `vc-autoresearch-spec.md`), and (ii) `legacy-hashes.json` with TWO classes:
  - `hashed`: `{ "<old path>": "<sha256>" }` for every file of those entries present in the `upstream-baseline` tree (hash-gated).
  - `snapshotGated`: the pre-existing `legacyDeletions` entries that predate the baseline and have no file in its tree (11 skill dirs such as `.claude/skills/vc-team`, plus old protocol files). They have no sha256 and cannot be hashed; LOCKED rationale: each is "a directory of an old kit version" whose content the kit itself installed, so it is deleted only if EVERY file under it appears in the project's old install snapshot (`.vb-installed-files`, else `.vc-installed-files`); one file not in the snapshot (user-added) keeps the whole entry and reports it. Residual (named, backlog stub): a user EDIT to a file of such a directory is not detectable (no hash exists); accepted because the entries are deprecated for several versions.
- [ ] B4. Build the user-modified-file gate (it does not exist today), one shared helper used at ALL FOUR deletion sites: `compute-sync-plan.mjs` step 3 (stale removal from the prior snapshot), step 4 (the `legacyDeletions` loop, lines ~194-199), the `install.sh` "Apply legacyDeletions" block (the real `rm -rf "$legacy_path"`, lines ~337-380, line 365) and the `install.sh` stale-removal block (lines ~225-280). Rules: any path in the legacy `vc-` namespace is decided by the gate no matter which site reaches it (so widening `isKitOwned` / the `case` guard to the `vc-` namespace can never delete without a check): `hashed` path -> delete iff on-disk sha256 equals the entry, else "kept (modified)"; directory entry -> expanded per file, a file not in `hashed` (unknown content) -> "kept (unknown file)"; `snapshotGated` entry -> the snapshot rule of B3; no snapshot or no `legacy-hashes.json` (older kit source) -> keep + report. Empty directories are removed after their files. Make `isKitOwned` and the `install.sh` case guard accept BOTH namespaces for legacy entries. AC-5 predicate redefined (M6-2; hand edit of `e2e-kit-flows.test.mjs` lines ~267-277, tagged `legacy-vc-fallback`): an entry passes when it starts with one of the `isKitOwned` namespaces in BOTH `vc-`/`vb-` spellings (`.claude/skills/`, `.claude/agents/`, `.claude/hooks/`, `.codex/`, `process/development-protocols/`, `process/_seeds/`) or is exactly `process/general-plans/reports` or `process/general-plans/references`. Gate: G15b below runs a node.exe one-liner over the shipped manifest asserting 0 offenders under this predicate (6 offenders under the old predicate). Unit test FIRST (red): `scripts/test-compute-sync-plan.mjs` builds a temp tree (os.tmpdir) and runs `compute-sync-plan.mjs --root <seeded old install> --kit-root <new kit> --json` for these cases, asserting `toDelete` / `toPreserve` / `staleWarnings`: matching hash -> deleted; modified -> kept + reported; unknown file inside a hashed dir -> kept + reported; `snapshotGated` dir fully in the snapshot -> deleted; same dir with one extra user file -> kept; no snapshot -> kept. The install.sh block is exercised by Trial E.
- [ ] B5. Add e2e Trial E (old install -> new install): seed from `git archive upstream-baseline`, modify one old `vc-` skill file, add `my-skill` and `vc-custom`; run the new `install.sh`; assert unmodified old files removed, the modified one kept and reported, custom skills kept, state files migrated to `.vb-*`, no `vc-x` next to `vb-x` for unmodified files. Record the `.vb-version` value after the old-to-new install (feeds the Phase 8 release note). Add the keep-region markers to the Trial C seed block (74-92) and the `vc-team`-removed assertion (241-245); Trial C stays on `vc-` names and must stay green (AC-7).
- [ ] B6. Remaining hand edits, committed before the apply: `rename-prefix:keep` markers in `.gitignore` (and its new `.vb-*` lines; the A3c screenshots line stays outside the markers), the `legacy-vc-fallback` tags of B1/B2, and a one-line banner at the top of `MIGRATION.md` ("This document covers the original vibecode-pro-max-kit; for vibebelt-kit 1.0.0 see docs/RELEASE-NOTES-1.0.0.md"). Verify each cited line number with grep before editing (the numbers in this plan were checked 29-10-26 and may drift after Phases 1-5).

### Step C — Apply (tool committed first, then ONE rename commit)

- [ ] C1. Read-only passes on the real repo (allowed on a dirty tree): (a) BEFORE signal census into `$H/signal-census-before.txt`: `$SCAN | tr '\n' '\0' | xargs -0 grep -Ioh 'VC-[A-Z-]*' | LC_ALL=C sort | uniq -c` (105 hits for the four named signals = 43 + 40 + 13 + 9, plus stray `VC-` prose tokens; the gate is the 1:1 diff, not the number) and the same pipeline with `'VB-[A-Z-]*'` piped to `wc -l` must print 0 before; (b) `--dry-run`, full output saved to the phase report; review counts against the validate-contract numbers (about 5016 `vc-` hits in about 227 files, about 73 renamed paths, excluding the task folder); stop and investigate if they differ materially.
- [ ] C1b. Trial apply on a throwaway copy to derive the allowlists: `S=$HOME/vb-sandbox/trial; rm -rf $S; mkdir -p $S; tar -c --exclude=.git . | tar -x -C $S; cd $S && git init -q && git add -A && git -c user.email=t@t -c user.name=t commit -qm trial && $NODE scripts/rename-prefix.mjs --apply`. Run the content sweep (Exit Gate G7 pattern list) and the path find (G5) in `$S`; their outputs ARE the candidate allowlists. Review every entry: each must be an intended residual (tagged fallback, keep-region or manifest legacy list); anything else is a rename-rule bug to fix before continuing. Delete `$S` afterwards.
- [ ] C2. Write the two allowlist files (content: one path per line; path-name: one path per line, exact, no regex) from the reviewed C1b output, LC_ALL=C sorted. They are in the protected set, so the apply never rewrites them.
- [ ] C2b. Commit the tool, fixtures, runners, allowlists, B-step edits, `legacy-hashes.json` as one commit `feat: add rename tool and upgrade safety`. Rerun the fixture tests and `test-compute-sync-plan.mjs` on this commit (exit 0).
- [ ] C2c. Create the rollback tag on that commit: `git tag pre-vb-rename` (local only; if it already exists from an earlier attempt: `git tag -f pre-vb-rename` is allowed here only, before the apply). The tree is now clean (task-folder exclusion applies).
- [ ] C3. `--apply` from the clean `main` at the tagged commit; then regenerate `process/context/generated-skills-catalog.json` with the repo's generator (never by hand). A crashed or partial apply: `git reset --hard HEAD && git clean -fd -e process/general-plans/active/vibebelt-rebrand_29-10-26`, then re-run from C1.
- [ ] C3b. Baseline mapping (the Phase 0 `baseline/` is protected; do not touch it): write `$H/validators.vb.list` by mapping ONLY the command column of `$B/validators.list` (labels unchanged): `awk -F'\t' 'BEGIN{OFS="\t"}{gsub(/vc-/,"vb-",$2);print}' $B/validators.list > $H/validators.vb.list`. Write `$H/compare-vb.sh`: copy `$B/.` to a temp dir, replace its `validators.list` with `$H/validators.vb.list`, run its `compare.sh after_setup` (label-keyed against `validators_after_setup.tsv`), delete the temp dir, return the exit code. Record the mapping command in the phase report. Also write `$H/runtime-map.txt` (`baseline_runtime=<runtime column of validators_after_setup.tsv> current_runtime=$NODE`); if they differ, record a same-runtime reference by running the validators once on a worktree of tag `pre-vb-rename` with the current `$NODE` into `$H/validators_pre_rename.tsv` and compare against that instead. Phases 7 and 8 reuse `compare-vb.sh`. PHASE 0 GUARANTEE this wrapper relies on (stated in Phase 0 B3 LOOKUP RULE): `compare.sh` resolves `validators.list`, `run-validators.sh` and the TSVs relative to ITS OWN directory (`dirname "$0"`) and only then `cd`s to the repo root to execute commands; `--map` stays available but is not what this wrapper needs. Proof the swapped list is really used (gate G18b): before deleting the temp dir the wrapper saves the list it ran to `$H/compare-vb.used.list` and the run log to `$H/compare-vb.log`. Because `compare.sh` includes the Phase 0 LICENSE RULE (both LICENSE greps + original-line check), `compare-vb.sh` carries C-SAFE-2 too.
- [ ] C4. Run the validator suite (the 18 commands in `.github/workflows/release.yml`, now under `vb-` paths) through `bash $H/compare-vb.sh`, plus `e2e-kit-flows.test.mjs` (with Trial E), the hook tests (`legacy-config-fallback.test.cjs` x2, `vb-config-utils.test.cjs` x2) and `test-compute-sync-plan.mjs`.
- [ ] C5. Final sweeps (Exit Gate G1-G11): content grep against the allowlist, path-name find, directory counts, signal census after vs before mapped, X-COLON residual census, tagged-fallback check, resolver check.
- [ ] C6. Complete the evidence pack in `$H/`. Commit as ONE commit `refactor: rename vc- prefix to vb-` directly on `main` (it is the LAST execution commit of the phase, so the `git log -1` gate holds; the evidence pack and phase report are added in the same commit with `git add -A`).
- [ ] C7. RESTART CHECKPOINT: stop and ask the user to restart Claude Code in this repo so `vb-*` agents and skills resolve; then run EVL and UPDATE PROCESS from the new session. (Agent-Probe row below.)

### Rollback

- Before the rename commit: `git reset --hard HEAD && git clean -fd -e process/general-plans/active/vibebelt-rebrand_29-10-26` (the `-e` keeps the task folder), then re-run. After the rename commit but before any push: `git reset --hard pre-vb-rename` (the tag sits on the tool commit, so the tool survives; local, remote untouched) or `git revert <rename-commit>`; delete the sandboxes. After a push or release: `git revert` the single commit (no history rewrite, no force-push). The tag `pre-vb-rename` stays until Phase 8 completes.

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
$NODE resolve-manifest.mjs --root . --json | $NODE -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const f=JSON.parse(s).files;const bad=f.filter(x=>/^(scripts[\\\\/]|legacy-hashes\.json$)/.test(x)).length;process.exit(f.length>0&&bad===0?0:1)})"   # G11 Expected: exit 0 (whole-output accumulate parse, ~76 KB; files > 0 at version 1.0.0; legacy-hashes.json and scripts/** are not installed)
$NODE .claude/hooks/lib/__tests__/legacy-config-fallback.test.cjs && $NODE .codex/hooks/lib/__tests__/legacy-config-fallback.test.cjs; echo $?   # G12 Expected: 0 (old `.vc.json` and VC_USAGE_CACHE_PATH still honored)
bash $H/compare-vb.sh; echo $?                                                # G13 Expected: 0 (all validators NOT WORSE than baseline via the vb- mapped list; label-keyed; compare-vb.sh runs the Phase 0 compare.sh, so this includes the LICENSE greps)
$NODE .claude/skills/vb-audit-vc/scripts/validate-agent-parity.mjs; echo $?   # G14 Expected: 0
$NODE e2e-kit-flows.test.mjs                                                  # G15 Expected: all trials pass incl. Trial C (AC-7) and Trial E (Linux Node; NOT TESTED + CONDITIONAL if WSL has no Linux Node)
$NODE -e "const m=require('./vb-manifest.json'),ok=e=>/^(\.claude\/(skills|agents|hooks)\/|\.codex\/|process\/development-protocols\/|process\/_seeds\/)/.test(e)||e==='process/general-plans/reports'||e==='process/general-plans/references';const bad=m.legacyDeletions.filter(e=>!ok(e));console.log(bad.length);process.exit(bad.length?1:0)"   # G15b Expected: 0 (AC-5 predicate offenders; adjust the manifest path to the real file)
test "$(grep -c "vb-" $H/compare-vb.used.list)" -gt 0 && test "$(grep -c "vc-" $H/compare-vb.used.list)" = 0 && test "$(grep -c "/vc-" $H/compare-vb.log)" = 0; echo $?   # G18b Expected: 0 (the swapped list was actually used: vb- command paths, zero vc- paths in the list and the run log)
grep -c "Copyright (c) 2026 vibecode" LICENSE; grep -c "Copyright (c) 2026 Tomwakeupat530amm" LICENSE   # G13b Expected: 1 and 1 (also enforced inside compare-vb.sh via the Phase 0 LICENSE RULE; G13 exit 0 includes it)
AP='^[[:space:]]*author: vibecode-pro-max-kit$'; AN='^[[:space:]]*author: vibebelt-kit$'; test "$(wc -l < $H/author-before.txt)" -gt 0 && test "$(grep -rIlE "$AP" . --exclude-dir=.git --exclude-dir=fixtures --exclude-dir=vibebelt-rebrand_29-10-26 | wc -l)" = 0 && test "$(grep -rIlE "$AN" . --exclude-dir=.git --exclude-dir=fixtures --exclude-dir=vibebelt-rebrand_29-10-26 | wc -l)" = "$(wc -l < $H/author-before.txt)"; echo $?   # G18 Expected: 0 (before-count > 0, expected 19; old text 0 after; new count equals before count)   # M6-3: both AFTER greps exclude `fixtures` (the protected scripts/fixtures/rename-prefix tree that deliberately holds both author spellings); the BEFORE-count in P2 is unaffected
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
- C-P6-f install/update/publish flows still work. proven by: e2e-kit-flows. strategy: Hybrid
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
| Full validator suite (18 commands) no worse than `baseline/` under `vb-` paths | Fully-Automated | C-P6-e: all validators green |
| Content grep and path find against allowlist files; directory counts; tagged-fallback check | Fully-Automated | C-P6-e: no stray prefix |
| Trial E: upgrader from `upstream-baseline` install (modified file kept, unmodified removed, custom kept, state migrated) | Hybrid (Linux Node >= 22; Linux-filesystem sandbox) | C-P6 + C-SAFE-1: upgraders cleaned, user content safe |
| `node e2e-kit-flows.test.mjs` (Trials A-E; Trial C legacy fixtures protected) | Hybrid (Linux Node >= 22) | C-P6-f: install/update flows still work |
| Fresh session spawns `vb-research-agent` and invokes `vb-context-discovery` | Agent-Probe (after the restart checkpoint) | C-P6-g: renamed agents resolvable |
| `vc-risk-evidence-pack` artifacts in `harness/` | Hybrid (manual-first review) | C-P6 + C-SAFE-1: destructive-write evidence |
| `scripts/test-compute-sync-plan.mjs`: matching hash deleted; modified / unknown file / no snapshot kept and reported; snapshot-gated dir deleted only when fully in the snapshot | Fully-Automated | C-P6-i: updater hash gate (G4) |
| `legacy-config-fallback.test.cjs` in `.claude` and `.codex` hooks (old `.vc.json` and `VC_USAGE_CACHE_PATH` still honored; `.vb.json` wins) | Fully-Automated | C-P6-h: hook fallbacks (G12) |
| `vc:*` colon-form census before/after equal; stray-form fixtures | Fully-Automated | C-P6-j: stray forms decided and proven (G3, G10) |
| `bash harness/compare-vb.sh` (label-keyed, vb- mapped list) | Fully-Automated | C-P6-e: validators not worse than baseline (G13) |

---

## Phase Loop Progress

Orchestrator reads this before deciding which subagent to spawn next. The canonical 7-step inner loop
`R → I → P → PVL → E → EVL → UP` SKIPS SPEC (the umbrella plan and the user brief act as the SPEC).

- [ ] 1. RESEARCH — research-agent (sonnet): prior phase reports read; test context loaded; plan drift checked
- [ ] 2. INNOVATE — innovate-agent (sonnet): approach decided; Decision Summary written
- [ ] 3. PLAN-SUPPLEMENT — plan-agent (sonnet): existing phase plan updated; Inner Loop Refresh Note if sections changed (or "n/a — research clean")
- [ ] 4. PVL — vc-validate-agent (sonnet): full V1-V7; validate-contract written per `.claude/skills/vc-validate-findings/references/example-validate-output.md`
- [ ] 5. EXECUTE — vc-execute-agent (opus): all checklist items done; per-section test gates run and green (or gaps documented); ends at the rename commit + restart checkpoint
- [ ] 6. EVL — vc-tester (vb-tester after the restart): all EVL gates green; follow-up stubs registered; EVL HANDOFF SUMMARY written
- [ ] 7. UPDATE PROCESS — vc-update-process-agent (vb-update-process-agent after the restart; sonnet): phase report written, umbrella state updated, commit done on main

**Validate-contract required.** If step 4 (PVL) is unchecked or `## Validate Contract` reads
"(placeholder — vc-validate-agent writes this section before EXECUTE)", the orchestrator must spawn
vc-validate-agent first. A partial contract (missing Plan updates applied / Execute-agent
instructions / Test gates) is treated as a placeholder.

---

## Test Infra Improvement Notes

- No Linux Node in WSL on this host: Hybrid gates (Trial E, e2e) need the user to install Node >= 22 in WSL; otherwise they are NOT TESTED / CONDITIONAL with a backlog stub.
- `e2e-kit-flows.test.mjs` is 0/4 via `node.exe` (Windows path handling in `bash \C:\...`); a Windows-path-safe runner is a backlog candidate.
- `.agents/skills` is a text file on this checkout (baseline red); a symlink-safe checkout note belongs in the Phase 0 baseline.

---

## Resume and Execution Handoff

- Selected plan file path: `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-06-prefix-rename_PLAN_29-10-26.md`
- Last completed step: not started (supplement cycle 2 applied to the plan, 29-10-26)
- Validate-contract status: written (29-10-26, outer-pvl cycle 4: CONDITIONAL; 1 MUST-FIX M6-3 (G18 counts the protected fixtures) in its SUPPLEMENT REQUEST); PVL supplement cycle 4 then re-run from V1 required before EXECUTE
- Supporting context files: umbrella plan, `phase-blast-radius-registry.md`, prior phase report (if any), Phase 3 `golden/signal-census.mjs`
- Next step: re-run PVL (vc-validate-agent) from V1 on this plan; then vc-execute-agent (opus) only after Gate: PASS or accepted CONDITIONAL. Registry/umbrella changes requested of the orchestrator are listed in "Supplement cycle 2" below. Before Phase 7: Claude Code restart.

---

## Validate Contract

Status: CONDITIONAL
Date: 29-10-26
date: 2026-10-29
generated-by: outer-pvl
supersedes: 2026-10-29 (outer-pvl, cycle 3, Gate: CONDITIONAL, 2 MUST-FIX) — PVL cycle 4 re-validated from V1 against the real repo; M6-1 and M6-2 are verified CLOSED; 1 NEW MUST-FIX (M6-3) and 5 RESIDUALs remain

Parallel strategy: sequential
Rationale: Signals S1, S2, S4, S6, S7 = 5/7 (HIGH label), dominant signal S6 (destructive updater/installer behavior). Sequential still fits: one deterministic script over a closed file set, fan-out only adds risk. Models: validate/plan/research = sonnet; script author + runner = opus. Note on this run: Layer 1 + Layer 2 checks were executed inline and sequentially by one validate agent (no spawn tool available); every finding below comes from real greps and runs on the real repo (node.exe v24.15.0), plus a scratch simulation of the G18 gate.

Evidence re-gathered in cycle 4 (29-10-26, task folder excluded; nothing in the repo was modified):
- M6-1 CLOSED (verified): `grep -rIlE "^[[:space:]]*author: vibecode-pro-max-kit$"` returns 19 files, all `SKILL.md`, none with CRLF, so the `$`-anchored pattern is sound; the old `^author:` form would return 0. No line with that text escapes the full-line pattern; 0 files hold `author: vibebelt-kit` today. Rule 7, the P2 before-count (> 0 assertion) and the A1 indented fixture are all in the plan text.
- M6-2 CLOSED (verified): replicated the G15b one-liner on the real `vc-manifest.json` with node.exe: new predicate = 0 offenders; the old Trial C predicate (lines 267-277 of `e2e-kit-flows.test.mjs`, confirmed) = exactly 6 offenders (`process/general-plans/{reports,references}` and 4 under `process/_seeds/`). The G15b command runs AFTER the apply (Exit Gate header), when `vb-manifest.json` exists (G2), so `./vb-manifest.json` resolves; the "adjust the manifest path to the real file" comment is cosmetic (R6-5), not an unsatisfiable gate. B3 additions (`.codex/...`, `.claude/hooks/lib/...`, `process/development-protocols/...`) all pass the new predicate. Trial C seed (lines 74-92) lists `.claude/skills/vc-team/SKILL.md` as the only vc-team file in the old snapshot, so the `snapshotGated` rule still deletes it: AC-7 holds.
- Other items re-checked on the real tree: 6 files hold `/Users/` (4 hook fixtures under `__tests__`, `vc-publish/SKILL.md` + reference); README badges `agents-15` / `skills-33` equal 15 agents / 33 skill dirs on disk; 22 `legacyDeletions` entries, 11 skill dirs not on disk (snapshotGated class confirmed); `install.sh` `REPO=` on line 11; hooks lib has 5 reader files in both trees; `.gitignore` holds only `.vc-version` and `.vc-publish-config`; plan structure validator: 0 failures (2 advisory warnings).
- NEW defect M6-3 (G18 is unsatisfiable as written; found by simulating it): A1 requires the fixture `in/` tree to hold the full lines `author: vibecode-pro-max-kit` (and the indented form), and `out/` to hold `author: vibebelt-kit`. `scripts/fixtures/rename-prefix/**` is in the protected set, so the apply never rewrites it. G18 runs `grep -rIlE "$AP" . --exclude-dir=.git --exclude-dir=vibebelt-rebrand_29-10-26` with NO fixture exclusion (unlike G7/G9/G10, which use `$SCAN`). After the apply the old-text count is therefore >= 1 (the `in/` fixtures) instead of 0, and the new-text count is 19 + (fixture `out/` files) instead of 19. Scratch simulation (1 real file, 1 `in/` fixture, 1 `out/` fixture): old-after = 1, new-after = 2, G18 exit 1; the same command with fixtures excluded exits 0. The before-count in P2 (taken before the tool exists) is unaffected, so the defect is purely in the after-side greps of G18.

Test gates (C3 5-column table):

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P6-a | Rename tool: dry-run writes nothing; apply matches expected tree; second apply prints `RESULT edits=0 renames=0`; all stray-form rows and protection mechanisms behave as decided | Fully-Automated | `$NODE scripts/test-rename-prefix.mjs` (G3); `$NODE scripts/rename-prefix.mjs --dry-run \| tail -1` (G0) | B (A1-A3) |
| C-P6-b | Tool refuses a dirty tree, never follows symlinks, never leaves the root | Fully-Automated | fixture safety cases inside G3 | B (A2/A3) |
| C-P6-c | Resolver independent of manifest version | Fully-Automated | G11 accumulate-until-end parse | B (B0, Entry Gate 2) |
| C-P6-d | Four uppercase signals mapped 1:1 `VC-` to `VB-` | Fully-Automated | G9 census diff after `sed 's/VC-/VB-/'` | B (C1) |
| C-P6-e | Validators not worse than baseline under `vb-` paths; no stray prefix | Fully-Automated | G13 `bash $H/compare-vb.sh`, G18b, G14, G5 + G7 allowlist diffs | B (C3b) |
| C-P6-h | Hook config and env fallbacks still honored | Fully-Automated | G12 `legacy-config-fallback.test.cjs` x2 | B (B2) |
| C-P6-i | Updater hash gate: matching deleted; modified/unknown/no-snapshot kept and reported | Fully-Automated | G4 `scripts/test-compute-sync-plan.mjs` | B (B4) |
| C-P6-j | Stray forms decided and proven | Fully-Automated | G3 fixtures + G10 colon census | B (A1, Purpose table) |
| C-P6-author | `author: vibecode-pro-max-kit` renamed in every SKILL.md, indented form included | Fully-Automated | G18 (non-zero before-count, 19 expected; after-greps must exclude the protected fixtures) | B - see SUPPLEMENT REQUEST M6-3 |
| C-P6, C-SAFE-1 | Old install to new install: unmodified old files removed, modified kept and reported, custom skills kept, state files migrated | Hybrid | Trial E via G15; precondition Linux Node >= 22 | B (B5); NOT TESTED + CONDITIONAL if Linux Node absent |
| C-P6-f | Install/update/publish flows incl. Trial C (AC-5 via G15b, AC-7) | Hybrid | `$NODE e2e-kit-flows.test.mjs` (G15) and G15b; precondition Linux Node >= 22 for G15 | B (M6-2 verified closed) |
| C-P6-g | Fresh session resolves renamed `vb-*` agents and skills | Agent-Probe | after restart: spawn `vb-research-agent`, invoke `vb-context-discovery` | C (restart checkpoint C7); D if unreachable |
| C-P6 + C-SAFE-1 | Destructive-write evidence pack complete | Hybrid | five artifacts in `harness/` (P3, C6) | B |

Failing stubs (Fully-Automated rows only, to be turned green by EXECUTE):
- Row C-P6-a: `test("should rename vc- to vb- idempotently with dry-run and protected inputs", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should rename vc- to vb- idempotently with dry-run and protected inputs") })`
- Row C-P6-b: `test("should refuse a dirty tree and never follow symlinks or leave the root", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should refuse a dirty tree and never follow symlinks or leave the root") })`
- Row C-P6-c: `test("should resolve the same file list regardless of manifest version", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should resolve the same file list regardless of manifest version") })`
- Row C-P6-d: `test("should map the four uppercase VC- signals to VB- one to one", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should map the four uppercase VC- signals to VB- one to one") })`
- Row C-P6-e: `test("should keep the validator suite no worse than baseline under vb- paths", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep the validator suite no worse than baseline under vb- paths") })`
- Row C-P6-h: `test("should still honor an old .vc.json and VC_USAGE_CACHE_PATH", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should still honor an old .vc.json and VC_USAGE_CACHE_PATH") })`
- Row C-P6-i: `test("should delete only hash-matching legacy files and keep modified or unknown ones", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should delete only hash-matching legacy files and keep modified or unknown ones") })`
- Row C-P6-j: `test("should leave vc: colon forms unchanged and rename vc plan uncheck", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should leave vc: colon forms unchanged and rename vc plan uncheck") })`
- Row C-P6-author: `test("should rename indented author: vibecode-pro-max-kit lines and report a non-zero count", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should rename indented author: vibecode-pro-max-kit lines and report a non-zero count") })`

Legacy line form (retained so existing consumers still parse):
- Rename tool: [Fully-automated: fixtures via `$NODE scripts/test-rename-prefix.mjs`, dry-run/apply/idempotent]
- Resolver version independence: [Fully-automated: accumulate-chunks parse of resolve-manifest --json at 1.0.0]
- Signal census and colon census: [Fully-automated: G9/G10 on the `--list-scan-files` set]
- Validators: [Fully-automated: `bash $H/compare-vb.sh`, label-keyed]
- compute-sync-plan hash gate: [Fully-automated: `scripts/test-compute-sync-plan.mjs`]
- Upgrader safety and e2e flows: [hybrid: Trial E / `e2e-kit-flows.test.mjs`; precondition Linux Node >= 22]
- Renamed agents resolvable: [agent-probe: new session after restart] | [known-gap: documented until the restart is done]

Dimension findings:
- Infra fit: PASS — resolver, hooks, state files, manifest chain, AC-5 predicate and Trial C seed all match the real files.
- Test coverage: CONCERN — M6-3 (G18 counts the protected fixtures, so it cannot reach 0 / 19 after the apply).
- Breaking changes: PASS — hook/env/state fallbacks, hash gate and snapshot gate are designed and tested; pre-baseline kit versions are a named residual.
- Security surface: PASS — lstat, root confinement, dirty-tree refusal, hash gate at four sites, protected set, evidence pack.
- Entry Gate / Preflight: PASS — P2 before-count is non-vacuous (19).
- Section A (build the tool): CONCERN — M6-3 only (fixtures vs G18); rule 7 itself is correct.
- Section B (upgrade safety): PASS — M6-2 closed; G15b satisfiable after the apply.
- Section C (apply): PASS — commit-then-tag order, crash recovery, C3b mapping, restart checkpoint.

Open gaps:
- MUST-FIX: M6-3 G18 after-greps must exclude the protected fixture tree.
- RESIDUAL (not counted as CONCERN/FAIL; carried as Known Gaps below): R6-1, R6-2, R6-3, R6-4, R6-5.

Known Gaps (RESIDUAL, bounded, each with a backlog stub; excluded from the gate count):
- R6-1 known-gap: installs from kit versions OTHER than `upstream-baseline` keep any locally different `vc-*` file next to the new `vb-*` one (kept + reported, never deleted); proven only for the baseline content; backlog stub, release-note sentence in Phase 8.
- R6-2 known-gap: cosmetic residuals not matched by any rule: `subagent-init.cjs` line 61 "Fallback: if `vc` unavailable" (bare `vc`), prose `VC harness` (5), identifiers `vcTeamDir`/`hasVcSkills`, `author: vibecode` (3 skills); list them in the phase report; no behavior depends on them.
- R6-3 known-gap: Hybrid gates (Trial E, e2e) and file-list comparisons need Linux Node >= 22 in WSL (USER action); if absent they are NOT TESTED and the gate stays CONDITIONAL; backlog stub.
- R6-4 known-gap: `compare-vb.sh` must be run with the repo root as the working directory (the copied Phase 0 `compare.sh` calls `git rev-parse --show-toplevel`); note it in the helper header; macOS/native Windows behavior of the renamed installer is carried by Phase 8.
- R6-5 known-gap: cosmetic wording: the G15b comment "adjust the manifest path to the real file" and the Blast Radius mention of `export-benchmark-kit.mjs` at the repo root (the real path is `.claude/skills/vc-audit-vc/scripts/export-benchmark-kit.mjs`, covered by the apply); the executor fixes the wording in the phase report; no gate depends on it.

What This Coverage Does NOT Prove:
- Fixture test: does not prove the real repo has no computed `vc-` strings (concatenation); only the reviewed dry-run and the sweeps cover that.
- Sweeps and censuses: prove text, not that a Claude Code or Codex session loads `vb-` agents (Agent-Probe row, after restart).
- compute-sync-plan unit test and Trial E: prove behavior for `upstream-baseline` content only, not installs from other historic kit versions, and not Windows/macOS.
- Validator suite under node.exe: structure and wiring on Windows-style paths; Linux-path behavior needs Linux Node.
- Hash gate: byte-identity to the baseline blob, not that a kept (modified) legacy file still works beside its `vb-` replacement.
- G18 (once repaired): counts author lines outside the protected fixtures, not whether any other metadata field still carries the old brand.
- G15b: the shape of the legacy entries (namespace prefix), not that each entry is safe to delete (that is the hash/snapshot gate, G4 and Trial E).

Execute-agent instructions:
- E1: Do not start EXECUTE until the SUPPLEMENT REQUEST item (M6-3) is in the plan and this contract is re-issued with PASS (or an accepted CONDITIONAL after at least one more supplement cycle).
- E2: Commit the tool, fixtures, B-step edits and allowlists as their own commit BEFORE `--apply`; tag `pre-vb-rename` on that commit; never run `--apply` before the reviewed `--dry-run` output is saved to the phase report.
- E3: Use sandboxes on the Linux filesystem (not `/mnt/c`) for Trial E and e2e; use Linux Node for any file-list comparison.
- E4: Never edit `legacyDeletions` or `legacy-hashes.json` by hand; generate both from `git ls-tree -r upstream-baseline` and the pre-existing manifest entries.
- E5: Do not lower or edit a validator to make the rename pass; do not touch `baseline/` files; use the `harness/` mapping layer.
- E6: Take the author-line before-count with the indentation-tolerant pattern before the tool exists and assert it is greater than 0 (expected 19); any after-count must not include `scripts/fixtures/**` or the tool sources.

Plan updates applied: none (outer PVL; changes requested through the SUPPLEMENT REQUEST below).
Autonomous Goal Block: not written here (BRANCH B: the umbrella plan carries `## Stable Program Goal`, so the umbrella /goal governs).
Gate: CONDITIONAL (0 FAILs; 1 MUST-FIX CONCERN; 5 RESIDUAL known-gaps; M6-1 and M6-2 closed)
Accepted by: none — no concern is accepted; PHASE_COMPLETE: VALIDATE is not emitted. Named concern: M6-3 G18 after-greps count the protected rename fixtures.

SUPPLEMENT REQUEST:
- Gap M6-3: Section exit-gate (G18) | Concern: G18's after-greps (`grep -rIlE "$AP" ...` must be 0; `grep -rIlE "$AN" ...` must equal the before-count) scan the whole repo with only `.git` and the task folder excluded, but A1 requires `scripts/fixtures/rename-prefix/in` to contain `author: vibecode-pro-max-kit` and `.../out` to contain `author: vibebelt-kit`, and that tree is in the protected set (never rewritten); so after the apply the old-text count is >= 1 and the new-text count is 19 + fixture files, and G18 cannot exit 0 (simulated: old-after 1, new-after 2, rc 1; excluding the fixtures gives rc 0) | Severity: CONCERN (MUST-FIX) | Suggested addition: both after-greps in G18 add `--exclude-dir=fixtures` (or `--exclude-dir=scripts`), and a note that the before-count in P2 is taken before the tool exists so it is unaffected

Next step: PVL supplement cycle (vc-plan-agent PVL-supplement mode, one gate edit), then re-validate from V1. Not routed to EXECUTE.

---

## Supplement cycle 1

Date: 29-10-26 | Mode: PVL-supplement | Gaps addressed: 8 of 8 (Gap 1-8) | Validate contract above is kept as the first-pass record; re-validate from V1.
- Gap 1 -> Entry Gate item 2 and checklist B0 (resolver glob-mode-by-shape, fixture at 1.0.0) plus an Exit Gate command.
- Gap 2 -> B3 + B4 (hash list from `upstream-baseline`, user-modified check built, both namespaces accepted by `isKitOwned`, install.sh case guard and e2e assertion).
- Gap 3 -> B1 (manifest rename with all readers in one apply) + B2 (state files and env vars: read-new-else-old, write new, migrate) + B5 (Trial E).
- Gap 4 -> A1/A2 (case-sensitive explicit rules, `\n` and `_` preceders, `dvc-` deny, uppercase `VC-` -> `VB-` mapped atomically, lstat, dirty-tree and outside-root refusal, content-then-paths order); Public Contracts corrected.
- Gap 5 -> allowlist files + exit-gate commands with expected values; `ls | grep -c` exit-code trap fixed by comparing the count.
- Gap 6 -> Entry Gate (clean tree, tag `pre-vb-rename`), Rollback, restart checkpoint C7, Node prerequisite as a user action, Trial C fixtures protected.
- Gap 7 -> Blast Radius expanded; decision LOCKED: all of `VC_*`, `.vc.json`, `vc plan check` are renamed with old-name fallbacks (not kept as residuals).
- Gap 8 -> P3 and C6 evidence pack via `vc-risk-evidence-pack` in `harness/`; verification row added.
- Registry change needed (owned by another agent): Phase 6 line should list the new files and the expanded set above (see Blast Radius).


---

## Supplement cycle 2

Date: 29-10-26 | Mode: PVL-supplement | Gaps addressed: 7 of 7 | The Validate Contract above is the cycle-2 record; re-validate from V1. Line numbers cited were verified with grep on 29-10-26 (install.sh 337-380 legacy block with `rm -rf` at 365, stale block ~225-280; e2e lines 21, 34, 74-92, 241-245, 267-277; `subagent-init.cjs` line 60 in both trees; hook files: 5 per tree).
- Gap 1 -> Entry Gate 3 (task-folder-excluded clean check, no early tag), C1/C1b/C2/C2b/C2c/C3 reordered: tool and allowlists are committed (`feat: add rename tool and upgrade safety`) BEFORE the tag `pre-vb-rename`; rollback and crash recovery (`git reset --hard HEAD && git clean -fd -e <task folder>`) added; the rename commit stays the last execution commit.
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
