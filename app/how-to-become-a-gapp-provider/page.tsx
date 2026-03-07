import Link from 'next/link'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

// FAQ data for schema markup and display
const PROVIDER_FAQS = [
  {
    question: 'How long does it take to become a GAPP provider?',
    answer: 'Plan for 6-12 months total. The DBHDD home health license takes 3-6 months. Medicaid enrollment takes another 60-90 days after that. Some agencies get through faster, but most hit at least one delay along the way.',
  },
  {
    question: 'What licenses do I need to start a GAPP agency in Georgia?',
    answer: 'You need a DBHDD home health agency license and active Georgia Medicaid enrollment. You also need general business registration with the Georgia Secretary of State, liability insurance, and workers compensation insurance for your staff.',
  },
  {
    question: 'How much does it cost to start a GAPP home health agency?',
    answer: 'Budget $50,000 to $150,000 for startup costs. That covers DBHDD licensing fees, office space, insurance, initial staffing, training, and operating capital to cover the gap before Medicaid payments start coming in. Medicaid pays 30-60 days after you submit claims.',
  },
  {
    question: 'Can an individual nurse become a GAPP provider?',
    answer: 'No. GAPP services are provided through licensed home health agencies, not individual nurses. You need to either start your own agency or work for an existing one. Starting an agency requires a DBHDD license, Medicaid enrollment, and a full compliance program.',
  },
  {
    question: 'How do GAPP agencies get paid?',
    answer: 'GAPP agencies bill Georgia Medicaid directly. Reimbursement rates vary by service type: RN, LPN, and PCS each have different rates. Medicaid pays on a fee-for-service basis, typically 30-60 days after you submit a clean claim. Late or rejected claims take longer.',
  },
  {
    question: 'How do I get listed in the GAPP provider directory?',
    answer: 'Go to georgiagapp.com/providers and claim your listing. If your agency is already in our database, you can claim it for free. If not, request a new listing. Featured listings ($99/month) get top placement in search results and callback routing from families.',
  },
]

export const metadata: Metadata = {
  title: 'How to Become a GAPP Provider in Georgia (2026 Guide)',
  description: 'Step-by-step guide to becoming a GAPP provider in Georgia. DBHDD licensing, Medicaid enrollment, and how to list your agency in the provider directory.',
  keywords: 'become GAPP provider Georgia, GAPP agency requirements, DBHDD home health license, Georgia Medicaid enrollment, GAPP provider directory listing',
  openGraph: {
    title: 'How to Become a GAPP Provider in Georgia',
    description: 'DBHDD licensing, Medicaid enrollment, and listing your agency. The complete guide for home health agencies.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/how-to-become-a-gapp-provider',
  },
}

// Get provider stats for the directory embed
async function getProviderStats() {
  const { data, error } = await supabase
    .from('providers')
    .select('id, services_offered, accepting_new_patients, is_verified')
    .eq('is_active', true)

  if (error || !data) {
    return { total: 0, accepting: 0, verified: 0 }
  }

  return {
    total: data.length,
    accepting: data.filter(p => p.accepting_new_patients).length,
    verified: data.filter(p => p.is_verified).length,
  }
}

