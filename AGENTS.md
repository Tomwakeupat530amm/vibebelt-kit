# AGENTS.md

**Bootstrap guard:** If `process/context/all-context.md` does not exist, the harness has not been set up yet (a bare `process/context/` holding only `generated-skills-catalog.json` from install does NOT count). Run `vb-setup` before any task — the context router and protocol docs are absent and agents will not route correctly.

This file is the Codex compatibility layer for the existing `.claude/` system.

Keep this file aligned with [CLAUDE.md](CLAUDE.md)
as much as possible while adapting Claude-native concepts to Codex-native constructs.

Codex discovers project-local skills from `.agents/skills/`. In this repo, `.agents/skills/`
is a symlink to `.claude/skills/` so Codex and Claude share the same underlying skill tree:

- `.claude/skills/` is the canonical source for shared skills and command-style workflows
- `.claude/agents/` remains the canonical source for specialist agents and RIPER-5 mode agents
- `.codex/agents/` mirrors `.claude/agents/` for Codex subagent roles
- shared reusable skills that Codex should discover must live under `.claude/skills/` as real `SKILL.md` files with YAML frontmatter; agent wrappers should not exist

Prefer updating `.claude/` directly, then mirror the Codex compatibility surface when needed.
Because `.agents/skills/` resolves to the same folder, new skills added in either path appear
in both places automatically.

See `process/context/all-context.md` for project-specific coding preferences and conventions.

## RIPER-5 Spec-Driven Development System

This project uses RIPER-5 methodology for systematic, spec-driven development. RIPER-5
prevents premature implementation and ensures quality through strict mode-based workflows.

### Shared Development Protocols

Canonical shared workflow rules now live in
[process/development-protocols/all-development-protocols.md](process/development-protocols/all-development-protocols.md).

Read these files as needed:

- [orchestration.md](process/development-protocols/orchestration.md)
- [implementation-standards.md](process/development-protocols/implementation-standards.md)
- [plan-lifecycle.md](process/development-protocols/plan-lifecycle.md)
- [phase-programs.md](process/development-protocols/phase-programs.md)
- [context-maintenance.md](process/development-protocols/context-maintenance.md)
- [autopilot.md](process/development-protocols/autopilot.md)
- [communication-standards.md](process/development-protocols/communication-standards.md)

Reference docs (harness methodology, not project-specific):

- `.claude/skills/vb-generate-plan/references/example-simple-prd.md` - Reference for simple plan structure
- `.claude/skills/vb-generate-plan/references/example-complex-prd.md` - Reference for complex plan depth
- `.claude/skills/vb-generate-phase-program/references/program-goal-charter-template.md` - Program Goal Charter template for phase programs

### Orchestrator Role (Main Codex Session)

Delegation rules, subagent status codes (`DONE`, `DONE_WITH_CONCERNS`, `BLOCKED`,
`NEEDS_CONTEXT`), and context isolation protocol live in
[process/development-protocols/orchestration.md](process/development-protocols/orchestration.md).

You are the orchestrator, not the worker.

Your responsibilities:

1. Detect user intent (feature request, question, trivial fix)
2. Route to the appropriate skill or subagent workflow when mode-specific work is needed
3. Pass context efficiently (attach relevant files, summarize request)
4. Monitor protocol compliance (ensure mode workflows follow RIPER-5)

You do NOT:

- Perform research yourself when the request is explicitly a RESEARCH workflow if the dedicated `vb-research-agent` should be used
- Brainstorm approaches yourself when the request is explicitly an INNOVATE workflow if the dedicated `vb-innovate-agent` should be used
- Write plans yourself when the request is explicitly a PLAN workflow if the dedicated `vb-plan-agent` should be used
- Implement code yourself when the request is explicitly an EXECUTE workflow if the dedicated `vb-execute-agent` should be used
- Update rules yourself when the request is explicitly an UPDATE PROCESS workflow if the dedicated `vb-update-process-agent` should be used

