import Link from 'next/link'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

const APPLICATION_FAQS = [
  {
    question: 'Can I apply for GAPP without Medicaid?',
    answer: 'No. You need active Georgia Medicaid before any GAPP agency can start your application. If you don\'t have Medicaid yet, apply through Georgia Gateway (gateway.ga.gov) or your local DFCS office first.',
  },
  {
    question: 'Do I apply to Medicaid directly for GAPP?',
    answer: 'No. You apply through a GAPP agency. The agency handles the prior authorization request to Medicaid on your behalf. Your job is to pick the agency and get them the documents they need.',
  },
  {
    question: 'How long does GAPP approval take?',
    answer: 'Plan for 5 to 9 weeks from your first phone call to the first nurse visit. The biggest variable is prior authorization review, which takes 2 to 4 weeks. You can speed things up by having your documents ready before you contact an agency.',
  },
  {
    question: 'What if no agencies in my county are accepting patients?',
    answer: 'Contact agencies in neighboring counties. Many GAPP providers serve multiple counties. You can also search our directory filtered by your county to see who covers your area.',
  },
  {
    question: 'Can I switch agencies after I apply?',
    answer: 'Yes, but it may restart parts of the process. If your current agency isn\'t returning calls or moving things forward, find a new one. A slow agency during intake usually means a slow agency during care.',
  },
  {
    question: 'Does GAPP cost anything out of pocket?',
    answer: 'No. GAPP is a Medicaid program. If your child has active Georgia Medicaid, the services are covered. You should never be billed for GAPP nursing or personal care hours.',
  },
]

export const metadata: Metadata = {
  title: 'How to Apply for GAPP in Georgia: Documents, Steps, and Timeline',
  description: 'Apply for the Georgia Pediatric Program step by step. Required documents, where to submit, expected timeline, and what to do if denied. Updated 2026.',
  keywords: 'apply for GAPP Georgia, GAPP application, Georgia Pediatric Program application, GAPP documents needed, GAPP timeline, how to get GAPP',
  openGraph: {
    title: 'How to Apply for GAPP in Georgia: Documents, Steps, and Timeline',
    description: 'Step-by-step GAPP application guide with required documents, timelines, and tips.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/how-to-apply-for-gapp',
  },
}

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

