import { ForgeToolDefinition } from "../../core/types/protocols.js";
import { toMCPToolResult } from "../../utils/mcpToolResult.js";

const dataTypes = [
  { id: "mysql8", name: "MySQL 8" },
  { id: "mariadb106", name: "MariaDB 10.6" },
  { id: "mariadb1011", name: "MariaDB 10.11" },
  { id: "mariadb114", name: "MariaDB 11.4" },
  { id: "postgres", name: "PostgreSQL (latest)" },
  { id: "postgres13", name: "PostgreSQL 13" },
  { id: "postgres14", name: "PostgreSQL 14" },
  { id: "postgres15", name: "PostgreSQL 15" },
  { id: "postgres16", name: "PostgreSQL 16" },
  { id: "postgres17", name: "PostgreSQL 17" }
];

export const listDataTypesTool: ForgeToolDefinition<{}> = {
  name: "list_data_types",
  description: "List valid database types for new server creation (static, as per Forge documentation).",
  parameters: {},
  handler: async (_params, _forgeApiKey, options?: { parsed?: boolean }) => {
    if (options?.parsed) {
      return {
        messages: [
          {
            role: "assistant",
            content: { type: "text", text: "Select database type:" }
          }
        ],
        choices: dataTypes.map((d) => ({ name: d.name, value: d.id })),
        default: dataTypes[0]?.id
      };
    }
    return toMCPToolResult({ dataTypes });
  }
}; 