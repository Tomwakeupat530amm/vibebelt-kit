---
phase: phase-02-identity-distribution
date: 2026-10-29
status: COMPLETE_WITH_GAPS
feature: general-plans
plan: process/general-plans/active/vibebelt-rebrand_29-10-26/phase-02-identity-distribution_PLAN_29-10-26.md
---

# Phase 02 Report: Identity and distribution

**Outcome (answer first):** Phase 2 is done and verified. The kit now points at `Tomwakeupat530amm/vibebelt-kit` everywhere a user or the installer looks: the installer, update and publish skills, the community files and both READMEs. The version is reset to 1.0.0, the Flowser logo, the tenor GIF, the skillicons images, the WhatsApp invite and `FUNDING.yml` are gone, and the CHANGELOG records the fork origin. The resolver bug that would have installed 0 files at 1.0.0 was fixed first. The independent EVL run (vc-tester, opus) on `0812325` passed every runnable row, including 4 mutation tests, a resolver negative control and a local install trial. Status is `COMPLETE_WITH_GAPS` only because of the named residuals K2-1 and K2-2 below (nothing can test them before the GitHub repo exists).

**EVL addendum (follow-up commit 0333ed8):** PASS: an independent vc-tester (opus) re-ran the Phase 2 Exit Gate and extra checks on 2026-10-29: R2.1, R2.2, R2.14 to R2.18, the Phase 1 supplement gate, compare.sh (exit 0), the CHANGELOG hooks block deep-equal to .claude/settings.json hooks (true; mutation test gives false), no old identity in the block, one `## [1.0.0]` heading matching the vc-update pointer, the downgrade-facts check (install.sh has no version comparison; the update skill prints the warning), credit lines tagged and LICENSE links resolving (negative test: removing the tag fails the gates), diff since 0812325 = exactly the 5 follow-up files, one author, no remote. The only non-green row was a non-empty git status caused by the UPDATE PROCESS edits made at that moment (this closeout commit).

**Agent-probe status (R2.12/R2.13):** PASS after fixes. A code-reviewer agent (read-only) found D1 (HIGH: `vc-update` pointed at a CHANGELOG hooks block that did not exist, and `MIGRATION.md` is a doomed file), D2, D4 and D6; all four were fixed in commit `0333ed8`. D3 was skipped (it concerns `MIGRATION.md`, deleted in Phase 8). D5 is expected (language switchers and translations are removed in the Phase 8 cleanup commit). D7 is information only: the user must enable Private Vulnerability Reporting on GitHub (hand-off to Phase 8).

## What Was Done

**Commits on `main` (author `Tomwakeupat530amm <minhnguyentuan31103@gmail.com>`, one identity, no remote, nothing pushed). `P2_START` = `a3cc0cf` (re-scope commit that carries the PASS contract):**

| Commit | Message | What it holds |
|---|---|---|
| `b80abad` | `chore: replace the upstream identity with vibebelt-kit and reset the version to 1.0.0` | 21 kit paths (108 insertions, 153 deletions) |
| `0812325` | `process: record phase 2 start marker, resolver references and the doomed-path filter` | `baseline/p2_start.txt`, `baseline/resolved_p2_start.node.txt` (416 lines), `.node-exe.txt` (493 lines), `harness/doomed.regex` |
| `0333ed8` | `fix: give upgraders a working hooks pointer, accurate switch instructions and a clearer fork credit` | 5 files: CHANGELOG hooks block and switch instructions, `vc-update/SKILL.md` pointer, README and VI README credit lines, one CONTRIBUTING sentence |

