# Proposed new skills (Phase 5, step C1)

Proposals only. Nothing was added: the kit still has exactly 33 skills. Each idea needs the user's approval and its own plan before any work starts. This file is an internal record in the program task folder and does not ship.

Names use the final `vb-` prefix (after the Phase 6 rename). Each entry was checked against the 33 existing skills to make sure it is not a copy of one.

| Proposed name | One-line purpose | Why a vibecoder needs it | Overlap with existing skills |
|---|---|---|---|
| `vb-explain` | Explain, in plain words, what the kit just did or what one of its terms or signals means (for example "Gate: CONDITIONAL", "validate-contract", "blast radius"). | The workflow prints process words a non-developer has never seen; without an explanation they cannot judge whether to say "go". | None explains the kit's own vocabulary. `vc-docs-seeker` looks up library documentation. The Phase 7 README glossary table could be its source. |
| `vb-doctor` | One check after install that the kit works in this project (Node version, hooks wired, version file, validators runnable) and says in plain words what to fix. | When something breaks after install, a vibecoder cannot read validator output or hook errors. | `vc-audit-vc` audits the kit for maintainers who edit agents and skills; `vc-setup` bootstraps. Neither is a plain-language health check for the person who installed the kit. |
| `vb-undo` | Safely undo the last phase: show what would change, keep a backup point, then revert that phase's commit after the user confirms. | Vibecoders fear breaking their project and do not know git; a guided undo they can trust makes trying things less risky. | No skill reverts work. The `vc-git-manager` agent only makes commits. |
| `vb-cost-estimate` | Before an autonomous run (autopilot or a phase program), estimate how many agents it will start, roughly what that costs, and which steps are billed. | Vibecoders pay per use, and an autonomous run can start many agents without asking again. | Partial: `vc-agent-strategy-compare` already counts agents and has cost guards for one phase at a time. This may be better as an extension of that skill than as a new one; decide before planning. |
| `vb-ship-check` | A plain-language checklist before putting an app online: no secrets in the code, environment variables set, backups, error pages, basic security settings. | Most early outages and leaks come from skipped basics that nobody told a non-developer about. | `vc-security` scans code for threats and `vc-risk-evidence-pack` records evidence for high-risk changes; neither is a launch checklist for the user's own app. |

Not proposed: a "where are we" status skill, because `vc-review-situation` already covers what is in flight.
