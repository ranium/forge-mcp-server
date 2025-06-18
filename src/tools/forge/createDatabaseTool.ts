import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";
import { createDatabaseConfirmationStore } from "./confirmCreateDatabaseTool.js";
import { validateConfirmation, markConfirmationUsed } from "../../utils/confirmationStore.js";

const paramsSchema = {
  serverId: z.string().describe("The ID of the server. The client MUST validate this value against the available servers from listServersTool before passing it."),
  serverName: z.string().describe("The name of the server. The client MUST validate this value against the available servers from listServersTool before passing it."),
  name: z.string().describe("The name of the database to create. The client MUST validate this is a valid database name."),
  user: z.string().optional().describe("The name of the database user to create (optional). The client MUST validate this is a valid username if provided."),
  password: z.string().optional().describe("The password for the database user (required if user is provided). The client MUST validate this is a valid password if provided."),
  confirmationId: z.string().describe("This confirmationId must be obtained from confirmCreateDatabaseTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, the operation will be rejected."),
};

const paramsZodObject = z.object(paramsSchema);

export const createDatabaseTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "create_database",
  description: `Creates a new database on a server in Laravel Forge.\n\nBefore calling this tool, the client MUST call the 'confirm_create_database' tool and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.\n\nIf 'user' is provided, 'password' is required.`,
  parameters: paramsSchema,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params);
      const { serverId, serverName, name, user, password, confirmationId } = parsed;
      // Validate confirmation using generic utility
      const confirmation = validateConfirmation(
        createDatabaseConfirmationStore,
        confirmationId,
        (stored: Record<string, any>) =>
          stored.serverId == serverId &&
          stored.serverName === serverName &&
          stored.name === name &&
          stored.user === user
      );
      if (!confirmation) {
        return toMCPToolResult(false);
      }
      markConfirmationUsed(createDatabaseConfirmationStore, confirmationId);
      // Prepare payload for Forge API
      const payload: Record<string, any> = { name };
      if (user) {
        if (!password) {
          return toMCPToolError(new Error("Password is required when user is provided."));
        }
        payload.user = user;
        payload.password = password;
      }
      const data = await callForgeApi<object>({
        endpoint: `/servers/${String(serverId)}/databases`,
        method: HttpMethod.POST,
        data: payload
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 