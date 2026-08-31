# Feature 5 — Public Discovery and Curation

- **Status:** Planned
- **Contract readiness:** Implementation-ready
- **User story:** [US-09 — Discover reviewed public quizzes](../business/user-stories.md#us-09-discover-reviewed-public-quizzes)
- **Depends on:** Feature 2 — Quiz Creation; Feature 3 — Quiz Taking and Scoring; Feature 4 — Social Trivia Rooms
- **Unblocks:** Feature 7 — Categories and Random Quiz; trusted public recommendations

## Objective

Players can explore a content-first feed of trustworthy public quizzes. Anyone
can still share a quiz directly; public visibility and public discovery are
different decisions.

## Scope

### In scope

- An Explore feed for reviewed, public quizzes.
- Category, title, description, question count, creator, and useful game
  metadata on a quiz card.
- A generated category-led cover graphic when a creator did not provide media.
- A review status visible to the creator.
- A path for approved quizzes to appear in Explore and public room discovery.
- An empty state that invites the player to play a category, create a quiz, or
  start a room.

### Explicitly out of scope

- Image upload and external media storage.
- A public comment system, follows, reactions, or direct messages.
- Personal recommendation algorithms.
- Full reviewer or administrator dashboard UX.
- Global leaderboard, categories with random selection, and creator analytics.

## Data model

Extend `quiz` with public-discovery state. `visibility` controls access to a
quiz; it must not be reused to decide whether the quiz appears in Explore.

| Column         | Type and constraint    | Purpose                                                |
| -------------- | ---------------------- | ------------------------------------------------------ |
| `reviewStatus` | MySQL enum             | `not_requested`, `pending`, `approved`, or `rejected`. |
| `reviewedAt`   | timestamp, nullable    | Last public-review decision time.                      |
| `reviewNote`   | varchar(500), nullable | Concise internal or creator-facing rejection guidance. |

A public quiz with `reviewStatus = approved` is eligible for Explore and public
battle discovery. A private quiz and an unreviewed public quiz remain shareable
through their direct access flow, but are not discoverable in the feed.

The generated cover is not a database field. It is a deterministic presentation
component derived from the quiz category and title, using Kinetic Social Field colours,
simple topical symbols and shapes, no gradient, and no stock photography. It
keeps the feed intentional without requiring creator media.

## Review contract

1. A creator can request public discovery for an eligible public quiz.
2. An approved quiz appears in Explore and public room discovery.
3. A rejected quiz stays accessible according to its visibility setting but is
   never publicly discoverable.
4. The first release may use an internal operator workflow for review; it does
   not require a full reviewer dashboard.
5. Public review checks basic quiz completeness, relevance, safety, and answer
   quality. It is not a claim that every question is institution-certified.

## Explore behaviour

The home remains content-first. It has one compact Match Ticket for an active
room, incoming challenge, or battle-start action, followed by Explore cards.

Each quiz card prioritises:

1. Cover graphic, topic, and title.
2. Category, question count, and difficulty.
3. Play or Challenge action.
4. Creator and player count as supporting metadata.

Use the responsive rules in [`design-system.md`](../technical/design-system.md):
mobile uses a single comfortable feed, while desktop can use a multi-column
grid. Both layouts show the same information and actions.

## Required structure

Follow [the project architecture](../technical/project-architecture.md). All
feature files use the `PublicDiscovery` prefix.

```text
src/
├── app/explore/page.tsx
└── features/public-discovery/
    ├── components/PublicDiscoveryCover.tsx
    ├── components/PublicDiscoveryFeed.tsx
    ├── components/PublicDiscoveryQuizCard.tsx
    ├── components/PublicDiscoveryReviewStatus.tsx
    ├── repositories/PublicDiscoveryRepository.ts
    ├── schemas/PublicDiscoverySchema.ts
    ├── services/PublicDiscoveryService.ts
    ├── types/PublicDiscoveryType.ts
    └── index.ts
```

## Definition of Done

- [ ] The Explore query returns only public quizzes with an approved review
      status.
- [ ] An unreviewed or rejected quiz never appears in Explore or public room
      discovery.
- [ ] Creators can see their current review status.
- [ ] Every Explore card has a purposeful generated cover when media is absent.
- [ ] The home shows a compact Match Ticket before the content-first feed.
- [ ] Mobile and desktop present equivalent Explore actions and information.
- [ ] The Drizzle schema and migration are committed together.
- [ ] `npm run typecheck`, `npm run lint`, and focused feature tests pass.

## Handoff boundary

Stop when this Definition of Done is met. Do not add image uploads, reviewer
dashboard UX, comments, follows, personal recommendation algorithms, category
randomisation, or global leaderboards.
