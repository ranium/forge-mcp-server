import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import { deleteDatabaseConfirmationStore } from './confirmDeleteDatabaseTool.js'
import {
  validateConfirmation,
  markConfirmationUsed,
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
  confirmationId: z
    .string()
    .describe(
      'This confirmationId must be obtained from confirmDeleteDatabaseTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, the operation will be rejected.'
    ),
}

const paramsZodObject = z.object(paramsSchema)

export const deleteDatabaseTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'delete_database',
  parameters: paramsSchema,
  category: ToolCategory.Destructive,
  annotations: {
    title: 'Delete Database',
    description: `Deletes a database from a server in Laravel Forge.\n\nBefore calling this tool, the client MUST call the 'confirm_delete_database' tool and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.`,
    operation: 'delete',
    resource: 'database',
    safe: false,
    destructiveHint: true,
    readOnlyHint: false
  },
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params)
      const { serverId, databaseId, serverName, databaseName, confirmationId } =
        parsed
      // Validate confirmation using generic utility
      const confirmation = validateConfirmation(
        deleteDatabaseConfirmationStore,
        confirmationId,
        (stored: Record<string, unknown>) =>
          stored.serverId == serverId &&
          stored.databaseId == databaseId &&
          stored.serverName === serverName &&
          stored.databaseName === databaseName
      )
      if (!confirmation) {
        return toMCPToolResult(false)
      }
      markConfirmationUsed(deleteDatabaseConfirmationStore, confirmationId)
      // Real API call
      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${String(serverId)}/databases/${String(databaseId)}`,
          method: HttpMethod.DELETE,
        },
        forgeApiKey
      )
      return toMCPToolResult(data)
    } catch (err) {
      return toMCPToolError(err)
    }
  },
}
