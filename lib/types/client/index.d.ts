/**
 * DeepSeek account balance and per-session cost estimate, browser half.
 * Registers a compact status row with an expandable detail body in the
 * official sidebar footer action area. Data comes from the node half's
 * /billing/status route. The card stays in normal layout flow and never
 * floats over the workspace region.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
/** Required services for the sidebar-footer registration. */
export declare const inject: string[];
/** Mount the billing card into the official sidebar footer action area. */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map