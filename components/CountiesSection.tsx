'use client'

import { useState } from 'react'
import Link from 'next/link'

interface CountiesSectionProps {
  counties: string[]
  isVerified?: boolean
  providerSlug?: string
}

const INITIAL_DISPLAY = 8
const FREE_TIER_LIMIT = 5

export function CountiesSection({ counties, isVerified = false, providerSlug }: CountiesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!counties || counties.length === 0) {
    return null
  }

  const sortedCounties = [...counties].sort()

  // For non-verified providers, limit to FREE_TIER_LIMIT counties
  const maxCounties = isVerified ? sortedCounties.length : FREE_TIER_LIMIT
  const limitedCounties = sortedCounties.slice(0, maxCounties)
  const hiddenCount = sortedCounties.length - FREE_TIER_LIMIT

  // For verified providers, use the normal expand/collapse behavior
  const hasMore = isVerified && limitedCounties.length > INITIAL_DISPLAY
  const displayedCounties = isVerified
    ? (isExpanded ? limitedCounties : limitedCounties.slice(0, INITIAL_DISPLAY))
    : limitedCounties
  const remainingCount = limitedCounties.length - INITIAL_DISPLAY

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Counties Served</h2>
        <span className="text-sm text-gray-500">
          {isVerified ? `${sortedCounties.length} counties` : `${limitedCounties.length} of ${sortedCounties.length} counties`}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {displayedCounties.map(county => (
          <span
            key={county}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            {county}
          </span>
        ))}

        {hasMore && !isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            +{remainingCount} more
          </button>
        )}
      </div>

      {hasMore && isExpanded && (
        <button
          onClick={() => setIsExpanded(false)}
          className="mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Show less
        </button>
      )}

      {/* Upgrade prompt for non-verified with more counties */}
      {!isVerified && hiddenCount > 0 && (
        <div className="mt-4 p-3 bg-accent/5 border border-accent/20 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-accent">+{hiddenCount} more counties</span> served but not displayed.{' '}
            {providerSlug ? (
              <Link href={`/claim/${providerSlug}`} className="text-primary hover:underline font-medium">
                Get verified
              </Link>
            ) : (
              <span className="text-primary font-medium">Get verified</span>
            )}{' '}
            to show all service areas.
          </p>
        </div>
      )}
    </section>
  )
}
