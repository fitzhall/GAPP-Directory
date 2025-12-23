import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Look up the token
    const { data: tokenData, error: tokenError } = await supabase
      .from('availability_tokens')
      .select(`
        *,
        providers (
          id,
          name
        )
      `)
      .eq('token', token)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
    }

    // Check if expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json({ error: 'expired' }, { status: 410 })
    }

    // Check if already used
    if (tokenData.used_at) {
      return NextResponse.json({
        error: 'used',
        providerName: tokenData.providers?.name,
        previousResponse: tokenData.response,
      }, { status: 409 })
    }

    // Token is valid
    return NextResponse.json({
      valid: true,
      providerName: tokenData.providers?.name,
    })
  } catch (error) {
    console.error('Error validating token:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
