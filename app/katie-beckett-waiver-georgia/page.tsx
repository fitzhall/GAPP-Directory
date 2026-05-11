import Link from 'next/link'
import { Metadata } from 'next'
import { FAQPageSchema, BreadcrumbSchema, ArticleSchema } from '@/components/JsonLd'

const KATIE_BECKETT_FAQS = [
  {
    question: 'What is the Katie Beckett waiver in Georgia?',
    answer: 'The Katie Beckett waiver (also called TEFRA) is a Medicaid eligibility pathway in Georgia that allows children with disabilities to qualify for Medicaid based on their medical condition alone, regardless of family income. This means even families with higher incomes can get Medicaid coverage for their medically fragile child.',
  },
  {
    question: 'What are the Katie Beckett eligibility requirements in Georgia?',
    answer: 'To qualify for Katie Beckett in Georgia, your child must be under 18 years old, have a disability or chronic medical condition, require care at an institutional level (hospital or nursing facility), be able to be safely cared for at home, and home care must cost less than institutional care.',
  },
  {
    question: 'Does family income affect Katie Beckett eligibility?',
    answer: 'No. Unlike regular Medicaid, Katie Beckett determines eligibility based solely on the child\'s disability and care needs, not on family income or assets. This is one of the main benefits of the program.',
  },
  {
    question: 'How long does Katie Beckett approval take in Georgia?',
    answer: 'The Katie Beckett application process in Georgia typically takes 45-90 days. Having complete medical documentation ready can speed up the process. Recent policy changes now authorize approvals for a minimum of two years.',
  },
  {
    question: 'What is the difference between Katie Beckett and GAPP?',
    answer: 'Katie Beckett is a Medicaid eligibility pathway - it gets your child ON Medicaid. GAPP (Georgia Pediatric Program) is a service program that provides in-home nursing care. Many families use Katie Beckett to qualify for Medicaid, then use GAPP for nursing services.',
  },
  {
    question: 'Can my child have both Katie Beckett and GAPP?',
    answer: 'Yes! They work together. Katie Beckett gets your child Medicaid coverage, and once on Medicaid, your child can receive GAPP services (in-home nursing and personal care) if medically necessary.',
  },
  {
    question: 'What conditions qualify for Katie Beckett in Georgia?',
    answer: 'Qualifying conditions include cerebral palsy, muscular dystrophy, spina bifida, severe autism, traumatic brain injury, ventilator dependence, tracheostomy needs, feeding tube requirements, seizure disorders, genetic conditions, and other conditions requiring institutional-level care.',
  },
  {
    question: 'How do I apply for Katie Beckett in Georgia?',
    answer: 'Contact the Centralized Katie Beckett Medicaid Team at 678-248-7449. You\'ll need to gather medical documentation, complete the application, and your child will undergo a medical evaluation to confirm they need institutional-level care.',
  },
  {
    question: 'What if my Katie Beckett application is denied?',
    answer: 'You have the right to appeal any denial. Common denial reasons include incomplete documentation or not meeting the institutional level of care requirement. You can request a fair hearing to appeal the decision.',
  },
  {
    question: 'What services does my child get with Katie Beckett Medicaid?',
    answer: 'Once approved for Medicaid through Katie Beckett, your child has access to all Medicaid services including doctor visits, hospital care, medications, therapy services, medical equipment, and specialized programs like GAPP for in-home nursing.',
  },
  {
    question: 'What does Katie Beckett Medicaid cover that regular insurance might not?',
    answer: 'Katie Beckett Medicaid covers the full range of Medicaid services: doctor visits, hospital stays, prescriptions, durable medical equipment like wheelchairs and feeding pumps, therapy services (PT, OT, speech), home nursing through programs like GAPP, mental health services, dental care, and medical transportation. For many families, the biggest benefit is access to GAPP in-home nursing — something private insurance rarely covers at the hours medically fragile children need.',
  },
  {
    question: 'What are the income limits for Katie Beckett in Georgia?',
    answer: 'There are no family income limits for Katie Beckett. Only your child\'s own money is counted, and most kids have none. A family making $200,000 a year can still qualify if their child meets the medical rules.',
  },
  {
    question: 'How do I apply for Katie Beckett through gateway.ga.gov?',
    answer: 'Go to gateway.ga.gov and start a Medicaid application. When asked, mark that the application is for a child with a disability. The system will route your case to the Katie Beckett team.',
  },
  {
    question: 'What is the new Katie Beckett online portal?',
    answer: 'Georgia launched a Katie Beckett online portal on April 15, 2026. Families can apply, upload medical records, track status, and message their case worker through the portal. You can access it through medicaid.georgia.gov.',
  },
  {
    question: 'What forms do I need for the Katie Beckett application?',
    answer: 'You need three forms from the Department of Community Health. They are the Pediatric DMA form, the Medical Necessity Level of Care Statement, and the Cost Effectiveness Form. Your child\'s doctor fills out the medical parts. The state can mail you the forms or you can download them from medicaid.georgia.gov.',
  },
  {
    question: 'How do I appeal a Katie Beckett denial in Georgia?',
    answer: 'You have 30 days from the date of your denial letter to ask for a fair hearing. Call the Katie Beckett team at 678-248-7449 or send your request in writing. A doctor\'s letter spelling out your child\'s daily care needs gives the strongest appeal.',
  },
  {
    question: 'How does Katie Beckett renewal work?',
    answer: 'Most approvals last at least two years. About 60 to 90 days before your approval ends, the state sends a renewal notice. You will need updated medical records and a new evaluation, but not a full new application.',
  },
  {
    question: 'What is the deeming waiver and how does it apply to Katie Beckett?',
    answer: 'The deeming waiver is the rule that lets Katie Beckett ignore your family income. The state "deems" that only your child\'s own money counts toward the test. For most kids that is zero, so any family income level can qualify.',
  },
  {
    question: 'Does Katie Beckett cover ABA therapy for autism?',
    answer: 'Yes. Once your child has Medicaid through Katie Beckett, ABA therapy is covered. Your child needs a written autism diagnosis and a prescription for ABA from a doctor or psychologist.',
  },
  {
    question: 'Does Katie Beckett cover dental work and braces?',
    answer: 'Yes for basic dental care like cleanings, fillings, and sedation dentistry for kids who cannot sit still. Braces are covered when a dentist or orthodontist writes a medical necessity letter showing why your child needs them.',
  },
  {
    question: 'What happens when my child turns 18?',
    answer: 'Katie Beckett ends on your child\'s 18th birthday. GAPP nursing continues until age 21. Before age 18, talk to the Katie Beckett team about adult Medicaid waivers like ICWP or COMP that may fit your family.',
  },
  {
    question: 'Where is the Katie Beckett office in Georgia?',
    answer: 'The Centralized Katie Beckett Medicaid Team is at 5815 Live Oak Parkway, Suite D-2, Norcross, GA 30093. The phone number is 678-248-7449.',
  },
]

