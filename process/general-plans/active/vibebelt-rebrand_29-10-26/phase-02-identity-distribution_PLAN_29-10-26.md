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
- REGENERATE the resolver reference now (Phase 1 added one managed script, `.claude/skills/vc-audit-vc/scripts/validate-model-effort-policy.mjs`, so the Phase 0 list is stale): after the Phase 1 commit and BEFORE any Phase 2 edit run `node.exe resolve-manifest.mjs | sort > $B/resolved_p2_start.node-exe.txt` (file name carries the runtime; use `resolved_p2_start.node.txt` with a Linux node) and save the start commit: `git rev-parse HEAD > $B/p2_start.txt`. Prove the only difference from the Phase 0 list is that one script: `diff <(tr '\\' '/' < $B/resolved_before.node-exe.txt | sort) <(tr '\\' '/' < $B/resolved_p2_start.node-exe.txt | sort) | grep -c '^[<>]'` prints `1` and the same command ending in `| grep -c 'vc-audit-vc/scripts/validate-model-effort-policy.mjs$'` prints `1`. Record that diff in the report. Before and after lists must always be made by the SAME runtime; never compare a `node.exe` list with a Linux one.
- Runtime: `node.exe` in this WSL unless the user installed Linux Node 22 (user action). Gates that need it (`e2e-kit-flows.test.mjs`) are recorded `baseline-red` / `NOT TESTED` when not runnable, never passed by assumption.

---

## Strategy Recommendation (vc-agent-strategy-compare)

- Signals: S6 yes (installer/update distribution contract), S7 yes (about 45 files across install, scripts, docs, 9 translations) — score about 3/7 (MEDIUM).
- Recommended: **Parallel subagents**, 4 disjoint groups: (a) `install.sh` + `resolve-manifest.mjs` + `vc-manifest.json` + `vc-update/**` + `vc-publish/**` + `vc-setup/SKILL.md`; (b) community docs: SECURITY x6, FUNDING delete, ISSUE_TEMPLATE (config.yml and 1.bug_report.yml), `docs/GITHUB-*.md`, `docs/GOOD-FIRST-ISSUES.md`, `MIGRATION.md`, `CONTRIBUTING.md`, 5 CONTRIBUTING translations, `welcome.yml`, `release.yml`; (c) `README.md` + `CHANGELOG.md` + `assets/`; (d) the 9 `docs/i18n/README.*.md` by ONE replacement script (no hand translation). Ordering rule: group (c) and (d) do NOT write version text (`1.0.0` badge, CHANGELOG entry) until group (a) has fixed the resolver (step C1) and gate R2.5 is green; identity/image edits in (c)/(d) may run in parallel with (a). Research/plan/validate = sonnet; the four implementing subagents = opus. Agent count 4 (Layer 1) + 3 (Layer 2) + 4 implementers = 11, under the 30-agent guard. Alternative: sequential.

---

## Blast Radius

