import Link from 'next/link'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

const FAQS = [
  {
    question: 'What is GAPP home care?',
    answer: 'GAPP home care is in-home skilled nursing and personal care for medically fragile children in Georgia. Through the Georgia Pediatric Program (GAPP), qualified children receive RN nursing, LPN services, or personal care assistance in their own home rather than a hospital or facility.',
  },
  {
    question: 'Who qualifies for GAPP home care in Georgia?',
    answer: 'Children who qualify typically have complex medical needs requiring skilled nursing care, active Georgia Medicaid, a physician order documenting medical necessity, and conditions like tracheostomy, ventilator dependence, G-tube feeding, or other medically fragile diagnoses.',
  },
  {
    question: 'How many hours of home care does GAPP provide?',
    answer: 'GAPP hours are determined by medical necessity and prior authorization. Some children receive a few hours per week for basic skilled nursing, while others with complex needs may receive up to 24-hour care. Your physician order and the prior authorization process determine approved hours.',
  },
  {
    question: 'What does a GAPP home care nurse do?',
    answer: 'GAPP nurses provide skilled care including: tracheostomy and ventilator management, G-tube feedings and care, medication administration, seizure monitoring, vital signs monitoring, respiratory treatments, wound care, and overall health assessment and intervention.',
  },
  {
    question: 'Can I choose my GAPP home care agency?',
    answer: 'Yes. Families have the right to choose any Medicaid-enrolled GAPP provider that serves their county and offers the services their child needs. You can switch providers at any time if you\'re not satisfied with care.',
  },
  {
    question: 'Is GAPP home care covered by Medicaid?',
    answer: 'Yes. GAPP services are 100% covered by Georgia Medicaid for eligible children. There is no cost to families for approved services. The program exists specifically to provide home-based care as an alternative to institutional care.',
  },
  {
    question: 'How do I start GAPP home care for my child?',
    answer: 'You need: (1) Active Georgia Medicaid for your child, (2) A physician order documenting the need for skilled nursing, (3) A GAPP provider to submit a prior authorization request. Use our directory to find providers accepting new patients in your county.',
  },
]

export const metadata: Metadata = {
  title: 'GAPP Home Care in Georgia – In-Home Nursing for Medically Fragile Children',
  description: 'Learn about GAPP home care services in Georgia. Find providers offering in-home skilled nursing, LPN care, and personal care for medically fragile children. Covered by Medicaid.',
  keywords: 'GAPP home care Georgia, pediatric home care Georgia, in-home nursing Georgia, medically fragile children home care, GAPP nursing services, pediatric home health Georgia',
  openGraph: {
    title: 'GAPP Home Care in Georgia – In-Home Nursing for Children',
    description: 'In-home skilled nursing and personal care for medically fragile children through Georgia\'s Pediatric Program. 100% Medicaid covered.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://georgiagapp.com/gapp-home-care',
  },
}

async function getProviderStats() {
  const { data, error } = await supabase
    .from('providers')
    .select('id, services_offered, accepting_new_patients, is_verified')
    .eq('is_active', true)

  if (error || !data) {
    return { total: 0, accepting: 0, withRN: 0, withLPN: 0 }
  }

  return {
    total: data.length,
    accepting: data.filter(p => p.accepting_new_patients).length,
    withRN: data.filter(p => p.services_offered?.includes('RN')).length,
    withLPN: data.filter(p => p.services_offered?.includes('LPN')).length,
  }
}

const TOP_COUNTIES = [
  { slug: 'fulton', name: 'Fulton' },
  { slug: 'gwinnett', name: 'Gwinnett' },
  { slug: 'cobb', name: 'Cobb' },
  { slug: 'dekalb', name: 'DeKalb' },
  { slug: 'clayton', name: 'Clayton' },
  { slug: 'cherokee', name: 'Cherokee' },
]

