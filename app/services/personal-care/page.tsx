import Link from 'next/link'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

const PCS_FAQS = [
  {
    question: 'What is Personal Care Services (PCS) through GAPP?',
    answer: 'Personal Care Services (PCS) provides hands-on help with daily living activities for children with disabilities. This includes bathing, dressing, grooming, feeding assistance, mobility help, and toileting. PCS aides are not nurses and cannot perform medical procedures.',
  },
  {
    question: 'What is the difference between PCS and nursing care?',
    answer: 'PCS aides help with daily activities like bathing and dressing. Nurses (RN/LPN) perform medical tasks like medication administration, tube feedings, and wound care. Some children need both: nursing for medical care and PCS for daily living support.',
  },
  {
    question: 'Can a PCS aide give my child medications?',
    answer: 'No. PCS aides cannot administer medications or perform any medical procedures. If your child needs medication administration, you need nursing care (RN or LPN). However, a PCS aide can remind your child to take medications they can self-administer.',
  },
  {
    question: 'How many hours of PCS can my child receive?',
    answer: 'PCS hours are determined by your child\'s assessed needs and approved in your GAPP authorization. Hours vary based on the level of assistance needed with daily activities. Your care coordinator can explain what\'s been approved.',
  },
  {
    question: 'Can PCS help my child at school?',
    answer: 'GAPP PCS hours are typically for in-home care. School-based assistance is usually arranged through your child\'s IEP or 504 plan. Some families use PCS for before/after school care at home.',
  },
  {
    question: 'What training do PCS aides have?',
    answer: 'PCS aides complete state-approved training in personal care, safety, and working with individuals with disabilities. They are not licensed nurses but are trained specifically to assist with activities of daily living.',
  },
]

export const metadata: Metadata = {
  title: 'Personal Care Services (PCS) for Children in Georgia | GAPP',
  description: 'Find Personal Care Services (PCS) for children with disabilities through Georgia\'s GAPP program. Help with bathing, dressing, feeding, and daily activities. Compare providers.',
  keywords: 'personal care services Georgia, PCS GAPP, pediatric personal care, daily living assistance children, home care aide Georgia, PCS providers Atlanta',
  openGraph: {
    title: 'Personal Care Services (PCS) for Children in Georgia | GAPP',
    description: 'Find PCS providers to help your child with daily activities through Georgia\'s GAPP program. Bathing, dressing, feeding assistance and more.',
    type: 'website',
  },
}

async function getPCSStats() {
  const { data, error } = await supabase
    .from('providers')
    .select('id, counties_served')
    .eq('is_active', true)
    .contains('services_offered', ['PCS'])

  if (error || !data) return { providerCount: 0, countyCount: 0 }

  const allCounties = new Set<string>()
  data.forEach(p => p.counties_served?.forEach((c: string) => allCounties.add(c)))

  return {
    providerCount: data.length,
    countyCount: allCounties.size,
  }
}

const TOP_PCS_COUNTIES = [
  { slug: 'fulton', name: 'Fulton' },
  { slug: 'gwinnett', name: 'Gwinnett' },
  { slug: 'cobb', name: 'Cobb' },
  { slug: 'dekalb', name: 'DeKalb' },
  { slug: 'clayton', name: 'Clayton' },
  { slug: 'richmond', name: 'Richmond' },
  { slug: 'chatham', name: 'Chatham' },
  { slug: 'dougherty', name: 'Dougherty' },
]

