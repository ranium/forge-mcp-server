import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import {
  validateConfirmation,
  markConfirmationUsed,
} from '../../utils/confirmationStore.js'
import { installOrUpdateSiteGitConfirmationStore } from './confirmInstallOrUpdateSiteGitTool.js'

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
  confirmationId: z
    .string()
    .describe(
      'This confirmationId must be obtained from confirmInstallOrUpdateSiteGitTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, the operation will be rejected.'
    ),
}

const paramsZodObject = z.object(paramsSchema)

export const installOrUpdateSiteGitTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'install_or_update_site_git',
  description: `Installs or updates the Git repository for an existing site in Laravel Forge.\n\nBefore calling this tool, the client MUST call the 'confirm_install_or_update_site_git' tool and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.`,
  parameters: paramsSchema,
  category: ToolCategory.Write,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params)
      const { confirmationId, ...rest } = parsed
      // Validate confirmation using generic utility
      const confirmation = validateConfirmation(
        installOrUpdateSiteGitConfirmationStore,
        confirmationId,
        (stored: Record<string, unknown>) => {
          const restObj = rest as Record<string, unknown>
          // All params except confirmationId must match
          return Object.keys(restObj).every(key => stored[key] === restObj[key])
        }
      )
      if (!confirmation) {
        return toMCPToolResult(false)
      }
      markConfirmationUsed(
        installOrUpdateSiteGitConfirmationStore,
        confirmationId
      )
      // Prepare payload for Forge API
      const payload: Record<string, unknown> = {
        provider: rest.provider,
        repository: rest.repository,
        branch: rest.branch,
      }
      if (rest.composer !== undefined) payload.composer = rest.composer
      if (rest.database) payload.database = rest.database
      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${String(rest.serverId)}/sites/${String(rest.siteId)}/git`,
          method: HttpMethod.POST,
          data: payload,
        },
        forgeApiKey
      )
      return toMCPToolResult(data)
    } catch (err) {
      return toMCPToolError(err)
    }
  },
}
