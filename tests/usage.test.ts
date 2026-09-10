import assert from 'node:assert/strict'
import test from 'node:test'
import { foldUsage } from '../src/usage.ts'

void test('folds successful messages into disjoint token and cost buckets', () => {
  const result = foldUsage([
    { type: 'user/message', data: { usage: { inputTokens: 999 } } },
    {
      type: 'assistant/message',
      time: Date.parse('2026-08-17T05:00:00Z'), // Flash off-peak
      data: {
        usage: {
          inputTokens: 1_000_000,
          cacheReadTokens: 500_000,
          outputTokens: 200_000,
          reasoningTokens: 50_000,
        },
        message: { source: { model: 'DeepSeek-V4-Flash' } },
      },
    },
  ])

  assert.deepEqual(result.usage, {
    inputTokens: 1_000_000,
    cacheReadTokens: 500_000,
    outputTokens: 200_000,
    reasoningTokens: 50_000,
  })
  assert.equal(result.cost.input, 1.525)
  assert.equal(result.cost.output, 0.9)
  assert.equal(result.cost.total, 2.425)
  assert.equal(result.model, 'DeepSeek-V4-Flash')
  assert.match(result.pricingNote, /DeepSeek-V4\.1-Flash/)
})

void test('charges requests after the 2026-09-10 cut at the V4.1-Flash rates', () => {
  const result = foldUsage([
    {
      type: 'assistant/message',
      time: Date.parse('2026-09-10T05:00:00Z'), // Thursday 13:00 CST, off-peak
      data: {
        usage: { inputTokens: 1_000_000, cacheReadTokens: 500_000, outputTokens: 200_000 },
        message: { source: { model: 'deepseek-flash' } },
      },
    },
  ])

  assert.equal(result.cost.input, 1.01)
  assert.equal(result.cost.output, 0.8)
  assert.equal(result.cost.total, 1.81)
  assert.equal(result.model, 'deepseek-flash')
})

void test('ignores malformed events and clamps invalid usage to zero', () => {
  const result = foldUsage([
    null,
    { type: 'assistant/message', data: null },
    {
      type: 'assistant/message',
      time: Date.parse('2026-08-17T02:00:00Z'),
      data: {
        usage: { inputTokens: -1, cacheReadTokens: 'bad', outputTokens: Number.NaN },
        message: { source: { model: '' } },
      },
    },
  ])
  assert.deepEqual(result.usage, {
    inputTokens: 0,
    cacheReadTokens: 0,
    outputTokens: 0,
    reasoningTokens: 0,
  })
  assert.equal(result.cost.total, 0)
  assert.equal(result.model, 'unknown')
})
