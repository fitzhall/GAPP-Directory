'use client'

import { useState } from 'react'
import Link from 'next/link'
import { config } from '@/lib/config'
import { GEORGIA_COUNTY_NAMES, SERVICE_OPTIONS, type ServiceNeeded } from '@/lib/match-lead'

interface MatchFormProps {
  county?: string
  sourcePage: string
}

const SERVICE_LABELS: Record<ServiceNeeded, string> = {
  RN: 'A nurse (RN)',
  LPN: 'A nurse (LPN)',
  PCS: 'Help with daily care (PCS)',
  not_sure: "I'm not sure yet",
}

export function MatchForm({ county, sourcePage }: MatchFormProps) {
  const [form, setForm] = useState({
    parentName: '',
    phone: '',
    county: county && GEORGIA_COUNTY_NAMES.includes(county) ? county : '',
    serviceNeeded: '' as ServiceNeeded | '',
    notes: '',
    smsConsent: false,
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, sourcePage }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrorMessage(data.error || 'Something went wrong. Please call us.')
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setErrorMessage('Something went wrong. Please call us.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Got it</h3>
        <p className="text-gray-700">
          We will call or text you within one business day.
          Faster: call us now at{' '}
          <a href={`tel:${config.contact.phoneRaw}`} className="text-primary font-semibold">{config.contact.phone}</a>.
        </p>
      </div>
    )
  }

  const input = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base'

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="mf-name" className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
          <input id="mf-name" type="text" required autoComplete="name" className={input}
            value={form.parentName} onChange={e => setForm(f => ({ ...f, parentName: e.target.value }))} />
        </div>
        <div>
          <label htmlFor="mf-phone" className="block text-sm font-medium text-gray-700 mb-1">Your phone</label>
          <input id="mf-phone" type="tel" required autoComplete="tel" inputMode="tel" className={input}
            value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        </div>
        <div>
          <label htmlFor="mf-county" className="block text-sm font-medium text-gray-700 mb-1">Your county</label>
          <select id="mf-county" required className={input}
            value={form.county} onChange={e => setForm(f => ({ ...f, county: e.target.value }))}>
            <option value="">Pick a county</option>
            {GEORGIA_COUNTY_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="mf-service" className="block text-sm font-medium text-gray-700 mb-1">What do you need?</label>
          <select id="mf-service" required className={input}
            value={form.serviceNeeded} onChange={e => setForm(f => ({ ...f, serviceNeeded: e.target.value as ServiceNeeded }))}>
            <option value="">Pick one</option>
            {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{SERVICE_LABELS[s]}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="mf-notes" className="block text-sm font-medium text-gray-700 mb-1">Anything we should know? (optional)</label>
        <textarea id="mf-notes" rows={2} className={input} placeholder="Nights, weekends, a trach, a vent..."
          value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" required checked={form.smsConsent}
            onChange={e => setForm(f => ({ ...f, smsConsent: e.target.checked }))}
            className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary flex-shrink-0" />
          <span className="text-xs text-gray-600 leading-relaxed">
            I agree to receive calls, text messages, and emails from GeorgiaGAPP.com at the phone number I
            provided, about my request. Message &amp; data rates may apply. Message frequency varies.
            Reply <strong>STOP</strong> to opt out, or <strong>HELP</strong> for help. See our{' '}
            <Link href="/privacy" target="_blank" className="text-primary underline">Privacy Policy</Link> and{' '}
            <Link href="/terms" target="_blank" className="text-primary underline">Terms</Link>.
            <span className="block mt-1 text-gray-500">We do not share your phone number with anyone for marketing.</span>
          </span>
        </label>
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600" role="alert">{errorMessage}</p>
      )}

      <button type="submit" disabled={status === 'submitting'}
        className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60">
        {status === 'submitting' ? 'Sending...' : 'Match me with a provider'}
      </button>
    </form>
  )
}
