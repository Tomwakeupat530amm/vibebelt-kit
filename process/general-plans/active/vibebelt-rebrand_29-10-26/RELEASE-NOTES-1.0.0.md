# vibebelt-kit 1.0.0

## Tóm tắt (Tiếng Việt)

- vibebelt-kit 1.0.0 là bản phát hành đầu tiên: quy trình RIPER-5 bảy bước, 15 agent và 33 skill cho Claude Code và Codex, đổi tiền tố từ `vc-` sang `vb-`.
- Cài đặt: chạy lệnh một dòng trong README, trong thư mục dự án của bạn (cần Node.js 22 trở lên và Git).
- Đã thử: cài vào thư mục trống, cài vào dự án đang có, và nâng cấp từ bộ kit gốc, trên Linux (WSL). Chưa thử trên Windows (Git Bash) và macOS.
- Dự án đang có: tệp của bộ kit bị ghi đè, tệp của bạn được giữ nguyên; `.claude/`, `.codex/`, `.agents/`, `CLAUDE.md`, `AGENTS.md`, `GUIDE.md` được sao lưu vào `.vibecode-backup/` trước.
- Chưa kiểm chứng: chưa chạy bài so sánh chất lượng giữa bộ kit mới và bộ kit gốc (người dùng quyết định bỏ qua). Xem danh sách đầy đủ ở mục "Known gaps" bên dưới.

## What it is

vibebelt-kit is a free add-on for Claude Code and Codex, two AI coding assistants that run in a terminal. It gives the assistant a fixed way of working called RIPER-5: seven steps, and each step has a check that must pass before the next one starts. The assistant writes a plan you can read, waits for your OK before it builds anything, and a separate tester re-runs the checks.

