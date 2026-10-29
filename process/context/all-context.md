---
name: context:all-context
description: "Root context router for vibebelt-kit: project overview, repo structure, tech stack, conventions, and routing to context groups"
keywords: vibebelt, vibecode, kit, harness, riper-5, architecture, structure, stack, router, rebrand, install, manifest, agents, skills, hooks
related: [context:all-planning, context:all-tests]
date: 29-10-26
---
# vibebelt-kit - All Context

Last updated: 2026-10-29

This file is the root context entrypoint for the repo.

Use it for two things:

1. quick routing to the right context pack or root file
2. broad architecture and repository understanding

Start here before loading deeper context files.

## What This Project Is

vibebelt-kit is a RIPER-5 plan-first workflow harness. You install it into another project, and AI coding agents (Claude Code and Codex) then work through 7 gated phases (Research, Spec, Innovate, Plan, Validate, Execute, Update-Process) instead of jumping straight to code. The end users are non-developer "vibecoders". This repo is the kit's source, not an app built with the kit.

**Naming note (rename in progress):** the project is being renamed from `vibecode-pro-max-kit` to `vibebelt-kit`, and the skill/agent prefix `vc-` becomes `vb-` in Phase 6 of the active program. Until then every agent, skill, validator path, and manifest entry still says `vc-`, and the working directory is still `vibecode-pro-max-kit-main`. Read paths in this file as they are on disk today. The program lives at `process/general-plans/active/vibebelt-rebrand_29-10-26/` (see `process/context/planning/all-planning.md`); do not duplicate it here.

**Careful points:** signal strings (`PHASE_COMPLETE:`, `Gate: PASS`, `SUPPLEMENT_APPLIED:`, `QUICK_FIX_ABORT:`) must stay verbatim; never remove the original MIT line `Copyright (c) 2026 vibecode` from `LICENSE`; `CLAUDE.md` and `AGENTS.md` are managed protocol files and hold no project facts; `.agents/skills` is a symlink in git (mode 120000) but a 17-byte text file in this Windows work tree, so leave it alone.

---

## How This File Works (the `all-*.md` Convention)

Every `process/context/` directory has one `all-*.md` entrypoint that acts as an attachable quick router for that domain. This root file (`all-context.md`) is the top-level router. Context groups each have their own `all-{group}.md` entrypoint.

**How agents use it:**

1. Agent reads `all-context.md` first (this file)
2. Finds the relevant context group from the routing tables below
3. Reads that group's `all-{group}.md` entrypoint
4. Only then loads the specific deep doc needed

This layered routing keeps context windows small. Never load the whole `process/context/` tree.

**What each `all-{group}.md` must contain:** scope, read-when rules, quick procedures or decision rules, source paths, update triggers, routing to deeper docs.

---

## Quick Start

For most substantial tasks:

1. read this file first
2. choose the smallest relevant root file or context group from the tables below
3. only then load deeper files

---

## Current Root Entry Points

<!-- The two tables below (Root Entry Points + Context Groups) are GENERATED from each
     context doc's frontmatter by `discover-context.mjs --emit-routing`. Do NOT hand-edit
     between the GENERATED markers — your edits will be overwritten on the next rebuild.
     To change a row, edit the owning doc's frontmatter (description / keywords) and re-emit.
     `--check-routing` fails lint if this block drifts from the frontmatter on disk. -->

<!-- GENERATED:routing -->
| File | Read when |
|---|---|
| `process/context/all-context.md` | any substantial planning, research, review, or implementation task |
| `process/context/planning/all-planning.md` | Plan shape calibration, task-folder convention, and where plans live for vibebelt-kit; points at the active rebrand program |
| `process/context/tests/all-tests.md` | Test runners, validator commands, CI jobs, and known baseline failures for vibebelt-kit; start here for any verification task |

## Current Context Groups

| Group | Entry point | Scope |
|---|---|---|
| `planning/` | `process/context/planning/all-planning.md` | Plan shape calibration, task-folder convention, and where plans live for vibebelt-kit; points at the active rebrand program |
| `tests/` | `process/context/tests/all-tests.md` | Test runners, validator commands, CI jobs, and known baseline failures for vibebelt-kit; start here for any verification task |
<!-- /GENERATED:routing -->

