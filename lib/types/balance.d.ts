import type { BalanceAttempt } from './types.ts';
/**
 * Fetch the DeepSeek account balance with the host's native fetch.
 *
 * Rationale (issue #1): running `curl` through the shell service broke on
 * Windows twice over — schannel could not acquire client credentials inside
 * the sandbox, and the credential passed via `env` never reached the bash
 * subprocess. Native fetch uses Node's own TLS stack on every platform and
 * keeps the key strictly inside this process: it appears only in the
 * Authorization header, never in argv, in a child environment, or in logs.
 */
export declare function fetchBalance(apiKey: string | null, apiKeyEnv: string, baseURL: string): Promise<BalanceAttempt>;
