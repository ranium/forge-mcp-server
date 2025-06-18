import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";

const paramsSchema = {
  serverId: z.string().describe("The ID of the server to reboot Postgres."),
};

const paramsZodObject = z.object(paramsSchema);

export const rebootPostgresTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "reboot_postgres",
  description: `Reboots (restarts) the Postgres service on a server in Laravel Forge.`,
  parameters: paramsSchema,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params);
      const { serverId } = parsed;
      const data = await callForgeApi<object>({
        endpoint: `/servers/${String(serverId)}/postgres/reboot`,
        method: HttpMethod.POST
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 