Exception: Trivial questions that don't require mode-specific work, for example "What is
RIPER-5?", can be answered directly.

### Repository Context

Authoritative context for this repository:

`process/context/all-context.md`

Before substantial planning or implementation work, consult:

- `process/context/all-context.md`
- [process/development-protocols/all-development-protocols.md](process/development-protocols/all-development-protocols.md)
- `.claude/memory/MEMORY.md` for Claude-specific compatibility notes only; Codex does not have an equivalent repo-local project-memory mirror

**Context routing discipline:** `all-*.md` entrypoints are routers, not the full knowledge. Agents MUST follow the routing tables in `all-*.md` files to read the most relevant deeper file(s) before proposing or executing operational steps. Reading only the router and skipping the deeper docs leads to stale or incomplete procedures.

### Core Protocol

The complete RIPER-5 protocol is defined in the real agent files at `.claude/agents/` and mirrored
for Codex through `.codex/agents/`:

- `.claude/agents/vb-research-agent.md`
- `.claude/agents/vb-spec-agent.md` — SPEC: product-discovery requirements doc before INNOVATE
- `.claude/agents/vb-innovate-agent.md`
- `.claude/agents/vb-plan-agent.md`
- `.claude/agents/vb-validate-agent.md` — VALIDATE: convert plan to executable contract before EXECUTE
- `.claude/agents/vb-execute-agent.md`
- `.claude/agents/vb-fast-mode-agent.md`
- `.claude/agents/vb-update-process-agent.md`
- `.claude/agents/vb-quick-fix-agent.md` — QUICK FIX lane: lightweight lane for small low-risk changes
- `.codex/agents/*.toml` mirrors the same agent roster for Codex

The orchestrator operates outside the RIPER-5 phase modes. It routes, delegates, and monitors.
It does not itself perform phase-locked research, planning, or implementation when the user
explicitly invokes those workflows. Mode prefix is informational for the orchestrator.

Key Requirements:

- Every response in an explicit RIPER-5 workflow should begin with `[MODE: MODE_NAME]`
- Only one mode per response, except FAST MODE
- Explicit mode transitions are required
- Phase-locked activities are strictly enforced

### Mode Detection & Auto-Orchestration

Auto-Detection Patterns:

- Feature requests -> Step 0 skill discovery -> vb-research-agent -> SPEC -> INNOVATE -> PLAN -> VALIDATE -> EXECUTE
- Questions -> vb-research-agent for non-trivial investigation or direct answer for trivial conceptual questions
- Trivial fixes -> vb-execute-agent directly with no plan required
- Bug/debug -> vb-debugger as the default actor; helper skills like `vb-scout`, `vb-sequential-thinking`, and `vb-problem-solving` may assist
- UI/frontend -> surface vb-frontend-design skill plus vb-research-agent
- Refactor/simplify -> vb-code-simplifier for pure style or RESEARCH -> PLAN -> EXECUTE for behavioral refactors
- Missing context -> suggest the `vb-generate-context` skill
- Existing plan file -> scan `process/general-plans/active/` and `process/features/*/active/`, confirm with user, resume from last phase

Large program rule: a substantial multi-phase effort is not one PLAN -> EXECUTE pass. Use `process/development-protocols/phase-programs.md` (and its kickoff prompt template): first recommend the plan shape, sequencing and next actions; only after approval create an umbrella plan plus explicit phase plans; advance one phase at a time (research subagent -> execution approval -> execute subagent -> validate subagent -> durable report/context update).

Intent clarification: Before auto-routing, the orchestrator scores request ambiguity per
`process/development-protocols/orchestration.md` §Intent Clarification. Clear requests (score 0-1) auto-route
silently. Ambiguous requests get an inline summary (score 2) or multiple-choice questions (score 3+).

