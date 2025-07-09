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
  userId: z
    .string()
    .describe(
      'The ID of the database user. The client MUST validate this value against the available users from listDatabaseUsersTool before passing it.'
    ),
  serverName: z
    .string()
    .describe(
      'The name of the server. The client MUST validate this value against the available servers from listServersTool before passing it.'
    ),
  userName: z
    .string()
    .describe(
      'The name of the database user. The client MUST validate this value against the available users from listDatabaseUsersTool before passing it.'
    ),
}

export const deleteDatabaseUserConfirmationStore =
  createConfirmationStore<typeof paramsSchema>()

const baseDescription = "Confirms the request to delete a database user and returns a summary for user confirmation."

export const confirmDeleteDatabaseUserTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'confirm_delete_database_user',
  parameters: paramsSchema,
  annotations: {
    title: 'Confirm Delete Database User',
    description: `${baseDescription}\n\n${CONFIRMATION_DESCRIPTION}`,
    operation: 'confirm',
    resource: 'database_user',
    safe: false,
    destructiveHint: true,
    readOnlyHint: false,
    readWriteHint: true
  },
  handler: async params => {
    const entry = createConfirmation(
      deleteDatabaseUserConfirmationStore,
      params
    )
    const summary =
      `Are you sure you want to delete the following database user?\n` +
      `Server: ${params.serverName} (ID: ${params.serverId})\n` +
      `User: ${params.userName} (ID: ${params.userId})\n` +
      `\nType "yes" to confirm or "no" to cancel.`
    return toMCPToolResult({ summary, confirmationId: entry.confirmationId })
  },
}
