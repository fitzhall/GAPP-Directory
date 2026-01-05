import Link from 'next/link'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

const LPN_FAQS = [
  {
    question: 'What can an LPN do for my child through GAPP?',
    answer: 'Licensed Practical Nurses provide hands-on nursing care including medication administration, G-tube feedings, blood sugar monitoring, catheter care, and vital signs monitoring. They work under RN supervision and follow established care plans.',
  },
  {
    question: 'Is LPN care less expensive than RN care?',
    answer: 'Through GAPP Medicaid, families don\'t pay out of pocket for either RN or LPN services. The type of nurse is determined by your child\'s medical needs, not cost. Some children are approved for LPN care when their condition is stable.',
  },
  {
    question: 'Can an LPN care for a child on a ventilator?',
    answer: 'This varies by agency and the child\'s stability. Some agencies allow experienced LPNs to care for ventilator-dependent children with stable settings, while others require RN care. Your provider can clarify their policies.',
  },
  {
    question: 'What is the difference between LPN and PCS (Personal Care)?',
    answer: 'LPNs are licensed nurses who can administer medications, do medical procedures, and monitor health conditions. PCS aides help with daily activities like bathing, dressing, and feeding but cannot perform medical tasks.',
  },
  {
    question: 'How do I know if my child needs LPN vs RN care?',
    answer: 'Your child\'s doctor and the GAPP assessment will determine the appropriate level of care. Generally, children with stable conditions requiring routine nursing tasks may be approved for LPN care, while those with complex or unstable conditions need RN care.',
  },
  {
    question: 'Can an LPN give injections and IV medications?',
    answer: 'LPNs can give most injections (like insulin). IV medication administration by LPNs is limited in Georgia. If your child requires IV medications at home, you may need RN-level care.',
  },
]

export const metadata: Metadata = {
  title: 'LPN Home Nursing Services in Georgia | GAPP Pediatric Care',
  description: 'Find LPN nursing services for children through Georgia\'s GAPP program. Licensed Practical Nurse care for pediatric patients with stable medical needs. Compare providers.',
  keywords: 'LPN nursing Georgia, GAPP LPN services, pediatric LPN care, licensed practical nurse children, home nursing Georgia, LPN home health',
  openGraph: {
    title: 'LPN Home Nursing Services in Georgia | GAPP',
    description: 'Find licensed practical nurse care for your child through Georgia\'s GAPP program. In-home LPN nursing for stable medical needs.',
    type: 'website',
  },
}

async function getLPNStats() {
  const { data, error } = await supabase
    .from('providers')
    .select('id, counties_served')
    .eq('is_active', true)
    .contains('services_offered', ['LPN'])

  if (error || !data) return { providerCount: 0, countyCount: 0 }

  const allCounties = new Set<string>()
  data.forEach(p => p.counties_served?.forEach((c: string) => allCounties.add(c)))

  return {
    providerCount: data.length,
    countyCount: allCounties.size,
  }
}

const TOP_LPN_COUNTIES = [
  { slug: 'fulton', name: 'Fulton' },
  { slug: 'gwinnett', name: 'Gwinnett' },
  { slug: 'cobb', name: 'Cobb' },
  { slug: 'dekalb', name: 'DeKalb' },
  { slug: 'henry', name: 'Henry' },
  { slug: 'chatham', name: 'Chatham' },
  { slug: 'muscogee', name: 'Muscogee' },
  { slug: 'bibb', name: 'Bibb' },
]

