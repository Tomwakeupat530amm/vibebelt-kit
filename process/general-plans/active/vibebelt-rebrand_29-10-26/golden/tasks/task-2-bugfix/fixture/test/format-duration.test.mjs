import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDuration } from '../src/format-duration.mjs';

test('pads seconds below ten', () => {
  assert.equal(formatDuration(65), '1:05');
});

test('formats whole minutes', () => {
  assert.equal(formatDuration(600), '10:00');
});

test('formats zero', () => {
  assert.equal(formatDuration(0), '0:00');
});

test('keeps two-digit seconds', () => {
  assert.equal(formatDuration(59), '0:59');
});
