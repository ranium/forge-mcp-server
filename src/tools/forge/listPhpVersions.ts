import { ForgeToolDefinition, HttpMethod, MCPToolResult } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
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
      return toMCPToolError(new Error("Missing required parameter: serverId"));
    }
   
    try {
      const data = await callForgeApi<object>({
        endpoint: `/servers/${String(serverId)}/php`,
        method: HttpMethod.GET
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 