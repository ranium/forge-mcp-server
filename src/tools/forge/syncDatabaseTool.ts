import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";

const paramsSchema = {
  serverId: z.union([z.string(), z.number()]).describe("The ID of the server (string or number). The client MUST validate this value against the available servers from listServersTool before passing it."),
  databaseId: z.union([z.string(), z.number()]).describe("The ID of the database (string or number). The client MUST validate this value against the available databases from showServerTool or similar before passing it."),
};

const paramsZodObject = z.object(paramsSchema);

export const syncDatabaseTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "sync_database",
  description: `Syncs the specified database on a server in Laravel Forge.`,
  parameters: paramsSchema,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params);
      const { serverId, databaseId } = parsed;
      const data = await callForgeApi<object>({
        endpoint: `/servers/${String(serverId)}/databases/${String(databaseId)}/sync`,
        method: HttpMethod.POST
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 