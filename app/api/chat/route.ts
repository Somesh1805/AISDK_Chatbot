import { streamText, UIMessage, convertToModelMessages } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      messages: [
  {
    role: "system",
    content:
      `
You are a coding assistant.

Only answer programming-related questions.
If the user asks anything unrelated to programming, politely reply:
"I'm only able to help with coding-related questions."
Keep every answer under 3 sentences.
    `,
  },
  ...convertToModelMessages(messages),
],
    });

    result.usage.then((usage) => {
      console.log({
        messageCount: messages.length,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error);

    return new Response("Failed to stream chat", {
      status: 500,
    });
  }
}