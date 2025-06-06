import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";

const paramsSchema = {
  serverId: z.union([
    z.string(),
    z.number(),
    z.object({ value: z.union([z.string(), z.number()]) }).transform(obj => obj.value)
  ]).describe("The ID of the server to show the daemon for (string, number, or { value: string|number })"),
  daemonId: z.union([
    z.string(),
    z.number(),
    z.object({ value: z.union([z.string(), z.number()]) }).transform(obj => obj.value)
  ]).describe("The ID of the daemon to show (string, number, or { value: string|number })"),
};

const paramsZodObject = z.object(paramsSchema);

export const showDaemonTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "show_daemon",
  description: "Show details for a specific daemon on a server in your Laravel Forge account.",
  parameters: paramsSchema,
  handler: async (params, forgeApiKey) => {
    const parsed = paramsZodObject.parse(params);
    const serverId = parsed.serverId;
    const daemonId = parsed.daemonId;
    if (!serverId || !daemonId) {
      return toMCPToolError(new Error("Missing required parameter: serverId or daemonId"));
    }
    try {
      const data = await callForgeApi<object>({
        endpoint: `/servers/${String(serverId)}/daemons/${String(daemonId)}`,
        method: HttpMethod.GET
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 