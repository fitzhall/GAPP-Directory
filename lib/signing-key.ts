import { createHmac } from 'crypto'

// The server-side HMAC key behind admin sessions and provider report links.
// Derived from a server-only secret plus the admin credentials, so changing
// the admin password ends every open session and rotates every report link.
export function signingKey(): string {
  const base = process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!base) throw new Error('No server secret available to sign admin sessions')
  const credentials = process.env.ADMIN_USERS || process.env.ADMIN_PASSWORD || ''
  return createHmac('sha256', base).update(`gapp-admin-session-v1:${credentials}`).digest('hex')
}
