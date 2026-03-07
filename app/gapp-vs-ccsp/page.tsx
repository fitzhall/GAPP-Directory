import Link from 'next/link'
import { Metadata } from 'next'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

// FAQ data for schema markup and display
const COMPARISON_FAQS = [
  {
    question: "What's the biggest difference between GAPP and CCSP?",
    answer: 'GAPP pays for nurses in your home. CCSP pays for community support and day programs. If your child needs medical care at home, GAPP is the one.',
  },
  {
    question: 'Does CCSP cover home nursing?',
    answer: 'No. CCSP covers personal support, respite, and community services. For home nursing (RN or LPN), you need GAPP.',
  },
  {
    question: 'Can my child be on both GAPP and CCSP?',
    answer: 'Potentially yes, if they qualify for both. GAPP would cover nursing, CCSP would cover community support. Your case manager can help figure this out.',
  },
  {
    question: 'Is there a wait list for GAPP?',
    answer: 'GAPP typically does not have a wait list. You apply through a Medicaid-enrolled agency. CCSP often has a wait list.',
  },
  {
    question: 'How do I know which program my child qualifies for?',
    answer: "If your child needs skilled nursing at home (trach care, vent management, tube feedings), that's GAPP. If they need help with daily living and community activities, that's CCSP. Start with your pediatrician or call Georgia Medicaid at 1-866-211-0950.",
  },
  {
    question: 'What if my child needs both nursing and community services?',
    answer: 'Apply for GAPP first if nursing is the immediate need. You can explore CCSP later.',
  },
]

// Comparison table data
const COMPARISON_ROWS = [
  {
    label: 'Full name',
    gapp: 'Georgia Pediatric Program',
    ccsp: 'Community Care Services Program',
  },
  {
    label: "Who it's for",
    gapp: 'Children under 21 needing skilled nursing',
    ccsp: 'Adults and some children with intellectual/developmental disabilities',
  },
  {
    label: 'Main services',
    gapp: 'RN, LPN, personal care at home',
    ccsp: 'Personal support, respite, community living, day programs',
  },
  {
    label: 'Covers home nursing?',
    gapp: 'Yes — this is the main service',
    ccsp: 'No — community-based support',
  },
  {
    label: 'Age limit',
    gapp: 'Under 21',
    ccsp: 'Varies (primarily adults, some children)',
  },
  {
    label: 'Wait list',
    gapp: 'Typically no wait list',
    ccsp: 'Often has a wait list',
  },
  {
    label: 'How to apply',
    gapp: 'Through a Medicaid-enrolled GAPP agency',
    ccsp: 'Through regional office or case manager',
  },
  {
    label: 'Medicaid required?',
    gapp: 'Yes',
    ccsp: 'Yes',
  },
]

export const metadata: Metadata = {
  title: 'GAPP vs CCSP: Which Georgia Waiver Program Fits Your Child?',
  description: 'Compare GAPP and CCSP waiver programs side by side. See eligibility, services, wait times, and which one covers home nursing for your child in Georgia.',
  keywords: 'GAPP vs CCSP, Georgia waiver programs, GAPP waiver, CCSP waiver, pediatric Medicaid Georgia, home nursing waiver Georgia',
  openGraph: {
    title: 'GAPP vs CCSP: Which Georgia Waiver Program Fits Your Child?',
    description: 'Side-by-side comparison of Georgia GAPP and CCSP waiver programs.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/gapp-vs-ccsp',
  },
}

