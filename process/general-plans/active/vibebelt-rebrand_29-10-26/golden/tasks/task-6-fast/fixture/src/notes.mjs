// Tiny in-memory notes store. A note is { id, text, createdAt } with createdAt in milliseconds.
export function createStore() {
  return { notes: [], nextId: 1 };
}

export function addNote(store, text, { now = Date.now() } = {}) {
  if (typeof text !== 'string' || text.trim() === '') {
    throw new TypeError('note text must be a non-empty string');
  }
  const note = { id: store.nextId, text: text.trim(), createdAt: now };
  store.nextId += 1;
  store.notes.push(note);
  return { ...note };
}

export function listNotes(store) {
  return store.notes.map((note) => ({ ...note }));
}
