"use server";

import { verifyPassword } from "~/lib/auth-password";
import { getAuthenticationSession } from "~/features/authentication/services/AuthenticationSessionService";
import { createQuizTakingAttempt, findQuizTakingQuiz } from "../repositories/QuizTakingRepository";
import { quizTakingAccessSchema, quizTakingSubmitSchema } from "../schemas/QuizTakingSchema";
import type {
  QuizTakingAccessResult,
  QuizTakingAccessState,
  QuizTakingQuiz,
  QuizTakingSubmitInput,
  QuizTakingSubmitResult,
} from "../types/QuizTakingType";

type QuizTakingDatabaseQuiz = NonNullable<Awaited<ReturnType<typeof findQuizTakingQuiz>>>;

function sanitiseQuiz(quiz: QuizTakingDatabaseQuiz): QuizTakingQuiz {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      content: question.content,
      position: question.position,
      options: question.options.map((option) => ({
        id: option.id,
        content: option.content,
        position: option.position,
      })),
    })),
  };
}

async function hasValidSecretCode(quiz: QuizTakingDatabaseQuiz, secretCode?: string) {
  if (quiz.visibility !== "private") return true;
  if (!quiz.secretCodeHash || !secretCode) return false;

  return verifyPassword({ hash: quiz.secretCodeHash, password: secretCode });
}

export async function getQuizTakingInitialState(quizId: string): Promise<QuizTakingAccessState> {
  const quiz = await findQuizTakingQuiz(quizId);
  if (!quiz) return { status: "not-found" };
  if (quiz.visibility === "private") return { status: "private", quizId: quiz.id };

  return { status: "ready", quiz: sanitiseQuiz(quiz) };
}

export async function unlockQuizTakingQuiz(input: {
  quizId: string;
  secretCode: string;
}): Promise<QuizTakingAccessResult> {
  const parsed = quizTakingAccessSchema.safeParse(input);
  if (!parsed.success) return { status: "error", error: "Secret code is invalid." };

  const quiz = await findQuizTakingQuiz(parsed.data.quizId);
  if (!quiz) return { status: "not-found" };

  if (!(await hasValidSecretCode(quiz, parsed.data.secretCode))) {
    return { status: "error", error: "Secret code is invalid." };
  }

  return { status: "ready", quiz: sanitiseQuiz(quiz) };
}

export async function submitQuizTaking(
  input: QuizTakingSubmitInput
): Promise<QuizTakingSubmitResult> {
  const parsed = quizTakingSubmitSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", error: "Answer every question before submitting." };
  }

  const quiz = await findQuizTakingQuiz(parsed.data.quizId);
  if (!quiz) return { status: "error", error: "This quiz is no longer available." };

  if (!(await hasValidSecretCode(quiz, parsed.data.secretCode))) {
    return { status: "error", error: "Secret code is invalid." };
  }

  if (quiz.questions.length === 0 || parsed.data.answers.length !== quiz.questions.length) {
    return { status: "error", error: "Answer every question before submitting." };
  }

  const submittedAnswers = new Map(
    parsed.data.answers.map((answer) => [answer.questionId, answer.optionId])
  );
  let correctAnswers = 0;

  for (const persistedQuestion of quiz.questions) {
    const submittedOptionId = submittedAnswers.get(persistedQuestion.id);
    const submittedOption = persistedQuestion.options.find(
      (persistedOption) => persistedOption.id === submittedOptionId
    );

    if (!submittedOption) {
      return { status: "error", error: "The selected answers do not match this quiz." };
    }

    if (submittedOption.isCorrect) correctAnswers += 1;
  }

  const totalQuestions = quiz.questions.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const session = await getAuthenticationSession();
  const userId = session?.user?.id;

  if (userId) {
    try {
      await createQuizTakingAttempt({
        quizId: quiz.id,
        userId,
        totalQuestions,
        correctAnswers,
        score,
      });
    } catch {
      return { status: "error", error: "We could not save this result. Please try again." };
    }
  }

  return {
    status: "success",
    result: {
      correctAnswers,
      totalQuestions,
      score,
      isAuthenticated: Boolean(userId),
    },
  };
}
