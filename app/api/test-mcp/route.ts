import { getContext7Client } from "@/lib/mcp/context7";

export async function GET() {
  const client = await getContext7Client();

  const result = await client.callTool({
    name: "query-docs",
    arguments: {
      libraryId: "/websites/ai-sdk_dev_v5",
      query: "generateText examples and usage",
    },
  });

  return Response.json(result);
}