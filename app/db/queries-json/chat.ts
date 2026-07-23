import { eq } from "drizzle-orm";
import { db } from "../index";
import { chatSessionsJson } from "../schema";
import { randomUUID } from "crypto";

export async function createSession() {
  const id = crypto.randomUUID();

  const [chat] = await db
    .insert(chatSessionsJson)
    .values({
      id,
      title: "New Chat",
      conversation: {
        userMessages: [],
        assistantMessages: [],
      },
    })
    .returning();

  return chat;
}

export async function getSession(id: string) {
  const [chat] = await db
    .select()
    .from(chatSessionsJson)
    .where(eq(chatSessionsJson.id, id));

  return chat;
}

export async function appendUserMessage(
  sessionId: string,
  message: string
) {
  const chat = await getSession(sessionId);

  if (!chat) throw new Error("Session not found");

  const conversation: any = chat.conversation;

  conversation.userMessages.push({
    content: message,
  });

  await db
    .update(chatSessionsJson)
    .set({
      conversation,
    })
    .where(eq(chatSessionsJson.id, sessionId));
}

export async function appendAIMessage(
  sessionId: string,
  message: string
) {
  const chat = await getSession(sessionId);

  if (!chat) throw new Error("Session not found");

  const conversation: any = chat.conversation;

  conversation.assistantMessages.push({
    content: message,
  });

  await db
    .update(chatSessionsJson)
    .set({
      conversation,
    })
    .where(eq(chatSessionsJson.id, sessionId));
}

export async function createJsonSession() {
  const [session] = await db
    .insert(chatSessionsJson)
    .values({
      id: randomUUID(),
      title: "New Chat",
      conversation: {
        userMessages: [],
        assistantMessages: [],
      },
    })
    .returning();

  return session;
}

export async function updateSessionTitle(
  sessionId: string,
  title: string
) {
  await db
    .update(chatSessionsJson)
    .set({
      title,
      updatedAt: new Date(),
    })
    .where(eq(chatSessionsJson.id, sessionId));
}

export async function getConversation(sessionId: string) {
  const [chat] = await db
    .select()
    .from(chatSessionsJson) 
    .where(eq(chatSessionsJson.id, sessionId));

  return chat?.conversation;
}

