---
name: plan:vibebelt-rebrand-phase-02-identity-distribution
description: "vibebelt-kit rebrand — Phase 02: Identity and distribution"
date: 29-10-26
metadata:
  node_type: memory
  type: plan
  feature: general-plans
  phase: phase-02
---

# Phase 02 — Identity and distribution

**Program:** vibebelt-rebrand
**Umbrella plan:** process/general-plans/active/vibebelt-rebrand_29-10-26/vibebelt-rebrand-umbrella_PLAN_29-10-26.md
**Phase status:** ⏳ PLANNED
**Complexity:** COMPLEX
**Report destination:** process/general-plans/active/vibebelt-rebrand_29-10-26/phase-02-identity-distribution_REPORT_29-10-26.md (flat in the program task folder)

---

## Overview

One phase of the vibebelt-rebrand program; program context lives in the umbrella plan. Context router: process/context/all-context.md (created in Phase 0). Test routing: process/context/tests/all-tests.md (load before assigning tiers).

Date: 29-10-26
Status: PLANNED
Complexity: COMPLEX

## Purpose

Make the kit visibly and technically yours: replace every `withkynam` / `flowser` reference with the new repo identity (`https://github.com/Tomwakeupat530amm/vibebelt-kit`), replace hotlinked third-party images (tenor, skillicons) with files in the repo, reset the version to 1.0.0 and record the fork origin. Upstream credit stays (attribution lines are allowed to keep the old names).

---

## Entry Gate

- Phase 1 exit gate green.
- Path variables used below: `P=process/general-plans/active/vibebelt-rebrand_29-10-26`, `B=$P/baseline`, `EX=":!$P"`.
- `bash $B/compare.sh; echo $?` prints `0` (nothing worse than the Phase 0 baseline; if it exits 3 the runtime changed: re-baseline per Phase 0 B3 first).
- REGENERATE the resolver reference now (Phase 1 added one managed script, `.claude/skills/vc-audit-vc/scripts/validate-model-effort-policy.mjs`, so the Phase 0 list is stale): after the Phase 1 commit and BEFORE any Phase 2 edit run BOTH `node resolve-manifest.mjs | sort > $B/resolved_p2_start.node.txt` (Linux node v22.23.4, the default baseline runtime) and `node.exe resolve-manifest.mjs | sort > $B/resolved_p2_start.node-exe.txt` (the file name carries the runtime) and save the start commit: `git rev-parse HEAD > $B/p2_start.txt`. Prove the only difference from the Phase 0 list is that one script: `diff <(tr '\\' '/' < $B/resolved_before.node-exe.txt | sort) <(tr '\\' '/' < $B/resolved_p2_start.node-exe.txt | sort) | grep -c '^[<>]'` prints `1` and the same command ending in `| grep -c 'vc-audit-vc/scripts/validate-model-effort-policy.mjs$'` prints `1`. Record that diff in the report. Before and after lists must always be made by the SAME runtime; never compare a `node.exe` list with a Linux one.
- Runtime: Linux `node` v22.23.4 (`~/.local/bin/node`) IS installed and is the default baseline runtime (`compare.sh` default; `validators_*.tsv`); `node.exe` also exists and has its own saved pair (`*.node-exe.*`). Run each gate with ONE runtime and compare only against the reference saved by that same runtime; every `node.exe` below may be run as `node` against the matching `.node.txt` list. Gates that need a runtime they cannot get (`e2e-kit-flows.test.mjs` Trial C is baseline-red, Phase 6 B4) are recorded `baseline-red` / `NOT TESTED`, never passed by assumption.

---

## Strategy Recommendation (vc-agent-strategy-compare)

- Signals: S6 yes (installer/update distribution contract), S7 yes (about 45 files across install, scripts, docs, 9 translations) — score about 3/7 (MEDIUM).
- Recommended: **Parallel subagents**, 4 disjoint groups: (a) `install.sh` + `resolve-manifest.mjs` + `vc-manifest.json` + `vc-update/**` + `vc-publish/**` + `vc-setup/SKILL.md`; (b) community docs: SECURITY x6, FUNDING delete, ISSUE_TEMPLATE (config.yml and 1.bug_report.yml), `docs/GITHUB-*.md`, `docs/GOOD-FIRST-ISSUES.md`, `MIGRATION.md`, `CONTRIBUTING.md`, 5 CONTRIBUTING translations, `welcome.yml`, `release.yml`; (c) `README.md` + `CHANGELOG.md` + `assets/`; (d) the 9 `docs/i18n/README.*.md` by ONE replacement script (no hand translation). Ordering rule: group (c) and (d) do NOT write version text (`1.0.0` badge, CHANGELOG entry) until group (a) has fixed the resolver (step C1) and gate R2.5 is green; identity/image edits in (c)/(d) may run in parallel with (a). Research/plan/validate = opus (front-matter); the four implementing subagents = opus. Agent count 4 (Layer 1) + 3 (Layer 2) + 4 implementers = 11, under the 30-agent guard. Alternative: sequential.

---

## Blast Radius

- Group (a): `install.sh` (REPO variable and banner), `resolve-manifest.mjs`, `vc-manifest.json` (`version`), `.claude/skills/vc-update/SKILL.md` and `.claude/skills/vc-update/references/vc-update.md`, `.claude/skills/vc-publish/SKILL.md` and `.claude/skills/vc-publish/references/vc-publish.md`, `.claude/skills/vc-setup/SKILL.md`, `e2e-kit-flows.test.mjs` (header comment/display name only)
- Group (b): `SECURITY.md` and `docs/i18n/SECURITY.*.md` (5), `.github/FUNDING.yml` (DELETE), `.github/ISSUE_TEMPLATE/config.yml`, `docs/GITHUB-*.md` (including `docs/GITHUB-SETTINGS.md`; line about 102 documents the welcome message and changes together with `welcome.yml`), `docs/GOOD-FIRST-ISSUES.md`, `MIGRATION.md`, `CONTRIBUTING.md`; NEW in cycle 5 (M2-1): `process/context/all-context.md` lines 154 (flowser-logo.svg mention) and 210 (withkynam URL note) ONLY (lines 137 and 168 `3.2.5` stay for UPDATE PROCESS; line 179 belongs to Phase 1; Phase 0 owns the rest of the file); NEW in cycle 2 (display name `vibecode-pro-max-kit` -> `vibebelt-kit` and clone URLs -> new repo only; workflow behavior unchanged): `docs/i18n/CONTRIBUTING.{ja-JP,ko-KR,pt-BR,vi-VN,zh-CN}.md` (5 files, 30 lines; WhatsApp bullet also removed, B2c), `.github/workflows/welcome.yml` (2 lines; WhatsApp sentence/line also removed, B2c), `.github/workflows/release.yml` (1 line), `.github/ISSUE_TEMPLATE/1.bug_report.yml` (1 line) = 34 lines in 8 files beyond the earlier list
- Group (c): `README.md` (ALL old-name lines, not only header/badges: lines about 16-21, 86-91, 148, 221, 1705-1730), `CHANGELOG.md`, `assets/flowser-logo.svg` (DELETE), `assets/` (new files only if a license is recorded)
- Group (d): `docs/i18n/README.*.md` (9 files). Strict order note: Phase 7 edits these same files AFTER Phase 2 (never in parallel).
- NOT touched (UNCHANGED, gate R2.8): `.claude/skills/vc-audit-vc/scripts/validate-kit-portability.mjs`; the brand-detection lines in `vc-publish/SKILL.md` (lines about 216, 220, 238) and `vc-publish/references/vc-publish.md` (about 134, 140, 163). That is 11 brand-detection lines in total: validator 5 (lines 8, 93, 97, 106, 118), vc-publish SKILL 3, vc-publish reference 3.
- Program evidence folder: `baseline/resolved_p2_start.<runtime>.txt`, `baseline/p2_start.txt` (NEW, written at the Entry Gate).
- Left for Phase 6 (owned by Phase 6; hand-off line in the report): `author: vibecode-pro-max-kit` skill metadata in about 33 files. Phase 6 replaces it with `author: vibebelt-kit` through an explicit rename rule.

