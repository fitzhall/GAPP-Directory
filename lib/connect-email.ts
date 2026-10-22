import { Resend } from 'resend'
import { escapeHtml } from '@/lib/lead-email'
import { formatPhoneDisplay } from '@/lib/connect'

// One email to the operator per connect-line call, after the agency leg ends.

export type ConnectCallSummary = {
  from: string | null
  agencyName: string | null
  agencySlug: string | null
  dialStatus: string | null
  durationSeconds: number | null
  fellBack: boolean
  forwardedTo: 'agency' | 'operator'
}

export function connectCallSubject(c: ConnectCallSummary): string {
  const who = c.from ? formatPhoneDisplay(c.from) : 'unknown number'
  if (c.forwardedTo === 'operator' && !c.agencyName) return `Connect line: ${who} called with no listing live`
  const outcome = c.fellBack ? 'no answer, sent to helpline' : `${c.dialStatus || 'unknown'}${c.durationSeconds ? `, ${c.durationSeconds}s` : ''}`
  return `Connect line: ${who} → ${c.agencyName} (${outcome})`
}

export function connectCallHtml(c: ConnectCallSummary, siteUrl: string): string {
  const who = c.from ? formatPhoneDisplay(c.from) : 'unknown number'
  const tel = c.from ? `<a href="tel:${escapeHtml(c.from)}">${escapeHtml(who)}</a>` : escapeHtml(who)
  const agency = c.agencyName
    ? `<a href="${siteUrl}/provider/${escapeHtml(c.agencySlug || '')}">${escapeHtml(c.agencyName)}</a>`
    : 'no listing was live on that number'
  const outcome = c.fellBack
    ? 'The agency did not pick up. The caller was sent to the helpline.'
    : `Outcome: ${escapeHtml(c.dialStatus || 'unknown')}${c.durationSeconds ? ` after ${c.durationSeconds} seconds` : ''}.`
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px">
      <h2 style="margin:0 0 12px">Call through the connect line</h2>
      <p><strong>Caller:</strong> ${tel}</p>
      <p><strong>Agency:</strong> ${agency}</p>
      <p>${outcome}</p>
      <p style="color:#666;font-size:13px">Call the family back if the agency did not answer. This is a lead you own.</p>
    </div>`
}

export async function sendConnectCallEmail(c: ConnectCallSummary): Promise<boolean> {
  const to = process.env.LEAD_NOTIFY_EMAIL
  if (!process.env.RESEND_API_KEY || !to) return false
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'GeorgiaGAPP.com <leads@georgiagapp.com>',
      to,
      subject: connectCallSubject(c),
      html: connectCallHtml(c, 'https://www.georgiagapp.com'),
    })
    return true
  } catch (err) {
    console.error('Error sending connect call email:', err)
    return false
  }
}
