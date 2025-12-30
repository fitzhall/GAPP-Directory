import Link from 'next/link'
import { Metadata } from 'next'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

const DENIAL_FAQS = [
  {
    question: 'Can I appeal a GAPP denial?',
    answer: 'Yes. You have the right to appeal any GAPP denial. Request a fair hearing through Georgia Medicaid within 90 days of the denial. Your GAPP agency or a patient advocate can help you understand the appeal process.',
  },
  {
    question: 'How long does a GAPP appeal take?',
    answer: 'A standard appeal typically takes 30-90 days. Expedited appeals for urgent medical situations can be resolved faster. During the appeal, gather additional documentation to support your case.',
  },
  {
    question: 'What if my GAPP agency isn\'t helping with the denial?',
    answer: 'If your agency isn\'t responsive, you can contact Georgia Medicaid directly, switch to a different GAPP agency, or seek help from a patient advocate or disability rights organization.',
  },
  {
    question: 'Can I reapply for GAPP after a denial?',
    answer: 'Yes. If your denial was due to missing documentation or correctable issues, you can reapply once those issues are resolved. Work with your agency to address the specific denial reason before resubmitting.',
  },
  {
    question: 'What does "doesn\'t meet institutional level of care" mean?',
    answer: 'This denial means Medicaid determined your child\'s care needs don\'t require the level of care provided in a hospital or nursing facility. To appeal, your physician needs to document more specifically why your child requires skilled nursing care that can\'t be met by a family caregiver alone.',
  },
]

export const metadata: Metadata = {
  title: 'Why GAPP Applications Get Denied (And How to Avoid It) | Georgia',
  description: 'Common reasons GAPP applications get denied in Georgia and how to avoid them. Learn about documentation requirements, Medicaid issues, and how to appeal a denial.',
  keywords: 'GAPP denial reasons, GAPP application denied, Georgia Pediatric Program denied, GAPP appeal, GAPP rejection reasons, why GAPP denied',
  openGraph: {
    title: 'Why GAPP Applications Get Denied (And How to Avoid It)',
    description: 'The most common GAPP denial reasons and exactly how to avoid them. Plus how to appeal if you\'ve been denied.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://georgiagapp.com/why-gapp-applications-get-denied',
  },
}

