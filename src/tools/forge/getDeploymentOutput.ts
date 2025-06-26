import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'

const paramsSchema = {
  serverId: z
    .string()
    .describe('The ID of the server to get the deployment output for.'),
  siteId: z
    .string()
    .describe('The ID of the site to get the deployment output for.'),
  deploymentId: z
    .string()
    .describe('The ID of the deployment to get the output for.'),
}

const paramsZodObject = z.object(paramsSchema)

export const getDeploymentOutputTool: ForgeToolDefinition<typeof paramsSchema> =
  {
    name: 'get_deployment_output',
    description:
      'Get the output (log) for a specific deployment on a site in your Laravel Forge account.',
    parameters: paramsSchema,
    category: ToolCategory.Readonly,
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
            endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}/deployment-history/${String(deploymentId)}/output`,
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
