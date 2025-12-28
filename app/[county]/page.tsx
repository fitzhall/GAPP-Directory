import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ProviderCard } from '@/components/ProviderCard'
import { PaginatedProviderList } from '@/components/PaginatedProviderList'
import { BreadcrumbSchema } from '@/components/JsonLd'
import { MiniScreener } from '@/components/MiniScreener'
import type { Provider, ProviderCardData } from '@/types/provider'

// Valid Georgia counties (lowercase for URL matching)
const GEORGIA_COUNTIES = [
  'appling', 'atkinson', 'bacon', 'baker', 'baldwin', 'banks', 'barrow', 'bartow', 'ben-hill',
  'berrien', 'bibb', 'bleckley', 'brantley', 'brooks', 'bryan', 'bulloch', 'burke', 'butts',
  'calhoun', 'camden', 'candler', 'carroll', 'catoosa', 'charlton', 'chatham', 'chattahoochee',
  'chattooga', 'cherokee', 'clarke', 'clay', 'clayton', 'clinch', 'cobb', 'coffee', 'colquitt',
  'columbia', 'cook', 'coweta', 'crawford', 'crisp', 'dade', 'dawson', 'decatur', 'dekalb',
  'dodge', 'dooly', 'dougherty', 'douglas', 'early', 'echols', 'effingham', 'elbert', 'emanuel',
  'evans', 'fannin', 'fayette', 'floyd', 'forsyth', 'franklin', 'fulton', 'gilmer', 'glascock',
  'glynn', 'gordon', 'grady', 'greene', 'gwinnett', 'habersham', 'hall', 'hancock', 'haralson',
  'harris', 'hart', 'heard', 'henry', 'houston', 'irwin', 'jackson', 'jasper', 'jeff-davis',
  'jefferson', 'jenkins', 'johnson', 'jones', 'lamar', 'lanier', 'laurens', 'lee', 'liberty',
  'lincoln', 'long', 'lowndes', 'lumpkin', 'macon', 'madison', 'marion', 'mcduffie', 'mcintosh',
  'meriwether', 'miller', 'mitchell', 'monroe', 'montgomery', 'morgan', 'murray', 'muscogee',
  'newton', 'oconee', 'oglethorpe', 'paulding', 'peach', 'pickens', 'pierce', 'pike', 'polk',
  'pulaski', 'putnam', 'quitman', 'rabun', 'randolph', 'richmond', 'rockdale', 'schley',
  'screven', 'seminole', 'spalding', 'stephens', 'stewart', 'sumter', 'talbot', 'taliaferro',
  'tattnall', 'taylor', 'telfair', 'terrell', 'thomas', 'tift', 'toombs', 'towns', 'treutlen',
  'troup', 'turner', 'twiggs', 'union', 'upson', 'walker', 'walton', 'ware', 'warren',
  'washington', 'wayne', 'webster', 'wheeler', 'white', 'whitfield', 'wilcox', 'wilkes',
  'wilkinson', 'worth'
]