export default async function PersonalCarePage() {
  const stats = await getPCSStats()

  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={PCS_FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://georgiagapp.com' },
          { name: 'Services', url: 'https://georgiagapp.com/services' },
          { name: 'Personal Care', url: 'https://georgiagapp.com/services/personal-care' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Personal Care Services</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Personal Care Services (PCS) for Children in Georgia
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Help with daily living activities for children with disabilities through Georgia&apos;s GAPP program.
            Assistance with bathing, dressing, feeding, and more — so your child can thrive at home.
          </p>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <span className="text-3xl font-bold text-teal-600">{stats.providerCount}+</span>
              <p className="text-sm text-gray-600 mt-1">PCS Providers</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <span className="text-3xl font-bold text-teal-600">{stats.countyCount}</span>
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
              href="/directory?service=PCS"
              className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              Find PCS Providers
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/screener"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-teal-600 font-medium rounded-lg border-2 border-teal-600 hover:bg-teal-50 transition-colors"
            >
              Check Eligibility
            </Link>
          </div>
        </div>
      </section>

      {/* What PCS Covers */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Does PCS Cover?</h2>
          <p className="text-gray-600 mb-6">
            Personal Care Services help children with disabilities complete daily activities they
            cannot do independently. PCS aides provide hands-on assistance in the home.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Bathing & Hygiene', desc: 'Help with baths, showers, hair washing, oral care, and personal hygiene', icon: '🛁' },
              { title: 'Dressing', desc: 'Assistance putting on and removing clothes, shoes, and adaptive equipment', icon: '👕' },
              { title: 'Feeding Assistance', desc: 'Help with eating meals (not tube feedings — that requires nursing)', icon: '🍽️' },
              { title: 'Mobility Support', desc: 'Help with transfers, positioning, walking, and using mobility devices', icon: '🦽' },
              { title: 'Toileting', desc: 'Assistance with bathroom needs, diapering, and personal care', icon: '🚿' },
              { title: 'Grooming', desc: 'Help with hair brushing, nail care, and general grooming tasks', icon: '✨' },
            ].map((item, i) => (
              <div key={i} className="bg-teal-50 rounded-xl p-4">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PCS vs Nursing */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">PCS vs Nursing Care: What&apos;s the Difference?</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-teal-600 text-white">
                  <th className="px-4 py-3 text-left font-semibold">Task</th>
                  <th className="px-4 py-3 text-center font-semibold">PCS Aide</th>
                  <th className="px-4 py-3 text-center font-semibold">Nurse (RN/LPN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { task: 'Bathing & dressing', pcs: true, nurse: true },
                  { task: 'Feeding assistance (by mouth)', pcs: true, nurse: true },
                  { task: 'G-tube/J-tube feedings', pcs: false, nurse: true },
                  { task: 'Medication administration', pcs: false, nurse: true },
                  { task: 'Mobility & transfers', pcs: true, nurse: true },
                  { task: 'Wound care', pcs: false, nurse: true },
                  { task: 'Vital signs monitoring', pcs: false, nurse: true },
                  { task: 'Suctioning', pcs: false, nurse: true },
                  { task: 'Toileting & diapering', pcs: true, nurse: true },
                  { task: 'Ventilator care', pcs: false, nurse: true },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 text-gray-900">{row.task}</td>
                    <td className="px-4 py-3 text-center">
                      {row.pcs ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-red-400">✗</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.nurse ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-red-400">✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 text-sm">
              <strong>Need both?</strong> Many children receive a combination of nursing and PCS hours.
              Nursing handles medical needs while PCS provides daily living support.
            </p>
          </div>

          <div className="mt-6 flex gap-4">
            <Link
              href="/services/rn-nursing"
              className="text-primary hover:underline font-medium text-sm"
            >
              Learn about RN services →
            </Link>
            <Link
              href="/services/lpn-services"
              className="text-primary hover:underline font-medium text-sm"
            >
              Learn about LPN services →
            </Link>
          </div>
        </div>
      </section>

      {/* Who Benefits */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Who Benefits from PCS?</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Children who may qualify:</h3>
              <ul className="space-y-2 text-gray-700">
                {[
                  'Physical disabilities affecting mobility',
                  'Developmental delays impacting self-care',
                  'Autism requiring daily living support',
                  'Cerebral palsy affecting motor skills',
                  'Muscular dystrophy or muscle weakness',
                  'Spina bifida or spinal cord conditions',
                  'Intellectual disabilities',
                  'Multiple disabilities requiring assistance',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">How PCS helps families:</h3>
              <ul className="space-y-2 text-gray-700">
                {[
                  'Parents can work while child is cared for',
                  'Respite for primary caregivers',
                  'Consistent routine for the child',
                  'Professional assistance with difficult tasks',
                  'Reduce family caregiver burnout',
                  'Child stays in their home environment',
                  'Support for siblings and family time',
                  'Trained aides understand special needs',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Find by County */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Find PCS Providers by County</h2>
          <p className="text-gray-600 mb-6">
            Browse GAPP providers offering Personal Care Services in Georgia:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TOP_PCS_COUNTIES.map(county => (
              <Link
                key={county.slug}
                href={`/${county.slug}`}
                className="px-4 py-3 bg-white hover:bg-teal-50 hover:text-teal-600 border border-gray-200 rounded-lg text-center font-medium text-gray-700 transition-colors"
              >
                {county.name} County
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/directory?service=PCS"
              className="text-teal-600 hover:underline font-medium"
            >
              View all PCS providers across Georgia →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Care Services FAQs</h2>
          <div className="space-y-4">
            {PCS_FAQS.map((faq, i) => (
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
      <section className="py-12 px-4 bg-teal-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Find PCS for Your Child?</h2>
          <p className="text-gray-600 mb-6">
            Browse verified GAPP providers offering Personal Care Services in your county.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/directory?service=PCS"
              className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              Find PCS Providers
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-teal-600 font-medium rounded-lg border-2 border-teal-600 hover:bg-teal-50 transition-colors"
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
