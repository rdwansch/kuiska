import { relations } from "drizzle-orm";
import {
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
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => [index("quiz_owner_id_idx").on(table.ownerId)]
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

export const usersRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  quizzes: many(quiz),
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
}));

export const questionsRelations = relations(question, ({ many, one }) => ({
  quiz: one(quiz, { fields: [question.quizId], references: [quiz.id] }),
  options: many(option),
}));

export const optionsRelations = relations(option, ({ one }) => ({
  question: one(question, { fields: [option.questionId], references: [question.id] }),
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Quiz = typeof quiz.$inferSelect;
export type Question = typeof question.$inferSelect;
export type Option = typeof option.$inferSelect;
