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

- Signals (C-CLEAN re-scope, inner 3): S4 yes (phase program), S6 yes (installer/update distribution contract), S7 yes (about 22 kept files: 11 with old-identity lines plus display-name/version/link files) — score 3/7 (MEDIUM), but the work is now small (62 old-identity lines + about 40 display-name/version/link lines) and two ordering rules (C1 before any version text; Phase 1 release.yml steps first) cut across groups.
- Recommended: **Sequential** — ONE vc-execute-agent (opus) runs groups (a) -> (b) -> (c) -> (d) in that order (C1 resolver fix first, then version text), then ONE vc-tester (opus, front-matter) for EVL. Models: research/plan/validate/tester = opus (front-matter); innovate/update-process = sonnet; EXECUTE = opus. Agent count: 1 implementer + 1 tester (+ PVL fan-out 4 Layer 1 + up to 3 Layer 2) = at most 9, under the 30-agent guard. Alternative: parallel subagents, 2 groups ((a)+(b) and (c)+(d)) with (c)/(d) version text waiting for R2.5 green; rejected because the saved time is small and the ordering rules make coordination the main risk. Agent team not needed (no mid-run coordination beyond ordering).

---

## Blast Radius

- Group (a): `install.sh` (REPO variable and banner), `resolve-manifest.mjs`, `vc-manifest.json` (`version`), `.claude/skills/vc-update/SKILL.md` and `.claude/skills/vc-update/references/vc-update.md`, `.claude/skills/vc-publish/SKILL.md` and `.claude/skills/vc-publish/references/vc-publish.md`, `.claude/skills/vc-setup/SKILL.md`, `e2e-kit-flows.test.mjs` (header comment/display name only)
- Group (b) (KEPT files only, C-CLEAN re-scope): `SECURITY.md` (1 old-identity line), `.github/FUNDING.yml` (DELETE), `.github/ISSUE_TEMPLATE/config.yml` (1 line), `.github/ISSUE_TEMPLATE/1.bug_report.yml` (display name, line 2), `.github/workflows/welcome.yml` (display name lines about 22, 27; WhatsApp sentence/line 25 and 32 removed, B2c), `.github/workflows/release.yml` (display-name/`--title` line, now about 162 because Phase 1 added 21 steps; ordering gate kept), `CONTRIBUTING.md` (display name lines 10, 12, 93, 94, 101, 284; WhatsApp bullet line 20 removed); `process/context/all-context.md` lines 154 and 210 ONLY (B7; lines 137/168 stay for UPDATE PROCESS, line 179 belongs to Phase 1).
- Group (c): `README.md` (20 old-identity lines + 21 display-name lines: logo block about 16-21, badges about 86-91, install one-liners about 148 and 221, contributing/star-history about 1699-1730; 'Add a translation' line about 1708 removed; Credits gets ONE tagged upstream-credit line), `CHANGELOG.md` (header line 3 display name + new `## [1.0.0]` entry), `assets/flowser-logo.svg` (DELETE), `assets/` (new files only if a license is recorded)
- Group (d): ONE file, `docs/i18n/README.vi-VN.md` (20 old-identity lines + 21 display-name lines, same sites as README.md; version badge `3.0.0` -> `1.0.0`; pre-existing dead relative links fixed: `href="LICENSE"` about 88 -> `../../LICENSE`, `href="CHANGELOG.md"` about 91 -> `../../CHANGELOG.md`, `](CONTRIBUTING.md)` about 1695 -> `../../CONTRIBUTING.md`; logo `../../assets/flowser-logo.svg` about 17 goes with the logo block; 'Thêm bản dịch' line about 1704 removed; Credits ('Ghi Nhận') gets the VI upstream-credit line). Strict order note: Phase 7 edits this file AFTER Phase 2 (never in parallel).
- NOT touched (UNCHANGED, gate R2.8): `.claude/skills/vc-audit-vc/scripts/validate-kit-portability.mjs`; the brand-detection lines in `vc-publish/SKILL.md` (lines about 216, 220, 238) and `vc-publish/references/vc-publish.md` (about 134, 140, 163). That is 11 brand-detection lines in total: validator 5 (lines 8, 93, 97, 106, 118), vc-publish SKILL 3, vc-publish reference 3.
- Program evidence folder: `baseline/resolved_p2_start.<runtime>.txt`, `baseline/p2_start.txt` (NEW, written at the Entry Gate).
- Left for Phase 6 (owned by Phase 6; hand-off line in the report): `author: vibecode-pro-max-kit` skill metadata in 19 files (measured 2026-10-29: `grep -rl "author: vibecode-pro-max-kit" . --exclude-dir=.git --exclude-dir=process | wc -l` = 19). Phase 6 replaces it with `author: vibebelt-kit` through an explicit rename rule.
- SKIPPED — DOOMED (C-CLEAN; deleted by Phase 8 C0b, so edits are throw-away; 183 old-identity lines, 208 display-name lines): `docs/i18n/README.{de,es,fr,hi,ja-JP,ko-KR,pt-BR,zh-CN}.md` (8), `docs/i18n/CONTRIBUTING.*.md` (5), `docs/i18n/SECURITY.*.md` (5), `docs/GITHUB-LABELS.md`, `docs/GITHUB-SETTINGS.md`, `docs/GOOD-FIRST-ISSUES.md`, `MIGRATION.md` (also whole-file protected by the SWEEP RULE: Phase 2 does NOT edit or tag it), `.github/ISSUE_TEMPLATE/5.translation.yml`. The gates exclude them through ONE shared filter file `$P/harness/doomed.regex` (step A0).
- NOT in Phase 2 (C-CLEAN ALLOWED LIST items that do not exist yet): `scripts/test-compute-sync-plan.mjs`, `legacy-hashes.json` (Phase 6).
- NOT in Phase 2: the language-switcher blocks of `README.md`, `docs/i18n/README.vi-VN.md`, `CONTRIBUTING.md` are trimmed at Phase 8 C0b (their targets still exist until then).
- New program evidence: `$P/harness/doomed.regex` (step A0).

---

## Implementation Checklist

### Step A — Inventory (re-scoped)

- [ ] A0. (C-CLEAN) Create the shared DOOMED-path filter `$P/harness/doomed.regex` containing EXACTLY this one line (an extended regex for `grep -vE -f`, matching a `grep -rn` output line whose path, with or without a leading `./`, is in the umbrella DOOMED SET; derived from the umbrella section `## Clean Final Tree (C-CLEAN)` > DOOMED SET):

```
^(\./)?(docs/i18n/README\.(de|es|fr|hi|ja-JP|ko-KR|pt-BR|zh-CN)\.md|docs/i18n/(CONTRIBUTING|SECURITY)\.[^/:]*\.md|docs/GITHUB-LABELS\.md|docs/GITHUB-SETTINGS\.md|docs/GOOD-FIRST-ISSUES\.md|MIGRATION\.md|\.github/ISSUE_TEMPLATE/5\.translation\.yml|process/general-plans/backlog/[^/:]*_NOTE_[^/:]*\.md):
```

  Not in the filter on purpose: the task folder (excluded with `--exclude-dir=vibebelt-rebrand_29-10-26` or `--exclude-dir=process`), `process/context/all-context.md` (fixed by B7 and checked by R2.1b, never filtered), `scripts/**` and `docs/RELEASE-NOTES-1.0.0.md` (do not exist yet). This is the SWEEP RULE C-CLEAN corollary in practice (the canonical SWEEP RULE wording is unchanged); `MIGRATION.md` stays whole-file protected (Phase 2 neither edits nor tags it). Check: `wc -l < $P/harness/doomed.regex` = 1 and `grep -rIn "withkynam\|flowser" . --exclude-dir=.git --exclude-dir=process | grep -cE -f $P/harness/doomed.regex` = 183 at the Phase 2 start.
