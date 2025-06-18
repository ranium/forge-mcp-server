import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";

const paramsSchema = {
  serverId: z.string().describe("The ID of the server. The client MUST validate this value against the available servers from listServersTool before passing it."),
  databaseId: z.string().describe("The ID of the database. The client MUST validate this value against the available databases from listDatabasesTool before passing it."),
};

const paramsZodObject = z.object(paramsSchema);

export const getDatabaseTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "get_database",
  description: "Get details for a specific database on a server in your Laravel Forge account.",
  parameters: paramsSchema,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params);
      const { serverId, databaseId } = parsed;
      const data = await callForgeApi<object>({
        endpoint: `/servers/${String(serverId)}/databases/${String(databaseId)}`,
        method: HttpMethod.GET
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 