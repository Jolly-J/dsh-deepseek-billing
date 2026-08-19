import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-host-webserver'
import { fetchBalance } from './balance.ts'
import { foldUsage } from './usage.ts'
import type { BalanceAttempt, BillingStatus, FoldedUsage } from './types.ts'

const BALANCE_TTL_MS = 30000

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

interface SessionQueryLike {
  readSession(id: string): Promise<{ events?: unknown[] } | null | undefined>
}

interface BillingRequest {
  url?: string | null
}

interface BillingResponse {
  statusCode: number
  setHeader(name: string, value: string): void
  end(body: string): void
}

interface UsageAttempt extends FoldedUsage {
  skip: boolean
  error: string | null
  usageMs: number
}

function emptyUsage(overrides: Pick<UsageAttempt, 'skip' | 'error' | 'usageMs'>): UsageAttempt {
  return {
    ...overrides,
    usage: { inputTokens: 0, cacheReadTokens: 0, outputTokens: 0, reasoningTokens: 0 },
    cost: { input: 0, output: 0, total: 0 },
    model: null,
    pricingNote: '',
  }
}

function resolveProviderSettings(ctx: Context): { apiKeyEnv: string; baseURL: string } {
  const settings = ctx.get('settings') as SettingsLike | undefined
  let apiKeyEnv = 'DEEPSEEK_API_KEY'
  let baseURL = 'https://api.deepseek.com'
  if (settings === undefined) return { apiKeyEnv, baseURL }
  try {
    const section = settings.get('llm-deepseek')
    if (section !== null && typeof section === 'object') {
      const apiKeyEnvValue = (section as { apiKeyEnv?: unknown }).apiKeyEnv
      const baseURLValue = (section as { baseURL?: unknown }).baseURL
      if (typeof apiKeyEnvValue === 'string' && apiKeyEnvValue.length > 0) apiKeyEnv = apiKeyEnvValue
      if (typeof baseURLValue === 'string' && baseURLValue.length > 0) baseURL = baseURLValue
    }
  } catch {
    // An unavailable settings section leaves the official DeepSeek defaults active.
  }
  return { apiKeyEnv, baseURL }
}

async function resolveCredential(ctx: Context, apiKeyEnv: string): Promise<string | null> {
  const credentials = ctx.get('credentials') as CredentialsLike | undefined
  if (credentials === undefined) return null
  try {
    const hit = await credentials.resolve(apiKeyEnv)
    return hit !== undefined && hit.value.length > 0 ? hit.value : null
  } catch {
    return null
  }
}

async function loadUsage(ctx: Context, sessionId: string | null): Promise<UsageAttempt> {
  if (sessionId === null) return emptyUsage({ skip: true, error: null, usageMs: 0 })
  const start = Date.now()
  const sessions = ctx.get('sessions') as SessionsLike | undefined
  if (sessions !== undefined) {
    try {
      const session = sessions.get(sessionId)
      if (session !== undefined && Array.isArray(session.events)) {
        return { skip: false, ...foldUsage(session.events), error: null, usageMs: Date.now() - start }
      }
    } catch {
      // Persisted session lookup below is the fallback for an unavailable live view.
    }
  }

  const sessionQuery = ctx.get('sessionQuery') as SessionQueryLike | undefined
  if (sessionQuery === undefined) {
    return emptyUsage({ skip: false, error: 'sessionQuery 服务不可用', usageMs: Date.now() - start })
  }
  try {
    const log = await sessionQuery.readSession(sessionId)
    const events = log !== null && log !== undefined && Array.isArray(log.events) ? log.events : []
    return { skip: false, ...foldUsage(events), error: null, usageMs: Date.now() - start }
  } catch (error) {
    return emptyUsage({
      skip: false,
      error: error instanceof Error ? error.message : String(error),
      usageMs: Date.now() - start,
    })
  }
}

/** Register the exact status endpoint and its request-local aggregation flow. */
export function registerBillingStatusRoute(ctx: Context): () => void {
  let balanceCache: { atMs: number; value: BalanceAttempt } | null = null
  return ctx.webServer.register({
    kind: 'exact',
    path: '/billing/status',
    handler: async (req: BillingRequest, res: BillingResponse) => {
      const totalStart = Date.now()
      try {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const requestedSessionId = url.searchParams.get('sessionId')
        const sessionId = requestedSessionId !== null && requestedSessionId.length > 0
          ? requestedSessionId
          : null
        const { apiKeyEnv, baseURL } = resolveProviderSettings(ctx)
        const apiKey = await resolveCredential(ctx, apiKeyEnv)

        const balanceTask = (async (): Promise<BalanceAttempt & { balanceMs: number }> => {
          const start = Date.now()
          const now = Date.now()
          if (balanceCache !== null && now - balanceCache.atMs < BALANCE_TTL_MS) {
            return { ...balanceCache.value, balanceMs: Date.now() - start }
          }
          const value = await fetchBalance(ctx, apiKey, apiKeyEnv, baseURL)
          balanceCache = { atMs: now, value }
          return { ...value, balanceMs: Date.now() - start }
        })()

        const [balance, usage] = await Promise.all([balanceTask, loadUsage(ctx, sessionId)])
        const output: BillingStatus = {
          ok: !balance.keyMissing,
          keyMissing: balance.keyMissing,
          balance: balance.balance,
          balanceError: balance.balanceError,
          usage: usage.skip ? null : usage.usage,
          usageError: usage.skip ? null : usage.error,
          cost: usage.skip ? null : usage.cost,
          sessionId,
          model: usage.skip ? null : usage.model,
          pricingNote: usage.skip ? '' : usage.pricingNote,
          timings: {
            balanceMs: balance.balanceMs,
            usageMs: usage.usageMs,
            totalMs: Date.now() - totalStart,
          },
          updatedAtMs: Date.now(),
        }
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify(output))
      } catch (error) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }))
      }
    },
  })
}
