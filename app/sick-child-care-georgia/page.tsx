import Link from 'next/link'
import { Metadata } from 'next'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

const FAQS = [
  {
    question: 'Can a medically fragile child go to regular daycare in Georgia?',
    answer: 'Most regular daycares can\'t take kids who need medical care during the day. If your child has a trach, feeding tube, or needs medications that require a nurse, standard childcare centers aren\'t set up for that. GAPP provides in-home nursing so your child gets care at home instead.',
  },
  {
    question: 'What is medically fragile daycare?',
    answer: 'A medically fragile daycare is a licensed childcare facility with nurses on staff who can handle complex medical needs. Georgia has very few of these. Most families use GAPP home nursing as the alternative, where an RN or LPN comes to your house during the hours you need coverage.',
  },
  {
    question: 'Does Medicaid pay for childcare for sick children in Georgia?',
    answer: 'Medicaid doesn\'t pay for daycare directly. But if your child qualifies for GAPP, Medicaid pays for a nurse to come to your home. That nurse handles all medical care while you work, sleep, or take care of other things. It\'s not daycare, but it solves the same problem.',
  },
  {
    question: 'What do I do if my child is too sick for daycare but I have to work?',
    answer: 'Apply for GAPP through your child\'s doctor. If approved, a nurse comes to your home during the hours you need. Some families also use a paid family caregiver arrangement through GAPP while they work. Start with our eligibility screener to see if your child qualifies.',
  },
  {
    question: 'How is GAPP different from hiring a babysitter for a sick child?',
    answer: 'A babysitter can\'t administer medications, manage a ventilator, or handle medical emergencies the way a licensed nurse can. GAPP sends RNs and LPNs trained in pediatric care. And Medicaid covers the cost, so you don\'t pay out of pocket.',
  },
  {
    question: 'Can I get GAPP nursing while my child attends school?',
    answer: 'Yes. Some children have a GAPP nurse at school if the school can\'t meet their medical needs. Others use GAPP hours before and after school. Talk to your agency about scheduling nursing hours around your child\'s school day.',
  },
]

export const metadata: Metadata = {
  title: 'Sick child care in Georgia: options when daycare isn\'t enough',
  description: 'When your child is too medically complex for regular daycare, GAPP provides in-home nursing through Medicaid. Find out how it works and who qualifies.',
  keywords: 'sick child care Georgia, medically fragile daycare Georgia, childcare medically complex child, GAPP home nursing childcare, sick child daycare alternative Georgia',
  openGraph: {
    title: 'Sick child care in Georgia: options when daycare isn\'t enough',
    description: 'When regular daycare can\'t handle your child\'s medical needs, GAPP home nursing is the Georgia Medicaid alternative.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/sick-child-care-georgia',
  },
}

