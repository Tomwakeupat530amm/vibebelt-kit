---
name: vb-intent-clarify
description: "Clarify intent before RIPER-5 phase delegation. Scores ambiguity (4 signals); generates structured multi-choice questions for Tier 2. Two-mode: SIMPLE and DEEP."
argument-hint: "[user request text]"
trigger_keywords: intent clarification, ambiguity score, routing tier, clarify request
layer: contract
metadata:
  author: vibebelt-kit
  version: "2.1.0"
---

# vb-intent-clarify

> Output style: lead each question with the recommended option; plain language, no filler — `process/development-protocols/communication-standards.md`.

Two-mode intent clarification: SIMPLE (direct, 3-5 reads) and DEEP (research subagent first, then questions).

Scores a user request's ambiguity and — when Tier 2 triggers — produces a structured, multi-dimension clarification suite with option-rich questions rather than open-ended prompts. Uses vb-scenario, vb-predict, and vb-sequential-thinking style reasoning to generate questions, not just to answer them.

This is the highest-leverage skill in the system. Poor intent clarification wastes entire phase programs. Invest in the question generation step.

---

## When To Invoke

At ORCHESTRATOR before every routing decision for new user requests. Check auto-skip conditions first. If none apply, score the four signals and act on the resulting tier.

---

## Auto-Skip Conditions

These conditions force Tier 0 regardless of the ambiguity score. Check these FIRST.

1. Continuation phrases — "go", "continue", "proceed", "just do it", or similar standalone instruction
2. Mid-phase-program execution — active phase plan is selected and approved, user is advancing
3. Trivial fix — single-file, under 15 lines, no schema/API/auth changes
4. Explicit mode command — "ENTER EXECUTE MODE", "ENTER RESEARCH MODE", etc.
5. Resuming active plan — an existing active plan is identified and confirmed
6. Pure information question — "What is X?", "How does Y work?" mapping to a single obvious routing target

When an auto-skip condition matches, produce only a 1-sentence restatement of intent and route immediately per the existing routing protocol. Do not announce the tier. Do not surface any questions.

**Priority ordering when multiple conditions match simultaneously:**
1. Explicit mode command (highest priority)
2. /goal mid-program execution
3. Continuation phrase
4. Trivial fix / active-plan resume (lowest priority)
5. Pure information question / resuming active plan (lowest priority — treated as Tier 0, auto-route to vb-research-agent or answer directly)

Apply only the highest-priority matching condition's abbreviated behavior. Do not combine behaviors from multiple matching conditions.

**Under /goal autonomous execution:** Even when an auto-skip condition matches and Tier 0 applies, the 1-sentence restatement MUST be emitted to the chat log as an audit entry. Never skip the restatement emit under /goal — it proves Tier-0 ran and serves as the audit log for that phase's intent confirmation.

---

## 4-Signal Scoring Formula

Each signal is worth +1. Sum to get the ambiguity score.

| Signal | Description |
|--------|-------------|
| Ambiguous scope | Request touches multiple features or packages without naming one |
| No explicit path | No file, package, or feature name mentioned |
| Multiple intents | Request could be a bug fix, feature, refactor, or question |
| First interaction | No established workflow context in current session |

Score thresholds:

| Score | Tier | Action |
|-------|------|--------|
| 0–1 | Tier 0 | Auto-route silently |
| 2 | Tier 1 | Show routing summary, wait for confirmation |
| 3+ | Tier 2 | Full structured clarification suite |

---

## Mode Selection

Before running any tier, the orchestrator selects the operating mode. Mode affects only HOW option values are populated in questions — the question FORMAT, CRITICAL/USEFUL grouping, and wait-for-go-ahead footer are identical in both modes.

### SIMPLE MODE (default)

- Orchestrator runs the skill directly in the main thread
- 3–5 file reads max (the Light Research Pass below)
- Works when concrete option values can be derived from active plans + context routing alone
- No subagent spawning

**Trigger conditions (all must be true for SIMPLE):**
- Ambiguity score ≤ 3
- Request is scoped to a known file, package, or named feature
- Orchestrator can fill option values from active plans + context routing alone
- Continuation, resume, or single-package scenario

### DEEP MODE

- Spawns a full research subagent BEFORE generating questions
- The subagent returns structured findings; the orchestrator uses those findings to populate question options with real file paths, concrete values, and risk-aware implications
- No generic `{X}` placeholders ever — this mode's entire purpose is to eliminate them
- Questions are materially better because they are grounded in actual codebase discovery

