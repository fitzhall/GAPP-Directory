'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { DashboardCharts } from '@/components/DashboardCharts'

interface ProviderEvent {
  provider_id: string
  event_type: string
  created_at: string
}

interface ProviderInfo {
  id: string
  name: string
  slug: string
  city: string
  is_claimed: boolean
  is_verified: boolean
  is_featured: boolean
  tier_level: number
}

interface ProviderStats {
  views: number
  clicks: number
  impressions: number
  callbacks: number
  ctr: number
}

interface CallbackRow {
  id: string
  parent_name: string
  county: string
  urgency: string
  service_needed: string
  created_at: string
  provider_id: string
}

export default function AdminAnalyticsPage() {
  const [events, setEvents] = useState<ProviderEvent[]>([])
  const [providers, setProviders] = useState<ProviderInfo[]>([])
  const [callbacks, setCallbacks] = useState<CallbackRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'views' | 'clicks' | 'impressions' | 'callbacks' | 'ctr'>('views')

  const thirtyDaysAgo = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    return d.toISOString()
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)

    const [eventsRes, providersRes, callbacksRes] = await Promise.all([
      supabase
        .from('provider_events')
        .select('provider_id, event_type, created_at')
        .gte('created_at', thirtyDaysAgo),
      supabase
        .from('providers')
        .select('id, name, slug, city, is_claimed, is_verified, is_featured, tier_level')
        .eq('is_active', true)
        .order('name'),
      supabase
        .from('callback_requests')
        .select('id, parent_name, county, urgency, service_needed, created_at, provider_id')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: false }),
    ])

    if (eventsRes.data) setEvents(eventsRes.data)
    if (providersRes.data) setProviders(providersRes.data)
    if (callbacksRes.data) setCallbacks(callbacksRes.data)

    setLoading(false)
  }

  // Compute per-provider stats from events
  const providerStatsMap = useMemo(() => {
    const map: Record<string, ProviderStats> = {}

    // Count callbacks per provider
    const cbCounts: Record<string, number> = {}
    for (const cb of callbacks) {
      cbCounts[cb.provider_id] = (cbCounts[cb.provider_id] || 0) + 1
    }

    for (const event of events) {
      if (!map[event.provider_id]) {
        map[event.provider_id] = { views: 0, clicks: 0, impressions: 0, callbacks: 0, ctr: 0 }
      }
      const s = map[event.provider_id]
      if (event.event_type === 'view') s.views++
      else if (event.event_type === 'click_phone' || event.event_type === 'click_website') s.clicks++
      else if (event.event_type === 'impression') s.impressions++
    }

    // Attach callback counts and compute CTR
    for (const pid of Object.keys(map)) {
      map[pid].callbacks = cbCounts[pid] || 0
      map[pid].ctr = map[pid].impressions > 0
        ? Math.round((map[pid].clicks / map[pid].impressions) * 1000) / 10
        : 0
    }

    // Also add providers that only have callbacks but no events
    for (const pid of Object.keys(cbCounts)) {
      if (!map[pid]) {
        map[pid] = { views: 0, clicks: 0, impressions: 0, callbacks: cbCounts[pid], ctr: 0 }
      }
    }

    return map
  }, [events, callbacks])

  // Platform totals
  const platformTotals = useMemo(() => {
    const totals = { views: 0, clicks: 0, impressions: 0, callbacks: callbacks.length }
    for (const s of Object.values(providerStatsMap)) {
      totals.views += s.views
      totals.clicks += s.clicks
      totals.impressions += s.impressions
    }
    return totals
  }, [providerStatsMap, callbacks])

  // Platform daily chart data
  const platformChartData = useMemo(() => {
    const dailyViews: Record<string, number> = {}
    for (const event of events) {
      if (event.event_type === 'view') {
        const day = new Date(event.created_at).toISOString().split('T')[0]
        dailyViews[day] = (dailyViews[day] || 0) + 1
      }
    }
    const chartData = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      chartData.push({
        date: key,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: dailyViews[key] || 0,
      })
    }
    return chartData
  }, [events])

  // Leaderboard: providers sorted by selected metric
  const leaderboard = useMemo(() => {
    const filtered = search
      ? providers.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.city?.toLowerCase().includes(search.toLowerCase())
        )
      : providers

    return filtered
      .map(p => ({
        ...p,
        stats: providerStatsMap[p.id] || { views: 0, clicks: 0, impressions: 0, callbacks: 0, ctr: 0 },
      }))
      .sort((a, b) => b.stats[sortBy] - a.stats[sortBy])
  }, [providers, providerStatsMap, search, sortBy])

  // Selected provider detail data
  const selectedProvider = useMemo(() => {
    if (!selectedProviderId) return null
    const provider = providers.find(p => p.id === selectedProviderId)
    if (!provider) return null

    const stats = providerStatsMap[selectedProviderId] || { views: 0, clicks: 0, impressions: 0, callbacks: 0, ctr: 0 }

    // Build daily chart for this provider
    const dailyViews: Record<string, number> = {}
    for (const event of events) {
      if (event.provider_id === selectedProviderId && event.event_type === 'view') {
        const day = new Date(event.created_at).toISOString().split('T')[0]
        dailyViews[day] = (dailyViews[day] || 0) + 1
      }
    }
    const chartData = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      chartData.push({
        date: key,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: dailyViews[key] || 0,
      })
    }

    // Recent callbacks for this provider
    const recentCallbacks = callbacks
      .filter(cb => cb.provider_id === selectedProviderId)
      .slice(0, 10)

    return { provider, stats, chartData, recentCallbacks }
  }, [selectedProviderId, providers, providerStatsMap, events, callbacks])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Platform Analytics</h1>

        {/* Platform Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Views" value={platformTotals.views} />
          <StatCard label="Total Clicks" value={platformTotals.clicks} />
          <StatCard label="Callback Requests" value={platformTotals.callbacks} />
          <StatCard label="Search Impressions" value={platformTotals.impressions} />
        </div>

        {/* Platform Daily Traffic Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Platform Views (30 days)</h2>
          <DashboardCharts data={platformChartData} />
        </div>

        {/* Provider Detail Panel (shown when a provider is selected) */}
        {selectedProvider && (
          <div className="bg-white rounded-xl border-2 border-primary/30 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedProvider.provider.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedProvider.provider.city}
                  {selectedProvider.provider.is_featured && ' \u2022 Featured'}
                  {selectedProvider.provider.is_verified && ' \u2022 Verified'}
                  {selectedProvider.provider.is_claimed && ' \u2022 Claimed'}
                </p>
              </div>
              <button
                onClick={() => setSelectedProviderId(null)}
                className="text-sm text-gray-400 hover:text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
              <MiniStat label="Views" value={selectedProvider.stats.views} />
              <MiniStat label="Clicks" value={selectedProvider.stats.clicks} />
              <MiniStat label="Callbacks" value={selectedProvider.stats.callbacks} />
              <MiniStat label="Impressions" value={selectedProvider.stats.impressions} />
              <MiniStat label="CTR" value={`${selectedProvider.stats.ctr}%`} />
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Daily Views</h3>
              <DashboardCharts data={selectedProvider.chartData} />
            </div>

            {selectedProvider.recentCallbacks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Callbacks</h3>
                <div className="divide-y divide-gray-100">
                  {selectedProvider.recentCallbacks.map((cb) => (
                    <div key={cb.id} className="py-2 flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium text-gray-900">{cb.parent_name}</span>
                        <span className="text-gray-500 ml-2">
                          {cb.county} &middot; {cb.service_needed}
                          {cb.urgency === 'asap' && (
                            <span className="text-red-600 font-medium ml-1">ASAP</span>
                          )}
                        </span>
                      </div>
                      <span className="text-gray-400">
                        {new Date(cb.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Provider Leaderboard */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Provider Leaderboard</h2>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search providers..."
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-64 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Provider</th>
                  <SortHeader label="Views" field="views" current={sortBy} onSort={setSortBy} />
                  <SortHeader label="Clicks" field="clicks" current={sortBy} onSort={setSortBy} />
                  <SortHeader label="Impressions" field="impressions" current={sortBy} onSort={setSortBy} />
                  <SortHeader label="CTR" field="ctr" current={sortBy} onSort={setSortBy} />
                  <SortHeader label="Callbacks" field="callbacks" current={sortBy} onSort={setSortBy} />
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((row) => {
                  const isSelected = selectedProviderId === row.id
                  const hasActivity = row.stats.views > 0 || row.stats.clicks > 0 || row.stats.impressions > 0
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedProviderId(isSelected ? null : row.id)}
                      className={`border-b border-gray-100 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-primary/5'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-3 px-2">
                        <div className="font-medium text-gray-900">{row.name}</div>
                        <div className="text-xs text-gray-500">{row.city}</div>
                      </td>
                      <td className="py-3 px-2 text-right font-mono">{row.stats.views}</td>
                      <td className="py-3 px-2 text-right font-mono">{row.stats.clicks}</td>
                      <td className="py-3 px-2 text-right font-mono">{row.stats.impressions}</td>
                      <td className="py-3 px-2 text-right font-mono">{row.stats.ctr}%</td>
                      <td className="py-3 px-2 text-right font-mono">{row.stats.callbacks}</td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1">
                          {row.is_featured && (
                            <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">Featured</span>
                          )}
                          {row.is_verified && (
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">Verified</span>
                          )}
                          {row.is_claimed && !row.is_verified && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Claimed</span>
                          )}
                          {!row.is_claimed && (
                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">Unclaimed</span>
                          )}
                          {!hasActivity && (
                            <span className="px-1.5 py-0.5 bg-red-50 text-red-500 rounded text-xs">No activity</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {leaderboard.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No providers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Showing {leaderboard.length} providers &middot; Last 30 days &middot; Click a row to see details
          </p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
  )
}

function SortHeader({
  label,
  field,
  current,
  onSort,
}: {
  label: string
  field: 'views' | 'clicks' | 'impressions' | 'callbacks' | 'ctr'
  current: string
  onSort: (f: typeof field) => void
}) {
  return (
    <th
      className={`text-right py-3 px-2 font-medium cursor-pointer select-none transition-colors ${
        current === field ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
      }`}
      onClick={() => onSort(field)}
    >
      {label}
      {current === field && ' \u25BC'}
    </th>
  )
}
