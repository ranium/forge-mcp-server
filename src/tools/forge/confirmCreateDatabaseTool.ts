import { ForgeToolDefinition } from '../../core/types/protocols.js'
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
  name: z
    .string()
    .describe(
      'The name of the database to create. The client MUST validate this is a valid database name.'
    ),
  user: z
    .string()
    .optional()
    .describe(
      'The name of the database user to create (optional). The client MUST validate this is a valid username if provided.'
    ),
  password: z
    .string()
    .optional()
    .describe(
      'The password for the database user (optional, only shown if user is provided). The client MUST validate this is a valid password if provided.'
    ),
}

export const createDatabaseConfirmationStore =
  createConfirmationStore<typeof paramsSchema>()

export const confirmCreateDatabaseTool: ForgeToolDefinition<
  typeof paramsSchema
> = {
  name: 'confirm_create_database',
  description: `Confirms the request to create a database and returns a summary for user confirmation. This tool does not perform the operation, but returns a summary and expects the client to handle the confirmation logic.`,
  parameters: paramsSchema,
  handler: async params => {
    const entry = createConfirmation(createDatabaseConfirmationStore, params)
    let summary =
      `Are you sure you want to create a new database?\n` +
      `Server: ${params.serverName} (ID: ${params.serverId})\n` +
      `Database: ${params.name}\n`
    if (params.user) {
      summary += `User: ${params.user}\n`
    }
    if (params.password) {
      summary += `Password: ${params.password}\n`
    }
    summary += `\nType "yes" to confirm or "no" to cancel.`
    return toMCPToolResult({ summary, confirmationId: entry.confirmationId })
  },
}
