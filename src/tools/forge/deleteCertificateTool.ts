import { ForgeToolDefinition, HttpMethod } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import { deleteCertificateConfirmationStore } from './confirmDeleteCertificateTool.js'
import {
  validateConfirmation,
  markConfirmationUsed,
} from '../../utils/confirmationStore.js'

const paramsSchema = {
  serverId: z
    .string()
    .describe(
      'The ID of the server. The client MUST validate this value against the available servers from listServersTool before passing it.'
    ),
  serverName: z
    .string()
    .describe(
      'The name of the server. The client MUST validate this value against the available servers from listServersTool before passing it.'
    ),
  siteId: z
    .string()
    .describe(
      'The ID of the site. The client MUST validate this value against the available sites from listSitesTool before passing it.'
    ),
  siteName: z
    .string()
    .describe(
      'The name of the site. The client MUST validate this value against the available sites from listSitesTool before passing it.'
    ),
  certificateId: z.string().describe('The ID of the certificate to delete.'),
  confirmationId: z
    .string()
    .describe(
      'This confirmationId must be obtained from confirmCertificateDeletionTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, the certificate deletion will be rejected.'
    ),
}

const paramsZodObject = z.object(paramsSchema)

export const deleteCertificateTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'delete_certificate',
  parameters: paramsSchema,
  annotations: {
    title: 'Delete Certificate',
    description: `Deletes an SSL certificate from a site in Laravel Forge.\n\nBefore calling this tool, the client MUST call the 'confirm_delete_certificate' tool and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.`,
    operation: 'delete',
    resource: 'certificate',
    safe: false,
    destructiveHint: true,
    readOnlyHint: false,
    readWriteHint: true
  },
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params)
      const {
        serverId,
        siteId,
        certificateId,
        serverName,
        siteName,
        confirmationId,
      } = parsed

      // Validate confirmation using generic utility
      const confirmation = validateConfirmation(
        deleteCertificateConfirmationStore,
        confirmationId,
        (stored: Record<string, unknown>) =>
          stored.serverId === serverId &&
          stored.siteId === siteId &&
          stored.certificateId === certificateId &&
          stored.serverName === serverName &&
          stored.siteName === siteName
      )

      if (!confirmation) {
        return toMCPToolResult(false)
      }

      markConfirmationUsed(deleteCertificateConfirmationStore, confirmationId)

      // Real API call
      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${serverId}/sites/${siteId}/certificates/${certificateId}`,
          method: HttpMethod.DELETE,
        },
        forgeApiKey
      )

      return toMCPToolResult(data)
    } catch (err) {
      return toMCPToolError(err)
    }
  },
}
