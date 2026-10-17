// Copy for the offer card at the top of an unclaimed provider page. The
// visitor searched this agency by name; we say plainly that we cannot reach
// them and offer to match the family ourselves.

export type UnclaimedOfferCopy = { headline: string; body: string; trust: string[]; ownerLine: string }

export function unclaimedOfferCopy(agencyName: string, county: string | undefined): UnclaimedOfferCopy {
  const where = county ? `${county} County` : 'your county'
  return {
    headline: `Trying to reach ${agencyName}?`,
    body: `They have not claimed their listing, so we cannot connect you to them. Call or text us and a real person will match you with a GAPP agency in ${where} that has nurses available. Free for families.`,
    trust: ['Free for families', 'We know which agencies have openings', 'Usually the same day'],
    ownerLine: `Do you run ${agencyName}? Claim this listing free and your phone number shows here instead.`,
  }
}
