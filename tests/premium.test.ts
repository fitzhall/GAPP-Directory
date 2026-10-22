import { describe, it, expect } from 'vitest'
import { countyKey, holdsPremiumSeat, isPremiumIn, premiumLabel, rotateDaily, rankForCounty, rankStatewide } from '@/lib/premium'

const seat = (name: string, county: string | null, over: Partial<{ isVerified: boolean; isFeatured: boolean; isClaimed: boolean }> = {}) => ({
  name, premiumCounty: county, isFeatured: true, isVerified: true, isClaimed: true, ...over,
})
const verified = (name: string) => ({ name, premiumCounty: null, isFeatured: false, isVerified: true, isClaimed: true })
const claimed = (name: string) => ({ name, premiumCounty: null, isFeatured: false, isVerified: false, isClaimed: true })
const unclaimed = (name: string) => ({ name, premiumCounty: null, isFeatured: false, isVerified: false, isClaimed: false })

describe('seat rules', () => {
  it('treats spellings of a county as one', () => {
    expect(countyKey('DeKalb')).toBe(countyKey(' dekalb County'))
  })
  it('needs featured, verified and a county', () => {
    expect(holdsPremiumSeat(seat('A', 'Fulton'))).toBe(true)
    expect(holdsPremiumSeat(seat('A', null))).toBe(false)
    expect(holdsPremiumSeat(seat('A', 'Fulton', { isVerified: false }))).toBe(false)
    expect(holdsPremiumSeat(seat('A', 'Fulton', { isFeatured: false }))).toBe(false)
  })
  it('is premium only in its own county', () => {
    expect(isPremiumIn(seat('A', 'Gwinnett'), 'gwinnett')).toBe(true)
    expect(isPremiumIn(seat('A', 'Gwinnett'), 'Fulton')).toBe(false)
    expect(isPremiumIn(seat('A', 'Gwinnett'), '')).toBe(false)
  })
  it('labels the seat', () => {
    expect(premiumLabel('Gwinnett')).toBe('Featured in Gwinnett County')
    expect(premiumLabel('Fulton County')).toBe('Featured in Fulton County')
  })
})

describe('rotateDaily', () => {
  it('starts somewhere different on consecutive days and keeps everyone', () => {
    const items = ['a', 'b', 'c']
    const d1 = new Date('2026-10-22T12:00:00Z')
    const d2 = new Date('2026-10-23T12:00:00Z')
    const r1 = rotateDaily(items, d1)
    const r2 = rotateDaily(items, d2)
    expect(r1).not.toEqual(r2)
    expect([...r1].sort()).toEqual(items)
    expect(r2[0]).toBe(r1[1])
  })
  it('is stable within a day and for short lists', () => {
    const d = new Date('2026-10-22T01:00:00Z')
    expect(rotateDaily(['a', 'b', 'c'], d)).toEqual(rotateDaily(['a', 'b', 'c'], new Date('2026-10-22T23:00:00Z')))
    expect(rotateDaily(['a'], d)).toEqual(['a'])
  })
})

describe('rankForCounty', () => {
  it('puts the seat holder first and other premiums as verified', () => {
    const list = [unclaimed('Zed'), verified('Beta'), seat('Opulent', 'Fulton'), claimed('Carl'), seat('Alpha Care', 'Gwinnett'), verified('Able')]
    expect(rankForCounty(list, 'Gwinnett').map(p => p.name)).toEqual(['Alpha Care', 'Able', 'Beta', 'Opulent', 'Carl', 'Zed'])
    expect(rankForCounty(list, 'Fulton').map(p => p.name)).toEqual(['Opulent', 'Able', 'Alpha Care', 'Beta', 'Carl', 'Zed'])
  })
  it('does not rank a featured agency with no seat above verified ones', () => {
    const list = [verified('Able'), seat('Legacy', null)]
    expect(rankForCounty(list, 'Cobb').map(p => p.name)).toEqual(['Able', 'Legacy'])
  })
})

describe('rankStatewide', () => {
  const list = [verified('Able'), seat('Cobb Co', 'Cobb'), claimed('Carl'), seat('Alpha', 'Gwinnett'), seat('Bravo', 'Fulton'), seat('Legacy', null)]
  it('puts every seat holder first, rotated, then verified then claimed', () => {
    const { premium, rest } = rankStatewide(list, new Date('2026-10-22T12:00:00Z'))
    expect([...premium.map(p => p.name)].sort()).toEqual(['Alpha', 'Bravo', 'Cobb Co'])
    expect(rest.map(p => p.name)).toEqual(['Able', 'Legacy', 'Carl'])
  })
  it('caps the premium block and lets the overflow fall back to verified', () => {
    const { premium, rest } = rankStatewide(list, new Date('2026-10-22T12:00:00Z'), 2)
    expect(premium).toHaveLength(2)
    expect(rest).toHaveLength(4)
    expect(new Set([...premium, ...rest].map(p => p.name)).size).toBe(6)
  })
})
