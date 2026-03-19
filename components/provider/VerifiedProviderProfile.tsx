import type { Provider } from '@/types/provider'
import { getLogoLetter, getNavName, formatPhone, phoneRaw } from '@/lib/provider-utils'
import { ProviderNav } from './ProviderNav'
import { HeroSection } from './HeroSection'
import { AboutSection } from './AboutSection'
import { ServiceCards } from './ServiceCards'
import { CountiesSection } from '@/components/CountiesSection'
import { StepCards } from './StepCards'
import { GappExplainer } from './GappExplainer'
import { ContactSection } from './ContactSection'
import { ProfileFooter } from './ProfileFooter'

interface VerifiedProviderProfileProps {
  provider: Provider & { isClaimed: boolean }
}

export function VerifiedProviderProfile({ provider }: VerifiedProviderProfileProps) {
  const contactPhone = provider.intakePhone || provider.phone
  const logoLetter = getLogoLetter(provider.name)
  const { base, accent } = getNavName(provider.name)

  return (
    <div className="min-h-screen bg-white">
      <ProviderNav
        providerName={provider.name}
        providerId={provider.id}
        navBase={base}
        navAccent={accent}
        logoLetter={logoLetter}
        phoneRaw={contactPhone ? phoneRaw(contactPhone) : ''}
        phoneDisplay={contactPhone ? formatPhone(contactPhone) : ''}
      />

      <HeroSection provider={provider} />

      <AboutSection provider={provider} />

      <ServiceCards services={provider.servicesOffered} />

      {/* Counties — reuse existing component, wrapped in editorial styling */}
      <section id="areas" className="py-16 sm:py-20 px-6 bg-white">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-primary uppercase tracking-[2px] mb-2">Coverage</div>
            <h2 className="text-[32px] font-black text-navy">Areas we serve</h2>
            <p className="text-base text-gray-400 mt-2">{provider.city}, Georgia and surrounding areas</p>
          </div>
          <div className="flex justify-center">
            <CountiesSection
              counties={provider.countiesServed}
              isVerified={provider.isVerified}
              providerSlug={provider.slug}
            />
          </div>
        </div>
      </section>

      <StepCards howToStart={provider.howToStart} />

      <GappExplainer providerName={provider.name} />

      <ContactSection provider={provider} />

      <ProfileFooter providerName={provider.name} city={provider.city} />
    </div>
  )
}
