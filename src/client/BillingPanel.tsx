/**
 * The sidebar-foot billing card: a fixed summary row (status dot, balance,
 * session cost, refresh, expand chevron) with an animated detail body.
 * Numbers roll between old and new values inside fixed-height slots; every
 * other element stays put while only the digits animate.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import css from './BillingPanel.module.css'

interface BillingBalance {
  currency: string
  total: number
  granted: number
  toppedUp: number
  available: boolean
}

interface BillingUsage {
  inputTokens: number
  cacheReadTokens: number
  cacheWriteTokens?: number
  outputTokens: number
  reasoningTokens: number
}

interface BillingCost {
  input: number
  output: number
  total: number
}

interface BillingTimings {
  balanceMs: number
  usageMs: number
  totalMs: number
}

/** JSON shape served by the node half's /billing/status route. */
interface BillingStatus {
  ok: boolean
  keyMissing: boolean
  balance: BillingBalance | null
  balanceError: string | null
  usage: BillingUsage | null
  usageError: string | null
  cost: BillingCost | null
  sessionId: string | null
  model: string | null
  pricingNote: string
  timings: BillingTimings | null
  updatedAtMs: number
}

interface LoadState {
  loading: boolean
  data: BillingStatus | null
  error: string | null
}

type Props = PropsRuntime<'sidebar.footer.action'>

const SIDE_MARGIN = 12
const REFRESH_INTERVAL_MS = 60000

function fmtTokens(v: number): string {
  if (!Number.isFinite(v)) return '0'
  if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M`
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`
  return String(Math.round(v))
}

function fmtMoney(v: number): string {
  return Number.isFinite(v) ? v.toFixed(2) : '0.00'
}

function fmtCost(v: number): string {
  if (!Number.isFinite(v) || v <= 0) return '¥0'
  if (v >= 100) return `¥${v.toFixed(2)}`
  if (v < 0.01) return `¥${v.toFixed(4)}`
  return `¥${v.toFixed(3)}`
}

function fmtTime(ms: number): string {
  try {
    return new Date(ms).toLocaleTimeString('zh-CN', { hour12: false })
  } catch (error) {
    return ''
  }
}

function moneyOf(b: BillingBalance | null | undefined): string {
  if (b === null || b === undefined) return '—'
  const symbol = b.currency === 'USD' ? '$' : '¥'
  const suffix = b.currency === 'USD' ? '' : '元'
  return symbol + fmtMoney(b.total) + suffix
}

function balanceShort(status: LoadState | null): string {
  const data = status?.data ?? null
  if (data === null) return '…'
  if (data.balance !== null && data.balance !== undefined) return moneyOf(data.balance)
  if (data.keyMissing === true) return '未配置 Key'
  return '—'
}

function costShort(status: LoadState | null): string {
  const data = status?.data ?? null
  if (data === null) return '…'
  if (data.cost !== null && data.cost !== undefined) return fmtCost(data.cost.total)
  return '—'
}

function dotClass(status: LoadState | null): string {
  const data = status?.data ?? null
  if (data !== null && data.keyMissing !== true && data.balance !== null && data.balance !== undefined) {
    return `${css.dot} ${css.ok}`
  }
  if (data !== null && (data.keyMissing === true || typeof data.balanceError === 'string')) {
    return `${css.dot} ${css.err}`
  }
  return css.dot ?? ''
}

/** Inline stroke icons in the web UI's 16px outline vocabulary. */
function svgIcon(size: number, children: ReactNode): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  )
}

function iconRefresh(): ReactNode {
  return svgIcon(11, <>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </>)
}

function iconChevron(): ReactNode {
  return svgIcon(10, <polyline points="6 15 12 9 18 15" />)
}

/**
 * Rolling number: the previous text rolls up and out while the new text
 * rolls in from below, both clipped inside one fixed-height line box.
 * @param props - the text to display.
 * @returns the animated value element.
 */
function AnimatedValue({ text }: { text: string }): ReactNode {
  const [display, setDisplay] = useState<{ current: string; previous: string | null }>({ current: text, previous: null })
  useEffect(() => {
    if (text === display.current) return undefined
    setDisplay({ current: text, previous: display.current })
    const timer = window.setTimeout(() => {
      setDisplay(d => ({ current: d.current, previous: null }))
    }, 340)
    return () => { window.clearTimeout(timer) }
  }, [text])
  if (display.previous === null) return <span className={css.nowrap}>{text}</span>
  return (
    <span className={css.roll}>
      <span className={css.rollOld} key="old">{display.previous}</span>
      <span className={css.rollNew} key="new">{display.current}</span>
    </span>
  )
}

