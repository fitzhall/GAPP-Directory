import Link from 'next/link'
import { TrackImpression } from '@/components/TrackImpression'
import { TrackableLink } from '@/components/TrackableLink'

export interface StripProvider {
  id: string
  name: string
  slug: string
  city: string
  phone: string
  countiesServed: string[]
  acceptingNewPatients: boolean
  isFeatured: boolean
  isVerified: boolean
}

interface FeaturedProvidersStripProps {
  providers: StripProvider[]
  /** Recorded on each phone tap so the admin scorecard can tell which page produced it. */
  sourcePage: string
  heading?: string
  intro?: string
  /** 'hero' drops the top padding so the strip sits directly under a page title. */
  tone?: 'default' | 'hero'
}

function countyLine(counties: string[]) {
  if (counties.length === 0) return 'Statewide'
  if (counties.length <= 3) return counties.join(', ')
  return `${counties.slice(0, 3).join(', ')} +${counties.length - 3} more`
}

export function FeaturedProvidersStrip({
  providers,
  sourcePage,
  heading = 'Agencies ready to take your call',
  intro = 'Featured and verified GAPP providers who have confirmed their details. Tap the number to call.',
  tone = 'default',
}: FeaturedProvidersStripProps) {
  if (providers.length === 0) return null

  return (
    <section className={`${tone === 'hero' ? 'pt-2 pb-8 sm:pb-10' : 'py-10 sm:py-12 border-b border-gray-100'} px-4 bg-white`}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{heading}</h2>
        <p className="text-gray-600 mb-6">{intro}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          {providers.map(provider => {
            const tel = provider.phone.replace(/\D/g, '')
            return (
              <TrackImpression key={provider.id} providerId={provider.id}>
                <div
                  className={`h-full bg-white rounded-xl border-2 p-4 flex flex-col gap-3 ${
                    provider.isFeatured ? 'border-warm' : 'border-gray-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {provider.isFeatured ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-warm/30 text-gray-900 text-xs font-semibold rounded-full">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                          Verified
                        </span>
                      )}
                      {provider.acceptingNewPatients && (
                        <span className="inline-flex items-center gap-1 text-green-700 text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          Accepting patients
                        </span>
                      )}
                    </div>
                    <Link href={`/provider/${provider.slug}`} className="block">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-primary leading-tight">
                        {provider.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500">
                      {provider.city}, GA · {countyLine(provider.countiesServed)}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3">
                    <TrackableLink
                      href={`tel:${tel}`}
                      providerId={provider.id}
                      eventType="click_phone"
                      metadata={{ source: sourcePage }}
                      className="inline-flex items-center justify-center gap-2 flex-1 px-4 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {provider.phone}
                    </TrackableLink>
                    <Link
                      href={`/provider/${provider.slug}`}
                      className="text-sm font-medium text-primary hover:underline whitespace-nowrap"
                    >
                      Profile
                    </Link>
                  </div>
                </div>
              </TrackImpression>
            )
          })}
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Run a GAPP agency?{' '}
          <Link href="/providers" className="text-primary hover:underline font-medium">
            Get your agency listed here
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
