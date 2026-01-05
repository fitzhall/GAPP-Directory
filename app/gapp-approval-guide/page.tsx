import Link from 'next/link'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

// FAQ data for schema markup and display
const APPROVAL_FAQS = [
  {
    question: 'How long does GAPP approval take?',
    answer: 'GAPP approval typically takes 2-6 weeks once you have active Medicaid and a physician order. The timeline depends on how quickly your chosen agency submits the prior authorization and whether all documentation is complete.',
  },
  {
    question: 'Can I apply for GAPP while my Medicaid is pending?',
    answer: 'No. You must have active Georgia Medicaid before a GAPP agency can submit a prior authorization. Pending Medicaid does not count. If your Medicaid application is in process, wait until you receive your Medicaid card before contacting GAPP providers.',
  },
  {
    question: 'What if my GAPP application is denied?',
    answer: 'You have the right to appeal any denial. Common reasons include incomplete documentation, Medicaid not being active, or the physician order not clearly documenting medical necessity. Your GAPP agency can help you understand the denial reason and resubmit.',
  },
  {
    question: 'Do I need a referral from my doctor for GAPP?',
    answer: 'Yes. You need a physician order documenting that your child requires skilled nursing care at home. This is different from a referral—it must specifically state the type of care needed (RN, LPN, or PCS) and the medical necessity.',
  },
  {
    question: 'Can I choose any GAPP provider in Georgia?',
    answer: 'You can choose any Medicaid-enrolled GAPP provider that serves your county. Not all providers serve all counties, so check that the agency you want covers your area and has nurses available.',
  },
  {
    question: 'What happens after GAPP approves my child?',
    answer: 'Once approved, your chosen agency will schedule an intake visit to assess your child\'s needs, then assign nurses and begin care. The agency handles scheduling and will work with you on shift times.',
  },
  {
    question: 'Can my child receive GAPP services at school?',
    answer: 'GAPP services are typically for in-home care. School nursing is usually handled through your child\'s IEP or 504 plan. However, some families use GAPP hours for before/after school or transport.',
  },
]

