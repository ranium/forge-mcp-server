import { ForgeToolDefinition, ToolCategory } from '../../core/types/protocols.js'
import { toMCPToolResult } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import {
  createConfirmationStore,
  createConfirmation,
} from '../../utils/confirmationStore.js'

const paramsSchema = {
  serverId: z.string().describe('The ID of the server to delete.'),
  serverName: z.string().describe('The name of the server to delete.'),
}

export const deletionConfirmationStore =
  createConfirmationStore<Omit<typeof paramsSchema, never>>()

export const confirmServerDeletionTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'confirm_server_deletion',
  description: `Confirms the request to delete a server and returns a summary for user confirmation.\n\nThis tool MUST NOT be called automatically. The client MUST display the confirmation summary and confirmation ID to the end user and require explicit, manual user input (such as typing 'yes' or clicking a confirmation button) before proceeding. Automation, pre-filling, or bypassing this user confirmation step is strictly forbidden and considered a violation of the protocol. Only after receiving explicit user confirmation should the client call the corresponding action tool with the confirmationId.`,
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
