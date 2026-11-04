import { describe, it, expect } from 'vitest'
import { claimEmailHtml, claimEmailSubject, visibleCounties } from '@/lib/claim-email'

const base = {
  claimerName: 'Danyel Dollard',
  agencyName: 'Dedicated Kare',
  slug: 'dedicated-karegwinnett',
  email: 'danyel@example.com',
  countiesServed: ['Fulton', 'Cobb', 'Barrow', 'DeKalb', 'Clayton', 'Gwinnett', 'Banks'],
}

describe('visibleCounties', () => {
  it('shows the first 5 counties A to Z and lists the rest as hidden', () => {
    expect(visibleCounties(base.countiesServed)).toEqual({
      shown: ['Banks', 'Barrow', 'Clayton', 'Cobb', 'DeKalb'],
      hidden: ['Fulton', 'Gwinnett'],
    })
  })
  it('hides nothing at 5 counties or fewer', () => {
    expect(visibleCounties(['Cobb', 'Fulton']).hidden).toEqual([])
  })
})

describe('claimEmailSubject', () => {
  it('names the agency and says the page is live', () => {
    expect(claimEmailSubject('Dedicated Kare')).toBe('Your GeorgiaGAPP page is live: Dedicated Kare')
  })
})

describe('claimEmailHtml', () => {
  const html = claimEmailHtml(base)

  it('greets by first name and links the page, the dashboard and the plans', () => {
    expect(html).toContain('Hi Danyel,')
    expect(html).toContain('https://www.georgiagapp.com/provider/dedicated-karegwinnett')
    expect(html).toContain('https://www.georgiagapp.com/dashboard/login')
    expect(html).toContain('https://www.georgiagapp.com/premium')
  })

  it('says which counties parents can see and which they cannot', () => {
    expect(html).toContain('Banks, Barrow, Clayton, Cobb and DeKalb')
    expect(html).toContain('Fulton and Gwinnett')
  })

  it('counts the hidden counties instead of listing them all', () => {
    const all = Array.from({ length: 159 }, (_, i) => `County${String(i).padStart(3, '0')}`)
    const big = claimEmailHtml({ ...base, countiesServed: all })
    expect(big).toContain('County005, County006, County007 and 151 other counties')
    expect(big).not.toContain('County158')
  })

  it('tells an agency with 5 counties or fewer it shows everywhere', () => {
    const small = claimEmailHtml({ ...base, countiesServed: ['Cobb', 'Fulton'] })
    expect(small).toContain('all 2 of your counties')
    expect(small).not.toContain("don't see you")
  })

  it('quotes the prices from config, not the old review promise', () => {
    expect(html).toContain('$147 every 3 months')
    expect(html).toContain('$897 every 3 months')
    expect(html).not.toContain('24-48 hours')
  })

  it('escapes what the claimer typed', () => {
    const evil = claimEmailHtml({ ...base, claimerName: '<b>x</b> y', agencyName: 'A & B' })
    expect(evil).toContain('Hi &lt;b&gt;x&lt;/b&gt;,')
    expect(evil).toContain('A &amp; B')
  })
})
