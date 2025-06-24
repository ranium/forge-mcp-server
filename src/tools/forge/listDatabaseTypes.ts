import { ForgeToolDefinition } from "../../core/types/protocols.js";
import { toMCPToolResult } from "../../utils/mcpToolResult.js";

const databaseTypes = [
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

const paramsSchema = {};

export const listDatabaseTypesTool: ForgeToolDefinition<typeof paramsSchema> = {
  name: "list_database_types",
  description: "List valid database types for new server creation (static, as per Forge documentation).",
  parameters: paramsSchema,
  handler: async (_params, _forgeApiKey) => {
    return toMCPToolResult({ databaseTypes });
  }
}; 