import { randomUUID } from "crypto";

export interface ConfirmationEntry<T = any> {
  confirmationId: string;
  used: boolean;
  createdAt: number;
  params: T;
}

export function createConfirmationStore<T>() {
  return new Map<string, ConfirmationEntry<T>>();
}

export function createConfirmation<T>(store: Map<string, ConfirmationEntry<T>>, params: T): ConfirmationEntry<T> {
  const confirmationId = randomUUID();
  const entry: ConfirmationEntry<T> = {
    confirmationId,
    used: false,
    createdAt: Date.now(),
    params,
  };
  store.set(confirmationId, entry);
  return entry;
}

export function validateConfirmation<T>(store: Map<string, ConfirmationEntry<T>>, confirmationId: string, paramsCheck?: (params: T) => boolean, expiryMs = 10 * 60 * 1000): ConfirmationEntry<T> | null {
  const entry = store.get(confirmationId);
  if (!entry || entry.used) return null;
  if (Date.now() - entry.createdAt > expiryMs) {
    store.delete(confirmationId);
    return null;
  }
  if (paramsCheck && !paramsCheck(entry.params)) return null;
  return entry;
}

export function markConfirmationUsed<T>(store: Map<string, ConfirmationEntry<T>>, confirmationId: string) {
  const entry = store.get(confirmationId);
  if (entry) {
    entry.used = true;
    store.set(confirmationId, entry);
  }
} 