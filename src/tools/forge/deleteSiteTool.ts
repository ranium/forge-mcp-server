import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import { siteDeletionConfirmationStore } from './confirmSiteDeletionTool.js'
import {
  validateConfirmation,
  markConfirmationUsed,
} from '../../utils/confirmationStore.js'

const paramsSchema = {
  serverId: z
    .string()
    .describe(
      'The ID of the server. The client MUST validate this value against the available servers from listServersTool before passing it, as this is plain text from the user.'
    ),
  siteId: z
    .string()
    .describe(
      'The ID of the site. The client MUST validate this value against the available sites from listSitesTool before passing it, as this is plain text from the user.'
    ),
  confirmationId: z
    .string()
    .describe(
      'This confirmationId must be obtained from confirmSiteDeletionTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, the site deletion will be rejected.'
    ),
}

const paramsZodObject = z.object(paramsSchema)

export const deleteSiteTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'delete_site',
  description: `Deletes a site in Laravel Forge.\n\nBefore calling this tool, the client MUST call the 'confirm_site_deletion' tool and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.`,
  parameters: paramsSchema,
  category: ToolCategory.Destructive,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params)
      const { serverId, siteId, confirmationId } = parsed
      // Validate confirmation using generic utility
      const confirmation = validateConfirmation(
        siteDeletionConfirmationStore,
        confirmationId,
        (stored: Record<string, unknown>) =>
          stored.serverId == serverId && stored.siteId == siteId
      )
      if (!confirmation) {
        return toMCPToolResult(false)
      }
      markConfirmationUsed(siteDeletionConfirmationStore, confirmationId)
      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}`,
          method: HttpMethod.DELETE,
        },
        forgeApiKey
      )
      return toMCPToolResult(data)
    } catch (err) {
      return toMCPToolError(err)
    }
  },
}
