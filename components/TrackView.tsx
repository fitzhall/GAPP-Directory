'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/track'

export function TrackView({ providerId }: { providerId: string }) {
  useEffect(() => {
    trackEvent(providerId, 'view')
  }, [providerId])

  return null
}
