"use server";

import { verifyPassword } from "~/lib/auth-password";
import { getAuthenticationSession } from "~/features/authentication/services/AuthenticationSessionService";
import {
  createSocialTriviaRoom,
  findSocialTriviaQuiz,
  findSocialTriviaRoom,
  joinSocialTriviaRoom as joinSocialTriviaRoomRepository,
  startSocialTriviaRoom as startSocialTriviaRoomRepository,
  submitSocialTriviaAnswer as submitSocialTriviaAnswerRepository,
  synchroniseSocialTriviaRoom,
} from "../repositories/SocialTriviaRepository";
import {
  socialTriviaAnswerSchema,
  socialTriviaCreateSchema,
  socialTriviaRoomSchema,
} from "../schemas/SocialTriviaSchema";
import type {
  SocialTriviaActionResult,
  SocialTriviaQuestion,
  SocialTriviaRoomSummary,
  SocialTriviaSnapshot,
} from "../types/SocialTriviaType";

function sanitiseQuestion(question: {
  id: string;
  content: string;
  position: number;
  options: Array<{ id: string; content: string; position: number }>;
}): SocialTriviaQuestion {
  return {
    id: question.id,
    content: question.content,
    position: question.position,
    options: question.options.map((option) => ({
      id: option.id,
      content: option.content,
      position: option.position,
    })),
  };
}

function roomSummary(
  room: NonNullable<Awaited<ReturnType<typeof findSocialTriviaRoom>>>,
  userId: string
): SocialTriviaRoomSummary {
  return {
    quizId: room.quizId,
    inviteCode: room.inviteCode,
    mode: room.mode,
    status: room.status,
    title: room.quiz.title,
    description: room.quiz.description,
    category: room.quiz.category,
    questionCount: room.quiz.questions.length,
    players: room.participants.map((participant) => ({
      id: participant.id,
      name: participant.user.name,
      username: participant.user.username,
      status: participant.status,
    })),
    isCreator: room.creatorId === userId,
  };
}

async function hasValidSecretCode(
  room: NonNullable<Awaited<ReturnType<typeof findSocialTriviaRoom>>>,
  secretCode?: string
) {
  if (room.quiz.visibility !== "private") return true;
  if (!room.quiz.secretCodeHash || !secretCode) return false;

  return verifyPassword({ hash: room.quiz.secretCodeHash, password: secretCode });
}

async function getAuthenticatedUserId() {
  const session = await getAuthenticationSession();
  return session?.user?.id ?? null;
}

async function findAccessibleRoom(inviteCode: string, secretCode?: string) {
  const room = await findSocialTriviaRoom(inviteCode);
  if (!room) return { room: null, error: "Room tidak ditemukan." };
  if (!(await hasValidSecretCode(room, secretCode))) {
    return { room: null, error: "Kode rahasia tidak valid." };
  }

  return { room, error: null };
}

function provisionalRank(
  room: NonNullable<Awaited<ReturnType<typeof findSocialTriviaRoom>>>,
  participantId: string
) {
  const rankedPlayers = [...room.participants].sort(
    (left, right) =>
      right.correctAnswers - left.correctAnswers ||
      (left.status === "completed" ? left.totalAnswerDurationMs : Number.MAX_SAFE_INTEGER) -
        (right.status === "completed" ? right.totalAnswerDurationMs : Number.MAX_SAFE_INTEGER) ||
      left.joinedAt.getTime() - right.joinedAt.getTime()
  );
  const index = rankedPlayers.findIndex((participant) => participant.id === participantId);
  return index === -1 ? null : index + 1;
}

