---
name: spec:notes-upgrade
description: "Locked SPEC: persist notes to a JSON file, add tags, add search (three dependent steps)"
date: 30-10-26
metadata:
  node_type: memory
  type: spec
  feature: general-plans
---

# Notes upgrade: persistence, tags and search (SPEC)

Status: LOCKED (approved by the user on 30-10-26)
Date: 30-10-26

TL;DR: notes must survive a restart, carry tags and be searchable. Three requirements, each building on the one before.

## Summary

The notes store in `src/notes.mjs` lives only in memory. Users lose their notes on every restart, and they cannot organise or find notes.

## Requirements

- REQ-1 Persistence. `saveStore(store, file)` writes the whole store to a JSON file and `loadStore(file)` reads it back. A missing file loads as an empty store. A file that is not valid JSON, or that has an unknown `version`, makes `loadStore` throw an error that names the file, and the file is never overwritten in that case. Saving is atomic: write a temporary file next to the target, then rename it over the target.
- REQ-2 Tags (needs REQ-1). `addNote(store, text, { tags })` accepts an optional array of tags. Tags are trimmed, lowercased, de-duplicated and sorted; an empty tag throws `TypeError`. `listNotes(store, { tag })` returns only the notes with that tag. Tags are saved and loaded with the notes.
- REQ-3 Search (needs REQ-2). `searchNotes(store, query)` returns the notes whose text or tags contain the query, ignoring case. Results are ordered by the number of matches (every occurrence of the query in the text, plus one per matching tag), then newest first, then by id. An empty or blank query throws `TypeError`.

## Acceptance Criteria

- AC-1 Save then load returns an equal store (ids, texts, createdAt, tags, nextId). (REQ-1)
- AC-2 A corrupt file makes `loadStore` throw, and the file stays byte-identical. (REQ-1)
- AC-3 A missing file loads as an empty store. (REQ-1)
- AC-4 Tags are normalised as described, and filtering by tag works. (REQ-2)
- AC-5 Tags survive save and load. (REQ-2)
- AC-6 Search ignores case, covers text and tags, and is ordered as described. (REQ-3)
- AC-7 A blank query throws `TypeError`. (REQ-3)
- AC-8 The existing tests in `test/notes.test.mjs` still pass without changes.

## Out Of Scope

- A command-line interface, network sync, several processes writing the same file at once, encryption.

## Constraints

- No new dependency: Node 22 built-ins only.
- Tests use `node:test` and are run by explicit file path.
- Existing calls to `createStore`, `addNote` and `listNotes` keep working unchanged.
