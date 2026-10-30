// Minimal request router. A route is a chain of steps run in order. Each step returns either
// { response } to answer and stop, or { request } to pass a (possibly changed) request on.
import { createUser } from './handlers/create-user.mjs';
import { validateSignup } from './validate.mjs';

const routes = {
  'POST /users': [validateSignup, createUser],
};

export async function handle(request, db) {
  const steps = routes[`${request.method} ${request.path}`];
  if (!steps) return { status: 404, body: { error: 'not_found' } };
  let current = { ...request, body: { ...request.body } };
  for (const step of steps) {
    const result = await step(current, db);
    if (result.response) return result.response;
    current = result.request;
  }
  return { status: 500, body: { error: 'no_response' } };
}
