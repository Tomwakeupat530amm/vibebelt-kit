---
status: BLOCKED
item: validator-registry-docs-lag
reason: Phase 4 owns orchestration.md and the validator registry docs; they run after Phase 1.
---

# Backlog NOTE: new validator not yet listed in the registry docs (K1-1)

Phase 1 (vibebelt-rebrand) added `.claude/skills/vc-audit-vc/scripts/validate-model-effort-policy.mjs` (38th validator). It is listed in `.claude/skills/vc-audit-vc/SKILL.md`, in `baseline/validators.list`, and in both CI workflows.

It is NOT yet listed in `process/development-protocols/orchestration.md` section "Regression Gate Validators" or in the validator registry docs (for example the registry section of `process/context/all-context.md` and `CLAUDE.md`).

Why deferred: Phase 4 (doc de-duplication) owns those files and edits them after Phase 1. Editing them in Phase 1 would create a second writer on files Phase 4 rewrites.

Fix (Phase 4): add the script to the Regression Gate Validators list and to the registry docs, then re-run `validate-protocol-wiring.mjs` and `validate-guide-sync.mjs`.

Gate affected: Phase 1 registry gate stays CONDITIONAL until then.
