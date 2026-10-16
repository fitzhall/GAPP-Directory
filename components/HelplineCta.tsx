import { config } from '@/lib/config'
import { TrackableLink } from '@/components/TrackableLink'
import { MatchForm } from '@/components/MatchForm'

interface HelplineCtaProps {
  variant: 'provider' | 'banner'
  sourcePage: string
  county?: string
  providerId?: string
}

// "Talk to a human" block: our number first (call or text), the short match
// form second. On an unclaimed provider page the taps are logged against
// that provider as click_helpline so its report can say how many families
// tried to reach it through us.
export function HelplineCta({ variant, sourcePage, county, providerId }: HelplineCtaProps) {
  const where = county ? `${county} County` : 'your county'
  const tel = `tel:${config.contact.phoneRaw}`
  const sms = `sms:${config.contact.phoneRaw}`
  const btn = 'flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg transition-colors'
  const callClass = `${btn} bg-primary text-white hover:bg-primary-dark`
  const textClass = `${btn} border-2 border-primary text-primary hover:bg-primary/10`

  const buttons = providerId ? (
    <>
      <TrackableLink href={tel} providerId={providerId} eventType="click_helpline" className={callClass}>
        Call {config.contact.phone}
      </TrackableLink>
      <TrackableLink href={sms} providerId={providerId} eventType="click_helpline" className={textClass}>
        Text us
      </TrackableLink>
    </>
  ) : (
    <>
      <a href={tel} className={callClass}>Call {config.contact.phone}</a>
      <a href={sms} className={textClass}>Text us</a>
    </>
  )

  return (
    <div className={variant === 'banner' ? 'bg-warm/20 border border-warm rounded-2xl p-6 sm:p-8' : 'py-2'}>
      <div className="text-center max-w-xl mx-auto">
        {variant === 'provider' ? (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-2">We can still help you</h2>
            <p className="text-gray-700 mb-5">
              This agency has not claimed its listing yet, so we can&apos;t connect you to them directly.
              Call or text us and we&apos;ll match you with a GAPP provider in {where} today. A real person answers.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Not sure which provider to call?</h2>
            <p className="text-gray-700 mb-5">
              Call or text us and we&apos;ll match you with a GAPP provider in {where}. A real person answers.
            </p>
          </>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">{buttons}</div>
        <p className="text-sm text-gray-500 mb-4">Or tell us what you need and we&apos;ll reach out:</p>
      </div>
      <div className="max-w-xl mx-auto">
        <MatchForm county={county} sourcePage={sourcePage} />
      </div>
    </div>
  )
}
