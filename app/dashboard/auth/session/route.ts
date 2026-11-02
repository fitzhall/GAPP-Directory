import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase-service'

// The sign-in email lands on /dashboard/auth/callback with the session in the
// URL #fragment, which never reaches the server. That page posts the tokens
// here; setSession checks them with Supabase and writes the session cookies.
export async function POST(request: NextRequest) {
  let body: { access_token?: unknown; refresh_token?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'auth_failed' }, { status: 400 })
  }

  const { access_token, refresh_token } = body
  if (typeof access_token !== 'string' || typeof refresh_token !== 'string') {
    return NextResponse.json({ error: 'auth_failed' }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.setSession({ access_token, refresh_token })

  if (error || !user) {
    return NextResponse.json({ error: 'auth_failed' }, { status: 401 })
  }

  const service = createServiceClient()

  const { data: linked } = await service
    .from('providers')
    .select('id')
    .eq('auth_user_id', user.id)
    .eq('is_active', true)
    .limit(1)

  if (!linked?.length && user.email) {
    // First sign-in: link the live listing claimed with this email.
    // Auth stores emails lowercased; claim forms kept whatever the agency
    // typed. Escape LIKE wildcards so ilike is a case-insensitive equals.
    // Retired duplicate listings can share the email, so link live ones only.
    const email = user.email.replace(/[\\%_]/g, (c) => `\\${c}`)
    const { data: updated, error: linkError } = await service
      .from('providers')
      .update({ auth_user_id: user.id })
      .ilike('claimed_by_email', email)
      .eq('is_active', true)
      .is('auth_user_id', null)
      .select('id')

    if (linkError) {
      console.error('Error linking auth user to provider:', linkError)
      return NextResponse.json({ error: 'auth_failed' }, { status: 500 })
    }

    if (!updated?.length) {
      await supabase.auth.signOut()
      return NextResponse.json({ error: 'no_listing' }, { status: 404 })
    }
  }

  return NextResponse.json({ ok: true })
}
