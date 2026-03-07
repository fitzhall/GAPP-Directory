import Link from 'next/link'
import { Metadata } from 'next'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

const SERVICE_FAQS = [
  {
    question: 'How many hours of GAPP services can my child get?',
    answer: 'It depends on the physician order and Medicaid authorization. Some children get 8 hours a day. Others get 24/7 nursing. Your agency submits the request based on what the doctor orders, and Medicaid decides how many hours to approve.',
  },
  {
    question: 'Can I choose which nurse comes to my home?',
    answer: 'Your agency assigns nurses, but you can request changes if someone isn\'t a good fit. Most agencies try to keep the same nurses on your case for consistency. If you have a problem with a nurse, call your agency and ask for a switch.',
  },
  {
    question: 'What if the nurse doesn\'t show up?',
    answer: 'Call your agency right away. They should send a replacement. If you\'re getting regular no-shows or missed shifts, that\'s a sign to start looking at other agencies. You can browse providers in our directory.',
  },
  {
    question: 'Can GAPP nurses go to school with my child?',
    answer: 'GAPP is for in-home care. School nursing is handled through your child\'s IEP or 504 plan. Some families use GAPP hours for before and after school, but the nurse stays at home.',
  },
  {
    question: 'Do I have to be home while the nurse is there?',
    answer: 'It depends on the care plan and your child\'s age. For younger children, most agencies want a parent in the home or reachable nearby. Talk to your agency about what\'s allowed under your specific plan.',
  },
  {
    question: 'Can a family member be a PCS aide?',
    answer: 'In some cases, yes. A family member can be hired through a GAPP agency as a PCS aide. There are rules about which family members qualify. Check our paid caregiver page for details on how this works.',
  },
]

export const metadata: Metadata = {
  title: 'GAPP Services Explained: What RN, LPN, and PCS Actually Cover',
  description: 'What does a GAPP nurse actually do in your home? Real examples of RN, LPN, and personal care services for medically fragile children in Georgia.',
  keywords: 'GAPP services, RN home nursing Georgia, LPN services GAPP, personal care services PCS, GAPP home care, what does GAPP cover',
  openGraph: {
    title: 'GAPP Services Explained: What RN, LPN, and PCS Actually Cover',
    description: 'Real examples of what GAPP nurses and PCS aides do day-to-day in your home.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/gapp-services-explained',
  },
}

