import Link from 'next/link'
import { Metadata } from 'next'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

// FAQ data for schema markup and display
const CAREGIVER_FAQS = [
  {
    question: 'Can a parent get paid to care for their child through GAPP?',
    answer: 'Yes. If your child is approved for PCS (Personal Care Services) hours through GAPP, you can apply to work as a PCS caregiver through the agency that manages your child\'s case. The agency hires you, assigns you to your child, and pays you. You cannot bill Medicaid directly.',
  },
  {
    question: 'How much do GAPP family caregivers get paid?',
    answer: 'PCS caregiver pay in Georgia typically ranges from $10 to $15 per hour, depending on the agency. Some agencies pay more for overnight or weekend shifts. Call agencies directly and ask about their current rates before you commit.',
  },
  {
    question: 'What\'s the difference between PCS and skilled nursing under GAPP?',
    answer: 'PCS covers personal care like bathing, dressing, feeding, and mobility help. Skilled nursing (RN or LPN) covers medical procedures like trach care, ventilator management, and medication administration. Family members can usually become PCS workers but not nurses unless they hold a nursing license.',
  },
  {
    question: 'Do I need training to become a paid GAPP caregiver?',
    answer: 'Yes. Most agencies require a short training program, a background check, and a drug screen before they can hire you as a PCS worker. The agency handles the training. Some agencies also require CPR certification.',
  },
  {
    question: 'Can grandparents or other family members be GAPP caregivers?',
    answer: 'In most cases, yes. Grandparents, aunts, uncles, and adult siblings can apply to be PCS caregivers through the agency. The same rules apply: background check, training, and the agency must hire you. Ask the specific agency about their family caregiver policy.',
  },
  {
    question: 'How long does it take to start getting paid as a GAPP caregiver?',
    answer: 'After you apply with an agency, expect 2 to 4 weeks for the background check, training, and paperwork. This assumes your child already has approved GAPP PCS hours. If your child still needs approval, add another 2 to 6 weeks for that process.',
  },
]

export const metadata: Metadata = {
  title: 'Can You Get Paid as a GAPP Caregiver? Georgia Guide',
  description: 'Find out if family members can get paid as GAPP caregivers in Georgia. How PCS works, pay ranges, and steps to become a paid family caregiver through a GAPP agency.',
  keywords: 'GAPP paid caregiver Georgia, get paid caring for child GAPP, family caregiver Medicaid Georgia, PCS caregiver pay, GAPP personal care services',
  openGraph: {
    title: 'Can You Get Paid as a GAPP Caregiver in Georgia?',
    description: 'How family members can get paid to care for their child through GAPP. PCS explained.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/gapp-paid-caregiver',
  },
}

