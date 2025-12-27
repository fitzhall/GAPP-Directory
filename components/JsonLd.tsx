/**
 * JSON-LD Schema Markup Components
 * Provides structured data for SEO and rich snippets
 */

// Generic JSON-LD wrapper
interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Organization Schema - for site identity
interface OrganizationSchemaProps {
  name: string
  url: string
  description: string
  logo?: string
}

export function OrganizationSchema({ name, url, description, logo }: OrganizationSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    description,
    ...(logo && { logo }),
  }
  return <JsonLd data={data} />
}

// SoftwareApplication Schema - for the eligibility screener tool
interface SoftwareApplicationSchemaProps {
  name: string
  description: string
  url: string
  applicationCategory?: string
  operatingSystem?: string
}

export function SoftwareApplicationSchema({
  name,
  description,
  url,
  applicationCategory = 'HealthApplication',
  operatingSystem = 'Web',
}: SoftwareApplicationSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory,
    operatingSystem,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }
  return <JsonLd data={data} />
}

// BreadcrumbList Schema - for navigation hierarchy
interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return <JsonLd data={data} />
}

// MedicalBusiness Schema - for provider listings
interface MedicalBusinessSchemaProps {
  name: string
  description?: string
  url: string
  telephone?: string
  address?: {
    streetAddress?: string
    addressLocality: string // city
    addressRegion: string // state
    postalCode?: string
  }
  areaServed?: string[] // counties
  medicalSpecialty?: string[]
  isAcceptingNewPatients?: boolean
}

export function MedicalBusinessSchema({
  name,
  description,
  url,
  telephone,
  address,
  areaServed,
  medicalSpecialty,
  isAcceptingNewPatients,
}: MedicalBusinessSchemaProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name,
    url,
  }

  if (description) data.description = description
  if (telephone) data.telephone = telephone
  if (isAcceptingNewPatients !== undefined) data.isAcceptingNewPatients = isAcceptingNewPatients

  if (address) {
    data.address = {
      '@type': 'PostalAddress',
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      ...(address.streetAddress && { streetAddress: address.streetAddress }),
      ...(address.postalCode && { postalCode: address.postalCode }),
    }
  }

  if (areaServed && areaServed.length > 0) {
    data.areaServed = areaServed.map(county => ({
      '@type': 'AdministrativeArea',
      name: `${county} County, Georgia`,
    }))
  }

  if (medicalSpecialty && medicalSpecialty.length > 0) {
    data.medicalSpecialty = medicalSpecialty
  }

  return <JsonLd data={data} />
}

// FAQPage Schema - for FAQ content
interface FAQItem {
  question: string
  answer: string
}

interface FAQPageSchemaProps {
  faqs: FAQItem[]
}

export function FAQPageSchema({ faqs }: FAQPageSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
  return <JsonLd data={data} />
}