function formatCountyName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// County metadata for unique content (top 30+ counties with regional context)
const COUNTY_CONTEXT: Record<string, { region: string; cities: string[]; description: string }> = {
  // Metro Atlanta (10 counties)
  'fulton': {
    region: 'Metro Atlanta',
    cities: ['Atlanta', 'Sandy Springs', 'Roswell', 'Johns Creek', 'Alpharetta'],
    description: 'As Georgia\'s most populous county and home to Atlanta, Fulton County has the highest concentration of GAPP providers in the state. Families here have access to a wide range of pediatric home care agencies.'
  },
  'gwinnett': {
    region: 'Metro Atlanta',
    cities: ['Lawrenceville', 'Duluth', 'Suwanee', 'Snellville', 'Buford'],
    description: 'Gwinnett County is one of Georgia\'s fastest-growing areas with strong healthcare infrastructure. Many GAPP providers serve the diverse communities throughout the county.'
  },
  'cobb': {
    region: 'Metro Atlanta',
    cities: ['Marietta', 'Smyrna', 'Kennesaw', 'Acworth', 'Powder Springs'],
    description: 'Cobb County offers families excellent access to pediatric home care services, with providers concentrated around Marietta and extending throughout the county.'
  },
  'dekalb': {
    region: 'Metro Atlanta',
    cities: ['Decatur', 'Dunwoody', 'Brookhaven', 'Tucker', 'Stonecrest'],
    description: 'DeKalb County\'s proximity to Atlanta means families have access to many GAPP providers. The county\'s diverse communities are served by agencies offering multilingual care.'
  },
  'clayton': {
    region: 'Metro Atlanta',
    cities: ['Jonesboro', 'Morrow', 'Forest Park', 'Riverdale', 'College Park'],
    description: 'Clayton County families can access GAPP services from providers based in the southern metro Atlanta area, with several agencies serving the Jonesboro and surrounding communities.'
  },
  'cherokee': {
    region: 'North Metro Atlanta',
    cities: ['Woodstock', 'Canton', 'Holly Springs', 'Ball Ground'],
    description: 'Cherokee County\'s growing population has attracted several GAPP providers. Families in Woodstock, Canton, and surrounding areas have increasing options for pediatric home care.'
  },
  'forsyth': {
    region: 'North Metro Atlanta',
    cities: ['Cumming', 'Johns Creek (partial)'],
    description: 'Forsyth County is one of Georgia\'s fastest-growing counties. GAPP providers serving this area often also cover neighboring Hall and Gwinnett counties.'
  },
  'henry': {
    region: 'South Metro Atlanta',
    cities: ['McDonough', 'Stockbridge', 'Hampton', 'Locust Grove'],
    description: 'Henry County families have access to GAPP providers serving the southern metro Atlanta region. The county\'s growth has brought more healthcare options to the area.'
  },
  'douglas': {
    region: 'West Metro Atlanta',
    cities: ['Douglasville', 'Austell (partial)', 'Villa Rica (partial)'],
    description: 'Douglas County is served by GAPP providers based in the western metro Atlanta area. Families often have providers who also serve neighboring Cobb and Paulding counties.'
  },
  'rockdale': {
    region: 'East Metro Atlanta',
    cities: ['Conyers'],
    description: 'Rockdale County families can access GAPP services from providers serving the eastern metro Atlanta corridor, often sharing coverage with DeKalb and Newton counties.'
  },
  // Major Regional Centers
  'chatham': {
    region: 'Coastal Georgia',
    cities: ['Savannah', 'Pooler', 'Garden City', 'Tybee Island'],
    description: 'Chatham County, home to Savannah, is the hub for GAPP services in coastal Georgia. Providers here often serve families throughout the surrounding coastal counties.'
  },
  'richmond': {
    region: 'Central Savannah River Area',
    cities: ['Augusta', 'Martinez', 'Evans'],
    description: 'Richmond County and the Augusta area serve as the regional center for GAPP services in eastern Georgia. Providers here often cover Columbia and surrounding counties.'
  },
  'muscogee': {
    region: 'West Central Georgia',
    cities: ['Columbus'],
    description: 'Muscogee County (Columbus) is the regional hub for GAPP services in west central Georgia, serving families along the Alabama border.'
  },
  'bibb': {
    region: 'Middle Georgia',
    cities: ['Macon'],
    description: 'Bibb County and Macon serve as the center for GAPP services in middle Georgia. Providers here often serve multiple surrounding counties.'
  },
  'dougherty': {
    region: 'Southwest Georgia',
    cities: ['Albany'],
    description: 'Dougherty County (Albany) is the primary hub for GAPP services in southwest Georgia, though provider availability in this region can be more limited.'
  },
  'lowndes': {
    region: 'South Georgia',
    cities: ['Valdosta'],
    description: 'Lowndes County (Valdosta) serves as a regional center for GAPP services in south Georgia, near the Florida border.'
  },
  'hall': {
    region: 'Northeast Georgia',
    cities: ['Gainesville', 'Flowery Branch', 'Oakwood'],
    description: 'Hall County and Gainesville serve as the hub for GAPP services in northeast Georgia. The area\'s healthcare infrastructure supports families throughout the region.'
  },
  'clarke': {
    region: 'Northeast Georgia',
    cities: ['Athens'],
    description: 'Clarke County (Athens) offers families access to GAPP providers serving the university community and surrounding northeast Georgia counties.'
  },
  'whitfield': {
    region: 'Northwest Georgia',
    cities: ['Dalton'],
    description: 'Whitfield County (Dalton) is the primary center for GAPP services in northwest Georgia, serving the carpet industry region.'
  },
  'floyd': {
    region: 'Northwest Georgia',
    cities: ['Rome'],
    description: 'Floyd County (Rome) offers GAPP services to families in the northwest Georgia region, with providers often covering multiple surrounding counties.'
  },
  'houston': {
    region: 'Middle Georgia',
    cities: ['Warner Robins', 'Perry', 'Centerville'],
    description: 'Houston County, home to Robins Air Force Base, has GAPP providers serving military families and the broader Warner Robins community.'
  },
  'columbia': {
    region: 'Central Savannah River Area',
    cities: ['Evans', 'Martinez', 'Grovetown'],
    description: 'Columbia County\'s growing population near Augusta has access to GAPP providers serving the CSRA region.'
  },
  'glynn': {
    region: 'Coastal Georgia',
    cities: ['Brunswick', 'St. Simons Island', 'Jekyll Island'],
    description: 'Glynn County on Georgia\'s coast offers GAPP services to families in the Golden Isles area, though options may be more limited than in metro areas.'
  },
  'liberty': {
    region: 'Coastal Georgia',
    cities: ['Hinesville', 'Midway'],
    description: 'Liberty County, home to Fort Stewart, has GAPP providers serving military families and the Hinesville community.'
  },
  'troup': {
    region: 'West Georgia',
    cities: ['LaGrange'],
    description: 'Troup County (LaGrange) offers GAPP services to families in west Georgia, often sharing providers with the Columbus area.'
  },
  'bartow': {
    region: 'Northwest Metro Atlanta',
    cities: ['Cartersville', 'Adairsville', 'Emerson'],
    description: 'Bartow County serves as a bridge between metro Atlanta and northwest Georgia, with GAPP providers often covering both regions.'
  },
  'paulding': {
    region: 'West Metro Atlanta',
    cities: ['Dallas', 'Hiram'],
    description: 'Paulding County\'s rapid growth has brought more GAPP provider options to families in Dallas, Hiram, and surrounding communities.'
  },
  'newton': {
    region: 'East Metro Atlanta',
    cities: ['Covington', 'Oxford'],
    description: 'Newton County families have access to GAPP providers serving the eastern metro Atlanta region and I-20 corridor.'
  },
  'fayette': {
    region: 'South Metro Atlanta',
    cities: ['Peachtree City', 'Fayetteville', 'Tyrone'],
    description: 'Fayette County\'s affluent communities have good access to GAPP providers, with agencies serving the Peachtree City and Fayetteville areas.'
  },
  'coweta': {
    region: 'South Metro Atlanta',
    cities: ['Newnan', 'Senoia', 'Sharpsburg'],
    description: 'Coweta County families can access GAPP providers serving the southern metro Atlanta region and extending toward LaGrange.'
  },
}

