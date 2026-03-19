import type { Provider, ServiceType } from '@/types/provider'

/** First letter of provider name, uppercase */
export function getLogoLetter(name: string): string {
  return name.charAt(0).toUpperCase()
}

/** Provider name with last meaningful word wrapped in accent span.
 *  Strips suffixes like LLC, Inc, Corp, Agency, Services, Group */
export function getNavName(name: string): { base: string; accent: string } {
  const suffixes = ['llc', 'inc', 'corp', 'corporation', 'agency', 'services', 'group', 'llp', 'pllc']
  const words = name.split(/\s+/)
  let accentIndex = words.length - 1
  while (accentIndex > 0 && suffixes.includes(words[accentIndex].toLowerCase().replace(/[.,]/g, ''))) {
    accentIndex--
  }
  const base = words.slice(0, accentIndex).join(' ')
  const accent = words[accentIndex]
  return { base, accent }
}

/** Tagline based on which services are offered */
export function getTagline(services: ServiceType[]): string {
  const has = (s: ServiceType) => services.includes(s)
  if (has('RN') && has('LPN') && has('PCS')) return 'Home nursing and personal care for your child'
  if (has('RN') && has('LPN')) return 'Professional nursing care in your home'
  if ((has('RN') || has('LPN')) && has('PCS')) return 'Home nursing and personal care for your child'
  if (has('RN')) return 'Skilled home nursing for your child'
  if (has('LPN')) return 'Licensed nursing care in your home'
  if (has('PCS')) return 'Personal care support for your child'
  return 'Home care for your child'
}

/** Hero subtitle description */
export function getHeroDescription(provider: Provider): string {
  const serviceText = provider.servicesOffered.length > 1
    ? 'skilled nursing and personal care'
    : provider.servicesOffered[0] === 'PCS' ? 'personal care' : 'skilled nursing'
  const countyCount = provider.countiesServed.length
  return `${provider.name} provides ${serviceText} for children with medical needs — right in your home in ${provider.city} and across ${countyCount} Georgia ${countyCount === 1 ? 'county' : 'counties'}.`
}

/** Service pill label for hero card */
export function getServicePillLabel(service: ServiceType): string {
  switch (service) {
    case 'RN': return 'RN Nursing'
    case 'LPN': return 'LPN Nursing'
    case 'PCS': return 'Personal Care'
  }
}

/** Full service name */
export function getServiceFullName(service: ServiceType): string {
  switch (service) {
    case 'RN': return 'Registered Nursing (RN)'
    case 'LPN': return 'Licensed Practical Nursing (LPN)'
    case 'PCS': return 'Personal Care Services (PCS)'
  }
}

/** Service card description */
export function getServiceDescription(service: ServiceType): string {
  switch (service) {
    case 'RN':
      return 'Skilled nursing care from a Registered Nurse — medication management, medical procedures, and clinical oversight for children with complex health needs.'
    case 'LPN':
      return 'Licensed Practical Nursing support — routine medical care, vital signs monitoring, and day-to-day health management for your child.'
    case 'PCS':
      return 'Personal Care Services — help with daily activities like bathing, dressing, feeding, and mobility for children who need hands-on support.'
  }
}

/** Service icon CSS class for colored backgrounds */
export function getServiceIconClass(service: ServiceType): string {
  switch (service) {
    case 'RN': return 'bg-primary/10 text-primary'
    case 'LPN': return 'bg-accent/10 text-accent'
    case 'PCS': return 'bg-warm/10 text-warm-dark'
  }
}

/** Highlight items for "Why families choose us" card */
export function getHighlights(provider: Provider): string[] {
  const items: string[] = ['GAPP-approved provider']
  if (provider.acceptingNewPatients) items.push('Accepting new patients')
  items.push(`${provider.countiesServed.length} counties covered`)
  const serviceNames = provider.servicesOffered.map(s => s === 'PCS' ? 'PCS' : s).join(', ')
  items.push(`${serviceNames} services available`)
  items.push('Care in your home, on your schedule')
  return items
}

/** About section heading */
export function getAboutHeading(provider: Provider): string {
  return `Caring for Georgia families in ${provider.city} and beyond`
}

/** Format phone for display: (XXX) XXX-XXXX */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  return phone
}

/** Strip phone to digits only for tel: links */
export function phoneRaw(phone: string): string {
  return phone.replace(/\D/g, '')
}
