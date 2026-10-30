---
status: BLOCKED
item: risk-artifacts-validator-fixtures
reason: needs a schema decision on risk artifacts before fixtures can be written.
---

# Backlog NOTE: `validate-risk-artifacts.mjs` has no fixtures and fails in CI (row 19)

`.claude/skills/vb-risk-evidence-pack/scripts/validate-risk-artifacts.mjs` ships no fixtures of its own. In Phase 1 CI it runs on the evidence-pack pass directory as a stand-in; that directory has no pack files at its top level and uses another field schema, so the script exits 1.

Current handling: the step exists in `validate.yml` and `release.yml` with `continue-on-error: true` and a cause comment, so CI stays green. This is a weak check: it proves the script runs, not that it validates anything.

Fix: decide the artifact schema (risk-gate.json, verification.json, and so on), add `fixtures/validate-risk-artifacts/pass` and `fail` directories, point the CI step at the pass fixture, remove `continue-on-error`.

Related and also allowed to fail: `validate-eval-coverage.mjs` needs runtime-harness scenarios that this kit does not ship (separate decision).
