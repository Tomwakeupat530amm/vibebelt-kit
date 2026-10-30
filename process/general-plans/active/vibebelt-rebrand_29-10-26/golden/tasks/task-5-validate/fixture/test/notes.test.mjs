import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addNote, createStore, listNotes } from '../src/notes.mjs';

test('adds trimmed notes with increasing ids', () => {
  const store = createStore();
  assert.deepEqual(addNote(store, '  buy milk ', { now: 10 }), { id: 1, text: 'buy milk', createdAt: 10 });
  assert.equal(addNote(store, 'call mom', { now: 20 }).id, 2);
});

test('rejects empty or non-string text', () => {
  const store = createStore();
  assert.throws(() => addNote(store, '   '), TypeError);
  assert.throws(() => addNote(store, 42), TypeError);
});

test('lists notes oldest first, as copies', () => {
  const store = createStore();
  addNote(store, 'first', { now: 1 });
  addNote(store, 'second', { now: 2 });
  const list = listNotes(store);
  assert.deepEqual(list.map((note) => note.text), ['first', 'second']);
  list[0].text = 'changed';
  assert.equal(listNotes(store)[0].text, 'first');
});
