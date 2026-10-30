// Stores a new user. The storage layer decides what "already taken" means.
import { DuplicateEmailError } from '../db.mjs';

export async function createUser(request, db) {
  try {
    const user = await db.insertUser({ email: request.body.email, name: request.body.name });
    return { response: { status: 201, body: { id: user.id } } };
  } catch (err) {
    if (err instanceof DuplicateEmailError) {
      return { response: { status: 409, body: { error: 'email_taken' } } };
    }
    throw err;
  }
}
