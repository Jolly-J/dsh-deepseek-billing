/**
 * DeepSeek account balance and per-session cost estimate, node half.
 *
 * Serves one exact JSON endpoint, `/billing/status`, for the browser half:
 * the caller session's token-usage fold (live in-memory events when the
 * session is open, the persisted log otherwise) plus the provider balance
 * fetched with the model route's own credential. Request-local state only,
 * except the 30-second balance cache.
 * @module dsh-deepseek-billing
 */

import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-host-webserver'
import { credentialRef } from '@deepseek-ai/dsh-credentials'

/** Stable Cordis plugin name. */
export const name = 'ui-deepseek-billing'

/** Service required before the status route can be claimed. */
export const inject = ['webServer']

/** Official pricing (RMB per million tokens). Source: https://api-docs.deepseek.com/zh-cn/quick_start/pricing/ */
const NEW_PRICE_EFFECTIVE_MS = new Date('2026-08-16T16:00:00Z').getTime()

interface Price {
  hit: number
  miss: number
  out: number
}

const FLASH_TABLE: { old: Price; offPeak: Price; peak: Price } = {
  old: { hit: 0.02, miss: 1.0, out: 2.0 },
  offPeak: { hit: 0.05, miss: 1.5, out: 4.5 },
  peak: { hit: 0.1, miss: 3.0, out: 9.0 },
}

const PRO_TABLE: { old: Price; offPeak: Price; peak: Price } = {
  old: { hit: 0.025, miss: 3.0, out: 6.0 },
  offPeak: { hit: 0.15, miss: 4.5, out: 13.5 },
  peak: { hit: 0.3, miss: 9.0, out: 27.0 },
}

function modelKey(modelId: string): 'flash' | 'pro' {
  if (modelId.length === 0) return 'pro'
  return modelId.toLowerCase().includes('flash') ? 'flash' : 'pro'
}

function modelName(modelId: string): string {
  return modelKey(modelId) === 'flash' ? 'DeepSeek-V4-Flash' : 'DeepSeek-V4-Pro'
}

function tierAt(timeMs: number | undefined): 'peak' | 'offPeak' {
  const t = timeMs ?? Date.now()
  const hour = (new Date(t).getUTCHours() + 8) % 24
  const peak = (hour >= 9 && hour < 12) || (hour >= 14 && hour < 18)
  return peak ? 'peak' : 'offPeak'
}

function priceOf(modelId: string, timeMs: number | undefined): Price & { tier: 'flat' | 'peak' | 'offPeak' } {
  const table = modelKey(modelId) === 'flash' ? FLASH_TABLE : PRO_TABLE
  const t = timeMs ?? Date.now()
  if (t < NEW_PRICE_EFFECTIVE_MS) {
    return { hit: table.old.hit, miss: table.old.miss, out: table.old.out, tier: 'flat' }
  }
  const tier = tierAt(t)
  const p = table[tier]
  return { hit: p.hit, miss: p.miss, out: p.out, tier }
}

function pricingNote(modelId: string, timeMs?: number): string {
  const p = priceOf(modelId, timeMs)
  const when = p.tier === 'flat' ? '旧价表' : p.tier === 'peak' ? '高峰时段' : '空闲时段'
  return `${modelName(modelId)} · ${when} · 命中${p.hit}/未命中${p.miss}/输出${p.out} 元/M`
}

function num(v: unknown): number {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n : 0
}

function money(v: unknown): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

interface BillingBalance {
  currency: string
  total: number
  granted: number
  toppedUp: number
  available: boolean
}

interface BillingUsage {
  inputTokens: number
  cacheReadTokens: number
  outputTokens: number
  reasoningTokens: number
}

interface BillingCost {
  input: number
  output: number
  total: number
}

interface BillingTimings {
  balanceMs: number
  usageMs: number
  totalMs: number
}

/** JSON shape the browser half renders. */
export interface BillingStatus {
  ok: boolean
  keyMissing: boolean
  balance: BillingBalance | null
  balanceError: string | null
  usage: BillingUsage | null
  usageError: string | null
  cost: BillingCost | null
  sessionId: string | null
  model: string | null
  pricingNote: string
  timings: BillingTimings | null
  updatedAtMs: number
}

interface FoldedUsage {
  usage: BillingUsage
  cost: BillingCost
  model: string | null
  pricingNote: string
}

