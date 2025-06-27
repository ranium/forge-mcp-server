import { ForgeToolDefinition, ToolCategory } from '../../core/types/protocols.js'
import { toMCPToolResult } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import {
  createConfirmationStore,
  createConfirmation,
} from '../../utils/confirmationStore.js'
import { CONFIRMATION_DESCRIPTION } from '../../utils/protocolDescriptions.js'

const paramsSchema = {
  serverId: z.string().describe('The ID of the server to delete.'),
  serverName: z.string().describe('The name of the server to delete.'),
}

export const deletionConfirmationStore =
  createConfirmationStore<Omit<typeof paramsSchema, never>>()

const baseDescription = "Confirms the request to delete a server and returns a summary for user confirmation."

export const confirmServerDeletionTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'confirm_server_deletion',
  description: `${baseDescription}\n\n${CONFIRMATION_DESCRIPTION}`,
  parameters: paramsSchema,
  category: ToolCategory.Write,
  handler: async params => {
    const entry = createConfirmation(deletionConfirmationStore, params)
    const summary =
      `Please confirm deletion of server:\n` +
      `Server ID: ${params.serverId}\n` +
      `Server Name: ${params.serverName}\n` +
      `\nType "yes" to confirm or "no" to cancel.`
    return toMCPToolResult({ summary, confirmationId: entry.confirmationId })
  },
}
