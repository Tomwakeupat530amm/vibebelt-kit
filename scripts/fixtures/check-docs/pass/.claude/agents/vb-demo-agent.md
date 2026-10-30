---
name: vb-demo-agent
description: "Fixture agent for scripts/check-docs.mjs --self-test"
model: sonnet
---

# Demo agent

Read `process/development-protocols/orchestration.md` first, then hand the work to `vb-plan-agent`.

When the work is done, emit PHASE_COMPLETE: EXECUTE and end with DONE or BLOCKED.
If an assumption is unclear, emit VB-PREDICT-DEEP-NEEDED and wait. Proceed only after Gate: PASS.
Retry at most 3 times.
