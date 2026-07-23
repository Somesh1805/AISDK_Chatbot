import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

import {
  createSession,
  appendUserMessage,
  appendAIMessage,
  getSession,
  updateSessionTitle,
} from "@/app/db/queries-json/chat";

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();

    let currentSessionId = sessionId;

    if (!currentSessionId) {
      const chat = await createSession();
      currentSessionId = chat.id;
    }

    // Save user message
    await appendUserMessage(currentSessionId, message);

    // AI response
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: message,
    });

    // Generate title only once
    const session = await getSession(currentSessionId);

    if (session && session.title === "New Chat") {
      const { text: generatedTitle } = await generateText({
        model: groq("llama-3.3-70b-versatile"),
        prompt: `
Generate a short title for this conversation.

User Message:
"${message}"

Rules:
- Maximum 4 words
- No quotes
- No punctuation
- Return only the title.
`,
      });

      await updateSessionTitle(
        currentSessionId,
        generatedTitle.trim()
      );
    }

    // Save AI reply
    await appendAIMessage(currentSessionId, text);

    // Return updated title
    const updatedSession = await getSession(currentSessionId);

    return Response.json({
      text,
      sessionId: currentSessionId,
      title: updatedSession.title,
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