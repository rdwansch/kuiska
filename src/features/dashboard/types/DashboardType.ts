import type { PublicDiscoveryReviewStatus } from "~/features/public-discovery/types/PublicDiscoveryType";

export type DashboardPage<T> = {
  items: T[];
  page: number;
  hasNext: boolean;
};

export type DashboardQuiz = {
  id: string;
  title: string;
  category: "technology" | "general" | "entertainment";
  visibility: "public" | "private";
  questionCount: number;
  reviewStatus: PublicDiscoveryReviewStatus;
  reviewNote: string | null;
  createdAt: string;
};

export type DashboardAttempt = {
  id: string;
  quizId: string;
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  createdAt: string;
};

export type DashboardData = {
  userName: string;
  quizzes: DashboardPage<DashboardQuiz>;
  attempts: DashboardPage<DashboardAttempt>;
};
