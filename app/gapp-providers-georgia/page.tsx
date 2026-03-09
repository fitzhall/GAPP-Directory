import Link from 'next/link'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

const FAQS = [
  {
    question: 'What is a GAPP provider?',
    answer: 'A GAPP provider is a Medicaid-enrolled home health agency that delivers skilled nursing and personal care services to medically fragile children in Georgia through the Georgia Pediatric Program (GAPP). These providers employ RNs, LPNs, and personal care aides trained in pediatric home care.',
  },
  {
    question: 'How do I find GAPP providers in my county?',
    answer: 'Use our directory to search by county. Each provider listing shows which counties they serve, their services (RN, LPN, PCS), and whether they\'re currently accepting new patients. Verified providers have confirmed their availability.',
  },
  {
    question: 'What services do GAPP providers offer?',
    answer: 'GAPP providers offer three main services: RN nursing (medication administration, trach/vent care, G-tube care), LPN services (basic skilled nursing under RN supervision), and Personal Care Services (PCS) for bathing, feeding, and daily living assistance.',
  },
  {
    question: 'How do I choose between GAPP providers?',
    answer: 'Consider: which counties they serve, what services they offer, their current availability, response time, and whether they\'re verified. Our directory shows all this information upfront so you don\'t waste time calling agencies that can\'t help.',
  },
  {
    question: 'Can I switch GAPP providers?',
    answer: 'Yes. You have the right to choose your provider and can switch at any time. Notify your current agency and new agency of the change. The new agency will handle the transfer of care and prior authorization.',
  },
  {
    question: 'Do all GAPP providers serve all of Georgia?',
    answer: 'No. Most providers serve specific regions or counties. Metro Atlanta has the most options, while rural counties may have fewer choices. Our directory shows exactly which counties each provider serves.',
  },
  {
    question: 'How long does it take to get a nurse once I pick a provider?',
    answer: 'After the provider submits a prior authorization to Medicaid, approval takes 2-6 weeks. Once approved, most agencies can place a nurse within a few days to two weeks depending on their staffing. If you need care fast, ask the agency about their current wait time before committing.',
  },
  {
    question: 'Are GAPP providers free?',
    answer: 'Yes. GAPP services are paid by Medicaid. You should never pay out of pocket for GAPP nursing or personal care. If a provider asks you to pay, that is not normal. All costs are billed directly to Medicaid through your child\'s prior authorization.',
  },
]

export const metadata: Metadata = {
  title: 'GAPP Providers in Georgia – Find Verified Home Care for Your Child',
  description: 'Search all GAPP providers in Georgia. Find verified home health agencies offering RN nursing, LPN services, and personal care for medically fragile children. Updated weekly.',
  keywords: 'GAPP providers Georgia, GAPP providers in Georgia, Georgia Pediatric Program providers, find GAPP provider near me, GAPP agencies Georgia, pediatric home care providers Georgia, GAPP home health agencies',
  openGraph: {
    title: 'GAPP Providers in Georgia – Complete Provider Directory',
    description: 'Find and compare all GAPP providers in Georgia. Verified home health agencies offering pediatric nursing and personal care services.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/gapp-providers-georgia',
  },
}

async function getProviderStats() {
  const { data, error } = await supabase
    .from('providers')
    .select('id, services_offered, accepting_new_patients, is_verified, counties_served')
    .eq('is_active', true)

  if (error || !data) {
    return { total: 0, accepting: 0, verified: 0, counties: 0 }
  }

  const allCounties = new Set(data.flatMap(p => p.counties_served || []))

  return {
    total: data.length,
    accepting: data.filter(p => p.accepting_new_patients).length,
    verified: data.filter(p => p.is_verified).length,
    counties: allCounties.size,
  }
}

