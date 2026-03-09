import Link from 'next/link'
import { FAQPageSchema } from '@/components/JsonLd'

const faqs = [
  {
    question: 'What does GAPP stand for?',
    answer: 'GAPP stands for Georgia Pediatric Program. It is a Medicaid-funded program that provides home nursing care (RN, LPN) and personal care services for children with serious medical conditions who would otherwise need hospital or institutional care.',
  },
  {
    question: 'Is GAPP the same as Medicaid?',
    answer: 'No. GAPP is a program funded through Georgia Medicaid, but they are not the same thing. You need active Georgia Medicaid to use GAPP. Medicaid is the insurance; GAPP is a specific benefit within Medicaid that covers home nursing for qualifying children.',
  },
  {
    question: 'Who qualifies for GAPP in Georgia?',
    answer: 'Children under 21 with active Georgia Medicaid who have medical conditions requiring skilled nursing care at home. This includes children with trachs, ventilators, feeding tubes, or other conditions that need regular nursing intervention. A physician must document the medical necessity.',
  },
  {
    question: 'How is GAPP different from the Katie Beckett waiver?',
    answer: 'GAPP provides direct home nursing services. The Katie Beckett waiver (also called TEFRA) helps children qualify for Medicaid based on their own medical needs rather than family income. Some families use Katie Beckett to get Medicaid, then use GAPP for home nursing. They solve different problems.',
  },
  {
    question: 'How do I apply for GAPP?',
    answer: 'You do not apply to GAPP directly. Instead, you contact a GAPP provider agency, your child\'s doctor writes a medical order for home nursing, and the agency submits a prior authorization request to the state. The agency handles the paperwork.',
  },
  {
    question: 'Does GAPP cover personal care services?',
    answer: 'Yes. GAPP covers three types of services: Registered Nursing (RN), Licensed Practical Nursing (LPN), and Personal Care Services (PCS). PCS covers help with daily activities like bathing, feeding, and mobility for children who need it.',
  },
  {
    question: 'Can I choose which GAPP provider agency to use?',
    answer: 'Yes. You can choose any Medicaid-enrolled GAPP provider that covers your county and has staff available. Not all agencies serve every county, so check coverage area and current availability before choosing.',
  },
]

export default function WhatDoesGappStandForContent() {
  return (
    <>
      <FAQPageSchema faqs={faqs} />

      <p className="text-lg text-gray-700 mb-6">
        GAPP stands for Georgia Pediatric Program. It&apos;s the state&apos;s way of getting home nursing care to kids who need it, paid for by Medicaid. If your child has a medical condition that requires skilled nursing at home, GAPP is the program that makes it happen.
      </p>

      <p className="text-gray-700 mb-6">
        But knowing the acronym is the easy part. Here&apos;s how the program actually works, who qualifies, and what you need to do to get started.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
        What GAPP actually does
      </h2>

      <p className="text-gray-700 mb-4">
        GAPP pays for nurses and personal care aides to come to your home and take care of your child. This includes RNs for things like trach care, ventilator management, and IV medications. LPNs for medication administration and tube feeds. And personal care aides for bathing, feeding, and daily activities.
      </p>

      <p className="text-gray-700 mb-6">
        The goal is to keep your child at home instead of in a hospital or nursing facility. If your kid can be safely cared for at home with nursing support, GAPP covers it. Read more about <Link href="/gapp-services-explained" className="text-primary hover:underline">what each GAPP service type covers</Link>.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
        Who qualifies
      </h2>

      <p className="text-gray-700 mb-4">
        Three things need to be true:
      </p>

      <ol className="list-decimal pl-6 text-gray-700 mb-6 space-y-2">
        <li>Your child is under 21</li>
        <li>Your child has active Georgia Medicaid (not pending, active)</li>
        <li>A doctor has documented that your child needs skilled nursing care at home</li>
      </ol>

      <p className="text-gray-700 mb-6">
        Not sure about your child? Our <Link href="/screener" className="text-primary hover:underline">eligibility screener</Link> walks you through it in about two minutes.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
        How GAPP is different from other programs
      </h2>

      <p className="text-gray-700 mb-4">
        Georgia has several programs with overlapping names. Here&apos;s the quick version:
      </p>

      <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
        <li><strong>GAPP</strong> = home nursing for kids. The program this site is about.</li>
        <li><strong>Katie Beckett / TEFRA</strong> = a way to get Medicaid for your child based on their disability, regardless of family income. <Link href="/katie-beckett-waiver-georgia" className="text-primary hover:underline">Full Katie Beckett breakdown here</Link>.</li>
        <li><strong>CCSP</strong> = Community Care Services Program, for elderly adults. Not for kids. <Link href="/gapp-vs-ccsp" className="text-primary hover:underline">GAPP vs. CCSP comparison</Link>.</li>
        <li><strong>NOW/COMP waivers</strong> = for individuals with intellectual and developmental disabilities. Different eligibility, different services.</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
        How to get started with GAPP
      </h2>

      <p className="text-gray-700 mb-4">
        You don&apos;t apply to GAPP directly. Instead:
      </p>

      <ol className="list-decimal pl-6 text-gray-700 mb-6 space-y-2">
        <li>Make sure your child has active Georgia Medicaid</li>
        <li>Get a physician order documenting that your child needs skilled nursing at home</li>
        <li>Contact a GAPP provider agency that serves your county</li>
        <li>The agency submits a prior authorization to the state on your behalf</li>
      </ol>

      <p className="text-gray-700 mb-6">
        The whole process takes 2-6 weeks once your Medicaid is active. Read the full step-by-step in our <Link href="/gapp-approval-guide" className="text-primary hover:underline">GAPP approval guide</Link>, or <Link href="/how-to-apply-for-gapp" className="text-primary hover:underline">how to apply for GAPP</Link>.
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
        Find a provider in your county
      </h2>

      <p className="text-gray-700">
        Ready to get started? <Link href="/directory" className="text-primary hover:underline">Search the provider directory</Link> for GAPP agencies in your county. Filter by service type (RN, LPN, or PCS) and check which ones are accepting new patients right now.
      </p>
    </>
  )
}
