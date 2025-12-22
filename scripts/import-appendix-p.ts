import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { execSync } from 'child_process'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100)
}

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

interface ParsedProvider {
  name: string
  phone: string
  city: string
  counties: string[]
  address: string
}

function parseAppendixP(rawText: string): ParsedProvider[] {
  const providers: ParsedProvider[] = []

  // Split by phone numbers to identify provider blocks
  // Pattern: Phone: (XXX) XXX-XXXX or (XXX) XXX-XXXX
  const phonePattern = /Phone:?\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/gi
  const phoneMatches = [...rawText.matchAll(phonePattern)]

  console.log(`Found ${phoneMatches.length} phone numbers`)

  for (let i = 0; i < phoneMatches.length; i++) {
    const phoneMatch = phoneMatches[i]
    const phone = phoneMatch[0].replace(/Phone:?\s*/i, '').trim()

    // Get text before this phone number (back to previous phone or start)
    const startIdx = i > 0 ? (phoneMatches[i - 1].index! + phoneMatches[i - 1][0].length) : 0
    const endIdx = phoneMatch.index!
    const blockText = rawText.substring(startIdx, endIdx)

    // Extract provider name - look for business name patterns
    // Names typically have keywords like Care, Health, Services, Home, etc.
    const namePatterns = [
      /([A-Z][A-Za-z\s&']+(?:Care|Health|Services|Agency|Nursing|Home|Solutions|Healthcare|Medical|Homecare|Caregiving|Angels?|Hearts?|Touch|Hands?|Family|Private|Personal|Professional)[A-Za-z\s]*)/,
      /([A-Z][A-Za-z\s&']{3,}(?:\s(?:of|for|and|&)\s[A-Za-z]+)?)/,
    ]

    let name = ''
    for (const pattern of namePatterns) {
      const match = blockText.match(pattern)
      if (match && match[1].length > 5 && match[1].length < 60) {
        name = match[1].trim()
        break
      }
    }

    if (!name) continue

    // Clean up name
    name = name
      .replace(/Call Provider.*/i, '')
      .replace(/\d{4,}/g, '')
      .replace(/Georgia/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    if (name.length < 5) continue

    // Extract counties from block
    const counties: string[] = []
    for (const county of georgiaCounties) {
      const countyRegex = new RegExp(`\\b${county}\\b`, 'i')
      if (countyRegex.test(blockText)) {
        counties.push(county)
      }
    }

    // Extract city from Georgia address pattern
    const cityMatch = blockText.match(/([A-Za-z\s]+),\s*Georgia\s*\d{5}/i)
    const city = cityMatch ? cityMatch[1].trim() : 'Georgia'

    // Extract full address if present
    const addressMatch = blockText.match(/(\d+[^,]+(?:,\s*(?:Suite|Bldg|Unit|Apt|Room)[^,]*)?,[^,]+,\s*Georgia\s*\d{5})/i)
    const address = addressMatch ? addressMatch[1] : ''

    providers.push({
      name,
      phone,
      city,
      counties: counties.length > 0 ? counties : [],
      address
    })
  }

  return providers
}

async function importProviders() {
  console.log('Extracting text from Appendix P...')

  const rawText = execSync(
    `unzip -p "Appendix P - December 1, 2025 (1).docx" word/document.xml | sed -e 's/<[^>]*>//g'`,
    { encoding: 'utf-8', cwd: process.cwd() }
  )

  console.log(`Raw text length: ${rawText.length} characters`)

  const providers = parseAppendixP(rawText)
  console.log(`\nParsed ${providers.length} providers from Appendix P`)

  // Show some samples
  console.log('\nSample parsed providers:')
  providers.slice(0, 10).forEach(p => {
    console.log(`  ${p.name} | ${p.phone} | ${p.city} | Counties: ${p.counties.slice(0, 3).join(', ')}${p.counties.length > 3 ? '...' : ''}`)
  })

  // Get existing providers for duplicate detection
  console.log('\nFetching existing providers...')
  const { data: existing, error: fetchError } = await supabase
    .from('providers')
    .select('name, phone, slug')

  if (fetchError) {
    console.error('Error fetching:', fetchError)
    return
  }

  // Normalize for comparison
  const existingNames = new Set((existing || []).map(p => p.name.toLowerCase().replace(/[^a-z0-9]/g, '')))
  const existingPhones = new Set((existing || []).map(p => (p.phone || '').replace(/\D/g, '')))
  const existingSlugs = new Set((existing || []).map(p => p.slug))

  console.log(`Found ${existing?.length || 0} existing providers in database`)

  // Filter duplicates
  const newProviders = providers.filter(p => {
    const normName = p.name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const normPhone = p.phone.replace(/\D/g, '')
    const isDupe = existingNames.has(normName) || (normPhone.length >= 10 && existingPhones.has(normPhone))
    return !isDupe
  })

  console.log(`\n${newProviders.length} new providers (${providers.length - newProviders.length} duplicates skipped)`)

  if (newProviders.length === 0) {
    console.log('No new providers to import!')
    return
  }

  // Prepare records for insert
  const records = newProviders.map(p => {
    let slug = slugify(p.name)
    let counter = 1
    while (existingSlugs.has(slug)) {
      slug = `${slugify(p.name).substring(0, 90)}-${counter}`
      counter++
    }
    existingSlugs.add(slug)

    return {
      name: p.name,
      slug,
      city: p.city || 'Georgia',
      state: 'GA',
      counties_served: p.counties.length > 0 ? p.counties : ['Fulton'], // Default to Fulton if unknown
      phone: p.phone,
      address: p.address || null,
      services_offered: ['RN', 'LPN'], // Default to nursing
      accepting_new_patients: true,
      is_active: true,
      is_verified: false,
      is_featured: false,
      tier_level: 0
    }
  })

  // Insert in batches
  console.log('\nInserting providers...')
  const batchSize = 25
  let totalInserted = 0

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize)

    const { error } = await supabase.from('providers').insert(batch)

    if (error) {
      console.error(`Batch ${Math.floor(i / batchSize) + 1} error:`, error.message)
      // Try one by one
      for (const rec of batch) {
        const { error: singleErr } = await supabase.from('providers').insert(rec)
        if (!singleErr) totalInserted++
        else console.error(`  Failed: ${rec.name}`)
      }
    } else {
      totalInserted += batch.length
      process.stdout.write(`\rInserted ${totalInserted}/${records.length}`)
    }
  }

  console.log(`\n\n✅ Imported ${totalInserted} new providers!`)

  // Final count
  const { count } = await supabase.from('providers').select('*', { count: 'exact', head: true })
  console.log(`Total providers in database: ${count}`)
}

importProviders().catch(console.error)
