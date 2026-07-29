import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

import {
  createSession,
  appendUserMessage,
  appendAIMessage,
  getSession,
  updateSessionTitle,
  getConversation,
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

    // // AI response
    // const { text } = await generateText({
    //   model: groq("llama-3.3-70b-versatile"),
    //   prompt: message,
    // });

    // Load previous conversation
// const conversation = await getConversation(currentSessionId);

// let prompt = "";

// if (conversation) {
//   conversation.userMessages.forEach(
//     (user: { content: string }, index: number) => {
//       prompt += `User: ${user.content}\n`;

//       if (conversation.assistantMessages[index]) {
//         prompt += `Assistant: ${conversation.assistantMessages[index].content}\n`;
//       }
//     }
//   );
// }

// // Current message
// prompt += `User: ${message}`;

const conversation = await getConversation(currentSessionId);

const history: {
  role: "user" | "assistant";
  content: string;
}[] = [];

if (conversation) {
  conversation.userMessages.forEach(
    (user: { content: string }, index: number) => {
      history.push({
        role: "user",
        content: user.content,
      });

      if (conversation.assistantMessages[index]) {
        history.push({
          role: "assistant",
          content: conversation.assistantMessages[index].content,
        });
      }
    }
  );
}

history.push({
  role: "user",
  content: message,
});

// AI response
// 
const { text } = await generateText({
  model: groq("llama-3.3-70b-versatile"),
  messages: history,
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