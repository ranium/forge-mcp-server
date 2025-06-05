import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { z } from "zod";

export const listServersTool: ForgeToolDefinition = {
  name: "list_servers",
  description: "List all servers in your Laravel Forge account.",
  parameters: {}, // No parameters needed, use Zod raw shape
  handler: async (_params: Record<string, unknown>, forgeApiKey: string) => {
    try {
      const data = await callForgeApi({
        endpoint: "/servers",
        method: HttpMethod.GET
      }, forgeApiKey);
      return {
        content: [
          { type: "text", text: JSON.stringify(data) }
        ]
      };
    } catch (err) {
      return {
        content: [
          { type: "text", text: err instanceof Error ? err.message : String(err) }
        ]
      };
    }
  }
}; 