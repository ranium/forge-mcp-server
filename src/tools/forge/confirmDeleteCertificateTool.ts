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
}

export const deleteCertificateConfirmationStore =
  createConfirmationStore<typeof paramsSchema>()

export const confirmDeleteCertificateTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'confirm_certificate_deletion',
  description:
    'Confirms the request to delete a certificate and returns a summary for user confirmation. This tool does not perform the operation, but returns a summary and expects the client to handle the confirmation logic.',
  parameters: paramsSchema,
  category: ToolCategory.Destructive,
  handler: async params => {
    const entry = createConfirmation(deleteCertificateConfirmationStore, params)
    const summary = `Are you sure you want to delete the certificate from:
Server: ${params.serverName} (ID: ${params.serverId})
Site: ${params.siteName} (ID: ${params.siteId})
Certificate ID: ${params.certificateId}

Type "yes" to confirm or "no" to cancel.`

    return toMCPToolResult({
      summary,
      confirmationId: entry.confirmationId,
    })
  },
}
