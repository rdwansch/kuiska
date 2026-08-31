import "server-only";

import { randomUUID } from "node:crypto";

import { db } from "~/lib/db";
import { option, question, quiz } from "~/lib/db/schema";
import type { QuizCreationRepositoryInput } from "../types/QuizCreationType";

export async function createQuizCreationQuiz(input: QuizCreationRepositoryInput) {
  const quizId = randomUUID();

  await db.transaction(async (transaction) => {
    await transaction.insert(quiz).values({
      id: quizId,
      ownerId: input.ownerId,
      title: input.title,
      description: input.description,
      category: input.category,
      visibility: input.visibility,
      secretCodeHash: input.secretCodeHash,
    });

    for (const [questionIndex, inputQuestion] of input.questions.entries()) {
      const questionId = randomUUID();

      await transaction.insert(question).values({
        id: questionId,
        quizId,
        content: inputQuestion.content,
        position: questionIndex + 1,
      });

      await transaction.insert(option).values(
        inputQuestion.options.map((inputOption, optionIndex) => ({
          id: randomUUID(),
          questionId,
          content: inputOption.content,
          isCorrect: inputOption.isCorrect,
          position: optionIndex + 1,
        }))
      );
    }
  });

  return { id: quizId };
}
