import Link from 'next/link'
import { Metadata } from 'next'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

// FAQ data for schema markup and display
const NURSING_FAQS = [
  {
    question: 'What are GAPP pediatric nursing services?',
    answer: 'GAPP pediatric nursing services are in-home skilled nursing visits provided to medically fragile children under 21 on Georgia Medicaid. A licensed RN or LPN delivers medical care at home — things like tracheostomy care, ventilator management, feeding tube care, and medication administration — under a physician\'s plan of care. It is also called private duty nursing (PDN) when it covers continuous, shift-based hours.',
  },
  {
    question: 'What is the difference between GAPP nursing and PCS?',
    answer: 'Skilled nursing (RN or LPN) covers medical procedures that require a license: trach and vent care, IV and injectable medications, wound care, and clinical assessment. Personal Care Services (PCS) covers non-medical help like bathing, dressing, feeding, and mobility. A child can be authorized for both. Family members can usually be hired for PCS, but nursing hours must be filled by a licensed nurse.',
  },
  {
    question: 'Who qualifies for GAPP skilled nursing at home?',
    answer: 'A child generally qualifies if they are under 21, enrolled in Georgia Medicaid, and have a complex medical condition that requires skilled nursing care that would otherwise be provided in a hospital or facility. A physician must order the care and document medical necessity. The amount of nursing hours is set by a prior authorization based on the child\'s needs.',
  },
  {
    question: 'How many nursing hours can a child get through GAPP?',
    answer: 'There is no single fixed number. Authorized hours depend on the child\'s medical needs as documented by their physician and approved by Medicaid. Children with the highest needs — for example, ventilator-dependent children — can receive substantial shift-based private duty nursing hours, while others receive fewer. The prior authorization sets the weekly amount.',
  },
  {
    question: 'What does a GAPP home nurse actually do?',
    answer: 'Depending on the child, a GAPP RN or LPN may perform tracheostomy care and suctioning, manage a ventilator, run tube feedings, administer medications and injectables, monitor vital signs, care for central lines or wounds, and document the child\'s status. They follow the physician\'s plan of care and coordinate with the family and care team.',
  },
  {
    question: 'How do I find a GAPP nursing provider near me?',
    answer: 'Use our provider directory to search by county and filter for nursing (RN/LPN) services. Many agencies cover several counties. Call a few, confirm they have nursing capacity for your child\'s needs and hours, and request a callback. Nursing staffing is tighter than PCS, so contacting multiple agencies improves your odds of full coverage.',
  },
]

export const metadata: Metadata = {
  title: 'GAPP Pediatric Nursing Services in Georgia (RN & LPN)',
  description: 'GAPP pediatric nursing services explained: in-home RN and LPN skilled nursing for medically fragile children, how hours are approved, and finding a provider.',
  keywords: 'GAPP pediatric nursing services, GAPP nursing Georgia, private duty nursing children Georgia, in-home skilled nursing GAPP, RN LPN GAPP provider',
  openGraph: {
    title: 'GAPP Pediatric Nursing Services in Georgia',
    description: 'In-home RN and LPN skilled nursing for medically fragile children through GAPP. Hours, eligibility, and how to find a provider.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/gapp-nursing-services',
  },
}