---

## Implementation Checklist

### Step A — Inventory (re-scoped)

- [ ] A1. Run and save to the phase report as the full to-do list: `grep -rIn "withkynam\|flowser" . --exclude-dir=.git --exclude-dir=process`; `grep -rIn "vibecode-pro-max-kit" . --exclude-dir=.git --exclude-dir=process`; `grep -rIn "tenor\|skillicons" README.md docs`; `grep -rn "FUNDING.yml\|mailto:" . --exclude-dir=.git --exclude-dir=process`. Confirm the file list equals the Blast Radius above (expected about 245 old-name hits in 27 files at the Phase 2 start; the display-name grep `grep -rIn "vibecode-pro-max-kit" . --exclude-dir=.git --exclude-dir=process | grep -v "author: vibecode-pro-max-kit"` is expected to hit exactly the files in the Blast Radius including the 9 added in cycle 2); a file with hits outside the Blast Radius = stop and update the registry first.

### Step B — Replace identity

- [ ] B0. Tag convention: every intentionally remaining old-name line carries the literal text `upstream-attribution` (HTML comment `<!-- upstream-attribution -->` in Markdown, `# upstream-attribution` in shell/yaml, `// upstream-attribution` in `.mjs`). Allowed set: LICENSE, the README fork/credit line, CHANGELOG fork-origin note and upstream history lines, and the 11 brand-detection lines (E3: `BRAND_RE`, `BRAND_ALLOWLIST_MARKERS`, `BRAND_LITERAL_MARKER` in the portability validator, lines 8, 93, 97, 106, 118, and the grep/echo lines in the two vc-publish files: SKILL.md 216, 220, 238 and vc-publish.md 134, 140, 163). Do not tag brand-detection lines (they are matched by the grep allowlist markers in R2.1: `flowser|CloakBrowser`, `flowser\|CloakBrowser`, `flowser\|tRPC`, `author: flowser`).
- [ ] B0b. Umbrella SWEEP RULE (copied verbatim from the umbrella, Global Constraints; the umbrella is canonical): SWEEP RULE (canonical wording lives here; Phase 2 and Phase 6 implement it, see their gates): search the whole repo EXCLUDING `.git`, the program task folder `process/general-plans/active/vibebelt-rebrand_29-10-26/` (and its archived copy), `baseline/`, `golden/`, the rename script + its fixtures, `CHANGELOG.md` and `MIGRATION.md` (WHOLE-FILE protection: Phase 6 implements the history rule as a protected set, not as marker regions; in Phase 2 their old-identity lines are instead tagged `upstream-attribution`), and `legacyDeletions`. Old-identity lines that legitimately remain are only: (1) lines carrying the literal tag `upstream-attribution`; (2) the brand-detection lines in `.claude/skills/vc-audit-vc/scripts/validate-kit-portability.mjs`, `.claude/skills/vc-publish/SKILL.md` and `.claude/skills/vc-publish/references/vc-publish.md`. Phase 2 may additionally exclude the whole `process/` directory ONLY because at Phase 2 time `process/` holds no kit text beyond the task folder and Phase 0 generated context; its gate adds `grep -rIn "withkynam\|flowser" process --exclude-dir=vibebelt-rebrand_29-10-26` and expects no output. MECHANISM IMPLEMENTED BY PHASE 2: `CHANGELOG.md` and `MIGRATION.md` are NOT excluded from gate R2.1; their old-identity lines are instead TAGGED `upstream-attribution` (B0/B4/C2), which is the stricter variant. Phase 6 protects the same two files whole.
- [ ] B1. Group (a) identity: `install.sh` line 11 -> `REPO="https://github.com/Tomwakeupat530amm/vibebelt-kit.git"` (the full `.git` URL form; gate R2.7); same URL in `vc-update/SKILL.md` (line about 46 `KIT_SOURCE` default, about 356 MIGRATION link), `vc-publish/SKILL.md` (about 22, 342), `vc-publish/references/vc-publish.md` (about 15, 210), `vc-setup/SKILL.md`. The skills are still named `vc-update`/`vc-publish`/`vc-setup` until Phase 6. The portability validator is NOT edited (it has no REPO value; its patterns are brand-LEAK detection and editing them would lower a check).
- [ ] B2. Group (b) community docs: SECURITY.md + 5 translations -> reporting channel = GitHub private vulnerability reporting `https://github.com/Tomwakeupat530amm/vibebelt-kit/security/advisories/new` (LOCKED; no email invented, no `mailto:`); `.github/ISSUE_TEMPLATE/config.yml` links -> new repo; `docs/GOOD-FIRST-ISSUES.md` replace the 15 `@withkynam` assignee mentions with `@Tomwakeupat530amm` (so the old owner is no longer notified); `MIGRATION.md`, `CONTRIBUTING.md`, `docs/GITHUB-*.md` URLs/handles -> new identity. DELETE `.github/FUNDING.yml` (plain file delete) and in the SAME commit fix `docs/GITHUB-SETTINGS.md` line about 66 ("Sponsorship ENABLE, linked to FUNDING.yml" -> "Sponsorship: leave OFF (the kit has no funding file)") and remove line about 125 ("requires `.github/FUNDING.yml` from Phase 2") entirely. No remaining file may contain the literal string `FUNDING.yml` after this step (gate R2.10); the replacement text must not contain it either.
- [ ] B2b. (USER DECISION, locked: the old owner's WhatsApp invite is REMOVED, see B2c.) Display-name files added in cycle 2: `docs/i18n/CONTRIBUTING.{ja-JP,ko-KR,pt-BR,vi-VN,zh-CN}.md` (one regex replacement script, same approach as B6, no hand translation), `.github/workflows/welcome.yml`, `.github/workflows/release.yml`, `.github/ISSUE_TEMPLATE/1.bug_report.yml`: replace the display name `vibecode-pro-max-kit` with `vibebelt-kit` and any clone/repo URL with the new repo URL; change nothing else (triggers, permissions, steps, job names stay). Update `docs/GITHUB-SETTINGS.md` line about 102 (the documented welcome message) in the SAME commit as `welcome.yml` so doc and workflow agree. `python3 -c "import yaml,sys; [yaml.safe_load(open(f)) for f in sys.argv[1:]]; print('ok')" .github/workflows/welcome.yml .github/workflows/release.yml .github/ISSUE_TEMPLATE/1.bug_report.yml` must print `ok`. ORDERING GATE: the `release.yml` display-name edit runs AFTER Phase 1's validator-step additions to `release.yml` (Phase 1 E4) and must not remove them: at Phase 2 exit the validator step names Phase 1 added are still present in `release.yml` (reuse Phase 1's name loop from its Exit Gate, run over `release.yml`; it prints nothing).
- [ ] B3. Group (c) README.md: remove the Flowser logo block (lines about 16-21: flowser.ai link, `assets/flowser-logo.svg`, tagline "AI Agents with computers for GTM") and replace it with ONE tagged credit line, for example "Forked from vibecode-pro-max-kit by withkynam (MIT). <!-- upstream-attribution -->". Do NOT vendor or reuse the Flowser logo; DELETE `assets/flowser-logo.svg` and record the choice. Replace badges (lines about 86-91), install one-liners (about 148, 221) and links/contributors/star-history (about 1705-1730) with the new repo URL; dynamic remote badges (shields.io, contrib.rocks, star-history) stay remote and are allowlisted in R2.3.
- [ ] B2c. REMOVE the old owner's WhatsApp invite (`chat.whatsapp.com/E42ySo6iGmuAyeh25eAXuu`, verified by grep: 8 link lines in 7 files (`CONTRIBUTING.md:20`, five `docs/i18n/CONTRIBUTING.*.md:18`, `welcome.yml:25` and `:32`) + 1 doc line in `docs/GITHUB-SETTINGS.md:104`). Edits, keeping surrounding text well-formed: (1) `CONTRIBUTING.md:20` and `docs/i18n/CONTRIBUTING.{ja-JP,ko-KR,pt-BR,vi-VN,zh-CN}.md:18`: delete the whole `- **WhatsApp ...:** [...](https://chat.whatsapp.com/...)` bullet (the next bullets, GitHub Issues and Discussions, stay); (2) `.github/workflows/welcome.yml`: issue-message, delete the sentence "In the meantime, feel free to join the community on WhatsApp: <link>" (keep "A maintainer will take a look shortly."); pr-message, delete the final line "Join the community on WhatsApp: <link>" and the blank line before it; keep the block scalars `|` indented consistently; (3) `docs/GITHUB-SETTINGS.md:104`: remove ", link to WhatsApp community" from the Content cell and keep the table row intact. No replacement channel is added; a replacement community channel is a user backlog item (written into the backlog stub at UPDATE PROCESS). Run the R2.11 YAML parse check after (welcome.yml must print ok).
- [ ] B4. Display name: replace `vibecode-pro-max-kit` with `vibebelt-kit` in README title (line about 25), `install.sh` banner (lines about 4 and 29), `CONTRIBUTING.md`, `CHANGELOG.md` header, `MIGRATION.md`, comment headers of `resolve-manifest.mjs` and `e2e-kit-flows.test.mjs`, and the 9 files listed in B2b. Lines that deliberately keep the old name carry the `upstream-attribution` tag. The `author: vibecode-pro-max-kit` skill metadata (about 33 files) stays and is handed to Phase 6/5 with an explicit hand-off line in the phase report.
- [ ] B5. Images: DROP the tenor GIF (third-party copyrighted clip; do not vendor); replace the three skillicons rows by a plain text stack list (no remote icon service) unless each icon file is vendored with its license recorded in the report; if any license is unclear use text. State in the report that shields.io, contrib.rocks and star-history badges are dynamic remote images and stay remote (allowlist in R2.3).
- [ ] B6. Group (d): one replacement script (kept in the phase report, not committed) applies the SAME edits as B3/B4/B5 to the 9 `docs/i18n/README.*.md` (same lines as README.md); no hand translation; Phase 7 owns their later content.

- [ ] B7. (M2-1) `process/context/all-context.md`, edit ONLY these two lines, BEFORE the `process/` grep of the Exit Gate; first re-read both lines (`sed -n '154p;210p' process/context/all-context.md`) and keep the surrounding text/indent: (1) line 154 (`assets/  -- flowser-logo.svg`): after B3 the logo file is deleted, so the entry must say `assets/` holds no vendored media (or only the files really left in `assets/`), with no old name in it; (2) line 210 ("The kit's GitHub repo URL is not yet set (installer and README still point at upstream `withkynam/...`)"): rewrite to say the installer `REPO` and the README now point at `https://github.com/Tomwakeupat530amm/vibebelt-kit`, which the user creates in Phase 8. Do NOT touch line 137 or 168 (`3.2.5` version facts: refreshed by UPDATE PROCESS), line 179 (Phase 1) or anything else in the file. After the edit run `grep -rIn "withkynam\|flowser" process/context` (expect nothing), `node .claude/skills/vc-generate-context/scripts/validate-all-context.mjs` (not worse than the Phase 0 baseline) and `node .claude/skills/vc-context-discovery/scripts/discover-context.mjs --check-routing` (exit 0); the routing block between the `GENERATED:routing` markers is not edited by hand.

### Step C — Resolver fix, then version and origin (order matters)

- [ ] C0. Use `$B/resolved_p2_start.node-exe.txt` (created at the Entry Gate, AFTER the Phase 1 commit and before any edit) as the R2.5 reference. `$B/resolved_before.node-exe.txt` (Phase 0) is used only to show the Phase 1 delta is exactly the new validator script. Both before and after lists are produced by the same runtime (`node.exe` here).
- [ ] C1. Group (a) FIRST: in `resolve-manifest.mjs` (line about 68 `const useGlob = semverGte(version, "2.1.0")`) choose glob mode by manifest SHAPE (`Array.isArray(manifest.include)`) instead of the version comparison; behavior stays identical for the current manifest and for old-format manifests. Update the lines in `vc-update/references/vc-update.md` that say "version >= 2.1.0 means glob format" to say the format is detected from the manifest shape. Gate R2.5 must be green at the OLD version (3.2.5) before C2.
- [ ] C2. After C1: `vc-manifest.json` version -> `1.0.0`; README badge (line about 91) -> `version-1.0.0`; `CHANGELOG.md`: new top entry `## [1.0.0]` with a "Fork origin" note naming the upstream project (tagged `upstream-attribution`), the `upstream-baseline` tag, and the fact that users of upstream 3.x who run the update skill will see a downgrade warning (expected for a fork). Keep the old history below, labelled "Upstream history" (hit lines tagged). This `## [1.0.0]` entry is the ONLY one in the program: Phase 8 EXTENDS it (adds release notes content to it) and must not create a second `## [1.0.0]`.
- [ ] C3. Keep upstream attribution (LICENSE original line, README credit line); re-run R2.5 and R2.6 after the bump.

### Step D — Settings only the user can change (no API calls)

- [ ] D1. Record in the `docs/GITHUB-SETTINGS.md` checklist: enable "Private vulnerability reporting" (SECURITY links depend on it), enable Discussions (ISSUE_TEMPLATE link depends on it), keep Sponsorship OFF. Write the backlog stub `process/general-plans/backlog/github-settings-user-run_NOTE_29-10-26.md` listing these three items for the Phase 8 user-run known-gap list. The live links stay dead until the user creates the repo (Phase 8).

### Step E — Report

- [ ] E1. Phase report lists: every `upstream-attribution` line (for the R2.13 review), the license of every file in `assets/` (or "none vendored"), the image decisions, and the registry hand-off lines.

---

## Exit Gate

Phase 1 owns the README/i18n model facts and runs first: this phase's identity and distribution edits MUST leave those sites untouched (feature cell, OPUS/SONNET diagram and table, agent-table model column, the 'premium AI model' bullet).

**Supplement gate (Phase 1 claim grep still prints nothing at this phase's exit; exact grep copied from the Phase 1 Exit Gate, R1.11/R1.12):**

```bash
R='EXECUTE = opus; every other phase|only (the )?(EXECUTE|coding|code-writing)|every other phase = sonnet|all other vc-agents sonnet|EXECUTE only|only (the )?\*coding\* agent|opus ONLY|\(sonnet\)|expensive model only writes|premium AI model only'
grep -rnIE "$R" CLAUDE.md AGENTS.md process/development-protocols/orchestration.md process/development-protocols/implementation-standards.md process/development-protocols/*system-behavior/0[478]-*.md .claude/skills/v[cb]-agent-strategy-compare/SKILL.md process/context/all-context.md README.md   # Expected: no output
for f in README.md docs/i18n/README.*.md; do for a in research plan validate; do grep -E "^\| [^|\`]*\`v[cb]-${a}-agent\` \|" $f | grep -qE "^\| [^|]*\| \*{0,2}opus\*{0,2} \|" || echo "RED $f $a"; done; done   # Expected: no output (backticks escaped; `bash -n` clean; prints 30 RED lines before Phase 1 and none after it)
```

Run from the repo root. Linux `node` v22.23.4 is installed and is the default baseline runtime; the lines below are written with `node.exe` and may be run as `node` against `resolved_p2_start.node.txt`. Use the SAME runtime for a resolver run and its reference list (never mix). Paste the variable block first (a fresh tester shell has none of them):

```bash
P=process/general-plans/active/vibebelt-rebrand_29-10-26
B=$P/baseline
EX=":!$P"
P2_START=$(cat $B/p2_start.txt)
VAL=.claude/skills/vc-audit-vc/scripts/validate-kit-portability.mjs
# R2.1 old identity only in tagged / brand-detection lines (11 brand-detection lines, incl. the flowser\|tRPC form)
grep -rIn "withkynam\|flowser" . --exclude-dir=.git --exclude-dir=process | grep -vF -e 'upstream-attribution' -e 'flowser|CloakBrowser' -e 'flowser\|CloakBrowser' -e 'flowser\|tRPC' -e 'author: flowser'   # Expected: no output
# R2.1b process/ stays clean (after B7 edited all-context.md lines 154 and 210; B7 runs before this)
grep -rIn "withkynam\|flowser" process --exclude-dir=vibebelt-rebrand_29-10-26   # Expected: no output
node .claude/skills/vc-generate-context/scripts/validate-all-context.mjs; echo $?   # Expected: not worse than the Phase 0 baseline (compare.sh row)
node .claude/skills/vc-context-discovery/scripts/discover-context.mjs --check-routing; echo $?   # Expected: 0
# R2.2 display name (the 9 cycle-2 files are now owned, so nothing may remain)
grep -rIn "vibecode-pro-max-kit" . --exclude-dir=.git --exclude-dir=process | grep -v "upstream-attribution" | grep -v "author: vibecode-pro-max-kit"   # Expected: no output
# R2.3 no hotlinks, local assets exist, logo gone
grep -rIn "tenor\|skillicons" README.md docs                                  # Expected: no output
grep -o 'assets/[A-Za-z0-9._-]*' README.md | sort -u | while read f; do test -s "$f" || echo "MISSING $f"; done   # Expected: no output
test ! -e assets/flowser-logo.svg && echo gone                                # Expected: gone
# R2.4 version
node.exe -e "console.log(require('./vc-manifest.json').version)"             # Expected: 1.0.0
grep -c 'version-1.0.0' README.md                                             # Expected: 1
grep -c '^## \[1.0.0\]' CHANGELOG.md                                          # Expected: 1
grep -c 'upstream-baseline' CHANGELOG.md                                      # Expected: 1 or more
# R2.5 resolver equivalence at the SAME runtime + files.length > 0 after the bump
node.exe resolve-manifest.mjs | sort | diff - $B/resolved_p2_start.node-exe.txt   # Expected: no output
node.exe resolve-manifest.mjs --json | node.exe -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).files.length>0))"   # Expected: true
# R2.6 installer/updater end to end (Hybrid; see note below)
node --test e2e-kit-flows.test.mjs; echo $?                                   # Expected: 0 where runnable; else recorded baseline-red / NOT TESTED, judged by compare.sh
# R2.7 installer
grep -c '^REPO="https://github.com/Tomwakeupat530amm/vibebelt-kit.git"$' install.sh   # Expected: 1
bash -n install.sh; echo $?                                                   # Expected: 0
grep -c "Tomwakeupat530amm/vibebelt-kit" .claude/skills/vc-update/SKILL.md .claude/skills/vc-publish/SKILL.md .claude/skills/vc-publish/references/vc-publish.md   # Expected: each >= 1
# R2.8 validator green and unchanged
node.exe $VAL; echo $?                                                        # Expected: 0
git diff $P2_START -- $VAL                                                    # Expected: no output
# R2.9 security
for f in SECURITY.md docs/i18n/SECURITY.*.md; do grep -q "Tomwakeupat530amm/vibebelt-kit/security/advisories/new" $f || echo "MISSING $f"; done   # Expected: no output
grep -rn "mailto:" SECURITY.md docs/i18n/SECURITY.*.md                        # Expected: no output
# R2.10 funding (replacement wording must not contain the literal)
test ! -e .github/FUNDING.yml && echo gone                                    # Expected: gone
grep -rn "FUNDING.yml" . --exclude-dir=.git --exclude-dir=process             # Expected: no output
# R2.14 old owner's WhatsApp invite removed
grep -rn "chat.whatsapp.com" . --exclude-dir=vibebelt-rebrand_29-10-26 --exclude-dir=.git   # Expected: no output
# R2.11 clean and not worse
python3 -c "import yaml,sys; [yaml.safe_load(open(f)) for f in sys.argv[1:]]; print('ok')" .github/workflows/welcome.yml .github/workflows/release.yml .github/ISSUE_TEMPLATE/1.bug_report.yml   # Expected: ok
git diff --check $P2_START -- . "$EX"                                         # Expected: no output
bash $B/compare.sh; echo $?                                                   # Expected: 0
```

- Every remaining `withkynam|flowser` hit is listed in the report, tagged `upstream-attribution`, and passes the R2.13 review.
- R2.6 note: `e2e-kit-flows.test.mjs` runs `install.sh` against a LOCAL clone (`VC_KIT_SOURCE`, no network). Under Linux `node` (installed) Trials A, B, D pass and Trial C is baseline-red (Phase 6 B4), so the result is judged by the `compare.sh` row `e2e-kit-flows` (not worse than 1), R2.5 + R2.7 carry the automated proof, and the gate stays CONDITIONAL with a Phase 8 native-run line.

---

## Blockers That Would Justify BLOCKED Status

- A vendored image has an unclear license (use text instead; not a blocker if text is accepted).
- R2.5 cannot be made identical after the resolver change (stop; do not bump the version).
- A file outside the Blast Radius holds old-name lines and the owner phase cannot be agreed (stop, update the registry).

---

## Phase Completion Rules

- CODE DONE = checklist items done; VERIFIED = Exit Gate commands pass AND `compare.sh` exits 0 (suite not worse than the Phase 0 baseline) AND regression checkpoint passes AND validate-contract exists.
- Known-Gap alone never makes a behavior PASS; write a backlog stub and keep that gate CONDITIONAL.

## Acceptance Criteria

- See the Exit Gate commands and the Verification Evidence table; each row names the charter criterion it proves (proven by + strategy).

## Touchpoints

- install/update/publish/setup scripts and skills, `resolve-manifest.mjs`, manifest, community docs, README + 9 translations, assets, CHANGELOG

---

## Public Contracts

- The installer's behavior and flags stay the same; only the source repo it downloads from changes. The resolved file set is IDENTICAL before and after the version reset (R2.5), and glob mode is selected by manifest shape, not version. Manifest schema unchanged. The portability validator is unchanged (R2.8). Brand-detection patterns stay. The resolver-equivalence proof holds within one runtime only: under `node.exe` the file list uses backslash paths and a broken exclude filter, so it is not what an ubuntu install ships; R2.5 is run with BOTH installed runtimes (Linux `node` and `node.exe`), each against its own reference list; only the real ubuntu install stays with Phase 8. Workflow files change in display name and URLs only.

---

## Verification Evidence

| Gate / Scenario | Strategy | Proves SPEC criterion |
|---|---|---|
| R2.1 pipeline prints nothing (only tagged attribution and the 11 brand-detection lines remain; allowlist includes `flowser\|tRPC`) | Fully-Automated | C-P2 (R2.1): identity replaced |
| display name `vibebelt-kit` outside attribution, including the 9 added files (5 CONTRIBUTING translations, welcome.yml, release.yml, 1.bug_report.yml) | Fully-Automated | C-P2 (R2.2): display name |
| no tenor/skillicons hotlinks, local assets exist, Flowser logo gone | Fully-Automated | C-P2 (R2.3): in-repo assets |
| version 1.0.0 in manifest, README badge, CHANGELOG with `upstream-baseline` | Fully-Automated | C-P2 (R2.4): version reset |
| `resolve-manifest` list identical to `resolved_p2_start.node-exe.txt` (regenerated at Phase 2 entry, same runtime) and `files.length>0`; Phase 0 -> Phase 2 start delta is exactly the new validator | Fully-Automated | C-P2 (R2.5): distribution contract held (per runtime, both installed runtimes run; the real ubuntu install is Phase 8) |
| `node --test e2e-kit-flows.test.mjs` (local clone install/update) | Hybrid (precondition: bash, git, Linux node 22 installed, writable temp dirs) | C-P2 (R2.6): installer/updater work |
| REPO exact string, `bash -n install.sh`, new URL in 3 skill files | Fully-Automated | C-P2 (R2.7): installer points to new repo |
| portability validator exit 0 and file unchanged | Fully-Automated | C-P2 (R2.8): validator not weakened |
| SECURITY x6 advisory link, no `mailto:` | Fully-Automated | C-P2 (R2.9): security reporting |
| FUNDING.yml gone, no references left | Fully-Automated | C-P2 (R2.10): funding removed |
| `git diff --check $P2_START -- . ":!$P"` + workflow YAML still parses + `compare.sh` exit 0 | Fully-Automated | C-P2 (R2.11): not worse than baseline |
| reviewer lists license of every `assets/` file, no broken image in README/translations | Agent-Probe | C-P2 (R2.12): images legal and README fine |
| reviewer reads each `upstream-attribution` line | Agent-Probe | C-P2 (R2.13): remaining lines are real attribution |
| GitHub-side settings (private reporting, Discussions, Sponsorship off) and live badges/links | Known-Gap residual (cannot be tested before the repo exists): backlog stub + Phase 8 user-run list; gate stays CONDITIONAL, never PASS on this alone | C-P2 (R2.9) residual |

---

## Phase Loop Progress

Orchestrator reads this before deciding which subagent to spawn next. The canonical 7-step inner loop
`R → I → P → PVL → E → EVL → UP` SKIPS SPEC (the umbrella plan and the user brief act as the SPEC).

- [ ] 1. RESEARCH — vc-research-agent (opus, front-matter): prior phase reports read; test context loaded; plan drift checked
- [ ] 2. INNOVATE — innovate-agent (sonnet): approach decided; Decision Summary written
- [ ] 3. PLAN-SUPPLEMENT — vc-plan-agent (opus, front-matter): existing phase plan updated; Inner Loop Refresh Note if sections changed (or "n/a — research clean")
- [ ] 4. PVL — vc-validate-agent (opus, front-matter): full V1-V7; validate-contract written per `.claude/skills/vc-validate-findings/references/example-validate-output.md`
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

- Selected plan file path: `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-02-identity-distribution_PLAN_29-10-26.md`
- Last completed step: not started
- Validate-contract status: PVL cycle 5 (outer-pvl, 2026-10-29, from V1) re-validated against the real repo after Phase 0 completion and the ripple supplement: Gate: CONDITIONAL with 2 MUST-FIX open (M2-1 `process/context/all-context.md` holds 2 old-identity hits and stale version facts but is not in the Phase 2 claim; M2-2 the Exit Gate Phase 1 claim-grep line is invalid shell) and 6 RESIDUAL. EXECUTE is NOT legal until a supplement cycle closes the MUST-FIX items and V1 re-validation returns 0 MUST-FIX. Earlier: PASS in cycle 3 (superseded).
- Supporting context files: umbrella plan, `phase-blast-radius-registry.md`, prior phase report (if any)
- Next step: step 1 RESEARCH of this phase when its turn comes (strict phase order); the inner PVL re-runs only if an Inner Loop Refresh Note newer than the contract is written. EXECUTE starts after the Phase 1 exit gate is green.

---

## Validate Contract

Status: PASS
Date: 29-10-26
date: 2026-10-29
generated-by: outer-pvl
supersedes: 2026-10-29 (outer-pvl, PVL cycle 5, Gate: CONDITIONAL, 2 MUST-FIX M2-1 and M2-2) — PVL cycle 6 re-validated from V1 against the real repo after the cycle-5 supplement; this contract REPLACES the cycle-5 contract entirely (same calendar date, ordering is by PVL cycle: 6 follows 5). M2-1 and M2-2 are verified CLOSED; 0 NEW MUST-FIX; 6 RESIDUALs carried. The sentence "Validate-contract status" in Resume and Execution Handoff still quotes the cycle-5 text; this contract governs.

V1 line: `V1 RE-VALIDATE TRIGGERED: the cycle-5 supplement (new step B7, gate lines R2.1b, escaped agent-table loop, release.yml ordering gate, WhatsApp count, runtime wording) was applied after the cycle-5 CONDITIONAL contract; this file has no Inner Loop Refresh Note, the orchestrator instruction treats the supplement as newer. V1 AUTO-PROCEED does not apply.`

Parallel strategy: parallel-subagents (4 disjoint groups a-d, resolver fix first)
Rationale: score 3/7 (S4 phase program, S6 installer/update distribution contract, S7 about 45 files); dominant signal S7. Group (c)/(d) version text waits for the resolver fix (C1). Models: research/plan/validate/tester run on their front-matter (opus), innovate/update-process sonnet, implementing subagents opus. Fan-out cost if used: 4 (Layer 1) + 6 (Layer 2) + 4 implementers = 14, under the 30-agent guard. This pass was ONE fire-and-forget validate-agent (no spawn tool): Layer 1 and Layer 2 ran inline with direct repo inspection and throw-away checks in a scratch clone of HEAD 41b24eb under the scratchpad (project tree not modified); prior verdicts were not trusted.

### Real-repo facts checked (V1-V7, cycle 6)

- **Structure and paths:** `validate-plan-artifact.mjs` exit 0, 0 failures (2 advisory legacy-shape warnings); every path named in the plan resolves; registry Phase 2 claim already lists `process/context/all-context.md` lines 154 and 210 ONLY (registry line 30 and the cycle-5 note line 130), still disjoint from Phases 1 (line 179), 4 and 5.
- **Exit Gate blocks:** both fenced blocks extracted and run through `bash -n`: rc 0 each (the cycle-5 syntax error M2-2 is gone). The supplement block run read-only in the clone: claim grep `R` prints 14 hits (Phase 1 removes them); the escaped agent-table loop prints exactly 30 `RED` lines (10 README files x 3 agents). Positive control: after rewriting the three README agent rows to `opus` in the clone, RED drops to 27, so the loop is meaningful and reaches 0 once Phase 1 lands on all ten files.
- **M2-1 closed:** `grep -rIn "withkynam\|flowser" process --exclude-dir=vibebelt-rebrand_29-10-26` prints exactly two lines today: `process/context/all-context.md:154` (`assets/ -- flowser-logo.svg`) and `:210` (the `withkynam/vibecode-pro-max-kit` URL note). Simulating B7 in the clone (line 154 -> "no vendored media", line 210 -> new repo URL): the grep prints nothing, `validate-all-context.mjs` exit 0, `discover-context.mjs --check-routing` exit 0. Lines 137/168 (`3.2.5`) and 179 are left alone as the plan says. `assets/` holds only `flowser-logo.svg` today, so after B3 it is empty (B7 wording covers it).
- **Counts:** `grep -rIn "withkynam\|flowser" . --exclude-dir=.git --exclude-dir=process` = 245 hits in 27 files (unchanged); WhatsApp invite = 8 link lines in 7 files (`CONTRIBUTING.md:20`, five translations line 18, `welcome.yml:25` and `:32`) plus the doc phrase at `docs/GITHUB-SETTINGS.md:104`, matching the corrected plan text; `FUNDING.yml` appears only in `docs/GITHUB-SETTINGS.md` lines 66 and 125.
- **Runtime and e2e baseline (saved text):** Linux `node` v22.23.4 present; `baseline/validators_before.tsv` row `e2e-kit-flows` = 1 (Linux node), and `validators_before.txt` records `# pass 2 / # fail 2` (A, B ok; C fails AC-5; D fails the cross-device clone on the drvfs checkout), i.e. the 2-of-4 baseline. In a native-fs scratch clone Trials A, B, D pass and C fails AC-5 (3/1). R2.6 is judged by the `compare.sh` row (rc 1, not worse), so both views are consistent.
- **Resolver and other gates (unchanged, re-checked):** `bash -n install.sh` 0; REPO exact-string grep = 1; scratch resolver list identical at 3.2.5 and 1.0.0 after the shape rule; PyYAML parses the three workflow/template files; portability validator exit 0; Phase 1's workflow name loop exists in the Phase 1 Exit Gate (`for w in validate release ...`) so the Phase 2 ordering gate (B2b) reuses a real command.

### MUST-FIX / RESIDUAL classification

MUST-FIX: 0 (M2-1 closed, M2-2 closed).
RESIDUAL (6, none blocks a gate):
- RES-1 The R2.6 note and the Verification row say Trials A, B, D pass; on this drvfs checkout Trial D also fails (cross-device clone, Phase 8 A0 edit 4). No gate depends on it: R2.6 is judged by the `compare.sh` row (rc 1, not worse).
- RES-2 The release.yml display-name ordering gate lives in B2b prose, not as a line of the Exit Gate block. Run it explicitly: `for f in $(find .claude -name 'validate-*.mjs' -not -path '*/fixtures/*'); do b=$(basename $f); grep -q "$b" .github/workflows/release.yml || echo "MISSING release $b"; done` must print nothing after the display-name edit.
- RES-3 B7 targets lines 154 and 210 by number; Phase 1 rewrites line 179 (one paragraph) before Phase 2 starts, so re-read both lines by content (`sed -n '154p;210p'`) before editing, as B7 already says.
- RES-4 Stale-version facts in `all-context.md` (lines 137 and 168, `3.2.5`) stay for UPDATE PROCESS; not gate-bearing.
- RES-5 R2.12/R2.13 are Agent-Probe by nature (license and attribution review); R2.5 proves the file set within one runtime only (the real ubuntu install is Phase 8).
- RES-6 Backlog notes written by this phase (`github-settings-user-run_NOTE`, and `upstream-community-links_NOTE` at UPDATE PROCESS) live under `process/`: they must not contain `withkynam`, `flowser` or the WhatsApp URL, or the R2.1b and R2.14 greps (and a later re-run) would print them.

### Plan updates applied

None (validate-agent writes the contract only; no MUST-FIX remained).

### Execute-agent instructions

- E1. Runtime: both `node` (Linux 22.23.4) and `node.exe` exist. At the Entry Gate regenerate BOTH reference lists (`resolved_p2_start.node.txt`, `resolved_p2_start.node-exe.txt`), run R2.5 per pair, never across runtimes; record the runtime next to every result.
- E2. Entry Gate order: after the Phase 1 commit and before any edit write `baseline/p2_start.txt` and the resolver lists; record the delta proof (`1` and `1`).
- E3. Do NOT edit brand-detection lines (validator lines 8, 93, 97, 106, 118; vc-publish SKILL 216, 220, 238; vc-publish reference 134, 140, 163). Replace only URLs and handles.
- E4. Tag every other intentionally remaining old-name line `upstream-attribution` (HTML comment in Markdown, `#` in shell/yaml, `//` in mjs).
- E5. Do not vendor the tenor GIF or the Flowser logo; skillicons become a plain text list unless each icon's license is recorded.
- E6. Delete `.github/FUNDING.yml`; fix `docs/GITHUB-SETTINGS.md` lines 66 and 125 in the same commit WITHOUT writing `FUNDING.yml` back.
- E7. One regex replacement script (not line-number based) for the 9 README translations and the 5 CONTRIBUTING translations; no hand translation. Phase 1 owns the model-fact sites in README/i18n; leave them untouched.
- E8. No GitHub API calls. Private reporting, Discussions and Sponsorship-off are user-run items in `docs/GITHUB-SETTINGS.md` and the backlog stub (`mkdir -p process/general-plans/backlog` first).
- E9. Order C1 -> C2: never bump the version before the resolver fix is green at 3.2.5.
- E10. WhatsApp (B2c): remove the 6 bullets, the 2 `welcome.yml` passages and the `docs/GITHUB-SETTINGS.md:104` phrase; list the removal under "user decisions" in the report; replacement channel is a user backlog item.
- E11. B7: edit ONLY the two `all-context.md` lines, before the `process/` grep, then run the `process/` grep, `validate-all-context.mjs` and `--check-routing`.
- E12. R2.6: run `node --test e2e-kit-flows.test.mjs`, record `# pass` / `# fail` and which Trial failed; judge by the `compare.sh` row `e2e-kit-flows` (must not get worse than 1).
- E13. Run the release.yml ordering gate of RES-2 after the display-name edit; run both Exit Gate blocks with `bash -n` first.

### Test gates (C3 5-column table)

Test context: `process/context/tests/all-tests.md`; tiers re-checked against it and the saved baselines. Expected values are for AFTER the phase.

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P2 (R2.1, R2.1b) | old identity replaced except tagged attribution and the 11 brand-detection lines; `process/` stays clean | Fully-Automated | R2.1 pipeline prints nothing (5 markers incl. `flowser\|tRPC`); `grep -rIn "withkynam\|flowser" process --exclude-dir=vibebelt-rebrand_29-10-26` prints nothing after B7 (2 lines today, simulated to 0); `validate-all-context.mjs` and `--check-routing` exit 0 | B (B7 closes M2-1) |
| C-P2 (R2.2) | display name `vibecode-pro-max-kit` gone outside attribution | Fully-Automated | R2.2 pipeline prints nothing | A |
| C-P2 (R2.3) | no tenor/skillicons hotlinks, local assets exist, logo gone | Fully-Automated | R2.3 lines (nothing; nothing; `gone`) | A |
| C-P2 (R2.4) | version 1.0.0 in manifest, README badge, CHANGELOG with fork origin | Fully-Automated | manifest `1.0.0`; `grep -c 'version-1.0.0' README.md` = 1; `grep -c '^## \[1.0.0\]' CHANGELOG.md` = 1; `grep -c 'upstream-baseline' CHANGELOG.md` >= 1 | A |
| C-P2 (R2.5) | version reset does not change the shipped file set (per runtime) | Fully-Automated | resolver list diffed against `resolved_p2_start.<runtime>.txt` prints nothing; `--json` `files.length>0` = `true` | A |
| C-P2 (R2.6) | installer and updater work end to end | Hybrid | `node --test e2e-kit-flows.test.mjs`; baseline 2 pass / 2 fail on the drvfs checkout (C = Phase 6 B4, D = Phase 8 A0 edit 4); judged by `compare.sh` row `e2e-kit-flows` not worse than 1; R2.5 + R2.7 carry the automated part | D (residual; Phase 6 fixes C, Phase 8 fixes D and runs the native-Linux proof) |
| C-P2 (R2.7) | installer points to the new repo, valid shell | Fully-Automated | REPO exact-string grep = 1; `bash -n install.sh` = 0; new URL count >= 1 in the 3 skill files | A |
| C-P2 (R2.8) | portability validator green and unchanged | Fully-Automated | validator exit 0; `git diff $P2_START -- $VAL` prints nothing | A |
| C-P2 (R2.9) | security reporting uses the GitHub advisory link in 6 files, no `mailto:` | Fully-Automated | R2.9 loops print nothing | A |
| C-P2 (R2.10) | FUNDING file gone, nothing points at it | Fully-Automated | `gone`; `grep -rn "FUNDING.yml" . --exclude-dir=.git --exclude-dir=process` prints nothing (2 hits today) | A |
| C-P2 (R2.11) | workflow YAML parses; whitespace clean; suite not worse than baseline | Fully-Automated | PyYAML `ok`; `git diff --check $P2_START -- . ":!$P"` prints nothing; `bash $B/compare.sh; echo $?` = 0; release.yml ordering gate (RES-2) prints nothing | A |
| C-P2 (R2.14) | the old owner's WhatsApp invite is gone | Fully-Automated | `grep -rn "chat.whatsapp.com" . --exclude-dir=vibebelt-rebrand_29-10-26 --exclude-dir=.git` prints nothing (8 lines in 7 files today) | A |
| C-P2 (Phase 1 text kept) | this phase does not restore Phase 1's corrected model claims | Fully-Automated | the Exit Gate supplement block prints nothing at phase exit (runs; claim grep 14 hits and 30 RED today, both go to 0 with Phase 1) | A (M2-2 closed) |
| C-P2 (R2.12) | replaced images legal, README and translations look right | Agent-Probe | reviewer opens README and each translation header; no broken image; lists the license of every file in `assets/` (or "none vendored") | A |
| C-P2 (R2.13) | remaining old-name lines are real attribution | Agent-Probe | reviewer reads every `upstream-attribution` line; lists the removed WhatsApp lines for the user | A |

Failing stubs (Fully-Automated rows; red-first starting points, not on-disk test files):

```
test("should leave only tagged attribution lines for withkynam and flowser, and nothing under process/", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should leave only tagged attribution lines for withkynam and flowser, and nothing under process/") })
test("should replace the vibecode-pro-max-kit display name outside attribution", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should replace the vibecode-pro-max-kit display name outside attribution") })
test("should have no tenor or skillicons hotlinks and only existing local assets", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should have no tenor or skillicons hotlinks and only existing local assets") })
test("should report version 1.0.0 in manifest, README badge and CHANGELOG", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should report version 1.0.0 in manifest, README badge and CHANGELOG") })
test("should resolve the same file set before and after the version reset, per runtime", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should resolve the same file set before and after the version reset, per runtime") })
test("should point install.sh at the new repo and stay valid shell", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should point install.sh at the new repo and stay valid shell") })
test("should keep the portability validator green and unchanged", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep the portability validator green and unchanged") })
test("should use the GitHub private advisory link in SECURITY.md and all 5 translations", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should use the GitHub private advisory link in SECURITY.md and all 5 translations") })
test("should delete FUNDING.yml and leave no references to it", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should delete FUNDING.yml and leave no references to it") })
test("should have valid workflow YAML, clean whitespace and not be worse than the Phase 0 baseline", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should have valid workflow YAML, clean whitespace and not be worse than the Phase 0 baseline") })
test("should leave no chat.whatsapp.com link outside the program folder", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should leave no chat.whatsapp.com link outside the program folder") })
test("should keep the Phase 1 model-claim grep empty at phase exit", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep the Phase 1 model-claim grep empty at phase exit") })
```

Legacy line form (kept for existing consumers):
- identity grep: [Fully-automated: R2.1 pipeline + R2.1b `process/` grep print nothing after B7]
- images: [Fully-automated: R2.3] | [agent-probe: licenses recorded]
- version: [Fully-automated: manifest/README/CHANGELOG 1.0.0 + resolver equivalence per runtime]
- installer contract: [hybrid: `node --test e2e-kit-flows.test.mjs` judged by compare.sh + `bash -n install.sh`] | [known-gap: e2e Trial C (Phase 6 B4), Trial D (Phase 8 A0), native Linux/macOS/Windows runs (Phase 8 user-run)]
- security/funding/whatsapp: [Fully-automated: R2.9, R2.10, R2.14]
- known-gap: GitHub-side settings (Discussions, private reporting, sponsorship off) and live badges/links cannot be tested before the repo exists: known-gap: documented as NEW PLAN REQUIRED — see backlog stub `process/general-plans/backlog/github-settings-user-run_NOTE_29-10-26.md` (Phase 8 user-run steps)

High-risk class: yes (installer/update distribution contract and the legal notice surface). R2.5 (resolver equivalence, reproduced under Linux node) and the Phase 8 install test are the proof that the distribution contract was not broken; R2.6 stays a named residual.

### Dimension findings

- Infra fit: PASS — runtime, resolver, workflow files and `all-context.md` lines 154/210 match the plan; B7 simulated clean (validate-all-context 0, check-routing 0).
- Test coverage: PASS — every gate runs (both Exit Gate blocks pass `bash -n`; escaped loop prints 30 RED with a positive control); R2.6 is a named Hybrid residual.
- Breaking changes: PASS — resolver chosen by manifest shape is behavior-neutral at 3.2.5 and 1.0.0; manifest schema, flags and file set unchanged; downgrade warning recorded for upstream 3.x users.
- Security surface: PASS — GitHub private advisories, no invented email, `@withkynam` mentions replaced, WhatsApp invite removed, no vendored media, no API calls.
- Section A (Inventory): PASS — 245 hits / 27 files and the display-name files match the Blast Radius.
- Section B (Replace identity, incl. B7): PASS — scope now complete including the two `all-context.md` lines.
- Section C (Resolver, version, origin): PASS — C1 before C2.
- Section D (User-only settings): PASS.
- Section E (Report): PASS.
- Exit Gate: PASS — runnable end to end.

Net gate derivation: Layer 1 = 0 FAIL / 0 CONCERN / 4 PASS; Layer 2 = 0 FAIL / 0 CONCERN / 6 PASS. MUST-FIX 0; RESIDUAL 6 (RES-1..RES-6) plus Known Gaps K2-1, K2-2. Net gate: PASS. Vacuous-green check: every developed behavior has a Fully-Automated or Hybrid gate; R2.12/R2.13 are Agent-Probe for judgment only; R2.6 is a named residual, never the sole proof (R2.5 and R2.7 prove the distribution contract).

Open gaps:
- none blocking.
- K2-1: R2.6 e2e install/update: known-gap: documented as NEW PLAN REQUIRED — covered by Phase 6 B4 (Trial C), Phase 8 A0 edit 4 (Trial D) and the Phase 8 user-run list (native Linux, macOS, Windows)
- K2-2: GitHub-side settings and live links: known-gap: documented as NEW PLAN REQUIRED — see backlog stub `process/general-plans/backlog/github-settings-user-run_NOTE_29-10-26.md`
- K2-3: CLOSED by user decision (WhatsApp invite removed, R2.14); a replacement community channel is a user backlog item (`upstream-community-links_NOTE_29-10-26.md`, written at UPDATE PROCESS)

What This Coverage Does NOT Prove:
- R2.1/R2.2 prove no untagged old-name line remains; not that the new links resolve (the GitHub repo does not exist yet). They do not find other upstream identity carrying neither name.
- R2.3 proves local files exist; not that they render or are legally reusable (R2.12 samples that by judgment).
- R2.5 proves the resolver output is unchanged within one runtime; it does not prove a real ubuntu install ships the same files (Phase 8 and CI do).
- R2.6 here proves nothing beyond the baseline (2 of 4 on drvfs); nothing proves Windows Git Bash, macOS, or a real network install.
- R2.7 proves syntax and the URL string, not that `curl ... | bash` from GitHub works.
- R2.9 proves the link text; not that GitHub private reporting is switched on.
- R2.11 depends on the Phase 0 compare script and its `.agents/skills` handling (validate-skills and validate-context-discovery stay red under drvfs in both baselines).
- The Phase 1 claim grep proves the quoted phrases are absent, not that no other false model claim exists.

Autonomous Goal Block: not written here (BRANCH B: the umbrella plan carries `## Stable Program Goal`, so the umbrella /goal governs).
Gate: PASS (0 FAIL / 0 MUST-FIX / 6 RESIDUAL; PVL cycle 6). Signal: `PHASE_COMPLETE: VALIDATE — validate-contract written (after 5 validate-fix loop(s)). Proceed to EXECUTE.` is legal (condition (a) Gate = PASS; `results.tsv` also has the cycle rows). EXECUTE still starts only after the Phase 1 exit gate is green and the user's EXECUTE command / the /goal block.
Accepted by: not applicable (PASS, no CONDITIONAL concerns); Known-Gaps K2-1, K2-2 and RES-1..RES-6 are recorded as named residuals.

### Supplement cycle 1 (29-10-26)

Plan sections updated (validate-contract above kept unchanged). Gaps addressed (F-A, F-B and 9 concerns):

- F-B / G2-1: Blast Radius, Touchpoints and B1-B6 now cover the 9 `docs/i18n/README.*.md`, `docs/GOOD-FIRST-ISSUES.md`, `MIGRATION.md`, `vc-setup/SKILL.md`, all README old-name lines (about 16-21, 86-91, 148, 221, 1705-1730), `CONTRIBUTING.md`; Step A1 re-scoped inventory.
- G2-2: strategy re-cut to four disjoint groups (a)-(d); (c)/(d) wait for resolver fix before version text.
- F-B / G2-3: B0 defines the `upstream-attribution` tag and allowlist; Exit Gate R2.1 pipeline (mechanical) plus R2.13 Agent-Probe review.
- G2-4: B3 removes the Flowser logo/tagline, one tagged credit line, deletes `assets/flowser-logo.svg`.
- G2-5: B4 owns the display name `vibebelt-kit` (gate R2.2); `author:` metadata owned by Phase 6.
- F-A / G2-6: C1 changes `resolve-manifest.mjs` to choose glob mode by `Array.isArray(manifest.include)` BEFORE the bump (C2); gates R2.5 (resolver equivalence + `files.length>0`) and R2.6 (e2e where runnable); `vc-update/references/vc-update.md` wording fixed; CHANGELOG notes downgrade warning for upstream 3.x users.
- G2-7: B1 uses the full `.git` REPO URL; validator untouched (R2.8); R2.7 replaces the old evidence row; names `vc-update`/`vc-publish`.
- G2-8: FUNDING.yml is a DELETE with gates R2.10 and fixed `docs/GITHUB-SETTINGS.md` lines; SECURITY gate R2.9.
- G2-9: B5 drops tenor GIF, replaces skillicons by text, shields/contrib.rocks/star-history allowlisted remote; R2.3 and R2.12.
- G2-10: Step D records private reporting / Discussions / Sponsorship as user-only settings; backlog stub feeds the Phase 8 user-run known-gap list.
- G2-11: step names fixed; registry change list reported to the owner (below in the cycle report): Phase 2 claim adds the files above, drops nothing, adds `resolve-manifest.mjs`, `e2e-kit-flows.test.mjs`, `CONTRIBUTING.md`, `docs/GOOD-FIRST-ISSUES.md`, `MIGRATION.md`, `vc-setup/SKILL.md`, `docs/i18n/README.*.md`, `docs/i18n/SECURITY.*.md`, `.github/FUNDING.yml` marked delete, `assets/flowser-logo.svg` delete; conflict list gets "Phase 7 edits `docs/i18n/README.*.md` after Phase 2 (strictly ordered)".

### Supplement cycle 2 (29-10-26)

Plan body updated (validate-contract above kept unchanged). Gaps addressed:

- F2-A: Entry Gate and C0 regenerate the resolver reference `baseline/resolved_p2_start.node-exe.txt` AFTER the Phase 1 commit and before any edit, save `baseline/p2_start.txt`, prove the Phase 0 -> Phase 2 start delta is exactly the new validator script (`tr '\\' '/'` normalised diff), and R2.5 diffs against the new file.
- F2-B: R2.1 and B0 allowlist now include `flowser\|tRPC` (11 brand-detection lines: validator 5, vc-publish SKILL 3, reference 3); Blast Radius states the exact line numbers; R2.8 now diffs against `$P2_START`.
- F2-C: Blast Radius, B2b, B4, strategy group (b) now OWN the 9 display-name files (5 `docs/i18n/CONTRIBUTING.*.md`, `welcome.yml`, `release.yml`, `1.bug_report.yml`) plus `docs/GITHUB-SETTINGS.md` line about 102 changing with `welcome.yml`; YAML parse check added (R2.11); A1 inventory expectation updated.
- G2-12: FUNDING replacement reworded to "leave OFF (the kit has no funding file)", line 125 removed, and a rule that no file may contain the literal `FUNDING.yml`.
- G2-13: resolver files named by runtime; same-runtime rule in the Entry Gate, C0 and Public Contracts; plain-words note that R2.5 under `node.exe` does not prove the Linux file set; Linux-runtime re-run is a Phase 8 user-run hand-off.
- All gates use path variables (P, B, EX, VAL) and `node.exe` explicitly; `git diff --check` excludes the program folder.
- Hand-offs to the owner/registry: Phase 2 claim adds `docs/i18n/CONTRIBUTING.{ja-JP,ko-KR,pt-BR,vi-VN,zh-CN}.md`, `.github/workflows/welcome.yml`, `.github/workflows/release.yml`, `.github/ISSUE_TEMPLATE/1.bug_report.yml`, `docs/GITHUB-SETTINGS.md` (already owned) and `baseline/resolved_p2_start.node-exe.txt` + `baseline/p2_start.txt`; Phase 7 must not assume it owns the CONTRIBUTING translations' display name; Phase 8 user-run checklist gains "re-run R2.5 under Linux Node 22".
- C3/C4/C7 (cycle 2c): new B0b copies the umbrella SWEEP RULE verbatim and states Phase 2 tags CHANGELOG/MIGRATION old-identity lines `upstream-attribution`; C2 states Phase 8 extends the single `## [1.0.0]` entry (gate `grep -c '^## \[1.0.0\]' CHANGELOG.md` = 1 stays); the `author:` hand-off now reads "owned by Phase 6".

### PVL cycle 3 note (29-10-26)

Re-validated from V1 by running the phase commands in a throw-away copy of the repo (deleted afterwards). Result: Gate PASS, no plan-body change needed; the residual items are carried in the contract as Execute-agent instructions and named Known-Gaps (see the contract's Open gaps).

## Supplement note (PVL-supplement, user decision locked)
- WhatsApp invite is now REMOVED in this phase: K2-3 changed from "leave alone" to explicit removal (new step B2c; B2b, E10, K2-3 and the "Found while checking" note updated); new gate R2.14 (`grep -rn "chat.whatsapp.com" . --exclude-dir=<task folder> --exclude-dir=.git` prints nothing). Blast radius: all 9 link files plus `docs/GITHUB-SETTINGS.md:104` are already Phase 2 group (b); the registry entry needs no new file. A replacement community channel is a user backlog item.

Supplement (ripple of 2026-10-29 decisions): model labels corrected to front-matter reality (research, plan, validate, tester = opus; innovate, spec, update-process = sonnet; EXECUTE = opus; Phase 1 A1 table, Decision B). README/i18n identity edits leave the model-fact sites alone (Phase 1 owns them); Exit Gate gains the Phase 1 claim-grep supplement gate.

## Supplement (PVL cycle 5 MUST-FIX)

- M2-1: `process/context/all-context.md` lines 154 and 210 ONLY added to the Phase 2 group (b) Blast Radius (and the registry); new step B7 (after B6, before Step C) edits them before the `process/` grep; Exit Gate gains R2.1b (the `process/` grep, `validate-all-context.mjs`, `discover-context.mjs --check-routing`). Lines 137/168 (`3.2.5`) stay for UPDATE PROCESS, line 179 stays Phase 1.
- M2-2: the Exit Gate supplement agent-table loop is replaced by the escaped version (`bash -n` exit 0 on a scratch file; run once read-only: 30 `RED` lines today, as expected before Phase 1). The Phase 1 claim grep line (`R=...`) is kept unchanged.
- Residuals: runtime wording now states Linux `node` v22.23.4 is installed and the default baseline (Entry Gate regenerates BOTH resolver lists; gates run per runtime); WhatsApp count corrected to 8 link lines in 7 files plus the doc line `docs/GITHUB-SETTINGS.md:104`; no 'Phase 0 repairs .agents/skills' wording was present in this plan.

- Supplement 29-10-26 (tiny): Phase 2 ordering gate vs Phase 1 release.yml additions added.