export default async function LPNServicesPage() {
  const stats = await getLPNStats()

  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={LPN_FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Services', url: 'https://www.georgiagapp.com/services' },
          { name: 'LPN Services', url: 'https://www.georgiagapp.com/services/lpn-services' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">LPN Nursing Services</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            LPN Home Nursing Services in Georgia
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Licensed Practical Nurse care for children with stable medical needs through Georgia&apos;s GAPP program.
            Quality nursing care that helps your child thrive at home.
          </p>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <span className="text-3xl font-bold text-purple-600">{stats.providerCount}+</span>
              <p className="text-sm text-gray-600 mt-1">LPN Providers</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <span className="text-3xl font-bold text-purple-600">{stats.countyCount}</span>
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
              href="/directory?service=LPN"
              className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Find LPN Providers
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/screener"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-purple-600 font-medium rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-colors"
            >
              Check Eligibility
            </Link>
          </div>
        </div>
      </section>

      {/* What LPNs Do */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Does a GAPP LPN Do?</h2>
          <p className="text-gray-600 mb-6">
            Licensed Practical Nurses provide essential nursing care for children whose conditions
            are stable but still require skilled medical attention. LPNs work under RN supervision
            and follow established care plans.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Medication Administration', desc: 'Oral medications, injections, eye drops, and scheduled medication management' },
              { title: 'G-Tube Feedings', desc: 'Administering tube feedings, flushing tubes, monitoring tolerance' },
              { title: 'Blood Sugar Monitoring', desc: 'Checking glucose levels, administering insulin, tracking patterns' },
              { title: 'Vital Signs', desc: 'Monitoring temperature, heart rate, blood pressure, oxygen levels' },
              { title: 'Catheter Care', desc: 'Catheter maintenance, output monitoring, skin care' },
              { title: 'Wound Care', desc: 'Routine dressing changes, skin assessments, prevention care' },
              { title: 'Suctioning', desc: 'Oral and nasal suctioning for secretion management' },
              { title: 'Documentation', desc: 'Maintaining care logs, reporting changes to RN supervisor' },
            ].map((item, i) => (
              <div key={i} className="bg-purple-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When LPN is Right */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Is LPN Care Right for Your Child?</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-green-200 p-6">
              <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                LPN Care May Be Appropriate If:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Your child&apos;s condition is stable and predictable
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Medication schedules are routine
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  G-tube feedings follow a set protocol
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  No IV medications are needed
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Care plan is well-established
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Consider RN Care If:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  Your child has frequent medical changes
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  Ventilator support is needed
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  IV medications are required
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  Complex assessments are needed
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  Condition is unstable or unpredictable
                </li>
              </ul>
              <Link
                href="/services/rn-nursing"
                className="text-blue-600 hover:underline font-medium text-sm mt-4 inline-block"
              >
                Learn about RN services →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Find by County */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Find LPN Providers by County</h2>
          <p className="text-gray-600 mb-6">
            Browse GAPP providers offering LPN nursing services in Georgia:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TOP_LPN_COUNTIES.map(county => (
              <Link
                key={county.slug}
                href={`/${county.slug}`}
                className="px-4 py-3 bg-gray-50 hover:bg-purple-50 hover:text-purple-600 border border-gray-200 rounded-lg text-center font-medium text-gray-700 transition-colors"
              >
                {county.name} County
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/directory?service=LPN"
              className="text-purple-600 hover:underline font-medium"
            >
              View all LPN providers across Georgia →
            </Link>
          </div>
        </div>
      </section>

      {/* Other Services */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Other GAPP Services</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/services/rn-nursing"
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 mb-2">RN Nursing Services</h3>
              <p className="text-gray-600 text-sm">
                Registered nurse care for children with complex, unstable conditions requiring skilled assessments and procedures.
              </p>
            </Link>
            <Link
              href="/services/personal-care"
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Personal Care Services (PCS)</h3>
              <p className="text-gray-600 text-sm">
                Help with daily activities like bathing, dressing, feeding, and mobility for children who need non-medical support.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">LPN Nursing FAQs</h2>
          <div className="space-y-4">
            {LPN_FAQS.map((faq, i) => (
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
      <section className="py-12 px-4 bg-purple-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Find LPN Care?</h2>
          <p className="text-gray-600 mb-6">
            Browse verified GAPP providers offering LPN nursing in your county.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/directory?service=LPN"
              className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Find LPN Providers
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-purple-600 font-medium rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-colors"
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
