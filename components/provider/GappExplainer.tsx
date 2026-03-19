interface GappExplainerProps {
  providerName: string
}

export function GappExplainer({ providerName }: GappExplainerProps) {
  return (
    <section className="py-16 sm:py-20 px-6 bg-navy">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs font-bold text-warm uppercase tracking-[2px] mb-2">For families</div>
          <h2 className="text-[32px] font-black text-white">What is the GAPP program?</h2>
        </div>
        <p className="max-w-[700px] mx-auto text-[17px] text-white/80 leading-relaxed text-center">
          The Georgia Pediatric Program (GAPP) is a Medicaid waiver that provides home-based nursing and personal care
          for children with significant medical needs. Instead of a hospital or facility, your child receives care at
          home — from trained nurses and caregivers who come to you. GAPP covers services like skilled nursing (RN and
          LPN) and personal care support, based on your child&apos;s individual care plan. {providerName} is an approved
          GAPP provider ready to help your family.
        </p>
      </div>
    </section>
  )
}
