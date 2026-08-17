/**
 * DeepSeek account balance and per-session cost estimate, browser half.
 * Registers the sidebar-header card: a compact status row under the brand
 * row (between the logo and the New Session button) with an expandable
 * detail body fed by the node half's /billing/status. In-flow layout only —
 * nothing floats over the workspace region.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
/** Required services for the sidebar-header registration. */
export declare const inject: string[];
/** Mount the billing card into the sidebar header, under the brand row. */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map