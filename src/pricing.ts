interface Price {
  hit: number
  miss: number
  out: number
}

/** Peak/off-peak split inside one tiered era. */
type SplitTier = 'peak' | 'offPeak'

/** Billing tier that produced a resolved price. */
export type Tier = 'flat' | SplitTier

/** The two price tables DeepSeek bills model requests against. */
export type Family = 'flash' | 'pro'

/** Off-peak and peak rates for one family inside one tiered era. */
interface TierRates {
  offPeak: Price
  peak: Price
}

interface BaseEra {
  /** Inclusive start of the era, in epoch milliseconds. */
  from: number
  /** The boundaries as published, kept for the changelog trail. */
  label: string
}

/** One rate for every hour, used before DeepSeek introduced peak pricing. */
interface FlatEra extends BaseEra {
  kind: 'flat'
  flash: Price
  pro: Price
}

/** Peak/off-peak rates; whether peak covers every day or only weekdays. */
interface TieredEra extends BaseEra {
  kind: 'tiered'
  weekdayOnly: boolean
  flash: TierRates
  pro: TierRates
}

type Era = FlatEra | TieredEra

/** China Standard Time offset, the time zone every official boundary is published in. */
const CST_OFFSET_MS = 8 * 60 * 60 * 1000

/** Parse a China Standard Time wall-clock instant into epoch milliseconds. */
function cst(instant: string): number {
  return Date.parse(`${instant}+08:00`)
}

const LEGACY_ERA: FlatEra = {
  kind: 'flat',
  from: Number.NEGATIVE_INFINITY,
  label: '2026-08-17 之前的旧价表',
  flash: { hit: 0.02, miss: 1, out: 2 },
  pro: { hit: 0.025, miss: 3, out: 6 },
}

/**
 * Official price eras, oldest first. DeepSeek publishes each change as a
 * China Standard Time boundary, so a request is charged with the rates that
 * were in force when that request was made. Adding a new official change means
 * appending one era here — never editing an earlier one.
 */
const ERAS: readonly Era[] = [
  LEGACY_ERA,
  {
    kind: 'tiered',
    from: cst('2026-08-17T00:00:00'),
    label: '2026-08-17 峰谷定价',
    // 该版公告只写"北京时间 9:00-12:00、14:00-18:00",不区分工作日与周末。
    weekdayOnly: false,
    flash: { offPeak: { hit: 0.05, miss: 1.5, out: 4.5 }, peak: { hit: 0.1, miss: 3, out: 9 } },
    pro: { offPeak: { hit: 0.15, miss: 4.5, out: 13.5 }, peak: { hit: 0.3, miss: 9, out: 27 } },
  },
  {
    kind: 'tiered',
    from: cst('2026-09-10T12:00:00'),
    label: '2026-09-10 V4.1-Flash 新价',
    // 该版公告明确"工作日 9:00-12:00、14:00-18:00,其余时段含周末均为空闲时段"。
    weekdayOnly: true,
    flash: { offPeak: { hit: 0.02, miss: 1, out: 4 }, peak: { hit: 0.04, miss: 2, out: 8 } },
    pro: { offPeak: { hit: 0.15, miss: 4.5, out: 13.5 }, peak: { hit: 0.3, miss: 9, out: 27 } },
  },
]

/** 北京时间 2026-09-14 12:00 起,deepseek-v4-pro 的请求全部路由到 V4.1-Flash,并按 Flash 价格计费。 */
const PRO_ROUTED_TO_FLASH_MS = cst('2026-09-14T12:00:00')

/** Resolve the era that was in force at one instant. */
function eraAt(timeMs: number): Era {
  let current: Era = LEGACY_ERA
  for (const era of ERAS) {
    if (timeMs >= era.from) current = era
  }
  return current
}

/** Classify a model id into the price table its own name belongs to. */
export function modelKey(modelId: string): Family {
  if (modelId.length === 0) return 'pro'
  return modelId.toLowerCase().includes('flash') ? 'flash' : 'pro'
}

/** True only when the id names a Pro-family model rather than an unrecognized one. */
function namesProModel(modelId: string): boolean {
  return modelId.toLowerCase().includes('pro')
}

/** Resolve the family a request is actually billed as at one instant. */
export function billedFamily(modelId: string, timeMs?: number): Family {
  if (modelKey(modelId) === 'flash') return 'flash'
  const timestamp = timeMs ?? Date.now()
  if (namesProModel(modelId) && timestamp >= PRO_ROUTED_TO_FLASH_MS) return 'flash'
  return 'pro'
}

/** Resolve the China Standard Time peak/off-peak tier for one timestamp. */
export function tierAt(timeMs?: number, weekdayOnly = true): SplitTier {
  const moment = new Date((timeMs ?? Date.now()) + CST_OFFSET_MS)
  const hour = moment.getUTCHours()
  if (!((hour >= 9 && hour < 12) || (hour >= 14 && hour < 18))) return 'offPeak'
  if (!weekdayOnly) return 'peak'
  const day = moment.getUTCDay()
  return day === 0 || day === 6 ? 'offPeak' : 'peak'
}

/** Resolve the exact input/output rates that apply to one model request. */
export function priceOf(modelId: string, timeMs?: number): Price & { tier: Tier } {
  const timestamp = timeMs ?? Date.now()
  const era = eraAt(timestamp)
  const family = billedFamily(modelId, timestamp)
  if (era.kind === 'flat') return { ...era[family], tier: 'flat' }
  const tier = tierAt(timestamp, era.weekdayOnly)
  return { ...era[family][tier], tier }
}

function modelName(modelId: string, timeMs?: number): string {
  return billedFamily(modelId, timeMs) === 'flash' ? 'DeepSeek-V4.1-Flash' : 'DeepSeek-V4-Pro'
}

/** Render the compact price explanation shown in the expanded card. */
export function pricingNote(modelId: string, timeMs?: number): string {
  const timestamp = timeMs ?? Date.now()
  const price = priceOf(modelId, timestamp)
  const when = price.tier === 'flat' ? '旧价表' : price.tier === 'peak' ? '高峰时段' : '空闲时段'
  return `${modelName(modelId, timestamp)} · ${when} · 命中${price.hit}/未命中${price.miss}/输出${price.out} 元/M`
}
