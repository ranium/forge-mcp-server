import { ForgeToolDefinition } from "../../core/types/protocols.js";
import { toMCPToolResult } from "../../utils/mcpToolResult.js";
import { z } from "zod";
import { createConfirmationStore, createConfirmation } from "../../utils/confirmationStore.js";

const paramsSchema = {
  serverId: z.string().describe("The ID of the server to create the certificate on. The client MUST validate this value against the available servers from listServersTool before passing it, as this is plain text from the user."),
  siteId: z.string().describe("The ID of the site to create the certificate for. The client MUST validate this value against the available sites from listSitesTool before passing it, as this is plain text from the user."),
  type: z.string().describe("The type of certificate to create (e.g., 'new', 'letsencrypt', 'custom'). The client MUST validate this value against the available certificate types from listCertificateTypesTool before passing it, as this is plain text from the user."),
  domain: z.string().describe("The domain for the certificate. The client MUST validate this is a valid domain name."),
  country: z.string().describe("The country code for the certificate. The client MUST validate this is a valid country code."),
  state: z.string().describe("The state for the certificate. The client MUST validate this is a valid state name."),
  city: z.string().describe("The city for the certificate. The client MUST validate this is a valid city name."),
  organization: z.string().describe("The organization for the certificate. The client MUST validate this is a valid organization name."),
  department: z.string().describe("The department for the certificate. The client MUST validate this is a valid department name."),
};

export const certificateCreationConfirmationStore = createConfirmationStore<Omit<typeof paramsSchema, never>>();

export const confirmCertificateCreationTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "confirm_certificate_creation",
  description: `Confirms the certificate creation parameters and returns a summary for user confirmation. This tool does not create the certificate, but returns a summary and expects the client to handle the confirmation logic.`,
  parameters: paramsSchema,
  handler: async (params) => {
    const entry = createConfirmation(certificateCreationConfirmationStore, params);
    const summary =
      `Please confirm the certificate creation with the following settings:\n` +
      `Server ID: ${params.serverId}\n` +
      `Site ID: ${params.siteId}\n` +
      `Type: ${params.type}\n` +
      `Domain: ${params.domain}\n` +
      `Country: ${params.country}\n` +
      `State: ${params.state}\n` +
      `City: ${params.city}\n` +
      `Organization: ${params.organization}\n` +
      `Department: ${params.department}\n` +
      `Confirmation ID: ${entry.confirmationId}\n` +
      `\nType \"yes\" to confirm or \"no\" to cancel.`;
    return toMCPToolResult({ summary, confirmationId: entry.confirmationId });
  }
}; 