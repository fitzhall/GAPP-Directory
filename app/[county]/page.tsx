import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { GEORGIA_COUNTIES, COUNTY_CONTEXT, formatCountyName, getNearbyCounties } from '@/lib/county-data'
import { ProviderCard } from '@/components/ProviderCard'
import { PaginatedProviderList } from '@/components/PaginatedProviderList'
import { BreadcrumbSchema } from '@/components/JsonLd'
import { MiniScreener } from '@/components/MiniScreener'
import type { Provider, ProviderCardData } from '@/types/provider'

// County data imported from lib/county-data.ts (single source of truth)

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
    isClaimed: provider.isClaimed,
    isVerified: provider.isVerified,
    isFeatured: provider.isFeatured,
    phone: provider.phone,
    fastResponse: provider.fastResponse,
    backgroundCheckedStaff: provider.backgroundCheckedStaff,
    responseExpectation: provider.responseExpectation,
  }
}

const FREE_TIER_COUNTY_LIMIT = 5

async function getProvidersByCounty(countyName: string): Promise<Provider[]> {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('is_active', true)
    .contains('counties_served', [countyName])
    .order('is_featured', { ascending: false })
    .order('is_verified', { ascending: false })
    .order('is_claimed', { ascending: false })
    .order('name')

  if (error) {
    console.error('Error fetching providers:', error)
    return []
  }

  // Filter: non-verified providers only appear for their first 5 counties (alphabetically)
  const filteredData = (data || []).filter(row => {
    if (row.is_verified) return true // Verified providers appear for all counties

    // For non-verified, check if this county is in their first 5 visible counties
    const sortedCounties = [...(row.counties_served || [])].sort()
    const visibleCounties = sortedCounties.slice(0, FREE_TIER_COUNTY_LIMIT)
    return visibleCounties.includes(countyName)
  })

  return filteredData.map(row => ({
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
    isClaimed: row.is_claimed ?? false,
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
    alternates: {
      canonical: `https://www.georgiagapp.com/${countySlug}`,
    },
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
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Directory', url: 'https://www.georgiagapp.com/directory' },
          { name: `${countyName} County`, url: `https://www.georgiagapp.com/${countySlug}` },
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

        {/* SEO content - Unique regional context for Google (not redundant with stats above) */}
        {COUNTY_CONTEXT[countySlug] && (
          <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              About {countyName} County
            </h2>
            <p className="text-gray-600 leading-relaxed">
              <strong className="text-gray-900">{countyName} County</strong>, located in {COUNTY_CONTEXT[countySlug].region},
              includes {COUNTY_CONTEXT[countySlug].cities.slice(0, 3).join(', ')}
              {COUNTY_CONTEXT[countySlug].cities.length > 3 && ' and surrounding communities'}.{' '}
              {COUNTY_CONTEXT[countySlug].description}
            </p>
          </div>
        )}

        {/* No providers - helpful guidance */}
        {providers.length === 0 && (
          <div className="mt-8 bg-amber-50 rounded-xl border border-amber-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              No Providers Listed Yet
            </h3>
            <p className="text-gray-600 mb-4">
              We&apos;re working to expand coverage in {countyName} County. In the meantime:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-amber-600 mt-0.5">→</span>
                <span>Check <Link href="/directory" className="text-primary hover:underline font-medium">nearby counties</Link> - many providers serve multiple areas</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-amber-600 mt-0.5">→</span>
                <span>Use our <Link href="/screener" className="text-primary hover:underline font-medium">eligibility screener</Link> to confirm your child qualifies</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-amber-600 mt-0.5">→</span>
                <span>Contact your DCH care coordinator for provider referrals</span>
              </li>
            </ul>
          </div>
        )}

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

        {/* GAPP Approval Guide Callout */}
        <div className="mt-8 bg-gradient-to-br from-primary/5 to-blue-50 rounded-xl border border-primary/20 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Getting Approved for GAPP in {countyName} County?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Learn the step-by-step approval process and find out what documentation you need before contacting providers.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/gapp-approval-guide"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Read the Approval Guide
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/screener"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Check Eligibility
                </Link>
                <Link
                  href="/how-to-apply-for-gapp"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Application Checklist
                </Link>
              </div>
            </div>
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
