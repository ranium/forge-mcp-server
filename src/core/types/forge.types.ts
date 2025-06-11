export interface ForgeServer {
  id: number;
  name: string;
  ip_address: string;
  // Add more fields as needed from Forge API docs
}

export interface ForgeSite {
  id: number;
  name: string;
  // Add more fields as needed from Forge API docs
}

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

// Shared prompt-driven orchestration types
export type PromptOption = { id: string; name: string };