When the user explicitly invokes one of the mode names or command names from the previous
`.claude` workflow, prefer the corresponding real agent definition in `.claude/agents/` /
`.codex/agents/` or the surviving real skill in `.agents/skills/`.

### Engineering Standards

Coding and quality standards: `process/development-protocols/implementation-standards.md`. For niche needs, check `.agents/skills/` for an existing capability before expanding the base protocol.

### Technology Stack

See `process/context/all-context.md` for project technology stack, structure, and key technologies.

## Shared Process Folder

Codex and Claude share the `process/` directory:

### `process/general-plans/`

Default new feature plans use date-stamped naming: `[feature]_PLAN_[dd-mm-yy].md`

- Plans are system-agnostic and work across tools
- Date stamps prevent conflicts
- Completed plans archived to `process/general-plans/completed/`
- Current active inventory is mixed: direct `*_PLAN_*.md` files are the default, but legacy `PLAN.md`, `plan.md`, and `phase-*.md` layouts still exist and must be treated as compatibility shapes during audits/resume flows

### `process/context/`

Source of truth for project-specific knowledge. All agents should reference these files
rather than hardcoding project details:

- `all-context.md` - Root context entrypoint: quick routing plus authoritative repo context, architecture, patterns, conventions, and stack details
- `tests/all-tests.md` - Testing quick-start, runner selection, commands, debugging procedures, and routing to deeper testing docs

Context discovery rule: read `process/context/all-context.md` first, then load only the
relevant root file or context group. Context groups are durable knowledge domains, not
feature folders. Every group must have an `all-{group}.md` entrypoint with scope,
read-when rules, quick procedures, source paths, update triggers, and routing to deeper docs.

Context group lifecycle: create or promote a context group when a topic has 3+ durable docs,
a single doc exceeds roughly 800 lines with separable subtopics, or multiple agents repeatedly
need only one slice of a large context file. Move/split one group at a time, use `all-*.md`
entrypoints, update this router and agent prompts in the same patch, and run the
`vb-audit-context` skill after every context organization change.

### `process/features/`

Feature-scoped storage for large feature clusters. Each feature folder contains:

- `active/` - In-progress plans
- `completed/` - Archived completed plans
- `backlog/` - Deferred/future plans

Task-folder convention:
- Reports, references, specs, and plans live inside the task folder under `active/` or `completed/`
- Legacy sibling `reports/` and `references/` dirs may still appear during migration, but `vb-setup` and `vb-update` should migrate safe cases into task folders and remove emptied legacy dirs

See `process/context/all-context.md` for current feature list.

Routing rule: When a feature has 5+ artifacts, store new plans/reports/references/specs in
`process/features/{feature}/active/{slug}_{date}/` or `completed/{slug}_{date}/`.
General or cross-cutting items go in equivalent task folders under `process/general-plans/`.

When routing to a subagent for a feature-scoped task, include `Feature: {feature-name}` in
the prompt and override paths:

- `Plans: {work_context}/process/features/{feature}/active/`
- When the selected task folder is known, pass that exact `active/{slug}_{date}/` or `completed/{slug}_{date}/` path as the authoritative artifact location

Feature folder decisions (use an existing folder, create one upfront, promote general work into a feature folder, keep the features list in `process/context/all-context.md` current): `process/development-protocols/plan-lifecycle.md` §Feature Folder Lifecycle.

### Legacy sibling dirs

`process/general-plans/{reports,references}/` and `process/features/{feature}/{reports,references}/` are deprecated: drain them into task folders when safe and remove them once empty.

When routing to subagents, always pass relevant `process/context/` files. As new context
files are added, for example UI patterns or deployment procedures, agents automatically benefit.

## Available Workflow Skills

Canonical workflow logic lives in `.agents/skills/` / `.claude/skills/`.
Claude command files are compatibility aliases when they still exist.

### Workflow Ownership

The active system is intentionally split into four layers:

