export function trackEvent(providerId: string, eventType: string, metadata?: Record<string, unknown>) {
  if (typeof window === 'undefined') return

  fetch('/api/events/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ providerId, eventType, metadata }),
    keepalive: true,
  }).catch(() => {
    // Silently fail - analytics should never break the user experience
  })
}
