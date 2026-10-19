'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/track'
import { shouldTrackView } from '@/lib/track-once'

export function TrackView({ providerId }: { providerId: string }) {
  useEffect(() => {
    const storage = typeof window !== 'undefined' ? window.sessionStorage : undefined
    if (!shouldTrackView(providerId, storage)) return
    // document.referrer is the page the family came from (Google, the
    // directory, a county page); the server only sees the page itself.
    const from = typeof document !== 'undefined' ? document.referrer : ''
    trackEvent(providerId, 'view', from ? { from: from.slice(0, 200) } : undefined)
  }, [providerId])

  return null
}
