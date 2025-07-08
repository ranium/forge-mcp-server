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

export interface ForgeToolDefinition<TParams extends ZodRawShape> {
  name: string
  parameters: TParams
  category: ToolCategory
  annotations?: ToolAnnotations
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
