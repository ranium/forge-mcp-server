import 'dotenv/config';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { forgeTools, forgePrompts } from "./tools/forge/index.js";
import { MCPToolResult } from "./core/types/protocols.js";

// Require FORGE_API_KEY from environment
const FORGE_API_KEY = process.env.FORGE_API_KEY;
if (!FORGE_API_KEY) {
  console.error("Error: FORGE_API_KEY environment variable is required. Please set it before starting the MCP server.");
  process.exit(1);
}

const server = new McpServer(
  { name: "forge-mcp", version: "1.0.0" },
  { capabilities: { tools: {}, prompts: {} } }
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

console.error("Forge MCP server: tool registered (test_connection)");

// Register all prompts as MCP citizens
for (const prompt of forgePrompts) {
  server.prompt(prompt.name, async (extra) => {
    const forgeApiKey = process.env.FORGE_API_KEY;
    let result: any = undefined;
    let choices: any = undefined;
    let defaultValue: any = undefined;
    let message: string = '';

    if (typeof (prompt as any).fetch === 'function') {
      // Gather all arguments except the first (prompt name)
      // For now, only pass forgeApiKey; you can extend this for more complex prompts
      // If you want to support extra args, you can extract them from extra or context
      // For now, just pass forgeApiKey for all
      // TODO: Support dynamic args if needed
      result = await (prompt as any).fetch(forgeApiKey);
      choices = (typeof (prompt as any).getChoices === 'function') ? (prompt as any).getChoices(result) : undefined;
      defaultValue = (typeof (prompt as any).getDefault === 'function') ? (prompt as any).getDefault(result) : undefined;
      message = (typeof (prompt as any).getMessage === 'function') ? (prompt as any).getMessage(result) : '';
    } else {
      // For free-text prompts (like serverNamePrompt)
      message = (typeof (prompt as any).getMessage === 'function') ? (prompt as any).getMessage() : 'Enter a value:';
    }

    return {
      messages: [
        {
          role: "assistant",
          content: {
            type: "text",
            text: message
          }
        }
      ],
      choices,
      default: defaultValue
    };
  });
  console.error(`Forge MCP server: prompt registered (${prompt.name})`);
}

// Register all tools (including create_server) as MCP tools
for (const tool of forgeTools) {
  // Ensure parameters is always a ZodRawShape
  server.tool(
    tool.name,
    tool.parameters,
    { description: tool.description },
    async (params: Record<string, unknown>) => await tool.handler(params, FORGE_API_KEY) as MCPToolResult
  );
  console.error(`Forge MCP server: tool registered (${tool.name})`);
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

async function main() {
  const transport = new StdioServerTransport();
  console.error("Forge MCP Server running on stdio");
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
