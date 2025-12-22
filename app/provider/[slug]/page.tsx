import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Provider, ServiceType } from '@/types/provider'
import { CallbackForm } from '@/components/CallbackForm'

// Service type labels
const serviceLabels: Record<ServiceType, string> = {
  RN: 'Registered Nursing (RN)',
  LPN: 'Licensed Practical Nursing (LPN)',
  PCS: 'Personal Care Services (PCS)',
}

interface ProviderData extends Provider {
  isClaimed: boolean
}

async function getProvider(slug: string): Promise<ProviderData | null> {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) return null

  // Transform to camelCase
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    city: data.city,
    state: data.state,
    countiesServed: data.counties_served,
    email: data.email,
    phone: data.phone,
    intakePhone: data.intake_phone,
    website: data.website,
    address: data.address,
    servicesOffered: data.services_offered,
    acceptingNewPatients: data.accepting_new_patients,
    responseExpectation: data.response_expectation,
    availableHours: data.available_hours,
    languages: data.languages,
    bio: data.bio,
    howToStart: data.how_to_start,
    yearsInBusiness: data.years_in_business,
    tierLevel: data.tier_level,
    isActive: data.is_active,
    isClaimed: data.is_claimed ?? false,
    isVerified: data.is_verified,
    isFeatured: data.is_featured,
    backgroundCheckedStaff: data.background_checked_staff,
    fastResponse: data.fast_response,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    verifiedAt: data.verified_at,
    featuredAt: data.featured_at,
  }
}

export default async function ProviderPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const provider = await getProvider(slug)

  if (!provider) {
    notFound()
  }

  const contactPhone = provider.intakePhone || provider.phone

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/directory" className="hover:text-gray-700">Find Provider</Link>
            <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900">{provider.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Main content */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className={`p-6 sm:p-8 ${provider.isFeatured ? 'bg-gradient-to-r from-warm/5 to-purple-50' : 'bg-gray-50'}`}>
            {/* Featured badge */}
            {provider.isFeatured && (
              <div className="flex items-center gap-1.5 text-warm text-sm font-medium mb-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured Provider
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {provider.name}
            </h1>
            <p className="text-gray-600">{provider.city}, Georgia</p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {provider.isVerified && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified GAPP Provider
                </span>
              )}
              {provider.acceptingNewPatients ? (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Accepting New Patients
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Not Accepting New Patients
                </span>
              )}
              {provider.fastResponse && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Fast Response
                </span>
              )}
              {provider.backgroundCheckedStaff && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 text-teal-700 text-sm font-medium rounded-full">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Background-Checked Staff
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* About */}
            {provider.bio && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed">{provider.bio}</p>
              </section>
            )}

            {/* Services */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Services Offered</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {provider.servicesOffered.map(service => (
                  <div key={service} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-800">{serviceLabels[service]}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Counties Served */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Counties Served</h2>
              <div className="flex flex-wrap gap-2">
                {provider.countiesServed.map(county => (
                  <span key={county} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {county}
                  </span>
                ))}
              </div>
            </section>

            {/* How to Start */}
            {provider.howToStart && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">How to Get Started</h2>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-gray-700 leading-relaxed">{provider.howToStart}</p>
                </div>
              </section>
            )}

            {/* Details grid */}
            <section className="grid sm:grid-cols-2 gap-6">
              {/* Availability */}
              {(provider.responseExpectation || provider.availableHours) && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Availability</h3>
                  <div className="space-y-1">
                    {provider.responseExpectation && (
                      <p className="text-gray-700">
                        <span className="font-medium">Response:</span> {provider.responseExpectation}
                      </p>
                    )}
                    {provider.availableHours && (
                      <p className="text-gray-700">
                        <span className="font-medium">Hours:</span> {provider.availableHours}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Languages */}
              {provider.languages && provider.languages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Languages</h3>
                  <p className="text-gray-700">{provider.languages.join(', ')}</p>
                </div>
              )}

              {/* Experience */}
              {provider.yearsInBusiness && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Experience</h3>
                  <p className="text-gray-700">{provider.yearsInBusiness} years in business</p>
                </div>
              )}
            </section>
          </div>

          {/* Contact section */}
          <div className="border-t border-gray-200 p-6 sm:p-8 bg-gray-50">
            {provider.isVerified ? (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Connect With This Provider</h2>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Callback Form - for lead qualification */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Request a Callback</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Tell us about your needs and the provider will reach out to you directly.
                    </p>
                    <CallbackForm
                      providerId={provider.id}
                      providerName={provider.name}
                    />
                  </div>

                  {/* Direct Contact Info */}
                  <div className="flex flex-col">
                    <h3 className="font-medium text-gray-900 mb-2">Or Contact Directly</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Call or visit their website to learn more.
                    </p>

                    <div className="space-y-3">
                      {contactPhone && (
                        <a
                          href={`tel:${contactPhone.replace(/\D/g, '')}`}
                          className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{contactPhone}</p>
                            <p className="text-xs text-gray-500">Call now</p>
                          </div>
                        </a>
                      )}

                      {provider.website && (
                        <a
                          href={provider.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Visit Website</p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{provider.website.replace(/^https?:\/\//, '')}</p>
                          </div>
                        </a>
                      )}

                      {provider.address && (
                        <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{provider.address}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Unclaimed/Unverified profile - show claim CTA */
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  This profile hasn&apos;t been claimed yet
                </div>

                <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact Information Pending</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  This provider hasn&apos;t claimed their profile yet. Once claimed and verified,
                  you&apos;ll be able to request callbacks and see full contact details.
                </p>

                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-3">Are you the owner of this business?</p>
                  <Link
                    href={`/claim/${provider.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Claim This Profile
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to search */}
        <div className="mt-6 text-center">
          <Link
            href="/directory"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all providers
          </Link>
        </div>
      </div>
    </div>
  )
}