**Trigger conditions (any ONE triggers DEEP):**
- Ambiguity score is 4/4 (all four signals)
- Request involves a phase program kickoff (new umbrella + N phases)
- Request touches 3+ packages or feature folders
- Request involves an architectural decision (new pattern, library swap, schema design)
- User explicitly requests deep analysis ("deep dive", "investigate before asking", "thorough")
- Orchestrator judges that good option values CANNOT be generated without a codebase scan

---

## Deep Mode — Research Subagent Protocol

When DEEP MODE is triggered, the orchestrator spawns a research subagent before generating questions. The subagent's only job is to return raw findings — it does NOT generate questions.

### Research Subagent Prompt Template

Pass this prompt to the subagent verbatim, substituting the bracketed values:

```
INTENT CLARIFY — DEEP MODE RESEARCH
Request: [user's exact request]
Relevant feature: [if known, else "unknown"]
Active plans found: [list from plan-discovery]

Your job: investigate the request deeply so the orchestrator can generate high-quality clarifying questions.

Required steps (all must run):
1. vb-review-situation — current branch, worktrees, active plans, uncommitted changes
2. vb-scout — scan codebase for files/modules relevant to: [keywords from request]
3. vb-sequential-thinking — map the decision dimensions: what must be decided first? what is downstream?
4. vb-scenario — for each plausible interpretation: what are the top 3 failure modes?
5. vb-predict — 5-persona debate: senior dev / PM / security reviewer / QA / end user — what does each want to know before starting?

Return structured output with these sections:
- DISCOVERED CONTEXT: actual file paths, module names, package names found
- DECISION DIMENSIONS: ordered list of decisions that have downstream impact
- RISK SURFACE: for each interpretation, top 2 failure modes
- PERSONA DISAGREEMENTS: what different stakeholders would want prioritized differently
- CONCRETE VALUES: real paths, command strings, feature names to use in question options

Do NOT generate questions — that is the orchestrator's job. Just return raw findings.
```

### After Receiving Subagent Output

The orchestrator uses the subagent's `DISCOVERED CONTEXT` and `CONCRETE VALUES` sections to replace every option value in the Tier 2 question suite. The question generation steps (Steps 1–6 in Tier 2 below) proceed as normal, but option text is populated from real findings instead of the light research pass.

---

## Tier 0: Silent Auto-Route

No user interaction added. Score 0–1 or auto-skip triggered.

Route to the detected agent per the existing routing protocol. Do not show a routing summary.

---

## Tier 1: Routing Summary

Perform a light research pass (see section below). Then present:

```
Routing: [detected intent] → [target agent]
Scope: [what I think you want changed]
Plan: [existing plan if found, or "new work"]
```

WAIT for the user's next message before routing. Do NOT route in the same response. Do NOT say "I'll proceed unless you correct me."

If the user confirms, proceed. If the user corrects, re-score and re-route.

---

## Tier 2: Full Structured Clarification Suite

Tier 2 is the core of this skill. When triggered, the orchestrator does the following:

### Step 1 — Research pass (mode-dependent)

**In SIMPLE MODE:** Perform a light research pass (see Light Research Pass section). Budget: 3–5 file reads. Scan active plans, context routing table, recent git state, and the named file/package if any. This populates concrete values in question options.

**In DEEP MODE:** The research subagent has already run (see Deep Mode section above) and returned structured findings. Use the `DISCOVERED CONTEXT` and `CONCRETE VALUES` sections from those findings instead of performing a light research pass. Skip the 3–5 file read budget — the subagent already covered it.

In both modes, the goal of Step 1 is identical: replace every generic placeholder in question options with concrete values (package paths, plan IDs, file names, feature names).

### Step 2 — Question generation using vb-scenario + vb-predict style reasoning

Before writing the questions, THINK across these axes:
- What are the plausible failure modes if we pick the wrong scope? (vb-scenario thinking)
- What would 5 different people (senior dev, PM, security reviewer, QA, end user) want to know before starting? (vb-predict thinking)
- What ordering of decisions has the most downstream impact? (vb-sequential-thinking)

Use this analysis to GENERATE questions — not to answer them. The goal is to surface the decisions that, if made wrong, will cause the most rework.

### Step 3 — Classify each dimension as CRITICAL or USEFUL

- **CRITICAL** — getting this wrong derails the entire phase or causes rework
- **USEFUL** — helpful context but can default to recommendation without blocking

