---
name: protocol:vb-system-behavior-12-reference
description: "Reference: signals, removed skills, validator registry, and Tier-1 audit requirements."
date: 09-06-26
metadata:
  node_type: memory
  type: protocol
  read_order: 1
  required: false
  read_when: "looking up signals, validator registry, or removed-skill history"
---

# Reference — Signals and Removed Skills

This file is a thin reference. It enumerates the machine-readable signals used in /goal
execution and the removed/merged/renamed skills.

---

## Signal Inventory

Every machine-readable signal used in /goal autonomous execution. The orchestrator routes or advances based on these signals.

In-agent condition triggers and audit-log entries (V1 AUTO-PROCEED, PARSE_ERROR, SUPPLEMENT_ID_UNKNOWN, TIER_ASSIGNMENTS_BLOCKED, FRONTMATTER_MISSING, AMBIGUOUS_MATCH, COVERAGE_GAP, PRELIMINARY_PACKET_MISSING, BACKLOG_NOTE_MISSING, REPORT_NOT_FOUND) are documented inline in their respective sections or agent files — they are excluded from this table.

| Signal | Emitter | Orchestrator Reaction | Spec Reference |
|---|---|---|---|
| `PHASE_COMPLETE: RESEARCH` | vb-research-agent | Tick Step 1 → advance to SPEC (outer loop / standalone, since phase order is `R → S → I → P`). In a phase-program INNER loop the inner loop skips SPEC, so RESEARCH advances directly to INNOVATE. Note: in VB-PREDICT-DEEP-NEEDED scoped research sessions, the agent emits `VB-PREDICT-RESEARCH-COMPLETE` instead — do NOT advance Step 1 on that signal. | Section 2 |
| `PHASE_COMPLETE: SPEC` | vb-spec-agent (SPEC mode) / orchestrator | Tick SPEC step → advance to INNOVATE (or directly to PLAN when INNOVATE is skipped for a mechanical 'how'). SPEC is a product-discovery requirements doc (NOT a chosen approach) that runs after RESEARCH / before INNOVATE; emitted when the spec folder is finalized (all open questions resolved). | 05-spec.md |
| `SPEC_INTENT_BLOCKED` | vb-spec-agent (SPEC mode) | **Interactive-only stop** — unresolved spec intent / open-questions block remains. *Interactive:* do NOT advance to INNOVATE; surface the open-questions block to the user. *Under `/goal`:* do NOT stop — record open questions as backlog notes, finalize SPEC as-is, continue to INNOVATE (a true /goal run pauses for nothing). | 05-spec.md §The SPEC_INTENT_BLOCKED Signal |
| `PHASE_COMPLETE: INNOVATE` | vb-innovate-agent | Tick INNOVATE step → advance to PLAN (PLAN-SUPPLEMENT check). INNOVATE explores HOW (produces the Decision Summary feeding PLAN) and is the skippable phase for non-trivial work. | Section 3 |
| `PHASE_COMPLETE: PLAN` | vb-plan-agent | Tick plan-written → outer PVL → Step 4 | Section 4 |
| `PHASE_COMPLETE: PLAN-SUPPLEMENT` | vb-plan-agent | Tick Step 3 checkbox → advance to Step 4 (inner PVL). If variant is 'no changes; plan current': V1 will find no Inner Loop Refresh Note and may auto-proceed to EXECUTE — expected behavior. | Section 8 Step 3 |
| `PHASE_COMPLETE: VALIDATE` | vb-validate-agent | Tick Step 4 → advance to Step 5 (EXECUTE) | Section 5 V7 |
| `PHASE_COMPLETE: EXECUTE` | vb-execute-agent | Tick Step 5 → advance to Step 6 (EVL) | Section 6 |
| `PHASE_COMPLETE: EVL` | orchestrator (after EVL gates green) | Tick Step 6 → advance to Step 7 (UPDATE PROCESS) | Section 6; orchestration.md §EXECUTE-VALIDATE-LOOP |
| `PHASE_COMPLETE: UPDATE PROCESS` | vb-update-process-agent | Tick Step 7 → advance to Phase N+1 Step 0 (orchestrator matches on prefix only — suffix is informational) | Section 7 |
| `PHASE_COMPLETE: FAST` | vb-fast-mode-agent | Advance phase tracker; read exit status — if DONE/DONE_WITH_CONCERNS: proceed to /goal next phase; if gate: BLOCKED: surface to user | vb-fast-mode-agent.md (two variants: happy-path and BLOCKED gate) |
| `PHASE_COMPLETE: GIT-COMMIT` | vb-git-manager | Record commit SHA in phase report; no phase step advancement — GIT-COMMIT confirms commit only, does not advance inner loop steps | vb-git-manager.md |
| `VB-PREDICT-DEEP-NEEDED` | vb-innovate-agent | Spawn vb-research-agent scoped to named surface; re-spawn vb-innovate-agent with `Prior Research: [findings]` context. INNOVATE step does NOT advance — no PHASE_COMPLETE: INNOVATE until after re-spawn completes. | Section 3 |
| `VB-PREDICT-RESEARCH-COMPLETE` | vb-research-agent (mid-INNOVATE spawn) | Do NOT advance to Step 2 (INNOVATE); extract Prior Research findings; re-spawn vb-innovate-agent with `Prior Research: [findings]` context | vb-research-agent.md §Session Start; orchestration.md §VB-PREDICT-DEEP-NEEDED Signal Routing |
| `VB-FEASIBILITY-PROBE-NEEDED: [hypothesis]` | vb-spec-agent, vb-innovate-agent, or vb-validate-agent (Layer 2) | Spawn `vb-debugger` with feasibility-test playbook + hypothesis + active task folder; do NOT tick emitting phase complete. For VALIDATE Layer 2 emitter: wait for full V2 fan-out to complete before halting; batch multiple probes into one vb-validate-agent re-spawn. | `orchestration.md §VB-FEASIBILITY-PROBE-NEEDED Signal Routing`; `05-spec.md [SP3]`; `06-innovate.md [I2.5]`; `08-validate.md [V2-PROBE]` |
| `VB-FEASIBILITY-VERDICT-READY: [verdict] — [file path]` | vb-debugger | Extract `Prior Feasibility:` block (hypothesis + verdict + constraint) from VERDICT file; re-spawn emitting agent with `Prior Feasibility:` context. | `orchestration.md §VB-FEASIBILITY-PROBE-NEEDED Signal Routing` |
| `PHASE_SKIPPED: BLOCKED` | vb-validate-agent | Tick Step 4 BLOCKED-skipped → advance to Phase N+1; skip Steps 5–7 | Section 8 Step 4 |
| `MID_PROGRAM_PLAN_CREATED` | vb-plan-agent | Trigger inner PVL for new plan only; do NOT output new /goal block | Section 8 §MID_PROGRAM_PLAN_CREATED |
| `SUPPLEMENT_APPLIED` | vb-plan-agent | Re-run PVL from V1 (format: `SUPPLEMENT_APPLIED: [plan path] — [N] gap(s) addressed`; prefix-match sufficient for orchestrator recognition) | Section 5 V7 |
| `PHASE_RENUMBERED` | vb-plan-agent | Update phase references in umbrella plan | Section 8 §Phase Insertion |
| `PHASE_RESTRUCTURE_NOTICE` | orchestrator (from RESEARCH findings) / vb-execute-agent (mid-EXECUTE discovery under /goal) | Consume from phase report as audit trail — no spawn, no step advancement | Section 8 §What Moves Forward Without User Input |
| `CASCADE_BLOCKED` | vb-validate-agent (inner PVL Step 4 cascade check) / vb-execute-agent (consecutive BLOCKED-skipped phases detected during program execution) | Hard stop — do NOT advance to next phase; surface to user for manual resolution | Section 8 §Cascade BLOCKED Protocol |
| `AUTOPILOT_ACTIVATED: [task description] — entry phase: [phase] — goal block emitted` | orchestrator | Record entry phase in session context; begin autonomous run. When `entry phase` is `post-validate`: also emit the (UPDATE) goal block variant (see `08-validate.md §Autopilot Mode — (UPDATE) Variant at V7`). Signal format note: `[phase]` ∈ {`session-start` \| `post-research` \| `post-spec` \| `post-innovate` \| `post-plan` \| `post-validate`}. | `autopilot.md §Signal Inventory`; `08-validate.md §Autopilot Mode — (UPDATE) Variant` |

