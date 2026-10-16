import { describe, it, expect } from 'vitest'
import { median, summarizeEvents, peerMedians } from '@/lib/report-data'

describe('median', () => {
  it('handles empty, odd and even lists', () => {
    expect(median([])).toBe(0)
    expect(median([5])).toBe(5)
    expect(median([1, 9, 3])).toBe(3)
    expect(median([1, 2, 3, 10])).toBe(2.5)
  })
})

describe('summarizeEvents', () => {
  it('counts each event type per provider', () => {
    const counts = summarizeEvents([
      { provider_id: 'a', event_type: 'view' },
      { provider_id: 'a', event_type: 'view' },
      { provider_id: 'a', event_type: 'click_phone' },
      { provider_id: 'a', event_type: 'click_helpline' },
      { provider_id: 'b', event_type: 'impression' },
      { provider_id: 'b', event_type: 'click_website' },
      { provider_id: 'b', event_type: 'click_callback' },
      { provider_id: 'b', event_type: 'something_new' },
    ])
    expect(counts.a).toEqual({ views: 2, impressions: 0, phoneClicks: 1, websiteClicks: 0, callbackClicks: 0, helplineClicks: 1 })
    expect(counts.b).toEqual({ views: 0, impressions: 1, phoneClicks: 0, websiteClicks: 1, callbackClicks: 1, helplineClicks: 0 })
  })
})

describe('peerMedians', () => {
  it('treats peers with no events as zeros and reports the peer count', () => {
    const counts = summarizeEvents([
      { provider_id: 'p1', event_type: 'view' },
      { provider_id: 'p1', event_type: 'view' },
      { provider_id: 'p1', event_type: 'view' },
      { provider_id: 'p1', event_type: 'click_phone' },
      { provider_id: 'p2', event_type: 'view' },
    ])
    expect(peerMedians(counts, ['p1', 'p2', 'p3'])).toEqual({ count: 3, views: 1, phoneClicks: 0 })
  })
})