## Task Routing Table

| Task type | Load first | Then load |
|---|---|---|
| general repo research, architecture or stack questions | `all-context.md` | the root file or directory named by the task |
| creating, resuming, or auditing a plan | `all-context.md`, `planning/all-planning.md` | `process/development-protocols/plan-lifecycle.md`, the active plan |
| the rebrand program (rename, phases) | `all-context.md`, `planning/all-planning.md` | `process/general-plans/active/vibebelt-rebrand_29-10-26/vibebelt-rebrand-umbrella_PLAN_29-10-26.md` |
| test planning, verification, validator failures | `all-context.md`, `tests/all-tests.md` | the validator's owning skill (`.claude/skills/vc-audit-vc/SKILL.md` and siblings) |
| debugging | `all-context.md`, `tests/all-tests.md` | the smallest script or hook that explains the failure |
| editing agents, skills, hooks | `all-context.md` | `process/development-protocols/implementation-standards.md`, then the file's own SKILL.md or agent file |
| installer, manifest, update/publish flow | `all-context.md` | `install.sh`, `vc-manifest.json`, `resolve-manifest.mjs`, `compute-sync-plan.mjs` |
| context maintenance | `all-context.md` | `process/development-protocols/context-maintenance.md`, then run `vc-audit-context` |

## Context Group Lifecycle

Context groups are durable knowledge domains, not feature folders.

Create a group when:

- a topic has 3+ durable docs
- a single doc exceeds roughly 800 lines with separable subtopics
- multiple agents repeatedly need only one slice of a large context file
- the topic maps to a stable operational domain (tests, infra, database, auth, UI, workflows, etc.)

Do not create a group when the content is a temporary report, a plan or execution artifact, or feature-specific (that belongs in `process/features/...`).

Groups here today: `tests` and `planning`. Not created on purpose: `cicd` (only four small workflow files, covered in `tests/all-tests.md`), `database`, `auth`, `container`, `infra`, `uxui`, `workflows` (the project has none of these domains).

Move or split one group at a time. Use `all-{group}.md` entrypoints. Run the `vc-audit-context` skill after every context organization change.

## Naming Convention

There are no `README.md` files inside `process/context/`. Canonical entrypoints use `all-*.md`: root `process/context/all-context.md`, group `process/context/{group}/all-{group}.md`.

## Context Update Protocol

When durable project knowledge changes:

1. update the smallest relevant context file
2. update this file if routing, ownership, naming, or groups changed
3. update the owning `all-{group}.md` entrypoint when a group exists
4. regenerate routing: `node .claude/skills/vc-context-discovery/scripts/discover-context.mjs --emit-routing`
5. run `vc-audit-context`

---

## Repository Structure

```
vibecode-pro-max-kit-main/            -- kit source repo (becomes vibebelt-kit)
  CLAUDE.md, AGENTS.md                -- managed protocol files (orchestrator rules, RIPER-5); no project facts
  README.md, CHANGELOG.md, MIGRATION.md, CONTRIBUTING.md, SECURITY.md, LICENSE (MIT)
  install.sh                          -- bash installer (472 lines); clones/copies kit, backs up old setup, installs
  resolve-manifest.mjs                -- glob resolver for vc-manifest.json (needs Node 22 fs.globSync)
  compute-sync-plan.mjs               -- pure add/modify/delete/preserve plan between kit and target
  e2e-kit-flows.test.mjs              -- 4 node:test install trials
  vc-manifest.json                    -- version 3.2.5; include/exclude/kitOnly/symlinks/legacyDeletions lists
  .claude/
    agents/                           -- 15 agent prompts (vc-*-agent, vc-tester, vc-debugger, ...)
    skills/                           -- 33 skills; each has SKILL.md, plus references/ and scripts/
    hooks/                            -- 10 hook entrypoints (.cjs/.mjs) + lib/ + scout-block/ + __tests__/
    settings.json                     -- hook wiring (SessionStart, SubagentStart, PreToolUse, PostToolUse, Stop)
  .codex/
    agents/                           -- 15 .toml mirrors of the .claude agents (parity is validated)
    hooks/, hooks.json, config.toml   -- Codex-side hooks and settings
  .agents/skills                      -- symlink to ../.claude/skills in git; text-file placeholder in this work tree
  process/
    _seeds/                           -- read-only scaffold templates (do not edit)
    development-protocols/            -- RIPER-5 protocol docs; vc-system-behavior/ has 12 numbered files
    context/                          -- this router, tests/, planning/, generated-skills-catalog.json; four `.seed` files left by vc-setup are kept as structural references (two at top level: all-context.md.seed and _all-group-template.md.seed; one each in tests/ and planning/)
    general-plans/{active,backlog,completed}/  -- plan task folders; active holds the rebrand program
    features/                         -- feature folders (none yet) + _feature-template/
  docs/                               -- i18n/ (README, CONTRIBUTING, SECURITY translations), GitHub label/settings notes
  assets/                             -- no vendored media (README images are text or remote badges)
  .github/                            -- workflows (validate, release, labeler, welcome), issue templates, PR template
```

