import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";

const paramsSchema = {
  serverId: z.union([
    z.string(),
    z.number(),
    z.object({ value: z.union([z.string(), z.number()]) }).transform(obj => obj.value)
  ]).describe("The ID of the server to get the deployment for (string, number, or { value: string|number })"),
  siteId: z.union([
    z.string(),
    z.number(),
    z.object({ value: z.union([z.string(), z.number()]) }).transform(obj => obj.value)
  ]).describe("The ID of the site to get the deployment for (string, number, or { value: string|number })"),
  deploymentId: z.union([
    z.string(),
    z.number(),
    z.object({ value: z.union([z.string(), z.number()]) }).transform(obj => obj.value)
  ]).describe("The ID of the deployment to get (string, number, or { value: string|number })"),
};

const paramsZodObject = z.object(paramsSchema);

export const getDeploymentTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "get_deployment",
  description: "Get details for a specific deployment on a site in your Laravel Forge account.",
  parameters: paramsSchema,
  handler: async (params, forgeApiKey) => {
    const parsed = paramsZodObject.parse(params);
    const serverId = parsed.serverId;
    const siteId = parsed.siteId;
    const deploymentId = parsed.deploymentId;
    if (!serverId || !siteId || !deploymentId) {
      return toMCPToolError(new Error("Missing required parameter: serverId, siteId, or deploymentId"));
    }
    try {
      const data = await callForgeApi<object>({
        endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}/deployment-history/${String(deploymentId)}`,
        method: HttpMethod.GET
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 