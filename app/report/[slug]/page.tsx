import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { verifyReportToken } from '@/lib/report-token'
import { getReportData, type ReportData } from '@/lib/report-data'
import { config } from '@/lib/config'

// A private, signed page the operator texts to a provider during a sales
// call. Not linked from anywhere, not indexed, rendered fresh on every hit.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Your GeorgiaGAPP listing report',
  robots: { index: false, follow: false },
}

type Props = { params: { slug: string }; searchParams: { t?: string } }

function Stat({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
      {note && <p className="text-xs text-gray-500 mt-2">{note}</p>}
    </div>
  )
}

function missingList(d: ReportData): string[] {
  const items: string[] = []
  if (!d.provider.isClaimed) items.push('Your phone number is not shown. Families who find you cannot call you.')
  if (!d.provider.isVerified) items.push('No callback form. Families who do not call leave without a trace.')
  if (!d.provider.isVerified || !d.provider.hasWebsite) items.push('No link to your website.')
  if (!d.provider.isFeatured) items.push('Not first in your county results. Featured listings are.')
  return items
}

export default async function ReportPage({ params, searchParams }: Props) {
  if (!verifyReportToken(params.slug, searchParams.t)) notFound()
  const d = await getReportData(params.slug)
  if (!d) notFound()

  const reached = d.you.helplineClicks + d.you.leads
  const sinceText = new Date(d.since).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const missing = missingList(d)
  const peerScope = d.peers.scope === 'counties'
    ? `${d.peers.count} verified listings that serve your counties`
    : `${d.peers.count} verified listings across Georgia (too few in your counties to compare)`

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 print:bg-white">
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <p className="text-sm text-gray-500">GeorgiaGAPP.com listing report</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{d.provider.name}</h1>
          <p className="text-gray-600 mt-1">
            {d.provider.city && `${d.provider.city} · `}Last {d.days} days, since {sinceText}
          </p>
        </header>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">What families did on your listing</h2>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Profile views" value={d.you.views} />
            <Stat label="Times shown in search results" value={d.you.impressions} />
            <Stat
              label="Phone taps"
              value={d.you.phoneClicks}
              note={!d.provider.isClaimed ? 'Zero, because your number is not shown.' : undefined}
            />
            <Stat
              label="Families who tried to reach you through us"
              value={reached}
              note={reached > 0 ? 'They tapped our helpline from your page or asked us for a match.' : undefined}
            />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Verified listings near you</h2>
          <p className="text-sm text-gray-500 mb-3">Typical numbers for {peerScope}, same {d.days} days.</p>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-4 py-2 font-medium"> </th>
                  <th className="text-right px-4 py-2 font-medium">You</th>
                  <th className="text-right px-4 py-2 font-medium">Verified listing</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3">Profile views</td>
                  <td className="px-4 py-3 text-right font-semibold">{d.you.views}</td>
                  <td className="px-4 py-3 text-right">{d.peers.views}</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3">Phone taps</td>
                  <td className="px-4 py-3 text-right font-semibold">{d.you.phoneClicks}</td>
                  <td className="px-4 py-3 text-right">{d.peers.phoneClicks}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {missing.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">What your listing is missing</h2>
            <ul className="space-y-2">
              {missing.map(m => (
                <li key={m} className="flex gap-3 bg-white rounded-lg border border-gray-200 px-4 py-3 text-gray-800">
                  <span className="text-primary font-bold">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="bg-navy text-white rounded-2xl p-6 text-center print:hidden">
          {!d.provider.isClaimed ? (
            <>
              <h2 className="text-xl font-bold mb-2">Claim your listing. It is free.</h2>
              <p className="text-white/80 mb-4">Claiming turns your phone number on the same day.</p>
              <Link href={`/claim/${d.provider.slug}`} className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg">
                Claim this listing
              </Link>
            </>
          ) : d.provider.isVerified && d.provider.isFeatured ? (
            <>
              <h2 className="text-xl font-bold mb-2">You have everything turned on.</h2>
              <p className="text-white/80 mb-4">Questions about your numbers? Call or text us.</p>
              <a href={`tel:${config.contact.phoneRaw}`} className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg">
                {config.contact.phone}
              </a>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2">
                {d.provider.isVerified ? 'Want the top spot in your counties?' : 'Want the callback form and the top spot?'}
              </h2>
              <p className="text-white/80 mb-4">Call or text us and we will turn it on today.</p>
              <a href={`tel:${config.contact.phoneRaw}`} className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg">
                {config.contact.phone}
              </a>
            </>
          )}
        </section>

        <p className="text-xs text-gray-400 text-center">
          Counts come from GeorgiaGAPP.com visitor activity. Search impressions are directory listings shown, not Google.
        </p>
      </div>
    </main>
  )
}
