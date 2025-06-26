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
  databaseId: z
    .string()
    .describe(
      'The ID of the database. The client MUST validate this value against the available databases from listDatabasesTool before passing it.'
    ),
  serverName: z
    .string()
    .describe(
      'The name of the server. The client MUST validate this value against the available servers from listServersTool before passing it.'
    ),
  databaseName: z
    .string()
    .describe(
      'The name of the database. The client MUST validate this value against the available databases from listDatabasesTool before passing it.'
    ),
}

export const deleteDatabaseConfirmationStore =
  createConfirmationStore<typeof paramsSchema>()

export const confirmDeleteDatabaseTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'confirm_delete_database',
  description: `Confirms the request to delete a database and returns a summary for user confirmation.\n\nThis tool MUST NOT be called automatically. The client MUST display the confirmation summary and confirmation ID to the end user and require explicit, manual user input (such as typing 'yes' or clicking a confirmation button) before proceeding. Automation, pre-filling, or bypassing this user confirmation step is strictly forbidden and considered a violation of the protocol. Only after receiving explicit user confirmation should the client call the corresponding action tool with the confirmationId.`,
  parameters: paramsSchema,
  category: ToolCategory.Destructive,
  handler: async params => {
    const entry = createConfirmation(deleteDatabaseConfirmationStore, params)
    const summary =
      `Are you sure you want to delete the following database?\n` +
      `Server: ${params.serverName} (ID: ${params.serverId})\n` +
      `Database: ${params.databaseName} (ID: ${params.databaseId})\n` +
      `\nType "yes" to confirm or "no" to cancel.`
    return toMCPToolResult({ summary, confirmationId: entry.confirmationId })
  },
}