export default async function HowToBecomeGAPPProviderPage() {
  const stats = await getProviderStats()

  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={PROVIDER_FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Become a GAPP Provider', url: 'https://www.georgiagapp.com/how-to-become-a-gapp-provider' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Become a GAPP Provider</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How to become a GAPP provider in Georgia
          </h1>
          <p className="text-lg text-gray-600">
            A step-by-step guide to starting or expanding a home health agency that provides GAPP services.
            From DBHDD licensing to your first patient.
          </p>
        </div>
      </section>

      {/* Who this is for */}
      <section className="py-8 px-4 bg-gray-50 border-b">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-gray-600 mb-3 font-medium">This guide is for:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Home health agency owners',
              'Nurses starting an agency',
              'Existing agencies expanding to GAPP',
              'Healthcare entrepreneurs',
            ].map((audience, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
              >
                {audience}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements checklist */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What you need before you start</h2>
          <p className="text-gray-600 mb-6">
            These are the baseline requirements. Missing any one of them will stall your application.
          </p>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ul className="space-y-3">
              {[
                { text: 'DBHDD home health agency license', critical: true },
                { text: 'Active Georgia Medicaid provider enrollment', critical: true },
                { text: 'General and professional liability insurance', critical: true },
                { text: 'Qualified nursing and PCS staff', critical: false },
                { text: 'Physical office in Georgia', critical: false },
                { text: 'Quality assurance program', critical: false },
              ].map((req, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${req.critical ? 'text-amber-500' : 'text-accent'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">
                    {req.text}
                    {req.critical && <span className="text-amber-600 text-sm ml-2">(required first)</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">The 5 steps to becoming a GAPP provider</h2>
          <p className="text-gray-600 mb-8">
            Do these in order. Each step depends on the one before it.
          </p>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">1</span>
                  <h3 className="text-lg font-semibold text-white">Get your DBHDD home health agency license</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  The Georgia Department of Behavioral Health and Developmental Disabilities (DBHDD) licenses home health agencies.
                  You cannot bill Medicaid for GAPP services without this license.
                </p>
                <p className="text-gray-700 mb-4">
                  The application process takes 3-6 months. You will need to submit policies and procedures, proof of insurance,
                  staff credentials, and pass a site survey of your office.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 text-sm">
                    <strong>Common delay:</strong> Incomplete policy manuals. DBHDD has specific requirements for infection control,
                    emergency procedures, and patient rights documentation. Get these right before you submit.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">2</span>
                  <h3 className="text-lg font-semibold text-white">Enroll as a Georgia Medicaid provider</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Once you have your DBHDD license, apply for Medicaid enrollment through the Georgia MMIS portal.
                  This is a separate process from DBHDD licensing.
                </p>
                <p className="text-gray-700 mb-4">
                  Enrollment takes 60-90 days. You will need your DBHDD license number, NPI number, tax ID,
                  and proof of liability insurance.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Good to know:</strong> You can start the Medicaid application while your DBHDD license is in final review.
                    But you cannot receive your Medicaid provider number until the DBHDD license is issued.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">3</span>
                  <h3 className="text-lg font-semibold text-white">Set up operations</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  While waiting for Medicaid enrollment, get your operations ready. You need staff, training systems, and a billing process.
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    'Hire RNs, LPNs, or PCS aides (depending on services you plan to offer)',
                    'Set up an electronic health records (EHR) system',
                    'Create a training program for new staff',
                    'Build a billing and claims submission process',
                    'Establish relationships with pediatricians and hospitals in your service area',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-gray-700">
                  Staffing is the hardest part. There is a nursing shortage in Georgia, especially in rural counties.
                  Start recruiting before your Medicaid enrollment comes through.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">4</span>
                  <h3 className="text-lg font-semibold text-white">Start accepting GAPP patients</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  With your DBHDD license and Medicaid enrollment active, you can accept referrals. Families or case managers
                  will contact you. You then submit a prior authorization to Medicaid for each patient.
                </p>
                <p className="text-gray-700 mb-4">
                  The prior authorization process requires a physician order and documentation of medical necessity.
                  Most agencies handle this paperwork for the family.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    <strong>Where patients come from:</strong> Hospital discharge planners, pediatricians, case managers, and family word-of-mouth.
                    Getting listed in directories like ours helps families find you.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-accent px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-accent rounded-full flex items-center justify-center font-bold">5</span>
                  <h3 className="text-lg font-semibold text-white">List your agency in the directory</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Families search our directory to find GAPP providers in their county.
                  {stats.total > 0
                    ? ` Right now, ${stats.total} agencies are listed and ${stats.accepting} are accepting new patients.`
                    : ' Get your agency in front of families who need your services.'}
                </p>
                <p className="text-gray-700 mb-4">
                  Claiming your listing is free. You get a verified profile with your counties served, services offered, and contact information.
                  Featured listings ($99/month) show up first in search results and get callback requests routed directly to you.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    href="/providers"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors text-sm"
                  >
                    Claim your listing
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/providers"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Get Featured for $99/mo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory CTA with stats */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-accent/10 to-blue-50 rounded-xl border border-accent/20 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Get found by Georgia families</h2>
            <p className="text-gray-600 mb-4">
              Families use our directory every day to find GAPP providers in their county.
              {stats.total > 0 && ` ${stats.total} agencies are listed. ${stats.accepting} are accepting new patients.`}
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.total || '300+'}</div>
                <div className="text-xs text-gray-500">Agencies listed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.accepting || '100+'}</div>
                <div className="text-xs text-gray-500">Accepting patients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">159</div>
                <div className="text-xs text-gray-500">Georgia counties</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                href="/providers"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                Claim Your Listing
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/directory"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                See who&apos;s listed
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What GAPP agencies do day-to-day */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What GAPP agencies do day-to-day</h2>
          <p className="text-gray-600 mb-6">
            Running a GAPP agency is part healthcare, part logistics. Here is what a typical week looks like.
          </p>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Scheduling and staffing</h3>
              <p className="text-gray-700 text-sm">
                You match nurses to patient shifts based on location, skill level, and family preferences.
                When a nurse calls out, you find a replacement. This is the biggest daily headache for most agencies.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Managing authorizations</h3>
              <p className="text-gray-700 text-sm">
                Each patient has approved hours from Medicaid. You track those hours, submit renewals before they expire,
                and handle any changes in the care plan. Miss a renewal and you cannot bill for services.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Coordinating with families</h3>
              <p className="text-gray-700 text-sm">
                Families count on you. You communicate about schedule changes, nurse assignments, and care updates.
                Good communication is what separates agencies that retain patients from those that lose them.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Billing and compliance</h3>
              <p className="text-gray-700 text-sm">
                You submit claims to Medicaid, follow up on rejected claims, and maintain documentation for audits.
                Medicaid audits happen. Your records need to be clean.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/directory"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Provider directory</h3>
              <p className="text-sm text-gray-600">Browse all GAPP providers listed by county and service type.</p>
            </Link>
            <Link
              href="/gapp-providers-georgia"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">GAPP providers in Georgia</h3>
              <p className="text-sm text-gray-600">How the GAPP provider network works across the state.</p>
            </Link>
            <Link
              href="/gapp-approval-guide"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">GAPP approval guide (for families)</h3>
              <p className="text-sm text-gray-600">How families get approved. Useful to understand the referral process.</p>
            </Link>
            <Link
              href="/services/rn-nursing"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">RN nursing services</h3>
              <p className="text-sm text-gray-600">What families expect from skilled nursing providers.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
          <div className="space-y-4">
            {PROVIDER_FAQS.map((faq, i) => (
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

      {/* Final CTA */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Already a GAPP provider?</h2>
          <p className="text-gray-600 mb-6">
            Claim your free listing so families in your counties can find you.
          </p>
          <Link
            href="/providers"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Claim Your Listing
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
