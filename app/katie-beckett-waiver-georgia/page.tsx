import Link from 'next/link'
import { Metadata } from 'next'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

const KATIE_BECKETT_FAQS = [
  {
    question: 'What is the Katie Beckett waiver in Georgia?',
    answer: 'The Katie Beckett waiver (also called TEFRA) is a Medicaid eligibility pathway in Georgia that allows children with disabilities to qualify for Medicaid based on their medical condition alone, regardless of family income. This means even families with higher incomes can get Medicaid coverage for their medically fragile child.',
  },
  {
    question: 'What are the Katie Beckett eligibility requirements in Georgia?',
    answer: 'To qualify for Katie Beckett in Georgia, your child must be under 18 years old, have a disability or chronic medical condition, require care at an institutional level (hospital or nursing facility), be able to be safely cared for at home, and home care must cost less than institutional care.',
  },
  {
    question: 'Does family income affect Katie Beckett eligibility?',
    answer: 'No. Unlike regular Medicaid, Katie Beckett determines eligibility based solely on the child\'s disability and care needs, not on family income or assets. This is one of the main benefits of the program.',
  },
  {
    question: 'How long does Katie Beckett approval take in Georgia?',
    answer: 'The Katie Beckett application process in Georgia typically takes 45-90 days. Having complete medical documentation ready can speed up the process. Recent policy changes now authorize approvals for a minimum of two years.',
  },
  {
    question: 'What is the difference between Katie Beckett and GAPP?',
    answer: 'Katie Beckett is a Medicaid eligibility pathway - it gets your child ON Medicaid. GAPP (Georgia Pediatric Program) is a service program that provides in-home nursing care. Many families use Katie Beckett to qualify for Medicaid, then use GAPP for nursing services.',
  },
  {
    question: 'Can my child have both Katie Beckett and GAPP?',
    answer: 'Yes! They work together. Katie Beckett gets your child Medicaid coverage, and once on Medicaid, your child can receive GAPP services (in-home nursing and personal care) if medically necessary.',
  },
  {
    question: 'What conditions qualify for Katie Beckett in Georgia?',
    answer: 'Qualifying conditions include cerebral palsy, muscular dystrophy, spina bifida, severe autism, traumatic brain injury, ventilator dependence, tracheostomy needs, feeding tube requirements, seizure disorders, genetic conditions, and other conditions requiring institutional-level care.',
  },
  {
    question: 'How do I apply for Katie Beckett in Georgia?',
    answer: 'Contact the Centralized Katie Beckett Medicaid Team at 678-248-7449. You\'ll need to gather medical documentation, complete the application, and your child will undergo a medical evaluation to confirm they need institutional-level care.',
  },
  {
    question: 'What if my Katie Beckett application is denied?',
    answer: 'You have the right to appeal any denial. Common denial reasons include incomplete documentation or not meeting the institutional level of care requirement. You can request a fair hearing to appeal the decision.',
  },
  {
    question: 'What services does my child get with Katie Beckett Medicaid?',
    answer: 'Once approved for Medicaid through Katie Beckett, your child has access to all Medicaid services including doctor visits, hospital care, medications, therapy services, medical equipment, and specialized programs like GAPP for in-home nursing.',
  },
]

const QUALIFYING_CONDITIONS = [
  'Cerebral palsy',
  'Muscular dystrophy',
  'Spina bifida',
  'Severe autism spectrum disorder',
  'Traumatic brain injury',
  'Ventilator dependence',
  'Tracheostomy care needs',
  'G-tube/feeding tube requirements',
  'Seizure disorders requiring monitoring',
  'Genetic syndromes',
  'Congenital heart defects',
  'Chronic respiratory conditions',
  'Spinal cord injuries',
  'Cancer requiring ongoing treatment',
  'Organ transplant recipients',
]

export const metadata: Metadata = {
  title: 'Katie Beckett Waiver Georgia: Eligibility, Application & Requirements (2025)',
  description: 'Complete guide to the Katie Beckett waiver in Georgia. Learn eligibility requirements, how to apply, qualifying conditions, and how Katie Beckett connects to GAPP nursing services. Updated 2025.',
  keywords: 'Katie Beckett waiver Georgia, Katie Beckett eligibility Georgia, TEFRA Georgia, Katie Beckett application Georgia, Katie Beckett requirements, Georgia Medicaid disabled child, Katie Beckett vs GAPP',
  openGraph: {
    title: 'Katie Beckett Waiver Georgia: Complete Eligibility & Application Guide',
    description: 'Everything you need to know about the Katie Beckett waiver in Georgia. Eligibility requirements, application process, and connection to GAPP nursing services.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/katie-beckett-waiver-georgia',
  },
}

