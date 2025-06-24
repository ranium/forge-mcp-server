export interface ForgeToolParams {
  endpoint: string // e.g., '/servers', '/sites', etc.
  method: 'get' | 'post' | 'put' | 'delete'
  data?: unknown // Specify a more precise type if known
  params?: unknown // Specify a more precise type if known
}

export interface ForgeToolResponse {
  result?: unknown // Specify a more precise type if known
  error?: string
}
