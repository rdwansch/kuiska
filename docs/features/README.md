# Feature Journey

This directory is the delivery-order counterpart to
[`user-stories.md`](../business/user-stories.md). Business stories define the
required outcome; feature documents define the implementation boundary.

The numbering below is a dependency-safe delivery sequence, not the order of
screens in the final product. User story IDs follow the same sequence.

## Sources of truth

1. Source code, `package.json`, and database migrations describe the current
   application state.
2. User stories define approved business outcomes.
3. Implementation-ready feature contracts define approved technical scope.
4. If these sources conflict, stop and report the conflict instead of inventing
   behaviour.

## Delivery sequence

| No. | Feature                     | User stories                                                                                                                                                                                                                 | Status           | Contract readiness     | Document                                                                     |
| --: | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ---------------------- | ---------------------------------------------------------------------------- |
|   1 | Authentication              | [US-01](../business/user-stories.md#us-01-register-and-sign-in)                                                                                                                                                              | Implemented      | Current-state boundary | [01-authentication.md](./01-authentication.md)                               |
|   2 | Quiz Creation               | [US-02](../business/user-stories.md#us-02-create-a-quiz), [US-03](../business/user-stories.md#us-03-choose-public-or-private-access)                                                                                         | Implemented      | Implementation-ready   | [02-quiz-creation.md](./02-quiz-creation.md)                                 |
|   3 | Quiz Taking and Scoring     | [US-04](../business/user-stories.md#us-04-take-a-quiz-from-a-shared-link), [US-05](../business/user-stories.md#us-05-save-an-authenticated-result)                                                                           | Implemented      | Implementation-ready   | [03-quiz-taking.md](./03-quiz-taking.md)                                     |
|   4 | Social Trivia Rooms         | [US-06](../business/user-stories.md#us-06-create-or-join-a-live-trivia-room), [US-07](../business/user-stories.md#us-07-play-a-self-paced-race), [US-08](../business/user-stories.md#us-08-see-the-final-live-trivia-result) | Implemented      | Implementation-ready   | [04-social-trivia-rooms.md](./04-social-trivia-rooms.md)                     |
|   5 | Public Discovery & Curation | [US-09](../business/user-stories.md#us-09-discover-reviewed-public-quizzes)                                                                                                                                                  | Implemented      | Implementation-ready   | [05-public-discovery-and-curation.md](./05-public-discovery-and-curation.md) |
|   6 | Dashboard and History       | [US-10](../business/user-stories.md#us-10-view-created-quizzes-and-attempt-history)                                                                                                                                          | Implemented      | Implementation-ready   | [06-dashboard-and-history.md](./06-dashboard-and-history.md)                 |
|   7 | Categories and Random Quiz  | [US-11](../business/user-stories.md#us-11-play-a-random-quiz-by-category)                                                                                                                                                    | Implemented      | Implementation-ready   | [07-categories-and-random-quiz.md](./07-categories-and-random-quiz.md)       |
|   8 | Global Leaderboard          | [US-12](../business/user-stories.md#us-12-view-the-most-active-players)                                                                                                                                                      | Implemented      | Implementation-ready   | [08-global-leaderboard.md](./08-global-leaderboard.md)                       |
|   9 | Theme Customization         | [US-13](../business/user-stories.md#us-13-choose-a-quiz-page-theme)                                                                                                                                                          | Phase 2; on hold | Business scope only    | [09-theme-customization.md](./09-theme-customization.md)                     |

## Execution audit — 2026-08-31

`yes` means every currently defined DoD item is complete. `partial` means the
feature is implemented but has an unchecked DoD item. `no` means no feature
implementation exists yet.

| Name                         | Status  |
| ---------------------------- | ------- |
| Feature 1 — Authentication   | yes     |
| Feature 2 — Quiz Creation    | yes     |
| Feature 3 — Quiz Taking      | yes     |
| Feature 4 — Social Rooms     | partial |
| Feature 5 — Public Discovery | partial |
| Feature 6 — Dashboard        | partial |
| Feature 7 — Random Quiz      | partial |
| Feature 8 — Leaderboard      | yes     |
| Feature 9 — Themes           | no      |

## Dependency rules

1. Complete Feature 1 before any authenticated creator or room flow.
2. Complete Feature 2 before any feature reads or plays persisted quizzes.
3. Complete Feature 3 before rooms, history, random play, or leaderboards reuse
   trusted score data.
4. Complete Feature 4 before Feature 5 exposes public room entry points.
5. Complete Feature 5 before Feature 7 selects from the approved public pool.

Features 6 and 8 can technically begin after their listed dependencies, but
they remain later in the delivery order so Kuiska's social and discovery loop
is established first. Feature 9 starts only after Features 1–8 are complete and
deployed.

## Implementation handoff

Only hand off a document marked **Implementation-ready**. Give an implementation
agent one feature document at a time with this prompt:

> Read `AGENTS.md`, `docs/business/user-stories.md`,
> `docs/technical/project-architecture.md`,
> `docs/technical/design-system.md`, and the selected feature document.
> Implement only that feature and its mapped user stories. Do not implement a
> later feature or an explicitly out-of-scope item. If the documents conflict
> with the codebase, stop and report the conflict.

Features 4–7 are implemented but retain focused-test Definition of Done items;
Feature 8 has focused-test coverage.
