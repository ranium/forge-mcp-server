import { ForgeToolDefinition, HttpMethod } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import { activateCertificateConfirmationStore } from './confirmActivateCertificateTool.js'
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
  certificateId: z.string().describe('The ID of the certificate to activate.'),
  confirmationId: z
    .string()
    .describe(
      'This confirmationId must be obtained from confirm_activate_certificate tool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, the operation will be rejected.'
    ),
}

const paramsZodObject = z.object(paramsSchema)

export const activateCertificateTool: ForgeToolDefinition<typeof paramsSchema> =
  {
    name: 'activate_certificate',
    description:
      "Activates an SSL certificate for a site. Before calling this tool, the client MUST call the 'confirm_activate_certificate' tool and present the returned summary to the user for explicit confirmation.",
    parameters: paramsSchema,
    handler: async (params, forgeApiKey) => {
      try {
        const parsed = paramsZodObject.parse(params)
        const {
          serverId,
          serverName,
          siteId,
          siteName,
          certificateId,
          confirmationId,
        } = parsed

        // Validate confirmation
        const confirmation = validateConfirmation(
          activateCertificateConfirmationStore,
          confirmationId,
          (stored: Record<string, unknown>) =>
            stored.serverId === serverId &&
            stored.serverName === serverName &&
            stored.siteId === siteId &&
            stored.siteName === siteName &&
            stored.certificateId === certificateId
        )

        if (!confirmation) {
          return toMCPToolResult(false)
        }

        markConfirmationUsed(
          activateCertificateConfirmationStore,
          confirmationId
        )

        // Call Forge API to activate the certificate
        const data = await callForgeApi<object>(
          {
            endpoint: `/servers/${serverId}/sites/${siteId}/certificates/${certificateId}/activate`,
            method: HttpMethod.POST,
          },
          forgeApiKey
        )

        return toMCPToolResult(data)
      } catch (err) {
        return toMCPToolError(err)
      }
    },
  }
