import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

import {
  createChatSession,
  saveUserMessage,
  saveAIMessage,
} from "@/app/db/queries/chat";

export async function POST(req: Request) {
  try {
    const { message, chatId } = await req.json();

    let currentChatId = chatId;

    // Create chat only for first message
    if (!currentChatId) {
      const chat = await createChatSession();
      currentChatId = chat.id;
    }

    // Save user message
    await saveUserMessage(currentChatId, message);

    // Generate AI response
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: message,
    });

    // Save AI response
    await saveAIMessage(currentChatId, text);

    return Response.json({
      text,
      chatId: currentChatId,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}