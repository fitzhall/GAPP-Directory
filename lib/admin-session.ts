import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { signingKey } from '@/lib/signing-key'

// Server-checked admin session. The admin login used to live only in the
// browser's sessionStorage, while the admin pages wrote to the database with
// the public key. Anyone could skip the login and do the same writes. Now the
// login sets a signed, httpOnly cookie, and every /api/admin route checks it.

export const ADMIN_COOKIE = 'gapp_admin'
const MAX_AGE_SECONDS = 60 * 60 * 12

function sign(payload: string): string {
  return createHmac('sha256', signingKey()).update(payload).digest('base64url')
}

function createSessionToken(username: string): string {
  const payload = Buffer.from(
    JSON.stringify({ u: username, exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS })
  ).toString('base64url')
  return `${payload}.${sign(payload)}`
}

function readSessionToken(token: string | undefined): string | null {
  if (!token) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null

  const given = Buffer.from(signature)
  const expected = Buffer.from(sign(payload))
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null

  try {
    const { u, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (typeof u !== 'string' || typeof exp !== 'number') return null
    if (exp < Date.now() / 1000) return null
    return u
  } catch {
    return null
  }
}

/** The signed-in admin's username, or null. */
export function adminFromRequest(request: NextRequest): string | null {
  return readSessionToken(request.cookies.get(ADMIN_COOKIE)?.value)
}

/** A 401 response when the request has no valid admin session, else null. */
export function requireAdmin(request: NextRequest): NextResponse | null {
  if (adminFromRequest(request)) return null
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export function setAdminCookie(response: NextResponse, username: string) {
  response.cookies.set(ADMIN_COOKIE, createSessionToken(username), {
    ...cookieOptions,
    maxAge: MAX_AGE_SECONDS,
  })
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, '', { ...cookieOptions, maxAge: 0 })
}
