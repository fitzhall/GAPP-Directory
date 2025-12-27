'use client'

import { useState } from 'react'
import Link from 'next/link'

interface MiniScreenerProps {
  county: string
  countySlug: string
  // Provider counts for dynamic results
  totalProviders: number
  rnCount: number
  lpnCount: number
  pcsCount: number
}

type MedicaidStatus = 'yes' | 'no' | 'not_sure' | null
type CareType = 'RN' | 'LPN' | 'PCS' | 'not_sure' | null

export function MiniScreener({
  county,
  countySlug,
  totalProviders,
  rnCount,
  lpnCount,
  pcsCount,
}: MiniScreenerProps) {
  const [medicaidStatus, setMedicaidStatus] = useState<MedicaidStatus>(null)
  const [careType, setCareType] = useState<CareType>(null)
  const [showResults, setShowResults] = useState(false)

  const handleCheck = () => {
    if (medicaidStatus && careType) {
      setShowResults(true)
    }
  }

  const resetScreener = () => {
    setMedicaidStatus(null)
    setCareType(null)
    setShowResults(false)
  }

  // Calculate matching provider count based on care type
  const getMatchingCount = () => {
    if (careType === 'RN') return rnCount
    if (careType === 'LPN') return lpnCount
    if (careType === 'PCS') return pcsCount
    // "not_sure" shows total
    return totalProviders
  }

  // Build directory URL with filters
  const getDirectoryUrl = () => {
    let url = `/directory?county=${county}`
    if (careType && careType !== 'not_sure') {
      url += `&service=${careType}`
    }
    return url
  }

  // Results view
  if (showResults) {
    const matchCount = getMatchingCount()
    const hasMedicaid = medicaidStatus === 'yes'
    const needsHelp = medicaidStatus === 'not_sure'

    return (
      <div className="bg-gradient-to-br from-accent/5 to-blue-50 rounded-xl border border-accent/20 p-5">
        {/* Result header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            hasMedicaid && matchCount > 0
              ? 'bg-green-100'
              : needsHelp
                ? 'bg-yellow-100'
                : 'bg-gray-100'
          }`}>
            {hasMedicaid && matchCount > 0 ? (
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div>
            <h4 className={`font-semibold ${
              hasMedicaid && matchCount > 0
                ? 'text-green-800'
                : needsHelp
                  ? 'text-yellow-800'
                  : 'text-gray-800'
            }`}>
              {hasMedicaid && matchCount > 0
                ? 'You may be eligible for GAPP!'
                : needsHelp
                  ? 'Let\'s find out more'
                  : 'Medicaid is required for GAPP'
              }
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {matchCount > 0
                ? `${matchCount} provider${matchCount !== 1 ? 's' : ''} in ${county} County ${
                    careType && careType !== 'not_sure'
                      ? `offer ${careType === 'RN' ? 'RN nursing' : careType === 'LPN' ? 'LPN services' : 'personal care'}`
                      : 'match your needs'
                  }`
                : `No providers currently listed in ${county} County for this service type`
              }
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          {matchCount > 0 && (
            <Link
              href={getDirectoryUrl()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors text-sm"
            >
              View {matchCount} Provider{matchCount !== 1 ? 's' : ''}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          )}
          <Link
            href="/screener"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Full Eligibility Check
          </Link>
        </div>

        {/* Reset */}
        <button
          onClick={resetScreener}
          className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Start over
        </button>
      </div>
    )
  }

  // Question view
  return (
    <div className="bg-gradient-to-br from-accent/5 to-blue-50 rounded-xl border border-accent/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="font-semibold text-gray-900">Quick Eligibility Check</h3>
      </div>

      <div className="space-y-4">
        {/* Question 1: Medicaid */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Do you have Medicaid or PeachCare?
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
              { value: 'not_sure', label: 'Not Sure' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setMedicaidStatus(option.value as MedicaidStatus)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                  medicaidStatus === option.value
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Care Type */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            What type of care do you need?
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'RN', label: 'RN Nursing' },
              { value: 'LPN', label: 'LPN' },
              { value: 'PCS', label: 'Personal Care' },
              { value: 'not_sure', label: 'Not Sure' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setCareType(option.value as CareType)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                  careType === option.value
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Check button */}
        <button
          onClick={handleCheck}
          disabled={!medicaidStatus || !careType}
          className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
            medicaidStatus && careType
              ? 'bg-accent text-white hover:bg-accent/90'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Check My Eligibility
        </button>

        <p className="text-xs text-gray-500 text-center">
          This is a quick check only.{' '}
          <Link href="/screener" className="underline hover:no-underline">
            Take the full screener
          </Link>{' '}
          for personalized guidance.
        </p>
      </div>
    </div>
  )
}
