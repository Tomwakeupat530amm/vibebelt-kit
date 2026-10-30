---
name: context:all-planning
description: "Plan shape calibration, task-folder convention, and where plans live for vibebelt-kit; points at the active rebrand program"
keywords: plan, planning, prd, spec, task folder, phase program, umbrella, active plan, backlog, completed, generate-plan, rebrand
related: [context:all-tests]
date: 29-10-26
---

# Planning Context

This file is the canonical planning context entrypoint for vibebelt-kit (repo directory still named `vibecode-pro-max-kit-main`; the `vc-` to `vb-` rename was done in Phase 6, see `process/context/all-context.md`).

Use it after `process/context/all-context.md` when the task needs plan-shape calibration, planning conventions, or implementation-plan examples.

## Scope

This group covers:

- example plan shapes (SIMPLE vs COMPLEX) and where they live
- the task-folder convention for plans in this repo
- how the one big in-flight program (the rebrand) is organised

It does not cover:

- the content of any individual plan (read the plan itself)
- feature reports or backlog items (those live under `process/general-plans/` or `process/features/`)
- the lifecycle rules themselves: `process/development-protocols/plan-lifecycle.md` and `process/development-protocols/phase-programs.md` are the source of truth

## Read When

Read this entrypoint when:

- creating a new plan with the `vb-generate-plan` skill
- checking whether work should be SIMPLE or COMPLEX
- resuming or auditing the active rebrand program
- deciding whether a new plan goes under `process/general-plans/` or a feature folder

## Quick Routing

| If you need... | Read |
|---|---|
| calibration for a one-session plan | `.claude/skills/vb-generate-plan/references/example-simple-prd.md` |
| calibration for a multi-phase plan | `.claude/skills/vb-generate-plan/references/example-complex-prd.md` |
| plan-writing procedure | `.claude/skills/vb-generate-plan/references/generate-plan.md` |
| naming, folders, archive rules | `process/development-protocols/plan-lifecycle.md` |
| multi-phase program rules (umbrella plan, 7-step inner loop) | `process/development-protocols/phase-programs.md` |
| the current program | `process/general-plans/active/vibebelt-rebrand_29-10-26/` |

## Where Plans Live (this repo)

- General plans: `process/general-plans/{active,backlog,completed}/{slug}_{dd-mm-yy}/`, each with a `_GUIDE.md` that explains the folder. Plan files are named `{slug}_PLAN_{dd-mm-yy}.md` inside the task folder.
- Feature-scoped plans: `process/features/{feature}/{active,completed,backlog}/`. No feature folders exist yet: this repo is a harness, not an app with product areas, so everything is a general plan. `process/features/_feature-template/` holds the template guides only.
- Legacy `process/general-plans/reports/` and `references/` sibling dirs were removed at setup (they only held `.gitkeep`). Reports and references go inside the task folder.

## Current Program

`process/general-plans/active/vibebelt-rebrand_29-10-26/` is the only active program: renaming the kit to vibebelt-kit (prefix `vc-` to `vb-`, done in Phase 6), fixing inconsistencies, slimming agents, de-duplicating docs, and writing vibecoder-facing docs. It has an umbrella plan (`vibebelt-rebrand-umbrella_PLAN_29-10-26.md`), nine phase plans (`phase-00-foundation` ... `phase-08-install-release`), `phase-blast-radius-registry.md`, `results.tsv`, and a `baseline/` folder holding the pre-change validator results. Do not duplicate its content here; read the umbrella plan's `## Current Execution State` for status.

## Source Paths

- `.claude/skills/vb-generate-plan/references/example-simple-prd.md`
- `.claude/skills/vb-generate-plan/references/example-complex-prd.md`
- `.claude/skills/vb-generate-plan/references/generate-plan.md`
- `process/development-protocols/plan-lifecycle.md`
- `process/development-protocols/phase-programs.md`
- `process/general-plans/active/vibebelt-rebrand_29-10-26/`

## Update Triggers

Update this group when:

- the plan artifact contract changes (`vb-generate-plan` expects different sections or statuses)
- the example plan shapes move, split, or become stale
- the rebrand program finishes (move the program folder to `completed/` and update "Current Program")
- a feature folder is created (add a row to the routing table)
