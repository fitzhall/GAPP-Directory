'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { GEORGIA_COUNTIES, formatCountyName } from '@/lib/county-data'

// One line on a guide: pick your county, land on the directory filtered to it.
export function CountyFinder() {
  const router = useRouter()
  const [county, setCounty] = useState('')
  const go = () => {
    if (county) router.push(`/directory?county=${encodeURIComponent(county)}`)
  }
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
      <label htmlFor="county-finder" className="block text-lg font-extrabold text-navy">
        Find GAPP agencies in your county
      </label>
      <p className="text-base text-gray-600 mt-1 mb-3">Pick your county and we show you who serves it.</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          id="county-finder"
          value={county}
          onChange={e => setCounty(e.target.value)}
          className="flex-1 px-4 py-3 text-base rounded-xl border-2 border-gray-300 focus:border-primary focus:outline-none bg-white"
        >
          <option value="">Choose your county</option>
          {GEORGIA_COUNTIES.map(slug => {
            const name = formatCountyName(slug)
            return <option key={slug} value={name}>{name}</option>
          })}
        </select>
        <button
          type="button"
          onClick={go}
          disabled={!county}
          className="px-6 py-3 text-base font-extrabold rounded-xl bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Show agencies
        </button>
      </div>
    </div>
  )
}