const QUALIFYING_CONDITIONS = [
  'Cerebral palsy',
  'Muscular dystrophy',
  'Spina bifida',
  'Severe autism spectrum disorder',
  'Traumatic brain injury',
  'Ventilator dependence',
  'Tracheostomy care needs',
  'G-tube/feeding tube requirements',
  'Seizure disorders requiring monitoring',
  'Genetic syndromes',
  'Congenital heart defects',
  'Chronic respiratory conditions',
  'Spinal cord injuries',
  'Cancer requiring ongoing treatment',
  'Organ transplant recipients',
]

export const metadata: Metadata = {
  title: 'Katie Beckett Waiver Georgia: Eligibility & Application',
  description: 'Katie Beckett (TEFRA) in Georgia — eligibility, the 2026 Online Portal, income rules, application forms, and how it works with GAPP.',
  keywords: 'Katie Beckett waiver Georgia, Katie Beckett eligibility Georgia, TEFRA Georgia, Katie Beckett application Georgia, Katie Beckett requirements, Georgia Medicaid disabled child, Katie Beckett vs GAPP',
  openGraph: {
    title: 'Katie Beckett Waiver Georgia: Complete Eligibility & Application Guide',
    description: 'Everything you need to know about the Katie Beckett waiver in Georgia. Eligibility requirements, application process, and connection to GAPP nursing services.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/katie-beckett-waiver-georgia',
  },
}

