# Run flags for every Phase 8 B4 golden run

One flag set and one permission mode, chosen once and used for BOTH kits (OLD and FINAL) and every task. Variables as in `old-sandbox-recipe.md`; `CAP` is the per-run cap of the task's budget class (`tasks.md`).

## The command

Started as a NEW OS process per run, from the sandbox root, with stdin closed so nothing can wait for input:

```bash
cd "$SB" && claude -p "$(cat "$REPO/$GT/$TASK/prompt.md")" \
  --output-format stream-json --verbose \
  --max-budget-usd "$CAP" \
  --permission-mode acceptEdits \
  --allowedTools "Bash Read Write Edit Glob Grep Task Agent" \
  < /dev/null > "$OUT/stream.jsonl" 2> "$OUT/stderr.txt"
echo "claude rc=$?" > "$OUT/exit.txt"
```

Rules:

- No `--model` flag: each kit runs on its own default (E6). Record the model the stream reports in its init event.
- NEVER use --bare: it skips CLAUDE.md discovery and the hooks, so the kit would not be under test.
- `--allowedTools` lists Bash, Read, Write, Edit, Glob, Grep and the subagent tool. The subagent tool name is unverified (KG2), so both `Task` and `Agent` are listed; the rehearsal shows which one the stream uses.
- `--dangerously-skip-permissions` is allowed only inside the throw-away sandbox, and only if the B4.1a rehearsal shows that edits are otherwise blocked. It then replaces `--permission-mode acceptEdits` and `--allowedTools` for BOTH kits, and the choice is recorded.
- `CAP`: fixed per budget class at B4.1a and recorded before the first counted run; the same value for OLD and FINAL (`tasks.md`).

## Rehearsal checks (Phase 8 B4.1a, one acknowledged run of task-1-execute on FINAL, never judged)

Before the rehearsal (no billed call): `claude --help` still lists `-p/--print`, `--output-format`, `--verbose`, `--max-budget-usd`, `--permission-mode`, `--allowedTools` and `--dangerously-skip-permissions`.

From the rehearsal stream, confirm and record:

- the init event: the default model and the tool list;
- a `tool_use` block that spawns the expected agent (name `Task` or `Agent`, `input.subagent_type`), which is what `run-record.mjs subagents` reads;
- the fixture edits were applied (the run could write files);
- no permission denial for a tool the kit needs;
- the final result event with the run's cost (this is C in `tasks.md`).

If a flag, a field name or the permission mode differs from this file, STOP and report: changing this file needs a recorded reason and the user's approval (`FROZEN.md`).

## Values recorded per run

Sandbox path, kit SHA, run id, task, replicate, start time, model, cost from the final result event, `claude` exit code, `run-record.mjs verify` result (see `old-sandbox-recipe.md` step 9).
