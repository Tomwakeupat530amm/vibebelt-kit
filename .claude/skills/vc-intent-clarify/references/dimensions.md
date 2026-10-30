# Intent Clarification Dimensions

Loaded on demand from SKILL.md. The section below matches the SKILL.md heading of the same name; the rule on how many dimensions to cover stays in SKILL.md.

## The 8 Standard Dimensions

### Dimension 1 — Scope and Boundaries 🔴 CRITICAL

Clarify what changes and — equally important — what must NOT change.

Example questions:
- Which packages/files are in scope?
- Are there components or APIs that must remain untouched?
- Is this isolated to one package or cross-cutting?

### Dimension 2 — Success Criteria 🔴 CRITICAL

Clarify what the user truly wants to see as a result.

Example questions:
- What does "done" look like to you?
- Is the goal a passing test suite, a deployed change, a passing code review, or visible UI behavior?
- Is there a specific user action or flow that must work?

### Dimension 3 — Failure Modes and Risk Surface 🔴 CRITICAL

Clarify what the user is most worried about going wrong.

Example questions:
- What are the most likely ways this change breaks something?
- Are there auth, billing, schema, or public API surfaces this touches?
- Is there a rollback requirement?

### Dimension 4 — Prior Context 🟡 USEFUL

Clarify what has already been tried or is already in progress.

Example questions:
- Is there an existing plan file for this?
- Has this been attempted before? What happened?
- Is this a continuation of recent work (visible in git status or active plans)?

### Dimension 5 — Priority and Urgency 🟡 USEFUL

Clarify the expected speed/quality tradeoff.

Example questions:
- Is this a hotfix that needs to ship now, or a proper implementation with full plan/test coverage?
- Does this block other work in flight?
- Quick patch acceptable, or must it be production-grade immediately?

### Dimension 6 — Autonomy Boundaries 🟡 USEFUL

> **Autopilot Mode — CRITICAL promotion:** When an autopilot trigger phrase is detected,
> Dimension 6 is treated as 🔴 CRITICAL rather than 🟡 USEFUL. It must appear in the
> first AskUserQuestion call alongside the CRITICAL dimensions, not after them. The question
> must explicitly name the three hard stops and ask the user to confirm they understand those
> remain manual-first gates.

Clarify how much the agent can decide on its own vs. checkpoint with the user.

Example questions:
- Can the agent pick the implementation approach, or does the user want to choose?
- Should the agent pause for approval before destructive changes (schema migrations, API removals)?
- Is a /goal-style autonomous run acceptable, or does each phase need a checkpoint?

Autopilot-specific example (when trigger detected):
- "This run will proceed autonomously. The following gates remain manual regardless:
  (1) irreversible/outward-facing actions not in the validate-contract,
  (2) live-provider billed feasibility probes (cost-class: needs-live-provider),
  (3) cascade BLOCKED (two consecutive phases BLOCKED). All other gates auto-proceed.
  Are there any additional gates you want to keep manual for this run?"

### Dimension 7 — Technical Constraints 🟡 USEFUL

Clarify any specific libraries, patterns, or constraints the solution must conform to.

Example questions:
- Is there a specific library or pattern required?
- Are there style/lint rules that constrain the approach?
- Must the solution work in a specific runtime environment (Bun vs Node, edge vs server)?

### Dimension 8 — Phase Program Questions 🔴 CRITICAL (multi-phase only)

Only include when the request implies multiple dependent phases or a long-running program.

Example questions:
- Should phases run sequentially or can some parallelize?
- Which phase is the hard dependency for the rest?
- What is the acceptable stopping point if a later phase is blocked?
