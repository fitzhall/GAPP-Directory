'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AvailableProvider {
  id: string
  name: string
  slug: string
  city: string
  phone: string
  countiesServed: string[]
  servicesOffered: string[]
  availableHours: string | null
  languages: string[] | null
  availabilityUpdatedAt: string
}

// Georgia counties
const GEORGIA_COUNTIES = [
  'Fulton', 'Gwinnett', 'Cobb', 'DeKalb', 'Clayton',
  'Cherokee', 'Forsyth', 'Henry', 'Hall', 'Richmond',
  'Chatham', 'Muscogee', 'Columbia', 'Douglas', 'Paulding',
  'Bibb', 'Houston', 'Clarke', 'Fayette', 'Coweta',
  'Carroll', 'Bartow', 'Lowndes', 'Whitfield', 'Floyd',
  'Rockdale', 'Newton', 'Troup', 'Glynn', 'Dougherty',
  'Bryan', 'Effingham', 'Liberty', 'Camden', 'McIntosh',
  'Wayne', 'Burke', 'McDuffie', 'Brooks', 'Echols',
  'Lanier', 'Walton', 'Barrow', 'Peach', 'Crawford'
].sort()

export default function CaseManagersPage() {
  const [county, setCounty] = useState('')
  const [serviceType, setServiceType] = useState<string>('all')
  const [filters, setFilters] = useState({
    nights: false,
    weekends: false,
    highMedical: false,
    spanish: false,
  })
  const [providers, setProviders] = useState<AvailableProvider[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function searchProviders() {
    if (!county) return

    setLoading(true)
    setSearched(true)

    try {
      const params = new URLSearchParams({
        county,
        ...(serviceType !== 'all' && { service: serviceType }),
        ...(filters.nights && { nights: 'true' }),
        ...(filters.weekends && { weekends: 'true' }),
        ...(filters.highMedical && { highMedical: 'true' }),
        ...(filters.spanish && { spanish: 'true' }),
      })

      const res = await fetch(`/api/case-managers/search?${params}`)
      const data = await res.json()

      if (res.ok) {
        setProviders(data.providers || [])
      }
    } catch (err) {
      console.error('Error searching:', err)
    }

    setLoading(false)
  }

  function getDaysAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'today'
    if (diffDays === 1) return 'yesterday'
    return `${diffDays} days ago`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="text-primary text-sm hover:underline mb-4 inline-block">
            ← GeorgiaGAPP.com
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Find Available Providers
          </h1>
          <p className="text-gray-600 mt-2">
            Only showing verified providers who confirmed availability this week
          </p>
        </div>
      </div>

      {/* Case Manager Info Box */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">For GAPP Case Managers</h3>
              <p className="text-sm text-blue-800">
                This page is designed specifically for case managers placing GAPP cases.
                We ping verified providers every Monday to confirm their availability, so you only see
                providers who are actually ready to take new cases this week. No more calling 20 agencies
                to find one that's open.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {/* County */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                County <span className="text-red-500">*</span>
              </label>
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              >
                <option value="">Select county...</option>
                {GEORGIA_COUNTIES.map(c => (
                  <option key={c} value={c}>{c} County</option>
                ))}
              </select>
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Service Type
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              >
                <option value="all">All Services</option>
                <option value="RN">RN Nursing</option>
                <option value="LPN">LPN Nursing</option>
                <option value="PCS">Personal Care (PCS)</option>
              </select>
            </div>
          </div>

          {/* Special Needs Filters */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requirements
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'nights', label: 'Night hours' },
                { key: 'weekends', label: 'Weekends' },
                { key: 'highMedical', label: 'High medical complexity' },
                { key: 'spanish', label: 'Spanish speaking' },
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setFilters(prev => ({ ...prev, [filter.key]: !prev[filter.key as keyof typeof prev] }))}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filters[filter.key as keyof typeof filters]
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={searchProviders}
            disabled={!county || loading}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium transition-colors ${
              county && !loading
                ? 'bg-accent text-white hover:bg-accent/90'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? 'Searching...' : 'Search Available Providers'}
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div>
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                Searching...
              </div>
            ) : providers.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  {providers.length} provider{providers.length !== 1 ? 's' : ''} available in {county} County
                </p>

                {providers.map(provider => (
                  <div
                    key={provider.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-grow">
                        {/* Provider Name & Location */}
                        <h3 className="font-semibold text-gray-900 text-lg">{provider.name}</h3>
                        <p className="text-gray-500 text-sm">{provider.city}, Georgia</p>

                        {/* Availability Badge */}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            Available
                          </span>
                          <span className="text-xs text-gray-500">
                            Confirmed {getDaysAgo(provider.availabilityUpdatedAt)}
                          </span>
                        </div>

                        {/* Services */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {provider.servicesOffered.map(service => (
                            <span
                              key={service}
                              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {service}
                            </span>
                          ))}
                        </div>

                        {/* Counties */}
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Counties:</span>{' '}
                          {provider.countiesServed.slice(0, 5).join(', ')}
                          {provider.countiesServed.length > 5 && ` +${provider.countiesServed.length - 5} more`}
                        </p>

                        {/* Additional Info */}
                        {(provider.availableHours || (provider.languages && provider.languages.length > 1)) && (
                          <div className="text-sm text-gray-600 mt-1">
                            {provider.availableHours && (
                              <span><span className="font-medium">Hours:</span> {provider.availableHours}</span>
                            )}
                            {provider.languages && provider.languages.length > 1 && (
                              <span className="ml-3"><span className="font-medium">Languages:</span> {provider.languages.join(', ')}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Phone - Right Side */}
                      <div className="flex-shrink-0">
                        <a
                          href={`tel:${provider.phone.replace(/\D/g, '')}`}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {provider.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No Available Providers</h3>
                <p className="text-gray-600 text-sm mb-4">
                  No providers confirmed availability in {county} County this week.
                </p>
                <p className="text-gray-500 text-xs">
                  Try a neighboring county or check back Monday when availability resets.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Providers confirm availability weekly. Last updated every Monday.
          </p>
        </div>
      </div>
    </div>
  )
}
