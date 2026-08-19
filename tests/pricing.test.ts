import assert from 'node:assert/strict'
import test from 'node:test'
import { modelKey, priceOf, pricingNote, tierAt } from '../src/pricing.ts'

void test('classifies Flash separately and defaults unknown models to Pro', () => {
  assert.equal(modelKey('DeepSeek-V4-Flash'), 'flash')
  assert.equal(modelKey('deepseek-v4-pro'), 'pro')
  assert.equal(modelKey('unknown'), 'pro')
})

void test('uses the legacy table before the 2026-08-17 change', () => {
  assert.deepEqual(priceOf('DeepSeek-V4-Flash', Date.parse('2026-08-16T15:59:59Z')), {
    hit: 0.02,
    miss: 1,
    out: 2,
    tier: 'flat',
  })
})

void test('selects peak and off-peak rates in China Standard Time', () => {
  const peak = Date.parse('2026-08-17T02:00:00Z') // 10:00 CST
  const offPeak = Date.parse('2026-08-17T05:00:00Z') // 13:00 CST
  assert.equal(tierAt(peak), 'peak')
  assert.equal(tierAt(offPeak), 'offPeak')
  assert.deepEqual(priceOf('DeepSeek-V4-Pro', peak), {
    hit: 0.3,
    miss: 9,
    out: 27,
    tier: 'peak',
  })
  assert.match(pricingNote('DeepSeek-V4-Pro', offPeak), /空闲时段/)
})
