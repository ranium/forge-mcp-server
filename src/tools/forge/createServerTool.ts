import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";
import { confirmationStore } from "./confirmServerCreationTool.js";

const paramsSchema = {
  provider: z.string().describe('The cloud provider to use (e.g., akamai, ocean2, aws, hetzner, vultr2, custom).'),
  credentialId: z.string().describe('The ID of the credential to use for the selected provider.'),
  region: z.string().describe('The region ID where the server will be created (e.g., ap-southeast for Sydney, AU).'),
  size: z.string().describe('The size ID for the server (RAM, CPU, SSD, etc.).'),
  ubuntuVersion: z.string().describe('The Ubuntu version to use (e.g., 22.04).'),
  databaseType: z.string().describe('The database type to install (e.g., mysql8, postgres15, mariadb106, etc.).'),
  phpVersion: z.string().describe('The PHP version to install (e.g., 8.3, 8.2, 8.1, 8.0, 7.4).'),
  serverName: z.string().describe('A name for the new server.'),
  confirmationId: z.string().describe('This confirmationId must be obtained from confirmServerCreationTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, server creation will be rejected.'),
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

Before calling this tool, the client MUST call the 'confirm_server_creation' tool with the same parameters and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.

The client should sequentially prompt the user for each parameter using the above prompts, then call 'confirm_server_creation', and finally call this tool with the collected values only after confirmation.`,
  parameters: paramsSchema,
  handler: async (params, forgeApiKey) => {
    try {
      const { confirmationId, ...rest } = params;
      const confirmation = confirmationStore.get(confirmationId);
      if (!confirmation || confirmation.used) {
        return toMCPToolResult(false);
      }
      // Check if all params match
      for (const key of Object.keys(rest)) {
        if (confirmation[key] !== rest[key]) {
          return toMCPToolResult(false);
        }
      }
      // Optionally: check expiry (e.g., 10 min)
      const now = Date.now();
      if (now - confirmation.createdAt > 10 * 60 * 1000) {
        confirmationStore.delete(confirmationId);
        return toMCPToolResult(false);
      }
      confirmation.used = true;
      confirmationStore.set(confirmationId, confirmation);
      // Real API call
      const payload = {
        provider: rest.provider,
        credential_id: rest.credentialId,
        region: rest.region,
        size: rest.size,
        php_version: rest.phpVersion,
        database_type: rest.databaseType,
        name: rest.serverName,
        ubuntu_version: rest.ubuntuVersion
      };
      const data = await callForgeApi<object>({
        endpoint: "/servers",
        method: HttpMethod.POST,
        data: payload
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 