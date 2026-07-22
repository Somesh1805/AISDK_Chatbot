import { eq } from "drizzle-orm";
import { db } from "../index";
import { chatSessionsJson } from "../schema";

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