Commit trailer note: every commit ends with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`; the git author identity is the user's single identity (`git config user.name` = Tomwakeupat530amm). No second author appears in `git log`.

**Who did what (Phase Loop Progress):**
1. RESEARCH: done (C-CLEAN re-scope findings; 62-line to-do list re-derived).
2. INNOVATE: skipped as mechanical. The identity strings, the version and the resolver approach were fully specified by locked user decisions; there was no design choice to compare.
3. PLAN-SUPPLEMENT: done (C-CLEAN re-scope applied; Inner Loop Refresh Note written).
4. PVL: done, `Gate: PASS` (inner-pvl: phase-2, 2026-10-29).
5. EXECUTE: one vc-execute-agent (opus), sequential: resolver fix first, then version, then identity edits. Follow-up fixes in `0333ed8`.
6. EVL: independent vc-tester (opus) on `0812325`, PASS. Follow-up gate re-run for `0333ed8`: see the placeholder above.
7. UPDATE PROCESS: this report; plan checkboxes, umbrella state and status row, `results.tsv` row 8, `harness/verification.json`, stale lines in `process/context/all-context.md`. No commit made here.

**Resolver fix (step C1, done first).** `resolve-manifest.mjs` now sets `useGlob = Array.isArray(manifest.include)` (manifest shape) instead of `semverGte(version, "2.1.0")`. With the old check, version 1.0.0 would take the legacy branch and resolve 0 files. Proof: the file list is byte-identical to the Phase 2 start list at 3.2.5 and at 1.0.0 (416 files under Linux node, 493 under node.exe); negative control: the old resolver at 1.0.0 returns 0 files; legacy-manifest fixture still resolves. `vc-update/references/vc-update.md` version-format wording (4 lines) was rewritten to describe the shape rule.

**Version 1.0.0.** `vc-manifest.json`, both README badges (`README.md` was 3.2.5, `docs/i18n/README.vi-VN.md` was 3.0.0), and a new `CHANGELOG.md` entry `## [1.0.0]` with the fork origin (tagged), the `upstream-baseline` tag, a paste-ready hooks block generated from `.claude/settings.json` (deep-equal to the settings hooks) and accurate switch instructions from upstream 3.x (an upstream 3.x user who runs the update skill sees a downgrade warning).

**The 21 kit paths changed in `b80abad`:**

```
.claude/skills/vc-publish/SKILL.md            .claude/skills/vc-publish/references/vc-publish.md
.claude/skills/vc-setup/SKILL.md              .claude/skills/vc-update/SKILL.md
.claude/skills/vc-update/references/vc-update.md   .github/FUNDING.yml (deleted)
.github/ISSUE_TEMPLATE/1.bug_report.yml       .github/ISSUE_TEMPLATE/config.yml
.github/workflows/release.yml                 .github/workflows/welcome.yml
CHANGELOG.md                                  CONTRIBUTING.md
README.md                                     SECURITY.md
assets/flowser-logo.svg (deleted)             docs/i18n/README.vi-VN.md
e2e-kit-flows.test.mjs                        install.sh
process/context/all-context.md                resolve-manifest.mjs
vc-manifest.json
```

Phase 2 also edited, in `0333ed8`, only paths already in this list (`CHANGELOG.md`, `CONTRIBUTING.md`, `README.md`, `docs/i18n/README.vi-VN.md`, `vc-update/SKILL.md`).

**Identity edits (by group):**
- Installer and skills: `install.sh` `REPO="https://github.com/Tomwakeupat530amm/vibebelt-kit.git"`; same URL in `vc-update`, `vc-publish` (SKILL and reference) and `vc-setup`; `vc-update` now points at the CHANGELOG hooks block, not `MIGRATION.md`.
- Community files: `SECURITY.md` uses GitHub private advisories of the new repo (no email invented, no `mailto:`); issue-template links and `CONTRIBUTING.md` URLs moved to the new repo; `.github/FUNDING.yml` deleted; the old owner's WhatsApp invite removed from `CONTRIBUTING.md` and `welcome.yml` (3 lines).
- Display name `vibecode-pro-max-kit` -> `vibebelt-kit` in README title and credits, installer banner, CONTRIBUTING, CHANGELOG header, resolver and e2e comment headers, workflow display names, skills and references.
- READMEs (`README.md` and `docs/i18n/README.vi-VN.md`, edited at the same sites by content): Flowser logo block removed with no replacement, tenor GIF dropped, the three skillicons rows removed, badges and links moved to the new repo, the VI README version badge 3.0.0 -> 1.0.0, three pre-existing dead relative links in the VI README fixed.
- `process/context/all-context.md` lines 154 and 210 (step B7): the `assets/` entry and the old-name sentence rewritten without the old identity.

**Image decisions.** Flowser logo: removed, not replaced, and `assets/flowser-logo.svg` deleted. Tenor GIF: dropped (third-party clip, not vendored). Skillicons: removed (no remote icon service; no icon file vendored). License of every file in `assets/`: none vendored (`assets/` no longer exists). `shields.io`, `contrib.rocks` and star-history badges are dynamic remote images and stay remote.

**`upstream-attribution` lines kept (for the R2.13 review), 3 tagged credit lines + 11 brand-detection lines:**

