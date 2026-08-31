# Kuiska User Stories

This document defines Kuiska's business requirements in delivery order. User
story IDs follow the dependency-safe feature sequence below; they are not a
separate backlog priority.

The feature contracts in [`docs/features/`](../features/README.md) translate
these stories into implementation boundaries. Acceptance criteria describe the
required outcome; implementation status is tracked in the feature journey.

## Delivery sequence

| Feature | Capability                    | User stories        | Why it is here                                                 | Release |
| ------: | ----------------------------- | ------------------- | -------------------------------------------------------------- | ------- |
|       1 | Authentication                | US-01               | Establishes identity and sessions required by creator flows.   | MVP     |
|       2 | Quiz Creation                 | US-02, US-03        | Produces the quiz content used by every play mode.             | MVP     |
|       3 | Quiz Taking and Scoring       | US-04, US-05        | Makes a persisted quiz playable and records trusted results.   | MVP     |
|       4 | Social Trivia Rooms           | US-06, US-07, US-08 | Builds Kuiska's signature social modes on quiz and score data. | MVP     |
|       5 | Public Discovery and Curation | US-09               | Publishes trusted, playable quizzes and room entry points.     | MVP     |
|       6 | Dashboard and History         | US-10               | Reads created quizzes and saved attempts from earlier flows.   | MVP     |
|       7 | Categories and Random Quiz    | US-11               | Selects from the approved public quiz pool.                    | MVP     |
|       8 | Global Leaderboard            | US-12               | Aggregates authenticated attempt data.                         | MVP     |
|       9 | Theme Customization           | US-13               | Starts only after the complete MVP is delivered.               | Phase 2 |

## Feature 1 — Authentication

Contract: [`01-authentication.md`](../features/01-authentication.md)

### US-01: Register and sign in

- **As a** new or returning player
- **I want to** register and sign in with my email and password
- **So that** I can create quizzes, save results, and join social rooms.

**Acceptance Criteria:**

- [ ] A new player can register with a unique username, email, and password.
- [ ] A returning player can sign in with email and password.
- [ ] Invalid credentials and duplicate accounts return clear, safe errors.
- [ ] The authenticated session persists across supported page navigation.

## Feature 2 — Quiz Creation

Contract: [`02-quiz-creation.md`](../features/02-quiz-creation.md)

### US-02: Create a quiz

- **As a** registered creator
- **I want to** create a quiz with questions, answer options, and a category
- **So that** other people can play it.

**Acceptance Criteria:**

- [ ] The creator provides a title, short description, and one of the three
      static categories: Technology, General Knowledge, or Entertainment.
- [ ] The creator can add multiple multiple-choice questions.
- [ ] Every question has at least two answer options and exactly one correct
      option.
- [ ] The experience provides a generated category-led cover visual; creator
      image upload is excluded until storage is configured.

### US-03: Choose public or private access

- **As a** quiz creator
- **I want to** make my quiz public or protect it with a secret code
- **So that** I control who can open it.

**Acceptance Criteria:**

- [ ] The creator chooses `Public` or `Private` during quiz creation.
- [ ] A private quiz requires a secret code.
- [ ] A public quiz can be opened through its direct link without a secret
      code.
- [ ] A private quiz exposes its questions only after the correct secret code
      is submitted.

## Feature 3 — Quiz Taking and Scoring

Contract: [`03-quiz-taking.md`](../features/03-quiz-taking.md)

### US-04: Take a quiz from a shared link

- **As a** guest or registered player
- **I want to** take a quiz from its shared link and see my result immediately
- **So that** I can test my knowledge without navigating a catalogue first.

**Acceptance Criteria:**

- [ ] A public quiz opens directly for guests and registered players.
- [ ] A private quiz requests its secret code before showing any questions.
- [ ] The player must answer every question before submitting.
- [ ] The result shows the correct-answer count and percentage immediately.

### US-05: Save an authenticated result

- **As a** quiz player
- **I want to** retain my completed quiz result when I am signed in
- **So that** it contributes to my history and activity ranking.

**Acceptance Criteria:**

- [ ] A successful authenticated submission is saved automatically.
- [ ] A guest receives sign-in and sign-up actions after seeing the result.
- [ ] A guest result is not persisted.
- [ ] The server calculates the score from persisted quiz data rather than
      trusting the browser.

## Feature 4 — Social Trivia Rooms

Contract: [`04-social-trivia-rooms.md`](../features/04-social-trivia-rooms.md)

### US-06: Create or join a Live Trivia room

- **As a** registered player
- **I want to** create or join a two-player Live Trivia room
- **So that** I can compete with someone on the same questions at the same time.

