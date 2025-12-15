import Link from 'next/link'
import type { ProviderCardData, ServiceType } from '@/types/provider'

interface ProviderCardProps {
  provider: ProviderCardData
}

// Service type labels
const serviceLabels: Record<ServiceType, string> = {
  RN: 'RN Nursing',
  LPN: 'LPN Nursing',
  PCS: 'Personal Care',
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const {
    name,
    slug,
    city,
    countiesServed,
    servicesOffered,
    acceptingNewPatients,
    isVerified,
    isFeatured,
    fastResponse,
    backgroundCheckedStaff,
    responseExpectation,
  } = provider

  // Unverified providers show limited info and can't be clicked through
  if (!isVerified) {
    return (
      <div className="bg-white rounded-xl border-2 border-gray-200 p-5 opacity-75">
        {/* Pending verification badge */}
        <div className="flex items-center gap-1.5 text-amber-600 text-sm font-medium mb-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pending Verification
        </div>

        {/* Provider name and city */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-0.5">{name}</h3>
          <p className="text-sm text-gray-500">{city}, Georgia</p>
        </div>

        {/* Services */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1.5">Services</div>
          <div className="flex flex-wrap gap-1.5">
            {servicesOffered.map(service => (
              <span
                key={service}
                className="px-2 py-0.5 bg-gray-100 text-gray-700 text-sm rounded"
              >
                {serviceLabels[service]}
              </span>
            ))}
          </div>
        </div>

        {/* Counties */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1.5">Counties Served</div>
          <p className="text-sm text-gray-700">
            {countiesServed.length <= 3
              ? countiesServed.join(', ')
              : `${countiesServed.slice(0, 3).join(', ')} +${countiesServed.length - 3} more`
            }
          </p>
        </div>

        {/* Pending message */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-500 italic">
            We&apos;re verifying this provider&apos;s information. Check back soon.
          </p>
        </div>
      </div>
    )
  }

  // Verified providers - full card with link to profile
  return (
    <Link
      href={`/provider/${slug}`}
      className={`block bg-white rounded-xl border-2 p-5 transition-all hover:shadow-md ${
        isFeatured
          ? 'border-warm/30 hover:border-warm'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Featured badge */}
      {isFeatured && (
        <div className="flex items-center gap-1.5 text-warm text-sm font-medium mb-3">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Featured Provider
        </div>
      )}

      {/* Provider name and city */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-0.5">{name}</h3>
        <p className="text-sm text-gray-500">{city}, Georgia</p>
      </div>

      {/* Trust badges row */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified
        </span>
        {acceptingNewPatients && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Accepting Patients
          </span>
        )}
        {fastResponse && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Fast Response
          </span>
        )}
        {backgroundCheckedStaff && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Background Checked
          </span>
        )}
      </div>

      {/* Services */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1.5">Services</div>
        <div className="flex flex-wrap gap-1.5">
          {servicesOffered.map(service => (
            <span
              key={service}
              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-sm rounded"
            >
              {serviceLabels[service]}
            </span>
          ))}
        </div>
      </div>

      {/* Counties */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1.5">Counties Served</div>
        <p className="text-sm text-gray-700">
          {countiesServed.length <= 3
            ? countiesServed.join(', ')
            : `${countiesServed.slice(0, 3).join(', ')} +${countiesServed.length - 3} more`
          }
        </p>
      </div>

      {/* Response expectation */}
      {responseExpectation && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Response:</span> {responseExpectation}
          </p>
        </div>
      )}

      {/* CTA hint */}
      <div className="mt-4 flex items-center text-primary text-sm font-medium">
        Request Callback
        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}
