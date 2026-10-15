import { describe, it, expect } from 'vitest'
import {
  normalizePhone,
  formatPhone,
  validateMatchLead,
  dedupWindowStart,
  GEORGIA_COUNTY_NAMES,
} from '@/lib/match-lead'

describe('normalizePhone', () => {
  it('strips punctuation', () => {
    expect(normalizePhone('(404) 555-1212')).toBe('4045551212')
    expect(normalizePhone('404.555.1212')).toBe('4045551212')
  })
  it('drops a leading country code 1', () => {
    expect(normalizePhone('+1 404 555 1212')).toBe('4045551212')
    expect(normalizePhone('14045551212')).toBe('4045551212')
  })
  it('returns empty for too few digits', () => {
    expect(normalizePhone('555-1212')).toBe('')
    expect(normalizePhone('')).toBe('')
  })
})

describe('formatPhone', () => {
  it('formats ten digits', () => {
    expect(formatPhone('4045551212')).toBe('(404) 555-1212')
  })
})

describe('GEORGIA_COUNTY_NAMES', () => {
  it('has 159 display names including the odd spellings', () => {
    expect(GEORGIA_COUNTY_NAMES).toHaveLength(159)
    expect(GEORGIA_COUNTY_NAMES).toContain('Fulton')
    expect(GEORGIA_COUNTY_NAMES).toContain('DeKalb')
    expect(GEORGIA_COUNTY_NAMES).toContain('Ben Hill')
  })
})

const good = {
  parentName: 'Maria Lopez',
  phone: '+1 (404) 555-1212',
  county: 'Fulton',
  serviceNeeded: 'LPN',
  notes: 'Nights only',
  sourcePage: '/provider/some-agency',
  smsConsent: true,
}

describe('validateMatchLead', () => {
  it('accepts a complete body and normalises the phone', () => {
    const r = validateMatchLead(good)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.lead.phone).toBe('(404) 555-1212')
      expect(r.lead.notes).toBe('Nights only')
      expect(r.lead.serviceNeeded).toBe('LPN')
    }
  })
  it('turns blank notes into null and trims the name', () => {
    const r = validateMatchLead({ ...good, notes: '   ', parentName: '  Maria ' })
    expect(r.ok && r.lead.notes).toBe(null)
    expect(r.ok && r.lead.parentName).toBe('Maria')
  })
  it('rejects a missing name', () => {
    expect(validateMatchLead({ ...good, parentName: '' })).toEqual({ ok: false, error: 'Please enter your name.' })
  })
  it('rejects a short phone', () => {
    expect(validateMatchLead({ ...good, phone: '555-1212' })).toEqual({ ok: false, error: 'Please enter a 10-digit phone number.' })
  })
  it('rejects a county that is not in Georgia', () => {
    expect(validateMatchLead({ ...good, county: 'Unknown' }).ok).toBe(false)
    expect(validateMatchLead({ ...good, county: '<script>' }).ok).toBe(false)
  })
  it('rejects an unknown service', () => {
    expect(validateMatchLead({ ...good, serviceNeeded: 'MD' }).ok).toBe(false)
  })
  it('rejects without consent', () => {
    expect(validateMatchLead({ ...good, smsConsent: false })).toEqual({ ok: false, error: 'Please check the box so we can contact you.' })
  })
  it('rejects a source page that is not a site path', () => {
    expect(validateMatchLead({ ...good, sourcePage: 'https://evil.example' }).ok).toBe(false)
    expect(validateMatchLead({ ...good, sourcePage: '/' + 'a'.repeat(200) }).ok).toBe(false)
  })
  it('rejects non-object bodies', () => {
    expect(validateMatchLead(null).ok).toBe(false)
    expect(validateMatchLead('x').ok).toBe(false)
  })
})

describe('dedupWindowStart', () => {
  it('is 30 minutes before now by default', () => {
    const now = new Date('2026-10-15T12:00:00.000Z')
    expect(dedupWindowStart(now)).toBe('2026-10-15T11:30:00.000Z')
  })
  it('takes a custom window', () => {
    const now = new Date('2026-10-15T12:00:00.000Z')
    expect(dedupWindowStart(now, 5)).toBe('2026-10-15T11:55:00.000Z')
  })
})
