import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const county = searchParams.get('county') || ''
  const service = searchParams.get('service') || ''
  const accepting = searchParams.get('accepting')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    let query = supabase
      .from('providers')
      .select('*', { count: 'exact' })
      .eq('is_active', true)

    // Filters would be applied here if using server-side filtering
    // For now, we fetch all and let client filter

    query = query
      .order('is_featured', { ascending: false })
      .order('tier_level', { ascending: false })
      .order('name')
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      data: data || [],
      meta: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    })
  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