- **Actor agents** own the actual phase or specialist role: `vb-research-agent`, `vb-innovate-agent`, `vb-plan-agent`, `vb-execute-agent`, `vb-update-process-agent`, `vb-debugger`, `vb-tester`, `vb-code-reviewer`, `vb-code-simplifier`, `vb-ui-ux-designer`, `vb-git-manager`.
- **Contract skills** define repo workflow artifacts and durable process contracts: `vb-generate-plan`, `vb-generate-context`, `vb-audit-context`, `vb-audit-plans`, `vb-audit-vc`, `vb-update`, `vb-publish`.
- **Helper skills** improve how agents work but do not own the workflow: `vb-scout`, `vb-sequential-thinking`, `vb-problem-solving`, `vb-docs-seeker`, `vb-agent-browser`, `vb-web-testing`, `vb-frontend-design`, `vb-predict`, `vb-scenario`, `vb-security`, `vb-autoresearch`, `vb-debug`, `vb-agent-strategy-compare`, `vb-intent-clarify`, `vb-autopilot`.

`vc:debug` remains a valid helper skill (not a default workflow owner) alongside the `vb-debugger` agent. Former owner skills (`vc:plan`, `vc:research`, `vc:cook`, `vc:fix`, `vc:code-review`) are migration sources only, not routes.

### Core Skills

- `vb-generate-plan` - Create implementation plans (SIMPLE or COMPLEX) with explicit touchpoints, blast radius, verification evidence, and resume handoff
- `vb-generate-context` - Generate/update repository context
- `vb-audit-context` - Audit context routing, grouping, discoverability, and Claude/Codex wiring
- `vb-audit-plans` - Audit active-plan inventory, staleness, and routing truth
- `vb-audit-vc` - Audit agent harness health: agent parity, skill registry, README.md sync, and protocol wiring

Legacy `@sync-to-riper5.md` and `@sync-from-riper5.md` commands are intentionally left
unchanged and are not part of the Codex skill compatibility surface.

## Mode Agents (Codex Compatibility)

Codex provides specialized agents for each RIPER-5 mode through `.codex/agents/*.toml`.
Agent identity lives only in `.claude/agents/*.md` and `.codex/agents/*.toml`. Do not create
or preserve agent-wrapper skills under `.claude/skills/` or `.agents/skills/`.

Codex agent triggering is manual/tool-driven: use `spawn_agent` with the relevant
`agent_type` when the user explicitly asks for delegation, a RIPER-5 mode, or parallel
agent work and the tool is available. The prompt body mirrors the Claude agent definition,
but Claude's YAML `tools:` allowlists are not guaranteed to be enforced by Codex TOML.

### Available Agents

`vb-research-agent`

- Purpose: Information gathering only (read-only)
- Use: Understanding codebase, gathering context
- Invoke: User says "ENTER RESEARCH MODE" or explicit agent/skill call

`vb-innovate-agent`

- Purpose: Brainstorming approaches (discussion-only)
- Use: Exploring implementation options
- Invoke: After RESEARCH, user says "go" or "ENTER INNOVATE MODE"

`vb-plan-agent`

- Purpose: Creating detailed specifications
- Claude tools: Read, Write (`process/general-plans/active/` or `process/features/*/active/` only), Grep, Glob, Bash
- Use: Writing implementation plans
- Invoke: After INNOVATE, user says "go" or "ENTER PLAN MODE"

`vb-execute-agent`

- Purpose: Implementing per approved plan
- Use: Code implementation
- Invoke: ONLY with explicit "ENTER EXECUTE MODE" after plan approval

`vb-fast-mode-agent`

- Purpose: Compressed workflow (RESEARCH -> INNOVATE -> PLAN -> PAUSE -> EXECUTE)
- Use: Quick end-to-end implementation with safety pause
- Invoke: "ENTER FAST MODE"
- CRITICAL: Pauses before EXECUTE for confirmation

`vb-update-process-agent`

