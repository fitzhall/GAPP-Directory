import Link from 'next/link'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

const FAQS = [
  {
    question: 'What is a medically fragile child?',
    answer: 'A medically fragile child has complex medical needs that require ongoing skilled nursing care. This includes children with tracheostomies, ventilator dependence, feeding tubes, seizure disorders, or other conditions requiring regular medical intervention that goes beyond routine childcare.',
  },
  {
    question: 'What care options exist for medically fragile children in Georgia?',
    answer: 'Georgia offers several options: GAPP (Georgia Pediatric Program) for in-home skilled nursing, CTCC (Children\'s Transition Care Centers) for facility-based care, Katie Beckett waiver for Medicaid eligibility, and TEFRA for children who don\'t qualify for traditional Medicaid. Most families prefer GAPP for home-based care.',
  },
  {
    question: 'How do I know if my child qualifies as medically fragile?',
    answer: 'Children typically qualify if they require skilled nursing care that goes beyond normal childcare — things like trach care, ventilator management, G-tube feedings, complex medication administration, or continuous monitoring. A physician order documenting medical necessity is required.',
  },
  {
    question: 'Is care for medically fragile children covered by Medicaid?',
    answer: 'Yes. Georgia Medicaid covers GAPP services 100% for eligible children. Even if your family income is too high for traditional Medicaid, programs like Katie Beckett and TEFRA can help your child qualify based on their medical needs alone.',
  },
  {
    question: 'Can medically fragile children receive care at home?',
    answer: 'Yes. The Georgia Pediatric Program (GAPP) specifically provides in-home skilled nursing care. This allows children to stay with their families while receiving professional medical care from RNs, LPNs, and personal care aides.',
  },
  {
    question: 'How do I find care providers for my medically fragile child?',
    answer: 'Start by confirming your child has active Georgia Medicaid, then use our directory to find GAPP providers in your county. Look for agencies that offer the services your child needs (RN, LPN, or PCS) and are currently accepting new patients.',
  },
  {
    question: 'What if my medically fragile child needs 24-hour care?',
    answer: 'GAPP can provide up to 24-hour care for children with the highest medical needs, depending on the prior authorization approval. The number of hours approved depends on the child\'s documented medical necessity and physician orders.',
  },
]

