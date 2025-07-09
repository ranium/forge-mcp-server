import { ForgeToolDefinition, HttpMethod } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'

const paramsSchema = {
  serverId: z.string().describe('The ID of the server to show the site for.'),
  siteId: z.string().describe('The ID of the site to show.'),
}

const paramsZodObject = z.object(paramsSchema)

export const showSiteTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'show_site',
  parameters: paramsSchema,
  annotations: {
    title: 'Show Site',
    description:
      'Show details for a specific site on a server in your Laravel Forge account.',
    operation: 'show',
    resource: 'site',
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
          endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}`,
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
