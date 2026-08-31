import "server-only";

import { randomBytes, randomUUID } from "node:crypto";

import { and, asc, eq, ne, sql } from "drizzle-orm";

import { db } from "~/lib/db";
import { gameRoom, option, question, quiz, roomAnswer, roomParticipant } from "~/lib/db/schema";
import type { SocialTriviaMode } from "../types/SocialTriviaType";

const LIVE_QUESTION_DURATION_MS = 20_000;
const LIVE_REVEAL_DURATION_MS = 3_000;
const RACE_DEADLINE_MS = 86_400_000;

function createInviteCode() {
  return randomBytes(6).toString("hex").toUpperCase();
}

async function lockRoom(
  transaction: Parameters<Parameters<typeof db.transaction>[0]>[0],
  roomId: string
) {
  await transaction.execute(sql`select id from game_room where id = ${roomId} for update`);
}

async function finaliseRoom(
  transaction: Parameters<Parameters<typeof db.transaction>[0]>[0],
  room: typeof gameRoom.$inferSelect,
  completedAt: Date,
  status: "completed" | "expired" = "completed"
) {
  const participants = await transaction
    .select()
    .from(roomParticipant)
    .where(eq(roomParticipant.roomId, room.id));

  const rankedParticipants = participants
    .map((participant) => ({
      ...participant,
      totalAnswerDurationMs:
        room.mode === "self_paced_race" && !participant.completedAt && participant.startedAt
          ? Math.max(0, completedAt.getTime() - participant.startedAt.getTime())
          : participant.totalAnswerDurationMs,
    }))
    .sort(
      (left, right) =>
        right.correctAnswers - left.correctAnswers ||
        left.totalAnswerDurationMs - right.totalAnswerDurationMs ||
        left.joinedAt.getTime() - right.joinedAt.getTime()
    );

  await Promise.all(
    rankedParticipants.map((participant, index) =>
      transaction
        .update(roomParticipant)
        .set({
          status: "completed",
          completedAt: participant.completedAt ?? completedAt,
          totalAnswerDurationMs: participant.totalAnswerDurationMs,
          rank: index + 1,
        })
        .where(eq(roomParticipant.id, participant.id))
    )
  );

  await transaction
    .update(gameRoom)
    .set({ status, completedAt, questionRevealEndsAt: null })
    .where(eq(gameRoom.id, room.id));
}

export async function findSocialTriviaQuiz(quizId: string) {
  return db.query.quiz.findFirst({
    where: eq(quiz.id, quizId),
    with: { questions: { orderBy: [asc(question.position)] } },
  });
}

export async function findSocialTriviaRoom(inviteCode: string) {
  return db.query.gameRoom.findFirst({
    where: eq(gameRoom.inviteCode, inviteCode),
    with: {
      quiz: {
        with: {
          questions: {
            orderBy: [asc(question.position)],
            with: { options: { orderBy: [asc(option.position)] } },
          },
        },
      },
      participants: {
        orderBy: [asc(roomParticipant.joinedAt)],
        with: {
          user: { columns: { id: true, name: true, username: true } },
          answers: true,
        },
      },
    },
  });
}

export async function createSocialTriviaRoom(input: {
  quizId: string;
  creatorId: string;
  mode: SocialTriviaMode;
}) {
  const roomId = randomUUID();
  const inviteCode = createInviteCode();

  await db.transaction(async (transaction) => {
    await transaction.insert(gameRoom).values({
      id: roomId,
      quizId: input.quizId,
      creatorId: input.creatorId,
      mode: input.mode,
      status: "waiting",
      inviteCode,
      participantLimit: 2,
    });
    await transaction.insert(roomParticipant).values({
      id: randomUUID(),
      roomId,
      userId: input.creatorId,
      status: "joined",
    });
  });

  return { inviteCode };
}

