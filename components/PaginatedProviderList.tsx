'use client'

import { useState } from 'react'
import { ProviderCard } from './ProviderCard'
import type { ProviderCardData } from '@/types/provider'

interface PaginatedProviderListProps {
  providers: ProviderCardData[]
  pageSize?: number
}

export function PaginatedProviderList({
  providers,
  pageSize = 9
}: PaginatedProviderListProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(providers.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentProviders = providers.slice(startIndex, endIndex)

  // Don't show pagination if only one page
  if (providers.length <= pageSize) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map(provider => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Provider Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentProviders.map(provider => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, providers.length)} of {providers.length} providers
        </p>

        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              // Show first, last, current, and adjacent pages
              const showPage =
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1

              if (!showPage) {
                // Show ellipsis for gaps
                if (page === 2 || page === totalPages - 1) {
                  return (
                    <span key={page} className="px-2 text-gray-400">
                      ...
                    </span>
                  )
                }
                return null
              }

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              )
            })}
          </div>

          {/* Mobile Page Indicator */}
          <span className="sm:hidden text-sm text-gray-600">
            {currentPage} / {totalPages}
          </span>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
