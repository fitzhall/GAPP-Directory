'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ProviderCard } from '@/components/ProviderCard'
import { supabase, toProviderCard } from '@/lib/supabase'
import type { Provider, ServiceType, ProviderCardData } from '@/types/provider'

// Georgia counties - dynamically populated from data
const GEORGIA_COUNTIES = [
  'Appling', 'Baldwin', 'Barrow', 'Bartow', 'Bibb', 'Brooks', 'Bryan',
  'Carroll', 'Chatham', 'Cherokee', 'Clarke', 'Clayton', 'Cobb', 'Coffee',
  'Colquitt', 'Columbia', 'Coweta', 'Crawford', 'Crisp', 'DeKalb', 'Dodge',
  'Dougherty', 'Douglas', 'Echols', 'Effingham', 'Elbert', 'Emanuel', 'Fayette',
  'Floyd', 'Forsyth', 'Fulton', 'Glynn', 'Gordon', 'Gwinnett', 'Habersham',
  'Hall', 'Henry', 'Houston', 'Jackson', 'Jasper', 'Jeff Davis', 'Jefferson',
  'Jones', 'Lanier', 'Laurens', 'Lee', 'Liberty', 'Lowndes', 'Lumpkin',
  'McDuffie', 'McIntosh', 'Meriwether', 'Monroe', 'Montgomery', 'Morgan',
  'Muscogee', 'Newton', 'Oconee', 'Paulding', 'Peach', 'Pickens', 'Pike',
  'Polk', 'Putnam', 'Rabun', 'Richmond', 'Rockdale', 'Spalding', 'Stephens',
  'Sumter', 'Tattnall', 'Thomas', 'Tift', 'Toombs', 'Troup', 'Twiggs',
  'Union', 'Upson', 'Walker', 'Walton', 'Ware', 'Washington', 'Wayne',
  'White', 'Whitfield', 'Wilkes', 'Worth'
].sort()

const ITEMS_PER_PAGE = 12

type ServiceFilter = ServiceType | 'all'
// Removed verification filter - public directory only shows verified providers

function DirectoryContent() {
  const searchParams = useSearchParams()

  // Get initial values from URL (from quiz)
  const initialCounty = searchParams.get('county') || ''
  const initialService = (searchParams.get('service') as ServiceType) || 'all'

  // State
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [county, setCounty] = useState(initialCounty)
  const [service, setService] = useState<ServiceFilter>(initialService as ServiceFilter || 'all')
  const [searchQuery, setSearchQuery] = useState('')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch providers from Supabase
  useEffect(() => {
    async function fetchProviders() {
      setLoading(true)
      setError(null)

      try {
        const query = supabase
          .from('providers')
          .select('*')
          .eq('is_active', true)
          .order('is_featured', { ascending: false })
          .order('tier_level', { ascending: false })
          .order('name')

        const { data, error: fetchError } = await query

        if (fetchError) throw fetchError

        // Transform snake_case to camelCase
        const transformed: Provider[] = (data || []).map(row => ({
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

        setProviders(transformed)
      } catch (err) {
        console.error('Error fetching providers:', err)
        setError('Unable to load providers. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
  }, [])

  // Filter providers client-side
  const FREE_TIER_COUNTY_LIMIT = 5

  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      // County filter - non-verified only appear for their first 5 counties
      if (county) {
        const visibleCounties = provider.isVerified
          ? provider.countiesServed
          : [...provider.countiesServed].sort().slice(0, FREE_TIER_COUNTY_LIMIT)

        if (!visibleCounties.includes(county)) {
          return false
        }
      }

      // Service filter
      if (service !== 'all' && !provider.servicesOffered.includes(service)) {
        return false
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = provider.name.toLowerCase().includes(query)
        const matchesCity = provider.city.toLowerCase().includes(query)
        if (!matchesName && !matchesCity) {
          return false
        }
      }

      return true
    })
  }, [providers, county, service, searchQuery])

  // Sort: Premium+Verified > Verified > Claimed > Featured-but-not-verified > Unclaimed
  // NOTE: Featured providers who lost verification should NOT rank above verified providers
  const sortedProviders = useMemo(() => {
    return [...filteredProviders].sort((a, b) => {
      // Calculate tier score - verification is required to benefit from featured status
      const getTierScore = (p: typeof a) => {
        if (p.isFeatured && p.isVerified) return 5  // Premium AND verified - top ranking
        if (p.isVerified) return 4                   // Verified (with or without featured)
        if (p.isFeatured) return 2                   // Featured but NOT verified - demoted below verified
        if (p.isClaimed) return 1                    // Claimed only
        return 0                                      // Unclaimed
      }
      const scoreA = getTierScore(a)
      const scoreB = getTierScore(b)

      // Higher tier first
      if (scoreA !== scoreB) return scoreB - scoreA

      // Then alphabetically
      return a.name.localeCompare(b.name)
    })
  }, [filteredProviders])

  // Pagination
  const totalPages = Math.ceil(sortedProviders.length / ITEMS_PER_PAGE)
  const paginatedProviders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return sortedProviders.slice(start, start + ITEMS_PER_PAGE)
  }, [sortedProviders, currentPage])

  // Convert to card data
  const providerCards: ProviderCardData[] = paginatedProviders.map(toProviderCard)

  // Count of active filters
  const activeFilterCount = [
    county !== '',
    service !== 'all',
    searchQuery !== ''
  ].filter(Boolean).length

  const clearFilters = () => {
    setCounty('')
    setService('all')
    setSearchQuery('')
    setCurrentPage(1)
  }

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [county, service, searchQuery])

  // Stats - all providers shown are verified
  const providerCount = providers.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find a Provider</h1>
              <p className="text-gray-600 mt-1">
                {loading
                  ? 'Loading providers...'
                  : `${sortedProviders.length} provider${sortedProviders.length !== 1 ? 's' : ''} found`
                }
              </p>
            </div>
            <Link
              href="/quiz"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-accent hover:text-accent-dark"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help me choose
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by provider name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* County dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                County
              </label>
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All Counties</option>
                {GEORGIA_COUNTIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Service dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Service Type
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value as ServiceFilter)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Services</option>
                <option value="RN">RN Nursing</option>
                <option value="LPN">LPN Nursing</option>
                <option value="PCS">Personal Care</option>
              </select>
            </div>
          </div>

          {/* Clear filters */}
          {activeFilterCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
              </span>
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-100 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-100 rounded-full w-24"></div>
                </div>
                <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            {providerCards.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No providers found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search a different county.
                </p>
                <button
                  onClick={clearFilters}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                {/* Results count and page info */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, sortedProviders.length)} of {sortedProviders.length}
                  </p>
                  {totalPages > 1 && (
                    <p className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </p>
                  )}
                </div>

                {/* Provider grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {providerCards.map(provider => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {/* Page numbers */}
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium ${
                              currentPage === pageNum
                                ? 'bg-primary text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Help prompt for families */}
        {!loading && providerCards.length > 0 && (
          <div className="mt-8 bg-blue-50 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Not sure which provider is right for you?
            </h3>
            <p className="text-gray-600 mb-4">
              Take our quick quiz and we&apos;ll help you find the best match.
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Help Me Choose
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <DirectoryContent />
    </Suspense>
  )
}
