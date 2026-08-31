import { notFound } from "next/navigation";
import { createElement } from "react";

import { QuizTakingForm } from "./components/QuizTakingForm";
import { getQuizTakingInitialState } from "./services/QuizTakingService";

export async function QuizTakingPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  const initialState = await getQuizTakingInitialState(quizId);

  if (initialState.status === "not-found") notFound();

  return createElement(QuizTakingForm, { initialState });
}
