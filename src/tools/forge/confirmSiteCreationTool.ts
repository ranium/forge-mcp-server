import { ForgeToolDefinition } from '../../core/types/protocols.js'
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
      'The ID of the server to create the site on. The client MUST validate this value against the available servers from listServersTool before passing it, as this is plain text from the user.'
    ),
  domain: z
    .string()
    .describe(
      'The domain name for the new site. The client MUST validate this is a valid domain name before passing it, as this is plain text from the user.'
    ),
  projectType: z
    .string()
    .describe(
      "The project type (e.g., 'php', 'html'). The client MUST validate this value against the available project types from listProjectTypesTool before passing it, as this is plain text from the user."
    ),
  directory: z
    .string()
    .optional()
    .describe(
      'The directory for the site (optional). The client MUST validate this is a valid directory name if provided.'
    ),
  isolated: z
    .boolean()
    .optional()
    .describe(
      'Whether the site should be isolated (optional). The client MUST ensure this is a boolean value.'
    ),
  wildcardSubdomains: z
    .boolean()
    .optional()
    .describe(
      'Whether to enable wildcard subdomains (optional). The client MUST ensure this is a boolean value.'
    ),
  phpVersion: z
    .string()
    .optional()
    .describe(
      'The PHP version for the site (optional). The client MUST validate this value against the available PHP versions from listPhpVersionsTool before passing it, as this is plain text from the user.'
    ),
  database: z
    .string()
    .optional()
    .describe(
      'The database name for the site (optional). The client MUST validate this is a valid database name if provided.'
    ),
  repository: z
    .string()
    .optional()
    .describe(
      'The repository URL for the site (optional). The client MUST validate this is a valid repository URL if provided.'
    ),
  branch: z
    .string()
    .optional()
    .describe(
      'The branch to deploy (optional). The client MUST validate this is a valid branch name if provided.'
    ),
  composer: z
    .boolean()
    .optional()
    .describe(
      'Whether to install Composer dependencies (optional). The client MUST ensure this is a boolean value.'
    ),
  installDependencies: z
    .boolean()
    .optional()
    .describe(
      'Whether to install project dependencies (optional). The client MUST ensure this is a boolean value.'
    ),
  enableQuickDeploy: z
    .boolean()
    .optional()
    .describe(
      'Whether to enable quick deploy (optional). The client MUST ensure this is a boolean value.'
    ),
  enableAutoDeploy: z
    .boolean()
    .optional()
    .describe(
      'Whether to enable auto deploy (optional). The client MUST ensure this is a boolean value.'
    ),
  provider: z
    .string()
    .optional()
    .describe(
      'The provider for the site (optional). The client MUST validate this value against the available providers from listProvidersTool before passing it, as this is plain text from the user.'
    ),
  network: z
    .array(z.string())
    .optional()
    .describe(
      'Network server IDs (optional). The client MUST validate each value against the available servers from listServersTool before passing it, as these are plain text from the user.'
    ),
  environment: z
    .string()
    .optional()
    .describe(
      'Environment variables (optional). The client MUST ensure this is a valid environment string if provided.'
    ),
  recipeId: z
    .string()
    .optional()
    .describe(
      'Recipe ID to run after provisioning (optional). The client MUST validate this value against the available recipes from listRecipesTool before passing it, as this is plain text from the user.'
    ),
  confirmationId: z
    .string()
    .describe(
      'This confirmationId must be obtained from this tool after explicit, manual user confirmation by the end user. Automation or bypassing of this step is strictly forbidden.'
    ),
}

export const siteCreationConfirmationStore =
  createConfirmationStore<Omit<typeof paramsSchema, never>>()

const baseDescription = "Confirms the site creation parameters and returns a summary for user confirmation."

export const confirmSiteCreationTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'confirm_site_creation',
  parameters: paramsSchema,
  annotations: {
    title: 'Confirm Site Creation',
    description: `${baseDescription}\n\n${CONFIRMATION_DESCRIPTION}`,
    operation: 'confirm',
    resource: 'site_creation',
    safe: false,
    readOnlyHint: false,
    openWorldHint: true,
    readWriteHint: true,
    destructiveHint: false
  },
  handler: async params => {
    const entry = createConfirmation(siteCreationConfirmationStore, params)
    const summary =
      `Please confirm the site creation with the following settings:\n` +
      `Server ID: ${params.serverId}\n` +
      `Domain: ${params.domain}\n` +
      `Project Type: ${params.projectType}\n` +
      (params.directory ? `Directory: ${params.directory}\n` : '') +
      (params.isolated !== undefined ? `Isolated: ${params.isolated}\n` : '') +
      (params.wildcardSubdomains !== undefined ? `Wildcard Subdomains: ${params.wildcardSubdomains}\n` : '') +
      (params.phpVersion ? `PHP Version: ${params.phpVersion}\n` : '') +
      (params.database ? `Database: ${params.database}\n` : '') +
      (params.repository ? `Repository: ${params.repository}\n` : '') +
      (params.branch ? `Branch: ${params.branch}\n` : '') +
      (params.composer !== undefined ? `Composer: ${params.composer}\n` : '') +
      (params.installDependencies !== undefined ? `Install Dependencies: ${params.installDependencies}\n` : '') +
      (params.enableQuickDeploy !== undefined ? `Quick Deploy: ${params.enableQuickDeploy}\n` : '') +
      (params.enableAutoDeploy !== undefined ? `Auto Deploy: ${params.enableAutoDeploy}\n` : '') +
      (params.provider ? `Provider: ${params.provider}\n` : '') +
      (Array.isArray(params.network) && params.network.length > 0 ? `Network: ${params.network.join(', ')}\n` : '') +
      (params.environment ? `Environment: ${params.environment}\n` : '') +
      (params.recipeId ? `Recipe ID: ${params.recipeId}\n` : '') +
      `Confirmation ID: ${entry.confirmationId}\n` +
      `\nType "yes" to confirm or "no" to cancel.`
    return toMCPToolResult({ summary, confirmationId: entry.confirmationId })
  },
}
