import { randomUUID } from 'crypto'
import { ForgeToolDefinition, ToolCategory } from '../core/types/protocols.js'
import { toMCPToolResult } from './mcpToolResult.js'
import { z } from 'zod'

export interface ConfirmationEntry<T = unknown> {
  confirmationId: string
  used: boolean
  createdAt: number
  params: T
}

export function createConfirmationStore<T>() {
  return new Map<string, ConfirmationEntry<T>>()
}

export function createConfirmation<T>(
  store: Map<string, ConfirmationEntry<T>>,
  params: T
): ConfirmationEntry<T> {
  const confirmationId = randomUUID()
  const entry: ConfirmationEntry<T> = {
    confirmationId,
    used: false,
    createdAt: Date.now(),
    params,
  }
  store.set(confirmationId, entry)
  return entry
}

export function validateConfirmation<T>(
  store: Map<string, ConfirmationEntry<T>>,
  confirmationId: string,
  paramsCheck?: (params: T) => boolean,
  expiryMs = 10 * 60 * 1000
): ConfirmationEntry<T> | null {
  const entry = store.get(confirmationId)
  if (!entry || entry.used) return null
  if (Date.now() - entry.createdAt > expiryMs) {
    store.delete(confirmationId)
    return null
  }
  if (paramsCheck && !paramsCheck(entry.params)) return null
  return entry
}

export function markConfirmationUsed<T>(
  store: Map<string, ConfirmationEntry<T>>,
  confirmationId: string
) {
  const entry = store.get(confirmationId)
  if (entry) {
    entry.used = true
    store.set(confirmationId, entry)
  }
}

/**
 * Factory for creating confirmation tools with minimal boilerplate.
 * If buildSummary is not provided, uses buildDynamicSummary with the given action.
 * @param options - The options for the confirmation tool.
 */
export function confirmationToolFactory<T extends z.ZodRawShape>({
  name,
  description,
  category,
  paramsSchema,
  store,
  buildSummary,
}: {
  name: string
  description: string
  category: ToolCategory
  paramsSchema: T
  store: Map<string, ConfirmationEntry<z.infer<z.ZodObject<T>>>>
  buildSummary: (params: z.infer<z.ZodObject<T>>, confirmationId: string) => string
}): ForgeToolDefinition<T> {
  return {
    name,
    description,
    parameters: paramsSchema,
    category,
    handler: async (params: Record<string, unknown>, _forgeApiKey: string) => {
      const typedParams = params as z.infer<z.ZodObject<T>>
      const entry = createConfirmation(store, typedParams)
      const summary = buildSummary(typedParams, entry.confirmationId)
      return toMCPToolResult({ summary, confirmationId: entry.confirmationId })
    },
  }
}