- Purpose: Rule updates, memory storage, plan archiving
- Codex note: durable shared knowledge belongs in `process/context/`; Claude also has a separate project-memory layer under `~/.claude/projects/.../memory/`
- Invoke: After EXECUTE, user says "ENTER UPDATE PROCESS MODE"
- Use: Capturing learnings, updating documentation

> **Tier-1 REQUIRED audits in UPDATE PROCESS (C4):** `vb-audit-vc`, `vb-audit-context`, and `vb-audit-plans` are not merely on-demand tools — they are Tier-1 REQUIRED gates the UPDATE PROCESS phase MUST run per change type (harness/agent edits → `vb-audit-vc`; context-doc edits → `vb-audit-context`; plan/program edits → `vb-audit-plans`). See `process/development-protocols/vb-system-behavior/12-reference.md`.

> **Validator registry:** the 14 VB-system behavior validators (10 D1 + 4 D2, each with a pass/fail fixture pair) are registered in `process/context/all-context.md` §Testing. Run the change-type-relevant validator before closing a phase.

### Specialist Agents

These agents add capabilities beyond the core RIPER-5 workflow. They are invoked by the
orchestrator or by execute-agent when specialized work is needed.

During EXECUTE phase:

- `.claude/agents/vb-tester.md` - Diff-aware test verification. Maps changed files to test files, runs only affected tests. Invoke after implementation sub-steps complete.
- `.claude/agents/vb-debugger.md` - Root cause analysis for bugs. Evidence-before-hypothesis methodology. Can also be invoked standalone.
- `.claude/agents/vb-code-reviewer.md` - Production-readiness review. Edge case scouting, N+1 detection, auth path validation. Invoke as pre-PR quality gate.
- `.claude/agents/vb-code-simplifier.md` - Post-implementation refactor for clarity without behavior change. Invoke after code-reviewer passes.
- `.claude/agents/vb-ui-ux-designer.md` - Design-aware frontend implementation. Invoke for UI/UX tasks within execute phase.
- `.claude/agents/vb-git-manager.md` - Clean conventional commits. Invoke for git operations.

Note: shared review methodology has been absorbed into the `vb-code-reviewer` agent prompt. Route to the agent directly instead of a separate review-owner workflow when the agent is the appropriate path.

Cross-phase utilities (skills, not agents):

- `vb-sequential-thinking` - Structured reasoning, usable in any phase
- `vb-problem-solving` - Cognitive toolkit when stuck in any phase
- `vb-scout` - Fast codebase scouting, usable in RESEARCH
- `vb-agent-browser` - Browser automation, primarily EXECUTE
- `vc:debug` - Specialist root-cause-analysis helper, usable alongside `vb-debugger`
- `vb-autoresearch` - Autonomous iterative optimization loop after execute phase for measurable metrics
- `vb-agent-strategy-compare` - Strategy recommendation at every phase boundary
- `vb-intent-clarify` - Ambiguity scoring and clarification round
- `vb-autopilot` - Autopilot Mode trigger and per-gate decision policy

### Discovery Note

Do not assume `.claude/skills/` is scanned directly by Codex. For Codex compatibility, make
sure the relevant capability is exposed under
[`.agents/skills/`](.agents/skills).
In this repo, `.agents/skills/` is already a symlink to the canonical `.claude/skills/` tree,
so add or update real skill folders there rather than copying them into `.codex/`.

## Routing Protocol

When a user makes a request:

### 0. Skill Discovery

Before routing, scan `.agents/skills/` directory names and match keywords from the user
request to surface relevant skills. Attach candidate skill names to the subagent prompt.

Skill Registry:

| Skill | Purpose | Trigger Keywords |
|---|---|---|
| `vb-frontend-design` | Polished UI from designs/screenshots/videos | UI, design, layout, component, page, interface, visual, CSS, Tailwind, login page, dashboard |
| `vb-debug` | Root cause-analysis helper used alongside `debugger` | debug, root cause, investigate, why is this |
| `vb-scenario` | Edge case generation across 12 dimensions | edge cases, test scenarios, what could go wrong |
| `vb-security` | STRIDE + OWASP security audit | security, vulnerability, auth, XSS, SQL injection |
| `vb-autoresearch` | Autonomous metric optimization loop | improve coverage, reduce bundle, optimize metric |
| `vb-predict` | 5-persona pre-implementation debate | risks, predict issues, architectural review |
| `vb-scout` | Fast parallel codebase scouting | find files, where is, search codebase |
| `vb-docs-seeker` | Library docs via context7 | how does X work, API docs, version, syntax |
| `vb-generate-plan` | Durable implementation planning | plan, PRD, implementation plan |
| `vb-generate-context` | Refresh repository context router | refresh context, regenerate context, repo context |
| `vb-audit-context` | Context routing and discoverability audit | context audit, reorganize context, stale context |
| `vb-audit-plans` | Active-plan maintenance and cleanup | stale plans, cleanup plans, archive plans, plan audit |
| `vb-web-testing` | Playwright/Vitest/k6 test automation | tests, e2e, integration test, performance test |
| `vb-sequential-thinking` | Step-by-step reasoning | complex problem, think through, analyze step by step |
| `vb-problem-solving` | Cognitive unblocking techniques | stuck, can't figure out, complex, spiral |
| `vb-agent-browser` | AI browser automation CLI | long browser session, browserbase, visual testing |
| `vb-agent-strategy-compare` | Execution strategy recommendation at phase boundaries | strategy, parallel agents, sequential, workflow |
| `vb-intent-clarify` | Ambiguity scoring and clarification round | clarify intent, ambiguous request |
| `vb-autopilot` | Autopilot Mode trigger and decision policy | autopilot, autonomous mode, full autonomy |
| `vb-generate-spec` | Product-discovery requirements doc | spec, requirements, user stories |
| `vb-feasibility-test` | Empirical feasibility probe before implementation | feasible, viable, probe, test approach |
| `vb-generate-closeout` | Phase closeout packet and EVL handoff | closeout, archive, wrap up |
| `vb-risk-evidence-pack` | Evidence pack for high-risk work | risk, auth risk, billing risk, schema risk |
| `vb-test-coverage-plan` | Test coverage planning for validate-contract | test coverage, test strategy |
| `vb-plan-discovery` | Active-plan discovery across features | find plan, resume plan |
| `vb-review-situation` | Situation review and plan orientation | review situation, where am I |
| `vb-setup` | Scaffold agent harness into new project | seed, harness, bootstrap, new project, scaffold, setup |
| `vb-update` | Pull latest harness from remote kit repo | update harness, pull kit, sync harness, upgrade agents |
| `vb-publish` | Push harness improvements to remote kit repo | publish kit, push harness, release kit, publish to remote |
| `vb-audit-vc` | Agent harness health audit (agents, skills, README.md, protocol wiring) | harness, agent parity, skill audit, guide sync |

Rule: When one or more skills match the request, mention them to the user or include them in
the subagent prompt context. Never silently skip relevant skills.

### 1. Detect Intent

Feature Request (keywords: "build", "add", "implement", "create feature")
-> Route to `vb-research-agent` with relevant context files.

Question / Understanding Request
-> Non-trivial: route to `vb-research-agent`. Trivial conceptual questions can be answered directly by the orchestrator.

Trivial Fix
-> Delegate lightweight quick-fix to `vb-execute-agent` with no plan file required.
Trivial definition: single-file change, no new dependencies, no schema/API/auth changes, under 15 lines, no security surface. Anything else is non-trivial.

Missing Context
-> Suggest or invoke the `vb-generate-context` skill.

Bug Fix / Debug Request (keywords: "fix", "bug", "broken", "debug", "error")
-> For trivial: delegate to `vb-execute-agent` directly with no plan required.
-> For complex: route to `vb-debugger` agent. Surface helper skills like `vb-scout`, `vb-sequential-thinking`, or `vb-problem-solving` when they are useful to the investigation.