export async function joinSocialTriviaRoom(input: { roomId: string; userId: string }) {
  return db.transaction(async (transaction) => {
    await lockRoom(transaction, input.roomId);
    const [room] = await transaction.select().from(gameRoom).where(eq(gameRoom.id, input.roomId));

    if (!room || room.status !== "waiting") return "unavailable" as const;

    const participants = await transaction
      .select({ id: roomParticipant.id, userId: roomParticipant.userId })
      .from(roomParticipant)
      .where(eq(roomParticipant.roomId, room.id));

    if (participants.some((participant) => participant.userId === input.userId)) {
      return "duplicate" as const;
    }
    if (participants.length >= room.participantLimit) return "full" as const;

    await transaction.insert(roomParticipant).values({
      id: randomUUID(),
      roomId: room.id,
      userId: input.userId,
      status: "joined",
    });

    return "joined" as const;
  });
}

export async function startSocialTriviaRoom(input: { roomId: string; userId: string }) {
  return db.transaction(async (transaction) => {
    await lockRoom(transaction, input.roomId);
    const [room] = await transaction.select().from(gameRoom).where(eq(gameRoom.id, input.roomId));

    if (!room || room.status !== "waiting") return "unavailable" as const;
    if (room.creatorId !== input.userId) return "forbidden" as const;

    const participants = await transaction
      .select({ id: roomParticipant.id })
      .from(roomParticipant)
      .where(eq(roomParticipant.roomId, room.id));

    if (participants.length !== room.participantLimit) return "waiting" as const;

    const startedAt = new Date();
    const roomUpdate =
      room.mode === "live_trivia"
        ? {
            status: "active" as const,
            currentQuestionPosition: 1,
            questionOpenedAt: startedAt,
            questionEndsAt: new Date(startedAt.getTime() + LIVE_QUESTION_DURATION_MS),
            startedAt,
          }
        : {
            status: "active" as const,
            deadlineAt: new Date(startedAt.getTime() + RACE_DEADLINE_MS),
            startedAt,
          };

    await transaction.update(gameRoom).set(roomUpdate).where(eq(gameRoom.id, room.id));
    await transaction
      .update(roomParticipant)
      .set({ status: "playing", startedAt })
      .where(eq(roomParticipant.roomId, room.id));

    return "started" as const;
  });
}

export async function synchroniseSocialTriviaRoom(roomId: string) {
  await db.transaction(async (transaction) => {
    await lockRoom(transaction, roomId);
    const [room] = await transaction.select().from(gameRoom).where(eq(gameRoom.id, roomId));
    if (!room || room.status !== "active") return;

    const now = new Date();

    if (room.mode === "self_paced_race") {
      if (room.deadlineAt && now >= room.deadlineAt) {
        await finaliseRoom(transaction, room, room.deadlineAt, "expired");
      }
      return;
    }

    if (!room.questionEndsAt || !room.currentQuestionPosition) return;
    if (now < room.questionEndsAt) return;

    if (!room.questionRevealEndsAt) {
      await transaction
        .update(gameRoom)
        .set({ questionRevealEndsAt: new Date(now.getTime() + LIVE_REVEAL_DURATION_MS) })
        .where(eq(gameRoom.id, room.id));
      return;
    }

    if (now < room.questionRevealEndsAt) return;

    const [{ questionCount }] = await transaction
      .select({ questionCount: sql<number>`count(*)` })
      .from(question)
      .where(eq(question.quizId, room.quizId));

    if (room.currentQuestionPosition >= Number(questionCount)) {
      await finaliseRoom(transaction, room, now);
      return;
    }

    await transaction
      .update(gameRoom)
      .set({
        currentQuestionPosition: room.currentQuestionPosition + 1,
        questionOpenedAt: now,
        questionEndsAt: new Date(now.getTime() + LIVE_QUESTION_DURATION_MS),
        questionRevealEndsAt: null,
      })
      .where(eq(gameRoom.id, room.id));
  });
}

