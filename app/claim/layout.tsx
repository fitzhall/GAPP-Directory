import { Metadata } from 'next'

// Claim pages are a form for agency owners, one per listing. Without this
// layout every /claim/[slug] page shipped with the home page's title, no
// canonical and an index directive, and Search Console filed sixty of them
// under "Duplicate without user-selected canonical". Keep them out of the
// index; families should land on the provider page, not the claim form.
export const metadata: Metadata = {
  title: 'Claim Your Listing | GeorgiaGAPP.com',
  description: 'Agency owners: claim and manage your GAPP provider listing on GeorgiaGAPP.com.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function ClaimLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
