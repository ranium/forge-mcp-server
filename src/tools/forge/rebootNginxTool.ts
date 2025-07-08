import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'

const paramsSchema = {
  serverId: z.string().describe('The ID of the server to reboot Nginx.'),
}

const paramsZodObject = z.object(paramsSchema)

export const rebootNginxTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'reboot_nginx',
  parameters: paramsSchema,
  category: ToolCategory.Write,
  annotations: {
    title: 'Reboot Nginx',
    description: 'Reboots (restarts) the Nginx service on a server in Laravel Forge.',
    operation: 'restart',
    resource: 'nginx_service',
    readonly: false,
    safe: true
  },
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params)
      const { serverId } = parsed
      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${String(serverId)}/nginx/reboot`,
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
