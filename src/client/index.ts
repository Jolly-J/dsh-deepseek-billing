/**
 * DeepSeek account balance and per-session cost estimate, browser half.
 * Registers the sidebar-header card: a compact status row under the brand
 * row (between the logo and the New Session button) with an expandable
 * detail body fed by the node half's /billing/status. In-flow layout only —
 * nothing floats over the workspace region.
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import { BillingPanel } from './BillingPanel.tsx'

/** Required services for the sidebar-header registration. */
export const inject = ['slots']

/** Mount the billing card into the sidebar header, under the brand row. */
export function apply(ctx: ClientContext): void {
  ctx.slots.inject('sidebar.header.action', () => ctx.slots.register(
    { name: 'sidebar.header.action', id: 'deepseek-billing', order: 10, label: '余额' },
    BillingPanel,
  ))
}
