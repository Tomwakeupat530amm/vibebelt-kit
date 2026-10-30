<p align="center"><a href="../../README.md">Tiếng Việt</a> | <strong>English</strong></p>

<!-- vibecoder-top:start -->
# vibebelt-kit

**Make your AI coding assistant plan first, check its own work, and keep notes about your project.**

[![Version](https://img.shields.io/badge/version-1.0.0-2EA043)](../../CHANGELOG.md) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE) ![Agents](https://img.shields.io/badge/agents-15-orange) ![Skills](https://img.shields.io/badge/skills-33-purple)

vibebelt-kit is a free add-on for Claude Code and Codex, two AI coding assistants that run in a terminal. It gives the assistant a fixed way of working called RIPER-5: seven steps (phases), and each step has a check that must pass before the next one starts. The assistant writes a plan you can read, waits for your OK before it builds anything, and then a separate tester re-runs the checks. You talk to it in everyday words.

Install it with one line, run inside your project folder:

```bash
curl -fsSL https://raw.githubusercontent.com/Tomwakeupat530amm/vibebelt-kit/main/install.sh | bash
```
<!-- verified in Phase 8: the public install URL works only after the repository is published; Phase 8 tests it for real; remove this note after that test passes -->

Then open Claude Code or Codex in the same folder and say `Run vb-setup`. The Quick start below walks you through every step.

## What it looks like

| You say | The kit does |
|---|---|
| "Add a contact form to my website." | Asks a few short questions, writes down what you want for you to check, plans the change, waits for your OK, builds it, then a separate tester re-runs the checks. |
| "When I click the login button, nothing happens. Please fix it." | Collects evidence to find the real cause first, then fixes it and tests the fix. |
| "quick fix: the footer says 2025, change it to 2026" | Finds the line, tells you the exact change in one sentence, makes it after you say yes, then runs a quick check. |
<!-- vibecoder-top:end -->

## Quick start

<!-- quick-start:start -->
Five minutes, seven steps. Words in bold are explained in the [Glossary](#glossary).

### 1. Check what you need

- **Claude Code** or **Codex**, installed and signed in.
- **Node.js** version 22 or newer. To check, open a **terminal** and type `node --version`.
- **Git**, which the installer uses to download the kit. To check, type `git --version`.
- On Windows: run everything in **Git Bash** or **WSL**, not in PowerShell or Command Prompt. The installer is a **bash** script.

So far the kit is tested on Linux, running under WSL on Windows. The installer also has support for macOS and for Git Bash, but these have not been tested yet.

### 2. Install

Open a terminal in your project folder and paste:

```bash
curl -fsSL https://raw.githubusercontent.com/Tomwakeupat530amm/vibebelt-kit/main/install.sh | bash
```

This copies the kit into your project. If your project already has a `.claude/`, `.codex/` or `.agents/` folder, or a `CLAUDE.md` or `AGENTS.md` file, the installer first saves a copy of them in `.vibecode-backup/`. Then it adds the kit's files: a file with the same name as a kit file, including `CLAUDE.md` and `AGENTS.md`, is replaced by the kit's version. Your own plans and notes in `process/` stay as they are; the kit only updates its own files there. An existing `.claude/settings.json` is kept unchanged. You can run the command again at any time; it makes a new backup first.

### 3. Open your assistant in the same folder

Type `claude` to start Claude Code, or `codex` to start Codex. Start it from your project folder, so it can see the new files.

### 4. Say the first sentence

Type: `Run vb-setup`

vb-setup is a **skill**: saved instructions the assistant follows. It looks at your project, asks you questions about it, shows you what it found, and asks before it changes anything. Then it sets up the rest of the `process/` folder and writes notes about your project there.

### 5. What you will see

The assistant writes short messages and waits for your answers. Answer in plain words. When it is done, your project has a `process/context/` folder with notes that the assistant reads before every task.

### 6. Ask for your first change

Describe what you want, for example: "Add a dark mode switch to the settings page." The kit then works through its steps, one **phase** at a time: research, spec, a written **plan** and so on. After each phase it stops and waits: say `go` to continue. Before it writes any code, it waits for two phrases: `ENTER VALIDATE MODE` (check the plan) and `ENTER EXECUTE MODE` (build it). Everyday use, below, lists every phrase.

### 7. If you get stuck

Tell the assistant what you see, in your own words, for example "I got this error: ..." or "What should I do next?". Install problems are covered in Troubleshooting, below.
<!-- quick-start:end -->

## Everyday use

The kit works in seven steps, called phases. It moves to the next phase only when you say so, and each phase has a check (a gate) that must pass first.

Type the phrases in the "You say" column exactly as shown. Describe what you want in your own words.

| Phase | What happens | You say |
|---|---|---|
| 1. Research | Reads your project and collects facts. Changes nothing. | Describe what you want, or `ENTER RESEARCH MODE` |
| 2. Spec | Writes down what you asked for, in plain words, for you to check. | `go` or `ENTER SPEC MODE` |
| 3. Innovate | Compares two or three ways to build it and picks one. | `go` or `ENTER INNOVATE MODE` |
| 4. Plan | Writes a step-by-step plan, including the files it will touch. | `go` or `ENTER PLAN MODE` |
| 5. Validate | Looks for gaps in the plan and lists the tests that must pass. | `ENTER VALIDATE MODE` |
| 6. Execute | Builds exactly what the plan says. A separate tester then re-runs the tests. | `ENTER EXECUTE MODE` |
| 7. Update-Process | Saves what it learned to the project notes and files away the finished plan. | `ENTER UPDATE PROCESS MODE` |

### Shortcuts for smaller jobs

| Shortcut | Use it for | You say |
|---|---|---|
| Quick fix | A small, low-risk change. No plan file. If the change turns out to be risky (for example it touches login or payments), the kit switches to the full flow. | `quick fix:` followed by what to change, or `ENTER QUICK FIX MODE` |
| Fast mode | A medium change: research to validate in one pass, then it stops for your OK before it builds. | `ENTER FAST MODE -` followed by what you want |
| Autopilot | The whole flow without stopping. It asks all its questions once, at the start. | `autopilot` followed by what you want (or `autopilot quick:`, `autopilot fast:`, `autopilot full:`) |

Autopilot still stops and asks you before anything it cannot undo or that reaches the outside world (publishing, sending messages, spending money), before a test that costs money, and when two phases in a row are stuck. Say `stop autopilot` to end it.

## Keep the kit up to date

Say `Run vb-update` in Claude Code or Codex. It downloads the newest kit, shows you what would change, and changes nothing until you say yes. It never changes your plans and notes without asking.

You can also run the install command again; it backs up the current kit files first.

## Coming from vibecode-pro-max-kit

vibebelt-kit is a fork (a renamed copy that is developed separately) of vibecode-pro-max-kit. It keeps the same workflow; its changes (new name, fixes, clearer docs) were checked with the kit's automated checks. Agent and skill names now start with `vb` instead of `vc`.

To switch:

1. In your project folder, run the install command from the Quick start. Do not use the old kit's update skill: it keeps downloading the old kit.
2. Open Claude Code or Codex and say `Run vb-update`. The installer asks you to do this because it finds your old setup.

What happens to your files:

- Your old setup is copied to `.vibecode-backup/` before anything changes.
- An old kit file is removed only when the installer can prove you never changed it: it compares the file's fingerprint (a hash) with the original kit file.
- Files you changed, and files it does not recognize, are kept. The installer lists each one as `kept`; delete them yourself when you no longer need them.
- Two small record files, `.vb-version` (your kit version) and `.vb-installed-files` (the list of kit files), replace the old ones.
- Your plans and notes in `process/` stay where they are.

## Troubleshooting

| Problem | What to do |
|---|---|
| The installer says `Node.js is required` or `Node.js >= 22 required` | Install Node.js 22 or newer from https://nodejs.org, open a new terminal, and run the install command again. |
| The installer says `git is required` | Install Git from https://git-scm.com, then run the install command again. |
| On Windows, the command fails in PowerShell or Command Prompt | Open Git Bash (it comes with Git for Windows) or WSL, and run it there. |
| The installer says `ln -sf failed` and `Copied skills` | Only a warning: Codex still finds the skills. To let Codex pick up future updates by itself, turn on Windows Developer Mode and run the install command again. |
| The assistant does not know `vb-setup` | Start Claude Code or Codex from your project folder (where you ran the install). If it was already open, close it and start it again. |
| Hooks do not run in a project that already had `.claude/settings.json` | The installer keeps your file unchanged. Add the hooks from the `hooks` block in [CHANGELOG.md](../../CHANGELOG.md) (section 1.0.0) to your file, and keep your own settings. `Run vb-update` also points this out. |
| The installer lists files as `kept` | They are old kit files that you may have changed. Check them, then delete the ones you no longer need. |
| Something broke after installing | Your previous files are in `.vibecode-backup/`. Copy back what you need, or ask for help (see Get help). |

## Glossary

<!-- glossary:start -->
| Term | What it means | Everyday comparison |
|---|---|---|
| **agent** | An AI helper with one job, such as research or testing. The kit has 15 agents. | One specialist on a team. |
| **bash** | The command language the installer is written in. | The language a recipe is written in. |
| **branch** | A separate line of work in Git. It does not change the main version until it is merged. | A draft copy of a document. |
| **Claude Code** | Anthropic's AI coding assistant. It runs in a terminal. | A programmer you chat with. |
| **Codex** | OpenAI's AI coding assistant. It also runs in a terminal. | The same idea, from another company. |
| **commit** | A saved snapshot of your project in Git, with a short note. | A save point in a game. |
| **context** | The kit's notes about your project, kept in `process/context/`. | A handbook the assistant reads before each task. |
| **gate** | A check that must pass before the next phase can start. | An inspection before the walls go up. |
| **Git** | A tool that records every change to your project. | "Track changes" for a whole folder. |
| **Git Bash** | A terminal for Windows that comes with Git for Windows and understands bash. | A translator between Windows and bash. |
| **hook** | A small script that runs by itself at set moments, for example to stop the assistant from reading secret files such as `.env` unless you allow it. | A smoke alarm: it acts without being asked. |
| **Node.js** | A free program that runs JavaScript. The kit's helper scripts need version 22 or newer. | The engine the kit's small tools run on. |
| **phase** | One of the seven steps: Research, Spec, Innovate, Plan, Validate, Execute, Update-Process. | One stage of building a house. |
| **plan** | A written list of what will change and how it will be checked, made before any code is written. | A blueprint. |
| **RIPER-5** | The name of the kit's step-by-step workflow (the seven phases above). | A recipe with fixed steps. |
| **skill** | Saved instructions that an agent follows for one kind of task, such as `vb-setup`. | A recipe card. |
| **terminal** | A window where you type commands instead of clicking. | Texting instructions to your computer. |
| **validate** | The phase that looks for gaps in the plan and lists the tests that must pass. | A second pair of eyes on the blueprint. |
| **WSL** | Windows Subsystem for Linux: Linux running inside Windows. | A Linux room in a Windows house. |
<!-- glossary:end -->

## What is inside

| Part | Count | What it is |
|---|---|---|
| Agents | 15 | AI helpers, one per job (list below). |
| Skills | 33 | Saved instructions for tasks such as planning, testing and setup (list below). |
| Hooks | 10 | Small safety scripts, for example one that blocks reading `.env` files and keys unless you allow it. |
| Workflow documents | 22 | The shared rules every agent follows, in `process/development-protocols/`. |
| Checks | 38 | Scripts that test the kit's own structure (called validators). |

After the install and `vb-setup`, your project has:

```text
your-project/
├── .claude/        agents, skills and hooks for Claude Code
├── .codex/         the same agents for Codex
├── .agents/skills  a link that lets Codex find the same skills
├── CLAUDE.md       the rules Claude Code reads at the start of a session
├── AGENTS.md       the same rules for Codex
└── process/        your plans, reports and project notes
```

### 15 Agents

Seven agents use opus, the stronger model; eight use sonnet, the lighter and cheaper one. You do not call agents yourself: the assistant picks them.

| Agent | Model | What it does |
|---|---|---|
| `vb-research-agent` | opus | Reads your code and the web. Changes nothing. |
| `vb-spec-agent` | sonnet | Writes down what you asked for, for you to check. |
| `vb-innovate-agent` | sonnet | Compares two or three ways to build it. |
| `vb-plan-agent` | opus | Writes the step-by-step plan. |
| `vb-validate-agent` | opus | Checks the plan and lists the tests that must pass. |
| `vb-execute-agent` | opus | Builds what the plan says. |
| `vb-fast-mode-agent` | opus | Runs Fast mode. |
| `vb-quick-fix-agent` | opus | Makes one small quick fix and checks it. |
| `vb-update-process-agent` | sonnet | Saves what was learned and files the finished plan. |
| `vb-tester` | opus | Re-runs the tests on its own after a build. |
| `vb-debugger` | sonnet | Finds the real cause of a bug, with evidence. |
| `vb-code-reviewer` | sonnet | Reviews code before it is called done. |
| `vb-code-simplifier` | sonnet | Makes code easier to read without changing what it does. |
| `vb-ui-ux-designer` | sonnet | Builds screens that follow your design. |
| `vb-git-manager` | sonnet | Saves changes as clear, separate commits. |

### 33 Skills

Skills are saved instructions the agents use. The assistant picks the right ones from the words in your request; you can also ask for one by name, as in `Run vb-setup`.

| Group | Skills |
|---|---|
| Setup and updates | `vb-setup` · `vb-update` · `vb-publish` |
| Understanding the project | `vb-context-discovery` · `vb-plan-discovery` · `vb-generate-context` · `vb-review-situation` · `vb-scout` · `vb-docs-seeker` |
| Requests and plans | `vb-intent-clarify` · `vb-generate-spec` · `vb-generate-plan` · `vb-generate-phase-program` · `vb-agent-strategy-compare` · `vb-predict` |
| Checking plans and tests | `vb-validate-findings` · `vb-test-coverage-plan` · `vb-feasibility-test` · `vb-scenario` · `vb-risk-evidence-pack` · `vb-security` |
| Running and finishing | `vb-autopilot` · `vb-autoresearch` · `vb-generate-closeout` |
| Keeping the kit healthy | `vb-audit-vc` · `vb-audit-context` · `vb-audit-plans` |
| Solving problems | `vb-debug` · `vb-problem-solving` · `vb-sequential-thinking` |
| Web and design | `vb-frontend-design` · `vb-web-testing` · `vb-agent-browser` |

## Get help

- Questions and ideas: [GitHub Discussions](https://github.com/Tomwakeupat530amm/vibebelt-kit/discussions).
- Bugs: [open an issue](https://github.com/Tomwakeupat530amm/vibebelt-kit/issues/new?template=1.bug_report.yml) (a bug report on GitHub) and paste what the installer or the assistant printed.
- Security problems: do not open a public issue; follow [SECURITY.md](../../SECURITY.md) to report privately.

## Contributing and changes

- [CONTRIBUTING.md](../../CONTRIBUTING.md): how to suggest changes.
- [CHANGELOG.md](../../CHANGELOG.md): what changed in each version.

## Credits and license

vibebelt-kit is a fork of [vibecode-pro-max-kit](https://github.com/withkynam/vibecode-pro-max-kit) by its original authors, used under the MIT License. The original copyright notice is kept in [LICENSE](../../LICENSE). <!-- upstream-attribution -->

License: MIT. [LICENSE](../../LICENSE) keeps the original line `Copyright (c) 2026 vibecode` and adds `Copyright (c) 2026 Tomwakeupat530amm` for this fork.
