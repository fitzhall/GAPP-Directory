import { OfferCard } from '@/components/OfferCard'
import { countyOfferCopy } from '@/lib/unclaimed-offer'

// County page with no verified agency: the family would otherwise see only
// listings with no phone number. Our offer goes above them.
export function CountyOffer({ county, unclaimedCount }: { county: string; unclaimedCount: number }) {
  const c = countyOfferCopy(county, unclaimedCount)
  return <OfferCard headline={c.headline} body={c.body} trust={c.trust} />
}
