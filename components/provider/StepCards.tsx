interface StepCardsProps {
  howToStart?: string | null
}

const defaultSteps = [
  { title: 'Call us', desc: "Tell us about your child's needs and current situation" },
  { title: 'We verify', desc: "We'll confirm your GAPP approval and insurance coverage" },
  { title: 'Get matched', desc: 'We match your family with the right caregiver' },
  { title: 'Care begins', desc: 'Care starts in your home, on your schedule' },
]

export function StepCards({ howToStart }: StepCardsProps) {
  return (
    <section className="py-16 sm:py-20 px-6 bg-[#F8FAFB]">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-primary uppercase tracking-[2px] mb-2">Getting started</div>
          <h2 className="text-[32px] font-black text-navy">How it works</h2>
          <p className="text-base text-gray-400 mt-2">From first call to care in your home</p>
        </div>

        {howToStart ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 max-w-2xl mx-auto">
            <p className="text-[17px] text-gray-600 leading-relaxed">{howToStart}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {defaultSteps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-warm rounded-full text-white text-xl font-black flex items-center justify-center mx-auto mb-4">
                  {i + 1}
                </div>
                <h3 className="text-[15px] font-extrabold text-navy mb-1.5">{step.title}</h3>
                <p className="text-[13px] text-gray-400 leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
