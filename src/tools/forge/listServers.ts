import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { z } from "zod";

const params = {};

export const listServersTool: ForgeToolDefinition<typeof params> = {
  name: "list_servers",
  description: "List all servers in your Laravel Forge account.",
  parameters: params, // No parameters needed, use Zod raw shape
  handler: async (_params, forgeApiKey) => {
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