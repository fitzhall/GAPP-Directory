import Link from 'next/link'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

const FAQS = [
  {
    question: 'What is pediatric home nursing?',
    answer: 'Pediatric home nursing is skilled nursing care provided in your home for children with complex medical needs. Licensed nurses (RNs and LPNs) come to your home to provide medical care like tracheostomy management, ventilator care, G-tube feedings, medication administration, and health monitoring — allowing your child to live at home rather than in a hospital or facility.',
  },
  {
    question: 'How do I get pediatric home nursing in Georgia?',
    answer: 'In Georgia, pediatric home nursing is primarily provided through the GAPP (Georgia Pediatric Program). To access services: 1) Your child needs Medicaid coverage, 2) Get a physician order documenting medical necessity, 3) Choose a GAPP-enrolled provider agency, 4) The agency handles prior authorization with Medicaid. Our directory helps you find GAPP providers in your area.',
  },
  {
    question: 'Does insurance cover pediatric home nursing in Georgia?',
    answer: 'Medicaid covers pediatric home nursing through the GAPP program for children who qualify. Private insurance may also cover home nursing but often with more limitations. Most families use Medicaid (either through income eligibility or the Katie Beckett waiver) to access GAPP services, which provides more comprehensive coverage.',
  },
  {
    question: 'What conditions qualify for pediatric home nursing?',
    answer: 'Children who typically qualify include those with tracheostomies, ventilator dependence, G-tube or feeding tube needs, severe seizure disorders, complex medication regimens, oxygen dependence, cerebral palsy with medical complexity, and other conditions requiring skilled nursing assessment and intervention.',
  },
  {
    question: 'What is the difference between pediatric home nursing and home health aide?',
    answer: 'Pediatric home nursing involves licensed nurses (RN/LPN) providing skilled medical care like trach suctioning, vent management, and medication administration. Home health aides or Personal Care Services (PCS) provide non-medical help with daily living activities like bathing, feeding, and supervision. Many children need both services.',
  },
  {
    question: 'How many hours of home nursing can my child get?',
    answer: 'In Georgia, GAPP nursing hours are determined by medical necessity and approved through prior authorization. Some children receive 8-12 hours daily, while those with higher acuity may receive up to 24-hour care. Your physician documents the medical justification and Medicaid approves the hours.',
  },
  {
    question: 'Can I choose my child\'s home nursing agency?',
    answer: 'Yes. In Georgia, you have the right to choose your GAPP provider. You can research agencies, ask about their experience with your child\'s condition, and switch providers if needed. Our directory shows all GAPP providers by county so you can compare options in your area.',
  },
  {
    question: 'What is GAPP in Georgia?',
    answer: 'GAPP (Georgia Pediatric Program) is the Medicaid program that provides pediatric home nursing and personal care services to medically fragile children in Georgia. It allows children with complex medical needs to receive care at home instead of in hospitals or facilities.',
  },
  {
    question: 'How do I find pediatric home nursing agencies near me in Georgia?',
    answer: 'Use our GAPP Provider Directory to search by county. We list all Medicaid-enrolled pediatric home nursing agencies in Georgia, showing which counties they serve, what services they offer (RN, LPN, PCS), and whether they\'re accepting new patients.',
  },
  {
    question: 'What if I can\'t find a nurse for my child?',
    answer: 'The nursing shortage affects many Georgia families. Tips: contact multiple agencies, be flexible with shift times, ask about agency staffing levels before committing, and consider agencies that serve broader regions. Verified providers in our directory have confirmed current availability.',
  },
]

const CONDITIONS_THAT_NEED_HOME_NURSING = [
  'Tracheostomy care',
  'Ventilator/BiPAP dependence',
  'G-tube or feeding tube',
  'Complex seizure disorders',
  'Oxygen dependence',
  'IV medications or TPN',
  'Cerebral palsy (medically complex)',
  'Spina bifida',
  'Muscular dystrophy',
  'Traumatic brain injury',
  'Spinal cord injury',
  'Congenital heart conditions',
  'Premature birth complications',
  'Genetic syndromes',
  'Cancer requiring home care',
]

export const metadata: Metadata = {
  title: 'Pediatric Home Nursing in Georgia: Find In-Home Nurses for Your Child (2025)',
  description: 'Find pediatric home nursing services in Georgia. Learn how GAPP provides in-home RN and LPN care for medically fragile children. Search verified nursing agencies by county.',
  keywords: 'pediatric home nursing Georgia, pediatric home care Georgia, in-home nursing for children Georgia, GAPP Georgia, pediatric private duty nursing Georgia, medically fragile child care Georgia, home health nursing children Georgia',
  openGraph: {
    title: 'Pediatric Home Nursing in Georgia – Find In-Home Care for Your Child',
    description: 'Everything you need to know about pediatric home nursing in Georgia. Find GAPP providers, understand eligibility, and get care for your medically fragile child.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/pediatric-home-nursing-georgia',
  },
}

