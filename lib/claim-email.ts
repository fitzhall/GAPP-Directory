// The email an agency gets right after it claims its page (/api/claim).
// Plain words, 3rd-5th grade: what the site is, what the free page does now,
// where parents can and can't see them, how to see their numbers, and what
// a paid plan adds. Replies go to help@ (set by the sender, not here).
import { config } from '@/lib/config'
import { escapeHtml } from '@/lib/lead-email'

// Canonical host for links; never the environment's base URL.
const SITE_URL = 'https://www.georgiagapp.com'

// Must match FREE_TIER_COUNTY_LIMIT in app/[county]/page.tsx and
// app/directory/page.tsx: a page that isn't verified shows only in its
// first 5 counties, A to Z.
export const FREE_COUNTY_LIMIT = 5

export type ClaimEmailInput = {
  claimerName: string
  agencyName: string
  slug: string
  email: string
  countiesServed: string[]
}

export function visibleCounties(counties: string[]): { shown: string[]; hidden: string[] } {
  const sorted = [...counties].sort((a, b) => a.localeCompare(b))
  return { shown: sorted.slice(0, FREE_COUNTY_LIMIT), hidden: sorted.slice(FREE_COUNTY_LIMIT) }
}

/** "A", "A and B", "A, B and C" */
function joinWords(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

function every3Months(price: number): string {
  return `$${price} every 3 months`
}

export function claimEmailSubject(agencyName: string): string {
  return `Your GeorgiaGAPP page is live: ${agencyName}`
}

export function claimEmailHtml(input: ClaimEmailInput): string {
  const e = escapeHtml
  const firstName = input.claimerName.trim().split(/\s+/)[0] || 'there'
  const pageUrl = `${SITE_URL}/provider/${encodeURIComponent(input.slug)}`
  const { shown, hidden } = visibleCounties(input.countiesServed)
  const total = input.countiesServed.length

  const p = (html: string) => `<p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 14px;">${html}</p>`
  const h = (text: string) => `<h2 style="font-size: 18px; color: #2C3E50; margin: 26px 0 8px;">${text}</h2>`
  const button = (href: string, text: string) =>
    `<p style="margin: 6px 0 4px;"><a href="${href}" style="display: inline-block; background: #2C3E50; color: white; padding: 12px 22px; border-radius: 6px; text-decoration: none; font-weight: bold;">${text}</a></p>`

  let countyText: string
  if (total === 0) {
    countyText = p(`Your page doesn't list any counties yet. Reply to this email and tell us which counties you serve.`)
  } else if (hidden.length === 0) {
    countyText = p(`Your page shows in all ${total} of your counties: ${e(joinWords(shown))}.`)
  } else {
    countyText =
      p(`You serve ${total} counties. A free page only shows in its first ${FREE_COUNTY_LIMIT}, A to Z. Right now parents in ${e(joinWords(shown))} can find you.`) +
      p(`Parents in ${e(joinWords(hidden))} don't see you yet.`)
  }

  const { verified, premium } = config.pricing

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2C3E50; padding: 18px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Your page is live</h1>
      </div>
      <div style="padding: 26px; background: #ffffff;">
        ${p(`Hi ${e(firstName)},`)}
        ${p(`You claimed <strong>${e(input.agencyName)}</strong> on GeorgiaGAPP.com. Your page is live now.`)}

        ${h('What is GeorgiaGAPP?')}
        ${p(`It's a website for Georgia parents. They come here to find a GAPP nurse for their child. They pick their county, see the agencies that serve it, and call.`)}

        ${h('What your free page does')}
        ${p(`Your phone number now shows on your page, so parents can call you.`)}
        ${countyText}
        ${button(pageUrl, 'See your page')}

        ${h('See who finds you')}
        ${p(`Sign in to see how many parents looked at your page and tapped to call you. Sign in with <strong>${e(input.email)}</strong>. We'll email you a link. No password needed.`)}
        ${button(`${SITE_URL}/dashboard/login`, 'Sign in')}

        ${h('Want more families to find you?')}
        ${p(`<strong>Verified, ${every3Months(verified.price)}.</strong> Show up in every county you serve, with a Verified badge. Cancel anytime.`)}
        ${p(`<strong>Premium, ${every3Months(premium.price)}.</strong> Be first on one county's page, every time a parent opens it. Only one agency gets each county.`)}
        ${button(`${SITE_URL}/premium`, 'See the plans')}

        ${h('Need to change something?')}
        ${p(`Just reply to this email. Tell us what to fix, like your phone, counties or services, and we'll update it.`)}

        ${p(`Thanks,<br>The GeorgiaGAPP team`)}
      </div>
    </div>
  `
}
