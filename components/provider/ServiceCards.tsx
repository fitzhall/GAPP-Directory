import type { ServiceType } from '@/types/provider'
import { getServiceFullName, getServiceDescription, getServiceIconClass } from '@/lib/provider-utils'

interface ServiceCardsProps {
  services: ServiceType[]
}

const serviceIcons: Record<ServiceType, string> = {
  RN: '⚕',
  LPN: '⚕',
  PCS: '♡',
}

export function ServiceCards({ services }: ServiceCardsProps) {
  return (
    <section id="services" className="py-16 sm:py-20 px-6 bg-[#F8FAFB]">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-primary uppercase tracking-[2px] mb-2">What we do</div>
          <h2 className="text-[32px] font-black text-navy">Our services</h2>
          <p className="text-base text-gray-400 mt-2">Specialized home care for children with medical needs</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div
              key={service}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg hover:shadow-black/[0.06] hover:-translate-y-0.5 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-[22px] mb-4 ${getServiceIconClass(service)}`}>
                {serviceIcons[service]}
              </div>
              <h3 className="text-lg font-extrabold text-navy mb-2">{getServiceFullName(service)}</h3>
              <p className="text-[15px] text-gray-500 leading-relaxed">{getServiceDescription(service)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
