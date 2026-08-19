import { priceOf, pricingNote } from './pricing.ts'
import type { BillingUsage, FoldedUsage } from './types.ts'

function positiveNumber(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

/** Fold successful assistant-message usage into disjoint token and cost buckets. */
export function foldUsage(events: readonly unknown[]): FoldedUsage {
  const usage: BillingUsage = {
    inputTokens: 0,
    cacheReadTokens: 0,
    outputTokens: 0,
    reasoningTokens: 0,
  }
  let inputCost = 0
  let outputCost = 0
  let lastModel: string | null = null

  for (const raw of events) {
    if (raw === null || typeof raw !== 'object') continue
    const event = raw as { type?: unknown; time?: unknown; data?: unknown }
    if (event.type !== 'assistant/message' || event.data === null || typeof event.data !== 'object') continue
    const data = event.data as { usage?: unknown; message?: { source?: { model?: unknown } } }
    if (data.usage === null || typeof data.usage !== 'object') continue

    const usageSource = data.usage as {
      inputTokens?: unknown
      cacheReadTokens?: unknown
      outputTokens?: unknown
      reasoningTokens?: unknown
    }
    const model = typeof data.message?.source?.model === 'string' && data.message.source.model.length > 0
      ? data.message.source.model
      : 'unknown'
    const input = positiveNumber(usageSource.inputTokens)
    const cacheRead = positiveNumber(usageSource.cacheReadTokens)
    const output = positiveNumber(usageSource.outputTokens)
    const reasoning = positiveNumber(usageSource.reasoningTokens)

    usage.inputTokens += input
    usage.cacheReadTokens += cacheRead
    usage.outputTokens += output
    usage.reasoningTokens += reasoning
    lastModel = model

    const price = priceOf(model, typeof event.time === 'number' ? event.time : undefined)
    inputCost += (input * price.miss + cacheRead * price.hit) / 1e6
    outputCost += output * price.out / 1e6
  }

  return {
    usage,
    cost: { input: inputCost, output: outputCost, total: inputCost + outputCost },
    model: lastModel,
    pricingNote: lastModel === null ? '' : pricingNote(lastModel),
  }
}
