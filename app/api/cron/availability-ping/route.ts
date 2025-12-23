import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { randomBytes } from 'crypto'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

function generateToken(): string {
  return randomBytes(32).toString('hex')
}

// Verify this is a legitimate cron request (Vercel sends a secret)
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  if (!process.env.CRON_SECRET) return true // Allow if no secret configured
  return authHeader === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()
  const resend = getResend()

  if (!resend) {
    console.error('Resend not configured')
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
  }

  try {
    // Get all verified providers with email
    const { data: providers, error: fetchError } = await supabase
      .from('providers')
      .select('id, name, email')
      .eq('is_active', true)
      .eq('is_verified', true)
      .not('email', 'is', null)

    if (fetchError) {
      console.error('Error fetching providers:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 })
    }

    if (!providers || providers.length === 0) {
      return NextResponse.json({ message: 'No verified providers to ping', sent: 0 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://georgiagapp.com'
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

    let sent = 0
    let failed = 0

    for (const provider of providers) {
      try {
        // Generate unique token
        const token = generateToken()

        // Store token in database
        const { error: tokenError } = await supabase
          .from('availability_tokens')
          .insert({
            provider_id: provider.id,
            token,
            expires_at: expiresAt.toISOString(),
          })

        if (tokenError) {
          console.error(`Error creating token for ${provider.name}:`, tokenError)
          failed++
          continue
        }

        // Update last ping sent timestamp
        await supabase
          .from('providers')
          .update({ last_ping_sent_at: now.toISOString() })
          .eq('id', provider.id)

        // Build email URLs
        const availableUrl = `${baseUrl}/availability/${token}?response=available`
        const notAvailableUrl = `${baseUrl}/availability/${token}?response=not_available`

        // Send email
        await resend.emails.send({
          from: 'GeorgiaGAPP <noreply@georgiagapp.com>',
          to: provider.email,
          subject: 'Quick check: Are you accepting new cases this week?',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="${baseUrl}/logo.png" alt="GeorgiaGAPP" style="height: 50px; width: auto;">
              </div>

              <h2 style="color: #2C3E50; margin-bottom: 10px;">Hi ${provider.name},</h2>

              <p style="font-size: 16px; margin-bottom: 20px;">
                Case managers are looking for providers who can take new GAPP cases this week.
              </p>

              <p style="font-size: 16px; font-weight: 600; margin-bottom: 20px;">
                Are you accepting new cases?
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${availableUrl}"
                   style="display: inline-block; background-color: #22c55e; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin-right: 10px;">
                  Yes, I'm Available
                </a>
                <a href="${notAvailableUrl}"
                   style="display: inline-block; background-color: #e5e7eb; color: #374151; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Not This Week
                </a>
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Clicking "I'm Available" adds you to our case manager search for the week.
                Not responding will hide you from searches until you confirm again.
              </p>

              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

              <p style="font-size: 12px; color: #999; text-align: center;">
                You're receiving this because you're a verified provider on GeorgiaGAPP.com.<br>
                We send availability checks every Monday.
              </p>
            </body>
            </html>
          `,
        })

        sent++
      } catch (emailError) {
        console.error(`Error sending to ${provider.email}:`, emailError)
        failed++
      }
    }

    // Reset availability for providers who didn't respond to last week's ping
    // (More than 7 days since last availability update)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    await supabase
      .from('providers')
      .update({ is_available: false })
      .eq('is_verified', true)
      .lt('availability_updated_at', sevenDaysAgo.toISOString())

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: providers.length,
      message: `Sent ${sent} availability pings, ${failed} failed`,
    })
  } catch (error) {
    console.error('Error in availability ping cron:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Also allow POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}
