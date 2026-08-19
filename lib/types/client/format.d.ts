import type { LoadState } from './api.ts';
export declare function fmtTokens(value: number): string;
export declare function fmtMoney(value: number): string;
export declare function fmtCost(value: number): string;
export declare function fmtTime(timeMs: number): string;
export declare function balanceShort(status: LoadState | null): string;
export declare function costShort(status: LoadState | null): string;
export declare function statusKind(status: LoadState | null): 'ok' | 'error' | 'idle';
