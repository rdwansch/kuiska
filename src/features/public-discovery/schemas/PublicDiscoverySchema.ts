import { z } from "zod";

export const publicDiscoveryReviewRequestSchema = z.object({
  quizId: z.string().uuid(),
});
