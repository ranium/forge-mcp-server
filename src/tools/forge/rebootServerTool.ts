import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import { rebootConfirmationStore } from './confirmServerRebootTool.js'
import {
  validateConfirmation,
  markConfirmationUsed,
} from '../../utils/confirmationStore.js'

const paramsSchema = {
  serverId: z.string().describe('The ID of the server to reboot.'),
  confirmationId: z
    .string()
    .describe(
      'This confirmationId must be obtained from confirmServerRebootTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, server reboot will be rejected.'
    ),
}

const paramsZodObject = z.object(paramsSchema)

export const rebootServerTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'reboot_server',
  description: `Reboots a server in Laravel Forge.\n\nBefore calling this tool, the client MUST call the 'confirm_server_reboot' tool and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.`,
  parameters: paramsSchema,
  category: ToolCategory.Write,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params)
      const { serverId, confirmationId } = parsed
      // Validate confirmation using generic utility
      const confirmation = validateConfirmation(
        rebootConfirmationStore,
        confirmationId,
        (stored: Record<string, unknown>) =>
          String(stored.serverId) === String(serverId)
      )
      if (!confirmation) {
        return toMCPToolResult(false)
      }
      markConfirmationUsed(rebootConfirmationStore, confirmationId)
      // Real API call
      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${String(serverId)}/reboot`,
          method: HttpMethod.POST,
        },
        forgeApiKey
      )
      return toMCPToolResult(data)
    } catch (err) {
      return toMCPToolError(err)
    }
  },
}
