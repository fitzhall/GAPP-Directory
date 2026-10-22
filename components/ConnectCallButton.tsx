'use client'

import { useState, type ReactNode } from 'react'
import { trackEvent } from '@/lib/track'

interface Props {
  providerId: string
  /** Dialed when the connect line is off or slow. Null on unclaimed pages, where the agency number is not shown. */
  fallbackTel: string | null
  className?: string
  children: ReactNode
}

// "Call {Agency}" on a non-verified listing. On tap the page asks for a
// GeorgiaGAPP pool number tied to this listing for a few minutes, then dials
// it; the call forwards to the agency and the site sees it. If the request
// fails or takes over two seconds, the agency's own number is dialed instead.
export function ConnectCallButton({ providerId, fallbackTel, className, children }: Props) {
  const [busy, setBusy] = useState(false)

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    trackEvent(providerId, 'click_phone', { connect: true })

    let number: string | null = null
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 2000)
    try {
      const res = await fetch('/api/connect/number', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId }),
        signal: ctrl.signal,
      })
      const data = await res.json()
      if (typeof data?.number === 'string') number = data.number
    } catch {
      // fall through to the agency's own number
    } finally {
      clearTimeout(timer)
      setBusy(false)
    }

    const target = number || fallbackTel
    if (target) window.location.href = `tel:${target}`
  }

  return (
    <a href={fallbackTel ? `tel:${fallbackTel}` : '#'} onClick={handleClick} className={className} aria-busy={busy}>
      {children}
    </a>
  )
}
