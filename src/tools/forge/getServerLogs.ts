import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'

const paramsSchema = {
  serverId: z.string().describe('The ID of the server to get logs for.'),
}

const paramsZodObject = z.object(paramsSchema)

export const getServerLogsTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'get_server_logs',
  parameters: paramsSchema,
  category: ToolCategory.Readonly,
  annotations: {
    title: 'Get Server Logs',
    description: 'Get logs for a specific server in your Laravel Forge account.',
    operation: 'get',
    resource: 'server_logs',
    safe: true,
    readOnlyHint: true,
    openWorldHint: true,
    readWriteHint: false,
    destructiveHint: false
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
          endpoint: `/servers/${String(serverId)}/logs`,
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
