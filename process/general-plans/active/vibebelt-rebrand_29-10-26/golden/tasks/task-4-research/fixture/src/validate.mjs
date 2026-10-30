// Checks and normalises the sign-up body before any handler sees it.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignup(request) {
  const email = typeof request.body.email === 'string' ? request.body.email.trim().toLowerCase() : '';
  const name = typeof request.body.name === 'string' ? request.body.name.trim() : '';
  if (!EMAIL.test(email) || name === '') {
    return { response: { status: 400, body: { error: 'invalid_signup' } } };
  }
  return { request: { ...request, body: { ...request.body, email, name } } };
}
