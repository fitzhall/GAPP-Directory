import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'For GAPP Providers | Get Listed in Georgia\'s Provider Directory',
  description: 'Join the Georgia GAPP Provider Directory. Get found by families who need your home care services. List your agency and start receiving qualified leads today.',
  keywords: 'GAPP provider listing, Georgia home care agency, pediatric home care provider, GAPP directory listing',
  openGraph: {
    title: 'Get Your Agency Listed | Georgia GAPP Provider Directory',
    description: 'Join the only GAPP provider directory families actually use. Be the obvious choice when they search.',
    type: 'website',
  },
}

export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
