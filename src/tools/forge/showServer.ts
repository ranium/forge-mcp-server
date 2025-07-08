import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'

const paramsSchema = {
  serverId: z.string().describe('The ID of the server to show details for.'),
}

const paramsZodObject = z.object(paramsSchema)

export const showServerTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'show_server',
  parameters: paramsSchema,
  category: ToolCategory.Readonly,
  annotations: {
    title: 'Show Server',
    description:
      'Show details for a specific server in your Laravel Forge account.',
    operation: 'show',
    resource: 'server',
    safe: true,
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (params, forgeApiKey) => {
    const parsed = paramsZodObject.parse(params)
    const serverId = parsed.serverId
    if (!serverId) {
      return toMCPToolError(new Error('Missing required parameter: serverId'))
    }
    try {
      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${String(serverId)}`,
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
