import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find GAPP Providers | Georgia Home Care Provider Directory',
  description: 'Search our directory of verified GAPP providers in Georgia. Filter by county, service type (RN, LPN, PCS), and availability to find the right home care provider.',
  keywords: 'GAPP providers Georgia, home care directory, pediatric nursing services, RN LPN PCS providers, Georgia home care search',
  openGraph: {
    title: 'Georgia GAPP Provider Directory | Search Home Care Providers',
    description: 'Find verified GAPP providers in your area. Filter by county and service type to find the right home care for your child.',
    type: 'website',
  },
}

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
