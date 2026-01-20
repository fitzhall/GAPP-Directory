import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Using anon key since service role has issues
)

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      name,
      city,
      phone,
      website,
      services_offered,
      counties_served,
      accepting_new_patients
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Provider ID is required' }, { status: 400 })
    }

    // Build update object with only provided fields
    const updates: Record<string, unknown> = {}

    if (name !== undefined) {
      updates.name = name
      updates.slug = slugify(name)
    }
    if (city !== undefined) updates.city = city
    if (phone !== undefined) updates.phone = phone
    if (website !== undefined) updates.website = website
    if (services_offered !== undefined) updates.services_offered = services_offered
    if (counties_served !== undefined) updates.counties_served = counties_served
    if (accepting_new_patients !== undefined) updates.accepting_new_patients = accepting_new_patients

    // Update provider
    const { data, error } = await supabase
      .from('providers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating provider:', error)
      return NextResponse.json({ error: 'Failed to update provider' }, { status: 500 })
    }

    return NextResponse.json({ success: true, provider: data })
  } catch (error) {
    console.error('Error in update-provider:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
