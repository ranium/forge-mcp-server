export interface MCPTool {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<
      string,
      {
        type: string
        description: string
        required?: boolean
      }
    >
  }
}

export interface MCPResponse {
  result?: unknown // Specify a more precise type if known
  error?: string
}
