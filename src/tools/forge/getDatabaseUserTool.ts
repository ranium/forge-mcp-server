import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";

const paramsSchema = {
  serverId: z.union([z.string(), z.number()]).describe("The ID of the server (string or number). The client MUST validate this value against the available servers from listServersTool before passing it."),
  userId: z.union([z.string(), z.number()]).describe("The ID of the database user (string or number). The client MUST validate this value against the available users from listDatabaseUsersTool before passing it."),
};

const paramsZodObject = z.object(paramsSchema);

export const getDatabaseUserTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "get_database_user",
  description: "Get details for a specific database user on a server in your Laravel Forge account.",
  parameters: paramsSchema,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params);
      const { serverId, userId } = parsed;
      const data = await callForgeApi<object>({
        endpoint: `/servers/${String(serverId)}/database-users/${String(userId)}`,
        method: HttpMethod.GET
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 