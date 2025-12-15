import { config } from '@/lib/config'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Modern Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-red-100/50 text-red-700 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
            Trusted by 500+ Fire Safety Professionals
          </div>

          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Fire & Life Safety
            </span>
            <br />
            <span className="text-gray-900">Inspector Directory</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Connect with certified fire safety inspectors nationwide.
            Find the right professional for your inspection needs.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/directory"
              className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-10 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="flex items-center">
                Search Inspectors
                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
            <Link
              href="/directory/join"
              className="bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-900 font-semibold py-4 px-10 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Join as Inspector
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Easy Search</h3>
            <p className="text-gray-600">Find certified inspectors by location, specialization, and credentials</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Verified Professionals</h3>
            <p className="text-gray-600">All inspectors are verified and certified in their field</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Tier-Based System</h3>
            <p className="text-gray-600">4 membership tiers to match your needs and budget</p>
          </div>
        </div>

        {/* Modern Tier Cards */}
        <h2 className="text-3xl font-bold text-center mb-12">Membership Tiers</h2>
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          {config.tiers.map((tier) => (
            <div
              key={tier.level}
              className={cn(
                "relative bg-white rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1",
                tier.color === 'red'
                  ? "border-2 border-red-200 shadow-xl hover:shadow-2xl"
                  : "border border-gray-200 shadow-lg hover:shadow-xl"
              )}
            >
              {tier.color === 'red' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className={cn(
                "text-sm font-bold uppercase mb-4",
                tier.color === 'red' && "text-red-600",
                tier.color === 'purple' && "text-purple-600",
                tier.color === 'blue' && "text-blue-600",
                tier.color === 'gray' && "text-gray-600"
              )}>
                {tier.name}
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {tier.price === 0 ? 'Free' : `$${tier.price}`}
                </span>
                {tier.price > 0 && <span className="text-gray-500">/year</span>}
              </div>

              <Link
                href="/directory/join"
                className={cn(
                  "inline-flex items-center justify-center w-full py-3 px-4 rounded-xl font-medium transition-all duration-200",
                  tier.color === 'red'
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                Get Started
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready to grow your inspection business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our network of certified fire safety professionals
          </p>
          <Link
            href="/directory/join"
            className="inline-block bg-white text-red-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Get Listed Today
          </Link>
        </div>
      </div>
    </main>
  )
}