import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load from .env.local
config({ path: '.env.local' })

// Using anon key - RLS policy allows updates for now
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function verifyOnePerCounty() {
  console.log('Fetching all providers...')

  // Get all active providers
  const { data: providers, error } = await supabase
    .from('providers')
    .select('id, name, counties_served, is_verified')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Error fetching providers:', error)
    return
  }

  console.log(`Found ${providers.length} active providers`)

  // Build a map of county -> first provider (alphabetically)
  const countyToProvider = new Map<string, { id: string; name: string }>()

  for (const provider of providers) {
    for (const county of provider.counties_served || []) {
      if (!countyToProvider.has(county)) {
        countyToProvider.set(county, { id: provider.id, name: provider.name })
      }
    }
  }

  console.log(`\nFound providers for ${countyToProvider.size} counties`)

  // Get unique provider IDs to verify
  const providerIdsToVerify = new Set<string>()
  for (const provider of countyToProvider.values()) {
    providerIdsToVerify.add(provider.id)
  }

  console.log(`\nWill verify ${providerIdsToVerify.size} unique providers...`)

  // Update providers to be verified
  const { error: updateError, count } = await supabase
    .from('providers')
    .update({
      is_verified: true,
      verified_at: new Date().toISOString(),
      accepting_new_patients: true
    })
    .in('id', Array.from(providerIdsToVerify))

  if (updateError) {
    console.error('Error updating providers:', updateError)
    return
  }

  console.log(`\nSuccessfully verified ${providerIdsToVerify.size} providers!`)

  // Print summary by county
  console.log('\n--- Verified Providers by County ---')
  const sortedCounties = Array.from(countyToProvider.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  )

  for (const [county, provider] of sortedCounties) {
    console.log(`${county}: ${provider.name}`)
  }

  // Check for counties without providers
  const georgiaCounties = [
    'Appling', 'Atkinson', 'Bacon', 'Baker', 'Baldwin', 'Banks', 'Barrow', 'Bartow', 'Ben Hill',
    'Berrien', 'Bibb', 'Bleckley', 'Brantley', 'Brooks', 'Bryan', 'Bulloch', 'Burke', 'Butts',
    'Calhoun', 'Camden', 'Candler', 'Carroll', 'Catoosa', 'Charlton', 'Chatham', 'Chattahoochee',
    'Chattooga', 'Cherokee', 'Clarke', 'Clay', 'Clayton', 'Clinch', 'Cobb', 'Coffee', 'Colquitt',
    'Columbia', 'Cook', 'Coweta', 'Crawford', 'Crisp', 'Dade', 'Dawson', 'Decatur', 'DeKalb',
    'Dodge', 'Dooly', 'Dougherty', 'Douglas', 'Early', 'Echols', 'Effingham', 'Elbert', 'Emanuel',
    'Evans', 'Fannin', 'Fayette', 'Floyd', 'Forsyth', 'Franklin', 'Fulton', 'Gilmer', 'Glascock',
    'Glynn', 'Gordon', 'Grady', 'Greene', 'Gwinnett', 'Habersham', 'Hall', 'Hancock', 'Haralson',
    'Harris', 'Hart', 'Heard', 'Henry', 'Houston', 'Irwin', 'Jackson', 'Jasper', 'Jeff Davis',
    'Jefferson', 'Jenkins', 'Johnson', 'Jones', 'Lamar', 'Lanier', 'Laurens', 'Lee', 'Liberty',
    'Lincoln', 'Long', 'Lowndes', 'Lumpkin', 'Macon', 'Madison', 'Marion', 'McDuffie', 'McIntosh',
    'Meriwether', 'Miller', 'Mitchell', 'Monroe', 'Montgomery', 'Morgan', 'Murray', 'Muscogee',
    'Newton', 'Oconee', 'Oglethorpe', 'Paulding', 'Peach', 'Pickens', 'Pierce', 'Pike', 'Polk',
    'Pulaski', 'Putnam', 'Quitman', 'Rabun', 'Randolph', 'Richmond', 'Rockdale', 'Schley',
    'Screven', 'Seminole', 'Spalding', 'Stephens', 'Stewart', 'Sumter', 'Talbot', 'Taliaferro',
    'Tattnall', 'Taylor', 'Telfair', 'Terrell', 'Thomas', 'Tift', 'Toombs', 'Towns', 'Treutlen',
    'Troup', 'Turner', 'Twiggs', 'Union', 'Upson', 'Walker', 'Walton', 'Ware', 'Warren',
    'Washington', 'Wayne', 'Webster', 'Wheeler', 'White', 'Whitfield', 'Wilcox', 'Wilkes',
    'Wilkinson', 'Worth'
  ]

  const missingCounties = georgiaCounties.filter(c => !countyToProvider.has(c))
  if (missingCounties.length > 0) {
    console.log(`\n--- Counties WITHOUT a verified provider (${missingCounties.length}) ---`)
    console.log(missingCounties.join(', '))
  } else {
    console.log('\n✅ All 159 Georgia counties have a verified provider!')
  }
}

verifyOnePerCounty()