export default async function GAPPHomeCareGeorgiaPage() {
  const stats = await getProviderStats()

  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://georgiagapp.com' },
          { name: 'GAPP Home Care', url: 'https://georgiagapp.com/gapp-home-care' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">GAPP Home Care</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            GAPP Home Care in Georgia
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            In-home skilled nursing and personal care for medically fragile children. Keep your child at home with the professional medical support they need.
          </p>

          {/* Key Benefits */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <div className="text-2xl mb-1">🏠</div>
              <div className="font-semibold text-gray-900">Care at Home</div>
              <div className="text-sm text-gray-600">Not in a hospital</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <div className="text-2xl mb-1">💉</div>
              <div className="font-semibold text-gray-900">Skilled Nursing</div>
              <div className="text-sm text-gray-600">RN & LPN services</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <div className="text-2xl mb-1">✓</div>
              <div className="font-semibold text-gray-900">Medicaid Covered</div>
              <div className="text-sm text-gray-600">No cost to families</div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/directory"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Find Home Care Providers
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href="/screener"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors"
            >
              Check Eligibility
            </Link>
          </div>
        </div>
      </section>

      {/* What is GAPP Home Care */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            What is GAPP Home Care?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              <strong>GAPP home care</strong> provides professional skilled nursing services to medically fragile children in their own homes. Through Georgia&apos;s Pediatric Program (GAPP), families can receive the same level of medical care their child would get in a hospital — but in the comfort and familiarity of home.
            </p>
            <p>
              The program exists because research shows that children with complex medical needs often thrive better at home with their families. Home care also costs significantly less than hospital or facility care, making it a win for families and the Medicaid system.
            </p>
            <p>
              GAPP home care is <strong>100% covered by Georgia Medicaid</strong> for eligible children. There is no cost to families for approved services.
            </p>
          </div>
        </div>
      </section>

      {/* Types of Home Care */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Types of GAPP Home Care Services
          </h2>
          <div className="space-y-6">
            {/* RN Care */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">RN Skilled Nursing</h3>
                  <p className="text-gray-600 mb-3">
                    Registered Nurses provide the highest level of home care for children with complex medical needs.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tracheostomy and ventilator management</li>
                    <li>• IV medication administration</li>
                    <li>• Complex wound care</li>
                    <li>• Central line care</li>
                    <li>• Comprehensive nursing assessment</li>
                  </ul>
                  <Link href="/services/rn-nursing" className="inline-block mt-3 text-primary font-medium text-sm hover:underline">
                    Learn more about RN services →
                  </Link>
                </div>
              </div>
            </div>

            {/* LPN Care */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">LPN Services</h3>
                  <p className="text-gray-600 mb-3">
                    Licensed Practical Nurses provide skilled nursing care under RN supervision.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Medication administration</li>
                    <li>• G-tube feedings and care</li>
                    <li>• Basic wound care</li>
                    <li>• Vital signs monitoring</li>
                    <li>• Respiratory treatments</li>
                  </ul>
                  <Link href="/services/lpn-services" className="inline-block mt-3 text-primary font-medium text-sm hover:underline">
                    Learn more about LPN services →
                  </Link>
                </div>
              </div>
            </div>

            {/* Personal Care */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Care Services (PCS)</h3>
                  <p className="text-gray-600 mb-3">
                    Personal care aides help with daily living activities for children who need extra support.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Bathing and personal hygiene</li>
                    <li>• Feeding assistance</li>
                    <li>• Mobility support</li>
                    <li>• Supervision and safety</li>
                    <li>• Light housekeeping related to care</li>
                  </ul>
                  <Link href="/services/personal-care" className="inline-block mt-3 text-primary font-medium text-sm hover:underline">
                    Learn more about Personal Care →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Qualifies */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Who Qualifies for GAPP Home Care?
          </h2>
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700 mb-4">
              Children typically qualify for GAPP home care if they:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Have <strong>active Georgia Medicaid</strong> (not pending)</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Have a <strong>medically fragile condition</strong> requiring skilled nursing</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Have a <strong>physician order</strong> documenting medical necessity</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Are <strong>under 21 years old</strong></span>
              </li>
            </ul>
          </div>
          <p className="text-gray-600 mb-4">
            Common qualifying conditions include tracheostomy, ventilator dependence, G-tube feeding, complex seizure disorders, and other conditions requiring ongoing skilled nursing care.
          </p>
          <Link
            href="/screener"
            className="inline-flex items-center text-primary font-semibold hover:underline"
          >
            Take our eligibility screener to check if your child may qualify
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            How to Get GAPP Home Care
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Confirm Medicaid is Active</h3>
                <p className="text-gray-600">Your child must have active Georgia Medicaid before starting GAPP services. Pending Medicaid does not count.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Get a Physician Order</h3>
                <p className="text-gray-600">Ask your child&apos;s doctor for an order documenting the need for skilled nursing care at home. This must specify the type of care needed.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Choose a GAPP Provider</h3>
                <p className="text-gray-600">Use our directory to find providers in your county who are accepting new patients. Contact 2-3 agencies to compare.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Provider Submits Prior Authorization</h3>
                <p className="text-gray-600">Your chosen agency handles the paperwork. Once approved, they&apos;ll schedule an intake and begin care.</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Link
              href="/gapp-approval-guide"
              className="inline-flex items-center text-primary font-semibold hover:underline"
            >
              Read our complete GAPP approval guide
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Find Providers by County */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center">
            Find GAPP Home Care Providers
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Currently <strong>{stats.accepting} providers</strong> are accepting new patients across Georgia.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {TOP_COUNTIES.map(county => (
              <Link
                key={county.slug}
                href={`/${county.slug}`}
                className="px-4 py-3 bg-gray-50 hover:bg-primary/5 hover:border-primary border border-gray-200 rounded-lg text-center text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                {county.name} County
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/directory"
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Search All Counties
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <details key={index} className="group bg-white rounded-xl">
                <summary className="flex justify-between items-center cursor-pointer p-5 font-semibold text-gray-900">
                  {faq.question}
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-gray-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 px-4 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Find GAPP Home Care Today
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Search {stats.total} GAPP providers across Georgia. Find agencies with RN nursing, LPN services, and personal care in your county.
          </p>
          <Link
            href="/directory"
            className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Find Home Care Providers
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Related Pages */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Related Resources</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/gapp-providers-georgia" className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-gray-900 mb-1">GAPP Providers Georgia</h3>
              <p className="text-sm text-gray-600">Complete provider directory</p>
            </Link>
            <Link href="/gapp-approval-guide" className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-gray-900 mb-1">GAPP Approval Guide</h3>
              <p className="text-sm text-gray-600">Step-by-step process</p>
            </Link>
            <Link href="/medically-fragile-children-care" className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-gray-900 mb-1">Medically Fragile Care</h3>
              <p className="text-sm text-gray-600">Care options overview</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