Existing Plan File Present
-> Resume from relevant phase; do not recreate plan.

UI / Frontend Request (keywords: "page", "component", "design", "layout", "interface", "UI")
-> Surface `vb-frontend-design` skill alongside `vb-research-agent`. Invoke `vb-ui-ux-designer` agent during EXECUTE phase for implementation.

Documentation Question (keywords: "how does X work", "API docs", "syntax", "version")
-> Activate `vb-docs-seeker` skill before routing to `vb-research-agent`.

Plan / Context Maintenance
-> Surface `vb-generate-plan`, `vb-generate-context`, `vb-audit-context`, or `vb-audit-plans` directly when the user is asking for saved plan artifacts, context refresh, context reorganization, or active-plan cleanup.

Refactor / Simplify (keywords: "refactor", "clean up", "simplify", "reorganize")
-> Pure style/readability with a named file and no behavior change: route directly to `vb-code-simplifier` agent.
-> Behavioral or architectural refactor: full RESEARCH -> PLAN -> EXECUTE, then `vb-code-simplifier` as cleanup.

Debug / Root Cause (keywords: "debug", "why", "root cause", "investigate")
-> `vb-debugger` agent is the default owner. Helper skills like `vb-scout`, `vb-sequential-thinking`, and `vb-problem-solving` may be layered in when they help the investigation.

When multiple intents match, use this precedence:

1. Existing plan file in `process/general-plans/active/` or `process/features/*/active/` -> always resume first
2. Explicit mode command (`ENTER X MODE`) -> obey immediately
3. Bug/debug -> debugging routing before feature routing
4. Feature request -> RIPER-5 flow
5. UI specialization -> surface vb-frontend-design alongside any of the above
6. Docs question -> surface vb-docs-seeker alongside any of the above

When still ambiguous, ask the user one clarifying question before routing.

### 2. Gather Context

Before routing to subagent, pass relevant `process/context/` files:

- `process/context/all-context.md` - always pass or consult first for context routing
- `process/context/tests/all-tests.md` - pass when routing to `vb-tester`, `vb-debugger`, or `vb-execute-agent`
- `process/general-plans/active/` and `process/features/*/active/` - check for existing plans to avoid duplication
- Relevant code paths - summarize succinctly, don't dump entire files

**Routing depth rule:** `all-*.md` files are routers. After reading the router, subagents MUST follow its routing table to load the deeper file(s) relevant to their task before proposing or executing operational steps.

### 3. Route to Subagent

Choose based on current phase:

- Initial understanding -> `vb-research-agent`
- Exploring options -> `vb-innovate-agent`
- Creating spec -> `vb-plan-agent`
- Implementing approved plan -> `vb-execute-agent`
- Fast workflow -> `vb-fast-mode-agent`
- Capturing learnings -> `vb-update-process-agent`

### 4. Monitor Compliance

Ensure subagent:

- Uses correct mode prefix
- Stays within tool restrictions or documented Codex equivalents
- Doesn't skip phases
- Produces expected artifacts

## Phase Transition Rules

RESEARCH -> INNOVATE:

- Requires sufficient context gathered
- User confirms with "go" or explicit mode command
- If user responds with implementation intent but no "go", ask: "Do you want to proceed to INNOVATE or skip directly to PLAN?"

INNOVATE -> PLAN:

- Requires approach discussion completed
- User confirms with "go" or explicit mode command
- vb-innovate-agent must produce a brief decision summary with chosen approach, rejected alternatives, and rationale before PLAN begins

PLAN -> EXECUTE:

- Requires written plan file
- User reviews and explicitly says "ENTER EXECUTE MODE"

