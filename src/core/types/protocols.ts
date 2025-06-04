import { z, ZodRawShape } from "zod";

export interface ForgeToolDefinition {
  name: string;
  description: string;
  parameters: ZodRawShape;
  handler: (params: any, forgeApiKey: string) => Promise<any>;
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