import { ForgeToolDefinition } from '../../core/types/protocols.js'
import { toMCPToolResult } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import {
  createConfirmationStore,
  createConfirmation,
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
}

export const clearSiteLogConfirmationStore =
  createConfirmationStore<Omit<typeof paramsSchema, never>>()

export const confirmClearSiteLogTool: ForgeToolDefinition<typeof paramsSchema> =
  {
    name: 'confirm_clear_site_log',
    description: `Confirms the clear site log parameters and returns a summary for user confirmation. This tool does not clear the log, but returns a summary and expects the client to handle the confirmation logic.`,
    parameters: paramsSchema,
    handler: async params => {
      const entry = createConfirmation(clearSiteLogConfirmationStore, params)
      const summary =
        `Please confirm clearing the log for the following site (this cannot be undone):\n` +
        `Server ID: ${params.serverId}\n` +
        `Site ID: ${params.siteId}\n` +
        `\nType "yes" to confirm or "no" to cancel.`
      return toMCPToolResult({ summary, confirmationId: entry.confirmationId })
    },
  }