export default async function HowToApplyForGAPPPage() {
  const stats = await getProviderStats()

  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={APPLICATION_FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'How to apply for GAPP', url: 'https://www.georgiagapp.com/how-to-apply-for-gapp' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">How to apply for GAPP</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How to apply for GAPP in Georgia
          </h1>
          <p className="text-lg text-gray-600">
            Everything you need: the documents, the steps, and how long it actually takes.
          </p>
        </div>
      </section>

      {/* Who this is for */}
      <section className="py-8 px-4 bg-gray-50 border-b">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-gray-600 mb-3 font-medium">This guide is for:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Parents applying for home nursing',
              'Families with active Medicaid',
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

      {/* Document checklist */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Documents you&apos;ll need before you start</h2>
          <p className="text-gray-600 mb-6">
            Gather these before you call an agency. Having everything ready cuts weeks off the process.
          </p>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ul className="space-y-3">
              {[
                'Child\'s active Georgia Medicaid card (not pending)',
                'Physician order for skilled nursing (must state: diagnosis, type of care, medical necessity, recommended hours)',
                'Child\'s medical records or recent hospital discharge summary',
                'Parent/guardian photo ID',
                'Proof of Georgia residency',
                'Child\'s birth certificate or Social Security card',
              ].map((doc, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                  </svg>
                  <span className="text-gray-700">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              <strong>The physician order is where most applications stall.</strong> Your GAPP agency can send the correct form to your doctor. Pick your agency first, then get the order. Doctors who haven&apos;t done GAPP orders before often miss what Medicaid requires.
            </p>
          </div>
        </div>
      </section>

      {/* Step-by-step process */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">The application process, step by step</h2>
          <p className="text-gray-600 mb-8">
            Six steps from start to first nurse visit. Do them in order.
          </p>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">1</span>
                  <h3 className="text-lg font-semibold text-white">Confirm your child has active Medicaid</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Call 1-866-211-0950 or log into your <a href="https://gateway.ga.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Georgia Gateway</a> account. You need an active Medicaid ID number. Pending doesn&apos;t count.
                </p>
                <p className="text-gray-700">
                  If Medicaid isn&apos;t active yet, stop here and finish that first. No agency can submit anything without it.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">2</span>
                  <h3 className="text-lg font-semibold text-white">Choose a GAPP agency in your county</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  This is the agency that will handle your application, assign your nurses, and manage your care. Pick carefully. Ask if they&apos;re accepting new patients and have nurses in your area.
                </p>
                <p className="text-gray-700 mb-4">
                  You can <Link href="/directory" className="text-primary hover:underline">search GAPP providers in our directory</Link> by county and service type. If you&apos;re in metro Atlanta, try <Link href="/fulton" className="text-primary hover:underline">Fulton</Link>, <Link href="/cobb" className="text-primary hover:underline">Cobb</Link>, or <Link href="/gwinnett" className="text-primary hover:underline">Gwinnett</Link> counties.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Tip:</strong> Contact two or three agencies. Ask each one how many nurses they have in your county and what their current wait time is. Go with whoever can start fastest.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">3</span>
                  <h3 className="text-lg font-semibold text-white">Gather your documents</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Use the checklist above. The physician order is the hardest piece. Ask your agency to send the form directly to your doctor&apos;s office. They know what Medicaid needs to see on it.
                </p>
                <p className="text-gray-700">
                  If your child was recently discharged from the hospital, the discharge summary can sometimes double as supporting documentation. Ask your agency what they need.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">4</span>
                  <h3 className="text-lg font-semibold text-white">Agency submits prior authorization</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  You don&apos;t do this step. Your agency sends everything to Georgia Medicaid and requests approval for your child&apos;s hours. But stay on top of them:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Confirm they submitted (get the date)
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Ask how long they expect review to take
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Send back any paperwork they request within a day or two
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">5</span>
                  <h3 className="text-lg font-semibold text-white">Wait for approval (2-6 weeks)</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  This is the hardest part. Georgia Medicaid reviews the prior authorization and decides how many hours your child qualifies for. Most reviews take 2 to 4 weeks. Some take longer.
                </p>
                <p className="text-gray-700">
                  If you haven&apos;t heard anything after 4 weeks, call your agency. Ask them to check the status. If they can&apos;t give you a straight answer, that&apos;s a red flag.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-accent px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-accent rounded-full flex items-center justify-center font-bold">6</span>
                  <h3 className="text-lg font-semibold text-white">Intake and care begins</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Once approved, your agency schedules an intake visit at your home. They assess your child, build a care plan, and assign nurses. First shift usually starts 1 to 2 weeks after approval.
                </p>
                <p className="text-gray-700">
                  If nurse availability is limited in your county, it could take longer. Rural areas like south Georgia often have longer waits for staffing. Ask about this upfront when choosing your agency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Realistic timeline: how long does this take?</h2>
          <p className="text-gray-600 mb-8">
            Here&apos;s what to expect from first phone call to first nurse shift.
          </p>

          <div className="space-y-4">
            {[
              { phase: 'Gather documents', time: '1-2 weeks', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-800' },
              { phase: 'Choose agency + intake', time: '1 week', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-800' },
              { phase: 'Prior authorization review', time: '2-4 weeks', color: 'bg-amber-50 border-amber-200', textColor: 'text-amber-800' },
              { phase: 'Nurse assignment + scheduling', time: '1-2 weeks', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-800' },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl border p-5 ${item.color}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${item.textColor}`}>{item.phase}</span>
                  <span className={`text-sm font-semibold ${item.textColor}`}>{item.time}</span>
                </div>
              </div>
            ))}

            <div className="rounded-xl border-2 border-gray-900 bg-gray-900 p-5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">Total: start to first nurse visit</span>
                <span className="text-sm font-semibold text-white">5-9 weeks</span>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              <strong>The fastest families do steps 1 through 3 at the same time.</strong> Start gathering documents the same week you contact agencies. Don&apos;t wait for one step to finish before starting the next.
            </p>
          </div>
        </div>
      </section>

      {/* What if denied */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What to do if your application is denied</h2>
          <p className="text-gray-600 mb-6">
            Denials happen. They&apos;re not the end. Here are the most common reasons and what to do about each one.
          </p>

          <div className="space-y-4">
            {[
              {
                reason: 'Physician order didn\'t state medical necessity clearly enough',
                fix: 'Ask your agency for the denial letter. Have your doctor rewrite the order with more detail about why home nursing is needed. Your agency can tell the doctor exactly what language Medicaid wants to see.',
              },
              {
                reason: 'Medicaid wasn\'t active when the agency submitted',
                fix: 'Get your Medicaid active, then have the agency resubmit. This one is straightforward to fix.',
              },
              {
                reason: 'Missing documents in the submission',
                fix: 'Your agency should tell you what was missing. Get it to them fast and have them resubmit.',
              },
              {
                reason: 'Child didn\'t meet institutional level of care criteria',
                fix: 'This means Medicaid decided your child\'s needs don\'t require the level of care GAPP provides. You can appeal. Have your doctor write a detailed letter explaining why home nursing is needed instead of outpatient care.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.reason}</h3>
                <p className="text-sm text-gray-600">{item.fix}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/why-gapp-applications-get-denied"
              className="text-primary hover:underline font-medium"
            >
              Read the full guide on GAPP denials and appeals &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common questions about applying for GAPP</h2>
          <div className="space-y-4">
            {APPLICATION_FAQS.map((faq, i) => (
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
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/gapp-approval-guide"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">GAPP approval guide</h3>
              <p className="text-sm text-gray-600">The full approval process from eligibility to first nurse visit.</p>
            </Link>
            <Link
              href="/gapp-services-explained"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">GAPP services explained</h3>
              <p className="text-sm text-gray-600">RN vs LPN vs PCS: what each service type covers.</p>
            </Link>
            <Link
              href="/why-gapp-applications-get-denied"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Why applications get denied</h3>
              <p className="text-sm text-gray-600">Common denial reasons and how to appeal.</p>
            </Link>
            <Link
              href="/directory"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Provider directory</h3>
              <p className="text-sm text-gray-600">Search GAPP agencies by county and service type.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Find a GAPP agency to start your application</h2>
          <p className="text-gray-600 mb-6">
            {stats.accepting > 0
              ? `${stats.accepting} of ${stats.total} providers in our directory are accepting new patients right now.`
              : 'Browse GAPP providers in your county and request a callback.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/directory"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Search providers
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/screener"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors"
            >
              Check eligibility first
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
