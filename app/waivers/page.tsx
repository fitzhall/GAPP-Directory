import Link from 'next/link'
import { Metadata } from 'next'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

// FAQ data for both display and schema markup
const WAIVER_FAQS = [
  {
    question: 'What is the difference between GAPP and Katie Beckett?',
    answer: 'GAPP (Georgia Pediatric Program) provides in-home nursing and personal care services for medically fragile children. Katie Beckett (TEFRA) is a Medicaid eligibility pathway that allows children with disabilities to qualify for Medicaid based on their own condition, not family income. Many children use Katie Beckett to become eligible for Medicaid, then receive GAPP services.',
  },
  {
    question: 'Can my child be on both Katie Beckett and GAPP?',
    answer: 'Yes! Katie Beckett is often the pathway to Medicaid eligibility, while GAPP is the program that provides the actual nursing services. A child can qualify for Medicaid through Katie Beckett and then receive home nursing through GAPP.',
  },
  {
    question: 'What is TEFRA and how does it relate to Katie Beckett?',
    answer: 'TEFRA (Tax Equity and Fiscal Responsibility Act) is the federal law that created the Katie Beckett option. In Georgia, the Katie Beckett program is our state\'s implementation of TEFRA. These terms are often used interchangeably.',
  },
  {
    question: 'Does my family income matter for Katie Beckett?',
    answer: 'No. Katie Beckett determines eligibility based on the child\'s disability and medical needs only, not family income. This is different from regular Medicaid, which has income limits.',
  },
  {
    question: 'How long does it take to get approved for Katie Beckett in Georgia?',
    answer: 'The Katie Beckett application process typically takes 45-90 days in Georgia, though complex cases may take longer. Having complete medical documentation ready can help speed up the process.',
  },
  {
    question: 'What services does GAPP cover that regular Medicaid doesn\'t?',
    answer: 'GAPP covers private duty nursing (RN and LPN) and personal care services (PCS) in the home. Regular Medicaid may cover some home health, but GAPP specifically provides ongoing, scheduled in-home care for medically fragile children.',
  },
  {
    question: 'What if my child is denied for Katie Beckett or GAPP?',
    answer: 'You have the right to appeal any denial. Common reasons for denial include incomplete documentation or the child not meeting the "institutional level of care" requirement. Working with a patient advocate or requesting a fair hearing can help.',
  },
  {
    question: 'Are there other Medicaid waivers in Georgia for children?',
    answer: 'Yes. Georgia has several waiver programs including NOW (New Options Waiver) and COMP (Comprehensive Supports Waiver) for developmental disabilities. Each program serves different needs and has different eligibility criteria.',
  },
]

export const metadata: Metadata = {
  title: 'Georgia Medicaid Waivers for Children | Katie Beckett, TEFRA & GAPP',
  description: 'Compare Georgia Medicaid waivers for children with special needs. Learn about Katie Beckett (TEFRA), GAPP, and other programs. Find out which waiver is right for your child.',
  keywords: 'Katie Beckett Waiver Georgia, TEFRA Georgia, GAPP vs Katie Beckett, Georgia Medicaid waivers children, medically fragile child Georgia, pediatric Medicaid waiver',
  openGraph: {
    title: 'Georgia Medicaid Waivers for Children | Katie Beckett & GAPP Guide',
    description: 'Complete guide to Georgia Medicaid waivers for children with disabilities. Compare Katie Beckett, TEFRA, and GAPP programs.',
    type: 'article',
  },
}

