/** Balance fields returned by the DeepSeek account endpoint. */
export interface BillingBalance {
    currency: string;
    total: number;
    granted: number;
    toppedUp: number;
    available: boolean;
}
/** Token buckets accumulated from successful assistant messages. */
export interface BillingUsage {
    inputTokens: number;
    cacheReadTokens: number;
    cacheWriteTokens?: number;
    outputTokens: number;
    reasoningTokens: number;
}
/** Estimated input, output, and total cost in RMB. */
export interface BillingCost {
    input: number;
    output: number;
    total: number;
}
/** Request timing breakdown used by the UI diagnostics row. */
export interface BillingTimings {
    balanceMs: number;
    usageMs: number;
    totalMs: number;
}
/** JSON response served by `/billing/status`. */
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
/** Usage fold plus the model and pricing note that produced its cost. */
export interface FoldedUsage {
    usage: BillingUsage;
    cost: BillingCost;
    model: string | null;
    pricingNote: string;
}
/** Result of one cached or live balance lookup. */
export interface BalanceAttempt {
    keyMissing: boolean;
    balance: BillingBalance | null;
    balanceError: string | null;
}
