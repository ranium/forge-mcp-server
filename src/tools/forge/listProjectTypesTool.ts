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
  description:
    "Lists available project types for site creation in Laravel Forge. The 'php' type is the default.",
  parameters: paramsSchema,
  handler: async () => {
    return toMCPToolResult(projectTypes)
  },
}
