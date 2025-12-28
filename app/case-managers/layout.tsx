import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GAPP Provider Availability | For Case Managers',
  description: 'Case manager tool to find GAPP providers with confirmed weekly availability. Search by county, service type, and special requirements. Updated every Monday.',
  keywords: 'GAPP case manager, GAPP provider availability, Georgia Pediatric Program providers, GAPP placement, find GAPP provider',
  openGraph: {
    title: 'GAPP Provider Availability | For Case Managers',
    description: 'Find GAPP providers with confirmed availability this week. Designed for case managers placing GAPP cases.',
    type: 'website',
  },
}

export default function CaseManagersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
