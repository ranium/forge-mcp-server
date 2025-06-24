import { ForgeToolDefinition, HttpMethod } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import { createDatabaseUserConfirmationStore } from './confirmCreateDatabaseUserTool.js'
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
  serverName: z
    .string()
    .describe(
      'The name of the server. The client MUST validate this value against the available servers from listServersTool before passing it.'
    ),
  name: z
    .string()
    .describe(
      'The username to create. The client MUST validate this is a valid username.'
    ),
  password: z
    .string()
    .describe(
      'The password to assign the user. The client MUST validate this is a valid password.'
    ),
  databases: z
    .array(z.union([z.string(), z.number()]))
    .describe(
      'An array of database IDs the user should have access to. The client MUST validate these IDs using listDatabasesTool before passing them.'
    ),
  confirmationId: z
    .string()
    .describe(
      'This confirmationId must be obtained from confirmCreateDatabaseUserTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, the operation will be rejected.'
    ),
}

const paramsZodObject = z.object(paramsSchema)

export const createDatabaseUserTool: ForgeToolDefinition<typeof paramsSchema> =
  {
    name: 'create_database_user',
    description: `Creates a new database user on a server in Laravel Forge.\n\nBefore calling this tool, the client MUST call the 'confirm_create_database_user' tool and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.`,
    parameters: paramsSchema,
    handler: async (params, forgeApiKey) => {
      try {
        const parsed = paramsZodObject.parse(params)
        const {
          serverId,
          serverName,
          name,
          password,
          databases,
          confirmationId,
        } = parsed
        // Validate confirmation using generic utility
        const confirmation = validateConfirmation(
          createDatabaseUserConfirmationStore,
          confirmationId,
          (stored: Record<string, unknown>) =>
            stored.serverId == serverId &&
            stored.serverName === serverName &&
            stored.name === name &&
            stored.password === password &&
            Array.isArray(stored.databases) &&
            Array.isArray(databases) &&
            stored.databases.length === databases.length &&
            (stored.databases as unknown[]).every(
              (id: unknown, i: number) => String(id) === String(databases[i])
            )
        )
        if (!confirmation) {
          return toMCPToolResult(false)
        }
        markConfirmationUsed(
          createDatabaseUserConfirmationStore,
          confirmationId
        )
        // Real API call
        const payload = { name, password, databases }
        const data = await callForgeApi<object>(
          {
            endpoint: `/servers/${String(serverId)}/database-users`,
            method: HttpMethod.POST,
            data: payload,
          },
          forgeApiKey
        )
        return toMCPToolResult(data)
      } catch (err) {
        return toMCPToolError(err)
      }
    },
  }
