'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { config } from '@/lib/config'

interface SearchResult {
  id: string
  name: string
  slug: string
  city: string
  countiesServed: string[]
  servicesOffered: string[]
  isVerified: boolean
  isClaimed?: boolean
}

export default function ForProvidersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showNotFound, setShowNotFound] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (searchQuery.length < 2) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    setIsSearching(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`)
        if (res.ok) {
          const data = await res.json()
          setSearchResults(data.results || [])
          setShowDropdown(true)
        }
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchQuery])

  // Form state for "not in directory" submissions
  const [formData, setFormData] = useState({
    agencyName: '',
    contactName: '',
    email: '',
    phone: '',
    county: '',
    services: [] as string[],
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/providers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero - Reframed around claiming */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            You&apos;re Already Listed — It&apos;s Free to Claim
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Claim Your Profile
            <span className="block text-primary-light">Start Getting More Cases</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Every Georgia GAPP provider is already in our directory.
            Claim your profile to unlock your contact info and get verified.
          </p>
          <a
            href="#claim-section"
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors text-lg"
          >
            Find & Claim Your Profile — Free
          </a>
        </div>
      </section>

      {/* Why Claim Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Why Claim Your Profile?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Right now, families can see your name but can&apos;t contact you. Claiming fixes that.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                Without Claiming
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  Phone number hidden from families
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  No way to receive callback requests
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  Can&apos;t update your information
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  Invisible to case managers
                </li>
              </ul>
            </div>

            {/* After */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                After Claiming (Free)
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Phone number visible to families
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong>Get verified</strong> → appear in case manager searches</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Weekly check-in keeps you visible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Direct callback requests from families
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How Verification Works */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How Verified Providers Get More Cases
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              After claiming, get verified to appear when case managers are actively placing.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="font-semibold text-gray-900 mb-2">Every Monday</h3>
                <p className="text-gray-600 text-sm">
                  You get an email: &quot;Are you accepting new cases this week?&quot;
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="font-semibold text-gray-900 mb-2">One Click</h3>
                <p className="text-gray-600 text-sm">
                  Hit &quot;Yes&quot; and you&apos;re marked as available. Takes 2 seconds.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="font-semibold text-gray-900 mb-2">Case Managers See You</h3>
                <p className="text-gray-600 text-sm">
                  They only see providers who confirmed availability in the last 7 days.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-green-800 text-sm text-center">
                  <strong>Result:</strong> You show up when case managers are actively placing cases.
                  No more being buried in a list of 300 providers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Claim Section */}
      <section id="claim-section" className="py-12 sm:py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Find Your Profile
            </h2>
            <p className="text-lg text-gray-600">
              Search for your agency name to claim your listing.
            </p>
          </div>

          {/* Search with Autocomplete */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8 mb-6">
            <div ref={searchRef} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowNotFound(false)
                  }}
                  onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                  placeholder="Start typing your agency name..."
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={`/claim/${result.slug}`}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold">
                          {result.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{result.name}</p>
                        <p className="text-sm text-gray-500">{result.city}, GA</p>
                      </div>
                      <div className="flex-shrink-0">
                        {result.isVerified ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Verified
                          </span>
                        ) : (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                            Claim Now
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* No results message */}
              {showDropdown && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 p-4 text-center">
                  <p className="text-gray-600 mb-2">No agencies found matching &quot;{searchQuery}&quot;</p>
                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      setShowNotFound(true)
                    }}
                    className="text-primary font-medium hover:underline"
                  >
                    Request to be added →
                  </button>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-3 text-center">
              Type at least 2 characters to search • Click your agency to claim it
            </p>
          </div>

          {/* Can't find it? */}
          <div className="text-center">
            <button
              onClick={() => setShowNotFound(!showNotFound)}
              className="text-primary hover:underline font-medium"
            >
              Can&apos;t find your agency? →
            </button>
          </div>

          {/* Not Found Form */}
          {showNotFound && (
            <div className="mt-8 bg-amber-50 rounded-2xl border border-amber-200 p-6 sm:p-8">
              <h3 className="font-semibold text-gray-900 mb-2">Not in the Directory?</h3>
              <p className="text-gray-600 mb-6 text-sm">
                If you&apos;re a licensed GAPP provider and can&apos;t find your agency, let us know and we&apos;ll add you.
              </p>

              {submitted ? (
                <div className="bg-green-100 border border-green-200 rounded-xl p-6 text-center">
                  <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h4 className="font-semibold text-gray-900 mb-1">Request Received!</h4>
                  <p className="text-gray-600 text-sm">We&apos;ll review and add you within 1-2 business days.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={formData.agencyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, agencyName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Agency Name *"
                    />
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your Name *"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Email *"
                    />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Phone *"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.county}
                    onChange={(e) => setFormData(prev => ({ ...prev, county: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Primary County *"
                  />
                  <div>
                    <p className="text-sm text-gray-700 mb-2">Services Offered *</p>
                    <div className="flex flex-wrap gap-2">
                      {['RN', 'LPN', 'PCS'].map((service) => (
                        <button
                          key={service}
                          type="button"
                          onClick={() => handleServiceToggle(service)}
                          className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                            formData.services.includes(service)
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || formData.services.length === 0}
                    className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Request to Be Added'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Common Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Is claiming my profile really free?',
                a: 'Yes, 100% free. Claiming makes your contact info visible to families. Verification (also free) gets you into case manager searches.',
              },
              {
                q: 'How did you get my information?',
                a: 'We pull from the official DCH/Appendix P provider list. If your info is outdated, claim your profile to update it.',
              },
              {
                q: 'What\'s the difference between claiming and verifying?',
                a: 'Claiming (free) = your phone number becomes visible. Verifying (free) = you get the weekly availability check and appear in case manager searches.',
              },
              {
                q: 'What if I\'m not accepting patients right now?',
                a: 'No problem. The weekly check-in lets you say "not this week" — you stay verified but won\'t appear in case manager searches until you\'re ready.',
              },
              {
                q: 'How do I update my counties or services?',
                a: 'Email us at help@georgiagapp.com after claiming your profile. We\'ll update it within 24 hours.',
              },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 flex items-center justify-between hover:bg-gray-50">
                  {faq.q}
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-gray-600">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 px-4 bg-primary text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get More Cases?</h2>
          <p className="text-primary-light mb-6">
            Find your profile, claim it for free, and start appearing in family searches.
          </p>
          <a
            href="#claim-section"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Find My Profile
          </a>
          <p className="text-sm text-primary-light mt-4">
            Questions? Email <a href="mailto:help@georgiaGAPP.com" className="underline">help@georgiaGAPP.com</a>
          </p>
        </div>
      </section>
    </div>
  )
}
