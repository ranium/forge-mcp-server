import 'dotenv/config'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { forgeTools } from './tools/forge/index.js'

// Support --api-key argument as well as FORGE_API_KEY env variable
function getForgeApiKey(): string | undefined {
  const arg = process.argv.find(arg => arg.startsWith('--api-key='))
  if (arg) {
    return arg.split('=')[1]
  }
  return process.env.FORGE_API_KEY
}

const FORGE_API_KEY = getForgeApiKey()
if (!FORGE_API_KEY) {
  console.error(
    'Error: FORGE_API_KEY environment variable or --api-key argument is required. Please set it before starting the MCP server.'
  )
  process.exit(1)
}

const server = new McpServer(
  { name: 'forge-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

// Register test_connection tool (for health check)
server.tool(
  'test_connection',
  { message: z.string().describe('A test message to echo back') },
  { description: 'Test the connection to the MCP server' },
  async ({ message }: { message: string }) => ({
    content: [
      { type: 'text', text: `Echo: ${message}\n${new Date().toISOString()}` },
    ],
  })
)

console.error('Forge MCP server: tool registered (test_connection)')

// Register all tools (including create_server) as MCP tools
for (const tool of forgeTools) {
  // Ensure parameters is always a ZodRawShape
  server.tool(
    tool.name,
    tool.parameters,
    { description: tool.description },
    async (params: Record<string, unknown>) =>
      await tool.handler(params, FORGE_API_KEY)
  )
  console.error(`Forge MCP server: tool registered (${tool.name})`)
}

process.on('unhandledRejection', (reason, _promise) => {
  console.error('Unhandled Rejection:', reason)
})
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err)
})

async function main() {
  const transport = new StdioServerTransport()
  console.error('Forge MCP Server running on stdio')
  await server.connect(transport)
}

main().catch(error => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
