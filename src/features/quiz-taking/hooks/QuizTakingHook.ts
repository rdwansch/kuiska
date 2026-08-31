"use client";

import { useState, useTransition } from "react";

import { submitQuizTaking, unlockQuizTakingQuiz } from "../services/QuizTakingService";
import type { QuizTakingAccessState, QuizTakingFormState } from "../types/QuizTakingType";

export function useQuizTakingHook(initialState: QuizTakingAccessState) {
  const [formState, setFormState] = useState<QuizTakingFormState>(() => ({
    quiz: initialState.status === "ready" ? initialState.quiz : null,
    answers: {},
    secretCode: null,
    error: null,
    result: null,
  }));
  const [isPending, startTransition] = useTransition();

  const unlockQuiz = (quizId: string, secretCode: string) => {
    setFormState((previous) => ({ ...previous, error: null }));
    startTransition(async () => {
      const result = await unlockQuizTakingQuiz({ quizId, secretCode });

      if (result.status === "ready") {
        setFormState({
          quiz: result.quiz,
          answers: {},
          secretCode,
          error: null,
          result: null,
        });
        return;
      }

      setFormState((previous) => ({
        ...previous,
        error: result.status === "not-found" ? "Kuis tidak ditemukan." : result.error,
      }));
    });
  };

  const chooseAnswer = (questionId: string, optionId: string) => {
    setFormState((previous) => ({
      ...previous,
      answers: { ...previous.answers, [questionId]: optionId },
      error: null,
    }));
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.quiz) return;

    setFormState((previous) => ({ ...previous, error: null }));
    startTransition(async () => {
      const result = await submitQuizTaking({
        quizId: formState.quiz!.id,
        secretCode: formState.secretCode ?? undefined,
        answers: formState.quiz!.questions.map((question) => ({
          questionId: question.id,
          optionId: formState.answers[question.id] ?? "",
        })),
      });

      if (result.status === "error") {
        setFormState((previous) => ({ ...previous, error: result.error }));
        return;
      }

      setFormState((previous) => ({ ...previous, error: null, result: result.result }));
    });
  };

  const isComplete =
    formState.quiz !== null &&
    formState.quiz.questions.every((question) => Boolean(formState.answers[question.id]));

  return {
    formState,
    isPending,
    isComplete,
    unlockQuiz,
    chooseAnswer,
    submit,
  };
}
