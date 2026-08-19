interface Price {
    hit: number;
    miss: number;
    out: number;
}
/** Classify a model id into the two DeepSeek V4 billing families. */
export declare function modelKey(modelId: string): 'flash' | 'pro';
/** Resolve the China Standard Time peak/off-peak tier for one timestamp. */
export declare function tierAt(timeMs: number | undefined): 'peak' | 'offPeak';
/** Resolve the exact input/output rates that apply to one model request. */
export declare function priceOf(modelId: string, timeMs: number | undefined): Price & {
    tier: 'flat' | 'peak' | 'offPeak';
};
/** Render the compact price explanation shown in the expanded card. */
export declare function pricingNote(modelId: string, timeMs?: number): string;
export {};
