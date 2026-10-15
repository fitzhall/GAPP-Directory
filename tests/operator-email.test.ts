import { describe, it, expect } from 'vitest'
import { operatorLeadEmailHtml, operatorLeadEmailSubject } from '@/lib/operator-email'
import type { MatchLead } from '@/lib/match-lead'

const lead: MatchLead = {
  parentName: 'Maria Lopez',
  phone: '(404) 555-1212',
  county: 'Fulton',
  serviceNeeded: 'LPN',
  notes: 'Nights only',
  sourcePage: '/provider/triumph-private-home-care-llc-decatur-8440',
}

describe('operatorLeadEmailSubject', () => {
  it('reads as "Match lead: name, county, service"', () => {
    expect(operatorLeadEmailSubject(lead)).toBe('Match lead: Maria Lopez, Fulton, Nursing (LPN)')
  })
})

describe('operatorLeadEmailHtml', () => {
  it('links the source page and the admin leads page', () => {
    const html = operatorLeadEmailHtml(lead, 'match_form', 'https://www.georgiagapp.com/admin/leads')
    expect(html).toContain('https://www.georgiagapp.com/provider/triumph-private-home-care-llc-decatur-8440')
    expect(html).toContain('https://www.georgiagapp.com/admin/leads')
    expect(html).toContain('href="tel:+14045551212"')
    expect(html).toContain('Nights only')
  })
  it('escapes family input', () => {
    const html = operatorLeadEmailHtml({ ...lead, notes: '<b>x</b>' }, 'match_form', 'https://x/admin/leads')
    expect(html).toContain('&lt;b&gt;x&lt;/b&gt;')
  })
})
