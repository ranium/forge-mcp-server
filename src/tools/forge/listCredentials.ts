import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'

const paramsSchema = {}

export const listCredentialsTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'list_credentials',
  parameters: paramsSchema,
  category: ToolCategory.Readonly,
  annotations: {
    title: 'List Credentials',
    description: 'List all credentials in your Laravel Forge account.',
    operation: 'list',
    resource: 'credentials',
    safe: true,
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_params, forgeApiKey) => {
    try {
      const data = await callForgeApi<object>(
        {
          endpoint: '/credentials',
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
