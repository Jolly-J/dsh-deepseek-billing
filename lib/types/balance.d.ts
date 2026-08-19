import type { Context } from '@deepseek-ai/cordis';
import type { BalanceAttempt } from './types.ts';
/** Fetch the DeepSeek account balance without exposing the credential on argv. */
export declare function fetchBalance(ctx: Context, apiKey: string | null, apiKeyEnv: string, baseURL: string): Promise<BalanceAttempt>;