export default function WhyGAPPApplicationsGetDeniedPage() {
  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={DENIAL_FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://georgiagapp.com' },
          { name: 'GAPP Approval Guide', url: 'https://georgiagapp.com/gapp-approval-guide' },
          { name: 'Why Applications Get Denied', url: 'https://georgiagapp.com/why-gapp-applications-get-denied' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/gapp-approval-guide" className="hover:text-primary">GAPP Approval Guide</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Why Applications Get Denied</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why GAPP Applications Get Denied (And How to Avoid It)
          </h1>
          <p className="text-lg text-gray-600">
            Understanding the most common denial reasons helps you avoid them.
            If you&apos;ve already been denied, this guide explains your options.
          </p>
        </div>
      </section>

      {/* Top Denial Reasons */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top 6 GAPP Denial Reasons</h2>

          <div className="space-y-6">
            {/* Denial 1 */}
            <div className="bg-white rounded-xl border-2 border-red-200 overflow-hidden">
              <div className="bg-red-50 px-6 py-4 border-b border-red-200">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <h3 className="text-lg font-semibold text-red-800">Medicaid Not Active</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  <strong>The problem:</strong> Families contact GAPP agencies before their Medicaid is fully active. Pending, submitted, or "in process" applications don&apos;t count.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    <strong>How to avoid:</strong> Wait until you have your Medicaid ID number and can confirm active status by calling 1-866-211-0950 or checking Georgia Gateway. Do not contact GAPP agencies until Medicaid is confirmed active.
                  </p>
                </div>
                <div className="mt-4">
                  <Link href="/gapp-medicaid-requirements" className="text-primary text-sm font-medium hover:underline">
                    Learn about Medicaid requirements →
                  </Link>
                </div>
              </div>
            </div>

            {/* Denial 2 */}
            <div className="bg-white rounded-xl border-2 border-red-200 overflow-hidden">
              <div className="bg-red-50 px-6 py-4 border-b border-red-200">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <h3 className="text-lg font-semibold text-red-800">Physician Order Doesn&apos;t Document Medical Necessity</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  <strong>The problem:</strong> The doctor&apos;s order doesn&apos;t clearly explain why skilled nursing is medically necessary. Vague language like "needs help at home" isn&apos;t enough.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 text-sm">
                    <strong>How to avoid:</strong> Have your GAPP agency send their specific physician order form to your doctor. They know exactly what language Medicaid requires. The order should specify:
                  </p>
                  <ul className="text-green-700 text-sm mt-2 space-y-1">
                    <li>• Specific diagnosis requiring skilled care</li>
                    <li>• Type of nursing care needed (RN, LPN, PCS)</li>
                    <li>• Why a trained nurse is required (not just a caregiver)</li>
                    <li>• Recommended hours of care</li>
                  </ul>
                </div>
                <p className="text-gray-600 text-sm">
                  <strong>If already denied:</strong> Ask your agency what specific language was missing. Have your doctor submit an amended order with the required details.
                </p>
              </div>
            </div>

            {/* Denial 3 */}
            <div className="bg-white rounded-xl border-2 border-red-200 overflow-hidden">
              <div className="bg-red-50 px-6 py-4 border-b border-red-200">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <h3 className="text-lg font-semibold text-red-800">Child Doesn&apos;t Meet "Institutional Level of Care" Requirement</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  <strong>The problem:</strong> Medicaid determined your child&apos;s care needs could be met by a family caregiver, not a skilled nurse. This is the most difficult denial to overcome.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 text-sm">
                    <strong>How to avoid:</strong> The physician order must clearly document that your child requires care typically provided in a hospital or nursing facility. Key documentation includes:
                  </p>
                  <ul className="text-green-700 text-sm mt-2 space-y-1">
                    <li>• Specific medical procedures requiring nursing skills</li>
                    <li>• Why family members cannot safely perform this care</li>
                    <li>• Risk to child if skilled nursing isn&apos;t provided</li>
                    <li>• Comparison to institutional care requirements</li>
                  </ul>
                </div>
                <p className="text-gray-600 text-sm">
                  <strong>If already denied:</strong> Appeal with additional documentation. Get a letter from specialists explaining why home nursing is essential. Consider contacting a patient advocate.
                </p>
              </div>
            </div>

            {/* Denial 4 */}
            <div className="bg-white rounded-xl border-2 border-amber-200 overflow-hidden">
              <div className="bg-amber-50 px-6 py-4 border-b border-amber-200">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                  <h3 className="text-lg font-semibold text-amber-800">Missing or Incomplete Documentation</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  <strong>The problem:</strong> The prior authorization was submitted with missing documents, and the request for additional information was missed or not responded to in time.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    <strong>How to avoid:</strong> Respond to all requests for additional documentation within 24-48 hours. Stay in communication with your agency about the status of your application. Provide all requested records upfront.
                  </p>
                </div>
              </div>
            </div>

            {/* Denial 5 */}
            <div className="bg-white rounded-xl border-2 border-amber-200 overflow-hidden">
              <div className="bg-amber-50 px-6 py-4 border-b border-amber-200">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
                  <h3 className="text-lg font-semibold text-amber-800">Agency Never Submitted Prior Authorization</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  <strong>The problem:</strong> Some agencies are slow to submit or never actually submit the prior authorization. Families wait, thinking they&apos;re in the queue, when nothing has happened.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    <strong>How to avoid:</strong> After 1 week, ask your agency to confirm they&apos;ve submitted the prior authorization. Ask for the submission date and any reference numbers. If they can&apos;t confirm, consider switching agencies.
                  </p>
                </div>
                <div className="mt-4">
                  <Link href="/directory" className="text-primary text-sm font-medium hover:underline">
                    Find responsive GAPP providers →
                  </Link>
                </div>
              </div>
            </div>

            {/* Denial 6 */}
            <div className="bg-white rounded-xl border-2 border-amber-200 overflow-hidden">
              <div className="bg-amber-50 px-6 py-4 border-b border-amber-200">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">6</span>
                  <h3 className="text-lg font-semibold text-amber-800">Child Aged Out of Eligibility</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  <strong>The problem:</strong> GAPP serves children under 21. If your child is approaching 21 during the application process, they may age out before approval.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    <strong>How to avoid:</strong> If your child is close to 21, start the process as early as possible and communicate the timeline urgency to your agency. Ask about adult waiver programs (like ICWP or CCSP) as alternatives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Appeal */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Appeal a GAPP Denial</h2>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium flex-shrink-0">1</span>
                <div>
                  <p className="font-medium text-gray-900">Request the denial in writing</p>
                  <p className="text-gray-600 text-sm mt-1">Ask your agency for the written denial notice. It should explain the specific reason for denial and your appeal rights.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium flex-shrink-0">2</span>
                <div>
                  <p className="font-medium text-gray-900">Request a fair hearing within 90 days</p>
                  <p className="text-gray-600 text-sm mt-1">Contact Georgia Medicaid to request a fair hearing. You can call 1-866-211-0950 or submit a written request.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium flex-shrink-0">3</span>
                <div>
                  <p className="font-medium text-gray-900">Gather additional documentation</p>
                  <p className="text-gray-600 text-sm mt-1">Get letters from specialists, updated physician orders, or any other documentation that addresses the denial reason.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium flex-shrink-0">4</span>
                <div>
                  <p className="font-medium text-gray-900">Consider getting help</p>
                  <p className="text-gray-600 text-sm mt-1">Patient advocates, disability rights organizations, or attorneys specializing in Medicaid can help with complex appeals.</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="font-semibold text-blue-800 mb-2">Georgia Disability Rights Resources</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>
                <strong>Georgia Advocacy Office:</strong> 1-800-537-2329 (free advocacy for people with disabilities)
              </li>
              <li>
                <strong>Georgia Legal Services:</strong> 1-833-457-7529 (free legal help for qualifying families)
              </li>
              <li>
                <strong>Parent to Parent of Georgia:</strong> 1-800-229-2038 (family support and navigation)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Prevention Checklist */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Prevention Checklist</h2>
          <p className="text-gray-600 mb-6">Before submitting your GAPP application, confirm:</p>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ul className="space-y-3">
              {[
                'Medicaid is ACTIVE (not pending) with an ID number',
                'Physician order clearly documents medical necessity',
                'Order specifies skilled nursing (RN/LPN) or PCS needed',
                'Order explains why a nurse is required vs. a caregiver',
                'All supporting medical records are provided',
                'Agency confirmed they\'ve submitted prior authorization',
                'You\'ve responded to all documentation requests',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded flex-shrink-0 mt-0.5"></div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Denial & Appeal FAQs</h2>
          <div className="space-y-4">
            {DENIAL_FAQS.map((faq, i) => (
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
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related Resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/gapp-approval-guide"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Complete GAPP Approval Guide</h3>
              <p className="text-sm text-gray-600">Follow the correct process from the start.</p>
            </Link>
            <Link
              href="/gapp-medicaid-requirements"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Medicaid Requirements</h3>
              <p className="text-sm text-gray-600">Ensure your Medicaid is properly set up.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Try Again?</h2>
          <p className="text-gray-600 mb-6">
            Find responsive GAPP providers who can help with your application.
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
