import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { config } from '@/lib/config'
import Link from 'next/link'
// Using regular img tag for logo to avoid Next.js Image sizing issues
import { MobileNav } from '@/components/MobileNav'
import { OrganizationSchema } from '@/components/JsonLd'

const GA_MEASUREMENT_ID = 'G-QSHSPFWHFF'

const nunito = Nunito({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: {
    default: 'Find GAPP Providers in Georgia | Verified Home Care for Medically Fragile Children',
    template: '%s | GeorgiaGAPP.com'
  },
  description: 'Find GAPP providers in Georgia. Search verified home care providers for medically fragile children - RN nursing, LPN, and personal care services. Updated weekly.',
  keywords: 'find GAPP providers, GAPP providers Georgia, GAPP home care Georgia, medically fragile children care Georgia, Georgia Pediatric Program, pediatric home care',
  authors: [{ name: 'GeorgiaGAPP.com' }],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon_16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.georgiagapp.com',
    siteName: 'GeorgiaGAPP.com',
    title: 'Find GAPP Providers in Georgia | Home Care for Medically Fragile Children',
    description: 'Find GAPP providers in Georgia. Search verified home care providers for medically fragile children - RN nursing, LPN, and personal care services.',
    images: [
      {
        url: 'https://www.georgiagapp.com/og-image.png',
        width: 1640,
        height: 624,
        alt: 'GeorgiaGAPP.com - Connecting Families with Quality GAPP Providers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GeorgiaGAPP.com | Find GAPP Providers',
    description: 'Connecting families with quality GAPP providers for special needs children in Georgia.',
    images: ['https://www.georgiagapp.com/og-image.png'],
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
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <body className={nunito.className}>
        {/* Organization Schema for site identity */}
        <OrganizationSchema
          name="GeorgiaGAPP.com"
          url="https://www.georgiagapp.com"
          description="Georgia Pediatric Program (GAPP) provider directory. Connecting families with verified home care providers for children with special needs."
          logo="https://www.georgiagapp.com/logo.png"
        />

        {/* Clean, simple navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between h-16 sm:h-20">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <img
                    src="/logo.png"
                    alt="GeorgiaGAPP.com"
                    className="h-12 sm:h-16 w-auto"
                  />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                <Link
                  href="/directory"
                  className="px-3 py-2 text-sm font-semibold text-navy hover:text-primary hover:bg-warm/20 rounded-lg transition-colors"
                >
                  Find Provider
                </Link>
                <Link
                  href="/quiz"
                  className="px-3 py-2 text-sm font-semibold text-navy hover:text-primary hover:bg-warm/20 rounded-lg transition-colors"
                >
                  Help Me Choose
                </Link>
                <Link
                  href="/how-it-works"
                  className="px-3 py-2 text-sm font-semibold text-navy hover:text-primary hover:bg-warm/20 rounded-lg transition-colors"
                >
                  How GAPP Works
                </Link>
                <Link
                  href="/waivers"
                  className="px-3 py-2 text-sm font-semibold text-navy hover:text-primary hover:bg-warm/20 rounded-lg transition-colors"
                >
                  Waivers
                </Link>
                <Link
                  href="/providers"
                  className="px-3 py-2 text-sm font-semibold text-primary hover:text-primary-dark hover:bg-primary/10 rounded-lg transition-colors"
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

        {/* Footer */}
        <footer className="bg-navy text-gray-300 py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Footer Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              {/* Services */}
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm">Services</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/services/rn-nursing" className="hover:text-warm transition-colors">RN Nursing</Link></li>
                  <li><Link href="/services/lpn-services" className="hover:text-warm transition-colors">LPN Services</Link></li>
                  <li><Link href="/services/personal-care" className="hover:text-warm transition-colors">Personal Care (PCS)</Link></li>
                </ul>
              </div>
              {/* Resources */}
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/georgia-pediatric-program" className="hover:text-warm transition-colors">What is GAPP?</Link></li>
                  <li><Link href="/gapp-providers-georgia" className="hover:text-warm transition-colors">GAPP Providers Georgia</Link></li>
                  <li><Link href="/gapp-home-care" className="hover:text-warm transition-colors">GAPP Home Care</Link></li>
                  <li><Link href="/medically-fragile-children-care" className="hover:text-warm transition-colors">Medically Fragile Care</Link></li>
                  <li><Link href="/gapp-approval-guide" className="hover:text-warm transition-colors">GAPP Approval Guide</Link></li>
                  <li><Link href="/waivers" className="hover:text-warm transition-colors">Medicaid Waivers</Link></li>
                </ul>
              </div>
              {/* For Professionals */}
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm">For Professionals</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/providers" className="hover:text-warm transition-colors">For Providers</Link></li>
                  <li><Link href="/case-managers" className="hover:text-warm transition-colors">Case Managers</Link></li>
                </ul>
              </div>
              {/* Contact */}
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm">Contact</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="mailto:help@georgiaGAPP.com" className="hover:text-warm transition-colors">help@georgiaGAPP.com</a></li>
                </ul>
              </div>
            </div>
            {/* Bottom bar */}
            <div className="pt-6 border-t border-navy-light flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm">
                © 2025 GeorgiaGAPP.com
              </div>
              <div className="text-xs text-gray-400 text-center sm:text-right max-w-xl">
                {config.contact.disclaimer}
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
