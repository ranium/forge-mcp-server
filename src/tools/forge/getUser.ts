import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'

const params = {}

export const getUserTool: ForgeToolDefinition<typeof params> = {
  name: 'get_user',
  description: 'Get the current Forge user.',
  parameters: params,
  category: ToolCategory.Readonly,
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
