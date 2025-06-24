import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";
import { disableQuickDeploymentConfirmationStore } from "./confirmDisableQuickDeploymentTool.js";
import { validateConfirmation, markConfirmationUsed } from "../../utils/confirmationStore.js";

const paramsSchema = {
  serverId: z.string().describe("The ID of the server. The client MUST validate this value against the available servers from listServersTool before passing it."),
  siteId: z.string().describe("The ID of the site. The client MUST validate this value against the available sites from listSitesTool before passing it."),
  serverName: z.string().describe("The name of the server. The client MUST validate this value against the available servers from listServersTool before passing it."),
  siteName: z.string().describe("The name of the site. The client MUST validate this value against the available sites from listSitesTool before passing it."),
  confirmationId: z.string().describe("This confirmationId must be obtained from confirmDisableQuickDeploymentTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, the operation will be rejected."),
};

const paramsZodObject = z.object(paramsSchema);

export const disableQuickDeploymentTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "disable_quick_deployment",
  description: `Disables quick deployment for a site's Git project in Laravel Forge.\n\nBefore calling this tool, the client MUST call the 'confirm_disable_quick_deployment' tool and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.`,
  parameters: paramsSchema,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params);
      const { serverId, siteId, serverName, siteName, confirmationId } = parsed;
      // Validate confirmation using generic utility
      const confirmation = validateConfirmation(
        disableQuickDeploymentConfirmationStore,
        confirmationId,
        (stored: Record<string, unknown>) =>
          stored.serverId == serverId &&
          stored.siteId == siteId &&
          stored.serverName === serverName &&
          stored.siteName === siteName
      );
      if (!confirmation) {
        return toMCPToolResult(false);
      }
      markConfirmationUsed(disableQuickDeploymentConfirmationStore, confirmationId);
      // Real API call
      const data = await callForgeApi<object>({
        endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}/deployment`,
        method: HttpMethod.DELETE
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 