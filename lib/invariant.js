//#region lib/types/invariant.js
/**
* Package-owned invariant companion for `dsh-deepseek-billing`.
* @module dsh-deepseek-billing/invariant
*/
const PACKAGE_NAME = "dsh-deepseek-billing";
/** Cordis companion plugin name. */
const name = "client-ui-deepseek-billing-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
/**
* No runtime invariant: the node half owns one exact web route registered
* through ctx.effect (fiber-bound, disposed with the row) and holds no
* cross-plugin state; the browser half registers one sidebar slot
* contribution under the same fiber discipline.
*/
const install = () => {};
/**
* Register this package's invariant companion.
* @param ctx - Cordis context carrying the invariant service.
* @returns the installed registration's disposer after setup succeeds.
*/
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
