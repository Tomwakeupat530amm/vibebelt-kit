---
name: plan:vibebelt-rebrand-phase-04-doc-dedup
description: "vibebelt-kit rebrand — Phase 04: Safe doc tidy (no content dedup): fix broken pointers, justify leftovers, AGENTS.md under the Codex 32 KiB limit"
date: 29-10-26
metadata:
  node_type: memory
  type: plan
  feature: general-plans
  phase: phase-04
---

# Phase 04 — Safe doc tidy (was: Doc de-duplication)

**Program:** vibebelt-rebrand
**Umbrella plan:** process/general-plans/active/vibebelt-rebrand_29-10-26/vibebelt-rebrand-umbrella_PLAN_29-10-26.md
**Phase status:** ⏳ PLANNED (re-scoped 2026-10-30, inner step 3)
**Complexity:** SIMPLE (one sequential execute leg, 3 shipped files edited, zero billed calls)
**Report destination:** process/general-plans/active/vibebelt-rebrand_29-10-26/phase-04-doc-dedup_REPORT_29-10-26.md (flat in the program task folder)

TL;DR: Phase 4 no longer de-duplicates CLAUDE.md/AGENTS.md. It fixes 3 broken pointers (4 occurrences), rewrites 3 stale "superseded/legacy" lines, lists the 38th validator, and trims AGENTS.md from 37,885 to about 31,920 bytes so Codex reads all of it. CLAUDE.md stays byte-identical. One `fix:` commit, 3 files, revertable alone. No model calls.

---

## Overview

One phase of the vibebelt-rebrand program; program context lives in the umbrella plan. Context router: `process/context/all-context.md`. Test routing: `process/context/tests/all-tests.md` (loaded; validators are plain Node scripts, CI runs 38 of them, `baseline/compare.sh` is the not-worse gate).

Date: 29-10-26 (re-scoped 30-10-26)
Status: PLANNED
Complexity: SIMPLE

## Purpose

Keep behaviour and quality at least equal to the old kit (C-EQ) while removing real defects in the shared docs:

1. Codex reads only the first 32,768 bytes of `AGENTS.md` (research finding: `project_doc_max_bytes` default 32768; `.codex/config.toml` sets no override, verified). `AGENTS.md` is 37,885 bytes, so Codex silently loses everything after line 594: Key Principles (Phase Locking, Safety: "Never start EXECUTE without explicit approval"), Success Metrics, Quick Start, Troubleshooting, Resources, Porting Notes. Fix: trim low-value and duplicated text so the whole file, including Safety, fits.
2. Broken pointers: `orchestration.md` cites `autopilot.md §ENTER EXECUTE MODE Consent` (no such heading); `AGENTS.md` cites `all-context.md §Testing-and-Quality` (heading is `## Testing`); `all-development-protocols.md` points twice at `archive/vc-system-behavior-reference_ARCHIVED_09-06-26.md` (folder does not exist).
3. Stale leftover: `orchestration.md` "Superseded by Section 6 canonical format" paragraph keeps a dead 2-field format next to its replacement.
4. K1-1: `validate-model-effort-policy.mjs` (CI runs it) is missing from `orchestration.md` §Regression Gate Validators.

## Scope Decision (2026-10-30, user-delegated, recorded)

Content dedup is DROPPED. Measured at HEAD b17294d: overlap CLAUDE.md vs AGENTS.md is about 10.7 % of lines / 9.3 % of 8-token shingles (27 of 252 lines), mostly paraphrase; 7 of 10 core rules live only in CLAUDE.md (Bootstrap Guard exists in no protocol file); replacing the AGENTS.md Skill Registry loses keywords in 18 of 30 rows and drops AGENTS.md from the catalog `routedFrom` of 7 skills (catalog stale, `validate-skill-keywords` red); CLAUDE.md is the orchestrator's governing text. So:

- `CLAUDE.md`: byte-identical (gate `git diff b17294d -- CLAUDE.md` empty).
- `AGENTS.md` Skill Registry table: stays whole (gate `generate-skills-catalog.mjs --check` exit 0).
- No file under `process/development-protocols/` is added, removed or renamed (22 files; README says "22 shared workflow docs"; cited by 32 SKILL.md, 30 agent files, hooks, `install.sh`, `compute-sync-plan.mjs`, e2e). No heading is renamed or removed. `CLAUDE.md §Model Selection Policy`, `implementation-standards.md §Agent Frontmatter Conventions` (named as sources by `validate-model-effort-policy.mjs`) and `orchestration.md §Current Execution State Format` (cited by CLAUDE.md:113) keep their headings.
- Zero billed model calls: the cold-read probe, its 4-8 `claude -p` calls and the 0.5a cost acknowledgement are removed.
- Team, worktrees, branches, join, SendMessage and revert rehearsal are removed: Phase 4 then Phase 5 run sequentially on `main`.

### Verified corrections to the research brief

- `11-phase-programs.md:15` `(see §Loop-Control Safety Bounds)` is NOT broken: it is a same-file anchor; the heading exists at `11-phase-programs.md:397` (`### Loop-Control Safety Bounds (still surface under /goal ...)`). It is not edited. The real dangling text on that line is `See \`12-reference.md\` PHASE-GATES`: no file in the repo defines a PHASE-GATES section; the same citation occurs 9 times in 8 files (`vc-system-behavior/04` x2, `05`..`11` x1). Fixing it needs new normative text (a new section) or a judgment call about which gate each line means, so it is a Known Gap (KG-P4-2), not a Phase 4 edit.
- `AGENTS.md:385` `§Testing-and-Quality` is an additional real broken anchor (inside the Phase 4 claim): fixed.
- K1-1: `CLAUDE.md`, `process/context/all-context.md` and `process/context/tests/all-tests.md` already name `validate-model-effort-policy`; the only missing list is `orchestration.md` §Regression Gate Validators. CLAUDE.md:331 / AGENTS.md:385 say "14 VC-system behavior validators ... registered in all-context.md"; all-context.md has no such registry (it says "the 38 validators" and routes to all-tests.md). CLAUDE.md is frozen and AGENTS.md must stay consistent with it, so the "14" wording is a Known Gap for UPDATE PROCESS (KG-P4-4), not edited here.

---

## Entry Gate

- Phase 3 exit gate green (Phase 3 = "Instrument and freeze, no agent changes").
- `git diff b17294d -- AGENTS.md CLAUDE.md process/development-protocols/` is empty (all line numbers below are at b17294d). If not empty: STOP, return `NEEDS_CONTEXT` (line ranges must be re-measured by PLAN).

---

## Strategy Recommendation (vc-agent-strategy-compare)

- Score 1/7: S4 (phase program) only. 3 shipped files, no schema/auth/API/billing surface, no other phase writes these files concurrently.
- Recommended: **Sequential**. One `vc-execute-agent` (opus, front-matter) runs Steps 0-D and makes the commits; then one independent `vc-tester` (opus, front-matter, no override) runs the Exit Gate (EVL). Research/plan/validate on their front-matter model (opus). No team, no parallel subagents (nothing to coordinate).
- Agent count: 2 for E+EVL. Cost guard: not triggered. Billed probe calls: 0.

---

## Blast Radius

- Edited (shipped): `AGENTS.md`, `process/development-protocols/orchestration.md`, `process/development-protocols/all-development-protocols.md`. Nothing else outside the task folder.
- Read-only / must stay byte-identical: `CLAUDE.md`, the other 20 protocol files, both charter-template mirror copies, `.claude/**`, `.codex/**`, `process/context/**` (incl. `generated-skills-catalog.json`), `MIGRATION.md`, `vc-manifest.json` (its `legacyDeletions` keeps the full archive path on purpose).
- Task folder (doomed by C-CLEAN, never shipped): `$T/p4-tools/**` (scripts and before/after captures), `$T/dedup-allowlist.txt`, `$T/dedup-allowlist.why.txt`, the Phase 4 report.
- Risk class: none of the high-risk classes; documentation that steers agent behaviour (guarded by the census and anchor gates).

### Path variables and conventions

```bash
T=process/general-plans/active/vibebelt-rebrand_29-10-26
```

- Run everything from the repo root with Linux `node` (v22.23.4), the runtime that wrote `baseline/validators_after_setup.tsv`. Bash only; `LC_ALL=C sort`; no process substitution in gates (write both sides to files, then `diff`/`comm`).
- Prefix-neutral captures (Phase 6 renames `vc-` to `vb-`, same length): every census/anchor capture pipes through `sed -E 's/\bv[cb]-/v?-/g; s/\bV[CB]([-_])/V?\1/g'` before sorting, so the same tools can be re-run after Phase 6.

---

## Implementation Checklist

### Step 0 - Gates and before-captures (red-first, before any edit)

