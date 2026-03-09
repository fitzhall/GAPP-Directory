import Link from 'next/link'
import { FAQPageSchema } from '@/components/JsonLd'

const faqs = [
  {
    question: 'Can medically fragile children go to regular daycare in Georgia?',
    answer: 'It depends on the child. Some daycares accept children with mild medical needs, but most standard daycares are not equipped to handle trach care, tube feeds, oxygen, or medication administration. You will need to ask each daycare directly about their medical capabilities and staffing.',
  },
  {
    question: 'Does GAPP cover daycare or childcare costs?',
    answer: 'No. GAPP covers home nursing (RN and LPN) and personal care services (PCS) provided in the home. It does not pay for daycare or childcare programs. However, GAPP nursing hours can cover times when you would otherwise need childcare, like during work hours.',
  },
  {
    question: 'What is a medical daycare and does Georgia have them?',
    answer: 'A medical daycare (sometimes called a prescribed pediatric extended care facility or PPEC) provides daytime nursing care for medically fragile children. Georgia has very few of these facilities, mostly in the Atlanta metro area. Most families rely on in-home GAPP nursing instead.',
  },
  {
    question: 'Can I use GAPP nursing hours while my child is at school?',
    answer: 'GAPP hours are typically for in-home care. School nursing is usually handled through your child\'s IEP or 504 plan. Some families use GAPP hours for before-school, after-school, or transport times, but this varies by authorization.',
  },
  {
    question: 'What do I do if no daycare in my area will accept my child?',
    answer: 'Apply for GAPP services through a provider agency. GAPP sends nurses to your home, which solves the childcare gap for many families. Start with the eligibility screener on our site to see if your child qualifies, then search for providers in your county.',
  },
  {
    question: 'How many hours of GAPP nursing can my child get per week?',
    answer: 'Hours depend on your child\'s medical needs and the authorization from the state. Some children get 8-12 hours per week, others get 24/7 coverage. Your GAPP provider agency submits the prior authorization based on your child\'s physician order.',
  },
]

export default function ChildcareMedicallyFragileContent() {
  return (
    <>
      <FAQPageSchema faqs={faqs} />

      <p className="text-lg text-gray-700 mb-6">
        If your child has a trach, a feeding tube, or needs oxygen at home, finding childcare is a different ballgame than asking a neighbor. Regular daycares say no. The waitlists for specialized programs are long. And you still need to work, or sleep, or take your other kids to school.
      </p>

      <p className="text-gray-700 mb-6">
        Here are the actual options Georgia families have, what each one costs, and what the catch is.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
        Option 1: GAPP home nursing
      </h2>

      <p className="text-gray-700 mb-4">
        This is what most Georgia families end up using. The <Link href="/georgia-pediatric-program" className="text-primary hover:underline">Georgia Pediatric Program (GAPP)</Link> pays for nurses to come to your home and care for your child while you handle the rest of life. RNs, LPNs, and personal care aides, all covered by Medicaid.
      </p>

      <p className="text-gray-700 mb-4">
        The hours depend on what your child needs medically. Some families get a few hours a day. Others get round-the-clock coverage. Your child&apos;s doctor writes the order, and the provider agency handles the authorization paperwork.
      </p>

      <p className="text-gray-700 mb-6">
        The catch: finding an agency with nurses actually available in your county. That&apos;s the hard part. Use our <Link href="/directory" className="text-primary hover:underline">provider directory</Link> to search by county and see who is accepting new patients right now.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
        Option 2: medical daycare (PPEC)
      </h2>

      <p className="text-gray-700 mb-4">
        Prescribed Pediatric Extended Care (PPEC) facilities are daytime nursing centers for medically fragile kids. Nurses on staff, medical equipment on site, and your child gets socialization with other kids.
      </p>

      <p className="text-gray-700 mb-6">
        The problem: Georgia has very few PPECs. Most are in metro Atlanta. If you live in South Georgia or a rural county, this option probably doesn&apos;t exist near you. Call your local DFCS office or your child&apos;s care coordinator to ask if there is one in your area.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
        Option 3: regular daycare with accommodations
      </h2>

      <p className="text-gray-700 mb-4">
        Some daycares will accept children with moderate medical needs if a parent or private nurse accompanies them, or if the child&apos;s needs are limited to things like oral medications or inhaler use.
      </p>

      <p className="text-gray-700 mb-6">
        Ask daycares directly. Be specific about what your child needs. Bring documentation from your pediatrician. Some facilities are willing but unsure about liability. A letter from your doctor explaining the care routine can help.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
        Option 4: family member as paid caregiver
      </h2>

      <p className="text-gray-700 mb-4">
        Through GAPP&apos;s <Link href="/gapp-services-explained" className="text-primary hover:underline">Personal Care Services (PCS)</Link> program, a family member can get paid to provide care. This isn&apos;t the same as nursing, but for children who need help with daily activities, it&apos;s an option that keeps care in the family.
      </p>

      <p className="text-gray-700 mb-6">
        The family member works through a GAPP provider agency. The agency handles payroll and oversight. Check <Link href="/gapp-paid-caregiver" className="text-primary hover:underline">our guide to getting paid as a GAPP caregiver</Link> for the full breakdown.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
        Which counties have the most options?
      </h2>

      <p className="text-gray-700 mb-4">
        Metro Atlanta counties have the most GAPP providers and the best chance of finding available nurses. <Link href="/fulton" className="text-primary hover:underline">Fulton</Link>, <Link href="/gwinnett" className="text-primary hover:underline">Gwinnett</Link>, and <Link href="/cobb" className="text-primary hover:underline">Cobb</Link> counties each have dozens of agencies. Rural counties may have only one or two, so start your search early.
      </p>

      <p className="text-gray-700 mb-6">
        Not sure if your child qualifies for GAPP? Take our <Link href="/screener" className="text-primary hover:underline">2-minute eligibility screener</Link>. It tells you whether to apply and what to say to your doctor.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
        Frequently asked questions
      </h2>

      <div className="space-y-6 mb-8">
        {faqs.map((faq, i) => (
          <div key={i}>
            <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
            <p className="text-gray-700 text-sm">{faq.answer}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
        Your next step
      </h2>

      <p className="text-gray-700">
        Start with the <Link href="/screener" className="text-primary hover:underline">eligibility screener</Link> to check if your child qualifies for GAPP. If they do, <Link href="/directory" className="text-primary hover:underline">search the directory</Link> for providers in your county who are accepting new patients. Most agencies can start the intake process within a week of your first call.
      </p>
    </>
  )
}
