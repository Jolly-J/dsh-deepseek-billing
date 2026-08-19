import { useEffect, useState, type ReactNode } from 'react'
import css from './BillingPanel.module.css'

/** Roll changed text through one fixed-height line box. */
export function AnimatedValue({ text }: { text: string }): ReactNode {
  const [display, setDisplay] = useState<{ current: string; previous: string | null }>({
    current: text,
    previous: null,
  })
  useEffect(() => {
    if (text === display.current) return undefined
    setDisplay({ current: text, previous: display.current })
    const timer = window.setTimeout(() => {
      setDisplay(value => ({ current: value.current, previous: null }))
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
