export interface ForgeToolParams {
  endpoint: string; // e.g., '/servers', '/sites', etc.
  method: 'get' | 'post' | 'put' | 'delete';
  data?: any;
  params?: any;
}

export interface ForgeToolResponse {
  result?: any;
  error?: string;
} 

