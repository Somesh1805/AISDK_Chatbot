import {
  pgTable,
  uuid,
  text,
  timestamp,
   jsonb
} from "drizzle-orm/pg-core";

export const chatSessions = pgTable("chat_sessions", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  chatId: uuid("chat_id")
    .references(() => chatSessions.id)
    .notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatSessionsJson = pgTable("chat_sessions_json", {
  id: text("id").primaryKey(),

  title: text("title").notNull(),

  conversation: jsonb("conversation")
    .$type<{
      userMessages: { content: string }[];
      assistantMessages: { content: string }[];
    }>()
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});