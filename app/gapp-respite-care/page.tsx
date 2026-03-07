import Link from 'next/link'
import { Metadata } from 'next'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

// FAQ data for schema markup and display
const RESPITE_FAQS = [
  {
    question: 'Is respite care free through GAPP?',
    answer: 'Yes. Respite hours are covered under your child\'s GAPP authorization. There\'s no out-of-pocket cost if your child has active Medicaid and an approved prior auth.',
  },
  {
    question: 'Can I use respite hours to go to work?',
    answer: 'Yes. You can use respite hours however you need to. Work, sleep, errands, medical appointments, or just taking a break. The nurse is there for your child regardless of where you go.',
  },
  {
    question: 'Do I have to use the same agency for respite?',
    answer: 'Not necessarily. Some families use a second agency specifically for respite hours if their primary agency can\'t staff them. Talk to your care coordinator about options.',
  },
  {
    question: 'How often can I use respite?',
    answer: 'As often as your authorized hours allow. Some families use a few hours every week. Others save up hours for a longer break once a month. It depends on what Medicaid approved.',
  },
  {
    question: 'What if I need respite right now - like today?',
    answer: 'Call your agency and ask for emergency coverage. Most agencies have per diem nurses who can fill short-notice shifts. If your agency can\'t help, call other agencies in your area from our directory.',
  },
  {
    question: 'Can respite nurses do everything my regular nurse does?',
    answer: 'They should be able to. Respite nurses need to be trained on your child\'s specific care plan. Before the first respite shift, have the nurse review the care plan and walk through your child\'s equipment and routines.',
  },
]

export const metadata: Metadata = {
  title: 'GAPP Respite Care in Georgia: How to Get Backup Nursing Hours',
  description: 'GAPP respite care gives you a break while a trained nurse watches your child. How it works, who qualifies, how many hours you get, and how to request it.',
  keywords: 'GAPP respite care Georgia, respite nursing Georgia, caregiver respite GAPP, backup nursing hours, GAPP respite eligibility, respite care medically fragile child',
  openGraph: {
    title: 'GAPP Respite Care in Georgia: How to Get Backup Nursing Hours',
    description: 'How GAPP respite care works, who qualifies, and how to request backup nursing hours for your child.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/gapp-respite-care',
  },
}

