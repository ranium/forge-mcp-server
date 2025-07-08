import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'

const paramsSchema = {
  serverId: z
    .string()
    .describe('The ID of the server to get the deployment for.'),
  siteId: z.string().describe('The ID of the site to get the deployment for.'),
  deploymentId: z.string().describe('The ID of the deployment to get.'),
}

const paramsZodObject = z.object(paramsSchema)

export const getDeploymentTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'get_deployment',
  parameters: paramsSchema,
  category: ToolCategory.Readonly,
  annotations: {
    title: 'Get Deployment',
    description: 'Get details of a specific deployment.',
    operation: 'get',
    resource: 'deployment',
    safe: true,
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (params, forgeApiKey) => {
    const parsed = paramsZodObject.parse(params)
    const serverId = parsed.serverId
    const siteId = parsed.siteId
    const deploymentId = parsed.deploymentId
    if (!serverId || !siteId || !deploymentId) {
      return toMCPToolError(
        new Error(
          'Missing required parameter: serverId, siteId, or deploymentId'
        )
      )
    }
    try {
      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}/deployment-history/${String(deploymentId)}`,
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
