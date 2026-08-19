import assert from 'node:assert/strict'
import test from 'node:test'
import type { LoadState } from '../src/client/api.ts'
import { balanceShort, costShort, fmtCost, fmtTokens, statusKind } from '../src/client/format.ts'

void test('formats compact token and cost values at display thresholds', () => {
  assert.equal(fmtTokens(999), '999')
  assert.equal(fmtTokens(1_500), '1.5K')
  assert.equal(fmtTokens(2_500_000), '2.50M')
  assert.equal(fmtCost(0), '¥0')
  assert.equal(fmtCost(0.005), '¥0.0050')
  assert.equal(fmtCost(1.2345), '¥1.234')
})

void test('derives summary text and state from one loaded response', () => {
  const status: LoadState = {
    loading: false,
    error: null,
    data: {
      ok: true,
      keyMissing: false,
      balance: { currency: 'CNY', total: 12.34, granted: 0, toppedUp: 12.34, available: true },
      balanceError: null,
      usage: null,
      usageError: null,
      cost: { input: 0.1, output: 0.2, total: 0.3 },
      sessionId: 's1',
      model: 'DeepSeek-V4-Pro',
      pricingNote: '',
      timings: null,
      updatedAtMs: 0,
    },
  }
  assert.equal(balanceShort(status), '¥12.34元')
  assert.equal(costShort(status), '¥0.300')
  assert.equal(statusKind(status), 'ok')
})
