import { ForgeToolDefinition, HttpMethod } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'

const paramsSchema = {
  serverId: z
    .string()
    .describe(
      'The ID of the server. The client MUST validate this value against the available servers from listServersTool before passing it.'
    ),
  siteId: z
    .string()
    .describe(
      'The ID of the site. The client MUST validate this value against the available sites from listSitesTool before passing it.'
    ),
  certificateId: z
    .string()
    .describe('The ID of the certificate to get details for.'),
}

const paramsZodObject = z.object(paramsSchema)

export const getCertificateTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'get_certificate',
  parameters: paramsSchema,
  annotations: {
    title: 'Get Certificate',
    description: 'Gets details of a specific SSL certificate for a site.',
    operation: 'get',
    resource: 'certificate',
    safe: true,
    readOnlyHint: true,
    openWorldHint: true,
    readWriteHint: false,
    destructiveHint: false
  },
  handler: async (params, forgeApiKey) => {
    try {
      const { serverId, siteId, certificateId } = paramsZodObject.parse(params)

      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${serverId}/sites/${siteId}/certificates/${certificateId}`,
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
