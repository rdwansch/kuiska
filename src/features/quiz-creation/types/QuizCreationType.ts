export const quizCategories = ["technology", "general", "entertainment"] as const;
export const quizVisibilities = ["public", "private"] as const;

export type QuizCreationCategory = (typeof quizCategories)[number];
export type QuizCreationVisibility = (typeof quizVisibilities)[number];

export type QuizCreationOptionInput = {
  content: string;
  isCorrect: boolean;
};

export type QuizCreationQuestionInput = {
  content: string;
  options: QuizCreationOptionInput[];
};

export type QuizCreationInput = {
  title: string;
  description: string;
  category: QuizCreationCategory;
  visibility: QuizCreationVisibility;
  secretCode?: string;
  questions: QuizCreationQuestionInput[];
};

export type QuizCreationActionResult =
  | {
      status: "success";
      quizId: string;
      quizUrl: string;
    }
  | {
      status: "error";
      error: string;
    };

export type QuizCreationFormOption = QuizCreationOptionInput & {
  id: string;
};

export type QuizCreationFormQuestion = Omit<QuizCreationQuestionInput, "options"> & {
  id: string;
  options: QuizCreationFormOption[];
};

export type QuizCreationFormInput = Omit<QuizCreationInput, "questions"> & {
  secretCode: string;
  questions: QuizCreationFormQuestion[];
  error: string | null;
  status: "idle" | "pending" | "success" | "error";
  result: Extract<QuizCreationActionResult, { status: "success" }> | null;
};

export type QuizCreationRepositoryInput = Omit<QuizCreationInput, "secretCode"> & {
  ownerId: string;
  secretCodeHash: string | null;
};