It is a fork of vibecode-pro-max-kit (https://github.com/withkynam/vibecode-pro-max-kit) by its original authors, MIT license, started from their version 3.2.5. The version number starts again at 1.0.0.

## How to install

Run this inside your project folder (Linux, macOS, or Windows inside Git Bash or WSL; not PowerShell or Command Prompt). You need Node.js 22 or newer and Git.

```bash
curl -fsSL https://raw.githubusercontent.com/Tomwakeupat530amm/vibebelt-kit/main/install.sh | bash
```

Then open Claude Code or Codex in the same folder and say `Run vb-setup`.

Note: this public command was not run during testing. The installer was tested from a local copy of the kit (`VB_KIT_SOURCE=<folder> bash install.sh`), which uses the same script.

## What changed from the original kit (3.2.5)

- New name and prefix: every agent, skill and hook is now `vb-` instead of `vc-`. The manifest is `vb-manifest.json`; the state files are `.vb-version`, `.vb-installed-files` and `.vb-publish-config`; environment variables are `VB_*` (for example `VB_KIT_SOURCE`); the four upper-case signals such as `VC-PREDICT-DEEP-NEEDED` are now `VB-...`. The old names are still read and moved to the new ones.
- Same workflow: all 7 RIPER-5 phases, all 15 agents and all 33 skills are kept. Signal strings such as `PHASE_COMPLETE:` and `Gate: PASS` are unchanged. The agents' instructions are the original ones: compared file by file, the only differences are the rename and `effort: max` on the execute, fast-mode and quick-fix agents.
- Safer upgrades: when you install over an older kit, only old kit files you never changed are removed. Old kit files you edited are kept and listed. Your own skills are never touched.
- Fixes: contradictions in the documentation; the documented model policy now matches the agent files (7 agents on opus, 8 on sonnet); the execute, fast-mode and quick-fix agents use `effort: max`; `AGENTS.md` fits under the 32 KiB that Codex reads; 4 broken document pointers; skill trigger keywords; `vb-intent-clarify` split into smaller files; the installer's manifest reader no longer depends on the version number; the end-to-end test now handles Windows paths and works when the kit and the temp folder are on different drives.
- Documentation: the README is written for non-developers, in Vietnamese (`README.md`) and English (`docs/i18n/README.en.md`), each with a quick start and a glossary.
- No longer shipped (still in the git history): README translations other than English and Vietnamese, the CONTRIBUTING and SECURITY translations, `MIGRATION.md` (the upstream guide for moving from 2.x to 3.x), the maintainer notes under `docs/`, `.github/FUNDING.yml` and the old community chat link.

## What the installer does to an existing project

- Kit files are overwritten and your own files stay. Before that, `.claude/`, `.codex/`, `.agents/`, `CLAUDE.md`, `AGENTS.md` and `GUIDE.md` are copied into `.vibecode-backup/` (an older backup is renamed, not overwritten).
- Your own skills and notes next to kit files are not removed.
- An existing `.claude/settings.json` is left untouched, so the kit's hooks are not added to it automatically. To add them, copy the "Hooks block" from the `[1.0.0]` section of `CHANGELOG.md` into the `hooks` key of your settings file, keeping your own entries.
- The kit's own documents under `process/development-protocols/` and `process/_seeds/` are overwritten and are not part of the backup. If you changed them, copy them somewhere else first.

Tested on Linux: the backups were byte-identical to the originals, your files stayed in place, and `settings.json` was left as it was.

## If you used the original kit (vibecode-pro-max-kit 3.x)

What we observed in testing (an install of the original 3.2.5 upgraded by this release):

- Run the vibebelt-kit install command in your project. It replaces `.vc-version` with `.vb-version` (1.0.0), removes the old `vc-` kit files you did not change, keeps and lists the ones you edited (`kept (modified): ...`), and leaves your own skills alone. It shows no downgrade warning.
- After that, `vb-update` compares 1.0.0 with 1.0.0 and shows no downgrade warning.
- Do not use the original kit's `vc-update` skill to switch. It reads `vc-manifest.json`, which vibebelt-kit no longer has, so its version step fails. Use the install command instead.
- The backup folder is still called `.vibecode-backup/`.

## Known gaps

- **Quality-equivalence check not done (user decision, 2026-10-30).** The planned check that runs the same sample tasks on the original kit and on this release and lets a blind judge compare the results was skipped to save model usage. There is no measured proof that output quality is at least equal to the original kit. What was checked instead: the automated validators (no result worse than the original baseline), the install and upgrade tests, unchanged signal strings, and agent instructions that differ from the original only by the rename and the effort setting.
- **KG1 live routing unmeasured.** Whether Claude Code and Codex pick the right `vb-` skill or agent in real sessions, after the rename and the keyword tuning, was not measured (one manual spot check only).
- **KG2 split-skill and stream-json behaviour unmeasured.** Whether agents still load the split `vb-intent-clarify` reference files correctly at run time was not measured, and neither were the event names in Claude Code's stream-json output that the maintainers' sample-task recorder relies on (a maintainer tool, not shipped).
- **KG3 native Windows and macOS untested.** Only Linux (WSL on Windows) was tested. The commands below let you try it.
- **KG-P7-1 real non-coder and public-URL install unverified.** The install was tested from a local copy by scripts, not by a real non-developer and not through the public `curl ... | bash` URL, which only works once the repository is published.
- **Forbidden-link check only by grep.** No automated check guards the docs against the old chat link, the old brand name, the old GIF host or a funding file. The release check ran a one-time search (`chat.whatsapp.com`, `Flowser`, `tenor`, `FUNDING`) over the shipped docs and `.github`, with no hits.
- **Trial E needs the `upstream-baseline` tag.** The upgrade test (Trial E in `node --test e2e-kit-flows.test.mjs`) needs the git tag `upstream-baseline` in the kit checkout. In a clone without that tag, Trial E fails with "Trial E needs the upstream-baseline tag of the kit repo (git fetch --tags)".
- **Backup folder still `.vibecode-backup/`.** The installer's backup folder, the matching ignore rule and the name `CLAUDE.md.pre-vibecode` keep the old name on purpose: renaming them would move where existing users find their backups.
- Node.js 22 or newer is required (the installer stops on older versions).
- The Vietnamese text has not been reviewed by a native speaker.

Checks that only a user or a real CI run can close:

1. Linux Node 22 install plus `node --test e2e-kit-flows.test.mjs`: passed here on Linux Node 22.23.4 (WSL), trials A-E; a run on a real Ubuntu CI machine has not happened yet.
2. GitHub settings: private vulnerability reporting, Discussions and Sponsorship (see the list below).
3. A real `.agents/skills` symlink on Ubuntu CI: on a native Linux clone here it is a working link and `validate-skills` and `validate-context-discovery` pass; the first GitHub Actions run of `validate.yml` will confirm it on CI.
4. Executable bits on Windows-native checkouts: not checked.
5. The installer's manifest reader under Linux Node 22: passed here (418 files resolved).
6. `.agents/skills` stored with git mode 120000 on a real Linux checkout: confirmed here on a native Linux clone (mode 120000, link to `../.claude/skills`).

## Try it on native Windows or macOS (not tested by us)

Windows, inside Git Bash (comes with Git for Windows; not PowerShell):

```bash
node --version          # needs v22 or newer
mkdir -p ~/vb-try && cd ~/vb-try
curl -fsSL https://raw.githubusercontent.com/Tomwakeupat530amm/vibebelt-kit/main/install.sh | bash
cat .vb-version                       # expect 1.0.0
ls .claude/agents/*.md | wc -l        # expect 15
ls -d .claude/skills/vb-*/ | wc -l    # expect 33
ls -la .agents/                       # skills: a link, or a copied folder when Windows Developer Mode is off
```

macOS, in Terminal:

```bash
node --version          # needs v22 or newer
mkdir -p ~/vb-try && cd ~/vb-try
curl -fsSL https://raw.githubusercontent.com/Tomwakeupat530amm/vibebelt-kit/main/install.sh | bash
cat .vb-version                       # expect 1.0.0
ls .claude/agents/*.md | wc -l        # expect 15
ls -d .claude/skills/vb-*/ | wc -l    # expect 33
```

To run the kit's own tests on either system, clone the repository with its tags and run them from the checkout:

```bash
git clone https://github.com/Tomwakeupat530amm/vibebelt-kit.git && cd vibebelt-kit
git fetch --tags
node --test e2e-kit-flows.test.mjs           # 5 trials; Trial E needs the upstream-baseline tag
node scripts/test-compute-sync-plan.mjs
```

Please report what you see in a GitHub issue (paste the last lines of the output).

## GitHub settings only the repository owner can change

- Create or verify the repository `Tomwakeupat530amm/vibebelt-kit`, its description and topics.
- Turn on private vulnerability reporting (Settings, Security): `SECURITY.md` asks people to report problems through it.
- Decide on Discussions. The old community chat link was removed and there is no replacement channel yet.
- Keep Sponsorship off (`.github/FUNDING.yml` was removed), unless you add your own.
- Issues on; branch protection for `main`, Pages and release visibility as you prefer.
