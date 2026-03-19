import type { Provider } from '@/types/provider'
import { getAboutHeading, getHighlights } from '@/lib/provider-utils'

interface AboutSectionProps {
  provider: Provider & { isClaimed: boolean }
}

export function AboutSection({ provider }: AboutSectionProps) {
  const heading = getAboutHeading(provider)
  const highlights = getHighlights(provider)
  const bio = provider.bio || `Serving ${provider.countiesServed.slice(0, 4).join(', ')} ${provider.countiesServed.length > 4 ? `and ${provider.countiesServed.length - 4} more counties` : 'counties'} with ${provider.servicesOffered.join(', ')} services in ${provider.city}, Georgia. Our team is trained to work with children who have complex medical needs, and we build real relationships with the families we serve.`

  return (
    <section className="py-16 sm:py-20 px-6 bg-white">
      <div className="max-w-[1000px] mx-auto grid md:grid-cols-2 gap-12 items-start">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-[2px] mb-2">About us</div>
          <h2 className="text-[32px] font-black text-navy leading-tight mb-5">{heading}</h2>
          <p className="text-[17px] text-gray-600 leading-relaxed">{bio}</p>
        </div>

        <div className="bg-gradient-to-br from-[#FFF5F3] to-[#FFF8F0] rounded-2xl p-8">
          <h3 className="text-lg font-extrabold text-navy mb-4">Why families choose us</h3>
          <ul className="space-y-0">
            {highlights.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-2.5 py-2.5 text-[15px] text-gray-600 border-b border-black/[0.04] last:border-b-0"
              >
                <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-[11px] flex-shrink-0">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
