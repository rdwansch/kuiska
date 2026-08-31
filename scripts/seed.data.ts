import type { QuizCategory } from "../src/types/QuizType";

export type SeedUser = {
  name: string;
  email: string;
  username: string;
  displayUsername?: string;
  password: string;
};

export type SeedQuiz = {
  key: string;
  ownerEmail: string;
  title: string;
  description: string;
  category: QuizCategory;
  visibility: "public" | "private";
  secretCode?: string;
  reviewStatus?: "not_requested" | "pending" | "approved" | "rejected";
  questions: Array<{
    content: string;
    options: Array<{ content: string; isCorrect: boolean }>;
  }>;
};

// Development-only people. Replace these values before running `bun run db:seed`.
export const seedUsers: SeedUser[] = [
  {
    name: "Demo Player",
    email: "demo@example.com",
    username: "demo-player",
    password: "demo-password-123",
  },
];

// Add quizzes here. Every `ownerEmail` must match a person in `seedUsers`.
// Keep each `key` unique and stable: rerunning the seed skips that quiz.
export const seedQuizzes: SeedQuiz[] = [
  {
    key: "web-basics",
    ownerEmail: "demo@example.com",
    title: "Web Basics",
    description: "A quick quiz about the building blocks of the web.",
    category: "technology",
    visibility: "public",
    reviewStatus: "approved",
    questions: [
      {
        content: "Which language adds structure to a web page?",
        options: [
          { content: "HTML", isCorrect: true },
          { content: "CSS", isCorrect: false },
          { content: "SQL", isCorrect: false },
        ],
      },
    ],
  },
];
