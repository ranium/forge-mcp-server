import { ForgeToolDefinition, HttpMethod } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'

const params = {}

export const getUserTool: ForgeToolDefinition<typeof params> = {
  name: 'get_user',
  parameters: params,
  annotations: {
    title: 'Get User',
    description: 'Get the current Forge user.',
    operation: 'get',
    resource: 'user',
    safe: true,
    readOnlyHint: true,
    openWorldHint: true,
    readWriteHint: false,
    destructiveHint: false
  },
  handler: async (_params, forgeApiKey) => {
    try {
      const data = await callForgeApi<object>(
        {
          endpoint: '/user',
          method: HttpMethod.GET,
        },
        forgeApiKey
      )
      return toMCPToolResult(data)
    } catch (err) {
      return toMCPToolError(err)
    }
  },
}
