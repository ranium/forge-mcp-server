import { ForgeToolDefinition } from "../../core/types/protocols.js";
import { toMCPToolResult } from "../../utils/mcpToolResult.js";

const providers = [
  { id: "ocean2", name: "Digital Ocean" },
  { id: "akamai", name: "Linode (Akamai)" },
  { id: "vultr2", name: "Vultr" },
  { id: "aws", name: "AWS" },
  { id: "hetzner", name: "Hetzner" },
  { id: "custom", name: "Custom" }
];

export const listProvidersTool: ForgeToolDefinition<{}> = {
  name: "list_providers",
  description: "List all available server providers for Laravel Forge.",
  parameters: {},
  handler: async (_params, _forgeApiKey, options?: { parsed?: boolean }) => {
    if (options?.parsed) {
      return {
        messages: [
          {
            role: "assistant",
            content: { type: "text", text: "Select a provider:" }
          }
        ],
        choices: providers.map((p) => ({ name: p.name, value: p.id })),
        default: providers[0]?.id
      };
    }
    return toMCPToolResult({ providers });
  }
};

