import Link from 'next/link'
import { Metadata } from 'next'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

const MEDICAID_FAQS = [
  {
    question: 'What does "active Medicaid" mean for GAPP?',
    answer: 'Active Medicaid means your child has been approved and has a Medicaid ID number. Pending applications, submitted applications, or approval letters without an ID number do not count as active Medicaid.',
  },
  {
    question: 'Can my child get GAPP with PeachCare instead of Medicaid?',
    answer: 'PeachCare is Georgia\'s CHIP program and is separate from Medicaid. GAPP requires Medicaid specifically. However, some children may qualify for Medicaid through the Katie Beckett waiver even if their family income is too high for regular Medicaid.',
  },
  {
    question: 'What if my family income is too high for Medicaid?',
    answer: 'The Katie Beckett waiver (also called TEFRA) allows children with disabilities to qualify for Medicaid based on their medical condition, not family income. If your child needs an institutional level of care, they may qualify regardless of your income.',
  },
  {
    question: 'How do I check if my child\'s Medicaid is active?',
    answer: 'Call Georgia Medicaid at 1-866-211-0950 or check your Georgia Gateway account online. You need to confirm you have a Medicaid ID number, not just that an application is in process.',
  },
  {
    question: 'What type of Medicaid does my child need for GAPP?',
    answer: 'Any Georgia Medicaid coverage that includes home health benefits works for GAPP. This includes regular Medicaid, Katie Beckett/TEFRA, foster care Medicaid, and SSI-linked Medicaid.',
  },
  {
    question: 'Can I apply for GAPP while waiting for Medicaid approval?',
    answer: 'No. You cannot start the GAPP approval process until Medicaid is active. GAPP agencies cannot submit prior authorization without an active Medicaid ID. Use the waiting time to research agencies and gather medical documentation.',
  },
]

export const metadata: Metadata = {
  title: 'GAPP Medicaid Requirements | Georgia Pediatric Program Eligibility',
  description: 'Understand Medicaid requirements for GAPP in Georgia. Learn what "active Medicaid" means, how to check your status, and pathways like Katie Beckett for families with higher incomes.',
  keywords: 'GAPP Medicaid requirements, Georgia Medicaid GAPP, Katie Beckett Georgia, TEFRA Georgia, GAPP eligibility Medicaid, PeachCare vs Medicaid GAPP',
  openGraph: {
    title: 'GAPP Medicaid Requirements | Georgia Pediatric Program',
    description: 'What Medicaid coverage does your child need for GAPP? Complete guide to eligibility requirements.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://georgiagapp.com/gapp-medicaid-requirements',
  },
}

