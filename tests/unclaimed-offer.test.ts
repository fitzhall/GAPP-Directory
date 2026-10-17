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
