---
name: plan:word-count-helper
description: "Add wordCount(text) in src/word-count.mjs with node:test coverage (executed, EVL green)"
date: 30-10-26
metadata:
  node_type: memory
  type: plan
  feature: general-plans
---

# Word count helper

Date: 30-10-26
Status: EXECUTED (EVL green, waiting for UPDATE PROCESS)
Complexity: SIMPLE

TL;DR: `wordCount(text)` is implemented and its five tests pass (confirmed twice). Only the closeout is left.

## Overview

The editor shows a live word count. This plan added `wordCount(text)` in a new file with its own tests. No dependency (Node 22 built-ins only).

Context router: `process/context/all-context.md`. Test routing: `process/context/tests/all-tests.md`.

## Touchpoints

- Created: `src/word-count.mjs`, `test/word-count.test.mjs`.

## Public Contracts

- `wordCount(text: string): number`, exported from `src/word-count.mjs`. A word is a run of letters (with their accents), digits or apostrophes; every other character separates words; a non-string argument throws `TypeError`.

## Blast Radius

- The two new files only. Nothing else imports them yet.

## Implementation Checklist

- [x] 1. Create `src/word-count.mjs` with `wordCount`.
- [x] 2. Create `test/word-count.test.mjs` with five cases: punctuation, apostrophes, blank text, letters outside ASCII, `TypeError`.
- [x] 3. Run `node --test test/word-count.test.mjs` (exit 0, 5 of 5 pass).

## Verification Evidence

| Check | Command | Expected | Result |
|---|---|---|---|
| Unit tests | `node --test test/word-count.test.mjs` | exit 0 | exit 0, 5 of 5 pass in EXECUTE and again in the independent EVL confirmation run |

Test Procedure: run the command above from the project root, by explicit path.

## Acceptance Criteria

- AC1 Words separated by spaces and punctuation are counted (`'Hello, world! How are you?'` gives 5). Proven by `test/word-count.test.mjs`.
- AC2 Apostrophes stay inside words. AC3 Empty or blank text gives 0. AC4 Letters outside ASCII count. AC5 Non-string input throws `TypeError`. Same file.

## Phase Completion Rules

- Done when every checklist item is ticked and the unit tests exit 0 (both true). The task folder is archived by UPDATE PROCESS.

## Resume and Execution Handoff

- Selected plan file path: `process/general-plans/active/word-count-helper_30-10-26/word-count-helper_PLAN_30-10-26.md`
- Last completed step: EVL (gates green; confirmation run by the tester agent).
- Execution report: `process/general-plans/active/word-count-helper_30-10-26/word-count-helper_REPORT_30-10-26.md` (holds the EVL handoff summary).
- Next Step: ENTER UPDATE PROCESS MODE for this plan (archive, context check, closeout).

## Validate Contract

Status: PASS
Date: 30-10-26
date: 2026-10-30
generated-by: outer-pvl

Gate: PASS

### Parallel strategy

Choice: sequential
Signals: 0/7
Agent count: 1 (one executor)

### Plan updates applied

- [x] None needed.

### Execute-agent instructions

- Create only the two files named in Touchpoints.
- Run the test file by explicit path: `node --test test/word-count.test.mjs`.

### Test gates

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| AC1-AC5 | wordCount rules | Fully-Automated | `node --test test/word-count.test.mjs` exits 0 | B |

- Fully-automated: `node --test test/word-count.test.mjs` exits 0. Proves: AC1-AC5.

### High-risk pack

Required: no

### Backlog artifacts to create during durable capture

- None.

### Known gaps on record

- None.

### Accepted by

session — Gate PASS, nothing to accept.
