import { ForgeToolDefinition } from "../../core/types/protocols.js";
import { toMCPToolResult } from "../../utils/mcpToolResult.js";
import { z } from "zod";
import { createConfirmationStore, createConfirmation } from "../../utils/confirmationStore.js";

const paramsSchema = {
  serverId: z.string().describe("The ID of the server to reboot."),
  serverName: z.string().describe("The name of the server to reboot."),
};

export const rebootConfirmationStore = createConfirmationStore<Omit<typeof paramsSchema, never>>();

export const confirmServerRebootTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "confirm_server_reboot",
  description: `Confirms the server reboot request and returns a summary for user confirmation. This tool does not reboot the server, but returns a summary and expects the client to handle the confirmation logic.`,
  parameters: paramsSchema,
  handler: async (params) => {
    const entry = createConfirmation(rebootConfirmationStore, params);
    const summary =
      `Please confirm reboot of server:\n` +
      `Server ID: ${params.serverId}\n` +
      `Server Name: ${params.serverName}\n` +
      `\nType \"yes\" to confirm or \"no\" to cancel.`;
    return toMCPToolResult({ summary, confirmationId: entry.confirmationId });
  }
}; 