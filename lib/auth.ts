import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
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
}

export async function getProviderSession() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: provider } = await supabase
    .from('providers')
    .select('id, name, slug, tier_level, is_verified, is_featured, claimed_by_email')
    .eq('auth_user_id', user.id)
    .single()

  if (!provider) return null

  return {
    user,
    provider: {
      id: provider.id as string,
      name: provider.name as string,
      slug: provider.slug as string,
      tierLevel: provider.tier_level as number,
      isVerified: provider.is_verified as boolean,
      isFeatured: provider.is_featured as boolean,
      email: provider.claimed_by_email as string,
    },
  }
}
