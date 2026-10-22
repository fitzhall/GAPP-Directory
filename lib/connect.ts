// The connect line: a small pool of GeorgiaGAPP-owned numbers that forward a
// family's call to a non-verified agency, so the site sees every call.
// Pure helpers live here; the API routes under app/api/connect use them.
// See docs/superpowers/specs/2026-10-22-connect-line-and-public-facts-design.md

export const CONNECT_WINDOW_MINUTES = 15
export const AGENCY_RING_SECONDS = 25

export type ConnectEligibility = {
  isActive?: boolean
  isVerified: boolean
  isFeatured: boolean
  phone: string | null
}

/** Pool numbers from TWILIO_CONNECT_NUMBERS (comma-separated E.164). */
export function connectPool(env: NodeJS.ProcessEnv = process.env): string[] {
  return (env.TWILIO_CONNECT_NUMBERS || '')
    .split(',')
    .map(s => toE164(s))
    .filter((s): s is string => !!s)
}

/** Only listings that are not verified and not featured, and that have a phone to forward to. */
export function isConnectEligible(p: ConnectEligibility): boolean {
  if (p.isActive === false) return false
  if (p.isVerified || p.isFeatured) return false
  return !!toE164(p.phone || '')
}

export type Assignment = { number: string; provider_id: string; expires_at: string }

/**
 * Picks a pool number for a listing. Reuses this listing's unexpired number,
 * else takes a free or expired one, else the one that expires soonest.
 * Returns null only when the pool is empty.
 */
export function pickPoolNumber(
  pool: string[],
  assignments: Assignment[],
  providerId: string,
  now: Date = new Date()
): { number: string; reused: boolean } | null {
  if (pool.length === 0) return null
  const live = assignments.filter(a => pool.includes(a.number) && new Date(a.expires_at) > now)

  const mine = live.find(a => a.provider_id === providerId)
  if (mine) return { number: mine.number, reused: true }

  const taken = new Set(live.map(a => a.number))
  const free = pool.find(n => !taken.has(n))
  if (free) return { number: free, reused: false }

  const soonest = [...live].sort((a, b) => +new Date(a.expires_at) - +new Date(b.expires_at))[0]
  return { number: soonest.number, reused: false }
}

/** "+16782638540" -> "(678) 263-8540". Anything else is returned as given. */
export function formatPhoneDisplay(e164: string): string {
  const m = /^\+1(\d{3})(\d{3})(\d{4})$/.exec(e164)
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : e164
}

/** US number in any common spelling -> E.164, or null when it is not a 10-digit US number. */
export function toE164(raw: string): string | null {
  const d = (raw || '').replace(/\D/g, '')
  if (d.length === 10) return `+1${d}`
  if (d.length === 11 && d.startsWith('1')) return `+${d}`
  return null
}

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const VOICE = 'Polly.Joanna'

function say(text: string): string {
  return `<Say voice="${VOICE}">${escapeXml(text)}</Say>`
}

/** Caller hears one line, then rings the agency. The agency hears the whisper first. */
export function twimlConnectToAgency(opts: {
  agencyName: string
  agencyPhone: string
  actionUrl: string
  whisperUrl: string
}): string {
  return (
    `<?xml version="1.0" encoding="UTF-8"?><Response>` +
    say(`Connecting you to ${opts.agencyName} through the Georgia GAPP directory. One moment.`) +
    `<Dial timeout="${AGENCY_RING_SECONDS}" action="${escapeXml(opts.actionUrl)}" method="POST">` +
    `<Number url="${escapeXml(opts.whisperUrl)}" method="POST">${escapeXml(opts.agencyPhone)}</Number>` +
    `</Dial></Response>`
  )
}

/** Caller lands on the GeorgiaGAPP helpline, either because no listing was live on the number or the agency did not pick up. */
export function twimlConnectToOperator(opts: {
  operatorPhone: string
  reason: 'no_assignment' | 'agency_unavailable'
  actionUrl?: string
}): string {
  const line =
    opts.reason === 'agency_unavailable'
      ? 'That agency did not pick up. Connecting you to the Georgia GAPP help line.'
      : 'Connecting you to the Georgia GAPP help line.'
  const action = opts.actionUrl ? ` action="${escapeXml(opts.actionUrl)}" method="POST"` : ''
  return (
    `<?xml version="1.0" encoding="UTF-8"?><Response>` +
    say(line) +
    `<Dial timeout="30"${action}>${escapeXml(opts.operatorPhone)}</Dial>` +
    `</Response>`
  )
}

/** What the agency hears before the two legs join. */
export function twimlWhisper(agencyName: string): string {
  return (
    `<?xml version="1.0" encoding="UTF-8"?><Response>` +
    say(`A family is calling ${agencyName} from Georgia GAPP dot com.`) +
    `</Response>`
  )
}

export function twimlHangup(message?: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?><Response>${message ? say(message) : ''}<Hangup/></Response>`
}

/** Twilio's DialCallStatus values that mean the agency never talked to the family. */
export function agencyUnavailable(dialStatus: string | null | undefined): boolean {
  return ['no-answer', 'busy', 'failed', 'canceled'].includes((dialStatus || '').toLowerCase())
}
