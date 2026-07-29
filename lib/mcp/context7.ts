import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { tool, jsonSchema, type JSONSchema7, type ToolSet } from "ai";

let client: Client | null = null;

export async function getContext7Client() {
  if (client) return client;

  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-y", "@upstash/context7-mcp"],
  });

  client = new Client({
    name: "nextjs-ai-app",
    version: "1.0.0",
  });

  await client.connect(transport);

  return client;
}

// Exposes every tool the Context7 MCP server advertises as an AI SDK tool,
// so generateText/streamText can let the model decide when to call them.
export async function getContext7Tools() {
  const mcpClient = await getContext7Client();
  const { tools: mcpTools } = await mcpClient.listTools();

  const tools: ToolSet = {};

  for (const mcpTool of mcpTools) {
    tools[mcpTool.name] = tool({
      description: mcpTool.description,
      inputSchema: jsonSchema<Record<string, unknown>>(
        mcpTool.inputSchema as JSONSchema7
      ),
      execute: async (args: Record<string, unknown>) => {
        const result = await mcpClient.callTool({
          name: mcpTool.name,
          arguments: args,
        });

        const content = result.content as Array<{
          type: string;
          text: string;
        }>;

        return content
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("\n");
      },
    });
  }

  return tools;
}