export async function getSocialTriviaSnapshot(input: {
  inviteCode: string;
  secretCode?: string;
}): Promise<SocialTriviaSnapshot> {
  const parsed = socialTriviaRoomSchema.safeParse(input);
  if (!parsed.success) return { status: "not-found" };

  const userId = await getAuthenticatedUserId();
  if (!userId) return { status: "unauthenticated", inviteCode: parsed.data.inviteCode };

  const initialRoom = await findSocialTriviaRoom(parsed.data.inviteCode);
  if (!initialRoom) return { status: "not-found" };
  if (!(await hasValidSecretCode(initialRoom, parsed.data.secretCode))) {
    return { status: "private", inviteCode: initialRoom.inviteCode };
  }

  await synchroniseSocialTriviaRoom(initialRoom.id);
  const room = await findSocialTriviaRoom(parsed.data.inviteCode);
  if (!room) return { status: "not-found" };

  const summary = roomSummary(room, userId);
  const participant = room.participants.find((item) => item.userId === userId);

  if (room.status === "completed" || room.status === "expired") {
    return {
      status: "completed",
      room: summary,
      results: [...room.participants]
        .sort((left, right) => (left.rank ?? Infinity) - (right.rank ?? Infinity))
        .map((item) => ({
          id: item.id,
          name: item.user.name,
          username: item.user.username,
          correctAnswers: item.correctAnswers,
          totalAnswerDurationMs: item.totalAnswerDurationMs,
          rank: item.rank ?? room.participants.length,
        })),
    };
  }

  if (!participant) {
    return room.status === "waiting" && room.participants.length < room.participantLimit
      ? { status: "join", room: summary }
      : { status: "full", room: summary };
  }

  if (room.status === "waiting") {
    return {
      status: "lobby",
      room: summary,
      canStart: room.creatorId === userId && room.participants.length === room.participantLimit,
    };
  }

  if (room.mode === "live_trivia") {
    const currentQuestion = room.quiz.questions.find(
      (question) => question.position === room.currentQuestionPosition
    );
    if (!currentQuestion || !room.questionEndsAt) return { status: "full", room: summary };

    const selectedAnswer = participant.answers.find(
      (answer) => answer.questionId === currentQuestion.id
    );
    const isRevealing = Boolean(room.questionRevealEndsAt);

    return {
      status: "live",
      room: summary,
      question: sanitiseQuestion(currentQuestion),
      selectedOptionId: selectedAnswer?.optionId ?? null,
      phase: isRevealing ? "revealing" : selectedAnswer ? "locked" : "answering",
      questionEndsAt: room.questionEndsAt.toISOString(),
      questionRevealEndsAt: room.questionRevealEndsAt?.toISOString() ?? null,
      revealedAnswers: isRevealing
        ? room.participants.flatMap((item) =>
            item.answers
              .filter((answer) => answer.questionId === currentQuestion.id)
              .map((answer) => ({
                participantId: item.id,
                optionId: answer.optionId,
                isCorrect: answer.isCorrect,
              }))
          )
        : null,
      correctOptionId: isRevealing
        ? (currentQuestion.options.find((option) => option.isCorrect)?.id ?? null)
        : null,
    };
  }

  const answeredQuestionIds = new Set(participant.answers.map((answer) => answer.questionId));
  const nextQuestion = room.quiz.questions.find(
    (question) => !answeredQuestionIds.has(question.id)
  );
  const isComplete = participant.status === "completed";

  return {
    status: "race",
    room: summary,
    question: nextQuestion ? sanitiseQuestion(nextQuestion) : null,
    progress: answeredQuestionIds.size,
    isComplete,
    provisionalRank: isComplete ? provisionalRank(room, participant.id) : null,
  };
}

