---
name: context:all-tests
description: "Test runners, validator commands, CI jobs, and known baseline failures for vibebelt-kit; start here for any verification task"
keywords: test, tests, validator, validate, node test, e2e, ci, github actions, baseline, red, windows, node.exe, verification, hooks test
related: [context:all-planning]
date: 29-10-26
---

# vibebelt-kit - All Tests

Last updated: 2026-10-29

Attach this file first when the task involves testing, verification, or test debugging.

This is the fast operator guide for the testing surface of this repo. There is no `package.json` and no package manager: everything runs with plain `node` (Node.js 22+; this Windows/WSL machine has Linux node v22.23.4 (WSL) and node.exe v24.15.0; the saved baselines exist for both runtimes).

---

## What This Covers

- the three kinds of checks: validator scripts, the e2e test, and per-area unit tests
- exact commands and the CI job list
- known baseline failures (do not chase these)

## Read This When

- running checks after any change to `.claude/`, `.codex/`, `process/`, or root scripts
- a validator or the e2e test fails and you need to know if it was already red
- deciding which gate command to put in a validate-contract

## Quick Routing

| If you need... | Read next |
|---|---|
| the program's saved validator results (before/after) | `process/general-plans/active/vibebelt-rebrand_29-10-26/baseline/validators_before.tsv` (Linux node) and `.../baseline/validators_before.node-exe.tsv` (node.exe); same pair for `validators_after_setup` |
| which validators CI runs | `.github/workflows/validate.yml` |
| validator ownership by skill | `.claude/skills/vb-audit-vc/SKILL.md`, `.claude/skills/vb-audit-context/SKILL.md`, `.claude/skills/vb-audit-plans/SKILL.md` |
| the planning side of verification | `process/context/planning/all-planning.md` |

(No deeper test docs exist in this group yet; this file is enough for the current surface.)

## Quick Decision Guide

### Use the validators when

- you changed agents, skills, hooks, protocols, seeds, or context docs: these scripts check structure, parity (`.claude/agents` vs `.codex/agents`), wiring, frontmatter, and portability
- there are 38 of them: `.claude/skills/<skill>/scripts/` files named `validate-*.mjs`. Run each from the repo root.

### Use `node --test e2e-kit-flows.test.mjs` when

- you changed `install.sh`, `resolve-manifest.mjs`, `compute-sync-plan.mjs`, or `vb-manifest.json`
- it runs four trials in throwaway `/tmp/vb-e2e-*` projects: A new install on an empty project, B user skills survive install, C v2.x to v3 migration, D publish dry-run never pushes

### Use the per-area unit tests when

- you changed hooks (`.claude/hooks/__tests__/session-state.test.cjs`, `.claude/hooks/lib/__tests__/*.test.cjs`, `.claude/hooks/scout-block/tests/`), `vb-review-situation` (`review-situation-scan.test.cjs`), or `vb-agent-browser` (`scripts/__tests__/*.test.js`)
- `vb-sequential-thinking` (`tests/*.test.js`) is not in this list: its tests use `describe` globals and are not runnable with `node --test` (exit 1: `ReferenceError: describe is not defined`)
- these use `node --test <file>`; they are excluded from the install manifest, so they only exist in this source repo

## Default Verification Order

1. run the validators nearest your change (agent edit: `validate-agent-parity`, `validate-agent-frontmatter`; skill edit: `validate-skills`, `validate-skill-routing`; context edit: `validate-all-context`, `validate-context-discovery`; protocol edit: `validate-protocol-wiring`, `validate-protocol-discovery`)
2. run `git diff --check` (merge-conflict markers and whitespace)
3. run the e2e test only when installer or manifest code changed
4. compare any red against the baseline list below before treating it as yours

## Commands

Run from the repo root with `node` (Linux 22) or `node.exe` (Windows 24); the baseline is saved for both and compare.sh requires the same runtime for before and after.

| Area | Runner | Command |
|---|---|---|
| one validator | node | `node .claude/skills/<skill>/scripts/<validator>.mjs` |
| context validator | node | `node .claude/skills/vb-generate-context/scripts/validate-all-context.mjs` |
| context routing in sync | node | `node .claude/skills/vb-context-discovery/scripts/discover-context.mjs --check-routing` |
| agent parity | node | `node .claude/skills/vb-audit-vc/scripts/validate-agent-parity.mjs` |
| all validators (loop) | bash | `for f in .claude/skills/*/scripts/validate-*.mjs; do node "$f" >/dev/null 2>&1; echo "$? $f"; done` |
| installer / manifest e2e | node:test | `node --test e2e-kit-flows.test.mjs` |
| hook unit test | node:test | `node --test .claude/hooks/__tests__/session-state.test.cjs` |
| hook lib tests | node:test | `node --test '.claude/hooks/lib/__tests__/*.test.cjs'` (quote the glob; Node 22 does not accept a directory argument; baseline 113 tests, 110 pass, 3 fail) |
| whitespace / conflict markers | git | `git diff --check` |

