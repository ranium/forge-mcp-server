import { ForgeToolDefinition } from "../../core/types/protocols.js";
import { toMCPToolResult } from "../../utils/mcpToolResult.js";
import { z } from "zod";
import {
  createConfirmationStore,
  createConfirmation
} from "../../utils/confirmationStore.js";

const paramsSchema = {
  serverId: z.string().describe("The ID of the server to delete."),
  serverName: z.string().describe("The name of the server to delete."),
};

export const deletionConfirmationStore = createConfirmationStore<Omit<typeof paramsSchema, never>>();

export const confirmServerDeletionTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "confirm_server_deletion",
  description: `Confirms the server deletion request and returns a summary for user confirmation. This tool does not delete the server, but returns a summary and expects the client to handle the confirmation logic.`,
  parameters: paramsSchema,
  handler: async (params) => {
    const entry = createConfirmation(deletionConfirmationStore, params);
    const summary =
      `Please confirm deletion of server:\n` +
      `Server ID: ${params.serverId}\n` +
      `Server Name: ${params.serverName}\n` +
      `\nType \"yes\" to confirm or \"no\" to cancel.`;
    return toMCPToolResult({ summary, confirmationId: entry.confirmationId });
  }
}; 