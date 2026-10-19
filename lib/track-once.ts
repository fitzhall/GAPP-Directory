// A profile view is counted once per listing per browser session. A reload,
// or the owner refreshing their own page five times, is not five families.

export const VIEW_KEY_PREFIX = 'gapp-viewed:'

export function shouldTrackView(providerId: string, storage: Storage | undefined): boolean {
  if (!storage) return true
  const key = `${VIEW_KEY_PREFIX}${providerId}`
  try {
    if (storage.getItem(key)) return false
    storage.setItem(key, '1')
    return true
  } catch {
    return true
  }
}
