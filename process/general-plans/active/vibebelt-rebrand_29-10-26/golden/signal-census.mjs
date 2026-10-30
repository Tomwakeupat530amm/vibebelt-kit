#!/usr/bin/env node
// golden/signal-census.mjs: signal census of the agent prompts (vibebelt-rebrand Phase 3, Step A2).
// Contract for Phase 7 check 4 and Phase 8 B4.6(b); keep the CLI and the line format stable.
//
// Usage: node signal-census.mjs [--root <dir>] [--neutral] [--out <file>]
//   --root <dir>   tree to scan (default: the current directory)
//   --neutral      rewrite VC-/VB- at token start to V?- and vc-/vb- inside tokens to v?-
//   --out <file>   write the census to <file> (same bytes as stdout; stdout stays empty)
// Exit: 0 ok; 1 no agent file found (guards against a vacuous empty census); 2 usage error.
//
// Input: top-level regular files of <root>/.claude/agents/*.md and <root>/.codex/agents/*.toml,
// found by directory listing (never a vc-* glob; subfolders ignored). Agent key = file name
// without extension, minus a leading vc- or vb-; two files with the same key and kind are counted
// together. Text = the WHOLE file (.md incl. front-matter; .toml incl. developer_instructions, raw,
// escapes not decoded), with \r\n normalised to \n.
//
// Token classes. Every class is matched with explicit boundaries: no letter, digit, _ or -
// directly before or after the token. Classes are independent (one string can count in two).
//   phase-complete  "PHASE_COMPLETE: " + a name of words [A-Z][A-Z0-9_-]* joined by single spaces
//                   (PLAN, PLAN-SUPPLEMENT and UPDATE PROCESS are distinct tokens)
//   colon-signal    [A-Z][A-Z0-9]*([_-][A-Z0-9]+)+ followed by ":" (SPAWN_REQUEST:, QUICK_FIX_ABORT:);
//                   a single word such as THIS: or MUST: can never match. Two tokens are DROPPED
//                   from this class (decision E12): "PHASE_COMPLETE:" (phase-complete class) and
//                   every V[CB]-...: token (prefix-signal class), so those signals count once.
//   prefix-signal   V[CB]-WORD(-WORD)+ with or without a trailing colon (the colon is not kept)
//   status          DONE, DONE_WITH_CONCERNS, BLOCKED, NEEDS_CONTEXT, CONTEXT_PARTIAL as whole
//                   tokens (BLOCKED-skipped is not BLOCKED; "NEEDS_CONTEXT (partial)" counts)
//   gate            Gate: PASS | Gate: CONDITIONAL | Gate: BLOCKED
//   mode            [MODE: ...] exact text up to the closing bracket on the same line
//
// Output: one line per distinct (key, kind, class, token):
//   <key>\t<md|toml>\t<class>\t<token>\t<count>
// sorted by code units (= LC_ALL=C sort here), final newline, no header, no timestamps, no
// absolute paths. Deterministic: two runs on the same tree give identical bytes. No network and
// no model call.
import fs from 'node:fs';
import {
  UsageError,
  compareCodeUnits,
  listAgentFiles,
  parseFlags,
  resolveRoot,
  toLf,
  writeResult,
} from './lib/common.mjs';

const USAGE = 'usage: node signal-census.mjs [--root <dir>] [--neutral] [--out <file>]';
const EDGE = '[\\p{L}\\p{Nd}_-]';

function bounded(body) {
  return new RegExp(`(?<!${EDGE})(?:${body})(?!${EDGE})`, 'gu');
}

const CLASSES = Object.freeze([
  { cls: 'phase-complete', re: bounded('PHASE_COMPLETE: [A-Z][A-Z0-9_-]*(?: [A-Z][A-Z0-9_-]*)*') },
  {
    cls: 'colon-signal',
    re: bounded('[A-Z][A-Z0-9]*(?:[_-][A-Z0-9]+)+:'),
    drop: (token) => token === 'PHASE_COMPLETE:' || /^V[CB]-/.test(token),
  },
  { cls: 'prefix-signal', re: bounded('V[CB]-[A-Z]+(?:-[A-Z]+)+') },
  { cls: 'status', re: bounded('DONE_WITH_CONCERNS|NEEDS_CONTEXT|CONTEXT_PARTIAL|BLOCKED|DONE') },
  { cls: 'gate', re: bounded('Gate: (?:PASS|CONDITIONAL|BLOCKED)') },
  { cls: 'mode', re: bounded('\\[MODE: [^\\]\\n]+\\]') },
]);

function neutral(token) {
  return token.replace(/^V[CB]-/, 'V?-').replace(/v[cb]-/g, 'v?-');
}

function census(files, neutralise) {
  const counts = new Map();
  for (const file of files) {
    const text = toLf(fs.readFileSync(file.abs, 'utf8'));
    for (const { cls, re, drop } of CLASSES) {
      for (const match of text.matchAll(re)) {
        if (drop && drop(match[0])) continue;
        const token = neutralise ? neutral(match[0]) : match[0];
        const id = `${file.key}\t${file.kind}\t${cls}\t${token}`;
        counts.set(id, (counts.get(id) ?? 0) + 1);
      }
    }
  }
  const lines = [...counts].map(([id, n]) => `${id}\t${n}`).sort(compareCodeUnits);
  return lines.length > 0 ? `${lines.join('\n')}\n` : '';
}

function main(argv) {
  let flags;
  let root;
  try {
    ({ flags } = parseFlags(argv, { '--root': 'value', '--neutral': 'bool', '--out': 'value' }));
    root = resolveRoot(flags['--root']);
  } catch (err) {
    if (!(err instanceof UsageError)) throw err;
    process.stderr.write(`signal-census: ${err.message}\n${USAGE}\n`);
    return 2;
  }
  const files = listAgentFiles(root);
  if (files.length === 0) {
    process.stderr.write(
      `signal-census: no agent files found under ${flags['--root'] ?? '.'} (.claude/agents/*.md, .codex/agents/*.toml)\n`,
    );
    return 1;
  }
  writeResult(census(files, flags['--neutral'] === true), flags['--out']);
  return 0;
}

process.exitCode = main(process.argv.slice(2));
