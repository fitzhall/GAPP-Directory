import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ProviderCard } from '@/components/ProviderCard'
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

// Generate metadata for SEO
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

  return {
    title: `GAPP Providers in ${countyName} County, Georgia | Find Home Care`,
    description: `Find verified GAPP home care providers in ${countyName} County, GA. Compare RN nursing, LPN, and personal care services for children with special needs.`,
    keywords: `GAPP providers ${countyName} County, home care ${countyName} Georgia, pediatric nursing ${countyName}, PCS services ${countyName} GA`,
    openGraph: {
      title: `GAPP Providers in ${countyName} County, Georgia`,
      description: `Find verified home care providers for children in ${countyName} County. Compare services, check availability, and request callbacks.`,
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

  return (
    <div className="min-h-screen bg-gray-50">
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
        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
            <span className="text-2xl font-bold text-gray-900">{providers.length}</span>
            <span className="text-gray-600 ml-2">Provider{providers.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Quick filters */}
        <div className="mb-6">
          <Link
            href={`/directory?county=${countyName}`}
            className="inline-flex items-center text-sm text-primary hover:text-primary-dark"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter by service type
          </Link>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map(provider => (
              <ProviderCard key={provider.id} provider={toProviderCard(provider)} />
            ))}
          </div>
        )}

        {/* SEO content */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            About GAPP Services in {countyName} County
          </h2>
          <div className="prose prose-gray max-w-none">
            <p>
              The Georgia Pediatric Program (GAPP) provides essential home care services for children
              with special medical needs in {countyName} County and throughout Georgia. Our directory
              helps families connect with verified providers offering:
            </p>
            <ul>
              <li><strong>RN Nursing</strong> - Skilled nursing care from registered nurses</li>
              <li><strong>LPN Services</strong> - Licensed practical nurse care</li>
              <li><strong>Personal Care Services (PCS)</strong> - Daily living assistance and support</li>
            </ul>
            <p>
              All providers listed as &quot;Verified&quot; have been confirmed as active GAPP providers
              serving {countyName} County. Use our callback request form to connect with providers
              and learn about their availability.
            </p>
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
