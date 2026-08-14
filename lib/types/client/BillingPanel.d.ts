/**
 * The sidebar-foot billing card: a fixed summary row (status dot, balance,
 * session cost, refresh, expand chevron) with an animated detail body.
 * Numbers roll between old and new values inside fixed-height slots; every
 * other element stays put while only the digits animate.
 */
import { type ReactNode } from 'react';
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
type Props = PropsRuntime<'sidebar.footer.action'>;
/** Mount the fixed summary row with the expandable detail body. */
export declare function BillingPanel({ wide, useSessions }: Props): ReactNode;
export {};
//# sourceMappingURL=BillingPanel.d.ts.map