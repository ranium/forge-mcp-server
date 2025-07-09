import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import { deleteDatabaseUserConfirmationStore } from './confirmDeleteDatabaseUserTool.js'
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
  confirmationId: z
    .string()
    .describe(
      'This confirmationId must be obtained from confirmDeleteDatabaseUserTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, the operation will be rejected.'
    ),
}

const paramsZodObject = z.object(paramsSchema)

export const deleteDatabaseUserTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'delete_database_user',
  parameters: paramsSchema,
  category: ToolCategory.Destructive,
  annotations: {
    title: 'Delete Database User',
    description: `Deletes a database user from a server in Laravel Forge.\n\nBefore calling this tool, the client MUST call the 'confirm_delete_database_user' tool and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.`,
    operation: 'delete',
    resource: 'database_user',
    safe: false,
    destructiveHint: true,
    readOnlyHint: false,
    readWriteHint: true
  },
  handler: async (params, forgeApiKey) => {
      try {
        const parsed = paramsZodObject.parse(params)
        const { serverId, userId, serverName, userName, confirmationId } =
          parsed
        // Validate confirmation using generic utility
        const confirmation = validateConfirmation(
          deleteDatabaseUserConfirmationStore,
          confirmationId,
          (stored: Record<string, unknown>) =>
            stored.serverId == serverId &&
            stored.userId == userId &&
            stored.serverName === serverName &&
            stored.userName === userName
        )
        if (!confirmation) {
          return toMCPToolResult(false)
        }
        markConfirmationUsed(
          deleteDatabaseUserConfirmationStore,
          confirmationId
        )
        // Real API call
        const data = await callForgeApi<object>(
          {
            endpoint: `/servers/${String(serverId)}/database-users/${String(userId)}`,
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
