import Link from 'next/link'
import { Metadata } from 'next'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

const TIMELINE_FAQS = [
  {
    question: 'Can the GAPP approval process be expedited?',
    answer: 'In urgent cases (hospital discharge, immediate medical need), some agencies can request expedited review. Talk to your agency about your situation. Having all documentation ready upfront is the best way to speed up the process.',
  },
  {
    question: 'What if my approval takes longer than 6 weeks?',
    answer: 'If you haven\'t heard back after 6 weeks, contact your agency to check on the prior authorization status. Common causes of extended delays include missing documentation, Medicaid issues, or high volume at the state level.',
  },
  {
    question: 'How long does prior authorization approval take?',
    answer: 'Georgia Medicaid typically processes GAPP prior authorizations within 2-3 weeks. Complex cases may take longer. Your agency should be able to check the status.',
  },
  {
    question: 'Does the timeline differ for RN vs LPN vs PCS?',
    answer: 'The approval timeline is similar for all service types. However, finding available nurses may take longer for RN services or in rural areas due to staffing shortages.',
  },
]

export const metadata: Metadata = {
  title: 'GAPP Approval Timeline: How Long Does It Take? | Georgia Pediatric Program',
  description: 'Learn how long GAPP approval takes in Georgia. Step-by-step timeline from Medicaid confirmation to care starting. Typical process is 2-6 weeks.',
  keywords: 'GAPP approval time, how long GAPP takes, Georgia Pediatric Program timeline, GAPP prior authorization time, GAPP waiting period',
  openGraph: {
    title: 'GAPP Approval Timeline: How Long Does It Take?',
    description: 'Complete breakdown of the GAPP approval timeline in Georgia. Know what to expect at each step.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://georgiagapp.com/gapp-approval-timeline',
  },
}

export default function GAPPApprovalTimelinePage() {
  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={TIMELINE_FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://georgiagapp.com' },
          { name: 'GAPP Approval Guide', url: 'https://georgiagapp.com/gapp-approval-guide' },
          { name: 'Approval Timeline', url: 'https://georgiagapp.com/gapp-approval-timeline' },
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
            <span className="text-gray-900">Timeline</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            GAPP Approval Timeline: How Long Does It Take?
          </h1>
          <p className="text-lg text-gray-600">
            The typical GAPP approval process takes <strong>2-6 weeks</strong> from start to care beginning.
            Here&apos;s what to expect at each step.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-8 px-4 bg-gray-50 border-b">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Overview</h2>
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-3xl font-bold text-primary">2-6</span>
                <p className="text-sm text-gray-600">Weeks Total</p>
              </div>
              <div>
                <span className="text-3xl font-bold text-accent">5</span>
                <p className="text-sm text-gray-600">Main Steps</p>
              </div>
              <div>
                <span className="text-3xl font-bold text-green-600">1-2</span>
                <p className="text-sm text-gray-600">Weeks to Start Care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Step-by-Step Timeline</h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 hidden sm:block"></div>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="relative flex gap-6">
                <div className="hidden sm:flex w-8 h-8 bg-primary text-white rounded-full items-center justify-center font-bold flex-shrink-0 z-10">
                  1
                </div>
                <div className="flex-1 bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Confirm Medicaid Status</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Same Day</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    Verify your child has active Georgia Medicaid with an ID number. This can be done immediately by calling 1-866-211-0950 or checking Georgia Gateway.
                  </p>
                  <div className="text-xs text-gray-500">
                    <strong>Delay risk:</strong> If Medicaid is pending, wait until active (can take 30-45 days).
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex gap-6">
                <div className="hidden sm:flex w-8 h-8 bg-primary text-white rounded-full items-center justify-center font-bold flex-shrink-0 z-10">
                  2
                </div>
                <div className="flex-1 bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Get Physician Order</h3>
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">3-7 Days</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    Your doctor completes the order documenting medical necessity. Timeline depends on your doctor&apos;s responsiveness. Pro tip: Have your GAPP agency send the form directly to the doctor.
                  </p>
                  <div className="text-xs text-gray-500">
                    <strong>Delay risk:</strong> Incomplete orders require revision (add 1-2 weeks).
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex gap-6">
                <div className="hidden sm:flex w-8 h-8 bg-primary text-white rounded-full items-center justify-center font-bold flex-shrink-0 z-10">
                  3
                </div>
                <div className="flex-1 bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Choose GAPP Agency</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">1-3 Days</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    Research and contact agencies that serve your county. Verify they&apos;re accepting new patients and have nurses available for your needed shifts.
                  </p>
                  <div className="text-xs text-gray-500">
                    <strong>Delay risk:</strong> No nurse availability in your area (may need to try multiple agencies).
                  </div>
                  <div className="mt-3">
                    <Link href="/directory" className="text-primary text-sm font-medium hover:underline">
                      Find providers in your county →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex gap-6">
                <div className="hidden sm:flex w-8 h-8 bg-primary text-white rounded-full items-center justify-center font-bold flex-shrink-0 z-10">
                  4
                </div>
                <div className="flex-1 bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Prior Authorization Submitted & Approved</h3>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">2-3 Weeks</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    Your agency submits the prior authorization to Georgia Medicaid. This is the longest wait in the process. Medicaid reviews and approves (or requests more information).
                  </p>
                  <div className="text-xs text-gray-500">
                    <strong>Delay risk:</strong> Missing documentation, Medicaid requests clarification (add 1-2 weeks).
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative flex gap-6">
                <div className="hidden sm:flex w-8 h-8 bg-accent text-white rounded-full items-center justify-center font-bold flex-shrink-0 z-10">
                  5
                </div>
                <div className="flex-1 bg-accent/5 rounded-xl border border-accent/20 p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Intake & Care Begins</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">1-2 Weeks</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    Once approved, your agency schedules an intake assessment, assigns nurses, and begins care. Timeline depends on nurse availability and scheduling.
                  </p>
                  <div className="text-xs text-accent">
                    <strong>You&apos;ve made it!</strong> Care typically starts within 1-2 weeks of approval.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Causes Delays */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Causes Delays?</h2>

          <div className="space-y-4">
            {[
              {
                cause: 'Medicaid not yet active',
                impact: '+30-45 days',
                solution: 'Wait until you have your Medicaid ID before contacting agencies.',
              },
              {
                cause: 'Incomplete physician order',
                impact: '+1-2 weeks',
                solution: 'Have your agency send the correct form to your doctor.',
              },
              {
                cause: 'Medicaid requests additional documentation',
                impact: '+1-2 weeks',
                solution: 'Respond to requests within 24-48 hours.',
              },
              {
                cause: 'No nurses available in your county',
                impact: 'Variable',
                solution: 'Contact multiple agencies and ask about availability upfront.',
              },
              {
                cause: 'Agency slow to submit prior auth',
                impact: '+1-2 weeks',
                solution: 'Follow up weekly and consider switching agencies if unresponsive.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{item.cause}</h3>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">{item.impact}</span>
                </div>
                <p className="text-gray-600 text-sm">
                  <strong>How to avoid:</strong> {item.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Timeline FAQs</h2>
          <div className="space-y-4">
            {TIMELINE_FAQS.map((faq, i) => (
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
              href="/why-gapp-applications-get-denied"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Why Applications Get Denied</h3>
              <p className="text-sm text-gray-600">Avoid common mistakes.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start the Process?</h2>
          <p className="text-gray-600 mb-6">
            Find GAPP providers accepting new patients in your county.
          </p>
          <Link
            href="/directory"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
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
