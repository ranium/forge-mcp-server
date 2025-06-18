import { ForgeToolDefinition } from "../../core/types/protocols.js";
import { toMCPToolResult } from "../../utils/mcpToolResult.js";
import { z } from "zod";
import { createConfirmationStore, createConfirmation } from "../../utils/confirmationStore.js";

const paramsSchema = {
  serverId: z.string().describe("The ID of the server. The client MUST validate this value against the available servers from listServersTool before passing it."),
  serverName: z.string().describe("The name of the server. The client MUST validate this value against the available servers from listServersTool before passing it."),
  name: z.string().describe("The username to create. The client MUST validate this is a valid username."),
  password: z.string().describe("The password to assign the user. The client MUST validate this is a valid password."),
  databases: z.array(z.union([z.string(), z.number()])).describe("An array of database IDs the user should have access to. The client MUST validate these IDs using listDatabasesTool before passing them."),
};

export const createDatabaseUserConfirmationStore = createConfirmationStore<typeof paramsSchema>();

export const confirmCreateDatabaseUserTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "confirm_create_database_user",
  description: `Confirms the request to create a database user and returns a summary for user confirmation. This tool does not perform the operation, but returns a summary and expects the client to handle the confirmation logic.`,
  parameters: paramsSchema,
  handler: async (params) => {
    const entry = createConfirmation(createDatabaseUserConfirmationStore, params);
    const summary =
      `Are you sure you want to create a new database user?\n` +
      `Server: ${params.serverName} (ID: ${params.serverId})\n` +
      `Username: ${params.name}\n` +
      `Password: ${params.password}\n` +
      `Databases: ${Array.isArray(params.databases) ? params.databases.join(", ") : ""}\n` +
      `\nType \"yes\" to confirm or \"no\" to cancel.`;
    return toMCPToolResult({ summary, confirmationId: entry.confirmationId });
  }
}; 