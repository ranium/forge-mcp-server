import { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';
import { ZodRawShape } from 'zod'

export type MCPToolContent =
  | { type: 'text'; text: string }
  | { type: 'image'; data: string; mimeType: string }
  | { type: 'audio'; data: string; mimeType: string }

export interface MCPToolResult {
  content: MCPToolContent[]
  isError?: boolean
  [key: string]: unknown
}

export enum ToolCategory {
  Readonly = 'readonly',
  Write = 'write',
  Destructive = 'destructive',
}

// Custom annotation properties that we use across all tools
export interface CustomToolAnnotations {
  /** Human-readable title for the tool */
  title: string
  /** Detailed description of what the tool does */
  description: string
  /** Type of operation (list, get, show, create, delete, confirm, etc.) */
  operation: 'list' | 'get' | 'show' | 'create' | 'delete' | 'confirm' | 'check' | 'enable' | 'disable' | 'reboot' | 'clear' | 'remove' | 'sync' | 'deploy' | 'install' | 'update' | 'restart'
  /** Resource being operated on (servers, sites, databases, etc.) */
  resource: string
  /** Whether the tool is safe to use (false for destructive operations) */
  safe: boolean
  /** Whether the tool performs write operations (true for write, false for read-only) */
  readWriteHint: boolean
}

// Extended annotation type that combines MCP standard and our custom properties
export type ChildToolAnnotation = ToolAnnotations & CustomToolAnnotations

export interface ForgeToolDefinition<TParams extends ZodRawShape> {
  name: string
  parameters: TParams
  category: ToolCategory
  annotations: ChildToolAnnotation // Now required and type-safe
  handler: (
    params: Record<string, unknown>,
    forgeApiKey: string
  ) => Promise<MCPToolResult>
}

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export interface ForgeApiRequest {
  endpoint: string
  method: HttpMethod
  data?: unknown
  params?: unknown
}
