'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RequestListingPage() {
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [city, setCity] = useState('')
  const [website, setWebsite] = useState('')
  const [servicesOffered, setServicesOffered] = useState<string[]>([])
  const [countiesServed, setCountiesServed] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    if (!contactName || !contactEmail || !businessName || !city) {
      setErrorMessage('Please fill in all required fields.')
      setStatus('error')
      return
    }

    try {
      const res = await fetch('/api/listing-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName,
          contactEmail,
          contactPhone: contactPhone || null,
          businessName,
          city,
          website: website || null,
          servicesOffered,
          countiesServed,
          notes: notes || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request')
      }

      setStatus('success')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h1>
            <p className="text-gray-600 mb-4">
              We&apos;ve received your request to be listed on GeorgiaGAPP.com.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
              <h3 className="font-medium text-gray-900 mb-2">What happens next:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  We&apos;ll review your request within 24-48 hours
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  We may contact you to verify your GAPP provider status
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Once approved, we&apos;ll send you a link to claim your profile
                </li>
              </ul>
            </div>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Back to Home
            </Link>
          </div>
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
        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Request to be Listed
          </h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Submit your information to be added to the GeorgiaGAPP.com directory. We&apos;ll review your request and get back to you within 24-48 hours.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contact Info Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 text-sm border-b border-gray-200 pb-2">
                Your Contact Information
              </h3>

              {/* Contact Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
                  required
                />
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="you@yourcompany.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
                  required
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="(xxx) xxx-xxxx"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
                />
              </div>
            </div>

            {/* Business Info Section */}
            <div className="space-y-4 pt-4">
              <h3 className="font-medium text-gray-900 text-sm border-b border-gray-200 pb-2">
                Business Information
              </h3>

              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Business/Agency Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your business or agency name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City in Georgia"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
                  required
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Website <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
                />
              </div>

              {/* Services Offered */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services Offered
                </label>
                <div className="flex flex-wrap gap-2">
                  {['RN', 'LPN', 'PCS'].map(service => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => {
                        if (servicesOffered.includes(service)) {
                          setServicesOffered(servicesOffered.filter(s => s !== service))
                        } else {
                          setServicesOffered([...servicesOffered, service])
                        }
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        servicesOffered.includes(service)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  RN = Registered Nurse, LPN = Licensed Practical Nurse, PCS = Personal Care Services
                </p>
              </div>

              {/* Counties Served */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Counties Served <span className="text-gray-400">(comma separated)</span>
                </label>
                <input
                  type="text"
                  value={countiesServed.join(', ')}
                  onChange={(e) => {
                    const counties = e.target.value
                      .split(',')
                      .map(c => c.trim())
                      .filter(c => c.length > 0)
                    setCountiesServed(counties)
                  }}
                  placeholder="Fulton, Gwinnett, DeKalb"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Additional Notes <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional information about your services..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base resize-none"
                />
              </div>
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
              {status === 'submitting' ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
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
