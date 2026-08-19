import type { ReactNode } from 'react'

function svgIcon(size: number, children: ReactNode): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  )
}

export function RefreshIcon(): ReactNode {
  return svgIcon(11, <>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </>)
}

export function ChevronIcon(): ReactNode {
  return svgIcon(10, <polyline points="6 15 12 9 18 15" />)
}
