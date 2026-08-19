import type { ReactNode } from 'react'
import type { LoadState } from './api.ts'
import { AnimatedValue } from './AnimatedValue.tsx'
import { fmtMoney, fmtTime, fmtTokens } from './format.ts'
import css from './BillingPanel.module.css'

/** Render the expanded balance, token, pricing, and timing rows. */
export function BillingDetails({ status }: { status: LoadState | null }): ReactNode {
  const data = status?.data ?? null
  const loading = status?.loading === true && data === null
  if (loading) return <div className={css.sub}>加载中…</div>
  if (data === null) {
    const message = status?.error !== null && status?.error !== undefined && status.error.length > 0
      ? status.error
      : '未知错误'
    return <div className={css.errText}>读取失败: {message}</div>
  }

  const balanceRows: ReactNode[] = []
  if (data.keyMissing) {
    balanceRows.push(<div key="missing" className={css.errText}>未配置 API Key</div>)
  } else if (data.balance !== null) {
    const symbol = data.balance.currency === 'USD' ? '$' : '¥'
    balanceRows.push(
      <div key="topped-up" className={css.row}>
        <span className={css.k}>充值</span>
        <AnimatedValue text={symbol + fmtMoney(data.balance.toppedUp)} />
      </div>,
      <div key="granted" className={css.row}>
        <span className={css.k}>赠送</span>
        <AnimatedValue text={symbol + fmtMoney(data.balance.granted)} />
      </div>,
    )
    if (!data.balance.available) {
      balanceRows.push(<div key="unavailable" className={css.errText}>官方标记余额不可用</div>)
    }
  } else if (typeof data.balanceError === 'string' && data.balanceError.length > 0) {
    balanceRows.push(<div key="balance-error" className={css.errText}>余额: {data.balanceError}</div>)
  }

  const usageRows: ReactNode[] = []
  if (data.usage !== null && data.cost !== null) {
    const billedInput = data.usage.inputTokens + data.usage.cacheReadTokens + (data.usage.cacheWriteTokens ?? 0)
    usageRows.push(<div key="divider" className={css.divider} />)
    usageRows.push(
      <div key="input" className={css.row}>
        <span className={css.k}>输入</span>
        <AnimatedValue text={fmtTokens(billedInput)} />
      </div>,
    )
    if (data.usage.cacheReadTokens > 0) {
      const percentage = billedInput > 0 ? Math.round(data.usage.cacheReadTokens / billedInput * 100) : 0
      usageRows.push(
        <div key="cache-hit" className={css.row}>
          <span className={css.k}>缓存命中</span>
          <AnimatedValue text={`${fmtTokens(data.usage.cacheReadTokens)} (${percentage}%)`} />
        </div>,
      )
    }
    usageRows.push(
      <div key="output" className={css.row}>
        <span className={css.k}>输出</span>
        <AnimatedValue text={fmtTokens(data.usage.outputTokens)} />
      </div>,
    )
    if (data.pricingNote.length > 0) {
      usageRows.push(<div key="pricing" className={css.note}>{data.pricingNote}</div>)
    }
    usageRows.push(
      <div key="disclaimer" className={css.note}>
        费用为估算(非账单):仅计会话内成功请求,不含失败重试与余额入账延迟
      </div>,
    )
  } else if (typeof data.usageError === 'string' && data.usageError.length > 0) {
    usageRows.push(<div key="usage-error" className={css.errText}>用量: {data.usageError}</div>)
  }

  let timingText = `更新 ${fmtTime(data.updatedAtMs)}`
  if (data.timings !== null) timingText += ` · 获取 ${data.timings.totalMs}ms`
  return <>{balanceRows}{usageRows}<div className={css.note}>{timingText}</div></>
}
