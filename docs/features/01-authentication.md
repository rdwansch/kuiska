# Feature 1 — Authentication

- **Status:** Implemented
- **Contract readiness:** Current-state boundary; implementation already exists
- **User story:** [US-01 — Register and sign in](../business/user-stories.md#us-01-register-and-sign-in)
- **Depends on:** None
- **Unblocks:** Every authenticated creator, room, dashboard, and leaderboard flow

## Objective

A player can create an account, sign in, and retain a server-recognised session.
This identity boundary must exist before Kuiska accepts owned quizzes, saved
attempts, or room participation.

## Implemented scope

- Email-and-password registration with username and display name fields.
- Email-and-password sign-in.
- Server-side session lookup for protected feature services.
- Zod validation, safe authentication errors, and Argon2 password hashing.
- Better Auth persistence through the existing Drizzle/MySQL schema.

## Explicitly out of scope

- Password reset and forgot-password UI. The technical authentication document
  describes the intended flow, but the current feature implementation does not
  provide it.
- Social providers, passwordless login, multi-factor authentication, roles, and
  account administration.
- Public profile design; rooms may depend on identity without expanding this
  authentication feature.

## Technical reference

Use [`authentication.md`](../technical/authentication.md) for the current
architecture and [`project-architecture.md`](../technical/project-architecture.md)
for layer boundaries. Current source code remains authoritative for implemented
behaviour.

## Definition of Done

- [x] A player can register with a valid username, email, and password.
- [x] A registered player can sign in with email and password.
- [x] Invalid input and invalid credentials return safe errors.
- [x] Server code can resolve the authenticated session.
- [x] Passwords use the configured Argon2 hashing implementation.

## Handoff boundary

Do not reimplement authentication while starting Feature 2 or a later feature.
Do not infer that password reset is implemented from its technical design.
