import { config } from "dotenv";
config({ path: ".env" });
config({ path: ".env.local" });
import { generateText, stepCountIs } from "ai";
import { groq } from "@ai-sdk/groq";
import { getContext7Tools } from "./lib/mcp/context7";

async function run(label: string, message: string) {
  const tools = await getContext7Tools();

  const result = await generateText({
    model: groq("llama-3.3-70b-versatile"),
    system:
      "You are an AI SDK expert. When a question needs current AI SDK documentation, use the available tools to look it up before answering.",
    messages: [{ role: "user", content: message }],
    tools,
    stopWhen: stepCountIs(5),
  });

  console.log(`\n=== ${label} ===`);
  console.log("message:", message);
  console.log("steps:", result.steps.length);
  result.steps.forEach((step: any, i: number) => {
    const calls = step.toolCalls?.map((c: any) => c.toolName) ?? [];
    console.log(`  step ${i}: toolCalls=[${calls.join(", ")}]`);
  });
  console.log("final text (first 300 chars):", result.text.slice(0, 300));
}

async function main() {
  await run("MESSAGE 1 (should use tools)", "How do I use streamText with tool calling in the AI SDK v5?");
  await run("MESSAGE 2 (should NOT use tools)", "Hi, how are you?");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
