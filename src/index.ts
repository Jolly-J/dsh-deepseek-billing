/**
 * DeepSeek account balance and per-session cost estimate, node half.
 * @module dsh-deepseek-billing
 */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-host-webserver'
import { registerBillingStatusRoute } from './status-route.ts'

export type { BillingStatus } from './types.ts'

/** Stable Cordis plugin name. */
export const name = 'ui-deepseek-billing'

/** Service required before the status route can be claimed. */
export const inject = ['webServer']

/** Register the browser-facing billing status endpoint. */
export function apply(ctx: Context): void {
  ctx.effect(() => registerBillingStatusRoute(ctx), 'ui-deepseek-billing: status route')
}
