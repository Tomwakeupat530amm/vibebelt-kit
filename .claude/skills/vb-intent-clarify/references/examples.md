# Intent Clarification Examples

Loaded on demand from SKILL.md. Each section below matches the SKILL.md heading of the same name.

## Full Tier 2 Example

Below is a complete example of good Tier 2 output for a request like "refactor the billing flow to add credit top-up support."

---

**Intent understood:** Add credit top-up support to the billing flow. Before routing, I need to resolve a few key decisions.

---

### Scope and Boundaries 🔴 CRITICAL

**Q1: Which layers does this change touch?**
Getting scope wrong here means re-opening files mid-phase and invalidating earlier test gates.

Options:
  A) Prisma schema + tRPC billing router + UI billing page — full stack *(Recommended)*
  B) tRPC billing router + UI only — skip schema migration for now
  C) UI only — wire to existing endpoints, validate assumptions first
  D) Other: describe your preference

**Q2: Which existing billing surfaces must NOT change?**
We need to know what is off-limits before touching shared code paths.

Options:
  A) Stripe webhook handlers and subscription models are frozen *(Recommended)*
  B) Only the credit transaction model is frozen
  C) Nothing is frozen — all billing code is in scope
  D) Other: describe your preference

---

### Success Criteria 🔴 CRITICAL

**Q3: What does "done" look like?**
If the success bar is wrong, the agent will stop too early or overshoot.

Options:
  A) User can trigger a top-up from the UI and credit balance updates — end-to-end *(Recommended)*
  B) Backend complete with tests passing; UI is out of scope for this phase
  C) Plan written and approved — no implementation yet
  D) Other: describe your preference

---

### Failure Modes and Risk Surface 🔴 CRITICAL

**Q4: Is there a risk surface we must protect?**
Billing changes can silently double-charge or under-credit users if guard logic is missing.

Options:
  A) Add explicit idempotency key to the top-up Stripe call *(Recommended)*
  B) No idempotency needed — amount is small enough that duplicates are acceptable
  C) Not sure — flag for code review
  D) Other: describe your preference

---

### Priority and Urgency 🟡 USEFUL

**Q5: Speed vs. quality tradeoff?**
Affects whether we write a full plan with validate-contract or skip to a lightweight execute.

Options:
  A) Proper plan + validate-contract + full test coverage *(Recommended)*
  B) Quick implementation with tests deferred to a follow-up
  C) Research and plan only — no implementation this session
  D) Other: describe your preference

---

> Answer what you want — partial answers are fine. I'll use the *(Recommended)* defaults for anything you skip. Ready to proceed when you confirm.

## Bad vs. Good Question Format

Understanding the failure modes in question generation:

### Bad (open-ended, no options)

```
Q: What scope should the refactor cover?
```
This forces the user to type a free-form answer. Slow. Vague. Hard to act on.

### Bad (only 2 options, no recommendation marked)

```
Q: Full stack or UI only?
  A) Full stack
  B) UI only
```
Binary questions miss the third path. No recommendation means the user has no default to accept.

### Bad (generic placeholders left in)

```
Q: Which areas? [A] just {X} [B] {X} and {Y}
```
Placeholders not replaced with concrete values from light research. Signals the skill was invoked lazily.

### Good

```
**Q1: Which packages does this refactor touch?**
Scope determines which test gates apply and which blast-radius files need review before touching code.

Options:
  A) packages/api/src/router/billing.ts + apps/web/src/app/billing — full stack *(Recommended)*
  B) apps/web/src/app/billing only — frontend changes, read-only backend exploration
  C) packages/api/src/router/billing.ts only — backend logic, no UI changes yet
  D) Other: describe your preferred scope
```

## Worked Scoring Examples

**Example A — "Fix the login bug on the auth page"**

- Ambiguous scope: No (+0) — "auth page" is a specific scope
- No explicit path: Yes (+1) — no file named, but scope is narrow
- Multiple intents: No (+0) — single intent (fix)
- First interaction: No (+0)

Score: 1 → Tier 0, auto-route to debugger/execute.

**Example B — "Make the app faster"**

- Ambiguous scope: Yes (+1) — bundle size, API perf, rendering, caching all possible
- No explicit path: Yes (+1) — no file or package named
- Multiple intents: Yes (+1) — refactor, config change, infra work, or research
- First interaction: Yes (+1)

Score: 4 → Tier 2, full structured clarification suite.
Generate questions across Scope, Success Criteria, Failure Modes, Priority, Technical Constraints (all dimensions where "faster" is ambiguous).

**Example C — "Add a top-up button to the billing page"**

- Ambiguous scope: No (+0) — billing page is named
- No explicit path: Yes (+1) — no file path
- Multiple intents: Yes (+1) — could stop at UI only or require schema/Stripe changes
- First interaction: Yes (+1)

Score: 3 → Tier 2, but only 3–4 questions covering Scope, Success Criteria, Risk Surface (billing-specific failure modes). Skip Autonomy Boundaries and Phase Program since it's a single-phase feature.
