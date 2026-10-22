// Copy for the offer card at the top of an unclaimed provider page. The
// visitor searched this agency by name; we say plainly that we cannot reach
// them and offer to match the family ourselves.

export type UnclaimedOfferCopy = { headline: string; body: string; trust: string[]; ownerLine: string }

export function unclaimedOfferCopy(agencyName: string, county: string | undefined, connect = false): UnclaimedOfferCopy {
  const where = county ? `${county} County` : 'your county'
  if (connect) {
    // Connect line on: we can put the call through ourselves.
    return {
      headline: `Trying to reach ${agencyName}?`,
      body: `Tap Call and we connect you to ${agencyName} through our free line. If they do not pick up, you reach us, and a real person will find you a GAPP agency in ${where} with nurses available.`,
      trust: ['Free for families', 'We know which agencies have openings', 'Usually the same day'],
      ownerLine: `Do you run ${agencyName}? Claim this listing free to get your calls direct and see who called.`,
    }
  }
  return {
    headline: `Trying to reach ${agencyName}?`,
    body: `They have not claimed their listing, so we cannot connect you to them. Call or text us and a real person will match you with a GAPP agency in ${where} that has nurses available. Free for families.`,
    trust: ['Free for families', 'We know which agencies have openings', 'Usually the same day'],
    ownerLine: `Do you run ${agencyName}? Claim this listing free and your phone number shows here instead.`,
  }
}

// Copy for the offer card on a county page where no verified agency is listed.
export function countyOfferCopy(county: string, unclaimedCount: number): UnclaimedOfferCopy {
  const where = `${county} County`
  let body: string
  if (unclaimedCount === 0) {
    body = `No agency has listed ${where} yet. Call or text us and a real person will find you a GAPP agency that will serve ${where}. Free for families.`
  } else if (unclaimedCount === 1) {
    body = `The 1 agency listed here has not claimed its listing yet, so it shows no phone number. Call or text us and a real person will match you with a GAPP agency that serves ${where} and has nurses available. Free for families.`
  } else {
    body = `The ${unclaimedCount} agencies listed here have not claimed their listings yet, so none shows a phone number. Call or text us and a real person will match you with a GAPP agency that serves ${where} and has nurses available. Free for families.`
  }
  return {
    headline: `Looking for GAPP care in ${where}?`,
    body,
    trust: ['Free for families', 'We know which agencies have openings', 'Usually the same day'],
    ownerLine: '',
  }
}
