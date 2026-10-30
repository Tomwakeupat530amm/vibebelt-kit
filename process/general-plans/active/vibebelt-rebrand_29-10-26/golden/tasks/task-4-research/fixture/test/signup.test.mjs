import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDb } from '../src/db.mjs';
import { handle } from '../src/server.mjs';

const signup = (body) => ({ method: 'POST', path: '/users', body });

test('creates a user', async () => {
  const db = createDb();
  assert.deepEqual(await handle(signup({ email: 'ann@example.com', name: 'Ann' }), db), { status: 201, body: { id: 1 } });
});

test('rejects a taken email, whatever its case', async () => {
  const db = createDb();
  await handle(signup({ email: 'ann@example.com', name: 'Ann' }), db);
  assert.deepEqual(await handle(signup({ email: ' Ann@Example.COM ', name: 'Other' }), db), {
    status: 409,
    body: { error: 'email_taken' },
  });
});

test('rejects an invalid email before the handler runs', async () => {
  const db = createDb();
  assert.deepEqual(await handle(signup({ email: 'not-an-email', name: 'Ann' }), db), {
    status: 400,
    body: { error: 'invalid_signup' },
  });
});

test('unknown routes are 404', async () => {
  assert.deepEqual(await handle({ method: 'GET', path: '/nope', body: {} }, createDb()), {
    status: 404,
    body: { error: 'not_found' },
  });
});
