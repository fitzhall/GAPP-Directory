'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'

interface Provider {
  id: string
  name: string
  slug: string
  city: string
  phone: string | null
  services_offered: string[]
  is_claimed: boolean
  is_verified: boolean
}

export default function ClaimProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [provider, setProvider] = useState<Provider | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'already_claimed'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function fetchProvider() {
      try {
        const res = await fetch(`/api/providers/${slug}`)
        if (res.ok) {
          const data = await res.json()
          setProvider(data)
          if (data.is_claimed || data.is_verified) {
            setStatus('already_claimed')
          }
        }
      } catch (err) {
        console.error('Error fetching provider:', err)
      }
      setLoading(false)
    }
    fetchProvider()
  }, [slug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    if (!email || !name) {
      setErrorMessage('Please fill in all required fields.')
      setStatus('error')
      return
    }

    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: provider?.id,
          email,
          name,
          phone,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to claim profile')
      }

      setStatus('success')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Provider Not Found</h1>
          <p className="text-gray-600 mb-4">This provider listing doesn&apos;t exist.</p>
          <Link href="/directory" className="text-primary hover:underline">
            Browse all providers
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'already_claimed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Already Claimed</h1>
          <p className="text-gray-600 mb-6">
            This profile for <strong>{provider.name}</strong> has already been claimed.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            If you believe this is an error, please contact us at{' '}
            <a href="mailto:help@georgiaGAPP.com" className="text-primary hover:underline">
              help@georgiaGAPP.com
            </a>
          </p>
          <Link
            href={`/provider/${provider.slug}`}
            className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            View Profile
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Claim Submitted!</h1>
          <p className="text-gray-600 mb-6">
            We&apos;ve received your request to claim <strong>{provider.name}</strong>.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 text-left mb-6">
            <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>Our team will verify your claim within 24-48 hours</li>
              <li>You&apos;ll receive an email confirmation at <strong>{email}</strong></li>
              <li>Once verified, your profile will be fully visible to families</li>
              <li>You&apos;ll start receiving callback requests from interested families</li>
            </ol>
          </div>
          <Link
            href="/directory"
            className="inline-block px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Browse Directory
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 py-4">
          <Link href="/" className="text-primary font-medium hover:underline text-sm">
            ← Back to GeorgiaGAPP.com
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Provider Card Preview */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-lg sm:text-xl">
                {provider.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-900 text-lg truncate">{provider.name}</h2>
              <p className="text-gray-500 text-sm">{provider.city}, Georgia</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {provider.services_offered?.map(service => (
                  <span key={service} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Claim Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Claim Your Profile
          </h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Verify that you represent this GAPP provider to unlock your full profile and start receiving leads.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Work Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourcompany.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                We&apos;ll send lead notifications to this email
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Phone <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(xxx) xxx-xxxx"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
              />
            </div>

            {/* Error */}
            {status === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{errorMessage}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className={`w-full py-3.5 font-medium rounded-lg transition-colors text-base ${
                status === 'submitting'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              {status === 'submitting' ? 'Submitting...' : 'Claim This Profile'}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3 text-sm">What you get with a claimed profile:</h3>
            <ul className="space-y-2.5">
              {[
                'Receive callback requests from families',
                'Full profile visible in search results',
                'Priority listing for your service areas',
                'Free verification badge'
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Help text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Questions? Email us at{' '}
          <a href="mailto:help@georgiaGAPP.com" className="text-primary hover:underline">
            help@georgiaGAPP.com
          </a>
        </p>
      </div>
    </div>
  )
}
