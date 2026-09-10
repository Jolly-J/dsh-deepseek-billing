import assert from 'node:assert/strict'
import test from 'node:test'
import { billedFamily, modelKey, priceOf, pricingNote, tierAt } from '../src/pricing.ts'

void test('classifies Flash separately and defaults unknown models to Pro', () => {
  assert.equal(modelKey('DeepSeek-V4-Flash'), 'flash')
  assert.equal(modelKey('deepseek-flash'), 'flash')
  assert.equal(modelKey('deepseek-v4-flash-vision-exp'), 'flash')
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
  const peak = Date.parse('2026-08-17T02:00:00Z') // Monday 10:00 CST
  const offPeak = Date.parse('2026-08-17T05:00:00Z') // Monday 13:00 CST
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

void test('applies the 2026-09-10 12:00 CST V4.1-Flash table to later requests', () => {
  const beforeCut = Date.parse('2026-09-09T05:00:00Z') // Wednesday 13:00 CST
  const afterCut = Date.parse('2026-09-10T05:00:00Z') // Thursday 13:00 CST
  const peak = Date.parse('2026-09-11T02:00:00Z') // Friday 10:00 CST, first weekday peak after the cut
  assert.deepEqual(priceOf('deepseek-flash', beforeCut), {
    hit: 0.05,
    miss: 1.5,
    out: 4.5,
    tier: 'offPeak',
  })
  assert.deepEqual(priceOf('deepseek-flash', afterCut), {
    hit: 0.02,
    miss: 1,
    out: 4,
    tier: 'offPeak',
  })
  assert.deepEqual(priceOf('deepseek-flash', peak), {
    hit: 0.04,
    miss: 2,
    out: 8,
    tier: 'peak',
  })
  assert.deepEqual(priceOf('deepseek-v4-flash-vision-exp', afterCut), {
    hit: 0.02,
    miss: 1,
    out: 4,
    tier: 'offPeak',
  })
  assert.equal(
    pricingNote('deepseek-flash', afterCut),
    'DeepSeek-V4.1-Flash · 空闲时段 · 命中0.02/未命中1/输出4 元/M',
  )
})

void test('treats weekends as off-peak only from the 2026-09-10 table on', () => {
  const weekendBeforeCut = Date.parse('2026-08-22T02:00:00Z') // Saturday 10:00 CST
  const weekendAfterCut = Date.parse('2026-09-12T02:00:00Z') // Saturday 10:00 CST
  const weekdayAfterCut = Date.parse('2026-09-14T02:00:00Z') // Monday 10:00 CST
  assert.deepEqual(priceOf('deepseek-flash', weekendBeforeCut), {
    hit: 0.1,
    miss: 3,
    out: 9,
    tier: 'peak',
  })
  assert.deepEqual(priceOf('deepseek-flash', weekendAfterCut), {
    hit: 0.02,
    miss: 1,
    out: 4,
    tier: 'offPeak',
  })
  assert.deepEqual(priceOf('deepseek-flash', weekdayAfterCut), {
    hit: 0.04,
    miss: 2,
    out: 8,
    tier: 'peak',
  })
})

void test('bills deepseek-v4-pro at V4.1-Flash rates from 2026-09-14 12:00 CST', () => {
  const beforeRoute = Date.parse('2026-09-14T03:59:00Z') // Monday 11:59 CST
  const afterRoute = Date.parse('2026-09-14T04:01:00Z') // Monday 12:01 CST
  assert.equal(billedFamily('deepseek-v4-pro', beforeRoute), 'pro')
  assert.equal(billedFamily('deepseek-v4-pro', afterRoute), 'flash')
  assert.deepEqual(priceOf('deepseek-v4-pro', beforeRoute), {
    hit: 0.3,
    miss: 9,
    out: 27,
    tier: 'peak',
  })
  assert.deepEqual(priceOf('deepseek-v4-pro', afterRoute), {
    hit: 0.02,
    miss: 1,
    out: 4,
    tier: 'offPeak',
  })
  assert.equal(billedFamily('unknown', afterRoute), 'pro')
  assert.match(pricingNote('deepseek-v4-pro', afterRoute), /DeepSeek-V4\.1-Flash/)
})
