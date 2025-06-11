import { ForgeToolDefinition } from "../../core/types/protocols.js";
import { toMCPToolResult } from "../../utils/mcpToolResult.js";

const ubuntuVersions = [
  { id: "24.04", name: "Ubuntu 24.04 LTS (default)", default: true },
  { id: "22.04", name: "Ubuntu 22.04 LTS", default: false },
  { id: "20.04", name: "Ubuntu 20.04 LTS", default: false },
];

export const listUbuntuVersionsTool: ForgeToolDefinition<{}> = {
  name: "list_ubuntu_versions",
  description: "List supported Ubuntu versions for new server creation (static, as per Forge documentation). 24.04 is the default if not specified.",
  parameters: {},
  handler: async (_params, _forgeApiKey) => {
    return toMCPToolResult({ ubuntuVersions });
  }
}; 