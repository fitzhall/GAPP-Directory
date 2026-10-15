// Pure helpers for site-owned "match me" leads: validation, phone
// normalisation and the dedup window. No database, no Next imports, so
// they run in unit tests as-is. /api/match and the admin phone-lead op
// both use them.
import { GEORGIA_COUNTIES, formatCountyName } from '@/lib/county-data'

export const SERVICE_OPTIONS = ['RN', 'LPN', 'PCS', 'not_sure'] as const
export type ServiceNeeded = (typeof SERVICE_OPTIONS)[number]

export const GEORGIA_COUNTY_NAMES: string[] = GEORGIA_COUNTIES.map(formatCountyName)

export type MatchLead = {
  parentName: string
  phone: string // formatted "(404) 555-1212"
  county: string // display name, e.g. "Fulton"
  serviceNeeded: ServiceNeeded
  notes: string | null
  sourcePage: string
}

export type MatchLeadValidation =
  | { ok: true; lead: MatchLead }
  | { ok: false; error: string }

/** Ten US digits, or '' when the input cannot be a US phone number. */
export function normalizePhone(raw: string): string {
  let digits = (raw || '').replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1)
  return digits.length === 10 ? digits : ''
}

export function formatPhone(digits: string): string {
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

const MAX_NAME = 120
const MAX_NOTES = 2000
const MAX_SOURCE = 200

export function validateMatchLead(body: unknown): MatchLeadValidation {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Bad request.' }
  }
  const b = body as Record<string, unknown>
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

  const parentName = str(b.parentName).slice(0, MAX_NAME)
  if (!parentName) return { ok: false, error: 'Please enter your name.' }

  const digits = normalizePhone(str(b.phone))
  if (!digits) return { ok: false, error: 'Please enter a 10-digit phone number.' }

  const county = str(b.county)
  if (!GEORGIA_COUNTY_NAMES.includes(county)) return { ok: false, error: 'Please pick your county.' }

  const serviceNeeded = str(b.serviceNeeded)
  if (!(SERVICE_OPTIONS as readonly string[]).includes(serviceNeeded)) {
    return { ok: false, error: 'Please tell us what kind of help you need.' }
  }

  if (b.smsConsent !== true) return { ok: false, error: 'Please check the box so we can contact you.' }

  const sourcePage = str(b.sourcePage)
  if (!sourcePage.startsWith('/') || sourcePage.startsWith('//') || sourcePage.length > MAX_SOURCE) {
    return { ok: false, error: 'Bad request.' }
  }

  const notesRaw = str(b.notes).slice(0, MAX_NOTES)
  const notes = notesRaw ? notesRaw : null

  return {
    ok: true,
    lead: {
      parentName,
      phone: formatPhone(digits),
      county,
      serviceNeeded: serviceNeeded as ServiceNeeded,
      notes,
      sourcePage,
    },
  }
}

/** ISO timestamp `minutes` before `now`; rows at or after it count as duplicates. */
export function dedupWindowStart(now: Date, minutes = 30): string {
  return new Date(now.getTime() - minutes * 60 * 1000).toISOString()
}
