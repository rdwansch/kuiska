# User Stories: Quiz App (MVP & Phase 2)

This document contains the _User Stories_ for the **Quiz App** project. Structured using the standard Agile/Scrum format (Role, Feature, Reason) along with _Acceptance Criteria_ to maintain a strict scope and prevent overengineering.

---

## Main Features Summary (MVP Scope)

1. **Simple Authentication:** Signup & Login using Email + Password.
2. **Quiz Creation:** Quiz creation form + image attachment option + privacy settings (Public/Private with Secret Code).
3. **Quiz Taking:** Direct link / secret code access with instant scoring.
4. **History & Dashboard:** List of created quizzes and completed quiz history.
5. **Categories & Random Quiz:** 3 static categories provided by the backend (e.g., _General Knowledge_, _Technology_, _Pop Culture_).
6. **Leaderboard:** Ranking users based on the highest number of completed quizzes.
7. _(Optional / Phase 2)_ **Quiz Theme Customization:** WordPress-like visual styling (flagged separately to avoid feature creep in early development).

---

## Epic 1: Authentication & User Profile

### US-01: Account Registration and Login

- **As a** New / Registered user
- **I want to** Sign up and log in using my email and password
- **So that** I can save my quiz history, view my scores, and create my own quizzes.

**Acceptance Criteria:**

- [ ] Users can register by providing Email, Password, and Username.
- [ ] Users can log in using Email and Password.
- [ ] Proper error handling for already registered emails or incorrect passwords.
- [ ] User session is persisted (JWT / Session token).

---

### US-02: Dashboard & Activity History

- **As a** Registered user (Logged-in User)
- **I want to** View a dashboard displaying my created quizzes and quiz attempt history
- **So that** I can track my scores and manage my published quizzes.

**Acceptance Criteria:**

- [ ] A "My Quizzes" tab displaying all quizzes created by the user.
- [ ] A "Score History" tab displaying quizzes taken along with final scores.
- [ ] Display the date when each quiz was taken.

---

## Epic 2: Quiz Management

### US-03: Create a New Quiz

- **As a** Registered user
- **I want to** Create a new quiz with questions, answer options, categories, and images
- **So that** I can share my quizzes with others.

**Acceptance Criteria:**

- [ ] Users must fill in Quiz Title, Short Description, and select 1 of 3 Static Categories (e.g., _Tech_, _General_, _Entertainment_).
- [ ] Users can add multiple multiple-choice questions.
- [ ] Each question must have exactly 1 correct answer.
- [ ] Users can optionally upload/attach an image to the quiz cover or individual questions.

---

### US-04: Quiz Privacy Settings (Public / Private)

- **As a** Quiz creator
- **I want to** Set my quiz status to Public or Private (protected by a Secret Code)
- **So that** Only specific people can access it if set to private.

**Acceptance Criteria:**

- [ ] Privacy status options: `Public` or `Private`.
- [ ] If `Private` is selected, the creator must set a _Secret Code_.
- [ ] `Public` quizzes appear in general exploration/category feeds.
- [ ] `Private` quizzes can only be accessed after entering the correct _Secret Code_.

---

## Epic 3: Quiz Execution & Scoring

### US-05: Take Quiz & Share Link

- **As a** Player (Guest or Registered User)
- **I want to** Take a quiz via a shared link and immediately view my score
- **So that** I can test my knowledge on the topic.

**Acceptance Criteria:**

- [ ] Users (including Guests) can open the quiz link and start playing immediately.
- [ ] If the quiz is _Private_, the system prompts for the _Secret Code_ before displaying questions.
- [ ] Display images on questions if available.
- [ ] Upon completion, display the final score instantly (e.g., 80/100 or 8 out of 10 correct).

---

### US-06: Save Quiz Score

- **As a** Quiz player (Guest / Registered)
- **I want to** Save my quiz result
- **So that** My score is recorded on my profile and counts towards the leaderboard.

**Acceptance Criteria:**

- [ ] If the player is **Logged in**, the score is automatically saved to the database.
- [ ] If the player is a **Guest**, prompt a modal/notification upon completion: _"Login / Sign up now to save your score!"_.
- [ ] The score will not be persisted if the Guest declines to log in.

---

### US-07: Random Quiz Mode by Category

- **As a** Player looking for a quick game
- **I want to** Choose a category and get a random quiz
- **So that** I don't have to spend time browsing for a quiz.

**Acceptance Criteria:**

- [ ] 3 Static Categories served from the backend (e.g., _Technology_, _General Knowledge_, _Entertainment_).
- [ ] Users can click a "Play Random" button on their chosen category.
- [ ] The system randomly selects 1 `Public` quiz from that category.

---

## Epic 4: Leaderboard & Stats

### US-08: Top Active Users Leaderboard

- **As a** User
- **I want to** View a leaderboard ranking users who have completed the most quizzes
- **So that** It creates a fun competitive environment.

**Acceptance Criteria:**

- [ ] Display top users based on the total number of **completed** quizzes.
- [ ] Display Username, Total Quizzes Played, and Average Score (optional).
- [ ] The leaderboard updates automatically whenever a new score is saved.

---

## Epic 5: Customization ( PHASE 2 / FEATURE CREEP WARNING)

> **Execution Note:** Only work on this epic **after the core MVP (Epics 1–4) is 100% finished and deployed**. Do not get stuck on visual customization before core features are fully functional!

### US-09: Custom Quiz Page Theme & Styling

- **As a** Quiz creator
- **I want to** Choose a color theme/preset for my quiz page
- **So that** My quiz page has a unique look and feel.

**Acceptance Criteria:**

- [ ] Provide 3-4 simple color/style presets (e.g., _Minimalist Dark_, _Light Clean_, _Pastel_, _Cyberpunk_).
- [ ] Creators can pick 1 preset during quiz creation/editing.
- [ ] The quiz taking page adapts its background and typography based on the selected preset.

---

## Summary Checklist: MVP vs. Phase 2

| Feature / Module                  | Priority                      | Complexity |
| :-------------------------------- | :---------------------------- | :--------- |
| Auth (Email & Password)           | **MVP (Required)**            | Low        |
| Create Quiz + Upload Image        | **MVP (Required)**            | Medium     |
| Public / Private + Secret Code    | **MVP (Required)**            | Low        |
| Quiz Execution + Instant Scoring  | **MVP (Required)**            | Medium     |
| Save Score (Auth Gate for Guest)  | **MVP (Required)**            | Low        |
| 3 Static Categories + Random Quiz | **MVP (Required)**            | Low        |
| Leaderboard (Most Quizzes Played) | **MVP (Required)**            | Low        |
| WordPress-style Customizer        | 🛑 **Phase 2 (Hold for now)** | High       |
