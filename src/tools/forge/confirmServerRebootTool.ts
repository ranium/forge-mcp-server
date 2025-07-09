import { ForgeToolDefinition } from '../../core/types/protocols.js'
import { toMCPToolResult } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import {
  createConfirmationStore,
  createConfirmation,
} from '../../utils/confirmationStore.js'
import { CONFIRMATION_DESCRIPTION } from '../../utils/protocolDescriptions.js'

const paramsSchema = {
  serverId: z.string().describe('The ID of the server to reboot.'),
  serverName: z.string().describe('The name of the server to reboot.'),
}

export const rebootConfirmationStore =
  createConfirmationStore<Omit<typeof paramsSchema, never>>()

const baseDescription = "Confirms the request to reboot a server and returns a summary for user confirmation."

export const confirmServerRebootTool: ForgeToolDefinition<typeof paramsSchema> =
  {
    name: 'confirm_server_reboot',
    parameters: paramsSchema,
    annotations: {
      title: 'Confirm Server Reboot',
      description: `${baseDescription}\n\n${CONFIRMATION_DESCRIPTION}`,
      operation: 'confirm',
      resource: 'server_reboot',
      safe: false,
      readOnlyHint: false,
      openWorldHint: true,
      readWriteHint: true,
      destructiveHint: false
    },
    handler: async params => {
      const entry = createConfirmation(rebootConfirmationStore, params)
      const summary =
        `Please confirm reboot of server:\n` +
        `Server ID: ${params.serverId}\n` +
        `Server Name: ${params.serverName}\n` +
        `\nType "yes" to confirm or "no" to cancel.`
      return toMCPToolResult({ summary, confirmationId: entry.confirmationId })
    },
  }
