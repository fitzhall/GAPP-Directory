import Link from 'next/link'
import { Metadata } from 'next'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

// FAQ data for schema markup and display
const SWITCHING_FAQS = [
  {
    question: 'Will I lose my GAPP approval if I switch agencies?',
    answer: 'No. Your child\'s GAPP eligibility and Medicaid are separate from the agency. The prior authorization may need to transfer, but you don\'t lose your spot in the program.',
  },
  {
    question: 'Can my current agency refuse to release my records?',
    answer: 'No. They\'re required to transfer medical records when you request it. If they drag their feet, contact Georgia Medicaid or file a complaint with DBHDD.',
  },
  {
    question: 'What if no other agencies in my county are accepting patients?',
    answer: 'Check neighboring counties. Many agencies serve multiple counties. Search our directory and call a few — some agencies that show "not accepting" online may have openings for transfers.',
  },
  {
    question: 'Do I need to tell my child\'s doctor?',
    answer: 'It\'s a good idea. Let them know the new agency name so they can send orders and communicate with the new nurses. Your doctor doesn\'t need to approve the switch.',
  },
  {
    question: 'Can I switch back to my old agency later?',
    answer: 'Usually yes, if they\'re accepting patients. But most families who switch don\'t go back. Pick your new agency carefully and you shouldn\'t need to.',
  },
  {
    question: 'What if there\'s a gap between agencies?',
    answer: 'Plan ahead to avoid this. The best approach is to keep the old agency staffing shifts until the new one starts. If there is a short gap, you\'ll handle care yourself temporarily. Make sure you have emergency supplies and know your child\'s care plan inside and out.',
  },
]

export const metadata: Metadata = {
  title: 'How to Switch GAPP Providers in Georgia: Steps and Timeline',
  description: 'Unhappy with your GAPP agency? How to switch providers without losing services. Steps, what to tell your current agency, and how long it takes.',
  keywords: 'switch GAPP providers, change GAPP agency, transfer GAPP services, GAPP provider problems, new GAPP agency Georgia',
  openGraph: {
    title: 'How to Switch GAPP Providers in Georgia: Steps and Timeline',
    description: 'Step-by-step guide to switching your GAPP agency without a gap in services.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/how-to-switch-gapp-providers',
  },
}

