import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";

const paramsSchema = {
  serverId: z.union([
    z.string(),
    z.number(),
    z.object({ value: z.union([z.string(), z.number()]) }).transform(obj => obj.value)
  ]).describe("The ID of the server to check Inertia daemon status for (string, number, or { value: string|number })"),
  siteId: z.union([
    z.string(),
    z.number(),
    z.object({ value: z.union([z.string(), z.number()]) }).transform(obj => obj.value)
  ]).describe("The ID of the site to check Inertia daemon status for (string, number, or { value: string|number })"),
};

const paramsZodObject = z.object(paramsSchema);

export const checkInertiaDaemonStatusTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "check_inertia_daemon_status",
  description: "Check if an Inertia daemon is enabled for a specific site in your Laravel Forge account.",
  parameters: paramsSchema,
  handler: async (params, forgeApiKey) => {
    const parsed = paramsZodObject.parse(params);
    const serverId = parsed.serverId;
    const siteId = parsed.siteId;
    if (!serverId || !siteId) {
      return toMCPToolError(new Error("Missing required parameter: serverId or siteId"));
    }
    try {
      const data = await callForgeApi<object>({
        endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}/integrations/inertia`,
        method: HttpMethod.GET
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 