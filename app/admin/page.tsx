'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface ProviderAdmin {
  id: string
  name: string
  slug: string
  city: string
  county: string
  email: string | null
  phone: string | null
  website: string | null
  services_offered: string[]
  is_claimed: boolean
  is_verified: boolean
  is_featured: boolean
  accepting_new_patients: boolean
  tier_level: number
  created_at: string
  claimed_by_email: string | null
}

type TabType = 'unclaimed' | 'claimed' | 'verified' | 'all'

export default function AdminPage() {
  const [providers, setProviders] = useState<ProviderAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('unclaimed')
  const [searchQuery, setSearchQuery] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  // Fetch providers
  useEffect(() => {
    fetchProviders()
  }, [])

  async function fetchProviders() {
    setLoading(true)
    const { data, error } = await supabase
      .from('providers')
      .select('id, name, slug, city, email, phone, website, services_offered, is_claimed, is_verified, is_featured, accepting_new_patients, tier_level, created_at, counties_served, claimed_by_email')
      .order('name')

    if (error) {
      console.error('Error fetching providers:', error)
      // If is_claimed column doesn't exist yet, try without it
      if (error.message?.includes('is_claimed')) {
        const { data: fallbackData } = await supabase
          .from('providers')
          .select('id, name, slug, city, email, phone, website, services_offered, is_verified, is_featured, accepting_new_patients, tier_level, created_at, counties_served')
          .order('name')
        const transformed = (fallbackData || []).map(p => ({
          ...p,
          county: p.counties_served?.[0] || 'Unknown',
          is_claimed: false,
          claimed_by_email: null
        }))
        setProviders(transformed)
      }
    } else {
      const transformed = (data || []).map(p => ({
        ...p,
        county: p.counties_served?.[0] || 'Unknown',
        is_claimed: p.is_claimed ?? false,
        claimed_by_email: p.claimed_by_email ?? null
      }))
      setProviders(transformed)
    }
    setLoading(false)
  }

  // Filter providers based on tab and search
  const filteredProviders = providers.filter(provider => {
    // Tab filters
    if (activeTab === 'unclaimed' && provider.is_claimed) return false
    if (activeTab === 'claimed' && (!provider.is_claimed || provider.is_verified)) return false
    if (activeTab === 'verified' && !provider.is_verified) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        provider.name.toLowerCase().includes(query) ||
        provider.city.toLowerCase().includes(query) ||
        provider.county.toLowerCase().includes(query) ||
        (provider.email?.toLowerCase().includes(query) ?? false)
      )
    }

    return true
  })

  // Stats
  const unclaimedCount = providers.filter(p => !p.is_claimed).length
  const claimedCount = providers.filter(p => p.is_claimed && !p.is_verified).length
  const verifiedCount = providers.filter(p => p.is_verified).length
  const featuredCount = providers.filter(p => p.is_featured).length

  // Update provider field
  async function updateProvider(id: string, updates: Partial<ProviderAdmin>) {
    setUpdating(id)
    const { error } = await supabase
      .from('providers')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating provider:', error)
      alert('Failed to update provider')
    } else {
      setProviders(prev =>
        prev.map(p => p.id === id ? { ...p, ...updates } : p)
      )
    }
    setUpdating(null)
  }

  // Verify provider
  async function verifyProvider(id: string) {
    await updateProvider(id, {
      is_verified: true,
      accepting_new_patients: true
    })
  }

  // Unverify provider
  async function unverifyProvider(id: string) {
    await updateProvider(id, {
      is_verified: false,
      accepting_new_patients: false
    })
  }

  // Toggle accepting patients
  async function toggleAccepting(id: string, currentValue: boolean) {
    await updateProvider(id, { accepting_new_patients: !currentValue })
  }

  // Toggle featured
  async function toggleFeatured(id: string, currentValue: boolean) {
    await updateProvider(id, {
      is_featured: !currentValue,
      tier_level: !currentValue ? 1 : 0
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GAPP Provider Admin</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and verify providers
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/admin/leads"
                className="text-sm text-primary font-medium hover:underline"
              >
                View Leads
              </Link>
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Providers</p>
            <p className="text-2xl font-bold text-gray-900">{providers.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Unclaimed</p>
            <p className="text-2xl font-bold text-gray-400">{unclaimedCount}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Claimed (Pending)</p>
            <p className="text-2xl font-bold text-amber-600">{claimedCount}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Verified</p>
            <p className="text-2xl font-bold text-green-600">{verifiedCount}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Featured</p>
            <p className="text-2xl font-bold text-purple-600">{featuredCount}</p>
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200 px-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('unclaimed')}
                className={`py-3 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'unclaimed'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Unclaimed ({unclaimedCount})
              </button>
              <button
                onClick={() => setActiveTab('claimed')}
                className={`py-3 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'claimed'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Claimed ({claimedCount})
              </button>
              <button
                onClick={() => setActiveTab('verified')}
                className={`py-3 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'verified'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Verified ({verifiedCount})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-3 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'all'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                All ({providers.length})
              </button>
            </div>
          </div>

          <div className="p-4">
            <input
              type="text"
              placeholder="Search by name, city, or county..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Provider List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading providers...</div>
          ) : filteredProviders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No providers found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Provider</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Services</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProviders.map(provider => (
                    <tr key={provider.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 text-sm">{provider.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900">{provider.city}</p>
                        <p className="text-xs text-gray-500">{provider.county} County</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {provider.services_offered?.map(service => (
                            <span key={service} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                              {service}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900">{provider.phone || '-'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {provider.is_verified ? (
                            <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full w-fit">
                              Verified
                            </span>
                          ) : provider.is_claimed ? (
                            <span className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full w-fit">
                              Claimed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full w-fit">
                              Unclaimed
                            </span>
                          )}
                          {provider.is_verified && provider.accepting_new_patients && (
                            <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full w-fit">
                              Accepting
                            </span>
                          )}
                          {provider.is_featured && (
                            <span className="inline-flex items-center px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full w-fit">
                              Featured
                            </span>
                          )}
                          {provider.claimed_by_email && (
                            <span className="text-xs text-gray-400 truncate max-w-[120px]" title={provider.claimed_by_email}>
                              {provider.claimed_by_email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {updating === provider.id ? (
                            <span className="text-xs text-gray-500">Saving...</span>
                          ) : (
                            <>
                              {!provider.is_verified ? (
                                <button
                                  onClick={() => verifyProvider(provider.id)}
                                  className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700"
                                >
                                  Verify
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => toggleAccepting(provider.id, provider.accepting_new_patients)}
                                    className={`px-2 py-1 text-xs rounded border ${
                                      provider.accepting_new_patients
                                        ? 'border-blue-300 text-blue-700 hover:bg-blue-50'
                                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                                  >
                                    {provider.accepting_new_patients ? 'Accepting' : 'Not Accepting'}
                                  </button>
                                  <button
                                    onClick={() => toggleFeatured(provider.id, provider.is_featured)}
                                    className={`px-2 py-1 text-xs rounded border ${
                                      provider.is_featured
                                        ? 'border-purple-300 text-purple-700 hover:bg-purple-50'
                                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                                  >
                                    {provider.is_featured ? 'Featured' : 'Feature'}
                                  </button>
                                  <button
                                    onClick={() => unverifyProvider(provider.id)}
                                    className="px-2 py-1 text-xs text-red-600 hover:text-red-700"
                                  >
                                    Unverify
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Profile Status Flow</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">Unclaimed</span> → Provider hasn&apos;t claimed their profile yet. Basic listing, no leads.</p>
              <p><span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">Claimed</span> → Provider submitted email to claim profile. Ready to verify.</p>
              <p><span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Verified</span> → Admin verified. Full profile + callback form enabled.</p>
              <p><span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">Featured</span> → Paid tier. Shown at top of results.</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Cold Call Script</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Call the provider using the phone number listed</li>
              <li>Confirm they are a GAPP provider</li>
              <li>Ask for their email to send them access to claim their profile</li>
              <li>Once they claim, verify their listing</li>
              <li>Upsell Featured placement for $99/mo</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}