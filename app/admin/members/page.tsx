'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { config } from '@/lib/config'

interface Member {
  id: string
  name: string
  email: string
  companyName?: string
  city: string
  state: string
  tierLevel: number
  isVerified: boolean
  isFeatured: boolean
  specializations: string[]
  joinedAt: string
  lastActive: string
  status: 'active' | 'pending' | 'archived'
}

// Mock data for demonstration
const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Michael Rodriguez',
    email: 'michael@profire.com',
    companyName: 'ProFire Inspection Services',
    city: 'New York',
    state: 'NY',
    tierLevel: 3,
    isVerified: true,
    isFeatured: true,
    specializations: ['Fire Sprinkler Systems', 'Fire Alarm Systems'],
    joinedAt: '2024-01-15',
    lastActive: '2024-12-01',
    status: 'active'
  },
  {
    id: '2',
    name: 'Jennifer Walsh',
    email: 'jennifer@walshfire.com',
    companyName: 'Walsh Fire Safety Consulting',
    city: 'Los Angeles',
    state: 'CA',
    tierLevel: 2,
    isVerified: true,
    isFeatured: false,
    specializations: ['Kitchen Hood Systems', 'Plan Review'],
    joinedAt: '2024-02-20',
    lastActive: '2024-11-28',
    status: 'active'
  },
  {
    id: '3',
    name: 'Robert Chen',
    email: 'robert.chen@email.com',
    companyName: '',
    city: 'Chicago',
    state: 'IL',
    tierLevel: 1,
    isVerified: true,
    isFeatured: false,
    specializations: ['Emergency Lighting', 'Fire Doors'],
    joinedAt: '2024-03-10',
    lastActive: '2024-10-15',
    status: 'active'
  },
  {
    id: '4',
    name: 'Amanda Thompson',
    email: 'amanda@safeguard.com',
    companyName: 'SafeGuard Fire Protection',
    city: 'Houston',
    state: 'TX',
    tierLevel: 3,
    isVerified: true,
    isFeatured: true,
    specializations: ['Fire Pumps', 'Special Hazards'],
    joinedAt: '2024-01-05',
    lastActive: '2024-12-02',
    status: 'active'
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@gmail.com',
    companyName: '',
    city: 'Seattle',
    state: 'WA',
    tierLevel: 0,
    isVerified: false,
    isFeatured: false,
    specializations: ['Fire Extinguishers'],
    joinedAt: '2024-11-15',
    lastActive: '2024-11-20',
    status: 'pending'
  }
]

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(mockMembers)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'archived'>('all')
  const [selectedTierFilter, setSelectedTierFilter] = useState<number | 'all'>('all')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'name' | 'joined' | 'tier'>('joined')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search focus
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('search-input')?.focus()
      }
      // Cmd/Ctrl + A to select all
      if ((e.metaKey || e.ctrlKey) && e.key === 'a' && e.shiftKey) {
        e.preventDefault()
        setSelectedMembers(filteredMembers.map(m => m.id))
      }
      // Escape to clear selection
      if (e.key === 'Escape') {
        setSelectedMembers([])
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Filter members based on search and filters
  const filteredMembers = members.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.companyName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab =
      activeTab === 'all' || member.status === activeTab

    const matchesTier =
      selectedTierFilter === 'all' || member.tierLevel === selectedTierFilter

    return matchesSearch && matchesTab && matchesTier
  }).sort((a, b) => {
    let compareValue = 0
    switch (sortBy) {
      case 'name':
        compareValue = a.name.localeCompare(b.name)
        break
      case 'joined':
        compareValue = new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
        break
      case 'tier':
        compareValue = a.tierLevel - b.tierLevel
        break
    }
    return sortOrder === 'asc' ? compareValue : -compareValue
  })

  // Inline edit handlers
  const updateMemberTier = (memberId: string, newTier: number) => {
    setMembers(prev => prev.map(m =>
      m.id === memberId ? { ...m, tierLevel: newTier } : m
    ))
  }

  const toggleVerified = (memberId: string) => {
    setMembers(prev => prev.map(m =>
      m.id === memberId ? { ...m, isVerified: !m.isVerified } : m
    ))
  }

  const toggleFeatured = (memberId: string) => {
    setMembers(prev => prev.map(m =>
      m.id === memberId ? { ...m, isFeatured: !m.isFeatured } : m
    ))
  }

  const getTierBadge = (level: number) => {
    const tier = config.tiers.find(t => t.level === level)
    if (!tier) return null

    const colors = {
      gray: 'bg-gray-100 text-gray-700 border-gray-300',
      blue: 'bg-blue-100 text-blue-700 border-blue-300',
      purple: 'bg-purple-100 text-purple-700 border-purple-300',
      red: 'bg-red-100 text-red-700 border-red-300'
    }

    return (
      <span className={cn(
        'px-2 py-1 text-xs font-semibold rounded-full border',
        colors[tier.color as keyof typeof colors] || colors.gray
      )}>
        {tier.name}
      </span>
    )
  }

  const tabCounts = {
    all: members.length,
    active: members.filter(m => m.status === 'active').length,
    pending: members.filter(m => m.status === 'pending').length,
    archived: members.filter(m => m.status === 'archived').length
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Providers Management
        </h1>
        <p className="text-gray-600">
          Manage your directory members, tiers, and verifications
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{members.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Elite Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {members.filter(m => m.tierLevel === 3).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Verified</p>
              <p className="text-2xl font-bold text-gray-900">
                {members.filter(m => m.isVerified).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {members.filter(m => m.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <nav className="flex space-x-8">
          {(['all', 'active', 'pending', 'archived'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <input
                id="search-input"
                type="text"
                placeholder="Search members... (⌘K)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Tier Filter */}
          <select
            value={selectedTierFilter}
            onChange={(e) => setSelectedTierFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tiers</option>
            {config.tiers.map(tier => (
              <option key={tier.level} value={tier.level}>{tier.name}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-')
              setSortBy(by as any)
              setSortOrder(order as any)
            }}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="joined-desc">Newest First</option>
            <option value="joined-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="tier-desc">Highest Tier</option>
            <option value="tier-asc">Lowest Tier</option>
          </select>

          {/* Bulk Actions */}
          {selectedMembers.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-600">
                {selectedMembers.length} selected
              </span>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Bulk Edit
              </button>
              <button
                onClick={() => setSelectedMembers([])}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-4 font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMembers(filteredMembers.map(m => m.id))
                      } else {
                        setSelectedMembers([])
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left p-4 font-medium text-gray-700">Member</th>
                <th className="text-left p-4 font-medium text-gray-700">Location</th>
                <th className="text-left p-4 font-medium text-gray-700">Tier</th>
                <th className="text-left p-4 font-medium text-gray-700">Badges</th>
                <th className="text-left p-4 font-medium text-gray-700">Joined</th>
                <th className="text-left p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredMembers.map(member => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMembers([...selectedMembers, member.id])
                        } else {
                          setSelectedMembers(selectedMembers.filter(id => id !== member.id))
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                      {member.companyName && (
                        <div className="text-sm text-gray-600">{member.companyName}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    {member.city}, {member.state}
                  </td>
                  <td className="p-4">
                    <div className="inline-flex items-center gap-2">
                      <select
                        value={member.tierLevel}
                        onChange={(e) => updateMemberTier(member.id, parseInt(e.target.value))}
                        className="text-sm border rounded-full px-3 py-1 bg-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {config.tiers.map(tier => (
                          <option key={tier.level} value={tier.level}>{tier.name}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleVerified(member.id)}
                        className={cn(
                          'px-3 py-1 text-xs font-semibold rounded-full border transition-colors',
                          member.isVerified
                            ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-400 border-gray-300 hover:bg-gray-200'
                        )}
                      >
                        {member.isVerified ? '✓ Verified' : 'Unverified'}
                      </button>
                      <button
                        onClick={() => toggleFeatured(member.id)}
                        className={cn(
                          'px-3 py-1 text-xs font-semibold rounded-full border transition-colors',
                          member.isFeatured
                            ? 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200'
                            : 'bg-gray-100 text-gray-400 border-gray-300 hover:bg-gray-200'
                        )}
                      >
                        {member.isFeatured ? '★ Featured' : 'Not Featured'}
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No members found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="mt-6 text-sm text-gray-500">
        <span className="font-medium">Keyboard shortcuts:</span> ⌘K to search • ⇧⌘A to select all • ESC to clear selection
      </div>
    </div>
  )
}