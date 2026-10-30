---
name: ref:notes-upgrade-research
description: "Research summary for the notes upgrade: current code, test setup, facts that shape the plan"
date: 30-10-26
metadata:
  node_type: memory
  type: reference
  feature: general-plans
---

# Notes upgrade: research summary

Date: 30-10-26

## Current state

- `src/notes.mjs` (18 lines): `createStore()` returns `{ notes: [], nextId: 1 }`; `addNote(store, text, { now })` trims the text, rejects empty or non-string text with `TypeError`, assigns `id` and `createdAt` and returns a copy; `listNotes(store)` returns copies, oldest first.
- `test/notes.test.mjs`: 3 `node:test` cases, all passing with `node --test test/notes.test.mjs`.
- No dependencies, no package manager, no build step. Runtime: Node 22.

## Findings that matter for the plan

- `addNote` already takes an options object (`{ now }`), so a `tags` option fits there without breaking callers.
- `nextId` must be saved with the notes, otherwise ids repeat after a reload.
- Atomic save on one machine: write `<file>.tmp` with `fs.writeFileSync`, then `fs.renameSync` it onto the target. With Node 22 the rename also replaces an existing file on Windows.
- The saved file needs a `version` field (start at 1) so that a later format change can be detected.
- A linear scan is fast enough for a few hundred notes; no search index is needed.

## Questions resolved with the user

- What counts as a match for ordering? Every occurrence of the query in the text, plus one for each matching tag (now written into the SPEC, REQ-3).
