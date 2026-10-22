// Public facts for a provider page, drawn from public records: the NPI
// registry and the Georgia DCH GAPP provider list (Appendix P). Matching is
// conservative on purpose: a wrong fact on a page is worse than none.
// See docs/superpowers/specs/2026-10-22-connect-line-and-public-facts-design.md

export type NpiCandidate = {
  npi: string
  name: string
  enumerationDate: string | null // YYYY-MM-DD
  taxonomy: string | null
  officialName: string | null
  officialTitle: string | null
  city: string | null
  state: string | null
  zip: string | null
  street: string | null
  phone: string | null
}

export type ProviderForMatch = {
  name: string
  city: string | null
  phone: string | null
  address: string | null
  /** Most seeded slugs end in the last four digits of the agency's NPI (e.g. "...-mcdonough-5866"). */
  slug?: string | null
}

/** The trailing four digits of a seeded slug, or null. */
export function slugNpiSuffix(slug: string | null | undefined): string | null {
  const m = /-(\d{4})$/.exec(slug || '')
  return m ? m[1] : null
}

const SUFFIXES = new Set([
  'LLC', 'L L C', 'INC', 'INCORPORATED', 'CORP', 'CORPORATION', 'CO', 'COMPANY',
  'LTD', 'LIMITED', 'PC', 'LP', 'LLP', 'PLLC',
])

/** Uppercase, punctuation out, company suffixes and a leading THE dropped. */
export function normalizeOrgName(s: string): string {
  const words = (s || '')
    .toUpperCase()
    .replace(/['’`]/g, '')
    .replace(/&/g, ' AND ')
    .replace(/\bL\.? ?L\.? ?C\.?(?=\s|$)/g, 'LLC')
    .replace(/[^A-Z0-9 ]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
  while (words.length > 1 && SUFFIXES.has(words[words.length - 1])) words.pop()
  if (words.length > 1 && words[0] === 'THE') words.shift()
  return words.join(' ')
}

export function digits(s: string | null | undefined): string {
  const d = (s || '').replace(/\D/g, '')
  return d.length === 11 && d.startsWith('1') ? d.slice(1) : d
}

function streetKey(s: string | null | undefined): string {
  // "1412 E. 39th Street" -> "1412 E 39TH"; enough to tell two offices apart.
  return (s || '').toUpperCase().replace(/[^A-Z0-9 ]+/g, ' ').trim().split(/\s+/).slice(0, 3).join(' ')
}

function isPrefix(a: string, b: string): boolean {
  if (a.length < 6 || b.length < 6) return false
  return a.startsWith(b) || b.startsWith(a)
}

/**
 * Accepts a candidate when the normalized names are equal and the city,
 * phone or street also agrees, or when the phone matches and one name is a
 * prefix of the other. Two top candidates with the same score means none.
 */
export function pickNpiMatch(p: ProviderForMatch, candidates: NpiCandidate[]): NpiCandidate | null {
  const name = normalizeOrgName(p.name)
  const city = (p.city || '').trim().toUpperCase()
  const phone = digits(p.phone)
  const street = streetKey(p.address)
  const suffix = slugNpiSuffix(p.slug)
  if (!name) return null

  const scored = candidates
    .filter(c => (c.state || '').toUpperCase() === 'GA')
    .map(c => {
      const cName = normalizeOrgName(c.name)
      const nameExact = cName === name
      const namePrefix = !nameExact && isPrefix(cName, name)
      const cityMatch = !!city && (c.city || '').toUpperCase() === city
      const phoneMatch = !!phone && phone.length === 10 && digits(c.phone) === phone
      const streetMatch = !!street && streetKey(c.street) === street
      const suffixMatch = !!suffix && c.npi.endsWith(suffix)
      let score = 0
      if (nameExact) score += 10
      if (namePrefix) score += 4
      if (suffixMatch) score += 8
      if (phoneMatch) score += 6
      if (streetMatch) score += 3
      if (cityMatch) score += 2
      // A seeded slug carries the NPI's last four digits, so a candidate that
      // does not end in them is a different registration, however alike.
      const suffixConflict = !!suffix && !suffixMatch
      const accepted =
        !suffixConflict &&
        ((nameExact && (cityMatch || phoneMatch || streetMatch || suffixMatch)) ||
          ((phoneMatch || suffixMatch) && (nameExact || namePrefix)))
      return { c, score, accepted }
    })
    .filter(x => x.accepted)
    .sort((a, b) => b.score - a.score)

  if (scored.length === 0) return null
  if (scored.length > 1 && scored[0].score === scored[1].score && scored[0].c.npi !== scored[1].c.npi) return null
  return scored[0].c
}

export type PublicFacts = {
  npi: string | null
  npiEnumerationDate: string | null
  npiTaxonomy: string | null
  npiOfficialName: string | null
  npiOfficialTitle: string | null
  stateListDate: string | null
  stateListCoverage: string | null
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function monthYear(iso: string): string {
  const m = /^(\d{4})-(\d{2})/.exec(iso)
  return m ? `${MONTHS[Number(m[2]) - 1]} ${m[1]}` : iso
}

export function longDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  return m ? `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}` : iso
}

/** "ERIKA THOMAS" -> "Erika Thomas". */
export function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/(\s+|-|')/)
    .map(w => (w.length && /[a-z]/.test(w[0]) ? w[0].toUpperCase() + w.slice(1) : w))
    .join('')
}

/** Plain lines for the "Public record" section. Empty when nothing is known. */
export function publicFactLines(f: PublicFacts): string[] {
  const lines: string[] = []
  if (f.npi) {
    lines.push(
      f.npiEnumerationDate
        ? `Listed in the national provider registry since ${monthYear(f.npiEnumerationDate)} (NPI ${f.npi}).`
        : `Listed in the national provider registry (NPI ${f.npi}).`
    )
  }
  if (f.npiTaxonomy) lines.push(`Registered as: ${f.npiTaxonomy}.`)
  if (f.npiOfficialName) {
    const who = titleCase(f.npiOfficialName)
    lines.push(f.npiOfficialTitle ? `Contact on record: ${who}, ${titleCase(f.npiOfficialTitle)}.` : `Contact on record: ${who}.`)
  }
  if (f.stateListDate) lines.push(`On the Georgia Medicaid GAPP provider list dated ${longDate(f.stateListDate)}.`)
  if (f.stateListCoverage && /call provider/i.test(f.stateListCoverage)) {
    lines.push('The state list says to call the agency to ask which counties it covers.')
  }
  return lines
}
