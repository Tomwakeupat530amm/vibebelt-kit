---
status: OPEN
item: vi-native-review
reason: no native Vietnamese speaker has reviewed the Vietnamese README; only its structure is machine-checked.
---

# Backlog NOTE: native review of the Vietnamese README

Since rebrand Phase 7 (2026-10-30) the Vietnamese README is the main page of the repository: `README.md` is Vietnamese and the English copy is `docs/i18n/README.en.md` (user decision: Vietnamese first). An agent wrote the Vietnamese text. No native speaker has read it yet.

What is checked by machine (`node scripts/check-docs.mjs`, checks 1 to 6): the same heading levels and order as the English file, the same three marked sections (top, quick start, glossary) and glossary rows, every bold quick-start term defined in the glossary, one identical install command, relative links that resolve, and a language switcher that lists Tiếng Việt first.

What is not checked: whether the Vietnamese reads naturally, uses the words Vietnamese vibecoders actually use, and means exactly what the English says.

Fix: a native speaker reads `README.md` side by side with `docs/i18n/README.en.md`, corrects wording only (keep headings, the `15 Agents` and `33 Skills` heading words that `validate-guide-sync.mjs` needs, markers, tables, commands and links), then runs `node scripts/check-docs.mjs` and `node .claude/skills/vb-audit-vc/scripts/validate-guide-sync.mjs` (both exit 0). `scripts/check-docs.mjs` is removed from the final tree in rebrand Phase 8 step C0b; after that, check the structure by hand or restore the script from git history.
