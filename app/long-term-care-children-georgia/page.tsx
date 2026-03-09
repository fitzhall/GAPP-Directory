import Link from 'next/link'
import { Metadata } from 'next'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

const FAQS = [
  {
    question: 'What counts as long term care for a child in Georgia?',
    answer: 'Any ongoing medical care your child needs for months or years. This includes in-home nursing through GAPP, personal care aides, therapy services, and medical equipment. Most families with medically fragile children use GAPP as their primary long-term care program.',
  },
  {
    question: 'Is long term care for children covered by Medicaid in Georgia?',
    answer: 'Yes. Georgia Medicaid covers GAPP nursing, personal care services, therapy, medical equipment, and prescriptions at no cost to families. If your child doesn\'t qualify for regular Medicaid due to family income, the Katie Beckett waiver can qualify them based on medical needs alone.',
  },
  {
    question: 'How many hours of in-home nursing can my child get long term?',
    answer: 'It depends on your child\'s medical needs. Some children get 8-12 hours a day. Others with more complex conditions get 24/7 nursing coverage. Hours are authorized by Medicaid based on your physician\'s order and reviewed every 6-12 months.',
  },
  {
    question: 'Can my child stay on GAPP long term or does it expire?',
    answer: 'GAPP coverage continues as long as your child meets eligibility: under 21, active Georgia Medicaid, and documented medical necessity. Your authorization gets renewed periodically (usually every 6-12 months), but there is no lifetime limit on GAPP services.',
  },
  {
    question: 'What happens when my child turns 21 and ages out of GAPP?',
    answer: 'At 21, children transition out of GAPP. Georgia has adult waiver programs like NOW (New Options Waiver) and COMP (Comprehensive Supports Waiver) for adults with disabilities. Start the transition planning with your care coordinator at least a year before your child turns 21.',
  },
  {
    question: 'Do I have to use an institution or can my child stay home?',
    answer: 'Your child can stay home. That\'s the whole point of GAPP. The program exists specifically to keep children out of hospitals and facilities by bringing nursing care to your house. Home-based care is almost always less expensive and better for children.',
  },
]

export const metadata: Metadata = {
  title: 'Long term care for children in Georgia: your options explained',
  description: 'Long term care options for children in Georgia include GAPP home nursing, Katie Beckett Medicaid, therapy services, and medical equipment. Here is how each one works.',
  keywords: 'long term care for children, long term care children Georgia, pediatric long term care, GAPP long term nursing, medically fragile child long term care, chronic care children Georgia',
  openGraph: {
    title: 'Long term care for children in Georgia: your options explained',
    description: 'What long term care looks like for children with complex medical needs in Georgia, from GAPP nursing to medical equipment and therapy.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/long-term-care-children-georgia',
  },
}