export default function GAPPPaidCaregiverPage() {
  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={CAREGIVER_FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'GAPP paid caregiver', url: 'https://www.georgiagapp.com/gapp-paid-caregiver' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">GAPP paid caregiver</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Can you get paid to care for your child through GAPP?
          </h1>
          <p className="text-lg text-gray-600">
            Yes. If your child has approved GAPP hours for Personal Care Services (PCS),
            you can get hired by a GAPP agency as their PCS worker. The agency pays you.
            Here is how it works.
          </p>
        </div>
      </section>

      {/* The short answer */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The short answer</h2>
          <div className="bg-gradient-to-br from-accent/10 to-blue-50 rounded-xl border border-accent/20 p-5">
            <p className="text-gray-700 mb-3">
              Family members can work as paid PCS caregivers through a GAPP agency. You do not get paid by Medicaid directly. An agency hires you, assigns you to your child&apos;s case, and handles your payroll.
            </p>
            <p className="text-gray-700 mb-3">
              This only works for PCS hours. If your child needs skilled nursing (RN or LPN), the nurse must hold a license. You cannot fill those hours unless you are a licensed nurse.
            </p>
            <p className="text-gray-700">
              The first step is getting your child approved for GAPP PCS hours. If that is already done, you need to find an agency that hires family members as caregivers.
            </p>
          </div>
        </div>
      </section>

      {/* How it works - Step cards */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How it works</h2>
          <p className="text-gray-600 mb-8">
            Five steps from start to paycheck. Most of the work is on the agency side, not yours.
          </p>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">1</span>
                  <h3 className="text-lg font-semibold text-white">Your child gets approved for GAPP PCS hours</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-3">
                  Before anything else, your child needs active Georgia Medicaid and an approved prior authorization for PCS hours. If you have not done this yet, start with our{' '}
                  <Link href="/gapp-approval-guide" className="text-primary hover:underline">
                    GAPP approval guide
                  </Link>.
                </p>
                <p className="text-gray-700">
                  The approval tells Medicaid how many PCS hours per week your child qualifies for. Those hours are what you will eventually get paid to work.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">2</span>
                  <h3 className="text-lg font-semibold text-white">Find an agency that hires family caregivers</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-3">
                  Not every agency does this. Some only hire non-family staff. When you call, ask directly: &ldquo;Do you hire family members as PCS workers?&rdquo;
                </p>
                <p className="text-gray-700 mb-4">
                  Search our{' '}
                  <Link href="/directory" className="text-primary hover:underline">
                    provider directory
                  </Link>{' '}
                  and filter by PCS to find agencies in your county. Call several. Compare their rates and policies.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 text-sm">
                    <strong>Ask up front:</strong> What is your PCS hourly rate for family caregivers? Some agencies pay family caregivers less than outside staff. Get the number before you sign anything.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">3</span>
                  <h3 className="text-lg font-semibold text-white">Apply with the agency as a PCS worker</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-3">
                  The agency will run a background check and drug screen. You will go through their PCS training program. Most agencies also require CPR certification.
                </p>
                <p className="text-gray-700">
                  This process takes 2 to 4 weeks. The agency handles most of it. Your job is to show up for training and pass the background check.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">4</span>
                  <h3 className="text-lg font-semibold text-white">Agency assigns you to your child&apos;s case</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-3">
                  Once you pass training and the background check, the agency assigns you as the PCS worker on your child&apos;s case. You will get a schedule based on the authorized hours.
                </p>
                <p className="text-gray-700">
                  You do not pick your own hours. The hours come from the prior authorization. If your child is approved for 20 hours per week, that is the maximum you can work and get paid for.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-accent px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-accent rounded-full flex items-center justify-center font-bold">5</span>
                  <h3 className="text-lg font-semibold text-white">You work shifts and get paid by the agency</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-3">
                  You clock in and out like any job. The agency bills Medicaid for your hours and pays you from that. Most agencies pay biweekly with direct deposit.
                </p>
                <p className="text-gray-700">
                  The agency is your employer. They handle taxes, W-2s, and workers&apos; comp. You are not an independent contractor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What PCS caregivers actually do */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What PCS caregivers actually do</h2>
          <p className="text-gray-700 mb-4">
            PCS is personal care, not medical care. If you are already helping your kid with these things every day, this is the same work but with documentation and a paycheck.
          </p>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ul className="space-y-3">
              {[
                'Bathing and hygiene',
                'Dressing and undressing',
                'Feeding and meal prep',
                'Mobility help (transfers, repositioning)',
                'Medication reminders (not administration)',
                'Toileting and diaper changes',
                'Light housekeeping related to the child\'s care',
              ].map((duty, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{duty}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-gray-600 mt-4 text-sm">
            Anything medical (trach suctioning, IV meds, ventilator care) requires a licensed nurse, not a PCS worker.
            Read more about{' '}
            <Link href="/services/personal-care" className="text-primary hover:underline">
              what PCS covers
            </Link>.
          </p>
        </div>
      </section>

      {/* What to expect for pay */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What to expect for pay</h2>
          <p className="text-gray-700 mb-4">
            PCS caregiver pay in Georgia typically falls between $10 and $15 per hour. Some agencies pay on the lower end, some on the higher end. It depends on the agency, your county, and whether you work nights or weekends.
          </p>
          <p className="text-gray-700 mb-4">
            This is not a high-paying job. But if you are already doing this care for free, getting paid something is better than nothing. And you get the structure of an employer handling your taxes.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-800 text-sm">
              <strong>How to compare:</strong> Call at least three agencies in your area. Ask each one: &ldquo;What do you pay family PCS caregivers per hour?&rdquo; Rates are not standardized. The only way to know is to ask.
            </p>
          </div>
          <p className="text-gray-700">
            The agency bills Medicaid at a higher rate than what they pay you. That difference covers their overhead (training, payroll, supervision, insurance). This is standard across the industry.
          </p>
        </div>
      </section>

      {/* Things to know before you start */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Things to know before you start</h2>

          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h3 className="font-semibold text-amber-800 mb-2">Guardian vs. caregiver rules</h3>
              <p className="text-amber-700 text-sm">
                In some situations, a legal guardian cannot also be the paid caregiver. Rules vary by agency and by how Medicaid interprets the case. Ask the agency directly: &ldquo;Can I be both the legal guardian and the paid PCS worker?&rdquo; Get a clear answer before you start the process.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h3 className="font-semibold text-amber-800 mb-2">Background check required</h3>
              <p className="text-amber-700 text-sm">
                Every PCS worker goes through a criminal background check and drug screen. This is non-negotiable. If you have a disqualifying offense on your record, the agency cannot hire you. Ask the agency what their specific disqualifiers are.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-semibold text-blue-800 mb-2">Hours are set by the authorization</h3>
              <p className="text-blue-700 text-sm">
                You do not decide how many hours you work. The prior authorization tells the agency how many PCS hours your child gets per week. That is the cap. You cannot work extra hours and expect to be paid for them.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-semibold text-blue-800 mb-2">The agency is your employer</h3>
              <p className="text-blue-700 text-sm">
                Medicaid does not pay you. The agency does. They set your schedule, handle your taxes, and can terminate your employment. You follow their policies, complete their documentation, and meet their training requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/directory"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Find agencies that hire family caregivers</h3>
              <p className="text-sm text-gray-600">Search by county, filter by PCS, and request a callback.</p>
            </Link>
            <Link
              href="/services/personal-care"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">What PCS covers</h3>
              <p className="text-sm text-gray-600">Full breakdown of Personal Care Services under GAPP.</p>
            </Link>
            <Link
              href="/gapp-approval-guide"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">How to get your child approved for GAPP</h3>
              <p className="text-sm text-gray-600">Step-by-step approval process from Medicaid to care starting.</p>
            </Link>
            <Link
              href="/how-it-works"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">How the GAPP program works</h3>
              <p className="text-sm text-gray-600">Overview of GAPP for families who are just getting started.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Paid caregiver FAQs</h2>
          <div className="space-y-4">
            {CAREGIVER_FAQS.map((faq, i) => (
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
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to find an agency?</h2>
          <p className="text-gray-600 mb-6">
            Search for GAPP agencies in your county that offer PCS. Call and ask if they hire family caregivers.
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
