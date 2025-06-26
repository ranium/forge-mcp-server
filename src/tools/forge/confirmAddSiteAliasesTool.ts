import { ForgeToolDefinition, ToolCategory } from '../../core/types/protocols.js'
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
  aliases: z
    .array(z.string())
    .describe(
      'The aliases to add to the site. The client MUST validate these are valid domain names.'
    ),
}

export const addSiteAliasesConfirmationStore =
  createConfirmationStore<Omit<typeof paramsSchema, never>>()

export const confirmAddSiteAliasesTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'confirm_add_site_aliases',
  description: `Confirms the site alias addition parameters and returns a summary for user confirmation.\n\nThis tool MUST NOT be called automatically. The client MUST display the confirmation summary and confirmation ID to the end user and require explicit, manual user input (such as typing 'yes' or clicking a confirmation button) before proceeding. Automation, pre-filling, or bypassing this user confirmation step is strictly forbidden and considered a violation of the protocol. Only after receiving explicit user confirmation should the client call the corresponding action tool with the confirmationId.`,
  parameters: paramsSchema,
  category: ToolCategory.Write,
  handler: async params => {
    const entry = createConfirmation(addSiteAliasesConfirmationStore, params)
    const summary =
      `Please confirm adding the following aliases to the site:\n` +
      `Server ID: ${params.serverId}\n` +
      `Site ID: ${params.siteId}\n` +
      `Aliases: ${Array.isArray(params.aliases) && params.aliases.length > 0 ? params.aliases.join(', ') : '[none]'}\n` +
      `Confirmation ID: ${entry.confirmationId}\n` +
      `\nType "yes" to confirm or "no" to cancel.`
    return toMCPToolResult({ summary, confirmationId: entry.confirmationId })
  },
}
