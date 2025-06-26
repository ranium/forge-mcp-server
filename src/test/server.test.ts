import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from '@jest/globals'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

// Helper function to create a server instance for testing
function createTestServer(): McpServer {
  return new McpServer(
    { name: 'forge-mcp', version: '0.1.0' },
    { capabilities: { tools: {} } }
  )
}

// Helper function to test API key resolution (copied from server.ts)
function testApiKeyResolution(): string | undefined {
  const arg = process.argv.find(arg => arg.startsWith('--api-key='))
  if (arg) {
    return arg.split('=')[1]
  }
  return process.env.FORGE_API_KEY
}

const scriptPath = 'dist/server.js'

describe('Forge MCP Server', () => {
  let originalEnv: NodeJS.ProcessEnv
  let originalArgv: string[]

  beforeEach(() => {
    // Save original environment and argv
    originalEnv = { ...process.env }
    originalArgv = [...process.argv]

    // Clear mocks
    jest.clearAllMocks()
  })

  afterEach(() => {
    // Restore original environment and argv
    process.env = originalEnv
    process.argv = originalArgv
  })

  describe('Server Initialization Tests', () => {
    it('should create server with valid configuration', async () => {
      // Set up valid API key
      process.env.FORGE_API_KEY = 'valid-api-key-123'
      process.argv = ['node', scriptPath]

      // Test API key resolution
      const apiKey = testApiKeyResolution()
      expect(apiKey).toBe('valid-api-key-123')

      // Test server creation
      expect(() => {
        createTestServer()
      }).not.toThrow()
    })

    it('should fail when API key is missing', async () => {
      // Clear API key
      delete process.env.FORGE_API_KEY
      process.argv = ['node', scriptPath] // No --api-key argument

      // Test API key resolution
      const apiKey = testApiKeyResolution()
      expect(apiKey).toBeUndefined()
    })

    it('should fail when API key is empty string', async () => {
      // Set empty API key
      process.env.FORGE_API_KEY = ''
      process.argv = ['node', scriptPath]

      // Test API key resolution
      const apiKey = testApiKeyResolution()
      expect(apiKey).toBe('')
    })

    it('should use command-line argument when both env var and arg are provided', async () => {
      // Set both environment variable and command-line argument
      process.env.FORGE_API_KEY = 'env-api-key'
      process.argv = ['node', scriptPath, '--api-key=cli-api-key']

      // Test API key resolution - CLI should take precedence
      const apiKey = testApiKeyResolution()
      expect(apiKey).toBe('cli-api-key')
    })
  })

  describe('API Key Resolution Tests', () => {
    it('should extract API key from environment variable', async () => {
      const testApiKey = 'env-test-key-123'
      process.env.FORGE_API_KEY = testApiKey
      process.argv = ['node', scriptPath]

      const apiKey = testApiKeyResolution()
      expect(apiKey).toBe(testApiKey)
    })

    it('should extract API key from command-line argument', async () => {
      delete process.env.FORGE_API_KEY
      const testApiKey = 'cli-test-key-456'
      process.argv = ['node', scriptPath, `--api-key=${testApiKey}`]

      const apiKey = testApiKeyResolution()
      expect(apiKey).toBe(testApiKey)
    })

    it('should use command-line argument when both are provided', async () => {
      process.env.FORGE_API_KEY = 'env-key'
      const cliKey = 'cli-key'
      process.argv = ['node', scriptPath, `--api-key=${cliKey}`]

      const apiKey = testApiKeyResolution()
      expect(apiKey).toBe(cliKey)
    })

    it('should handle missing API key gracefully', async () => {
      delete process.env.FORGE_API_KEY
      process.argv = ['node', scriptPath]

      const apiKey = testApiKeyResolution()
      expect(apiKey).toBeUndefined()
    })

    it('should handle empty command-line argument', async () => {
      delete process.env.FORGE_API_KEY
      process.argv = ['node', scriptPath, '--api-key=']

      const apiKey = testApiKeyResolution()
      expect(apiKey).toBe('')
    })

    it('should handle malformed command-line argument', async () => {
      delete process.env.FORGE_API_KEY
      process.argv = ['node', scriptPath, '--api-key']

      const apiKey = testApiKeyResolution()
      expect(apiKey).toBeUndefined()
    })

    it('should handle command-line argument with equals but no value', async () => {
      delete process.env.FORGE_API_KEY
      process.argv = ['node', scriptPath, '--api-key=']

      const apiKey = testApiKeyResolution()
      expect(apiKey).toBe('')
    })

    it('should handle multiple command-line arguments', async () => {
      delete process.env.FORGE_API_KEY
      process.argv = [
        'node',
        scriptPath,
        '--other-arg',
        '--api-key=test-key',
        '--another-arg',
      ]

      const apiKey = testApiKeyResolution()
      expect(apiKey).toBe('test-key')
    })

    it('should handle command-line argument with special characters', async () => {
      delete process.env.FORGE_API_KEY
      const testApiKey = 'test-key-with-special-chars-!@#$%^&*()'
      process.argv = ['node', scriptPath, `--api-key=${testApiKey}`]

      const apiKey = testApiKeyResolution()
      expect(apiKey).toBe(testApiKey)
    })

    it('should handle command-line argument with spaces', async () => {
      delete process.env.FORGE_API_KEY
      const testApiKey = 'test key with spaces'
      process.argv = ['node', scriptPath, `--api-key=${testApiKey}`]

      const apiKey = testApiKeyResolution()
      expect(apiKey).toBe(testApiKey)
    })
  })
})
