import { Metadata } from 'next'
import { config } from '@/lib/config'
import { BreadcrumbSchema } from '@/components/JsonLd'
import { MatchForm } from '@/components/MatchForm'

export const metadata: Metadata = {
  title: 'Get Matched With a GAPP Provider in Georgia | Free',
  description:
    'Tell us your county and what your child needs. We find a GAPP nurse or care agency that has room and call you back. Free. Or call us now.',
  alternates: {
    canonical: 'https://www.georgiagapp.com/match',
  },
  openGraph: {
    title: 'Get Matched With a GAPP Provider',
    description: 'Tell us what your child needs. We find an agency with room and call you back. Free.',
    type: 'website',
  },
}

const STEPS = [
  { title: 'You tell us', body: 'Your county and the kind of care your child needs.' },
  { title: 'We call around', body: 'We find GAPP agencies near you that have staff open now.' },
  { title: 'We call you back', body: 'We call or text you within one business day.' },
]

export default function MatchPage() {
  const tel = `tel:${config.contact.phoneRaw}`
  const sms = `sms:${config.contact.phoneRaw}`
  const btn = 'flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold rounded-xl transition-colors'

  return (
    <div className="min-h-screen bg-white">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Get matched', url: 'https://www.georgiagapp.com/match' },
        ]}
      />

      <section className="bg-gradient-to-b from-warm/30 to-white pt-10 pb-8 sm:pt-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Get matched with a GAPP provider
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Calling agency after agency is hard. Many say they are full. Tell us what your child
            needs and we will find one that has room. It&apos;s free.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={tel} className={`${btn} bg-primary text-white hover:bg-primary-dark`}>
              Call {config.contact.phone}
            </a>
            <a href={sms} className={`${btn} border-2 border-primary text-primary hover:bg-primary/10`}>
              Text us
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-3">A real person answers.</p>
        </div>
      </section>

      <section className="px-4 pb-12">
        <div className="max-w-xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy mb-1 text-center">Or send us your info</h2>
            <p className="text-gray-600 mb-6 text-center">We&apos;ll call or text you back.</p>
            <MatchForm sourcePage="/match" />
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-navy mb-6 text-center">How it works</h2>
          <ol className="grid sm:grid-cols-3 gap-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="bg-gray-50 rounded-xl p-5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold mb-3">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-navy mb-1">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="text-sm text-gray-500 mt-8 text-center">
            GeorgiaGAPP.com is not part of the State of Georgia. We help families find GAPP agencies.
            We never charge families.
          </p>
        </div>
      </section>
    </div>
  )
}
