/**
 * Fix provider status - mark all as unverified until we make calls
 *
 * Usage: npx tsx scripts/fix-provider-status.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fixProviderStatus() {
  console.log('Updating all providers to unverified and hiding accepting status...')

  const { data, error } = await supabase
    .from('providers')
    .update({
      is_verified: false,
      accepting_new_patients: false, // Hide until we verify
      is_featured: false,
      tier_level: 0, // Basic tier until they upgrade
    })
    .neq('id', '00000000-0000-0000-0000-000000000000') // Update all
    .select('id')

  if (error) {
    console.error('Error updating providers:', error)
    return
  }

  console.log(`Updated ${data?.length || 0} providers`)
  console.log('All providers are now:')
  console.log('  - is_verified: false (until you call them)')
  console.log('  - accepting_new_patients: false (hidden until verified)')
  console.log('  - tier_level: 0 (basic tier)')
}

fixProviderStatus().catch(console.error)
