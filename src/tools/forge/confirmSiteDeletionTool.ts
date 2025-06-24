import { ForgeToolDefinition } from "../../core/types/protocols.js";
import { toMCPToolResult } from "../../utils/mcpToolResult.js";
import { z } from "zod";
import { createConfirmationStore, createConfirmation } from "../../utils/confirmationStore.js";

const paramsSchema = {
  serverId: z.string().describe("The ID of the server. The client MUST validate this value against the available servers from listServersTool before passing it, as this is plain text from the user."),
  siteId: z.string().describe("The ID of the site. The client MUST validate this value against the available sites from listSitesTool before passing it, as this is plain text from the user."),
};

export const siteDeletionConfirmationStore = createConfirmationStore<Omit<typeof paramsSchema, never>>();

export const confirmSiteDeletionTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "confirm_site_deletion",
  description: `Confirms the site deletion parameters and returns a summary for user confirmation. This tool does not delete the site, but returns a summary and expects the client to handle the confirmation logic.`,
  parameters: paramsSchema,
  handler: async (params) => {
    const entry = createConfirmation(siteDeletionConfirmationStore, params);
    const summary =
      `Please confirm deletion of the following site:\n` +
      `Server ID: ${params.serverId}\n` +
      `Site ID: ${params.siteId}\n` +
      `Confirmation ID: ${entry.confirmationId}\n` +
      `\nType "yes" to confirm or "no" to cancel.`;
    return toMCPToolResult({ summary, confirmationId: entry.confirmationId });
  }
}; 