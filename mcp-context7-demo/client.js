const { Client } = require("@modelcontextprotocol/sdk/client/index.js");

console.log("MCP Client starting...");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");

const transport = new StdioClientTransport({
  command: "npx",
  args: [
    "-y",
    "@upstash/context7-mcp"
  ]
});
const client = new Client({
  name: "my-mcp-client",
  version: "1.0.0",
});
async function main() {
  await client.connect(transport);
  console.log("Connected successfully!");
}

main();