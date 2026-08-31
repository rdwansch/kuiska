# Feature 4 — Social Trivia Rooms

- **Status:** Implemented — focused automated tests intentionally deferred by user request
- **Contract readiness:** Implementation-ready
- **User stories:** [US-06 — Create or join a Live Trivia room](../business/user-stories.md#us-06-create-or-join-a-live-trivia-room); [US-07 — Play a Self-Paced Race](../business/user-stories.md#us-07-play-a-self-paced-race); [US-08 — See the final Live Trivia result](../business/user-stories.md#us-08-see-the-final-live-trivia-result)
- **Depends on:** Feature 2 — Quiz Creation; Feature 3 — Quiz Taking and Scoring
- **Unblocks:** Feature 5 public room discovery; future room history

## Objective

Authenticated users can challenge another player in a two-person room. Kuiska
supports two modes built on the same room model:

1. **Live Trivia:** both players answer the same question under one shared timer.
2. **Self-Paced Race:** both players receive the same quiz and progress independently.

The product calls the first release a duel, but the data model exposes
`participants[]` so a future group mode does not require a redesign.

## Scope

### In scope

- Creating a room from an existing quiz and sharing its link or room code.
- Joining a room as its second authenticated participant.
- Exactly two participants per room in the MVP.
- Live Trivia with server-authoritative question position and timer end time.
- Locked answers and a simultaneous answer reveal at the end of each Live
  Trivia question timer.
- Self-Paced Race with independent question progression.
- Final room ranking: correct answers descending, then total answer duration
  ascending.
- A provisional Self-Paced Race rank immediately after a player completes.
- A final result with rematch and share actions.

### Implemented runtime decisions

- Live room state is delivered as authenticated HTTP snapshots. The client polls
  the existing application rather than introducing a real-time provider.
- A Live Trivia question runs for 20 seconds and its shared answer reveal lasts
  3 seconds before the next question opens.
- A Self-Paced Race expires after 24 hours. A deadline marks the room expired
  and finalises incomplete players using their answers so far and the deadline
  as their duration.

### Explicitly out of scope

- More than two participants, teams, matchmaking, bots, or spectator mode.
- Followers, chat, direct messages, reactions, and voice or video features.
- A global leaderboard or quiz-wide historical leaderboard.
- Power-ups, currency, streak economies, and a mascot.
- A new real-time service provider. The transport must be verified against the
  deployment architecture before implementation; the UI consumes server state
  snapshots rather than assuming a specific provider.

## Data model

Add room tables to `src/lib/db/schema.ts` with 36-character string IDs and a
Drizzle migration.

### `gameRoom`

| Column                     | Type and constraint            | Purpose                                         |
| -------------------------- | ------------------------------ | ----------------------------------------------- |
| `id`                       | `varchar(36)`, primary key     | Server-generated room identifier.               |
| `quizId`                   | `varchar(36)`, FK to `quiz.id` | The fixed quiz used by the room.                |
| `creatorId`                | `varchar(36)`, FK to `user.id` | Room creator.                                   |
| `mode`                     | MySQL enum                     | `live_trivia` or `self_paced_race`.             |
| `status`                   | MySQL enum                     | `waiting`, `active`, `completed`, or `expired`. |
| `inviteCode`               | `varchar(32)`, unique          | Shareable, non-sequential room code.            |
| `participantLimit`         | integer, required              | Set to `2` for every MVP room.                  |
| `currentQuestionPosition`  | integer, nullable              | Server-owned Live Trivia question position.     |
| `questionOpenedAt`         | timestamp, nullable            | Server-owned Live Trivia question start.        |
| `questionEndsAt`           | timestamp, nullable            | Server-owned Live Trivia timer end.             |
| `questionRevealEndsAt`     | timestamp, nullable            | Server-owned shared-reveal end time.            |
| `deadlineAt`               | timestamp, nullable            | Self-Paced Race completion deadline.            |
| `startedAt`, `completedAt` | timestamp, nullable            | Room lifecycle timestamps.                      |
| `createdAt`, `updatedAt`   | timestamp                      | Required audit timestamps.                      |

### `roomParticipant`

| Column                                 | Type and constraint                | Purpose                                               |
| -------------------------------------- | ---------------------------------- | ----------------------------------------------------- |
| `id`                                   | `varchar(36)`, primary key         | Server-generated participant identifier.              |
| `roomId`                               | `varchar(36)`, FK to `gameRoom.id` | Required room.                                        |
| `userId`                               | `varchar(36)`, FK to `user.id`     | Required participant.                                 |
| `status`                               | MySQL enum                         | `joined`, `ready`, `playing`, `completed`, or `left`. |
| `joinedAt`, `startedAt`, `completedAt` | timestamp                          | Participant lifecycle timestamps.                     |
| `correctAnswers`                       | integer, default `0`               | Server-calculated final score.                        |
| `totalAnswerDurationMs`                | bigint, default `0`                | Tie-break value in milliseconds.                      |
| `rank`                                 | integer, nullable                  | Final rank after the room completes.                  |

Require a unique `(roomId, userId)` pair. The service enforces the two-player
capacity in the same transaction that creates a participant. Return room
participants as `participants[]` in application types; do not represent the
database relation as a JSON array.

### `roomAnswer`

| Column              | Type and constraint                       | Purpose                             |
| ------------------- | ----------------------------------------- | ----------------------------------- |
| `id`                | `varchar(36)`, primary key                | Server-generated answer identifier. |
| `roomParticipantId` | `varchar(36)`, FK to `roomParticipant.id` | Required answering player.          |
| `questionId`        | `varchar(36)`, FK to `question.id`        | Required room quiz question.        |
| `optionId`          | `varchar(36)`, FK to `option.id`          | Submitted choice.                   |
| `submittedAt`       | timestamp                                 | Required server timestamp.          |
| `isCorrect`         | boolean                                   | Server-calculated answer outcome.   |

Require one answer per `(roomParticipantId, questionId)`. The server checks
that question and option belong to the room's quiz before it writes an answer.
All timestamps used to calculate a duration preserve millisecond precision.

## Game rules

### Live Trivia

1. The creator starts only after the second participant joins.
2. The server sets the current question and `questionEndsAt`.
3. A player can submit once. Their selection locks and stays hidden.
4. The shared timer always finishes, even if both players submit early.
5. At timer end, both answer outcomes and the correct answer are revealed.
6. No running total or current leader appears during the match.
7. After the last question, rank by correct answers, then by the sum of each
   answer duration (`submittedAt - questionOpenedAt`).

### Self-Paced Race

1. Each participant answers the room's quiz in their own order and timing.
2. After completion, the player sees their score and provisional room rank.
3. Rank by correct answers, then by completion duration
   (`completedAt - startedAt`).
4. The rank becomes final when both participants complete or `deadlineAt`
   passes.

## Security and consistency contract

1. Only authenticated users can create or join a room because rooms use public
   player profiles and saved results.
2. Access to a private quiz room requires the same valid secret code before a
   participant can view question content or join the room.
3. The server owns status transitions, timers, correct-answer data, scoring,
   and rank calculation. Never accept these values from the browser.
4. Joining, starting, answering, and finishing must reject invalid room states.
5. A room cannot have duplicate participants or more than two participants.
6. Live Trivia submissions after `questionEndsAt` are rejected.

## Required structure

Follow [the project architecture](../technical/project-architecture.md). All
feature files use the `SocialTrivia` prefix.

```text
src/
├── app/rooms/[inviteCode]/page.tsx
└── features/social-trivia/
    ├── components/SocialTriviaLobby.tsx
    ├── components/SocialTriviaLiveBoard.tsx
    ├── components/SocialTriviaRaceBoard.tsx
    ├── components/SocialTriviaResult.tsx
    ├── hooks/SocialTriviaHook.ts
    ├── repositories/SocialTriviaRepository.ts
    ├── schemas/SocialTriviaSchema.ts
    ├── services/SocialTriviaService.ts
    ├── types/SocialTriviaType.ts
    └── index.ts
```

Use the Match Ticket pattern from
[`design-system.md`](../technical/design-system.md) for invitations, waiting
rooms, and rematch. The live board must not look like a dashboard: show one
question, one shared timer, and one answer decision at a time.

## Definition of Done

- [x] An authenticated creator can create and share a two-player room.
- [x] A participant cannot join twice or join a full room.
- [x] Live Trivia locks answers and reveals them only after every shared timer
      ends.
- [x] Live Trivia never exposes a running score or leader.
- [x] Self-Paced Race lets both participants progress independently.
- [x] Both modes rank correct answers before time.
- [x] Self-Paced Race displays a provisional rank after individual completion.
- [x] The server rejects cross-quiz answers, invalid state transitions, and
      late live submissions.
- [x] The Drizzle schema and migration are committed together.
- [ ] `npm run typecheck`, `npm run lint`, and focused feature tests pass.
      Focused automated tests were intentionally deferred for this delivery.

## Handoff boundary

Stop when this Definition of Done is met. Do not implement group rooms,
matchmaking, follower features, chat, global rankings, public content review,
or creator analytics.
