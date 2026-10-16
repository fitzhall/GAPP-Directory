import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendLeadEmail } from '@/lib/lead-email'

// Lazy-initialized clients to avoid build-time errors
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

interface CallbackRequest {
  parentName: string
  phone: string
  email?: string
  zipCode: string
  county: string
  serviceNeeded: string
  urgency: string
  preferredCallbackTime?: string
  specialNeeds?: string
  providerId: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CallbackRequest = await request.json()

    // Validate required fields
    if (!body.parentName || !body.phone || !body.zipCode || !body.serviceNeeded || !body.urgency || !body.providerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Get provider info for email
    const { data: provider, error: providerError } = await supabase
      .from('providers')
      .select('id, name, email, phone')
      .eq('id', body.providerId)
      .single()

    if (providerError || !provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }

    // Dedup: if this phone already requested a callback from this provider in
    // the last 30 minutes, treat it as the same request (double-submit / retry)
    // and return success without inserting a duplicate or re-notifying.
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()
    const { data: existing } = await supabase
      .from('callback_requests')
      .select('id')
      .eq('provider_id', body.providerId)
      .eq('phone', body.phone)
      .gte('created_at', thirtyMinutesAgo)
      .limit(1)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ success: true, id: existing.id, deduped: true })
    }

    // Insert callback request
    const { data: callback, error: insertError } = await supabase
      .from('callback_requests')
      .insert({
        parent_name: body.parentName,
        phone: body.phone,
        email: body.email || null,
        zip_code: body.zipCode,
        county: body.county || 'Unknown',
        service_needed: body.serviceNeeded,
        urgency: body.urgency,
        preferred_callback_time: body.preferredCallbackTime || null,
        special_needs: body.specialNeeds || null,
        provider_id: body.providerId,
        status: 'new',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting callback:', insertError)
      return NextResponse.json(
        { error: 'Failed to save callback request' },
        { status: 500 }
      )
    }

    // Send email notification to provider if they have an email
    if (provider.email) {
      await sendLeadEmail(provider.email, provider.name, {
        parent_name: body.parentName,
        phone: body.phone,
        email: body.email || null,
        zip_code: body.zipCode,
        county: body.county || 'Unknown',
        service_needed: body.serviceNeeded,
        urgency: body.urgency,
        preferred_callback_time: body.preferredCallbackTime || null,
        special_needs: body.specialNeeds || null,
      })
    }

    return NextResponse.json({
      success: true,
      id: callback.id
    })

  } catch (error) {
    console.error('Callback API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
