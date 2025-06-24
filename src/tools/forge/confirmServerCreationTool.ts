import { ForgeToolDefinition } from "../../core/types/protocols.js";
import { toMCPToolResult } from "../../utils/mcpToolResult.js";
import { z } from "zod";
import {
  createConfirmationStore,
  createConfirmation
} from "../../utils/confirmationStore.js";

const paramsSchema = {
  provider: z.string().describe('The cloud provider to use (e.g., akamai, ocean2, aws, hetzner, vultr2, custom).'),
  credentialId: z.string().describe('The ID of the credential to use for the selected provider.'),
  region: z.string().describe('The region ID where the server will be created (e.g., ap-southeast for Sydney, AU).'),
  size: z.string().describe('The size ID for the server (RAM, CPU, SSD, etc.).'),
  ubuntuVersion: z.string().describe('The Ubuntu version to use (e.g., 22.04).'),
  databaseType: z.string().describe('The database type to install (e.g., mysql8, postgres15, mariadb106, etc.).'),
  phpVersion: z.string().describe('The PHP version to install (e.g., 8.3, 8.2, 8.1, 8.0, 7.4).'),
  serverName: z.string().describe('A name for the new server.'),
  confirmationId: z.string().optional().describe('A unique confirmation ID for this server creation.'),
};

// Use the generic confirmation store
export const confirmationStore = createConfirmationStore<Omit<typeof paramsSchema, 'confirmationId'>>();

export const confirmServerCreationTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'confirm_server_creation',
  description: `Confirms the server creation parameters and returns a summary for user confirmation. This tool does not create the server, but returns a summary and expects the client to handle the confirmation logic.`,
  parameters: paramsSchema,
  handler: async (params) => {
    // Remove confirmationId from params for storage
    const { ...rest } = params;
    const entry = createConfirmation(confirmationStore, rest);
    const summary =
      `Please confirm the server creation with the following settings:\n` +
      `Provider: ${params.provider}\n` +
      `Credential: ${params.credentialId}\n` +
      `Region: ${params.region}\n` +
      `Size: ${params.size}\n` +
      `Ubuntu: ${params.ubuntuVersion}\n` +
      `Database: ${params.databaseType}\n` +
      `PHP: ${params.phpVersion}\n` +
      `Name: ${params.serverName}\n` +
      `Confirmation ID: ${entry.confirmationId}\n` +
      `\nType "yes" to confirm or "no" to cancel.`;
    return toMCPToolResult({ summary, confirmationId: entry.confirmationId });
  }
}; 