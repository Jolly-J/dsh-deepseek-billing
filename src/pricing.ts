interface Price {
  hit: number
  miss: number
  out: number
}

/** Price table changed at 2026-08-17 00:00 China Standard Time. */
const NEW_PRICE_EFFECTIVE_MS = new Date('2026-08-16T16:00:00Z').getTime()

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

/** Classify a model id into the two DeepSeek V4 billing families. */
export function modelKey(modelId: string): 'flash' | 'pro' {
  if (modelId.length === 0) return 'pro'
  return modelId.toLowerCase().includes('flash') ? 'flash' : 'pro'
}

function modelName(modelId: string): string {
  return modelKey(modelId) === 'flash' ? 'DeepSeek-V4-Flash' : 'DeepSeek-V4-Pro'
}

/** Resolve the China Standard Time peak/off-peak tier for one timestamp. */
export function tierAt(timeMs: number | undefined): 'peak' | 'offPeak' {
  const hour = (new Date(timeMs ?? Date.now()).getUTCHours() + 8) % 24
  const peak = (hour >= 9 && hour < 12) || (hour >= 14 && hour < 18)
  return peak ? 'peak' : 'offPeak'
}

/** Resolve the exact input/output rates that apply to one model request. */
export function priceOf(
  modelId: string,
  timeMs: number | undefined,
): Price & { tier: 'flat' | 'peak' | 'offPeak' } {
  const table = modelKey(modelId) === 'flash' ? FLASH_TABLE : PRO_TABLE
  const timestamp = timeMs ?? Date.now()
  if (timestamp < NEW_PRICE_EFFECTIVE_MS) return { ...table.old, tier: 'flat' }
  const tier = tierAt(timestamp)
  return { ...table[tier], tier }
}

/** Render the compact price explanation shown in the expanded card. */
export function pricingNote(modelId: string, timeMs?: number): string {
  const price = priceOf(modelId, timeMs)
  const when = price.tier === 'flat' ? '旧价表' : price.tier === 'peak' ? '高峰时段' : '空闲时段'
  return `${modelName(modelId)} · ${when} · 命中${price.hit}/未命中${price.miss}/输出${price.out} 元/M`
}
