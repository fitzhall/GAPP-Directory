import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const { token, response } = await request.json()

    if (!token || !response) {
      return NextResponse.json({ error: 'Token and response required' }, { status: 400 })
    }

    if (response !== 'available' && response !== 'not_available') {
      return NextResponse.json({ error: 'Invalid response value' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Look up the token
    const { data: tokenData, error: tokenError } = await supabase
      .from('availability_tokens')
      .select('*, providers (id, name, availability_streak)')
      .eq('token', token)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
    }

    // Check if expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 410 })
    }

    // Check if already used
    if (tokenData.used_at) {
      return NextResponse.json({ error: 'Already responded' }, { status: 409 })
    }

    const providerId = tokenData.provider_id
    const now = new Date().toISOString()

    // Update the token as used
    const { error: updateTokenError } = await supabase
      .from('availability_tokens')
      .update({
        used_at: now,
        response: response,
      })
      .eq('id', tokenData.id)

    if (updateTokenError) {
      console.error('Error updating token:', updateTokenError)
      return NextResponse.json({ error: 'Failed to record response' }, { status: 500 })
    }

    // Update provider availability
    const currentStreak = tokenData.providers?.availability_streak || 0
    const { error: updateProviderError } = await supabase
      .from('providers')
      .update({
        is_available: response === 'available',
        availability_updated_at: now,
        availability_streak: currentStreak + 1,
      })
      .eq('id', providerId)

    if (updateProviderError) {
      console.error('Error updating provider:', updateProviderError)
      return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      response: response,
      message: response === 'available'
        ? 'You are now marked as available to case managers'
        : 'Got it, we\'ll check in again next Monday',
    })
  } catch (error) {
    console.error('Error processing response:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