- Group (a): `install.sh` (REPO variable and banner), `resolve-manifest.mjs`, `vc-manifest.json` (`version`), `.claude/skills/vc-update/SKILL.md` and `.claude/skills/vc-update/references/vc-update.md`, `.claude/skills/vc-publish/SKILL.md` and `.claude/skills/vc-publish/references/vc-publish.md`, `.claude/skills/vc-setup/SKILL.md`, `e2e-kit-flows.test.mjs` (header comment/display name only)
- Group (b): `SECURITY.md` and `docs/i18n/SECURITY.*.md` (5), `.github/FUNDING.yml` (DELETE), `.github/ISSUE_TEMPLATE/config.yml`, `docs/GITHUB-*.md` (including `docs/GITHUB-SETTINGS.md`; line about 102 documents the welcome message and changes together with `welcome.yml`), `docs/GOOD-FIRST-ISSUES.md`, `MIGRATION.md`, `CONTRIBUTING.md`; NEW in cycle 2 (display name `vibecode-pro-max-kit` -> `vibebelt-kit` and clone URLs -> new repo only; workflow behavior unchanged): `docs/i18n/CONTRIBUTING.{ja-JP,ko-KR,pt-BR,vi-VN,zh-CN}.md` (5 files, 30 lines; WhatsApp bullet also removed, B2c), `.github/workflows/welcome.yml` (2 lines; WhatsApp sentence/line also removed, B2c), `.github/workflows/release.yml` (1 line), `.github/ISSUE_TEMPLATE/1.bug_report.yml` (1 line) = 34 lines in 8 files beyond the earlier list
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
- [ ] B2b. (USER DECISION, locked: the old owner's WhatsApp invite is REMOVED, see B2c.) Display-name files added in cycle 2: `docs/i18n/CONTRIBUTING.{ja-JP,ko-KR,pt-BR,vi-VN,zh-CN}.md` (one regex replacement script, same approach as B6, no hand translation), `.github/workflows/welcome.yml`, `.github/workflows/release.yml`, `.github/ISSUE_TEMPLATE/1.bug_report.yml`: replace the display name `vibecode-pro-max-kit` with `vibebelt-kit` and any clone/repo URL with the new repo URL; change nothing else (triggers, permissions, steps, job names stay). Update `docs/GITHUB-SETTINGS.md` line about 102 (the documented welcome message) in the SAME commit as `welcome.yml` so doc and workflow agree. `python3 -c "import yaml,sys; [yaml.safe_load(open(f)) for f in sys.argv[1:]]; print('ok')" .github/workflows/welcome.yml .github/workflows/release.yml .github/ISSUE_TEMPLATE/1.bug_report.yml` must print `ok`.
- [ ] B3. Group (c) README.md: remove the Flowser logo block (lines about 16-21: flowser.ai link, `assets/flowser-logo.svg`, tagline "AI Agents with computers for GTM") and replace it with ONE tagged credit line, for example "Forked from vibecode-pro-max-kit by withkynam (MIT). <!-- upstream-attribution -->". Do NOT vendor or reuse the Flowser logo; DELETE `assets/flowser-logo.svg` and record the choice. Replace badges (lines about 86-91), install one-liners (about 148, 221) and links/contributors/star-history (about 1705-1730) with the new repo URL; dynamic remote badges (shields.io, contrib.rocks, star-history) stay remote and are allowlisted in R2.3.
- [ ] B2c. REMOVE the old owner's WhatsApp invite (`chat.whatsapp.com/E42ySo6iGmuAyeh25eAXuu`, verified by grep: 9 link lines + 1 doc line). Edits, keeping surrounding text well-formed: (1) `CONTRIBUTING.md:20` and `docs/i18n/CONTRIBUTING.{ja-JP,ko-KR,pt-BR,vi-VN,zh-CN}.md:18`: delete the whole `- **WhatsApp ...:** [...](https://chat.whatsapp.com/...)` bullet (the next bullets, GitHub Issues and Discussions, stay); (2) `.github/workflows/welcome.yml`: issue-message, delete the sentence "In the meantime, feel free to join the community on WhatsApp: <link>" (keep "A maintainer will take a look shortly."); pr-message, delete the final line "Join the community on WhatsApp: <link>" and the blank line before it; keep the block scalars `|` indented consistently; (3) `docs/GITHUB-SETTINGS.md:104`: remove ", link to WhatsApp community" from the Content cell and keep the table row intact. No replacement channel is added; a replacement community channel is a user backlog item (written into the backlog stub at UPDATE PROCESS). Run the R2.11 YAML parse check after (welcome.yml must print ok).
- [ ] B4. Display name: replace `vibecode-pro-max-kit` with `vibebelt-kit` in README title (line about 25), `install.sh` banner (lines about 4 and 29), `CONTRIBUTING.md`, `CHANGELOG.md` header, `MIGRATION.md`, comment headers of `resolve-manifest.mjs` and `e2e-kit-flows.test.mjs`, and the 9 files listed in B2b. Lines that deliberately keep the old name carry the `upstream-attribution` tag. The `author: vibecode-pro-max-kit` skill metadata (about 33 files) stays and is handed to Phase 6/5 with an explicit hand-off line in the phase report.
- [ ] B5. Images: DROP the tenor GIF (third-party copyrighted clip; do not vendor); replace the three skillicons rows by a plain text stack list (no remote icon service) unless each icon file is vendored with its license recorded in the report; if any license is unclear use text. State in the report that shields.io, contrib.rocks and star-history badges are dynamic remote images and stay remote (allowlist in R2.3).
- [ ] B6. Group (d): one replacement script (kept in the phase report, not committed) applies the SAME edits as B3/B4/B5 to the 9 `docs/i18n/README.*.md` (same lines as README.md); no hand translation; Phase 7 owns their later content.

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

Run from the repo root. `node` = `node.exe` without a Linux node; use the SAME runtime for every resolver run. Paste the variable block first (a fresh tester shell has none of them):

```bash
P=process/general-plans/active/vibebelt-rebrand_29-10-26
B=$P/baseline
EX=":!$P"
P2_START=$(cat $B/p2_start.txt)
VAL=.claude/skills/vc-audit-vc/scripts/validate-kit-portability.mjs
# R2.1 old identity only in tagged / brand-detection lines (11 brand-detection lines, incl. the flowser\|tRPC form)
grep -rIn "withkynam\|flowser" . --exclude-dir=.git --exclude-dir=process | grep -vF -e 'upstream-attribution' -e 'flowser|CloakBrowser' -e 'flowser\|CloakBrowser' -e 'flowser\|tRPC' -e 'author: flowser'   # Expected: no output
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
- R2.6 note: `e2e-kit-flows.test.mjs` runs `install.sh` against a LOCAL clone (`VC_KIT_SOURCE`, no network). Under `node.exe` in WSL it may be baseline-red; then the result is recorded NOT TESTED, R2.5 + `bash -n` carry the proof, and the gate stays CONDITIONAL with a Phase 8 user-run line (run it on Linux Node 22).

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

- The installer's behavior and flags stay the same; only the source repo it downloads from changes. The resolved file set is IDENTICAL before and after the version reset (R2.5), and glob mode is selected by manifest shape, not version. Manifest schema unchanged. The portability validator is unchanged (R2.8). Brand-detection patterns stay. The resolver-equivalence proof holds within one runtime only: under `node.exe` the file list uses backslash paths and a broken exclude filter, so it is not what an ubuntu install ships; the Linux-runtime re-run of R2.5 belongs to the Phase 8 user-run checklist (registered via the hand-off line in the phase report). Workflow files change in display name and URLs only.

---

## Verification Evidence

| Gate / Scenario | Strategy | Proves SPEC criterion |
|---|---|---|
| R2.1 pipeline prints nothing (only tagged attribution and the 11 brand-detection lines remain; allowlist includes `flowser\|tRPC`) | Fully-Automated | C-P2 (R2.1): identity replaced |
| display name `vibebelt-kit` outside attribution, including the 9 added files (5 CONTRIBUTING translations, welcome.yml, release.yml, 1.bug_report.yml) | Fully-Automated | C-P2 (R2.2): display name |
| no tenor/skillicons hotlinks, local assets exist, Flowser logo gone | Fully-Automated | C-P2 (R2.3): in-repo assets |
| version 1.0.0 in manifest, README badge, CHANGELOG with `upstream-baseline` | Fully-Automated | C-P2 (R2.4): version reset |
| `resolve-manifest` list identical to `resolved_p2_start.node-exe.txt` (regenerated at Phase 2 entry, same runtime) and `files.length>0`; Phase 0 -> Phase 2 start delta is exactly the new validator | Fully-Automated | C-P2 (R2.5): distribution contract held (within one runtime; the Linux file set is re-checked in the Phase 8 user-run list) |
| `node --test e2e-kit-flows.test.mjs` (local clone install/update) | Hybrid (precondition: bash, git, node, writable temp dirs; Linux Node 22 is a user action) | C-P2 (R2.6): installer/updater work |
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

- Selected plan file path: `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-02-identity-distribution_PLAN_29-10-26.md`
- Last completed step: not started
- Validate-contract status: written 29-10-26 (generated-by outer-pvl); PVL cycle 3 re-validation 29-10-26 from V1 on the supplemented plan: Gate: PASS (0 FAIL, 0 MUST-FIX; residuals carried as named Known-Gaps and Execute-agent instructions)
- Supporting context files: umbrella plan, `phase-blast-radius-registry.md`, prior phase report (if any)
- Next step: step 1 RESEARCH of this phase when its turn comes (strict phase order); the inner PVL re-runs only if an Inner Loop Refresh Note newer than the contract is written. EXECUTE starts after the Phase 1 exit gate is green.

---

## Validate Contract

Status: PASS
Date: 29-10-26
date: 2026-10-29
generated-by: outer-pvl
supersedes: 2026-10-29 (outer-pvl) — cycle-2 BLOCKED contract (F2-A, F2-B, F2-C, G2-12, G2-13); PVL cycle 3 re-validation from V1 has current evidence

Parallel strategy: parallel-subagents (4 disjoint groups a-d, resolver fix first)
Rationale: score 3/7 (S4 phase program, S6 installer/update distribution contract, S7 about 45 files). Dominant signal S7. Group (c)/(d) version text waits for the resolver fix (step C1). Models: planning/validation sonnet, implementing subagents opus. Fan-out cost if used: 4 (Layer 1) + 5 (Layer 2: Steps A-E) + 4 implementers = 13, up to 16 with optional reviewer/tester/security (under the 30-agent guard). This cycle-3 pass was ONE fire-and-forget validate-agent with direct repo inspection plus a throw-away dry run (no sub-agent fan-out possible).

### Real-repo facts checked (V1, cycle 3)

- **R2.1 pipeline run on the real tree:** `grep -rIn "withkynam\|flowser" . --exclude-dir=.git --exclude-dir=process` = 245 hits in 27 files, all inside the Blast Radius. With the five allowlist markers (`upstream-attribution`, `flowser|CloakBrowser`, `flowser\|CloakBrowser`, `flowser\|tRPC`, `author: flowser`) exactly the 11 brand-detection lines drop out (validator lines 8, 93, 97, 106, 118; vc-publish SKILL 216, 220, 238; vc-publish reference 134, 140, 163) and 234 lines remain; the only remaining lines in the three brand-detection files are the 4 URL lines B1 replaces (SKILL 22 and 342, reference 15 and 210). So after B1-B6 the pipeline can print nothing. `grep -rIn "withkynam\|flowser" process --exclude-dir=vibebelt-rebrand_29-10-26` prints nothing today (0 hits), so the umbrella's "process/ is clean" premise holds (see R2-a: this command is not in the plan's Exit Gate code block, the contract carries it).
- **R2.2 pipeline on the real tree:** 36 files hold display-name hits and every one is owned by the Blast Radius (README + 9 translated READMEs, CONTRIBUTING.md + 5 translations, SECURITY.md + 5 translations, install.sh, vc-update, vc-publish SKILL and reference, vc-setup, GITHUB-SETTINGS, MIGRATION, resolve-manifest, e2e, CHANGELOG, ISSUE_TEMPLATE config.yml and 1.bug_report.yml, welcome.yml, release.yml). 19 files carry `author: vibecode-pro-max-kit` metadata (the plan says "about 33"): excluded by the gate and handed to Phase 6.
- **Resolver (R2.5), run in a copy of the repo on the same drive type, `node.exe`:** 492 lines; adding `validate-model-effort-policy.mjs` makes the Phase 0 -> Phase 2-start delta exactly 1 line (`diff <(tr '\\' '/' < before) <(tr '\\' '/' < p2_start) | grep -c '^[<>]'` = `1`, and the second command = `1`); fixtures under dot-directories are not listed. Bumping the version to `1.0.0` BEFORE the C1 fix empties the list (`files.length>0` = `false`, diff of 493 lines); after changing line 68 to `Array.isArray(manifest.include)` the list is identical to the pre-bump list and `files.length>0` = `true`. `assets/**`, `docs/**`, `.github/**`, `README.md`, `CONTRIBUTING.md`, `SECURITY.md` are `kitOnly`, so the deletions (flowser-logo.svg, FUNDING.yml) and all text edits outside `.claude/**` cannot change the resolver output.
- Other checks: `bash -n install.sh` = 0 and `REPO=` is line 11 in the exact form R2.7 expects; no `mailto:` and no email in SECURITY.md or its 5 translations (all 6 hold `.../security/advisories/new` on line 25 with the old repo path); `FUNDING.yml` text appears only in `docs/GITHUB-SETTINGS.md` lines 66 and 125; tenor/skillicons: 10 hits each in README and the 9 translations, nowhere else under `docs`; `assets/` holds only `flowser-logo.svg`, referenced once by README.md (line 17) and once by each translation; CHANGELOG has no `[1.0.0]` heading today and 8 upstream headings (3.0.0 to 3.2.5); only `resolve-manifest.mjs` line 68 gates on the version (install.sh and `compute-sync-plan.mjs` only print or write it; the update skill only warns on downgrade); PyYAML 6.0.3 parses the three workflow/template files named in R2.11; `validate-kit-portability.mjs` has no repo URL (R2.8 unchanged is right). Structural plan check: exit 0, two advisory "legacy plan shape" warnings.
- **Found while checking for leaks the grep gates cannot see (RESOLVED by locked user decision):** the upstream owner's WhatsApp community invite link (`chat.whatsapp.com/E42ySo6iGmuAyeh25eAXuu`) appears on 9 lines (`CONTRIBUTING.md:20`, the 5 `docs/i18n/CONTRIBUTING.*.md` line 18, `welcome.yml` lines 25 and 32) plus the mention at `docs/GITHUB-SETTINGS.md:104`. The user decided to REMOVE it in this phase (step B2c, gate R2.14). No replacement channel is added.

### Prior gaps F2-A, F2-B, F2-C, G2-12, G2-13: re-check against the real repo

- F2-A CLOSED: the Entry Gate regenerates `resolved_p2_start.node-exe.txt` after the Phase 1 commit and the delta proof gives `1` and `1`; R2.5 diffs against it and passes after the C1 fix + bump (reproduced).
- F2-B CLOSED: the 11 brand-detection lines are matched by the five markers (counted above).
- F2-C CLOSED: all 9 added display-name files are now in Blast Radius, B2b, B4 and the registry; no unowned file holds a display-name hit.
- G2-12 CLOSED: the only two `FUNDING.yml` mentions are in `docs/GITHUB-SETTINGS.md` lines 66/125 and the B2 replacement wording does not contain the literal.
- G2-13 CLOSED: resolver files are named by runtime and the same-runtime rule and the Linux re-run hand-off are written down.

### Plan updates applied

None in this pass (validate-agent writes the contract only). No plan edit is required: the one omission found (R2-a, the `process/` grep promised by B0b and the umbrella SWEEP RULE but missing from the Exit Gate code block) is closed by adding that command as a gate row of THIS contract (EVL runs the contract's gate commands) and by instruction E9.

### Execute-agent instructions

- E1. Runtime: `node.exe` (no `node` in WSL). Record the runtime name next to every resolver list and use the same runtime for before and after.
- E2. Regenerate the resolver reference at the START of Phase 2 (after the Phase 1 commit, before any edit): `node.exe resolve-manifest.mjs | sort > baseline/resolved_p2_start.node-exe.txt`, save `git rev-parse HEAD > baseline/p2_start.txt`, and record the delta proof (`1` and `1`). R2.5 diffs against that file.
- E3. Do NOT edit brand-detection lines: `validate-kit-portability.mjs` (BRAND_RE, BRAND_ALLOWLIST_MARKERS, BRAND_LITERAL_MARKER) and the grep/echo lines in `vc-publish/SKILL.md` (216, 220, 238) and `vc-publish/references/vc-publish.md` (134, 140, 163). Replace only URLs and handles.
- E4. Tag every other intentionally remaining old-name line with the literal `upstream-attribution` (HTML comment in Markdown, `#` in shell/yaml, `//` in mjs).
- E5. Do not vendor the tenor GIF or the Flowser logo; skillicons become a plain text list unless each icon's license is recorded.
- E6. Delete `.github/FUNDING.yml` with a normal file delete; fix `docs/GITHUB-SETTINGS.md` lines 66 and 125 in the same commit WITHOUT writing the string `FUNDING.yml` back (use "no funding file").
- E7. One mechanical replacement script for the 9 translated READMEs and the 5 CONTRIBUTING translations (regex based, not line-number based; line numbers differ per file); no hand translation.
- E8. No GitHub API calls. Private vulnerability reporting, Discussions and Sponsorship-off are user-run items recorded in `docs/GITHUB-SETTINGS.md` and the backlog stub (run `mkdir -p process/general-plans/backlog` first).
- E9. R2-a: also run `grep -rIn "withkynam\|flowser" process --exclude-dir=vibebelt-rebrand_29-10-26` (Expected: no output) and record it in the report; it is a gate row below. Order C1 -> C2: never bump the version before the resolver fix is verified green at the old version.
- E10. K2-3 (closed by user decision): remove the WhatsApp invite per B2c; list the removal under "user decisions" in the phase report and write the backlog stub `process/general-plans/backlog/upstream-community-links_NOTE_29-10-26.md` at UPDATE PROCESS recording that choosing a replacement community channel is a backlog item for the user.

### Test gates

Test context: `process/context/tests/all-tests.md` does not exist until Phase 0; tiers come from the real scripts on disk. Re-check against the generated doc at execution time. Expected values are for AFTER the phase.

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P2 (R2.1) | old identity replaced everywhere except tagged attribution and brand-detection lines; `process/` stays clean | Fully-Automated | the R2.1 pipeline in the Exit Gate prints nothing (5 markers incl. `flowser\|tRPC`); PLUS `grep -rIn "withkynam\|flowser" process --exclude-dir=vibebelt-rebrand_29-10-26` prints nothing (row added by this contract, R2-a) | B (R2-a row added by this contract) |
| C-P2 (R2.2) | product display name no longer says vibecode-pro-max-kit outside attribution | Fully-Automated | `grep -rIn "vibecode-pro-max-kit" . --exclude-dir=.git --exclude-dir=process \| grep -v "upstream-attribution" \| grep -v "author: vibecode-pro-max-kit"` prints nothing | A (all 36 hit files owned) |
| C-P2 (R2.3) | no tenor / skillicons hotlinks, referenced local assets exist, logo gone | Fully-Automated | `grep -rIn "tenor\|skillicons" README.md docs` prints nothing; the assets loop prints nothing (vacuous once README names no local asset: R2.12 covers rendering); `test ! -e assets/flowser-logo.svg && echo gone` = `gone` | A |
| C-P2 (R2.4) | version 1.0.0 in manifest, README badge and CHANGELOG with fork origin | Fully-Automated | `node.exe -e "console.log(require('./vc-manifest.json').version)"` = `1.0.0`; `grep -c 'version-1.0.0' README.md` = 1; `grep -c '^## \[1.0.0\]' CHANGELOG.md` = 1; `grep -c 'upstream-baseline' CHANGELOG.md` >= 1 | A |
| C-P2 (R2.5) | version reset does NOT change which files the installer ships | Fully-Automated | `node.exe resolve-manifest.mjs \| sort \| diff - $B/resolved_p2_start.node-exe.txt` prints nothing (same runtime both sides); `node.exe resolve-manifest.mjs --json \| node.exe -e "..."` = `true` | A (reproduced: false before the C1 fix, identical after) |
| C-P2 (R2.6) | installer and updater work end to end against the new source | Hybrid | precondition: bash, git, Node 22 on Linux (user action). `node --test e2e-kit-flows.test.mjs; echo $?` = `0` where runnable, else recorded `baseline-red` / NOT TESTED; R2.5 + R2.7 carry the automated part | D (residual; Phase 8 user-run) |
| C-P2 (R2.7) | installer points to the new repo and is still valid shell | Fully-Automated | `grep -c '^REPO="https://github.com/Tomwakeupat530amm/vibebelt-kit.git"$' install.sh` = 1; `bash -n install.sh; echo $?` = `0`; `grep -c "Tomwakeupat530amm/vibebelt-kit"` on the 3 skill files, each >= 1 | A |
| C-P2 (R2.8) | portability validator still green and not weakened | Fully-Automated | `node.exe .claude/skills/vc-audit-vc/scripts/validate-kit-portability.mjs; echo $?` = `0`; `git diff $P2_START -- .claude/skills/vc-audit-vc/scripts/validate-kit-portability.mjs` prints nothing | A |
| C-P2 (R2.9) | security reporting uses GitHub private advisories on the new repo in all 6 files, no invented email | Fully-Automated | the `for f in SECURITY.md docs/i18n/SECURITY.*.md` loop prints nothing; `grep -rn "mailto:" SECURITY.md docs/i18n/SECURITY.*.md` prints nothing | A |
| C-P2 (R2.10) | FUNDING file is gone and nothing points at it | Fully-Automated | `test ! -e .github/FUNDING.yml && echo gone` = `gone`; `grep -rn "FUNDING.yml" . --exclude-dir=.git --exclude-dir=process` prints nothing | A |
| C-P2 (R2.11) | workflow YAML parses; whitespace clean; suite not worse than the Phase 0 baseline | Fully-Automated | PyYAML `ok` for `welcome.yml`, `release.yml`, `1.bug_report.yml`; `git diff --check $P2_START -- . ':!process/general-plans/active/vibebelt-rebrand_29-10-26'` prints nothing; `bash $B/compare.sh; echo $?` = `0` | A (Phase 0 `compare.sh` behaviour reproduced) |
| C-P2 (R2.12) | replaced images are legally safe, README and translations look right | Agent-Probe | reviewer opens README and each translation header, confirms no broken image, lists the license of every file added to `assets/` (or "none vendored") | A |
| C-P2 (R2.13) | remaining old-name lines are real attribution, not leftovers | Agent-Probe | reviewer reads each `upstream-attribution` line listed in the phase report and confirms it is a credit, a history entry, or a brand-detection pattern; also lists the 9 WhatsApp-link lines for the user (E10) | A |

Failing stubs (Fully-Automated rows only; red-first starting points, not on-disk test files):

```
Failing stub (R2.1):
test("should leave only tagged attribution lines for withkynam and flowser", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should leave only tagged attribution lines for withkynam and flowser")
})
Failing stub (R2.2):
test("should replace the vibecode-pro-max-kit display name outside attribution", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should replace the vibecode-pro-max-kit display name outside attribution")
})
Failing stub (R2.3):
test("should have no tenor or skillicons hotlinks and only existing local assets", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should have no tenor or skillicons hotlinks and only existing local assets")
})
Failing stub (R2.4):
test("should report version 1.0.0 in manifest, README badge and CHANGELOG", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should report version 1.0.0 in manifest, README badge and CHANGELOG")
})
Failing stub (R2.5):
test("should resolve the same file set before and after the version reset", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should resolve the same file set before and after the version reset")
})
Failing stub (R2.7):
test("should point install.sh at the new repo and stay valid shell", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should point install.sh at the new repo and stay valid shell")
})
Failing stub (R2.8):
test("should keep the portability validator green and unchanged", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should keep the portability validator green and unchanged")
})
Failing stub (R2.9):
test("should use the GitHub private advisory link in SECURITY.md and all 5 translations", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should use the GitHub private advisory link in SECURITY.md and all 5 translations")
})
Failing stub (R2.10):
test("should delete FUNDING.yml and leave no references to it", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should delete FUNDING.yml and leave no references to it")
})
Failing stub (R2.11):
test("should have valid workflow YAML, clean whitespace and not be worse than the Phase 0 baseline", () => {
  throw new Error("NOT IMPLEMENTED — TDD stub: should have valid workflow YAML, clean whitespace and not be worse than the Phase 0 baseline")
})
```

Legacy line form (kept for existing consumers):
- identity grep: [Fully-automated: R2.1 pipeline + `process/` grep print nothing]
- images: [Fully-automated: R2.3] | [agent-probe: licenses recorded]
- version: [Fully-automated: manifest/README/CHANGELOG 1.0.0 + resolve-manifest equivalence at the same runtime]
- installer contract: [hybrid: `node --test e2e-kit-flows.test.mjs` where Linux Node exists + `bash -n install.sh`] | [known-gap: e2e under node.exe, Phase 8 user-run]
- security/funding: [Fully-automated: R2.9, R2.10]
- known-gap: GitHub-side settings (Discussions, private reporting, sponsorship off) and live badges/links cannot be tested before the repo exists: known-gap: documented as NEW PLAN REQUIRED — see backlog stub `process/general-plans/backlog/github-settings-user-run_NOTE_29-10-26.md` (Phase 8 user-run steps)

High-risk class: yes, by reason of the installer/update contract (deploy/runtime/distribution) and the legal notice surface. No separate evidence pack is required by the schema; R2.5 (resolver equivalence, reproduced) and the Phase 8 install test are the proof that the distribution contract was not broken, and R2.6 stays a named residual until Linux Node 22 or a Phase 8 run exists.

### Dimension findings

- Infra fit: PASS — four disjoint groups, resolver-first ordering verified (bump before the fix empties the file list; after the fix the list is identical); all 36 display-name files and 27 old-name files are owned; resolver equivalence is stated as valid within one runtime only.
- Test coverage: PASS — the R2.1 / R2.2 / R2.5 gates reproduce as satisfiable on the real tree; the missing `process/` grep is added as a contract gate row (R2-a); R2.6 e2e is a named Hybrid residual with R2.5 + R2.7 as automated proof of the distribution contract.
- Breaking changes: PASS — resolver chosen by manifest shape is behavior-neutral for current and legacy manifests; the downgrade warning for upstream 3.x users is recorded in the CHANGELOG plan; manifest schema, flags and file set unchanged; `kitOnly` paths cannot affect the resolver output.
- Security surface: PASS — SECURITY uses GitHub private advisories (no invented email, no `mailto:`); `@withkynam` mentions replaced so the old owner is not notified; no vendored third-party media; no API calls. The live links depend on user-run GitHub settings (named residual).
- Section A (Inventory): PASS — 245 hits / 27 files and 36 display-name files match the Blast Radius.
- Section B (Replace identity): PASS — allowlist complete (11 lines), scope complete, FUNDING wording safe; WhatsApp links are a recorded user decision (K2-3).
- Section C (Resolver, version, origin): PASS — C1 before C2 verified by reproduction.
- Section D (User-only settings): PASS — three items recorded in GITHUB-SETTINGS and a backlog stub, no API calls.
- Section E (Report): PASS — attribution list, asset licenses, hand-off lines and the WhatsApp user-decision list all required.

Net gate derivation: Layer 1 = 0 FAIL / 0 CONCERN / 4 PASS; Layer 2 = 0 FAIL / 0 CONCERN / 5 PASS. MUST-FIX count: 0. RESIDUAL (bounded, named): 1 omitted gate command closed by a contract gate row (R2-a) and 3 Known-Gaps (K2-1, K2-2, K2-3). Net gate: PASS.
Vacuous-green check: every developed behavior has a Fully-Automated or Hybrid gate; R2.12/R2.13 are Agent-Probe for judgment only. The installer/updater end-to-end proof (R2.6) is a named Known-Gap residual in this environment and is never counted as a proof; the distribution contract itself is proven by R2.5 and R2.7.

### Open gaps

- R2-a (RESIDUAL, closed by the R2.1 gate row and instruction E9): `grep -rIn "withkynam\|flowser" process --exclude-dir=vibebelt-rebrand_29-10-26` is required by B0b / the umbrella SWEEP RULE but is not in the plan's Exit Gate code block.
- K2-1: R2.6 e2e install/update under Linux Node: known-gap: documented as NEW PLAN REQUIRED — see backlog stub to be written in Phase 8 (user-run steps)
- K2-2: GitHub-side settings and live links: known-gap: documented as NEW PLAN REQUIRED — see backlog stub `process/general-plans/backlog/github-settings-user-run_NOTE_29-10-26.md`
- K2-3: CLOSED by user decision - the old owner's WhatsApp invite is removed in B2c (gate R2.14 proves no `chat.whatsapp.com` remains). Residual: no replacement community channel exists; backlog item for the user in `process/general-plans/backlog/upstream-community-links_NOTE_29-10-26.md` (written at UPDATE PROCESS)

### What This Coverage Does NOT Prove

- R2.1/R2.2 prove no untagged old-name line remains; they do not prove the new links resolve (the GitHub repo does not exist yet; badges, advisories and Discussions links stay dead until Phase 8 and the user's push). They do not find other upstream identity that carries neither name (the WhatsApp link, K2-3).
- R2.3 proves local files exist; not that they render or are legally reusable (R2.12 samples that by judgment).
- R2.5 proves the resolver output is unchanged within one runtime; under `node.exe` that output is Windows-pathed and not what ubuntu ships, so it does not prove the Linux file set (Phase 8 install test and CI do).
- R2.6, when it can run only under `node.exe`, is red for an unrelated reason; nothing here proves Windows Git Bash, macOS, or a real network install.
- R2.7 proves syntax and the URL string, not that `curl ... | bash` from GitHub works.
- R2.9 proves the link text; it does not prove GitHub private reporting is switched on.
- R2.11 depends on the Phase 0 compare script and its `.agents/skills` handling.

Gate: PASS (0 FAIL, 0 MUST-FIX; 1 omitted gate command closed by a contract gate row and 3 named Known-Gaps carried). Not subject to the first-pass CONDITIONAL rule: PVL cycles 1 and 2 are recorded in `results.tsv`.
Accepted by: not required for PASS; Known-Gaps K2-1, K2-2 and K2-3 are recorded above as named residuals (session: outer-pvl cycle 3, autonomous /goal execution).

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
