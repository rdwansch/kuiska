import "server-only";

import { and, eq, sql } from "drizzle-orm";

import { db } from "~/lib/db";
import { quiz } from "~/lib/db/schema";
import type { RandomQuizCategory } from "../types/RandomQuizType";

export async function countEligibleQuizzes(category: RandomQuizCategory): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(quiz)
    .where(
      and(
        eq(quiz.visibility, "public"),
        eq(quiz.reviewStatus, "approved"),
        eq(quiz.category, category)
      )
    );

  return result[0]?.count ?? 0;
}

export async function findRandomQuizIdByOffset(
  category: RandomQuizCategory,
  offset: number
): Promise<string | null> {
  const result = await db
    .select({ id: quiz.id })
    .from(quiz)
    .where(
      and(
        eq(quiz.visibility, "public"),
        eq(quiz.reviewStatus, "approved"),
        eq(quiz.category, category)
      )
    )
    .orderBy(quiz.id)
    .limit(1)
    .offset(offset);

  return result[0]?.id ?? null;
}
