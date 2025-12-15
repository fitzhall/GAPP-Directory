import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Note: In production, add authentication/authorization here

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { data: providers, error } = await supabase
      .from('providers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    const stats = {
      total: providers?.length || 0,
      verified: providers?.filter(p => p.is_verified).length || 0,
      featured: providers?.filter(p => p.is_featured).length || 0,
      accepting: providers?.filter(p => p.accepting_new_patients).length || 0,
    }

    return NextResponse.json({
      data: providers,
      stats
    })
  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
