import { ForgeToolDefinition } from "../../core/types/protocols.js";
import { toMCPToolResult } from "../../utils/mcpToolResult.js";
import { z } from "zod";
import { randomUUID } from "crypto";

const paramsSchema = {
  serverId: z.union([z.string(), z.number()]).describe("The ID of the server to delete (string or number)."),
  serverName: z.string().describe("The name of the server to delete."),
};

export const deletionConfirmationStore = new Map();

export const confirmServerDeletionTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "confirm_server_deletion",
  description: `Confirms the server deletion request and returns a summary for user confirmation. This tool does not delete the server, but returns a summary and expects the client to handle the confirmation logic.`,
  parameters: paramsSchema,
  handler: async (params) => {
    const confirmationId = randomUUID();
    deletionConfirmationStore.set(confirmationId, { ...params, confirmationId, used: false, createdAt: Date.now() });
    const summary =
      `Please confirm deletion of server:\n` +
      `Server ID: ${params.serverId}\n` +
      `Server Name: ${params.serverName}\n` +
      `\nType \"yes\" to confirm or \"no\" to cancel.`;
    return toMCPToolResult({ summary, confirmationId });
  }
}; 