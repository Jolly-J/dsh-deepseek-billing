import type { BalanceAttempt, BillingBalance } from './types.ts'

const BALANCE_TIMEOUT_MS = 25000
const MAX_ERROR_BODY = 160

function money(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function parseBalance(text: string): BillingBalance | null {
  const parsed = JSON.parse(text) as { is_available?: unknown; balance_infos?: unknown }
  const infos = Array.isArray(parsed.balance_infos) ? parsed.balance_infos : []
  const info = (infos.find(candidate => candidate !== null && typeof candidate === 'object'
    && (candidate as { currency?: unknown }).currency === 'CNY') ?? infos[0] ?? null) as {
      currency?: unknown
      total_balance?: unknown
      granted_balance?: unknown
      topped_up_balance?: unknown
    } | null
  if (info === null || typeof info !== 'object') return null
  return {
    currency: typeof info.currency === 'string' ? info.currency : 'CNY',
    total: money(info.total_balance),
    granted: money(info.granted_balance),
    toppedUp: money(info.topped_up_balance),
    available: parsed.is_available !== false,
  }
}

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
export async function fetchBalance(
  apiKey: string | null,
  apiKeyEnv: string,
  baseURL: string,
): Promise<BalanceAttempt> {
  if (apiKey === null) {
    return { keyMissing: true, balance: null, balanceError: `未找到 API Key(${apiKeyEnv})` }
  }
  try {
    const endpoint = baseURL.replace(/\/+$/, '') + '/user/balance'
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(BALANCE_TIMEOUT_MS),
    })
    const text = (await response.text()).trim()
    if (!response.ok) {
      const status = `${response.status} ${response.statusText}`.trim()
      const suffix = text.length > 0 ? ` (${text.slice(0, MAX_ERROR_BODY)})` : ''
      return { keyMissing: false, balance: null, balanceError: `余额接口请求失败: ${status}${suffix}` }
    }
    if (text.length === 0) {
      return { keyMissing: false, balance: null, balanceError: '余额接口返回空响应' }
    }
    try {
      const balance = parseBalance(text)
      return balance === null
        ? { keyMissing: false, balance: null, balanceError: '余额接口未返回 balance_infos' }
        : { keyMissing: false, balance, balanceError: null }
    } catch {
      return {
        keyMissing: false,
        balance: null,
        balanceError: `余额接口响应不是有效 JSON: ${text.slice(0, MAX_ERROR_BODY)}`,
      }
    }
  } catch (error) {
    return { keyMissing: false, balance: null, balanceError: error instanceof Error ? error.message : String(error) }
  }
}