export default function GAPPServicesExplainedPage() {
  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={SERVICE_FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'GAPP services explained', url: 'https://www.georgiagapp.com/gapp-services-explained' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">GAPP services explained</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            GAPP services explained: what RN, LPN, and PCS actually cover
          </h1>
          <p className="text-lg text-gray-600">
            What happens when a GAPP nurse shows up at your house. The real day-to-day, not the policy language.
          </p>
        </div>
      </section>

      {/* Quick overview */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Three types of GAPP services</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="h-1 bg-primary"></div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2">RN (Registered Nurse)</h3>
                <p className="text-sm text-gray-600">
                  The most complex medical needs. Trach care, ventilator management, IV medications.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="h-1 bg-accent"></div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2">LPN (Licensed Practical Nurse)</h3>
                <p className="text-sm text-gray-600">
                  Ongoing medical care. G-tube feedings, scheduled medications, wound care.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="h-1 bg-orange-400"></div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2">PCS (Personal Care Services)</h3>
                <p className="text-sm text-gray-600">
                  Daily living help. Bathing, dressing, feeding, getting in and out of the wheelchair.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RN deep dive */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Registered Nursing (RN): what they do in your home</h2>
          <p className="text-gray-700 mb-6">
            She arrives at 7am. She checks your child&apos;s trach, suctions as needed, and sets the ventilator settings for the day. She watches the monitors while your child eats breakfast. At 8am she gives medications through the G-tube and documents everything. If something goes wrong during her shift &mdash; a trach comes out, oxygen drops, a seizure starts &mdash; she handles it. You don&apos;t have to stand over her. That&apos;s the whole point.
          </p>

          <h3 className="font-semibold text-gray-900 mb-3">What an RN does on a typical shift</h3>
          <ul className="space-y-2 mb-6">
            {[
              'Tracheostomy care and suctioning',
              'Ventilator monitoring and adjustments',
              'IV medication administration',
              'Complex wound care',
              'Seizure monitoring and response',
              'Care plan development and updates',
              'Training parents on equipment and procedures',
              'Coordinating with your child\'s doctors',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h3 className="font-semibold text-blue-900 mb-2">Your child probably needs an RN if:</h3>
            <ul className="space-y-1 text-blue-800 text-sm">
              <li>They have a trach or ventilator</li>
              <li>They need IV medications at home</li>
              <li>They use complex medical equipment that requires clinical judgment</li>
              <li>Their care requires a nurse who can make decisions on the spot</li>
            </ul>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Read more about <Link href="/services/rn-nursing" className="text-primary hover:underline">RN nursing through GAPP</Link>.
          </p>
        </div>
      </section>

      {/* LPN deep dive */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Licensed Practical Nursing (LPN): what they do in your home</h2>
          <p className="text-gray-700 mb-6">
            She comes at 6pm for the evening shift. She checks vitals, gives the 6pm medications through the G-tube, and preps the overnight feeding pump. She does a wound dressing change, cleans the site, applies new gauze. She monitors your child through the evening, handles the 10pm meds, and writes up the shift notes. If something changes &mdash; a fever spikes, the feeding tube clogs &mdash; she calls the RN or doctor and follows their instructions.
          </p>

          <h3 className="font-semibold text-gray-900 mb-3">What an LPN does on a typical shift</h3>
          <ul className="space-y-2 mb-6">
            {[
              'G-tube feeding and pump management',
              'Medication administration (oral, G-tube, injections)',
              'Blood sugar checks and insulin',
              'Wound care and dressing changes',
              'Vital sign monitoring',
              'Catheter care',
              'Reporting changes to the RN or doctor',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h3 className="font-semibold text-blue-900 mb-2">Your child probably needs an LPN if:</h3>
            <ul className="space-y-1 text-blue-800 text-sm">
              <li>They have a G-tube or feeding pump</li>
              <li>They take scheduled medications that need a nurse to administer</li>
              <li>They have wounds that need regular care</li>
              <li>They need monitoring but don&apos;t have a vent or trach</li>
            </ul>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Read more about <Link href="/services/lpn-services" className="text-primary hover:underline">LPN services through GAPP</Link>.
          </p>
        </div>
      </section>

      {/* PCS deep dive */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Care Services (PCS): what they do in your home</h2>
          <p className="text-gray-700 mb-6">
            She arrives in the morning. She helps your child get out of bed, runs the bath, gets them clean and dressed. She makes breakfast and helps them eat. She gets your child positioned in the wheelchair, does the range-of-motion exercises the therapist wrote up, and keeps them safe and comfortable. While she&apos;s there, you can take a shower, drive your other kid to school, or just sit down for twenty minutes. That&apos;s what PCS is for.
          </p>

          <h3 className="font-semibold text-gray-900 mb-3">What a PCS aide does on a typical shift</h3>
          <ul className="space-y-2 mb-6">
            {[
              'Bathing and personal hygiene',
              'Dressing and grooming',
              'Feeding assistance (not tube feeding)',
              'Toileting and diaper changes',
              'Positioning and transfers (bed to wheelchair, etc.)',
              'Range-of-motion exercises prescribed by a therapist',
              'Light housekeeping related to the child\'s care',
              'Companionship and safety supervision',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
            <h3 className="font-semibold text-orange-900 mb-2">Your child probably needs PCS if:</h3>
            <ul className="space-y-1 text-orange-800 text-sm">
              <li>They need physical help with daily activities like bathing and dressing</li>
              <li>They can&apos;t take care of themselves due to a disability</li>
              <li>They need help with mobility and transfers</li>
              <li>A family member is doing all of this right now and needs relief</li>
            </ul>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Read more about <Link href="/services/personal-care" className="text-primary hover:underline">personal care services through GAPP</Link>.
          </p>
        </div>
      </section>

      {/* Which service is right */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to figure out which service your child needs</h2>
          <p className="text-gray-700 mb-6">
            Here&apos;s the short version:
          </p>
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
              <span className="font-semibold text-primary whitespace-nowrap">Medical equipment</span>
              <span className="text-gray-400">→</span>
              <span className="text-gray-700">Trach, ventilator, IV lines = you need an <strong>RN</strong></span>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
              <span className="font-semibold text-accent whitespace-nowrap">Medical tasks</span>
              <span className="text-gray-400">→</span>
              <span className="text-gray-700">G-tube, medications, wound care = you need an <strong>LPN</strong></span>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
              <span className="font-semibold text-orange-500 whitespace-nowrap">Daily living help</span>
              <span className="text-gray-400">→</span>
              <span className="text-gray-700">Bathing, dressing, feeding, mobility = you need <strong>PCS</strong></span>
            </div>
          </div>
          <p className="text-gray-700">
            Not sure where your child falls? Your agency can help you figure it out. You can also try our <Link href="/screener" className="text-primary hover:underline">eligibility screener</Link> to get a starting point.
          </p>
        </div>
      </section>

      {/* Can you get more than one */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Can you get more than one type of service?</h2>
          <p className="text-gray-700 mb-4">
            Yes. Many children get a combination. A child with a trach might have an RN during the day and a PCS aide in the evening for bath time and bedtime routine. Another child might get LPN shifts for medication management plus PCS hours so a parent can work.
          </p>
          <p className="text-gray-700">
            What you get depends on what the doctor orders and what Medicaid approves. Your agency handles the authorization for each service type. If you&apos;re in <Link href="/dekalb" className="text-primary hover:underline">DeKalb County</Link> or anywhere else in Georgia, you can search for providers who offer the combination you need.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common questions about GAPP services</h2>
          <div className="space-y-4">
            {SERVICE_FAQS.map((faq, i) => (
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

      {/* Related resources */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/services/rn-nursing"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">RN nursing services</h3>
              <p className="text-sm text-gray-600">Full breakdown of what registered nurses do through GAPP.</p>
            </Link>
            <Link
              href="/services/personal-care"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Personal care services</h3>
              <p className="text-sm text-gray-600">What PCS aides do and who qualifies.</p>
            </Link>
            <Link
              href="/how-to-apply-for-gapp"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">How to apply for GAPP</h3>
              <p className="text-sm text-gray-600">Step-by-step process from Medicaid to first nurse visit.</p>
            </Link>
            <Link
              href="/directory"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Provider directory</h3>
              <p className="text-sm text-gray-600">Search by county and service type.</p>
            </Link>
            <Link
              href="/gapp-paid-caregiver"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Get paid as a family caregiver</h3>
              <p className="text-sm text-gray-600">How family members can be hired through GAPP.</p>
            </Link>
            <Link
              href="/gapp-respite-care"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">GAPP respite care</h3>
              <p className="text-sm text-gray-600">How to get backup nursing hours when you need a break.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Find a GAPP provider for your child</h2>
          <p className="text-gray-600 mb-6">
            Search by county, filter by service type, and request a callback from providers accepting new patients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/directory"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Browse the directory
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/screener"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors"
            >
              Check eligibility
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
