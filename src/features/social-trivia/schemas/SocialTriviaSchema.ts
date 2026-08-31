import { z } from "zod";

const socialTriviaInviteCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-F0-9]{12}$/);
const socialTriviaSecretCodeSchema = z.string().trim().min(4).max(64).optional();

export const socialTriviaCreateSchema = z.object({
  quizId: z.string().uuid(),
  mode: z.enum(["live_trivia", "self_paced_race"]),
  secretCode: socialTriviaSecretCodeSchema,
});

export const socialTriviaRoomSchema = z.object({
  inviteCode: socialTriviaInviteCodeSchema,
  secretCode: socialTriviaSecretCodeSchema,
});

export const socialTriviaAnswerSchema = socialTriviaRoomSchema.extend({
  questionId: z.string().uuid(),
  optionId: z.string().uuid(),
});
