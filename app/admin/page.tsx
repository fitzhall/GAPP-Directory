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
  counties_served: string[]
  languages: string[]
  is_claimed: boolean
  is_verified: boolean
  is_featured: boolean
  accepting_new_patients: boolean
  tier_level: number
  created_at: string
  claimed_by_email: string | null
  claim_token: string | null
  claimed_at?: string | null
  // Claim submission details
  claimer_name?: string | null
  claimer_phone?: string | null
  // Verification tracking
  unverified_at?: string | null
  unverified_reason?: string | null
  downgraded_at?: string | null
  downgraded_reason?: string | null
  // Missed check-in tracking
  missed_checkin_at?: string | null
}

type TabType = 'unclaimed' | 'claimed' | 'verified' | 'featured' | 'attention' | 'all'
type SortType = 'name' | 'claimed_newest' | 'claimed_oldest' | 'city'

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
  languages: string[]
  accepting_new_patients: boolean
}

export default function AdminPage() {
  const [providers, setProviders] = useState<ProviderAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('unclaimed')
  const [sortBy, setSortBy] = useState<SortType>('name')
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
    counties_served: [],
    languages: ['English'],
    accepting_new_patients: false
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
      .select('id, name, slug, city, email, phone, website, services_offered, languages, is_claimed, is_verified, is_featured, accepting_new_patients, tier_level, created_at, claimed_at, counties_served, claimed_by_email, claimer_name, claimer_phone, claim_token, unverified_at, unverified_reason, downgraded_at, downgraded_reason, missed_checkin_at')
      .order('name')

    if (error) {
      console.error('Error fetching providers:', error)
      // If columns don't exist yet, try without them
      if (error.message?.includes('is_claimed') || error.message?.includes('claim_token')) {
        const { data: fallbackData } = await supabase
          .from('providers')
          .select('id, name, slug, city, email, phone, website, services_offered, languages, is_verified, is_featured, accepting_new_patients, tier_level, created_at, counties_served')
          .order('name')
        const transformed = (fallbackData || []).map(p => ({
          ...p,
          county: p.counties_served?.[0] || 'Unknown',
          languages: p.languages || ['English'],
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
        counties_served: p.counties_served || [],
        languages: p.languages || ['English'],
        is_claimed: p.is_claimed ?? false,
        claimed_by_email: p.claimed_by_email ?? null,
        claimer_name: p.claimer_name ?? null,
        claimer_phone: p.claimer_phone ?? null,
        claim_token: p.claim_token ?? null,
        unverified_at: p.unverified_at ?? null,
        unverified_reason: p.unverified_reason ?? null,
        downgraded_at: p.downgraded_at ?? null,
        downgraded_reason: p.downgraded_reason ?? null,
        missed_checkin_at: p.missed_checkin_at ?? null
      }))
      setProviders(transformed)
    }
    setLoading(false)
  }

  // Reset page when tab, search, or sort changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchQuery, sortBy])

  // Filter providers based on tab and search
  const filteredProviders = providers
    .filter(provider => {
      // Tab filters
      if (activeTab === 'unclaimed' && provider.is_claimed) return false
      if (activeTab === 'claimed' && (!provider.is_claimed || provider.is_verified)) return false
      if (activeTab === 'verified' && !provider.is_verified) return false
      // Featured tab: all premium/featured providers
      if (activeTab === 'featured' && !provider.is_featured) return false
      // Attention tab: any provider who missed a check-in OR featured but unverified
      if (activeTab === 'attention') {
        const needsAttention = !!provider.missed_checkin_at || (provider.is_featured && !provider.is_verified)
        if (!needsAttention) return false
      }

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
    .sort((a, b) => {
      switch (sortBy) {
        case 'claimed_newest':
          // Sort by claimed_at descending (newest first), null values last
          if (!a.claimed_at && !b.claimed_at) return a.name.localeCompare(b.name)
          if (!a.claimed_at) return 1
          if (!b.claimed_at) return -1
          return new Date(b.claimed_at).getTime() - new Date(a.claimed_at).getTime()
        case 'claimed_oldest':
          // Sort by claimed_at ascending (oldest first), null values last
          if (!a.claimed_at && !b.claimed_at) return a.name.localeCompare(b.name)
          if (!a.claimed_at) return 1
          if (!b.claimed_at) return -1
          return new Date(a.claimed_at).getTime() - new Date(b.claimed_at).getTime()
        case 'city':
          return a.city.localeCompare(b.city)
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
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
  // Attention: any provider who missed a check-in OR featured but unverified
  const attentionCount = providers.filter(p => !!p.missed_checkin_at || (p.is_featured && !p.is_verified)).length

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

  // Unverify provider (remove badge, track reason)
  async function unverifyProvider(id: string, reason: string = 'manual') {
    await updateProvider(id, {
      is_verified: false,
      accepting_new_patients: false,
      unverified_at: new Date().toISOString(),
      unverified_reason: reason
    })
  }

  // Downgrade tier (remove premium/featured status)
  async function downgradeTier(id: string, reason: string = 'manual') {
    await updateProvider(id, {
      is_featured: false,
      tier_level: 0,
      downgraded_at: new Date().toISOString(),
      downgraded_reason: reason
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
        : [],
      languages: provider.languages || ['English'],
      accepting_new_patients: provider.accepting_new_patients
    })
    // Fetch full counties and languages from database
    fetchProviderDetails(provider.id)
  }

  // Fetch provider's full details (counties, languages)
  async function fetchProviderDetails(providerId: string) {
    const { data } = await supabase
      .from('providers')
      .select('counties_served, languages')
      .eq('id', providerId)
      .single()

    if (data) {
      setEditForm(prev => ({
        ...prev,
        counties_served: data.counties_served || [],
        languages: data.languages || ['English']
      }))
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
          counties_served: editForm.counties_served,
          languages: editForm.languages,
          accepting_new_patients: editForm.accepting_new_patients
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
                county: editForm.counties_served[0] || p.county,
                languages: editForm.languages,
                accepting_new_patients: editForm.accepting_new_patients
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

  // Toggle language in edit form
  function toggleLanguage(language: string) {
    setEditForm(prev => {
      const hasLanguage = prev.languages.includes(language)
      // Don't allow removing English if it's the only language
      if (hasLanguage && language === 'English' && prev.languages.length === 1) {
        return prev
      }
      return {
        ...prev,
        languages: hasLanguage
          ? prev.languages.filter(l => l !== language)
          : [...prev.languages, language]
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">GAPP Provider Admin</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and verify providers
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <button
                onClick={exportClaimLinks}
                className="px-3 py-1.5 bg-accent text-white text-xs sm:text-sm font-medium rounded hover:bg-accent/90 flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">Export Claim Links</span>
                <span className="sm:hidden">Export</span>
              </button>
              <Link
                href="/admin/requests"
                className="text-xs sm:text-sm text-primary font-medium hover:underline"
              >
                Requests
              </Link>
              <Link
                href="/admin/leads"
                className="text-xs sm:text-sm text-primary font-medium hover:underline"
              >
                Leads
              </Link>
              <Link
                href="/"
                className="text-xs sm:text-sm text-gray-600 hover:text-gray-900"
              >
                Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-500">Total</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{providers.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-500">Unclaimed</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-400">{unclaimedCount}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-500">Claimed</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-600">{claimedCount}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-500">Verified</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{verifiedCount}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-500">Featured</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-600">{featuredCount}</p>
          </div>
          <div className={`rounded-lg border p-3 sm:p-4 ${attentionCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
            <p className="text-xs sm:text-sm text-gray-500">Attention</p>
            <p className={`text-xl sm:text-2xl font-bold ${attentionCount > 0 ? 'text-red-600' : 'text-gray-400'}`}>{attentionCount}</p>
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex gap-1 sm:gap-4 px-2 sm:px-4 min-w-max">
              <button
                onClick={() => setActiveTab('unclaimed')}
                className={`py-3 px-2 sm:px-1 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
                  activeTab === 'unclaimed'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Unclaimed ({unclaimedCount})
              </button>
              <button
                onClick={() => setActiveTab('claimed')}
                className={`py-3 px-2 sm:px-1 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
                  activeTab === 'claimed'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Claimed ({claimedCount})
              </button>
              <button
                onClick={() => setActiveTab('verified')}
                className={`py-3 px-2 sm:px-1 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
                  activeTab === 'verified'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Verified ({verifiedCount})
              </button>
              <button
                onClick={() => setActiveTab('featured')}
                className={`py-3 px-2 sm:px-1 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
                  activeTab === 'featured'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-purple-500 hover:text-purple-600'
                }`}
              >
                Featured ({featuredCount})
              </button>
              <button
                onClick={() => setActiveTab('attention')}
                className={`py-3 px-2 sm:px-1 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
                  activeTab === 'attention'
                    ? 'border-red-500 text-red-600'
                    : attentionCount > 0
                      ? 'border-transparent text-red-500 hover:text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Attention ({attentionCount})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-3 px-2 sm:px-1 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                All ({providers.length})
              </button>
            </div>
          </div>

          <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Search by name, city, or county..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-white"
            >
              <option value="name">Sort: Name (A-Z)</option>
              <option value="claimed_newest">Sort: Claimed (Newest)</option>
              <option value="claimed_oldest">Sort: Claimed (Oldest)</option>
              <option value="city">Sort: City (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Provider List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading providers...</div>
          ) : filteredProviders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No providers found</div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-gray-200">
                {paginatedProviders.map(provider => (
                  <div key={provider.id} className="p-4">
                    {/* Provider Name & Status */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Link
                        href={`/provider/${provider.slug}`}
                        className="font-medium text-primary text-sm hover:underline flex-1"
                        target="_blank"
                      >
                        {provider.name}
                      </Link>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {provider.is_verified ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Verified
                          </span>
                        ) : provider.is_claimed ? (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                            Claimed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                            Unclaimed
                          </span>
                        )}
                        {provider.is_featured && (
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            provider.is_verified ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'
                          }`}>
                            Featured {!provider.is_verified && '⚠️'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Location & Phone */}
                    <div className="text-sm text-gray-600 mb-2">
                      <span>{provider.city}, {provider.county} County</span>
                      {provider.phone && (
                        <a href={`tel:${provider.phone}`} className="ml-3 text-primary">
                          {provider.phone}
                        </a>
                      )}
                    </div>

                    {/* Services */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {provider.services_offered?.map(service => (
                        <span key={service} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                          {service}
                        </span>
                      ))}
                      {provider.is_verified && provider.accepting_new_patients && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                          Accepting
                        </span>
                      )}
                      {provider.missed_checkin_at && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          Missed Check-in
                        </span>
                      )}
                    </div>

                    {/* Email info */}
                    {provider.claimed_by_email && (
                      <p className="text-xs text-gray-400 mb-2 truncate">{provider.claimed_by_email}</p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {updating === provider.id ? (
                        <span className="text-xs text-gray-500">Saving...</span>
                      ) : (
                        <>
                          <button
                            onClick={() => openEditModal(provider)}
                            className="px-3 py-1.5 text-xs rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          {!provider.is_claimed && (
                            <button
                              onClick={() => {
                                copyClaimLink(provider.slug)
                                const btn = document.activeElement as HTMLButtonElement
                                const originalText = btn.innerText
                                btn.innerText = 'Copied!'
                                setTimeout(() => btn.innerText = originalText, 1000)
                              }}
                              className="px-3 py-1.5 text-xs rounded border border-accent text-accent hover:bg-accent/10"
                            >
                              Copy Link
                            </button>
                          )}
                          {!provider.is_verified ? (
                            provider.is_featured ? (
                              <>
                                <button
                                  onClick={() => verifyProvider(provider.id)}
                                  className="px-3 py-1.5 text-xs rounded border border-green-300 text-green-700 hover:bg-green-50"
                                >
                                  Re-verify
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt('Reason for downgrading tier:', 'missed_checkin')
                                    if (reason !== null) downgradeTier(provider.id, reason || 'manual')
                                  }}
                                  className="px-3 py-1.5 text-xs rounded border border-orange-300 text-orange-700 hover:bg-orange-50"
                                >
                                  Downgrade
                                </button>
                              </>
                            ) : provider.is_claimed ? (
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
                                      btn.innerText = res.ok ? 'Sent ✓' : 'Failed'
                                    } catch {
                                      btn.innerText = 'Failed'
                                    }
                                    setTimeout(() => {
                                      btn.innerText = 'Email'
                                      btn.disabled = false
                                    }, 2000)
                                  }}
                                  className="px-3 py-1.5 text-xs rounded border border-blue-300 text-blue-700 hover:bg-blue-50"
                                >
                                  Email
                                </button>
                                <button
                                  onClick={() => verifyProvider(provider.id)}
                                  className="px-3 py-1.5 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                                >
                                  Mark Paid
                                </button>
                              </>
                            ) : (
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
                                className={`px-3 py-1.5 text-xs rounded border ${
                                  provider.accepting_new_patients
                                    ? 'border-blue-300 text-blue-700'
                                    : 'border-gray-300 text-gray-600'
                                }`}
                              >
                                {provider.accepting_new_patients ? 'Accepting' : 'Not Accepting'}
                              </button>
                              <button
                                onClick={() => toggleFeatured(provider.id, provider.is_featured)}
                                className={`px-3 py-1.5 text-xs rounded border ${
                                  provider.is_featured
                                    ? 'border-purple-300 text-purple-700'
                                    : 'border-gray-300 text-gray-600'
                                }`}
                              >
                                {provider.is_featured ? 'Featured' : 'Feature'}
                              </button>
                              {provider.missed_checkin_at && (
                                <button
                                  onClick={() => updateProvider(provider.id, {
                                    missed_checkin_at: null,
                                    accepting_new_patients: true,
                                  })}
                                  className="px-3 py-1.5 text-xs rounded border border-emerald-400 text-emerald-700 hover:bg-emerald-50 font-medium"
                                >
                                  Re-activate
                                </button>
                              )}
                              <button
                                onClick={async () => {
                                  const btn = document.activeElement as HTMLButtonElement
                                  btn.disabled = true
                                  btn.innerText = 'Sending...'
                                  try {
                                    const res = await fetch('/api/admin/send-live-email', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ providerId: provider.id })
                                    })
                                    btn.innerText = res.ok ? 'Sent ✓' : 'Failed'
                                  } catch {
                                    btn.innerText = 'Failed'
                                  }
                                  setTimeout(() => {
                                    btn.innerText = 'Send Live'
                                    btn.disabled = false
                                  }, 2000)
                                }}
                                className="px-3 py-1.5 text-xs rounded border border-green-300 text-green-700 hover:bg-green-50"
                              >
                                Send Live
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
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
                              <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full w-fit ${
                                provider.is_verified
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                Featured {!provider.is_verified && '⚠️'}
                              </span>
                            )}
                            {provider.missed_checkin_at && (
                              <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full w-fit">
                                Missed Check-in {new Date(provider.missed_checkin_at).toLocaleDateString()}
                              </span>
                            )}
                            {provider.unverified_at && (
                              <span className="text-xs text-red-500" title={`Unverified: ${provider.unverified_reason || 'unknown reason'}`}>
                                Lost badge: {new Date(provider.unverified_at).toLocaleDateString()}
                              </span>
                            )}
                            {provider.downgraded_at && (
                              <span className="text-xs text-orange-500" title={`Downgraded: ${provider.downgraded_reason || 'unknown reason'}`}>
                                Downgraded: {new Date(provider.downgraded_at).toLocaleDateString()}
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
                                <button
                                  onClick={() => openEditModal(provider)}
                                  className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                                  title="Edit provider details"
                                >
                                  Edit
                                </button>
                                {!provider.is_claimed && (
                                  <button
                                    onClick={() => {
                                      copyClaimLink(provider.slug)
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
                                  provider.is_featured ? (
                                    <>
                                      <button
                                        onClick={() => verifyProvider(provider.id)}
                                        className="px-2 py-1 text-xs rounded border border-green-300 text-green-700 hover:bg-green-50"
                                        title="Restore verification after check-in"
                                      >
                                        Re-verify
                                      </button>
                                      <button
                                        onClick={() => {
                                          const reason = prompt('Reason for downgrading tier:', 'missed_checkin')
                                          if (reason !== null) downgradeTier(provider.id, reason || 'manual')
                                        }}
                                        className="px-2 py-1 text-xs rounded border border-orange-300 text-orange-700 hover:bg-orange-50"
                                        title="Remove premium/featured status"
                                      >
                                        Downgrade Tier
                                      </button>
                                    </>
                                  ) : provider.is_claimed ? (
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
                                          navigator.clipboard.writeText('https://whop.com/bitcoin-estate-commission-inc/verfied-tier/')
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
                                      onClick={async () => {
                                        const btn = document.activeElement as HTMLButtonElement
                                        btn.disabled = true
                                        btn.innerText = 'Sending...'
                                        try {
                                          const res = await fetch('/api/admin/send-live-email', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ providerId: provider.id })
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
                                          btn.innerText = 'Send Live'
                                          btn.disabled = false
                                          btn.className = 'px-2 py-1 text-xs rounded border border-green-300 text-green-700 hover:bg-green-50'
                                        }, 3000)
                                      }}
                                      className="px-2 py-1 text-xs rounded border border-green-300 text-green-700 hover:bg-green-50"
                                      title={`Send "profile is live" email to ${provider.claimed_by_email || provider.email}`}
                                    >
                                      Send Live
                                    </button>
                                    {provider.missed_checkin_at && (
                                      <button
                                        onClick={() => updateProvider(provider.id, {
                                          missed_checkin_at: null,
                                          accepting_new_patients: true,
                                        })}
                                        className="px-2 py-1 text-xs rounded border border-emerald-400 text-emerald-700 hover:bg-emerald-50 font-medium"
                                        title="Clear missed check-in flag and re-activate"
                                      >
                                        Re-activate
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        const reason = prompt('Reason for removing verification:', 'missed_checkin')
                                        if (reason !== null) unverifyProvider(provider.id, reason || 'manual')
                                      }}
                                      className="px-2 py-1 text-xs text-red-600 hover:text-red-700"
                                      title="Remove verified badge"
                                    >
                                      Unverify
                                    </button>
                                  </>
                                )}
                                {provider.is_verified && provider.is_featured && (
                                  <button
                                    onClick={() => {
                                      const reason = prompt('Reason for downgrading tier:', 'manual')
                                      if (reason !== null) downgradeTier(provider.id, reason || 'manual')
                                    }}
                                    className="px-2 py-1 text-xs rounded border border-orange-300 text-orange-700 hover:bg-orange-50"
                                    title="Remove premium/featured status"
                                  >
                                    Downgrade Tier
                                  </button>
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
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-3 sm:px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
                {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProviders.length)} of {filteredProviders.length}
              </div>
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Prev
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
                    })
                    .map((page, index, array) => (
                      <span key={page} className="flex items-center">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-1 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm font-medium rounded ${
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
                  className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded ${
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

        {/* Instructions - hidden on mobile */}
        <div className="hidden sm:block mt-6 space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Profile Status Flow</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">Unclaimed</span> → Provider hasn&apos;t claimed their profile yet. Basic listing, no leads.</p>
              <p><span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">Claimed</span> → Provider submitted email to claim profile. Ready to verify.</p>
              <p><span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Verified</span> → Admin verified. Full profile + callback form enabled.</p>
              <p><span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">Featured</span> → Paid tier. Shown at top of results <strong>only if also Verified</strong>.</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-red-900 mb-2">Attention Tab: Missed Check-Ins</h3>
            <div className="text-sm text-red-800 space-y-2">
              <p>The <strong>Attention</strong> tab shows providers who missed their weekly availability check-in.</p>
              <p>These providers are still verified but have been <strong>hidden from case manager searches</strong>. They&apos;ll get another ping next Monday and can self-recover by responding.</p>
              <p><strong>Actions available:</strong></p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li><strong>Re-activate</strong> - Clear the missed check-in flag and put them back in searches</li>
                <li><strong>Unverify</strong> - Fully remove the verified badge (use for non-paying or problem providers)</li>
                <li><strong>Downgrade Tier</strong> - Remove premium/featured status</li>
              </ul>
              <p className="mt-2">You also receive an email notification when providers are hidden by the cron job.</p>
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
              {/* Claim Details Section - Read Only */}
              {editingProvider.is_claimed && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 mb-4">
                  <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Claim Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-amber-700 font-medium">Claimed By:</span>
                      <p className="text-gray-900">{editingProvider.claimer_name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-amber-700 font-medium">Claimed At:</span>
                      <p className="text-gray-900">
                        {editingProvider.claimed_at
                          ? new Date(editingProvider.claimed_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-amber-700 font-medium">Email:</span>
                      <p className="text-gray-900">
                        {editingProvider.claimed_by_email ? (
                          <a href={`mailto:${editingProvider.claimed_by_email}`} className="text-primary hover:underline">
                            {editingProvider.claimed_by_email}
                          </a>
                        ) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-amber-700 font-medium">Phone:</span>
                      <p className="text-gray-900">
                        {editingProvider.claimer_phone ? (
                          <a href={`tel:${editingProvider.claimer_phone}`} className="text-primary hover:underline">
                            {editingProvider.claimer_phone}
                          </a>
                        ) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  {/* Quick Actions */}
                  <div className="mt-3 pt-3 border-t border-amber-200 flex gap-2">
                    {editingProvider.claimed_by_email && (
                      <a
                        href={`mailto:${editingProvider.claimed_by_email}?subject=Your GeorgiaGAPP.com Profile - ${editingProvider.name}`}
                        className="px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-medium rounded hover:bg-amber-200 transition-colors"
                      >
                        Email Claimer
                      </a>
                    )}
                    {editingProvider.claimer_phone && (
                      <a
                        href={`tel:${editingProvider.claimer_phone}`}
                        className="px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-medium rounded hover:bg-amber-200 transition-colors"
                      >
                        Call Claimer
                      </a>
                    )}
                  </div>
                </div>
              )}

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

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
                <div className="flex flex-wrap gap-2">
                  {['English', 'Spanish', 'Vietnamese', 'Korean', 'Chinese', 'Hindi', 'Other'].map(lang => (
                    <label key={lang} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.languages.includes(lang)}
                        onChange={() => toggleLanguage(lang)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Accepting New Patients */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.accepting_new_patients}
                    onChange={(e) => setEditForm(prev => ({ ...prev, accepting_new_patients: e.target.checked }))}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Accepting New Patients</span>
                  {editForm.accepting_new_patients && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Yes</span>
                  )}
                </label>
              </div>

              {/* Counties */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Counties Served ({editForm.counties_served.length} selected)
                </label>
                <div className="border border-gray-300 rounded-lg p-2 sm:p-3 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
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