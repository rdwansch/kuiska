import "server-only";

import { asc, desc, eq, sql } from "drizzle-orm";

import { db } from "~/lib/db";
import { quizAttempt, user } from "~/lib/db/schema";

const completedCount = sql<number>`count(${quizAttempt.id})`;
const averageScore = sql<number>`avg(${quizAttempt.score})`;

export function findGlobalLeaderboardEntries(offset: number, limit: number) {
  return db
    .select({
      userId: user.id,
      username: user.username,
      completedCount,
      averageScore,
    })
    .from(quizAttempt)
    .innerJoin(user, eq(quizAttempt.userId, user.id))
    .groupBy(user.id, user.username)
    .orderBy(desc(completedCount), asc(user.username), asc(user.id))
    .limit(limit)
    .offset(offset);
}
