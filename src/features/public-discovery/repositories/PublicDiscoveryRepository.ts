import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { db } from "~/lib/db";
import { quiz } from "~/lib/db/schema";
import type { PublicDiscoveryReviewStatus } from "../types/PublicDiscoveryType";

export async function findPublicDiscoveryQuizzes() {
  return db.query.quiz.findMany({
    where: and(eq(quiz.visibility, "public"), eq(quiz.reviewStatus, "approved")),
    orderBy: [desc(quiz.createdAt)],
    with: {
      owner: { columns: { name: true, username: true } },
      questions: { columns: { id: true } },
    },
  });
}

export async function findPublicDiscoveryQuizForOwner(quizId: string, ownerId: string) {
  return db.query.quiz.findFirst({
    where: and(eq(quiz.id, quizId), eq(quiz.ownerId, ownerId)),
    with: {
      questions: {
        columns: { id: true },
        with: { options: { columns: { id: true } } },
      },
    },
  });
}

export async function updatePublicDiscoveryReviewStatus(input: {
  quizId: string;
  reviewStatus: PublicDiscoveryReviewStatus;
  reviewNote: string | null;
}) {
  await db
    .update(quiz)
    .set({ reviewStatus: input.reviewStatus, reviewNote: input.reviewNote })
    .where(eq(quiz.id, input.quizId));
}
