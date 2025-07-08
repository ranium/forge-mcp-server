import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'

const paramsSchema = {
  serverId: z.string().describe('The ID of the server to reboot Postgres.'),
}

const paramsZodObject = z.object(paramsSchema)

export const rebootPostgresTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'reboot_postgres',
  parameters: paramsSchema,
  category: ToolCategory.Write,
  annotations: {
    title: 'Reboot Postgres',
    description: 'Reboots (restarts) the Postgres service on a server in Laravel Forge.',
    operation: 'restart',
    resource: 'postgres_service',
    readonly: false,
    safe: true
  },
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params)
      const { serverId } = parsed
      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${String(serverId)}/postgres/reboot`,
          method: HttpMethod.POST,
        },
        forgeApiKey
      )
      return toMCPToolResult(data)
    } catch (err) {
      return toMCPToolError(err)
    }
  },
}
