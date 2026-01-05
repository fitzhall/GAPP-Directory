import Link from 'next/link'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

const RN_FAQS = [
  {
    question: 'What does a GAPP RN do in the home?',
    answer: 'A GAPP registered nurse provides skilled medical care in your home including medication administration, ventilator management, tracheostomy care, G-tube feedings, seizure monitoring, wound care, and other complex medical procedures. They also train family members on care techniques.',
  },
  {
    question: 'How many hours of RN nursing can my child receive through GAPP?',
    answer: 'The number of RN nursing hours depends on your child\'s assessed medical needs and what is approved in your GAPP authorization. Hours can range from a few hours per week to 24/7 care for children with the most complex needs.',
  },
  {
    question: 'What is the difference between RN and LPN nursing in GAPP?',
    answer: 'RNs (Registered Nurses) have more training and can perform all nursing tasks including assessments, care planning, and complex procedures. LPNs (Licensed Practical Nurses) work under RN supervision and handle routine nursing care. Some children need RN-level care; others do well with LPN services.',
  },
  {
    question: 'Can I choose which RN comes to my home?',
    answer: 'Yes! Once you have GAPP authorization, you can choose any enrolled GAPP provider. The agency will then assign nurses, but you can request changes if a nurse isn\'t a good fit for your family.',
  },
  {
    question: 'What if my child needs overnight RN care?',
    answer: 'Many GAPP providers offer overnight nursing shifts. When searching for providers, look for those who indicate "nights and weekends available." Not all agencies staff overnight shifts, so ask about this during your initial call.',
  },
  {
    question: 'Does GAPP cover RN nursing for school?',
    answer: 'GAPP nursing hours are typically for in-home care. School nursing is usually handled separately through your child\'s IEP or 504 plan. However, some families use GAPP hours for before/after school care or transport.',
  },
]

export const metadata: Metadata = {
  title: 'Pediatric RN Nursing Services in Georgia | GAPP Home Care',
  description: 'Find skilled pediatric RN nursing services through Georgia\'s GAPP program. In-home registered nurse care for children with complex medical needs. Compare providers by county.',
  keywords: 'pediatric RN nursing Georgia, GAPP RN services, skilled nursing children Georgia, home nursing medically fragile child, registered nurse pediatric care Atlanta',
  openGraph: {
    title: 'Pediatric RN Nursing Services in Georgia | GAPP',
    description: 'Find skilled pediatric registered nurse care for your child through Georgia\'s GAPP program. In-home nursing for complex medical needs.',
    type: 'website',
  },
}

async function getRNStats() {
  const { data, error } = await supabase
    .from('providers')
    .select('id, counties_served')
    .eq('is_active', true)
    .contains('services_offered', ['RN'])

  if (error || !data) return { providerCount: 0, countyCount: 0 }

  const allCounties = new Set<string>()
  data.forEach(p => p.counties_served?.forEach((c: string) => allCounties.add(c)))

  return {
    providerCount: data.length,
    countyCount: allCounties.size,
  }
}

// Top counties for RN services (metro areas with most demand)
const TOP_RN_COUNTIES = [
  { slug: 'fulton', name: 'Fulton' },
  { slug: 'gwinnett', name: 'Gwinnett' },
  { slug: 'cobb', name: 'Cobb' },
  { slug: 'dekalb', name: 'DeKalb' },
  { slug: 'clayton', name: 'Clayton' },
  { slug: 'henry', name: 'Henry' },
  { slug: 'chatham', name: 'Chatham' },
  { slug: 'richmond', name: 'Richmond' },
]

