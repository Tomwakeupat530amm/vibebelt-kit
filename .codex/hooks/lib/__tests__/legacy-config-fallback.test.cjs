/**
 * Tests: hook config files and env variables named before the kit's prefix rename are still honored.
 * Run: node .codex/hooks/lib/__tests__/legacy-config-fallback.test.cjs   (exit 0 = all pass)
 *
 * Codex lookup order per slot: .codex/<new> > .codex/<old> > .claude/<new> > .claude/<old> > .claude/.ck.json
 * (global: $CODEX_HOME first, then ~/.claude).
 * (a) the old config file alone is honored (local .codex/, Claude-era .claude/, global $CODEX_HOME);
 * (b) the new config file wins when both exist;
 * (c) the old usage-cache env variable is honored when the new one is unset (the new one wins);
 * (d) the privacy checker reads the old config file too, and the new one wins.
 * Every line that names an old name carries the tag that keeps it out of the rename.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Isolated HOME and CODEX_HOME: the user's real config must never leak into these results.
const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'legacy-config-fallback-codex-'));
const home = path.join(sandbox, 'home');
const codexHome = path.join(home, '.codex');
fs.mkdirSync(path.join(home, '.claude'), { recursive: true });
fs.mkdirSync(codexHome, { recursive: true });
process.env.HOME = home;
process.env.USERPROFILE = home;
process.env.CODEX_HOME = codexHome;

const { loadConfig } = require('../vc-config-utils.cjs');
const { getUsageCachePath } = require('../usage-limits-cache.cjs');
const { isPrivacyBlockDisabled } = require('../privacy-checker.cjs');

const NEW_CONFIG = '.vb.json';
const OLD_CONFIG = '.vc.json'; // legacy-vc-fallback
const NEW_ENV = 'VB_USAGE_CACHE_PATH';
const OLD_ENV = 'VC_USAGE_CACHE_PATH'; // legacy-vc-fallback

let passed = 0;
let failed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (e) {
    console.log(`✗ ${name}\n  ${e.message}`);
    failed++;
  }
}

function project(files) {
  const dir = fs.mkdtempSync(path.join(sandbox, 'project-'));
  for (const [rel, value] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), JSON.stringify(value));
  }
  return dir;
}

function inDir(dir, fn) {
  const prev = process.cwd();
  process.chdir(dir);
  try { return fn(); } finally { process.chdir(prev); }
}

test(`(a) local .codex/${OLD_CONFIG} alone is honored`, () => {
  const dir = project({ [`.codex/${OLD_CONFIG}`]: { codingLevel: 2 } });
  assert.strictEqual(inDir(dir, () => loadConfig().codingLevel), 2);
});

test(`(a) Claude-era .claude/${OLD_CONFIG} alone is honored`, () => {
  const dir = project({ [`.claude/${OLD_CONFIG}`]: { codingLevel: 1 } });
  assert.strictEqual(inDir(dir, () => loadConfig().codingLevel), 1);
});

test(`(a) global $CODEX_HOME/${OLD_CONFIG} alone is honored`, () => {
  const globalOld = path.join(codexHome, OLD_CONFIG);
  fs.writeFileSync(globalOld, JSON.stringify({ codingLevel: 3 }));
  try {
    assert.strictEqual(inDir(project({}), () => loadConfig().codingLevel), 3);
  } finally {
    fs.rmSync(globalOld, { force: true });
  }
});

test(`(b) .codex/${NEW_CONFIG} wins over .codex/${OLD_CONFIG}`, () => {
  const dir = project({ [`.codex/${OLD_CONFIG}`]: { codingLevel: 2 }, [`.codex/${NEW_CONFIG}`]: { codingLevel: 4 } });
  assert.strictEqual(inDir(dir, () => loadConfig().codingLevel), 4);
});

test(`(b) .codex/${OLD_CONFIG} wins over the Claude-era .claude/${NEW_CONFIG}`, () => {
  const dir = project({ [`.codex/${OLD_CONFIG}`]: { codingLevel: 2 }, [`.claude/${NEW_CONFIG}`]: { codingLevel: 5 } });
  assert.strictEqual(inDir(dir, () => loadConfig().codingLevel), 2);
});

test(`(c) ${OLD_ENV} is honored when ${NEW_ENV} is unset; ${NEW_ENV} wins`, () => {
  const saved = { [NEW_ENV]: process.env[NEW_ENV], [OLD_ENV]: process.env[OLD_ENV] };
  try {
    delete process.env[NEW_ENV];
    process.env[OLD_ENV] = path.join(sandbox, 'old-cache.json');
    assert.strictEqual(getUsageCachePath(), path.join(sandbox, 'old-cache.json'));
    process.env[NEW_ENV] = path.join(sandbox, 'new-cache.json');
    assert.strictEqual(getUsageCachePath(), path.join(sandbox, 'new-cache.json'));
  } finally {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
});

test(`(d) privacy checker honors ${OLD_CONFIG}; ${NEW_CONFIG} wins`, () => {
  const oldOnly = project({ [`.claude/${OLD_CONFIG}`]: { privacyBlock: false } });
  assert.strictEqual(isPrivacyBlockDisabled(path.join(oldOnly, '.claude')), true);
  const both = project({ [`.claude/${OLD_CONFIG}`]: { privacyBlock: false }, [`.claude/${NEW_CONFIG}`]: { privacyBlock: true } });
  assert.strictEqual(isPrivacyBlockDisabled(path.join(both, '.claude')), false);
});

fs.rmSync(sandbox, { recursive: true, force: true });
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
