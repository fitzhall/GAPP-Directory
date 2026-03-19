import type { Provider } from '@/types/provider'
import { TrackableLink } from '@/components/TrackableLink'
import {
  getTagline,
  getHeroDescription,
  getServicePillLabel,
  formatPhone,
  phoneRaw,
} from '@/lib/provider-utils'

interface HeroSectionProps {
  provider: Provider & { isClaimed: boolean }
}

export function HeroSection({ provider }: HeroSectionProps) {
  const contactPhone = provider.intakePhone || provider.phone
  const tagline = getTagline(provider.servicesOffered)
  const heroDesc = getHeroDescription(provider)
  const countyCount = provider.countiesServed.length

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF5F3] via-[#F0F9FF] to-[#F8FAFB] py-16 sm:py-20 px-6">
      {/* Decorative radials */}
      <div className="absolute -top-1/2 -right-1/5 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,138,128,0.08)_0%,transparent_70%)] rounded-full pointer-events-none" />
      <div className="absolute -bottom-1/3 -left-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(135,206,235,0.06)_0%,transparent_70%)] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-[1000px] mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left column */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {provider.acceptingNewPatients && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-green-50 text-green-600">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Accepting new patients
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-primary/10 text-primary">
              GAPP Approved
            </span>
            {provider.isFeatured && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-warm/20 text-warm-dark">
                ★ Featured
              </span>
            )}
          </div>

          <h1 className="text-4xl sm:text-[44px] font-black text-navy leading-[1.1] tracking-tight mb-4">
            {tagline}
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed mb-7">
            {heroDesc}
          </p>

          <div className="flex flex-wrap gap-3">
            {contactPhone && (
              <TrackableLink
                href={`tel:${phoneRaw(contactPhone)}`}
                providerId={provider.id}
                eventType="click_phone"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-[#ff6b6b] text-white px-8 py-3.5 rounded-xl text-base font-extrabold shadow-lg shadow-primary/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40 transition-all"
              >
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                Call {formatPhone(contactPhone)}
              </TrackableLink>
            )}
            <a
              href="#services"
              className="inline-flex items-center gap-2 bg-white text-navy px-8 py-3.5 rounded-xl text-base font-bold border-2 border-gray-200 hover:border-primary hover:text-primary transition-all"
            >
              View our services
            </a>
          </div>
        </div>

        {/* Right column — At a glance card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg shadow-black/[0.06] border border-black/[0.04]">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
            At a glance
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {provider.servicesOffered.map(service => (
              <span
                key={service}
                className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-[10px] text-[13px] font-bold text-navy"
              >
                {getServicePillLabel(service)}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-primary/5">
              <div className="text-[28px] font-black text-primary">
                {provider.yearsInBusiness ? `${provider.yearsInBusiness}+` : provider.servicesOffered.length}
              </div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wide mt-0.5">
                {provider.yearsInBusiness ? 'Years' : 'Services'}
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-accent/5">
              <div className="text-[28px] font-black text-accent">
                {countyCount}
              </div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wide mt-0.5">
                Counties
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
