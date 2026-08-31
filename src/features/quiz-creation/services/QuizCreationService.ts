"use server";

import { hashPassword } from "~/lib/auth-password";
import { getAuthenticationSession } from "~/features/authentication/services/AuthenticationSessionService";
import { createQuizCreationQuiz } from "../repositories/QuizCreationRepository";
import { quizCreationSchema } from "../schemas/QuizCreationSchema";
import type { QuizCreationActionResult, QuizCreationInput } from "../types/QuizCreationType";

export async function getQuizCreationAccess() {
  const session = await getAuthenticationSession();
  return session?.user?.id ?? null;
}

export async function createQuiz(input: QuizCreationInput): Promise<QuizCreationActionResult> {
  const ownerId = await getQuizCreationAccess();
  if (!ownerId) {
    return { status: "error", error: "Sign in to create a quiz." };
  }

  const parsed = quizCreationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "Check your quiz details and try again.",
    };
  }

  try {
    const secretCodeHash =
      parsed.data.visibility === "private" && parsed.data.secretCode
        ? await hashPassword(parsed.data.secretCode)
        : null;

    const createdQuiz = await createQuizCreationQuiz({
      ...parsed.data,
      ownerId,
      secretCodeHash,
    });

    return {
      status: "success",
      quizId: createdQuiz.id,
      quizUrl: `/quizzes/${createdQuiz.id}`,
    };
  } catch {
    return {
      status: "error",
      error: "We could not save this quiz. Please try again.",
    };
  }
}
