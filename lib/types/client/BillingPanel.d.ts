/**
 * The sidebar-footer billing card: a compact status row (status dot, balance,
 * session cost, refresh, expand chevron) with an animated in-flow detail body.
 * Pure flex layout — the card stays inside the official footer action area
 * and never floats over the workspace region. Numbers roll between old and
 * new values inside fixed-height slots; every other element stays put while
 * only the digits animate.
 */
import { type ReactNode } from 'react';
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
type Props = PropsRuntime<'sidebar.footer.action'>;
/** Mount the compact status row with the in-flow expandable detail body. */
export declare function BillingPanel({ wide, useSessions }: Props): ReactNode;
export {};
//# sourceMappingURL=BillingPanel.d.ts.map