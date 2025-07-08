import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'

const paramsSchema = {
  serverId: z
    .string()
    .describe('The ID of the server to list deployments for.'),
  siteId: z.string().describe('The ID of the site to list deployments for.'),
}

const paramsZodObject = z.object(paramsSchema)

export const listDeploymentsTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'list_deployments',
  parameters: paramsSchema,
  category: ToolCategory.Readonly,
  annotations: {
    title: 'List Deployments',
    description: 'List all deployments for a specific site.',
    operation: 'list',
    resource: 'deployments',
    safe: true,
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (params, forgeApiKey) => {
    const parsed = paramsZodObject.parse(params)
    const serverId = parsed.serverId
    const siteId = parsed.siteId
    if (!serverId || !siteId) {
      return toMCPToolError(
        new Error('Missing required parameter: serverId or siteId')
      )
    }
    try {
      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}/deployment-history`,
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
