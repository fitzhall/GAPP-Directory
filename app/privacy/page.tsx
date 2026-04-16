import Link from 'next/link'
import { Metadata } from 'next'
import { config } from '@/lib/config'
import { BreadcrumbSchema } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Privacy Policy | GeorgiaGAPP.com',
  description: 'Read how GeorgiaGAPP.com collects, uses, and protects your information, including phone numbers submitted for callback and SMS communication.',
  alternates: {
    canonical: 'https://www.georgiagapp.com/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const EFFECTIVE_DATE = 'April 16, 2026'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Privacy Policy', url: 'https://www.georgiagapp.com/privacy' },
        ]}
      />

      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500">Effective {EFFECTIVE_DATE}</p>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto prose prose-lg text-gray-700">
          <p>
            GeorgiaGAPP.com (&quot;GeorgiaGAPP,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website
            at <a href="https://www.georgiagapp.com" className="text-primary">www.georgiagapp.com</a> (the
            &quot;Site&quot;). We connect Georgia families with providers enrolled in the Georgia Pediatric
            Program (GAPP). This Privacy Policy explains what information we collect, how we use it,
            and the choices you have.
          </p>

          <h2>Information we collect</h2>
          <p>When you use the Site, we may collect:</p>
          <ul>
            <li><strong>Contact details you provide on forms:</strong> your name, phone number, email address, ZIP code, and county.</li>
            <li><strong>Care-related details you provide:</strong> the service you need (RN, LPN, PCS), urgency, preferred callback time, and any notes you add (e.g., night hours needed, language preference).</li>
            <li><strong>Basic usage data:</strong> pages visited, device type, and referral source, collected through standard analytics tools such as Google Analytics.</li>
          </ul>

          <h2>How we use your information</h2>
          <p>We use the information you provide to:</p>
          <ul>
            <li>Route your callback request to the GAPP provider you selected.</li>
            <li>Let that provider contact you by phone, SMS, or email to follow up on your request.</li>
            <li>Respond to questions you send us directly.</li>
            <li>Improve the Site, measure performance, and fix problems.</li>
            <li>Comply with legal obligations.</li>
          </ul>

          <h2 id="sms">SMS / text messaging</h2>
          <p>
            When you submit a callback request on a provider profile and check the SMS consent box,
            you agree to receive transactional and informational SMS messages from GeorgiaGAPP.com
            and from the provider you selected, at the phone number you provided. Messages may
            include appointment coordination, availability updates, and follow-up regarding your
            request.
          </p>
          <ul>
            <li><strong>Message frequency</strong> varies based on your request and provider response.</li>
            <li><strong>Message &amp; data rates</strong> may apply based on your mobile carrier plan.</li>
            <li><strong>To opt out,</strong> reply <strong>STOP</strong> to any message from us. You will receive a final confirmation that you have been unsubscribed.</li>
            <li><strong>For help,</strong> reply <strong>HELP</strong> or contact us at <a href={`mailto:${config.contact.email}`} className="text-primary">{config.contact.email}</a> or <a href={`tel:${config.contact.phoneRaw}`} className="text-primary">{config.contact.phone}</a>.</li>
            <li>Carriers are not liable for delayed or undelivered messages.</li>
          </ul>
          <p>
            <strong>No mobile information will be shared with third parties or affiliates for
            marketing or promotional purposes.</strong> Information shared with the GAPP provider you
            selected is strictly for the purpose of fulfilling your callback request. All categories of
            the above exclusions apply: text messaging originator opt-in data and consent will not be
            shared with any third parties.
          </p>

          <h2>Who we share information with</h2>
          <p>We share the information you submit only as follows:</p>
          <ul>
            <li><strong>The GAPP provider you select</strong> on the Site, so they can contact you about your request.</li>
            <li><strong>Service providers</strong> that help us operate the Site (for example, our database host, email delivery service, and SMS platform). They may access information only to perform their work for us.</li>
            <li><strong>Legal and safety purposes,</strong> when required by law, subpoena, or to protect rights or safety.</li>
          </ul>
          <p>We do not sell your personal information. We do not share your phone number, SMS opt-in, or mobile consent with third parties for their own marketing.</p>

          <h2>Your choices</h2>
          <ul>
            <li><strong>Opt out of SMS</strong> at any time by replying STOP.</li>
            <li><strong>Request access, correction, or deletion</strong> of your information by emailing <a href={`mailto:${config.contact.email}`} className="text-primary">{config.contact.email}</a>.</li>
            <li><strong>Analytics opt-out:</strong> you can disable Google Analytics using the <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary" target="_blank" rel="noreferrer">Google Analytics opt-out browser add-on</a>.</li>
          </ul>

          <h2>Data retention</h2>
          <p>
            We keep callback request information for as long as needed to facilitate the request and
            for a reasonable period afterward for recordkeeping, dispute resolution, and compliance.
            You may request deletion at any time.
          </p>

          <h2>Children&apos;s privacy</h2>
          <p>
            The Site is intended for use by parents, guardians, and care coordinators acting on behalf
            of a child. We do not knowingly collect personal information directly from children under
            13. If you believe a child has submitted information to us, contact us and we will remove
            it.
          </p>

          <h2>Security</h2>
          <p>
            We use industry-standard safeguards to protect your information, including encrypted
            database storage and HTTPS across the Site. No system is perfectly secure, so we cannot
            guarantee absolute security.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we will change the
            effective date at the top of this page. Material changes will be announced on the Site.
          </p>

          <h2>Contact us</h2>
          <p>
            Questions about this Privacy Policy or your information? Reach out:
          </p>
          <ul>
            <li><strong>{config.contact.businessName}</strong></li>
            <li>Email: <a href={`mailto:${config.contact.email}`} className="text-primary">{config.contact.email}</a></li>
            <li>Phone: <a href={`tel:${config.contact.phoneRaw}`} className="text-primary">{config.contact.phone}</a></li>
          </ul>

          <p className="mt-8">
            See also our <Link href="/terms" className="text-primary">Terms of Service</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}