export default async function RNNursingPage() {
  const stats = await getRNStats()

  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={RN_FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Services', url: 'https://www.georgiagapp.com/services' },
          { name: 'RN Nursing', url: 'https://www.georgiagapp.com/services/rn-nursing' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">RN Nursing Services</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Pediatric RN Nursing Services in Georgia
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Skilled registered nurse care for children with complex medical needs through Georgia&apos;s GAPP program.
            In-home nursing that allows your child to thrive at home instead of a hospital.
          </p>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <span className="text-3xl font-bold text-primary">{stats.providerCount}+</span>
              <p className="text-sm text-gray-600 mt-1">RN Providers</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <span className="text-3xl font-bold text-primary">{stats.countyCount}</span>
              <p className="text-sm text-gray-600 mt-1">Counties Served</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center col-span-2 sm:col-span-1">
              <span className="text-3xl font-bold text-green-600">Free</span>
              <p className="text-sm text-gray-600 mt-1">Through Medicaid</p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/directory?service=RN"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Find RN Providers
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

      {/* What RN Nurses Do */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Does a GAPP RN Do?</h2>
          <p className="text-gray-600 mb-6">
            Registered nurses through GAPP provide skilled medical care that would otherwise require
            hospitalization or nursing facility placement. This allows medically fragile children to
            live at home with their families.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Ventilator Management', desc: 'Monitoring and adjusting ventilator settings, suctioning, troubleshooting alarms' },
              { title: 'Tracheostomy Care', desc: 'Trach changes, cleaning, suctioning, emergency response' },
              { title: 'G-Tube & J-Tube Feedings', desc: 'Administering feedings, medication through tubes, site care' },
              { title: 'Medication Administration', desc: 'IV medications, injections, complex medication schedules' },
              { title: 'Seizure Monitoring', desc: 'Recognizing seizure activity, administering rescue medications, documentation' },
              { title: 'Wound Care', desc: 'Complex wound dressing changes, ostomy care, skin integrity monitoring' },
              { title: 'Vital Signs Monitoring', desc: 'Continuous or scheduled monitoring of heart rate, oxygen, blood pressure' },
              { title: 'Care Coordination', desc: 'Communicating with doctors, updating care plans, training family members' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RN vs LPN Comparison */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">RN vs LPN: Which Does My Child Need?</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-3 text-left font-semibold"></th>
                  <th className="px-4 py-3 text-left font-semibold">RN (Registered Nurse)</th>
                  <th className="px-4 py-3 text-left font-semibold">LPN (Licensed Practical Nurse)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Training</td>
                  <td className="px-4 py-3 text-gray-700">2-4 year degree</td>
                  <td className="px-4 py-3 text-gray-700">1 year certificate</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Assessments</td>
                  <td className="px-4 py-3 text-gray-700">Can perform full assessments</td>
                  <td className="px-4 py-3 text-gray-700">Limited assessment scope</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">IV Medications</td>
                  <td className="px-4 py-3 text-gray-700">Yes</td>
                  <td className="px-4 py-3 text-gray-700">Limited in most states</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Ventilator Care</td>
                  <td className="px-4 py-3 text-gray-700">Yes</td>
                  <td className="px-4 py-3 text-gray-700">Varies by agency/child</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Care Planning</td>
                  <td className="px-4 py-3 text-gray-700">Creates care plans</td>
                  <td className="px-4 py-3 text-gray-700">Follows care plans</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Best For</td>
                  <td className="px-4 py-3 text-gray-700">Complex, unstable conditions</td>
                  <td className="px-4 py-3 text-gray-700">Stable, routine care needs</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex gap-4">
            <Link
              href="/services/lpn-services"
              className="text-primary hover:underline font-medium text-sm"
            >
              Learn about LPN services →
            </Link>
            <Link
              href="/services/personal-care"
              className="text-primary hover:underline font-medium text-sm"
            >
              Learn about Personal Care (PCS) →
            </Link>
          </div>
        </div>
      </section>

      {/* Find by County */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Find RN Providers by County</h2>
          <p className="text-gray-600 mb-6">
            Browse GAPP providers offering RN nursing services in Georgia&apos;s most populated areas:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TOP_RN_COUNTIES.map(county => (
              <Link
                key={county.slug}
                href={`/${county.slug}`}
                className="px-4 py-3 bg-gray-50 hover:bg-primary/5 hover:text-primary border border-gray-200 rounded-lg text-center font-medium text-gray-700 transition-colors"
              >
                {county.name} County
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/directory?service=RN"
              className="text-primary hover:underline font-medium"
            >
              View all RN providers across Georgia →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">RN Nursing FAQs</h2>
          <div className="space-y-4">
            {RN_FAQS.map((faq, i) => (
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

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Find RN Care for Your Child?</h2>
          <p className="text-gray-600 mb-6">
            Browse verified GAPP providers offering pediatric RN nursing in your county.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/directory?service=RN"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Find RN Providers
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors"
            >
              Help Me Choose
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
