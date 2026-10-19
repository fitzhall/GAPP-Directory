import { createHmac, timingSafeEqual } from 'crypto'
import { signingKey } from '@/lib/signing-key'

// A provider's report link is /report/<slug>?t=<token>. The token is an HMAC
// of the slug, so a link proves the operator made it for that one slug and
// nothing else. No database row, no expiry. Signed with REPORT_SIGNING_SECRET
// when set (links then survive an admin password change and can be made off
// the server), otherwise with the admin signing key; rotating whichever is in
// use invalidates every link at once.

function reportKey(): string | Buffer {
  return process.env.REPORT_SIGNING_SECRET || signingKey()
}

export function reportToken(slug: string): string {
  return createHmac('sha256', reportKey()).update(`report-v1:${slug}`).digest('base64url').slice(0, 24)
}

export function verifyReportToken(slug: string, token: string | undefined): boolean {
  if (!token || token.length !== 24) return false
  const expected = Buffer.from(reportToken(slug))
  const given = Buffer.from(token)
  return given.length === expected.length && timingSafeEqual(given, expected)
}

// Always the canonical host: every page on the site lives on www, and a
// texted link must not depend on which base URL an environment happens to set.
export const REPORT_HOST = 'https://www.georgiagapp.com'

export function reportUrl(slug: string): string {
  return `${REPORT_HOST}/report/${slug}?t=${reportToken(slug)}`
}
