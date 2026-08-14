/**
 * Package-owned invariant companion for `dsh-deepseek-billing`.
 * @module dsh-deepseek-billing/invariant
 */

/* jscpd:ignore-start */
import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

const PACKAGE_NAME = 'dsh-deepseek-billing'

/** Cordis companion plugin name. */
export const name = 'client-ui-deepseek-billing-invariant'
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants']

/**
 * No runtime invariant: the node half owns one exact web route registered
 * through ctx.effect (fiber-bound, disposed with the row) and holds no
 * cross-plugin state; the browser half registers one sidebar slot
 * contribution under the same fiber discipline.
 */
const install: InvariantInstaller = () => {}

/**
 * Register this package's invariant companion.
 * @param ctx - Cordis context carrying the invariant service.
 * @returns the installed registration's disposer after setup succeeds.
 */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
/* jscpd:ignore-end */
