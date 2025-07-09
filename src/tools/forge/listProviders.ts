import { ForgeToolDefinition, ToolCategory } from '../../core/types/protocols.js'
import { toMCPToolResult } from '../../utils/mcpToolResult.js'

const providers = [
  { id: 'ocean2', name: 'Digital Ocean' },
  { id: 'akamai', name: 'Linode (Akamai)' },
  { id: 'vultr2', name: 'Vultr' },
  { id: 'aws', name: 'AWS' },
  { id: 'hetzner', name: 'Hetzner' },
  { id: 'custom', name: 'Custom' },
]

const paramsSchema = {}

export const listProvidersTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'list_providers',
  parameters: paramsSchema,
  category: ToolCategory.Readonly,
  annotations: {
    title: 'List Providers',
    description: 'List all available server providers for Laravel Forge.',
    operation: 'list',
    resource: 'providers',
    safe: true,
    readOnlyHint: true,
    openWorldHint: false,
    readWriteHint: false,
    destructiveHint: false
  },
  handler: async (_params, _forgeApiKey) => {
    return toMCPToolResult({ providers })
  },
}