**CI** (`.github/workflows/validate.yml`, on `pull_request` and `push` to `main`, Ubuntu, Node 22) runs 42 steps: checkout, Node 22 setup, then every validator (the original set plus, since Phase 1, 21 more run on their pass fixtures, among them the new `validate-model-effort-policy.mjs`), plan artifacts (if any), kit portability, and finally a non-blocking markdownlint. Two of the added steps carry `continue-on-error: true` because they fail on a bare kit checkout: `validate-eval-coverage.mjs` (needs runtime-harness scenarios that this kit does not ship) and `validate-risk-artifacts.mjs` (no fixtures of its own; backlog: `process/general-plans/backlog/risk-artifacts-validator-fixtures_NOTE_29-10-26.md`). `release.yml` (version tag only) repeats the same validators in 44 steps. A push to `main` cancels any in-flight run on `main` (`cancel-in-progress`). CI has not run on a real Ubuntu runner yet (Phase 8). The e2e test is not in CI.

## Debugging Quick Reference

- **Run validators from the repo root.** They use `process.cwd()` or `git rev-parse --show-toplevel`; running from another directory checks the wrong tree.
- **Two git binaries.** From WSL, `git` is Linux git, but validators launched through `node.exe` shell out to Windows git. Both must see a clean, same-state tree.
- **Two runtimes.** WSL has Linux node 22 (`node`) and Windows has `node.exe` 24; paths printed by node.exe are Windows-style. Compare results only against a baseline saved with the same runtime.
- **`/tmp` in e2e.** `e2e-kit-flows.test.mjs` creates `/tmp/vb-e2e-*` projects (under `node.exe` this resolves to `C:\tmp\`). Delete only the folders your own run created.
- **Generated catalog.** `process/context/generated-skills-catalog.json` is rebuilt with `node .claude/skills/vb-audit-context/scripts/generate-skills-catalog.mjs --write`.

## Known Gaps

Baseline reds on 2026-10-29 (saved in `process/general-plans/active/vibebelt-rebrand_29-10-26/baseline/validators_before.node-exe.tsv` for node.exe and `.../baseline/validators_before.tsv` for Linux node; the two validator reds (validate-skills, validate-context-discovery) appear in both the node.exe and the Linux node baselines). Do not treat these as regressions:

| Check | Exit | Cause | Owner |
|---|---|---|---|
| `validate-skills.mjs` | 1 | `.agents/skills` is a 17-byte text file in the Windows work tree (a symlink in the git index, mode 120000); the validator cannot follow it | environment; red under both node.exe and Linux node on this drvfs mount (exit 1 in both baseline TSVs); green only on a native Linux or CI checkout where .agents/skills is a real symlink |
| `validate-context-discovery.mjs` | 1 | same `.agents/skills` text file | environment; red under both node.exe and Linux node on this drvfs mount (exit 1 in both baseline TSVs); green only on a native Linux or CI checkout where .agents/skills is a real symlink |
| `node --test e2e-kit-flows.test.mjs` | 1 | Under node.exe: Windows path bug (`new URL(import.meta.url).pathname`, `/tmp` paths). Under Linux node on this drvfs mount: Trial C fails the AC-5 legacyDeletions predicate (fix in Phase 6 task B4) and Trial D fails with a cross-device git clone link error; Trials A and B pass | Phases 6 and 8 of the rebrand program |
| `.claude/hooks/lib/__tests__/statusline-integration.test.cjs` | 1 | baseline red (Linux node) | none |
| `.claude/hooks/lib/__tests__/statusline-scenarios.test.cjs` | 1 | baseline red (Linux node) | none |
| `.claude/hooks/lib/__tests__/transcript-parser-signals.test.cjs` | 1 | baseline red (Linux node) | none |
| `.claude/skills/vb-review-situation/scripts/review-situation-scan.test.cjs` | 1 | 1 of 10 fails: 'task-folder convention plan is detected as primary plan' (`payload.plans.finished is not iterable`) | none |
| `.claude/skills/vb-sequential-thinking/tests/*.test.js` | 1 | 'describe is not defined' (tests use `describe` globals) | none |

Other gaps:

- the e2e test and the per-area unit tests are not run by CI; a clean run of the per-area tests is not expected
- no coverage tooling, no linter beyond non-blocking markdownlint
- `.agents/skills` must stay as-is until the program decides otherwise: do not "fix" it while chasing the two validator reds