export default function WaiversPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Schema.org FAQPage */}
      <FAQPageSchema faqs={WAIVER_FAQS} />

      {/* Schema.org Breadcrumb */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Medicaid Waivers', url: 'https://www.georgiagapp.com/waivers' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Georgia Medicaid Waivers for Children with Special Needs
          </h1>
          <p className="text-lg text-gray-600">
            Understanding Katie Beckett, TEFRA, GAPP, and other programs that help medically fragile children receive care at home
          </p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 px-4 bg-gray-50 border-b">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-gray-600 mb-4 font-medium">Jump to:</p>
          <div className="flex flex-wrap gap-2">
            <a href="#katie-beckett" className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors">
              Katie Beckett / TEFRA
            </a>
            <a href="#gapp" className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors">
              GAPP Program
            </a>
            <a href="#comparison" className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors">
              Compare Programs
            </a>
            <a href="#how-to-apply" className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors">
              How to Apply
            </a>
            <a href="#faqs" className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors">
              FAQs
            </a>
          </div>
        </div>
      </section>

      {/* Katie Beckett / TEFRA Section */}
      <section id="katie-beckett" className="py-12 px-4 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is the Katie Beckett Waiver (TEFRA)?</h2>
          <div className="prose prose-lg text-gray-700">
            <p>
              The <strong>Katie Beckett waiver</strong>, also known as <strong>TEFRA</strong> (Tax Equity and Fiscal
              Responsibility Act), is a Medicaid eligibility option for children with disabilities. It allows children
              who need an institutional level of care to qualify for Medicaid based on their own medical condition —
              <em>not their family&apos;s income</em>.
            </p>

            <div className="bg-blue-50 border-l-4 border-primary p-4 my-6">
              <p className="text-primary font-medium mb-1">Key Point</p>
              <p className="text-gray-700 m-0">
                Katie Beckett is an <strong>eligibility pathway</strong> to Medicaid. Once approved, your child
                can access Medicaid services including GAPP nursing care.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Who qualifies for Katie Beckett in Georgia?</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Child is under 18 years old</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Has a disability or chronic medical condition</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Requires care that would normally be provided in a hospital or nursing facility</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Can be appropriately cared for at home</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Home care costs less than institutional care</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Common conditions that may qualify:</h3>
            <div className="grid sm:grid-cols-2 gap-2 mt-4">
              {[
                'Cerebral palsy',
                'Muscular dystrophy',
                'Spina bifida',
                'Severe autism',
                'Traumatic brain injury',
                'Ventilator dependence',
                'Tracheostomy care needs',
                'Tube feeding requirements',
                'Seizure disorders',
                'Genetic conditions',
              ].map((condition, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-700">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></span>
                  <span>{condition}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GAPP Section */}
      <section id="gapp" className="py-12 px-4 bg-gray-50 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is GAPP (Georgia Pediatric Program)?</h2>
          <div className="prose prose-lg text-gray-700">
            <p>
              The <strong>Georgia Pediatric Program (GAPP)</strong> is a Medicaid waiver program that provides
              in-home nursing care and personal care services to medically fragile children. GAPP allows children
              to receive skilled medical care at home instead of in a hospital or nursing facility.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Services covered by GAPP:</h3>
            <div className="grid gap-4 mt-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </span>
                  <h4 className="font-semibold text-gray-900">Skilled Nursing (RN)</h4>
                </div>
                <p className="text-gray-600 text-sm ml-13">
                  Registered nurses providing medical care including medication administration,
                  ventilator management, tracheostomy care, and complex medical monitoring.
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  <h4 className="font-semibold text-gray-900">Licensed Practical Nursing (LPN)</h4>
                </div>
                <p className="text-gray-600 text-sm ml-13">
                  LPNs providing nursing care under RN supervision, including medication
                  administration, wound care, and medical monitoring.
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </span>
                  <h4 className="font-semibold text-gray-900">Personal Care Services (PCS)</h4>
                </div>
                <p className="text-gray-600 text-sm ml-13">
                  Help with daily activities including bathing, dressing, feeding,
                  mobility, and other activities of daily living.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/how-it-works"
                className="inline-flex items-center text-primary hover:underline font-medium"
              >
                Learn more about how GAPP works
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/gapp-approval-guide"
                className="inline-flex items-center text-accent hover:underline font-medium"
              >
                Step-by-step GAPP approval guide
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparison" className="py-12 px-4 scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">GAPP vs Katie Beckett: Key Differences</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900"></th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Katie Beckett (TEFRA)</th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">GAPP</th>
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
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Qualify for Medicaid regardless of family income</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Provide in-home nursing and personal care</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900 bg-gray-50">Income limits</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">No family income limit</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Must have Medicaid (any pathway)</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900 bg-gray-50">Age limit</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Under 18</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Under 21</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900 bg-gray-50">Services provided</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Access to all Medicaid services</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">RN, LPN, and PCS in-home care</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900 bg-gray-50">Key requirement</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Institutional level of care needed</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Medicaid + medical necessity</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900 bg-gray-50">Choose provider?</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Depends on service type</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Yes - choose your GAPP provider</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-800 text-sm">
              <strong>How they work together:</strong> Many families use Katie Beckett to qualify for Medicaid,
              then enroll in GAPP to receive nursing services at home. You can use both programs simultaneously.
            </p>
          </div>
        </div>
      </section>

      {/* Which is Right CTA */}
      <section className="py-12 px-4 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Not sure which program is right for your child?</h2>
          <p className="text-gray-600 mb-6">
            Take our quick screener to see if your child might qualify for GAPP services.
          </p>
          <Link
            href="/screener"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Check Eligibility
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* How to Apply */}
      <section id="how-to-apply" className="py-12 px-4 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Apply for Each Program</h2>

          <div className="space-y-8">
            {/* Katie Beckett Application */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Applying for Katie Beckett (TEFRA)</h3>
              </div>
              <div className="p-6">
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium flex-shrink-0">1</span>
                    <div>
                      <p className="font-medium text-gray-900">Gather medical documentation</p>
                      <p className="text-gray-600 text-sm mt-1">Medical records, diagnoses, treatment plans, and any assessments showing your child&apos;s level of care needs.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium flex-shrink-0">2</span>
                    <div>
                      <p className="font-medium text-gray-900">Contact Georgia DFCS</p>
                      <p className="text-gray-600 text-sm mt-1">Call your local Department of Family and Children Services or visit <a href="https://dfcs.georgia.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">dfcs.georgia.gov</a></p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium flex-shrink-0">3</span>
                    <div>
                      <p className="font-medium text-gray-900">Complete the application</p>
                      <p className="text-gray-600 text-sm mt-1">Submit the Katie Beckett application with all required documentation.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium flex-shrink-0">4</span>
                    <div>
                      <p className="font-medium text-gray-900">Medical evaluation</p>
                      <p className="text-gray-600 text-sm mt-1">Your child will be evaluated to confirm they need an institutional level of care.</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>

            {/* GAPP Application */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Applying for GAPP</h3>
              </div>
              <div className="p-6">
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-medium flex-shrink-0">1</span>
                    <div>
                      <p className="font-medium text-gray-900">Ensure Medicaid eligibility</p>
                      <p className="text-gray-600 text-sm mt-1">Your child must have Georgia Medicaid (through any pathway including Katie Beckett).</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-medium flex-shrink-0">2</span>
                    <div>
                      <p className="font-medium text-gray-900">Get a physician&apos;s order</p>
                      <p className="text-gray-600 text-sm mt-1">Your child&apos;s doctor must document the medical necessity for in-home nursing care.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-medium flex-shrink-0">3</span>
                    <div>
                      <p className="font-medium text-gray-900">Request GAPP evaluation</p>
                      <p className="text-gray-600 text-sm mt-1">Contact Georgia&apos;s Department of Community Health or your care coordinator.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-medium flex-shrink-0">4</span>
                    <div>
                      <p className="font-medium text-gray-900">Choose a provider</p>
                      <p className="text-gray-600 text-sm mt-1">Once approved, you can choose any enrolled GAPP provider. Use our directory to find one.</p>
                    </div>
                  </li>
                </ol>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <Link
                    href="/directory"
                    className="inline-flex items-center text-accent hover:underline font-medium"
                  >
                    Browse GAPP providers in your county
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Waivers */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Other Georgia Medicaid Waivers</h2>
          <p className="text-gray-600 mb-6">
            Georgia offers several other waiver programs for individuals with disabilities:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">NOW Waiver</h3>
              <p className="text-gray-600 text-sm">
                New Options Waiver for individuals with intellectual and developmental disabilities.
                Provides community-based supports and services.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">COMP Waiver</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive Supports Waiver for individuals with significant intellectual and
                developmental disabilities requiring more intensive support.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">ICWP</h3>
              <p className="text-gray-600 text-sm">
                Independent Care Waiver Program for adults with physical disabilities who
                need assistance with daily living activities.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">CCSP</h3>
              <p className="text-gray-600 text-sm">
                Community Care Services Program for elderly and disabled adults who
                need help staying in their homes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faqs" className="py-12 px-4 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {WAIVER_FAQS.map((faq, i) => (
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

      {/* CTA */}
      <section className="py-12 px-4 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Find a GAPP Provider?</h2>
          <p className="text-gray-600 mb-6">
            Browse our directory of verified GAPP providers across Georgia.
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
              href="/quiz"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors"
            >
              Help Me Choose
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
