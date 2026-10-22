import { NextRequest, NextResponse } from 'next/server'
import { isCrawlerUserAgent } from '@/lib/crawler'
import { connectPool, isConnectEligible, pickPoolNumber, formatPhoneDisplay, CONNECT_WINDOW_MINUTES, type Assignment } from '@/lib/connect'
import { serviceClient, SELECT_FOR_CONNECT, type ProviderForConnect } from '@/lib/connect-server'

// The page asks for a pool number when a family taps Call on a non-verified
// listing. The number is tied to that listing for a short window; a call
// arriving on it inside the window forwards to the agency (see ../voice).
// Returns { number: null } whenever the connect line should not be used, and
// the page then falls back to whatever it would have dialed before.

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { providerId } = await request.json()
    if (!providerId || typeof providerId !== 'string') {
      return NextResponse.json({ number: null, reason: 'missing providerId' }, { status: 400 })
    }
    if (isCrawlerUserAgent(request.headers.get('user-agent'))) {
      return NextResponse.json({ number: null, reason: 'crawler' })
    }
    const pool = connectPool()
    if (pool.length === 0) return NextResponse.json({ number: null, reason: 'no pool' })

    const supabase = serviceClient()
    const { data: provider } = await supabase
      .from('providers')
      .select(SELECT_FOR_CONNECT)
      .eq('id', providerId)
      .maybeSingle<ProviderForConnect>()
    if (!provider) return NextResponse.json({ number: null, reason: 'unknown provider' }, { status: 404 })

    const eligible = isConnectEligible({
      isActive: provider.is_active,
      isVerified: !!provider.is_verified,
      isFeatured: !!provider.is_featured,
      phone: provider.intake_phone || provider.phone,
    })
    if (!eligible) return NextResponse.json({ number: null, reason: 'not eligible' })

    const { data: assignments } = await supabase.from('connect_assignments').select('number, provider_id, expires_at')
    const now = new Date()
    const pick = pickPoolNumber(pool, (assignments || []) as Assignment[], providerId, now)
    if (!pick) return NextResponse.json({ number: null, reason: 'no pool' })

    const expiresAt = new Date(now.getTime() + CONNECT_WINDOW_MINUTES * 60_000)
    const { error } = await supabase
      .from('connect_assignments')
      .upsert({ number: pick.number, provider_id: providerId, assigned_at: now.toISOString(), expires_at: expiresAt.toISOString() }, { onConflict: 'number' })
    if (error) {
      console.error('connect_assignments upsert failed:', error)
      return NextResponse.json({ number: null, reason: 'store failed' })
    }

    return NextResponse.json({
      number: pick.number,
      display: formatPhoneDisplay(pick.number),
      expiresInSeconds: CONNECT_WINDOW_MINUTES * 60,
    })
  } catch (err) {
    console.error('connect/number error:', err)
    return NextResponse.json({ number: null, reason: 'error' }, { status: 500 })
  }
}
