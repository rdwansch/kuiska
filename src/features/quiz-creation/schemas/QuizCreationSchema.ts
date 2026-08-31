import { z } from "zod";

import { quizCategories, quizVisibilities } from "../types/QuizCreationType";

const quizCreationOptionSchema = z.object({
  content: z.string().trim().min(1, "Every answer option needs text.").max(500),
  isCorrect: z.boolean(),
});

const quizCreationQuestionSchema = z
  .object({
    content: z.string().trim().min(1, "Every question needs text.").max(1000),
    options: z.array(quizCreationOptionSchema).min(2, "Each question needs at least two options."),
  })
  .superRefine((question, ctx) => {
    if (question.options.filter((option) => option.isCorrect).length !== 1) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: "Choose exactly one correct answer for every question.",
      });
    }
  });

export const quizCreationSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters.").max(120),
    description: z.string().trim().min(10, "Description must be at least 10 characters.").max(500),
    category: z.enum(quizCategories),
    visibility: z.enum(quizVisibilities),
    secretCode: z.string().trim().optional(),
    questions: z.array(quizCreationQuestionSchema).min(1, "Add at least one question."),
  })
  .superRefine((quiz, ctx) => {
    const hasSecretCode = Boolean(quiz.secretCode);

    if (quiz.visibility === "private" && !hasSecretCode) {
      ctx.addIssue({
        code: "custom",
        path: ["secretCode"],
        message: "Private quizzes need a 4–64 character secret code.",
      });
    }

    if (quiz.visibility === "private" && quiz.secretCode) {
      if (quiz.secretCode.length < 4 || quiz.secretCode.length > 64) {
        ctx.addIssue({
          code: "custom",
          path: ["secretCode"],
          message: "Private quizzes need a 4–64 character secret code.",
        });
      }
    }

    if (quiz.visibility === "public" && hasSecretCode) {
      ctx.addIssue({
        code: "custom",
        path: ["secretCode"],
        message: "Public quizzes cannot have a secret code.",
      });
    }
  });
