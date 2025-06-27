import { ToolCategory } from '../../core/types/protocols.js'
import { z } from 'zod'
import {
  createConfirmationStore,
  confirmationToolFactory,
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
  createConfirmationStore<z.infer<z.ZodObject<typeof paramsSchema>>>()

function buildSummary(params: z.infer<z.ZodObject<typeof paramsSchema>>, confirmationId: string): string {
  let summary = `Please confirm the site creation with the following settings:\n`
  summary += `Server ID: ${params.serverId}\n`
  summary += `Domain: ${params.domain}\n`
  summary += `Project Type: ${params.projectType}\n`
  if (params.directory) summary += `Directory: ${params.directory}\n`
  if (params.isolated !== undefined) summary += `Isolated: ${params.isolated}\n`
  if (params.wildcardSubdomains !== undefined) summary += `Wildcard Subdomains: ${params.wildcardSubdomains}\n`
  if (params.phpVersion) summary += `PHP Version: ${params.phpVersion}\n`
  if (params.database) summary += `Database: ${params.database}\n`
  if (params.repository) summary += `Repository: ${params.repository}\n`
  if (params.branch) summary += `Branch: ${params.branch}\n`
  if (params.composer !== undefined) summary += `Composer: ${params.composer}\n`
  if (params.installDependencies !== undefined) summary += `Install Dependencies: ${params.installDependencies}\n`
  if (params.enableQuickDeploy !== undefined) summary += `Enable Quick Deploy: ${params.enableQuickDeploy}\n`
  if (params.enableAutoDeploy !== undefined) summary += `Enable Auto Deploy: ${params.enableAutoDeploy}\n`
  if (params.provider) summary += `Provider: ${params.provider}\n`
  if (params.network) summary += `Network: ${params.network.join(', ')}\n`
  if (params.environment) summary += `Environment: ${params.environment}\n`
  if (params.recipeId) summary += `Recipe ID: ${params.recipeId}\n`
  summary += `Confirmation ID: ${confirmationId}\n\nType \"yes\" to confirm or \"no\" to cancel.`
  return summary
}

const baseDescription = "Confirms the site creation parameters and returns a summary for user confirmation."

export const confirmSiteCreationTool = confirmationToolFactory({
  name: 'confirm_site_creation',
  description: `${baseDescription}\n\n${CONFIRMATION_DESCRIPTION}`,
  category: ToolCategory.Write,
  paramsSchema,
  store: siteCreationConfirmationStore,
  buildSummary,
})