// Georgia county regions for "nearby counties" internal linking
const COUNTY_REGIONS: Record<string, string[]> = {
  // Metro Atlanta
  'fulton': ['dekalb', 'cobb', 'gwinnett', 'clayton', 'douglas'],
  'dekalb': ['fulton', 'gwinnett', 'rockdale', 'henry', 'clayton'],
  'cobb': ['fulton', 'paulding', 'douglas', 'cherokee', 'bartow'],
  'gwinnett': ['fulton', 'dekalb', 'barrow', 'walton', 'forsyth'],
  'clayton': ['fulton', 'henry', 'fayette', 'spalding', 'dekalb'],
  'cherokee': ['cobb', 'forsyth', 'bartow', 'pickens', 'dawson'],
  'forsyth': ['cherokee', 'gwinnett', 'hall', 'dawson', 'fulton'],
  'henry': ['clayton', 'dekalb', 'rockdale', 'newton', 'butts'],
  'douglas': ['cobb', 'fulton', 'paulding', 'carroll', 'haralson'],
  'paulding': ['cobb', 'douglas', 'bartow', 'polk', 'haralson'],
  'rockdale': ['dekalb', 'newton', 'henry', 'walton', 'gwinnett'],
  'newton': ['rockdale', 'walton', 'morgan', 'jasper', 'henry'],
  'fayette': ['clayton', 'coweta', 'spalding', 'fulton', 'henry'],
  'coweta': ['fayette', 'carroll', 'meriwether', 'troup', 'heard'],
  // North Georgia
  'hall': ['forsyth', 'jackson', 'banks', 'habersham', 'lumpkin'],
  'bartow': ['cobb', 'cherokee', 'paulding', 'polk', 'gordon'],
  'gordon': ['bartow', 'murray', 'whitfield', 'floyd', 'chattooga'],
  'whitfield': ['gordon', 'murray', 'catoosa', 'walker', 'chattooga'],
  'floyd': ['gordon', 'bartow', 'polk', 'chattooga', 'rome'],
  'walker': ['whitfield', 'catoosa', 'dade', 'chattooga', 'murray'],
  'catoosa': ['whitfield', 'walker', 'dade', 'hamilton'],
  // Northeast Georgia
  'clarke': ['oconee', 'madison', 'jackson', 'oglethorpe', 'barrow'],
  'oconee': ['clarke', 'morgan', 'walton', 'oglethorpe', 'greene'],
  'jackson': ['hall', 'barrow', 'madison', 'clarke', 'banks'],
  'barrow': ['gwinnett', 'jackson', 'walton', 'oconee', 'clarke'],
  // East Georgia
  'richmond': ['columbia', 'burke', 'jefferson', 'mcduffie', 'lincoln'],
  'columbia': ['richmond', 'lincoln', 'mcduffie', 'burke', 'warren'],
  'burke': ['richmond', 'jefferson', 'screven', 'jenkins', 'emanuel'],
  // Southeast Georgia
  'chatham': ['effingham', 'bryan', 'liberty', 'bulloch', 'savannah'],
  'effingham': ['chatham', 'bulloch', 'screven', 'bryan', 'jenkins'],
  'bryan': ['chatham', 'liberty', 'bulloch', 'long', 'effingham'],
  'liberty': ['bryan', 'long', 'mcintosh', 'tattnall', 'chatham'],
  'glynn': ['mcintosh', 'wayne', 'brantley', 'camden', 'charlton'],
  'camden': ['glynn', 'charlton', 'brantley', 'ware', 'wayne'],
  // Southwest Georgia
  'dougherty': ['lee', 'terrell', 'worth', 'mitchell', 'baker'],
  'muscogee': ['harris', 'chattahoochee', 'marion', 'talbot', 'meriwether'],
  'lee': ['dougherty', 'terrell', 'sumter', 'worth', 'crisp'],
  'thomas': ['grady', 'brooks', 'colquitt', 'mitchell', 'decatur'],
  'lowndes': ['brooks', 'lanier', 'echols', 'cook', 'berrien'],
  // Central Georgia
  'bibb': ['houston', 'jones', 'twiggs', 'crawford', 'peach'],
  'houston': ['bibb', 'peach', 'pulaski', 'dooly', 'crisp'],
  'jones': ['bibb', 'baldwin', 'twiggs', 'jasper', 'putnam'],
}

