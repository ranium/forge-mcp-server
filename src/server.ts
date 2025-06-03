import 'dotenv/config';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer(
  { name: "forge-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Register test_connection tool (for health check)
server.tool(
  "test_connection",
  { message: z.string().describe("A test message to echo back") },
  { description: "Test the connection to the MCP server" },
  async ({ message }: { message: string }) => ({
    content: [
      { type: "text", text: `Echo: ${message}\n${new Date().toISOString()}` }
    ]
  })
);

console.log("Forge MCP server: tool registered (test_connection)");

const transport = new StdioServerTransport();
await server.connect(transport);
