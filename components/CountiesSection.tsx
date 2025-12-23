'use client'

import { useState } from 'react'

interface CountiesSectionProps {
  counties: string[]
}

const INITIAL_DISPLAY = 8

export function CountiesSection({ counties }: CountiesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!counties || counties.length === 0) {
    return null
  }

  const sortedCounties = [...counties].sort()
  const hasMore = sortedCounties.length > INITIAL_DISPLAY
  const displayedCounties = isExpanded ? sortedCounties : sortedCounties.slice(0, INITIAL_DISPLAY)
  const remainingCount = sortedCounties.length - INITIAL_DISPLAY

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Counties Served</h2>
        <span className="text-sm text-gray-500">{sortedCounties.length} counties</span>
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
    </section>
  )
}
