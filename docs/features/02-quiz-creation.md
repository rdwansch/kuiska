# Feature 2 — Quiz Creation

- **Status:** Implemented — pending commit
- **Contract readiness:** Implementation-ready
- **User stories:** [US-02 — Create a quiz](../business/user-stories.md#us-02-create-a-quiz); [US-03 — Choose public or private access](../business/user-stories.md#us-03-choose-public-or-private-access)
- **Depends on:** Feature 1 — Authentication
- **Unblocks:** Feature 3 — Quiz Taking and Scoring; Feature 4 — Social Trivia Rooms; Feature 5 — Public Discovery and Curation; Feature 6 — Dashboard and History

## Objective

An authenticated user can create a complete multiple-choice quiz that is ready
for standalone play and future social trivia rooms. A quiz has metadata, a
visibility policy, and one or more questions with answer options.

## Scope

### In scope

- `GET /quizzes/new`, accessible only to authenticated users.
- Quiz metadata: title, short description, and one static category.
- Static categories: `technology`, `general`, and `entertainment`.
- Public and private quiz visibility.
- A generated, category-led abstract cover visual for the feed when the creator
  does not provide media. It uses topical symbols rather than stock photos and
  is a presentation concern, not a stored upload or URL.
- One or more questions; every question has at least two options.
- Exactly one correct option for every question.
- One database transaction for the quiz, questions, and options.
- A post-create success state with a copyable future quiz URL:
  `/quizzes/<quizId>`.

### Explicitly out of scope

- Quiz editing, deletion, drafts, or publish/unpublish states.
- A quiz dashboard or a user's quiz list.
- Quiz playing, scores, attempts, random quizzes, and leaderboards.
- Creator image upload. The project has no storage provider or upload
  configuration; do not add a provider, SDK, or media fields as part of this
  feature. The UI uses the generated cover visual instead.

## Data model

Add the following tables to `src/lib/db/schema.ts` and generate a Drizzle
migration. Use 36-character string IDs to remain consistent with Better Auth.

### `quiz`

| Column                   | Type and constraint            | Purpose                                                  |
| ------------------------ | ------------------------------ | -------------------------------------------------------- |
| `id`                     | `varchar(36)`, primary key     | Server-generated identifier.                             |
| `ownerId`                | `varchar(36)`, FK to `user.id` | Required quiz owner.                                     |
| `title`                  | `varchar(120)`                 | Required; trimmed; 3–120 characters.                     |
| `description`            | `varchar(500)`                 | Required; trimmed; 10–500 characters.                    |
| `category`               | MySQL enum                     | `technology`, `general`, or `entertainment`.             |
| `visibility`             | MySQL enum                     | `public` or `private`.                                   |
| `secretCodeHash`         | `text`, nullable               | Required for private quizzes; `null` for public quizzes. |
| `createdAt`, `updatedAt` | timestamp                      | Required audit timestamps.                               |

### `question`

| Column                   | Type and constraint            | Purpose                                    |
| ------------------------ | ------------------------------ | ------------------------------------------ |
| `id`                     | `varchar(36)`, primary key     | Server-generated identifier.               |
| `quizId`                 | `varchar(36)`, FK to `quiz.id` | Required; `onDelete: cascade`.             |
| `content`                | `text`                         | Required; trimmed; 1–1,000 characters.     |
| `position`               | integer                        | Starts at 1 and is unique within the quiz. |
| `createdAt`, `updatedAt` | timestamp                      | Required audit timestamps.                 |

### `option`

| Column                   | Type and constraint                | Purpose                                          |
| ------------------------ | ---------------------------------- | ------------------------------------------------ |
| `id`                     | `varchar(36)`, primary key         | Server-generated identifier.                     |
| `questionId`             | `varchar(36)`, FK to `question.id` | Required; `onDelete: cascade`.                   |
| `content`                | `varchar(500)`                     | Required; trimmed; 1–500 characters.             |
| `isCorrect`              | boolean                            | Exactly one option must be correct per question. |
| `position`               | integer                            | Starts at 1 and is unique within the question.   |
| `createdAt`, `updatedAt` | timestamp                          | Required audit timestamps.                       |

Define Drizzle relations for `user → quizzes`, `quiz → questions`, and
`question → options` as needed by the repository layer.

## Validation and security contract

Create a Zod schema in `src/features/quiz-creation/schemas/`.

1. Trim all user-supplied text before validation.
2. Require at least one question.
3. Require at least two non-empty options per question.
4. Require exactly one `isCorrect: true` option per question.
5. Require a 4–64 character `secretCode` for private quizzes.
6. Reject and do not persist a secret code for public quizzes.
7. Derive `ownerId` from the server-side session, never from form input.
8. Hash a private secret code with the existing Argon2 mechanism before storage.
   Never return or log the raw secret code.

## Required structure

Follow [the project architecture](../technical/project-architecture.md). All
feature files use the `QuizCreation` prefix.

```text
src/
├── app/quizzes/new/page.tsx                         # Route composition only
└── features/quiz-creation/
    ├── components/QuizCreationForm.tsx               # Client form UI
    ├── hooks/QuizCreationHook.ts                     # Form and question state
    ├── repositories/QuizCreationRepository.ts        # Drizzle transaction
    ├── schemas/QuizCreationSchema.ts                 # Zod input schema
    ├── services/QuizCreationService.ts               # Auth, validation, orchestration
    ├── types/QuizCreationType.ts                     # Feature types
    └── index.ts                                      # Public feature API
```

`page.tsx` must not contain ORM queries, validation, or business rules.
Repositories do not access requests or sessions. Services authorize the user,
validate input, hash the secret when necessary, and call repositories.

## User flow

```text
Authenticated user
  → /quizzes/new
  → enters quiz metadata
  → adds questions and options
  → selects one correct option per question
  → submits the form
  → service validates the session and input
  → service hashes the private secret code when applicable
  → repository persists all records in one transaction
  → UI shows success and /quizzes/<quizId>
```

Unauthenticated users are redirected to `/signin`. A failed persistence
operation must not leave a partial quiz, question, or option in the database.

## UI requirements

- Use the tokens and components in `docs/technical/design-system.md`.
- Render quiz metadata before the question editor.
- **Add question** creates one empty question.
- **Add option** creates an option in its owning question.
- Use radio buttons, not checkboxes, for the correct answer.
- Disable submit while the request is pending.
- On success, show an explicit confirmation and copyable quiz URL. Do not
  silently clear the form.
- Show the generated cover visual in the creation preview. It must remain
  useful without an uploaded image.

## Definition of Done

- [x] Unauthenticated users cannot open or submit the create-quiz flow.
- [x] A public quiz persists with `secretCodeHash = null`.
- [x] A private quiz cannot be persisted without a secret code; the database
      stores only its hash.
- [x] Server validation rejects no questions, fewer than two options, and any
      question without exactly one correct option.
- [x] A failed write leaves no partial records.
- [ ] The Drizzle schema and migration are committed together.
- [x] `npm run typecheck` and `npm run lint` pass.

## Handoff boundary

Stop when the Definition of Done is met. Do not implement Feature 3 behaviour,
social trivia rooms, creator image uploads, dashboards, random selection, or
leaderboard functionality.
