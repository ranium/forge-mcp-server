import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";
import { deleteDatabaseUserConfirmationStore } from "./confirmDeleteDatabaseUserTool.js";
import { validateConfirmation, markConfirmationUsed } from "../../utils/confirmationStore.js";

const paramsSchema = {
  serverId: z.union([z.string(), z.number()]).describe("The ID of the server (string or number). The client MUST validate this value against the available servers from listServersTool before passing it."),
  userId: z.union([z.string(), z.number()]).describe("The ID of the database user (string or number). The client MUST validate this value against the available users from listDatabaseUsersTool before passing it."),
  serverName: z.string().describe("The name of the server. The client MUST validate this value against the available servers from listServersTool before passing it."),
  userName: z.string().describe("The name of the database user. The client MUST validate this value against the available users from listDatabaseUsersTool before passing it."),
  confirmationId: z.string().describe("This confirmationId must be obtained from confirmDeleteDatabaseUserTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, the operation will be rejected."),
};

const paramsZodObject = z.object(paramsSchema);

export const deleteDatabaseUserTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "delete_database_user",
  description: `Deletes a database user from a server in Laravel Forge.\n\nBefore calling this tool, the client MUST call the 'confirm_delete_database_user' tool and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.`,
  parameters: paramsSchema,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params);
      const { serverId, userId, serverName, userName, confirmationId } = parsed;
      // Validate confirmation using generic utility
      const confirmation = validateConfirmation(
        deleteDatabaseUserConfirmationStore,
        confirmationId,
        (stored: Record<string, any>) =>
          stored.serverId == serverId &&
          stored.userId == userId &&
          stored.serverName === serverName &&
          stored.userName === userName
      );
      if (!confirmation) {
        return toMCPToolResult(false);
      }
      markConfirmationUsed(deleteDatabaseUserConfirmationStore, confirmationId);
      // Real API call
      const data = await callForgeApi<object>({
        endpoint: `/servers/${String(serverId)}/database-users/${String(userId)}`,
        method: HttpMethod.DELETE
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 