import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { z } from "zod";

const paramsSchema = {
  provider: z.string().describe("The provider ID to list regions for (e.g., ocean2, akamai, vultr2, aws, hetzner, custom)")
};

const paramsZodObject = z.object(paramsSchema);

export const listRegionsTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "list_regions",
  description: "List available regions for a given provider using the Forge API. Also allows custom/free-text entry.",
  parameters: paramsSchema,
  handler: async (params, forgeApiKey, options?: { parsed?: boolean }) => {
    try {
      const parsed = paramsZodObject.parse(params);
      const provider = parsed.provider;
      // Fetch all regions from Forge API
      const data = await callForgeApi<any>({
        endpoint: "/regions",
        method: HttpMethod.GET
      }, forgeApiKey);
      const providerRegions = data?.regions?.[provider] || [];
      if (options?.parsed) {
        return {
          messages: [
            {
              role: "assistant",
              content: { type: "text", text: "Select a region:" }
            }
          ],
          choices: providerRegions.map((r: any) => ({ name: r.name, value: r.id })),
          default: providerRegions[0]?.id
        };
      }
      return toMCPToolResult({ regions: providerRegions, allowCustom: true });
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 