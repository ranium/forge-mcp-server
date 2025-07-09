import { ForgeToolDefinition } from '../../core/types/protocols.js'
import { toMCPToolResult } from '../../utils/mcpToolResult.js'

const projectTypes = [
  { key: 'php', description: 'PHP / Laravel / Symfony', default: true },
  {
    key: 'html',
    description: 'Static HTML / Nuxt.js / Next.js',
    default: false,
  },
]

const paramsSchema = {}

export const listProjectTypesTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'list_project_types',
  parameters: paramsSchema,
  annotations: {
    title: 'List Project Types',
    description: "Lists available project types for site creation in Laravel Forge. The 'php' type is the default.",
    operation: 'list',
    resource: 'project_types',
    safe: true,
    readOnlyHint: true,
    openWorldHint: false,
    readWriteHint: false,
    destructiveHint: false
  },
  handler: async () => {
    return toMCPToolResult(projectTypes)
  },
}
