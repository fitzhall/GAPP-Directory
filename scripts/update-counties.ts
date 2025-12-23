import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

// Extract text from docx
const docxPath = path.join(__dirname, '..', 'Appendix P - December 1, 2025 (1).docx')
const rawText = execSync(`unzip -p "${docxPath}" word/document.xml 2>/dev/null | sed 's/<[^>]*>//g'`).toString()

// Georgia counties for validation
const GEORGIA_COUNTIES = [
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

// Normalize county name
function normalizeCounty(county: string): string | null {
  const cleaned = county.trim()
    .replace(/\s+County$/i, '')
    .replace(/^\s+|\s+$/g, '')

  // Find matching county (case insensitive)
  const match = GEORGIA_COUNTIES.find(c =>
    c.toLowerCase() === cleaned.toLowerCase()
  )
  return match || null
}

// Parse provider entries from the document
function parseProviders(text: string): Map<string, string[]> {
  const providerCounties = new Map<string, string[]>()

  // Split by phone pattern to find provider blocks
  const blocks = text.split(/Phone:\s*\([0-9\-]+\)\s*[0-9\-]+/)

  for (const block of blocks) {
    // Skip if it says "Call Provider for Coverage Area"
    if (block.includes('Call Provider for Coverage Area')) continue

    // Find counties in this block
    const counties: string[] = []

    // Look for county names
    for (const county of GEORGIA_COUNTIES) {
      // Check if county appears in the block (with word boundaries)
      const regex = new RegExp(`\\b${county}\\b`, 'gi')
      if (regex.test(block)) {
        if (!counties.includes(county)) {
          counties.push(county)
        }
      }
    }

    if (counties.length === 0) continue

    // Try to extract provider name (usually at the start before counties or address)
    // Provider names typically end before the first county or address number
    const lines = block.split(/[\n\r]+/).filter(l => l.trim())

    if (lines.length > 0) {
      // The provider name is usually the first substantial text
      let providerName = ''

      // Look for the provider name pattern
      for (const line of lines) {
        const cleaned = line.trim()
        // Skip if it starts with a number (address)
        if (/^\d/.test(cleaned)) continue
        // Skip if it's just counties
        if (GEORGIA_COUNTIES.some(c => cleaned.toLowerCase().startsWith(c.toLowerCase()))) continue

        // This might be the provider name
        // Extract text before county names start
        let name = cleaned
        for (const county of GEORGIA_COUNTIES) {
          const idx = name.indexOf(county)
          if (idx > 0) {
            name = name.substring(0, idx).trim()
          }
        }

        if (name.length > 3 && !name.match(/^\d/)) {
          providerName = name.replace(/,\s*$/, '').trim()
          break
        }
      }

      if (providerName && counties.length > 0) {
        // Clean up provider name
        providerName = providerName
          .replace(/\s+/g, ' ')
          .replace(/[^\w\s&'-]/g, '')
          .trim()

        if (providerName.length > 3) {
          providerCounties.set(providerName, counties)
        }
      }
    }
  }

  return providerCounties
}

async function main() {
  console.log('Parsing Appendix P document...\n')

  const providerCounties = parseProviders(rawText)

  console.log(`Found ${providerCounties.size} providers with county data:\n`)

  // Output as JSON for review
  const output: Record<string, string[]> = {}
  providerCounties.forEach((counties, name) => {
    output[name] = counties.sort()
    console.log(`${name}: ${counties.join(', ')}`)
  })

  // Save to file for review
  const outputPath = path.join(__dirname, '..', 'provider-counties.json')
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2))
  console.log(`\nSaved to ${outputPath}`)

  // Now update the database
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.log('\nSkipping database update - no Supabase credentials')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Get all providers
  const { data: providers, error } = await supabase
    .from('providers')
    .select('id, name, counties_served')

  if (error) {
    console.error('Error fetching providers:', error)
    return
  }

  console.log(`\nFound ${providers?.length} providers in database`)

  let updated = 0
  let skipped = 0

  for (const provider of providers || []) {
    // Try to match provider name
    const normalizedName = provider.name.toLowerCase().trim()

    let matchedCounties: string[] | null = null

    // Try exact match first
    for (const [docName, counties] of providerCounties) {
      if (docName.toLowerCase().trim() === normalizedName) {
        matchedCounties = counties
        break
      }
    }

    // Try partial match
    if (!matchedCounties) {
      for (const [docName, counties] of providerCounties) {
        const docNameLower = docName.toLowerCase()
        if (normalizedName.includes(docNameLower) || docNameLower.includes(normalizedName)) {
          matchedCounties = counties
          break
        }
      }
    }

    if (matchedCounties && matchedCounties.length > 0) {
      // Merge with existing counties
      const existingCounties = provider.counties_served || []
      const mergedCounties = [...new Set([...existingCounties, ...matchedCounties])].sort()

      // Only update if we're adding new counties
      if (mergedCounties.length > existingCounties.length) {
        const { error: updateError } = await supabase
          .from('providers')
          .update({ counties_served: mergedCounties })
          .eq('id', provider.id)

        if (updateError) {
          console.error(`Error updating ${provider.name}:`, updateError)
        } else {
          console.log(`Updated ${provider.name}: ${existingCounties.length} → ${mergedCounties.length} counties`)
          updated++
        }
      } else {
        skipped++
      }
    }
  }

  console.log(`\nDone! Updated ${updated} providers, skipped ${skipped}`)
}

main().catch(console.error)