/** Disjoint buckets plus per-event-time pricing over one event list. */
function foldUsage(events: readonly unknown[]): FoldedUsage {
  const usage: BillingUsage = { inputTokens: 0, cacheReadTokens: 0, outputTokens: 0, reasoningTokens: 0 }
  let inputCost = 0
  let outputCost = 0
  let lastModel: string | null = null
  for (const raw of events) {
    if (raw === null || typeof raw !== 'object') continue
    const ev = raw as { type?: unknown; time?: unknown; data?: unknown }
    if (ev.type !== 'assistant/message') continue
    const data = ev.data
    if (data === null || typeof data !== 'object') continue
    const u = (data as { usage?: unknown }).usage
    if (u === null || typeof u !== 'object') continue
    const src = (data as { message?: { source?: { model?: unknown } } }).message?.source
    const model = typeof src?.model === 'string' && src.model.length > 0 ? src.model : 'unknown'
    lastModel = model
    const input = num((u as { inputTokens?: unknown }).inputTokens)
    const hitTokens = num((u as { cacheReadTokens?: unknown }).cacheReadTokens)
    const output = num((u as { outputTokens?: unknown }).outputTokens)
    const reasoning = num((u as { reasoningTokens?: unknown }).reasoningTokens)
    usage.inputTokens += input
    usage.cacheReadTokens += hitTokens
    usage.outputTokens += output
    usage.reasoningTokens += reasoning
    const price = priceOf(model, typeof ev.time === 'number' ? ev.time : undefined)
    inputCost += (input * price.miss + hitTokens * price.hit) / 1e6
    outputCost += output * price.out / 1e6
  }
  return {
    usage,
    cost: { input: inputCost, output: outputCost, total: inputCost + outputCost },
    model: lastModel,
    pricingNote: lastModel !== null ? pricingNote(lastModel) : '',
  }
}

interface SessionLike {
  events?: unknown
}

interface SessionsLike {
  get(id: string): SessionLike | undefined
}

interface SettingsLike {
  get(ns: string): unknown
}

interface CredentialsLike {
  resolve(ref: string): Promise<{ value: string } | undefined>
}

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

interface SessionQueryLike {
  readSession(id: string): Promise<{ events?: unknown[] } | null | undefined>
}

interface BalanceAttempt {
  keyMissing: boolean
  balance: BillingBalance | null
  balanceError: string | null
}

async function fetchBalance(
  ctx: Context,
  apiKey: string | null,
  apiKeyEnv: string,
  baseURL: string,
): Promise<BalanceAttempt> {
  if (apiKey === null) {
    return { keyMissing: true, balance: null, balanceError: `未找到 API Key(${apiKeyEnv})` }
  }
  const shell = ctx.get('shell') as ShellLike | undefined
  if (shell === undefined) {
    return { keyMissing: false, balance: null, balanceError: 'shell 服务不可用' }
  }
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
      const parsed = JSON.parse(text) as { is_available?: unknown; balance_infos?: unknown }
      const infos = Array.isArray(parsed.balance_infos) ? parsed.balance_infos : []
      const info = (infos.find(b => b !== null && typeof b === 'object' && (b as { currency?: unknown }).currency === 'CNY')
        ?? infos[0] ?? null) as { currency?: unknown; total_balance?: unknown; granted_balance?: unknown; topped_up_balance?: unknown } | null
      if (info !== null && typeof info === 'object') {
        return {
          keyMissing: false,
          balance: {
            currency: typeof info.currency === 'string' ? info.currency : 'CNY',
            total: money(info.total_balance),
            granted: money(info.granted_balance),
            toppedUp: money(info.topped_up_balance),
            available: parsed.is_available !== false,
          },
          balanceError: null,
        }
      }
      return { keyMissing: false, balance: null, balanceError: '余额接口未返回 balance_infos' }
    }
    const detail = typeof run.stderr?.text === 'string' && run.stderr.text.length > 0
      ? run.stderr.text.trim()
      : `exit=${String(run.exitCode)}`
    return { keyMissing: false, balance: null, balanceError: `请求失败: ${detail}` }
  } catch (error) {
    return { keyMissing: false, balance: null, balanceError: error instanceof Error ? error.message : String(error) }
  }
}

