'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface ListingRequest {
  id: string
  contact_name: string
  contact_email: string
  contact_phone: string | null
  business_name: string
  city: string
  website: string | null
  services_offered: string[]
  counties_served: string[]
  notes: string | null
  status: 'pending' | 'approved' | 'rejected'
  reviewed_at: string | null
  reviewed_by: string | null
  review_notes: string | null
  provider_id: string | null
  created_at: string
}

type TabType = 'pending' | 'approved' | 'rejected' | 'all'

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<ListingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('pending')
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    setLoading(true)
    const { data, error } = await supabase
      .from('listing_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching listing requests:', error)
    } else {
      setRequests(data || [])
    }
    setLoading(false)
  }

  // Filter requests based on tab
  const filteredRequests = requests.filter(req => {
    if (activeTab === 'all') return true
    return req.status === activeTab
  })

  // Stats
  const pendingCount = requests.filter(r => r.status === 'pending').length
  const approvedCount = requests.filter(r => r.status === 'approved').length
  const rejectedCount = requests.filter(r => r.status === 'rejected').length

  // Approve request - create provider and update status
  async function approveRequest(request: ListingRequest) {
    if (!confirm(`Approve listing request for "${request.business_name}"? This will create a new provider entry.`)) {
      return
    }

    setProcessing(request.id)

    try {
      // Generate slug from business name
      const slug = request.business_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      // Create the provider
      const { data: newProvider, error: providerError } = await supabase
        .from('providers')
        .insert({
          name: request.business_name,
          slug: slug,
          city: request.city,
          state: 'GA',
          email: request.contact_email,
          phone: request.contact_phone,
          website: request.website,
          services_offered: request.services_offered,
          counties_served: request.counties_served,
          is_claimed: true,
          claimed_at: new Date().toISOString(),
          claimed_by_email: request.contact_email,
          is_verified: false,
          is_featured: false,
          accepting_new_patients: false,
          tier_level: 1, // Claimed tier
        })
        .select()
        .single()

      if (providerError) {
        console.error('Error creating provider:', providerError)
        alert('Failed to create provider: ' + providerError.message)
        setProcessing(null)
        return
      }

      // Update the listing request
      const { error: updateError } = await supabase
        .from('listing_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'admin',
          provider_id: newProvider.id,
        })
        .eq('id', request.id)

      if (updateError) {
        console.error('Error updating request:', updateError)
        alert('Provider created but failed to update request status')
      } else {
        // Update local state
        setRequests(prev =>
          prev.map(r =>
            r.id === request.id
              ? { ...r, status: 'approved', provider_id: newProvider.id, reviewed_at: new Date().toISOString() }
              : r
          )
        )
        alert(`Approved! Provider "${request.business_name}" has been created. They can now verify their profile.`)
      }
    } catch (err) {
      console.error('Error approving request:', err)
      alert('Failed to approve request')
    }

    setProcessing(null)
  }

  // Reject request
  async function rejectRequest(request: ListingRequest) {
    const reason = prompt('Reason for rejection (optional):')
    if (reason === null) return // User cancelled

    setProcessing(request.id)

    const { error } = await supabase
      .from('listing_requests')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'admin',
        review_notes: reason || null,
      })
      .eq('id', request.id)

    if (error) {
      console.error('Error rejecting request:', error)
      alert('Failed to reject request')
    } else {
      setRequests(prev =>
        prev.map(r =>
          r.id === request.id
            ? { ...r, status: 'rejected', review_notes: reason || null, reviewed_at: new Date().toISOString() }
            : r
        )
      )
    }

    setProcessing(null)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Listing Requests</h1>
              <p className="text-sm text-gray-600 mt-1">
                Review and approve new provider listing requests
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-sm text-primary font-medium hover:underline"
              >
                ← Back to Providers
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
            <p className="text-sm text-gray-500">Total Requests</p>
            <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
          </div>
        </div>

        {/* Tabs */}
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
                onClick={() => setActiveTab('approved')}
                className={`py-3 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'approved'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Approved ({approvedCount})
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`py-3 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'rejected'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Rejected ({rejectedCount})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-3 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'all'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                All ({requests.length})
              </button>
            </div>
          </div>
        </div>

        {/* Request List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
              Loading requests...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
              No {activeTab === 'all' ? '' : activeTab} requests found
            </div>
          ) : (
            filteredRequests.map(request => (
              <div
                key={request.id}
                className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {request.business_name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          request.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : request.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Contact:</span>{' '}
                        <span className="text-gray-900">{request.contact_name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>{' '}
                        <a
                          href={`mailto:${request.contact_email}`}
                          className="text-primary hover:underline"
                        >
                          {request.contact_email}
                        </a>
                      </div>
                      <div>
                        <span className="text-gray-500">City:</span>{' '}
                        <span className="text-gray-900">{request.city}, GA</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>{' '}
                        <span className="text-gray-900">{request.contact_phone || 'Not provided'}</span>
                      </div>
                      {request.website && (
                        <div>
                          <span className="text-gray-500">Website:</span>{' '}
                          <a
                            href={request.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {request.website}
                          </a>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Submitted:</span>{' '}
                        <span className="text-gray-900">
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {request.services_offered.length > 0 && (
                      <div className="mt-2">
                        <span className="text-gray-500 text-sm">Services: </span>
                        <div className="inline-flex gap-1">
                          {request.services_offered.map(service => (
                            <span
                              key={service}
                              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {request.counties_served.length > 0 && (
                      <div className="mt-1">
                        <span className="text-gray-500 text-sm">Counties: </span>
                        <span className="text-gray-700 text-sm">
                          {request.counties_served.join(', ')}
                        </span>
                      </div>
                    )}

                    {request.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {request.notes}
                      </div>
                    )}

                    {request.review_notes && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                        <span className="font-medium">Rejection reason:</span> {request.review_notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => approveRequest(request)}
                          disabled={processing === request.id}
                          className={`px-4 py-2 text-sm font-medium rounded-lg ${
                            processing === request.id
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {processing === request.id ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => rejectRequest(request)}
                          disabled={processing === request.id}
                          className={`px-4 py-2 text-sm font-medium rounded-lg ${
                            processing === request.id
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {request.status === 'approved' && request.provider_id && (
                      <Link
                        href={`/admin`}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-dark text-center"
                      >
                        View Provider
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
