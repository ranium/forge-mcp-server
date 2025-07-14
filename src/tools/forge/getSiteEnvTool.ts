import { ForgeToolDefinition, HttpMethod } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'

const paramsSchema = {
  serverId: z
    .string()
    .describe(
      'The ID of the server. The client MUST validate this value against the available servers from listServersTool before passing it.'
    ),
  siteId: z
    .string()
    .describe(
      'The ID of the site. The client MUST validate this value against the available sites from listSitesTool before passing it.'
    ),
}

const paramsZodObject = z.object(paramsSchema)

export const getSiteEnvTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'get_site_env',
  parameters: paramsSchema,
  annotations: {
    title: 'Get Site Environment File',
    description:
      'Retrieve the environment file (.env) for a specific site in your Laravel Forge account. This returns the raw .env file content as plain text.',
    operation: 'get',
    resource: 'site_env',
    safe: true,
    readOnlyHint: true,
    openWorldHint: true,
    readWriteHint: false,
    destructiveHint: false
  },
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params)
      const { serverId, siteId } = parsed
      
      if (!serverId || !siteId) {
        return toMCPToolError(
          new Error('Missing required parameter: serverId or siteId')
        )
      }

      const data = await callForgeApi<string>(
        {
          endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}/env`,
          method: HttpMethod.GET,
        },
        forgeApiKey
      )
      
      return toMCPToolResult({ env: data })
    } catch (err) {
      return toMCPToolError(err)
    }
  },
} 