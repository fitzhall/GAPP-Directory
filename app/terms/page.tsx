import Link from 'next/link'
import { Metadata } from 'next'
import { config } from '@/lib/config'
import { BreadcrumbSchema } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Terms of Service | GeorgiaGAPP.com',
  description: 'The terms governing use of GeorgiaGAPP.com, including messaging, callback requests, and directory use.',
  alternates: {
    canonical: 'https://www.georgiagapp.com/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const EFFECTIVE_DATE = 'April 16, 2026'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Terms of Service', url: 'https://www.georgiagapp.com/terms' },
        ]}
      />

      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500">Effective {EFFECTIVE_DATE}</p>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto prose prose-lg text-gray-700">
          <p>
            Welcome to GeorgiaGAPP.com (the &quot;Site&quot;), operated by {config.contact.businessName}
            (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;). By accessing or using the Site you agree to these
            Terms of Service (&quot;Terms&quot;). If you do not agree, do not use the Site.
          </p>

          <h2>1. What the Site is</h2>
          <p>
            GeorgiaGAPP.com is a directory that helps Georgia families locate providers enrolled in the
            Georgia Pediatric Program (GAPP). We are not a state agency, not affiliated with the State
            of Georgia or the official GAPP program, and we do not deliver medical or nursing care
            ourselves. Providers listed on the Site are independent third parties responsible for their
            own services, licensing, staffing, and care.
          </p>

          <h2>2. Callback requests and provider contact</h2>
          <p>
            When you submit a callback request on a provider profile, you authorize us to forward your
            information to that provider and to contact you (and authorize the provider to contact you)
            by phone, SMS, or email regarding your request.
          </p>

          <h2 id="sms">3. SMS / text messaging terms</h2>
          <p>
            By checking the SMS consent box on our callback form, you agree to receive transactional
            and informational text messages from GeorgiaGAPP.com and the provider you selected at the
            phone number you provide. By opting in, you confirm:
          </p>
          <ul>
            <li>You are the subscriber or authorized user of the phone number you provide.</li>
            <li>You are 18 years of age or older, or a parent/guardian acting on behalf of a minor in your care.</li>
            <li>Message frequency varies based on your request and provider response.</li>
            <li>Message and data rates may apply based on your mobile carrier plan.</li>
            <li>Supported carriers include, but are not limited to, AT&amp;T, Verizon, T-Mobile, US Cellular, and Sprint. Carriers are not liable for delayed or undelivered messages.</li>
            <li>You may reply <strong>STOP</strong> at any time to unsubscribe, or <strong>HELP</strong> for assistance.</li>
          </ul>
          <p>
            See our <Link href="/privacy#sms" className="text-primary">Privacy Policy</Link> for how we
            handle SMS data. We do not share your mobile opt-in or phone number with third parties for
            marketing.
          </p>

          <h2>4. Accurate information</h2>
          <p>
            You agree that the information you submit on the Site (your name, phone number, ZIP code,
            care needs, etc.) is accurate and yours to share, and that you will use the Site only for
            lawful purposes related to locating GAPP services.
          </p>

          <h2>5. Provider listings and directory content</h2>
          <p>
            Listings are based on information from public sources and/or supplied by providers. We make
            reasonable efforts to verify and update information, but we do not guarantee accuracy,
            availability, licensing status, or quality of care of any provider. Inclusion in the
            directory is not an endorsement. Always verify a provider&apos;s credentials independently
            before accepting care.
          </p>
          <p>
            If you are a provider and want to claim or correct your listing, visit{' '}
            <Link href="/providers" className="text-primary">/providers</Link> or contact us.
          </p>

          <h2>6. No medical advice</h2>
          <p>
            Nothing on the Site is medical advice. The content is general information about GAPP and
            pediatric home care. Always consult qualified medical professionals and your GAPP care
            coordinator for decisions about your child&apos;s care.
          </p>

          <h2>7. Intellectual property</h2>
          <p>
            The Site, including its text, graphics, logos, and code, is owned by GeorgiaGAPP.com or our
            licensors and is protected by intellectual property laws. You may use the Site for personal,
            non-commercial purposes. You may not copy, scrape, resell, or republish substantial
            portions of the directory without written permission.
          </p>

          <h2>8. Third-party links</h2>
          <p>
            The Site may link to third-party websites (such as state agencies or provider websites). We
            are not responsible for the content or practices of those sites.
          </p>

          <h2>9. Disclaimers</h2>
          <p>
            THE SITE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF
            ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT PROVIDER INFORMATION IS ACCURATE, COMPLETE, OR
            CURRENT, OR THAT THE SITE WILL BE UNINTERRUPTED OR ERROR-FREE.
          </p>

          <h2>10. Limitation of liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, GEORGIAGAPP.COM AND ITS OPERATORS ARE NOT LIABLE
            FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF
            THE SITE OR YOUR INTERACTIONS WITH ANY LISTED PROVIDER. OUR TOTAL AGGREGATE LIABILITY FOR
            ANY CLAIM ARISING OUT OF THESE TERMS OR THE SITE IS LIMITED TO ONE HUNDRED
            U.S. DOLLARS ($100.00).
          </p>

          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless GeorgiaGAPP.com from any claim, loss, or expense
            arising out of your misuse of the Site or your violation of these Terms.
          </p>

          <h2>12. Governing law</h2>
          <p>
            These Terms are governed by the laws of the State of Georgia, USA, without regard to
            conflict-of-law principles. Any dispute will be brought in the state or federal courts
            located in Georgia.
          </p>

          <h2>13. Changes</h2>
          <p>
            We may update these Terms from time to time. When we do, we will change the effective date
            at the top of this page. Continued use of the Site after a change means you accept the
            updated Terms.
          </p>

          <h2>14. Contact</h2>
          <ul>
            <li><strong>{config.contact.businessName}</strong></li>
            <li>Email: <a href={`mailto:${config.contact.email}`} className="text-primary">{config.contact.email}</a></li>
            <li>Phone: <a href={`tel:${config.contact.phoneRaw}`} className="text-primary">{config.contact.phone}</a></li>
          </ul>

          <p className="mt-8">
            See also our <Link href="/privacy" className="text-primary">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}
