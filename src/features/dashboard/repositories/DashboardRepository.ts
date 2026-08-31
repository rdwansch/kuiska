import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "~/lib/db";
import { quiz, quizAttempt } from "~/lib/db/schema";

export function findDashboardQuizzes(userId: string, offset: number, limit: number) {
  return db.query.quiz.findMany({
    where: eq(quiz.ownerId, userId),
    orderBy: [desc(quiz.createdAt)],
    limit,
    offset,
    with: { questions: { columns: { id: true } } },
  });
}

export function findDashboardAttempts(userId: string, offset: number, limit: number) {
  return db.query.quizAttempt.findMany({
    where: eq(quizAttempt.userId, userId),
    orderBy: [desc(quizAttempt.createdAt)],
    limit,
    offset,
    with: { quiz: { columns: { id: true, title: true } } },
  });
}