export const metadata: Metadata = {
  title: 'Medically Fragile Children Care in Georgia – Home Care & Support Options',
  description: 'Find care options for medically fragile children in Georgia. Learn about GAPP home nursing, Medicaid coverage, and how to find skilled nursing providers for your child.',
  keywords: 'medically fragile children care Georgia, pediatric home care Georgia, special needs children care, GAPP Georgia, medically complex children, skilled nursing for children Georgia',
  openGraph: {
    title: 'Care for Medically Fragile Children in Georgia',
    description: 'Comprehensive guide to care options for medically fragile children in Georgia. Home nursing, Medicaid coverage, and provider resources.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/medically-fragile-children-care',
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

export default async function MedicallyFragileChildrenCarePage() {
  const stats = await getProviderStats()

  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Medically Fragile Children Care', url: 'https://www.georgiagapp.com/medically-fragile-children-care' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Medically Fragile Children Care</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Care for Medically Fragile Children in Georgia
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your child deserves the best care — at home, with your family. Learn about Georgia&apos;s programs for children with complex medical needs and find providers who can help.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/screener"
              className="inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Check If Your Child Qualifies
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/directory"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors"
            >
              Find Care Providers
            </Link>
          </div>
        </div>
      </section>

      {/* What is a Medically Fragile Child */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            What Does &quot;Medically Fragile&quot; Mean?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              A <strong>medically fragile child</strong> has complex health conditions that require ongoing skilled nursing care — care that goes beyond what parents can safely provide without professional training.
            </p>
            <p>
              These children often have conditions like:
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Respiratory Conditions</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Tracheostomy
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Ventilator dependence
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Chronic respiratory failure
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Oxygen dependence
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Nutritional Needs</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  G-tube (gastrostomy tube)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  NG tube feeding
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  TPN (IV nutrition)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  Feeding disorders
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Neurological Conditions</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  Intractable seizures
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  Cerebral palsy
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  Brain injuries
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  Developmental delays
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Other Complex Needs</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                  Central line care
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                  Wound care
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                  Complex medications
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                  Genetic disorders
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Care Options in Georgia */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Care Options for Medically Fragile Children in Georgia
          </h2>

          {/* GAPP - Primary Option */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-primary mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">RECOMMENDED</span>
                <h3 className="text-xl font-bold text-gray-900">GAPP – Georgia Pediatric Program</h3>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              <strong>In-home skilled nursing care</strong> so your child can stay at home with your family. This is the most popular option for families with medically fragile children in Georgia.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-gray-700">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                RN and LPN skilled nursing in your home
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                100% covered by Georgia Medicaid
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Up to 24-hour care for complex needs
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {stats.total} providers across Georgia
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/gapp-providers-georgia"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
              >
                Learn About GAPP
              </Link>
              <Link
                href="/directory"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-primary font-semibold rounded-lg border border-primary hover:bg-primary/5 transition-colors"
              >
                Find GAPP Providers
              </Link>
            </div>
          </div>

          {/* Other Options */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">CTCC – Transition Care Centers</h3>
              <p className="text-sm text-gray-600 mb-3">
                Facility-based care for children transitioning from hospital to home. Short-term option while arranging home care.
              </p>
              <a
                href="https://dhs.georgia.gov/locations/childrens-transition-care-centers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary font-medium hover:underline"
              >
                Learn more →
              </a>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Katie Beckett Waiver</h3>
              <p className="text-sm text-gray-600 mb-3">
                Helps children with significant medical needs qualify for Medicaid regardless of family income.
              </p>
              <Link href="/waivers" className="text-sm text-primary font-medium hover:underline">
                Learn more →
              </Link>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">TEFRA</h3>
              <p className="text-sm text-gray-600 mb-3">
                Another pathway to Medicaid for children whose family income is too high for traditional Medicaid.
              </p>
              <Link href="/waivers" className="text-sm text-primary font-medium hover:underline">
                Learn more →
              </Link>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Private Duty Nursing</h3>
              <p className="text-sm text-gray-600 mb-3">
                Private-pay option for families who don&apos;t qualify for Medicaid or need additional hours beyond what Medicaid covers.
              </p>
              <span className="text-sm text-gray-500">Contact providers directly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Home Care */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Why Home Care for Medically Fragile Children?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600 mb-8">
            <p>
              Research consistently shows that medically fragile children thrive better at home. They have better outcomes, fewer hospital readmissions, and improved quality of life when surrounded by family.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Family Connection</h3>
                <p className="text-sm text-gray-600">Children stay connected with siblings, parents, and their support system.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Reduced Infection Risk</h3>
                <p className="text-sm text-gray-600">Home environments expose children to fewer hospital-acquired infections.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Consistent Routine</h3>
                <p className="text-sm text-gray-600">Children benefit from predictable schedules and familiar surroundings.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Cost Effective</h3>
                <p className="text-sm text-gray-600">Home care costs significantly less than hospital or facility care.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            Getting Care for Your Medically Fragile Child
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Check Eligibility</h3>
                <p className="text-gray-600">Take our 2-minute screener to see if your child may qualify for GAPP services and what documentation you&apos;ll need.</p>
                <Link href="/screener" className="inline-block mt-2 text-primary font-medium text-sm hover:underline">
                  Take the eligibility screener →
                </Link>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Confirm Medicaid Status</h3>
                <p className="text-gray-600">Your child needs active Georgia Medicaid before starting GAPP. If you don&apos;t have Medicaid, explore Katie Beckett or TEFRA options.</p>
                <Link href="/waivers" className="inline-block mt-2 text-primary font-medium text-sm hover:underline">
                  Learn about Medicaid waivers →
                </Link>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Get a Physician Order</h3>
                <p className="text-gray-600">Ask your child&apos;s doctor for an order documenting the medical necessity for skilled nursing care at home.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Find a GAPP Provider</h3>
                <p className="text-gray-600">Use our directory to find providers in your county who accept new patients. Contact 2-3 agencies to compare.</p>
                <Link href="/directory" className="inline-block mt-2 text-primary font-medium text-sm hover:underline">
                  Search GAPP providers →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <details key={index} className="group bg-gray-50 rounded-xl">
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
            Find Care for Your Child Today
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Search our directory of {stats.total} GAPP providers across Georgia. Find skilled nursing care in your county.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/screener"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Check Eligibility First
            </Link>
            <Link
              href="/directory"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Search Providers
            </Link>
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Related Resources</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/gapp-providers-georgia" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-gray-900 mb-1">GAPP Providers Georgia</h3>
              <p className="text-sm text-gray-600">Complete provider directory</p>
            </Link>
            <Link href="/gapp-home-care" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-gray-900 mb-1">GAPP Home Care</h3>
              <p className="text-sm text-gray-600">Understanding home care services</p>
            </Link>
            <Link href="/gapp-approval-guide" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-gray-900 mb-1">GAPP Approval Guide</h3>
              <p className="text-sm text-gray-600">Step-by-step approval process</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
