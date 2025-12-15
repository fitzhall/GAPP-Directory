'use client'

import { useState } from 'react'
import { config } from '@/lib/config'

export default function ForProvidersPage() {
  const [formData, setFormData] = useState({
    agencyName: '',
    contactName: '',
    email: '',
    phone: '',
    county: '',
    services: [] as string[],
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // For now, just show success - in production this would submit to Supabase or email
    console.log('Provider inquiry:', formData)
    setSubmitted(true)
  }

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Get Found by Families
            <span className="block text-primary-light">Who Need Your Services</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Join the only GAPP provider directory that families actually use.
            Be the obvious choice when they search.
          </p>
          <a
            href="#contact-form"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Listed
          </a>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              The State List Isn&apos;t Working
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Families struggle to find quality providers. You struggle to stand out.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <h3 className="font-semibold text-gray-900 mb-3">For Families</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Outdated provider information
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  No way to know who&apos;s accepting patients
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Endless calls to disconnected numbers
                </li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <h3 className="font-semibold text-gray-900 mb-3">For Providers</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  You look the same as everyone else
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  No way to highlight your strengths
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Families can&apos;t tell you&apos;re ready to serve
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              A Directory That Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We verify every listing and answer what families actually need to know.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Counties Served', desc: 'Clearly shown, not guessed' },
              { title: 'Accepting Patients', desc: 'Current availability, verified' },
              { title: 'Services Offered', desc: 'RN, LPN, PCS — listed clearly' },
              { title: 'Response Time', desc: 'Families know what to expect' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 text-center">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-12 sm:py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Get Your Agency Listed
            </h2>
            <p className="text-lg text-gray-600">
              Fill out the form below and we&apos;ll reach out to verify your information and get you listed.
            </p>
          </div>

          {submitted ? (
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">
                We&apos;ve received your information and will be in touch soon to verify your listing.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agency Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.agencyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, agencyName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your agency name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="email@agency.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="(555) 555-5555"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary County *
                </label>
                <input
                  type="text"
                  required
                  value={formData.county}
                  onChange={(e) => setFormData(prev => ({ ...prev, county: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Fulton, Cobb, DeKalb"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services Offered *
                </label>
                <div className="flex flex-wrap gap-3">
                  {['RN (Skilled Nursing)', 'LPN (Licensed Practical Nurse)', 'PCS (Personal Care Services)'].map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => handleServiceToggle(service)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                        formData.services.includes(service)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anything else we should know?
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Additional counties served, specialties, etc."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
              >
                Submit for Listing
              </button>

              <p className="text-sm text-gray-500 text-center">
                We&apos;ll call to verify your information before adding you to the directory.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Questions?</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How do you verify listings?',
                a: 'We call every provider to confirm counties served, services offered, and current patient availability. We do this regularly to keep information current.',
              },
              {
                q: 'Is there a cost to be listed?',
                a: 'Contact us using the form above and we\'ll discuss your options. We have different listing tiers to fit your needs.',
              },
              {
                q: 'How long does it take to get listed?',
                a: 'Once we verify your information, your listing goes live within 24-48 hours. The verification call usually happens within a few business days of your submission.',
              },
              {
                q: 'What if I\'m not accepting patients right now?',
                a: 'No problem. We\'ll mark your listing as "Not Accepting" until you\'re ready. You can update your status anytime.',
              },
            ].map((faq, i) => (
              <details key={i} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden group">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 flex items-center justify-between hover:bg-gray-100">
                  {faq.q}
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-gray-700">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to get listed?</h2>
          <p className="text-gray-600 mb-4">
            Email us at <a href="mailto:help@georgiaGAPP.com" className="text-primary hover:underline">help@georgiaGAPP.com</a>
          </p>
          <p className="text-sm text-gray-500">
            {config.contact.disclaimer}
          </p>
        </div>
      </section>
    </div>
  )
}