async function getProviderStats() {
  const { data, error } = await supabase
    .from('providers')
    .select('id, services_offered, accepting_new_patients, is_verified, counties_served')
    .eq('is_active', true)

  if (error || !data) {
    return { total: 0, accepting: 0, withRN: 0, counties: 0 }
  }

  const allCounties = new Set(data.flatMap(p => p.counties_served || []))

  return {
    total: data.length,
    accepting: data.filter(p => p.accepting_new_patients).length,
    withRN: data.filter(p => p.services_offered?.includes('RN')).length,
    counties: allCounties.size,
  }
}

export default async function PediatricHomeNursingGeorgiaPage() {
  const stats = await getProviderStats()

  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Pediatric Home Nursing Georgia', url: 'https://www.georgiagapp.com/pediatric-home-nursing-georgia' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Pediatric Home Nursing Georgia</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Pediatric Home Nursing in Georgia
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Find in-home nursing care for your medically fragile child. Georgia&apos;s GAPP program connects families with licensed nurses who provide skilled care in your home.
          </p>

          {/* Key benefit callout */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <div>
                <p className="font-semibold text-green-900">Care at Home, Not in the Hospital</p>
                <p className="text-green-800 text-sm">Pediatric home nursing lets your child receive skilled medical care while staying home with family.</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-gray-600">Georgia Providers</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">{stats.withRN}</div>
              <div className="text-sm text-gray-600">Offer RN Nursing</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent">{stats.accepting}</div>
              <div className="text-sm text-gray-600">Accepting Patients</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-700">{stats.counties}</div>
              <div className="text-sm text-gray-600">Counties Covered</div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/directory"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Find Nursing Agencies
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors"
            >
              Help Me Choose a Provider
            </Link>
          </div>
        </div>
      </section>

      {/* What is Pediatric Home Nursing */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            What is Pediatric Home Nursing?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              <strong>Pediatric home nursing</strong> is skilled nursing care provided in your home for children with complex medical needs. Instead of your child living in a hospital or care facility, licensed nurses come to your home to provide the medical care they need.
            </p>
            <p>
              Home nursing allows medically fragile children to:
            </p>
            <ul>
              <li><strong>Stay with family</strong> instead of in institutions</li>
              <li><strong>Develop normally</strong> in a home environment</li>
              <li><strong>Attend school</strong> with nursing support</li>
              <li><strong>Participate in activities</strong> other children enjoy</li>
              <li><strong>Give parents respite</strong> from 24/7 caregiving</li>
            </ul>
            <p>
              In Georgia, most pediatric home nursing is provided through the <strong>GAPP (Georgia Pediatric Program)</strong>, a Medicaid program specifically designed for medically fragile children.
            </p>
          </div>
        </div>
      </section>

      {/* Types of Care */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Types of Pediatric Home Care in Georgia
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">RN Nursing Care</h3>
              <p className="text-gray-600 text-sm mb-4">
                Registered Nurses provide the highest level of skilled care including:
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Tracheostomy & ventilator care</li>
                <li>• IV medications & TPN</li>
                <li>• Complex assessments</li>
                <li>• Care plan management</li>
              </ul>
              <Link href="/services/rn-nursing" className="inline-block mt-4 text-primary text-sm font-medium hover:underline">
                Learn about RN services →
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">LPN Nursing Care</h3>
              <p className="text-gray-600 text-sm mb-4">
                Licensed Practical Nurses provide skilled care under RN supervision:
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• G-tube feedings</li>
                <li>• Medication administration</li>
                <li>• Trach suctioning</li>
                <li>• Health monitoring</li>
              </ul>
              <Link href="/services/lpn-services" className="inline-block mt-4 text-primary text-sm font-medium hover:underline">
                Learn about LPN services →
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Care (PCS)</h3>
              <p className="text-gray-600 text-sm mb-4">
                Non-medical support for daily living activities:
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Bathing & hygiene</li>
                <li>• Feeding assistance</li>
                <li>• Mobility support</li>
                <li>• Supervision & safety</li>
              </ul>
              <Link href="/services/personal-care" className="inline-block mt-4 text-primary text-sm font-medium hover:underline">
                Learn about PCS →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who Needs Home Nursing */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Does Your Child Need Pediatric Home Nursing?
          </h2>
          <p className="text-gray-600 mb-8">
            Children who benefit from home nursing typically have medical conditions that require skilled nursing care or monitoring. Common conditions include:
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {CONDITIONS_THAT_NEED_HOME_NURSING.map((condition, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700 text-sm">{condition}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border-l-4 border-primary p-4">
            <p className="text-primary font-semibold mb-1">Not Sure If Your Child Qualifies?</p>
            <p className="text-gray-700 text-sm">
              If your child has a medical condition requiring regular skilled nursing tasks that you currently do yourself, they may qualify. Use our <Link href="/screener" className="text-primary hover:underline">eligibility screener</Link> or contact a GAPP provider directly — they can help determine if services are appropriate.
            </p>
          </div>
        </div>
      </section>

      {/* How to Get Home Nursing */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            How to Get Pediatric Home Nursing in Georgia
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Get Medicaid Coverage</h3>
                <p className="text-gray-600 mb-2">Your child needs Georgia Medicaid to access GAPP services. Options include:</p>
                <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                  <li>Regular Medicaid (income-based eligibility)</li>
                  <li><Link href="/katie-beckett-waiver-georgia" className="text-primary hover:underline">Katie Beckett waiver</Link> (no income limit for disabled children)</li>
                  <li>SSI recipients automatically get Medicaid</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Get a Physician Order</h3>
                <p className="text-gray-600">Your child&apos;s doctor must document the medical necessity for home nursing, specifying the type of care needed (RN, LPN, or PCS) and recommended hours.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Choose a GAPP Provider</h3>
                <p className="text-gray-600 mb-2">Select a Medicaid-enrolled home health agency. Consider:</p>
                <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                  <li>Do they serve your county?</li>
                  <li>Do they have nurses available for your shifts?</li>
                  <li>Do they have experience with your child&apos;s condition?</li>
                </ul>
                <Link href="/directory" className="inline-flex items-center text-primary font-medium mt-2 hover:underline">
                  Search providers in your county
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Provider Handles Authorization</h3>
                <p className="text-gray-600">The agency submits the prior authorization request to Medicaid, coordinates with your doctor, and handles the paperwork. Once approved, services can begin.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">5</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Care Begins at Home</h3>
                <p className="text-gray-600">Nurses are assigned to your child and begin providing care in your home according to the approved care plan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GAPP Explanation */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            What is GAPP? Georgia&apos;s Pediatric Home Nursing Program
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              <strong>GAPP (Georgia Pediatric Program)</strong> is Georgia&apos;s Medicaid program that provides in-home nursing and personal care services for medically fragile children. It&apos;s sometimes called &quot;private duty nursing&quot; or &quot;PDN.&quot;
            </p>
            <p>
              GAPP allows children who might otherwise need hospital or facility care to receive that care at home. The program covers:
            </p>
            <ul>
              <li><strong>Skilled nursing</strong> by RNs and LPNs</li>
              <li><strong>Personal care services</strong> for daily living support</li>
              <li><strong>Flexible hours</strong> based on medical necessity</li>
              <li><strong>Your choice of provider</strong> from enrolled agencies</li>
            </ul>
          </div>

          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">GAPP Eligibility Requirements</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-sm">Child under 21 years old</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-sm">Georgia Medicaid coverage</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-sm">Medical condition requiring skilled nursing</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-sm">Physician order documenting necessity</span>
              </div>
            </div>
            <Link href="/gapp-approval-guide" className="inline-flex items-center text-primary font-medium mt-4 hover:underline">
              Read our complete GAPP approval guide
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 px-4 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Find Pediatric Home Nursing Near You
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Search our directory of {stats.total} GAPP providers across Georgia. Find agencies in your county that are accepting new patients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/directory"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Search by County
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href="/gapp-providers-georgia"
              className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white/10 transition-colors"
            >
              View All GAPP Providers
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Pediatric Home Nursing FAQs
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <details key={index} className="group bg-gray-50 rounded-xl">
                <summary className="flex justify-between items-center cursor-pointer p-5 font-semibold text-gray-900">
                  {faq.question}
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Related Resources */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Related Resources</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/gapp-providers-georgia" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1">GAPP Provider Directory</h3>
              <p className="text-sm text-gray-600">Search all providers by county</p>
            </Link>
            <Link href="/katie-beckett-waiver-georgia" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1">Katie Beckett Waiver</h3>
              <p className="text-sm text-gray-600">Medicaid for disabled children</p>
            </Link>
            <Link href="/gapp-approval-guide" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1">GAPP Approval Guide</h3>
              <p className="text-sm text-gray-600">Step-by-step enrollment process</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            This information is provided for educational purposes only and is not medical or legal advice. For official information about Georgia Medicaid and GAPP services, contact the Georgia Department of Community Health.
          </p>
        </div>
      </section>
    </div>
  )
}
