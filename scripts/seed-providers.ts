/**
 * Seed script to import GAPP providers from CSV into Supabase
 *
 * Usage: npx tsx scripts/seed-providers.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Check .env.local')
  process.exit(1)
}

console.log('Connecting to Supabase:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// CSV file path - Updated file with phone numbers
const CSV_PATH = path.join(__dirname, '../../Need Phone_GAPP_Official_Providers_with_NPI_UPDATED - GAPP_Official_Providers_with_NP (1).csv')

interface CSVRow {
  NPI: string
  'Agency Name': string
  Address: string
  'Address 2': string
  City: string
  County: string
  ZIP: string
  'Provider Type': string
  'Primary Specialty': string
  'Contract Type': string
  Website: string
  'Accepting New Patients': string
  Phone: string
}

function parseCSV(content: string): CSVRow[] {
  const lines = content.split('\n')
  const headers = parseCSVLine(lines[0])
  const rows: CSVRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = parseCSVLine(line)
    const row: Record<string, string> = {}

    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })

    rows.push(row as unknown as CSVRow)
  }

  return rows
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

function createSlug(name: string, city: string, npi: string): string {
  const base = `${name} ${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  // Add last 4 of NPI for uniqueness
  const npiSuffix = npi ? `-${npi.slice(-4)}` : `-${Math.random().toString(36).slice(2, 6)}`
  return base + npiSuffix
}

function mapServices(providerType: string, specialty: string): string[] {
  const services: string[] = []

  // Map based on Provider Type and Primary Specialty
  if (specialty.toLowerCase().includes('skilled nurse') ||
      providerType.toLowerCase().includes('nursing')) {
    services.push('RN')
    services.push('LPN')
  }

  if (specialty.toLowerCase().includes('personal support') ||
      specialty.toLowerCase().includes('personal care') ||
      providerType.toLowerCase().includes('community based')) {
    services.push('PCS')
  }

  // If no services detected, default based on contract type patterns
  if (services.length === 0) {
    services.push('PCS') // Default
  }

  return services
}

function cleanWebsite(website: string): string | null {
  if (!website || website.trim() === '') return null

  let url = website.trim().toLowerCase()

  // Add https:// if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }

  return url
}

function formatAddress(address: string, address2: string, city: string, state: string, zip: string): string {
  const parts = [address]
  if (address2) parts.push(address2)
  parts.push(`${city}, ${state} ${zip}`)
  return parts.join(', ')
}

async function seedProviders() {
  console.log('Reading CSV file...')

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`CSV file not found at: ${CSV_PATH}`)
    process.exit(1)
  }

  const content = fs.readFileSync(CSV_PATH, 'utf-8')
  const rows = parseCSV(content)

  console.log(`Found ${rows.length} providers in CSV`)

  // First, clear existing providers (optional - comment out to append)
  console.log('Clearing existing providers...')
  const { error: deleteError } = await supabase
    .from('providers')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

  if (deleteError) {
    console.error('Error clearing providers:', deleteError)
    // Continue anyway - table might be empty
  }

  // Transform and insert providers
  const providers = rows.map((row, index) => {
    const name = row['Agency Name'] || `Provider ${index + 1}`
    const city = row.City || 'Unknown'
    const npi = row.NPI || ''
    const phone = row.Phone?.trim() || null

    return {
      name: name,
      slug: createSlug(name, city, npi),
      city: city,
      state: 'GA',
      counties_served: row.County ? [row.County] : [],
      address: formatAddress(row.Address, row['Address 2'], city, 'GA', row.ZIP),
      phone: phone,
      website: cleanWebsite(row.Website),
      services_offered: mapServices(row['Provider Type'], row['Primary Specialty']),
      accepting_new_patients: row['Accepting New Patients']?.toUpperCase() === 'YES',
      is_active: true,
      is_verified: true, // Mark as verified since they come from official list
      is_featured: false,
      tier_level: 1, // Basic tier
    }
  })

  console.log(`Inserting ${providers.length} providers...`)

  // Insert in batches of 50
  const BATCH_SIZE = 50
  let inserted = 0
  let errors = 0

  for (let i = 0; i < providers.length; i += BATCH_SIZE) {
    const batch = providers.slice(i, i + BATCH_SIZE)

    const { data, error } = await supabase
      .from('providers')
      .insert(batch)
      .select('id')

    if (error) {
      console.error(`Error inserting batch ${i / BATCH_SIZE + 1}:`, error)
      errors += batch.length
    } else {
      inserted += data?.length || 0
      console.log(`Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}: ${data?.length || 0} providers`)
    }
  }

  console.log('\n=== Seed Complete ===')
  console.log(`Successfully inserted: ${inserted}`)
  console.log(`Errors: ${errors}`)

  // Show sample of what was inserted
  const { data: sample } = await supabase
    .from('providers')
    .select('name, city, counties_served, services_offered, accepting_new_patients')
    .limit(5)

  console.log('\nSample providers:')
  sample?.forEach(p => {
    console.log(`  - ${p.name} (${p.city}) - ${p.services_offered?.join(', ')} - ${p.accepting_new_patients ? 'Accepting' : 'Not Accepting'}`)
  })
}

// Run the script
seedProviders().catch(console.error)
