import { ForgeToolDefinition, HttpMethod } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'

const paramsSchema = {
  serverId: z
    .string()
    .describe('The ID of the server to check Laravel Scheduler status for.'),
  siteId: z
    .string()
    .describe('The ID of the site to check Laravel Scheduler status for.'),
}

const paramsZodObject = z.object(paramsSchema)

export const checkLaravelSchedulerStatusTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'check_laravel_scheduler_status',
  parameters: paramsSchema,
  annotations: {
    title: 'Check Laravel Scheduler Status',
    description:
      'Check if the Laravel Scheduler is enabled or disabled for a specific site in your Laravel Forge account.',
    operation: 'check',
    resource: 'laravel_scheduler_status',
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
          endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}/integrations/laravel-scheduler`,
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