| File | Line | Kind |
|---|---|---|
| `CHANGELOG.md` | 9 | fork-origin note (tagged) |
| `README.md` | 1696 | credit line, says "fork" and that LICENSE keeps the original notice (tagged) |
| `docs/i18n/README.vi-VN.md` | 1692 | VI credit line (tagged; the only hand-translated prose) |
| `.claude/skills/vc-audit-vc/scripts/validate-kit-portability.mjs` | 8, 93, 97, 106, 118 | brand-detection (untouched) |
| `.claude/skills/vc-publish/SKILL.md` | 216, 220, 238 | brand-detection text |
| `.claude/skills/vc-publish/references/vc-publish.md` | 134, 140, 163 | brand-detection text |

`LICENSE` keeps the original notice unchanged (not edited).

**DOOMED files skipped (from the A0 filter `harness/doomed.regex`):** the 8 non-English/non-Vietnamese `docs/i18n/README.*.md`, `docs/i18n/CONTRIBUTING.*.md` and `docs/i18n/SECURITY.*.md`, `docs/GITHUB-LABELS.md`, `docs/GITHUB-SETTINGS.md`, `docs/GOOD-FIRST-ISSUES.md`, `MIGRATION.md`, `.github/ISSUE_TEMPLATE/5.translation.yml`, and `process/general-plans/backlog/*_NOTE_*.md`. All are deleted by Phase 8 C0b; edits there would be thrown away.

**Before / after counts:**

| Measure | Before (`a3cc0cf`) | After (HEAD) |
|---|---|---|
| Old-identity lines (`withkynam\|flowser`) in kept files | 62 | 14 = 3 tagged credit + 11 brand-detection; untagged non-brand 0 |
| `process/` old-identity lines outside the task folder | >0 (all-context.md 154, 210) | 0 |
| Display-name `vibecode-pro-max-kit` lines in kept files (excluding `author:` lines) | 71 | 3 (tagged) |
| `tenor` / `skillicons` lines in the two READMEs | 20 | 0 |
| Version badges | 3.2.5 (README), 3.0.0 (VI) | 1.0.0 in both; manifest 1.0.0 |
| Resolver file list vs start list | 416 (node) / 493 (node.exe) | 416 / 493, byte-identical at 1.0.0 (old resolver at 1.0.0: 0 files) |
| WhatsApp lines in kept files | 3 | 0 |
| Dead relative links in the VI README | 3 | 0 |
| `baseline/compare.sh` | 0 | 0 |

(Before-counts re-derived with `git grep` at `a3cc0cf`; after-counts re-run by this agent at HEAD `0333ed8`.)

## What Was Skipped or Deferred

| Item | Why | Destination |
|---|---|---|
| INNOVATE step | Mechanical; decisions locked | n/a |
| `MIGRATION.md`, 8 translations, `docs/GITHUB-*.md`, translation issue template, backlog NOTE files | DOOMED (deleted in Phase 8 C0b) | Phase 8 C0b |
| Probe finding D3 (MIGRATION.md link) | The file is doomed | Phase 8 C0b |
| `author: vibecode-pro-max-kit` in 19 files | Part of the prefix/name rename | Phase 6 |
| Language switchers (README x2, SECURITY.md lines 1-8, CONTRIBUTING.md), CHANGELOG links to `MIGRATION.md` (about lines 217 and 234) | Dead only after C0b deletes their targets | Phase 8 C0b (umbrella C0b edit line updated this session to include `SECURITY.md` and both CHANGELOG links) |
| User-run GitHub settings: enable Private vulnerability reporting, enable Discussions, keep Sponsorship OFF, name a replacement community channel (D7) | Only the user can change them | `$TF/RELEASE-NOTES-1.0.0.md` in Phase 8 (the former D1 step of this plan was dropped by the C-CLEAN re-scope) |
| e2e Trial C, Trial D, native Windows/macOS runs (K2-1) | Trial C is the Phase 6 B4 fix; D and native runs need other environments | Phase 6 B4, Phase 8 |
| Live link checks and GitHub-side settings (K2-2) | The repo does not exist yet | Phase 8 |

## Test Gate Outcomes

