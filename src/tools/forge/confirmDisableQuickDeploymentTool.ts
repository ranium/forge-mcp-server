import { ForgeToolDefinition, ToolCategory } from '../../core/types/protocols.js'
import { toMCPToolResult } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import {
  createConfirmationStore,
  createConfirmation,
} from '../../utils/confirmationStore.js'
import { CONFIRMATION_DESCRIPTION } from '../../utils/protocolDescriptions.js'

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
}

export const disableQuickDeploymentConfirmationStore =
  createConfirmationStore<typeof paramsSchema>()

const baseDescription = "Confirms the request to disable quick deployment and returns a summary for user confirmation."

export const confirmDisableQuickDeploymentTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'confirm_disable_quick_deployment',
  description: `${baseDescription}\n\n${CONFIRMATION_DESCRIPTION}`,
  parameters: paramsSchema,
  category: ToolCategory.Write,
  handler: async params => {
    const entry = createConfirmation(
      disableQuickDeploymentConfirmationStore,
      params
    )
    const summary =
      `Are you sure you want to disable quick deployment for the site?\n` +
      `Server: ${params.serverName} (ID: ${params.serverId})\n` +
      `Site: ${params.siteName} (ID: ${params.siteId})\n` +
      `\nType "yes" to confirm or "no" to cancel.`
    return toMCPToolResult({ summary, confirmationId: entry.confirmationId })
  },
}
