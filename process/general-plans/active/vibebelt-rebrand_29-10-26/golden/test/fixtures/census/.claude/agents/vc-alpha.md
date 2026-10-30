---
name: vc-alpha
description: Census fixture agent alpha. The front-matter is part of the scanned text.
---

# Alpha (census fixture)

[MODE: PLAN]

1. After a supplement, emit `PHASE_COMPLETE: PLAN-SUPPLEMENT — supplement applied`.
2. After the first plan, emit `PHASE_COMPLETE: PLAN — plan written`.
3. After the second plan, emit `PHASE_COMPLETE: PLAN — second plan written`.
4. After closeout, emit `PHASE_COMPLETE: UPDATE PROCESS — archived`.

Status words: DONE_WITH_CONCERNS, NEEDS_CONTEXT, BLOCKED.
Registry value `BLOCKED-skipped` is a different word.

Signals: VC-PREDICT-DEEP-NEEDED (no colon) and `VB-FEASIBILITY-VERDICT-READY: verdict ready`.

Gate: CONDITIONAL

Noise that must never be counted: THIS: SUMMARY: MUST: HIGH:
