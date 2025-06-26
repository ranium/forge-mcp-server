import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'

const paramsSchema = {
  serverId: z.string().describe('The ID of the server to reboot PHP.'),
}

const paramsZodObject = z.object(paramsSchema)

export const rebootPhpTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'reboot_php',
  description: `Reboots (restarts) the PHP service on a server in Laravel Forge.`,
  parameters: paramsSchema,
  category: ToolCategory.Write,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params)
      const { serverId } = parsed
      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${String(serverId)}/php/reboot`,
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
