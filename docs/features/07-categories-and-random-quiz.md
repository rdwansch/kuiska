# Feature 7 — Categories and Random Quiz

- **Status:** Implemented — focused automated tests deferred by user request
- **Contract readiness:** Implementation-ready
- **User story:** [US-11 — Play a random quiz by category](../business/user-stories.md#us-11-play-a-random-quiz-by-category)
- **Depends on:** Feature 3 — Quiz Taking and Scoring; Feature 5 — Public Discovery and Curation

## Objective

A player can choose one static category and immediately receive a playable,
approved public quiz from that category.

## Scope

### In scope

- Technology, General Knowledge, and Entertainment as the static categories.
- One `Play Random` action per category.
- Selection from approved public quizzes only.
- A clear empty state when the selected category has no eligible quiz.

### Explicitly out of scope

- Selecting private, pending, rejected, or missing quizzes.
- Personalised recommendations and behaviour-based ranking.
- Dynamic category administration.
- Changing the category enum established by Feature 2.

## Technical contract

### Route and access

- Category entry points live at `GET /play/[category]`, where `category` is one
  of `technology`, `general`, or `entertainment`.
- The route is public. A guest may start an approved public quiz because
  Feature 3 already supports guest quiz-taking; an authenticated player still
  gets their attempt persisted through that existing flow.
- An invalid category is not a selectable product state and returns the normal
  route-level not-found response.
- For an eligible selection, the server redirects to the existing
  `/quizzes/[quizId]` route. It never returns the selected identifier for the
  browser to choose or alter.
- A category with no eligible quiz renders the empty state at `/play/[category]`
  instead of redirecting to a broken link or a private quiz.

### Eligibility and selection semantics

A quiz is eligible only when all three predicates are true:

```text
quiz.category      = requested category
quiz.visibility    = public
quiz.reviewStatus  = approved
```

- The service selects uniformly from the eligible quiz set. It does not favour
  newer, more-played, creator-owned, or previously selected quizzes.
- Every new navigation is an independent selection. Repeating a category may
  select the same quiz; no recent-history or anti-repeat store is introduced.
- Generate the random offset on the server with a cryptographically secure
  integer source. The browser supplies only the category route parameter.
- Count eligible quizzes, generate an offset in `[0, count)`, then fetch one
  row with the same eligibility predicate, deterministic `id` ordering, and
  that offset. The repository returns only the quiz id needed for the redirect.
- If the chosen offset becomes stale between the count and row fetch because a
  review state changed, repeat the count-and-select operation once. If it still
  has no row, show the empty state. Do not surface a database race as an error
  to the player.

### Data and performance boundary

- Reuse the existing `quiz.category`, `quiz.visibility`, and
  `quiz.reviewStatus` fields. This feature does not create a category table,
  a recommendation table, or an attempt-history table.
- Add a Drizzle migration that creates the composite index
  `quiz_random_category_idx` on `(visibility, review_status, category, id)`.
  The index keeps the eligible-set filter narrow; its order also supports the
  deterministic offset query.
- The initial count-plus-offset strategy is intentionally simple and suitable
  while the indexed eligible set is small. Before changing the selection
  algorithm, measure the real query plan and p95 latency with the production
  category distribution. Do not introduce a cache, a precomputed pool, or
  `ORDER BY RAND()` pre-emptively.
- The random route must be dynamically evaluated for every navigation. Do not
  cache or statically render a random redirect. Category controls that navigate
  to this route disable link prefetching so prefetching cannot consume a random
  selection before the player acts.

### Feature structure

Follow [the project architecture](../technical/project-architecture.md). All
feature files use the `RandomQuiz` prefix.

```text
src/
├── app/play/[category]/page.tsx
└── features/random-quiz/
    ├── components/RandomQuizCategoryActions.tsx
    ├── components/RandomQuizEmptyState.tsx
    ├── repositories/RandomQuizRepository.ts
    ├── schemas/RandomQuizSchema.ts
    ├── services/RandomQuizService.ts
    ├── types/RandomQuizType.ts
    └── index.tsx
```

- `RandomQuizSchema` owns the static category Zod enum. The route parameter is
  validated before it reaches the service.
- `RandomQuizService` owns eligibility, secure-offset generation, the single
  retry, and the redirect-or-empty decision.
- `RandomQuizRepository` owns only the count and id-selection queries. It has
  no access to route parameters, requests, or UI state.
- `RandomQuizCategoryActions` is rendered where Explore presents the three
  static categories. It uses the existing Kuiska controls and each action
  links to its category route with prefetch disabled.

### UI states

- Explore presents three plainly labelled category actions: Technology,
  General Knowledge, and Entertainment. Each action says `Play Random`.
- The random route has a minimal transition state; it must not show a quiz
  title, cover, or score before redirecting to the selected quiz.
- The empty state names the selected category, explains that no approved public
  quiz is available yet, and offers a return to Explore. It may also point to
  quiz creation, but does not promise a waitlist, notification, or automatic
  fallback category.
- The category action and empty state follow the Explore rules in
  [`design-system.md`](../technical/design-system.md): category is supporting
  context, the next playable action is clear, and no decorative notification
  badge is used.

### Focused verification

- Repository tests prove that private, pending, rejected, and another-category
  quiz records never contribute to the eligible count or selection query.
- Service tests prove a valid category redirects only to an eligible quiz,
  performs one stale-offset retry, and returns the category-specific empty
  state for a zero eligible count.
- Route tests prove invalid categories are not found, guest access is allowed,
  and category links do not prefetch the random route.
- Run `npm run typecheck`, `npm run lint`, and the focused Feature 7 test suite
  after applying the migration.

## Technical Definition of Done

- [x] `/play/[category]` accepts only the three approved static categories.
- [x] Every valid selection redirects only to a public, approved quiz in that
      category.
- [x] A category with no eligible quiz renders a clear, non-error empty state.
- [x] Selection is server-controlled, dynamic per navigation, and cannot be
      consumed by route prefetching.
- [x] No private, pending, rejected, or cross-category quiz is exposed.
- [x] The composite index and its Drizzle migration are committed together.
- [ ] `npm run typecheck` and `npm run lint` pass. Focused Feature 7 tests are
      deferred by user request.

## Handoff boundary

Stop when this Definition of Done is met. Do not add personalised ranking,
dynamic category management, repeat suppression, private-quiz selection, or
global leaderboard behaviour.
