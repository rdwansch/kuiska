# Feature 6 — Dashboard and History

- **Status:** Implemented — focused automated tests deferred by user request
- **Contract readiness:** Implementation-ready
- **User story:** [US-10 — View created quizzes and attempt history](../business/user-stories.md#us-10-view-created-quizzes-and-attempt-history)
- **Depends on:** Feature 1 — Authentication; Feature 2 — Quiz Creation; Feature 3 — Quiz Taking and Scoring

## Objective

A signed-in player can find quizzes they created and review their saved quiz
attempts without turning the logged-in home into an administrative dashboard.

## Approved business scope

- A private `My Quizzes` view containing quizzes owned by the current user.
- A private `Score History` view containing the current user's saved attempts.
- Quiz identity, score, and completion date in history entries.
- Empty states for users without created quizzes or saved attempts.

## Explicitly out of scope

- Quiz editing, deletion, drafts, and creator analytics.
- Other users' private history.
- Room history, which requires a separate story after Feature 4.
- Replacing the content-first logged-in home defined in product direction.

## Technical contract

### Routes and access

- `GET /me` is the single private history surface. It keeps created quizzes and
  score history as two readable sections rather than replacing Explore.
- The feature entry point retrieves the Better Auth session and redirects an
  unauthenticated visitor to `/signin`.
- Repository queries always filter by the authenticated session's `user.id`.
  The browser never supplies a user identifier.

### Pagination and ordering

- `quizPage` and `attemptPage` are independent positive integer query
  parameters. Invalid or absent values use page 1.
- Each section loads 20 rows plus one extra row to determine whether a next
  page exists. Results sort newest first.
- The first release exposes only Previous and Next links. Search, sorting,
  editing, and deletion remain out of scope.

### States and structure

```text
src/
├── app/me/page.tsx
└── features/dashboard/
    ├── components/DashboardHistory.tsx
    ├── components/DashboardMyQuizzes.tsx
    ├── repositories/DashboardRepository.ts
    ├── services/DashboardService.ts
    ├── types/DashboardType.ts
    └── index.ts
```

- Empty created-quiz and score-history states point to the next relevant
  action. They never claim that room history exists.
- `PublicDiscoveryReviewStatus` is reused inside My Quizzes so creators can
  request discovery review and read its current status.

## Technical Definition of Done

- [x] `/me` redirects unauthenticated visitors to `/signin`.
- [x] My Quizzes lists only quizzes owned by the current user.
- [x] Score History lists only attempts owned by the current user.
- [x] Both sections show correct empty, previous, and next states.
- [x] History displays quiz identity, score, and completion date.
- [ ] `npm run typecheck` and `npm run lint` pass. Focused tests are deferred
      by user request.

## Handoff boundary

Stop after My Quizzes and Score History. Do not add room history, editing,
deletion, creator analytics, or a replacement for the Explore home.
