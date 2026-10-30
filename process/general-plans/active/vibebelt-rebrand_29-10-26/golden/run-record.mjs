#!/usr/bin/env node
// golden/run-record.mjs: harness-side run recorder for the Phase 8 B4 golden runs (vibebelt-rebrand
// Phase 3, Step C2). Tested in Phase 3 on fixtures only; used for real only in Phase 8.
// Contract for Phase 8 B4: the subcommands record / verify / subagents and their arguments.
//
// Usage:
//   node run-record.mjs record    <sandbox-dir>  <run-id> [--runs-dir <dir>]
//   node run-record.mjs verify    <sandbox-dir>  <run-id> [--runs-dir <dir>]
//   node run-record.mjs subagents <stream.jsonl> <run-id> [--runs-dir <dir>]
// Default runs dir: golden/runs (the folder of this script + /runs). <run-id> is a file-name-safe
// id: letters, digits, '.', '_' and '-', starting with a letter or digit.
//
// record     writes <runs-dir>/<run-id>.json =
//              {run_id, sandbox_head, agents: {<relative path>: sha256 of the file bytes}, runtime,
//               recorded_at}
//            for every top-level .claude/agents/*.md and .codex/agents/*.toml of the sandbox
//            (directory listing, same rule as signal-census.mjs). sandbox_head = git rev-parse HEAD
//            in the sandbox, which must be the top level of a git work tree (a git worktree is).
//            Refuses (exit 1) to overwrite an existing record, and refuses a sandbox without agent
//            files or without a readable HEAD.
// verify     recomputes sandbox_head and the agents map and exits 1 on any difference (changed,
//            added or missing agent file, or a moved HEAD, e.g. after a commit made during the run).
// subagents  reads a `claude -p --output-format stream-json --verbose` transcript line by line and
//            adds subagent_types: [sorted unique] to the record, taken from tool_use content blocks
//            (message.content[]) whose name is Task or Agent (input.subagent_type). Lines that are not
//            JSON or have another shape are ignored. The field names are UNVERIFIED (no billed probe
//            in Phase 3), so the record also gets subagent_parse: "unverified-schema" until the Phase 8
//            rehearsal run confirms them. Refuses (exit 1) if the record already has subagent_types.
// Exit: 0 ok; 1 refused, verify mismatch, missing record or stream, git failure; 2 usage error.
//
// LIMITATION: a record proves which agent FILES were on disk in the sandbox at record and verify
// time. It does not prove which prompt the model actually loaded during the run.
// No network, no model call. Output lines carry no absolute path.
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { UsageError, compareCodeUnits, listAgentFiles, parseFlags, resolveRoot } from './lib/common.mjs';

const USAGE = [
  'usage: node run-record.mjs record    <sandbox-dir>  <run-id> [--runs-dir <dir>]',
  '       node run-record.mjs verify    <sandbox-dir>  <run-id> [--runs-dir <dir>]',
  '       node run-record.mjs subagents <stream.jsonl> <run-id> [--runs-dir <dir>]',
].join('\n');
const DEFAULT_RUNS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'runs');
const RUN_ID = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const SUBAGENT_TOOLS = new Set(['Task', 'Agent']);

/** A refusal or mismatch that ends the command with exit 1. */
class RecordError extends Error {}

function gitEnv() {
  const env = { ...process.env };
  for (const name of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR']) delete env[name];
  return env;
}

function git(sandbox, args) {
  const r = spawnSync('git', args, {
    cwd: sandbox,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: gitEnv(),
  });
  if (r.error) throw new RecordError(`cannot run git: ${r.error.message}`);
  if (r.status !== 0) throw new RecordError(`git ${args.join(' ')} failed in the sandbox: ${r.stderr.trim()}`);
  return r.stdout.trim();
}

function sandboxHead(sandbox) {
  const top = git(sandbox, ['rev-parse', '--show-toplevel']);
  if (fs.realpathSync(top) !== fs.realpathSync(sandbox)) {
    throw new RecordError('the sandbox is not the top level of its git work tree');
  }
  return git(sandbox, ['rev-parse', '--verify', 'HEAD']);
}

function agentHashes(sandbox) {
  const agents = {};
  for (const file of listAgentFiles(sandbox)) {
    agents[file.rel] = crypto.createHash('sha256').update(fs.readFileSync(file.abs)).digest('hex');
  }
  return agents;
}

function readRecord(file, runId) {
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') throw new RecordError(`no record for run ${runId}`);
    throw err;
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new RecordError(`record for run ${runId} is not valid JSON`);
  }
}