const TOP_COUNTIES = [
  { slug: 'fulton', name: 'Fulton' },
  { slug: 'gwinnett', name: 'Gwinnett' },
  { slug: 'cobb', name: 'Cobb' },
  { slug: 'dekalb', name: 'DeKalb' },
  { slug: 'clayton', name: 'Clayton' },
  { slug: 'cherokee', name: 'Cherokee' },
  { slug: 'forsyth', name: 'Forsyth' },
  { slug: 'henry', name: 'Henry' },
  { slug: 'hall', name: 'Hall' },
  { slug: 'richmond', name: 'Richmond' },
  { slug: 'chatham', name: 'Chatham' },
  { slug: 'bibb', name: 'Bibb' },
]

export default async function GAPPProvidersGeorgiaPage() {
  const stats = await getProviderStats()

  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'GAPP Providers Georgia', url: 'https://www.georgiagapp.com/gapp-providers-georgia' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">GAPP Providers Georgia</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            GAPP Providers in Georgia
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find verified home health agencies offering skilled nursing and personal care for medically fragile children through Georgia&apos;s Pediatric Program.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Providers</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">{stats.accepting}</div>
              <div className="text-sm text-gray-600">Accepting Patients</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent">{stats.verified}</div>
              <div className="text-sm text-gray-600">Verified</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-700">{stats.counties}</div>
              <div className="text-sm text-gray-600">Counties Served</div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/directory"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Search All Providers
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors"
            >
              Help Me Choose
            </Link>
          </div>
        </div>
      </section>

      {/* What is a GAPP Provider */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            What is a GAPP provider?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              <strong>GAPP providers</strong> are Medicaid-enrolled home health agencies licensed by the State of Georgia to deliver pediatric skilled nursing and personal care services. They operate under the Georgia Pediatric Program (GAPP), which provides in-home care for children with complex medical needs.
            </p>
            <p>
              Unlike general home health agencies, GAPP providers specialize in caring for medically fragile children who require:
            </p>
            <ul>
              <li><strong>Tracheostomy and ventilator care</strong></li>
              <li><strong>G-tube feeding and management</strong></li>
              <li><strong>Complex medication administration</strong></li>
              <li><strong>Seizure monitoring and intervention</strong></li>
              <li><strong>Daily skilled nursing assessment</strong></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services Offered */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Services offered by GAPP providers
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/services/rn-nursing" className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">RN Nursing</h3>
              <p className="text-gray-600 text-sm">
                Skilled nursing care including trach/vent management, IV medications, and complex medical procedures by Registered Nurses.
              </p>
            </Link>

            <Link href="/services/lpn-services" className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">LPN Services</h3>
              <p className="text-gray-600 text-sm">
                Licensed Practical Nurse care for medication administration, G-tube feedings, and basic skilled nursing under RN supervision.
              </p>
            </Link>

            <Link href="/services/personal-care" className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Care (PCS)</h3>
              <p className="text-gray-600 text-sm">
                Assistance with daily living activities including bathing, feeding, mobility, and supervision for children who need extra support.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Find by County */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center">
            Find GAPP providers by county
          </h2>
          <p className="text-gray-600 text-center mb-8">
            GAPP providers serve specific counties. Select your county to see which agencies have availability in your area.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
          <div className="text-center mt-6">
            <Link
              href="/directory"
              className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
            >
              View all 159 Georgia counties
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* What to ask when you call */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Questions to ask when you call a GAPP provider
          </h2>
          <p className="text-gray-700 mb-6">
            Don&apos;t just ask &quot;are you accepting patients?&quot; and hang up. Get the details that matter before you commit. Here&apos;s what to ask:
          </p>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-5">
              <p className="font-semibold text-gray-900 mb-1">&quot;Do you have nurses available for the shifts I need?&quot;</p>
              <p className="text-gray-700 text-sm">An agency can accept patients but still not have a nurse for your specific schedule. Ask about daytime, nighttime, and weekend availability.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5">
              <p className="font-semibold text-gray-900 mb-1">&quot;What happens when my regular nurse calls out?&quot;</p>
              <p className="text-gray-700 text-sm">Some agencies have backup nurses on call. Others leave you without coverage. This matters more than almost anything else.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5">
              <p className="font-semibold text-gray-900 mb-1">&quot;Do your nurses have experience with my child&apos;s condition?&quot;</p>
              <p className="text-gray-700 text-sm">A nurse who&apos;s worked with trachs before is different from one learning on the job. Ask specifically about your child&apos;s equipment and care needs.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5">
              <p className="font-semibold text-gray-900 mb-1">&quot;How quickly can you start services after the prior auth is approved?&quot;</p>
              <p className="text-gray-700 text-sm">Some agencies can place a nurse within days. Others take weeks to staff your case. If you need care soon, this question saves you time.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5">
              <p className="font-semibold text-gray-900 mb-1">&quot;Will you handle the prior authorization paperwork?&quot;</p>
              <p className="text-gray-700 text-sm">Most agencies do this for you. If one says you have to handle it yourself, that&apos;s a red flag. A good agency manages the Medicaid paperwork.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Warning signs */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Red flags when choosing a GAPP provider
          </h2>
          <p className="text-gray-700 mb-6">
            Not all agencies are equal. Watch out for these warning signs:
          </p>
          <ul className="space-y-3 mb-6">
            {[
              'They won\'t give you a straight answer about nurse availability for your schedule',
              'No backup plan when your regular nurse is out sick',
              'They pressure you to sign before answering your questions',
              'They can\'t tell you how many pediatric cases they currently serve',
              'Multiple Google reviews mention missed shifts or poor communication',
              'They ask you to pay anything out of pocket (GAPP is fully covered by Medicaid)',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-700">
            If you&apos;re already with an agency that&apos;s not working out, you can switch. Read our guide on <Link href="/how-to-switch-gapp-providers" className="text-primary hover:underline">how to switch GAPP providers</Link>.
          </p>
        </div>
      </section>

      {/* How to Choose */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            How to choose a GAPP provider
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Check County Coverage</h3>
                <p className="text-gray-600">Not all providers serve all counties. Start by filtering for agencies that actually cover your area.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Verify Services Offered</h3>
                <p className="text-gray-600">Make sure the provider offers the level of care your child needs (RN, LPN, or PCS).</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Confirm Availability</h3>
                <p className="text-gray-600">Look for providers marked as &quot;Accepting New Patients&quot; — verified providers have confirmed availability this week.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Contact Multiple Providers</h3>
                <p className="text-gray-600">Call 2-3 agencies to compare responsiveness, nurse availability for your shifts, and overall fit.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently asked questions
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
            Find a GAPP Provider Today
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Search our directory of {stats.total} GAPP providers across Georgia. Filter by county, services, and availability.
          </p>
          <Link
            href="/directory"
            className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Search Providers Now
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Related Pages */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Related resources</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/georgia-pediatric-program" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-gray-900 mb-1">What is GAPP?</h3>
              <p className="text-sm text-gray-600">Learn about the program</p>
            </Link>
            <Link href="/gapp-approval-guide" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-gray-900 mb-1">GAPP approval guide</h3>
              <p className="text-sm text-gray-600">Step-by-step approval process</p>
            </Link>
            <Link href="/gapp-home-care" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-gray-900 mb-1">GAPP home care</h3>
              <p className="text-sm text-gray-600">Understanding home care services</p>
            </Link>
            <Link href="/screener" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-gray-900 mb-1">Eligibility screener</h3>
              <p className="text-sm text-gray-600">Check if your child qualifies</p>
            </Link>
            <Link href="/how-to-switch-gapp-providers" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-gray-900 mb-1">Switch GAPP providers</h3>
              <p className="text-sm text-gray-600">How to change agencies</p>
            </Link>
            <Link href="/sick-child-care-georgia" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-gray-900 mb-1">Sick child care options</h3>
              <p className="text-sm text-gray-600">When daycare isn&apos;t enough</p>
            </Link>
            <Link href="/gapp-services-explained" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-gray-900 mb-1">GAPP services explained</h3>
              <p className="text-sm text-gray-600">RN, LPN, and PCS details</p>
            </Link>
            <Link href="/long-term-care-children-georgia" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-gray-900 mb-1">Long-term care for children</h3>
              <p className="text-sm text-gray-600">Ongoing care options</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
