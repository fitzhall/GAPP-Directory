'use client'

import { TrackableLink } from '@/components/TrackableLink'

interface ProviderNavProps {
  providerName: string
  providerId: string
  navBase: string
  navAccent: string
  logoLetter: string
  phoneRaw: string
  phoneDisplay: string
}

export function ProviderNav({
  providerName,
  providerId,
  navBase,
  navAccent,
  logoLetter,
  phoneRaw,
  phoneDisplay,
}: ProviderNavProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/[0.97] backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-[1000px] mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-warm rounded-[10px] flex items-center justify-center text-white text-lg font-black">
            {logoLetter}
          </div>
          <span className="text-base font-extrabold text-navy">
            {navBase} <span className="text-primary">{navAccent}</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="#services" className="text-sm font-semibold text-gray-500 hover:text-navy transition-colors">
            Services
          </a>
          <a href="#areas" className="text-sm font-semibold text-gray-500 hover:text-navy transition-colors">
            Areas
          </a>
          <a href="#contact" className="text-sm font-semibold text-gray-500 hover:text-navy transition-colors">
            Contact
          </a>
          <TrackableLink
            href={`tel:${phoneRaw}`}
            providerId={providerId}
            eventType="click_phone"
            className="bg-primary text-white px-6 py-2.5 rounded-[10px] text-sm font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/30 hover:-translate-y-0.5"
          >
            Call Now
          </TrackableLink>
        </div>
      </div>
    </nav>
  )
}