function getNearbyCounties(countySlug: string): string[] {
  // Check if we have predefined neighbors
  if (COUNTY_REGIONS[countySlug]) {
    return COUNTY_REGIONS[countySlug].slice(0, 5)
  }

  // Fallback: return some popular metro counties
  const fallbackCounties = ['fulton', 'cobb', 'gwinnett', 'dekalb', 'clayton']
  return fallbackCounties.filter(c => c !== countySlug).slice(0, 4)
}

function toProviderCard(provider: Provider): ProviderCardData {
  return {
    id: provider.id,
    name: provider.name,
    slug: provider.slug,
    city: provider.city,
    countiesServed: provider.countiesServed,
    servicesOffered: provider.servicesOffered,
    acceptingNewPatients: provider.acceptingNewPatients,
    tierLevel: provider.tierLevel,
    isVerified: provider.isVerified,
    isFeatured: provider.isFeatured,
    fastResponse: provider.fastResponse,
    backgroundCheckedStaff: provider.backgroundCheckedStaff,
    responseExpectation: provider.responseExpectation,
  }
}

async function getProvidersByCounty(countyName: string): Promise<Provider[]> {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('is_active', true)
    .contains('counties_served', [countyName])
    .order('is_featured', { ascending: false })
    .order('is_verified', { ascending: false })
    .order('name')

  if (error) {
    console.error('Error fetching providers:', error)
    return []
  }

  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    city: row.city,
    state: row.state,
    countiesServed: row.counties_served,
    email: row.email,
    phone: row.phone,
    intakePhone: row.intake_phone,
    website: row.website,
    address: row.address,
    servicesOffered: row.services_offered,
    acceptingNewPatients: row.accepting_new_patients,
    responseExpectation: row.response_expectation,
    availableHours: row.available_hours,
    languages: row.languages,
    bio: row.bio,
    howToStart: row.how_to_start,
    yearsInBusiness: row.years_in_business,
    tierLevel: row.tier_level,
    isActive: row.is_active,
    isVerified: row.is_verified,
    isFeatured: row.is_featured,
    backgroundCheckedStaff: row.background_checked_staff,
    fastResponse: row.fast_response,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    verifiedAt: row.verified_at,
    featuredAt: row.featured_at,
  }))
}

