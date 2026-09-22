/**
 * Session selection projection for the billing card.
 * Kept free of React and DSH imports so the rule stays unit-testable.
 */
/** Minimal Session row shape the selection rule reads. */
export interface SessionRowLike {
    readonly id: unknown;
    /** Local ownership counts; absent on DSH releases before 0.1.6-alpha.2. */
    readonly retainedBy?: Readonly<Record<string, number>> | undefined;
}
/** Minimal Session list snapshot shape the selection rule reads. */
export interface SessionListLike {
    /** Row map keyed by Session id (every supported DSH release). */
    readonly byId?: Readonly<Record<string, SessionRowLike | undefined>> | undefined;
    /** Selection field removed in 0.1.6-alpha.2; still present on older releases. */
    readonly current?: unknown;
}
/**
 * Resolve the Session currently shown in the main view.
 *
 * DSH 0.1.6-alpha.2 dropped the `current` field that used to carry the
 * selection on the Session list snapshot. The supported replacement — read by
 * the official sidebar, workspace browser, and document title — is the row the
 * main view retains. Without it the card asked the host for session-less totals
 * and rendered "—" where the session cost belongs.
 *
 * Older releases are still handled: rows without ownership counts and the
 * legacy `current` field are read defensively, so the card degrades to the
 * previous behaviour instead of throwing inside the selector.
 *
 * @param list - Session list snapshot from `useSessions`.
 * @returns the selected Session id, or null while no Session is selected.
 */
export declare function selectActiveSessionId(list: SessionListLike | null | undefined): string | null;
