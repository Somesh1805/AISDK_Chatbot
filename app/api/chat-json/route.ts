import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

import {
  createSession,
  appendUserMessage,
  appendAIMessage,
} from "@/app/db/queries-json/chat";

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();

    let currentSessionId = sessionId;

    if (!currentSessionId) {
      const chat = await createSession();
      currentSessionId = chat.id;
    }

    await appendUserMessage(currentSessionId, message);

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: message,
    });

    await appendAIMessage(currentSessionId, text);

    return Response.json({
      text,
      sessionId: currentSessionId,
    });
  } catch (err) {
    console.error(err);

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