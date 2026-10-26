import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/dashboard/login?error=missing_code`)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !user) {
    return NextResponse.redirect(`${origin}/dashboard/login?error=auth_failed`)
  }

  // Link auth user to provider record (first login only)
  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: existing } = await serviceClient
    .from('providers')
    .select('id')
    .eq('auth_user_id', user.id)
    .eq('is_active', true)
    .single()

  if (!existing && user.email) {
    // Auth stores emails lowercased; claim forms kept whatever the agency
    // typed. Escape LIKE wildcards so ilike is a case-insensitive equals.
    // Retired duplicate listings can share the email, so link live ones only.
    const email = user.email.replace(/[\\%_]/g, (c) => `\\${c}`)
    const { error: linkError } = await serviceClient
      .from('providers')
      .update({ auth_user_id: user.id })
      .ilike('claimed_by_email', email)
      .eq('is_active', true)
      .is('auth_user_id', null)

    if (linkError) {
      console.error('Error linking auth user to provider:', linkError)
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
