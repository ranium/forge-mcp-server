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
      'The ID of the server. The client MUST validate this value against the available servers from listServersTool before passing it, as this is plain text from the user.'
    ),
  siteId: z
    .string()
    .describe(
      'The ID of the site. The client MUST validate this value against the available sites from listSitesTool before passing it, as this is plain text from the user.'
    ),
}

export const siteDeletionConfirmationStore =
  createConfirmationStore<z.infer<z.ZodObject<typeof paramsSchema>>>()

function buildSummary(params: z.infer<z.ZodObject<typeof paramsSchema>>, confirmationId: string): string {
  let summary = `Please confirm the site deletion with the following settings:\n`
  summary += `Server ID: ${params.serverId}\n`
  summary += `Site ID: ${params.siteId}\n`
  summary += `Confirmation ID: ${confirmationId}\n\nType \"yes\" to confirm or \"no\" to cancel.`
  return summary
}

const baseDescription = "Confirms the site deletion parameters and returns a summary for user confirmation."

export const confirmSiteDeletionTool = confirmationToolFactory({
  name: 'confirm_site_deletion',
  description: `${baseDescription}\n\n${CONFIRMATION_DESCRIPTION}`,
  category: ToolCategory.Write,
  paramsSchema,
  store: siteDeletionConfirmationStore,
  buildSummary,
})
