import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(){
    const { text } = await generateText({
        model: groq("llama-3.3-70b-versatile"),
        prompt: "Explain what an LLM is in simple terms",
    });

    return Response.json({ text });
}