// Generate metadata for SEO - dynamic and unique per county
export async function generateMetadata({
  params,
}: {
  params: Promise<{ county: string }>
}): Promise<Metadata> {
  const { county } = await params
  const countySlug = county.toLowerCase()

  if (!GEORGIA_COUNTIES.includes(countySlug)) {
    return { title: 'Page Not Found' }
  }

  const countyName = formatCountyName(countySlug)
  const context = COUNTY_CONTEXT[countySlug]

  // Dynamic description based on county context
  let description: string
  if (context) {
    const cityList = context.cities.slice(0, 2).join(', ')
    description = `Find GAPP home care providers in ${countyName} County (${context.region}), serving ${cityList} and nearby areas. Compare RN nursing, LPN, and personal care services.`
  } else {
    description = `Find verified GAPP home care providers in ${countyName} County, Georgia. Compare pediatric nursing and personal care services for children with special needs.`
  }

  // Dynamic keywords
  const baseKeywords = `GAPP providers ${countyName} County, pediatric home care ${countyName} GA`
  const regionKeywords = context ? `, ${context.region} GAPP services` : ''
  const cityKeywords = context ? `, ${context.cities[0]} home care` : ''

  return {
    title: `GAPP Providers in ${countyName} County, Georgia | Pediatric Home Care`,
    description,
    keywords: `${baseKeywords}${regionKeywords}${cityKeywords}`,
    openGraph: {
      title: `GAPP Providers in ${countyName} County, Georgia`,
      description: context
        ? `Find pediatric home care in ${countyName} County (${context.region}). ${context.cities.length} communities served.`
        : `Find verified home care providers for children in ${countyName} County. Compare services and request callbacks.`,
      type: 'website',
    },
  }
}

// Generate static paths for all counties
export async function generateStaticParams() {
  return GEORGIA_COUNTIES.map(county => ({ county }))
}