export default function GAPPvsCCSPPage() {
  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={COMPARISON_FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'GAPP vs CCSP', url: 'https://www.georgiagapp.com/gapp-vs-ccsp' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">GAPP vs CCSP</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            GAPP vs CCSP: which Georgia waiver program fits your child?
          </h1>
          <p className="text-lg text-gray-600">
            These two programs get mixed up all the time. Both are Medicaid waivers in Georgia, but they
            cover different things for different people. Here&apos;s how to tell which one you need.
          </p>
        </div>
      </section>

      {/* Quick Answer Box */}
      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">The short version</h2>
            <p className="text-gray-700">
              GAPP covers home nursing for medically fragile kids under 21. CCSP covers community
              services for people with intellectual or developmental disabilities. If your child needs
              a nurse at home, you want GAPP.{' '}
              <Link href="/gapp-approval-guide" className="text-primary hover:underline">
                Here&apos;s how to apply for GAPP
              </Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Side-by-side comparison</h2>

          {/* Desktop table */}
          <div className="hidden sm:block rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-white">
              <div className="px-5 py-4 border-b border-r border-gray-200"></div>
              <div className="px-5 py-4 border-b border-r border-gray-200">
                <span className="font-bold text-primary">GAPP</span>
              </div>
              <div className="px-5 py-4 border-b border-gray-200">
                <span className="font-bold text-gray-700">CCSP</span>
              </div>
            </div>
            {/* Rows */}
            {COMPARISON_ROWS.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="px-5 py-4 border-r border-gray-200 font-semibold text-gray-900 text-sm">
                  {row.label}
                </div>
                <div className="px-5 py-4 border-r border-gray-200 text-gray-700 text-sm">
                  {row.gapp}
                </div>
                <div className="px-5 py-4 text-gray-700 text-sm">
                  {row.ccsp}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile stacked view */}
          <div className="sm:hidden space-y-4">
            {COMPARISON_ROWS.map((row, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="font-semibold text-gray-900 text-sm mb-3">{row.label}</p>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded flex-shrink-0">GAPP</span>
                    <span className="text-sm text-gray-700">{row.gapp}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded flex-shrink-0">CCSP</span>
                    <span className="text-sm text-gray-700">{row.ccsp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When to Choose GAPP */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">When GAPP is the right choice</h2>
          <p className="text-gray-700 mb-4">
            Your child needs a nurse at home. That&apos;s the core of GAPP. If any of these apply, you&apos;re
            looking at GAPP:
          </p>
          <ul className="space-y-2 mb-6">
            {[
              'Your child has a tracheostomy and needs suctioning',
              'Your child is on a ventilator',
              'Your child gets tube feedings (G-tube, NG tube)',
              'Your child needs IV medications at home',
              'Your child has seizures that need monitoring by a nurse',
              'Your child was discharged from the hospital but still needs skilled care',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-700">
            GAPP covers RN, LPN, and personal care services. You can{' '}
            <Link href="/gapp-services-explained" className="text-primary hover:underline">
              read more about what GAPP covers
            </Link>{' '}
            or go straight to the{' '}
            <Link href="/directory" className="text-primary hover:underline">
              provider directory
            </Link>{' '}
            to find agencies in your county. If you&apos;re in the Atlanta area, check providers in{' '}
            <Link href="/fulton" className="text-primary hover:underline">Fulton County</Link>{' '}
            or{' '}
            <Link href="/dekalb" className="text-primary hover:underline">DeKalb County</Link>.
          </p>
        </div>
      </section>

      {/* When to Choose CCSP */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">When CCSP might be better</h2>
          <p className="text-gray-700 mb-4">
            CCSP is built around community living, not medical care. It helps people with intellectual
            or developmental disabilities live more independently. The services look different from GAPP:
          </p>
          <ul className="space-y-2 mb-6">
            {[
              'Personal support workers to help with daily routines',
              'Respite care so family caregivers can take a break',
              'Community integration and day programs',
              'Support coordination from a case manager',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-700">
            CCSP does not cover home nursing. If your kid needs a nurse, CCSP won&apos;t pay for it.
            You need GAPP for that.
          </p>
        </div>
      </section>

      {/* Can You Have Both? */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Can you use both programs?</h2>
          <p className="text-gray-700 mb-4">
            Yes, in some cases. If your child qualifies for both, GAPP would cover the nursing and
            CCSP would cover community support. They fill different gaps, so there isn&apos;t necessarily
            a conflict.
          </p>
          <p className="text-gray-700 mb-4">
            That said, qualifying for both takes time and paperwork. Most families start with the one
            that matches the most urgent need. If your child needs a nurse now, apply for GAPP first.
            You can look into CCSP once the nursing is in place.
          </p>
          <p className="text-gray-700">
            For a broader look at Georgia&apos;s waiver programs, see our{' '}
            <Link href="/waivers" className="text-primary hover:underline">
              Georgia Medicaid waivers comparison page
            </Link>.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common questions about GAPP vs CCSP</h2>
          <div className="space-y-4">
            {COMPARISON_FAQS.map((faq, i) => (
              <details key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 flex items-center justify-between hover:bg-gray-50">
                  {faq.question}
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-gray-700">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/gapp-approval-guide"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">GAPP approval guide</h3>
              <p className="text-sm text-gray-600">Step-by-step walkthrough of the GAPP application process.</p>
            </Link>
            <Link
              href="/how-to-apply-for-gapp"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">How to apply for GAPP</h3>
              <p className="text-sm text-gray-600">What you need before you start and where to send it.</p>
            </Link>
            <Link
              href="/waivers"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">All Georgia Medicaid waivers</h3>
              <p className="text-sm text-gray-600">Compare GAPP, CCSP, NOW, COMP, and Katie Beckett side by side.</p>
            </Link>
            <Link
              href="/directory"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Provider directory</h3>
              <p className="text-sm text-gray-600">Find GAPP providers accepting new patients in your county.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to apply for GAPP?</h2>
          <p className="text-gray-600 mb-6">
            Find a provider in your county and request a callback. Most families hear back within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/directory"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Find a Provider
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/screener"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors"
            >
              Check Eligibility
            </Link>
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
