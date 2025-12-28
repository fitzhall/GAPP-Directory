import Link from 'next/link'
import { Metadata } from 'next'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

// FAQ data for both display and schema markup
const FAQS = [
  {
    question: 'How do I get started with GAPP?',
    answer: 'Contact your local Department of Family and Children Services (DFCS) or your child\'s doctor to request an evaluation. They will help determine eligibility.',
  },
  {
    question: 'Can I choose my own provider?',
    answer: 'Yes! Once you have GAPP authorization, you can choose any enrolled provider. That\'s what this directory is for — to help you find the right fit.',
  },
  {
    question: 'What if I\'m not happy with my current provider?',
    answer: 'You can switch providers at any time. Use this directory to find a new provider, then coordinate the transition with your care coordinator.',
  },
  {
    question: 'How many hours of care can my child receive?',
    answer: 'Hours are determined by your child\'s assessed needs and approved in your GAPP authorization. This varies for each child.',
  },
  {
    question: 'Is there a cost for GAPP services?',
    answer: 'GAPP is a Medicaid program, so there is typically no cost to families for covered services.',
  },
  {
    question: 'What is GAPP?',
    answer: 'The Georgia Pediatric Program (GAPP) helps children with complex medical needs receive care at home instead of in a hospital or nursing facility. It covers skilled nursing (RN/LPN) and personal care services (PCS).',
  },
  {
    question: 'Who qualifies for GAPP?',
    answer: 'To be eligible for GAPP, a child must be under 21 years old, be a Georgia resident, have Medicaid or qualify for Medicaid, and require a level of care typically provided in a hospital or nursing facility.',
  },
]

export const metadata: Metadata = {
  title: 'How GAPP Works | Georgia Pediatric Program Guide for Families',
  description: 'Learn how the Georgia Pediatric Program (GAPP) works. Find out who qualifies, what services are covered, and how to get started with home care for your child.',
  keywords: 'GAPP eligibility, Georgia Pediatric Program, GAPP services, pediatric home care eligibility, GAPP Medicaid waiver',
  openGraph: {
    title: 'How GAPP Works | Georgia Pediatric Program Guide',
    description: 'A simple guide for families new to the Georgia Pediatric Program. Learn about eligibility, services, and how to find providers.',
    type: 'article',
  },
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Schema.org FAQPage */}
      <FAQPageSchema faqs={FAQS} />

      {/* Schema.org Breadcrumb */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://georgiagapp.com' },
          { name: 'How GAPP Works', url: 'https://georgiagapp.com/how-it-works' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How GAPP Works
          </h1>
          <p className="text-lg text-gray-600">
            A simple guide for families new to the Georgia Pediatric Program
          </p>
        </div>
      </section>

      {/* What is GAPP */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is GAPP?</h2>
          <div className="prose prose-lg text-gray-700">
            <p>
              The <strong>Georgia Pediatric Program (GAPP)</strong> helps children with
              complex medical needs receive care at home instead of in a hospital or
              nursing facility. The program covers:
            </p>
            <ul className="space-y-2 mt-4">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>Skilled Nursing (RN/LPN)</strong> — Medical care from licensed nurses</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>Personal Care Services (PCS)</strong> — Help with bathing, dressing, and daily activities</span>
              </li>
            </ul>
            <p className="mt-4">
              GAPP is a Medicaid waiver program, which means it provides services that
              wouldn&apos;t otherwise be covered, helping children stay with their families.
            </p>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-gray-700 text-sm">
                <strong>Looking for Katie Beckett or TEFRA?</strong> Learn how these Medicaid waivers compare to GAPP in our{' '}
                <Link href="/waivers" className="text-primary hover:underline font-medium">
                  complete waivers guide
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Qualifies */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Who Qualifies?</h2>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-gray-700 mb-4">To be eligible for GAPP, a child must:</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
                <span className="text-gray-700">Be under 21 years old</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
                <span className="text-gray-700">Be a Georgia resident</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
                <span className="text-gray-700">Have Medicaid or qualify for Medicaid</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">4</span>
                <span className="text-gray-700">Require a level of care typically provided in a hospital or nursing facility</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* What to Have Ready */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What to Have Ready</h2>
          <p className="text-gray-700 mb-6">
            When you contact a provider, it helps to have these documents ready:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Child\'s Medicaid card',
              'GAPP authorization letter',
              'Recent medical records',
              'List of medications',
              'Emergency contact information',
              'Care coordinator contact (if you have one)',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Questions</h2>
          <div className="space-y-4">
            {FAQS.slice(0, 5).map((faq, i) => (
              <details key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 flex items-center justify-between hover:bg-gray-50">
                  {faq.question}
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Find a Provider?</h2>
          <p className="text-gray-600 mb-6">
            Browse our directory of verified GAPP providers in Georgia.
          </p>
          <Link
            href="/directory"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Find a Provider
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
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