CRITICAL dimensions appear first. The user can say "skip useful questions" to answer only CRITICAL ones.

### Step 4 — Format each question using AskUserQuestion tool

**REQUIRED: use the `AskUserQuestion` tool to render all Tier 2 questions.** Do NOT render questions as markdown text. The AskUserQuestion tool renders clickable option selections in the Claude Code UI, which is far faster for the user than typing answers.

**How to call it:**
- Pass all questions in a single `AskUserQuestion` call (up to 4 per call)
- Group CRITICAL questions into the first call(s), USEFUL questions after
- Use `multiSelect: false` for mutually exclusive choices (default)
- Use `multiSelect: true` only when the user genuinely needs to pick multiple options (e.g. "which packages are in scope")
- The `header` field (max 12 chars) is the chip label — use the dimension name abbreviated
- Set `description` to the 1–2 sentence consequence explanation
- Each option `label` is the short choice text; `description` is the implication

**Option rules (same as before, now applied to AskUserQuestion fields):**
- Minimum 3 options per question (the tool supports up to 4; always include an "Other" option as the last one)
- Mark exactly one option as `(Recommended)` by appending it to the label: `"Sequential — single agent (Recommended)"`
- Fill option labels with concrete values from the research pass (real file paths, package names, plan IDs) — never generic placeholders
- The "Other" option label: `"Other"` with description: `"Describe your preference in the next message"`

**If AskUserQuestion is unavailable** (tool not in scope, non-interactive context): fall back to the markdown format below, but always prefer the tool when available.

```
**Q[N]: [Question title]**
[1–2 sentences explaining why this decision matters and what goes wrong if we choose incorrectly.]

Options:
  A) [option] — [implication] *(Recommended)*
  B) [option] — [implication]
  C) [option] — [implication]
  D) Other: describe your preference
```

### Step 5 — Group questions by dimension with headers

Each dimension header format:

```
### [Dimension name] 🔴 CRITICAL
```
or
```
### [Dimension name] 🟡 USEFUL
```

### Step 6 — Emit wait-for-go-ahead footer

After all questions, always emit:

> Answer what you want — partial answers are fine. I'll use the *(Recommended)* defaults for anything you skip. Ready to proceed when you confirm.

Do NOT route to any subagent before receiving at least a partial response or explicit "go".

---

## The 8 Standard Dimensions

For a substantial request, cover all 8 dimensions. For a narrower request, use only the dimensions that are genuinely ambiguous. Do not pad — every question should require a real decision.

Read `references/dimensions.md` before writing Tier 2 questions or the autopilot clarification round: it holds each dimension's purpose and example questions, including the autopilot promotion rule and example for Dimension 6. CRITICAL: 1 Scope and Boundaries, 2 Success Criteria, 3 Failure Modes and Risk Surface, 8 Phase Program Questions (multi-phase only). USEFUL: 4 Prior Context, 5 Priority and Urgency, 6 Autonomy Boundaries (CRITICAL when an autopilot trigger is detected), 7 Technical Constraints.

---

## Full Tier 2 Example

The complete example of good Tier 2 output, for the request "refactor the billing flow to add credit top-up support" (five questions across Scope and Boundaries, Success Criteria, Failure Modes and Risk Surface, and Priority and Urgency, then the wait-for-go-ahead footer), is in `references/examples.md` §Full Tier 2 Example. Read it before formatting a Tier 2 suite.

---

## Bad vs. Good Question Format

The bad and good question formats (open-ended with no options; only two options and no recommendation; generic placeholders left in; a good question with concrete paths and a marked recommendation) are in `references/examples.md` §Bad vs. Good Question Format. Check every question against them before emitting the suite.

---

## Autonomy Mode

### What Grants Autonomy

- Explicit autonomy phrases: "you decide", "just do it", "full autonomy", "don't ask", "autonomous"
- Mid-phase-program context where the current phase plan is selected and approved
- User has answered Tier 2 questions and said "go"
- Autopilot Mode trigger phrase detected (see `orchestration.md §Autopilot Trigger Routing`):
  autonomy is granted for the full run scope. Dimension 6 (Autonomy Boundaries) is treated as
  CRITICAL rather than USEFUL for this session.

### Phrase Matching Rule

Autonomy phrases must be standalone statements or sentence-initial. They do NOT match when embedded in descriptive text.

- "just do it" (standalone) → autonomy granted
- "just do the simple version" → NOT autonomy (descriptive use, user is specifying scope)
- "you decide how to implement it" → autonomy granted

