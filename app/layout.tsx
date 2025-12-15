import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { config } from '@/lib/config'
import Link from 'next/link'
import { MobileNav } from '@/components/MobileNav'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: {
    default: 'Georgia GAPP Provider Directory | Find Home Care for Children',
    template: '%s | Georgia GAPP Directory'
  },
  description: 'Find verified GAPP home care providers in Georgia. Search by county for RN nursing, LPN, and personal care services for children with special needs.',
  keywords: 'GAPP Georgia, GAPP providers, pediatric home care Georgia, RN nursing services, LPN services, personal care services, Georgia Pediatric Program',
  authors: [{ name: 'GAPP Directory' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Georgia GAPP Provider Directory',
    title: 'Georgia GAPP Provider Directory',
    description: 'Find verified home care providers for children with special needs in Georgia.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Georgia GAPP Provider Directory',
    description: 'Find verified home care providers for children with special needs in Georgia.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Clean, simple navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between h-14 sm:h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="font-bold text-gray-900 text-lg">GAPP Directory</span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                <Link
                  href="/directory"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Find Provider
                </Link>
                <Link
                  href="/quiz"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Help Me Choose
                </Link>
                <Link
                  href="/how-it-works"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  How GAPP Works
                </Link>
                <Link
                  href="/providers"
                  className="px-3 py-2 text-sm font-medium text-primary hover:text-primary-dark hover:bg-primary/5 rounded-lg transition-colors"
                >
                  For Providers
                </Link>
              </div>

              {/* Mobile Navigation */}
              <MobileNav />
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main>{children}</main>

        {/* Simple footer */}
        <footer className="bg-gray-900 text-gray-400 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm">
                © 2025 GAPP Provider Directory
              </div>
              <div className="flex gap-6 text-sm">
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How GAPP Works
                </Link>
                <Link href="/providers" className="hover:text-white transition-colors">
                  For Providers
                </Link>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800 text-xs text-gray-500 text-center">
              {config.contact.disclaimer}
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
