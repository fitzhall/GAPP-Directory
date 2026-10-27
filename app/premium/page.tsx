import type { Metadata } from 'next'
import Link from 'next/link'
import { config } from '@/lib/config'
import { PremiumVideo } from '@/components/PremiumVideo'

export const metadata: Metadata = {
  title: 'Premium Listing for GAPP Agencies | GeorgiaGAPP.com',
  description:
    'Be the one featured agency in your county on GeorgiaGAPP.com. First place on your county page and our guide pages. $897 a quarter.',
  alternates: { canonical: 'https://www.georgiagapp.com/premium' },
}

const premium = config.pricing.premium
const verified = config.pricing.verified

export default function PremiumPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-100 px-4 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-warm uppercase tracking-wide mb-3">For GAPP agencies</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Be the one featured agency in your county
          </h1>
          <p className="text-lg text-gray-600">
            Families come to GeorgiaGAPP.com looking for a GAPP provider near them. Premium puts your
            agency first in one county of your choice. One agency per county. No one else gets that spot.
          </p>
        </div>
      </section>

      <section className="px-4 pt-12">
        <PremiumVideo />
      </section>

      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
          {/* Premium */}
          <div className="bg-white rounded-2xl border-2 border-warm p-6 sm:p-8 flex flex-col">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-warm/30 text-gray-900 text-xs font-semibold rounded-full mb-3">
                Premium
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">${premium.price}</span>
                <span className="text-gray-500">every 3 months</span>
              </div>
            </div>
            <ul className="space-y-3 text-gray-700 mb-8 flex-1">
              <li className="flex gap-2"><Check />First place on your county page. Only one agency holds a county.</li>
              <li className="flex gap-2"><Check />Top of our guide pages, where most families start reading.</li>
              <li className="flex gap-2"><Check />A &quot;Featured in your county&quot; badge on your listing.</li>
              <li className="flex gap-2"><Check />Verified listing in every other county you serve.</li>
              <li className="flex gap-2"><Check />A private report link showing your views and calls.</li>
            </ul>
            <a
              href={premium.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg text-center hover:from-amber-600 hover:to-orange-600 transition-all shadow-md"
            >
              Get Premium — {premium.label}
            </a>
            <p className="text-xs text-gray-500 text-center mt-3">
              Billed every 3 months. Cancel anytime.
            </p>
          </div>

          {/* Verified */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 flex flex-col">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-3">
                Verified
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">${verified.price}</span>
                <span className="text-gray-500">every 3 months</span>
              </div>
            </div>
            <ul className="space-y-3 text-gray-700 mb-8 flex-1">
              <li className="flex gap-2"><Check />A full profile Google can find: bio, services, counties, phone.</li>
              <li className="flex gap-2"><Check />A &quot;Verified&quot; badge on your listing.</li>
              <li className="flex gap-2"><Check />Listed above unclaimed agencies in every county you serve.</li>
              <li className="flex gap-2"><Check />Callback requests from families on your page.</li>
            </ul>
            <a
              href={verified.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 bg-accent text-white font-semibold rounded-lg text-center hover:bg-accent/90 transition-colors"
            >
              Get Verified — {verified.label}
            </a>
            <p className="text-xs text-gray-500 text-center mt-3">
              Billed every 3 months. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What happens after you pay</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Use the same email you used to claim your listing, so we can match the payment to your agency.</li>
            <li>Premium: reply to your receipt, or email us, with the one county you want. If it is already taken we will tell you and help you pick another.</li>
            <li>We turn your listing on within one business day and send you your report link.</li>
          </ol>
          <p className="text-sm text-gray-600 mt-6">
            Not claimed your listing yet?{' '}
            <Link href="/providers" className="text-primary hover:underline font-medium">Find your agency and claim it first</Link>.
            Questions? Email{' '}
            <a href={`mailto:${config.contact?.email || 'help@georgiagapp.com'}`} className="text-primary hover:underline">
              {config.contact?.email || 'help@georgiagapp.com'}
            </a>{' '}
            or call{' '}
            <a href={`tel:${config.contact?.phoneRaw || '+16782638540'}`} className="text-primary hover:underline">
              {config.contact?.phone || '(678) 263-8540'}
            </a>.
          </p>
        </div>
      </section>
    </main>
  )
}

function Check() {
  return (
    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}
