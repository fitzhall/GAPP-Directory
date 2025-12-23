import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const county = searchParams.get('county')
    const service = searchParams.get('service')
    const nights = searchParams.get('nights') === 'true'
    const weekends = searchParams.get('weekends') === 'true'
    const highMedical = searchParams.get('highMedical') === 'true'
    const spanish = searchParams.get('spanish') === 'true'

    if (!county) {
      return NextResponse.json({ error: 'County required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Calculate 7 days ago
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Build query for available verified providers
    let query = supabase
      .from('providers')
      .select(`
        id,
        name,
        slug,
        city,
        phone,
        counties_served,
        services_offered,
        available_hours,
        languages,
        availability_updated_at
      `)
      .eq('is_active', true)
      .eq('is_verified', true)
      .eq('is_available', true)
      .gte('availability_updated_at', sevenDaysAgo.toISOString())
      .contains('counties_served', [county])

    // Filter by service type
    if (service && service !== 'all') {
      query = query.contains('services_offered', [service])
    }

    // Filter by Spanish speaking
    if (spanish) {
      query = query.contains('languages', ['Spanish'])
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching providers:', error)
      return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 })
    }

    // Transform and filter results
    let providers = (data || []).map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      city: p.city,
      phone: p.phone,
      countiesServed: p.counties_served,
      servicesOffered: p.services_offered,
      availableHours: p.available_hours,
      languages: p.languages,
      availabilityUpdatedAt: p.availability_updated_at,
    }))

    // Client-side filters for available hours (nights/weekends)
    // These would ideally be database columns, but for now we filter by text
    if (nights) {
      providers = providers.filter(p =>
        p.availableHours?.toLowerCase().includes('night') ||
        p.availableHours?.toLowerCase().includes('24')
      )
    }

    if (weekends) {
      providers = providers.filter(p =>
        p.availableHours?.toLowerCase().includes('weekend') ||
        p.availableHours?.toLowerCase().includes('7 days') ||
        p.availableHours?.toLowerCase().includes('24')
      )
    }

    // Sort by most recently confirmed availability
    providers.sort((a, b) =>
      new Date(b.availabilityUpdatedAt).getTime() - new Date(a.availabilityUpdatedAt).getTime()
    )

    return NextResponse.json({ providers })
  } catch (error) {
    console.error('Error in case manager search:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
