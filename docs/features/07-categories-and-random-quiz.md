# Feature 7 — Categories and Random Quiz

- **Status:** Planned
- **Contract readiness:** Business scope only; not approved for implementation
- **User story:** [US-11 — Play a random quiz by category](../business/user-stories.md#us-11-play-a-random-quiz-by-category)
- **Depends on:** Feature 3 — Quiz Taking and Scoring; Feature 5 — Public Discovery and Curation

## Objective

A player can choose one static category and immediately receive a playable,
approved public quiz from that category.

## Approved business scope

- Technology, General Knowledge, and Entertainment as the static categories.
- One `Play Random` action per category.
- Selection from approved public quizzes only.
- A clear empty state when the selected category has no eligible quiz.

## Explicitly out of scope

- Selecting private, pending, rejected, or missing quizzes.
- Personalised recommendations and behaviour-based ranking.
- Dynamic category administration.
- Changing the category enum established by Feature 2.

## Implementation gate

Before implementation, expand this file with the route, random-selection
semantics, repository query, performance boundary, UI states, focused tests, and
a technical Definition of Done.

## Handoff boundary

Do not implement Feature 7 from this business-scope document alone.
