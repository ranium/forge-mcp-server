import { ForgeToolDefinition } from '../../core/types/protocols.js'
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

const baseDescription = "Confirms the request to delete a database and returns a summary for user confirmation."

export const confirmDeleteDatabaseTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'confirm_delete_database',
  parameters: paramsSchema,
  annotations: {
    title: 'Confirm Delete Database',
    description: `${baseDescription}\n\n${CONFIRMATION_DESCRIPTION}`,
    operation: 'confirm',
    resource: 'database',
    safe: false,
    destructiveHint: true,
    readOnlyHint: false,
    readWriteHint: true
  },
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
