#!/usr/bin/env node
// golden/gen-guardrails.mjs: guardrail-section hasher for the agent prompts (vibebelt-rebrand
// Phase 3, Step B2). Contract for Phase 8 B4.6(d); keep the CLI and JSON schema 1 stable.
//
// Usage: node gen-guardrails.mjs [--root <dir>] [--out <file>]
//   --root <dir>   tree to scan (default: the current directory)
//   --out <file>   write the JSON to <file> (stdout stays empty)
// Without --out the JSON goes to stdout and NO file is written: the script never writes
// golden/guardrails.json implicitly, so it is safe to run against any tree.
// Exit: 0 ok; 1 a .toml developer_instructions value cannot be read exactly (an INVALID escape,
// reported as <file>:<line>, or a missing / unsupported / unterminated value); 2 usage error.
// The script never guesses.
//
// Sources per agent key (top-level .claude/agents/*.md and .codex/agents/*.toml, directory
// listing; key = file name without extension minus a leading vc- or vb-):
//   md    the whole file text
//   toml  the developer_instructions value, a TOML multi-line basic string """...""", DECODED per
//         TOML 1.0 before hashing: \b \t \n \f \r \" \\ \uXXXX \UXXXXXXXX (Unicode scalar values
//         only), and a line-ending backslash (backslash, optional spaces/tabs, newline) trims that
//         newline plus all following spaces, tabs and newlines. A newline right after the opening
//         """ is trimmed. Any other escape exits 1.
// md and toml are separate lists: they are never compared with each other.
//
// Headings: lines inside fenced code blocks (opened by a line starting with ``` or ~~~, closed by
// the next line starting with the same fence) are never headings. A selected heading is ATX level
// 2 or 3 ("## " / "### ") whose text after the hashes and one space EQUALS "Phase Lock" or
// "Completion", or STARTS WITH one of: Purpose, Entry Requirement, Strictly Forbidden, Violation
// Prevention, Session Start, Context Loading, Status Reporting, Autonomous /goal.
// Section bytes: from the heading line up to (not including) the next heading outside a fence
// whose level is <= the section's level, or the end of the text. A level-2 section therefore
// includes its level-3 children; a selected level-3 section is also recorded on its own. \r\n is
// normalised to \n, trailing whitespace at the end of the section is stripped, then sha256 (hex)
// of the UTF-8 bytes.
//
// Output (JSON schema 1, 2-space indent, final newline, no root path, no time):
//   {"schema":1,"agents":{"<key>":{"md":[{"heading":"<full heading line>","level":2,"sha256":"<hex>"}],"toml":[...]}}}
// Every agent key from the directory listing is present ("md":[] / "toml":[] when nothing is
// selected); agents sorted by key; entries in document order. No network, no model call.
import crypto from 'node:crypto';
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

const USAGE = 'usage: node gen-guardrails.mjs [--root <dir>] [--out <file>]';
const EQUALS = Object.freeze(['Phase Lock', 'Completion']);
const PREFIXES = Object.freeze([
  'Purpose',
  'Entry Requirement',
  'Strictly Forbidden',
  'Violation Prevention',
  'Session Start',
  'Context Loading',
  'Status Reporting',
  'Autonomous /goal',
]);
const SIMPLE_ESCAPES = new Map([
  ['b', '\b'],
  ['t', '\t'],
  ['n', '\n'],
  ['f', '\f'],
  ['r', '\r'],
  ['"', '"'],
  ['\\', '\\'],
]);

/** A .toml value that cannot be read exactly; `line` is 1-based or null. */
class TomlError extends Error {
  constructor(file, line, reason) {
    super(line === null ? `${file}: ${reason}` : `${file}:${line}: ${reason}`);
  }
}

function lineAt(text, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) if (text[i] === '\n') line += 1;
  return line;
}

