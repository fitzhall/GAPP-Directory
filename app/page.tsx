import Link from 'next/link'
import { config } from '@/lib/config'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Hero - Clear, calming, one job: get them to search */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main headline - plain language, reassuring */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Find a GAPP Provider
            <span className="block text-primary">You Can Trust</span>
          </h1>

          {/* Subheadline - empathy first */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            We help families find verified home care providers for children in the GAPP program.
            No confusing lists. Just providers who are ready to help.
          </p>

          {/* Eligibility Screener CTA - Front and Center */}
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl p-6 sm:p-8 mb-8 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                  Not Sure If You Qualify?
                </h2>
                <p className="text-gray-600 text-sm">
                  Our free screener tells you if your child may qualify, what to do next, and what to say.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  href="/screener"
                  className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-accent/90 transition-colors whitespace-nowrap text-sm"
                >
                  Check Eligibility
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <p className="text-xs text-gray-500 mt-1.5 text-center">Takes 2 minutes</p>
              </div>
            </div>
          </div>

          {/* Two clear choices - big touch targets for stressed parents */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Primary: Search by County */}
            <Link
              href="/directory"
              className="group flex flex-col items-center p-6 sm:p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-900 mb-1">Search by County</span>
              <span className="text-gray-500 text-sm">I know what I&apos;m looking for</span>
            </Link>

            {/* Secondary: Help Me Choose */}
            <Link
              href="/quiz"
              className="group flex flex-col items-center p-6 sm:p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-accent hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-900 mb-1">Help Me Choose</span>
              <span className="text-gray-500 text-sm">Guide me to the right provider</span>
            </Link>
          </div>
        </div>
      </section>

      {/* What makes us different - simple, scannable */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
            What the State List Doesn&apos;t Tell You
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Benefit 1 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Counties Served</h3>
              <p className="text-sm text-gray-600">Clear coverage areas, not guesswork</p>
            </div>

            {/* Benefit 2 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Accepting Patients</h3>
              <p className="text-sm text-gray-600">Current availability, verified by us</p>
            </div>

            {/* Benefit 3 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Services Offered</h3>
              <p className="text-sm text-gray-600">RN, LPN, or Personal Care — clearly listed</p>
            </div>

            {/* Benefit 4 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
              <p className="text-sm text-gray-600">Know when to expect a callback</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple How It Works */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
            How It Works
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Search or Take Quiz</h3>
              <p className="text-sm text-gray-600">Find providers by county or let us guide you</p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">View Matched Providers</h3>
              <p className="text-sm text-gray-600">See who serves your area and is accepting patients</p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Connect Directly</h3>
              <p className="text-sm text-gray-600">Call or request a callback from providers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by County - SEO and quick access */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
            Browse by County
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Find GAPP providers in your area
          </p>

          {/* Popular Counties */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
            {[
              'Fulton', 'Gwinnett', 'Cobb', 'DeKalb', 'Clayton', 'Cherokee',
              'Forsyth', 'Henry', 'Hall', 'Richmond', 'Chatham', 'Bibb'
            ].map(county => (
              <Link
                key={county}
                href={`/${county.toLowerCase()}`}
                className="px-4 py-3 bg-gray-50 hover:bg-primary/5 hover:border-primary border border-gray-200 rounded-lg text-center text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                {county}
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/directory"
              className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
            >
              View all Georgia counties
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* For Providers CTA - subtle, not pushy */}
      <section className="py-12 sm:py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Are You a GAPP Provider?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Get found by families who need your services. Join our directory today.
          </p>
          <Link
            href="/providers"
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Get Listed
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Trust/Disclaimer footer */}
      <section className="py-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            {config.contact.disclaimer}
          </p>
        </div>
      </section>
    </div>
  )
}
