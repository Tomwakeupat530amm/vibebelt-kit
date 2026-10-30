---
name: ref:notes-upgrade-decision
description: "Decision summary for the notes upgrade: chosen approach, rejected alternatives, risks"
date: 30-10-26
metadata:
  node_type: memory
  type: reference
  feature: general-plans
---

# Notes upgrade: decision summary

Date: 30-10-26

## Decision Summary

### Chosen Approach

Three small steps, built in this order, each with its own test file:

1. `src/store-file.mjs`: `saveStore` and `loadStore`; JSON shape `{ "version": 1, "nextId": n, "notes": [...] }`; atomic write (temporary file, then rename).
2. Tags on the note object inside `src/notes.mjs`: `addNote` option `tags`, `listNotes` option `tag`. The file format keeps `version: 1` because `tags` is an optional field.
3. `src/search.mjs`: `searchNotes(store, query)`, a pure linear scan.

### Why This Over Alternatives

- Rejected: SQLite or another storage library (a new dependency, against the SPEC constraint).
- Rejected: one large rewrite of `src/notes.mjs` (harder to test and review step by step).
- Rejected: a search index (not needed at this size, and more code to keep in sync).

### Risk Predictions

- Saving after a failed load could destroy a corrupt file: `loadStore` must throw, and nothing may save over a file that failed to load.
- Tag normalisation could differ between adding and filtering: normalise in one helper used by both.

### Key Constraints Accepted

- One process only (no file locking).
- Ties in search order fall back to newest first, then id.
