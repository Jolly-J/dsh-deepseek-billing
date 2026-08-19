import type { FoldedUsage } from './types.ts';
/** Fold successful assistant-message usage into disjoint token and cost buckets. */
export declare function foldUsage(events: readonly unknown[]): FoldedUsage;
