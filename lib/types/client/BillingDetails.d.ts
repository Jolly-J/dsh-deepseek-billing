import type { ReactNode } from 'react';
import type { LoadState } from './api.ts';
/** Render the expanded balance, token, pricing, and timing rows. */
export declare function BillingDetails({ status }: {
    status: LoadState | null;
}): ReactNode;