export default function HowToSwitchGAPPProvidersPage() {
  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={SWITCHING_FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'How to switch GAPP providers', url: 'https://www.georgiagapp.com/how-to-switch-gapp-providers' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">How to switch GAPP providers</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How to switch GAPP providers in Georgia
          </h1>
          <p className="text-lg text-gray-600">
            You don&apos;t have to stay with an agency that isn&apos;t working. Here&apos;s how to move to a new one without losing your child&apos;s services.
          </p>
        </div>
      </section>

      {/* Signs it's time to switch */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Signs it&apos;s time to find a new agency</h2>
          <p className="text-gray-600 mb-6">
            If any of these sound familiar, you&apos;re not overreacting. These are real reasons families switch.
          </p>
          <ul className="space-y-3 mb-6">
            {[
              'Nurses keep canceling or not showing up',
              'The agency won\'t return your calls',
              'They can\'t staff your child\'s hours consistently',
              'You\'ve reported problems and nothing changed',
              'Nurses aren\'t following your child\'s care plan',
              'The agency is losing staff and can\'t replace them',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              Switching agencies is your right. You won&apos;t lose your GAPP approval. Your child&apos;s Medicaid and prior authorization stay active.
            </p>
          </div>
        </div>
      </section>

      {/* Step-by-step switching process */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How to switch, step by step</h2>
          <p className="text-gray-600 mb-8">
            Follow this order. The biggest mistake is quitting your old agency before the new one is ready.
          </p>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">1</span>
                  <h3 className="text-lg font-semibold text-white">Find your new agency first</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Don&apos;t quit your current agency until you have a new one lined up.{' '}
                  <Link href="/directory" className="text-primary hover:underline font-medium">Search our directory by county</Link>{' '}
                  and call 2-3 agencies. Ask these questions:
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    'Are you accepting new patients?',
                    'Can you staff the hours my child needs?',
                    'What\'s your nurse turnover like?',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-gray-700">
                  If you&apos;re in a metro area like <Link href="/fulton" className="text-primary hover:underline">Fulton</Link> or{' '}
                  <Link href="/dekalb" className="text-primary hover:underline">DeKalb</Link> county, you&apos;ll likely have several options. Rural counties may take more searching.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">2</span>
                  <h3 className="text-lg font-semibold text-white">Tell your new agency you&apos;re transferring</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  They&apos;ve done this before. Give them your child&apos;s name, Medicaid ID, current hours, and service type. They&apos;ll start their intake process while you&apos;re still with the old agency.
                </p>
                <p className="text-gray-700">
                  Transfers are easier than brand-new applications because your child already has an approved prior authorization on file.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">3</span>
                  <h3 className="text-lg font-semibold text-white">Notify your current agency</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Call or send a written notice. You don&apos;t need permission to leave. Just tell them you&apos;re transferring to a new agency effective a specific date.
                </p>
                <p className="text-gray-700">
                  Ask them to send your child&apos;s records to the new agency. They&apos;re required to do this.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">4</span>
                  <h3 className="text-lg font-semibold text-white">Coordinate the handoff</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  The goal is zero gap in services. Your new agency submits a new prior authorization. In many cases, Medicaid processes transfers faster than new applications.
                </p>
                <p className="text-gray-700">
                  Ask both agencies to overlap if possible. Keep the old agency staffing shifts until the new one is ready to start.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-accent px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-accent rounded-full flex items-center justify-center font-bold">5</span>
                  <h3 className="text-lg font-semibold text-white">Confirm your hours and care plan</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Once the new agency is active, verify they have the right hours, service type, and care plan details. Do a meet-and-greet with your new nurse before the first shift if you can.
                </p>
                <p className="text-gray-700">
                  Go over your kid&apos;s routine, medications, and any specific needs. The more the new nurse knows upfront, the smoother the first week goes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How long does switching take?</h2>

          <div className="space-y-4 mb-6">
            {[
              { phase: 'Finding a new agency', time: '1-2 weeks', note: 'You control this', color: 'border-blue-400' },
              { phase: 'New agency intake', time: '3-5 days', note: 'Paperwork and initial assessment', color: 'border-blue-400' },
              { phase: 'Prior authorization transfer', time: '1-3 weeks', note: 'Medicaid processing', color: 'border-amber-400' },
              { phase: 'First shift with new agency', time: '1-2 weeks', note: 'After approval comes through', color: 'border-green-400' },
            ].map((item, i) => (
              <div key={i} className={`bg-white rounded-lg border border-gray-200 border-l-4 ${item.color} p-4 flex items-center justify-between`}>
                <div>
                  <p className="font-medium text-gray-900">{item.phase}</p>
                  <p className="text-sm text-gray-500">{item.note}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700 whitespace-nowrap ml-4">{item.time}</span>
              </div>
            ))}
            <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
              <p className="font-bold text-white">Total timeline</p>
              <span className="text-lg font-bold text-white">3-6 weeks</span>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              <strong>Tip:</strong> Start looking before you hit your breaking point. The families who switch smoothly are the ones who line up the new agency first.
            </p>
          </div>
        </div>
      </section>

      {/* What to tell your current agency */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What to say to your current agency</h2>
          <p className="text-gray-600 mb-6">
            Keep it short. You don&apos;t owe them an explanation. Here&apos;s a script you can use:
          </p>

          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <p className="text-gray-700 italic">
              &ldquo;We&apos;ve decided to transfer [child&apos;s name]&apos;s GAPP services to another agency. Our last day with you will be [date]. Please send our records to [new agency name] at [contact info].&rdquo;
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              <strong>Put it in writing.</strong> Even if you call, follow up with an email or letter so there&apos;s a record. Keep a copy for yourself.
            </p>
          </div>
        </div>
      </section>

      {/* Common mistakes */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common mistakes when switching</h2>

          <div className="space-y-4">
            <p className="text-gray-700">
              <strong>Quitting before the new agency is ready.</strong> This is the number one mistake. You end up with no nurses while the new agency finishes intake. Stay with the old agency until the new one can start staffing shifts.
            </p>
            <p className="text-gray-700">
              <strong>Assuming hours transfer automatically.</strong> Your new agency needs to submit their own prior authorization. The hours don&apos;t just roll over. Follow up to make sure this gets filed quickly.
            </p>
            <p className="text-gray-700">
              <strong>Skipping the meet-and-greet.</strong> Your kid needs time to adjust to a new nurse. Ask for a short introductory visit before the first real shift. It makes a big difference.
            </p>
            <p className="text-gray-700">
              <strong>Feeling guilty about leaving.</strong> Agencies deal with transfers all the time. Your child&apos;s care matters more than an agency&apos;s feelings. If the service isn&apos;t working, switching is the responsible thing to do.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
          <div className="space-y-4">
            {SWITCHING_FAQS.map((faq, i) => (
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
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/directory"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Find a GAPP provider</h3>
              <p className="text-sm text-gray-600">Search agencies by county and see who&apos;s accepting patients.</p>
            </Link>
            <Link
              href="/gapp-services-explained"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">GAPP services explained</h3>
              <p className="text-sm text-gray-600">What RN, LPN, and PCS actually cover.</p>
            </Link>
            <Link
              href="/gapp-approval-guide"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">GAPP approval guide</h3>
              <p className="text-sm text-gray-600">How the approval process works from start to finish.</p>
            </Link>
            <Link
              href="/gapp-respite-care"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">GAPP respite care</h3>
              <p className="text-sm text-gray-600">Get backup hours when you need a break.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to find a better agency?</h2>
          <p className="text-gray-600 mb-6">
            Browse verified providers accepting new patients in your county.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/directory"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Browse Providers
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
