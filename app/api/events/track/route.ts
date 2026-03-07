import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const VALID_EVENTS = ['view', 'click_phone', 'click_website', 'click_callback', 'impression'] as const

export async function POST(request: NextRequest) {
  try {
    const { providerId, eventType, metadata } = await request.json()

    if (!providerId || !eventType) {
      return NextResponse.json({ error: 'Missing providerId or eventType' }, { status: 400 })
    }

    if (!VALID_EVENTS.includes(eventType)) {
      return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 })
    }

    const { error } = await supabase
      .from('provider_events')
      .insert({
        provider_id: providerId,
        event_type: eventType,
        metadata: metadata || {},
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
