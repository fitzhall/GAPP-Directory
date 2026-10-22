import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { validateTwilioSignature, publicWebhookUrl } from '@/lib/twilio-signature'

// Server-side pieces shared by the connect-line routes under app/api/connect.

export function serviceClient(): SupabaseClient {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// The host Twilio is configured to call. Twilio signs the exact URL it
// requested, so this must be the www origin regardless of NEXT_PUBLIC_BASE_URL
// (which is the naked domain in some environments). CONNECT_WEBHOOK_BASE
// overrides it for a tunnel during local testing.
export function siteBase(): string {
  return (process.env.CONNECT_WEBHOOK_BASE || 'https://www.georgiagapp.com').replace(/\/$/, '')
}

/** Twilio posts application/x-www-form-urlencoded. */
export async function readTwilioForm(request: NextRequest): Promise<Record<string, string>> {
  const text = await request.text()
  const out: Record<string, string> = {}
  new URLSearchParams(text).forEach((v, k) => { out[k] = v })
  return out
}

/** True when the request really came from Twilio for this exact URL. */
export function twilioRequestIsValid(request: NextRequest, params: Record<string, string>): boolean {
  const url = publicWebhookUrl(siteBase(), request.nextUrl.pathname, request.nextUrl.search)
  return validateTwilioSignature(process.env.TWILIO_AUTH_TOKEN || '', url, params, request.headers.get('x-twilio-signature'))
}

export function twimlResponse(xml: string, status = 200): NextResponse {
  return new NextResponse(xml, { status, headers: { 'Content-Type': 'text/xml; charset=utf-8' } })
}

export const SELECT_FOR_CONNECT = 'id, name, slug, phone, intake_phone, is_active, is_verified, is_featured'

export type ProviderForConnect = {
  id: string
  name: string
  slug: string
  phone: string | null
  intake_phone: string | null
  is_active: boolean
  is_verified: boolean | null
  is_featured: boolean | null
}
