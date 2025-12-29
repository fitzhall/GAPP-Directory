import { redirect, notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

// Create a server-side Supabase client
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

interface Props {
  params: Promise<{ token: string }>
}

export default async function ClaimTokenPage({ params }: Props) {
  const { token } = await params

  const supabase = getSupabase()

  // Look up provider by claim token
  const { data: provider, error } = await supabase
    .from('providers')
    .select('slug, name, is_claimed')
    .eq('claim_token', token)
    .single()

  if (error || !provider) {
    notFound()
  }

  // Redirect to the claim page
  redirect(`/claim/${provider.slug}`)
}

export async function generateMetadata({ params }: Props) {
  const { token } = await params

  const supabase = getSupabase()

  const { data: provider } = await supabase
    .from('providers')
    .select('name')
    .eq('claim_token', token)
    .single()

  return {
    title: provider ? `Claim ${provider.name} | GeorgiaGAPP` : 'Claim Your Profile | GeorgiaGAPP',
    robots: 'noindex, nofollow', // Don't index token URLs
  }
}
