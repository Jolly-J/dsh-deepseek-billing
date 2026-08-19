import type { BillingStatus } from '../types.ts';
/** Client-side loading state retained while a session switch refreshes. */
export interface LoadState {
    loading: boolean;
    data: BillingStatus | null;
    error: string | null;
}
/** Load the account and optional session totals from the node half. */
export declare function loadBillingStatus(sessionId: string | null): Promise<BillingStatus>;
/** Convert an unknown rejection into the user-visible error string. */
export declare function errorMessage(error: unknown): string;
