import { describe, it, expect } from 'vitest'
import { reportStory, compareSentence, missingAndGains, type StoryInput } from '@/lib/report-copy'

const base: StoryInput = {
  provider: { isClaimed: false, isVerified: false, isFeatured: false, hasWebsite: false },
  you: { views: 29, impressions: 61, phoneClicks: 0, helplineClicks: 2, leads: 1 },
  peers: { count: 10, views: 17.5, phoneClicks: 0.5, scope: 'counties' },
}

describe('reportStory', () => {
  it('unclaimed: the big number is views, the problem is the hidden phone', () => {
    const s = reportStory(base)
    expect(s.bigNumber).toBe(29)
    expect(s.headline).toBe('29 families looked at your listing in the last 90 days.')
    expect(s.problem).toBe('0 of them could call you. Your phone number is not shown.')
    expect(s.tone).toBe('bad')
  })

  it('claimed with no taps: the problem is families leaving without a trace', () => {
    const s = reportStory({ ...base, provider: { ...base.provider, isClaimed: true } })
    expect(s.problem).toBe('0 tapped to call you. Families who do not call leave without a trace.')
    expect(s.tone).toBe('bad')
  })

  it('claimed with taps: good news in plain words', () => {
    const s = reportStory({ ...base, provider: { ...base.provider, isClaimed: true }, you: { ...base.you, phoneClicks: 4 } })
    expect(s.problem).toBe('4 of them tapped to call you.')
    expect(s.tone).toBe('good')
  })

  it('uses singular when one family looked', () => {
    const s = reportStory({ ...base, you: { ...base.you, views: 1 } })
    expect(s.headline).toBe('1 family looked at your listing in the last 90 days.')
  })

  it('no views: says so without a zero-families headline', () => {
    const s = reportStory({ ...base, you: { ...base.you, views: 0 } })
    expect(s.headline).toBe('No families opened your listing in the last 90 days.')
  })
})

describe('compareSentence', () => {
  it('rounds the multiple to a whole number and mentions one-tap calling', () => {
    expect(compareSentence(8, 17.5, 'counties')).toBe(
      'Verified agencies near you get about 2 times more views, and families can call them with one tap.'
    )
  })
  it('about the same when within 20 percent', () => {
    expect(compareSentence(16, 17.5, 'counties')).toBe(
      'You get about as many views as a verified agency near you, but families can call them with one tap.'
    )
  })
  it('you are ahead when you have more views', () => {
    expect(compareSentence(40, 17.5, 'counties')).toBe(
      'You get more views than a typical verified agency near you. Families just need a way to call you.'
    )
  })
  it('names Georgia when the peer group is sitewide', () => {
    expect(compareSentence(8, 17.5, 'sitewide')).toContain('across Georgia')
  })
  it('handles a zero peer median', () => {
    expect(compareSentence(0, 0, 'counties')).toBe(
      'Verified agencies near you show their number, so families can call them with one tap.'
    )
  })
})

describe('missingAndGains', () => {
  it('unclaimed: lists what turns families away and what verified agencies have', () => {
    const r = missingAndGains(base.provider)
    expect(r.missing).toEqual([
      'Your phone number is hidden. Families cannot call you.',
      'No callback form. Families who do not call leave without a trace.',
      'No link to your website.',
      'Other agencies show up above you in your counties.',
    ])
    expect(r.gains).toEqual([
      'Your phone number, one tap to call',
      'A callback form that sends you the family’s name and number',
      'A link to your website',
      'The top spot in your county results',
    ])
  })
  it('verified and featured: nothing missing', () => {
    const r = missingAndGains({ isClaimed: true, isVerified: true, isFeatured: true, hasWebsite: true })
    expect(r.missing).toEqual([])
    expect(r.gains).toEqual([])
  })
})
