'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface CallbackFormProps {
  providerId: string
  providerName: string
}

type ServiceNeeded = 'RN' | 'LPN' | 'PCS' | 'not_sure'
type Urgency = 'asap' | 'this_month' | 'researching'
type CallbackTime = 'morning' | 'afternoon' | 'evening'

export function CallbackForm({ providerId, providerName }: CallbackFormProps) {
  const [formState, setFormState] = useState({
    parentName: '',
    phone: '',
    email: '',
    zipCode: '',
    county: '',
    serviceNeeded: '' as ServiceNeeded | '',
    urgency: '' as Urgency | '',
    preferredCallbackTime: '' as CallbackTime | '',
    specialNeeds: '',
  })

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    // Basic validation
    if (!formState.parentName || !formState.phone || !formState.zipCode || !formState.serviceNeeded || !formState.urgency) {
      setErrorMessage('Please fill in all required fields.')
      setStatus('error')
      return
    }

    try {
      const { error } = await supabase
        .from('callback_requests')
        .insert({
          parent_name: formState.parentName,
          phone: formState.phone,
          email: formState.email || null,
          zip_code: formState.zipCode,
          county: formState.county || 'Unknown',
          service_needed: formState.serviceNeeded,
          urgency: formState.urgency,
          preferred_callback_time: formState.preferredCallbackTime || null,
          special_needs: formState.specialNeeds || null,
          provider_id: providerId,
          status: 'new',
        })

      if (error) throw error

      setStatus('success')
    } catch (err) {
      console.error('Error submitting callback request:', err)
      setErrorMessage('Something went wrong. Please try calling directly.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Sent!</h3>
        <p className="text-gray-600">
          {providerName} will call you back soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formState.parentName}
          onChange={(e) => setFormState(prev => ({ ...prev, parentName: e.target.value }))}
          placeholder="Parent or guardian name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formState.phone}
          onChange={(e) => setFormState(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="(xxx) xxx-xxxx"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          required
        />
      </div>

      {/* Email (optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="email"
          value={formState.email}
          onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
          placeholder="your@email.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* ZIP Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ZIP Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formState.zipCode}
          onChange={(e) => setFormState(prev => ({ ...prev, zipCode: e.target.value }))}
          placeholder="30301"
          maxLength={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          required
        />
      </div>

      {/* Service Needed */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Needed <span className="text-red-500">*</span>
        </label>
        <select
          value={formState.serviceNeeded}
          onChange={(e) => setFormState(prev => ({ ...prev, serviceNeeded: e.target.value as ServiceNeeded }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          required
        >
          <option value="">Select a service...</option>
          <option value="RN">Nursing (RN)</option>
          <option value="LPN">Nursing (LPN)</option>
          <option value="PCS">Personal Care</option>
          <option value="not_sure">Not sure yet</option>
        </select>
      </div>

      {/* Urgency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          When do you need help? <span className="text-red-500">*</span>
        </label>
        <select
          value={formState.urgency}
          onChange={(e) => setFormState(prev => ({ ...prev, urgency: e.target.value as Urgency }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          required
        >
          <option value="">Select timing...</option>
          <option value="asap">As soon as possible</option>
          <option value="this_month">Within the next month</option>
          <option value="researching">Just researching</option>
        </select>
      </div>

      {/* Preferred callback time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Best time to call <span className="text-gray-400">(optional)</span>
        </label>
        <select
          value={formState.preferredCallbackTime}
          onChange={(e) => setFormState(prev => ({ ...prev, preferredCallbackTime: e.target.value as CallbackTime }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">Any time</option>
          <option value="morning">Morning (8am - 12pm)</option>
          <option value="afternoon">Afternoon (12pm - 5pm)</option>
          <option value="evening">Evening (5pm - 8pm)</option>
        </select>
      </div>

      {/* Special needs (optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Anything else? <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          value={formState.specialNeeds}
          onChange={(e) => setFormState(prev => ({ ...prev, specialNeeds: e.target.value }))}
          placeholder="Night hours needed, Spanish-speaking, etc."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
        />
      </div>

      {/* Error message */}
      {status === 'error' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className={`w-full py-3 font-medium rounded-lg transition-colors ${
          status === 'submitting'
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primary text-white hover:bg-primary-dark'
        }`}
      >
        {status === 'submitting' ? 'Sending...' : 'Request Callback'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your information is shared only with {providerName}.
      </p>
    </form>
  )
}
