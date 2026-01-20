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
  claim_token: string | null
  claimed_at?: string | null
}

type TabType = 'unclaimed' | 'claimed' | 'verified' | 'all'

const ITEMS_PER_PAGE = 25

// Georgia counties for the dropdown
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

interface EditFormData {
  name: string
  city: string
  phone: string
  website: string
  services_offered: string[]
  counties_served: string[]
}

export default function AdminPage() {
  const [providers, setProviders] = useState<ProviderAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('unclaimed')
  const [searchQuery, setSearchQuery] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [editingProvider, setEditingProvider] = useState<ProviderAdmin | null>(null)
  const [editForm, setEditForm] = useState<EditFormData>({
    name: '',
    city: '',
    phone: '',
    website: '',
    services_offered: [],
    counties_served: []
  })
  const [saving, setSaving] = useState(false)

  // Fetch providers
  useEffect(() => {
    fetchProviders()
  }, [])

  async function fetchProviders() {
    setLoading(true)
    const { data, error } = await supabase
      .from('providers')
      .select('id, name, slug, city, email, phone, website, services_offered, is_claimed, is_verified, is_featured, accepting_new_patients, tier_level, created_at, counties_served, claimed_by_email, claim_token')
      .order('name')

    if (error) {
      console.error('Error fetching providers:', error)
      // If columns don't exist yet, try without them
      if (error.message?.includes('is_claimed') || error.message?.includes('claim_token')) {
        const { data: fallbackData } = await supabase
          .from('providers')
          .select('id, name, slug, city, email, phone, website, services_offered, is_verified, is_featured, accepting_new_patients, tier_level, created_at, counties_served')
          .order('name')
        const transformed = (fallbackData || []).map(p => ({
          ...p,
          county: p.counties_served?.[0] || 'Unknown',
          is_claimed: false,
          claimed_by_email: null,
          claim_token: null
        }))
        setProviders(transformed)
      }
    } else {
      const transformed = (data || []).map(p => ({
        ...p,
        county: p.counties_served?.[0] || 'Unknown',
        is_claimed: p.is_claimed ?? false,
        claimed_by_email: p.claimed_by_email ?? null,
        claim_token: p.claim_token ?? null
      }))
      setProviders(transformed)
    }
    setLoading(false)
  }

  // Reset page when tab or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchQuery])

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

  // Pagination
  const totalPages = Math.ceil(filteredProviders.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProviders = filteredProviders.slice(startIndex, startIndex + ITEMS_PER_PAGE)

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

  // Verify provider (calls API to also send email)
  async function verifyProvider(id: string) {
    setUpdating(id)
    try {
      const res = await fetch('/api/admin/verify-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId: id }),
      })

      if (res.ok) {
        // Update local state
        setProviders(prev =>
          prev.map(p => p.id === id ? { ...p, is_verified: true, accepting_new_patients: true } : p)
        )
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to verify provider')
      }
    } catch (err) {
      console.error('Error verifying provider:', err)
      alert('Failed to verify provider')
    }
    setUpdating(null)
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

  // Mark provider as claimed (manual fix)
  async function markAsClaimed(id: string, email?: string) {
    const claimEmail = email || prompt('Enter the email of the person claiming this profile:')
    if (!claimEmail) return

    await updateProvider(id, {
      is_claimed: true,
      claimed_at: new Date().toISOString(),
      claimed_by_email: claimEmail,
      tier_level: 1, // 0=unclaimed, 1=claimed
    })
  }

  // Get base URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.georgiagapp.com'

  // Export claim links as CSV
  function exportClaimLinks() {
    const unclaimedProviders = providers.filter(p => !p.is_claimed)
    if (unclaimedProviders.length === 0) {
      alert('No unclaimed providers to export')
      return
    }

    const csvRows = [
      ['Provider Name', 'City', 'County', 'Phone', 'Claim Link'].join(','),
      ...unclaimedProviders.map(p => [
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.city}"`,
        `"${p.county}"`,
        `"${p.phone || ''}"`,
        `"${baseUrl}/claim/${p.slug}"`
      ].join(','))
    ]

    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `gapp-claim-links-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Copy single claim link
  function copyClaimLink(slug: string) {
    const link = `${baseUrl}/claim/${slug}`
    navigator.clipboard.writeText(link)
  }

  // Open edit modal
  function openEditModal(provider: ProviderAdmin) {
    setEditingProvider(provider)
    setEditForm({
      name: provider.name,
      city: provider.city,
      phone: provider.phone || '',
      website: provider.website || '',
      services_offered: provider.services_offered || [],
      counties_served: providers.find(p => p.id === provider.id)?.county
        ? [providers.find(p => p.id === provider.id)!.county]
        : []
    })
    // Fetch full counties from database
    fetchProviderCounties(provider.id)
  }

  // Fetch provider's full counties list
  async function fetchProviderCounties(providerId: string) {
    const { data } = await supabase
      .from('providers')
      .select('counties_served')
      .eq('id', providerId)
      .single()

    if (data?.counties_served) {
      setEditForm(prev => ({ ...prev, counties_served: data.counties_served }))
    }
  }

  // Save edited provider
  async function saveProvider() {
    if (!editingProvider) return
    setSaving(true)

    try {
      const res = await fetch('/api/admin/update-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProvider.id,
          name: editForm.name,
          city: editForm.city,
          phone: editForm.phone || null,
          website: editForm.website || null,
          services_offered: editForm.services_offered,
          counties_served: editForm.counties_served
        })
      })

      if (res.ok) {
        const { provider: updated } = await res.json()
        // Update local state
        setProviders(prev => prev.map(p =>
          p.id === editingProvider.id
            ? {
                ...p,
                name: editForm.name,
                slug: updated.slug,
                city: editForm.city,
                phone: editForm.phone || null,
                website: editForm.website || null,
                services_offered: editForm.services_offered,
                county: editForm.counties_served[0] || p.county
              }
            : p
        ))
        setEditingProvider(null)
      } else {
        alert('Failed to save changes')
      }
    } catch (err) {
      console.error('Error saving provider:', err)
      alert('Failed to save changes')
    }

    setSaving(false)
  }

  // Toggle service in edit form
  function toggleService(service: string) {
    setEditForm(prev => ({
      ...prev,
      services_offered: prev.services_offered.includes(service)
        ? prev.services_offered.filter(s => s !== service)
        : [...prev.services_offered, service]
    }))
  }

  // Toggle county in edit form
  function toggleCounty(county: string) {
    setEditForm(prev => ({
      ...prev,
      counties_served: prev.counties_served.includes(county)
        ? prev.counties_served.filter(c => c !== county)
        : [...prev.counties_served, county]
    }))
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
            <div className="flex items-center gap-4">
              <button
                onClick={exportClaimLinks}
                className="px-3 py-1.5 bg-accent text-white text-sm font-medium rounded hover:bg-accent/90 flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Claim Links
              </button>
              <Link
                href="/admin/requests"
                className="text-sm text-primary font-medium hover:underline"
              >
                Listing Requests
              </Link>
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
                  {paginatedProviders.map(provider => (
                    <tr key={provider.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/provider/${provider.slug}`}
                          className="font-medium text-primary text-sm hover:underline"
                          target="_blank"
                        >
                          {provider.name}
                        </Link>
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
                              {/* Edit button for all providers */}
                              <button
                                onClick={() => openEditModal(provider)}
                                className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                                title="Edit provider details"
                              >
                                Edit
                              </button>
                              {/* Copy Claim Link button for unclaimed providers */}
                              {!provider.is_claimed && (
                                <button
                                  onClick={() => {
                                    copyClaimLink(provider.slug)
                                    // Show brief feedback
                                    const btn = document.activeElement as HTMLButtonElement
                                    const originalText = btn.innerText
                                    btn.innerText = 'Copied!'
                                    setTimeout(() => btn.innerText = originalText, 1000)
                                  }}
                                  className="px-2 py-1 text-xs rounded border border-accent text-accent hover:bg-accent/10"
                                  title={`${baseUrl}/claim/${provider.slug}`}
                                >
                                  Copy Link
                                </button>
                              )}
                              {!provider.is_verified ? (
                                provider.is_claimed ? (
                                  // Claimed but not verified - show email action + verify after payment
                                  <>
                                    <button
                                      onClick={async () => {
                                        const btn = document.activeElement as HTMLButtonElement
                                        btn.disabled = true
                                        btn.innerText = 'Sending...'
                                        try {
                                          const res = await fetch('/api/admin/send-upgrade-email', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                              providerName: provider.name,
                                              providerEmail: provider.claimed_by_email
                                            })
                                          })
                                          if (res.ok) {
                                            btn.innerText = 'Sent ✓'
                                            btn.className = 'px-2 py-1 text-xs rounded border border-green-300 text-green-700 bg-green-50'
                                          } else {
                                            btn.innerText = 'Failed'
                                            btn.disabled = false
                                          }
                                        } catch {
                                          btn.innerText = 'Failed'
                                          btn.disabled = false
                                        }
                                        setTimeout(() => {
                                          btn.innerText = 'Send Email'
                                          btn.disabled = false
                                          btn.className = 'px-2 py-1 text-xs rounded border border-blue-300 text-blue-700 hover:bg-blue-50'
                                        }, 3000)
                                      }}
                                      className="px-2 py-1 text-xs rounded border border-blue-300 text-blue-700 hover:bg-blue-50"
                                      title={`Send upgrade email to ${provider.claimed_by_email}`}
                                    >
                                      Send Email
                                    </button>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText('https://whop.com/checkout/prod_YmESR0QDOQOz1')
                                        const btn = document.activeElement as HTMLButtonElement
                                        const original = btn.innerText
                                        btn.innerText = 'Copied!'
                                        setTimeout(() => btn.innerText = original, 1500)
                                      }}
                                      className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                                      title="Copy Whop checkout link"
                                    >
                                      Copy Link
                                    </button>
                                    <button
                                      onClick={() => verifyProvider(provider.id)}
                                      className="px-2 py-1 text-xs rounded border border-green-300 text-green-700 hover:bg-green-50"
                                      title="Only click after payment confirmed"
                                    >
                                      Mark Paid ✓
                                    </button>
                                  </>
                                ) : (
                                  // Unclaimed - just show verify button for manual verification
                                  <button
                                    onClick={() => verifyProvider(provider.id)}
                                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700"
                                  >
                                    Verify
                                  </button>
                                )
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProviders.length)} of {filteredProviders.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first, last, current, and adjacent pages
                      return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
                    })
                    .map((page, index, array) => (
                      <span key={page} className="flex items-center">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-1 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 text-sm font-medium rounded ${
                            currentPage === page
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {page}
                        </button>
                      </span>
                    ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Next
                </button>
              </div>
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

      {/* Edit Modal */}
      {editingProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Edit Provider</h2>
              <button
                onClick={() => setEditingProvider(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(XXX) XXX-XXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="text"
                  value={editForm.website}
                  onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered</label>
                <div className="flex gap-3">
                  {['RN', 'LPN', 'PCS'].map(service => (
                    <label key={service} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.services_offered.includes(service)}
                        onChange={() => toggleService(service)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Counties */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Counties Served ({editForm.counties_served.length} selected)
                </label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-3 gap-1">
                    {GEORGIA_COUNTIES.map(county => (
                      <label key={county} className="flex items-center gap-1.5 cursor-pointer text-sm py-0.5">
                        <input
                          type="checkbox"
                          checked={editForm.counties_served.includes(county)}
                          onChange={() => toggleCounty(county)}
                          className="w-3.5 h-3.5 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className={editForm.counties_served.includes(county) ? 'text-primary font-medium' : 'text-gray-600'}>
                          {county}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                {editForm.counties_served.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {editForm.counties_served.map(county => (
                      <span
                        key={county}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded"
                      >
                        {county}
                        <button
                          onClick={() => toggleCounty(county)}
                          className="hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setEditingProvider(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveProvider}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}