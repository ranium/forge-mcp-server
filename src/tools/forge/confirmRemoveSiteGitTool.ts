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

export const removeSiteGitConfirmationStore =
  createConfirmationStore<typeof paramsSchema>()

const baseDescription = "Confirms the request to remove a site's Git integration and returns a summary for user confirmation."

export const confirmRemoveSiteGitTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'confirm_remove_site_git',
  parameters: paramsSchema,
  category: ToolCategory.Write,
  annotations: {
    title: 'Confirm Remove Site Git',
    description: `${baseDescription}\n\n${CONFIRMATION_DESCRIPTION}`,
    operation: 'confirm',
    resource: 'site_git_removal',
    safe: false,
    readOnlyHint: false,
    openWorldHint: true,
    readWriteHint: true,
    destructiveHint: true
  },
  handler: async params => {
    const entry = createConfirmation(removeSiteGitConfirmationStore, params)
    const summary =
      `Are you sure you want to detach the Git project from the site?\n` +
      `Server: ${params.serverName} (ID: ${params.serverId})\n` +
      `Site: ${params.siteName} (ID: ${params.siteId})\n` +
      `\nType "yes" to confirm or "no" to cancel.`
    return toMCPToolResult({ summary, confirmationId: entry.confirmationId })
  },
}
