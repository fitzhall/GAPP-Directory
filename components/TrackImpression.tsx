'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/track'

export function TrackImpression({ providerId, children }: { providerId: string, children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const tracked = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true
          trackEvent(providerId, 'impression')
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [providerId])

  return <div ref={ref}>{children}</div>
}