export async function submitSocialTriviaAnswer(input: {
  roomId: string;
  userId: string;
  questionId: string;
  optionId: string;
}) {
  return db.transaction(async (transaction) => {
    await lockRoom(transaction, input.roomId);
    const [room] = await transaction.select().from(gameRoom).where(eq(gameRoom.id, input.roomId));
    if (!room || room.status !== "active") return "unavailable" as const;
    if (room.mode === "self_paced_race" && room.deadlineAt && new Date() >= room.deadlineAt) {
      return "unavailable" as const;
    }

    const [participant] = await transaction
      .select()
      .from(roomParticipant)
      .where(and(eq(roomParticipant.roomId, room.id), eq(roomParticipant.userId, input.userId)));
    if (!participant || participant.status !== "playing") return "forbidden" as const;

    const [submittedQuestion] = await transaction
      .select()
      .from(question)
      .where(and(eq(question.id, input.questionId), eq(question.quizId, room.quizId)));
    if (!submittedQuestion) return "invalid-answer" as const;

    if (
      room.mode === "live_trivia" &&
      submittedQuestion.position !== room.currentQuestionPosition
    ) {
      return "invalid-answer" as const;
    }
    if (
      room.mode === "live_trivia" &&
      (!room.questionEndsAt || new Date() >= room.questionEndsAt || room.questionRevealEndsAt)
    ) {
      return "late" as const;
    }

    const [submittedOption] = await transaction
      .select()
      .from(option)
      .where(and(eq(option.id, input.optionId), eq(option.questionId, submittedQuestion.id)));
    if (!submittedOption) return "invalid-answer" as const;

    const [existingAnswer] = await transaction
      .select({ id: roomAnswer.id })
      .from(roomAnswer)
      .where(
        and(
          eq(roomAnswer.roomParticipantId, participant.id),
          eq(roomAnswer.questionId, submittedQuestion.id)
        )
      );
    if (existingAnswer) return "already-answered" as const;

    const submittedAt = new Date();
    const answerDurationMs =
      room.mode === "live_trivia" && room.questionOpenedAt
        ? Math.max(0, submittedAt.getTime() - room.questionOpenedAt.getTime())
        : 0;

    await transaction.insert(roomAnswer).values({
      id: randomUUID(),
      roomParticipantId: participant.id,
      questionId: submittedQuestion.id,
      optionId: submittedOption.id,
      submittedAt,
      isCorrect: submittedOption.isCorrect,
    });

    await transaction
      .update(roomParticipant)
      .set({
        correctAnswers: participant.correctAnswers + Number(submittedOption.isCorrect),
        totalAnswerDurationMs:
          room.mode === "live_trivia"
            ? participant.totalAnswerDurationMs + answerDurationMs
            : participant.totalAnswerDurationMs,
      })
      .where(eq(roomParticipant.id, participant.id));

    if (room.mode === "live_trivia") return "submitted" as const;

    const [{ answeredCount }] = await transaction
      .select({ answeredCount: sql<number>`count(*)` })
      .from(roomAnswer)
      .where(eq(roomAnswer.roomParticipantId, participant.id));
    const [{ questionCount }] = await transaction
      .select({ questionCount: sql<number>`count(*)` })
      .from(question)
      .where(eq(question.quizId, room.quizId));

    if (Number(answeredCount) < Number(questionCount)) return "submitted" as const;

    const completedAt = new Date();
    await transaction
      .update(roomParticipant)
      .set({
        status: "completed",
        completedAt,
        totalAnswerDurationMs: Math.max(
          0,
          completedAt.getTime() - participant.startedAt!.getTime()
        ),
      })
      .where(eq(roomParticipant.id, participant.id));

    const incompleteParticipants = await transaction
      .select({ id: roomParticipant.id })
      .from(roomParticipant)
      .where(and(eq(roomParticipant.roomId, room.id), ne(roomParticipant.status, "completed")));

    if (incompleteParticipants.length === 0) await finaliseRoom(transaction, room, completedAt);

    return "submitted" as const;
  });
}
