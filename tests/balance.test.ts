import assert from 'node:assert/strict'
import test from 'node:test'
import { fetchBalance } from '../src/balance.ts'

interface FetchCall {
  url: string
  init: RequestInit
}

const BALANCE_JSON = JSON.stringify({
  is_available: true,
  balance_infos: [{
    currency: 'CNY',
    total_balance: '12.34',
    granted_balance: '2.00',
    topped_up_balance: '10.34',
  }],
})

function mockFetch(handler: (call: FetchCall) => Response): { calls: FetchCall[]; restore: () => void } {
  const original = globalThis.fetch
  const calls: FetchCall[] = []
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const call: FetchCall = { url: String(input), init: init ?? {} }
    calls.push(call)
    return handler(call)
  }) as typeof fetch
  return {
    calls,
    restore: () => { globalThis.fetch = original },
  }
}

void test('sends the key only in the Authorization header, never in the URL', async () => {
  const { calls, restore } = mockFetch(() => new Response(BALANCE_JSON, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  }))
  try {
    const result = await fetchBalance('super-secret', 'DEEPSEEK_API_KEY', 'https://api.deepseek.com/')
    assert.equal(calls.length, 1)
    assert.equal(calls[0]!.url, 'https://api.deepseek.com/user/balance')
    assert.equal(calls[0]!.url.includes('super-secret'), false)
    assert.equal(new Headers(calls[0]!.init.headers).get('Authorization'), 'Bearer super-secret')
    assert.deepEqual(result.balance, {
      currency: 'CNY',
      total: 12.34,
      granted: 2,
      toppedUp: 10.34,
      available: true,
    })
  } finally {
    restore()
  }
})

void test('reports a missing credential without any network call', async () => {
  const { calls, restore } = mockFetch(() => {
    throw new Error('fetch should not be called')
  })
  try {
    const result = await fetchBalance(null, 'CUSTOM_KEY', 'https://api.deepseek.com')
    assert.equal(result.keyMissing, true)
    assert.equal(result.balanceError, '未找到 API Key(CUSTOM_KEY)')
    assert.equal(calls.length, 0)
  } finally {
    restore()
  }
})

void test('turns a plain-text authentication failure into a readable error', async () => {
  const { restore } = mockFetch(() => new Response('Authentication Fails (auth header format should be Bearer sk-...)', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  }))
  try {
    const result = await fetchBalance('bad-key', 'DEEPSEEK_API_KEY', 'https://api.deepseek.com')
    assert.equal(result.balance, null)
    assert.match(result.balanceError ?? '', /不是有效 JSON/)
    assert.match(result.balanceError ?? '', /Authentication Fails/)
    assert.doesNotMatch(result.balanceError ?? '', /Unexpected token/)
  } finally {
    restore()
  }
})

void test('surfaces the HTTP status for non-2xx responses', async () => {
  const { restore } = mockFetch(() => new Response('Unauthorized', {
    status: 401,
    statusText: 'Unauthorized',
  }))
  try {
    const result = await fetchBalance('bad-key', 'DEEPSEEK_API_KEY', 'https://api.deepseek.com')
    assert.equal(result.balance, null)
    assert.match(result.balanceError ?? '', /401/)
    assert.match(result.balanceError ?? '', /Unauthorized/)
  } finally {
    restore()
  }
})