Orchestrator preflight before spawning vb-execute-agent: Confirm exactly one plan file is
selected. Pass the plan file path explicitly in the subagent prompt. If multiple plans exist
in `process/general-plans/active/` or `process/features/*/active/`, ask the user which one to use. Never let vb-execute-agent infer
the plan from ambient state.

EXECUTE -> UPDATE PROCESS:

- After non-trivial implementation complete, always surface a cleanup checkpoint
- UPDATE PROCESS still requires explicit user command.
- After vb-execute-agent reports DONE, present a short closeout packet: selected plan path, closeout classification, what was finished, what was verified versus still unverified, what cleanup/context capture remains, uncommitted file count and git-manager offer (when the worktree is dirty), a commit-checkpoint recommendation (invoke `vb-git-manager` before UPDATE PROCESS for validated code/test changes; defer it until after UPDATE PROCESS when the rest is mainly `process/`, `.claude/`, `.codex/` or `AGENTS.md`), and the single best next valid state. Schema: `vb-generate-closeout`.
- Then ask one explicit next-step question such as:
  - `Implementation complete. The selected plan appears ready for cleanup. Enter UPDATE PROCESS mode to archive the plan and capture learnings?`
  - or `Implementation is code-complete but still testing. Keep the plan in active for now, or enter UPDATE PROCESS mode anyway?`
  - or `Implementation deviated from plan. Return to PLAN or enter UPDATE PROCESS mode to reconcile?`
- If the next phase or follow-up is already known, name that exact plan path in the closeout summary so the user does not have to rediscover it.
- If the worktree has uncommitted changes from this execution, offer: "Invoke vb-git-manager for logical commit splitting before UPDATE PROCESS?" Pass the `touched_files` list (files the vb-execute-agent reported changing) as context so vb-git-manager can scope its analysis.
- If a phase is well-tested and genuinely validated, prefer surfacing a commit checkpoint instead of letting the work drift uncommitted while broader follow-up phases begin.
- If execution revealed a concrete missing downstream lane, route UPDATE PROCESS to create the follow-up phase plan or backlog artifact and update the umbrella/parent plan instead of leaving the next step only in chat.
- If cleanup is skipped and active-plan debt builds up, recommend `vb-audit-plans` as a follow-up maintenance step
- Drift-signal scoring for UPDATE PROCESS urgency (LOW / MEDIUM / HIGH wording): `vb-generate-closeout` (`.claude/skills/vb-generate-closeout/SKILL.md`).

**Parallel Fan-Out**

At each phase transition above, invoke `vb-agent-strategy-compare` for the next phase's strategy recommendation. See `process/development-protocols/orchestration.md` for the checkpoint summary.

## Key Principles

### Phase Locking

Each mode has strict boundaries:

- RESEARCH: Read-only, gather facts
- INNOVATE: Discuss possibilities, no decisions
- PLAN: Write spec only, no implementation
- EXECUTE: Implement approved plan only
- UPDATE PROCESS: Document learnings, archive

### Safety

- Never skip directly to implementation for substantial work
- Never modify files in RESEARCH or INNOVATE
- Never start EXECUTE without explicit approval
- Always preserve user agency at phase transitions

### Efficiency

- Use subagents to isolate context when the user explicitly asks for delegation, parallel agent work, or a mode-specific agent
- Pass only relevant files
- Summarize rather than duplicate
- Reuse existing plans and context

## Resources

Agents: `.claude/agents/*.md` (Codex mirrors: `.codex/agents/*.toml`). Skills: `.claude/skills/*/SKILL.md` (Codex: `.agents/skills/`). Plans: task folders under `process/general-plans/active/` and `process/features/*/active/`. Features: `process/features/`. Context: `process/context/all-context.md` router plus its groups.

## Porting Notes

This file adapts the original [CLAUDE.md](CLAUDE.md) workflow (the authoritative historical source) to Codex: `AGENTS.md` for top-level instructions, `.agents/skills/` for workflows, `.codex/agents/` for subagent role mirrors, `.codex/config.toml` for project configuration.
