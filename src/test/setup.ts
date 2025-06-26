// Test setup file
import { jest } from '@jest/globals'

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
}

// Mock process.exit to prevent tests from actually exiting
const originalExit = process.exit
process.exit = jest.fn() as unknown as (code?: number) => never

// Restore process.exit after tests
afterAll(() => {
  process.exit = originalExit
})
