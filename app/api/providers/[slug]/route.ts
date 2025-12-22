import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = getSupabase()

    // Try to get with is_claimed column
    let query = supabase
      .from('providers')
      .select('id, name, slug, city, phone, services_offered, is_claimed, is_verified')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    let { data, error } = await query

    // If is_claimed doesn't exist, try without it
    if (error?.message?.includes('is_claimed')) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('providers')
        .select('id, name, slug, city, phone, services_offered, is_verified')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (fallbackError) {
        return NextResponse.json({ error: 'Provider not found' }, { status: 404 })
      }

      data = { ...fallbackData, is_claimed: false }
    } else if (error) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching provider:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
