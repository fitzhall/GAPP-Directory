import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || ''
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!query || query.length < 2) {
    return NextResponse.json({
      results: [],
      query
    })
  }

  try {
    // Search providers by name or city
    const { data, error } = await supabase
      .from('providers')
      .select('id, name, slug, city, counties_served, services_offered, tier_level, is_verified, is_featured')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,city.ilike.%${query}%`)
      .order('is_featured', { ascending: false })
      .order('tier_level', { ascending: false })
      .limit(limit)

    if (error) throw error

    const results = (data || []).map(provider => ({
      id: provider.id,
      name: provider.name,
      slug: provider.slug,
      city: provider.city,
      countiesServed: provider.counties_served,
      servicesOffered: provider.services_offered,
      tierLevel: provider.tier_level,
      isVerified: provider.is_verified,
      isFeatured: provider.is_featured,
    }))

    return NextResponse.json({
      results,
      query,
      total: results.length
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
