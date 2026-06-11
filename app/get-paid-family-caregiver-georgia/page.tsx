import Link from 'next/link'
import { Metadata } from 'next'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

// FAQ data for schema markup and display
const FAMILY_CAREGIVER_FAQS = [
  {
    question: 'Does Georgia pay family members to be caregivers?',
    answer: 'Yes, but indirectly. Georgia Medicaid does not write you a check for caring for a relative. Instead, programs like GAPP (for medically fragile children) and structured family caregiving options let a home care agency hire you as a paid Personal Care Services (PCS) worker. The agency bills Medicaid and pays you a wage. The path depends on who you are caring for and which program they qualify for.',
  },
  {
    question: 'How much does Georgia pay family caregivers?',
    answer: 'For PCS caregivers through GAPP and similar programs, pay in Georgia typically runs $10 to $15 per hour, set by the hiring agency. Rates are not standardized, so they vary by agency, county, and shift. There is no flat statewide "family caregiver salary" — your pay comes from the agency that employs you, based on the hours your family member is authorized for.',
  },
  {
    question: 'Can a parent get paid to care for their child in Georgia?',
    answer: 'Yes, if the child is approved for GAPP Personal Care Services. Once your child has authorized PCS hours, you can apply to a GAPP agency to be hired and assigned as their paid PCS caregiver. Skilled nursing hours (RN or LPN) require a licensed nurse, so a parent can only fill nursing hours if they hold a nursing license.',
  },
  {
    question: 'Can a spouse be paid as a caregiver in Georgia?',
    answer: 'For adult care, some Medicaid waiver programs in Georgia restrict paying a spouse or legal guardian, while others allow it through an agency. The rules are program-specific and the agency interprets them case by case. Ask any agency directly: "Can I be hired as the paid caregiver for my spouse under your program?" Get a clear answer in writing before you start.',
  },
  {
    question: 'What program lets me get paid to care for a medically fragile child?',
    answer: 'GAPP — the Georgia Pediatric Program — is the main pathway. It funds in-home nursing and personal care for children under 21 with complex medical needs on Georgia Medicaid. Family members can be hired as the paid PCS caregiver through a GAPP agency once the child is approved.',
  },
  {
    question: 'How long does it take to start getting paid as a family caregiver?',
    answer: 'If your family member is already approved for PCS hours, plan on 2 to 4 weeks to be hired: background check, drug screen, and agency training. If they still need program approval first, add roughly 2 to 6 weeks for that. So a realistic range is 2 to 10 weeks total depending on where you start.',
  },
  {
    question: 'Do I need a license or certification to be a paid family caregiver?',
    answer: 'For Personal Care Services (PCS), no license is required, but the agency will require a background check, a short PCS training program, and often CPR certification. For skilled nursing work you must be a licensed RN or LPN. Most family members qualify for PCS, not nursing.',
  },
]

export const metadata: Metadata = {
  title: 'Get Paid to Be a Family Caregiver in Georgia (2026)',
  description: 'Does Georgia pay family caregivers? How parents and relatives get paid to care for a loved one through GAPP and Medicaid PCS — pay rates, rules, and steps.',
  keywords: 'get paid family caregiver Georgia, does Georgia pay family caregivers, paid caregiver for family member Georgia, how much does Georgia pay caregivers, get paid to care for disabled child Georgia',
  openGraph: {
    title: 'Get Paid to Be a Family Caregiver in Georgia',
    description: 'How Georgia families get paid to care for a loved one through GAPP and Medicaid Personal Care Services.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/get-paid-family-caregiver-georgia',
  },
}

