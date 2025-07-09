import { ForgeToolDefinition, HttpMethod } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'

const params = {}

export const listServersTool: ForgeToolDefinition<typeof params> = {
  name: 'list_servers',
  parameters: params, // No parameters needed, use Zod raw shape
  annotations: {
    title: 'List Servers',
    description: 'List all servers in your Laravel Forge account.',
    operation: 'list',
    resource: 'servers',
    safe: true,
    readOnlyHint: true,
    openWorldHint: true,
    readWriteHint: false,
    destructiveHint: false
  },
  handler: async (_params, forgeApiKey) => {
    try {
      const data = await callForgeApi<object>(
        {
          endpoint: '/servers',
          method: HttpMethod.GET,
        },
        forgeApiKey
      )
      return toMCPToolResult(data)
    } catch (err) {
      return toMCPToolError(err)
    }
  },
}
