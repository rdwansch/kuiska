export type QuizTakingOption = {
  id: string;
  content: string;
  position: number;
};

export type QuizTakingQuestion = {
  id: string;
  content: string;
  position: number;
  options: QuizTakingOption[];
};

export type QuizTakingQuiz = {
  id: string;
  title: string;
  description: string;
  category: "technology" | "general" | "entertainment";
  questions: QuizTakingQuestion[];
};

export type QuizTakingAccessState =
  | { status: "ready"; quiz: QuizTakingQuiz }
  | { status: "private"; quizId: string }
  | { status: "not-found" };

export type QuizTakingAccessResult =
  | { status: "ready"; quiz: QuizTakingQuiz }
  | { status: "not-found" }
  | { status: "error"; error: string };

export type QuizTakingAnswerInput = {
  questionId: string;
  optionId: string;
};

export type QuizTakingSubmitInput = {
  quizId: string;
  answers: QuizTakingAnswerInput[];
  secretCode?: string;
};

export type QuizTakingResultData = {
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  isAuthenticated: boolean;
};

export type QuizTakingSubmitResult =
  { status: "success"; result: QuizTakingResultData } | { status: "error"; error: string };

export type QuizTakingFormState = {
  quiz: QuizTakingQuiz | null;
  answers: Record<string, string>;
  secretCode: string | null;
  error: string | null;
  result: QuizTakingResultData | null;
};