export default function KatieBeckettWaiverGeorgiaPage() {
  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={KATIE_BECKETT_FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Katie Beckett Waiver Georgia', url: 'https://www.georgiagapp.com/katie-beckett-waiver-georgia' },
        ]}
      />
      <ArticleSchema
        headline="Katie Beckett Waiver in Georgia"
        datePublished="2026-01-19"
        dateModified="2026-05-11"
        description="Katie Beckett (TEFRA) in Georgia — eligibility, the 2026 Online Portal, income rules, application forms, and how it works with GAPP."
        url="https://www.georgiagapp.com/katie-beckett-waiver-georgia"
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Katie Beckett Waiver Georgia</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Katie Beckett Waiver in Georgia
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            The Katie Beckett waiver helps children with disabilities qualify for Medicaid regardless of family income. Learn if your child qualifies and how to apply.
          </p>

          <div className="inline-flex items-center gap-2 mb-6 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Updated May 2026 — includes the new online portal that launched April 15, 2026</span>
          </div>

          {/* Key benefit callout */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-green-900">No Income Limits</p>
                <p className="text-green-800 text-sm">Unlike regular Medicaid, Katie Beckett eligibility is based only on your child&apos;s medical needs — not your family&apos;s income.</p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-2">
            <a href="#online-portal" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              The new online portal
            </a>
            <a href="#eligibility" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              Who qualifies
            </a>
            <a href="#income-rules" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              How income works
            </a>
            <a href="#how-to-apply" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              How to apply
            </a>
            <a href="#timeline" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              How long it takes
            </a>
            <a href="#appeals" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              If you are denied
            </a>
            <a href="#renewal" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              Renewal
            </a>
            <a href="#what-it-covers" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              What it covers
            </a>
            <a href="#vs-other-programs" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              Compared to other programs
            </a>
            <a href="#faqs" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              FAQs
            </a>
          </div>
        </div>
      </section>

      {/* What is Katie Beckett */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            What is the Katie Beckett Waiver?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              The <strong>Katie Beckett waiver</strong> (officially known as <strong>TEFRA</strong> — Tax Equity and Fiscal Responsibility Act) is a Medicaid eligibility option that allows children with significant disabilities to qualify for Medicaid based on their own medical condition, <em>regardless of their parents&apos; income</em>.
            </p>
            <p>
              Named after Katie Beckett, a child who was ventilator-dependent and could only receive Medicaid coverage while in the hospital, this program was created to allow medically fragile children to receive care at home while still qualifying for Medicaid benefits.
            </p>
            <p>
              In Georgia, the Katie Beckett program is administered by the Department of Community Health and provides a pathway for families who might not otherwise qualify for Medicaid due to income to get coverage for their child with disabilities.
            </p>
            <p>
              Katie Beckett is named after a child from Iowa who lived on a ventilator. Before this rule existed, Medicaid only paid for her care in a hospital, not at her parents&apos; home. In 1982, Congress passed a law called TEFRA that let kids like Katie get Medicaid at home. Georgia&apos;s version of this rule is called the <strong>TEFRA Children&apos;s Medical Assistance Program</strong>. People still call it Katie Beckett.
            </p>

            <div className="bg-blue-50 border-l-4 border-primary p-4 my-6 not-prose">
              <p className="text-primary font-semibold mb-1">Key Point</p>
              <p className="text-gray-700">
                Katie Beckett is an <strong>eligibility pathway</strong> to Medicaid — it&apos;s how your child qualifies. Once on Medicaid, you can access services like <Link href="/gapp-providers-georgia" className="text-primary hover:underline">GAPP nursing care</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The new Online Portal (April 15, 2026) */}
      <section id="online-portal" className="py-12 sm:py-16 px-4 scroll-mt-24 bg-blue-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            The new Katie Beckett online portal
          </h2>
          <p className="text-gray-700 mb-4">
            On April 15, 2026, Georgia launched a new online portal for Katie Beckett. You can use it to apply, send your child&apos;s medical records, and check your status. You can also message the case worker who handles your file.
          </p>
          <p className="text-gray-700 mb-6">
            The portal lives on the state Medicaid website. If you do not have a computer, you can still apply by phone or at your local DFCS office. Both work the same way as before.
          </p>

          <div className="bg-white border border-blue-100 rounded-xl p-5 mb-6">
            <p className="font-semibold text-gray-900 mb-3">What you can do in the portal</p>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Start and submit your Katie Beckett application</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Upload your child&apos;s medical records</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Check your case status without calling</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Send a message to your case worker</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>See and download your approval letter when it arrives</span>
              </li>
            </ul>
          </div>

          <p className="text-gray-700">
            The portal is at{' '}
            <a href="https://medicaid.georgia.gov/programs/all-programs/tefrakatie-beckett" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">medicaid.georgia.gov</a>.
            You can also call the Katie Beckett team at{' '}
            <a href="tel:6782487449" className="text-primary hover:underline font-semibold">678-248-7449</a> if you need help getting started.
          </p>
        </div>
      </section>

      {/* Eligibility Requirements */}
      <section id="eligibility" className="py-12 sm:py-16 px-4 bg-gray-50 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Katie Beckett Eligibility Requirements in Georgia
          </h2>

          <p className="text-gray-600 mb-8">
            To qualify for the Katie Beckett waiver in Georgia, your child must meet all of the following criteria:
          </p>

          <div className="space-y-4 mb-8">
            {[
              { title: 'Age', desc: 'Your child must be under 18.', detail: 'Katie Beckett ends on the 18th birthday. Plan for GAPP (under 21) or adult waivers before that point.' },
              { title: 'Disability', desc: 'Your child must have a disability as defined by Section 1614 of the Social Security Act.', detail: 'This is the same definition used for SSI. The disability must be expected to last at least 12 months or result in death.' },
              { title: 'Level of care', desc: 'Your child must need care at the level a hospital or nursing facility would give.', detail: 'DCH looks for continuous medical supervision or four or more daily hours of skilled nursing. It also covers care needs an untrained caregiver cannot meet alone.' },
              { title: 'Safe to be home', desc: 'Your child must be able to be safely cared for at home.', detail: 'Your home does not need to be a medical setting. A bedroom, a caregiver, and the right equipment usually meet this test.' },
              { title: 'Cost test', desc: 'Home care must cost less than facility care.', detail: 'For nearly every child, home care is cheaper than a hospital or nursing home. This test almost always passes.' },
              { title: 'Georgia resident', desc: 'Your child must live in Georgia.', detail: 'A Georgia mailing address and parent residency normally meet this rule. Temporary out-of-state hospital stays do not break residency.' },
            ].map((req, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-5 border border-gray-200">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{req.title}</p>
                  <p className="text-gray-700 text-sm mt-1">{req.desc}</p>
                  <p className="text-gray-500 text-sm mt-2">{req.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-amber-900">Important Note</p>
                <p className="text-amber-800 text-sm">Family income and assets are NOT considered for Katie Beckett eligibility. Your income does not disqualify your child if they meet the medical criteria.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How "no income limit" actually works */}
      <section id="income-rules" className="py-12 sm:py-16 px-4 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Why your family income does not count
          </h2>
          <p className="text-gray-700 mb-4">
            Most Medicaid programs look at how much your family earns. Katie Beckett does not. It only looks at your child&apos;s own money. For most kids, that amount is zero.
          </p>
          <p className="text-gray-700 mb-6">
            This rule is called <strong>deeming</strong>. The state deems that only your child&apos;s money counts toward the income test, not yours.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-6">
            <p className="font-semibold text-green-900 mb-2">A real-world example</p>
            <p className="text-green-900 mb-3">
              Say your family earns $200,000 a year. Your child has no money of their own. Under Katie Beckett, your child passes the income test. The only test left is the medical one.
            </p>
            <p className="text-green-900 text-sm">
              The same is true at $300,000 or $500,000. Family income does not block Katie Beckett.
            </p>
          </div>

          <p className="text-gray-700 mb-4">
            <strong>What does count as your child&apos;s money?</strong>
          </p>
          <ul className="space-y-2 text-gray-700 mb-6 list-disc list-inside ml-2">
            <li>Child support paid directly to your child</li>
            <li>SSI checks your child receives</li>
            <li>Money in a bank account in your child&apos;s name</li>
            <li>Assets your child inherited from a relative</li>
          </ul>
          <p className="text-gray-700 mb-6">
            For most children, none of these apply. So the income limit on Katie Beckett is not the problem most families think it is.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-amber-900">If you were told you make too much for Medicaid</p>
                <p className="text-amber-800 text-sm">You were told about regular Medicaid. Katie Beckett is the way around that rule for kids with serious medical needs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualifying Conditions */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Conditions That May Qualify for Katie Beckett
          </h2>
          <p className="text-gray-600 mb-6">
            The following conditions commonly qualify for Katie Beckett in Georgia. Eligibility is based on level of care needed, not specific diagnoses:
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {QUALIFYING_CONDITIONS.map((condition, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700 text-sm">{condition}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-500 text-sm mt-6">
            This is not an exhaustive list. Any condition requiring institutional-level care may qualify. Contact the Katie Beckett team if you&apos;re unsure about your child&apos;s eligibility.
          </p>
        </div>
      </section>

      {/* How to Apply */}
      <section id="how-to-apply" className="py-12 sm:py-16 px-4 bg-gray-50 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            How to Apply for Katie Beckett in Georgia
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Apply for SSI First (Required)</h3>
                  <p className="text-gray-600 mb-3">
                    You must apply for Supplemental Security Income (SSI) and receive a denial before applying for Katie Beckett. This establishes that your child doesn&apos;t qualify for Medicaid through SSI.
                  </p>
                  <p className="text-gray-600 text-sm">
                    Call Social Security at <strong>1-800-772-1213</strong> to apply for SSI. If approved for SSI, you don&apos;t need Katie Beckett — you&apos;ll automatically get Medicaid.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Gather Medical Documentation</h3>
                  <p className="text-gray-600 mb-3">
                    Collect comprehensive medical records including:
                  </p>
                  <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                    <li>Diagnosis documentation from physicians</li>
                    <li>Hospital discharge summaries</li>
                    <li>Current treatment plans</li>
                    <li>Therapy evaluations (PT, OT, speech)</li>
                    <li>Documentation of daily care needs</li>
                    <li>Any nursing or personal care requirements</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-3">Pick how you want to apply</h3>
                  <p className="text-gray-700 mb-4">You can apply three ways. Pick whichever fits your situation.</p>

                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="font-semibold text-gray-900 mb-2">Online</p>
                      <p className="text-gray-700 text-sm mb-2">Use the state portal at <a href="https://medicaid.georgia.gov/programs/all-programs/tefrakatie-beckett" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">medicaid.georgia.gov</a> or apply through <a href="https://gateway.ga.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">gateway.ga.gov</a>.</p>
                      <p className="text-gray-500 text-xs">Fastest if you have the records ready to upload.</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="font-semibold text-gray-900 mb-2">By phone</p>
                      <p className="text-gray-700 text-sm mb-2">Call the Katie Beckett team at <a href="tel:6782487449" className="text-primary hover:underline font-semibold">678-248-7449</a>.</p>
                      <p className="text-gray-500 text-xs">They walk you through what they need.</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="font-semibold text-gray-900 mb-2">In person</p>
                      <p className="text-gray-700 text-sm mb-2">Visit your local DFCS office. Ask for a Katie Beckett application.</p>
                      <p className="text-gray-500 text-xs">Best if you want help filling out the forms.</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    <p className="font-medium text-gray-900">Centralized Katie Beckett Medicaid Team</p>
                    <p className="text-gray-700">5815 Live Oak Parkway, Suite D-2</p>
                    <p className="text-gray-700">Norcross, GA 30093</p>
                    <p className="text-gray-700 mt-2">
                      <strong>Phone:</strong> 678-248-7449<br />
                      <strong>Fax:</strong> 678-248-7459
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Fill out the three Katie Beckett forms</h3>
                  <p className="text-gray-700 mb-4">Three forms from the Department of Community Health make up the Katie Beckett application. Your child&apos;s doctor fills out the medical parts.</p>

                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs">1</span>
                      <div>
                        <p className="font-semibold text-gray-900">Pediatric DMA Form</p>
                        <p>The main application. Captures your child&apos;s diagnosis, treating doctors, and care history.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs">2</span>
                      <div>
                        <p className="font-semibold text-gray-900">Medical Necessity Level of Care Statement</p>
                        <p>Your child&apos;s doctor signs this. It explains why your child needs hospital-level or nursing-facility-level care.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs">3</span>
                      <div>
                        <p className="font-semibold text-gray-900">Cost Effectiveness Form</p>
                        <p>Shows that caring for your child at home costs less than caring for them in a facility. For nearly every child, this passes easily.</p>
                      </div>
                    </li>
                  </ul>

                  <p className="text-gray-600 text-sm mt-4">
                    The state has all three forms in English and Spanish. You can ask for them by phone, download them from <a href="https://medicaid.georgia.gov/programs/all-programs/tefrakatie-beckett" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">medicaid.georgia.gov</a>, or pick them up at a DFCS office.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">5</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Medical Level of Care Evaluation</h3>
                  <p className="text-gray-600">
                    Your child will be evaluated to confirm they require care at an institutional level. This evaluation determines if home care is appropriate and cost-effective compared to facility care.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">6</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Approval & Next Steps</h3>
                  <p className="text-gray-600 mb-3">
                    Once approved, your child will have Medicaid coverage. Approvals are now authorized for a minimum of <strong>two years</strong>. You can then access services including:
                  </p>
                  <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                    <li>Doctor visits and specialists</li>
                    <li>Medications</li>
                    <li>Medical equipment</li>
                    <li>Therapy services</li>
                    <li><Link href="/gapp-providers-georgia" className="text-primary hover:underline">GAPP in-home nursing services</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-900 font-medium mb-1">Timeline</p>
            <p className="text-blue-800 text-sm">
              The Katie Beckett application process typically takes <strong>45-90 days</strong> in Georgia. Having complete documentation ready can help speed up approval.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline and medical evaluation */}
      <section id="timeline" className="py-12 sm:py-16 px-4 scroll-mt-24 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            How long Katie Beckett takes
          </h2>
          <p className="text-gray-700 mb-6">
            Most families wait 45 to 90 days from start to finish. Here is how that time breaks down.
          </p>

          <div className="space-y-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="font-semibold text-gray-900 mb-1">Week 1 to 2 — Application review</p>
              <p className="text-gray-700 text-sm">The state checks if your application is complete. If something is missing, they will ask for it. Missing forms add weeks to your wait.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="font-semibold text-gray-900 mb-1">Week 3 to 8 — Medical evaluation</p>
              <p className="text-gray-700 text-sm">A nurse or doctor reviews your child&apos;s medical records. They want to see if your child needs the kind of care a hospital or nursing home would give.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="font-semibold text-gray-900 mb-1">Week 9 to 10 — Decision and approval letter</p>
              <p className="text-gray-700 text-sm">The state mails you a letter with the answer. If approved, your child has Medicaid right away. The approval lasts at least two years.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="font-semibold text-green-900 mb-2">What speeds up your case</p>
              <ul className="text-green-900 text-sm space-y-1 list-disc list-inside">
                <li>A full medical history from your child&apos;s main doctor</li>
                <li>Notes from any specialists who treat your child</li>
                <li>A current treatment plan</li>
                <li>Records of daily care your child needs</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <p className="font-semibold text-red-900 mb-2">What slows your case down</p>
              <ul className="text-red-900 text-sm space-y-1 list-disc list-inside">
                <li>Missing or old medical records</li>
                <li>No proof of daily care needs</li>
                <li>Records that do not match what the doctor wrote</li>
                <li>No SSI denial letter on file</li>
              </ul>
            </div>
          </div>

          <p className="text-gray-700">
            Once Katie Beckett is approved, you can start the GAPP nursing process. See our{' '}
            <Link href="/gapp-approval-timeline" className="text-primary hover:underline">GAPP approval timeline</Link>{' '}
            for how long GAPP takes after Medicaid is in place.
          </p>
        </div>
      </section>

      {/* If you are denied */}
      <section id="appeals" className="py-12 sm:py-16 px-4 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            If you are denied
          </h2>
          <p className="text-gray-700 mb-6">
            A denial is not the end. You have the right to ask the state to look at your case again. This is called an appeal.
          </p>

          <p className="font-semibold text-gray-900 mb-3">Most denials come from one of three reasons</p>
          <ul className="space-y-2 text-gray-700 mb-6 list-disc list-inside ml-2">
            <li>The state did not see enough medical proof</li>
            <li>Your child&apos;s care needs were not clear in the records</li>
            <li>The SSI denial letter was missing from your file</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-amber-900">You have 30 days to act</p>
                <p className="text-amber-800 text-sm">From the date on your denial letter, you have 30 days to ask for a fair hearing. A fair hearing is the legal name for an appeal. You can ask by phone or in writing. The state will set a date for the hearing.</p>
              </div>
            </div>
          </div>

          <p className="font-semibold text-gray-900 mb-3">What helps on appeal</p>
          <ul className="space-y-2 text-gray-700 mb-6 list-disc list-inside ml-2">
            <li>A letter from your child&apos;s doctor that spells out daily care needs</li>
            <li>A log of how many hours of care your child gets each week</li>
            <li>Records from any new doctor visits since you first applied</li>
          </ul>

          <p className="text-gray-700 mb-4">
            If you need help, the <strong>Georgia Advocacy Office</strong> and <strong>Parent to Parent of Georgia</strong> are both free. They know how Katie Beckett works and can guide you through the appeal.
          </p>

          <p className="text-gray-700">
            For more on common denial reasons, see our{' '}
            <Link href="/why-gapp-applications-get-denied" className="text-primary hover:underline">guide to GAPP denials</Link>. Many of the same rules apply.
          </p>
        </div>
      </section>

      {/* Renewal and recertification */}
      <section id="renewal" className="py-12 sm:py-16 px-4 scroll-mt-24 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Renewing your child&apos;s Katie Beckett
          </h2>
          <p className="text-gray-700 mb-4">
            Katie Beckett approval lasts at least two years. Some families get a longer approval based on how stable their child&apos;s needs are.
          </p>
          <p className="text-gray-700 mb-6">
            About 60 to 90 days before your approval ends, the state sends a renewal notice. Open it right away. The notice tells you what to do.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-blue-900">Renewal is not a full new application</p>
                <p className="text-blue-800 text-sm">The state wants updated medical records and a fresh medical evaluation. Your child&apos;s old approval stays in place while the renewal is being reviewed.</p>
              </div>
            </div>
          </div>

          <p className="font-semibold text-gray-900 mb-3">What ends your child&apos;s Katie Beckett</p>
          <ul className="space-y-2 text-gray-700 mb-6 list-disc list-inside ml-2">
            <li>Missing the renewal window with no answer to the state</li>
            <li>Your child going back to a hospital or nursing home for a long stay</li>
            <li>Your child turning 18</li>
          </ul>

          <p className="text-gray-700">
            If your child is close to 18, start planning for the next program early. GAPP nursing covers kids up to 21. Adult Medicaid waivers like ICWP or COMP may also fit your family.
          </p>
        </div>
      </section>

      {/* What Katie Beckett Covers */}
      <section id="what-it-covers" className="py-12 sm:py-16 px-4 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            What does Katie Beckett cover in Georgia?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              Once your child is approved for Medicaid through Katie Beckett, they get the full range of Georgia Medicaid benefits. For families with medically fragile kids, this changes everything.
            </p>
            <p>
              Here&apos;s what Katie Beckett Medicaid covers:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6 mb-8">
            {[
              { title: 'Doctor visits and specialists', desc: 'Pediatricians, neurologists, pulmonologists, and any specialist your child needs. No referral hoops for Medicaid-enrolled providers.' },
              { title: 'Hospital stays', desc: 'Inpatient and outpatient hospital care, emergency room visits, and surgeries.' },
              { title: 'Prescription medications', desc: 'Covered prescriptions including specialty medications that private insurance often limits or denies.' },
              { title: 'Durable medical equipment', desc: 'Wheelchairs, feeding pumps, oxygen equipment, suction machines, hospital beds, and other equipment your child uses daily.' },
              { title: 'Therapy services', desc: 'Physical, occupational, and speech therapy. ABA therapy for autism is also covered with a written diagnosis and a prescription from your child\'s doctor.' },
              { title: 'Home nursing through GAPP', desc: 'RN, LPN, and personal care services in your home. Private insurance rarely covers the hours medically fragile children actually need.' },
              { title: 'Mental health services', desc: 'Counseling, psychiatric care, and ongoing behavioral support for kids who need it.' },
              { title: 'Behavioral health crisis services', desc: 'Mobile crisis teams and short-term stabilization for kids in a behavioral health emergency. Separate from the routine mental health benefit.' },
              { title: 'Dental and orthodontia', desc: 'Cleanings, fillings, and sedation dentistry for kids who cannot sit still. Braces are covered when a dentist writes a medical necessity letter showing why your child needs them.' },
              { title: 'Medical transportation', desc: 'Non-emergency rides to and from appointments. One less thing to figure out on appointment days.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-green-900">Katie Beckett + private insurance</p>
                <p className="text-green-800 text-sm">Your child can have both Katie Beckett Medicaid and private insurance at the same time. Medicaid acts as secondary coverage and picks up what your private plan doesn&apos;t cover. Start by <Link href="/gapp-providers-georgia" className="text-green-900 underline hover:no-underline">finding a GAPP provider</Link> to get in-home nursing set up.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Katie Beckett vs GAPP */}
      <section id="vs-other-programs" className="py-12 sm:py-16 px-4 scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Katie Beckett compared to other Georgia programs
          </h2>

          <p className="text-gray-700 mb-8">
            Georgia has several Medicaid programs that help children with serious needs. Each one does something different. Here is how the four that matter for kids line up.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-gray-900"></th>
                  <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-primary">Katie Beckett (TEFRA)</th>
                  <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-accent">GAPP</th>
                  <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-gray-700">NOW Waiver</th>
                  <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-gray-700">COMP Waiver</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-3 py-3 font-medium text-gray-900 bg-gray-50">What it is</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">A way to get Medicaid</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">A nursing service</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Daily life supports</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Heavy daily supports</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-3 font-medium text-gray-900 bg-gray-50">Who it is for</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Kids with serious medical needs</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Kids who need home nursing</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Kids and adults with IDD</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Kids and adults with severe IDD</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-3 font-medium text-gray-900 bg-gray-50">Age range</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Under 18</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Under 21</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">All ages</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">All ages</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-3 font-medium text-gray-900 bg-gray-50">Family income test</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">None</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">None (child must already have Medicaid)</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">None</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">None</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-3 font-medium text-gray-900 bg-gray-50">How to apply</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">678-248-7449 or gateway.ga.gov</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Pick a GAPP provider; they apply for you</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Sign up on the state DD waitlist</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Sign up on the state DD waitlist</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-3 font-medium text-gray-900 bg-gray-50">You choose the provider?</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">N/A</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Yes</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Yes</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-semibold text-green-900 mb-3">How Katie Beckett and GAPP work together</h3>
            <p className="text-green-900 mb-3">
              Most Georgia families use Katie Beckett to get Medicaid. Then they sign up for GAPP to get home nursing care for their child.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="px-3 py-1 bg-primary text-white rounded-full font-medium">Katie Beckett</span>
              <span className="text-green-800">→</span>
              <span className="px-3 py-1 bg-green-600 text-white rounded-full font-medium">Medicaid</span>
              <span className="text-green-800">→</span>
              <span className="px-3 py-1 bg-accent text-white rounded-full font-medium">GAPP nursing</span>
            </div>
            <p className="text-green-900 text-sm mt-3">
              NOW and COMP are different waivers run by the Georgia DD (Developmental Disabilities) office. They serve kids with mostly cognitive needs, not medical ones. Most families with medically fragile children use Katie Beckett plus GAPP, not the DD waivers.
            </p>
          </div>
        </div>
      </section>

      {/* After Approval CTA */}
      <section className="py-12 sm:py-16 px-4 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Approved for Katie Beckett? Find a GAPP Provider
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Once your child has Medicaid through Katie Beckett, you can access GAPP nursing services. Search our directory of verified GAPP providers in Georgia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/directory"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Find GAPP Providers
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href="/gapp-approval-guide"
              className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white/10 transition-colors"
            >
              GAPP Approval Guide
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-12 sm:py-16 px-4 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Katie Beckett Waiver Georgia: FAQs
          </h2>
          <div className="space-y-4">
            {KATIE_BECKETT_FAQS.map((faq, index) => (
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

      {/* Official resources — outbound .gov links for authority signal */}
      <section className="bg-blue-50 border border-blue-100 rounded-lg p-6 my-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-navy mb-3">Official Katie Beckett resources</h2>
        <p className="text-gray-700 mb-4">
          For the most current eligibility rules and application forms, go directly to the state and federal sources:
        </p>
        <ul className="space-y-3 text-gray-700">
          <li>
            <a href="https://medicaid.georgia.gov/programs/all-programs/tefrakatie-beckett" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
              Georgia Medicaid: TEFRA / Katie Beckett →
            </a>
            <span className="text-gray-600 text-sm block">Official program page from Georgia Medicaid</span>
          </li>
          <li>
            <a href="https://dch.georgia.gov/divisionsoffices" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
              Georgia Department of Community Health →
            </a>
            <span className="text-gray-600 text-sm block">State agency that runs Georgia Medicaid (DCH divisions)</span>
          </li>
          <li>
            <a href="https://www.medicaid.gov/medicaid/eligibility-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
              Medicaid.gov: Eligibility Policy →
            </a>
            <span className="text-gray-600 text-sm block">Federal Medicaid policy reference</span>
          </li>
          <li>
            <a href="https://www.cms.gov/contacts/cms-atlanta-regional-office/general-professional-contact/1551781" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
              CMS: Atlanta Regional Office (Region IV) →
            </a>
            <span className="text-gray-600 text-sm block">Federal agency overseeing Medicaid in Georgia</span>
          </li>
        </ul>
        <p className="text-sm text-gray-600 mt-4">
          To start an application, call the Georgia Centralized Katie Beckett Medicaid Team at{' '}
          <a href="tel:6782487449" className="text-primary hover:underline font-semibold">678-248-7449</a>.
        </p>
      </section>

      {/* Related Resources */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Related Resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/gapp-providers-georgia" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1">GAPP Providers</h3>
              <p className="text-sm text-gray-600">Find verified providers in Georgia</p>
            </Link>
            <Link href="/gapp-approval-guide" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1">GAPP Approval Guide</h3>
              <p className="text-sm text-gray-600">Step-by-step approval process</p>
            </Link>
            <Link href="/waivers" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1">All Georgia Waivers</h3>
              <p className="text-sm text-gray-600">Compare GAPP, Katie Beckett & more</p>
            </Link>
            <Link href="/gapp-services-explained" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1">GAPP services explained</h3>
              <p className="text-sm text-gray-600">What RN, LPN, and PCS nurses do</p>
            </Link>
            <Link href="/how-to-apply-for-gapp" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1">How to apply for GAPP</h3>
              <p className="text-sm text-gray-600">Steps after Katie Beckett approval</p>
            </Link>
            <Link href="/blog/what-does-gapp-stand-for" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1">What does GAPP stand for?</h3>
              <p className="text-sm text-gray-600">Plain-English program guide</p>
            </Link>
            <Link href="/medically-fragile-children-care" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1">Medically fragile children care</h3>
              <p className="text-sm text-gray-600">Care options for your child</p>
            </Link>
            <Link href="/pediatric-home-nursing-georgia" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1">Pediatric home nursing</h3>
              <p className="text-sm text-gray-600">In-home nursing in Georgia</p>
            </Link>
            <Link href="/gapp-paid-caregiver" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1">Get paid as a caregiver</h3>
              <p className="text-sm text-gray-600">Family members as paid caregivers</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 mb-2">
            <strong>Last updated:</strong> May 2026 (includes the April 15, 2026 online portal launch)
          </p>
          <p className="text-sm text-gray-500">
            This information is for education only. It is not legal or medical advice. For official Katie Beckett eligibility information, contact the Centralized Katie Beckett Medicaid Team at <a href="tel:6782487449" className="underline hover:text-gray-700">678-248-7449</a>.
          </p>
        </div>
      </section>
    </div>
  )
}