- [ ] 0.1 Check the Entry Gate. `git rev-parse HEAD > $T/p4-tools/p4_start.txt`. Write `$T/p4-tools/claim.txt` = the 3 shipped paths, one per line, `LC_ALL=C` sorted: `AGENTS.md`, `process/development-protocols/all-development-protocols.md`, `process/development-protocols/orchestration.md`.
- [ ] 0.2 Write `$T/p4-tools/census.mjs` (`--out <file>`). For each of `CLAUDE.md`, `AGENTS.md` and every `process/development-protocols/**/*.md`, print sorted lines `<file><TAB><token><TAB><count>` (prefix-neutral) for: (a) signal tokens by regex: `PHASE_COMPLETE[: A-Z-]*`, `Gate: (PASS|CONDITIONAL|BLOCKED)`, `QUICK_FIX_ABORT`, `\[MODE: [^\]]*\]`, `ENTER [A-Z ]+ MODE`, `\b(DONE_WITH_CONCERNS|NEEDS_CONTEXT|BLOCKED|DONE)\b`, `@process/[^ )\x60]*`, `[Bb]ootstrap [Gg]uard`, `find process/(context|development-protocols)/ -type f`; (b) the 10 rule anchors of the anchor matrix below (case-insensitive fixed strings); (c) skill names (`ls .claude/skills`) and agent names (`.claude/agents/*.md` stems) found per file, rows `skill:<name>` / `agent:<name>`, counted with word boundaries (no `[A-Za-z0-9_-]` directly before or after, so `vc-debug` is not counted inside `vc-debugger`). The `ENTER [A-Z ]+ MODE` regex stays case-sensitive. Write `$T/p4-tools/census-before.txt`. Mode `--compare-agents <before> <after>`: for `AGENTS.md` signal and anchor rows, exit 1 if any row decreases except the 3 allowed drops in the Anchor matrix section (exact token and exact counts); for `skill:`/`agent:` name rows, exit 1 ONLY if a row is below 1 after (name rows may drop by design: E13 link rewrite, Quick Start deletion).
- [ ] 0.3 Write `$T/p4-tools/pointer-check.mjs` (`--out <file>`). Scan every git-tracked text file except `$T/**` (`git ls-files`). Extract (1) repo-relative paths matching `process/development-protocols/[A-Za-z0-9_./-]+\.md`, and inside `process/development-protocols/**` also relative `*.md` paths in backticks (resolve against the citing file's folder, then against `process/development-protocols/`); (2) `<file>.md§Name` and `` `<file>.md` §Name `` anchors (optional backticks/space; Name = text up to the next backtick, `)`, `,`, `;`, ` (`, a `.` followed by whitespace or end of line, or end of line, trimmed; so `§Testing. Run ...` and `§Feature Folder Lifecycle.` resolve). A path is OK if the file exists; an anchor is OK if some Markdown heading of that file, after stripping `#`s, starts with Name (case-insensitive). Bare `§Name` (no file before it) binds to the citing file. `Section N` citations and `12-reference.md PHASE-GATES` are listed under `info` only (not failures; KG-P4-2, KG-P4-3). Output sorted keys `<citing file><TAB><target>[§<anchor>]` (no line numbers). Write `$T/p4-tools/pointers-before.txt`.
- [ ] 0.4 Leftovers capture: `LC_ALL=C grep -rniE "superseded|compatibility note|legacy" process/development-protocols CLAUDE.md AGENTS.md | sed -E 's/:[0-9]+:/:/' | LC_ALL=C sort > $T/p4-tools/leftovers-before.txt` (50 lines today).
- [ ] 0.5 `wc -c < AGENTS.md > $T/p4-tools/agents-bytes-before.txt` (37885). `bash $T/baseline/compare.sh` exit 0 (green today, re-checked 2026-10-30). Run both Exit Gate blocks through `bash -n` (must be clean).
- [ ] 0.6 Red-first check: run the Exit Gate "expected after" assertions now; record in the report that these are RED before the edit: `wc -c AGENTS.md` > 32768; pointers-before contains the 4 target keys; leftovers contain the 3 target lines; `grep -c validate-model-effort-policy process/development-protocols/orchestration.md` = 0.

### Anchor matrix (10 core rules; baseline counts at b17294d, case-insensitive, file-wide)

| # | Rule | Anchor string | CLAUDE.md | AGENTS.md | protocols |
|---|---|---|---|---|---|
| 1 | Bootstrap Guard | `bootstrap guard` | 1 | 1 | 0 |
| 2 | mandatory find gate | `find process/context/ -type f` | 1 | 0 | 5 |
| 3 | QUICK FIX scope guard | `QUICK_FIX_ABORT` | 2 | 0 | 4 |
| 4 | /goal block | `/goal block` | 5 | 0 | 31 |
| 5 | PVL/EVL gate | `Gate: PASS` | 2 | 0 | 8 |
| 6 | no inline execution | `no inline execution` | 1 | 0 | 3 |
| 7 | commit branch policy | `commit branch policy` | 1 | 0 | 0 |
| 8 | strategy-compare at transitions | `vc-agent-strategy-compare` | 4 | 4 | 40 |
| 9 | model selection policy | `Model Selection Policy` | 2 | 0 | 2 |
| 10 | communication standards | `communication-standards.md` | 1 | 2 | 3 |

Rule: CLAUDE.md row values identical after; protocols identical after; AGENTS.md not lower (none of the 10 anchors sits in trimmed text; simulated after-values equal). Not in scope: adding the 7 rules AGENTS.md lacks (would change Codex behaviour; Known Gap KG-P4-1).

Allowed AGENTS.md signal-census drops (case-sensitive, verified at b17294d; all inside deleted Quick Start): `ENTER EXECUTE MODE` 4 to 2 (lines 659, 666 go; 366, 568 stay), `ENTER FAST MODE` 2 to 1 (line 664 goes; 373 stays), `[MODE: ORCHESTRATOR]` 1 to 0 (line 649; `[MODE: MODE_NAME]` stays). `ENTER UPDATE PROCESS MODE` stays 1 to 1 (line 660 goes, the E16 Invoke line adds it back). No other AGENTS.md signal or anchor row may drop. Skill/agent name rows are checked only for >= 1 after (16 drop by design, none to 0). `process/context/all-context.md` (12 to 11 via E9) is not a census token; it is guarded by the separate Exit Gate `grep -c` row (>= 1 in both CLAUDE.md and AGENTS.md).

### Step A - Protocol fixes (orchestration.md, all-development-protocols.md)

- [ ] A1 `orchestration.md` line 320. Old: ``Full specification: `process/development-protocols/autopilot.md` §ENTER EXECUTE MODE Consent.`` New: ``Full specification: `process/development-protocols/autopilot.md` §Autonomous Run Rules (the ENTER EXECUTE MODE gate row) and `process/development-protocols/autopilot.md` §Provisional Goal Block Format (the `EXECUTE CONSENT:` field).`` (each anchor carries its file, so no bare `§` binds to orchestration.md; both headings verified: autopilot.md:215 and :121; the gate row is autopilot.md:227, the field rules :134/:150.)
- [ ] A2 `orchestration.md` §Current Execution State Format (lines 197-205: from "The umbrella plan's `## Current Execution State` (or equivalent status section) must always include:" through the "For orchestrator routing decisions: ..." paragraph). Keep the heading line 195 unchanged. Replace the block with exactly these two paragraphs:
  - "The umbrella plan's `## Current Execution State` uses the canonical 8-field format defined in behavior-reference Section 6 (Last updated / Current phase N of total / Phase N name / Phase N status / Phase N EVL / Phase N report / Next phase). The `update-process-agent` writes it. An older 2-field form (current loop step + validate-contract status) may still appear in umbrella plans written before Section 6; read it, never write it."
  - "For orchestrator routing decisions: use the Phase Loop Progress checkboxes in the phase plan file (see Phase Program Pre-Routing Check below), NOT the umbrella `## Current Execution State` loop-step field. When the umbrella state is missing or stale, infer the position from those checkboxes."
  - Kept unchanged on purpose: line 158 `**Compatibility note:**` (the 10-step view it explains is still printed just above it) and line 248 `**Legacy 5-step plan mapping:**` (5-step legacy plans still exist and are read on resume).
- [ ] A3 `orchestration.md` §Regression Gate Validators: in the first code block, insert after the `validate-agent-frontmatter.mjs` line (line 869) the line `node .claude/skills/vc-audit-vc/scripts/validate-model-effort-policy.mjs`. After that code block's closing fence, insert one sentence: "CI (`.github/workflows/validate.yml`) runs the full set of 38 validator scripts; the list above is the minimum local suite." (Verified: 38 unique `validate-*.mjs` in validate.yml = 38 on disk.)
- [ ] A4 `all-development-protocols.md` line 21: replace the sentence "The legacy 186KB monolith is archived at `archive/vc-system-behavior-reference_ARCHIVED_09-06-26.md` (read-only history)." with "The former single-file monolith was removed; this split replaces it." Lines 37-38: replace "The legacy single-file monolith is archived (read-only) at" + the next line "`archive/vc-system-behavior-reference_ARCHIVED_09-06-26.md`." with the single phrase "The former single-file monolith was removed." (keep line 36-37 text before it). Frontmatter and `read_order` untouched.

### Step B - AGENTS.md trim (line ranges at b17294d; apply bottom-up so ranges stay valid)

Simulated on a scratch copy at b17294d: T1+T2+T3+T4 together = 31,932 bytes, plus B1 = 31,920, plus the E16 Invoke line = 31,983 final (verified by inner PVL). All tiers are mandatory (T1-T3 alone = 32,306: under the hard limit with 462 bytes margin, but over the 32,000 target).

| Edit | Lines | Old text (summary) | Disposition | Bytes before / after | Why safe |
|---|---|---|---|---|---|
| T1-E1 | 635-644 | `## Success Metrics` (token efficiency, phase safety, cross-agent claims) | delete | 372 / 0 | descriptive, no rule |
| T1-E2 | 645-667 | `## Quick Start` (first time, typical flow, FAST MODE steps) | delete | 924 / 0 | duplicates Phase Transition Rules (ENTER EXECUTE MODE) and Available Agents (ENTER FAST MODE, "CRITICAL: Pauses before EXECUTE"); its "run vc-generate-context if all-context.md missing" contradicts the Bootstrap guard (vc-setup) |
| T1-E3 | 668-682 | `## Troubleshooting` | delete | 754 / 0 | every fact repeated at lines 13-16, 330-336 (agent locations, no wrappers, Codex TOML may not enforce `tools:`) |
| T1-E4 | 692-704 | `## Porting Notes` (4 bullets + "authoritative source: CLAUDE.md") | replace with N1 | 420 / 293 | same 4 surfaces + CLAUDE.md pointer kept |
| T2-E5 | 82-90 | Repository Context "Contains:" 6-bullet list | delete | 251 / 0 | describes all-context.md; the pointer stays |
| T2-E6 | 158-171 | `### Engineering Standards` generic 5-bullet list + skills note | replace with N2 | 453 / 223 | points to implementation-standards.md; skills note kept |
| T2-E7 | 232-255 | `#### Feature Folder Lifecycle` table, promotion protocol, list maintenance | replace with N3 | 1,328 / 262 | same content lives in `plan-lifecycle.md` §Feature Folder Lifecycle (verified line 88, promotion :101, list drift :109); no heading in AGENTS.md is cited anywhere (verified) |
| T2-E8 | 273-315 | Workflow Ownership one-name-per-line lists + 2 notes | replace with N4 | 1,454 / 1,128 | every name kept (inline lists) |
| T2-E9 | 524 | duplicate "`process/context/all-context.md` - always pass for architecture/stack awareness" | delete | 82 / 0 | line 523 says the same |
| T3-E10 | 139-149 | Large program rule 6 bullets | replace with N5 | 696 / 453 | same steps, one paragraph |
| T3-E11 | 256-262 | Legacy sibling dirs paragraph | replace with N6 | 288 / 210 | same rule; lines 263-265 (pass context files) kept |
| T3-E12 | 599-603 | drift-signal scoring LOW/MEDIUM/HIGH | replace with N7 | 521 / 154 | same table in `vc-generate-closeout` SKILL.md (verified: "drift signal scoring") |
| T3-E13 | 104-112, 394-399 | Markdown links `[.claude/agents/x.md](.claude/agents/x.md)` | rewrite each as `` `.claude/agents/x.md` `` (text after the link unchanged) | 1,917 / 1,380 | same path, once |
| T3-E15 | 683-691 | `## Resources` 6 bullets | replace with N8 | 561 / 339 | same 5 pointers; stale `{completed,backlog,reports,references}` dropped |
| T4-E14 | 579-589 | closeout packet nested field list | replace with N9 | 690 / 588 | every field and the commit-checkpoint rule kept; schema pointer added |
| T4-E16 | 343, 350, 364, 371, 380 | "- Claude tools: ..." lines of research, innovate, execute, fast-mode, update-process | delete 343, 350, 364, 371; REPLACE 380 (find by content: the `- Claude tools: Read, Write, Edit, Grep, Glob, Bash, update_memory` line inside the `vc-update-process-agent` block) with `- Invoke: After EXECUTE, user says "ENTER UPDATE PROCESS MODE"` (+63 bytes net vs delete; keeps the only verbatim UPDATE PROCESS command) | 272 / 63 | Claude enforces them in agent front-matter; Codex cannot (line 336); Purpose lines keep "read-only" / "discussion-only". KEPT: line 357 (vc-plan-agent write restriction = phase-lock text) |
| B1 | 385 | `` `process/context/all-context.md` §Testing-and-Quality `` | replace anchor with `§Testing` | -12 | heading is `## Testing` (all-context.md:203) |

KEPT whole (safety / Codex-only / signal text): Bootstrap guard (line 3), porting header and `.agents/skills` notes (1-22), Orchestrator Role, Core Protocol key requirements incl. `[MODE: MODE_NAME]`, Mode Agents (Codex Compatibility), Available Agents (minus 5 tools lines), Specialist Agents text, Discovery Note, the whole Skill Registry (lines 432-466), Detect Intent, Phase Transition Rules (minus E12/E14 compression), Key Principles (Phase Locking, Safety, Efficiency).

Exact new texts (each Nx is the full replacement; blank line after each block as in the file):

- N1: `## Porting Notes` + blank + "This file adapts the original [CLAUDE.md](CLAUDE.md) workflow (the authoritative historical source) to Codex: `AGENTS.md` for top-level instructions, `.agents/skills/` for workflows, `.codex/agents/` for subagent role mirrors, `.codex/config.toml` for project configuration." (last line of the file, followed by one newline)
- N2: `### Engineering Standards` + blank + "Coding and quality standards: `process/development-protocols/implementation-standards.md`. For niche needs, check `.agents/skills/` for an existing capability before expanding the base protocol."
- N3: "Feature folder decisions (use an existing folder, create one upfront, promote general work into a feature folder, keep the features list in `process/context/all-context.md` current): `process/development-protocols/plan-lifecycle.md` §Feature Folder Lifecycle."
- N4: "The active system is intentionally split into four layers:" + blank + three bullets: "- **Actor agents** own the actual phase or specialist role: `vc-research-agent`, `vc-innovate-agent`, `vc-plan-agent`, `vc-execute-agent`, `vc-update-process-agent`, `vc-debugger`, `vc-tester`, `vc-code-reviewer`, `vc-code-simplifier`, `vc-ui-ux-designer`, `vc-git-manager`." / "- **Contract skills** define repo workflow artifacts and durable process contracts: `vc-generate-plan`, `vc-generate-context`, `vc-audit-context`, `vc-audit-plans`, `vc-audit-vc`, `vc-update`, `vc-publish`." / "- **Helper skills** improve how agents work but do not own the workflow: `vc-scout`, `vc-sequential-thinking`, `vc-problem-solving`, `vc-docs-seeker`, `vc-agent-browser`, `vc-web-testing`, `vc-frontend-design`, `vc-predict`, `vc-scenario`, `vc-security`, `vc-autoresearch`, `vc-debug`, `vc-agent-strategy-compare`, `vc-intent-clarify`, `vc-autopilot`." + blank + "`vc:debug` remains a valid helper skill (not a default workflow owner) alongside the `vc-debugger` agent. Former owner skills (`vc:plan`, `vc:research`, `vc:cook`, `vc:fix`, `vc:code-review`) are migration sources only, not routes."
- N5: "Large program rule: a substantial multi-phase effort is not one PLAN -> EXECUTE pass. Use `process/development-protocols/phase-programs.md` (and its kickoff prompt template): first recommend the plan shape, sequencing and next actions; only after approval create an umbrella plan plus explicit phase plans; advance one phase at a time (research subagent -> execution approval -> execute subagent -> validate subagent -> durable report/context update)."
- N6: `### Legacy sibling dirs` + blank + "`process/general-plans/{reports,references}/` and `process/features/{feature}/{reports,references}/` are deprecated: drain them into task folders when safe and remove them once empty."
- N7 (one bullet, same indent as its neighbours): "- Drift-signal scoring for UPDATE PROCESS urgency (LOW / MEDIUM / HIGH wording): `vc-generate-closeout` (`.claude/skills/vc-generate-closeout/SKILL.md`)."
- N8: `## Resources` + blank + "Agents: `.claude/agents/*.md` (Codex mirrors: `.codex/agents/*.toml`). Skills: `.claude/skills/*/SKILL.md` (Codex: `.agents/skills/`). Plans: task folders under `process/general-plans/active/` and `process/features/*/active/`. Features: `process/features/`. Context: `process/context/all-context.md` router plus its groups."
- N9 (one bullet): "- After vc-execute-agent reports DONE, present a short closeout packet: selected plan path, closeout classification, what was finished, what was verified versus still unverified, what cleanup/context capture remains, uncommitted file count and git-manager offer (when the worktree is dirty), a commit-checkpoint recommendation (invoke `vc-git-manager` before UPDATE PROCESS for validated code/test changes; defer it until after UPDATE PROCESS when the rest is mainly `process/`, `.claude/`, `.codex/` or `AGENTS.md`), and the single best next valid state. Schema: `vc-generate-closeout`."

- [ ] B2 Apply the table strictly bottom-up by line (E4, E15, E3, E2, E1, E12, E14, E9, B1, E13b, E16, E8, E11, E7, E6, E10, E13a, E5). After each tier run `wc -c AGENTS.md`; record T1/T2/T3/T4 sizes in the report (simulated: 35,708 / 33,753 / 32,306 / 31,932 before B1; B1 -12; E16 Invoke line +63; final 31,983 expected; hard limit 32,768, target 32,000). If the final size is above 32,000 (real file differs from simulation): STOP before committing and return `DONE_WITH_CONCERNS` with the measured size (hard limit 32,768 still decides PASS; do not invent new cuts).
- [ ] B3 Leftovers allowlist: after the edits, write `$T/p4-tools/leftovers-after.txt` (same command as 0.4). Then `$T/dedup-allowlist.txt` = a copy of leftovers-after.txt, and `$T/dedup-allowlist.why.txt` = one line per allowlist entry `<entry><TAB><justification>`: status-vocabulary use of SUPERSEDED (`orchestration.md` registry reminder, `11-phase-programs.md` two lines), priority prose (`02-skill-tiers.md` "superseded by higher-priority"), closeout prose (`09-execute.md` "preliminary packet ... superseded by the authoritative U-S5 closeout"), the kept `Compatibility note` and `Legacy 5-step plan mapping`, legacy-shape support statements (read-only legacy plan shapes, legacy sibling dirs, legacy commands), and CLAUDE.md lines (frozen). Expected removed keys (present before, absent after): `orchestration.md` "Superseded by Section 6 ..." line; `all-development-protocols.md` lines 21 and 37 (archive monolith); AGENTS.md lines lost or reworded by E7 (promotion step 2 "legacy"), E11 (line 260 "deprecated legacy surfaces"). No new key may appear.

### Step C - Commit (rollback unit)

- [ ] C1 `vc-execute-agent` runs the Exit Gate itself first (self-check), then makes ONE commit on `main` with exactly the 3 shipped files: `git add AGENTS.md process/development-protocols/orchestration.md process/development-protocols/all-development-protocols.md && git commit -m "fix: tidy shared docs (pointers, leftovers, AGENTS.md under Codex 32 KiB)"` (+ the Co-Authored-By trailer). Record its sha in `$T/p4-tools/p4_fix_sha.txt`. Task-folder files (`p4-tools/**`, allowlists) are NOT in this commit; UPDATE PROCESS commits them with the report (`process:` commit). Rollback = `git revert <p4_fix_sha>` (touches only the 3 files).
- [ ] C2 Claim gate: `git diff --name-only $(cat $T/p4-tools/p4_start.txt)..HEAD | LC_ALL=C sort > $T/p4-tools/changed.txt`; it must equal (file-to-file `diff`) the 3-line sorted list in `$T/p4-tools/claim.txt` (`AGENTS.md`, `process/development-protocols/all-development-protocols.md`, `process/development-protocols/orchestration.md`).

### Step D - EVL by a spawned vc-tester

- [ ] D1 The orchestrator spawns `vc-tester` (opus) to re-run every Exit Gate command independently. The orchestrator runs no gate itself.

---

## Exit Gate

Phase 1 model text preserved (7 opus / 8 sonnet; nothing may restore "only EXECUTE uses opus" in any form). Commands copied from the Phase 1 Exit Gate (R1.11/R1.12):

```bash
R='EXECUTE = opus; every other phase|only (the )?(EXECUTE|coding|code-writing)|every other phase = sonnet|all other vc-agents sonnet|EXECUTE only|only (the )?\*coding\* agent|opus ONLY|\(sonnet\)|expensive model only writes|premium AI model only'
grep -rnIE "$R" CLAUDE.md AGENTS.md process/development-protocols/orchestration.md process/development-protocols/implementation-standards.md process/development-protocols/*system-behavior/0[478]-*.md .claude/skills/v[cb]-agent-strategy-compare/SKILL.md process/context/all-context.md README.md   # Expected: no output (verified empty at b17294d)
for f in README.md docs/i18n/README.*.md; do for a in research plan validate; do grep -E "^\| [^|\`]*\`v[cb]-${a}-agent\` \|" $f | grep -qE "^\| [^|]*\| \*{0,2}opus\*{0,2} \|" || echo "RED $f $a"; done; done   # Expected: no output (verified empty at b17294d)
```

Phase 4 gates (repo root, Linux `node`, after the fix commit):

```bash
T=process/general-plans/active/vibebelt-rebrand_29-10-26
git diff b17294d -- CLAUDE.md | wc -c                                       # Expected: 0 (CLAUDE.md byte-identical)
test "$(wc -c < AGENTS.md)" -le 32768 && echo OK                            # Expected: OK (hard limit = Codex project_doc_max_bytes)
wc -c < AGENTS.md                                                           # Expected: <= 32000 (target; expected 31983)
node .claude/skills/vc-audit-context/scripts/generate-skills-catalog.mjs --check   # Expected: exit 0 (catalog fresh; routedFrom unchanged)
bash $T/baseline/compare.sh                                                 # Expected: exit 0 (no validator worse than validators_after_setup.tsv)
for v in vc-audit-vc/scripts/validate-protocol-wiring vc-audit-context/scripts/validate-protocol-discovery vc-audit-context/scripts/validate-context-discovery vc-audit-vc/scripts/validate-kit-portability vc-audit-context/scripts/validate-skill-routing vc-audit-vc/scripts/validate-skill-invocation-wiring vc-audit-context/scripts/validate-skill-keywords vc-audit-vc/scripts/validate-guide-sync vc-audit-vc/scripts/validate-agent-parity vc-audit-vc/scripts/validate-model-effort-policy; do node .claude/skills/$v.mjs > /dev/null 2>&1; echo "$? $v"; done > $T/p4-tools/validators-after.txt   # Expected: exit codes judged by compare.sh (deciding gate; not 'equal to the reference row': context-discovery may now be better, 1->0; model-effort-policy has no reference row)
grep -c "process/context/all-context.md" CLAUDE.md AGENTS.md               # Expected: both >= 1 (context-discovery assertion)
node $T/p4-tools/census.mjs --out $T/p4-tools/census-after.txt
grep -P '^CLAUDE\.md\t' $T/p4-tools/census-before.txt > $T/p4-tools/c-before.txt; grep -P '^CLAUDE\.md\t' $T/p4-tools/census-after.txt > $T/p4-tools/c-after.txt; diff $T/p4-tools/c-before.txt $T/p4-tools/c-after.txt   # Expected: empty
grep -P '^process/' $T/p4-tools/census-before.txt > $T/p4-tools/p-before.txt; grep -P '^process/' $T/p4-tools/census-after.txt > $T/p4-tools/p-after.txt; diff $T/p4-tools/p-before.txt $T/p4-tools/p-after.txt   # Expected: exactly one changed row, `process/development-protocols/orchestration.md<TAB>skill:v?-audit-vc` +1 (from A3); nothing else
node $T/p4-tools/census.mjs --compare-agents $T/p4-tools/census-before.txt $T/p4-tools/census-after.txt   # Expected: exit 0; AGENTS.md signal/anchor rows after >= before except the 3 allowed drops (Anchor matrix section); skill/agent name rows only >= 1
node $T/p4-tools/pointer-check.mjs --out $T/p4-tools/pointers-after.txt
LC_ALL=C comm -13 $T/p4-tools/pointers-before.txt $T/p4-tools/pointers-after.txt   # Expected: empty (no NEW broken pointer)
LC_ALL=C comm -23 $T/p4-tools/pointers-before.txt $T/p4-tools/pointers-after.txt   # Expected: the 4 fixed occurrences = 3 distinct keys (orchestration.md -> autopilot.md§ENTER EXECUTE MODE Consent; AGENTS.md -> all-context.md§Testing-and-Quality; all-development-protocols.md -> archive/vc-system-behavior-reference_ARCHIVED_09-06-26.md, which appears twice as an occurrence)
grep -c "validate-model-effort-policy" process/development-protocols/orchestration.md   # Expected: 1
grep -c "ARCHIVED_09-06-26" process/development-protocols/all-development-protocols.md   # Expected: 0
grep -c "ARCHIVED_09-06-26" MIGRATION.md vc-manifest.json                   # Expected: 2 and 1 (untouched on purpose)
grep -c "^### Current Execution State Format$" process/development-protocols/orchestration.md   # Expected: 1 (heading cited by CLAUDE.md:113 kept)
LC_ALL=C grep -rniE "superseded|compatibility note|legacy" process/development-protocols CLAUDE.md AGENTS.md | sed -E 's/:[0-9]+:/:/' | LC_ALL=C sort > $T/p4-tools/leftovers-now.txt
LC_ALL=C comm -13 $T/p4-tools/leftovers-before.txt $T/p4-tools/leftovers-now.txt   # Expected: empty (no new leftover)
grep -ciE "superseded by section 6" process/development-protocols/orchestration.md   # Expected: 0
LC_ALL=C sort $T/dedup-allowlist.txt > $T/p4-tools/allow-sorted.txt; diff $T/p4-tools/leftovers-now.txt $T/p4-tools/allow-sorted.txt   # Expected: empty
cut -f1 $T/dedup-allowlist.why.txt | LC_ALL=C sort > $T/p4-tools/why-keys.txt; diff $T/p4-tools/why-keys.txt $T/p4-tools/allow-sorted.txt   # Expected: empty (every kept hit justified)
test "$(find process/development-protocols -type f | wc -l)" = 22 && git diff --name-status $(cat $T/p4-tools/p4_start.txt)..HEAD -- process/development-protocols | grep -v '^M' | wc -l   # Expected: 0 (22 files, only modifications)
cmp process/development-protocols/references/program-goal-charter-template.md .claude/skills/vc-generate-phase-program/references/program-goal-charter-template.md   # Expected: exit 0
git diff --name-only $(cat $T/p4-tools/p4_start.txt)..HEAD -- . ':!process/general-plans/active/vibebelt-rebrand_29-10-26' | LC_ALL=C sort > $T/p4-tools/changed.txt; diff $T/p4-tools/changed.txt $T/p4-tools/claim.txt   # Expected: empty
test "$(grep -c '@process' AGENTS.md)" = 0 && echo OK                       # Expected: OK
S=$(cat $T/p4-tools/p4_fix_sha.txt); git diff --check $S~1 $S             # Expected: no output (fix commit sha, not HEAD~1)
```

---

## Blockers That Would Justify BLOCKED Status

- Entry Gate diff not empty (line ranges stale): return `NEEDS_CONTEXT`.
- Any edit would need a heading rename/removal, a new protocol file, or a CLAUDE.md change: STOP, out of scope.
- `generate-skills-catalog.mjs --check` red after the trim (a skill name lost from AGENTS.md): revert the offending edit, never regenerate the catalog in Phase 4.

---

## Phase Completion Rules

- CODE DONE = checklist done and the fix commit exists; VERIFIED = an independent vc-tester re-ran every Exit Gate command green, `compare.sh` exit 0, validate-contract exists.
- Known-Gap alone never makes a behaviour PASS; KG-P4-1..5 are residuals with backlog/UPDATE PROCESS routing, not proofs.

## Acceptance Criteria

- AC1 Codex sees the whole AGENTS.md: `wc -c` <= 32,768 (target <= 32,000). proven by: Exit Gate `wc -c` rows; strategy: Fully-Automated.
- AC2 Nothing normative lost: CLAUDE.md byte-identical; census/anchors identical for CLAUDE.md and protocols; AGENTS.md not lower except the 5 listed drops; Skill Registry whole and catalog fresh. proven by: `git diff b17294d -- CLAUDE.md`, census diffs, `--compare-agents`, catalog `--check`; strategy: Fully-Automated.
- AC3 Broken pointers lower by exactly the fixed ones, none new. proven by: pointer-check `comm -13` / `comm -23`; strategy: Fully-Automated.
- AC4 No unjustified leftover, none new. proven by: leftover `comm -13`, allowlist and sidecar diffs; strategy: Fully-Automated.
- AC5 Registry docs list the 38th validator. proven by: `grep -c validate-model-effort-policy orchestration.md` = 1; strategy: Fully-Automated.
- AC6 Validators not worse; protocol file set unchanged; mirror pair identical; Phase 1 model text preserved. proven by: `compare.sh`, the 22-file check, `cmp`, Phase 1 grep block; strategy: Fully-Automated.
- AC7 One revertable unit inside the claim. proven by: claim diff vs `claim.txt`; strategy: Fully-Automated.

## Touchpoints

- Edited: `AGENTS.md`, `process/development-protocols/orchestration.md`, `process/development-protocols/all-development-protocols.md`.
- Read: `CLAUDE.md`, `process/development-protocols/autopilot.md`, `process/development-protocols/plan-lifecycle.md`, `process/development-protocols/vc-system-behavior/11-phase-programs.md`, `process/context/all-context.md`, `.claude/skills/vc-generate-closeout/SKILL.md`, `.github/workflows/validate.yml`, `$T/baseline/*`.
- New (task folder only): `$T/p4-tools/{census.mjs,pointer-check.mjs,*.txt}`, `$T/dedup-allowlist.txt`, `$T/dedup-allowlist.why.txt`.

---

## Public Contracts

- Every signal string, mode marker, status code, `ENTER ... MODE` command and Bootstrap guard text stays verbatim where it remains.
- No protocol heading or file changes name; every heading cited from outside (CLAUDE.md §Current Execution State Format, §Model Selection Policy, implementation-standards §Agent Frontmatter Conventions, autopilot.md headings) is unchanged.
- Catalog `routedFrom` unchanged (no skill name leaves AGENTS.md).
- AGENTS.md byte budget becomes a standing program contract: <= 32,768 bytes (Phase 6 rename is length-neutral; Phase 7 must keep it).

---

## Verification Evidence

| Gate / Scenario | Strategy | Proves SPEC criterion |
|---|---|---|
| `wc -c AGENTS.md` <= 32768 (and <= 32000 target) | Fully-Automated | C-P4 (AC1); C-EQ (Codex sees Safety/Phase Locking again) |
| `git diff b17294d -- CLAUDE.md` empty; census CLAUDE.md and protocols identical; AGENTS.md `--compare-agents` | Fully-Automated | C-P4 (AC2); C-EQ |
| catalog `--check` exit 0 (Skill Registry whole) | Fully-Automated | C-P4 (AC2) |
| pointer-check before/after `comm` (4 fixed, 0 new) | Fully-Automated | C-P4 (AC3) |
| leftovers `comm -13` empty + allowlist and sidecar diffs | Fully-Automated | C-P4 (AC4) |
| `grep -c validate-model-effort-policy orchestration.md` = 1 | Fully-Automated | C-P4 (AC5); closes K1-1 |
| `bash baseline/compare.sh` exit 0 + the 10 named validators | Fully-Automated | C-P4 (AC6) |
| 22-file / modifications-only check; mirror `cmp`; Phase 1 grep block empty | Fully-Automated | C-P4 (AC6) |
| claim diff vs `claim.txt`; single `fix:` commit | Fully-Automated | C-P4 (AC7) |

No Agent-Probe and no Known-Gap row proves a developed behaviour; KG-P4-3 (Codex runtime) is a named residual.

### Known Gaps (named residuals)

- KG-P4-1 AGENTS.md lacks 7 of the 10 core rules (find gate, QUICK FIX guard, /goal block, PVL/EVL gate, no-inline-execution, commit branch policy, model policy). Unchanged from the old kit (equal, not worse). Backlog suggestion for UPDATE PROCESS: Codex parity of core rules.
- KG-P4-2 `See 12-reference.md PHASE-GATES`: 9 citations in 8 `vc-system-behavior/` files, target defined nowhere. Needs a new section or per-line judgment: backlog note at UPDATE PROCESS.
- KG-P4-3 No gate runs Codex itself; the 32 KiB limit is a research finding (Codex default `project_doc_max_bytes`), not re-verified against Codex source here. `Section N` citations (about 95, unmappable by pointer-check) are not checked.
- KG-P4-4 CLAUDE.md:331 / AGENTS.md:385 "14 VC-system behavior validators ... registered in all-context.md": all-context.md has no such registry (it says 38 validators). CLAUDE.md is frozen in Phase 4; UPDATE PROCESS decides.
- KG-P4-5 Line-range edits assume the file is unchanged since b17294d (Entry Gate enforces it).

---

## Phase Loop Progress

Orchestrator reads this before deciding which subagent to spawn next. The canonical 7-step inner loop
`R → I → P → PVL → E → EVL → UP` SKIPS SPEC (the umbrella plan and the user brief act as the SPEC).

- [x] 1. RESEARCH — vc-research-agent (opus, front-matter): measured at HEAD b17294d (overlap, rule locations, Skill Registry impact, Codex 32 KiB, broken anchors)
- [x] 2. INNOVATE — scope decision by the orchestrator under user delegation (2026-10-30): safe tidy, no content dedup
- [x] 3. PLAN-SUPPLEMENT — vc-plan-agent (opus): plan re-scoped; Inner Loop Refresh Note written (2026-10-30)
- [x] 4. PVL — vc-validate-agent (opus, front-matter): full V1-V7 from V1 (the Refresh Note is newer than the 2026-10-29 contract); new validate-contract replaces the old one -- DONE: Gate: PASS (inner-pvl: phase-4) on pass 2 (pass 1 CONDITIONAL M4-1..3)
- [x] 5. EXECUTE — vc-execute-agent (opus): Steps 0-C, one `fix:` commit -- DONE: fix commit 5b143f4 (first agent stopped by user by mistake; second agent audited disk, all edits complete, changed nothing)
- [x] 6. EVL — vc-tester (opus): every Exit Gate command re-run independently; EVL HANDOFF SUMMARY written -- DONE: independent vc-tester PASS, all Exit Gate rows, positive controls caught, closeout CLEAN
- [x] 7. UPDATE PROCESS — vc-update-process-agent (sonnet): phase report, umbrella state, `process:` commit with task-folder files, close backlog NOTE K1-1, write KG-P4-1/2/4 backlog notes -- DONE: report phase-04-doc-dedup_REPORT_30-10-26.md, umbrella state, results.tsv row 11, verification.json, registry; process commit pending (git-manager)

**Validate-contract required.** The contract below is the OUTER contract for the old dedup scope (generated 2026-10-29); it does NOT cover this plan. EXECUTE is not legal until PVL writes a new contract.

---

## Test Infra Improvement Notes

- `pointer-check.mjs` and `census.mjs` are throw-away task-folder tools (C-CLEAN). If a durable anchor checker is wanted, it belongs in `vc-audit-vc` as a new validator in a later program (would also catch KG-P4-2).
- A standing `wc -c AGENTS.md <= 32768` check would protect the Codex budget; candidate for `validate-kit-portability` (not in Phase 4's claim).

---

## Resume and Execution Handoff

- Selected plan file path: `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-04-doc-dedup_PLAN_29-10-26.md`
- Last completed step: inner PVL cycle 1 = Gate: CONDITIONAL (2026-10-30); PVL-supplement applied, M4-1..M4-3 addressed (see `## Supplement (PVL, M4-1..M4-3)`)
- Validate-contract status: written (inner-pvl: phase-4, 2026-10-30, CONDITIONAL first pass); re-validate from V1 required before EXECUTE.
- Supporting context files: umbrella plan (C-EQ, C-CLEAN, Locked Decisions), `phase-blast-radius-registry.md`, Phase 1 report + `process/general-plans/backlog/validator-registry-docs-lag_NOTE_29-10-26.md` (K1-1), `process/context/tests/all-tests.md`, `$T/baseline/compare.sh`.
- Next step: re-spawn vc-validate-agent (opus) from V1 for inner PVL cycle 2 of this plan, after the Phase 3 exit gate is green. Execute-agent: never regenerate the skills catalog in Phase 4 (a red `--check` means revert the offending edit).

---

## Inner Loop Refresh Note: 2026-10-30 — Phase 4 re-scoped (user-delegated scope decision: safe tidy, no content dedup)

Date: 2026-10-30. Sections changed: title/description, Purpose, new Scope Decision, Entry Gate, Strategy (team to sequential), Blast Radius (3 shipped files; CLAUDE.md frozen), whole Implementation Checklist (Steps 0/A/B/C/D replaced), Exit Gate, Acceptance Criteria, Touchpoints, Public Contracts, Verification Evidence, Known Gaps, Phase Loop Progress, Resume and Execution Handoff. Removed: cold-read probe and its cost gate, overlap-check, Skill Registry replacement, worktrees/branches/join/SendMessage/revert rehearsal. The Validate Contract below is kept verbatim as history; it does not validate this scope (re-run PVL from V1).

## Validate Contract

Status: PASS
Date: 30-10-26
date: 2026-10-30
generated-by: inner-pvl: phase-4
supersedes: 2026-10-30 (inner-pvl: phase-4, PVL cycle 1, Gate: CONDITIONAL with M4-1, M4-2, M4-3), the `## Inner Loop Refresh Note: 2026-10-30` (re-scope to safe tidy) and the `## Supplement (PVL, M4-1..M4-3)` (PVL-supplement after cycle 1) — inner PVL cycle 2 re-ran from V1 with current evidence; this contract REPLACES the cycle-1 contract entirely (the cycle-1 outer contract of 2026-10-29 was already superseded by it). The Supplement sections below stay as history only.

V1 line: `V1 RE-VALIDATE TRIGGERED: Inner Loop Refresh Note dated 2026-10-30 and the PVL supplement (M4-1..M4-3) are newer than the cycle-1 contract.` (V1 AUTO-PROCEED does not apply: the prior contract was a first-pass CONDITIONAL.)

TL;DR: The supplemented plan works as written. Re-simulated edit by edit, with the plan's exact texts and order, on a throw-away clone of b17294d (Linux node v22.23.4, deleted afterwards): AGENTS.md ends at 31,983 bytes, CLAUDE.md is byte-identical, and every Exit Gate row prints its expected value. M4-1, M4-2 and M4-3 are closed, and one mutation per fixed gate turns that gate red. 0 MUST-FIX, 8 RESIDUAL (plan-text wording and EVL reading instructions, no gate blocked), KG-P4-1..5 carried. Gate PASS. EXECUTE is legal once the Phase 3 exit gate is green.

Parallel strategy: sequential
Rationale: score 1/7 (S4 phase program only). 3 shipped files, no high-risk class, nothing to coordinate. EXECUTE = 1 `vc-execute-agent` (opus, front-matter) for Steps 0-C, then 1 independent `vc-tester` (opus, front-matter, no override) for the EVL (Step D). Agent count 2; cost guard not triggered; billed model calls 0. Alternatives: parallel subagents / workflow / agent team all rejected (one writer, 3 files, strict edit order; no team machinery in this environment, decision G). This validate pass was ONE fire-and-forget vc-validate-agent (opus): Layer 1 (4 dimensions) and Layer 2 (Step 0, Step A, Step B, Step C/D, Exit Gate) ran inline with mechanical simulation. Prior verdicts were not trusted.

### Real-repo facts (V1-V3, 2026-10-30, HEAD b17294d + uncommitted plan edits)

- Structure: `validate-plan-artifact.mjs` exit 0, 0 failures (2 advisory legacy-shape warnings). Entry Gate holds: `git diff b17294d -- AGENTS.md CLAUDE.md process/development-protocols/` = 0 bytes. `results.tsv` = 10 lines.
- Before-captures (tools written from spec 0.2 / 0.3, run on the clone AND read-only on the real drvfs checkout with outputs outside the project): census, pointer list (180 broken keys incl. the 4 target occurrences) and leftovers (50) are byte-identical between clone and real checkout. Real checkout: catalog `--check` exit 0, `compare.sh` exit 0. The tools wrote nothing into the project.
- Anchor matrix: AGENTS.md before = `bootstrap guard` 1, `vc-agent-strategy-compare` 4, `communication-standards.md` 2, the other 7 = 0 (matches the table). Case-sensitive AGENTS.md signals before: `ENTER EXECUTE MODE` 4, `ENTER FAST MODE` 2, `[MODE: ORCHESTRATOR]` 1, `ENTER UPDATE PROCESS MODE` 1 (matches the Allowed-drops paragraph).
- Byte table: every "bytes before" value matches the file exactly (E13 = 881 + 1,036 = 1,917). Per-edit sizes in the B2 order: E4 37,758; E15 37,536; E3 36,782; E2 35,858; E1 35,486; E12 35,119; E14 35,017; E9 34,935; B1 34,923; E13b 34,718 (6 links); E16 34,509; E8 34,183; E11 34,105; E7 33,039; E6 32,809; E10 32,566; E13a 32,234 (9 links); E5 31,983. Final 31,983 (limit 32,768, target 32,000): no STOP. Tier totals reproduce (T1 35,708).
- A1-A4 apply exactly at the quoted lines (orchestration.md 197-205, 320, 869/871; all-development-protocols.md 21, 37-38).

### Re-verification of the 8 requested checks (simulated after the commit, clone of b17294d)

1. Size and CLAUDE.md: `wc -c < AGENTS.md` = 31,983; `test ... -le 32768` OK; `git diff b17294d -- CLAUDE.md | wc -c` = 0.
2. Census: CLAUDE.md rows identical (`diff` empty). Protocols `diff` = exactly one changed row, `process/development-protocols/orchestration.md<TAB>skill:v?-audit-vc` 7 -> 8 (A3). `--compare-agents` exit 0 with exactly the 3 allowed drops (`ENTER EXECUTE MODE` 4->2, `ENTER FAST MODE` 2->1, `[MODE: ORCHESTRATOR]` 1->0); `ENTER UPDATE PROCESS MODE` stays 1 (E16 Invoke line). All 10 anchor rows identical in AGENTS.md and CLAUDE.md. 16 skill/agent name rows drop by design, none below 1. `grep -c "process/context/all-context.md"`: CLAUDE.md 9, AGENTS.md 11.
3. Pointer-check: `comm -13` empty; `comm -23` = exactly the 4 fixed occurrences / 3 distinct keys (orchestration.md -> `autopilot.md§ENTER EXECUTE MODE Consent`; AGENTS.md -> `all-context.md§Testing-and-Quality`; all-development-protocols.md -> archive path, twice). Broken keys 180 -> 176. Both A1 anchors carry their file; `§Testing.` and `§Feature Folder Lifecycle.` resolve thanks to the period terminator. Same result whether `info` lines are written into the out file or not; `sort -u` gives 3 keys.
4. Leftovers: 50 -> 45; `comm -13` empty; removed = the 5 expected keys (orchestration "Superseded by Section 6", all-development-protocols 21 and 37, AGENTS.md E7 promotion step 2, E11 "deprecated legacy surfaces"); 0 entries contain a TAB, so the `cut -f1` sidecar diff is sound; allowlist and sidecar diffs empty.
5. Apply order: B1, E13b, E16, E8 rewrites all 6 E13b links and lands at 31,983 (no STOP). Control: the old order (E16 before E13b) rewrites 2 links and lands at 32,117 (> 32,000, STOP), so the M4-3 fix is load-bearing.
6. Validators: all 10 named validators exit 0 (`validators-after.txt`); `bash $T/baseline/compare.sh` exit 0 ("NOTE new validator validate-model-effort-policy"; OK nothing worse); `generate-skills-catalog.mjs --check` exit 0 (33 skills, wrote: false; never regenerated). Phase 1 grep `R` and the agent-table loop print nothing. Other rows: K1-1 grep 1; `ARCHIVED_09-06-26` 0 / MIGRATION.md 2 / vc-manifest.json 1; heading `### Current Execution State Format` 1; "superseded by section 6" 0; 22 protocol files, modifications only (0); charter `cmp` 0; claim `diff` empty (C2 and the Exit Gate form); `@process` 0 -> OK; `git diff --check $S~1 $S` clean.
7. `bash -n`: all 3 fenced bash blocks in the plan (Path variables, Phase 1 block, Phase 4 block) parse with rc 0.
8. Consistency: plan vs umbrella (Locked Decision E line 69, C-P4 line 131, Entry/Exit row 258, standing contract AGENTS.md <= 32,768 at lines 223 and 342, Phase 6 precondition) and registry Phase 4 section (3 shipped files, task-folder tools, frozen list, no worktree, rollback = revert, standing budget): no new inconsistency. Phase 6/7 call `p4-tools/pointer-check.mjs --out <file>`, the same interface; the tool contains no `vc-` string.

Mutations (one per fixed gate, applied to the simulated after-state, each restored):
- Delete the Bootstrap guard line from the trimmed AGENTS.md: `--compare-agents` exit 1 (`Bootstrap guard 1->0`, `anchor:bootstrap guard 1->0`).
- Delete one more `ENTER EXECUTE MODE` line: exit 1 (`4->1` is not the allowed `4->2`).
- Delete the E16 Invoke line instead of replacing: exit 1 (`ENTER UPDATE PROCESS MODE 1->0`).
- Remove the last `vc-spec-agent` mention: exit 1 (`agent:v?-spec-agent 2->0`).
- Add a `Gate: PASS` line to orchestration.md: protocols `diff` shows 3 rows instead of 1 (red).
- Re-add the bare `§Provisional Goal Block Format` (cycle-1 A1 text): `comm -13` reports the new key `orchestration.md -> orchestration.md§Provisional Goal Block Format`.
- Leave B1 unapplied: `comm -23` = 3 occurrences instead of 4 (red).
- Pointer tool without the period terminator: `§Testing. Run ...` and `§Feature Folder Lifecycle.` appear as new broken keys (red), so the M4-2(b) rule is needed.
- Add a "legacy" line: leftover `comm -13` non-empty. Add 800 bytes: size 32,783, size gate red.

### MUST-FIX / RESIDUAL classification

MUST-FIX: 0. M4-1 (census spec), M4-2 (pointer-check spec + A1 text) and M4-3 (edit order) are closed: simulated green on a correct edit and red under mutation.

RESIDUAL (no gate blocked; handled by execute-agent / tester instructions below or by UPDATE PROCESS):
- R4-3 (carried) Phase Loop Progress ("The contract below is the OUTER contract for the old dedup scope") and Resume and Execution Handoff ("re-validate from V1 required") describe the pre-validate state. This contract governs; the orchestrator ticks step 4.
- R4-5 AC2 says "except the 5 listed drops" and the TL;DR says "about 31,920 bytes"; after the supplement the Anchor matrix lists 3 drops and the expected size is 31,983. The Anchor matrix, step 0.2 and the Exit Gate govern.
- R4-6 B2 says "after each tier run `wc -c`", but the bottom-up order interleaves tiers, so tier totals cannot be read mid-run. Record the per-edit sizes listed above instead. B1 (line 385) is listed before E13b (394-399); harmless, because B1 changes no line count.
- R4-7 Step 0.3 says "Output sorted keys" without the word "broken". The out file must hold ONLY failing keys, one line per occurrence (no `-u`). Writing OK keys too would turn `comm -13` red on a correct edit. `info` lines may go to stdout or the file (verified equivalent).
- R4-8 Some gate rows exit non-zero by design: `grep -c` rows that expect 0 (archive count, "superseded by section 6") and the protocols `diff` row (one expected changed row). Judge by printed values, not exit codes; never run the block under `set -e`.
- R4-9 Precondition: the umbrella shows Phase 3 NOT_STARTED. The Entry Gate requires the Phase 3 exit gate green. Phase 3 is task-folder only, so line ranges stay valid, but the `git diff b17294d` Entry check must be re-run at EXECUTE start.
- R4-10 The umbrella's own 2026-10-29 Validate Contract (lines about 652 and 699) still describes the old Phase 4 scope (cold read, probe calls). This is not new; the umbrella records at line 860 that its contract stays stale until phase PVLs re-run, and Locked Decision E plus C-P4 govern. Handled by umbrella re-PVL / UPDATE PROCESS, not Phase 4.
- R4-11 The simulation ran on a Linux-filesystem clone. Only the before-captures and the baseline validators were re-run on the real drvfs checkout (identical / green); the after-state on drvfs is proven by EVL, not here.
- Known Gaps (named residuals, excluded from the CONCERN/FAIL count): KG-P4-1 (AGENTS.md lacks 7 of 10 core rules, same as the old kit), KG-P4-2 (`12-reference.md PHASE-GATES`, 9 citations in 8 files), KG-P4-3 (Codex never run here; 32 KiB limit is a research finding; `Section N` citations unchecked), KG-P4-4 ("14 validators registered in all-context.md" in frozen CLAUDE.md:331 / AGENTS.md:385), KG-P4-5 (line ranges assume b17294d; the Entry Gate enforces it).

### Test gates (C3 5-column table)

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P4 / AC1 | Codex sees the whole AGENTS.md (<= 32,768; target <= 32,000) | Fully-Automated | `test "$(wc -c < AGENTS.md)" -le 32768 && echo OK`; `wc -c < AGENTS.md` = 31983 | A |
| C-P4 / AC2 | CLAUDE.md byte-identical; CLAUDE.md census unchanged; protocol census changes only by the A3 row; AGENTS.md signals/anchors not lower except the 3 allowed drops; no name row below 1 | Fully-Automated | `git diff b17294d -- CLAUDE.md \| wc -c` = 0; census `diff` rows; `census.mjs --compare-agents` exit 0 | A |
| C-P4 / AC2 | Skill Registry whole, catalog fresh | Fully-Automated | `generate-skills-catalog.mjs --check` exit 0 | A |
| C-P4 / AC3 | broken pointers drop by exactly the 4 fixed occurrences, none new | Fully-Automated | `pointer-check.mjs` before/after; `comm -13` empty; `comm -23` = 4 occurrences / 3 keys | A |
| C-P4 / AC4 | no unjustified leftover, none new | Fully-Automated | leftover `comm -13` empty; allowlist diff; sidecar key diff | A |
| C-P4 / AC5 | registry docs list the 38th validator (closes K1-1) | Fully-Automated | `grep -c validate-model-effort-policy orchestration.md` = 1 | A |
| C-P4 / AC6 | validators not worse; 22 files modifications-only; mirror pair identical; Phase 1 model text preserved | Fully-Automated | `bash $T/baseline/compare.sh` exit 0; the 10-validator loop; 22-file check; `cmp`; Phase 1 grep block prints nothing | A |
| C-P4 / AC7 | one revertable `fix:` commit inside the claim | Fully-Automated | `changed.txt` vs `claim.txt` diff empty | A |

Failing stubs (Fully-Automated rows, red-first for execute-agent; Step 0.6 records them RED before the edit):
- test("should keep AGENTS.md within the Codex 32 KiB read limit", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep AGENTS.md within the Codex 32 KiB read limit") })
- test("should keep CLAUDE.md byte-identical and the census within the allowed drops", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep CLAUDE.md byte-identical and the census within the allowed drops") })
- test("should keep the skills catalog fresh", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep the skills catalog fresh") })
- test("should fix exactly the 4 broken pointer occurrences and add none", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should fix exactly the 4 broken pointer occurrences and add none") })
- test("should leave only allowlisted and justified leftovers", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should leave only allowlisted and justified leftovers") })
- test("should list validate-model-effort-policy in the regression gate list", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should list validate-model-effort-policy in the regression gate list") })
- test("should keep validators, protocol file set, mirror pair and Phase 1 text intact", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep validators, protocol file set, mirror pair and Phase 1 text intact") })
- test("should change exactly the 3 claimed files in one commit", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should change exactly the 3 claimed files in one commit") })

Legacy line form:
- size: [Fully-automated: wc -c AGENTS.md <= 32768 (target <= 32000; expected 31983)]
- census/anchors: [Fully-automated: census.mjs before/after + --compare-agents]
- pointers: [Fully-automated: pointer-check.mjs comm -13 / comm -23]
- leftovers: [Fully-automated: sorted grep vs dedup-allowlist.txt + why sidecar]
- validators: [Fully-automated: bash baseline/compare.sh + 10 named validators + catalog --check]
- Codex runtime: [known-gap: documented KG-P4-3]

### Dimension findings

- Infra fit: PASS — every script and path exists or is created in Step 0; Linux node matches the reference TSV; compare.sh green before (real checkout and clone) and after (clone).
- Test coverage: PASS — every developed behaviour has a Fully-Automated gate; all gates satisfiable on a correct edit and red under mutation; R4-7/R4-8 are reading instructions.
- Breaking changes: PASS — no protocol file or heading renamed or removed; no inbound citation of deleted AGENTS.md headings; catalog routedFrom unchanged; Phase 6/7 pointer-check interface unchanged.
- Security surface: PASS — documentation only; no tool grants, secrets or trust boundaries; approval, phase-lock, Bootstrap guard and `ENTER UPDATE PROCESS MODE` text survive (census-proven).
- Step 0 (gates and before-captures) feasibility: PASS — 0.2/0.3 implementable as written (R4-7 clarifies the out file); before-captures identical on clone and real checkout.
- Step A (protocol fixes) feasibility: PASS — A1-A4 exact; A1 anchors resolve; only census change = A3 row.
- Step B (AGENTS.md trim) feasibility: PASS — ranges and texts exact; order reaches 31,983 without STOP (R4-6 on recording tier sizes).
- Step C/D (commit, claim, EVL) feasibility: PASS — single commit of 3 files; claim diff empty; spawned vc-tester.
- Exit Gate: PASS — all rows print expected values; `bash -n` clean (R4-8 on exit codes).

Net gate derivation: Layer 1 = 0 FAIL / 0 CONCERN / 4 PASS; Layer 2 = 0 FAIL / 0 CONCERN / 5 PASS. MUST-FIX 0; RESIDUAL 8 + Known Gaps KG-P4-1..5. No contradictions between dimension verdicts. Vacuous-green check: every developed behaviour (size, census, pointers, leftovers, registry line, validators, claim) has a Fully-Automated gate proven green in simulation; KG-P4-1..5 are not behaviours this phase develops, and none is used as proof.

### Execute-agent instructions

- E0 Start only after the Phase 3 exit gate is green and committed (R4-9). Re-run the Entry Gate `git diff b17294d -- AGENTS.md CLAUDE.md process/development-protocols/` (must be empty) before Step 0.
- E1 Apply A1-A4, then Step B in the B2 order exactly (`E4, E15, E3, E2, E1, E12, E14, E9, B1, E13b, E16, E8, E11, E7, E6, E10, E13a, E5`). Within E16 work bottom-up and find each line by content (replace line 380 first, then delete 371, 364, 350, 343). Record the per-edit sizes (expected sequence in Real-repo facts above; final 31,983). N1 is the last line of the file, followed by exactly one newline.
- E2 Implement `census.mjs` exactly per 0.2: name rows with word boundaries, checked only for >= 1; signal/anchor rows not lower except the 3 exact allowed drops; ENTER regex case-sensitive.
- E3 Implement `pointer-check.mjs` per 0.3, writing ONLY broken keys to `--out`, one line per occurrence, `LC_ALL=C` order, no `-u` (R4-7).
- E4 Run baseline-compared validators with Linux `node` (the runtime of `validators_after_setup.tsv`); never mix runtimes.
- E5 Never regenerate the catalog in Phase 4; a red `--check` means revert the offending edit.
- E6 Judge Exit Gate rows by printed values (R4-8); `git diff --check` uses the fix sha.
- E7 If the final size is above 32,000, or any gate disagrees with the values above: STOP before committing and return `DONE_WITH_CONCERNS` with the measured values (do not invent new cuts).
- Tester (EVL): re-run every Exit Gate command independently on the real checkout; any value differing from this contract is a fix cycle, not an acceptance.

Open gaps: none (MUST-FIX 0). Residuals R4-3, R4-5..R4-11 and KG-P4-1..5 are named residuals routed above; UPDATE PROCESS writes the KG-P4-1/2/4 backlog notes.

What This Coverage Does NOT Prove:
- The size gate proves byte count, not that Codex reads or obeys the whole file (KG-P4-3; Codex never run).
- The census proves listed tokens and names survive, not that paraphrased guidance (for example the deleted Quick Start flow) is understood the same way.
- Pointer-check proves paths and `§` anchors resolve; it does not check `Section N` citations or `PHASE-GATES` (KG-P4-2) and cannot judge whether a pointer points at the right meaning.
- The leftover allowlist proves no new "superseded/legacy" hits, not that every kept hit is still accurate; the sidecar justifications are written by the executor, not checked for content.
- `compare.sh` proves validators are not worse, not that they cover AGENTS.md semantics.
- The after-state was simulated on a Linux-filesystem clone; on the real drvfs checkout only the before-state was re-run here (R4-11). EVL proves the real after-state.

Autonomous Goal Block: not written here (BRANCH B: the umbrella plan carries `## Stable Program Goal`; the umbrella /goal governs).
Gate: PASS (0 FAIL / 0 MUST-FIX / 8 RESIDUAL + KG-P4-1..5; inner PVL cycle 2 after 1 validate-fix loop). `PHASE_COMPLETE: VALIDATE` is legal: `PHASE_COMPLETE: VALIDATE — validate-contract written (after 1 validate-fix loop(s)). Proceed to EXECUTE.`
Accepted by: not required (Gate PASS; no CONDITIONAL concern to accept). Residuals R4-3, R4-5..R4-11 and KG-P4-1..5 are recorded as named residuals, not as accepted concerns.

---

## Supplement cycle 1 (PVL-supplement, 29-10-26)

Addressed G1-G7: pointer-check.mjs and signal-census.mjs (0.2, 0.3); C1 inbound-reference rule rewritten (no rename/delete of cited files/headings without stub or SendMessage to p5-skills-tune; no edits to skills/agents); line-anchored allowlist replaces `superseded == 0` (0.4); 10-rule cold-read probe defined (0.5) and semantic block list (A1); archive pointer fix (0.2, C2) and charter-template skill copy kept (C1); join step by orchestrator (catalog --write, --check, joint validators) and per-teammate diff-vs-claim (0.6, D1, D2); protocol-discovery, context-discovery, skill-routing, invocation-wiring and CLAUDE.md/AGENTS.md-reading validators added to gate; tier re-confirm (0.1). Registry change needed: Phase 4 claim to list `p4-tools/` and `dedup-allowlist.txt` in the task folder, and state that `.claude/agents/**` and `.codex/**` are read-only for Phase 4. Validate-contract above retained unchanged.

---

## PVL cycle 2 supplement request (29-10-26)

Issued by vc-validate-agent (outer-pvl re-run from V1). Gate was CONDITIONAL with 0 FAIL; the orchestrator spawns vc-plan-agent (PVL-supplement mode) with this block, then re-spawns vc-validate-agent from V1.

SUPPLEMENT REQUEST:
- Gap 1: Section implementation-checklist + exit-gate (items A1, 0.5) | Concern: `grep -c "Bootstrap Guard" CLAUDE.md AGENTS.md` is CLAUDE.md:1, AGENTS.md:0 today (AGENTS.md says "Bootstrap guard"), so the gate is red at baseline; AGENTS.md also lacks the `find process/context/ -type f` gate text, `PHASE_COMPLETE` and `ENTER VALIDATE MODE`, so cold-read "10 of 10 from both entries" is unreachable without adding content to AGENTS.md | Severity: CONCERN | Suggested addition: use `grep -ci` per file chained with `&&`; in A1 mark each of the 10 rules both / Claude-only / Codex-only and require 10 for CLAUDE.md and the applicable subset for AGENTS.md; if Codex needs a rule it lacks, add it as an explicit plain-path pointer item.
- Gap 2: Section implementation-checklist + verification-evidence (items 0.5) | Concern: no mechanical proof that duplication DROPPED (census proves nothing lost; cold-read is the only "single source" evidence); the probe is never run on the unmodified files so it could be vacuously green; a Claude subagent auto-loads CLAUDE.md, contaminating the AGENTS.md-only entry; probe calls are billed runs beyond the golden set and are not counted | Severity: CONCERN | Suggested addition: `$T/overlap-check.mjs` (normalized-line and 8-token-shingle overlap CLAUDE.md vs AGENTS.md, including Skill Registry rows) with a named reduction floor; run cold-read on the baseline first (expect at least one rule with 2 sources); run the AGENTS.md entry from a temp copy without CLAUDE.md; report the probe call count to the user before running.
- Gap 3: Section implementation-checklist (items 0.2; C1) | Concern: pointer-check and the no-rename/delete rule cover only CLAUDE.md, AGENTS.md, protocols, `.claude/agents`, `.codex`, `.claude/skills`; real inbound references also live in `.claude/hooks/lib/context-builder.cjs` (looks up `implementation-standards.md`, `orchestration.md` by name at runtime), `docs/**` (14 files), `process/_seeds/**`, README.md, CONTRIBUTING.md, `.github/labeler.yml`, `install.sh`, `compute-sync-plan.mjs`, `e2e-kit-flows.test.mjs`; anchor forms parsed and the baseline file are undefined | Severity: CONCERN | Suggested addition: scan ALL repo files except the task folder; extend the rule to "cited from anywhere outside `process/development-protocols/`"; name the parsed anchor forms (`§Name`, `#### Name`, `Section N`) and `$T/pointer-baseline.json`; add the hook file names to the check.
- Gap 4: Section implementation-checklist + exit-gate (items script interfaces) | Concern: `p4-tools/…` and `dedup-allowlist.txt` are task-folder-relative but mixed with repo-root commands; `<p4-baseline>` and `<phase-4-claim>` are placeholders no step defines and the registry claim is prose; `diff <(grep -r …) dedup-allowlist.txt` depends on `grep -r` directory order (NTFS vs ext4) and on bash; the hit list is 50 lines (not 3), incl. `SUPERSEDED` enum lines orchestration.md:644 and 11-phase-programs.md:95,98; per-hit justifications cannot live inside a file that is diffed | Severity: CONCERN | Suggested addition: `T=process/general-plans/active/vibebelt-rebrand_29-10-26`, call `node.exe $T/p4-tools/…` from repo root; step 0.7 `git rev-parse HEAD > $T/p4-tools/baseline.sha`; machine-readable `$T/p4-tools/claim.globs`; `LC_ALL=C sort` both sides in bash; justifications in sidecar `dedup-allowlist.why.txt`.
- Gap 5: Section implementation-checklist (items D1) | Concern: nothing says how the two teammates share git: both commit to `main` in one tree, so `git diff --name-only <p4-baseline>..HEAD` contains Phase 5's files (claim-check fails) and parallel `git add/commit` races on `index.lock`; no rollback unit is defined for either teammate | Severity: CONCERN | Suggested addition: one `git worktree` + branch per teammate merged at the join (or path-limited commits with a `Teammate: p4` trailer and `git log --grep`); claim-check runs on each branch diff; revert rehearsal of a teammate merge; fallback sequential 4 then 5 stays valid.
- Gap 6: Section implementation-checklist (items A1) | Concern: AGENTS.md "Skill Registry" (30 rows with a Trigger Keywords column, 3 skills missing) duplicates SKILL.md `trigger_keywords` that Phase 5 edits; `validate-skill-routing` cannot catch a dropped skill name because the catalog lists every skill; the charter-template mirror pair is byte-identical today but no plan checks equality at the join | Severity: CONCERN | Suggested addition: decide in A1 to replace the table with a plain-path pointer to `process/context/generated-skills-catalog.json` or `discover-skills.mjs`; add a skill-name and agent-name census to signal-census; freeze both mirror copies in Phases 4/5 and add `cmp` of the pair to the join.
- Gap 7: Section implementation-checklist (items D2) | Concern: the join is "run by the ORCHESTRATOR"; `catalog --write` edits a generated source file and the joint suite is gate running, both inline in the orchestrator shell, which CLAUDE.md and orchestration.md forbid | Severity: CONCERN | Suggested addition: the orchestrator only sequences; spawn vc-execute-agent for `--write` and vc-tester for `--check` plus the joint suite; fix the same wording in Phase 5 C2 and umbrella decision (f).

---

## Supplement cycle 2 (PVL-supplement, 29-10-26)

Addressed all 7 gaps of the cycle-2 request. G1: Bootstrap check is `grep -ci` per file chained with `&&`; A1 classifies each of the 10 cold-read rules as both / Claude-only / Codex-only (CLAUDE.md = 10, AGENTS.md = applicable subset) and adds plain-path pointer items for rules AGENTS.md lacks. G2: `overlap-check.mjs` (normalized-line plus 8-token-shingle overlap incl. Skill Registry rows, floor <= 50 percent of baseline), cold-read baselined first, AGENTS.md-only entry from a temp copy without CLAUDE.md, probe call count reported in cost gate 0.5a. G3: pointer-check scans all repo files except the task folder (hooks, docs, _seeds, README, CONTRIBUTING, .github, install.sh, compute-sync-plan.mjs, e2e test), no-rename/delete rule = anything cited from outside `process/development-protocols/`, anchor forms `§Name` / `#### Name` / `Section N` named, `pointer-baseline.json` defined. G4: `T` variable, `node.exe $T/p4-tools/...` from repo root, `baseline.sha` and `claim.globs` defined (0.6, 0.7), sorted file-to-file allowlist diff (50 hits incl. SUPERSEDED enum lines) with justification sidecar `dedup-allowlist.why.txt`. G5: one git worktree + branch per teammate merged at the join, claim-check on each branch diff, merge revert rehearsal, sequential fallback kept. G6: AGENTS.md Skill Registry replaced by a plain-path pointer to the generated catalog / `discover-skills.mjs`, skill-name and agent-name census added, both charter-template mirror copies frozen and `cmp`-checked at the join. G7: the orchestrator only sequences the join; spawned vc-execute-agent runs the merge and catalog `--write`, spawned vc-tester runs `--check`, the `cmp` and the joint suite.

Registry/umbrella changes needed (orchestrator): Phase 4 claim gains `process/general-plans/active/vibebelt-rebrand_29-10-26/p4-tools/**`, `dedup-allowlist*.txt` and the phase report, with `process/development-protocols/references/program-goal-charter-template.md` explicitly frozen/excluded; record teammate branches `p4-docs-dedup` / `p5-skills-tune`; umbrella Locked Decision (f) wording: "the orchestrator sequences the join; a spawned vc-execute-agent runs the catalog `--write`, a spawned vc-tester runs `--check` and the joint suite" (same fix needed in Phase 5 C2).

Supplement (ripple of 2026-10-29 decisions): model labels corrected to front-matter reality (research, plan, validate, tester = opus; innovate, spec, update-process = sonnet; EXECUTE = opus; Phase 1 A1 table, Decision B). Phase 1 model text in CLAUDE.md, orchestration.md, implementation-standards.md and vc-system-behavior 04/07/08 is preserved; the single-source dedup must not restore 'only EXECUTE uses opus'; Exit Gate re-runs the Phase 1 claim grep.

## Supplement (PVL cycle 5 MUST-FIX)

- M4-1: the Exit Gate supplement agent-table loop is replaced by the escaped version (`bash -n` exit 0 on a scratch file; run once read-only: 30 `RED` lines today, as expected before Phase 1). The Phase 1 claim grep line (`R=...`) is kept unchanged.
- Residuals: Strategy Recommendation model wording corrected (research, plan, validate = opus per front-matter; innovate, spec, update-process = sonnet; editing teammate = opus); runtime wording states Linux `node` v22.23.4 is installed and the default baseline, one runtime per comparison.

---

## Supplement (inner 3, scope decision, 2026-10-30)

Applied by vc-plan-agent (opus) as inner-loop step 3 for Phase 4 under the orchestrator's user-delegated scope decision. Phase 4 is now a safe tidy: CLAUDE.md byte-identical, AGENTS.md Skill Registry kept, 4 broken pointer occurrences fixed (orchestration.md -> autopilot.md §ENTER EXECUTE MODE Consent; AGENTS.md -> all-context.md §Testing-and-Quality; all-development-protocols.md archive path x2), the stale "Superseded by Section 6" paragraph rewritten, K1-1 closed in orchestration.md, AGENTS.md trimmed 37,885 -> about 31,920 bytes (simulated on a scratch copy at b17294d; section byte table in Step B), zero billed calls, sequential on main, one `fix:` commit as rollback unit. Verified corrections to the brief: `11-phase-programs.md:15` §Loop-Control Safety Bounds resolves (same-file heading :397), so it is not edited; the dangling `12-reference.md PHASE-GATES` (9 citations, 8 files) is Known Gap KG-P4-2. Umbrella, registry, Phase 5 and Phase 6 wording changes are listed in the plan-agent handoff for the orchestrator (not edited here).

---

## Supplement (PVL, M4-1..M4-3)

Applied by vc-plan-agent (opus), PVL-supplement after inner PVL cycle 1 (CONDITIONAL). Validate Contract text untouched.
- M4-1: 0.2 name rows (`skill:`/`agent:`) checked only for >= 1, counted with word boundaries; ENTER regex case-sensitive. Allowed drops re-derived from AGENTS.md at b17294d (case-sensitive): `ENTER EXECUTE MODE` 4->2, `ENTER FAST MODE` 2->1, `[MODE: ORCHESTRATOR]` 1->0; `ENTER UPDATE PROCESS MODE` 1->1 via E16 replacing line 380 with `- Invoke: After EXECUTE, user says "ENTER UPDATE PROCESS MODE"` (+63 bytes). `process/context/all-context.md` 12->11 removed from the census list (kept as the explicit `grep -c` gate). Protocols census diff = exactly `orchestration.md skill:v?-audit-vc` +1 (A3).
- M4-2: A1 second anchor carries its file (`process/development-protocols/autopilot.md` §Provisional Goal Block Format); 0.3 anchor Name also ends at `.` + whitespace/EOL. Expected `comm -13` empty; `comm -23` = 4 occurrences / 3 distinct keys.
- M4-3: B2 order `... B1, E13b, E16, E8 ...` (strictly bottom-up); tier sizes recorded; final 31,983 expected (limit 32,768, target 32,000).
- Residuals folded in: validator-loop comment defers to `compare.sh`; `git diff --check` uses the fix commit sha; handoff states never regenerate the catalog in Phase 4.