export const metadata: Metadata = {
  title: 'How to Get Approved for the Georgia Pediatric Program (GAPP) – Step-by-Step Guide',
  description: 'Step-by-step guide to getting approved for GAPP in Georgia. Learn the exact approval process, avoid common delays, and find providers accepting new patients in your county.',
  keywords: 'GAPP approval Georgia, how to get GAPP, Georgia Pediatric Program application, GAPP eligibility, GAPP prior authorization, pediatric home nursing Georgia',
  openGraph: {
    title: 'How to Get Approved for GAPP in Georgia – Step-by-Step Guide',
    description: 'The complete approval process for Georgia\'s Pediatric Program. Avoid common delays and find providers accepting patients.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/gapp-approval-guide',
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

// Top counties for internal linking
const TOP_COUNTIES = [
  { slug: 'fulton', name: 'Fulton' },
  { slug: 'gwinnett', name: 'Gwinnett' },
  { slug: 'cobb', name: 'Cobb' },
  { slug: 'dekalb', name: 'DeKalb' },
  { slug: 'clayton', name: 'Clayton' },
  { slug: 'henry', name: 'Henry' },
  { slug: 'chatham', name: 'Chatham' },
  { slug: 'richmond', name: 'Richmond' },
]

export default async function GAPPApprovalGuidePage() {
  const stats = await getProviderStats()

  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={APPROVAL_FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'GAPP Approval Guide', url: 'https://www.georgiagapp.com/gapp-approval-guide' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">GAPP Approval Guide</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How to Get Approved for the Georgia Pediatric Program (GAPP)
          </h1>
          <p className="text-lg text-gray-600">
            A step-by-step guide to navigating the GAPP approval process, avoiding common delays,
            and finding providers who are actually accepting new patients.
          </p>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-8 px-4 bg-gray-50 border-b">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-gray-600 mb-3 font-medium">This guide is for:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Parents of medically fragile children',
              'Case managers',
              'Foster parents',
              'Hospital discharge planners',
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

      {/* Quick Requirements */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">GAPP Approval Requirements</h2>
          <p className="text-gray-600 mb-6">
            Before starting the approval process, confirm your child meets these requirements:
          </p>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ul className="space-y-3">
              {[
                { text: 'Child is under 21 years old', critical: false },
                { text: 'Georgia Medicaid is active (not pending)', critical: true },
                { text: 'Physician has ordered skilled nursing care', critical: true },
                { text: 'Child has a medically fragile diagnosis requiring home nursing', critical: false },
                { text: 'Home care is appropriate and cost-effective vs. facility care', critical: false },
              ].map((req, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${req.critical ? 'text-amber-500' : 'text-accent'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">
                    {req.text}
                    {req.critical && <span className="text-amber-600 text-sm ml-2">(critical)</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* The Approval Path - Main Content */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">The GAPP Approval Path</h2>
          <p className="text-gray-600 mb-8">
            Follow these steps in order. Skipping steps or doing them out of sequence causes most delays.
          </p>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">1</span>
                  <h3 className="text-lg font-semibold text-white">Confirm Medicaid Status</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  This step stops 60% of applications. Your child must have <strong>active</strong> Georgia Medicaid—not pending, not applied for, but active with a Medicaid ID number.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-amber-800 text-sm">
                    <strong>Common mistake:</strong> Families contact GAPP agencies while Medicaid is still pending. Agencies cannot submit prior authorization without active Medicaid. Wait until you have your Medicaid card.
                  </p>
                </div>
                <p className="text-gray-700">
                  <strong>How to check:</strong> Call Georgia Medicaid at 1-866-211-0950 or check your Georgia Gateway account. You need the Medicaid ID number, not just approval.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">2</span>
                  <h3 className="text-lg font-semibold text-white">Get the Physician Order (The Right Way)</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Your child&apos;s physician must document that skilled nursing care is medically necessary. This isn&apos;t a simple referral—it must clearly state:
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    'The specific type of care needed (RN, LPN, or PCS)',
                    'Why home nursing is medically necessary',
                    'The diagnosis requiring skilled care',
                    'Recommended hours of care',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Pro tip:</strong> Many GAPP agencies will help your doctor complete the order correctly. Choose your agency first (Step 3), then have them send the physician order form to your doctor.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">3</span>
                  <h3 className="text-lg font-semibold text-white">Choose a Medicaid-Approved GAPP Agency</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  This is where most families get stuck. Not all agencies are accepting new patients, and availability varies by county. When choosing an agency, verify:
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    'They serve your county',
                    'They\'re currently accepting new patients',
                    'They have nurses available for your needed shifts',
                    'They offer the service type you need (RN, LPN, or PCS)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Directory CTA */}
                <div className="bg-gradient-to-br from-accent/10 to-blue-50 rounded-xl border border-accent/20 p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">Find Providers Accepting New Patients</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {stats.accepting > 0
                      ? `${stats.accepting} of ${stats.total} providers in our directory are currently accepting new patients.`
                      : 'Browse verified GAPP providers in your county.'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      href="/directory"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors text-sm"
                    >
                      Search Providers
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                    <Link
                      href="/screener"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Check Eligibility First
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">4</span>
                  <h3 className="text-lg font-semibold text-white">Agency Submits Prior Authorization</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Once you&apos;ve chosen an agency and they have the physician order, they submit the prior authorization to Georgia Medicaid. This is the formal approval request.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>You don&apos;t do this step—your agency does.</strong> But you should:
                </p>
                <ul className="space-y-2">
                  {[
                    'Confirm with the agency that they\'ve submitted',
                    'Ask for the submission date and expected timeline',
                    'Provide any additional documentation they request promptly',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-accent px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-accent rounded-full flex items-center justify-center font-bold">5</span>
                  <h3 className="text-lg font-semibold text-white">Approval & Care Begins</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Once Medicaid approves the prior authorization, your agency will:
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    'Schedule an intake assessment at your home',
                    'Create a care plan based on your child\'s needs',
                    'Assign nurses to your case',
                    'Begin scheduled care shifts',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    <strong>Timeline:</strong> From prior authorization approval to care starting is typically 1-2 weeks, depending on nurse availability in your area.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Applications Get Delayed */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Why GAPP Applications Get Delayed or Denied</h2>
          <p className="text-gray-600 mb-6">
            Understanding these common problems helps you avoid them:
          </p>

          <div className="space-y-4">
            {[
              {
                problem: 'Medicaid is pending, not active',
                solution: 'Wait until you have your Medicaid ID. Agencies cannot submit prior auth without it.',
                severity: 'high',
              },
              {
                problem: 'Physician order doesn\'t document medical necessity clearly',
                solution: 'Have your agency send the correct form to your doctor. They know what Medicaid requires.',
                severity: 'high',
              },
              {
                problem: 'Agency is not responding or following up',
                solution: 'If an agency isn\'t responsive during intake, they likely won\'t be responsive during care. Choose a different provider.',
                severity: 'medium',
              },
              {
                problem: 'No nurses available in your county',
                solution: 'This is a real problem in rural areas. Contact multiple agencies and ask specifically about nurse availability before committing.',
                severity: 'medium',
              },
              {
                problem: 'Missing or incomplete documentation',
                solution: 'Respond to documentation requests within 24-48 hours. Delays on your end delay the whole process.',
                severity: 'low',
              },
              {
                problem: 'Child doesn\'t meet "institutional level of care" requirement',
                solution: 'This is a clinical determination. If denied, request an appeal and have your physician provide additional documentation.',
                severity: 'high',
              },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl border p-5 ${
                item.severity === 'high'
                  ? 'bg-red-50 border-red-200'
                  : item.severity === 'medium'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-gray-50 border-gray-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  item.severity === 'high'
                    ? 'text-red-800'
                    : item.severity === 'medium'
                      ? 'text-amber-800'
                      : 'text-gray-900'
                }`}>
                  {item.problem}
                </h3>
                <p className={`text-sm ${
                  item.severity === 'high'
                    ? 'text-red-700'
                    : item.severity === 'medium'
                      ? 'text-amber-700'
                      : 'text-gray-600'
                }`}>
                  <strong>Solution:</strong> {item.solution}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/why-gapp-applications-get-denied"
              className="text-primary hover:underline font-medium"
            >
              Read the full guide on avoiding GAPP denials →
            </Link>
          </div>
        </div>
      </section>

      {/* Find by County */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Find GAPP Providers by County</h2>
          <p className="text-gray-600 mb-6">
            Provider availability varies by county. Browse providers in Georgia&apos;s major areas:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TOP_COUNTIES.map(county => (
              <Link
                key={county.slug}
                href={`/${county.slug}`}
                className="px-4 py-3 bg-white hover:bg-primary/5 hover:text-primary border border-gray-200 rounded-lg text-center font-medium text-gray-700 transition-colors"
              >
                {county.name}
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/directory"
              className="text-primary hover:underline font-medium"
            >
              View all Georgia counties →
            </Link>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/gapp-approval-timeline"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">GAPP Approval Timeline</h3>
              <p className="text-sm text-gray-600">How long each step takes and what to expect.</p>
            </Link>
            <Link
              href="/gapp-medicaid-requirements"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Medicaid Requirements</h3>
              <p className="text-sm text-gray-600">What "active Medicaid" means and how to check your status.</p>
            </Link>
            <Link
              href="/why-gapp-applications-get-denied"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Why Applications Get Denied</h3>
              <p className="text-sm text-gray-600">Common denial reasons and how to avoid them.</p>
            </Link>
            <Link
              href="/waivers"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">GAPP vs Katie Beckett</h3>
              <p className="text-sm text-gray-600">Compare GAPP with other Georgia Medicaid waivers.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">GAPP Approval FAQs</h2>
          <div className="space-y-4">
            {APPROVAL_FAQS.map((faq, i) => (
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

      {/* Trust Signal */}
      <section className="py-8 px-4 border-t border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-gray-600 text-center mb-3">
            <strong>Who uses this resource:</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Georgia case managers',
              'Hospital discharge planners',
              'Foster care coordinators',
              'Home health agencies',
            ].map((user, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
              >
                {user}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Find a GAPP Provider?</h2>
          <p className="text-gray-600 mb-6">
            Browse verified providers accepting new patients in your county.
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