---

## Skills Referenced But Not Yet Built

| Skill / agent | Referenced as live in | Build tracker | Interim fallback |
|---|---|---|---|
| `vb-review-plan-snapshots` (skill) | `12-reference.md` rename table; `08-validate.md` | F1 residual | Gap analysis done inline by vb-validate-agent / orchestrator |

---

## Removed Skills

These skills were removed from the system. Do not reference them in agent prompts or skill registry tables.

| Skill | Reason removed |
|---|---|
| vb-team | Replaced by Claude Code's native agent team feature |
| vb-tech-graph | PNG diagram generation not needed |
| vb-xia | Cross-repo adaptation not relevant |
| vb-context-engineering | Not needed in current system |
| vb-kit-hardening | Previously decided |
| vb-mcp-management | Generic utility, not wired into any phase |
| vb-repomix | Generic repo packing, not wired into any phase |

Note: `vb-autoresearch` is **ACTIVE** — it is the loop primitive underlying PVL (`domain: plan`) and EVL (`domain: tests`). See `.claude/skills/vb-autoresearch/SKILL.md` (operative contract) and `process/development-protocols/vb-autoresearch-spec.md` (design reference). It is no longer a removed skill.

### Skills Merged Into Other Skills

- **vb-preview** → merged into **vb-review-situation**: plan+contract comparison and diff view modes added as `## Artifact Review Mode`
- **vb-docs** → merged into **vb-audit-context**: bootstrap init pattern and parallel reader strategy added as `## Context Bootstrap`

### vb-review-situation (rename — complete)

| Tool | When | Purpose |
|---|---|---|
| vb-review-situation | Session START (Tier-0, every phase) | Orientation — branch, worktrees, active plans |
| vb-review-plan-snapshots (F1 gap — not yet created) | Between V7 CONDITIONAL and EXECUTE | Gap analysis — validate concerns NOT in plan checklist |