- [ ] A1. Run and save to the phase report as the full to-do list (KEPT files only): `grep -rIn "withkynam\|flowser" . --exclude-dir=.git --exclude-dir=process | grep -vE -f $P/harness/doomed.regex` (expected 62 lines in 11 files at the Phase 2 start: README.md 20, docs/i18n/README.vi-VN.md 20, validate-kit-portability.mjs 5 (brand detection, untouched), vc-publish SKILL.md 5, vc-publish reference 5 (11 brand-detection lines across the three files), vc-update SKILL.md 2, vc-setup SKILL.md 1, install.sh 1, SECURITY.md 1, ISSUE_TEMPLATE/config.yml 1, FUNDING.yml 1 (deleted)); `grep -rIn "vibecode-pro-max-kit" . --exclude-dir=.git --exclude-dir=process | grep -v "author: vibecode-pro-max-kit" | grep -vE -f $P/harness/doomed.regex` (display-name sites: CONTRIBUTING.md 10, 12, 20, 93, 94, 101, 284; CHANGELOG.md:3; e2e-kit-flows.test.mjs:4; resolve-manifest.mjs:4; vc-publish SKILL 15, 22, 31, 342; vc-publish.md 11, 15, 210; vc-update SKILL 15, 46, 356; welcome.yml 22, 25, 27, 32; 1.bug_report.yml:2; release.yml about 162; install.sh 4, 11, 29; both READMEs; SECURITY.md; config.yml; vc-setup SKILL); `grep -rIn "tenor\|skillicons" README.md docs/i18n/README.vi-VN.md`; `grep -rn "FUNDING.yml\|mailto:" . --exclude-dir=.git --exclude-dir=process | grep -vE -f $P/harness/doomed.regex`. Any KEPT file with hits outside the Blast Radius = stop and update the registry first. Doomed hits (183 old-identity lines) are SKIPPED, not edited.

### Step B — Replace identity

