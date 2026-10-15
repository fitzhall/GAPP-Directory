import { describe, it, expect } from 'vitest'
import { leadEmailHtml, leadEmailSubject, type LeadForEmail } from '@/lib/lead-email'

const lead: LeadForEmail = {
  parent_name: 'Maria Lopez',
  phone: '(404) 555-1212',
  email: null,
  zip_code: '',
  county: 'Fulton',
  service_needed: 'LPN',
  urgency: 'asap',
  preferred_callback_time: null,
  special_needs: 'Nights only',
}

describe('leadEmailSubject', () => {
  it('names the family and the service', () => {
    expect(leadEmailSubject(lead)).toBe('New Lead: Maria Lopez needs Nursing (LPN)')
  })
})

describe('leadEmailHtml', () => {
  it('includes the provider name, phone link and notes', () => {
    const html = leadEmailHtml('Opulent Private Care', lead)
    expect(html).toContain('Opulent Private Care')
    expect(html).toContain('href="tel:+14045551212"')
    expect(html).toContain('Nights only')
    expect(html).toContain('AS SOON AS POSSIBLE')
  })
  it('omits the email row and the ZIP row when they are blank', () => {
    const html = leadEmailHtml('Opulent Private Care', lead)
    expect(html).not.toContain('mailto:')
    expect(html).not.toContain('ZIP Code:')
  })
  it('escapes HTML in family input', () => {
    const html = leadEmailHtml('P', { ...lead, parent_name: '<img src=x>' })
    expect(html).not.toContain('<img src=x>')
    expect(html).toContain('&lt;img src=x&gt;')
  })
})
