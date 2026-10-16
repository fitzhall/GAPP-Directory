'use client'

import { trackEvent } from '@/lib/track'

interface TrackableLinkProps {
  href: string
  providerId: string
  eventType: string
  className?: string
  target?: string
  rel?: string
  onClick?: (e: React.MouseEvent) => void
  metadata?: Record<string, unknown>
  children: React.ReactNode
}

export function TrackableLink({ href, providerId, eventType, children, onClick, metadata, ...props }: TrackableLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    trackEvent(providerId, eventType, metadata)
    onClick?.(e)
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
