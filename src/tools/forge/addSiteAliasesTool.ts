import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import { addSiteAliasesConfirmationStore } from './confirmAddSiteAliasesTool.js'
import {
  validateConfirmation,
  markConfirmationUsed,
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
  confirmationId: z
    .string()
    .describe(
      'This confirmationId must be obtained from confirmAddSiteAliasesTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, the alias addition will be rejected.'
    ),
}

const paramsZodObject = z.object(paramsSchema)

export const addSiteAliasesTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'add_site_aliases',
  description: `Adds aliases to a site in Laravel Forge.\n\nBefore calling this tool, the client MUST call the 'confirm_add_site_aliases' tool and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.`,
  parameters: paramsSchema,
  category: ToolCategory.Write,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params)
      const { serverId, siteId, aliases, confirmationId } = parsed
      // Validate confirmation using generic utility
      const confirmation = validateConfirmation(
        addSiteAliasesConfirmationStore,
        confirmationId,
        (stored: Record<string, unknown>) =>
          stored.serverId == serverId &&
          stored.siteId == siteId &&
          Array.isArray(stored.aliases) &&
          Array.isArray(aliases) &&
          stored.aliases.length === aliases.length &&
          (stored.aliases as string[]).every(
            (a: string, i: number) => a === aliases[i]
          )
      )
      if (!confirmation) {
        return toMCPToolResult(false)
      }
      markConfirmationUsed(addSiteAliasesConfirmationStore, confirmationId)
      const payload = { aliases }
      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}/aliases`,
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
