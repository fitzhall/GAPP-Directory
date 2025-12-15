import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find the Right Provider | GAPP Provider Matching Quiz',
  description: 'Answer a few questions and we\'ll match you with GAPP providers in your area. Find home care providers for your child based on your specific needs.',
  keywords: 'GAPP provider quiz, find home care provider, Georgia pediatric care match, GAPP provider finder',
  openGraph: {
    title: 'Find the Right GAPP Provider for Your Family',
    description: 'Take our quick quiz to find home care providers that match your needs. Get personalized recommendations in minutes.',
    type: 'website',
  },
}

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
