/**
 * DeepSeek account balance and per-session cost estimate, browser half.
 * Registers the sidebar-foot card: a summary row above the Settings seat
 * with an expandable detail body fed by the node half's /billing/status.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
/** Required services for the sidebar-foot registration. */
export declare const inject: string[];
/** Mount the billing card into the sidebar footer, above the Settings seat. */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map