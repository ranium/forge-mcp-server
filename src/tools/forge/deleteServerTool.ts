import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";
import { deletionConfirmationStore } from "./confirmServerDeletionTool.js";
import { validateConfirmation, markConfirmationUsed } from "../../utils/confirmationStore.js";

const paramsSchema = {
  serverId: z.string().describe("The ID of the server to delete."),
  confirmationId: z.string().describe("This confirmationId must be obtained from confirmServerDeletionTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, server deletion will be rejected."),
};

const paramsZodObject = z.object(paramsSchema);

export const deleteServerTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "delete_server",
  description: `Deletes a server in Laravel Forge.\n\nBefore calling this tool, the client MUST call the 'confirm_server_deletion' tool and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.`,
  parameters: paramsSchema,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params);
      const { serverId, confirmationId } = parsed;
      // Validate confirmation using generic utility
      const confirmation = validateConfirmation(
        deletionConfirmationStore,
        confirmationId,
        (stored: Record<string, any>) => String(stored.serverId) === String(serverId)
      );
      if (!confirmation) {
        return toMCPToolResult(false);
      }
      markConfirmationUsed(deletionConfirmationStore, confirmationId);
      // Real API call
      const data = await callForgeApi<object>({
        endpoint: `/servers/${String(serverId)}`,
        method: HttpMethod.DELETE
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 