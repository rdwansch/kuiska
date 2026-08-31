#!/usr/bin/env bun

import { createHash } from "node:crypto";
import { loadEnvConfig } from "@next/env";
import { eq } from "drizzle-orm";
import { hashPassword } from "../src/lib/auth-password";
import { option, question, quiz, user } from "../src/lib/db/schema";
import { quizCreationSchema } from "../src/features/quiz-creation/schemas/QuizCreationSchema";
import { seedQuizzes, seedUsers, type SeedQuiz } from "./seed.data";

loadEnvConfig(process.cwd());

function stableId(value: string) {
  const hash = createHash("sha256").update(value).digest("hex");
  const variant = ["8", "9", "a", "b"][parseInt(hash[16]!, 16) % 4]!;

  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-${variant}${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

function validateQuiz(seedQuiz: SeedQuiz) {
  const parsed = quizCreationSchema.safeParse(seedQuiz);

  if (!parsed.success) {
    throw new Error(`${seedQuiz.key}: ${parsed.error.issues[0]?.message ?? "Invalid quiz."}`);
  }

  if (
    seedQuiz.visibility === "private" &&
    seedQuiz.reviewStatus &&
    seedQuiz.reviewStatus !== "not_requested"
  ) {
    throw new Error(`${seedQuiz.key}: private quizzes cannot have a discovery review status.`);
  }
}

function validateSeedData() {
  const emails = new Set<string>();
  const quizKeys = new Set<string>();

  for (const seedUser of seedUsers) {
    if (emails.has(seedUser.email)) {
      throw new Error(`Duplicate person email: ${seedUser.email}`);
    }

    emails.add(seedUser.email);
  }

  for (const seedQuiz of seedQuizzes) {
    if (quizKeys.has(seedQuiz.key)) {
      throw new Error(`Duplicate quiz key: ${seedQuiz.key}`);
    }

    if (!emails.has(seedQuiz.ownerEmail)) {
      throw new Error(`${seedQuiz.key}: ${seedQuiz.ownerEmail} is not listed in seedUsers.`);
    }

    quizKeys.add(seedQuiz.key);
    validateQuiz(seedQuiz);
  }
}

async function seedPeople() {
  const { auth } = await import("../src/lib/auth");
  const { db } = await import("../src/lib/db");
  let inserted = 0;
  let skipped = 0;

  for (const seedUser of seedUsers) {
    const [existingUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, seedUser.email))
      .limit(1);

    if (existingUser) {
      skipped += 1;
      continue;
    }

    await auth.api.signUpEmail({ body: seedUser });
    inserted += 1;
  }

  return { inserted, skipped };
}

async function seedQuizRecords() {
  const { db } = await import("../src/lib/db");
  let inserted = 0;
  let skipped = 0;

  for (const seedQuiz of seedQuizzes) {
    const [owner] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, seedQuiz.ownerEmail))
      .limit(1);

    if (!owner) {
      throw new Error(`${seedQuiz.key}: owner ${seedQuiz.ownerEmail} was not created.`);
    }

    const quizId = stableId(`quiz:${owner.id}:${seedQuiz.key}`);
    const [existingQuiz] = await db
      .select({ id: quiz.id })
      .from(quiz)
      .where(eq(quiz.id, quizId))
      .limit(1);

    if (existingQuiz) {
      skipped += 1;
      continue;
    }

    const reviewStatus = seedQuiz.reviewStatus ?? "not_requested";
    const secretCodeHash = seedQuiz.secretCode ? await hashPassword(seedQuiz.secretCode) : null;

    await db.transaction(async (transaction) => {
      await transaction.insert(quiz).values({
        id: quizId,
        ownerId: owner.id,
        title: seedQuiz.title,
        description: seedQuiz.description,
        category: seedQuiz.category,
        visibility: seedQuiz.visibility,
        secretCodeHash,
        reviewStatus,
        reviewedAt: reviewStatus === "approved" ? new Date() : null,
      });

      for (const [questionIndex, seedQuestion] of seedQuiz.questions.entries()) {
        const questionId = stableId(`question:${quizId}:${questionIndex}`);

        await transaction.insert(question).values({
          id: questionId,
          quizId,
          content: seedQuestion.content,
          position: questionIndex + 1,
        });

        await transaction.insert(option).values(
          seedQuestion.options.map((seedOption, optionIndex) => ({
            id: stableId(`option:${questionId}:${optionIndex}`),
            questionId,
            content: seedOption.content,
            isCorrect: seedOption.isCorrect,
            position: optionIndex + 1,
          }))
        );
      }
    });

    inserted += 1;
  }

  return { inserted, skipped };
}

async function seed() {
  validateSeedData();

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const { databasePool } = await import("../src/lib/db");

  try {
    const people = await seedPeople();
    const quizzes = await seedQuizRecords();

    console.log(
      `Seed complete: ${people.inserted} people inserted, ${people.skipped} people already present; ${quizzes.inserted} quizzes inserted, ${quizzes.skipped} quizzes already present.`
    );
  } finally {
    await databasePool.end();
  }
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