export default function SickChildCareGeorgiaPage() {
  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Sick child care in Georgia', url: 'https://www.georgiagapp.com/sick-child-care-georgia' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Sick child care in Georgia</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Sick child care in Georgia: what to do when daycare isn&apos;t an option
          </h1>
          <p className="text-lg text-gray-600">
            Your child needs more medical attention than a daycare can provide. Here&apos;s how Georgia families get in-home nursing coverage through Medicaid.
          </p>
        </div>
      </section>

      {/* The problem */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why regular daycare doesn&apos;t work for medically complex kids</h2>
          <p className="text-gray-700 mb-4">
            You called five daycares. Two said no immediately. Three said they&apos;d &quot;look into it&quot; and never called back. That&apos;s the reality for parents of children with trachs, vents, feeding tubes, or seizure disorders in Georgia. Standard childcare centers don&apos;t have nurses on staff, and they&apos;re not equipped for the medical tasks your child needs throughout the day.
          </p>
          <p className="text-gray-700 mb-4">
            Medically fragile daycare programs do exist, but Georgia has very few of them. They&apos;re concentrated in metro Atlanta, they have waitlists, and they may not match your child&apos;s specific needs or your work schedule.
          </p>
          <p className="text-gray-700">
            For most Georgia families, the answer is GAPP: in-home nursing paid for by Medicaid. Instead of dropping your child off somewhere, a nurse comes to your house.
          </p>
        </div>
      </section>

      {/* What GAPP provides */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How GAPP home nursing works as childcare</h2>
          <p className="text-gray-700 mb-6">
            GAPP (Georgia Pediatric Program) sends licensed nurses to your home to care for your child while you&apos;re at work, sleeping, or handling other responsibilities. It&apos;s not labeled as &quot;childcare,&quot; but for families with medically complex kids, it solves the same problem.
          </p>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">RN nursing</h3>
              <p className="text-gray-700">
                For kids who need tracheostomy care, ventilator management, IV medications, or other complex medical procedures. The RN handles everything medical while you&apos;re away.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">LPN nursing</h3>
              <p className="text-gray-700">
                For medication administration, G-tube feedings, wound care, and basic skilled nursing. An LPN works under RN supervision and costs Medicaid less per hour, so you may get more hours approved.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Personal care services (PCS)</h3>
              <p className="text-gray-700">
                For children who need help with bathing, feeding, mobility, and daily routines but don&apos;t need a nurse. PCS aides can cover the hours when your child needs supervision and physical help but not medical procedures.
              </p>
            </div>
          </div>
          <p className="text-gray-700 mt-4">
            Read more about each service type in our <Link href="/gapp-services-explained" className="text-primary hover:underline">GAPP services guide</Link>.
          </p>
        </div>
      </section>

      {/* Who qualifies */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Does your child qualify?</h2>
          <p className="text-gray-700 mb-4">
            GAPP is for children under 21 with medical conditions that require skilled care at home. Your child needs active Georgia Medicaid and a doctor who will write an order for home nursing.
          </p>
          <p className="text-gray-700 mb-4">
            Common conditions that qualify:
          </p>
          <ul className="space-y-2 mb-6">
            {[
              'Tracheostomy or ventilator dependence',
              'Seizure disorders requiring monitoring',
              'Feeding tubes (G-tube, NG-tube)',
              'Cerebral palsy with daily care needs',
              'Spina bifida or spinal cord conditions',
              'Chronic respiratory conditions (oxygen dependence, frequent suctioning)',
              'Post-surgical recovery requiring skilled nursing',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-700 mb-4">
            If your family earns too much for regular Medicaid, your child may still qualify through <Link href="/katie-beckett-waiver-georgia" className="text-primary hover:underline">Katie Beckett</Link>, which looks at the child&apos;s disability instead of family income.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-blue-900">
              Not sure if your child qualifies? <Link href="/screener" className="text-primary hover:underline font-medium">Take our 2-minute eligibility screener</Link> to find out.
            </p>
          </div>
        </div>
      </section>

      {/* How to get started */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to get GAPP nursing for your child</h2>
          <p className="text-gray-600 mb-8">
            Four steps from &quot;I need help&quot; to having a nurse in your home.
          </p>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">1</span>
                  <h3 className="text-lg font-semibold text-white">Get Medicaid active</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Your child needs Georgia Medicaid before anything else. Apply through <a href="https://gateway.ga.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Georgia Gateway</a> or your local DFCS office. Regular Medicaid takes 30-45 days. Katie Beckett takes 45-90 days. Read our <Link href="/gapp-approval-timeline" className="text-primary hover:underline">approval timeline guide</Link> for details.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">2</span>
                  <h3 className="text-lg font-semibold text-white">Get a physician order</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Your child&apos;s doctor writes an order specifying what nursing care is needed and how many hours per day. The more specific the documentation, the better your chances of getting the hours you actually need.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">3</span>
                  <h3 className="text-lg font-semibold text-white">Pick a GAPP provider agency</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Search by your county in our <Link href="/directory" className="text-primary hover:underline">provider directory</Link>. Call 2-3 agencies. Ask if they have nurses available for the shifts you need. The agency handles the prior authorization paperwork with Medicaid.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-accent px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-accent rounded-full flex items-center justify-center font-bold">4</span>
                  <h3 className="text-lg font-semibold text-white">Nursing starts</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Once Medicaid approves the prior auth (usually 2-6 weeks), your agency assigns a nurse. The first visit includes a home assessment and care plan review. After that, your nurse shows up on schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other options */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Other childcare options for sick kids in Georgia</h2>
          <p className="text-gray-700 mb-4">
            GAPP home nursing is the main path for medically complex children, but there are a few other options depending on your situation:
          </p>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-900 mb-1">Paid family caregiver through GAPP</p>
              <p className="text-gray-700">
                In some cases, a family member can get paid to provide care through GAPP. This works well when a parent or relative is already the primary caregiver. <Link href="/gapp-paid-caregiver" className="text-primary hover:underline">Read how it works</Link>.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">School-based nursing</p>
              <p className="text-gray-700">
                If your child attends school, the school district may provide a nurse during school hours. For before/after school and weekends, GAPP covers the gap.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Respite care</p>
              <p className="text-gray-700">
                If you already have GAPP nursing during the week but need weekend or evening coverage, <Link href="/gapp-respite-care" className="text-primary hover:underline">respite hours</Link> give you scheduled breaks with a backup nurse.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Long-term care coordination</p>
              <p className="text-gray-700">
                For children with chronic conditions that will need ongoing support, <Link href="/long-term-care-children-georgia" className="text-primary hover:underline">long-term care options</Link> in Georgia include therapy services, durable medical equipment, and transition planning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sick child care FAQs</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
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
              href="/gapp-services-explained"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">GAPP services explained</h3>
              <p className="text-sm text-gray-600">What RN, LPN, and PCS cover.</p>
            </Link>
            <Link
              href="/medically-fragile-children-care"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Medically fragile children</h3>
              <p className="text-sm text-gray-600">Care options for complex medical needs.</p>
            </Link>
            <Link
              href="/katie-beckett-waiver-georgia"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Katie Beckett in Georgia</h3>
              <p className="text-sm text-gray-600">Medicaid for kids when family income is too high.</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to find a GAPP provider?</h2>
          <p className="text-gray-600 mb-6">
            Search verified agencies accepting new patients in your county.
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
