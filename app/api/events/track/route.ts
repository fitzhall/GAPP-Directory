import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isCrawlerUserAgent, eventClientMeta } from '@/lib/crawler'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const VALID_EVENTS = ['view', 'click_phone', 'click_website', 'click_callback', 'impression', 'click_helpline'] as const

export async function POST(request: NextRequest) {
  try {
    const { providerId, eventType, metadata } = await request.json()

    if (!providerId || !eventType) {
      return NextResponse.json({ error: 'Missing providerId or eventType' }, { status: 400 })
    }

    if (!VALID_EVENTS.includes(eventType)) {
      return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 })
    }

    // Crawlers run the page code too. Count only people, and keep the
    // browser and referrer so a report can filter anything we missed.
    const ua = request.headers.get('user-agent')
    if (isCrawlerUserAgent(ua)) {
      return NextResponse.json({ success: true, skipped: 'crawler' })
    }

    const { error } = await supabase
      .from('provider_events')
      .insert({
        provider_id: providerId,
        event_type: eventType,
        metadata: { ...(metadata || {}), ...eventClientMeta(ua, request.headers.get('referer')) },
      })

    if (error) {
      console.error('Error tracking event:', error)
      return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
