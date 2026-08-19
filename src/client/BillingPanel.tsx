/** Compact DeepSeek balance and session-cost card for the official sidebar footer. */
import { useEffect, useState, type ReactNode } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import { AnimatedValue } from './AnimatedValue.tsx'
import { errorMessage, loadBillingStatus, type LoadState } from './api.ts'
import { BillingDetails } from './BillingDetails.tsx'
import { balanceShort, costShort, statusKind } from './format.ts'
import { ChevronIcon, RefreshIcon } from './icons.tsx'
import css from './BillingPanel.module.css'

type Props = PropsRuntime<'sidebar.footer.action'>

const REFRESH_INTERVAL_MS = 60000

/** Mount the compact status row with the in-flow expandable detail body. */
export function BillingPanel({ wide, useSessions }: Props): ReactNode {
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState<LoadState | null>(null)
  const currentSession = useSessions(state => state.current)
  const sessionId = currentSession === undefined ? null : String(currentSession)

  useEffect(() => {
    if (!wide) return undefined
    let cancelled = false
    const refresh = async (): Promise<void> => {
      try {
        const data = await loadBillingStatus(sessionId)
        if (!cancelled) setStatus({ loading: false, data, error: null })
      } catch (error) {
        if (!cancelled) setStatus({ loading: false, data: null, error: errorMessage(error) })
      }
    }
    setStatus(previous => previous ?? { loading: true, data: null, error: null })
    void refresh()
    const interval = window.setInterval(() => { void refresh() }, REFRESH_INTERVAL_MS)
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [sessionId, wide])

  if (!wide) return null

  const refreshNow = (): void => {
    void loadBillingStatus(sessionId).then(
      (data) => { setStatus({ loading: false, data, error: null }) },
      (error: unknown) => { setStatus({ loading: false, data: null, error: errorMessage(error) }) },
    )
  }
  const kind = statusKind(status)
  const dotClass = kind === 'ok'
    ? `${css.dot} ${css.ok}`
    : kind === 'error' ? `${css.dot} ${css.err}` : css.dot

  return (
    <div className={expanded ? `${css.card} ${css.expanded}` : css.card}>
      <div
        className={css.head}
        role="button"
        aria-expanded={expanded}
        title={(expanded ? '收起 · ' : '展开详情 · ') + '当前会话费用估算(非账单)'}
        onClick={() => { setExpanded(value => !value) }}
      >
        <div className={css.headLeft}>
          <span className={dotClass} />
          <span className={css.label}>余额:</span>
          <span className={css.value}><AnimatedValue text={balanceShort(status)} /></span>
        </div>
        <span className={css.spacer} />
        <span className={css.label} title="当前会话费用估算(非账单)">会话:</span>
        <span className={css.valueSlot}><AnimatedValue text={costShort(status)} /></span>
        <button
          type="button"
          className={css.iconBtn}
          title="刷新"
          onClick={(event) => { event.stopPropagation(); refreshNow() }}
        >
          <RefreshIcon />
        </button>
        <span className={css.chevron}><ChevronIcon /></span>
      </div>
      <div className={css.body}>
        <div className={css.bodyInner}>
          <div className={css.scroll}><BillingDetails status={status} /></div>
        </div>
      </div>
    </div>
  )
}
