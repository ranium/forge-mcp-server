import { ForgeToolDefinition, HttpMethod } from "../../core/types/protocols.js";
import { callForgeApi } from "../../utils/forgeApi.js";
import { toMCPToolResult, toMCPToolError } from "../../utils/mcpToolResult.js";
import { z } from "zod";

const params = {};

export const getUserTool: ForgeToolDefinition<typeof params> = {
  name: "get_user",
  description: "Get the current Forge user.",
  parameters: params,
  handler: async (_params, forgeApiKey) => {
    try {
      const data = await callForgeApi<object>({
        endpoint: "/user",
        method: HttpMethod.GET
      }, forgeApiKey);
      return toMCPToolResult(data);
    } catch (err) {
      return toMCPToolError(err);
    }
  }
}; 