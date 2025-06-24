import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";
import { siteCreationConfirmationStore } from "./confirmSiteCreationTool.js";
import { validateConfirmation, markConfirmationUsed } from "../../utils/confirmationStore.js";

const paramsSchema = {
  serverId: z.string().describe("The ID of the server to create the site on."),
  domain: z.string().describe("The domain name for the new site."),
  projectType: z.string().describe("The project type (e.g., 'php', 'html')."),
  directory: z.string().optional().describe("The directory for the site (optional)."),
  isolated: z.boolean().optional().describe("Whether the site should be isolated (optional)."),
  wildcardSubdomains: z.boolean().optional().describe("Whether to enable wildcard subdomains (optional)."),
  phpVersion: z.string().optional().describe("The PHP version for the site (optional)."),
  database: z.string().optional().describe("The database name for the site (optional)."),
  repository: z.string().optional().describe("The repository URL for the site (optional)."),
  branch: z.string().optional().describe("The branch to deploy (optional)."),
  composer: z.boolean().optional().describe("Whether to install Composer dependencies (optional)."),
  installDependencies: z.boolean().optional().describe("Whether to install project dependencies (optional)."),
  enableQuickDeploy: z.boolean().optional().describe("Whether to enable quick deploy (optional)."),
  enableAutoDeploy: z.boolean().optional().describe("Whether to enable auto deploy (optional)."),
  provider: z.string().optional().describe("The provider for the site (optional)."),
  network: z.array(z.string()).optional().describe("Network server IDs (optional)."),
  environment: z.string().optional().describe("Environment variables (optional)."),
  recipeId: z.string().optional().describe("Recipe ID to run after provisioning (optional)."),
  confirmationId: z.string().describe("This confirmationId must be obtained from confirmSiteCreationTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, site creation will be rejected."),
};

const paramsZodObject = z.object(paramsSchema);

export const createSiteTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "create_site",
  description: `Creates a new site in Laravel Forge.\n\nBefore calling this tool, the client MUST call the 'confirm_site_creation' tool and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.`,
  parameters: paramsSchema,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params);
      const { confirmationId, serverId, ...rest } = parsed;
      // Validate confirmation using generic utility
      const confirmation = validateConfirmation(
        siteCreationConfirmationStore,
        confirmationId,
        (stored: Record<string, unknown>) => {
          const restObj = rest as Record<string, unknown>;
          return Object.keys(restObj).every(
            (key) => stored[key] === restObj[key]
          );
        }
      );
      if (!confirmation) {
        return toMCPToolResult(false);
      }
      markConfirmationUsed(siteCreationConfirmationStore, confirmationId);
      // Prepare payload for Forge API
      const payload: Record<string, unknown> = {
        domain: rest.domain,
        project_type: rest.projectType,
      };
      if (rest.directory) payload.directory = rest.directory;
      if (rest.isolated !== undefined) payload.isolated = rest.isolated;
      if (rest.wildcardSubdomains !== undefined) payload.wildcard_subdomains = rest.wildcardSubdomains;
      if (rest.phpVersion) payload.php_version = rest.phpVersion;
      if (rest.database) payload.database = rest.database;
      if (rest.repository) payload.repository = rest.repository;
      if (rest.branch) payload.branch = rest.branch;
      if (rest.composer !== undefined) payload.composer = rest.composer;
      if (rest.installDependencies !== undefined) payload.install_dependencies = rest.installDependencies;
      if (rest.enableQuickDeploy !== undefined) payload.quick_deploy = rest.enableQuickDeploy;
      if (rest.enableAutoDeploy !== undefined) payload.auto_deploy = rest.enableAutoDeploy;
      if (rest.provider) payload.provider = rest.provider;
      if (rest.network) payload.network = rest.network;
      if (rest.environment) payload.environment = rest.environment;
      if (rest.recipeId) payload.recipe_id = rest.recipeId;
      const data = await callForgeApi<object>({
        endpoint: `/servers/${String(serverId)}/sites`,
        method: HttpMethod.POST,
        data: payload
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 