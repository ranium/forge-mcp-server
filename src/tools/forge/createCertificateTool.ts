import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";
import { certificateCreationConfirmationStore } from "./confirmCertificateCreationTool.js";
import { validateConfirmation, markConfirmationUsed } from "../../utils/confirmationStore.js";

const paramsSchema = {
  serverId: z.union([z.string(), z.number()]).describe("The ID of the server to create the certificate on (string or number)."),
  siteId: z.union([z.string(), z.number()]).describe("The ID of the site to create the certificate for (string or number)."),
  type: z.string().describe("The type of certificate to create (e.g., 'new', 'letsencrypt', 'custom')."),
  domain: z.string().describe("The domain for the certificate."),
  country: z.string().describe("The country code for the certificate."),
  state: z.string().describe("The state for the certificate."),
  city: z.string().describe("The city for the certificate."),
  organization: z.string().describe("The organization for the certificate."),
  department: z.string().describe("The department for the certificate."),
  confirmationId: z.string().describe("This confirmationId must be obtained from confirmCertificateCreationTool after explicit user confirmation. If an invalid or mismatched confirmationId is provided, certificate creation will be rejected."),
};

const paramsZodObject = z.object(paramsSchema);

export const createCertificateTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "create_certificate",
  description: `Creates a new certificate in Laravel Forge.\n\nBefore calling this tool, the client MUST call the 'confirm_certificate_creation' tool and present the returned summary to the user for explicit confirmation. Only if the user confirms, the client should proceed to call this tool.`,
  parameters: paramsSchema,
  handler: async (params, forgeApiKey) => {
    try {
      const parsed = paramsZodObject.parse(params);
      const { confirmationId, serverId, siteId, ...rest } = parsed;
      // Validate confirmation using generic utility
      const confirmation = validateConfirmation(
        certificateCreationConfirmationStore,
        confirmationId,
        (stored: Record<string, any>) => {
          const restObj = rest as Record<string, any>;
          return Object.keys(restObj).every(
            (key) => stored[key] === restObj[key]
          );
        }
      );
      if (!confirmation) {
        return toMCPToolResult(false);
      }
      markConfirmationUsed(certificateCreationConfirmationStore, confirmationId);
      // Prepare payload for Forge API
      const payload: Record<string, any> = {
        type: rest.type,
        domain: rest.domain,
        country: rest.country,
        state: rest.state,
        city: rest.city,
        organization: rest.organization,
        department: rest.department,
      };
      const data = await callForgeApi<object>({
        endpoint: `/servers/${String(serverId)}/sites/${String(siteId)}/certificates`,
        method: HttpMethod.POST,
        data: payload
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 