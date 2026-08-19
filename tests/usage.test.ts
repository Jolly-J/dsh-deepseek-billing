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
  assert.match(result.pricingNote, /DeepSeek-V4-Flash/)
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
