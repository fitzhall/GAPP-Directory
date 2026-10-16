import { supabase } from '@/lib/supabase'
import type { StripProvider } from '@/components/FeaturedProvidersStrip'

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '')
  if (digits.length !== 10) return ''
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

// Featured agencies first, then verified ones, all with a phone number so a
// family can call straight from a content page instead of walking the
// 500-agency directory. Capped so the section stays short on a phone.
export async function getCallableProviders(limit = 6): Promise<StripProvider[]> {
  const { data, error } = await supabase
    .from('providers')
    .select('id, name, slug, city, phone, intake_phone, counties_served, accepting_new_patients, is_featured, is_verified, tier_level')
    .eq('is_active', true)
    .or('is_featured.eq.true,is_verified.eq.true')
    .order('is_featured', { ascending: false })
    .order('tier_level', { ascending: false })
    .order('accepting_new_patients', { ascending: false })
    .order('name')
    .limit(limit * 2)

  if (error || !data) return []

  return data
    .map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      city: (row.city || '').trim(),
      phone: formatPhone((row.intake_phone || row.phone || '') as string),
      countiesServed: row.counties_served || [],
      acceptingNewPatients: row.accepting_new_patients ?? false,
      isFeatured: row.is_featured ?? false,
      isVerified: row.is_verified ?? false,
    }))
    .filter(p => p.phone !== '')
    .slice(0, limit)
}
