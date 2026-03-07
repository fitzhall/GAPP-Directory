import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/auth'

export async function POST() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/dashboard/login', process.env.NEXT_PUBLIC_BASE_URL || 'https://www.georgiagapp.com'))
}
