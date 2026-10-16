import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { verifyReportToken } from '@/lib/report-token'
import { getReportData } from '@/lib/report-data'
import { reportStory, compareSentence, missingAndGains, reachStep } from '@/lib/report-copy'
import { config } from '@/lib/config'

// A private, signed page the operator texts to a provider during a sales
// call. Not linked from anywhere, not indexed, rendered fresh on every hit.
// Written for a home care owner on a phone: one story, plain words, no
// marketing vocabulary.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Your GeorgiaGAPP listing report',
  robots: { index: false, follow: false },
}

type Props = { params: { slug: string }; searchParams: { t?: string } }

function Dot({ tone }: { tone: 'good' | 'bad' | 'neutral' }) {
  const color = tone === 'good' ? 'bg-green-500' : tone === 'bad' ? 'bg-primary-dark' : 'bg-accent-dark'
  return <span className={`inline-block w-3 h-3 rounded-full ${color} shrink-0`} aria-hidden />
}

function Step({ n, tone, value, label, meaning }: { n: number; tone: 'good' | 'bad' | 'neutral'; value: number; label: string; meaning: string }) {
  return (
    <li className="bg-white rounded-2xl border border-gray-200 p-5 flex gap-4 items-start">
      <div className="w-9 h-9 rounded-full bg-navy text-white font-bold flex items-center justify-center shrink-0 text-base">{n}</div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Dot tone={tone} />
          <p className="text-3xl font-extrabold text-navy leading-none">{value.toLocaleString()}</p>
        </div>
        <p className="text-lg font-bold text-navy mt-1">{label}</p>
        <p className="text-base text-gray-600 mt-1">{meaning}</p>
      </div>
    </li>
  )
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 4
  return (
    <div>
      <div className="flex justify-between text-base mb-1">
        <span className="font-bold text-navy">{label}</span>
        <span className="font-extrabold text-navy">{Math.round(value).toLocaleString()} views</span>
      </div>
      <div className="h-6 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default async function ReportPage({ params, searchParams }: Props) {
  if (!verifyReportToken(params.slug, searchParams.t)) notFound()
  const d = await getReportData(params.slug)
  if (!d) notFound()

  const story = reportStory(d)
  const reach = reachStep(d)
  const { missing, gains } = missingAndGains(d.provider)
  const sinceText = new Date(d.since).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const peerLabel = d.peers.scope === 'counties' ? 'Verified agency near you' : 'Verified agency in Georgia'
  const barMax = Math.max(d.you.views, d.peers.views, 1)

  return (
    <main className="min-h-screen bg-gray-50 py-6 px-4 print:bg-white font-sans">
      <div className="max-w-xl mx-auto space-y-10">
        <header className="text-center">
          <p className="text-sm font-bold tracking-wide text-accent-dark uppercase">GeorgiaGAPP.com</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy mt-1">{d.provider.name}</h1>
          <p className="text-base text-gray-600 mt-1">
            {d.provider.city && `${d.provider.city} · `}{sinceText} to today
          </p>
        </header>

        {/* The one thing to take away */}
        <section className="bg-warm-light border-2 border-warm rounded-3xl p-6 sm:p-8 text-center">
          <p className="text-7xl font-extrabold text-primary-dark leading-none">{story.bigNumber.toLocaleString()}</p>
          <p className="text-xl font-bold text-navy mt-3">{story.headline}</p>
          <p className={`text-lg font-extrabold mt-4 rounded-xl px-4 py-3 ${story.tone === 'bad' ? 'bg-primary/15 text-primary-dark' : 'bg-green-100 text-green-800'}`}>
            {story.problem}
          </p>
        </section>

        {/* How a family finds you, in three steps */}
        <section>
          <h2 className="text-xl font-extrabold text-navy mb-1">What those families did</h2>
          <p className="text-base text-gray-600 mb-4">Two steps. The second one is the one that pays.</p>
          <ol className="space-y-3">
            <Step
              n={1}
              tone="neutral"
              value={d.you.views}
              label="Found and opened your listing"
              meaning="A family searching for GAPP care clicked your name to read about you. This is a family who is choosing."
            />
            <Step n={2} tone={reach.tone} value={reach.value} label={reach.label} meaning={reach.meaning} />
          </ol>
        </section>

        {/* You vs. verified */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
          <h2 className="text-xl font-extrabold text-navy mb-4">You next to a verified agency</h2>
          <div className="space-y-4">
            <Bar label="You" value={d.you.views} max={barMax} color="bg-gray-400" />
            <Bar label={peerLabel} value={d.peers.views} max={barMax} color="bg-accent-dark" />
          </div>
          <p className="text-lg font-bold text-navy mt-5">{compareSentence(d.you.views, d.peers.views, d.peers.scope)}</p>
          <p className="text-sm text-gray-500 mt-2">
            Typical numbers for {d.peers.count} verified {d.peers.count === 1 ? 'agency' : 'agencies'}
            {d.peers.scope === 'counties' ? ' that serve your counties' : ' across Georgia'}, same 90 days.
          </p>
        </section>

        {missing.length > 0 && (
          <section className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border-2 border-primary/40 p-5">
              <h2 className="text-lg font-extrabold text-primary-dark mb-3">What turns families away</h2>
              <ul className="space-y-3">
                {missing.map(m => (
                  <li key={m} className="flex gap-3 text-base text-navy">
                    <span className="text-primary-dark font-extrabold text-xl leading-none" aria-hidden>✕</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border-2 border-green-300 p-5">
              <h2 className="text-lg font-extrabold text-green-700 mb-3">What verified agencies have</h2>
              <ul className="space-y-3">
                {gains.map(g => (
                  <li key={g} className="flex gap-3 text-base text-navy">
                    <span className="text-green-600 font-extrabold text-xl leading-none" aria-hidden>✓</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="bg-navy text-white rounded-3xl p-6 sm:p-8 text-center print:hidden">
          {!d.provider.isClaimed ? (
            <>
              <h2 className="text-2xl font-extrabold mb-2">Claim your listing. It is free.</h2>
              <p className="text-lg text-white/85 mb-5">Your phone number turns on the same day.</p>
              <Link href={`/claim/${d.provider.slug}`} className="inline-block w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white text-xl font-extrabold rounded-2xl">
                Claim this listing
              </Link>
              <p className="text-base text-white/70 mt-5">Questions? Call or text {config.contact.phone}</p>
            </>
          ) : d.provider.isVerified && d.provider.isFeatured ? (
            <>
              <h2 className="text-2xl font-extrabold mb-2">You have everything turned on.</h2>
              <p className="text-lg text-white/85 mb-5">Questions about your numbers? Call or text us.</p>
              <a href={`tel:${config.contact.phoneRaw}`} className="inline-block w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white text-xl font-extrabold rounded-2xl">
                {config.contact.phone}
              </a>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-extrabold mb-2">
                {d.provider.isVerified ? 'Want the top spot in your counties?' : 'Want families to reach you?'}
              </h2>
              <p className="text-lg text-white/85 mb-5">Call or text us. We turn it on today.</p>
              <a href={`tel:${config.contact.phoneRaw}`} className="inline-block w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white text-xl font-extrabold rounded-2xl">
                {config.contact.phone}
              </a>
            </>
          )}
        </section>

        <p className="text-sm text-gray-500 text-center leading-relaxed">
          These counts come from visits to GeorgiaGAPP.com over the last {d.days} days. They are not Google numbers.
        </p>
      </div>
    </main>
  )
}
