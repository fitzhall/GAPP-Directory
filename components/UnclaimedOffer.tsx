import Link from 'next/link'
import { config } from '@/lib/config'
import { TrackableLink } from '@/components/TrackableLink'
import { unclaimedOfferCopy } from '@/lib/unclaimed-offer'

interface Props {
  agencyName: string
  county?: string
  providerId: string
  slug: string
}

// The first screen of an unclaimed provider page. The agency name above it
// is the H1 Google ranks; this block is the offer the family acts on.
export function UnclaimedOffer({ agencyName, county, providerId, slug }: Props) {
  const c = unclaimedOfferCopy(agencyName, county)
  const btn = 'flex items-center justify-center gap-2 px-6 py-4 text-lg font-extrabold rounded-xl transition-colors'
  return (
    <div className="bg-warm-light border-2 border-warm rounded-2xl p-5 sm:p-7">
      <p className="text-2xl sm:text-3xl font-extrabold text-navy leading-tight">{c.headline}</p>
      <p className="text-lg text-navy mt-3 leading-relaxed">{c.body}</p>

      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <TrackableLink
          href={`tel:${config.contact.phoneRaw}`}
          providerId={providerId}
          eventType="click_helpline"
          className={`${btn} bg-primary text-white hover:bg-primary-dark shadow-md flex-1`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call {config.contact.phone}
        </TrackableLink>
        <TrackableLink
          href={`sms:${config.contact.phoneRaw}`}
          providerId={providerId}
          eventType="click_helpline"
          className={`${btn} bg-white border-2 border-primary text-primary-dark hover:bg-primary/10`}
        >
          Text us
        </TrackableLink>
      </div>

      <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2 mt-5 text-base font-semibold text-navy">
        {c.trust.map(t => (
          <li key={t} className="flex items-center gap-2">
            <span className="text-green-600 font-extrabold" aria-hidden>✓</span>
            {t}
          </li>
        ))}
      </ul>

      <p className="text-sm text-gray-600 mt-5">
        {c.ownerLine.replace(/Claim this listing free.*$/, '')}
        <Link href={`/claim/${slug}`} className="font-semibold text-primary-dark underline">
          Claim this listing free
        </Link>
        {' '}and your phone number shows here instead.
      </p>
    </div>
  )
}
