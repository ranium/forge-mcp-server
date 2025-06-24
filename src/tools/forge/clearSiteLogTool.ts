import { ForgeToolDefinition, HttpMethod } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import { clearSiteLogConfirmationStore } from './confirmClearSiteLogTool.js'
import {
  validateConfirmation,
  markConfirmationUsed,
} from '../../utils/confirmationStore.js'

const paramsSchema = {
  serverId: z
    .string()
    .describe('The ID of the server to clear the site log for.'),
  siteId: z.string().describe('The ID of the site to clear the log for.'),
  confirmationId: z
    .string()
    .describe(
      'This confirmationId must be obtained from confirmClearSiteLogTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, the log clear will be rejected.'
    ),
}

const paramsZodObject = z.object(paramsSchema)

export const clearSiteLogTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'clear_site_log',
  description: `Clear the log output for a specific site in your Laravel Forge account.\n\nBefore calling this tool, the client MUST call the 'confirm_clear_site_log' tool and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool. This is a destructive action and cannot be undone.`,
  parameters: paramsSchema,
  handler: async (params, forgeApiKey) => {
    const parsed = paramsZodObject.parse(params)
    const { serverId, siteId, confirmationId } = parsed
    // Validate confirmation using generic utility
    const confirmation = validateConfirmation(
      clearSiteLogConfirmationStore,
      confirmationId,
      (stored: Record<string, unknown>) =>
        stored.serverId == serverId && stored.siteId == siteId
    )
    if (!confirmation) {
      return toMCPToolResult(false)
    }
    markConfirmationUsed(clearSiteLogConfirmationStore, confirmationId)
    try {
      await callForgeApi<void>(
        {
          endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}/logs`,
          method: HttpMethod.DELETE,
        },
        forgeApiKey
      )
      return toMCPToolResult({ success: true })
    } catch (err) {
      return toMCPToolError(err)
    }
  },
}
