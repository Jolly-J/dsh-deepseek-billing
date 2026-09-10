interface Price {
    hit: number;
    miss: number;
    out: number;
}
/** Peak/off-peak split inside one tiered era. */
type SplitTier = 'peak' | 'offPeak';
/** Billing tier that produced a resolved price. */
export type Tier = 'flat' | SplitTier;
/** The two price tables DeepSeek bills model requests against. */
export type Family = 'flash' | 'pro';
/** Classify a model id into the price table its own name belongs to. */
export declare function modelKey(modelId: string): Family;
/** Resolve the family a request is actually billed as at one instant. */
export declare function billedFamily(modelId: string, timeMs?: number): Family;
/** Resolve the China Standard Time peak/off-peak tier for one timestamp. */
export declare function tierAt(timeMs?: number, weekdayOnly?: boolean): SplitTier;
/** Resolve the exact input/output rates that apply to one model request. */
export declare function priceOf(modelId: string, timeMs?: number): Price & {
    tier: Tier;
};
/** Render the compact price explanation shown in the expanded card. */
export declare function pricingNote(modelId: string, timeMs?: number): string;
export {};
