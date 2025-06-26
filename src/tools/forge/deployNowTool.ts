import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import { deployNowConfirmationStore } from './confirmDeployNowTool.js'
import {
  validateConfirmation,
  markConfirmationUsed,
} from '../../utils/confirmationStore.js'

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
  serverName: z
    .string()
    .describe(
      'The name of the server. The client MUST validate this value against the available servers from listServersTool before passing it.'
    ),
  siteName: z
    .string()
    .describe(
      'The name of the site. The client MUST validate this value against the available sites from listSitesTool before passing it.'
    ),
  confirmationId: z
    .string()
    .describe(
      'This confirmationId must be obtained from confirmDeployNowTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, the operation will be rejected.'
    ),
}

const paramsZodObject = z.object(paramsSchema)

export const deployNowTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'deploy_now',
  description: `Immediately triggers a deployment (Deploy Now) for a site's Git project in Laravel Forge.\n\nBefore calling this tool, the client MUST call the 'confirm_deploy_now' tool and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.`,
  parameters: paramsSchema,
  category: ToolCategory.Write,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params)
      const { serverId, siteId, serverName, siteName, confirmationId } = parsed
      // Validate confirmation using generic utility
      const confirmation = validateConfirmation(
        deployNowConfirmationStore,
        confirmationId,
        (stored: Record<string, unknown>) =>
          stored.serverId == serverId &&
          stored.siteId == siteId &&
          stored.serverName === serverName &&
          stored.siteName === siteName
      )
      if (!confirmation) {
        return toMCPToolResult(false)
      }
      markConfirmationUsed(deployNowConfirmationStore, confirmationId)
      // Real API call
      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}/deployment/deploy`,
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
