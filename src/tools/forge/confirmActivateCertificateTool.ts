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
}

const paramsZodObject = z.object(paramsSchema)
type Params = z.infer<typeof paramsZodObject>

export const activateCertificateConfirmationStore =
  createConfirmationStore<Params>()

const baseDescription = "Confirms the request to activate a certificate and returns a summary for user confirmation."

export const confirmActivateCertificateTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'confirm_activate_certificate',
  description: `${baseDescription}\n\n${CONFIRMATION_DESCRIPTION}`,
  parameters: paramsSchema,
  category: ToolCategory.Write,
  handler: async params => {
    const validatedParams = paramsZodObject.parse(params) as Params
    const entry = createConfirmation(
      activateCertificateConfirmationStore,
      validatedParams
    )

    const summary =
      `Are you sure you want to activate this SSL certificate?\n` +
      `Server: ${validatedParams.serverName} (ID: ${validatedParams.serverId})\n` +
      `Site: ${validatedParams.siteName} (ID: ${validatedParams.siteId})\n` +
      `Certificate ID: ${validatedParams.certificateId}\n\n` +
      `Type "yes" to confirm or "no" to cancel.`

    return toMCPToolResult({ summary, confirmationId: entry.confirmationId })
  },
}
