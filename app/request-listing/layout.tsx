import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Request a GAPP Provider Listing | GeorgiaGAPP.com',
  description: 'Georgia GAPP agencies: ask to be added to the GeorgiaGAPP.com provider directory so families searching by county can find you. Reviewed within 24-48 hours.',
  alternates: {
    canonical: 'https://www.georgiagapp.com/request-listing',
  },
}

export default function RequestListingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
