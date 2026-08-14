/**
 * DeepSeek account balance and per-session cost estimate, node half.
 *
 * Serves one exact JSON endpoint, `/billing/status`, for the browser half:
 * the caller session's token-usage fold (live in-memory events when the
 * session is open, the persisted log otherwise) plus the provider balance
 * fetched with the model route's own credential. Request-local state only,
 * except the 30-second balance cache.
 * @module dsh-deepseek-billing
 */
import type { Context } from '@deepseek-ai/cordis';
/** Stable Cordis plugin name. */
export declare const name = "ui-deepseek-billing";
/** Service required before the status route can be claimed. */
export declare const inject: string[];
interface BillingBalance {
    currency: string;
    total: number;
    granted: number;
    toppedUp: number;
    available: boolean;
}
interface BillingUsage {
    inputTokens: number;
    cacheReadTokens: number;
    outputTokens: number;
    reasoningTokens: number;
}
interface BillingCost {
    input: number;
    output: number;
    total: number;
}
interface BillingTimings {
    balanceMs: number;
    usageMs: number;
    totalMs: number;
}
/** JSON shape the browser half renders. */
export interface BillingStatus {
    ok: boolean;
    keyMissing: boolean;
    balance: BillingBalance | null;
    balanceError: string | null;
    usage: BillingUsage | null;
    usageError: string | null;
    cost: BillingCost | null;
    sessionId: string | null;
    model: string | null;
    pricingNote: string;
    timings: BillingTimings | null;
    updatedAtMs: number;
}
export declare function apply(ctx: Context): void;
export {};
//# sourceMappingURL=index.d.ts.map