import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { z } from 'zod'

const paramsSchema = {
  provider: z
    .string()
    .describe(
      'The provider ID to list regions for (e.g., ocean2, akamai, vultr2, aws, hetzner, custom)'
    ),
}

const paramsZodObject = z.object(paramsSchema)

export const listRegionsTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'list_regions',
  parameters: paramsSchema,
  category: ToolCategory.Readonly,
  annotations: {
    title: 'List Regions',
    description:
      'List available regions for a given provider using the Forge API. Also allows custom/free-text entry.',
    operation: 'list',
    resource: 'regions',
    safe: true,
    readOnlyHint: true,
    openWorldHint: true,
    readWriteHint: false,
    destructiveHint: false
  },
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params)
      const provider = parsed.provider
      // Fetch all regions from Forge API
      const data = await callForgeApi<{ regions?: Record<string, unknown[]> }>(
        {
          endpoint: '/regions',
          method: HttpMethod.GET,
        },
        forgeApiKey
      )
      const providerRegions = data?.regions?.[provider] || []
      return toMCPToolResult({ regions: providerRegions, allowCustom: true })
    } catch (err) {
      return toMCPToolError(err)
    }
  },
}
