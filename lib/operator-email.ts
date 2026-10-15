// The email the operator (LEAD_NOTIFY_EMAIL) gets when a family asks the
// site to match them, with no provider attached yet.
import { Resend } from 'resend'
import { escapeHtml, telHref } from '@/lib/lead-email'
import type { MatchLead } from '@/lib/match-lead'

const SERVICE_TEXT: Record<string, string> = {
  RN: 'Nursing (RN)',
  LPN: 'Nursing (LPN)',
  PCS: 'Personal Care Services',
  not_sure: 'Not sure yet',
}

// Canonical host for links in the email; never the environment's base URL,
// which differs between local, preview and production.
export const SITE_URL = 'https://www.georgiagapp.com'

export function operatorLeadEmailSubject(lead: MatchLead): string {
  return `Match lead: ${lead.parentName}, ${lead.county}, ${SERVICE_TEXT[lead.serviceNeeded] || lead.serviceNeeded}`
}

export function operatorLeadEmailHtml(lead: MatchLead, source: 'match_form' | 'phone', adminUrl: string): string {
  const e = escapeHtml
  const sourceUrl = `${SITE_URL}${lead.sourcePage}`
  const row = (label: string, value: string) => `
      <tr>
        <td style="padding: 6px 0; color: #666; width: 120px; vertical-align: top;">${label}</td>
        <td style="padding: 6px 0; color: #333;">${value}</td>
      </tr>`
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2C3E50; padding: 16px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 20px;">A family needs a match</h1>
      </div>
      <div style="padding: 24px; background: #f9f9f9;">
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; padding: 12px;">
          ${row('Name', `<strong>${e(lead.parentName)}</strong>`)}
          ${row('Phone', `<a href="${e(telHref(lead.phone))}" style="color: #FF8A80; font-weight: bold;">${e(lead.phone)}</a>`)}
          ${row('County', e(lead.county))}
          ${row('Needs', e(SERVICE_TEXT[lead.serviceNeeded] || lead.serviceNeeded))}
          ${lead.notes ? row('Notes', e(lead.notes)) : ''}
          ${row('Came from', source === 'phone' ? 'Phone call (logged by admin)' : `<a href="${e(sourceUrl)}" style="color: #2C3E50;">${e(lead.sourcePage)}</a>`)}
        </table>
        <div style="text-align: center; margin-top: 24px;">
          <a href="${e(telHref(lead.phone))}" style="display: inline-block; background: #FF8A80; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">Call ${e(lead.parentName)}</a>
          <br><br>
          <a href="${e(adminUrl)}" style="color: #2C3E50;">Open in admin to assign a provider</a>
        </div>
      </div>
    </div>`
}

/** Returns false (and logs) when LEAD_NOTIFY_EMAIL or Resend is missing or the send fails. */
export async function sendOperatorLeadEmail(lead: MatchLead, source: 'match_form' | 'phone'): Promise<boolean> {
  const to = process.env.LEAD_NOTIFY_EMAIL
  if (!to || !process.env.RESEND_API_KEY) {
    console.warn('sendOperatorLeadEmail: LEAD_NOTIFY_EMAIL or RESEND_API_KEY not set; lead saved but not emailed')
    return false
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'GeorgiaGAPP.com <leads@georgiagapp.com>',
      to,
      subject: operatorLeadEmailSubject(lead),
      html: operatorLeadEmailHtml(lead, source, `${SITE_URL}/admin/leads`),
    })
    return true
  } catch (err) {
    console.error('Error sending operator lead email:', err)
    return false
  }
}