export default async function CountyPage({
  params,
}: {
  params: Promise<{ county: string }>
}) {
  const { county } = await params
  const countySlug = county.toLowerCase()

  // Validate county
  if (!GEORGIA_COUNTIES.includes(countySlug)) {
    notFound()
  }

  const countyName = formatCountyName(countySlug)
  const providers = await getProvidersByCounty(countyName)

  // Calculate dynamic stats for unique content
  const verifiedProviders = providers.filter(p => p.isVerified)
  const rnProviders = providers.filter(p => p.servicesOffered?.includes('RN'))
  const lpnProviders = providers.filter(p => p.servicesOffered?.includes('LPN'))
  const pcsProviders = providers.filter(p => p.servicesOffered?.includes('PCS'))
  const acceptingProviders = providers.filter(p => p.acceptingNewPatients)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org Breadcrumb */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://georgiagapp.com' },
          { name: 'Directory', url: 'https://georgiagapp.com/directory' },
          { name: `${countyName} County`, url: `https://georgiagapp.com/${countySlug}` },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-b from-primary to-primary-dark text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <nav className="text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{countyName} County</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            GAPP Providers in {countyName} County
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Find verified home care providers for children with special needs in {countyName} County, Georgia.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Dynamic Stats - unique per county */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            GAPP Providers in {countyName} County
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-2xl font-bold text-gray-900">{verifiedProviders.length}</span>
              <p className="text-sm text-gray-600">Verified Providers</p>
            </div>
            {rnProviders.length > 0 && (
              <div>
                <span className="text-2xl font-bold text-blue-600">{rnProviders.length}</span>
                <p className="text-sm text-gray-600">Offer RN Nursing</p>
              </div>
            )}
            {lpnProviders.length > 0 && (
              <div>
                <span className="text-2xl font-bold text-purple-600">{lpnProviders.length}</span>
                <p className="text-sm text-gray-600">Offer LPN Services</p>
              </div>
            )}
            {pcsProviders.length > 0 && (
              <div>
                <span className="text-2xl font-bold text-teal-600">{pcsProviders.length}</span>
                <p className="text-sm text-gray-600">Offer Personal Care</p>
              </div>
            )}
            {acceptingProviders.length > 0 && (
              <div>
                <span className="text-2xl font-bold text-green-600">{acceptingProviders.length}</span>
                <p className="text-sm text-gray-600">Accepting Patients</p>
              </div>
            )}
          </div>

          {/* Service availability alerts - unique content per county */}
          {providers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
              {rnProviders.length === 0 && (
                <p className="text-amber-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  No RN nursing providers currently listed in {countyName} County.
                  <Link href="/directory" className="underline hover:no-underline">
                    Search nearby counties
                  </Link>
                </p>
              )}
              {pcsProviders.length === 0 && (
                <p className="text-amber-700 flex items-center gap-2 mt-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  No personal care (PCS) providers currently listed in {countyName} County.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Mini Screener Widget - Interactive utility for engagement */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <MiniScreener
            county={countyName}
            countySlug={countySlug}
            totalProviders={providers.length}
            rnCount={rnProviders.length}
            lpnCount={lpnProviders.length}
            pcsCount={pcsProviders.length}
          />

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href={`/directory?county=${countyName}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Filter by Service Type</p>
                  <p className="text-xs text-gray-500">RN, LPN, or Personal Care</p>
                </div>
              </Link>
              <Link
                href="/quiz"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Help Me Choose</p>
                  <p className="text-xs text-gray-500">Get matched to your needs</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Results */}
        {providers.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No providers found in {countyName} County
            </h3>
            <p className="text-gray-600 mb-4">
              We&apos;re working on adding providers in this area.
            </p>
            <Link
              href="/directory"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Browse all providers
            </Link>
          </div>
        ) : (
          <PaginatedProviderList
            providers={providers.map(toProviderCard)}
            pageSize={9}
          />
        )}

        {/* SEO content - Dynamic and unique per county */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {providers.length > 0
              ? `Finding Pediatric Home Care in ${countyName} County`
              : `GAPP Coverage in ${countyName} County, Georgia`
            }
          </h2>

          <div className="space-y-6">
            {/* Regional context for top counties */}
            {COUNTY_CONTEXT[countySlug] && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">{countyName} County</strong>, located in {COUNTY_CONTEXT[countySlug].region},
                  includes {COUNTY_CONTEXT[countySlug].cities.slice(0, 3).join(', ')}
                  {COUNTY_CONTEXT[countySlug].cities.length > 3 && ' and surrounding communities'}.
                </p>
                <p className="text-gray-600 mt-2 text-sm">
                  {COUNTY_CONTEXT[countySlug].description}
                </p>
              </div>
            )}

            {/* Dynamic content based on provider data */}
            {providers.length > 0 ? (
              <>
                {/* Provider stats */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span><strong>{providers.length}</strong> provider{providers.length !== 1 ? 's' : ''} listed</span>
                  </div>
                  {verifiedProviders.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span><strong>{verifiedProviders.length}</strong> verified</span>
                    </div>
                  )}
                  {acceptingProviders.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span><strong>{acceptingProviders.length}</strong> accepting patients</span>
                    </div>
                  )}
                </div>

                {/* Service-specific content */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Available Services in {countyName} County
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {rnProviders.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-blue-600">{rnProviders.length}</span>
                          <span className="text-sm font-medium text-blue-900">RN Nursing</span>
                        </div>
                        <p className="text-xs text-blue-700">
                          Skilled nursing for ventilator care, trach management, medication admin
                        </p>
                      </div>
                    )}
                    {lpnProviders.length > 0 && (
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-purple-600">{lpnProviders.length}</span>
                          <span className="text-sm font-medium text-purple-900">LPN Services</span>
                        </div>
                        <p className="text-xs text-purple-700">
                          Medication monitoring, wound care, health supervision under RN
                        </p>
                      </div>
                    )}
                    {pcsProviders.length > 0 && (
                      <div className="bg-teal-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-teal-600">{pcsProviders.length}</span>
                          <span className="text-sm font-medium text-teal-900">Personal Care</span>
                        </div>
                        <p className="text-xs text-teal-700">
                          Daily living assistance: bathing, dressing, feeding, mobility help
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Missing services note */}
                {(rnProviders.length === 0 || lpnProviders.length === 0 || pcsProviders.length === 0) && (
                  <p className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3">
                    <strong>Note:</strong> {[
                      rnProviders.length === 0 && 'RN nursing',
                      lpnProviders.length === 0 && 'LPN services',
                      pcsProviders.length === 0 && 'personal care (PCS)'
                    ].filter(Boolean).join(' and ')} {' '}
                    {rnProviders.length === 0 && lpnProviders.length === 0 ? 'are' : 'is'} not currently listed for {countyName} County.
                    <Link href="/directory" className="underline hover:no-underline ml-1">Check nearby counties</Link>.
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-gray-600">
                  {COUNTY_CONTEXT[countySlug]
                    ? `While ${countyName} County is part of ${COUNTY_CONTEXT[countySlug].region}, we don't currently have GAPP providers specifically listed for this area.`
                    : `We're working to expand our directory coverage to include ${countyName} County.`
                  } The Georgia Pediatric Program (GAPP) provides home care services throughout Georgia,
                  and providers in neighboring counties may serve your area.
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    What to Do If No Providers Are Listed
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-primary mt-1">•</span>
                      <span>Check <Link href="/directory" className="text-primary hover:underline font-medium">nearby counties</Link> - many providers serve multiple areas</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-primary mt-1">•</span>
                      <span>Use our <Link href="/screener" className="text-primary hover:underline font-medium">eligibility screener</Link> to confirm your child qualifies</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-primary mt-1">•</span>
                      <span>Contact your DCH care coordinator for provider referrals</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-primary mt-1">•</span>
                      <span>Ask about providers willing to travel to {countyName} County</span>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* Call to action */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-gray-600 text-sm">
                <strong className="text-gray-900">Ready to connect?</strong> Click on any provider above to view their full profile,
                services offered, and request a callback.
              </p>
            </div>
          </div>
        </div>

        {/* Nearby Counties - Internal Linking */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            GAPP Providers in Nearby Counties
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Can&apos;t find what you need in {countyName} County? Many providers serve multiple counties.
            Browse nearby areas:
          </p>
          <div className="flex flex-wrap gap-2">
            {getNearbyCounties(countySlug).map(nearbySlug => (
              <Link
                key={nearbySlug}
                href={`/${nearbySlug}`}
                className="px-4 py-2 bg-gray-50 hover:bg-primary/5 hover:text-primary border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                {formatCountyName(nearbySlug)} County
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              href="/directory"
              className="text-primary hover:underline text-sm font-medium"
            >
              View all Georgia counties →
            </Link>
          </div>
        </div>

        {/* Help CTA */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Need help finding the right provider?
          </h3>
          <p className="text-gray-600 mb-4">
            Take our quick quiz and we&apos;ll match you with providers that fit your needs.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Help Me Choose
          </Link>
        </div>
      </div>
    </div>
  )
}
