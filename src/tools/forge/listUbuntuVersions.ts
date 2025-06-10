import { ForgeToolDefinition } from "../../core/types/protocols.js";
import { toMCPToolResult } from "../../utils/mcpToolResult.js";

const ubuntuVersions = [
  { id: "24.04", name: "Ubuntu 24.04 LTS (default)" },
  { id: "22.04", name: "Ubuntu 22.04 LTS" },
  { id: "20.04", name: "Ubuntu 20.04 LTS" },
];

export const listUbuntuVersionsTool: ForgeToolDefinition<{}> = {
  name: "list_ubuntu_versions",
  description: "List supported Ubuntu versions for new server creation (static, as per Forge documentation). 24.04 is the default if not specified.",
  parameters: {},
  handler: async (_params, _forgeApiKey, options?: { parsed?: boolean }) => {
    if (options?.parsed) {
      return {
        messages: [
          {
            role: "assistant",
            content: { type: "text", text: "Select Ubuntu version:" }
          }
        ],
        choices: ubuntuVersions.map((v) => ({ name: v.name, value: v.id })),
        default: "24.04"
      };
    }
    return toMCPToolResult({ ubuntuVersions, default: "24.04" });
  }
}; 