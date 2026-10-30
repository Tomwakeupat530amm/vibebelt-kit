---
name: plan:slugify-helper
description: "Implement slugify(text) in src/slugify.mjs so the five node:test cases pass"
date: 30-10-26
metadata:
  node_type: memory
  type: plan
  feature: general-plans
---

# Slugify helper

Date: 30-10-26
Status: APPROVED (validated, ready for EXECUTE)
Complexity: SIMPLE

TL;DR: implement `slugify(text)` in `src/slugify.mjs` so the five tests in `test/slugify.test.mjs` pass. One file changes.

## Overview

Page titles need URL slugs. `src/slugify.mjs` exports a stub that throws. This plan implements it with no dependency (Node 22 built-ins only).

Context router: `process/context/all-context.md`. Test routing: `process/context/tests/all-tests.md`. This project only needs `node --test` run by explicit file path.

## Touchpoints

- Modify: `src/slugify.mjs` (implement `slugify`).
- Read only: `test/slugify.test.mjs` (the acceptance tests; never edit them).

## Public Contracts

- `slugify(text: string): string`, exported from `src/slugify.mjs`.
- Rules: the result is lowercase; ASCII letters `a-z` and digits `0-9` are kept; every run of any other characters becomes one `-`; the result never starts or ends with `-`; when nothing is left the result is `''`; a non-string argument throws `TypeError`.

## Blast Radius

- One file: `src/slugify.mjs`. Nothing imports it yet. No dependency, no configuration, no data.

## Implementation Checklist

- [ ] 1. In `src/slugify.mjs`, throw `TypeError` when `typeof text !== 'string'`.
- [ ] 2. Lowercase the text, replace every run of characters outside `a-z0-9` with `-`, then remove `-` from both ends.
- [ ] 3. Run `node --test test/slugify.test.mjs` and confirm exit 0 (5 tests pass).

## Verification Evidence

| Check | Command | Expected |
|---|---|---|
| Unit tests | `node --test test/slugify.test.mjs` | exit 0, 5 of 5 tests pass |

Test Procedure: run the command above from the project root, by explicit path (a bare `node --test` would also pick up unrelated test files).

## Acceptance Criteria

- AC1 `slugify('Hello World')` returns `hello-world`. Proven by `test/slugify.test.mjs`.
- AC2 runs of spaces and punctuation become one hyphen, with no hyphen at either end. Same file.
- AC3 digits are kept. Same file.
- AC4 a title with nothing left returns `''`. Same file.
- AC5 a non-string argument throws `TypeError`. Same file.

## Phase Completion Rules

- Done when every checklist item is ticked, `node --test test/slugify.test.mjs` exits 0, and only `src/slugify.mjs` changed.

## Resume and Execution Handoff

- Selected plan file path: `process/general-plans/active/slugify-helper_30-10-26/slugify-helper_PLAN_30-10-26.md`
- Last completed step: VALIDATE (Gate: PASS).
- Next Step: ENTER EXECUTE MODE for this plan.

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

- [x] None needed: the plan already names the file, the rules and the exact test command.

### Execute-agent instructions

- Change only `src/slugify.mjs`. Do not edit or add test files.
- Run the test file by explicit path: `node --test test/slugify.test.mjs`.

### Test gates

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| AC1-AC5 | slugify rules | Fully-Automated | `node --test test/slugify.test.mjs` exits 0 | B |

- Fully-automated: `node --test test/slugify.test.mjs` exits 0. Proves: AC1-AC5.

Failing stubs:
- test("should turn a page title into a URL slug", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should turn a page title into a URL slug") })

### High-risk pack

Required: no

### Backlog artifacts to create during durable capture

- None.

### Known gaps on record

- None.

### Accepted by

session — Gate PASS, nothing to accept.
