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
}

const paramsZodObject = z.object(paramsSchema)

export const listCertificatesTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'list_certificates',
  parameters: paramsSchema,
  annotations: {
    title: 'List Certificates',
    description: 'List all SSL certificates for a specific site.',
    operation: 'list',
    resource: 'certificates',
    safe: true,
    readOnlyHint: true,
    openWorldHint: true,
    readWriteHint: false,
    destructiveHint: false
  },
  handler: async (params, forgeApiKey) => {
    try {
      const { serverId, siteId } = paramsZodObject.parse(params)

      const data = await callForgeApi<object>(
        {
          endpoint: `/servers/${serverId}/sites/${siteId}/certificates`,
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
