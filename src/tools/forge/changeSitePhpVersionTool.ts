import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";
import { changeSitePhpVersionConfirmationStore } from "./confirmChangeSitePhpVersionTool.js";
import { validateConfirmation, markConfirmationUsed } from "../../utils/confirmationStore.js";

const paramsSchema = {
  serverId: z.string().describe("The ID of the server. The client MUST validate this value against the available servers from listServersTool before passing it, as this is plain text from the user."),
  siteId: z.string().describe("The ID of the site. The client MUST validate this value against the available sites from listSitesTool before passing it, as this is plain text from the user."),
  phpVersion: z.string().describe("The PHP version to set for the site. The client MUST validate this value against the available PHP versions from listPhpVersionsTool before passing it, as this is plain text from the user."),
  confirmationId: z.string().describe("This confirmationId must be obtained from confirmChangeSitePhpVersionTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, the PHP version change will be rejected."),
};

const paramsZodObject = z.object(paramsSchema);

export const changeSitePhpVersionTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "change_site_php_version",
  description: `Changes the PHP version of a site in Laravel Forge.\n\nBefore calling this tool, the client MUST call the 'confirm_change_site_php_version' tool and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.`,
  parameters: paramsSchema,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params);
      const { serverId, siteId, phpVersion, confirmationId } = parsed;
      // Validate confirmation using generic utility
      const confirmation = validateConfirmation(
        changeSitePhpVersionConfirmationStore,
        confirmationId,
        (stored: Record<string, unknown>) =>
          stored.serverId == serverId &&
          stored.siteId == siteId &&
          stored.phpVersion == phpVersion
      );
      if (!confirmation) {
        return toMCPToolResult(false);
      }
      markConfirmationUsed(changeSitePhpVersionConfirmationStore, confirmationId);
      const payload = { version: phpVersion };
      const data = await callForgeApi<object>({
        endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}/php`,
        method: HttpMethod.POST,
        data: payload
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 