### What Autonomy Means

- All tiers collapse to Tier 0 for the current task chain
- Clarification questions are skipped
- Routing summaries are skipped

### What Autonomy Does NOT Override

- EXECUTE approval gate ("ENTER EXECUTE MODE" still required)
- Plan review checkpoint
- Phase-program phase boundaries
- High-risk execution handoff gates
- The Consolidated Autopilot Clarification Round (see §Autopilot Clarification Mode below) —
  autopilot grants autonomy for the run, but the clarification round itself still fires once
  to lock the session. It is a different gate from the standard intent-clarify suite.

---

## Autopilot Clarification Mode

When an autopilot trigger is detected (see `orchestration.md §Autopilot Trigger Routing`),
the standard Tier 0/1/2 scoring flow is bypassed. A single **Consolidated Autopilot
Clarification Round** replaces it.

**When This Mode Fires:** The orchestrator sets autopilot clarification mode when a recognized
autopilot trigger phrase is detected at any RIPER-5 phase boundary. The trigger detection and
phrase list live in `orchestration.md §Autopilot Trigger Routing` — this skill does not own
the detection logic.

**Consolidated-Round Rule:** Issue exactly ONE `AskUserQuestion` call covering all four mandatory
dimensions in a single round-trip: (1) Scope and task name (CRITICAL), (2) Definition of done
(CRITICAL), (3) Risk tolerance / Hard-stop confirm (CRITICAL = Dimension 6 promoted), (4) Gate
deviations (CRITICAL). After the user responds, the session is locked and the orchestrator
proceeds to emit the provisional goal block.

**Abort-to-Interactive Rule:** If the user responds to the consolidated round with a phrase
opting out of autopilot ("actually, let's do this step by step", "cancel autopilot", "stop",
"interactive please"): (1) Acknowledge the opt-out, (2) Revert to standard RIPER-5 interactive
behavior, (3) Re-issue the standard Combined Clarification Gate (Step 6.5), (4) Do NOT emit
the provisional goal block, (5) Deactivate autopilot-mode for this session.

**Validator Conformance:** Autopilot clarification output MUST include all four validator markers:
restatement, score (always 4/4 under autopilot), mode (always deep for phase-program kickoffs),
reason/because justification. Full spec: `process/development-protocols/autopilot.md §Consolidated Clarification Round`.

---

## Light Research Pass

**Used in SIMPLE MODE only.** In DEEP MODE, the research subagent replaces this step entirely.

Performed by the orchestrator in the main thread, not as a subagent delegation.

Budget: 3–5 file reads max.

What it checks:

1. Active plan inventory (`process/general-plans/active/` and `process/features/*/active/`)
2. Context routing table in `process/context/all-context.md` (match keywords to domain)
3. Recent git status (uncommitted changes related to the request?)
4. If a specific package or file is named, one quick read of that file

Purpose: replace generic placeholders in question options with concrete names (package paths, plan IDs, model names, router file names). A question with concrete values is 3× more actionable than one with `{X}`.

This is NOT a full research-agent delegation. Route to research-agent after clarification resolves.

---

## Intent Revalidation After Research

After the research-agent completes, the orchestrator checks whether the original intent still holds.

If research reveals the request is fundamentally different from what was assumed, re-present a Tier 1 routing summary with updated understanding.

If research confirms the original intent, proceed to INNOVATE or PLAN without re-asking. Never repeat clarification that was already resolved.

---

## FAST Mode Integration

Intent clarification fires BEFORE the fast-mode agent is spawned. The orchestrator scores and clarifies in the main thread, then hands the clarified intent to the fast-mode-agent prompt.

Inside the fast-mode-agent, no additional clarification is needed — intent is already resolved.

---

## Fallback (Still Ambiguous After Tier 2)

If the user answers Tier 2 questions but a single routing path still cannot be determined:

1. State what remains unclear in one sentence.
2. Ask one final direct question (plain, not multiple-choice).
3. If still unresolvable after that, default to the research-agent with the narrowest reasonable scope.

Never loop clarification more than twice. Two rounds max, then route to research.

---

## Worked Scoring Examples

Three worked scoring examples are in `references/examples.md` §Worked Scoring Examples: "Fix the login bug on the auth page" scores 1 (Tier 0), "Make the app faster" scores 4 (Tier 2, full suite), "Add a top-up button to the billing page" scores 3 (Tier 2 with only 3-4 questions). Read them when you are unsure how to score a request.
