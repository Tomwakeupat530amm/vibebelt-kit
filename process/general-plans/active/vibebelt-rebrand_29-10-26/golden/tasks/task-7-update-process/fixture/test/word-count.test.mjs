import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wordCount } from '../src/word-count.mjs';

test('counts words separated by spaces and punctuation', () => {
  assert.equal(wordCount('Hello, world! How are you?'), 5);
});

test('keeps apostrophes inside words', () => {
  assert.equal(wordCount("don't stop"), 2);
});

test('returns 0 for empty or blank text', () => {
  assert.equal(wordCount(''), 0);
  assert.equal(wordCount('   '), 0);
});

test('counts letters outside ASCII', () => {
  assert.equal(wordCount('Xin chào thế giới'), 4);
});

test('throws a TypeError for non-string input', () => {
  assert.throws(() => wordCount(null), TypeError);
});
