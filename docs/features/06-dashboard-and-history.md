# Feature 6 — Dashboard and History

- **Status:** Planned
- **Contract readiness:** Business scope only; not approved for implementation
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

## Implementation gate

Before implementation, expand this file with authorised routes, repository
queries, pagination rules, access-control tests, UI states, and a technical
Definition of Done. Do not infer those decisions from the business story.

## Handoff boundary

Do not implement Feature 6 from this business-scope document alone.
