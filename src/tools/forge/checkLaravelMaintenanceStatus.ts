import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'

const paramsSchema = {
  serverId: z
    .string()
    .describe('The ID of the server to check Laravel maintenance status for.'),
  siteId: z
    .string()
    .describe('The ID of the site to check Laravel maintenance status for.'),
}

const paramsZodObject = z.object(paramsSchema)

export const checkLaravelMaintenanceStatusTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'check_laravel_maintenance_status',
  parameters: paramsSchema,
  category: ToolCategory.Readonly,
  annotations: {
    title: 'Check Laravel Maintenance Status',
    description:
      'Check if Laravel maintenance mode is enabled or disabled for a specific site in your Laravel Forge account.',
    operation: 'check',
    resource: 'laravel_maintenance_status',
    safe: true,
    readOnlyHint: true,
    openWorldHint: true,
    readWriteHint: false,
    destructiveHint: false
  },
  handler: async (params, forgeApiKey) => {
    const parsed = paramsZodObject.parse(params)
    const serverId = parsed.serverId
    const siteId = parsed.siteId
    if (!serverId || !siteId) {
      return toMCPToolError(
        new Error('Missing required parameter: serverId or siteId')
      )
    }
    try {
      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}/integrations/laravel-maintenance`,
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
