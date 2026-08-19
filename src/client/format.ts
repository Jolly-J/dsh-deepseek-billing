import type { BillingBalance } from '../types.ts'
import type { LoadState } from './api.ts'

export function fmtTokens(value: number): string {
  if (!Number.isFinite(value)) return '0'
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`
  return String(Math.round(value))
}

export function fmtMoney(value: number): string {
  return Number.isFinite(value) ? value.toFixed(2) : '0.00'
}

export function fmtCost(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '¥0'
  if (value >= 100) return `¥${value.toFixed(2)}`
  if (value < 0.01) return `¥${value.toFixed(4)}`
  return `¥${value.toFixed(3)}`
}

export function fmtTime(timeMs: number): string {
  try {
    return new Date(timeMs).toLocaleTimeString('zh-CN', { hour12: false })
  } catch {
    return ''
  }
}

function moneyOf(balance: BillingBalance | null | undefined): string {
  if (balance === null || balance === undefined) return '—'
  const symbol = balance.currency === 'USD' ? '$' : '¥'
  const suffix = balance.currency === 'USD' ? '' : '元'
  return symbol + fmtMoney(balance.total) + suffix
}

export function balanceShort(status: LoadState | null): string {
  const data = status?.data ?? null
  if (data === null) return '…'
  if (data.balance !== null) return moneyOf(data.balance)
  return data.keyMissing ? '未配置 Key' : '—'
}

export function costShort(status: LoadState | null): string {
  const data = status?.data ?? null
  if (data === null) return '…'
  return data.cost === null ? '—' : fmtCost(data.cost.total)
}

export function statusKind(status: LoadState | null): 'ok' | 'error' | 'idle' {
  const data = status?.data ?? null
  if (data !== null && !data.keyMissing && data.balance !== null) return 'ok'
  if (data !== null && (data.keyMissing || typeof data.balanceError === 'string')) return 'error'
  return 'idle'
}
