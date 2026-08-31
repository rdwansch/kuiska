# Feature 8 — Global Leaderboard

- **Status:** Planned
- **Contract readiness:** Business scope only; not approved for implementation
- **User story:** [US-12 — View the most active players](../business/user-stories.md#us-12-view-the-most-active-players)
- **Depends on:** Feature 1 — Authentication; Feature 3 — Quiz Taking and Scoring

## Objective

Players can see an activity leaderboard ranked by authenticated completed-quiz
count. It is separate from the score-and-time ranking inside a social room.

## Approved business scope

- Rank users by the number of persisted quiz attempts.
- Display username and completed-quiz count.
- Allow average score as supporting information only.
- Reflect successfully saved attempts without manual maintenance.

## Explicitly out of scope

- Using score or time as the primary global activity rank.
- Combining room ranking with the global activity leaderboard.
- Rewards, levels, streaks, seasons, or virtual currency.
- Guest results, because Feature 3 does not persist them.

## Implementation gate

Before implementation, expand this file with deterministic tie behaviour,
privacy rules, query and pagination design, update strategy, abuse controls,
focused tests, and a technical Definition of Done.

## Handoff boundary

Do not implement Feature 8 from this business-scope document alone.
