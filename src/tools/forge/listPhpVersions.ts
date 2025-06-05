import { ForgeToolDefinition, HttpMethod, MCPToolResult } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { z } from "zod";

const paramsSchema = {
  serverId: z.union([
    z.string(),
    z.number(),
    z.object({ value: z.union([z.string(), z.number()]) }).transform(obj => obj.value)
  ]).describe("The ID of the server to list PHP versions for (string, number, or { value: string|number })"),
};

const paramsZodObject = z.object(paramsSchema);

export const listPhpVersionsTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "list_php_versions",
  description: "List all available PHP versions for a specific server in Laravel Forge.",
  parameters: paramsSchema,
  handler: async (params, forgeApiKey): Promise<MCPToolResult> => {
    const parsed = paramsZodObject.parse(params);
    const serverId = parsed.serverId;
    if (!serverId) {
      return {
        content: [
          { type: "text", text: `Missing required parameter: serverId. Params received: ${JSON.stringify(params)}` }
        ]
      };
    }
    // Debugging output
    const debugInfo = `DEBUG: Received serverId: ${JSON.stringify(serverId)} (type: ${typeof serverId}), All params: ${JSON.stringify(params)}`;
    try {
      const data = await callForgeApi({
        endpoint: `/servers/${String(serverId)}/php`,
        method: HttpMethod.GET
      }, forgeApiKey);
      return {
        content: [
          { type: "text", text: debugInfo },
          { type: "text", text: JSON.stringify(data) }
        ]
      };
    } catch (err) {
      return {
        content: [
          { type: "text", text: err instanceof Error ? err.message : String(err) }
        ]
      };
    }
  }
}; 