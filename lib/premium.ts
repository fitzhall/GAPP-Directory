// Premium seats: one featured agency per county. An agency holds its seat
// only while it is featured, verified and names a premium_county. In that
// county it ranks first and wears the Featured badge. Everywhere else it ranks
// as a verified agency. On statewide pages every seat holder shows at the top,
// labeled with its county, in an order that rotates once a day.

export type PremiumFields = {
  isFeatured?: boolean | null
  isVerified?: boolean | null
  premiumCounty?: string | null
}

/** "DeKalb", "Dekalb" and "dekalb " are the same county. */
export function countyKey(county: string | null | undefined): string {
  return (county || '').trim().toLowerCase().replace(/\s+county$/, '')
}

/** True when the agency holds a premium seat anywhere. */
export function holdsPremiumSeat(p: PremiumFields): boolean {
  return !!p.isFeatured && !!p.isVerified && countyKey(p.premiumCounty) !== ''
}

/** True when the agency holds the premium seat for this county. */
export function isPremiumIn(p: PremiumFields, county: string | null | undefined): boolean {
  const key = countyKey(county)
  return key !== '' && holdsPremiumSeat(p) && countyKey(p.premiumCounty) === key
}

/** Badge text: "Featured in Gwinnett County". */
export function premiumLabel(county: string): string {
  const name = county.trim().replace(/\s+county$/i, '')
  return `Featured in ${name} County`
}

/** Days since the epoch in UTC, so every server render on one day agrees. */
export function dayNumber(date: Date = new Date()): number {
  return Math.floor(date.getTime() / 86_400_000)
}

/** Same list, started at a different point each day so nobody is always first. */
export function rotateDaily<T>(items: T[], date: Date = new Date()): T[] {
  if (items.length < 2) return items
  const start = dayNumber(date) % items.length
  return [...items.slice(start), ...items.slice(0, start)]
}

type Rankable = PremiumFields & { name: string; isClaimed?: boolean | null }

/**
 * Rank for a county page or a county-filtered directory: the seat holder for
 * this county, then verified agencies, then claimed, then the rest. Ties by
 * name. A premium agency from another county ranks as verified here.
 */
export function rankForCounty<T extends Rankable>(providers: T[], county: string): T[] {
  const score = (p: T) => (isPremiumIn(p, county) ? 4 : p.isVerified ? 3 : p.isClaimed ? 2 : 1)
  return [...providers].sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name))
}

/**
 * Rank for a statewide list (directory with no county filter, guide pages):
 * every seat holder first, rotated daily, then verified agencies, then the
 * rest. `premiumFirst` is capped so a long list of seats stays readable.
 */
export function rankStatewide<T extends Rankable>(providers: T[], date: Date = new Date(), premiumCap = Infinity): { premium: T[]; rest: T[] } {
  const seats = providers.filter(holdsPremiumSeat).sort((a, b) => a.name.localeCompare(b.name))
  const rotated = rotateDaily(seats, date)
  const premium = rotated.slice(0, premiumCap)
  const overflow = new Set(rotated.slice(premiumCap).map(p => p.name))
  const score = (p: T) => (p.isVerified ? 3 : p.isClaimed ? 2 : 1)
  const rest = providers
    .filter(p => !holdsPremiumSeat(p) || overflow.has(p.name))
    .sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name))
  return { premium, rest }
}
