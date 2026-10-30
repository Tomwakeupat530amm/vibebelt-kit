// In-memory user table. Emails are unique; the key is the email string exactly as given.
export class DuplicateEmailError extends Error {}

export function createDb() {
  const users = new Map();
  let nextId = 1;
  return {
    async insertUser({ email, name }) {
      if (users.has(email)) throw new DuplicateEmailError(email);
      const user = { id: nextId, email, name };
      nextId += 1;
      users.set(email, user);
      return { ...user };
    },
  };
}