- [ ] B0. Tag convention: every intentionally remaining old-name line carries the literal text `upstream-attribution` (HTML comment `<!-- upstream-attribution -->` in Markdown, `# upstream-attribution` in shell/yaml, `// upstream-attribution` in `.mjs`). Allowed set: LICENSE, the README fork/credit line, CHANGELOG fork-origin note and upstream history lines, and the 11 brand-detection lines (E3: `BRAND_RE`, `BRAND_ALLOWLIST_MARKERS`, `BRAND_LITERAL_MARKER` in the portability validator, lines 8, 93, 97, 106, 118, and the grep/echo lines in the two vc-publish files: SKILL.md 216, 220, 238 and vc-publish.md 134, 140, 163). Do not tag brand-detection lines (they are matched by the grep allowlist markers in R2.1: `flowser|CloakBrowser`, `flowser\|CloakBrowser`, `flowser\|tRPC`, `author: flowser`).
- [ ] B0b. Umbrella SWEEP RULE (copied verbatim from the umbrella, Global Constraints; the umbrella is canonical): SWEEP RULE (canonical wording lives here; Phase 2 and Phase 6 implement it, see their gates): search the whole repo EXCLUDING `.git`, the program task folder `process/general-plans/active/vibebelt-rebrand_29-10-26/` (and its archived copy), `baseline/`, `golden/`, the rename script + its fixtures, `CHANGELOG.md` and `MIGRATION.md` (WHOLE-FILE protection: Phase 6 implements the history rule as a protected set, not as marker regions; in Phase 2 their old-identity lines are instead tagged `upstream-attribution`), and `legacyDeletions`. Old-identity lines that legitimately remain are only: (1) lines carrying the literal tag `upstream-attribution`; (2) the brand-detection lines in `.claude/skills/vc-audit-vc/scripts/validate-kit-portability.mjs`, `.claude/skills/vc-publish/SKILL.md` and `.claude/skills/vc-publish/references/vc-publish.md`. Phase 2 may additionally exclude the whole `process/` directory ONLY because at Phase 2 time `process/` holds no kit text beyond the task folder and Phase 0 generated context; its gate adds `grep -rIn "withkynam\|flowser" process --exclude-dir=vibebelt-rebrand_29-10-26` and expects no output. MECHANISM IMPLEMENTED BY PHASE 2 (C-CLEAN re-scope): `CHANGELOG.md` is NOT excluded from gate R2.1; its old-identity lines are TAGGED `upstream-attribution` (B0/B4/C2), the stricter variant. `MIGRATION.md` is DOOMED (deleted at Phase 8 C0b) and whole-file protected: Phase 2 does not edit or tag it, and the gates skip it through `$P/harness/doomed.regex` (SWEEP RULE C-CLEAN corollary: before C0b the sweeps may exclude the DOOMED SET; canonical wording unchanged). Phase 6 protects both files whole.
- [ ] B1. Group (a) identity: `install.sh` line 11 -> `REPO="https://github.com/Tomwakeupat530amm/vibebelt-kit.git"` (the full `.git` URL form; gate R2.7); same URL in `vc-update/SKILL.md` (line about 46 `KIT_SOURCE` default), `vc-publish/SKILL.md` (about 22, 342), `vc-publish/references/vc-publish.md` (about 15, 210), `vc-setup/SKILL.md`. `vc-update/SKILL.md` line about 356 (`Paste-ready hooks block: see https://github.com/withkynam/vibecode-pro-max-kit/blob/main/MIGRATION.md#action-required-settingsjson-hooks`) points at the DOOMED `MIGRATION.md`: rewrite the sentence to `Paste-ready hooks block: see the 1.0.0 entry of CHANGELOG.md (https://github.com/Tomwakeupat530amm/vibebelt-kit/blob/main/CHANGELOG.md)`; keep the next line (`or diff .claude/settings.json ...`) unchanged; gate R2.17. The skills are still named `vc-update`/`vc-publish`/`vc-setup` until Phase 6. The portability validator is NOT edited (it has no REPO value; its patterns are brand-LEAK detection and editing them would lower a check).
- [ ] B2. Group (b) community docs (KEPT files only): `SECURITY.md` -> reporting channel = GitHub private vulnerability reporting `https://github.com/Tomwakeupat530amm/vibebelt-kit/security/advisories/new` (LOCKED; no email invented, no `mailto:`); `.github/ISSUE_TEMPLATE/config.yml` links -> new repo; `CONTRIBUTING.md` URLs/handles -> new identity. DELETE `.github/FUNDING.yml` (plain file delete). SKIPPED (DOOMED, C-CLEAN): the 5 `docs/i18n/SECURITY.*.md`, `docs/GOOD-FIRST-ISSUES.md` (its 15 `@withkynam` mentions leave the tree at C0b), `MIGRATION.md`, `docs/GITHUB-*.md` (the only remaining `FUNDING.yml` references, `docs/GITHUB-SETTINGS.md` lines 66 and 125, are doomed: R2.10 checks kept files through the filter).
- [ ] B2b. (USER DECISION, locked: the old owner's WhatsApp invite is REMOVED, see B2c.) Display-name files (KEPT): `.github/workflows/welcome.yml`, `.github/workflows/release.yml`, `.github/ISSUE_TEMPLATE/1.bug_report.yml`: replace the display name `vibecode-pro-max-kit` with `vibebelt-kit` and any clone/repo URL with the new repo URL; change nothing else (triggers, permissions, steps, job names stay). The 5 `docs/i18n/CONTRIBUTING.*.md` and `docs/GITHUB-SETTINGS.md` (line about 102) are DOOMED and SKIPPED. `python3 -c "import yaml,sys; [yaml.safe_load(open(f)) for f in sys.argv[1:]]; print('ok')" .github/workflows/welcome.yml .github/workflows/release.yml .github/ISSUE_TEMPLATE/1.bug_report.yml` must print `ok`. ORDERING GATE: the `release.yml` display-name/`--title` edit (line about 162 since Phase 1 added 21 steps; re-grep `grep -n vibecode-pro-max-kit .github/workflows/release.yml`) runs AFTER Phase 1's validator-step additions to `release.yml` (Phase 1 E4) and must not remove them: at Phase 2 exit the validator step names Phase 1 added are still present in `release.yml` (gate R2.11 ordering line).
- [ ] B3. Group (c) README.md: remove the Flowser logo block (lines about 16-21: flowser.ai link, `assets/flowser-logo.svg`, tagline "AI Agents with computers for GTM") with NO replacement in the header. Do NOT vendor or reuse the Flowser logo; DELETE `assets/flowser-logo.svg` and record the choice. Replace badges (lines about 86-91), install one-liners (about 148, 221) and links/contributors/star-history (about 1699-1730) with the new repo URL; dynamic remote badges (shields.io, contrib.rocks, star-history) stay remote. REMOVE the line `- 🌐 [Add a translation](...template=5.translation.yml)` (about 1708; translations are dropped, C-CLEAN). Credits (`### 🙏 Credits`, about 1718-1720, credits nobody today): change the display name in its paragraph to `vibebelt-kit` and add ONE upstream-credit line (locked decision B3) directly under the heading: `Based on [vibecode-pro-max-kit](https://github.com/withkynam/vibecode-pro-max-kit) by its original authors (MIT). <!-- upstream-attribution -->` (gate R2.16; R2.1/R2.2 allowlist it through the tag). LICENSE is NOT touched (Phase 0 owns it).
- [ ] B2c. REMOVE the old owner's WhatsApp invite (`chat.whatsapp.com/E42ySo6iGmuAyeh25eAXuu`) from KEPT files: 3 lines (`CONTRIBUTING.md:20`, `welcome.yml:25` and `:32`). Edits, keeping surrounding text well-formed: (1) `CONTRIBUTING.md:20`: delete the whole `- **WhatsApp ...:** [...](https://chat.whatsapp.com/...)` bullet (the next bullets, GitHub Issues and Discussions, stay); (2) `.github/workflows/welcome.yml`: issue-message, delete the sentence "In the meantime, feel free to join the community on WhatsApp: <link>" (keep "A maintainer will take a look shortly."); pr-message, delete the final line "Join the community on WhatsApp: <link>" and the blank line before it; keep the block scalars `|` indented consistently. SKIPPED (DOOMED): the 5 `docs/i18n/CONTRIBUTING.*.md:18` bullets and `docs/GITHUB-SETTINGS.md:104`; R2.14 skips them through the filter. No replacement channel is added; a replacement community channel is a user item in the Phase 8 release notes (`$TF/RELEASE-NOTES-1.0.0.md`). Run the R2.11 YAML parse check after (welcome.yml must print ok).
- [ ] B4. Display name: replace `vibecode-pro-max-kit` with `vibebelt-kit` in README title (line about 25) and Credits paragraph, `install.sh` banner (lines 4 and 29; line 11 is the REPO value of B1), `CONTRIBUTING.md` (lines 10, 12, 93, 94, 101, 284), `CHANGELOG.md:3` header, `resolve-manifest.mjs:4` and `e2e-kit-flows.test.mjs:4` comment headers, `vc-publish/SKILL.md` (15, 22, 31, 342), `vc-publish/references/vc-publish.md` (11, 15, 210), `vc-update/SKILL.md` (15, 46, 356), `welcome.yml` (22, 27), `1.bug_report.yml:2`, `release.yml` (about 162), and the KEPT files of B2b. Lines that deliberately keep the old name carry the `upstream-attribution` tag. The `author: vibecode-pro-max-kit` skill metadata (19 files) stays and is handed to Phase 6 with an explicit hand-off line in the phase report.
- [ ] B5. Images (README.md and docs/i18n/README.vi-VN.md): DROP the tenor GIF (third-party copyrighted clip; do not vendor); replace the three skillicons rows by a plain text stack list (no remote icon service) unless each icon file is vendored with its license recorded in the report; if any license is unclear use text. State in the report that shields.io, contrib.rocks and star-history badges are dynamic remote images and stay remote (allowlist in R2.3).
- [ ] B6. Group (d) `docs/i18n/README.vi-VN.md` ONLY (the 8 other languages are DOOMED and skipped): apply the SAME edits as B3/B4/B5 at the same sites (by content, not line number; no hand translation of new prose except the one VI credit line below); version badge `version-3.0.0` (line about 91) -> `version-1.0.0` (with C2, after C1); fix the pre-existing dead relative links (the file sits in `docs/i18n/`): `href="LICENSE"` (about 88) -> `href="../../LICENSE"`, `href="CHANGELOG.md"` (about 91) -> `href="../../CHANGELOG.md"`, `](CONTRIBUTING.md)` (about 1695) -> `](../../CONTRIBUTING.md)`; the logo `src="../../assets/flowser-logo.svg"` (about 17) goes with the removed logo block; REMOVE the line `- 🌐 [Thêm bản dịch](...template=5.translation.yml)` (about 1704); under `### 🙏 Ghi Nhận` add `Dựa trên [vibecode-pro-max-kit](https://github.com/withkynam/vibecode-pro-max-kit) của các tác giả gốc (MIT). <!-- upstream-attribution -->` and change the paragraph's display name to `vibebelt-kit`. Do NOT trim the language-switcher block (done at Phase 8 C0b; its targets still exist until then). Gates R2.4, R2.15, R2.16. Phase 7 owns its later content.

- [ ] B7. (M2-1) `process/context/all-context.md`, edit ONLY these two lines, BEFORE the `process/` grep of the Exit Gate; first re-read both lines (`sed -n '154p;210p' process/context/all-context.md`) and keep the surrounding text/indent: (1) line 154 (`assets/  -- flowser-logo.svg`): after B3 the logo file is deleted, so the entry must say `assets/` holds no vendored media (or only the files really left in `assets/`), with no old name in it; (2) line 210 ("The kit's GitHub repo URL is not yet set (installer and README still point at upstream `withkynam/...`)"): rewrite to say the installer `REPO` and the README now point at `https://github.com/Tomwakeupat530amm/vibebelt-kit`, which the user creates in Phase 8. Do NOT touch line 137 or 168 (`3.2.5` version facts: refreshed by UPDATE PROCESS), line 179 (Phase 1) or anything else in the file. After the edit run `grep -rIn "withkynam\|flowser" process/context` (expect nothing), `node .claude/skills/vc-generate-context/scripts/validate-all-context.mjs` (not worse than the Phase 0 baseline) and `node .claude/skills/vc-context-discovery/scripts/discover-context.mjs --check-routing` (exit 0); the routing block between the `GENERATED:routing` markers is not edited by hand.

### Step C — Resolver fix, then version and origin (order matters)

- [ ] C0. Use `$B/resolved_p2_start.node-exe.txt` (created at the Entry Gate, AFTER the Phase 1 commit and before any edit) as the R2.5 reference. `$B/resolved_before.node-exe.txt` (Phase 0) is used only to show the Phase 1 delta is exactly the new validator script. Both before and after lists are produced by the same runtime (`node.exe` here).
- [ ] C1. Group (a) FIRST: in `resolve-manifest.mjs` (line about 68 `const useGlob = semverGte(version, "2.1.0")`) choose glob mode by manifest SHAPE (`Array.isArray(manifest.include)`) instead of the version comparison; behavior stays identical for the current manifest and for old-format manifests. Update ALL version-format wording in `vc-update/references/vc-update.md` (4 lines: about 48 `>= 2.1.0 means glob format`, 64 `Semver version (< 2.1.0)`, 71 `If version >= 2.1.0, it uses glob resolution...`, 278 `v2.1.0+: Glob patterns...`) to say the format is detected from the manifest shape (`include` is an array of globs); lines 67, 191, 218, 251, 261 (historic version examples) stay. Gate R2.5 must be green at the OLD version (3.2.5) before C2; gate R2.18 checks the wording.
- [ ] C2. After C1: `vc-manifest.json` version (line 2) -> `1.0.0`; README.md badge (line about 91, `3.2.5`) AND docs/i18n/README.vi-VN.md badge (line about 91, `3.0.0`) -> `version-1.0.0`; `CHANGELOG.md`: new top entry `## [1.0.0]` with a "Fork origin" note naming the upstream project (tagged `upstream-attribution`), the `upstream-baseline` tag, and the fact that users of upstream 3.x who run the update skill will see a downgrade warning (expected for a fork). Keep the old history below, labelled "Upstream history" (hit lines tagged). This `## [1.0.0]` entry is the ONLY one in the program: Phase 8 EXTENDS it (adds release notes content to it) and must not create a second `## [1.0.0]`.
- [ ] C3. Keep upstream attribution (LICENSE original line, README credit line); re-run R2.5 and R2.6 after the bump.

### Step D — Settings only the user can change (no API calls)

- [x] D1. DROPPED (C-CLEAN re-scope, inner 3): it edited the DOOMED `docs/GITHUB-SETTINGS.md` and wrote a backlog NOTE (backlog `*_NOTE_*` files are DOOMED too). The user-run GitHub settings list (enable Private vulnerability reporting, enable Discussions, keep Sponsorship OFF, and a replacement community channel) moves to the Phase 8 release notes `$TF/RELEASE-NOTES-1.0.0.md` (per C-CLEAN); Phase 2 only states it in the phase report hand-off (E1). No backlog stub is written by this phase. The live links stay dead until the user creates the repo (Phase 8).

### Step E — Report

- [ ] E1. Phase report lists: every `upstream-attribution` line (for the R2.13 review), the license of every file in `assets/` (or "none vendored"), the image decisions, the DOOMED files skipped (from the A0 filter), and the hand-off lines: (1) `author: vibecode-pro-max-kit` in 19 files -> Phase 6; (2) user-run GitHub settings (private vulnerability reporting, Discussions, Sponsorship OFF, replacement community channel) -> Phase 8 release notes `$TF/RELEASE-NOTES-1.0.0.md`; (3) language-switcher trims and the `CHANGELOG.md` MIGRATION link -> Phase 8 C0b; (4) Phase 8 CC3 may reuse the R2.15 link loop.

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
DOOM=$P/harness/doomed.regex   # ONE shared DOOMED-path filter (step A0; C-CLEAN; reused by R2.1, R2.2, R2.10, R2.14)
P2_START=$(cat $B/p2_start.txt)
VAL=.claude/skills/vc-audit-vc/scripts/validate-kit-portability.mjs
test "$(wc -l < $DOOM)" -eq 1 && echo filter-ok                                # Expected: filter-ok
# R2.1 old identity only in tagged / brand-detection lines, KEPT files (DOOMED SET skipped via $DOOM; 11 brand-detection lines incl. the flowser\|tRPC form)
grep -rIn "withkynam\|flowser" . --exclude-dir=.git --exclude-dir=process | grep -vE -f $DOOM | grep -vF -e 'upstream-attribution' -e 'flowser|CloakBrowser' -e 'flowser\|CloakBrowser' -e 'flowser\|tRPC' -e 'author: flowser'   # Expected: no output
# R2.1b process/ stays clean (after B7 edited all-context.md lines 154 and 210; B7 runs before this)
grep -rIn "withkynam\|flowser" process --exclude-dir=vibebelt-rebrand_29-10-26   # Expected: no output
node .claude/skills/vc-generate-context/scripts/validate-all-context.mjs; echo $?   # Expected: not worse than the Phase 0 baseline (compare.sh row)
node .claude/skills/vc-context-discovery/scripts/discover-context.mjs --check-routing; echo $?   # Expected: 0
# R2.2 display name, KEPT files
grep -rIn "vibecode-pro-max-kit" . --exclude-dir=.git --exclude-dir=process | grep -vE -f $DOOM | grep -v "upstream-attribution" | grep -v "author: vibecode-pro-max-kit"   # Expected: no output
# R2.3 no hotlinks, local assets exist (relative to each file), logo gone
grep -In "tenor\|skillicons" README.md docs/i18n/README.vi-VN.md              # Expected: no output
for f in README.md docs/i18n/README.vi-VN.md; do d=$(dirname "$f"); grep -oE '(\.\./)*assets/[A-Za-z0-9._-]+' "$f" | sort -u | while read -r a; do test -s "$d/$a" || echo "MISSING $f -> $a"; done; done   # Expected: no output
test ! -e assets/flowser-logo.svg && echo gone                                # Expected: gone
# R2.4 version (both READMEs)
node.exe -e "console.log(require('./vc-manifest.json').version)"             # Expected: 1.0.0
grep -c 'version-1.0.0' README.md docs/i18n/README.vi-VN.md                   # Expected: README.md:1 and docs/i18n/README.vi-VN.md:1
grep -n 'badge/version-[0-9]' README.md docs/i18n/README.vi-VN.md | grep -v 'version-1.0.0'   # Expected: no output (no 3.2.5 / 3.0.0 left)
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
# R2.9 security (English SECURITY.md only; the 5 translations are DOOMED)
grep -q "Tomwakeupat530amm/vibebelt-kit/security/advisories/new" SECURITY.md || echo "MISSING SECURITY.md"   # Expected: no output
grep -n "mailto:" SECURITY.md                                                 # Expected: no output
# R2.10 funding (kept files; docs/GITHUB-SETTINGS.md is DOOMED)
test ! -e .github/FUNDING.yml && echo gone                                    # Expected: gone
grep -rn "FUNDING.yml" . --exclude-dir=.git --exclude-dir=process | grep -vE -f $DOOM   # Expected: no output
# R2.14 old owner's WhatsApp invite removed from kept files (works ONLY with the DOOMED filter: the 5 CONTRIBUTING translations keep it until C0b)
grep -rn "chat.whatsapp.com" . --exclude-dir=vibebelt-rebrand_29-10-26 --exclude-dir=.git | grep -vE -f $DOOM   # Expected: no output
# R2.15 relative links in both READMEs resolve (relative to the file; http(s)/mailto/#anchors skipped; Phase 8 CC3 may reuse this loop)
for f in README.md docs/i18n/README.vi-VN.md; do d=$(dirname "$f"); grep -oE '(href|src)="[^"]+"|\]\([^) ]+\)' "$f" | sed -E 's/^(href|src)="//;s/"$//;s/^\]\(//;s/\)$//' | grep -vE '^(https?:|mailto:|#)' | sed 's/#.*//' | sort -u | while read -r t; do [ -z "$t" ] || test -e "$d/$t" || echo "DEAD $f -> $t"; done; done   # Expected: no output (3 DEAD lines in README.vi-VN.md today: LICENSE, CHANGELOG.md, CONTRIBUTING.md)
# R2.16 upstream credit line present once per README, translation links gone
grep -c 'github.com/withkynam/vibecode-pro-max-kit).*upstream-attribution' README.md docs/i18n/README.vi-VN.md   # Expected: each 1
grep -c '5\.translation\.yml' README.md docs/i18n/README.vi-VN.md             # Expected: each 0
# R2.17 vc-update no longer points at the doomed MIGRATION.md
grep -c 'MIGRATION.md' .claude/skills/vc-update/SKILL.md                      # Expected: 0
grep -c 'vibebelt-kit/blob/main/CHANGELOG.md' .claude/skills/vc-update/SKILL.md   # Expected: 1
# R2.18 vc-update.md version-format wording replaced (4 lines)
grep -cE '>= 2\.1\.0 means glob|If version >= 2\.1\.0|Semver version \(< 2\.1\.0\)|^- \*\*v2\.1\.0\+\*\*: Glob' .claude/skills/vc-update/references/vc-update.md   # Expected: 0
# R2.11 clean and not worse (+ release.yml ordering gate: Phase 1 validator steps survive)
python3 -c "import yaml,sys; [yaml.safe_load(open(f)) for f in sys.argv[1:]]; print('ok')" .github/workflows/welcome.yml .github/workflows/release.yml .github/ISSUE_TEMPLATE/1.bug_report.yml   # Expected: ok
for f in $(find .claude -name 'validate-*.mjs' -not -path '*/fixtures/*'); do b=$(basename $f); grep -q "$b" .github/workflows/release.yml || echo "MISSING release $b"; done   # Expected: no output
git diff --check $P2_START -- . "$EX"                                         # Expected: no output
bash $B/compare.sh; echo $?                                                   # Expected: 0
```

- Every remaining `withkynam|flowser` hit is listed in the report, tagged `upstream-attribution`, and passes the R2.13 review.
- DOOMED skip (C-CLEAN): R2.1, R2.2, R2.10, R2.14 use the SAME filter file `$DOOM` (step A0); R2.3, R2.9 name the kept files directly. Before Phase 8 C0b these gates intentionally ignore the DOOMED SET; after C0b those files do not exist, so the umbrella DoD 3 holds without any filter.
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

- install/update/publish/setup scripts and skills, `resolve-manifest.mjs`, manifest, English community docs (SECURITY.md, CONTRIBUTING.md, `.github/**` kept files), `README.md` + `docs/i18n/README.vi-VN.md` (the 8 other languages are DOOMED, skipped), assets, CHANGELOG, `process/context/all-context.md` lines 154/210, new `$P/harness/doomed.regex`

---

## Public Contracts

- The installer's behavior and flags stay the same; only the source repo it downloads from changes. The resolved file set is IDENTICAL before and after the version reset (R2.5), and glob mode is selected by manifest shape, not version. Manifest schema unchanged. The portability validator is unchanged (R2.8). Brand-detection patterns stay. The resolver-equivalence proof holds within one runtime only: under `node.exe` the file list uses backslash paths and a broken exclude filter, so it is not what an ubuntu install ships; R2.5 is run with BOTH installed runtimes (Linux `node` and `node.exe`), each against its own reference list; only the real ubuntu install stays with Phase 8. Workflow files change in display name and URLs only.

---

## Verification Evidence

| Gate / Scenario | Strategy | Proves SPEC criterion |
|---|---|---|
| R2.1 pipeline prints nothing on KEPT files (DOOMED filter; only tagged attribution and the 11 brand-detection lines remain; allowlist includes `flowser\|tRPC`) | Fully-Automated | C-P2 (R2.1): identity replaced |
| display name `vibebelt-kit` outside attribution in KEPT files (DOOMED SET skipped via `$P/harness/doomed.regex`) | Fully-Automated | C-P2 (R2.2): display name |
| no tenor/skillicons hotlinks in README.md and README.vi-VN.md, local assets exist relative to each file, Flowser logo gone | Fully-Automated | C-P2 (R2.3): in-repo assets |
| version 1.0.0 in manifest, BOTH README badges (README.md was 3.2.5, README.vi-VN.md was 3.0.0), CHANGELOG with `upstream-baseline` | Fully-Automated | C-P2 (R2.4): version reset |
| `resolve-manifest` list identical to `resolved_p2_start.node-exe.txt` (regenerated at Phase 2 entry, same runtime) and `files.length>0`; Phase 0 -> Phase 2 start delta is exactly the new validator | Fully-Automated | C-P2 (R2.5): distribution contract held (per runtime, both installed runtimes run; the real ubuntu install is Phase 8) |
| `node --test e2e-kit-flows.test.mjs` (local clone install/update) | Hybrid (precondition: bash, git, Linux node 22 installed, writable temp dirs) | C-P2 (R2.6): installer/updater work |
| REPO exact string, `bash -n install.sh`, new URL in 3 skill files | Fully-Automated | C-P2 (R2.7): installer points to new repo |
| portability validator exit 0 and file unchanged | Fully-Automated | C-P2 (R2.8): validator not weakened |
| SECURITY.md advisory link, no `mailto:` (5 translations DOOMED) | Fully-Automated | C-P2 (R2.9): security reporting |
| FUNDING.yml gone, no references left in KEPT files (DOOMED filter) | Fully-Automated | C-P2 (R2.10): funding removed |
| WhatsApp invite gone from KEPT files (`CONTRIBUTING.md`, `welcome.yml`; DOOMED filter) | Fully-Automated | C-P2 (R2.14): old owner's invite removed |
| relative links in README.md and README.vi-VN.md resolve (VI `../../` fixes) | Fully-Automated | C-P2 (R2.15): no dead README link (feeds C-CLEAN CC3) |
| one tagged upstream-credit line per README; 'Add a translation' links gone | Fully-Automated | C-P2 (R2.16): upstream credit kept (decision B3), translations dropped (C-CLEAN) |
| vc-update SKILL no longer links MIGRATION.md; vc-update.md format wording by manifest shape | Fully-Automated | C-P2 (R2.17, R2.18): no link to doomed file; docs match resolver |
| `git diff --check $P2_START -- . ":!$P"` + workflow YAML still parses + release.yml keeps Phase 1 validator steps + `compare.sh` exit 0 | Fully-Automated | C-P2 (R2.11): not worse than baseline |
| reviewer lists license of every `assets/` file, no broken image in README.md / README.vi-VN.md | Agent-Probe | C-P2 (R2.12): images legal and README fine |
| reviewer reads each `upstream-attribution` line | Agent-Probe | C-P2 (R2.13): remaining lines are real attribution |
| GitHub-side settings (private reporting, Discussions, Sponsorship off) and live badges/links | Known-Gap residual (cannot be tested before the repo exists): user-run list in the Phase 8 release notes `$TF/RELEASE-NOTES-1.0.0.md` (no backlog stub: backlog NOTEs are DOOMED); gate stays CONDITIONAL, never PASS on this alone | C-P2 (R2.9) residual |

---

## Phase Loop Progress

Orchestrator reads this before deciding which subagent to spawn next. The canonical 7-step inner loop
`R → I → P → PVL → E → EVL → UP` SKIPS SPEC (the umbrella plan and the user brief act as the SPEC).

- [x] 1. RESEARCH — vc-research-agent (opus, front-matter): prior phase reports read; test context loaded; plan drift checked (2026-10-29: C-CLEAN re-scope findings)
- [ ] 2. INNOVATE — innovate-agent (sonnet): approach decided; Decision Summary written
- [x] 3. PLAN-SUPPLEMENT — vc-plan-agent (opus, front-matter): existing phase plan updated; Inner Loop Refresh Note if sections changed (or "n/a — research clean") (2026-10-29: C-CLEAN re-scope applied; Refresh Note written)
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
- Last completed step: inner loop step 3 PLAN-SUPPLEMENT (2026-10-29, C-CLEAN re-scope); no EXECUTE work yet
- Validate-contract status: the contract below (outer-pvl, PVL cycle 6, Gate: PASS) is STALE for the C-CLEAN re-scope: the Inner Loop Refresh Note (2026-10-29) is newer, so inner PVL MUST re-run from V1 before EXECUTE (step A0 filter, gates R2.1-R2.18 changed, D1 dropped).
- Supporting context files: umbrella plan, `phase-blast-radius-registry.md`, prior phase report (if any)
- Next step: inner loop step 4 PVL (vc-validate-agent, opus, inner-pvl: phase-2) re-validates from V1; then EXECUTE (Sequential, one vc-execute-agent, opus). Hand-offs carried: user-run GitHub settings -> Phase 8 release notes `$TF/RELEASE-NOTES-1.0.0.md`; `author: vibecode-pro-max-kit` (19 files) -> Phase 6; switcher trims -> Phase 8 C0b.

---

## Inner Loop Refresh Note: 2026-10-29 — inner step 3 PLAN-SUPPLEMENT (C-CLEAN re-scope + research findings). Sections changed: Strategy Recommendation, Blast Radius, Step A (new A0 + A1), B0b, B1-B6, C1, C2, D1 (dropped), E1, Exit Gate (shared filter `$P/harness/doomed.regex`; R2.1, R2.2, R2.3, R2.4, R2.9, R2.10, R2.11, R2.14 changed; new R2.15-R2.18), Touchpoints, Verification Evidence, Phase Loop Progress, Resume. The validate-contract below predates this note: inner PVL must re-run from V1.

## Validate Contract

Status: PASS
Date: 29-10-26
date: 2026-10-29
generated-by: inner-pvl: phase-2
supersedes: 2026-10-29 (outer-pvl, PVL cycle 6, Gate: PASS) AND the `## Inner Loop Refresh Note: 2026-10-29` (inner step 3 PLAN-SUPPLEMENT, C-CLEAN re-scope + research findings) — inner PVL has current evidence. This contract REPLACES the cycle-6 contract entirely. The Refresh Note carries the same calendar date; ordering is by loop step (note = step 3, this contract = step 4), so the note is now consumed and does NOT trigger another PVL. The sentence "Validate-contract status ... STALE" in Resume and Execution Handoff predates this contract; this contract governs.

V1 line: `V1 RE-VALIDATE TRIGGERED: Inner Loop Refresh Note dated 2026-10-29 is newer than existing contract.` (same calendar date; the note states the cycle-6 contract predates it and the orchestrator instruction confirms; V1 AUTO-PROCEED did not apply.)

Parallel strategy: sequential
Rationale: score 3/7 (S4 phase program, S6 installer/update distribution contract, S7 about 22 kept files); dominant signal S6. After the C-CLEAN re-scope the work is small (62 old-identity lines in 11 kept files plus display-name/version/link lines) and two ordering rules cut across groups (C1 resolver fix before any version text; Phase 1 release.yml steps must survive). ONE vc-execute-agent (opus) runs groups (a) -> (b) -> (c) -> (d), then ONE vc-tester (opus, front-matter) runs EVL. Agent count 2 (+ this PVL), under the 30-agent guard. Alternatives: parallel subagents (2 groups) rejected (ordering is the main risk, time saved small); workflow not needed (fixed short sequence); agent team not needed (no mid-run coordination beyond ordering). This PVL pass was ONE fire-and-forget vc-validate-agent (opus) with no spawn tool: Layer 1 and Layer 2 ran inline with direct repo inspection and throw-away runs in a git clone of HEAD 189e8fe (plus the uncommitted plan files) under the session scratchpad on the Linux filesystem; the project tree was not modified except this section; prior verdicts were not trusted.

### Real-repo facts checked (V1-V7, inner PVL)

- **Structure (V1):** `validate-plan-artifact.mjs` exit 0, 0 failures (2 advisory legacy-shape warnings). Every path named in the plan resolves. Dependency guard: Phases 0 and 1 DONE (Phase 1 EVL `HALTED_SUCCESS`, results.tsv row 7). Pre-PVL Action check skipped (inner-PVL exemption). Umbrella has `## Stable Program Goal` -> BRANCH B.
- **(1) DOOMED filter:** the A0 regex extracted verbatim from the plan is exactly 1 line. It covers the umbrella DOOMED SET entries that can appear in a `grep -r . --exclude-dir=process` result (8 READMEs, 5+5 CONTRIBUTING/SECURITY translations, `docs/GITHUB-LABELS.md`, `docs/GITHUB-SETTINGS.md`, `docs/GOOD-FIRST-ISSUES.md`, `MIGRATION.md`, `5.translation.yml`) plus `process/general-plans/backlog/*_NOTE_*.md` (for R2.14, which scans `process/`). It deliberately omits the task folder, `process/context/**`, `_GUIDE` copies, `scripts/**` and `docs/RELEASE-NOTES-1.0.0.md` (excluded by `--exclude-dir` or not yet existing), as the plan says. Measured: 245 old-identity lines total, `grep -cE -f` = 183 doomed, 62 kept in exactly the 11 files A1 lists (README.md 20, README.vi-VN.md 20, validator 5, vc-publish SKILL 5, vc-publish reference 5, vc-update SKILL 2, vc-setup 1, install.sh 1, SECURITY.md 1, config.yml 1, FUNDING.yml 1). The regex accepts paths with or without `./` (GNU grep printed `./` under `bash script`, none interactively); anchored at `^`, it cannot match a kept file.
- **(2) Gate syntax and before/after:** both Exit Gate fenced blocks extracted and run through `bash -n`: rc 0 each. BEFORE (clone at HEAD, Entry Gate simulated): R2.1 prints the 50 kept non-brand lines; R2.1b prints `all-context.md:154` and `:210`; R2.2 non-empty; R2.3 prints tenor + 9 skillicons lines per README; R2.4 `3.2.5`, badges 3.2.5 / 3.0.0; R2.9 `MISSING SECURITY.md`; R2.14 3 lines (CONTRIBUTING.md:20, welcome.yml:25, :32); R2.15 exactly 3 `DEAD` (VI: LICENSE, CHANGELOG.md, CONTRIBUTING.md); R2.16 credit 0/0, translation 1/1; R2.17 1/0; R2.18 4; R2.5 identical; `files.length>0` true; YAML ok; release ordering loop empty; compare.sh 0. AFTER (all planned edits applied mechanically by a throw-away script: identity/display name in all group (a)-(d) files, logo block + tenor + skillicons removed, translation lines removed, both credit lines, VI `../../` links, both badges 1.0.0, CHANGELOG `## [1.0.0]` with tagged fork-origin line and `upstream-baseline`, FUNDING and logo deleted, WhatsApp removed, B7 lines 154/210, `Array.isArray(manifest.include)`, vc-update.md 4 lines, manifest 1.0.0): every gate gives its Expected value — R2.1, R2.1b, R2.2, R2.3 (+`gone`), R2.4 (`1.0.0`, 1/1, none left, 1, 1), R2.5 (no diff, `true`), R2.7 (1, 0, 2/2/2), R2.8 (0, no diff), R2.9, R2.10 (`gone`, nothing), R2.14, R2.15 (nothing), R2.16 (1/1, 0/0), R2.17 (0, 1), R2.18 (0), R2.11 (`ok`, nothing, nothing, compare.sh 0); the supplement block prints nothing.
- **R2.5 / C1:** with the shape rule the Linux-node list is identical at 3.2.5 AND at 1.0.0; node.exe pre/post lists of the same tree are identical and `files.length>0` is `true`; a legacy-format manifest (`managed`, no `include` array) resolves identically with the old and new resolver. Negative control: the OLD resolver at 1.0.0 returns 0 files, so the C1-before-C2 order is load-bearing and R2.5 catches a wrong order. Entry Gate delta proof: Phase 0 -> Phase 2 start differs by exactly `validate-model-effort-policy.mjs` under BOTH runtimes (`1` and `1`).
- **R2.6 e2e:** native-fs clone, Linux node, after edits: 3 pass / 1 fail (Trial C, AC-5 `legacyDeletions`, unchanged from before). On the drvfs checkout the saved baseline is 2/4 (Trial D also fails: cross-device clone); compare.sh row `e2e-kit-flows` = 1 before and after, so "not worse" holds. The installer has no downgrade gate; e2e reads the kit version dynamically, so 1.0.0 is safe.
- **(3) Portability validator:** exit 0 (419 files checked, 0 failures) after the edits; file unchanged; the 11 brand-detection lines are all matched by the R2.1 allowlist markers.
- **(4) Installer:** `install.sh` line 11 after edit = `REPO="https://github.com/Tomwakeupat530amm/vibebelt-kit.git"` (R2.7 grep = 1; line 16 `REPO="${VC_KIT_SOURCE:-$REPO}"` is not matched). Local run `VC_KIT_SOURCE=<scratch clone> bash install.sh` into a fresh git project on the Linux filesystem: exit 0, banner `vibebelt-kit installer`, `Kit version: 1.0.0`, `.vc-version` = 1.0.0, 416 installed files = 416 resolved files.
- **(5) Conflicts:** none. C-CLEAN: Phase 2 edits only ALLOWED-LIST files (plus `all-context.md` lines 154/210, which are DOOMED at C0b but must be clean for R2.1b now); no DOOMED file is edited; `assets/` ends empty, consistent with ALLOWED LIST group C ("assets README references": none). Phase 1 facts: `release.yml` keeps 44 steps, the edit is the single `--title` line 162; no opus/sonnet line in the READMEs changes. Phase 6 precondition (shape rule, equal counts > 0), Phase 7 install-line derivation from `REPO`, Phase 8 single `## [1.0.0]` and resolver precondition all match the simulated output. No later phase reads `harness/doomed.regex` (it is Phase 2 evidence only). Registry: the 21 kit files changed + 2 deleted + 3 task-folder files of the simulation are all inside the Phase 2 claim; nothing outside it.
- **(6) B7:** after editing lines 154 and 210 only, `grep -rIn "withkynam\|flowser" process --exclude-dir=vibebelt-rebrand_29-10-26` prints nothing, `validate-all-context.mjs` exit 0 with the same single pre-existing warning (not worse), `discover-context.mjs --check-routing` exit 0.
- **Untracked/ignored content in the real work tree:** `.claude/hooks/.logs/hook-log.jsonl` and the 53 screenshots are scanned by the `grep -r .` gates; both contain 0 gate strings today (the hook log records only agent names and blocked patterns).

### MUST-FIX / RESIDUAL classification

MUST-FIX: 0.
RESIDUAL (8, none blocks a gate):
- RES-1 R2.6 wording: the R2.6 note and Verification row say "Trials A, B, D pass"; on the drvfs checkout Trial D also fails (cross-device clone; Phase 8 A0), so the real-repo run is 2/4 with exit 1 and the "Expected: 0 where runnable" text will not hold. Operative criterion = compare.sh row `e2e-kit-flows` not worse than 1 (verified).
- RES-2 The A0 filter is intentionally a subset of the umbrella DOOMED SET (process/context, `_GUIDE` copies, scripts and release notes omitted); correct for these gates because `process/` is excluded from R2.1/R2.2/R2.10 and R2.14 finds no WhatsApp text under `process/` today.
- RES-3 The `grep -r .` gates also scan ignored, untracked paths in the real work tree (`.claude/hooks/.logs/`, screenshots); clean today. A hit that appears ONLY there is environment noise: report it, do not edit kit files for it.
- RES-4 B7 targets lines 154 and 210 by number; re-read by content first (as B7 says).
- RES-5 Umbrella C0b says "fix CHANGELOG.md line 125" (the `MIGRATION.md` link); after C2 inserts the `## [1.0.0]` entry this line moves down. Phase 8 must find it by content (Phase 2 E1 hand-off (3) names it).
- RES-6 Phase 8 plan line 172 user-run list does not yet name the replacement community channel and still says "one backlog stub each" (backlog notes are DOOMED); Phase 8 C1 still names `docs/RELEASE-NOTES-1.0.0.md` while the umbrella says `$TF/`. Phase 8 owns these at its own PVL; Phase 2 carries the hand-off line (E1 (2)).
- RES-7 `$TF` in this plan (D1, R2.9 row) is the Phase 8 name of the task folder (= `$P`); cosmetic.
- RES-8 R2.12/R2.13 are Agent-Probe by nature; R2.5 proves the file set per runtime only (the real ubuntu install is Phase 8).

### Plan updates applied

None (validate-agent writes this contract section only; no MUST-FIX).

### Execute-agent instructions

- E1. Paste the Exit Gate variable block first in every fresh shell; run both Exit Gate blocks through `bash -n` before running them.
- E2. Entry Gate, after the Phase 1 commit (and any process commit of these plan edits) and BEFORE any Phase 2 edit: write `baseline/p2_start.txt`, regenerate BOTH `resolved_p2_start.node.txt` (Linux node) and `resolved_p2_start.node-exe.txt` (node.exe); record the delta proof (`1` and `1`, verified for both runtimes). Run R2.5 per runtime against its own list; never across runtimes.
- E3. A0: write `$P/harness/doomed.regex` by copying the one regex line from the plan verbatim; check `wc -l` = 1 and the 183 count; save the A1 inventory (62 lines / 11 files) to the report.
- E4. C1 before C2, strictly: the old resolver returns 0 files at 1.0.0 (reproduced). Make C1 green at 3.2.5 (R2.5 + `files.length>0`) before touching any version text.
- E5. Do NOT edit DOOMED files (8 READMEs, CONTRIBUTING/SECURITY translations, `docs/GITHUB-*.md`, `docs/GOOD-FIRST-ISSUES.md`, `MIGRATION.md`, `5.translation.yml`) and write NO backlog NOTE. Do NOT edit the 11 brand-detection lines or `validate-kit-portability.mjs`.
- E6. Tag every intentionally remaining old-name line `upstream-attribution` (both credit lines, the CHANGELOG fork-origin line); keep exactly ONE `## [1.0.0]` in CHANGELOG; leave the CHANGELOG `MIGRATION.md` link for Phase 8 C0b.
- E7. B2c `welcome.yml`: the issue-message WhatsApp sentence spans lines 24-25 ("In the meantime, feel free to" / "join the community on WhatsApp: ..."); keep "A maintainer will take a look shortly." and the block-scalar indentation; re-run the YAML parse.
- E8. `release.yml`: change only the `--title` line (about 162); the 44 steps (Phase 1's 21 included) must survive; run the R2.11 ordering loop.
- E9. B7: re-read lines 154 and 210 by content, edit only them, then run R2.1b, `validate-all-context.mjs`, `--check-routing`.
- E10. R2.6: run `node --test e2e-kit-flows.test.mjs`; record `# pass`/`# fail` and the failing trials (expect A, B pass; C AC-5; D cross-device on drvfs); judge by the compare.sh row (not worse than 1).
- E11. If any `grep -r .` gate prints a line only from `.claude/hooks/.logs/` or the screenshots folder, report it as environment noise (RES-3); do not edit kit files for it.
- E12. No GitHub API calls, no push, no remote tag. The user-run GitHub settings (private reporting, Discussions, Sponsorship OFF, replacement community channel) go to the report hand-off for the Phase 8 release notes.
- E13. High-risk class (installer/update distribution contract): put the R2.5 results for both runtimes, the `files.length>0` line and the R2.7 lines in the report as the evidence for the distribution contract.

### Test gates (C3 5-column table)

Test context: `process/context/tests/all-tests.md` (routing loaded via the umbrella and Phase 0/1 reports); tiers re-checked against the saved baselines. Expected values are for AFTER the phase.

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P2 (R2.1, R2.1b) | old identity gone from KEPT files except tagged attribution and the 11 brand-detection lines; `process/` clean after B7 | Fully-Automated | R2.1 pipeline with `grep -vE -f $DOOM` prints nothing; R2.1b `process/` grep prints nothing; `validate-all-context.mjs` 0 and `--check-routing` 0 | A |
| C-P2 (R2.2) | display name `vibecode-pro-max-kit` gone from KEPT files outside attribution / `author:` | Fully-Automated | R2.2 pipeline prints nothing | A |
| C-P2 (R2.3) | no tenor/skillicons hotlinks; local assets exist; Flowser logo gone | Fully-Automated | R2.3 lines: nothing; nothing; `gone` | A |
| C-P2 (R2.4) | version 1.0.0 in manifest and BOTH README badges; one CHANGELOG 1.0.0 entry with `upstream-baseline` | Fully-Automated | R2.4 lines: `1.0.0`; 1 and 1; nothing; 1; >= 1 | A |
| C-P2 (R2.5) | shipped file set unchanged by the version reset (per runtime) | Fully-Automated | resolver list vs `resolved_p2_start.<runtime>.txt` no diff; `--json` `files.length>0` = `true` | A |
| C-P2 (R2.6) | installer and updater work end to end | Hybrid | `node --test e2e-kit-flows.test.mjs` (precondition: bash, git, Linux node 22, writable temp); judged by compare.sh row `e2e-kit-flows` not worse than 1 (drvfs 2/4: C = Phase 6 B4, D = Phase 8 A0) | C (Phase 6 B4 fixes C; Phase 8 A0 + native-run list fix D and prove a real install) |
| C-P2 (R2.7) | installer points at the new repo; valid shell; new URL in 3 skill files | Fully-Automated | REPO exact-string grep = 1; `bash -n install.sh` = 0; each count >= 1 | A |
| C-P2 (R2.8) | portability validator green and unchanged | Fully-Automated | validator exit 0; `git diff $P2_START -- $VAL` prints nothing | A |
| C-P2 (R2.9) | SECURITY.md uses the GitHub private advisory link, no `mailto:` | Fully-Automated | R2.9 lines print nothing | A |
| C-P2 (R2.10) | FUNDING.yml deleted; no KEPT file references it | Fully-Automated | `gone`; filtered grep prints nothing | A |
| C-P2 (R2.11) | workflow YAML parses; Phase 1 release.yml steps survive; whitespace clean; suite not worse | Fully-Automated | PyYAML `ok`; ordering loop prints nothing; `git diff --check $P2_START -- . "$EX"` nothing; `bash $B/compare.sh; echo $?` = 0 | A |
| C-P2 (R2.14) | old owner's WhatsApp invite gone from KEPT files | Fully-Automated | filtered `chat.whatsapp.com` grep prints nothing | A |
| C-P2 (R2.15) | relative links in both READMEs resolve | Fully-Automated | R2.15 loop prints nothing (3 DEAD today) | A |
| C-P2 (R2.16) | one tagged upstream-credit line per README; translation links gone | Fully-Automated | credit count 1 and 1; `5.translation.yml` count 0 and 0 | A |
| C-P2 (R2.17, R2.18) | vc-update links CHANGELOG not MIGRATION; vc-update.md describes shape-based format | Fully-Automated | MIGRATION count 0, CHANGELOG link 1; old-wording count 0 | A |
| C-P2 (Phase 1 text kept) | Phase 1's corrected model facts survive | Fully-Automated | supplement block (claim grep + agent-table loop) prints nothing | A |
| C-P2 (R2.12) | images legal; README and README.vi-VN.md render without broken images | Agent-Probe | reviewer opens both READMEs; lists the license of every `assets/` file or "none vendored" | A |
| C-P2 (R2.13) | remaining old-name lines are real attribution | Agent-Probe | reviewer reads every `upstream-attribution` line | A |
| C-P2 (R2.9 residual) | GitHub-side settings and live links | Known-Gap residual (not a proving strategy) | — cannot be tested before the repo exists; user-run list in the Phase 8 release notes `$P/RELEASE-NOTES-1.0.0.md` | C (Phase 8) |

Failing stubs (Fully-Automated rows; red-first starting points for execute-agent, not on-disk test files):

```
test("should leave no untagged withkynam or flowser line in kept files and none under process/", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should leave no untagged withkynam or flowser line in kept files and none under process/") })
test("should replace the vibecode-pro-max-kit display name in kept files outside attribution", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should replace the vibecode-pro-max-kit display name in kept files outside attribution") })
test("should have no tenor or skillicons hotlinks, only existing local assets, and no Flowser logo", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should have no tenor or skillicons hotlinks, only existing local assets, and no Flowser logo") })
test("should report version 1.0.0 in manifest, both README badges and one CHANGELOG entry", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should report version 1.0.0 in manifest, both README badges and one CHANGELOG entry") })
test("should resolve the same file set before and after the version reset, per runtime", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should resolve the same file set before and after the version reset, per runtime") })
test("should point install.sh at the new repo and stay valid shell", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should point install.sh at the new repo and stay valid shell") })
test("should keep the portability validator green and unchanged", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep the portability validator green and unchanged") })
test("should use the GitHub private advisory link in SECURITY.md with no mailto", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should use the GitHub private advisory link in SECURITY.md with no mailto") })
test("should delete FUNDING.yml and leave no kept reference to it", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should delete FUNDING.yml and leave no kept reference to it") })
test("should parse workflow YAML, keep Phase 1 release.yml steps, stay whitespace clean and not worse than baseline", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should parse workflow YAML, keep Phase 1 release.yml steps, stay whitespace clean and not worse than baseline") })
test("should leave no chat.whatsapp.com link in kept files", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should leave no chat.whatsapp.com link in kept files") })
test("should resolve every relative link in README.md and README.vi-VN.md", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should resolve every relative link in README.md and README.vi-VN.md") })
test("should have one tagged upstream credit line per README and no translation link", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should have one tagged upstream credit line per README and no translation link") })
test("should point vc-update at CHANGELOG and describe the shape-based manifest format", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should point vc-update at CHANGELOG and describe the shape-based manifest format") })
test("should keep the Phase 1 model-claim grep empty at phase exit", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep the Phase 1 model-claim grep empty at phase exit") })
```

Legacy line form (kept for existing consumers):
- identity: [Fully-automated: R2.1 + R2.1b + R2.2 with `$P/harness/doomed.regex`]
- images: [Fully-automated: R2.3] | [agent-probe: R2.12 licenses recorded]
- version: [Fully-automated: R2.4 + R2.5 per runtime]
- installer contract: [hybrid: `node --test e2e-kit-flows.test.mjs` judged by compare.sh] | [Fully-automated: R2.7] | [known-gap: Trial C (Phase 6 B4), Trial D on drvfs (Phase 8 A0), native Linux/macOS/Windows runs (Phase 8 user-run)]
- security/funding/whatsapp/links: [Fully-automated: R2.9, R2.10, R2.14, R2.15, R2.16, R2.17, R2.18]
- known-gap: GitHub-side settings and live links: known-gap: documented as deferred to Phase 8 release notes (`$P/RELEASE-NOTES-1.0.0.md`; no backlog stub because backlog NOTEs are DOOMED)

High-risk class: yes (installer/update distribution contract, public install URL, legal attribution). Proof: R2.5 (both runtimes) + R2.7 + the local install run above; the real network install is Phase 8.

### Dimension findings

- Infra fit: PASS — runtimes, resolver, workflows, `all-context.md` lines 154/210 and the local installer all match the plan; simulated post-state green.
- Test coverage: PASS — every gate runs (`bash -n` 0 on both blocks), each has a verified before/after; R2.6 is a named Hybrid residual judged by compare.sh.
- Breaking changes: PASS — shape-based glob mode is behavior-neutral at 3.2.5, 1.0.0 and for legacy manifests; file set, flags and schema unchanged; installer has no downgrade gate; downgrade warning for upstream 3.x users recorded in CHANGELOG.
- Security surface: PASS — GitHub private advisories, no invented email, no `mailto:`, WhatsApp invite removed, no vendored third-party media, no API calls, brand-leak validator untouched.
- Section A (Inventory, A0 filter): PASS — 183 / 62 / 11 files reproduced; filter is one line.
- Section B (Replace identity, B0-B7): PASS — all edit sites found by content; welcome.yml sentence spans two lines (E7).
- Section C (Resolver, version, origin): PASS — C1 load-bearing (old resolver 0 files at 1.0.0); equivalence proven both runtimes.
- Section D (dropped D1): PASS — no doomed edit, no backlog NOTE; hand-off to Phase 8.
- Section E (Report): PASS.
- Exit Gate: PASS — runnable end to end; all Expected values reproduced on the simulated post-state.

Net gate derivation: Layer 1 = 0 FAIL / 0 CONCERN / 4 PASS; Layer 2 = 0 FAIL / 0 CONCERN / 6 PASS. MUST-FIX 0; RESIDUAL 8 (RES-1..RES-8); Known Gaps K2-1, K2-2. Vacuous-green check: every developed behavior has a Fully-Automated gate (R2.6 Hybrid in addition); Agent-Probe rows are judgment only; Known-Gap K2-2 covers user-side GitHub settings, not a behavior developed here. Net gate: PASS.

Open gaps:
- none blocking.
- K2-1: R2.6 e2e install/update: Trial C deferred to Phase 6 B4, Trial D (drvfs) to Phase 8 A0, native Linux/macOS/Windows runs to the Phase 8 user-run list.
- K2-2: GitHub-side settings (private reporting, Discussions, Sponsorship OFF, replacement community channel) and live links/badges: deferred to the Phase 8 release notes `$P/RELEASE-NOTES-1.0.0.md` (named later phase; no backlog stub, C-CLEAN).

What This Coverage Does NOT Prove:
- R2.1/R2.2 prove no untagged old-name line remains in KEPT files outside `process/`; they skip the DOOMED SET until Phase 8 C0b deletes it, and they do not find upstream identity that carries neither name or prove that new links resolve (the GitHub repo does not exist yet).
- R2.3 proves local files exist; not that images render or are legally reusable (R2.12 judges that).
- R2.4 proves the version strings; not that a user upgrading from upstream 3.x accepts the downgrade warning.
- R2.5 proves the resolver output is unchanged within one runtime; not that a real ubuntu install ships the same files (Phase 8).
- R2.6 proves only "not worse than baseline" (2/4 on drvfs); nothing here proves Windows Git Bash, macOS or a real network install.
- R2.7 proves syntax and the URL string, not that `curl ... | bash` from GitHub works.
- R2.9 proves the link text, not that private reporting is switched on.
- R2.11 depends on the Phase 0 compare script and its `.agents/skills` handling (validate-skills / validate-context-discovery stay red on drvfs in both baselines).
- R2.14-R2.17 prove the named strings and local link targets only.
- The Phase 1 claim grep proves the quoted phrases are absent, not that no other false model claim exists.

Autonomous Goal Block: not written here (BRANCH B: the umbrella plan carries `## Stable Program Goal`; the umbrella /goal governs).
Gate: PASS (0 FAIL / 0 MUST-FIX / 8 RESIDUAL; inner PVL phase 2). Legal signal: `PHASE_COMPLETE: VALIDATE — validate-contract written. Proceed to EXECUTE.` (condition (a) Gate = PASS). EXECUTE starts with the user's EXECUTE command or the standing /goal block; Sequential, one vc-execute-agent (opus), then vc-tester (opus) for EVL.
Accepted by: not applicable (PASS, no CONDITIONAL concerns); Known Gaps K2-1, K2-2 and RES-1..RES-8 are recorded as named residuals.

Note: the `### Supplement cycle 1`, `### Supplement cycle 2` and `### PVL cycle 3 note` subsections below are historical plan-supplement notes kept for audit; they are not part of this contract and their instructions are superseded by the Execute-agent instructions above.

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

## Supplement (inner 3, C-CLEAN re-scope)

- Scope cut to KEPT files: 62 old-identity lines in 11 files (README.md 20, README.vi-VN.md 20, portability validator 5 untouched, vc-publish SKILL 5 + reference 5 (11 brand-detection lines across the three), vc-update SKILL 2, vc-setup SKILL 1, install.sh 1, SECURITY.md 1, config.yml 1, FUNDING.yml 1 deleted) plus display-name, version and link edits; 183 DOOMED old-identity lines (208 display-name lines) are skipped. Group (d) is now ONE file (`docs/i18n/README.vi-VN.md`). All counts re-measured by grep on 2026-10-29 (HEAD 189e8fe).
- ONE shared DOOMED-path filter `$P/harness/doomed.regex` (step A0, derived from the umbrella DOOMED SET) reused by R2.1, R2.2, R2.10, R2.14; R2.3 and R2.9 name kept files; consistent with the SWEEP RULE C-CLEAN corollary (canonical wording unchanged); `MIGRATION.md` stays whole-file protected (not edited, not tagged). Filter dry-run: 183 old-identity lines matched, 62 kept lines left; the R2.15 link loop prints exactly the 3 known VI dead links today.
- D1 dropped (edited doomed `docs/GITHUB-SETTINGS.md` and wrote a doomed backlog NOTE); the user-run GitHub settings list moves to the Phase 8 release notes `$TF/RELEASE-NOTES-1.0.0.md`.
- VI README: badge 3.0.0 -> 1.0.0 (R2.4 covers both READMEs); dead relative links fixed to `../../` (R2.15); 'Add a translation' lines removed from both READMEs; one tagged upstream-credit line per README Credits (decision B3; R2.16); LICENSE untouched (Phase 0). Language switchers are trimmed at Phase 8 C0b, not here.
- vc-update SKILL line about 356 now points at CHANGELOG.md instead of the doomed MIGRATION.md (R2.17); vc-update.md version-format wording covered on all 4 lines (R2.18); release.yml `--title` line now about 162, ordering gate kept as an Exit Gate line (closes RES-2); `author:` hand-off is 19 files (Phase 6). `scripts/test-compute-sync-plan.mjs` and `legacy-hashes.json` are not Phase 2 (they do not exist yet).
- Strategy now Sequential (one vc-execute-agent, opus; tester opus per front-matter).
- Umbrella: one line (Phase-plan wording, Phase 2 bullet) corrected — R2.14 works only WITH the shared DOOMED filter.