export default function GetPaidFamilyCaregiverGeorgiaPage() {
  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={FAMILY_CAREGIVER_FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Get paid as a family caregiver', url: 'https://www.georgiagapp.com/get-paid-family-caregiver-georgia' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Get paid as a family caregiver</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How to get paid to be a family caregiver in Georgia
          </h1>
          <p className="text-lg text-gray-600">
            If you are already caring for a child or relative with complex medical needs,
            Georgia Medicaid may pay you to do it through a home care agency. Here is who
            qualifies, how much it pays, and the exact steps to start.
          </p>
        </div>
      </section>

      {/* The short answer */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The short answer</h2>
          <div className="bg-gradient-to-br from-accent/10 to-blue-50 rounded-xl border border-accent/20 p-5">
            <p className="text-gray-700 mb-3">
              Georgia does not mail family members a caregiver check. Instead, Medicaid funds
              <strong> Personal Care Services (PCS)</strong> hours for the person who needs care.
              A home care agency then hires you, assigns you to your family member, and pays
              you a wage for those hours.
            </p>
            <p className="text-gray-700 mb-3">
              For a <strong>medically fragile child</strong>, the pathway is GAPP — the Georgia
              Pediatric Program. It is the most common route for parents and relatives who want
              to be paid for the care they already provide.
            </p>
            <p className="text-gray-700">
              The first step is always the same: the person you care for must be approved for
              PCS hours. Once that is done, you find an agency that hires family caregivers.
            </p>
          </div>
        </div>
      </section>

      {/* Which path applies to you */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Which path applies to you?</h2>
          <p className="text-gray-600 mb-8">
            The program depends on who you are caring for. Most families on this site are caring
            for a child, so GAPP is the main focus.
          </p>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Caring for a child with complex medical needs</h3>
              <p className="text-gray-700 mb-3">
                This is GAPP. If your child is under 21, on Georgia Medicaid, and has a qualifying
                medical condition, GAPP can authorize in-home PCS and nursing hours. A parent or
                relative can be hired as the paid PCS caregiver through a GAPP agency.
              </p>
              <p className="text-gray-700">
                Not sure if your child qualifies? Start with our{' '}
                <Link href="/screener" className="text-primary hover:underline">eligibility screener</Link>{' '}
                or read the{' '}
                <Link href="/gapp-approval-guide" className="text-primary hover:underline">GAPP approval guide</Link>.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Caring for an adult or aging relative</h3>
              <p className="text-gray-700 mb-3">
                Adult care runs through different Medicaid programs — primarily the elderly and
                disabled waiver programs (such as CCSP and SOURCE) and structured family caregiving
                options. Whether a spouse or guardian can be paid depends on the specific program.
              </p>
              <p className="text-gray-700">
                GeorgiaGAPP focuses on pediatric care, so for adult waivers contact Georgia Medicaid
                or a home care agency that serves adults to confirm the family caregiver rules.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Not sure where you fit</h3>
              <p className="text-gray-700">
                If your child is medically fragile and on Medicaid, GAPP is almost certainly your
                path. The rest of this page walks through exactly how getting paid works under it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How getting paid works - steps */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How getting paid actually works</h2>
          <p className="text-gray-600 mb-8">
            Four steps from authorization to paycheck. The agency does most of the heavy lifting.
          </p>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">1</span>
                  <h3 className="text-lg font-semibold text-white">Your family member gets approved for PCS hours</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Medicaid authorizes a set number of PCS hours per week based on need. Those hours
                  are what you will be paid to work. For a child, this happens through GAPP — see the{' '}
                  <Link href="/how-to-apply-for-gapp" className="text-primary hover:underline">how to apply for GAPP</Link> guide.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">2</span>
                  <h3 className="text-lg font-semibold text-white">Find an agency that hires family caregivers</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Not every agency hires family members. When you call, ask plainly:
                  &ldquo;Do you hire family members as PCS workers, and what do you pay them?&rdquo;
                  Call several and compare.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 text-sm">
                    <strong>Compare before you commit:</strong> Rates are set by each agency, not the state.
                    Talk to at least three before you sign on with one.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold">3</span>
                  <h3 className="text-lg font-semibold text-white">Get hired and assigned to your family member</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  The agency runs a background check and drug screen, puts you through PCS training,
                  and assigns you to your relative&apos;s case. Expect 2 to 4 weeks. Most agencies also
                  require CPR certification.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-accent px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-white text-accent rounded-full flex items-center justify-center font-bold">4</span>
                  <h3 className="text-lg font-semibold text-white">You work the authorized hours and get paid</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  You clock in and out, document your hours, and the agency pays you — usually biweekly
                  by direct deposit. The agency is your employer and handles taxes and your W-2. You are
                  not an independent contractor, and you cannot bill Medicaid yourself.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common questions by relationship */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Can I get paid to care for my…</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">…child</h3>
              <p className="text-gray-700 text-sm">
                Yes, through GAPP PCS once your child is approved. This is the most common and most
                straightforward path. See{' '}
                <Link href="/gapp-paid-caregiver" className="text-primary hover:underline">getting paid as a GAPP caregiver</Link>.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">…parent or grandparent</h3>
              <p className="text-gray-700 text-sm">
                Possible through adult Medicaid waiver programs (CCSP, SOURCE) via an agency. The
                rules differ from GAPP. Confirm with an agency that serves adults whether you can be
                the paid caregiver.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">…spouse</h3>
              <p className="text-gray-700 text-sm">
                Some programs restrict paying a spouse; others allow it through an agency. This one is
                the most case-specific — get the agency&apos;s answer in writing before you start.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">…disabled adult child</h3>
              <p className="text-gray-700 text-sm">
                GAPP covers children under 21. After 21, care shifts to adult disability waivers.
                If your child is still under 21, GAPP PCS is the pathway to being paid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What to expect for pay */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What to expect for pay</h2>
          <p className="text-gray-700 mb-4">
            PCS caregiver pay in Georgia typically falls between $10 and $15 per hour. The agency sets
            the rate, not the state, so it varies by agency and county, and some pay more for nights or
            weekends. There is no flat statewide salary for family caregivers.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-800 text-sm">
              <strong>How your pay is capped:</strong> Your hours come from the authorization, not your
              schedule. If your family member is approved for 25 PCS hours a week, that is the maximum
              you can be paid for — no matter how many hours you actually provide.
            </p>
          </div>
          <p className="text-gray-700">
            The agency bills Medicaid at a higher rate than it pays you. That spread covers their
            overhead: payroll, training, supervision, and insurance. This is standard across the industry.
          </p>
        </div>
      </section>

      {/* Things to know */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Before you start</h2>
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h3 className="font-semibold text-amber-800 mb-2">Guardian-vs-caregiver rules vary</h3>
              <p className="text-amber-700 text-sm">
                In some programs a legal guardian or spouse cannot also be the paid caregiver. Ask the
                agency directly whether your relationship qualifies, and get the answer before you invest
                weeks in the process.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h3 className="font-semibold text-amber-800 mb-2">A background check is required</h3>
              <p className="text-amber-700 text-sm">
                Every PCS worker passes a criminal background check and drug screen. A disqualifying
                offense can prevent the agency from hiring you. Ask what their specific disqualifiers are.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-semibold text-blue-800 mb-2">Approval comes first</h3>
              <p className="text-blue-700 text-sm">
                You cannot be paid until the person you care for is approved for hours. If that has not
                happened yet, that is your real first task — not finding an agency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related resources */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/gapp-paid-caregiver" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Getting paid as a GAPP caregiver</h3>
              <p className="text-sm text-gray-600">The step-by-step mechanics of being hired as your child&apos;s PCS worker.</p>
            </Link>
            <Link href="/gapp-approval-guide" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">How to get your child approved for GAPP</h3>
              <p className="text-sm text-gray-600">The approval process from Medicaid to care starting.</p>
            </Link>
            <Link href="/services/personal-care" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">What Personal Care Services covers</h3>
              <p className="text-sm text-gray-600">The full breakdown of PCS duties under GAPP.</p>
            </Link>
            <Link href="/directory" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary mb-2">Find agencies that hire family caregivers</h3>
              <p className="text-sm text-gray-600">Search by county, filter by PCS, and request a callback.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Family caregiver FAQs</h2>
          <div className="space-y-4">
            {FAMILY_CAREGIVER_FAQS.map((faq, i) => (
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
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Start with eligibility</h2>
          <p className="text-gray-600 mb-6">
            Before you can be paid, your family member needs approved hours. Check whether your child
            qualifies for GAPP, then find an agency that hires family caregivers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/screener"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Check Eligibility
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/directory"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors"
            >
              Find a Provider
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
