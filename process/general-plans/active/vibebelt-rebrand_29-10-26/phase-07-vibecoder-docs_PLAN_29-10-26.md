---
name: plan:vibebelt-rebrand-phase-07-vibecoder-docs
description: "vibebelt-kit rebrand — Phase 07: Vibecoder-facing docs"
date: 29-10-26
metadata:
  node_type: memory
  type: plan
  feature: general-plans
  phase: phase-07
---

# Phase 07 — Vibecoder-facing docs

**Program:** vibebelt-rebrand
**Umbrella plan:** process/general-plans/active/vibebelt-rebrand_29-10-26/vibebelt-rebrand-umbrella_PLAN_29-10-26.md
**Phase status:** ⏳ PLANNED (PVL cycle 5: CONDITIONAL; MUST-FIX M7-2 addressed by the cycle-5 supplement; re-validate from V1)
**Complexity:** COMPLEX
**Report destination:** process/general-plans/active/vibebelt-rebrand_29-10-26/phase-07-vibecoder-docs_REPORT_29-10-26.md (flat in the program task folder)

---

## Overview

One phase of the vibebelt-rebrand program; program context lives in the umbrella plan. Context router: process/context/all-context.md (created in Phase 0). Test routing: process/context/tests/all-tests.md (load before assigning tiers).

Date: 29-10-26
Status: PLANNED
Complexity: COMPLEX

## Purpose

Make the first five minutes work for someone who has never used a terminal-driven AI workflow. Rewrite the top of the README (one-line value, one install command, three "you say / it does" examples), add a 5-minute quick start page and a plain-language glossary, and reword user-facing agent messages. System signal strings are never reworded.

---

## Entry Gate

Path variables (define once; every gate runs from the repo root, never from inside the task folder):

```bash
export NODE=${NODE:-node}
TF=process/general-plans/active/vibebelt-rebrand_29-10-26; H=$TF/harness; G=$TF/golden
```

- Phase 6 exit gate green (so docs use the final `vb-` names) AND the Claude Code session was restarted after the Phase 6 rename commit so `vb-*` agents resolve (Phase 6 restart checkpoint).
- Record the scope-gate base: `git rev-parse HEAD > $H/phase7-base-sha.txt` (the Phase 6 commit; the clean tree is checked with `test -z "$(git status --porcelain -- . ':(exclude)process/general-plans/active/vibebelt-rebrand_29-10-26')"`).
- The `## Plain-Language Gate Rendering` heading still exists after Phase 4: `test "$(grep -c '^## Plain-Language Gate Rendering$' process/development-protocols/orchestration.md)" = 1`. Save its BEFORE text: `git show $(cat $H/phase7-base-sha.txt):process/development-protocols/orchestration.md | awk '/^## Plain-Language Gate Rendering$/{f=1;print;next} f&&/^## /{exit} f' > $H/orchestration-plg-before.txt` (non-empty: `test -s`).
- Pinned census artifact from Phase 3, by FULL path: `$G/signal-census.mjs` (script) and `$G/signal-census-phase3.txt` (saved Phase 3 output); both must exist (`test -f`) or the gate cannot run. They live in the task folder, NOT at a repo-root `golden/`. Because Phase 6 renamed `VC-` signals to `VB-` and agent files from `vc-*` to `vb-*`, check 4 normalizes BOTH sides (saved file and fresh run) with `sed 's/VC-/VB-/g;s/vc-/vb-/g'`, so the comparison is prefix-neutral in both directions. Phase 3 (re-scoped, step A2) lists agents by directory listing and keys its output by the prefix-stripped agent name; its lines are `<key>\t<md|toml>\t<class>\t<token>\t<count>` (with counts), and it exits 1 when it finds no agent file.
- Phase 4 pointer-check (Phase 3 no longer builds one): `test -f $TF/p4-tools/pointer-check.mjs`; record the start state `$NODE $TF/p4-tools/pointer-check.mjs --out $H/phase7-pointers-before.txt`.
- `AGENTS.md` byte budget holds at entry: `test "$(wc -c < AGENTS.md)" -le 32768` (standing contract from Phase 4; Phase 7 does not edit `AGENTS.md`, and any prose ever added there must keep it <= 32,768 bytes).
- The install command value equals the Phase 2 `REPO` value (single source for the command string); the derivation is fixed in B3 check 3.
- Runner: `$NODE` = any Node >= 22 (the Phase 7 scripts are pure-script; `node.exe` is acceptable on this host).

---

## Strategy Recommendation (vc-agent-strategy-compare)

- Signals: S4, S7 — score 2/7 (MEDIUM), dominant signal S7.
- Recommended: **Mixed, ordered.** Group (a-EN) README top + QUICKSTART, then group (b) GLOSSARY, then group (a-VI) the Vietnamese copies — SEQUENTIAL (the glossary must cover every term the quick start uses, and Vietnamese must follow the final English text; fire-and-forget subagents cannot share that). Group (c) agent message wording (human sentences around signal strings, `.md` + `.codex/agents/*.toml` mirror in the same step) runs in parallel beside the chain with a disjoint file set, and the 8 banners (group d) are a trivial parallel step. Research/plan/validate run on opus (front-matter); sonnet for pure prose helpers; opus only for the implementer of group (c) (edits agent prompts). Alternative: a named agent team with a shared task list (rejected as heavier than needed).

---

## Blast Radius

