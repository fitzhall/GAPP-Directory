import { publicFactLines, type PublicFacts as Facts } from '@/lib/public-facts'

// "Public record" on a provider page: facts we pulled from public records,
// not words the agency wrote. Renders nothing when nothing is known.
export function PublicFacts({ facts }: { facts: Facts }) {
  const lines = publicFactLines(facts)
  if (lines.length === 0) return null
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Public record</h2>
      <ul className="space-y-2">
        {lines.map(line => (
          <li key={line} className="flex items-start gap-3 text-gray-700">
            <span className="text-accent font-bold mt-0.5" aria-hidden>•</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-500 mt-3">
        From the national provider registry and the Georgia Department of Community Health. We checked these. The agency did not write them.
      </p>
    </section>
  )
}