| Gate | Result |
|---|---|
| Independent EVL run (vc-tester, opus) on `0812325`, every runnable Exit Gate row (R2.1-R2.11, R2.14-R2.18) | PASS |
| Mutation tests M1 (old URL re-added) / M2 (tag removed) / M3 (WhatsApp re-added) / M4 (broken relative link) | each caught by R2.1/R2.2, R2.16, R2.14, R2.15 (PASS) |
| Resolver: list identical at 3.2.5 and 1.0.0; negative control (old resolver at 1.0.0 returns 0 files); legacy-manifest fixture | PASS |
| Local install trial (`install.sh` against a local clone) | rc 0, version 1.0.0, 416 installed = 416 resolved, no `withkynam` in installed files |
| `release.yml` ordering gate: Phase 1 validator steps survive | PASS (44 steps) |
| `bash baseline/compare.sh` | exit 0 |
| Agent-Probe R2.12/R2.13 (code-reviewer, read-only) | PASS after fixes D1, D2, D4, D6 in `0333ed8` |
| Re-checks by this agent at HEAD `0333ed8` (read-only): R2.1 untagged non-brand lines, R2.1b `process/`, `tenor|skillicons`, WhatsApp, version badges, resolver diff vs start list, FUNDING/logo gone, CHANGELOG hooks deep-equality one-liner | 0 / 0 / 0 / 0 / 1.0.0 in both + manifest / empty diff (416 lines) / gone / `true` |
| Gate re-run of the follow-up fix commit `0333ed8` by the orchestrator's tester | PASS (see the EVL addendum at the top: independent vc-tester re-run on 2026-10-29) |

## Plan Deviations

1. The plan step D1 (a docs edit plus a backlog NOTE for the user-run GitHub settings) was dropped by the C-CLEAN re-scope; the list moves to the Phase 8 release notes (hand-off below).
2. A follow-up commit `0333ed8` was needed after the Agent-Probe review (D1 HIGH, D2, D4, D6); it only touches paths already inside the 21-path blast radius.
3. This agent also updated two lines of `process/context/all-context.md` that were stale after the version reset (version, distribution) and added a resolver-shape remark; the plan named only lines 154 and 210 (done by EXECUTE in B7).
4. Added `SECURITY.md` and the two CHANGELOG `MIGRATION.md` links to the umbrella C0b edit line (a single line-anchored edit); the earlier text said "line 125".

## Test Infra Gaps Found

| Gap | Detail | Routed to |
|---|---|---|
| e2e Trial C red at the legacyDeletions predicate | still baseline-red | Phase 6 B4 (K2-1) |
| e2e Trial D and native Windows/macOS runs untested | Trial D fails on this drvfs mount (cross-device clone) | Phase 8 (K2-1) |
| Live links and GitHub-side settings untestable | the repo is not created or pushed | Phase 8 (K2-2) |
| CHANGELOG hooks block is a copy of `.claude/settings.json` hooks | it can drift if Phase 6 changes hooks | Phase 8 re-runs the deep-equality one-liner (hand-off) |
| Rendering of the READMEs on GitHub not checked | static link/asset loops only | Phase 8 live check |
| Phase 0/1 carry-overs unchanged | `.agents/skills` text file on drvfs, 3 hook-lib tests, `validate-risk-artifacts` fixtures, CI on a real runner | see Phase 0/1 reports |

## SPEC Achievement

No separate `*_SPEC_*.md` exists for Phase 2 (the inner loop skips SPEC; the umbrella governs). Scored against the Phase 2 acceptance criteria:

| Criterion | Verdict |
|---|---|
| Old identity only in tagged or brand-detection lines in kept files, and nothing in `process/` | met (passing tests: R2.1, R2.1b, mutation test M1) |
| Display name `vibebelt-kit` everywhere in kept files | met (passing test: R2.2) |
| No Flowser logo, tenor GIF or skillicons; local assets exist | met (passing test: R2.3) |
| Version 1.0.0 in manifest, both READMEs and CHANGELOG | met (passing test: R2.4) |
| Resolver gives the same file list at 3.2.5 and 1.0.0; install works | met (passing tests: R2.5, negative control, local install trial 416 = 416) |
| Installer REPO line and update/publish URLs point at the new repo | met (passing test: R2.7) |
| Security channel is private advisories, no invented email; funding removed; WhatsApp removed | met (passing tests: R2.9, R2.10, R2.14, mutation test M3) |
| README relative links resolve; credit line present once per README | met (passing tests: R2.15, R2.16, mutation tests M2 and M4) |
| vc-update points at a CHANGELOG block that exists | met (passing tests: R2.17 plus the deep-equality one-liner; found and fixed after the probe) |
| e2e installer trials green (R2.6) | unmet in part, named residual K2-1 (Trial A and B pass; Trial C Phase 6 B4; Trial D and native runs Phase 8) |
| GitHub-side settings and live links work (K2-2) | unmet, named residual, owner Phase 8 |

## SPEC Gaps

