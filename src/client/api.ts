import type { BillingStatus } from '../types.ts'

/** Client-side loading state retained while a session switch refreshes. */
export interface LoadState {
  loading: boolean
  data: BillingStatus | null
  error: string | null
}

/** Load the account and optional session totals from the node half. */
export async function loadBillingStatus(sessionId: string | null): Promise<BillingStatus> {
  const endpoint = sessionId === null
    ? '/billing/status'
    : `/billing/status?sessionId=${encodeURIComponent(sessionId)}`
  const response = await fetch(endpoint)
  return response.json() as Promise<BillingStatus>
}

/** Convert an unknown rejection into the user-visible error string. */
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
