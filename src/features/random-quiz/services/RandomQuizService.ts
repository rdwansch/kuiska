"use server";

import { randomInt } from "node:crypto";

import {
  countEligibleQuizzes,
  findRandomQuizIdByOffset,
} from "../repositories/RandomQuizRepository";
import type { RandomQuizCategory, RandomQuizResult } from "../types/RandomQuizType";

function generateSecureOffset(max: number): number {
  return randomInt(0, max);
}

async function selectRandomQuizId(category: RandomQuizCategory): Promise<string | null> {
  const count = await countEligibleQuizzes(category);
  if (count === 0) return null;

  const offset = generateSecureOffset(count);
  const quizId = await findRandomQuizIdByOffset(category, offset);

  if (quizId) return quizId;

  const retryCount = await countEligibleQuizzes(category);
  if (retryCount === 0) return null;

  const retryOffset = generateSecureOffset(retryCount);
  return findRandomQuizIdByOffset(category, retryOffset);
}

export async function getRandomQuizForCategory(
  category: RandomQuizCategory
): Promise<RandomQuizResult> {
  const quizId = await selectRandomQuizId(category);
  if (!quizId) {
    return { status: "empty", category };
  }

  return { status: "redirect", quizId };
}
