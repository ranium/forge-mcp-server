import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";

const paramsSchema = {
  provider: z.string().describe('The cloud provider to use (e.g., akamai, ocean2, aws, hetzner, vultr2, custom).'),
  credentialId: z.string().describe('The ID of the credential to use for the selected provider.'),
  region: z.string().describe('The region ID where the server will be created (e.g., ap-southeast for Sydney, AU).'),
  size: z.string().describe('The size ID for the server (RAM, CPU, SSD, etc.).'),
  ubuntuVersion: z.string().describe('The Ubuntu version to use (e.g., 22.04).'),
  databaseType: z.string().describe('The database type to install (e.g., mysql8, postgres15, mariadb106, etc.).'),
  phpVersion: z.string().describe('The PHP version to install (e.g., 8.3, 8.2, 8.1, 8.0, 7.4).'),
  serverName: z.string().describe('A name for the new server.'),
};

const paramsZodObject = z.object(paramsSchema);

export const createServerTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'create_server',
  description: `Creates a new server in Laravel Forge.

All parameters are required and must be collected via the corresponding prompts:
- provider: Use the 'providerPrompt'
- credential: Use the 'credentialPrompt'
- region: Use the 'regionPrompt'
- size: Use the 'sizePrompt'
- ubuntuVersion: Use the 'ubuntuVersionPrompt'
- databaseType: Use the 'databaseTypePrompt'
- phpVersion: Use the 'phpVersionPrompt'
- serverName: Use the 'serverNamePrompt'

Before calling this tool, the client should present a summary of the collected values using the 'confirmationPrompt' and require explicit user confirmation.

The client should sequentially prompt the user for each parameter using the above prompts, then call this tool with the collected values only after confirmation.`,
  parameters: paramsSchema,
  handler: async (params, forgeApiKey) => {
    try {
      // For testing: just echo the params
      return toMCPToolResult(`Server would be created with: ${JSON.stringify(params, null, 2)}`);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 