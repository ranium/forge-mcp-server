import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";

const paramsSchema = {
  serverId: z.string().describe("The ID of the server to check Pulse daemon status for."),
  siteId: z.string().describe("The ID of the site to check Pulse daemon status for."),
};

const paramsZodObject = z.object(paramsSchema);

export const checkPulseDaemonStatusTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "check_pulse_daemon_status",
  description: "Check if a Pulse daemon is enabled for a specific site in your Laravel Forge account.",
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
        endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}/integrations/pulse`,
        method: HttpMethod.GET
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 