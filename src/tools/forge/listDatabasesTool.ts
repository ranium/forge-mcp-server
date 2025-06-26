import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'

const paramsSchema = {
  serverId: z
    .string()
    .describe(
      'The ID of the server to list databases for. The client MUST validate this value against the available servers from listServersTool before passing it.'
    ),
}

const paramsZodObject = z.object(paramsSchema)

export const listDatabasesTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'list_databases',
  description:
    'List all databases for a specific server in your Laravel Forge account.',
  parameters: paramsSchema,
  category: ToolCategory.Readonly,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params)
      const { serverId } = parsed
      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${String(serverId)}/databases`,
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
