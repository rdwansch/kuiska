import { z } from "zod";

export const quizTakingAccessSchema = z.object({
  quizId: z.string().uuid(),
  secretCode: z.string().trim().min(4).max(64),
});

export const quizTakingSubmitSchema = z
  .object({
    quizId: z.string().uuid(),
    secretCode: z.string().trim().optional(),
    answers: z
      .array(
        z.object({
          questionId: z.string().uuid(),
          optionId: z.string().uuid(),
        })
      )
      .min(1),
  })
  .superRefine((submission, ctx) => {
    const questionIds = new Set<string>();

    for (const [index, answer] of submission.answers.entries()) {
      if (questionIds.has(answer.questionId)) {
        ctx.addIssue({
          code: "custom",
          path: ["answers", index, "questionId"],
          message: "Each question can only have one answer.",
        });
      }
      questionIds.add(answer.questionId);
    }
  });