function writeJsonAtomic(file, value) {
  const tmp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(tmp, file);
}

function record(sandbox, runId, file) {
  const agents = agentHashes(sandbox);
  const count = Object.keys(agents).length;
  if (count === 0) throw new RecordError('refusing to record: no agent files in the sandbox');
  const head = sandboxHead(sandbox);
  const value = { run_id: runId, sandbox_head: head, agents, runtime: process.version, recorded_at: new Date().toISOString() };
  fs.mkdirSync(path.dirname(file), { recursive: true });
  try {
    fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  } catch (err) {
    if (err.code === 'EEXIST') throw new RecordError(`refusing to overwrite the existing record for run ${runId}`);
    throw err;
  }
  process.stdout.write(`record: ${runId} ${count} agent files, head ${head}\n`);
}

function verify(sandbox, runId, file) {
  const saved = readRecord(file, runId);
  const problems = [];
  const head = sandboxHead(sandbox);
  if (head !== saved.sandbox_head) problems.push(`sandbox_head: recorded ${saved.sandbox_head}, now ${head}`);
  const before = saved.agents ?? {};
  const now = agentHashes(sandbox);
  for (const rel of Object.keys(before).sort(compareCodeUnits)) {
    if (!(rel in now)) problems.push(`missing: ${rel}`);
    else if (now[rel] !== before[rel]) problems.push(`changed: ${rel}`);
  }
  for (const rel of Object.keys(now).sort(compareCodeUnits)) {
    if (!(rel in before)) problems.push(`added: ${rel}`);
  }
  if (problems.length > 0) throw new RecordError(`verify FAILED for run ${runId}\n${problems.join('\n')}`);
  process.stdout.write(`verify: OK ${runId} (${Object.keys(now).length} agent files, head ${head})\n`);
}

function subagents(stream, runId, file) {
  const saved = readRecord(file, runId);
  if ('subagent_types' in saved) throw new RecordError(`refusing to overwrite subagent_types of run ${runId}`);
  let text;
  try {
    text = fs.readFileSync(stream, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT' || err.code === 'EISDIR') throw new RecordError('stream file not found');
    throw err;
  }
  const types = new Set();
  let parsed = 0;
  let ignored = 0;
  for (const line of text.split('\n')) {
    if (line.trim() === '') continue;
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      ignored += 1;
      continue;
    }
    parsed += 1;
    const content = event?.message?.content;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      const type = block?.input?.subagent_type;
      if (block?.type === 'tool_use' && SUBAGENT_TOOLS.has(block.name) && typeof type === 'string' && type !== '') {
        types.add(type);
      }
    }
  }
  saved.subagent_types = [...types].sort(compareCodeUnits);
  saved.subagent_parse = 'unverified-schema';
  writeJsonAtomic(file, saved);
  process.stdout.write(
    `subagents: ${runId} [${saved.subagent_types.join(', ')}] (${parsed} JSON lines read, ${ignored} non-JSON lines ignored; unverified-schema)\n`,
  );
}

function main(argv) {
  let command;
  let target;
  let runId;
  let file;
  try {
    const { flags, positionals } = parseFlags(argv, { '--runs-dir': 'value' }, 3);
    [command, target, runId] = positionals;
    if (!['record', 'verify', 'subagents'].includes(command)) throw new UsageError(`unknown command ${command ?? '(none)'}`);
    if (target === undefined || runId === undefined) throw new UsageError(`${command} needs two arguments`);
    if (!RUN_ID.test(runId)) throw new UsageError(`run-id must match ${RUN_ID}`);
    if (command !== 'subagents') target = resolveRoot(target);
    file = path.join(path.resolve(flags['--runs-dir'] ?? DEFAULT_RUNS_DIR), `${runId}.json`);
  } catch (err) {
    if (!(err instanceof UsageError)) throw err;
    process.stderr.write(`run-record: ${err.message}\n${USAGE}\n`);
    return 2;
  }
  try {
    if (command === 'record') record(target, runId, file);
    else if (command === 'verify') verify(target, runId, file);
    else subagents(target, runId, file);
  } catch (err) {
    if (!(err instanceof RecordError)) throw err;
    process.stderr.write(`run-record: ${err.message}\n`);
    return 1;
  }
  return 0;
}

process.exitCode = main(process.argv.slice(2));