/** Returns the decoded developer_instructions value of a .toml agent file. */
function developerInstructions(raw, file) {
  const text = toLf(raw);
  const keys = [...text.matchAll(/^[ \t]*developer_instructions[ \t]*=[ \t]*/gm)];
  if (keys.length === 0) throw new TomlError(file, null, 'no developer_instructions value');
  if (keys.length > 1) throw new TomlError(file, lineAt(text, keys[1].index), 'second developer_instructions key');
  const start = keys[0].index + keys[0][0].length;
  if (!text.startsWith('"""', start)) {
    throw new TomlError(file, lineAt(text, start), 'developer_instructions is not a multi-line basic string """...""" (unsupported form)');
  }
  let i = start + 3;
  if (text[i] === '\n') i += 1;
  let out = '';
  while (i < text.length) {
    const ch = text[i];
    if (ch === '"') {
      let run = 0;
      while (text[i + run] === '"') run += 1;
      if (run >= 3) {
        if (run > 5) throw new TomlError(file, lineAt(text, i), 'more than five quotes at the closing delimiter');
        return out + '"'.repeat(run - 3);
      }
      out += '"'.repeat(run);
      i += run;
      continue;
    }
    if (ch !== '\\') {
      out += ch;
      i += 1;
      continue;
    }
    let j = i + 1;
    while (text[j] === ' ' || text[j] === '\t') j += 1;
    if (text[j] === '\n') {
      while (text[j] === ' ' || text[j] === '\t' || text[j] === '\n') j += 1;
      i = j;
      continue;
    }
    const esc = text[i + 1] ?? '';
    if (SIMPLE_ESCAPES.has(esc)) {
      out += SIMPLE_ESCAPES.get(esc);
      i += 2;
      continue;
    }
    if (esc === 'u' || esc === 'U') {
      const width = esc === 'u' ? 4 : 8;
      const hex = text.slice(i + 2, i + 2 + width);
      if (hex.length !== width || !/^[0-9A-Fa-f]+$/.test(hex)) {
        throw new TomlError(file, lineAt(text, i), `invalid escape \\${esc}${hex}`);
      }
      const codePoint = Number.parseInt(hex, 16);
      if (codePoint > 0x10ffff || (codePoint >= 0xd800 && codePoint <= 0xdfff)) {
        throw new TomlError(file, lineAt(text, i), `invalid escape \\${esc}${hex} (not a Unicode scalar value)`);
      }
      out += String.fromCodePoint(codePoint);
      i += 2 + width;
      continue;
    }
    throw new TomlError(file, lineAt(text, i), `invalid escape \\${esc}`);
  }
  throw new TomlError(file, lineAt(text, start), 'unterminated developer_instructions string');
}

function isSelected(level, title) {
  if (level !== 2 && level !== 3) return false;
  return EQUALS.includes(title) || PREFIXES.some((prefix) => title.startsWith(prefix));
}

function trimTrailingWhitespace(text) {
  let end = text.length;
  while (end > 0 && ' \t\n\r\f\v'.includes(text[end - 1])) end -= 1;
  return text.slice(0, end);
}

/** Returns the selected sections of a text, in document order, with their sha256. */
function guardrailSections(source) {
  const lines = toLf(source).split('\n');
  const headings = [];
  let fence = null;
  lines.forEach((line, index) => {
    if (fence !== null) {
      if (line.startsWith(fence)) fence = null;
      return;
    }
    if (line.startsWith('```') || line.startsWith('~~~')) {
      fence = line.slice(0, 3);
      return;
    }
    const atx = /^(#{1,6})(?:[ \t]|$)/.exec(line);
    if (!atx) return;
    const level = atx[1].length;
    const selected = line.startsWith(`${atx[1]} `) && isSelected(level, line.slice(level + 1));
    headings.push({ index, level, line, selected });
  });
  const sections = [];
  headings.forEach((heading, n) => {
    if (!heading.selected) return;
    const next = headings.slice(n + 1).find((other) => other.level <= heading.level);
    const body = trimTrailingWhitespace(lines.slice(heading.index, next ? next.index : lines.length).join('\n'));
    sections.push({
      heading: heading.line,
      level: heading.level,
      sha256: crypto.createHash('sha256').update(body, 'utf8').digest('hex'),
    });
  });
  return sections;
}

function main(argv) {
  let flags;
  let root;
  try {
    ({ flags } = parseFlags(argv, { '--root': 'value', '--out': 'value' }));
    root = resolveRoot(flags['--root']);
  } catch (err) {
    if (!(err instanceof UsageError)) throw err;
    process.stderr.write(`gen-guardrails: ${err.message}\n${USAGE}\n`);
    return 2;
  }
  const agents = new Map();
  try {
    for (const file of listAgentFiles(root)) {
      if (!agents.has(file.key)) agents.set(file.key, { md: [], toml: [] });
      const raw = fs.readFileSync(file.abs, 'utf8');
      const source = file.kind === 'md' ? raw : developerInstructions(raw, file.rel);
      agents.get(file.key)[file.kind].push(...guardrailSections(source));
    }
  } catch (err) {
    if (!(err instanceof TomlError)) throw err;
    process.stderr.write(`gen-guardrails: ${err.message}\n`);
    return 1;
  }
  const sorted = {};
  for (const key of [...agents.keys()].sort(compareCodeUnits)) sorted[key] = agents.get(key);
  writeResult(`${JSON.stringify({ schema: 1, agents: sorted }, null, 2)}\n`, flags['--out']);
  return 0;
}

process.exitCode = main(process.argv.slice(2));
