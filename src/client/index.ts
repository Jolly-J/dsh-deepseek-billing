/**
 * DeepSeek account balance and per-session cost estimate, browser half.
 * Registers a compact status row with an expandable detail body in the
 * official sidebar footer action area. Data comes from the node half's
 * /billing/status route. The card stays in normal layout flow and never
 * floats over the workspace region.
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import { BillingPanel } from './BillingPanel.tsx'

/** Required services for the sidebar-footer registration. */
export const inject = ['slots']

/** Mount the billing card into the official sidebar footer action area. */
export function apply(ctx: ClientContext): void {
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register(
    { name: 'sidebar.footer.action', id: 'deepseek-billing', order: 10, label: '余额' },
    BillingPanel,
  ))
}
