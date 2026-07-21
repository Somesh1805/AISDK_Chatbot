import { db } from "../index";
import { chatSessions, messages } from "../schema";

export async function createChatSession() {
  const [chat] = await db
    .insert(chatSessions)
    .values({
      title: "New Chat",
    })
    .returning();

  return chat;
}

export async function saveUserMessage(
  chatId: string,
  content: string
) {
  await db.insert(messages).values({
    chatId,
    role: "user",
    content,
  });
}

export async function saveAIMessage(
  chatId: string,
  content: string
) {
  await db.insert(messages).values({
    chatId,
    role: "assistant",
    content,
  });
}