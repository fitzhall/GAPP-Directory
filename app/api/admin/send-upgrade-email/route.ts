import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Whop checkout URLs
const WHOP_VERIFIED_URL = 'https://whop.com/bitcoin-estate-commission-inc/verfied-tier/'
const WHOP_PREMIUM_URL = 'https://whop.com/bitcoin-estate-commission-inc/premium-listing/'

export async function POST(request: NextRequest) {
  try {
    const { providerName, providerEmail } = await request.json()

    if (!providerEmail) {
      return NextResponse.json({ error: 'Provider email is required' }, { status: 400 })
    }

    // Send upgrade email via Resend
    const { data, error } = await resend.emails.send({
      from: 'GeorgiaGAPP <noreply@georgiagapp.com>',
      to: providerEmail,
      subject: `Upgrade Your Listing - ${providerName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #FF8A80; margin: 0;">GeorgiaGAPP</h1>
            <p style="color: #666; margin: 5px 0;">Provider Directory</p>
          </div>

          <p>Hi there,</p>

          <p>Thank you for claiming your profile for <strong>${providerName}</strong> on GeorgiaGAPP.com!</p>

          <p>To get the most out of your listing, consider upgrading to one of our verified tiers:</p>

          <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Verified Provider - $127/quarter</h3>
            <ul style="margin: 0 0 15px 0; padding-left: 20px; color: #555;">
              <li>Appear in case manager searches</li>
              <li>Show "Verified" badge on your listing</li>
              <li>Receive callback requests from families</li>
              <li>Full profile with contact info displayed</li>
            </ul>
            <a href="${WHOP_VERIFIED_URL}" style="display: inline-block; background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Upgrade to Verified →
            </a>
          </div>

          <div style="background: linear-gradient(135deg, #f5f3ff 0%, #fdf4ff 100%); border-radius: 12px; padding: 20px; margin: 25px 0; border: 1px solid #e9d5ff;">
            <h3 style="margin: 0 0 15px 0; color: #7c3aed;">Premium Provider - $387/quarter</h3>
            <ul style="margin: 0 0 15px 0; padding-left: 20px; color: #555;">
              <li>Everything in Verified, plus:</li>
              <li>Featured placement at top of search results</li>
              <li>Priority in case manager recommendations</li>
              <li>"Featured Provider" badge</li>
            </ul>
            <a href="${WHOP_PREMIUM_URL}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Upgrade to Premium →
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            Billed quarterly. Cancel anytime. Your profile will be verified within 24 hours of payment.
          </p>

          <p>Questions? Just reply to this email.</p>

          <p>Best,<br>The GeorgiaGAPP Team</p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            GeorgiaGAPP.com - Connecting families with GAPP providers across Georgia
          </p>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, messageId: data?.id })
  } catch (error) {
    console.error('Error sending upgrade email:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
