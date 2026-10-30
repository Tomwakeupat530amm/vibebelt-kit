import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../src/slugify.mjs';

test('lowercases words and joins them with single hyphens', () => {
  assert.equal(slugify('Hello World'), 'hello-world');
});

test('collapses runs of spaces and punctuation into one hyphen, none at either end', () => {
  assert.equal(slugify('  Rock & Roll -- Live!  '), 'rock-roll-live');
});

test('keeps digits', () => {
  assert.equal(slugify('Top 10 Tips'), 'top-10-tips');
});

test('returns an empty string when nothing is left', () => {
  assert.equal(slugify('!!!'), '');
});

test('throws a TypeError for non-string input', () => {
  assert.throws(() => slugify(42), TypeError);
});
