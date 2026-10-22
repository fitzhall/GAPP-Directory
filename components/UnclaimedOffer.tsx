import Link from 'next/link'
import { OfferCard } from '@/components/OfferCard'
import { unclaimedOfferCopy } from '@/lib/unclaimed-offer'

interface Props {
  agencyName: string
  county?: string
  providerId: string
  slug: string
  /** Connect line on: the big button calls the agency through our number. */
  connect?: boolean
}

// The first screen of an unclaimed provider page. The agency name above it
// is the H1 Google ranks; this block is the offer the family acts on.
export function UnclaimedOffer({ agencyName, county, providerId, slug, connect = false }: Props) {
  const c = unclaimedOfferCopy(agencyName, county, connect)
  return (
    <OfferCard
      headline={c.headline}
      body={c.body}
      trust={c.trust}
      providerId={providerId}
      agencyCall={connect ? { agencyName } : undefined}
      footer={
        <>
          {connect && <span className="block mb-2">Calls go through the GeorgiaGAPP referral line.</span>}
          Do you run {agencyName}?{' '}
          <Link href={`/claim/${slug}`} className="font-semibold text-primary-dark underline">
            Claim this listing free
          </Link>{' '}
          {connect ? 'to get your calls direct and see who called.' : 'and your phone number shows here instead.'}
        </>
      }
    />
  )
}
