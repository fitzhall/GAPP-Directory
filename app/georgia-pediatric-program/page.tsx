import Link from 'next/link'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { FAQPageSchema, BreadcrumbSchema, WebPageSchema } from '@/components/JsonLd'

const FAQS = [
  {
    question: 'What does GAPP stand for?',
    answer: 'GAPP stands for Georgia Pediatric Program. It is a Medicaid waiver program that provides in-home skilled nursing and personal care services for medically fragile children under 21 years old in Georgia.',
  },
  {
    question: 'Is GAPP free?',
    answer: 'GAPP services are covered by Georgia Medicaid at no cost to eligible families. Your child must have active Georgia Medicaid coverage and meet medical necessity criteria. There are no copays or out-of-pocket costs for approved services.',
  },
  {
    question: 'How many hours does GAPP cover?',
    answer: 'GAPP can cover up to 24 hours of skilled nursing care per day, depending on your child\'s medical needs. Hours are determined by medical necessity and approved through the prior authorization process. Most families receive between 8-16 hours per day.',
  },
  {
    question: 'Can I choose my own GAPP provider?',
    answer: 'Yes. You have the right to choose any Medicaid-enrolled GAPP provider in Georgia. You can switch providers at any time if you\'re not satisfied with your current agency. Our directory helps you compare providers by county, services, and availability.',
  },
  {
    question: 'What\'s the difference between GAPP and Katie Beckett?',
    answer: 'Katie Beckett (also called TEFRA) is a Medicaid eligibility pathway that allows children with disabilities to qualify for Medicaid based on their own income/assets, not their parents\'. GAPP is a service program that provides the actual nursing care. Many families use Katie Beckett to get Medicaid, then GAPP for services.',
  },
  {
    question: 'How long does GAPP approval take?',
    answer: 'The GAPP approval process typically takes 30-90 days from initial application. This includes physician documentation, Medicaid enrollment (if not already enrolled), medical necessity determination, and prior authorization. Having complete documentation speeds up approval.',
  },
]