export default function LongTermCareChildrenGeorgiaPage() {
  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Long term care for children', url: 'https://www.georgiagapp.com/long-term-care-children-georgia' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Long term care for children</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Long term care for children in Georgia
          </h1>
          <p className="text-lg text-gray-600">
            When your child needs medical care that lasts months or years, not just a hospital visit, here is what Georgia actually offers and how to get it.
          </p>
        </div>
      </section>

      {/* What long term care means */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What long term care means for kids</h2>
          <p className="text-gray-700 mb-4">
            When adults talk about &quot;long term care,&quot; they usually mean nursing homes. For children, it means something different. It means getting ongoing medical care at home so your kid can grow up in their own bedroom instead of a hospital room.
          </p>
          <p className="text-gray-700 mb-4">
            In Georgia, most long-term pediatric care goes through the <Link href="/georgia-pediatric-program" className="text-primary hover:underline">Georgia Pediatric Program (GAPP)</Link>. GAPP sends nurses and personal care aides to your home, covered by Medicaid. Your child gets the medical attention they need. You get to keep your family together.
          </p>
          <p className="text-gray-700">
            The rest of this page breaks down every option Georgia has, who qualifies, and what to do first.
          </p>
        </div>
      </section>

      {/* Option 1: GAPP */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">GAPP home nursing (the main option)</h2>
          <p className="text-gray-700 mb-4">
            GAPP is the primary long-term care program for children in Georgia. It covers three types of in-home care:
          </p>

          <div className="space-y-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">RN nursing</h3>
              <p className="text-gray-600 text-sm">
                For children with the most complex needs. Trach care, ventilator management, IV medications, and clinical assessments. <Link href="/services/rn-nursing" className="text-primary hover:underline">More about RN services</Link>.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">LPN services</h3>
              <p className="text-gray-600 text-sm">
                Medication administration, G-tube feedings, wound care, and vital sign monitoring under RN supervision. <Link href="/services/lpn-services" className="text-primary hover:underline">More about LPN services</Link>.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Personal care services (PCS)</h3>
              <p className="text-gray-600 text-sm">
                Help with bathing, feeding, mobility, and daily living. A family member can sometimes be the paid PCS aide. <Link href="/services/personal-care" className="text-primary hover:underline">More about PCS</Link> or <Link href="/gapp-paid-caregiver" className="text-primary hover:underline">how family members get paid</Link>.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-blue-900 text-sm">
              <strong>Who qualifies:</strong> Children under 21 with active Georgia Medicaid and a physician-documented need for skilled nursing at home. Not sure? Take our <Link href="/screener" className="text-primary hover:underline">2-minute eligibility screener</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Option 2: Medicaid pathways */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Medicaid coverage for long term care</h2>
          <p className="text-gray-700 mb-6">
            GAPP is paid by Medicaid. If your child already has Georgia Medicaid, you can go straight to finding a provider. If not, here are the paths in:
          </p>

          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Regular Georgia Medicaid</h3>
              <p className="text-gray-600 text-sm">
                Income-based. Apply through Georgia Gateway (gateway.ga.gov). Takes 30-45 days. If your family income qualifies, this is the fastest path.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Katie Beckett / TEFRA</h3>
              <p className="text-gray-600 text-sm">
                No income limit. Qualifies your child based on their disability and medical needs alone. Takes 45-90 days. <Link href="/katie-beckett-waiver-georgia" className="text-primary hover:underline">Full Katie Beckett guide</Link>.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">SSI (Supplemental Security Income)</h3>
              <p className="text-gray-600 text-sm">
                If approved for SSI, your child automatically gets Medicaid in Georgia. Apply through Social Security (1-800-772-1213). This path can take several months.
              </p>
            </div>
          </div>

          <p className="text-gray-700">
            Many families use Katie Beckett because their household income disqualifies them from regular Medicaid, but their child clearly needs nursing care. The <Link href="/gapp-medicaid-requirements" className="text-primary hover:underline">Medicaid requirements page</Link> walks through each pathway in detail.
          </p>
        </div>
      </section>

      {/* Option 3: Beyond nursing */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Other long-term services your child can get</h2>
          <p className="text-gray-700 mb-6">
            GAPP handles nursing. But long-term care for children usually involves more than one service. Once your child has Medicaid, they also get:
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Therapy services', desc: 'Physical therapy, occupational therapy, and speech therapy. Covered by Medicaid with a physician referral.' },
              { title: 'Durable medical equipment', desc: 'Wheelchairs, feeding pumps, oxygen, suction machines, hospital beds. Medicaid covers equipment your child uses daily.' },
              { title: 'Prescriptions', desc: 'Medications including specialty drugs that private insurance often limits.' },
              { title: 'Respite care', desc: 'Backup nursing hours so you can take a break. Built into GAPP.' },
              { title: 'Medical transportation', desc: 'Non-emergency rides to and from appointments. Call your Medicaid plan to schedule.' },
              { title: 'Dental and vision', desc: 'Pediatric dental and vision care, including sedation dentistry for children who need it.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-700 mt-6">
            For respite care specifically, see our <Link href="/gapp-respite-care" className="text-primary hover:underline">respite care guide</Link>. It is one of the most underused GAPP benefits.
          </p>
        </div>
      </section>

      {/* What to expect long term */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What long-term GAPP care actually looks like</h2>
          <p className="text-gray-700 mb-4">
            Once you are set up with a GAPP provider, here is the routine: nurses come to your home on a schedule you agree on with the agency. They follow your child&apos;s care plan. You handle the parenting. They handle the medical tasks.
          </p>
          <p className="text-gray-700 mb-4">
            Every 6-12 months, your authorization gets reviewed. Your agency submits updated documentation. Your doctor confirms your child still needs the same level of care (or more, or less). Medicaid renews the authorization. The whole thing repeats.
          </p>
          <p className="text-gray-700 mb-4">
            If your agency is not working out, you can switch at any time without losing services. <Link href="/how-to-switch-gapp-providers" className="text-primary hover:underline">Here is how to switch providers</Link>.
          </p>
          <p className="text-gray-700">
            If your child&apos;s needs change, your doctor updates the orders and your agency submits a modified authorization. You do not start from scratch.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Long term care FAQs</h2>
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
              href="/georgia-pediatric-program"
              className="bg-gray-50 rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Georgia Pediatric Program</h3>
              <p className="text-sm text-gray-600">Full guide to GAPP eligibility and services.</p>
            </Link>
            <Link
              href="/katie-beckett-waiver-georgia"
              className="bg-gray-50 rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Katie Beckett waiver</h3>
              <p className="text-sm text-gray-600">Medicaid for kids regardless of family income.</p>
            </Link>
            <Link
              href="/pediatric-home-nursing-georgia"
              className="bg-gray-50 rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Pediatric home nursing</h3>
              <p className="text-sm text-gray-600">How in-home RN and LPN nursing works.</p>
            </Link>
            <Link
              href="/gapp-services-explained"
              className="bg-gray-50 rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">GAPP services explained</h3>
              <p className="text-sm text-gray-600">What RN, LPN, and PCS nurses do day-to-day.</p>
            </Link>
            <Link
              href="/gapp-respite-care"
              className="bg-gray-50 rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">GAPP respite care</h3>
              <p className="text-sm text-gray-600">How to get backup nursing hours.</p>
            </Link>
            <Link
              href="/directory"
              className="bg-gray-50 rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Find a GAPP provider</h3>
              <p className="text-sm text-gray-600">Search agencies by county.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-6">
            Check if your child qualifies for GAPP, then find a provider in your county.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/screener"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Check Eligibility
            </Link>
            <Link
              href="/directory"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors"
            >
              Browse Providers
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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
