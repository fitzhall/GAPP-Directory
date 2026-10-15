// The email a provider gets when a family lead is sent to them. Used by
// /api/callback (family filled the provider's own form) and by the admin
// leads.assign op (operator routed a site-owned lead to this provider).
import { Resend } from 'resend'

export type LeadForEmail = {
  parent_name: string
  phone: string
  email: string | null
  zip_code: string
  county: string
  service_needed: string
  urgency: string
  preferred_callback_time: string | null
  special_needs: string | null
}

const SERVICE_TEXT: Record<string, string> = {
  RN: 'Nursing (RN)',
  LPN: 'Nursing (LPN)',
  PCS: 'Personal Care Services',
  not_sure: 'Not sure yet',
}

const URGENCY_TEXT: Record<string, string> = {
  asap: 'AS SOON AS POSSIBLE',
  this_month: 'Within the next month',
  researching: 'Just researching',
}

const CALLBACK_TIME_TEXT: Record<string, string> = {
  morning: 'Morning (8am - 12pm)',
  afternoon: 'Afternoon (12pm - 5pm)',
  evening: 'Evening (5pm - 8pm)',
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function leadEmailSubject(lead: LeadForEmail): string {
  const service = SERVICE_TEXT[lead.service_needed] || lead.service_needed
  return `New Lead: ${lead.parent_name} needs ${service}`
}

export function leadEmailHtml(providerName: string, lead: LeadForEmail): string {
  const e = escapeHtml
  const service = SERVICE_TEXT[lead.service_needed] || lead.service_needed
  const urgency = URGENCY_TEXT[lead.urgency] || lead.urgency
  const callbackTime = CALLBACK_TIME_TEXT[lead.preferred_callback_time || ''] || 'Any time'
  const row = (label: string, value: string, bold = false) => `
                    <tr>
                      <td style="padding: 8px 0; color: #666; width: 140px; vertical-align: top;">${label}</td>
                      <td style="padding: 8px 0; color: #333;${bold ? ' font-weight: bold;' : ''}">${value}</td>
                    </tr>`

  return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #FF8A80; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">New Callback Request</h1>
              </div>

              <div style="padding: 30px; background: #f9f9f9;">
                <p style="font-size: 16px; color: #333;">
                  A family has requested a callback from <strong>${e(providerName)}</strong> through GeorgiaGAPP.com
                </p>

                <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <h2 style="color: #2C3E50; margin-top: 0; border-bottom: 2px solid #FF8A80; padding-bottom: 10px;">
                    Family Information
                  </h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    ${row('Name:', e(lead.parent_name), true)}
                    ${row('Phone:', `<a href="tel:${e(lead.phone)}" style="color: #FF8A80;">${e(lead.phone)}</a>`, true)}
                    ${lead.email ? row('Email:', `<a href="mailto:${e(lead.email)}" style="color: #FF8A80;">${e(lead.email)}</a>`) : ''}
                    ${lead.zip_code ? row('ZIP Code:', e(lead.zip_code)) : ''}
                    ${row('County:', e(lead.county))}
                  </table>
                </div>

                <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <h2 style="color: #2C3E50; margin-top: 0; border-bottom: 2px solid #87CEEB; padding-bottom: 10px;">
                    Care Needs
                  </h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    ${row('Service Needed:', e(service), true)}
                    ${row('Urgency:', `<span style="color: ${lead.urgency === 'asap' ? '#FF8A80' : '#333'}; font-weight: bold;">${e(urgency)}</span>`)}
                    ${row('Best Callback Time:', e(callbackTime))}
                    ${lead.special_needs ? row('Special Notes:', e(lead.special_needs)) : ''}
                  </table>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                  <a href="tel:${e(lead.phone)}"
                     style="display: inline-block; background: #FF8A80; color: white; padding: 15px 40px;
                            text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
                    Call ${e(lead.parent_name)} Now
                  </a>
                </div>

                <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                  This lead was submitted through GeorgiaGAPP.com<br>
                  Please respond promptly to provide the best service.
                </p>
              </div>
            </div>`
}

/** Sends the lead email. Returns false (and logs) instead of throwing. */
export async function sendLeadEmail(to: string, providerName: string, lead: LeadForEmail): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) return false
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'GeorgiaGAPP.com <leads@georgiagapp.com>',
      to,
      subject: leadEmailSubject(lead),
      html: leadEmailHtml(providerName, lead),
    })
    return true
  } catch (err) {
    console.error('Error sending lead email:', err)
    return false
  }
}
