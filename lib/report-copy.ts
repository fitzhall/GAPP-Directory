// Plain-language sentences for /report/[slug]. A home care owner should get
// the point from the first screen with no marketing vocabulary.

export type StoryProvider = { isClaimed: boolean; isVerified: boolean; isFeatured: boolean; hasWebsite: boolean }

export type StoryInput = {
  provider: StoryProvider
  you: { views: number; impressions: number; phoneClicks: number; helplineClicks: number; leads: number }
  peers: { count: number; views: number; phoneClicks: number; scope: 'counties' | 'sitewide' }
}

export type Story = { bigNumber: number; headline: string; problem: string; tone: 'good' | 'bad' }

function families(n: number): string {
  return n === 1 ? '1 family' : `${n.toLocaleString()} families`
}

export function reportStory(d: StoryInput): Story {
  const views = d.you.views
  const headline =
    views === 0
      ? 'No families opened your listing in the last 90 days.'
      : `${families(views)} looked at your listing in the last 90 days.`

  if (!d.provider.isClaimed) {
    return { bigNumber: views, headline, problem: '0 of them could call you. Your phone number is not shown.', tone: 'bad' }
  }
  if (d.you.phoneClicks === 0) {
    return { bigNumber: views, headline, problem: '0 tapped to call you. Families who do not call leave without a trace.', tone: 'bad' }
  }
  return { bigNumber: views, headline, problem: `${d.you.phoneClicks.toLocaleString()} of them tapped to call you.`, tone: 'good' }
}

export function compareSentence(yourViews: number, peerViews: number, scope: 'counties' | 'sitewide'): string {
  const where = scope === 'counties' ? 'near you' : 'across Georgia'
  if (peerViews <= 0) {
    return `Verified agencies ${where} show their number, so families can call them with one tap.`
  }
  if (yourViews > peerViews) {
    return `You get more views than a typical verified agency ${where}. Families just need a way to call you.`
  }
  const ratio = peerViews / Math.max(yourViews, 1)
  if (yourViews > 0 && ratio < 1.2) {
    return `You get about as many views as a verified agency ${where}, but families can call them with one tap.`
  }
  return `Verified agencies ${where} get about ${Math.round(ratio)} times more views, and families can call them with one tap.`
}

export function missingAndGains(p: StoryProvider): { missing: string[]; gains: string[] } {
  const missing: string[] = []
  const gains: string[] = []
  if (!p.isClaimed) {
    missing.push('Your phone number is hidden. Families cannot call you.')
    gains.push('Your phone number, one tap to call')
  }
  if (!p.isVerified) {
    missing.push('No callback form. Families who do not call leave without a trace.')
    gains.push('A callback form that sends you the family’s name and number')
  }
  if (!p.isVerified || !p.hasWebsite) {
    missing.push('No link to your website.')
    gains.push('A link to your website')
  }
  if (!p.isFeatured) {
    missing.push('Other agencies show up above you in your counties.')
    gains.push('The top spot in your county results')
  }
  return { missing, gains }
}

export type ReachStep = { value: number; tone: 'good' | 'bad'; label: string; meaning: string }

// Step 2 of the story. An unclaimed listing has no number on the page, so
// "tried to reach you" would make no sense; say plainly that nobody could.
export function reachStep(d: StoryInput): ReachStep {
  const viaUs = d.you.helplineClicks + d.you.leads
  if (!d.provider.isClaimed) {
    const tail =
      viaUs > 0
        ? `${viaUs.toLocaleString()} of these families texted our helpline or asked us for a match instead.`
        : 'Every one of these families had to go find another agency.'
    return { value: 0, tone: 'bad', label: 'Could call you', meaning: `There was no phone number on your page. ${tail}` }
  }
  const value = d.you.phoneClicks + viaUs
  return {
    value,
    tone: value > 0 ? 'good' : 'bad',
    label: 'Tried to reach you',
    meaning: 'They tapped your number, texted our helpline from your page, or asked us for a match.',
  }
}
