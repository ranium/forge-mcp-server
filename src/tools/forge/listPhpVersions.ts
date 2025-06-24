import { ForgeToolDefinition, HttpMethod, MCPToolResult } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";

const paramsSchema = {
  serverId: z.string().describe("The ID of the server to list PHP versions for."),
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

// Static PHP versions list for server creation (update as per Forge documentation)
const staticPhpVersions = [
  { id: "php84", name: "PHP 8.4", default: true },
  { id: "php83", name: "PHP 8.3", default: false },
  { id: "php82", name: "PHP 8.2", default: false },
  { id: "php81", name: "PHP 8.1", default: false },
  { id: "php80", name: "PHP 8.0", default: false },
  { id: "php74", name: "PHP 7.4", default: false },
  { id: "php73", name: "PHP 7.3", default: false },
  { id: "php72", name: "PHP 7.2", default: false },
  { id: "php70", name: "PHP 7.0", default: false },
  { id: "php56", name: "PHP 5.6", default: false }
];

const staticParamsSchema = {};

export const listStaticPhpVersionsTool: ForgeToolDefinition<typeof staticParamsSchema> = {
  name: "list_static_php_versions",
  description: "List supported PHP versions for new server creation (static, as per Forge documentation). Also allows custom/free-text entry.",
  parameters: staticParamsSchema,
  handler: async (_params, _forgeApiKey) => {
    return toMCPToolResult({ phpVersions: staticPhpVersions });
  }
};