**Acceptance Criteria:**

- [ ] The creator chooses a quiz and receives a shareable room link or code.
- [ ] A room exposes a participant collection but accepts exactly two
      participants in the MVP.
- [ ] Both players see the same question while a shared timer runs.
- [ ] Submitted answers lock and remain hidden until the shared timer ends.
- [ ] The correct answer and both outcomes are revealed together after the
      timer ends.
- [ ] The running score and current leader remain hidden until the final
      question.

### US-07: Play a Self-Paced Race

- **As a** registered player
- **I want to** complete the same quiz as my opponent at my own pace
- **So that** we can compete without answering each question simultaneously.

**Acceptance Criteria:**

- [ ] Both participants receive the same quiz questions.
- [ ] Each participant progresses without waiting for the other participant.
- [ ] A completed player immediately sees their score and provisional rank.
- [ ] The rank becomes final after both players finish or the room deadline
      expires.
- [ ] More correct answers rank higher; completion time breaks a tie.

### US-08: See the final Live Trivia result

- **As a** Live Trivia player
- **I want to** see the final winner after the last question
- **So that** the result feels fair and complete.

**Acceptance Criteria:**

- [ ] More correct answers rank higher.
- [ ] If correct-answer totals match, lower total answer duration ranks higher.
- [ ] The result shows both players' score, rank, and applicable time tie-break.
- [ ] The result offers rematch and share actions.

## Feature 5 — Public Discovery and Curation

Contract:
[`05-public-discovery-and-curation.md`](../features/05-public-discovery-and-curation.md)

### US-09: Discover reviewed public quizzes

- **As a** player
- **I want to** find quizzes that are suitable for public play
- **So that** I can trust the content in Explore and public rooms.

**Acceptance Criteria:**

- [ ] A creator can share a quiz directly without requesting public review.
- [ ] Only approved public quizzes appear in Explore, recommendations, and
      public room discovery.
- [ ] The creator can see the current review status.
- [ ] A rejected quiz is excluded from public discovery but retains its direct
      access behaviour.

## Feature 6 — Dashboard and History

Contract: [`06-dashboard-and-history.md`](../features/06-dashboard-and-history.md)

### US-10: View created quizzes and attempt history

- **As a** registered player
- **I want to** view my created quizzes and completed attempts
- **So that** I can find my content and review my previous results.

**Acceptance Criteria:**

- [ ] A `My Quizzes` view lists quizzes owned by the signed-in user.
- [ ] A `Score History` view lists the signed-in user's completed attempts.
- [ ] Every history item shows the quiz, result, and completion date.
- [ ] One user cannot view another user's private dashboard data.

## Feature 7 — Categories and Random Quiz

Contract:
[`07-categories-and-random-quiz.md`](../features/07-categories-and-random-quiz.md)

### US-11: Play a random quiz by category

- **As a** player looking for a quick game
- **I want to** choose a category and receive a random quiz
- **So that** I can start playing without browsing the full Explore feed.

**Acceptance Criteria:**

- [ ] The player can choose Technology, General Knowledge, or Entertainment.
- [ ] Each category provides a `Play Random` action.
- [ ] The system selects only an approved public quiz from the chosen category.
- [ ] An empty category returns a clear empty state instead of an invalid quiz
      link.

## Feature 8 — Global Leaderboard

Contract: [`08-global-leaderboard.md`](../features/08-global-leaderboard.md)

### US-12: View the most active players

- **As a** player
- **I want to** see a leaderboard of users with the most completed quizzes
- **So that** consistent participation is visible across Kuiska.

**Acceptance Criteria:**

- [ ] Authenticated attempts determine each user's completed-quiz count.
- [ ] The leaderboard shows username and total quizzes completed.
- [ ] Average score may appear as supporting information but does not determine
      the activity rank.
- [ ] A newly saved attempt is reflected without manual data maintenance.

Room results use their own score-first, time-tie-break ranking from Feature 4;
that rule does not define this global activity leaderboard.

## Feature 9 — Theme Customization (Phase 2)

Contract: [`09-theme-customization.md`](../features/09-theme-customization.md)

> Start this feature only after Features 1–8 are complete and deployed.

### US-13: Choose a quiz page theme

- **As a** quiz creator
- **I want to** choose a visual preset for my quiz page
- **So that** my quiz has a distinct presentation without a free-form editor.

**Acceptance Criteria:**

- [ ] The creator can choose from three or four approved presets.
- [ ] The selected preset applies consistently to the quiz-taking page.
- [ ] Every preset preserves readability, accessibility, and Kuiska's product
      identity.
- [ ] The first release does not include a free-form or WordPress-style visual
      customizer.
