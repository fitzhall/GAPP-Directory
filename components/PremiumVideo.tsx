import { YouTubeVideo } from '@/components/YouTubeVideo'

// The 60-second Premium explainer for agency owners. Provider-facing pages
// only (/premium, /providers): families are most of the site's traffic and
// this is a sales pitch to agencies, so it never goes on family pages.
export function PremiumVideo() {
  return (
    <YouTubeVideo
      id="mZ26Wrtdphw"
      title="How GAPP agencies in Georgia get more cases"
      poster="/videos/premium-60s-poster.jpg"
      caption="One minute: how families find GeorgiaGAPP.com, and what Premium does for your agency."
    />
  )
}
