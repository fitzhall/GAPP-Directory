import { describe, it, expect } from 'vitest'
import { unclaimedOfferCopy } from '@/lib/unclaimed-offer'

describe('unclaimedOfferCopy', () => {
  it('names the agency and the county', () => {
    const c = unclaimedOfferCopy('Triumph Private Home Care', 'Clayton')
    expect(c.headline).toBe('Trying to reach Triumph Private Home Care?')
    expect(c.body).toBe(
      'They have not claimed their listing, so we cannot connect you to them. Call or text us and a real person will match you with a GAPP agency in Clayton County that has nurses available. Free for families.'
    )
    expect(c.trust).toEqual(['Free for families', 'We know which agencies have openings', 'Usually the same day'])
    expect(c.ownerLine).toBe('Do you run Triumph Private Home Care? Claim this listing free and your phone number shows here instead.')
  })
  it('falls back to "your county" when the listing has no counties', () => {
    const c = unclaimedOfferCopy('YHS LLC', undefined)
    expect(c.body).toContain('a GAPP agency in your county that has nurses available')
  })
})

import { countyOfferCopy } from '@/lib/unclaimed-offer'

describe('countyOfferCopy', () => {
  it('tells a family no agency in the county has a number listed, and offers the match', () => {
    const c = countyOfferCopy('Troup', 6)
    expect(c.headline).toBe('Looking for GAPP care in Troup County?')
    expect(c.body).toBe(
      'The 6 agencies listed here have not claimed their listings yet, so none shows a phone number. Call or text us and a real person will match you with a GAPP agency that serves Troup County and has nurses available. Free for families.'
    )
    expect(c.trust).toEqual(['Free for families', 'We know which agencies have openings', 'Usually the same day'])
  })
  it('uses singular for one agency', () => {
    expect(countyOfferCopy('Dawson', 1).body).toContain('The 1 agency listed here has not claimed its listing yet, so it shows no phone number.')
  })
  it('handles a county with no listings at all', () => {
    expect(countyOfferCopy('Echols', 0).body).toBe(
      'No agency has listed Echols County yet. Call or text us and a real person will find you a GAPP agency that will serve Echols County. Free for families.'
    )
  })
})
