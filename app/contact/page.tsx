import Link from 'next/link'
import { Metadata } from 'next'
import { config } from '@/lib/config'
import { BreadcrumbSchema } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Contact Us | GeorgiaGAPP.com',
  description: 'Contact GeorgiaGAPP.com by phone, email, or web form. We help Georgia families find verified GAPP (Georgia Pediatric Program) providers.',
  alternates: {
    canonical: 'https://www.georgiagapp.com/contact',
  },
  openGraph: {
    title: 'Contact GeorgiaGAPP.com',
    description: 'Get in touch with the GeorgiaGAPP.com team.',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Contact', url: 'https://www.georgiagapp.com/contact' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Contact GeorgiaGAPP.com
          </h1>
          <p className="text-lg text-gray-600">
            We help Georgia families find verified GAPP providers. Reach out any time.
          </p>
        </div>
      </section>

      {/* About + Contact details */}
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg text-gray-700 mb-8">
            <h2>About GeorgiaGAPP.com</h2>
            <p>
              {config.contact.businessName} is an independent directory service that connects Georgia
              families with providers enrolled in the Georgia Pediatric Program (GAPP). Families can
              search our directory by county, service type (RN, LPN, PCS), and availability, then
              request a callback from a provider to start care for a medically fragile child.
            </p>
            <p>
              We are not affiliated with the State of Georgia or the official GAPP program. Providers
              listed on the Site are independent businesses responsible for their own licensing,
              staffing, and services.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {/* Phone */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.7 2.79a2 2 0 01-.45 1.82L8.09 10.91a11 11 0 005 5l1.78-1.38a2 2 0 011.82-.45l2.79.7A2 2 0 0121 16.72V19a2 2 0 01-2 2h-1C10.163 21 3 13.837 3 5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
              </div>
              <a href={`tel:${config.contact.phoneRaw}`} className="text-primary text-lg font-medium hover:underline">
                {config.contact.phone}
              </a>
              <p className="text-sm text-gray-500 mt-2">Mon–Fri, 9am–6pm ET</p>
            </div>

            {/* Email */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Email</h3>
              </div>
              <a href={`mailto:${config.contact.email}`} className="text-primary text-lg font-medium hover:underline break-all">
                {config.contact.email}
              </a>
              <p className="text-sm text-gray-500 mt-2">We reply within 1 business day.</p>
            </div>
          </div>

          {/* Who should contact which */}
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Who should you contact?</h3>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>Families looking for a provider:</strong> The fastest path is to{' '}
                <Link href="/directory" className="text-primary font-medium hover:underline">browse the directory</Link>{' '}
                or take our{' '}
                <Link href="/quiz" className="text-primary font-medium hover:underline">Help Me Choose quiz</Link>{' '}
                and request a callback from a verified provider.
              </li>
              <li>
                <strong>Providers who want to claim or correct a listing:</strong> See{' '}
                <Link href="/providers" className="text-primary font-medium hover:underline">/providers</Link>{' '}
                or email us.
              </li>
              <li>
                <strong>Case managers and hospital discharge planners:</strong> Visit our{' '}
                <Link href="/case-managers" className="text-primary font-medium hover:underline">case managers page</Link>.
              </li>
              <li>
                <strong>Media, partnerships, or general questions:</strong> Email us directly.
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-sm text-gray-500">
            <p>
              Read our{' '}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>{' '}
              and{' '}
              <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            {config.contact.disclaimer}
          </p>
        </div>
      </section>
    </div>
  )
}