export function apply(ctx: Context): void {
  const BALANCE_TTL_MS = 30000
  let balanceCache: { atMs: number; value: BalanceAttempt } | null = null

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/billing/status',
    handler: async (req, res) => {
      const totalStart = Date.now()
      try {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const sessionIdParam = url.searchParams.get('sessionId')
        const sessionId = sessionIdParam !== null && sessionIdParam.length > 0 ? sessionIdParam : null

        const settings = ctx.get('settings') as SettingsLike | undefined
        let apiKeyEnv = 'DEEPSEEK_API_KEY'
        let baseURL = 'https://api.deepseek.com'
        if (settings !== undefined) {
          try {
            const section = settings.get('llm-deepseek')
            if (section !== null && typeof section === 'object') {
              const apiKeyEnvValue = (section as { apiKeyEnv?: unknown }).apiKeyEnv
              const baseURLValue = (section as { baseURL?: unknown }).baseURL
              if (typeof apiKeyEnvValue === 'string' && apiKeyEnvValue.length > 0) apiKeyEnv = apiKeyEnvValue
              if (typeof baseURLValue === 'string' && baseURLValue.length > 0) baseURL = baseURLValue
            }
          } catch (error) {
            /* unregistered settings section: keep defaults */
          }
        }

        const credentials = ctx.get('credentials') as CredentialsLike | undefined
        let apiKey: string | null = null
        if (credentials !== undefined) {
          try {
            const hit = await credentials.resolve(credentialRef(apiKeyEnv))
            if (hit !== undefined && hit.value.length > 0) apiKey = hit.value
          } catch (error) {
            /* resolution failure reads as unconfigured */
          }
        }

        const balanceTask = (async (): Promise<BalanceAttempt & { balanceMs: number }> => {
          const t0 = Date.now()
          const now = Date.now()
          if (balanceCache !== null && now - balanceCache.atMs < BALANCE_TTL_MS) {
            return { ...balanceCache.value, balanceMs: Date.now() - t0 }
          }
          const value = await fetchBalance(ctx, apiKey, apiKeyEnv, baseURL)
          balanceCache = { atMs: now, value }
          return { ...value, balanceMs: Date.now() - t0 }
        })()

        const usageTask = (async (): Promise<FoldedUsage & { skip: boolean; error: string | null; usageMs: number }> => {
          if (sessionId === null) return { skip: true, error: null, usageMs: 0, usage: { inputTokens: 0, cacheReadTokens: 0, outputTokens: 0, reasoningTokens: 0 }, cost: { input: 0, output: 0, total: 0 }, model: null, pricingNote: '' }
          const t0 = Date.now()
          const sessions = ctx.get('sessions') as SessionsLike | undefined
          if (sessions !== undefined) {
            try {
              const session = sessions.get(sessionId)
              if (session !== undefined && Array.isArray(session.events)) {
                const folded = foldUsage(session.events)
                return { skip: false, ...folded, error: null, usageMs: Date.now() - t0 }
              }
            } catch (error) {
              /* fall through to the persisted path */
            }
          }
          const sessionQuery = ctx.get('sessionQuery') as SessionQueryLike | undefined
          if (sessionQuery === undefined) {
            return { skip: false, error: 'sessionQuery 服务不可用', usageMs: Date.now() - t0, usage: { inputTokens: 0, cacheReadTokens: 0, outputTokens: 0, reasoningTokens: 0 }, cost: { input: 0, output: 0, total: 0 }, model: null, pricingNote: '' }
          }
          try {
            const log = await sessionQuery.readSession(sessionId)
            const events = log !== null && log !== undefined && Array.isArray(log.events) ? log.events : []
            const folded = foldUsage(events)
            return { skip: false, ...folded, error: null, usageMs: Date.now() - t0 }
          } catch (error) {
            return { skip: false, error: error instanceof Error ? error.message : String(error), usageMs: Date.now() - t0, usage: { inputTokens: 0, cacheReadTokens: 0, outputTokens: 0, reasoningTokens: 0 }, cost: { input: 0, output: 0, total: 0 }, model: null, pricingNote: '' }
          }
        })()

        const [balanceRes, usageRes] = await Promise.all([balanceTask, usageTask])
        const out: BillingStatus = {
          ok: !balanceRes.keyMissing,
          keyMissing: balanceRes.keyMissing,
          balance: balanceRes.balance,
          balanceError: balanceRes.balanceError,
          usage: usageRes.skip ? null : usageRes.usage,
          usageError: usageRes.skip ? null : usageRes.error,
          cost: usageRes.skip ? null : usageRes.cost,
          sessionId,
          model: usageRes.skip ? null : usageRes.model,
          pricingNote: usageRes.skip ? '' : usageRes.pricingNote,
          timings: { balanceMs: balanceRes.balanceMs, usageMs: usageRes.usageMs, totalMs: Date.now() - totalStart },
          updatedAtMs: Date.now(),
        }
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify(out))
      } catch (error) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }))
      }
    },
  }), 'ui-deepseek-billing: status route')
}