- K2-1: e2e Trial C (Phase 6 B4), Trial D and native Windows/macOS runs (Phase 8). Already tracked in the Phase 0 backlog stubs for K0-1; no new stub needed.
- K2-2: GitHub-side settings (Private Vulnerability Reporting, Discussions, Sponsorship OFF, community channel) and live links, Phase 8, user-run list goes to `RELEASE-NOTES-1.0.0.md`.

Accepted notes (not gaps): D7 is the user's action; `author: vibecode-pro-max-kit` stays until Phase 6.

## Closeout Packet

1. **Selected plan path:** `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-02-identity-distribution_PLAN_29-10-26.md`
2. **Closeout classification:** Ready for UPDATE PROCESS archival, with the follow-up gate re-run of `0333ed8` recorded as PASS (EVL addendum). All developed behavior (resolver, version, identity edits, link and asset checks) is proven by passing automated gates; the residual K2-1/K2-2 rows are environment limits, not unproven behavior. The plan stays in the shared program task folder, which moves as a unit when the program closes; it is not moved to `completed/` now.
3. **What was finished:** see `## What Was Done`.
4. **Verified vs unverified:** verified by the independent EVL run, 4 mutation tests, the resolver negative control, the local install trial, the Agent-Probe, and this agent's read-only re-checks at HEAD. Unverified: the `0333ed8` gate re-run (pending), K2-1, K2-2.
   - 4b. **Validate-contract compliance:** present in the Phase 2 plan, `Gate: PASS` (inner PVL, 2026-10-29). Not edited by this agent.
5. **Cleanup done vs needed:** done: plan checkboxes, this report, umbrella state, status row and C0b line, `results.tsv` row 8, `harness/verification.json`, `process/context/all-context.md`. Needed: process commit (orchestrator via vc-git-manager); the EVL addendum is filled.
6. **Single best next valid state:** make the process commit (EVL addendum already recorded); then Phase 3 (`phase-03-slim-agents_PLAN_29-10-26.md`), loop step 1 RESEARCH. The user asked to stop after Phase 2 for the night, so do not start Phase 3 until the user resumes. When it starts, Phase 3's A0 cost acknowledgement is the FIRST step before any billed run.
7. **Commit-checkpoint recommendation:** Execution commits already made (`b80abad`, `0333ed8`). Process commit belongs after this UPDATE PROCESS: stage the Phase 2 plan, this report, the umbrella, `results.tsv`, `harness/verification.json` and `process/context/all-context.md`. Do not stage unrelated edits.
8. **Regression status:** `bash baseline/compare.sh` exit 0; Phase 1 surfaces (model facts, validator count 38, CI step counts 42/44) untouched; `release.yml` Phase 1 steps survive (44 steps); `validate-kit-portability.mjs` unchanged.
9. **SPEC achievement:** see `## SPEC Achievement` (9 met, 2 named residuals).

**Drift score:** HIGH (signals: (a) 21 files in the execution commit; (b1) `.claude/` skills and workflows changed; (b2) `README.md`, `CHANGELOG.md` and `SECURITY.md` changed; (d) the plan scope was re-scoped (C-CLEAN) and files deleted; (e) a follow-up fix commit was needed after the probe). Strongly recommend UPDATE PROCESS -- harness/protocol files touched. Gap items K2-1 and K2-2 have owners in Phases 6 and 8, so no extra stub is needed.

**Tier-1 audits run by this agent (2026-10-29, Linux node 22.23.4):**

| Command | Result |
|---|---|
| `validate-plan-inventory.mjs` | exit 0, strict false |
| `validate-phase-reports.mjs <umbrella>` (in `vc-audit-plans/scripts/`) | exit 0, 0 warnings, 0 failures |
| `validate-umbrella-state.mjs <umbrella>` (in `vc-audit-plans/scripts/`) | exit 0, 0 warnings, 0 failures (run after the line-anchored state rewrite; the umbrella grew by 5 lines, 18 insertions, 13 deletions) |
| `validate-plan-artifact.mjs` Phase 2 plan / umbrella | exit 0 each, 0 failures (advisory warnings only) |
| `validate-umbrella-artifact.mjs <umbrella>` | exit 0, 0 failures |
| `validate-all-context.mjs` | exit 0, 0 failures, 0 warnings |
| `discover-context.mjs --check-routing` | "routing block is in sync", exit 0 |
| `bash baseline/compare.sh` | exit 0, "nothing worse than validators_after_setup.tsv", NOTE new validator |
| `validate-context-discovery.mjs` | exit 1: the known Phase 0 baseline red (`.agents/skills` is a text file on drvfs), same as baseline, not worse |
| `git diff --check` | no output, exit 0 |