- `README.md` (top section only; rest untouched), `docs/QUICKSTART.md` (NEW), `docs/GLOSSARY.md` (NEW)
- Vietnamese (pinned names): `docs/i18n/README.vi-VN.md` (the real file name; NOT `README.vi.md`), `docs/i18n/QUICKSTART.vi-VN.md` (NEW), `docs/i18n/GLOSSARY.vi-VN.md` (NEW)
- Banner only (the 8 other languages): `docs/i18n/README.{zh-CN,ja-JP,ko-KR,pt-BR,es,de,fr,hi}.md`. `README.vi-VN.md` gets NO banner (it is maintained in sync).
- `.claude/agents/vb-*.md` AND their Codex mirrors `.codex/agents/vb-*.toml` (the parity validator compares each md body with its toml body, so both change together); wording limited to the human sentences around signal strings
- `process/development-protocols/orchestration.md` §Plain-Language Gate Rendering ONLY. Nothing else under `process/development-protocols/**`, `CLAUDE.md` or `AGENTS.md` is edited here (those belong to Phase 4's claim).
- `scripts/check-docs.mjs` (NEW, the five-check script of step B3) and its fixtures `scripts/fixtures/check-docs/**` (NEW; `scripts/` is `kitOnly`, never installed)
- Task-folder helpers (not source): `$H/phase7-base-sha.txt`, `$H/phase7-claim.patterns`, `$H/orchestration-plg-before.txt`, `$H/phase7-agent-diffs/`

---

## Implementation Checklist

### Step A — README top (English first)

- [ ] A1. Draft in `README.md` top: one sentence of value; ONE install command (copy-paste), marked "verified in Phase 8" until Phase 8 proves it; three examples each as "You say: ... / The kit does: ..." in everyday words. The install command line must be identical to the one in Get Started. Wrap the whole new top section in the marker comments `<!-- vibecoder-top:start -->` and `<!-- vibecoder-top:end -->` (own lines). The markers are the machine boundary of "README top": the first H2 of the README sits far below the install command, so a heading-based cut would be wrong. The top section must contain at least one heading.

### Step B — Quick start, glossary, checks (strictly after A1)

- [ ] B1. `docs/QUICKSTART.md`: install, open Claude Code or Codex, say the first sentence, what you will see, what to do when stuck. At most 1000 words (about 5 minutes); no unexplained term. Fixed term-list format: the file ends with a `## Terms used` section, ONE term per bullet, written `- **term**` (bold, nothing else on the line). In the body, every bold term (`**x**`, outside code fences and outside that list) must also appear in the list; command snippets in backticks are NOT terms and are never listed.
- [ ] B2. `docs/GLOSSARY.md` (written AFTER B1 from its `## Terms used` list): plan, validate, hook, agent, skill, phase, gate, commit, branch and every other term the quick start lists, each as its own heading (`##`, `###` or `####`) with one or two plain sentences and an everyday analogy.
- [ ] B3. Build `scripts/check-docs.mjs` (test first; run with `$NODE`) with `--root <dir>` (default: cwd), `--golden <dir>` (default `$G`) and `--self-test`. Five checks; it prints `CHECK <n> PASS|FAIL <detail>` per check and exits non-zero on any failure. Definitions (all deterministic):
  1. Heading parity: for each pair (README top vs `docs/i18n/README.vi-VN.md` top, taking ONLY the text between the `vibecoder-top` markers; `docs/QUICKSTART.md` vs `docs/i18n/QUICKSTART.vi-VN.md`; `docs/GLOSSARY.md` vs `docs/i18n/GLOSSARY.vi-VN.md`, whole files), extract headings outside code fences and compare the ORDERED sequence of heading LEVELS and the count. Vietnamese heading text differs by design, so text is not compared. A missing marker pair is a FAIL.
  2. Term coverage: read only the bullets under `## Terms used` in `docs/QUICKSTART.md` (an empty or missing list is a FAIL); every term must match a heading in `docs/GLOSSARY.md` (case-insensitive, trimmed); every bold term in the QUICKSTART body must be in the list; `docs/QUICKSTART.md` word count (whitespace split of the whole file) is at most 1000.
  3. Single install command: from the REPO line of `install.sh` (`^REPO="https://github.com/<owner>/<repo>(.git)?"$`) derive `<owner>` and `<repo>` and the expected line `curl -fsSL https://raw.githubusercontent.com/<owner>/<repo>/main/install.sh | bash`. Every line matching `^curl -fsSL https://raw\.githubusercontent\.com/.+/install\.sh \| bash$` in `README.md` (whole file: top and Get Started), `docs/QUICKSTART.md` and the three Vietnamese files must equal the expected line; `README.md`, `docs/QUICKSTART.md`, `docs/i18n/README.vi-VN.md` and `docs/i18n/QUICKSTART.vi-VN.md` must each contain at least one such line (`GLOSSARY.vi-VN.md` and `GLOSSARY.md` need NOT contain one; if they do, it must equal the expected line - R7-3). The old owner count counts only lines WITHOUT the literal `upstream-attribution` tag: `grep -v upstream-attribution <file> | grep -c withkynam` must be 0 over README.md, QUICKSTART and the three VI files (the single tagged fork-credit line from Phase 2 is exempt, per the umbrella SWEEP RULE).
  4. Signal census, two parts: (a) agent prompts — run `$NODE <golden>/signal-census.mjs`, require non-empty output, normalize both the fresh output and `<golden>/signal-census-phase3.txt` with `sed 's/VC-/VB-/g;s/vc-/vb-/g'`, then REMOVE THE COUNT column on both sides (`cut -f1-4 | LC_ALL=C sort -u`) and require an empty diff (symmetric: a token that appears or disappears for any agent/kind/class fails). Strictness, stated plainly: counts are NOT compared, because plain-language rewording can legitimately change how often a word such as `BLOCKED` or `DONE` occurs in prose; the full-line diff with counts is written to `$H/phase7-census-count-diff.txt` and every count change is listed for the C2 reviewer. Signal tokens inside backticks stay exactly guarded by check 5; (b) `orchestration.md` — extract the `## Plain-Language Gate Rendering` section (awk as in the Entry Gate) now and compare its sorted multiset of signal tokens (`PHASE_COMPLETE:[ A-Z-]*`, `Gate: (PASS|CONDITIONAL|BLOCKED)`, `SUPPLEMENT_APPLIED:`, `QUICK_FIX_ABORT:`, `VB-[A-Z-]+`) with the same extraction from `$H/orchestration-plg-before.txt`; equal required (the Phase 3 census does not cover this file).
  5. Agent-edit invariants: for every `.claude/agents/vb-*.md` and `.codex/agents/vb-*.toml` that differs from the base SHA in `$H/phase7-base-sha.txt` (via `git show <sha>:<path>`), the multiset of backtick-quoted spans, of file paths (`[A-Za-z0-9_./-]+\.(md|mjs|cjs|toml|json)`), of numbers and of heading/section lines is identical before and after. Rewording may change only the plain sentences around them.
  `--self-test` runs `scripts/fixtures/check-docs/` (one passing tree and one failing tree per check: missing marker, vi heading level order swapped, term missing from glossary, wrong install line, untagged old-owner string fails while the tagged `upstream-attribution` credit line passes, GLOSSARY.vi-VN without an install line passes, changed signal token, changed backtick span); the self-test passes only if the passing tree exits 0 and every failing tree exits non-zero naming its check. Written test-first.

### Step C — Messages (parallel group, disjoint files)

- [ ] C1. Inventory user-facing strings ONLY in the claimed files: `.claude/agents/vb-*.md` with their `.codex/agents/vb-*.toml` mirrors, and `orchestration.md` §Plain-Language Gate Rendering (questions to the user, errors, status explanations). If any other file needs rewording, first extend the registry for it and tell the orchestrator; do not edit it here. Reword in plain language. When editing an agent `.md`, edit its `.toml` mirror in the same step and run `validate-agent-parity.mjs` before moving on. Signal strings (`PHASE_COMPLETE:`, `Gate: ...`, `VB-...`) are never reworded; check 4 confirms it. Guardrail sections: `$G/guardrails.json` exists since Phase 3 step B (hashes of the selected sections of the unchanged agents at `b17294d`); do not reword a section whose heading is listed there unless the report records the change, because Phase 8 B4.6(d) compares those section hashes.
- [ ] C2. Behavior review of the agent prose edits (beyond the signal census): after EACH agent edit save the changed lines with `git diff -U0 -- <file> > $H/phase7-agent-diffs/<agent>.diff`; run Phase 4's pointer-check (`$NODE $TF/p4-tools/pointer-check.mjs --out $H/phase7-pointers-after.txt`, then `LC_ALL=C comm -13 $H/phase7-pointers-before.txt $H/phase7-pointers-after.txt` prints nothing = no NEW broken protocol path or `file.md§Name` anchor anywhere in the repo, agent files included; Phase 3 builds no pointer-check); then a fresh `vb-code-reviewer` (sonnet) reads the saved diffs and states, per changed line, whether the instruction (what to do, when, under which condition, with which number, path or command) is unchanged. Any "meaning changed" finding reverts that line. The reviewer verdict is stored in the report (strategy Agent-Probe).

### Step D — Languages

- [ ] D1. Add a top banner "This translation may be outdated; the English/Vietnamese README is authoritative" to exactly the 8 other languages (list in Blast Radius). Do not translate them. Do not touch `README.vi-VN.md`.

### Step E — Vietnamese (strictly after B2)

- [ ] E1. Write `docs/i18n/README.vi-VN.md` top (inside its own `vibecoder-top` markers), `docs/i18n/QUICKSTART.vi-VN.md` and `docs/i18n/GLOSSARY.vi-VN.md` from the final English text, structurally identical (same heading levels in the same order), using the same install command string. Named residual: no native Vietnamese review is available; add a backlog stub `process/general-plans/backlog/vi-native-review_NOTE_29-10-26.md` (structure is machine-checked only; English is not blocked).

### Step F — Non-coder walkthrough (after B3 is green)

- [ ] F1. A fresh agent with no repo context plays a non-coder and follows README top alone. Because the public URL is unpublished until the Phase 8 hard stop, the walkthrough prompt tells the agent to replace the `curl ... | bash` line with `VB_KIT_SOURCE=<local checkout> bash <local checkout>/install.sh` (the variable assignment belongs on `bash`, not on `curl`, and the old `VC_KIT_SOURCE` is only a fallback), run in a sandbox project on the Linux filesystem (for example `$HOME/vb-sandbox/walkthrough`), and to record that deviation in the transcript. It reaches the "Run vb-setup" step. Record the transcript in the report and delete the sandbox. Named residual: the real public-URL install and a real non-coder are verified in Phase 8 / by the user (command marked "verified in Phase 8").

---

## Exit Gate

Wording rule: keep the Phase 1 facts (7 opus / 8 sonnet; the README agent-table rows for research, plan and validate = opus) and do NOT reintroduce any cost-saving percentage (e.g. '60-70% cheaper') unless it was measured.

**Supplement gate (Phase 1 claim grep still prints nothing at this phase's exit; exact grep copied from the Phase 1 Exit Gate, R1.11/R1.12):**

```bash
R='EXECUTE = opus; every other phase|only (the )?(EXECUTE|coding|code-writing)|every other phase = sonnet|all other vc-agents sonnet|EXECUTE only|only (the )?\*coding\* agent|opus ONLY|\(sonnet\)|expensive model only writes|premium AI model only'
grep -rnIE "$R" CLAUDE.md AGENTS.md process/development-protocols/orchestration.md process/development-protocols/implementation-standards.md process/development-protocols/*system-behavior/0[478]-*.md .claude/skills/v[cb]-agent-strategy-compare/SKILL.md process/context/all-context.md README.md   # Expected: no output
for f in README.md docs/i18n/README.*.md; do for a in research plan validate; do grep -E "^\| [^|\`]*\`v[cb]-${a}-agent\` \|" $f | grep -qE "^\| [^|]*\| \*{0,2}opus\*{0,2} \|" || echo "RED $f $a"; done; done   # Expected: no output
```

```bash
grep -rnIE '[0-9]+ ?(-|–|to) ?[0-9]+ ?% (cheaper|lower|less|saving)|60.70' README.md docs/i18n/README.*.md   # Expected: no output
```

```bash
export NODE=${NODE:-node}; TF=process/general-plans/active/vibebelt-rebrand_29-10-26; H=$TF/harness; G=$TF/golden
BASE=$(cat $H/phase7-base-sha.txt)
test -f docs/QUICKSTART.md && test -f docs/GLOSSARY.md && test -f docs/i18n/QUICKSTART.vi-VN.md && test -f docs/i18n/GLOSSARY.vi-VN.md && echo present   # Expected: present
$NODE .claude/skills/vb-audit-vc/scripts/validate-guide-sync.mjs               # Expected: exit 0
$NODE .claude/skills/vb-audit-vc/scripts/validate-agent-parity.mjs             # Expected: exit 0 (md and toml bodies still match for each edited agent)
for l in zh-CN ja-JP ko-KR pt-BR es de fr hi; do test "$(grep -c 'may be outdated' docs/i18n/README.$l.md)" = 1 || echo "FAIL $l"; done   # Expected: no output
test "$(grep -c 'may be outdated' docs/i18n/README.vi-VN.md)" = 0; echo $?     # Expected: 0 (vi-VN has no banner; grep -c exits 1 on 0 so the count is compared)
$NODE scripts/check-docs.mjs --self-test; echo $?                               # Expected: 0 (each check can fail on its own fixture)
$NODE scripts/check-docs.mjs; echo $?                                           # Expected: 0 (CHECK 1..5 PASS: heading levels, terms <= 1000 words, one install command, signal census incl. orchestration section, agent-edit invariants)
$NODE $TF/p4-tools/pointer-check.mjs --out $H/phase7-pointers-after.txt; LC_ALL=C comm -13 $H/phase7-pointers-before.txt $H/phase7-pointers-after.txt   # Expected: no output (no NEW broken pointer; Phase 4 tool)
test "$(wc -c < AGENTS.md)" -le 32768; echo $?                                  # Expected: 0 (AGENTS.md byte budget, standing contract from Phase 4)
bash $H/compare-vb.sh; echo $?                                                  # Expected: 0 (validator suite not worse than baseline; Phase 6 vb- mapping, label-keyed)
CHANGED=$({ git diff --name-only $BASE..HEAD -- . ':(exclude)process/general-plans/active/vibebelt-rebrand_29-10-26'; git status --porcelain -uall -- . ':(exclude)process/general-plans/active/vibebelt-rebrand_29-10-26' | sed 's/^...//'; } | LC_ALL=C sort -u)
test "$(printf '%s\n' "$CHANGED" | grep -c .)" -ge 12; echo $?                 # Expected: 0 (non-vacuous: committed + staged + untracked files all counted; README, 2 EN docs, 3 VI docs, 8 banners, check script, ...)
printf '%s\n' "$CHANGED" | grep -v -E -f $H/phase7-claim.patterns | wc -l      # Expected: 0 (nothing outside the claimed files, before AND after the phase commit)
git diff --check                                                                # Expected: no output
```

`$H/phase7-claim.patterns` (one anchored regex per line, written at Entry): `^README\.md$`, `^docs/QUICKSTART\.md$`, `^docs/GLOSSARY\.md$`, `^docs/i18n/(README|QUICKSTART|GLOSSARY)\.[A-Za-z-]+\.md$`, `^scripts/check-docs\.mjs$`, `^scripts/fixtures/check-docs/`, `^\.claude/agents/vb-`, `^\.codex/agents/vb-`, `^process/development-protocols/orchestration\.md$`, `^process/general-plans/backlog/vi-native-review`.

- Non-coder walkthrough transcript recorded in the report (local-source install; real URL deferred to Phase 8).
- Behavior-review verdict for the agent prose edits recorded in the report.
- Backlog stub for native Vietnamese review exists.

---

## Blockers That Would Justify BLOCKED Status

- Vietnamese wording needs a native review the agent cannot give (flag it with the backlog stub; do not block the English).
- Install command not final until Phase 8 proves it (mark "verified in Phase 8" and revisit there).
- The Phase 3 census artifact path is missing (pin it first; the signal gate cannot run without it).

---

## Phase Completion Rules

- CODE DONE = checklist items done; VERIFIED = Exit Gate commands pass AND full validator suite is not worse than the Phase 0 baseline AND regression checkpoint passes AND validate-contract exists.
- Known-Gap alone never makes a behavior PASS; write a backlog stub and keep that gate CONDITIONAL.

## Acceptance Criteria

- C-P7-a docs exist and consistent. proven by: file presence + guide-sync + agent-parity gates. strategy: Fully-Automated
- C-P7-b EN and VI fully synced in structure. proven by: check-docs.mjs heading parity. strategy: Fully-Automated
- C-P7-c banner on exactly the 8 other languages. proven by: per-language loop (vi-VN = 0). strategy: Fully-Automated
- C-P7-d one identical install command everywhere. proven by: check-docs.mjs check 3. strategy: Fully-Automated
- C-P7-e signals untouched. proven by: check-docs.mjs check 4 (Phase 3 census, VC->VB mapped). strategy: Fully-Automated
- C-P7-f quick start short with all terms defined. proven by: check-docs.mjs check 2. strategy: Fully-Automated
- C-P7-g non-coder can install unaided. proven by: local-source fresh-agent walkthrough (real URL and real non-coder = named residual to Phase 8 / user). strategy: Agent-Probe
- C-P7-h agent prose edits keep their behavior (instructions, conditions, numbers, paths, commands unchanged; pointers resolve). proven by: check-docs check 5 + Phase 4 pointer-check before/after (Fully-Automated) and the saved-diff review by a fresh `vb-code-reviewer`. strategy: Fully-Automated (mechanical part), Agent-Probe (meaning of reworded sentences)
- C-P7-scope nothing outside the claimed files changed, including untracked files and after the phase commit. proven by: Exit Gate scope gate against the recorded base SHA. strategy: Fully-Automated

## Touchpoints

- README top, two new English docs, three Vietnamese files, 8 banners, agent message wording in md + toml mirrors, one orchestration.md section, one check script

---

## Public Contracts

- Install command and flags unchanged; signal strings verbatim (uppercase `VB-...` signals as renamed in Phase 6).

---

## Verification Evidence

| Gate / Scenario | Strategy | Proves SPEC criterion |
|---|---|---|
| Files exist; guide-sync and parity green | Fully-Automated | C-P7-a: docs complete and consistent |
| EN vs VI heading parity (`scripts/check-docs.mjs` check 1) | Fully-Automated | C-P7-b: EN + VI structurally synced |
| Banner per-language loop (8 = 1, vi-VN = 0) | Fully-Automated | C-P7-c: banner scope exact |
| One install command string (check 3) | Fully-Automated | C-P7-d: single install command |
| Signal census vs `$G/signal-census-phase3.txt` (check 4a, both sides normalized VC->VB and vc->vb, count column removed; count changes listed for review) | Fully-Automated | C-P7-e: signals untouched |
| Quick start <= 1000 words, every term defined (check 2) | Fully-Automated | C-P7-f: short and defined |
| Fresh non-coder agent follows README only, local-source install | Agent-Probe (judge: reached the "Run vb-setup" step without outside help) | C-P7-g: non-coder can install unaided (real URL and real non-coder = residual, Phase 8 / user) |
| `orchestration.md` §Plain-Language Gate Rendering signal multiset before/after (check 4b) and agent census with prefix-neutral normalization (check 4a) | Fully-Automated | C-P7-e: signals untouched, including the section the census does not cover |
| Agent-edit invariants (check 5) + Phase 4 `pointer-check.mjs` before/after (`comm -13` empty) + saved-diff review by `vb-code-reviewer` | Fully-Automated (check 5, pointer-check), Agent-Probe (review verdict) | C-P7-h: agent prose edits keep behavior |
| Scope gate: committed diff vs recorded base SHA plus `git status --porcelain -uall`, filtered by `phase7-claim.patterns`; non-vacuity floor of 12 files | Fully-Automated | C-P7-scope: nothing outside the claim |
| Vietnamese wording quality | Known-Gap (named residual; backlog stub; gate CONDITIONAL for wording only) | C-P7-b: structure checked by script, wording not native-reviewed |

---

## Phase Loop Progress

Orchestrator reads this before deciding which subagent to spawn next. The canonical 7-step inner loop
`R → I → P → PVL → E → EVL → UP` SKIPS SPEC (the umbrella plan and the user brief act as the SPEC).

- [ ] 1. RESEARCH — vb-research-agent (opus, front-matter): prior phase reports read; test context loaded; plan drift checked
- [ ] 2. INNOVATE — innovate-agent (sonnet): approach decided; Decision Summary written
- [ ] 3. PLAN-SUPPLEMENT — vb-plan-agent (opus, front-matter): existing phase plan updated; Inner Loop Refresh Note if sections changed (or "n/a — research clean")
- [ ] 4. PVL — vb-validate-agent (opus, front-matter; vb- names after the Phase 6 rename and restart): full V1-V7; validate-contract written per `.claude/skills/vb-validate-findings/references/example-validate-output.md`
- [ ] 5. EXECUTE — vb-execute-agent (opus): all checklist items done; per-section test gates run and green (or gaps documented)
- [ ] 6. EVL — vb-tester: all EVL gates green; follow-up stubs registered; EVL HANDOFF SUMMARY written
- [ ] 7. UPDATE PROCESS — vb-update-process-agent (sonnet): phase report written, umbrella state updated, commit done on main

**Validate-contract required.** If step 4 (PVL) is unchecked or `## Validate Contract` reads
"(placeholder — vc-validate-agent writes this section before EXECUTE)", the orchestrator must spawn
vc-validate-agent first. A partial contract (missing Plan updates applied / Execute-agent
instructions / Test gates) is treated as a placeholder.

---

## Test Infra Improvement Notes

- `scripts/check-docs.mjs` (built in B3) is new reusable test infrastructure for docs parity; keep it for later docs work.
- Vietnamese native review has no automated substitute (backlog stub).

---

## Resume and Execution Handoff

- Selected plan file path: `process/general-plans/active/vibebelt-rebrand_29-10-26/phase-07-vibecoder-docs_PLAN_29-10-26.md`
- Last completed step: not started (supplement cycle 2 applied to the plan, 29-10-26)
- Validate-contract status: written (29-10-26, outer-pvl cycle 5: CONDITIONAL; MUST-FIX M7-2 addressed by the cycle-5 supplement; re-validate from V1); EXECUTE allowed once the Phase 6 exit gate is green and Claude Code was restarted
- Supporting context files: umbrella plan, `phase-blast-radius-registry.md`, Phase 6 report, Phase 3 `golden/signal-census.mjs`
- Next step: re-run PVL (vb-validate-agent after the rename; vc-validate-agent only if PVL runs before Phase 6) from V1 on this plan; EXECUTE only after Phase 6 exit gate is green, the Claude Code session was restarted, and the gate is PASS or accepted CONDITIONAL.

---

## Validate Contract

Status: PASS
Date: 29-10-26
date: 2026-10-29
generated-by: outer-pvl
supersedes: 2026-10-29 (outer-pvl, PVL cycle 5, Gate: CONDITIONAL, 1 MUST-FIX M7-2) — PVL cycle 6 re-validated from V1 against the real repo after the cycle-5 supplement; this contract REPLACES the cycle-5 contract entirely (same calendar date, ordering is by PVL cycle: 6 follows 5). M7-1 and M7-2 are verified CLOSED; 0 NEW MUST-FIX; 6 RESIDUALs carried. The "Validate-contract status" line in Resume and Execution Handoff still quotes the cycle-5 CONDITIONAL text; this contract governs.

V1 line: `V1 RE-VALIDATE TRIGGERED: the cycle-5 supplement (escaped README agent-table loop in the Exit Gate, vb- agent names in Phase Loop Progress steps 1 and 3) was applied after the cycle-5 CONDITIONAL contract; this file has no Inner Loop Refresh Note, the orchestrator instruction treats the supplement as newer. V1 AUTO-PROCEED does not apply.`

Parallel strategy: sequential chain (a-EN -> b -> a-VI) with group (c) and the banners beside it
Rationale: Signals S4 and S7 = 2/7 (MEDIUM), dominant signal S7. Fire-and-forget subagents cannot share the term list or the final English text, so the dependent chain stays sequential; agent wording and the 8 banners run in parallel on disjoint files. Models: named agents run on their own front-matter (research, plan, validate, tester = opus; innovate, update-process = sonnet); opus for the implementer of group (c). Note on this run: Layer 1 + Layer 2 checks ran inline and sequentially by one validate agent (no spawn tool); findings come from real greps, `bash -n` runs of the plan's gate blocks and read-only runs in a scratch clone of HEAD 41b24eb under the scratchpad; the project tree was not modified. Prior verdicts were not trusted.

Evidence gathered in cycle 6 (29-10-26):
- **Structure:** `validate-plan-artifact.mjs` exit 0, 0 failures (2 advisory legacy-shape warnings).
- **M7-2 closed:** all three Exit Gate fenced blocks of the supplement gate (claim grep + escaped README agent-table loop; cost-percentage grep; main gate block) and the other Exit Gate blocks pass `bash -n` (rc 0 for each of the 3 blocks). Run read-only in the clone: the claim grep prints 14 hits (Phase 1 removes them), the escaped loop prints exactly 30 `RED` lines (10 files x 3 agents) and drops to 27 after rewriting the three README agent rows to `opus` (positive control), so it is a real check that reaches 0 after Phase 1. The loop line is the same as in the Phase 2 and Phase 4 plans and accepts both `vc-` and `vb-` (`v[cb]-`).
- **Phase Loop Progress:** steps 1 and 3 now name `vb-research-agent` / `vb-plan-agent` (R7-5 resolved in text); the validate-contract boilerplate paragraph still names `vc-validate-agent` (cosmetic, protected-task-folder text).
- **Cross-plan coherence re-read:** the Phase 3 plan still pins `$G/signal-census.mjs`, `$G/signal-census-phase3.txt`, `$G/pointer-check.mjs` in the task folder; Phase 6 C3b still produces `harness/compare-vb.sh`; the registry Phase 7 line lists the VI files, `scripts/check-docs.mjs`, its fixtures and `harness/phase7-*`; no file claimed here is claimed by another phase. `install.sh` line 11 `REPO=` matches the check-3 regex (line 16 does not).

Test gates (C3 5-column table):

| criterion id | behavior | strategy | proving test | gap-resolution |
|---|---|---|---|---|
| C-P7-a | Quick start and glossary exist (EN + VI); guide-sync and agent parity stay green | Fully-Automated | Exit Gate `test -f ...`; `$NODE .claude/skills/vb-audit-vc/scripts/validate-guide-sync.mjs`; `.../validate-agent-parity.mjs` | B |
| C-P7-b | EN and VI structurally identical (heading levels, README top inside markers, quick start, glossary) | Fully-Automated | `$NODE scripts/check-docs.mjs` check 1; `--self-test` | B |
| C-P7-c | Banner in exactly the 8 other languages, absent from vi-VN | Fully-Automated | per-language loop (8 x `grep -c 'may be outdated'` = 1; vi-VN = 0) | B |
| C-P7-d | One identical install command everywhere, no untagged old-owner string | Fully-Automated | `check-docs.mjs` check 3 (tagged `upstream-attribution` line exempt; fixture pair in `--self-test`) | B |
| C-P7-e | Signal strings untouched (agent prompts via the Phase 3 census; `orchestration.md` section by multiset) | Fully-Automated | `check-docs.mjs` check 4 (a) and (b) | B |
| C-P7-f | Quick start <= 1000 words and every term defined | Fully-Automated | `check-docs.mjs` check 2 | B |
| C-P7-model | Phase 1 model facts kept and no unmeasured cost percentage reintroduced (7 opus / 8 sonnet, research/plan/validate README rows = opus, claim grep empty) | Fully-Automated | Exit Gate supplement blocks: claim grep `R` over 9 files (no output), escaped README agent-table loop over 10 files (no output), cost-percentage grep (no output) | A (M7-2 closed) |
| C-P7-h | Agent prose edits keep behavior (mechanical invariants + pointers) | Fully-Automated | `check-docs.mjs` check 5 + `$NODE $G/pointer-check.mjs` | B |
| C-P7-h2 | Reworded agent sentences mean the same | Agent-Probe | saved diffs read by a fresh `vb-code-reviewer`; verdict in the report | C (judgment only) |
| C-P7-scope | Nothing outside the claimed files changed (committed + staged + untracked) | Fully-Automated | Exit Gate scope gate vs `$H/phase7-base-sha.txt`, 12-file floor | B |
| C-P7-g | A fresh non-coder agent reaches the "Run vb-setup" step from README top (local-source install) | Agent-Probe | F1 walkthrough in a Linux-filesystem sandbox with `VB_KIT_SOURCE=<local checkout>` | D for the real-URL and real-person halves (Phase 8 / user) |

Failing stubs (Fully-Automated rows only):
- Row C-P7-a: `test("should have quick start and glossary with green guide-sync and parity", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should have quick start and glossary with green guide-sync and parity") })`
- Row C-P7-b: `test("should keep EN and VI heading lists identical", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep EN and VI heading lists identical") })`
- Row C-P7-c: `test("should add the outdated banner to exactly the 8 other languages", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should add the outdated banner to exactly the 8 other languages") })`
- Row C-P7-d: `test("should show one identical install command everywhere and no untagged old owner string", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should show one identical install command everywhere and no untagged old owner string") })`
- Row C-P7-e: `test("should leave the signal-string census unchanged", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should leave the signal-string census unchanged") })`
- Row C-P7-f: `test("should keep the quick start short with all terms defined", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep the quick start short with all terms defined") })`
- Row C-P7-model: `test("should keep the 7 opus / 8 sonnet facts and print nothing from the claim greps", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep the 7 opus / 8 sonnet facts and print nothing from the claim greps") })`
- Row C-P7-h: `test("should keep agent prose edits behavior-neutral by invariants and pointers", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should keep agent prose edits behavior-neutral by invariants and pointers") })`
- Row C-P7-scope: `test("should change only the claimed files", () => { throw new Error("NOT IMPLEMENTED — TDD stub: should change only the claimed files") })`

Legacy line form (retained so existing consumers still parse):
- Docs exist + validators: [Fully-automated: test -f ... && validate-guide-sync && validate-agent-parity]
- EN/VI sync, install command, terms, census, agent invariants: [Fully-automated: `scripts/check-docs.mjs` checks 1-5 + `--self-test`]
- Model facts and no cost percentage: [Fully-automated: Phase 1 claim grep + README agent-table loop (escaped backticks) + percentage grep, all empty]
- Banner on 8 languages: [Fully-automated: per-file grep -c = 1, vi-VN = 0]
- Claimed-files scope: [Fully-automated: git diff against the phase-start SHA + porcelain]
- Non-coder walkthrough: [agent-probe: fresh agent, local-source install] | [known-gap: real public URL and real non-coder, carried to Phase 8 / user]
- Vietnamese wording quality: [known-gap: documented — no native review; structure only is machine-checked; backlog stub E1]

Dimension findings:
- Infra fit: PASS — census paths, helper reuse, kitOnly placement and Linux Node availability match the other plans and the real host.
- Test coverage: PASS — M7-2 closed (the supplement gate runs); checks 1-5, scope gate and banner loop sound.
- Breaking changes: PASS — documentation and prose only; install command, flags and signal strings unchanged.
- Security surface: PASS — a pure-script checker; the only security-relevant text is the `curl | bash` line, pinned by check 3.
- Section A/B (README top, quick start, glossary): PASS.
- Section C (messages): PASS — invariants, pointer-check, reviewer pass (cross-phase note R7-6).
- Section D (languages): PASS.
- Section E/F (Vietnamese, walkthrough): PASS — pinned names; residuals named with a backlog stub.
- Exit Gate supplement block (model facts): PASS — claim grep, escaped loop and percentage grep run and behave as stated.

Net gate derivation: Layer 1 = 0 FAIL / 0 CONCERN / 4 PASS; Layer 2 = 0 FAIL / 0 CONCERN / 5 PASS. MUST-FIX 0. RESIDUAL 6 (R7-1..R7-4, R7-6, RES-A). Net gate: PASS. Vacuous-green check: every developed behavior has a Fully-Automated gate or a probe; the Vietnamese wording and real-user walkthrough are named Known Gaps, never the sole proof.

Open gaps:
- none blocking; Known Gaps below.

Known Gaps (RESIDUAL, bounded, each with a backlog stub or named owner; excluded from the gate count):
- R7-1 known-gap: Vietnamese wording is not native-reviewed (structure machine-checked only); backlog stub `vi-native-review_NOTE_29-10-26.md` (step E1); English is not blocked.
- R7-2 known-gap: an agent walkthrough is not a real non-coder and uses a local source; the real public-URL install is proven only in Phase 8 after the user approves publishing.
- R7-3 known-gap (resolved in text): GLOSSARY files need no install line; only README top and QUICKSTART (EN and VI) must have one.
- R7-4 known-gap: the claim grep alternative `all other vc-agents sonnet` matches only the `vc-` spelling, so after the rename that one phrase is no longer guarded (nine other alternatives are spelling-neutral); cosmetic, widen to `v[cb]-agents` when the plan is next edited.
- R7-6 known-gap (cross-phase): C1 allows rewording sentences in agents; check 5 guards backticks, paths, numbers and headings but not plain sentences inside the guardrail sections that Phase 3's `guardrails.json` freezes. A reworded guardrail section shows as a Phase 8 B4.6(d) difference the user can accept in chat (B4.7). Mitigation: leave sections whose headings appear in `golden/guardrails.json` untouched or record each change.
- RES-A (new, cosmetic): the validate-contract boilerplate paragraph in Phase Loop Progress and the handoff status line still name `vc-validate-agent` / quote the cycle-5 CONDITIONAL text; the orchestrator spawns the `vb-*` equivalents and this contract governs.

What This Coverage Does NOT Prove:
- Heading-parity script: equal structure, not that the Vietnamese is accurate or natural.
- Banner grep: the phrase exists, not that the 8 translations are still correct.
- Term-coverage script: each term is defined, not that the explanations are understandable to a non-developer.
- Agent-Probe walkthrough: an agent follows instructions literally and does not fear a terminal; it uses a local source, not the public URL.
- Census and invariants: the signal list, backticks, paths and numbers are unchanged, not that reworded sentences keep their meaning (that is the reviewer pass, a judgment).
- Check 3: the install line equals the one derived from `install.sh`, not that the published URL answers.
- Claim greps: the listed phrasings are absent from the listed files and the ten READMEs, not that every other file or a new phrasing tells the truth about models.

Execute-agent instructions:
- E1: Start only after the Phase 6 exit gate is green in a restarted session (vb-* agents resolve).
- E2: Write English first, then the glossary from the quick start's term list, then the VI copies; never edit signal strings.
- E3: When editing an agent `.md`, edit its `.codex/agents/vb-*.toml` mirror in the same step and run the parity validator before moving on.
- E4: Mark the install command "verified in Phase 8" until Phase 8 proves it.
- E5: Record the Phase 6 (post Phase-6 UPDATE PROCESS) HEAD SHA at entry and use it as the scope-gate base.
- E6: Run `bash -n` on each Exit Gate block before relying on it (all pass today); the README agent-table loop keeps its escaped backticks.
- E7: Do not reword the sections listed for an agent in `golden/guardrails.json` unless the phase report records it (R7-6).

Plan updates applied: none (no MUST-FIX remained).
Autonomous Goal Block: not written here (BRANCH B: the umbrella plan carries `## Stable Program Goal`, so the umbrella /goal governs).
Gate: PASS (0 FAIL / 0 MUST-FIX / 6 RESIDUAL known-gaps; PVL cycle 6; M7-1 and M7-2 verified closed). Signal: `PHASE_COMPLETE: VALIDATE — validate-contract written (after 5 validate-fix loop(s)). Proceed to EXECUTE.` is legal (condition (a) Gate = PASS). EXECUTE still waits for the Phase 6 exit gate and the Claude Code restart.
Accepted by: not applicable (PASS, no CONDITIONAL concerns); R7-1..R7-4, R7-6 and RES-A are recorded as named residuals.

---

## Supplement cycle 1

Date: 29-10-26 | Mode: PVL-supplement | Gaps addressed: 6 of 6 | Validate contract above is the first-pass record; re-validate from V1.
- Gap 1 -> filename corrected to `README.vi-VN.md`; `QUICKSTART.vi-VN.md` and `GLOSSARY.vi-VN.md` pinned; banner gate is a per-language loop (8 = 1, vi-VN = 0).
- Gap 2 -> `.codex/agents/vb-*.toml` mirrors added to the blast radius and C1 edits md+toml together. Registry change needed (other agent): Phase 7 line must add `.codex/agents/vb-*.toml`, `scripts/check-docs.mjs`, `docs/i18n/{QUICKSTART,GLOSSARY}.vi-VN.md`, `process/general-plans/backlog/vi-native-review_NOTE_29-10-26.md`.
- Gap 3 -> Strategy: a-EN -> b -> a-VI sequential; (c) and banners parallel.
- Gap 4 -> B3 builds the four-check script; Phase 3 census pinned to `golden/signal-census.mjs` + `golden/signal-census-phase3.txt` (Entry Gate).
- Gap 5 -> F1 walkthrough uses a local source; real URL and native VI review recorded as named residuals with a backlog stub.
- Gap 6 -> C1 limited to the claimed files; extending requires a registry update first.


---

## Supplement cycle 2

Date: 29-10-26 | Mode: PVL-supplement | Gaps addressed: 4 of 4 | The Validate Contract above is the cycle-2 record; re-validate from V1.
- Gap 1 -> A1 (`vibecoder-top` marker comments define "README top"), B1 (`## Terms used` list, one `- **term**` per bullet, bold-term rule), B3 checks 1-3 (heading LEVEL sequence, term list only, install line derived from the `REPO` owner/repo and compared with a fixed `curl -fsSL https://raw.githubusercontent.com/<owner>/<repo>/main/install.sh | bash` line), F1 (the walkthrough replaces the curl line with `VB_KIT_SOURCE=<local checkout> bash <local checkout>/install.sh` and records the deviation), Entry Gate (`## Plain-Language Gate Rendering` heading confirmed).
- Gap 2 -> Entry Gate and check 4 use the full task-folder paths via `$G`; both sides normalized with `sed 's/VC-/VB-/g;s/vc-/vb-/g'`; non-empty guard; check 4b compares the `orchestration.md` section's signal multiset against a saved BEFORE copy. Cross-plan request for Phase 3 (orchestrator to apply): `signal-census.mjs` lists agents by directory listing and keys by prefix-stripped names.
- Gap 3 -> Exit Gate scope gate: base SHA recorded at Entry, committed diff plus `git status --porcelain -uall` (sees untracked), excluding the task folder, filtered by `phase7-claim.patterns`, with a non-vacuity floor.
- Gap 4 -> Phase Loop Progress steps 4-7 name `vb-*` agents; C2 adds saved diffs, the Phase 3 pointer-check, and a `vb-code-reviewer` behavior review; check 5 adds mechanical invariants (backtick spans, paths, numbers, heading lines unchanged); new criterion C-P7-h.
- Registry change needed (file I do not own): Phase 7 line should add `scripts/fixtures/check-docs/**` and the `$TF/harness/phase7-*` helper files; no other claim changed.

## Supplement cycle 3
- M7-1 applied: B3 check 3 counts only `withkynam` lines that do not carry `upstream-attribution`; self-test fixture pair added (untagged fails, tagged passes).
- R7-3 resolved: GLOSSARY files are not required to contain an install line; only README and QUICKSTART (EN and VI) must; the self-test fixtures include a glossary without one that passes.

Supplement (ripple of 2026-10-29 decisions): model labels corrected to front-matter reality (research, plan, validate, tester = opus; innovate, spec, update-process = sonnet; EXECUTE = opus; Phase 1 A1 table, Decision B). README/docs rewording keeps the Phase 1 facts (7 opus / 8 sonnet; research/plan/validate rows = opus) and reintroduces no cost-saving percentage unless measured; Exit Gate re-runs the Phase 1 claim grep.

## Supplement (PVL cycle 5 MUST-FIX)
- M7-2 applied: the Exit Gate README agent-table `for` loop now escapes the backticks (Phase 1 R1.12 form) and still accepts both `vc-` and `vb-` spellings (`v[cb]-`). Checked with `bash -n` on a scratch file plus one read-only run.
- Phase Loop Progress steps 1 and 3 now name `vb-research-agent` / `vb-plan-agent` (this phase runs after the Phase 6 rename and restart).
- Validate Contract above is kept unchanged; status: cycle 5 CONDITIONAL, MUST-FIX addressed, re-validate from V1.

## Supplement (sync after scope decisions 2026-10-30)

- Pointer check: Phase 3 no longer builds `pointer-check.mjs` (decision D); Phase 7 uses Phase 4's `$TF/p4-tools/pointer-check.mjs` as a before (Entry Gate) / after (C2, Exit Gate) comparison, `comm -13` empty.
- Check 4a: the Phase 3 census lines now carry counts; Phase 7 compares with the count column removed and lists count changes for the reviewer (strictness stated in check 4).
- `AGENTS.md` <= 32,768 bytes at entry and exit (standing contract from Phase 4; Phase 7 does not edit it).
- `golden/guardrails.json` exists from Phase 3 step B (agents unchanged since `b17294d`); wording about guardrails frozen 'by slimming' is obsolete. The Validate Contract (R7-6, E7) is kept verbatim as history.
- Not changed here: the QUICKSTART/GLOSSARY files and 8 banners still in this plan conflict with the umbrella decision to fold them into the READMEs (umbrella C-CLEAN 'Phase-plan wording needed'); that belongs to Phase 7's own PVL.
