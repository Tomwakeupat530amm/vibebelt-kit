---
name: plan:note-length-limit
description: "Reject notes longer than 280 characters in addNote"
date: 30-10-26
metadata:
  node_type: memory
  type: plan
  feature: general-plans
---

# Note length limit

Date: 30-10-26
Status: PLANNED (waiting for VALIDATE)
Complexity: SIMPLE

TL;DR: `addNote` must reject notes that are too long, so that notes fit the phone widget.

## Overview

The phone widget shows at most 280 characters of a note. `addNote` in `src/notes.mjs` accepts any length today. This plan adds a limit.

Context router: `process/context/all-context.md`. Test routing: `process/context/tests/all-tests.md`.

## Touchpoints

- Modify: `src/notes.mjs` (`addNote`).
- Modify: `test/notes.test.mjs` (one new test).

## Public Contracts

- `addNote(store, text, options)` throws `RangeError` when the note is longer than 280 characters. All other behaviour stays the same.

## Blast Radius

- `src/notes.mjs` and `test/notes.test.mjs` only.

## Implementation Checklist

- [ ] 1. In `addNote`, throw `RangeError('note is longer than 280 characters')` when the text is too long.
- [ ] 2. Add a test that a 500-character note is rejected.
- [ ] 3. Run `node --test test/notes.test.mjs`.

## Verification Evidence

| Check | Command | Expected |
|---|---|---|
| Unit tests | `node --test test/notes.test.mjs` | exit 0 |

Test Procedure: run the command above from the project root.

## Acceptance Criteria

- AC1 A note longer than 280 characters is rejected with `RangeError`.
- AC2 The existing tests still pass.

## Phase Completion Rules

- Done when the checklist is ticked and the unit tests exit 0.

## Resume and Execution Handoff

- Selected plan file path: `process/general-plans/active/note-length-limit_30-10-26/note-length-limit_PLAN_30-10-26.md`
- Next Step: VALIDATE this plan, then ENTER EXECUTE MODE.

## Validate Contract

Not written yet: the VALIDATE step writes this section before EXECUTE.
