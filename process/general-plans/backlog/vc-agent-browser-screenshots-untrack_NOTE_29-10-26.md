---
status: done-with-gap
item: vc-agent-browser-screenshots-untrack
reason: nothing to change; the screenshots are already git-ignored (Phase 0 A3c) and were never in the upstream-baseline tag. The only remainder is that 53 PNG files (about 14.6 MB) stay on disk in this source work tree.
---

# Backlog NOTE: vc-agent-browser screenshots (no action needed)

The 15 MB size of `.claude/skills/vc-agent-browser/` is almost all screenshot images. Git does not track them and installs never copy them, so nothing was moved, deleted or untracked, and nothing needs to change.

Facts, measured read-only on 2026-10-30 at HEAD `f43f597` (rebrand Phase 5, step A3):

- The skill folder is 15M in total. `screenshots/` accounts for all of it: 14,636 KiB on disk, 14,889,028 bytes of file content. The rest is small: `SKILL.md` 12K, `references/` 72K, `scripts/` 216K, and no vendored dependency folder.
- `screenshots/` holds 53 PNG files: `ui-audit-20260408/` (19 files, 4.3M) and `ui-audit-20260408-v2/` (29 files, 8.9M), together 13.2M, plus 5 top-level mock images (the smallest, `chat-mock-workspace.png`, is 429 bytes).
- Git tracks none of them (`git ls-files` finds 0 paths) and the `upstream-baseline` tag holds none (0 paths). `.gitignore` line 10 ignores the folder; commit `2627c28` (`chore: ignore agent-browser screenshots`, Phase 0 step A3c) added that rule.
- Installs never copy them: `vc-manifest.json` lists `**/screenshots/**` under `exclude` (line 26). The weight exists only in this source repo's work tree.
- The folder is the skill's runtime output path. `scripts/README.md` line 107 says: "Always save screenshots to `.claude/skills/vc-agent-browser/screenshots` directory." So the folder must stay.

Decision: keep the folder and its files. No `.gitignore` change, no untracking, no move, no deletion. If the maintainer wants the disk space back, deleting the old PNG files by hand is safe for git and for installs (they are untracked and ignored), but that is the user's choice, not a program step.

This note is an internal record. Backlog NOTE files are removed from the release tree by the Phase 8 cleanup (C-CLEAN), so it does not ship.