export async function createSocialTriviaRoomAction(input: {
  quizId: string;
  mode: "live_trivia" | "self_paced_race";
  secretCode?: string;
}): Promise<SocialTriviaActionResult> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { status: "error", error: "Masuk dulu untuk membuat room." };

  const parsed = socialTriviaCreateSchema.safeParse(input);
  if (!parsed.success) return { status: "error", error: "Pilih mode room yang valid." };

  const quiz = await findSocialTriviaQuiz(parsed.data.quizId);
  if (!quiz || quiz.questions.length === 0) {
    return { status: "error", error: "Kuis ini belum punya soal untuk dimainkan." };
  }
  if (
    quiz.visibility === "private" &&
    (!quiz.secretCodeHash ||
      !parsed.data.secretCode ||
      !(await verifyPassword({ hash: quiz.secretCodeHash, password: parsed.data.secretCode })))
  ) {
    return { status: "error", error: "Kode rahasia tidak valid." };
  }

  try {
    const room = await createSocialTriviaRoom({
      quizId: quiz.id,
      creatorId: userId,
      mode: parsed.data.mode,
    });
    return { status: "success", roomUrl: `/rooms/${room.inviteCode}` };
  } catch {
    return { status: "error", error: "Room belum bisa dibuat. Coba lagi." };
  }
}

export async function joinSocialTriviaRoomAction(input: {
  inviteCode: string;
  secretCode?: string;
}): Promise<SocialTriviaActionResult> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { status: "error", error: "Masuk dulu untuk bergabung ke room." };

  const parsed = socialTriviaRoomSchema.safeParse(input);
  if (!parsed.success) return { status: "error", error: "Kode room tidak valid." };
  const { room, error } = await findAccessibleRoom(parsed.data.inviteCode, parsed.data.secretCode);
  if (!room) return { status: "error", error: error! };

  const result = await joinSocialTriviaRoomRepository({ roomId: room.id, userId });
  if (result === "joined") return { status: "success" };
  if (result === "duplicate") return { status: "error", error: "Kamu sudah ada di room ini." };
  if (result === "full") return { status: "error", error: "Room ini sudah penuh." };
  return { status: "error", error: "Room ini tidak bisa diikuti sekarang." };
}

export async function startSocialTriviaRoomAction(input: {
  inviteCode: string;
  secretCode?: string;
}): Promise<SocialTriviaActionResult> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { status: "error", error: "Masuk dulu untuk memulai room." };

  const parsed = socialTriviaRoomSchema.safeParse(input);
  if (!parsed.success) return { status: "error", error: "Kode room tidak valid." };
  const { room, error } = await findAccessibleRoom(parsed.data.inviteCode, parsed.data.secretCode);
  if (!room) return { status: "error", error: error! };

  const result = await startSocialTriviaRoomRepository({ roomId: room.id, userId });
  if (result === "started") return { status: "success" };
  if (result === "forbidden")
    return { status: "error", error: "Hanya pembuat room yang bisa memulai." };
  if (result === "waiting") return { status: "error", error: "Tunggu satu pemain lagi." };
  return { status: "error", error: "Room ini tidak bisa dimulai sekarang." };
}

export async function submitSocialTriviaAnswerAction(input: {
  inviteCode: string;
  questionId: string;
  optionId: string;
  secretCode?: string;
}): Promise<SocialTriviaActionResult> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { status: "error", error: "Sesi kamu sudah berakhir. Masuk lagi." };

  const parsed = socialTriviaAnswerSchema.safeParse(input);
  if (!parsed.success) return { status: "error", error: "Jawaban tidak valid." };
  const { room, error } = await findAccessibleRoom(parsed.data.inviteCode, parsed.data.secretCode);
  if (!room) return { status: "error", error: error! };

  const result = await submitSocialTriviaAnswerRepository({
    roomId: room.id,
    userId,
    questionId: parsed.data.questionId,
    optionId: parsed.data.optionId,
  });
  if (result === "submitted") return { status: "success" };
  if (result === "late") return { status: "error", error: "Waktu untuk soal ini sudah habis." };
  if (result === "already-answered") return { status: "error", error: "Jawabanmu sudah terkunci." };
  if (result === "invalid-answer")
    return { status: "error", error: "Jawaban tidak cocok dengan soal room." };
  if (result === "forbidden")
    return { status: "error", error: "Kamu belum bisa menjawab di room ini." };
  return { status: "error", error: "Room ini tidak menerima jawaban sekarang." };
}
