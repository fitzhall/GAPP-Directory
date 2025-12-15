'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type ServiceType = 'RN' | 'LPN' | 'PCS' | 'not_sure'
type UrgencyType = 'asap' | 'this_month' | 'researching'

interface QuizState {
  step: number
  county: string
  service: ServiceType | null
  urgency: UrgencyType | null
  specialNeeds: string[]
}

// Georgia counties for the dropdown
const GEORGIA_COUNTIES = [
  'Fulton', 'Gwinnett', 'Cobb', 'DeKalb', 'Clayton',
  'Cherokee', 'Forsyth', 'Henry', 'Hall', 'Richmond',
  'Chatham', 'Muscogee', 'Columbia', 'Douglas', 'Paulding',
  'Bibb', 'Houston', 'Clarke', 'Fayette', 'Coweta',
  'Carroll', 'Bartow', 'Lowndes', 'Whitfield', 'Floyd',
  'Rockdale', 'Newton', 'Troup', 'Glynn', 'Dougherty',
  'Bryan', 'Effingham', 'Liberty', 'Camden', 'McIntosh',
  'Wayne', 'Burke', 'McDuffie', 'Brooks', 'Echols',
  'Lanier', 'Walton', 'Barrow', 'Peach', 'Crawford'
].sort()

export default function QuizPage() {
  const router = useRouter()
  const [state, setState] = useState<QuizState>({
    step: 1,
    county: '',
    service: null,
    urgency: null,
    specialNeeds: []
  })

  const totalSteps = 4

  const handleNext = () => {
    if (state.step < totalSteps) {
      setState(prev => ({ ...prev, step: prev.step + 1 }))
    } else {
      // Build query string and navigate to results
      const params = new URLSearchParams()
      if (state.county) params.set('county', state.county)
      if (state.service && state.service !== 'not_sure') params.set('service', state.service)
      if (state.urgency) params.set('urgency', state.urgency)
      if (state.specialNeeds.length > 0) params.set('needs', state.specialNeeds.join(','))

      router.push(`/directory?${params.toString()}`)
    }
  }

  const handleBack = () => {
    if (state.step > 1) {
      setState(prev => ({ ...prev, step: prev.step - 1 }))
    }
  }

  const toggleSpecialNeed = (need: string) => {
    setState(prev => ({
      ...prev,
      specialNeeds: prev.specialNeeds.includes(need)
        ? prev.specialNeeds.filter(n => n !== need)
        : [...prev.specialNeeds, need]
    }))
  }

  const canProceed = () => {
    switch (state.step) {
      case 1: return state.county !== ''
      case 2: return state.service !== null
      case 3: return state.urgency !== null
      case 4: return true // Optional step
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {state.step} of {totalSteps}</span>
            <span>{Math.round((state.step / totalSteps) * 100)}% complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${(state.step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Quiz card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          {/* Step 1: Location */}
          {state.step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Where are you located?
              </h2>
              <p className="text-gray-600 mb-6">
                We&apos;ll show you providers who serve your county.
              </p>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-2 block">
                  Select your county
                </span>
                <select
                  value={state.county}
                  onChange={(e) => setState(prev => ({ ...prev, county: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-accent focus:border-accent"
                >
                  <option value="">Choose a county...</option>
                  {GEORGIA_COUNTIES.map(county => (
                    <option key={county} value={county}>{county} County</option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {/* Step 2: Service Type */}
          {state.step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What kind of help do you need?
              </h2>
              <p className="text-gray-600 mb-6">
                Don&apos;t worry if you&apos;re not sure — we can show you all options.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setState(prev => ({ ...prev, service: 'RN' }))}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    state.service === 'RN'
                      ? 'border-accent bg-accent/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">Nursing care (RN)</div>
                  <div className="text-sm text-gray-600">Skilled nursing by a registered nurse</div>
                </button>

                <button
                  onClick={() => setState(prev => ({ ...prev, service: 'LPN' }))}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    state.service === 'LPN'
                      ? 'border-accent bg-accent/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">Nursing care (LPN)</div>
                  <div className="text-sm text-gray-600">Nursing by a licensed practical nurse</div>
                </button>

                <button
                  onClick={() => setState(prev => ({ ...prev, service: 'PCS' }))}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    state.service === 'PCS'
                      ? 'border-accent bg-accent/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">Personal care help</div>
                  <div className="text-sm text-gray-600">Help with bathing, dressing, daily activities</div>
                </button>

                <button
                  onClick={() => setState(prev => ({ ...prev, service: 'not_sure' }))}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    state.service === 'not_sure'
                      ? 'border-accent bg-accent/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">I&apos;m not sure yet</div>
                  <div className="text-sm text-gray-600">Show me all available providers</div>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Urgency */}
          {state.step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                When do you need help?
              </h2>
              <p className="text-gray-600 mb-6">
                This helps us prioritize providers who can respond quickly.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setState(prev => ({ ...prev, urgency: 'asap' }))}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    state.urgency === 'asap'
                      ? 'border-accent bg-accent/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">As soon as possible</div>
                  <div className="text-sm text-gray-600">We need care to start right away</div>
                </button>

                <button
                  onClick={() => setState(prev => ({ ...prev, urgency: 'this_month' }))}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    state.urgency === 'this_month'
                      ? 'border-accent bg-accent/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">Within the next month</div>
                  <div className="text-sm text-gray-600">We have some time to find the right fit</div>
                </button>

                <button
                  onClick={() => setState(prev => ({ ...prev, urgency: 'researching' }))}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    state.urgency === 'researching'
                      ? 'border-accent bg-accent/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">Just researching</div>
                  <div className="text-sm text-gray-600">Learning about our options</div>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Special Needs (Optional) */}
          {state.step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Anything else important?
              </h2>
              <p className="text-gray-600 mb-6">
                Select any that apply, or skip if none.
              </p>

              <div className="space-y-3">
                {[
                  { id: 'nights', label: 'Need night hours', desc: 'Care during overnight hours' },
                  { id: 'weekends', label: 'Need weekend hours', desc: 'Care on Saturdays or Sundays' },
                  { id: 'spanish', label: 'Spanish-speaking preferred', desc: 'Provider speaks Spanish' },
                  { id: 'high_medical', label: 'High medical needs', desc: 'Complex medical care required' },
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => toggleSpecialNeed(option.id)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                      state.specialNeeds.includes(option.id)
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.desc}</div>
                      </div>
                      {state.specialNeeds.includes(option.id) && (
                        <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleBack}
              disabled={state.step === 1}
              className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                state.step === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                canProceed()
                  ? 'bg-accent text-white hover:bg-accent-dark'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {state.step === totalSteps ? 'Show Providers' : 'Continue'}
            </button>
          </div>
        </div>

        {/* Reassurance text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Your information is only used to match you with providers.
          <br />
          We never share your details without permission.
        </p>
      </div>
    </div>
  )
}