38 validator scripts live at the `scripts/` folder of each skill under `.claude/skills/` (files named `validate-*.mjs`), concentrated in `vc-audit-vc`, `vc-audit-context`, and `vc-audit-plans`.

## Technology Stack

- **Language / runtime:** JavaScript on Node.js 22+ (hard requirement: `install.sh` exits below 22 and `resolve-manifest.mjs` uses `fs.globSync`). Local runtime on this machine: Linux `node` v22.23.4 (WSL, `~/.local/bin/node`) and `node.exe` v24.15.0 (Windows). Scripts are `.mjs` (ES modules) and `.cjs` (CommonJS hooks).
- **Shell:** bash for `install.sh` (Git Bash or WSL on Windows).
- **Docs:** Markdown everywhere (agents, skills, protocols, plans, context); `.markdownlint.json` at the root.
- **Config formats:** JSON (`vc-manifest.json`, `.claude/settings.json`, `.codex/hooks.json`), TOML (`.codex/config.toml`, agent mirrors), YAML (GitHub workflows, frontmatter in every doc).
- **Dependencies:** none at the repo level. No `package.json`, no lockfile, no package manager. Two skills carry their own small footprints: `vc-sequential-thinking` (`package.json`) and `vc-agent-browser` (scripts and a lockfile); both are excluded from installs by the manifest.
- **CI:** GitHub Actions: `validate.yml` (pull_request and push to `main`, Ubuntu, Node 22; 42 steps) and `release.yml` (version tag; 44 steps), plus `labeler.yml` and `welcome.yml`. No deployments.
- **Distribution:** `curl ... install.sh | bash` from a GitHub repo (the user's own repo, not yet pushed); version tracked by `vc-manifest.json` (`3.2.5`) and a `.vc-version` file written into target projects.
- **Agent targets:** Claude Code (`.claude/`) and Codex (`.codex/`, model `gpt-5.4`); skills are shared through `.agents/skills`.

## Key Patterns and Conventions

**Workflow:** RIPER-5, outer order Research, Spec, Innovate, Plan, Validate, Execute, Update-Process. The orchestrator (main session) routes; subagents do the work and end with DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT. Full rules: `process/development-protocols/all-development-protocols.md` and `process/development-protocols/vc-system-behavior/01-overview.md`.

**Three layers:** actor agents (`.claude/agents/`, own a phase), contract skills (own a workflow artifact), helper skills (own none). Every `SKILL.md` carries `layer` and `trigger_keywords` in frontmatter; the generated catalog is `process/context/generated-skills-catalog.json`.

**Agent parity:** each Markdown agent in `.claude/agents/` has a same-named `.toml` mirror in `.codex/agents/`. Change both together; `validate-agent-parity.mjs` enforces it.

**Model policy:** each Claude agent runs on the model in its own `.claude/agents/*.md` front-matter: opus on 7 (`vc-execute-agent`, `vc-fast-mode-agent`, `vc-quick-fix-agent`, `vc-plan-agent`, `vc-research-agent`, `vc-tester`, `vc-validate-agent`), sonnet on the other 8; `effort: max` on the three execution agents. Codex uses the single model in `.codex/config.toml`. `validate-model-effort-policy.mjs` enforces the model table; the documents were aligned to the files in the rebrand program Phase 1 (user decision 2026-10-29: keep opus as set).

**Plans:** task-folder convention `{slug}_{dd-mm-yy}/` holding `{slug}_PLAN_{dd-mm-yy}.md` plus colocated reports; flat plan files are legacy and read-only.

**Frontmatter everywhere:** context docs, protocols, plans, and reports carry YAML frontmatter (`name`, `description`, `date`, `keywords`); validators and `vc-context-discovery` route on it.

**Naming and style:** descriptive kebab-case filenames; source files roughly under 200 lines where practical (Markdown exempt); dates as `dd-mm-yy` in artifact names and frontmatter; communication standard is answer-first (BLUF), plain language, no emojis (`process/development-protocols/communication-standards.md`).

**Install model:** `vc-manifest.json` lists what is shipped (`include`), never shipped (`exclude`), source-only (`kitOnly`: README, docs, .github, installer scripts, e2e test), merged (`.claude/settings.json`), and old paths to delete (`legacyDeletions`). `install.sh` backs up an existing setup to `.vibecode-backup/`; project content under `process/` is preserved.

**Commit policy:** solo maintainer works directly on `main`; conventional-commit prefixes (feat, fix, docs, spec, process, phase, chore, refactor, test), enforced by an advisory hook.

## Environment and Configuration

**Config files:** `vc-manifest.json`, `.claude/settings.json` (hook wiring), `.codex/config.toml` and `.codex/hooks.json`, `.gitignore`, `.gitattributes` (forces LF on sh/mjs/cjs/md/json/toml/yml), `.markdownlint.json`.

**Env var groups (names only):**

- Installer: `VC_KIT_SOURCE` (local path or git URL override for the kit source), `TMPDIR` (temp base)
- Hooks: `CLAUDE_PROJECT_DIR` (used in `.claude/settings.json` hook commands)
- No secrets, API keys, or database variables are used by this repo.

**Local-only files (git-ignored):** `.vc-version`, `.vc-publish-config`, `.vibecode-backup/`, `node_modules/`, `*.log`, hook `.logs/`, `.claude/skills/vc-agent-browser/screenshots/`.

## Testing

No test framework or package manager. Checks are plain Node scripts: the 38 validators, the `node --test e2e-kit-flows.test.mjs` installer trials, and a few unit tests under hooks and skills. Commands, CI job list, and the known baseline failures: `process/context/tests/all-tests.md`.

## Open Questions

- The `.agents/skills` symlink cannot be followed in this Windows work tree, so two validators fail here only; whether to repair it is deferred to the program owner.
- The installer `REPO` and the README now point at `https://github.com/Tomwakeupat530amm/vibebelt-kit`, which the user creates in Phase 8 (until then those links do not resolve).
- Exact status of the rebrand phases lives only in the umbrella plan's `## Current Execution State`.

## Source References

- `CLAUDE.md`, `AGENTS.md`, `README.md`, `CHANGELOG.md`, `LICENSE`
- `vc-manifest.json`, `install.sh`, `resolve-manifest.mjs`, `compute-sync-plan.mjs`, `e2e-kit-flows.test.mjs`
- `.claude/settings.json`, `.github/workflows/validate.yml`, `.github/workflows/release.yml`
- `process/development-protocols/all-development-protocols.md`
- `process/general-plans/active/vibebelt-rebrand_29-10-26/`

## Scan Metadata

- Generated: 2026-10-29
- Repo HEAD when this file was generated: 8b73f4183ebcf23b424a67d99ebc07c2e419ea23 (the later commit 746045b only adds the Phase 0 baseline kit under process/general-plans/active/vibebelt-rebrand_29-10-26/baseline/)
- Mode: merge (existing kit-installed `process/`; setup run by the rebrand program, Phase 0 step E)
- Package manager: none (no package.json)
