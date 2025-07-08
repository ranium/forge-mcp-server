import { ForgeToolDefinition, HttpMethod, ToolCategory } from '../../core/types/protocols.js'
import { callForgeApi } from '../../utils/forgeApi.js'
import { toMCPToolResult, toMCPToolError } from '../../utils/mcpToolResult.js'
import { z } from 'zod'
import { confirmationStore } from './confirmServerCreationTool.js'
import {
  validateConfirmation,
  markConfirmationUsed,
} from '../../utils/confirmationStore.js'

const paramsSchema = {
  provider: z
    .string()
    .describe(
      'The cloud provider to use (e.g., akamai, ocean2, aws, hetzner, vultr2, custom).'
    ),
  credentialId: z
    .string()
    .describe('The ID of the credential to use for the selected provider.'),
  region: z
    .string()
    .describe(
      'The region ID where the server will be created (e.g., ap-southeast for Sydney, AU).'
    ),
  size: z
    .string()
    .describe('The size ID for the server (RAM, CPU, SSD, etc.).'),
  ubuntuVersion: z
    .string()
    .describe('The Ubuntu version to use (e.g., 22.04).'),
  databaseType: z
    .string()
    .describe(
      'The database type to install (e.g., mysql8, postgres15, mariadb106, etc.).'
    ),
  phpVersion: z
    .string()
    .describe('The PHP version to install (e.g., 8.3, 8.2, 8.1, 8.0, 7.4).'),
  serverName: z.string().describe('A name for the new server.'),
  confirmationId: z
    .string()
    .describe(
      'This confirmationId must be obtained from confirmServerCreationTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, server creation will be rejected.'
    ),
}

const paramsZodObject = z.object(paramsSchema)

export const createServerTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: 'create_server',
  parameters: paramsSchema,
  category: ToolCategory.Write,
  annotations: {
    title: 'Create Server',
    description: `Creates a new server in Laravel Forge.

All parameters are required and must be provided by the client. The client should use the following tools to collect the necessary parameters:
- list_providers
- list_credentials
- list_regions
- list_sizes
- list_ubuntu_versions
- list_database_types
- list_static_php_versions (returns valid php_version IDs: php84, php83, php82, php81, php80, php74, php73, php72, php70, php56)
- confirm_server_creation (for confirmation)

The php_version parameter must be one of the valid Forge API IDs as provided by the list_static_php_versions tool, not a raw version string.

Before calling this tool, the client MUST call the 'confirm_server_creation' tool with the same parameters and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.

The client should collect all required parameters using the above tools, call 'confirm_server_creation', and finally call this tool with the collected values and confirmationId only after confirmation.`,
    operation: 'create',
    resource: 'server',
    readonly: false,
    safe: false
  },
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params)
      const { confirmationId, ...rest } = parsed
      // Validate confirmation using generic utility
      const confirmation = validateConfirmation(
        confirmationStore,
        confirmationId,
        (stored: Record<string, unknown>) => {
          const restObj = rest as Record<string, unknown>
          // All params except confirmationId must match
          return Object.keys(restObj).every(key => stored[key] === restObj[key])
        }
      )
      if (!confirmation) {
        return toMCPToolResult(false)
      }
      markConfirmationUsed(confirmationStore, confirmationId)
      // Real API call
      const payload = {
        provider: rest.provider,
        credential_id: rest.credentialId,
        region: rest.region,
        size: rest.size,
        php_version: rest.phpVersion,
        database_type: rest.databaseType,
        name: rest.serverName,
        ubuntu_version: rest.ubuntuVersion,
      }
      const data = await callForgeApi<object>(
        {
          endpoint: '/servers',
          method: HttpMethod.POST,
          data: payload,
        },
        forgeApiKey
      )
      return toMCPToolResult(data)
    } catch (err) {
      return toMCPToolError(err)
    }
  },
}