export default function GAPPNursingServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={NURSING_FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'GAPP nursing services', url: 'https://www.georgiagapp.com/gapp-nursing-services' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">GAPP nursing services</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            GAPP pediatric nursing services in Georgia
          </h1>
          <p className="text-lg text-gray-600">
            GAPP funds in-home skilled nursing for medically fragile children — RN and LPN care
            delivered at home instead of in a hospital. Here is what nursing covers, how hours get
            approved, and how to find a provider with capacity.
          </p>
        </div>
      </section>

      {/* The short answer */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What GAPP nursing covers</h2>
          <div className="bg-gradient-to-br from-accent/10 to-blue-50 rounded-xl border border-accent/20 p-5">
            <p className="text-gray-700 mb-3">
              GAPP skilled nursing — often called <strong>private duty nursing (PDN)</strong> — brings a
              licensed nurse into the home to provide medical care a child would otherwise receive in a
              hospital or facility. It is for children under 21 on Georgia Medicaid with complex,
              ongoing medical needs.
            </p>
            <p className="text-gray-700 mb-3">
              A physician orders the care and documents why it is medically necessary. Medicaid then
              authorizes a set number of nursing hours, and a GAPP agency staffs an RN or LPN to work
              those hours in your home.
            </p>
            <p className="text-gray-700">
              Nursing is different from Personal Care Services. Nursing is medical and license-required;
              PCS is non-medical help with daily living. Many children are approved for both.
            </p>
          </div>
        </div>
      </section>

      {/* What a GAPP nurse does */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What a GAPP nurse does</h2>
          <p className="text-gray-700 mb-4">
            The exact tasks depend on your child&apos;s condition and the physician&apos;s plan of care.
            Common skilled nursing tasks include:
          </p>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ul className="space-y-3">
              {[
                'Tracheostomy care and suctioning',
                'Ventilator and respiratory management',
                'G-tube and feeding pump management',
                'Medication and injectable administration',
                'Central line and IV care',
                'Wound care and dressing changes',
                'Vital sign monitoring and clinical assessment',
                'Seizure monitoring and emergency response',
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
        </div>
      </section>

      {/* RN vs LPN */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">RN vs. LPN under GAPP</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Registered Nurse (RN)</h3>
              <p className="text-gray-700 text-sm mb-3">
                RNs handle the most complex cases — full clinical assessment, care planning, and
                high-acuity procedures. They can supervise LPNs and adjust care within the physician&apos;s orders.
              </p>
              <Link href="/services/rn-nursing" className="text-primary hover:underline text-sm font-medium">
                More on RN services →
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Licensed Practical Nurse (LPN)</h3>
              <p className="text-gray-700 text-sm mb-3">
                LPNs deliver hands-on skilled care — trach care, tube feedings, medications, and monitoring —
                under the direction of an RN or physician. Many shift-based nursing hours are staffed by LPNs.
              </p>
              <Link href="/services/lpn-services" className="text-primary hover:underline text-sm font-medium">
                More on LPN services →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who qualifies */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Who qualifies for GAPP nursing</h2>
          <p className="text-gray-700 mb-4">
            Skilled nursing through GAPP is for children with genuine medical complexity. In general,
            a child needs:
          </p>
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <ul className="space-y-3">
              {[
                'To be under 21 and enrolled in Georgia Medicaid',
                'A complex medical condition requiring skilled (not just personal) care',
                'A physician\'s order documenting medical necessity',
                'Care needs that would otherwise be met in a hospital or facility',
              ].map((req, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-gray-600 text-sm">
            Not sure where your child stands? Run the{' '}
            <Link href="/screener" className="text-primary hover:underline">eligibility screener</Link>{' '}
            or read the{' '}
            <Link href="/gapp-approval-guide" className="text-primary hover:underline">GAPP approval guide</Link>.
          </p>
        </div>
      </section>

      {/* How hours are approved */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How nursing hours are approved</h2>
          <p className="text-gray-700 mb-4">
            The number of nursing hours your child receives is not a flat figure — it is set by a prior
            authorization based on documented medical need. A ventilator-dependent child may receive
            substantial shift-based hours; a child with lower-acuity needs receives fewer.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Staffing reality:</strong> Authorized hours and staffed hours are not always the same.
              Nursing labor is in short supply statewide, so it is common to be approved for more hours than
              a single agency can fill. Working with more than one agency, or asking about their current
              nurse availability, helps you get closer to full coverage.
            </p>
          </div>
        </div>
      </section>

      {/* Related resources */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/pediatric-home-nursing-georgia" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Pediatric home nursing in Georgia</h3>
              <p className="text-sm text-gray-600">The broader picture of in-home nursing for children.</p>
            </Link>
            <Link href="/gapp-services-explained" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">GAPP services explained</h3>
              <p className="text-sm text-gray-600">Nursing, PCS, and respite — how the pieces fit together.</p>
            </Link>
            <Link href="/georgia-pediatric-program" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">The Georgia Pediatric Program (GAPP)</h3>
              <p className="text-sm text-gray-600">A full overview of how GAPP works for families.</p>
            </Link>
            <Link href="/directory" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Find a GAPP nursing provider</h3>
              <p className="text-sm text-gray-600">Search by county and filter for RN/LPN nursing.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">GAPP nursing FAQs</h2>
          <div className="space-y-4">
            {NURSING_FAQS.map((faq, i) => (
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Find a GAPP nursing provider</h2>
          <p className="text-gray-600 mb-6">
            Search agencies that provide in-home RN and LPN nursing in your county, and request a callback
            to confirm they can cover your child&apos;s authorized hours.
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
