import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const { text } = await generateText({
    model: groq("llama-3.3-70b-versatile"),
    prompt,
  });

  return Response.json({ text });
}