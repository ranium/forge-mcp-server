import { z, ZodRawShape, TypeOf } from "zod";

export type MCPToolContent =
  | { type: "text"; text: string }
  | { type: "image"; data: string; mimeType: string }
  | { type: "audio"; data: string; mimeType: string };

export interface MCPToolResult {
  content: MCPToolContent[];
  isError?: boolean;
  [key: string]: unknown;
}

export interface PromptChoice {
  name: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface MCPPromptResult {
  messages: { role: "assistant" | "user", content: MCPToolContent }[];
  choices?: PromptChoice[];
  default?: PromptChoice['value'];
  [key: string]: unknown;
}

export interface ForgeToolDefinition<TParams extends ZodRawShape> {
  name: string;
  description: string;
  parameters: TParams;
  handler: (
    params: Record<string, unknown>,
    forgeApiKey: string,
    options?: { parsed?: boolean }
  ) => Promise<MCPToolResult | MCPPromptResult>;
}

export enum HttpMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete"
}

export interface ForgeApiRequest {
  endpoint: string;
  method: HttpMethod;
  data?: any;
  params?: any;
} 