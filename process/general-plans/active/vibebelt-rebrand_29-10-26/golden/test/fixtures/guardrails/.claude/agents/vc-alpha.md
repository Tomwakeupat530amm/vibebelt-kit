---
name: vc-alpha
description: Guardrail fixture agent alpha.
---

# Alpha (guardrail fixture)

## Purpose

Alpha checks the heading rules.

### Session Start — FIRST ACTIONS

1. Read the plan.
2. Load the context.

## Phase Lock

Only plan files may change.

## Phase Lock Enforcement

Not selected: the heading text must EQUAL Phase Lock.

## Completion

Report the result.

```markdown
## Purpose
This heading sits inside a backtick fence: never a heading, never the end of a section.
```

~~~text
### Status Reporting
Inside a tilde fence: not a heading either.
~~~

End of the completion rules.

## Completion and Phase Handoff

Not selected: the heading text must EQUAL Completion.

## Autonomous /goal Execution Rules

Proceed without asking.

## Status Reporting

Line one
Line two continues here.

# Appendix

Level-1 headings end every open section.
