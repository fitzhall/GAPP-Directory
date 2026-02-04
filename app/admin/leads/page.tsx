'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Lead {
  id: string
  parent_name: string
  phone: string
  email: string | null
  zip_code: string
  county: string
  service_needed: string
  urgency: string
  preferred_callback_time: string | null
  special_needs: string | null
  status: string
  created_at: string
  contacted_at: string | null
  notes: string | null
  provider: {
    id: string
    name: string
    slug: string
  }
}

type StatusFilter = 'all' | 'new' | 'contacted' | 'converted' | 'closed'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  async function fetchLeads() {
    setLoading(true)
    const { data, error } = await supabase
      .from('callback_requests')
      .select(`
        *,
        provider:providers(id, name, slug)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching leads:', error)
    } else {
      setLeads(data || [])
    }
    setLoading(false)
  }

  const filteredLeads = leads.filter(lead => {
    if (statusFilter === 'all') return true
    return lead.status === statusFilter
  })

  const newCount = leads.filter(l => l.status === 'new').length
  const contactedCount = leads.filter(l => l.status === 'contacted').length
  const convertedCount = leads.filter(l => l.status === 'converted').length

  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    const updates: Record<string, unknown> = { status }
    if (status === 'contacted' || status === 'converted' || status === 'closed') {
      updates.contacted_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('callback_requests')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating lead:', error)
      alert('Failed to update lead')
    } else {
      setLeads(prev =>
        prev.map(l => l.id === id ? { ...l, ...updates } as Lead : l)
      )
    }
    setUpdating(null)
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  function getUrgencyBadge(urgency: string) {
    switch (urgency) {
      case 'asap':
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">ASAP</span>
      case 'this_month':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">This Month</span>
      case 'researching':
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">Researching</span>
      default:
        return null
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">New</span>
      case 'contacted':
        return <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Contacted</span>
      case 'converted':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Converted</span>
      case 'closed':
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">Closed</span>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Lead Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Callback requests from families
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin"
                className="text-xs sm:text-sm text-gray-600 hover:text-gray-900"
              >
                Providers
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-500">Total</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{leads.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-500">New</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{newCount}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-500">Contacted</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-600">{contactedCount}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-500">Converted</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{convertedCount}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex gap-1 sm:gap-4 px-2 sm:px-4 min-w-max">
              {(['all', 'new', 'contacted', 'converted', 'closed'] as StatusFilter[]).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`py-3 px-2 sm:px-1 border-b-2 text-xs sm:text-sm font-medium capitalize whitespace-nowrap ${
                    statusFilter === status
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {status} ({status === 'all' ? leads.length : leads.filter(l => l.status === status).length})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
              Loading leads...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
              No leads found
            </div>
          ) : (
            filteredLeads.map(lead => (
              <div key={lead.id} className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                {/* Header Row - stacks on mobile */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{lead.parent_name}</h3>
                  {getStatusBadge(lead.status)}
                  {getUrgencyBadge(lead.urgency)}
                  <span className="text-xs text-gray-500">{formatDate(lead.created_at)}</span>
                </div>

                {/* Contact Info - stacks on mobile */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-3">
                  <a href={`tel:${lead.phone}`} className="text-primary font-medium hover:underline text-sm sm:text-base">
                    {lead.phone}
                  </a>
                  {lead.email && (
                    <a href={`mailto:${lead.email}`} className="text-gray-600 text-xs sm:text-sm hover:underline truncate">
                      {lead.email}
                    </a>
                  )}
                  <span className="text-gray-500 text-xs sm:text-sm">{lead.zip_code}, {lead.county}</span>
                </div>

                {/* Details Row - wraps on mobile */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-600 mb-2">
                  <span>
                    <strong>Service:</strong> {lead.service_needed === 'not_sure' ? 'Not sure' : lead.service_needed}
                  </span>
                  {lead.preferred_callback_time && (
                    <span>
                      <strong>Best time:</strong> {lead.preferred_callback_time}
                    </span>
                  )}
                  <span>
                    <strong>For:</strong>{' '}
                    <Link href={`/provider/${lead.provider?.slug}`} className="text-primary hover:underline">
                      {lead.provider?.name}
                    </Link>
                  </span>
                </div>

                {/* Special Needs */}
                {lead.special_needs && (
                  <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 rounded p-2 mb-3">
                    <strong>Notes:</strong> {lead.special_needs}
                  </div>
                )}

                {/* Actions - horizontal row at bottom */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                  {updating === lead.id ? (
                    <span className="text-xs text-gray-500">Saving...</span>
                  ) : (
                    <>
                      {lead.status === 'new' && (
                        <button
                          onClick={() => updateStatus(lead.id, 'contacted')}
                          className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700"
                        >
                          Mark Contacted
                        </button>
                      )}
                      {lead.status === 'contacted' && (
                        <>
                          <button
                            onClick={() => updateStatus(lead.id, 'converted')}
                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700"
                          >
                            Converted
                          </button>
                          <button
                            onClick={() => updateStatus(lead.id, 'closed')}
                            className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs font-medium rounded hover:bg-gray-50"
                          >
                            Close
                          </button>
                        </>
                      )}
                      {(lead.status === 'converted' || lead.status === 'closed') && (
                        <button
                          onClick={() => updateStatus(lead.id, 'new')}
                          className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs font-medium rounded hover:bg-gray-50"
                        >
                          Reopen
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
