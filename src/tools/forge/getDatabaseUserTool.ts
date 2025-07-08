import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'

const paramsSchema = {
  serverId: z
    .string()
    .describe(
      'The ID of the server. The client MUST validate this value against the available servers from listServersTool before passing it.'
    ),
  userId: z
    .string()
    .describe(
      'The ID of the database user. The client MUST validate this value against the available users from listDatabaseUsersTool before passing it.'
    ),
}

const paramsZodObject = z.object(paramsSchema)

export const getDatabaseUserTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'get_database_user',
  parameters: paramsSchema,
  category: ToolCategory.Readonly,
  annotations: {
    title: 'Get Database User',
    description:
      'Get details for a specific database user on a server in your Laravel Forge account.',
    operation: 'get',
    resource: 'database_user',
    safe: true,
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params)
      const { serverId, userId } = parsed
      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${String(serverId)}/database-users/${String(userId)}`,
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
