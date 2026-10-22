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
  npi?: string // national provider identifier, from the public registry
  foundingDate?: string // NPI enumeration date, YYYY-MM-DD
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
  npi,
  foundingDate,
}: MedicalBusinessSchemaProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name,
    url,
  }

  if (description) data.description = description
  if (telephone) data.telephone = telephone
  if (npi) data.identifier = { '@type': 'PropertyValue', propertyID: 'NPI', value: npi }
  if (foundingDate) data.foundingDate = foundingDate
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

// WebPage Schema - for informational content pages
interface WebPageSchemaProps {
  name: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
  breadcrumb?: BreadcrumbItem[]
}

export function WebPageSchema({
  name,
  description,
  url,
  datePublished,
  dateModified,
  breadcrumb,
}: WebPageSchemaProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'GeorgiaGAPP.com',
      url: 'https://www.georgiagapp.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GeorgiaGAPP.com',
      url: 'https://www.georgiagapp.com',
    },
  }

  if (datePublished) data.datePublished = datePublished
  if (dateModified) data.dateModified = dateModified

  if (breadcrumb && breadcrumb.length > 0) {
    data.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumb.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    }
  }

  return <JsonLd data={data} />
}

// Article Schema - for long-form content pages with freshness signal
interface ArticleSchemaProps {
  headline: string
  datePublished: string  // ISO 8601 (YYYY-MM-DD)
  dateModified: string   // ISO 8601 (YYYY-MM-DD)
  description?: string
  url?: string
}

export function ArticleSchema({
  headline,
  datePublished,
  dateModified,
  description,
  url,
}: ArticleSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    datePublished,
    dateModified,
    ...(description && { description }),
    ...(url && { mainEntityOfPage: { '@type': 'WebPage', '@id': url } }),
    author: {
      '@type': 'Organization',
      name: 'GeorgiaGAPP',
      url: 'https://www.georgiagapp.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GeorgiaGAPP',
      url: 'https://www.georgiagapp.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.georgiagapp.com/logo.webp',
      },
    },
  }
  return <JsonLd data={data} />
}

// GovernmentService Schema - describes a state program a page is ABOUT.
// The provider is the state agency, never this site: GeorgiaGAPP.com is an
// independent directory, and the schema says so through the WebPage publisher.
interface GovernmentServiceSchemaProps {
  name: string
  description: string
  url: string           // the page on this site that describes the program
  officialUrls: string[] // .gov pages and documents about the program
  phone?: string        // the agency's published number for the program
}

export function GovernmentServiceSchema({ name, description, url, officialUrls, phone }: GovernmentServiceSchemaProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name,
    alternateName: 'GAPP',
    description,
    serviceType: 'In-home skilled nursing and personal care for medically fragile children under 21',
    provider: {
      '@type': 'GovernmentOrganization',
      name: 'Georgia Department of Community Health',
      url: 'https://dch.georgia.gov',
      ...(phone && { telephone: phone }),
    },
    areaServed: { '@type': 'State', name: 'Georgia' },
    audience: { '@type': 'Audience', audienceType: 'Medicaid-enrolled children under 21 who are medically fragile' },
    sameAs: officialUrls,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }
  return <JsonLd data={data} />
}
