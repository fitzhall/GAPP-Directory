import Link from 'next/link'
import { FAQPageSchema } from '@/components/JsonLd'

const faqs = [
  {
    question: 'What is the difference between a home health aide and a GAPP nurse?',
    answer: 'A home health aide helps with daily activities like bathing, dressing, and meal prep. A GAPP nurse (RN or LPN) provides skilled medical care like trach suctioning, ventilator management, medication administration, and tube feeds. The training, licensing, and scope of work are different.',
  },
  {
    question: 'Does GAPP provide home health aides?',
    answer: 'GAPP provides Personal Care Services (PCS) aides, which are similar to home health aides. PCS aides help with daily living activities like bathing, feeding, and mobility. GAPP also provides RN and LPN nursing for children who need skilled medical care.',
  },
  {
    question: 'Can a home health aide do medical procedures for my child?',
    answer: 'No. Home health aides cannot perform medical procedures like trach care, IV medication, or tube feeds. Those require a licensed nurse (RN or LPN). If your child needs medical procedures at home, you need GAPP nursing, not a home health aide.',
  },
  {
    question: 'How do I know if my child needs a nurse or a home health aide?',
    answer: 'If your child needs any medical procedure performed at home (medication through a tube, suctioning, wound care, ventilator checks), they need a nurse. If they only need help with activities like bathing, eating, or getting dressed, a personal care aide may be enough. Your child\'s doctor can help determine this.',
  },
  {
    question: 'Does Medicaid cover home health aides for children in Georgia?',
    answer: 'Yes, through the GAPP program\'s Personal Care Services (PCS) benefit. PCS aides are covered by Medicaid for children who qualify. Your child needs active Georgia Medicaid and a physician order documenting the need for personal care assistance.',
  },
  {
    question: 'Can I have both a GAPP nurse and a personal care aide for my child?',
    answer: 'Yes, if your child\'s medical needs justify both. Some children receive RN or LPN nursing for medical procedures and PCS aide hours for daily living assistance. The authorization depends on what your child\'s doctor documents and what the state approves.',
  },
]

export default function HomeHealthAidesVsGappContent() {
  return (
    <>
      <FAQPageSchema faqs={faqs} />

      <p className="text-lg text-gray-700 mb-6">
        When you search for help caring for a medically fragile child at home, you&apos;ll run into two terms that sound similar but mean very different things: &quot;home health aide&quot; and &quot;home nurse.&quot; The difference matters because it determines what kind of care your child gets, who provides it, and how you pay for it.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
        Home health aides: what they do
      </h2>

      <p className="text-gray-700 mb-4">
        Home health aides help with daily activities. Bathing, dressing, meal prep, light housekeeping, and keeping your child company. They are trained but not licensed nurses. They cannot give medications through a tube, suction a trach, or manage a ventilator.
      </p>

      <p className="text-gray-700 mb-6">
        If your child needs help getting through the day but doesn&apos;t require medical procedures, a home health aide may be the right fit. In GAPP terms, this is called <Link href="/services/personal-care" className="text-primary hover:underline">Personal Care Services (PCS)</Link>.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
        GAPP nurses: what they do
      </h2>

      <p className="text-gray-700 mb-4">
        GAPP nurses are licensed <Link href="/services/rn-nursing" className="text-primary hover:underline">Registered Nurses (RNs)</Link> or <Link href="/services/lpn-services" className="text-primary hover:underline">Licensed Practical Nurses (LPNs)</Link> who perform medical procedures in your home. Trach care, ventilator monitoring, IV medications, seizure management, tube feeds, wound care. Anything that requires clinical training and a nursing license.
      </p>

      <p className="text-gray-700 mb-6">
        If your child has a medical condition that needs hands-on nursing, this is the level of care you need. The nurse comes to your home on a set schedule, and GAPP (through Medicaid) pays for it.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
        Side-by-side comparison
      </h2>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-900 border-b"></th>
              <th className="px-4 py-3 font-semibold text-gray-900 border-b">Home health aide / PCS</th>
              <th className="px-4 py-3 font-semibold text-gray-900 border-b">GAPP nurse (RN/LPN)</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Training</td>
              <td className="px-4 py-3">Certified, not licensed</td>
              <td className="px-4 py-3">Licensed nurse (state board)</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Medical procedures</td>
              <td className="px-4 py-3">No</td>
              <td className="px-4 py-3">Yes</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Medication admin</td>
              <td className="px-4 py-3">Oral reminders only</td>
              <td className="px-4 py-3">All routes including IV and tube</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Trach/vent care</td>
              <td className="px-4 py-3">No</td>
              <td className="px-4 py-3">Yes</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Daily living help</td>
              <td className="px-4 py-3">Yes</td>
              <td className="px-4 py-3">Yes, plus medical care</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Paid by</td>
              <td className="px-4 py-3">Medicaid (GAPP PCS)</td>
              <td className="px-4 py-3">Medicaid (GAPP nursing)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
        How to figure out what your child needs
      </h2>

      <p className="text-gray-700 mb-4">
        Ask yourself one question: does my child need someone to perform medical procedures at home?
      </p>

      <p className="text-gray-700 mb-4">
        If yes, your child needs a GAPP nurse. Talk to your pediatrician about writing a physician order for home nursing. Then find a <Link href="/directory" className="text-primary hover:underline">GAPP provider agency</Link> in your county.
      </p>

      <p className="text-gray-700 mb-6">
        If your child only needs help with daily activities and no medical procedures, PCS might be enough. Your child still needs a doctor&apos;s order and active Medicaid, but the requirements are less intensive. Read the full breakdown in our <Link href="/gapp-services-explained" className="text-primary hover:underline">GAPP services guide</Link>.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
        You can get both
      </h2>

      <p className="text-gray-700 mb-6">
        Some kids qualify for both nursing and PCS. A nurse handles the medical stuff, and a PCS aide helps with bathing, feeding, and daily routines during separate shifts. The authorization depends on what your doctor documents and what the state approves. Your provider agency can help you figure out the right combination.
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
        Find a GAPP provider near you
      </h2>

      <p className="text-gray-700">
        <Link href="/directory" className="text-primary hover:underline">Search our directory</Link> by county to find GAPP agencies that provide nursing, PCS, or both. Check which ones are accepting new patients and request a callback directly from their profile page.
      </p>
    </>
  )
}