export default function GAPPRespiteCarePage() {
  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={RESPITE_FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'GAPP respite care', url: 'https://www.georgiagapp.com/gapp-respite-care' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">GAPP respite care</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            GAPP respite care: how to get backup nursing hours
          </h1>
          <p className="text-lg text-gray-600">
            You can&apos;t do this alone forever. Respite care gives you a break while a trained nurse takes over.
          </p>
        </div>
      </section>

      {/* What respite care actually is */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What respite care means in GAPP</h2>
          <p className="text-gray-700 mb-4">
            Respite care is temporary relief for you. A nurse or PCS aide comes to your home so you can step away. Sleep, run errands, go to a doctor&apos;s appointment, or just sit somewhere quiet for an hour without anyone needing you.
          </p>
          <p className="text-gray-700 mb-6">
            It&apos;s not a different program. It&apos;s built into GAPP. Your agency requests respite hours as part of your child&apos;s care plan. The respite nurse handles everything your regular nurse would. Meds, monitoring, trach care, whatever your child needs.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-blue-900">
              Respite isn&apos;t a luxury. If you&apos;re the primary caregiver for a medically fragile child, burnout is real. Respite hours exist because the system knows you need breaks to keep going.
            </p>
          </div>
        </div>
      </section>

      {/* Who qualifies */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Who qualifies for GAPP respite care</h2>
          <ul className="space-y-3 mb-6">
            {[
              'Your child is already receiving GAPP services (RN, LPN, or PCS)',
              'Your child has an active prior authorization',
              'Your physician includes respite in the care plan or supports adding it',
              'You\'re the primary caregiver and need temporary relief',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-700">
            You don&apos;t need a separate application for respite. It gets added to your existing GAPP authorization. Talk to your agency and your child&apos;s doctor. If you&apos;re not sure whether your kid qualifies for GAPP at all, <Link href="/gapp-services-explained" className="text-primary hover:underline">read about what GAPP services cover</Link>.
          </p>
        </div>
      </section>

      {/* How many hours */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How many respite hours can you get?</h2>
          <p className="text-gray-700 mb-4">
            There&apos;s no single answer. Respite hours depend on what Medicaid authorizes and what your physician orders. Some families get a few hours a week. Others get a block of hours per month. The amount depends on:
          </p>
          <ul className="space-y-3 mb-6">
            {[
              'Your child\'s medical complexity',
              'How many regular nursing hours you already receive',
              'What the physician documents as medically necessary',
              'Medicaid\'s authorization decision',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <p className="text-green-900">
              <strong>Tip:</strong> If you&apos;re not getting enough respite hours, ask your doctor to write a letter explaining why you need more. Medicaid responds to documented medical necessity.
            </p>
          </div>
        </div>
      </section>

      {/* How to request respite */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to request respite hours</h2>
          <p className="text-gray-600 mb-8">
            Five steps. Your agency does most of the heavy lifting.
          </p>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">1</span>
                  <h3 className="text-lg font-semibold text-white">Talk to your GAPP agency</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Tell your care coordinator or intake person that you need respite hours. They handle this kind of request regularly. If you don&apos;t have an agency yet, <Link href="/directory" className="text-primary hover:underline">find one in our directory</Link>.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">2</span>
                  <h3 className="text-lg font-semibold text-white">Get your doctor involved</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Your physician needs to include respite in the care plan or write a supporting order. Tell your doctor you&apos;re the primary caregiver and need periodic relief to maintain your own health.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">3</span>
                  <h3 className="text-lg font-semibold text-white">Agency submits the request</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Your agency submits the respite hours as part of your child&apos;s prior authorization to Medicaid. This may be included in a renewal or submitted as a modification to your existing auth.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">4</span>
                  <h3 className="text-lg font-semibold text-white">Medicaid reviews and approves</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Approval typically comes with your regular authorization. If denied, your agency can appeal with additional documentation from your doctor.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-accent px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-accent rounded-full flex items-center justify-center font-bold">5</span>
                  <h3 className="text-lg font-semibold text-white">Schedule your respite shifts</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Once approved, work with your agency to schedule the hours. Some families use them on a regular weekly schedule. Others save them for when they need a longer break. Families in <Link href="/gwinnett" className="text-primary hover:underline">Gwinnett County</Link> and other metro areas tend to have an easier time finding nurses for respite shifts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Day-in-the-life */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What a respite shift looks like</h2>
          <p className="text-gray-700 mb-4">
            The respite nurse arrives at 8am on Saturday. You walk her through your child&apos;s morning routine. When the next med is due, what to watch for with the vent settings, where the backup supplies are. Then you leave. You go to the grocery store alone. You get coffee. You sit somewhere quiet. The nurse handles everything. Meds, feedings, suctioning, diaper changes. You come back at noon and your child is fine. That&apos;s respite.
          </p>
          <p className="text-gray-700">
            Some families use respite for overnight coverage so both parents can sleep. Others use it during the week so the primary caregiver can work a part-time job. A few families have a <Link href="/gapp-paid-caregiver" className="text-primary hover:underline">paid family caregiver</Link> handling weekday shifts and use agency respite nurses on weekends. There&apos;s no wrong way to use it as long as a qualified nurse is with your child.
          </p>
        </div>
      </section>

      {/* Common barriers */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What gets in the way (and how to fix it)</h2>

          <div className="space-y-6">
            <div>
              <p className="font-semibold text-gray-900 mb-2">&quot;My agency says they can&apos;t staff respite shifts.&quot;</p>
              <p className="text-gray-700">
                This is the most common problem. If your agency can&apos;t find nurses for respite, ask if they can pull from a different pool or hire per diem staff. If they still can&apos;t, consider a second agency for respite-only hours. Or look for a new agency that has better staffing. <Link href="/directory" className="text-primary hover:underline">Search our directory</Link> to compare options, or read our guide on <Link href="/how-to-switch-gapp-providers" className="text-primary hover:underline">how to switch GAPP providers</Link>.
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-2">&quot;My doctor didn&apos;t include respite in the order.&quot;</p>
              <p className="text-gray-700">
                Doctors don&apos;t always know to add it. Call the office and say: &quot;I need respite hours added to my child&apos;s GAPP care plan. Can we update the physician order?&quot; Most will add it once you explain what respite means in GAPP.
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-2">&quot;Medicaid denied my respite hours.&quot;</p>
              <p className="text-gray-700">
                Ask for the denial reason in writing. Have your doctor write a letter of medical necessity explaining caregiver burnout risk and impact on the child&apos;s care. Your agency can resubmit or appeal. For more on the process, see our <Link href="/how-to-apply-for-gapp" className="text-primary hover:underline">GAPP application guide</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Respite care FAQs</h2>
          <div className="space-y-4">
            {RESPITE_FAQS.map((faq, i) => (
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
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/gapp-services-explained"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">GAPP services explained</h3>
              <p className="text-sm text-gray-600">What RN, LPN, and PCS actually cover.</p>
            </Link>
            <Link
              href="/how-to-apply-for-gapp"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">How to apply for GAPP</h3>
              <p className="text-sm text-gray-600">Documents, steps, and timeline.</p>
            </Link>
            <Link
              href="/how-to-switch-gapp-providers"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Switch GAPP providers</h3>
              <p className="text-sm text-gray-600">How to find a better agency.</p>
            </Link>
            <Link
              href="/directory"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Find a GAPP provider</h3>
              <p className="text-sm text-gray-600">Search agencies by county.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need a GAPP agency that can staff respite hours?</h2>
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
