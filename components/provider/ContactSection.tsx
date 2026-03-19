import type { Provider } from '@/types/provider'
import { CallbackForm } from '@/components/CallbackForm'
import { TrackableLink } from '@/components/TrackableLink'
import { formatPhone, phoneRaw } from '@/lib/provider-utils'

interface ContactSectionProps {
  provider: Provider & { isClaimed: boolean }
}

export function ContactSection({ provider }: ContactSectionProps) {
  const contactPhone = provider.intakePhone || provider.phone

  return (
    <section id="contact" className="py-16 sm:py-20 px-6 bg-gradient-to-br from-[#FFF5F3] to-[#F0F9FF]">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs font-bold text-primary uppercase tracking-[2px] mb-2">Contact</div>
          <h2 className="text-[32px] font-black text-navy">Get in touch</h2>
          <p className="text-base text-gray-400 mt-2">We&apos;re here to help your family</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Phone CTA + contact info */}
          <div className="text-center md:text-left">
            {contactPhone && (
              <TrackableLink
                href={`tel:${phoneRaw(contactPhone)}`}
                providerId={provider.id}
                eventType="click_phone"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-[#ff6b6b] text-white px-10 py-5 rounded-2xl text-[22px] font-black shadow-lg shadow-primary/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40 transition-all"
              >
                <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                Call {formatPhone(contactPhone)}
              </TrackableLink>
            )}

            <div className="mt-6 space-y-1.5 text-base text-gray-500">
              {provider.address && <p>{provider.address}</p>}
              {provider.availableHours && <p>Hours: {provider.availableHours}</p>}
              {provider.languages && provider.languages.length > 1 && (
                <p>We speak {provider.languages.join(' and ')}</p>
              )}
            </div>

            {provider.website && (
              <div className="mt-4">
                <TrackableLink
                  href={provider.website}
                  providerId={provider.id}
                  eventType="click_website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  Visit our website →
                </TrackableLink>
              </div>
            )}
          </div>

          {/* Callback form */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg shadow-black/[0.06] border border-black/[0.04]">
            <h3 className="text-lg font-extrabold text-navy mb-1">Request a callback</h3>
            <p className="text-sm text-gray-400 mb-5">
              Tell us about your needs and {provider.name} will reach out directly.
            </p>
            <CallbackForm
              providerId={provider.id}
              providerName={provider.name}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