export default function KatieBeckettWaiverGeorgiaPage() {
  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={KATIE_BECKETT_FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Katie Beckett Waiver Georgia', url: 'https://www.georgiagapp.com/katie-beckett-waiver-georgia' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Katie Beckett Waiver Georgia</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Katie Beckett Waiver in Georgia
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            The Katie Beckett waiver helps children with disabilities qualify for Medicaid regardless of family income. Learn if your child qualifies and how to apply.
          </p>

          {/* Key benefit callout */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-green-900">No Income Limits</p>
                <p className="text-green-800 text-sm">Unlike regular Medicaid, Katie Beckett eligibility is based only on your child&apos;s medical needs — not your family&apos;s income.</p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-3">
            <a href="#eligibility" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              Eligibility Requirements
            </a>
            <a href="#how-to-apply" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              How to Apply
            </a>
            <a href="#vs-gapp" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              Katie Beckett vs GAPP
            </a>
            <a href="#faqs" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              FAQs
            </a>
          </div>
        </div>
      </section>

      {/* What is Katie Beckett */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            What is the Katie Beckett Waiver?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              The <strong>Katie Beckett waiver</strong> (officially known as <strong>TEFRA</strong> — Tax Equity and Fiscal Responsibility Act) is a Medicaid eligibility option that allows children with significant disabilities to qualify for Medicaid based on their own medical condition, <em>regardless of their parents&apos; income</em>.
            </p>
            <p>
              Named after Katie Beckett, a child who was ventilator-dependent and could only receive Medicaid coverage while in the hospital, this program was created to allow medically fragile children to receive care at home while still qualifying for Medicaid benefits.
            </p>
            <p>
              In Georgia, the Katie Beckett program is administered by the Department of Community Health and provides a pathway for families who might not otherwise qualify for Medicaid due to income to get coverage for their child with disabilities.
            </p>

            <div className="bg-blue-50 border-l-4 border-primary p-4 my-6 not-prose">
              <p className="text-primary font-semibold mb-1">Key Point</p>
              <p className="text-gray-700">
                Katie Beckett is an <strong>eligibility pathway</strong> to Medicaid — it&apos;s how your child qualifies. Once on Medicaid, you can access services like <Link href="/gapp-providers-georgia" className="text-primary hover:underline">GAPP nursing care</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Requirements */}
      <section id="eligibility" className="py-12 sm:py-16 px-4 bg-gray-50 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Katie Beckett Eligibility Requirements in Georgia
          </h2>

          <p className="text-gray-600 mb-8">
            To qualify for the Katie Beckett waiver in Georgia, your child must meet all of the following criteria:
          </p>

          <div className="space-y-4 mb-8">
            {[
              { title: 'Age Requirement', desc: 'Child must be under 18 years old' },
              { title: 'Disability Requirement', desc: 'Child must have a disability as defined by Section 1614 of the Social Security Act' },
              { title: 'Level of Care', desc: 'Child must require care at an institutional level (hospital, nursing facility, or ICF)' },
              { title: 'Home Care Appropriate', desc: 'Child must be able to be safely and appropriately cared for at home' },
              { title: 'Cost Effective', desc: 'Home care must cost less than institutional care (this is almost always the case)' },
              { title: 'Georgia Resident', desc: 'Child must be a resident of Georgia' },
            ].map((req, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-4 border border-gray-200">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{req.title}</p>
                  <p className="text-gray-600 text-sm">{req.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-amber-900">Important Note</p>
                <p className="text-amber-800 text-sm">Family income and assets are NOT considered for Katie Beckett eligibility. Your income does not disqualify your child if they meet the medical criteria.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualifying Conditions */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Conditions That May Qualify for Katie Beckett
          </h2>
          <p className="text-gray-600 mb-6">
            The following conditions commonly qualify for Katie Beckett in Georgia. Eligibility is based on level of care needed, not specific diagnoses:
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {QUALIFYING_CONDITIONS.map((condition, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700 text-sm">{condition}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-500 text-sm mt-6">
            This is not an exhaustive list. Any condition requiring institutional-level care may qualify. Contact the Katie Beckett team if you&apos;re unsure about your child&apos;s eligibility.
          </p>
        </div>
      </section>

      {/* How to Apply */}
      <section id="how-to-apply" className="py-12 sm:py-16 px-4 bg-gray-50 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            How to Apply for Katie Beckett in Georgia
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Apply for SSI First (Required)</h3>
                  <p className="text-gray-600 mb-3">
                    You must apply for Supplemental Security Income (SSI) and receive a denial before applying for Katie Beckett. This establishes that your child doesn&apos;t qualify for Medicaid through SSI.
                  </p>
                  <p className="text-gray-600 text-sm">
                    Call Social Security at <strong>1-800-772-1213</strong> to apply for SSI. If approved for SSI, you don&apos;t need Katie Beckett — you&apos;ll automatically get Medicaid.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Gather Medical Documentation</h3>
                  <p className="text-gray-600 mb-3">
                    Collect comprehensive medical records including:
                  </p>
                  <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                    <li>Diagnosis documentation from physicians</li>
                    <li>Hospital discharge summaries</li>
                    <li>Current treatment plans</li>
                    <li>Therapy evaluations (PT, OT, speech)</li>
                    <li>Documentation of daily care needs</li>
                    <li>Any nursing or personal care requirements</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact the Katie Beckett Team</h3>
                  <p className="text-gray-600 mb-3">
                    Reach out to Georgia&apos;s Centralized Katie Beckett Medicaid Team:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    <p className="font-medium text-gray-900">Centralized Katie Beckett Medicaid Team</p>
                    <p className="text-gray-600">5815 Live Oak Parkway, Suite D-2</p>
                    <p className="text-gray-600">Norcross, GA 30093</p>
                    <p className="text-gray-600 mt-2">
                      <strong>Phone:</strong> 678-248-7449<br />
                      <strong>Fax:</strong> 678-248-7459
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Complete the Application</h3>
                  <p className="text-gray-600">
                    Submit the Katie Beckett application along with your SSI denial letter and all medical documentation. The team will review your application and may request additional information.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">5</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Medical Level of Care Evaluation</h3>
                  <p className="text-gray-600">
                    Your child will be evaluated to confirm they require care at an institutional level. This evaluation determines if home care is appropriate and cost-effective compared to facility care.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">6</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Approval & Next Steps</h3>
                  <p className="text-gray-600 mb-3">
                    Once approved, your child will have Medicaid coverage. Approvals are now authorized for a minimum of <strong>two years</strong>. You can then access services including:
                  </p>
                  <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                    <li>Doctor visits and specialists</li>
                    <li>Medications</li>
                    <li>Medical equipment</li>
                    <li>Therapy services</li>
                    <li><Link href="/gapp-providers-georgia" className="text-primary hover:underline">GAPP in-home nursing services</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-900 font-medium mb-1">Timeline</p>
            <p className="text-blue-800 text-sm">
              The Katie Beckett application process typically takes <strong>45-90 days</strong> in Georgia. Having complete documentation ready can help speed up approval.
            </p>
          </div>
        </div>
      </section>

      {/* Katie Beckett vs GAPP */}
      <section id="vs-gapp" className="py-12 sm:py-16 px-4 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Katie Beckett vs GAPP: What&apos;s the Difference?
          </h2>

          <p className="text-gray-600 mb-8">
            Many families confuse Katie Beckett and GAPP, but they serve different purposes and often work together:
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900"></th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-primary">Katie Beckett</th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-accent">GAPP</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900 bg-gray-50">What it is</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Medicaid eligibility pathway</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Service delivery program</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900 bg-gray-50">Purpose</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Gets your child ON Medicaid</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Provides in-home nursing care</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900 bg-gray-50">Income limits</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">No family income limit</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Must have Medicaid first</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900 bg-gray-50">Age limit</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Under 18</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Under 21</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900 bg-gray-50">Services</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Access to all Medicaid services</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">RN, LPN, and PCS in-home care</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900 bg-gray-50">Choose provider?</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">N/A</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Yes - you choose your provider</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-semibold text-green-900 mb-2">How They Work Together</h3>
            <div className="flex items-center gap-2 text-green-800">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">Katie Beckett</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">Medicaid</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="px-3 py-1 bg-accent text-white rounded-full text-sm font-medium">GAPP Services</span>
              </div>
            </div>
            <p className="text-green-800 text-sm mt-3">
              Many Georgia families use Katie Beckett to qualify for Medicaid, then enroll in GAPP to receive in-home nursing care for their medically fragile child.
            </p>
          </div>
        </div>
      </section>

      {/* After Approval CTA */}
      <section className="py-12 sm:py-16 px-4 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Approved for Katie Beckett? Find a GAPP Provider
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Once your child has Medicaid through Katie Beckett, you can access GAPP nursing services. Search our directory of verified GAPP providers in Georgia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/directory"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Find GAPP Providers
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href="/gapp-approval-guide"
              className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white/10 transition-colors"
            >
              GAPP Approval Guide
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-12 sm:py-16 px-4 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Katie Beckett Waiver Georgia: FAQs
          </h2>
          <div className="space-y-4">
            {KATIE_BECKETT_FAQS.map((faq, index) => (
              <details key={index} className="group bg-gray-50 rounded-xl">
                <summary className="flex justify-between items-center cursor-pointer p-5 font-semibold text-gray-900">
                  {faq.question}
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-gray-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Related Resources</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/gapp-providers-georgia" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1">GAPP Providers</h3>
              <p className="text-sm text-gray-600">Find verified providers in Georgia</p>
            </Link>
            <Link href="/gapp-approval-guide" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1">GAPP Approval Guide</h3>
              <p className="text-sm text-gray-600">Step-by-step approval process</p>
            </Link>
            <Link href="/waivers" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1">All Georgia Waivers</h3>
              <p className="text-sm text-gray-600">Compare GAPP, Katie Beckett & more</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            This information is provided for educational purposes only and is not legal or medical advice. For official Katie Beckett eligibility information, contact Georgia&apos;s Centralized Katie Beckett Medicaid Team at 678-248-7449.
          </p>
        </div>
      </section>
    </div>
  )
}
