#!/usr/bin/env node
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

// Parse --tools argument to determine which tool categories to enable
function getToolCategories(): string[] {
  const toolsArg = process.argv.find(arg => arg.startsWith('--tools='))
  if (!toolsArg) {
    // Default to readonly only
    return ['readonly']
  }
  
  const categories = toolsArg.split('=')[1].split(',').map(cat => cat.trim())
  
  // Validate categories
  const validCategories = ['readonly', 'write', 'destructive']
  const invalidCategories = categories.filter(cat => !validCategories.includes(cat))
  
  if (invalidCategories.length > 0) {
    console.error(`Error: Invalid tool categories: ${invalidCategories.join(', ')}. Valid categories are: ${validCategories.join(', ')}`)
    process.exit(1)
  }
  
  // If destructive is included, include all categories
  if (categories.includes('destructive')) {
    return ['readonly', 'write', 'destructive']
  }
  
  // If write is included, include readonly and write
  if (categories.includes('write')) {
    return ['readonly', 'write']
  }
  
  return categories
}

// Filter tools based on selected categories using annotations
function filterToolsByCategory(tools: typeof forgeTools, categories: string[]) {
  return tools.filter(tool => {
    const annotations = tool.annotations
    
    // Determine tool category based on annotations
    let toolCategory: string
    if (annotations.destructiveHint) {
      toolCategory = 'destructive'
    } else if (annotations.readWriteHint && !annotations.readOnlyHint && !annotations.destructiveHint) {
      toolCategory = 'write'
    } else {
      toolCategory = 'readonly'
    }
    
    return categories.includes(toolCategory)
  })
}

const FORGE_API_KEY = getForgeApiKey()
if (!FORGE_API_KEY) {
  console.error(
    'Error: FORGE_API_KEY environment variable or --api-key argument is required. Please set it before starting the MCP server.'
  )
  process.exit(1)
}

const selectedCategories = getToolCategories()
const filteredTools = filterToolsByCategory(forgeTools, selectedCategories)

console.error(`Forge MCP server: Enabled tool categories: ${selectedCategories.join(', ')}`)
console.error(`Forge MCP server: Total tools available: ${filteredTools.length}`)

const server = new McpServer(
  { name: 'forge-mcp', version: '0.1.0' },
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

// Register filtered tools as MCP tools
for (const tool of filteredTools) {
  // Ensure parameters is always a ZodRawShape
  server.tool(
    tool.name,
    tool.parameters,
    tool.annotations,
    async (params: Record<string, unknown>) =>
      await tool.handler(params, FORGE_API_KEY)
  )
  
  // Determine tool category for logging
  const annotations = tool.annotations
  let toolCategory: string
  if (annotations.destructiveHint) {
    toolCategory = 'destructive'
  } else if (annotations.readWriteHint && !annotations.readOnlyHint && !annotations.destructiveHint) {
    toolCategory = 'write'
  } else {
    toolCategory = 'readonly'
  }
  
  console.error(`Forge MCP server: tool registered (${tool.name}) [${toolCategory}]`)
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
