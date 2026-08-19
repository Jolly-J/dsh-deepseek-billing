import type { Context } from '@deepseek-ai/cordis'
import type { BalanceAttempt, BillingBalance } from './types.ts'

interface ShellOutputLike {
  text?: string
}

interface ShellRunLike {
  exitCode: number | null
  stdout?: ShellOutputLike | null
  stderr?: ShellOutputLike | null
}

interface ShellLike {
  resolve(request: {
    command: string
    env?: Record<string, string>
    timeoutMs?: number
    stdoutMaxBytes?: number
  }): unknown
  run(spec: unknown): Promise<ShellRunLike>
}

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

/** Fetch the DeepSeek account balance without exposing the credential on argv. */
export async function fetchBalance(
  ctx: Context,
  apiKey: string | null,
  apiKeyEnv: string,
  baseURL: string,
): Promise<BalanceAttempt> {
  if (apiKey === null) {
    return { keyMissing: true, balance: null, balanceError: `未找到 API Key(${apiKeyEnv})` }
  }
  const shell = ctx.get('shell') as ShellLike | undefined
  if (shell === undefined) return { keyMissing: false, balance: null, balanceError: 'shell 服务不可用' }

  try {
    const endpoint = baseURL.replace(/\/+$/, '') + '/user/balance'
    const spec = shell.resolve({
      command: `curl -sS --max-time 20 -H "Authorization: Bearer $DEEPSEEK_API_KEY" "${endpoint}"`,
      env: { DEEPSEEK_API_KEY: apiKey },
      timeoutMs: 25000,
      stdoutMaxBytes: 65536,
    })
    const run = await shell.run(spec)
    const text = typeof run.stdout?.text === 'string' ? run.stdout.text.trim() : ''
    if (run.exitCode === 0 && text.length > 0) {
      const balance = parseBalance(text)
      return balance === null
        ? { keyMissing: false, balance: null, balanceError: '余额接口未返回 balance_infos' }
        : { keyMissing: false, balance, balanceError: null }
    }
    const detail = typeof run.stderr?.text === 'string' && run.stderr.text.length > 0
      ? run.stderr.text.trim()
      : `exit=${String(run.exitCode)}`
    return { keyMissing: false, balance: null, balanceError: `请求失败: ${detail}` }
  } catch (error) {
    return { keyMissing: false, balance: null, balanceError: error instanceof Error ? error.message : String(error) }
  }
}
