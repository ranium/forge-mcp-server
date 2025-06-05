import { MCPToolResult } from "../core/types/protocols.js";

export function toMCPToolResult(data: unknown): MCPToolResult {
  return {
    content: [
      { type: "text", text: JSON.stringify(data, null, 2) }
    ]
  };
}

export function toMCPToolError(error: unknown): MCPToolResult {
  return {
    content: [
      { type: "text", text: error instanceof Error ? error.message : String(error) }
    ],
    isError: true
  };
} 