export const metadata: Metadata = {
  title: 'Georgia Pediatric Program (GAPP) – Home Nursing for Medically Fragile Children',
  description: 'The Georgia Pediatric Program provides in-home skilled nursing and personal care for medically fragile children. Learn about eligibility, services covered, and how to find GAPP providers.',
  keywords: 'Georgia Pediatric Program, GAPP Georgia, what is GAPP, GAPP eligibility, Georgia pediatric home care program, GAPP program services, GAPP Medicaid waiver',
  openGraph: {
    title: 'Georgia Pediatric Program (GAPP) – Complete Guide',
    description: 'Everything you need to know about the Georgia Pediatric Program: eligibility, services covered, and how to get started with GAPP.',
    type: 'article',
    url: 'https://www.georgiagapp.com/georgia-pediatric-program',
    siteName: 'GeorgiaGAPP.com',
    images: [
      {
        url: 'https://www.georgiagapp.com/og-image.png',
        width: 1640,
        height: 624,
        alt: 'Georgia Pediatric Program (GAPP) - Complete Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Georgia Pediatric Program (GAPP) – Complete Guide',
    description: 'Everything you need to know about the Georgia Pediatric Program: eligibility, services covered, and how to get started.',
    images: ['https://www.georgiagapp.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/georgia-pediatric-program',
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
]

export default async function GeorgiaPediatricProgramPage() {
  const stats = await getProviderStats()

  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Georgia Pediatric Program', url: 'https://www.georgiagapp.com/georgia-pediatric-program' },
        ]}
      />
      <WebPageSchema
        name="Georgia Pediatric Program (GAPP) – Complete Guide"
        description="The Georgia Pediatric Program provides in-home skilled nursing and personal care for medically fragile children under 21. Learn about eligibility, services covered, and how to find GAPP providers."
        url="https://www.georgiagapp.com/georgia-pediatric-program"
        datePublished="2025-01-26"
        dateModified={new Date().toISOString().split('T')[0]}
        breadcrumb={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Georgia Pediatric Program', url: 'https://www.georgiagapp.com/georgia-pediatric-program' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Georgia Pediatric Program</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Understanding the Georgia Pediatric Program (GAPP)
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            GAPP provides in-home skilled nursing and personal care services for medically fragile children under 21 in Georgia. Learn what the program covers, who qualifies, and how to get started.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/gapp-providers-georgia"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Find a Provider
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

      {/* What is GAPP */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            What is the Georgia Pediatric Program?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              The <strong>Georgia Pediatric Program (GAPP)</strong> is a Medicaid waiver program administered by the Georgia Department of Community Health (DCH). It provides in-home skilled nursing care and personal care services for children with complex medical needs who would otherwise require hospitalization or institutional care.
            </p>
            <p>
              Unlike regular Medicaid home health benefits, GAPP is specifically designed for <strong>medically fragile children</strong> who need ongoing skilled nursing care in their home. The program allows families to keep their children at home while receiving the medical care they need.
            </p>
            <div className="bg-blue-50 border-l-4 border-primary p-4 my-6 rounded-r-lg">
              <p className="text-gray-800 mb-0">
                <strong>Key Point:</strong> GAPP is not insurance — it&apos;s a Medicaid service program. You must have Georgia Medicaid coverage to access GAPP services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Qualifies */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Who Qualifies for GAPP?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600 mb-8">
            <p>
              To qualify for the Georgia Pediatric Program, your child must meet all of the following criteria:
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Age Requirement</h3>
                  <p className="text-gray-600">Must be under 21 years old at the time of application</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Active Georgia Medicaid</h3>
                  <p className="text-gray-600">Must have current Georgia Medicaid coverage (regular Medicaid, Katie Beckett, or another pathway)</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Medical Necessity</h3>
                  <p className="text-gray-600">A physician must certify that your child requires skilled nursing care that can be safely provided at home</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Home-Based Care</h3>
                  <p className="text-gray-600">Your child must be medically stable enough to receive care safely at home rather than in a hospital or facility</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/gapp-approval-guide"
              className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
            >
              View detailed eligibility requirements
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Covered */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center">
            What Services Does GAPP Cover?
          </h2>
          <p className="text-gray-600 text-center mb-8">
            The Georgia Pediatric Program covers three main types of in-home care services:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">RN Nursing Care</h3>
              <p className="text-gray-600 text-sm mb-4">
                Skilled nursing by Registered Nurses for complex medical needs.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tracheostomy care</li>
                <li>• Ventilator management</li>
                <li>• IV medications</li>
                <li>• Complex assessments</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">LPN Services</h3>
              <p className="text-gray-600 text-sm mb-4">
                Licensed Practical Nurse care under RN supervision.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Medication administration</li>
                <li>• G-tube feedings</li>
                <li>• Basic wound care</li>
                <li>• Vital signs monitoring</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Care (PCS)</h3>
              <p className="text-gray-600 text-sm mb-4">
                Daily living assistance and supervision.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Bathing and hygiene</li>
                <li>• Feeding assistance</li>
                <li>• Mobility support</li>
                <li>• Safety supervision</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            How to Get Started with GAPP
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Get a Physician&apos;s Order</h3>
                <p className="text-gray-600">Your child&apos;s doctor must document medical necessity and write orders for in-home skilled nursing care. This typically includes diagnosis, required services, and recommended hours.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Ensure Medicaid Coverage</h3>
                <p className="text-gray-600">You must have active Georgia Medicaid. If your child doesn&apos;t qualify for regular Medicaid due to family income, explore the <Link href="/katie-beckett-waiver-georgia" className="text-primary hover:text-primary-dark">Katie Beckett pathway</Link>.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Choose a GAPP Provider</h3>
                <p className="text-gray-600">Select a Medicaid-enrolled home health agency that serves your county. The provider will help coordinate the prior authorization process.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Complete Prior Authorization</h3>
                <p className="text-gray-600">Your provider submits documentation to Medicaid for approval. Once authorized, services can begin. The process typically takes 30-90 days.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/gapp-approval-timeline"
              className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
            >
              View detailed approval timeline
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
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

      {/* Find a Provider CTA */}
      <section className="py-12 sm:py-16 px-4 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Find a GAPP Provider
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Search our directory of {stats.total} GAPP providers across Georgia. Filter by county, services, and availability to find the right agency for your family.
          </p>
          <Link
            href="/gapp-providers-georgia"
            className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Search Providers Now
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* County Quick Links */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Find Providers by County
          </h2>
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

      {/* Related Resources */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Related Resources</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/gapp-providers-georgia" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-gray-900 mb-1">Find GAPP Providers</h3>
              <p className="text-sm text-gray-600">Search all providers by county</p>
            </Link>
            <Link href="/gapp-approval-guide" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-gray-900 mb-1">GAPP Approval Guide</h3>
              <p className="text-sm text-gray-600">Step-by-step application process</p>
            </Link>
            <Link href="/katie-beckett-waiver-georgia" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-gray-900 mb-1">Katie Beckett Waiver</h3>
              <p className="text-sm text-gray-600">Alternative Medicaid eligibility</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
