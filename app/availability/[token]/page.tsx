'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface TokenData {
  valid: boolean
  expired: boolean
  used: boolean
  providerName: string
  previousResponse?: string
}

export default function AvailabilityResponsePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const token = params.token as string
  const autoResponse = searchParams.get('response') // 'available' or 'not_available'

  const [status, setStatus] = useState<'loading' | 'ready' | 'submitting' | 'success' | 'error' | 'expired' | 'used'>('loading')
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [response, setResponse] = useState<'available' | 'not_available' | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  // Validate token on load
  useEffect(() => {
    async function validateToken() {
      try {
        const res = await fetch(`/api/availability/validate?token=${token}`)
        const data = await res.json()

        if (!res.ok) {
          if (data.error === 'expired') {
            setStatus('expired')
          } else if (data.error === 'used') {
            setTokenData(data)
            setStatus('used')
          } else {
            setErrorMessage(data.error || 'Invalid token')
            setStatus('error')
          }
          return
        }

        setTokenData(data)

        // If auto-response from email link, submit immediately
        if (autoResponse === 'available' || autoResponse === 'not_available') {
          await submitResponse(autoResponse)
        } else {
          setStatus('ready')
        }
      } catch (err) {
        setErrorMessage('Something went wrong. Please try again.')
        setStatus('error')
      }
    }

    validateToken()
  }, [token, autoResponse])

  async function submitResponse(selectedResponse: 'available' | 'not_available') {
    setStatus('submitting')
    setResponse(selectedResponse)

    try {
      const res = await fetch('/api/availability/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, response: selectedResponse }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit response')
      }

      setStatus('success')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  // Expired token
  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h1>
          <p className="text-gray-600 mb-6">
            This availability link has expired. We send new availability checks every Monday.
          </p>
          <p className="text-sm text-gray-500">
            Check your email for the latest availability request.
          </p>
        </div>
      </div>
    )
  }

  // Already used
  if (status === 'used') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Already Responded</h1>
          <p className="text-gray-600 mb-4">
            You&apos;ve already submitted your availability for this week.
          </p>
          {tokenData?.previousResponse && (
            <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
              Your response: <strong>{tokenData.previousResponse === 'available' ? 'Available' : 'Not Available'}</strong>
            </p>
          )}
        </div>
      </div>
    )
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    )
  }

  // Success state
  if (status === 'success') {
    const isAvailable = response === 'available'
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isAvailable ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            <svg className={`w-8 h-8 ${isAvailable ? 'text-green-600' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isAvailable ? 'You\'re Marked as Available!' : 'Got It!'}
          </h1>
          <p className="text-gray-600 mb-6">
            {isAvailable
              ? 'Case managers can now see that you\'re accepting new cases this week.'
              : 'We\'ve noted that you\'re not accepting new cases this week. We\'ll check in again next Monday.'}
          </p>
          {isAvailable && (
            <div className="bg-green-50 rounded-xl p-4 text-left mb-6">
              <h3 className="font-medium text-green-900 mb-2">What happens now?</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Case managers searching your counties will see you&apos;re available</li>
                <li>• Your availability is valid for 7 days</li>
                <li>• We&apos;ll send another check-in next Monday</li>
              </ul>
            </div>
          )}
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Visit GeorgiaGAPP.com
          </Link>
        </div>
      </div>
    )
  }

  // Ready state - show buttons
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Weekly Availability Check</h1>
          {tokenData?.providerName && (
            <p className="text-gray-600">
              for <strong>{tokenData.providerName}</strong>
            </p>
          )}
        </div>

        <p className="text-gray-600 text-center mb-6">
          Are you accepting new GAPP cases this week?
        </p>

        <div className="space-y-3">
          <button
            onClick={() => submitResponse('available')}
            disabled={status === 'submitting'}
            className="w-full py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Yes, I&apos;m Available
          </button>

          <button
            onClick={() => submitResponse('not_available')}
            disabled={status === 'submitting'}
            className="w-full py-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Not This Week
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          This helps case managers find providers who are ready to take new cases.
          We&apos;ll ask again next Monday.
        </p>
      </div>
    </div>
  )
}
