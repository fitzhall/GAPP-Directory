import { describe, it, expect, beforeEach } from 'vitest'
import { shouldTrackView, VIEW_KEY_PREFIX } from '@/lib/track-once'

function fakeStorage(): Storage {
  const m = new Map<string, string>()
  return {
    getItem: k => m.get(k) ?? null,
    setItem: (k, v) => { m.set(k, v) },
    removeItem: k => { m.delete(k) },
    clear: () => m.clear(),
    key: () => null,
    get length() { return m.size },
  } as Storage
}

describe('shouldTrackView', () => {
  let s: Storage
  beforeEach(() => { s = fakeStorage() })

  it('counts the first view of a listing in a session and not a reload', () => {
    expect(shouldTrackView('prov-1', s)).toBe(true)
    expect(shouldTrackView('prov-1', s)).toBe(false)
    expect(s.getItem(`${VIEW_KEY_PREFIX}prov-1`)).toBe('1')
  })

  it('still counts a different listing', () => {
    expect(shouldTrackView('prov-1', s)).toBe(true)
    expect(shouldTrackView('prov-2', s)).toBe(true)
  })

  it('counts the view when storage is unavailable', () => {
    const broken = { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('blocked') } } as unknown as Storage
    expect(shouldTrackView('prov-1', broken)).toBe(true)
  })
})
