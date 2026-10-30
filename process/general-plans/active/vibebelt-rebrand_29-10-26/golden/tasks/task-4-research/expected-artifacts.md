# task-4-research: expected artifacts

Entry phase: RESEARCH (a plain "how does this work here" question; the user asks for no changes). Validity agent: research-agent. Variables and procedures: `old-sandbox-recipe.md`, `rubric.md`.

## Fixture facts (before any run)

- `node --test test/signup.test.mjs` from the sandbox root exits 0 (4 of 4 pass).
- The facts the answer should contain (from the code):
  - The API answers status 409 with body `{ error: 'email_taken' }`.
  - That answer is decided in `createUser` (`src/handlers/create-user.mjs`), which catches the `DuplicateEmailError` thrown by `insertUser` in the in-memory table from `createDb` (`src/db.mjs`).
  - `insertUser` compares the email string exactly. Different spellings such as `Ann@Example.COM` and `ann@example.com` still collide only because `validateSignup` (`src/validate.mjs`) trims and lowercases the email before the handler runs.
  - The path: `handle` in `src/server.mjs` looks up the route `POST /users` and runs its steps in order, `validateSignup` then `createUser`; a step that returns `{ response }` stops the chain.
  - Invalid input never reaches the handler: `validateSignup` answers 400 `{ error: 'invalid_signup' }`.

## Artifacts by role

| Role | Where | Expectation |
|---|---|---|
| Answer | the final message | present |
| Files | anywhere | none changed (research is read-only) |

## Scripted checks (computed, never judged)

- S3 status: `grep -cE '\*\*Status:\*\* (DONE|DONE_WITH_CONCERNS|NEEDS_CONTEXT)' "$OUT/stream.neutral.jsonl"` prints 1 or more.
- S5 tests: `(cd "$SB" && node --test test/signup.test.mjs)` exits 0.
- S6 changed files, with:

```bash
MUST=''
MAY=''
```

- S7 agents: the prefix-stripped `subagent_types` contain `research-agent`.

## Judged notes (added to J1-J4 in the judge input)

- J1: the answer states the 409 and its body, where it is decided, and that the case-insensitive collision comes from the lowercasing in `validateSignup`, not from the table; nothing invented.
- J2: the whole path is covered (router, validation step, handler, storage), including the early 400 exit.
- J3: file paths and function names are given.
- J4: the answer says what it checked and that it changed nothing.
