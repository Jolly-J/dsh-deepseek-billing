import assert from 'node:assert/strict'
import test from 'node:test'
import type { Context } from '@deepseek-ai/cordis'
import { fetchBalance } from '../src/balance.ts'

void test('passes the credential through the shell environment, never argv', async () => {
  let captured: { command: string; env?: Record<string, string> } | undefined
  const shell = {
    resolve(request: { command: string; env?: Record<string, string> }) {
      captured = request
      return request
    },
    async run() {
      return {
        exitCode: 0,
        stdout: {
          text: JSON.stringify({
            is_available: true,
            balance_infos: [{
              currency: 'CNY',
              total_balance: '12.34',
              granted_balance: '2.00',
              topped_up_balance: '10.34',
            }],
          }),
        },
      }
    },
  }
  const ctx = { get: (name: string) => name === 'shell' ? shell : undefined } as unknown as Context
  const result = await fetchBalance(ctx, 'super-secret', 'DEEPSEEK_API_KEY', 'https://api.deepseek.com/')

  assert.equal(captured?.command.includes('super-secret'), false)
  assert.match(captured?.command ?? '', /\$DEEPSEEK_API_KEY/)
  assert.equal(captured?.env?.DEEPSEEK_API_KEY, 'super-secret')
  assert.deepEqual(result.balance, {
    currency: 'CNY',
    total: 12.34,
    granted: 2,
    toppedUp: 10.34,
    available: true,
  })
})

void test('reports a missing credential without invoking shell', async () => {
  const ctx = { get: () => { throw new Error('shell should not be read') } } as unknown as Context
  const result = await fetchBalance(ctx, null, 'CUSTOM_KEY', 'https://api.deepseek.com')
  assert.equal(result.keyMissing, true)
  assert.equal(result.balanceError, '未找到 API Key(CUSTOM_KEY)')
})
