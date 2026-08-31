# Kuiska: Product Direction

> Status: Discovery decisions. This document records confirmed product direction and separates it from ideas that have not been chosen yet.

## 1. Product Positioning

**Kuiska is a social trivia game: a place to discover knowledge, challenge people, and compete in a friendly way.**

The product should make quizzes feel active and social, not like a static form that only returns a score.

Kuiska is **not** positioned as a generic quiz builder or a school-first learning management tool. Quiz creation is the content engine; the player experience is the product.

## 2. The Core Problem

Answering questions alone becomes repetitive. Kuiska adds a reason to care about the outcome:

1. An interesting topic gets a player to start.
2. A challenge gives the player a social reason to finish.
3. Score and time comparison create a memorable result.
4. Rematch and sharing bring players back.

## 3. Primary Experience

The primary flow is:

```text
Discover a quiz -> Challenge someone -> Play -> Compare score and time -> Rematch or share
```

Kuiska supports two room modes:

1. **Live Trivia** is the signature experience: players answer the same question together while a shared timer runs. Each round reveals its answer only when that timer ends.
2. **Self-Paced Race** gives every participant the same quiz, but each person proceeds at their own pace. The final leaderboard appears when their attempt is complete.

Live Trivia gives Kuiska its game-like identity. Self-Paced Race supports a familiar exam-like flow without losing the competitive result.

### Room Model

Battle is modeled as a **room**. The interface can call the first version a “duel,” but the product model remains flexible:

- A room exposes its players as `participants[]`.
- MVP validation limits every room to exactly two participants.
- A room is full after the second participant joins; a player cannot join twice.
- Later group battles raise the capacity without changing the core room concept.

### Fair Answer Reveal

During Live Trivia, a submitted answer is locked and hidden from the other player. The correct answer and both players' outcome are revealed together only when the shared question timer ends, even if both players submitted early.

Players do not see the running score or current leader during the match. The final score and winner are revealed only after the last question.

### Ranking Rule

Correct answers are always the primary ranking. Time is only a tie-breaker:

1. More correct answers ranks higher.
2. If correct answers match, the faster player ranks higher.

For Self-Paced Race, the tie-breaker is the stored completion duration (`completedAt - startedAt`). For Live Trivia, it is the sum of each player's answer durations (`submittedAt - questionOpenedAt`); total room duration is shared and therefore cannot distinguish the players.

In Self-Paced Race, a player sees their score and provisional leaderboard position immediately after completing the quiz. That position becomes final when every room participant has completed their attempt or the room deadline passes.

### Social MVP Scope

The first social layer is intentionally small:

- Every player has a public profile.
- A player can share a challenge link with another person.
- The result screen compares the challenger's score and completion time with the recipient's.
- Followers, comments, direct messages, and a friend graph are later features, not MVP requirements.

## 4. Audiences and Their Roles

| Audience                 | Role in the product                                          | Priority            |
| :----------------------- | :----------------------------------------------------------- | :------------------ |
| Players                  | Discover topics, play, challenge friends, and build a record | Primary             |
| Community hosts          | Run private challenges for a club, event, or group           | Secondary           |
| Quiz creators            | Supply entertaining, useful quizzes and share them           | Secondary           |
| Schools and institutions | Host private activities and view participant outcomes        | Later business path |

Kuiska should remain approachable for every age and background. It must feel friendly without looking childish.

## 5. Content Strategy

| Content type                   | Product role                                             |
| :----------------------------- | :------------------------------------------------------- |
| General knowledge              | The core identity: knowledge worth competing over        |
| Pop culture and current trends | Growth lever: easy to click, share, and challenge        |
| Structured education           | Supported category, but not the product's defining voice |

The Explore feed is content-first. A quiz's topic, title, and visual must be the main reason to open it. Creator names, player counts, and social activity are supporting signals.

## 6. Content Quality Policy

Anyone can create a quiz and share it privately through a link. Only quizzes that pass lightweight review may appear in public Explore, public recommendations, and public battles.

This keeps creation open while protecting trust in public knowledge content.

## 7. Home After Login

The logged-in home is an exploration feed of playable quizzes, not an administrative dashboard.

Its hierarchy is:

1. A compact Match Ticket for an active room, an incoming challenge, or a clear battle-start action.
2. Discover interesting playable quizzes in the Explore feed.
3. Create a quiz from an always-visible, secondary action.

### Authenticated wayfinding

After sign-in, Kuiska changes from a public marketing surface into a product
experience. Every signed-in page must make that state legible without turning
the experience into an administrative dashboard:

- Desktop uses a light, persistent app header with **Explore**,
  **Aktivitasku**, a clear **Buat kuis** action, and the player's avatar and
  first name.
- The player control opens the account-level actions: **Aktivitasku** and
  **Keluar**. The first release uses an initial-based avatar; profile-image
  upload is not required.
- Mobile uses labelled bottom navigation for the small set of primary
  destinations. A **Main** destination appears only while the player has an
  active room or incoming challenge; it is not empty permanent navigation.
- The current destination must be visually and programmatically identifiable.
  An active room or challenge is communicated by its compact Match Ticket,
  not by decorative notification badges.
- During active trivia, product-level navigation recedes so the room remains
  the focused experience.

## 8. Brand Direction Chosen So Far

Kuiska should be **clean, colorful, calm, and playful**. The gameplay carries the excitement; the interface should not be visually noisy.

- Light and dark modes are both supported from the beginning.
- Layouts use generous space, simple cards, and clear reading hierarchy.
- Brighter accents are reserved for calls to action, scores, streaks, and win moments.
- Visual energy comes from interaction, feedback, and small expressive details rather than an always-loud palette.

### Color Preference

The palette should feel like a social game room, never neon or brutalist. Club berry is the brand anchor, lilac smoke is its companion, blue ink creates focus in a duel, and jade confirms a win. Explore stays paper-light and neutral; the room itself turns ink-dark. Nude, cream, orange, and yellow-led palettes are explicitly out of direction.

### Intended Feelings

The product should make a player feel:

- Proud of what they know.
- Curious to try another topic.
- Entertained and refreshed rather than pressured.
- Close to friends through a shared, playful competition.

These feelings rule out a childish visual language, an exam-like atmosphere, and an overly intense esports aesthetic.

### Voice and Microcopy

Kuiska speaks in casual Indonesian using **“kamu”**, not formal **“Anda.”** The voice is warm, concise, encouraging, and never patronizing.

Examples:

- “Siap menantang teman?”
- “Jawabanmu sudah terkunci.”
- “Kamu unggul di pengetahuan umum!”

### Mascot

A distinct Kuiska mascot is desired for future win moments, challenges, and empty states. It is intentionally deferred from MVP; the initial personality comes from the interface, motion, and language instead.

The approved implementation specification is [`docs/technical/design-system.md`](../technical/design-system.md).

## 9. Follow-up Decisions

- Design the mascot after the MVP establishes the interface personality.
- Decide whether the public brand presentation should force one theme in media assets; the product UI follows the device preference.
- Choose and verify the Live Trivia state transport against the deployment architecture before implementing rooms.
