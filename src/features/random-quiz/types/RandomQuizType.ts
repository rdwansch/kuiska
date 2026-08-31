export type RandomQuizCategory = "technology" | "general" | "entertainment";

export type RandomQuizResult =
  { status: "redirect"; quizId: string } | { status: "empty"; category: RandomQuizCategory };