export default function GAPPMedicaidRequirementsPage() {
  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={MEDICAID_FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://georgiagapp.com' },
          { name: 'GAPP Approval Guide', url: 'https://georgiagapp.com/gapp-approval-guide' },
          { name: 'Medicaid Requirements', url: 'https://georgiagapp.com/gapp-medicaid-requirements' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/gapp-approval-guide" className="hover:text-primary">GAPP Approval Guide</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Medicaid Requirements</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            GAPP Medicaid Requirements
          </h1>
          <p className="text-lg text-gray-600">
            GAPP requires <strong>active Georgia Medicaid</strong>. Here&apos;s exactly what that means
            and how to qualify if your family income seems too high.
          </p>
        </div>
      </section>

      {/* Key Point */}
      <section className="py-8 px-4 bg-amber-50 border-b border-amber-200">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-amber-800 mb-1">Pending Medicaid Does Not Count</h2>
              <p className="text-amber-700 text-sm">
                GAPP agencies cannot submit prior authorization until Medicaid is <strong>active</strong> with an ID number.
                A submitted application, approval letter, or "pending" status is not sufficient.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Active Medicaid Means */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What "Active Medicaid" Means</h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {/* Counts */}
            <div className="bg-green-50 rounded-xl border border-green-200 p-5">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Counts as Active
              </h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Medicaid card with ID number</li>
                <li>• Verified active status in Georgia Gateway</li>
                <li>• Confirmation from 1-866-211-0950</li>
                <li>• Coverage showing in provider verification</li>
              </ul>
            </div>

            {/* Doesn't Count */}
            <div className="bg-red-50 rounded-xl border border-red-200 p-5">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Does NOT Count
              </h3>
              <ul className="space-y-2 text-sm text-red-700">
                <li>• Application submitted (pending)</li>
                <li>• Approval letter without ID number</li>
                <li>• "Processing" status</li>
                <li>• PeachCare (separate program)</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">How to Check Your Medicaid Status</h3>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
                <div>
                  <p className="font-medium text-gray-900">Call Georgia Medicaid</p>
                  <p className="text-sm text-gray-600">1-866-211-0950 (Mon-Fri 7am-7pm)</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
                <div>
                  <p className="font-medium text-gray-900">Check Georgia Gateway</p>
                  <p className="text-sm text-gray-600">Log in at <a href="https://gateway.ga.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">gateway.ga.gov</a> to view your benefits status</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
                <div>
                  <p className="font-medium text-gray-900">Confirm you have an ID number</p>
                  <p className="text-sm text-gray-600">The Medicaid ID is required for GAPP prior authorization</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Types of Medicaid That Work */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Types of Medicaid That Work for GAPP</h2>

          <div className="space-y-4">
            {[
              {
                name: 'Regular Georgia Medicaid',
                description: 'Standard Medicaid based on family income. If you qualify, this works for GAPP.',
                icon: '✓',
              },
              {
                name: 'Katie Beckett / TEFRA',
                description: 'For children who need institutional-level care, regardless of family income. This is the pathway for families with higher incomes.',
                icon: '★',
              },
              {
                name: 'SSI-Linked Medicaid',
                description: 'Children receiving SSI (Supplemental Security Income) automatically qualify for Medicaid in Georgia.',
                icon: '✓',
              },
              {
                name: 'Foster Care Medicaid',
                description: 'Children in foster care have Medicaid coverage that works for GAPP.',
                icon: '✓',
              },
              {
                name: 'Medically Needy',
                description: 'A spend-down program for families with higher incomes but significant medical expenses.',
                icon: '✓',
              },
            ].map((type, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    type.icon === '★' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {type.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{type.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Katie Beckett Pathway */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Katie Beckett Pathway</h2>
          <p className="text-gray-600 mb-6">
            If your family income is too high for regular Medicaid, your child may still qualify through the
            <strong> Katie Beckett waiver</strong> (also called TEFRA).
          </p>

          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-6">
            <h3 className="font-semibold text-blue-800 mb-3">Katie Beckett Eligibility</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Child is under 18 years old
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Has a disability or chronic medical condition
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Requires care typically provided in a hospital or nursing facility
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Can be appropriately cared for at home
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Home care costs less than institutional care
              </li>
            </ul>
            <p className="text-blue-800 text-sm mt-4 font-medium">
              Family income is NOT considered for Katie Beckett eligibility.
            </p>
          </div>

          <Link
            href="/waivers"
            className="inline-flex items-center text-primary hover:underline font-medium"
          >
            Learn more about Katie Beckett vs GAPP →
          </Link>
        </div>
      </section>

      {/* PeachCare Note */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">PeachCare vs Medicaid</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-700 mb-4">
              <strong>PeachCare</strong> is Georgia&apos;s CHIP (Children&apos;s Health Insurance Program). It&apos;s separate from Medicaid and <strong>does not qualify for GAPP</strong>.
            </p>
            <p className="text-gray-700 mb-4">
              If your child has PeachCare and needs GAPP services, you may need to:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                Apply for Medicaid through the Katie Beckett waiver (if your child qualifies based on medical need)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                Check if your child qualifies for regular Medicaid (different income limits than PeachCare)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                Contact Georgia DFCS to discuss your options
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Medicaid Requirement FAQs</h2>
          <div className="space-y-4">
            {MEDICAID_FAQS.map((faq, i) => (
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

      {/* Related */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related Resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/gapp-approval-guide"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Complete GAPP Approval Guide</h3>
              <p className="text-sm text-gray-600">Step-by-step approval process.</p>
            </Link>
            <Link
              href="/waivers"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Katie Beckett & TEFRA Guide</h3>
              <p className="text-sm text-gray-600">Compare Medicaid waiver programs.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Have Active Medicaid?</h2>
          <p className="text-gray-600 mb-6">
            Find GAPP providers accepting new patients in your county.
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
