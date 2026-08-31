import "server-only";

import { getAuthenticationSession } from "~/features/authentication/services/AuthenticationSessionService";
import { findDashboardAttempts, findDashboardQuizzes } from "../repositories/DashboardRepository";
import type { DashboardData, DashboardPage } from "../types/DashboardType";

const pageSize = 20;

function paginate<T>(items: T[], page: number): DashboardPage<T> {
  return {
    items: items.slice(0, pageSize),
    page,
    hasNext: items.length > pageSize,
  };
}

export function readDashboardPage(value: string | string[] | undefined) {
  if (Array.isArray(value) || !value || !/^[1-9]\d*$/.test(value)) return 1;

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed <= Math.floor(Number.MAX_SAFE_INTEGER / pageSize)
    ? parsed
    : 1;
}

export async function getDashboardData(input: {
  quizPage: number;
  attemptPage: number;
}): Promise<DashboardData | null> {
  const session = await getAuthenticationSession();
  const user = session?.user;
  if (!user) return null;

  const [quizzes, attempts] = await Promise.all([
    findDashboardQuizzes(user.id, (input.quizPage - 1) * pageSize, pageSize + 1),
    findDashboardAttempts(user.id, (input.attemptPage - 1) * pageSize, pageSize + 1),
  ]);

  return {
    userName: user.name,
    quizzes: paginate(
      quizzes.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        category: quiz.category,
        visibility: quiz.visibility,
        questionCount: quiz.questions.length,
        reviewStatus: quiz.reviewStatus,
        reviewNote: quiz.reviewNote,
        createdAt: quiz.createdAt.toISOString(),
      })),
      input.quizPage
    ),
    attempts: paginate(
      attempts.map((attempt) => ({
        id: attempt.id,
        quizId: attempt.quiz.id,
        quizTitle: attempt.quiz.title,
        totalQuestions: attempt.totalQuestions,
        correctAnswers: attempt.correctAnswers,
        score: attempt.score,
        createdAt: attempt.createdAt.toISOString(),
      })),
      input.attemptPage
    ),
  };
}