/** Mount the fixed summary row with the expandable detail body. */
export function BillingPanel({ wide, useSessions }: Props): ReactNode {
  const [expanded, setExpanded] = useState(wide)
  const [status, setStatus] = useState<LoadState | null>(null)
  const [box, setBox] = useState({ left: SIDE_MARGIN, width: 280 - SIDE_MARGIN * 2 })
  const anchorRef = useRef<HTMLDivElement | null>(null)
  const popRef = useRef<HTMLDivElement | null>(null)

  const current = useSessions(state => state.current)
  const sessionId = current === undefined || current === null ? null : String(current)

  /** Measure the sidebar column through the component's own ancestor chain. */
  const measureColumn = (): void => {
    const anchor = anchorRef.current
    if (anchor === null) return
    let n: HTMLElement | null = anchor.parentElement
    while (n !== null && n.clientWidth === 0) n = n.parentElement
    if (n === null) return
    let best = n
    let lastWidth = n.clientWidth
    while (n !== null && n.parentElement !== null) {
      const p: HTMLElement | null = n.parentElement
      const pw = p.clientWidth
      if (pw === 0) { n = p; continue }
      if (pw <= lastWidth + 60) { n = p; best = p; lastWidth = pw; continue }
      break
    }
    const rect = best.getBoundingClientRect()
    const next = {
      left: Math.round(rect.left) + SIDE_MARGIN,
      width: Math.max(0, Math.round(rect.width) - SIDE_MARGIN * 2),
    }
    setBox(prev => (prev.left === next.left && prev.width === next.width ? prev : next))
  }

  useEffect(() => {
    if (!wide) return undefined
    let cancelled = false
    const refresh = async (): Promise<void> => {
      try {
        const res = await fetch(sessionId === null ? '/billing/status' : `/billing/status?sessionId=${encodeURIComponent(sessionId)}`)
        const data = await res.json() as BillingStatus
        if (!cancelled) setStatus({ loading: false, data, error: null })
      } catch (error) {
        if (!cancelled) setStatus({ loading: false, data: null, error: error instanceof Error ? error.message : String(error) })
      }
    }
    // Only the first mount shows the loading state; session switches keep the
    // old numbers so AnimatedValue can roll into the new ones.
    setStatus(prev => (prev === null ? { loading: true, data: null, error: null } : prev))
    void refresh()
    measureColumn()
    // The sidebar width is transitional during expand/collapse; re-measure
    // until it settles, then keep it fresh with every refresh.
    const settle1 = window.setTimeout(() => { measureColumn() }, 300)
    const settle2 = window.setTimeout(() => { measureColumn() }, 900)
    const settle3 = window.setTimeout(() => { measureColumn() }, 1800)
    const interval = window.setInterval(() => { void refresh(); measureColumn() }, REFRESH_INTERVAL_MS)
    return () => {
      cancelled = true
      window.clearTimeout(settle1)
      window.clearTimeout(settle2)
      window.clearTimeout(settle3)
      window.clearInterval(interval)
    }
  }, [sessionId, wide])

  // Re-expanding the sidebar reopens the detail body by default.
  useEffect(() => {
    if (wide) setExpanded(true)
  }, [wide])

  // Clicking outside the container collapses it.
  useEffect(() => {
    if (!wide) return undefined
    const doc = anchorRef.current?.ownerDocument
    if (doc === undefined) return undefined
    const onDocClick = (event: MouseEvent): void => {
      const target = event.target
      if (target === null || target === undefined) return
      const pop = popRef.current
      if (pop !== null && pop.contains(target as Node)) return
      setExpanded(false)
    }
    doc.addEventListener('click', onDocClick)
    return () => { doc.removeEventListener('click', onDocClick) }
  }, [wide])

  if (!wide) return null

  const refreshNow = (): void => {
    void (async () => {
      try {
        const res = await fetch(sessionId === null ? '/billing/status' : `/billing/status?sessionId=${encodeURIComponent(sessionId)}`)
        const data = await res.json() as BillingStatus
        setStatus({ loading: false, data, error: null })
      } catch (error) {
        setStatus({ loading: false, data: null, error: error instanceof Error ? error.message : String(error) })
      }
    })()
  }

  const boxStyle = { left: `${box.left}px`, width: `${box.width}px` }

  const bodyRows = ((): ReactNode[] => {
    const data = status?.data ?? null
    const loading = status !== null && status.loading === true && data === null
    if (loading) return [<div key="loading" className={css.sub}>加载中…</div>]
    if (data === null) {
      const msg = status !== null && typeof status.error === 'string' && status.error.length > 0 ? status.error : '未知错误'
      return [<div key="error" className={css.errText}>读取失败: {msg}</div>]
    }
    const rows: ReactNode[] = []
    if (data.keyMissing === true) {
      rows.push(<div key="missing" className={css.errText}>未配置 API Key</div>)
    } else if (data.balance !== null && data.balance !== undefined) {
      const b = data.balance
      const symbol = b.currency === 'USD' ? '$' : '¥'
      rows.push(
        <div key="topped-up" className={css.row}>
          <span className={css.k}>充值</span>
          <AnimatedValue text={symbol + fmtMoney(b.toppedUp)} />
        </div>,
        <div key="granted" className={css.row}>
          <span className={css.k}>赠送</span>
          <AnimatedValue text={symbol + fmtMoney(b.granted)} />
        </div>,
      )
      if (b.available !== true) rows.push(<div key="unavailable" className={css.errText}>官方标记余额不可用</div>)
    } else if (typeof data.balanceError === 'string' && data.balanceError.length > 0) {
      rows.push(<div key="balance-error" className={css.errText}>余额: {data.balanceError}</div>)
    }
    if (data.usage !== null && data.usage !== undefined && data.cost !== null && data.cost !== undefined) {
      const u = data.usage
      // Input uses the DSH stats-line口径: billed input = uncached + cache read + cache write.
      const billedInput = u.inputTokens + u.cacheReadTokens + (u.cacheWriteTokens ?? 0)
      rows.push(<div key="divider" className={css.divider} />)
      rows.push(
        <div key="input" className={css.row}>
          <span className={css.k}>输入</span>
          <AnimatedValue text={fmtTokens(billedInput)} />
        </div>,
      )
      if (u.cacheReadTokens > 0) {
        const pct = billedInput > 0 ? Math.round(u.cacheReadTokens / billedInput * 100) : 0
        rows.push(
          <div key="cache-hit" className={css.row}>
            <span className={css.k}>缓存命中</span>
            <AnimatedValue text={`${fmtTokens(u.cacheReadTokens)} (${pct}%)`} />
          </div>,
        )
      }
      rows.push(
        <div key="output" className={css.row}>
          <span className={css.k}>输出</span>
          <AnimatedValue text={fmtTokens(u.outputTokens)} />
        </div>,
      )
      if (typeof data.pricingNote === 'string' && data.pricingNote.length > 0) {
        rows.push(<div key="pricing" className={css.note}>{data.pricingNote}</div>)
      }
    } else if (typeof data.usageError === 'string' && data.usageError.length > 0) {
      rows.push(<div key="usage-error" className={css.errText}>用量: {data.usageError}</div>)
    }
    if (typeof data.updatedAtMs === 'number') {
      let noteText = `更新 ${fmtTime(data.updatedAtMs)}`
      if (data.timings !== null && data.timings !== undefined && typeof data.timings.totalMs === 'number') {
        noteText += ` · 获取 ${data.timings.totalMs}ms`
      }
      rows.push(<div key="updated" className={css.note}>{noteText}</div>)
    }
    return rows
  })()

  return (
    <div className={css.anchor} ref={anchorRef}>
      <div className={expanded ? `${css.pop} ${css.expanded}` : css.pop} style={boxStyle} ref={popRef}>
        <div
          className={css.head}
          role="button"
          aria-expanded={expanded}
          title={expanded ? '收起' : '展开详情'}
          onClick={() => { setExpanded(v => !v) }}
        >
          <div className={css.headLeft}>
            <span className={dotClass(status)} />
            <span className={css.label}>余额:</span>
            <span className={css.value}>
              <AnimatedValue text={balanceShort(status)} />
            </span>
          </div>
          <span className={css.spacer} />
          <span className={css.label}>会话:</span>
          <span className={css.valueSlot}>
            <AnimatedValue text={costShort(status)} />
          </span>
          <button
            type="button"
            className={css.iconBtn}
            title="刷新"
            onClick={(event) => { event.stopPropagation(); refreshNow() }}
          >
            {iconRefresh()}
          </button>
          <span className={css.chevron}>{iconChevron()}</span>
        </div>
        <div className={css.body}>
          <div className={css.bodyInner}>
            {bodyRows}
          </div>
        </div>
      </div>
    </div>
  )
}
