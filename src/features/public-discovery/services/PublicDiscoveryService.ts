"use server";

import { revalidatePath } from "next/cache";

import { getAuthenticationSession } from "~/features/authentication/services/AuthenticationSessionService";
import {
  findPublicDiscoveryQuizForOwner,
  findPublicDiscoveryQuizzes,
  updatePublicDiscoveryReviewStatus,
} from "../repositories/PublicDiscoveryRepository";
import { publicDiscoveryReviewRequestSchema } from "../schemas/PublicDiscoverySchema";
import type {
  PublicDiscoveryQuiz,
  PublicDiscoveryReviewActionResult,
} from "../types/PublicDiscoveryType";

export async function getPublicDiscoveryQuizzes(): Promise<PublicDiscoveryQuiz[]> {
  const quizzes = await findPublicDiscoveryQuizzes();

  return quizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    questionCount: quiz.questions.length,
    creatorName: quiz.owner.name,
    creatorUsername: quiz.owner.username,
  }));
}

export async function requestPublicDiscoveryReview(input: {
  quizId: string;
}): Promise<PublicDiscoveryReviewActionResult> {
  const parsed = publicDiscoveryReviewRequestSchema.safeParse(input);
  if (!parsed.success) return { status: "error", error: "Kuis tidak valid." };

  const session = await getAuthenticationSession();
  const userId = session?.user?.id;
  if (!userId) return { status: "error", error: "Masuk dulu untuk mengajukan review." };

  const quiz = await findPublicDiscoveryQuizForOwner(parsed.data.quizId, userId);
  if (!quiz) return { status: "error", error: "Kuis ini tidak ditemukan." };
  if (quiz.visibility !== "public") {
    return { status: "error", error: "Ubah kuis menjadi publik sebelum meminta review." };
  }
  if (quiz.reviewStatus === "approved") {
    return { status: "error", error: "Kuis ini sudah tampil di Explore." };
  }
  if (quiz.reviewStatus === "pending") {
    return { status: "error", error: "Review untuk kuis ini sedang menunggu." };
  }
  if (quiz.reviewStatus === "rejected") {
    return { status: "error", error: "Kuis yang ditolak belum bisa diajukan ulang." };
  }
  if (
    quiz.questions.length === 0 ||
    quiz.questions.some((question) => question.options.length < 2)
  ) {
    return { status: "error", error: "Lengkapi semua soal sebelum meminta review." };
  }

  await updatePublicDiscoveryReviewStatus({
    quizId: quiz.id,
    reviewStatus: "pending",
    reviewNote: null,
  });
  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/me");

  return { status: "success" };
}
