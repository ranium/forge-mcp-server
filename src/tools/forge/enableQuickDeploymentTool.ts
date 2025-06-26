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
  siteId: z
    .string()
    .describe(
      'The ID of the site. The client MUST validate this value against the available sites from listSitesTool before passing it.'
    ),
}

const paramsZodObject = z.object(paramsSchema)

export const enableQuickDeploymentTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'enable_quick_deployment',
  description: `Enables quick deployment (triggers a deployment) for a site's Git project in Laravel Forge. This will immediately trigger a deployment for the specified site.`,
  parameters: paramsSchema,
  category: ToolCategory.Write,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params)
      const { serverId, siteId } = parsed
      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}/deployment`,
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
