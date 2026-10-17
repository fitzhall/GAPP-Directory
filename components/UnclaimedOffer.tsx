import Link from 'next/link'
import { OfferCard } from '@/components/OfferCard'
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
  return (
    <OfferCard
      headline={c.headline}
      body={c.body}
      trust={c.trust}
      providerId={providerId}
      footer={
        <>
          Do you run {agencyName}?{' '}
          <Link href={`/claim/${slug}`} className="font-semibold text-primary-dark underline">
            Claim this listing free
          </Link>{' '}
          and your phone number shows here instead.
        </>
      }
    />
  )
}
