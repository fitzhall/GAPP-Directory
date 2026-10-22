import type { ReactNode } from 'react'
import { config } from '@/lib/config'
import { TrackableLink } from '@/components/TrackableLink'
import { ConnectCallButton } from '@/components/ConnectCallButton'

interface Props {
  headline: string
  body: string
  trust: string[]
  providerId?: string
  footer?: ReactNode
  /** When set, the big button calls this agency through the connect line and our helpline becomes the second button. */
  agencyCall?: { agencyName: string }
}

// The site's own offer: big call and text buttons, three trust lines. With a
// providerId the taps are logged against that listing as click_helpline.
export function OfferCard({ headline, body, trust, providerId, footer, agencyCall }: Props) {
  const btn = 'flex items-center justify-center gap-2 px-6 py-4 text-lg font-extrabold rounded-xl transition-colors'
  const callClass = `${btn} bg-primary text-white hover:bg-primary-dark shadow-md flex-1`
  const textClass = `${btn} bg-white border-2 border-primary text-primary-dark hover:bg-primary/10`
  const tel = `tel:${config.contact.phoneRaw}`
  const sms = `sms:${config.contact.phoneRaw}`
  const phoneIcon = (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
  return (
    <div className="bg-warm-light border-2 border-warm rounded-2xl p-5 sm:p-7">
      <p className="text-2xl sm:text-3xl font-extrabold text-navy leading-tight">{headline}</p>
      <p className="text-lg text-navy mt-3 leading-relaxed">{body}</p>
      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        {agencyCall && providerId ? (
          <>
            <ConnectCallButton providerId={providerId} fallbackTel={null} className={callClass}>
              {phoneIcon}Call {agencyCall.agencyName}
            </ConnectCallButton>
            <TrackableLink href={tel} providerId={providerId} eventType="click_helpline" className={textClass}>
              Call us instead
            </TrackableLink>
          </>
        ) : providerId ? (
          <>
            <TrackableLink href={tel} providerId={providerId} eventType="click_helpline" className={callClass}>
              {phoneIcon}Call {config.contact.phone}
            </TrackableLink>
            <TrackableLink href={sms} providerId={providerId} eventType="click_helpline" className={textClass}>
              Text us
            </TrackableLink>
          </>
        ) : (
          <>
            <a href={tel} className={callClass}>{phoneIcon}Call {config.contact.phone}</a>
            <a href={sms} className={textClass}>Text us</a>
          </>
        )}
      </div>
      <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2 mt-5 text-base font-semibold text-navy">
        {trust.map(t => (
          <li key={t} className="flex items-center gap-2">
            <span className="text-green-600 font-extrabold" aria-hidden>✓</span>
            {t}
          </li>
        ))}
      </ul>
      {footer && <div className="text-sm text-gray-600 mt-5">{footer}</div>}
    </div>
  )
}
