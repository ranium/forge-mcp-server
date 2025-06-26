import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { z } from 'zod'

const paramsSchema = {
  provider: z
    .string()
    .describe(
      'The provider ID to list sizes for (e.g., ocean2, akamai, vultr2, aws, hetzner, custom)'
    ),
  region: z
    .string()
    .describe('The region ID to list sizes for (e.g., ams2, fra1, etc.)'),
}

const paramsZodObject = z.object(paramsSchema)

export const listSizesTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'list_sizes',
  description:
    'List available sizes for a given provider and region using the Forge API. Also allows custom/free-text entry.',
  parameters: paramsSchema,
  category: ToolCategory.Readonly,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params)
      const provider = parsed.provider
      const region = parsed.region
      // Fetch all regions from Forge API
      const data = await callForgeApi<{
        regions?: Record<string, Array<{ id: string; sizes?: unknown[] }>>
      }>(
        {
          endpoint: '/regions',
          method: HttpMethod.GET,
        },
        forgeApiKey
      )
      const providerRegions = data?.regions?.[provider] || []
      const regionObj = providerRegions.find(r => r.id === region)
      const sizes = regionObj?.sizes || []
      return toMCPToolResult({ sizes, allowCustom: true })
    } catch (err) {
      return toMCPToolError(err)
    }
  },
}
