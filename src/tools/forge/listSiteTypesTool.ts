import { ForgeToolDefinition } from "../../core/types/protocols.js";
import { toMCPToolResult } from "../../utils/mcpToolResult.js";

const projectTypes = [
  { key: "php", description: "PHP / Laravel / Symfony", default: true },
  { key: "html", description: "Static HTML / Nuxt.js / Next.js", default: false },
];

export const listProjectTypesTool: ForgeToolDefinition<{}> = {
  name: "list_project_types",
  description: "Lists available project types for site creation in Laravel Forge. The 'php' type is the default.",
  parameters: {},
  handler: async () => {
    return toMCPToolResult(projectTypes);
  }
}; 