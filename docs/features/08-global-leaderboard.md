# Feature 8 — Global Leaderboard

- **Status:** Implemented
- **Contract readiness:** Implementation-ready
- **User story:** [US-12 — View the most active players](../business/user-stories.md#us-12-view-the-most-active-players)
- **Depends on:** Feature 1 — Authentication; Feature 3 — Quiz Taking and Scoring

## Objective

Players can see a public activity leaderboard ranked by the number of
authenticated, completed quiz attempts. It is separate from the score-and-time
ranking inside a social room.

## Approved business scope

- Rank users by the number of persisted `quiz_attempt` rows.
- Display each player's public username and completed-attempt count.
- Display average score as supporting information only; it never determines the
  activity rank.
- Reflect a successfully saved attempt on the next request without manual
  counters, backfills, or scheduled aggregation.

## Explicitly out of scope

- Using score, time, streaks, seasons, or rewards as the primary global rank.
- Counting guest results, because Feature 3 does not persist them.
- Combining room participants or room results with the global activity data.
- Counting unique quizzes instead of completed attempts. Replaying a quiz creates
  another persisted attempt and increments activity.
- Search, category filters, date ranges, personalized ranking, or infinite scroll.

## Technical contract

### Route and access

- `GET /leaderboard` is a public, read-only page. Guests may view aggregate
  activity; only authenticated quiz submissions can create rows that appear in
  it.
- Signed-in visitors receive `AuthenticatedAppShell`. Guests receive the
  minimal public navigation used by Explore.
- The route is request-time rendered. It must not cache an aggregate snapshot,
  so a newly saved attempt is visible after a fresh navigation or refresh.
- The route page is a thin wrapper. `GlobalLeaderboardPage` owns query parsing,
  data loading, and shell selection; the repository never reads requests or
  session state.

### Ranking semantics

The repository groups persisted attempts by user and applies this complete,
deterministic order:

1. `completedCount DESC` — the activity rank.
2. `user.username ASC` — a stable, human-readable tie-break.
3. `user.id ASC` — the final tie-break for database collations that consider
   differently-cased usernames equal.

Every `quiz_attempt` row is a completed attempt because the Quiz Taking service
inserts it only after the server recalculates and validates every answer. The
leaderboard never trusts a browser-provided count or score.

Average score is `AVG(quiz_attempt.score)`, rounded to the nearest integer for
display. It is not included in `ORDER BY` and must not change a player's rank.

### Pagination and query design

- The only query parameter is `page`.
- `page` must be a single positive decimal integer. Missing, repeated, malformed,
  unsafe, or greater-than-`100` values fall back to page 1.
- Each request reads 20 rows plus one sentinel row. The service returns 20 rows,
  `hasNext` (false at the 100-page cap), and the absolute one-based rank
  (`(page - 1) * 20 + row index + 1`).
- Previous and Next links preserve only the validated `page` value. The browser
  cannot choose a SQL limit, offset, user id, or ranking field.
- The repository performs one grouped Drizzle query over `quiz_attempt` joined
  to `user`; it selects only `user.id`, `user.username`, `COUNT(attempt.id)`, and
  `AVG(attempt.score)`. No user email, session data, quiz content, or attempt
  timestamps cross the feature boundary.
- No counter table, materialized view, cache, or migration is introduced while
  the MVP attempt set is small. If production measurements show aggregation is
  the bottleneck, add a user-leading index or maintained aggregate only with a
  measured query plan and an explicit migration.

### Privacy and abuse controls

- Usernames are the only user identity exposed. Email, display name, avatar
  image, internal ids, and exact attempt records remain private.
- Users with no persisted attempts do not appear.
- User deletion removes attempts through the existing foreign-key cascade, so a
  deleted player cannot remain on the leaderboard.
- The page has no write action and accepts no user identity or score input.
  Fixed page size, a 100-page cap, strict decimal parsing, and parameterized
  Drizzle predicates bound resource use and prevent arbitrary-offset abuse.
- The aggregate is intentionally global: private/public quiz visibility does
  not change whether a saved authenticated attempt counts, because the player
  completed the quiz and the attempt is already part of their private history.

### UI states

- The page heading is `Papan aktivitas` with a short explanation that completed
  quizzes determine the order.
- A populated state uses one ordered list with rank, username, completed count,
  and optional average score. It is not a repeated card grid and does not expose
  a score-first competition metaphor.
- An empty state explains that no saved attempts exist yet and links to Explore.
- Pagination renders Previous only after page 1 and Next only when the sentinel
  row exists. A malformed query still renders page 1 normally.
- The page follows the Kinetic Social Field system: white/light or neutral
  charcoal/dark canvas, restrained linework or player nodes, sentence-case
  labels, tabular numerals, accessible list semantics, and no pill badges.

### Feature structure

```text
src/
├── app/leaderboard/page.tsx
└── features/global-leaderboard/
    ├── components/GlobalLeaderboardList.tsx
    ├── repositories/GlobalLeaderboardRepository.ts
    ├── schemas/GlobalLeaderboardSchema.ts
    ├── services/GlobalLeaderboardService.ts
    ├── types/GlobalLeaderboardType.ts
    └── index.tsx
```

### Focused verification

The focused suite in `tests/feature8-global-leaderboard.test.mjs` proves:

- `readGlobalLeaderboardPage` defaults malformed, repeated, unsafe, and capped
  values to page 1.
- Service output preserves repository ordering for equal counts, so average
  score never changes the order.
- Service output includes only public leaderboard fields and never exposes the
  repository's internal user id.
- Service pagination trims the sentinel row and calculates absolute ranks.
- Repository SQL applies the complete count, username, and id ordering; route
  access and shell behavior are statically covered by the implementation.

## Technical Definition of Done

- [x] `/leaderboard` renders a public, read-only global activity leaderboard.
- [x] Only persisted authenticated quiz attempts contribute to counts.
- [x] Username and completed-attempt count are shown; average score is optional
      supporting information and does not rank users.
- [x] Ranking is deterministic: count descending, username ascending, user id
      ascending.
- [x] Query parsing, fixed-size pagination, sentinel-row handling, and page-cap
      abuse controls are server-owned.
- [x] The route reflects newly saved attempts without manual data maintenance.
- [x] No private user fields, guest results, room results, or quiz content leak.
- [x] `npm run typecheck`, `npm run lint`, and focused Feature 8 tests pass.

## Handoff boundary

Stop when this Definition of Done is met. Do not add seasons, rewards, streaks,
score-based global ranking, personalized feeds, or a maintained aggregate table.
