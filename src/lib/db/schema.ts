import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  username: varchar("username", { length: 64 }).notNull().unique(),
  displayUsername: varchar("display_username", { length: 64 }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  issuer: varchar("issuer", { length: 255 }).notNull(),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const jwks = mysqlTable("jwks", {
  id: varchar("id", { length: 36 }).primaryKey(),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const quiz = mysqlTable(
  "quiz",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    ownerId: varchar("owner_id", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 120 }).notNull(),
    description: varchar("description", { length: 500 }).notNull(),
    category: mysqlEnum("category", ["technology", "general", "entertainment"]).notNull(),
    visibility: mysqlEnum("visibility", ["public", "private"]).notNull(),
    secretCodeHash: text("secret_code_hash"),
    reviewStatus: mysqlEnum("review_status", ["not_requested", "pending", "approved", "rejected"])
      .notNull()
      .default("not_requested"),
    reviewedAt: timestamp("reviewed_at"),
    reviewNote: varchar("review_note", { length: 500 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => [
    index("quiz_owner_id_idx").on(table.ownerId),
    index("quiz_public_discovery_idx").on(table.visibility, table.reviewStatus, table.createdAt),
    index("quiz_random_category_idx").on(
      table.visibility,
      table.reviewStatus,
      table.category,
      table.id
    ),
  ]
);

export const question = mysqlTable(
  "question",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    quizId: varchar("quiz_id", { length: 36 })
      .notNull()
      .references(() => quiz.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    position: int("position").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => [
    index("question_quiz_id_idx").on(table.quizId),
    uniqueIndex("question_quiz_position_unique").on(table.quizId, table.position),
  ]
);

export const option = mysqlTable(
  "option",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    questionId: varchar("question_id", { length: 36 })
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),
    content: varchar("content", { length: 500 }).notNull(),
    isCorrect: boolean("is_correct").notNull(),
    position: int("position").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => [
    index("option_question_id_idx").on(table.questionId),
    uniqueIndex("option_question_position_unique").on(table.questionId, table.position),
  ]
);

export const quizAttempt = mysqlTable(
  "quiz_attempt",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    quizId: varchar("quiz_id", { length: 36 })
      .notNull()
      .references(() => quiz.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    totalQuestions: int("total_questions").notNull(),
    correctAnswers: int("correct_answers").notNull(),
    score: int("score").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("quiz_attempt_quiz_user_idx").on(table.quizId, table.userId)]
);

export const gameRoom = mysqlTable(
  "game_room",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    quizId: varchar("quiz_id", { length: 36 })
      .notNull()
      .references(() => quiz.id, { onDelete: "cascade" }),
    creatorId: varchar("creator_id", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    mode: mysqlEnum("mode", ["live_trivia", "self_paced_race"]).notNull(),
    status: mysqlEnum("status", ["waiting", "active", "completed", "expired"]).notNull(),
    inviteCode: varchar("invite_code", { length: 32 }).notNull().unique(),
    participantLimit: int("participant_limit").notNull(),
    currentQuestionPosition: int("current_question_position"),
    questionOpenedAt: timestamp("question_opened_at", { fsp: 3 }),
    questionEndsAt: timestamp("question_ends_at", { fsp: 3 }),
    questionRevealEndsAt: timestamp("question_reveal_ends_at", { fsp: 3 }),
    deadlineAt: timestamp("deadline_at", { fsp: 3 }),
    startedAt: timestamp("started_at", { fsp: 3 }),
    completedAt: timestamp("completed_at", { fsp: 3 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => [
    index("game_room_quiz_id_idx").on(table.quizId),
    index("game_room_creator_id_idx").on(table.creatorId),
  ]
);

export const roomParticipant = mysqlTable(
  "room_participant",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    roomId: varchar("room_id", { length: 36 })
      .notNull()
      .references(() => gameRoom.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: mysqlEnum("status", ["joined", "ready", "playing", "completed", "left"]).notNull(),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
    startedAt: timestamp("started_at", { fsp: 3 }),
    completedAt: timestamp("completed_at", { fsp: 3 }),
    correctAnswers: int("correct_answers").notNull().default(0),
    totalAnswerDurationMs: bigint("total_answer_duration_ms", { mode: "number" })
      .notNull()
      .default(0),
    rank: int("rank"),
  },
  (table) => [
    index("room_participant_room_id_idx").on(table.roomId),
    uniqueIndex("room_participant_room_user_unique").on(table.roomId, table.userId),
  ]
);

export const roomAnswer = mysqlTable(
  "room_answer",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    roomParticipantId: varchar("room_participant_id", { length: 36 })
      .notNull()
      .references(() => roomParticipant.id, { onDelete: "cascade" }),
    questionId: varchar("question_id", { length: 36 })
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),
    optionId: varchar("option_id", { length: 36 })
      .notNull()
      .references(() => option.id, { onDelete: "cascade" }),
    submittedAt: timestamp("submitted_at", { fsp: 3 }).notNull(),
    isCorrect: boolean("is_correct").notNull(),
  },
  (table) => [
    index("room_answer_participant_id_idx").on(table.roomParticipantId),
    uniqueIndex("room_answer_participant_question_unique").on(
      table.roomParticipantId,
      table.questionId
    ),
  ]
);

export const usersRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  quizzes: many(quiz),
  quizAttempts: many(quizAttempt),
  createdRooms: many(gameRoom),
  roomParticipants: many(roomParticipant),
}));

export const sessionsRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountsRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const quizzesRelations = relations(quiz, ({ many, one }) => ({
  owner: one(user, { fields: [quiz.ownerId], references: [user.id] }),
  questions: many(question),
  attempts: many(quizAttempt),
  rooms: many(gameRoom),
}));

export const questionsRelations = relations(question, ({ many, one }) => ({
  quiz: one(quiz, { fields: [question.quizId], references: [quiz.id] }),
  options: many(option),
  roomAnswers: many(roomAnswer),
}));

export const optionsRelations = relations(option, ({ many, one }) => ({
  question: one(question, { fields: [option.questionId], references: [question.id] }),
  roomAnswers: many(roomAnswer),
}));

export const quizAttemptsRelations = relations(quizAttempt, ({ one }) => ({
  quiz: one(quiz, { fields: [quizAttempt.quizId], references: [quiz.id] }),
  user: one(user, { fields: [quizAttempt.userId], references: [user.id] }),
}));

export const gameRoomsRelations = relations(gameRoom, ({ many, one }) => ({
  quiz: one(quiz, { fields: [gameRoom.quizId], references: [quiz.id] }),
  creator: one(user, { fields: [gameRoom.creatorId], references: [user.id] }),
  participants: many(roomParticipant),
}));

export const roomParticipantsRelations = relations(roomParticipant, ({ many, one }) => ({
  room: one(gameRoom, { fields: [roomParticipant.roomId], references: [gameRoom.id] }),
  user: one(user, { fields: [roomParticipant.userId], references: [user.id] }),
  answers: many(roomAnswer),
}));

export const roomAnswersRelations = relations(roomAnswer, ({ one }) => ({
  participant: one(roomParticipant, {
    fields: [roomAnswer.roomParticipantId],
    references: [roomParticipant.id],
  }),
  question: one(question, { fields: [roomAnswer.questionId], references: [question.id] }),
  option: one(option, { fields: [roomAnswer.optionId], references: [option.id] }),
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Quiz = typeof quiz.$inferSelect;
export type Question = typeof question.$inferSelect;
export type Option = typeof option.$inferSelect;
export type QuizAttempt = typeof quizAttempt.$inferSelect;
export type GameRoom = typeof gameRoom.$inferSelect;
export type RoomParticipant = typeof roomParticipant.$inferSelect;
export type RoomAnswer = typeof roomAnswer.$inferSelect;
