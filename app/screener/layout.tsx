import type { Metadata } from 'next'
import { SoftwareApplicationSchema } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'GAPP Eligibility Screener | Check If Your Child Qualifies',
  description: 'Free eligibility screener for the Georgia Pediatric Program (GAPP). Find out if your child may qualify for home nursing services in 3 simple steps.',
  keywords: 'GAPP eligibility, Georgia Pediatric Program eligibility, GAPP screening tool, pediatric home care Georgia, do I qualify for GAPP',
  openGraph: {
    title: 'GAPP Eligibility Screener | Check If Your Child Qualifies',
    description: 'Free tool to check if your child may qualify for GAPP home nursing services in Georgia.',
    type: 'website',
  },
}

export default function ScreenerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SoftwareApplicationSchema
        name="GAPP Eligibility Screener"
        description="Free online tool to check if your child may qualify for Georgia Pediatric Program (GAPP) home nursing services. Answers questions about care needs, Medicaid status, and location to provide personalized next steps."
        url="https://georgiagapp.com/screener"
        applicationCategory="HealthApplication"
        operatingSystem="Web"
      />
      {children}
    </>
  )
}
