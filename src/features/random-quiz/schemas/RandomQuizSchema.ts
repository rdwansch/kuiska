import { z } from "zod";

export const randomQuizCategorySchema = z.enum(["technology", "general", "entertainment"]);

export type RandomQuizCategoryInput = z.infer<typeof randomQuizCategorySchema>;
