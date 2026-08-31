import "server-only";

import { randomUUID } from "node:crypto";

import { asc, eq } from "drizzle-orm";

import { db } from "~/lib/db";
import { option, question, quiz, quizAttempt } from "~/lib/db/schema";

export async function findQuizTakingQuiz(quizId: string) {
  return db.query.quiz.findFirst({
    where: eq(quiz.id, quizId),
    with: {
      questions: {
        orderBy: [asc(question.position)],
        with: {
          options: {
            orderBy: [asc(option.position)],
          },
        },
      },
    },
  });
}

export async function createQuizTakingAttempt(input: {
  quizId: string;
  userId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
}) {
  await db.insert(quizAttempt).values({
    id: randomUUID(),
    ...input,
  });
}
