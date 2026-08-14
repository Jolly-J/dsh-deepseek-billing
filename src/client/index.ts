/**
 * DeepSeek account balance and per-session cost estimate, browser half.
 * Registers the sidebar-foot card: a summary row above the Settings seat
 * with an expandable detail body fed by the node half's /billing/status.
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import { BillingPanel } from './BillingPanel.tsx'

/** Required services for the sidebar-foot registration. */
export const inject = ['slots']

/** Mount the billing card into the sidebar footer, above the Settings seat. */
export function apply(ctx: ClientContext): void {
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register(
    { name: 'sidebar.footer.action', id: 'deepseek-billing', order: 10, label: '余额' },
    BillingPanel,
  ))
}
