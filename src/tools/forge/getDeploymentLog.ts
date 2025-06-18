import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";

const paramsSchema = {
  serverId: z.string().describe("The ID of the server to get the deployment log for."),
  siteId: z.string().describe("The ID of the site to get the deployment log for."),
};

const paramsZodObject = z.object(paramsSchema);

export const getDeploymentLogTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "get_deployment_log",
  description: "Retrieve the deployment log for the most recent deployment of a site in your Laravel Forge account.",
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
        endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}/deployment-log`,
        method: HttpMethod.GET
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 