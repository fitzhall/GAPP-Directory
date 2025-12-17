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
  phone: string | null
  website: string | null
  services_offered: string[]
  is_verified: boolean
  is_featured: boolean
  accepting_new_patients: boolean
  tier_level: number
  created_at: string
}

type TabType = 'pending' | 'verified' | 'all'

export default function AdminPage() {
  const [providers, setProviders] = useState<ProviderAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('pending')
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
      .select('id, name, slug, city, phone, website, services_offered, is_verified, is_featured, accepting_new_patients, tier_level, created_at, counties_served')
      .order('name')

    if (error) {
      console.error('Error fetching providers:', error)
    } else {
      const transformed = (data || []).map(p => ({
        ...p,
        county: p.counties_served?.[0] || 'Unknown'
      }))
      setProviders(transformed)
    }
    setLoading(false)
  }

  // Filter providers based on tab and search
  const filteredProviders = providers.filter(provider => {
    if (activeTab === 'pending' && provider.is_verified) return false
    if (activeTab === 'verified' && !provider.is_verified) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        provider.name.toLowerCase().includes(query) ||
        provider.city.toLowerCase().includes(query) ||
        provider.county.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Stats
  const pendingCount = providers.filter(p => !p.is_verified).length
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
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Providers</p>
            <p className="text-2xl font-bold text-gray-900">{providers.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Pending Verification</p>
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
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
                onClick={() => setActiveTab('pending')}
                className={`py-3 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'pending'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Pending ({pendingCount})
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
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full w-fit">
                              Pending
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
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Verification Workflow</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Call the provider using the phone number listed</li>
            <li>Confirm they are a GAPP provider and their services</li>
            <li>Ask if they are accepting new patients</li>
            <li>Click &quot;Verify&quot; to make them visible with callback form</li>
            <li>Update &quot;Accepting&quot; status based on their response</li>
          </ol>
        </div>
      </div>
    </div>
  )
}