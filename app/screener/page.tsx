'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  GEORGIA_COUNTIES,
  CARE_COMPLEXITY,
  MEDICAID_STATUS_OPTIONS,
  HOURS_STATUS_OPTIONS,
  PAIN_POINT_OPTIONS,
  DOCUMENT_CHECKLIST,
  HOUR_REDUCTION_TIPS,
  FEEDBACK_OPTIONS,
} from '@/lib/screener-config'
import {
  ScreenerState,
  initialScreenerState,
  generateResults,
  canProceedFromStep,
} from '@/lib/screener-utils'

export default function ScreenerPage() {
  const [state, setState] = useState<ScreenerState>(initialScreenerState)
  const [copiedScript, setCopiedScript] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const totalSteps = 4 // 3 input steps + 1 results step

  // Toggle a care indicator
  const toggleIndicator = (
    category: 'airway' | 'feeding' | 'neuro' | 'mobility' | 'skilled',
    id: string
  ) => {
    setState(prev => ({
      ...prev,
      [category]: prev[category].includes(id)
        ? prev[category].filter(i => i !== id)
        : [...prev[category], id]
    }))
  }

  const handleNext = () => {
    if (state.step < totalSteps) {
      setState(prev => ({ ...prev, step: prev.step + 1 }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    if (state.step > 1) {
      setState(prev => ({ ...prev, step: prev.step - 1 }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const copyToClipboard = async (text: string, scriptId: string) => {
    try {
      await navigator.clipboard.writeText(text.replace(/^"|"$/g, ''))
      setCopiedScript(scriptId)
      setTimeout(() => setCopiedScript(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleFeedback = (value: string) => {
    setFeedback(value)
    setFeedbackSubmitted(true)
    // Could send to analytics here in the future
  }

  const canProceed = canProceedFromStep(state, state.step)
  const results = state.step === 4 ? generateResults(state) : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
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

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            GAPP Eligibility Screener
          </h1>
          <p className="text-gray-600">
            Find out if your child may qualify for home nursing services
          </p>
        </div>

        {/* Progress bar - only show for input steps */}
        {state.step < 4 && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Step {state.step} of 3</span>
              <span>{Math.round((state.step / 3) * 100)}% complete</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${(state.step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">

          {/* Step 1: Care Complexity */}
          {state.step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tell us about your child&apos;s care needs
              </h2>
              <p className="text-gray-600 mb-6">
                Select all that apply. This helps us understand the level of care needed.
              </p>

              <div className="space-y-6">
                {Object.entries(CARE_COMPLEXITY).map(([key, category]) => (
                  <div key={key}>
                    <h3 className="font-semibold text-gray-800 mb-3">{category.label}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {category.options.map(option => (
                        <button
                          key={option.id}
                          onClick={() => toggleIndicator(key as keyof typeof CARE_COMPLEXITY, option.id)}
                          className={`p-3 text-left rounded-xl border-2 transition-all text-sm ${
                            state[key as keyof ScreenerState] &&
                            (state[key as keyof ScreenerState] as string[]).includes(option.id)
                              ? 'border-accent bg-accent/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded flex items-center justify-center border-2 ${
                              state[key as keyof ScreenerState] &&
                              (state[key as keyof ScreenerState] as string[]).includes(option.id)
                                ? 'border-accent bg-accent text-white'
                                : 'border-gray-300'
                            }`}>
                              {state[key as keyof ScreenerState] &&
                               (state[key as keyof ScreenerState] as string[]).includes(option.id) && (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className="text-gray-700">{option.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500 mt-6">
                Don&apos;t see your child&apos;s needs listed? That&apos;s okay — this is just a starting point.
              </p>
            </div>
          )}

          {/* Step 2: Current Situation */}
          {state.step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What&apos;s your current situation?
              </h2>
              <p className="text-gray-600 mb-6">
                This helps us give you the right next steps.
              </p>

              <div className="space-y-6">
                {/* Medicaid Status */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Do you have Medicaid or PeachCare?
                  </h3>
                  <div className="space-y-2">
                    {MEDICAID_STATUS_OPTIONS.map(option => (
                      <button
                        key={option.id}
                        onClick={() => setState(prev => ({ ...prev, medicaidStatus: option.id as ScreenerState['medicaidStatus'] }))}
                        className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                          state.medicaidStatus === option.id
                            ? 'border-accent bg-accent/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-gray-900">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hours Status */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Are you approved for home care hours?
                  </h3>
                  <div className="space-y-2">
                    {HOURS_STATUS_OPTIONS.map(option => (
                      <button
                        key={option.id}
                        onClick={() => setState(prev => ({ ...prev, hoursStatus: option.id as ScreenerState['hoursStatus'] }))}
                        className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                          state.hoursStatus === option.id
                            ? 'border-accent bg-accent/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-gray-900">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pain Point */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    What&apos;s your biggest challenge right now?
                  </h3>
                  <div className="space-y-2">
                    {PAIN_POINT_OPTIONS.map(option => (
                      <button
                        key={option.id}
                        onClick={() => setState(prev => ({ ...prev, painPoint: option.id }))}
                        className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                          state.painPoint === option.id
                            ? 'border-accent bg-accent/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-gray-900">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Geography */}
          {state.step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Where are you located?
              </h2>
              <p className="text-gray-600 mb-6">
                We&apos;ll show you providers and resources in your area.
              </p>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-2 block">
                    Select your county *
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

                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-2 block">
                    Zip code (optional)
                  </span>
                  <input
                    type="text"
                    value={state.zipCode}
                    onChange={(e) => setState(prev => ({ ...prev, zipCode: e.target.value }))}
                    placeholder="e.g., 30301"
                    maxLength={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {state.step === 4 && results && (
            <div className="space-y-6">
              {/* Block 1: Your Snapshot */}
              <div className={`p-6 rounded-xl border-2 ${
                results.fitLevel === 'strong' ? 'border-green-200 bg-green-50' :
                results.fitLevel === 'moderate' ? 'border-yellow-200 bg-yellow-50' :
                'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    results.fitLevel === 'strong' ? 'bg-green-100' :
                    results.fitLevel === 'moderate' ? 'bg-yellow-100' :
                    'bg-gray-100'
                  }`}>
                    {results.fitLevel === 'strong' ? (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : results.fitLevel === 'moderate' ? (
                      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${
                      results.fitLevel === 'strong' ? 'text-green-800' :
                      results.fitLevel === 'moderate' ? 'text-yellow-800' :
                      'text-gray-800'
                    }`}>
                      {results.fitContent.title}
                    </h3>
                    <p className={`mt-1 ${
                      results.fitLevel === 'strong' ? 'text-green-700' :
                      results.fitLevel === 'moderate' ? 'text-yellow-700' :
                      'text-gray-700'
                    }`}>
                      {results.fitContent.snapshot}
                    </p>
                  </div>
                </div>
              </div>

              {/* Block 2: What To Do Next */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    What To Do Next
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {results.nextSteps.map((step) => (
                      <div key={step.step} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                          {step.step}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{step.title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA to directory */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link
                      href={`/directory?county=${state.county}`}
                      className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      View Providers in {state.county} County
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Block 3: What To Say (Scripts) */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    What To Say
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Copy these scripts to help with calls</p>
                </div>
                <div className="p-6 space-y-4">
                  {/* Agency Script */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-blue-900">Calling an Agency</h4>
                      <button
                        onClick={() => copyToClipboard(results.scripts.agency, 'agency')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                      >
                        {copiedScript === 'agency' ? (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-blue-800 text-sm italic">{results.scripts.agency}</p>
                  </div>

                  {/* Pediatrician Script */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-green-900">Talking to Your Pediatrician</h4>
                      <button
                        onClick={() => copyToClipboard(results.scripts.pediatrician, 'pediatrician')}
                        className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1"
                      >
                        {copiedScript === 'pediatrician' ? (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-green-800 text-sm italic">{results.scripts.pediatrician}</p>
                  </div>

                  {/* Coordinator Script (only if hours reduced) */}
                  {results.scripts.coordinator && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-purple-900">Talking to Your Care Coordinator</h4>
                        <button
                          onClick={() => copyToClipboard(results.scripts.coordinator!, 'coordinator')}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1"
                        >
                          {copiedScript === 'coordinator' ? (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-purple-800 text-sm italic">{results.scripts.coordinator}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Block 4: What To Gather (Checklist) */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Documents To Gather
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Having these ready will speed up the process</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {DOCUMENT_CHECKLIST.map(item => (
                      <li key={item.id} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Block 5: Hour Reduction Help (conditional) */}
              {results.showHourReduction && (
                <div className="border-2 border-orange-200 bg-orange-50 rounded-xl overflow-hidden">
                  <div className="bg-orange-100 px-6 py-4 border-b border-orange-200">
                    <h3 className="font-bold text-lg text-orange-900 flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Facing Hour Reductions?
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {HOUR_REDUCTION_TIPS.map((tip, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-orange-900">{tip.title}</h4>
                            <p className="text-orange-800 text-sm mt-0.5">{tip.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-white rounded-lg border border-orange-200">
                      <p className="text-sm text-gray-700">
                        <strong>Coming Soon:</strong> Our Letter of Medical Necessity tool will help you and your doctor document current care needs to support your case.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Section */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-bold text-lg text-gray-900">Did this tool help?</h3>
                </div>
                <div className="p-6">
                  {!feedbackSubmitted ? (
                    <div className="flex flex-wrap gap-2">
                      {FEEDBACK_OPTIONS.map(option => (
                        <button
                          key={option.id}
                          onClick={() => handleFeedback(option.id)}
                          className="px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-accent hover:bg-accent/5 transition-all text-gray-700"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Thank you for your feedback!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Start Over */}
              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    setState(initialScreenerState)
                    setFeedback(null)
                    setFeedbackSubmitted(false)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="text-gray-500 hover:text-gray-700 text-sm underline"
                >
                  Start over with different answers
                </button>
              </div>
            </div>
          )}

          {/* Navigation buttons - only show for input steps */}
          {state.step < 4 && (
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
                disabled={!canProceed}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  canProceed
                    ? 'bg-accent text-white hover:bg-accent/90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {state.step === 3 ? 'See My Results' : 'Continue'}
              </button>
            </div>
          )}
        </div>

        {/* Privacy note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Your information stays on your device.
          <br />
          We don&apos;t store or share any data from this screener.
        </p>
      </div>
    </div>
  )
}