First attempt note: the two umbrella validators were first called from the wrong folder (`vc-generate-phase-program/scripts/`) and crashed with module-not-found; they live in `.claude/skills/vc-audit-plans/scripts/`. The re-run above is the real result.

**Mirror / surface review:** Claude `.claude/skills` edited by EXECUTE (URLs only; `.codex` has no matching text, not edited); `AGENTS.md` and `CLAUDE.md` not edited by Phase 2 (no old identity there); READMEs edited by EXECUTE; `process/development-protocols/` unchanged.

**Context audit (files reviewed):**

| File | Outcome |
|---|---|
| `process/context/all-context.md` | edited by this agent: resolver line (shape rule), `vc-manifest.json` version 3.2.5 -> 1.0.0, distribution line (new repo name, 1.0.0). Lines 154 and 210 were fixed by EXECUTE (B7). The Open Questions bullet about the repo URL is already accurate (repo is created in Phase 8) |
| `process/context/tests/all-tests.md` | unchanged: no line became false (e2e trial description, baseline reds, CI step counts 42/44 and validator count 38 still hold; Trials C and D are still red as written) |
| `process/context/planning/all-planning.md` | unchanged: points at the umbrella state |
| `process/context/generated-skills-catalog.json` | unchanged: no skill added or renamed |
| `process/context/{_all-group-template.md.seed, all-context.md.seed, tests/all-tests.md.seed}` | unchanged: seed companions |

## Forward Preview

### Test Infra Found
- The resolver now has a negative control (old resolver at 1.0.0 returns 0 files) and two reference lists: `baseline/resolved_p2_start.node.txt` (416) and `.node-exe.txt` (493).
- `harness/doomed.regex` is the shared filter for sweeps until Phase 8 C0b.

### Blast Radius Changes
Matches the re-scoped plan: 21 kit paths plus 4 process files in `0812325`. Added after the plan: the `0333ed8` follow-up (5 paths, all inside the 21).

### Commands to Stay Green
```
bash process/general-plans/active/vibebelt-rebrand_29-10-26/baseline/compare.sh
node resolve-manifest.mjs | sort | diff - process/general-plans/active/vibebelt-rebrand_29-10-26/baseline/resolved_p2_start.node.txt
node -e "const fs=require('fs'),u=require('util');const m=fs.readFileSync('CHANGELOG.md','utf8');const h=m.indexOf('### Hooks block to paste into .claude/settings.json');const a=m.indexOf('```json\n',h)+8;const b=m.indexOf('\n```',a);console.log(u.isDeepStrictEqual(JSON.parse(m.slice(a,b)),JSON.parse(fs.readFileSync('.claude/settings.json','utf8')).hooks))"   # expects true
node .claude/skills/vc-audit-vc/scripts/validate-kit-portability.mjs
node .claude/skills/vc-audit-vc/scripts/validate-model-effort-policy.mjs
```
Phase 3 and later must not reintroduce the old identity (R2.1 grep) or break the resolver shape rule. Phase 6 (rename) must keep the resolver list stable (modulo renamed paths) and re-run the CHANGELOG deep-equality check if `.claude/settings.json` hooks change.

### Dependency Changes
- No package or runtime dependency changes.
- Behavior change: `resolve-manifest.mjs` chooses glob mode by manifest shape, so the `vc-update` and `vc-publish` skills no longer depend on a version number to read the manifest format.
- Version is 1.0.0; upstream 3.x users see a downgrade warning on update (documented in the CHANGELOG switch instructions).

### Hand-offs
1. `author: vibecode-pro-max-kit` in 19 files -> Phase 6.
2. CHANGELOG hooks block is a COPY of `.claude/settings.json` hooks: Phase 8 re-runs the deep-equality one-liner above (expects true).
3. Phase 8 C0b finds by content and removes: the language switchers in `README.md`, `docs/i18n/README.vi-VN.md`, `SECURITY.md` (lines 1-8) and `CONTRIBUTING.md` (switcher plus the Translations section near line 71), and the CHANGELOG links to `MIGRATION.md` (about lines 217 and 234). The umbrella C0b edit line now lists `SECURITY.md` and both CHANGELOG links.
4. User-run GitHub settings (Private vulnerability reporting, Discussions, Sponsorship OFF, a replacement community channel) go to `RELEASE-NOTES-1.0.0.md` in Phase 8.
5. Phase 3's step A0 is a cost acknowledgement and must come before any billed run.
