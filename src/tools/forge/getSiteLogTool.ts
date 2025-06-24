import { ForgeToolDefinition, HttpMethod } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'

const paramsSchema = {
  serverId: z
    .string()
    .describe('The ID of the server to get the site log for.'),
  siteId: z.string().describe('The ID of the site to get the log for.'),
}

const paramsZodObject = z.object(paramsSchema)

export const getSiteLogTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'get_site_log',
  description:
    'Retrieve the log output for a specific site in your Laravel Forge account. This returns the raw log as plain text.',
  parameters: paramsSchema,
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
      const data = await callForgeApi<string>(
        {
          endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}/logs`,
          method: HttpMethod.GET,
        },
        forgeApiKey
      )
      return toMCPToolResult({ log: data })
    } catch (err) {
      return toMCPToolError(err)
    }
  },
}
