import { describe, it, expect } from 'vitest'
import { normalizeOrgName, digits, pickNpiMatch, slugNpiSuffix, publicFactLines, monthYear, longDate, titleCase, type NpiCandidate } from '@/lib/public-facts'

function cand(over: Partial<NpiCandidate>): NpiCandidate {
  return {
    npi: '1000000001', name: 'X', enumerationDate: '2020-11-09', taxonomy: 'In Home Supportive Care',
    officialName: 'ERIKA THOMAS', officialTitle: 'OWNER', city: 'MACON', state: 'GA', zip: '31206',
    street: '123 MAIN ST', phone: '478-508-9247', ...over,
  }
}

describe('normalizeOrgName', () => {
  it('drops punctuation, company suffixes and a leading THE', () => {
    expect(normalizeOrgName("Lillie's Helpers, LLC")).toBe('LILLIES HELPERS')
    expect(normalizeOrgName('THE JADE CARE SERVICES INC.')).toBe('JADE CARE SERVICES')
    expect(normalizeOrgName('A & B Home Care L.L.C.')).toBe('A AND B HOME CARE')
  })
  it('keeps a one-word name even if it looks like a suffix', () => {
    expect(normalizeOrgName('Co')).toBe('CO')
  })
  it('strips phone numbers to ten digits', () => {
    expect(digits('1 (478) 508-9247')).toBe('4785089247')
  })
})

describe('pickNpiMatch', () => {
  const provider = { name: "Lillie's Helpers LLC", city: 'Macon', phone: '(478) 508-9247', address: '123 Main St' }

  it('accepts an exact name with a matching city', () => {
    const c = cand({ name: "LILLIE'S HELPERS, LLC", phone: null })
    expect(pickNpiMatch(provider, [c])).toBe(c)
  })
  it('rejects an exact name with nothing else agreeing', () => {
    const c = cand({ name: "LILLIE'S HELPERS, LLC", city: 'ATLANTA', phone: null, street: '9 Other Rd' })
    expect(pickNpiMatch(provider, [c])).toBeNull()
  })
  it('prefers the phone match over a same-owner sibling', () => {
    const sibling = cand({ npi: '1932959285', name: "LILLIE'S ADULT DAY CARE, LLC", phone: '478-216-6336' })
    const right = cand({ npi: '1346842911', name: "LILLIE'S HELPERS, LLC" })
    expect(pickNpiMatch(provider, [sibling, right])?.npi).toBe('1346842911')
  })
  it('accepts a phone match when one name is a prefix of the other', () => {
    const c = cand({ name: "LILLIE'S HELPERS HOME CARE LLC", city: 'WARNER ROBINS' })
    expect(pickNpiMatch(provider, [c])).toBe(c)
  })
  it('rejects out-of-state and ambiguous ties', () => {
    expect(pickNpiMatch(provider, [cand({ name: "LILLIE'S HELPERS", state: 'AL' })])).toBeNull()
    const a = cand({ npi: '1', name: "LILLIE'S HELPERS", phone: null })
    const b = cand({ npi: '2', name: "LILLIE'S HELPERS", phone: null })
    expect(pickNpiMatch(provider, [a, b])).toBeNull()
  })
  it('does not match on phone alone when the names differ', () => {
    const c = cand({ name: 'TOTALLY DIFFERENT AGENCY' })
    expect(pickNpiMatch(provider, [c])).toBeNull()
  })
  it('uses the slug\'s four-digit NPI suffix as a confirming signal', () => {
    const seeded = { name: 'A Supreme Nursing and Homecare', city: 'Atlanta', phone: null, address: null, slug: 'a-supreme-nursing-and-homecare-atlanta-2700' }
    const c = cand({ npi: '1861762700', name: 'A SUPREME NURSING AND HOMECARE, LLC', city: 'DOUGLASVILLE', phone: null })
    expect(pickNpiMatch(seeded, [c])?.npi).toBe('1861762700')
    const other = cand({ npi: '1861769999', name: 'A SUPREME NURSING AND HOMECARE, LLC', city: 'DOUGLASVILLE', phone: null })
    expect(pickNpiMatch(seeded, [other])).toBeNull()
    expect(pickNpiMatch(seeded, [other, c])?.npi).toBe('1861762700')
  })
  it('rejects a same-name candidate whose NPI does not end in the slug suffix, even with city and phone agreeing', () => {
    const seeded = { name: "Lillie's Helpers LLC", city: 'Macon', phone: '(478) 508-9247', address: null, slug: 'lillie-s-helpers-llc-macon-2911' }
    const lookalike = cand({ npi: '1316600596', name: 'LILLIES HELPERS LLC' })
    const right = cand({ npi: '1346842911', name: "LILLIE'S HELPERS, LLC" })
    expect(pickNpiMatch(seeded, [lookalike])).toBeNull()
    expect(pickNpiMatch(seeded, [lookalike, right])?.npi).toBe('1346842911')
  })
  it('reads the suffix only from a trailing four-digit block', () => {
    expect(slugNpiSuffix('a-home-for-care-inc-buford-7448')).toBe('7448')
    expect(slugNpiSuffix('jade-care-servicescherokee')).toBeNull()
    expect(slugNpiSuffix('toolop-llc-lithonia-5434')).toBe('5434')
  })
})

describe('publicFactLines', () => {
  it('writes plain lines and skips what is unknown', () => {
    expect(publicFactLines({
      npi: '1346842911', npiEnumerationDate: '2020-11-09', npiTaxonomy: 'In Home Supportive Care',
      npiOfficialName: 'ERIKA THOMAS', npiOfficialTitle: 'OWNER', stateListDate: '2026-08-15',
      stateListCoverage: 'Call Provider for Coverage Area',
    })).toEqual([
      'Listed in the national provider registry since November 2020 (NPI 1346842911).',
      'Registered as: In Home Supportive Care.',
      'Contact on record: Erika Thomas, Owner.',
      'On the Georgia Medicaid GAPP provider list dated August 15, 2026.',
      'The state list says to call the agency to ask which counties it covers.',
    ])
    expect(publicFactLines({ npi: null, npiEnumerationDate: null, npiTaxonomy: null, npiOfficialName: null, npiOfficialTitle: null, stateListDate: null, stateListCoverage: null })).toEqual([])
  })
  it('formats dates and names', () => {
    expect(monthYear('2020-11-09')).toBe('November 2020')
    expect(longDate('2026-08-15')).toBe('August 15, 2026')
    expect(titleCase("MARY-ANN O'NEIL")).toBe("Mary-Ann O'Neil")
  })
})
