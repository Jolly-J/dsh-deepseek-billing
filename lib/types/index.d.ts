/**
 * DeepSeek account balance and per-session cost estimate, node half.
 * @module dsh-deepseek-billing
 */
import type { Context } from '@deepseek-ai/cordis';
export type { BillingStatus } from './types.ts';
/** Stable Cordis plugin name. */
export declare const name = "ui-deepseek-billing";
/** Service required before the status route can be claimed. */
export declare const inject: string[];
/** Register the browser-facing billing status endpoint. */
export declare function apply(ctx: Context): void;
