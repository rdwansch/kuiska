# Feature 3 — Quiz Taking and Scoring

- **Status:** Implemented
- **Contract readiness:** Implementation-ready
- **User stories:** [US-04 — Take a quiz from a shared link](../business/user-stories.md#us-04-take-a-quiz-from-a-shared-link); [US-05 — Save an authenticated result](../business/user-stories.md#us-05-save-an-authenticated-result)
- **Depends on:** Feature 2 — Quiz Creation
- **Unblocks:** Feature 4 — Social Trivia Rooms; Feature 5 — Public Discovery and Curation; Feature 6 — Dashboard and History; Feature 7 — Categories and Random Quiz; Feature 8 — Global Leaderboard

## Objective

Guests and authenticated users can open a quiz URL, answer every question, and
receive a server-calculated score. This is the standalone quiz flow reused by
future social modes; it is not itself a room or battle implementation.
Authenticated users have their completed attempt persisted; guest results exist
only for the current session.

## Scope

### In scope

- `GET /quizzes/[quizId]` for public quiz access.
- A secret-code gate for private quizzes before question content is exposed.
- Rendering questions and options without exposing correctness data.
- One selected option per question and a complete-answer requirement.
- Server-side scoring: `correctAnswers / totalQuestions * 100`.
- A result view with `X of Y correct` and `Z%`.
- Persisting one `quizAttempt` for every successful authenticated submission.
- Sign-in and sign-up calls to action for guests without persisting their result.

### Explicitly out of scope

- Per-question answer review or revealing correct answers.
- Editing answers after submission.
- Attempt history UI, dashboard UI, or leaderboard UI.
- Random quiz selection and category discovery.
- Rooms, shared timers, opponent state, challenge links, and time-based room
  ranking. Those belong to Feature 4.
- Image display and image upload; media is not part of Feature 2.
- Guest account creation or guest attempt persistence.

## Data model

After Feature 2 tables exist, add `quizAttempt` to `src/lib/db/schema.ts` and
generate a Drizzle migration.

| Column           | Type and constraint            | Purpose                                  |
| ---------------- | ------------------------------ | ---------------------------------------- |
| `id`             | `varchar(36)`, primary key     | Server-generated identifier.             |
| `quizId`         | `varchar(36)`, FK to `quiz.id` | Required completed quiz.                 |
| `userId`         | `varchar(36)`, FK to `user.id` | Required for persisted attempts.         |
| `totalQuestions` | integer                        | Question-count snapshot at submission.   |
| `correctAnswers` | integer                        | Server-calculated correct count.         |
| `score`          | integer                        | Server-calculated integer from 0 to 100. |
| `createdAt`      | timestamp                      | Required audit timestamp.                |

Do not add an answer-history table yet. The current feature needs a result
summary only; answer-level persistence belongs to a later feature with a clear
user requirement.

## Security and validation contract

1. The browser may receive only quiz, question, and option identifiers,
   positions, and display content. It must never receive `option.isCorrect`.
2. The submission payload contains `quizId` and one `optionId` per `questionId`.
3. On submission, the service reloads the quiz structure and correct options
   from the database. Never trust a client-provided score or question count.
4. Verify that every submitted option belongs to its submitted question and that
   every submitted question belongs to the requested quiz.
5. A private quiz validates its secret code with Argon2 before displaying
   questions and again before scoring a submission.
6. Do not include the secret code in a URL, log, attempt record, or error
   response. An invalid code always returns: `Secret code is invalid.`
7. Persist an attempt only when there is an authenticated session and the
   submission passes validation.

If the quiz does not exist, return the Next.js not-found response. For a private
quiz without a valid code, do not expose title, description, questions, or
options.

## Required structure

Follow [the project architecture](../technical/project-architecture.md). All
feature files use the `QuizTaking` prefix.

```text
src/
├── app/quizzes/[quizId]/page.tsx                     # Route composition only
└── features/quiz-taking/
    ├── components/QuizTakingAccessForm.tsx           # Private-code form
    ├── components/QuizTakingForm.tsx                 # Question and answer UI
    ├── components/QuizTakingResult.tsx               # Result and guest CTA
    ├── hooks/QuizTakingHook.ts                       # Answer and submit state
    ├── repositories/QuizTakingRepository.ts          # Sanitised reads and attempt insert
    ├── schemas/QuizTakingSchema.ts                   # Zod access and submit schemas
    ├── services/QuizTakingService.ts                 # Access control and scoring
    ├── types/QuizTakingType.ts                       # Feature types
    └── index.ts                                      # Public feature API
```

The service owns authorization, secret-code verification, and score calculation.
The repository owns Drizzle queries and `quizAttempt` insertion. `page.tsx` must
not execute ORM queries or decide visibility access.

## User flows

### Public quiz

```text
Guest or authenticated user
  → /quizzes/<quizId>
  → server loads a sanitised public quiz
  → user answers every question
  → user submits answers
  → server reloads data and calculates the score
  → result is displayed
  → authenticated user: quizAttempt is persisted
  → guest: sign-in/sign-up CTA is displayed; no persistence
```

### Private quiz

```text
Guest or authenticated user
  → /quizzes/<quizId>
  → secret-code form is displayed; questions are withheld
  → server verifies the code
  → sanitised question data is displayed
  → user answers and submits with the same secret code
  → server verifies the code again and calculates the score
  → result is displayed; authenticated user gets a persisted attempt
```

## UI requirements

- Use `docs/technical/design-system.md` tokens and shared components.
- Render all options for a question as radio buttons.
- Disable submission until every question has an answer and while the request is
  pending.
- Show only summary-level score information; do not reveal the answer key.
- Display guest calls to action linking to `/signin` and `/signup`.
- Use success and destructive colours for result status only, not brand styling.

## Definition of Done

- [x] Guests and authenticated users can play public quizzes.
- [x] Private quiz content is not returned before a valid secret code.
- [x] Correct-answer data is not sent to the browser before or after submission.
- [x] The server calculates the score from persisted quiz data.
- [x] A cross-quiz or cross-question option submission is rejected.
- [x] Every successful authenticated submission creates one `quizAttempt`.
- [x] Guest submissions display a result without creating `quizAttempt` data.
- [x] The Drizzle schema and migration are committed together.
- [x] `npm run typecheck` and `npm run lint` pass.

## Handoff boundary

Stop when the Definition of Done is met. Do not implement rooms, shared timers,
challenge links, dashboards, attempt history, leaderboards, random quizzes,
answer review, quiz editing, or answer-level persistence.
