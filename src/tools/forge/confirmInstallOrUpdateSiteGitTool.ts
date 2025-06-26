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
  provider: z
    .string()
    .describe(
      'The Git provider (e.g., github, gitlab). The client MUST validate this value against the available providers from listProvidersTool before passing it, as this is plain text from the user.'
    ),
  repository: z
    .string()
    .describe(
      'The Git repository (e.g., username/repository). The client MUST validate this is a valid repository string.'
    ),
  branch: z
    .string()
    .describe(
      'The branch to deploy. The client MUST validate this is a valid branch name.'
    ),
  composer: z
    .boolean()
    .optional()
    .describe(
      'Whether to run Composer install (optional). The client MUST ensure this is a boolean value.'
    ),
  database: z
    .string()
    .optional()
    .describe(
      'The database name to use (optional). The client MUST validate this is a valid database name if provided.'
    ),
}

export const installOrUpdateSiteGitConfirmationStore =
  createConfirmationStore<typeof paramsSchema>()

export const confirmInstallOrUpdateSiteGitTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'confirm_install_or_update_site_git',
  description: `Confirms the request to install or update a site's Git integration and returns a summary for user confirmation.\n\nThis tool MUST NOT be called automatically. The client MUST display the confirmation summary and confirmation ID to the end user and require explicit, manual user input (such as typing 'yes' or clicking a confirmation button) before proceeding. Automation, pre-filling, or bypassing this user confirmation step is strictly forbidden and considered a violation of the protocol. Only after receiving explicit user confirmation should the client call the corresponding action tool with the confirmationId.`,
  parameters: paramsSchema,
  category: ToolCategory.Write,
  handler: async params => {
    const entry = createConfirmation(
      installOrUpdateSiteGitConfirmationStore,
      params
    )
    const summary =
      `Please confirm the Git installation/update for the site with the following settings:\n` +
      `Server ID: ${params.serverId}\n` +
      `Site ID: ${params.siteId}\n` +
      `Provider: ${params.provider}\n` +
      `Repository: ${params.repository}\n` +
      `Branch: ${params.branch}\n` +
      (params.composer !== undefined ? `Composer: ${params.composer}\n` : '') +
      (params.database ? `Database: ${params.database}\n` : '') +
      `\nType "yes" to confirm or "no" to cancel.`
    return toMCPToolResult({ summary, confirmationId: entry.confirmationId })
  },
}
