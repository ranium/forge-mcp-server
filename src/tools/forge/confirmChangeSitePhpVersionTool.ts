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
  phpVersion: z
    .string()
    .describe(
      'The PHP version to set for the site. The client MUST validate this value against the available PHP versions from listStaticPhpVersionsTool before passing it, as this is plain text from the user.'
    ),
}

export const changeSitePhpVersionConfirmationStore =
  createConfirmationStore<Omit<typeof paramsSchema, never>>()

export const confirmChangeSitePhpVersionTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'confirm_change_site_php_version',
  description: `Confirms the PHP version change parameters for a site and returns a summary for user confirmation. This tool does not change the PHP version, but returns a summary and expects the client to handle the confirmation logic.`,
  parameters: paramsSchema,
  handler: async params => {
    const entry = createConfirmation(
      changeSitePhpVersionConfirmationStore,
      params
    )
    const summary =
      `Please confirm changing the PHP version for the site with the following settings:\n` +
      `Server ID: ${params.serverId}\n` +
      `Site ID: ${params.siteId}\n` +
      `PHP Version: ${params.phpVersion}\n` +
      `Confirmation ID: ${entry.confirmationId}\n` +
      `\nType "yes" to confirm or "no" to cancel.`
    return toMCPToolResult({ summary, confirmationId: entry.confirmationId })
  },
}
