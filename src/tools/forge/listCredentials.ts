import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";

export const listCredentialsTool: ForgeToolDefinition<{}> = {
  name: "list_credentials",
  description: "List all credentials in your Laravel Forge account.",
  parameters: {},
  handler: async (_params, forgeApiKey, options?: { parsed?: boolean }) => {
    try {
      const data = await callForgeApi<object>({
        endpoint: "/credentials",
        method: HttpMethod.GET
      }, forgeApiKey);
      if (options?.parsed) {
        const creds = (data as any).credentials ?? [];
        return {
          messages: [
            {
              role: "assistant",
              content: { type: "text", text: "Select a credential:" }
            }
          ],
          choices: creds.map((c: any) => ({ name: c.name, value: String(c.id) })),
          default: creds[0] ? String(creds[0].id) : undefined
        };
      }
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 