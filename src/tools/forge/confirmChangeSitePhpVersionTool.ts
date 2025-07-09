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

const baseDescription = "Confirms the request to change the PHP version for a site and returns a summary for user confirmation."

export const confirmChangeSitePhpVersionTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'confirm_change_site_php_version',
  parameters: paramsSchema,
  category: ToolCategory.Write,
  annotations: {
    title: 'Confirm Change Site PHP Version',
    description: `${baseDescription}\n\n${CONFIRMATION_DESCRIPTION}`,
    operation: 'confirm',
    resource: 'site_php_version_change',
    safe: false,
    readOnlyHint: false,
    openWorldHint: true,
    readWriteHint: true,
    destructiveHint: false
  },
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
