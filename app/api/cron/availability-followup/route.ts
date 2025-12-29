import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

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

// Verify this is a legitimate cron request
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  if (!process.env.CRON_SECRET) return true
  return authHeader === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()
  const resend = getResend()

  if (!resend) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://georgiagapp.com'
  const now = new Date()

  // Time thresholds
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)

  let warningsSent = 0
  let suspensions = 0

  try {
    // ========================================
    // STEP 1: Send warning emails (24hr mark)
    // ========================================
    // Find verified providers who:
    // - Were pinged more than 24 hours ago
    // - Haven't responded (token not used)
    // - Haven't been warned yet (warning_sent_at is null)
    // - Were pinged less than 48 hours ago (not yet suspension territory)

    const { data: needsWarning, error: warningError } = await supabase
      .from('availability_tokens')
      .select(`
        id,
        token,
        provider_id,
        created_at,
        providers!inner (
          id,
          name,
          email,
          is_verified
        )
      `)
      .is('used_at', null)
      .is('warning_sent_at', null)
      .lt('created_at', twentyFourHoursAgo.toISOString())
      .gt('created_at', fortyEightHoursAgo.toISOString())
      .eq('providers.is_verified', true)

    if (warningError) {
      console.error('Error fetching providers for warning:', warningError)
    } else if (needsWarning && needsWarning.length > 0) {
      for (const token of needsWarning) {
        const provider = token.providers as any
        if (!provider?.email) continue

        try {
          // Build response URLs (same token, still valid)
          const availableUrl = `${baseUrl}/availability/${token.token}?response=available`
          const notAvailableUrl = `${baseUrl}/availability/${token.token}?response=not_available`

          // Send warning email
          await resend.emails.send({
            from: 'GeorgiaGAPP <noreply@georgiagapp.com>',
            to: provider.email,
            subject: '⚠️ Action Required: Confirm your availability to stay verified',
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

                <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                  <p style="margin: 0; color: #92400e; font-weight: 600;">
                    ⚠️ Your verified status will be suspended in 24 hours
                  </p>
                </div>

                <h2 style="color: #2C3E50; margin-bottom: 10px;">Hi ${provider.name},</h2>

                <p style="font-size: 16px; margin-bottom: 20px;">
                  We sent you an availability check yesterday, but we haven't heard back yet.
                </p>

                <p style="font-size: 16px; margin-bottom: 20px;">
                  <strong>To keep your verified status</strong> and stay visible to case managers,
                  please confirm your availability within the next 24 hours.
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

                <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 20px 0;">
                  <p style="margin: 0; color: #991b1b; font-size: 14px;">
                    <strong>What happens if you don't respond:</strong><br>
                    Your verified status will be temporarily suspended. Case managers won't see you in search results
                    until you confirm your availability again.
                  </p>
                </div>

                <p style="font-size: 14px; color: #666;">
                  Even clicking "Not This Week" keeps your verified status active — we just won't show you
                  as available this week. You'll get another check-in next Monday.
                </p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

                <p style="font-size: 12px; color: #999; text-align: center;">
                  Questions? Reply to this email or contact help@georgiagapp.com
                </p>
              </body>
              </html>
            `,
          })

          // Mark warning as sent
          await supabase
            .from('availability_tokens')
            .update({ warning_sent_at: now.toISOString() })
            .eq('id', token.id)

          warningsSent++
        } catch (emailError) {
          console.error(`Error sending warning to ${provider.email}:`, emailError)
        }
      }
    }

    // ========================================
    // STEP 2: Suspend verification (48hr mark)
    // ========================================
    // Find verified providers who:
    // - Were pinged more than 48 hours ago
    // - Were warned (warning_sent_at is not null)
    // - Still haven't responded (token not used)

    const { data: needsSuspension, error: suspensionError } = await supabase
      .from('availability_tokens')
      .select(`
        id,
        provider_id,
        providers!inner (
          id,
          name,
          email,
          is_verified
        )
      `)
      .is('used_at', null)
      .not('warning_sent_at', 'is', null)
      .lt('created_at', fortyEightHoursAgo.toISOString())
      .eq('providers.is_verified', true)

    if (suspensionError) {
      console.error('Error fetching providers for suspension:', suspensionError)
    } else if (needsSuspension && needsSuspension.length > 0) {
      for (const token of needsSuspension) {
        const provider = token.providers as any
        if (!provider?.id) continue

        try {
          // Suspend verification
          await supabase
            .from('providers')
            .update({
              is_verified: false,
              is_available: false,
              verification_suspended_at: now.toISOString(),
            })
            .eq('id', provider.id)

          // Mark token as processed
          await supabase
            .from('availability_tokens')
            .update({ suspension_processed_at: now.toISOString() })
            .eq('id', token.id)

          // Send suspension notification
          if (provider.email) {
            await resend.emails.send({
              from: 'GeorgiaGAPP <noreply@georgiagapp.com>',
              to: provider.email,
              subject: 'Your verified status has been suspended',
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
                    Your verified provider status on GeorgiaGAPP has been temporarily suspended
                    because we didn't receive a response to our availability checks.
                  </p>

                  <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0; color: #1e293b;">What this means:</h3>
                    <ul style="color: #475569; padding-left: 20px;">
                      <li>You won't appear in case manager searches</li>
                      <li>Families won't see the verified badge on your profile</li>
                      <li>You won't receive callback requests</li>
                    </ul>
                  </div>

                  <h3 style="color: #1e293b;">How to get reinstated:</h3>
                  <p style="font-size: 16px; margin-bottom: 20px;">
                    Simply reply to this email or contact us at
                    <a href="mailto:help@georgiagapp.com" style="color: #3b82f6;">help@georgiagapp.com</a>
                    to confirm you're still an active GAPP provider. We'll reinstate your verified
                    status right away.
                  </p>

                  <p style="font-size: 14px; color: #666; margin-top: 30px;">
                    We do these weekly check-ins to ensure families and case managers only see
                    providers who are actively available. It helps everyone find care faster.
                  </p>

                  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

                  <p style="font-size: 12px; color: #999; text-align: center;">
                    GeorgiaGAPP.com - Connecting families with quality GAPP providers
                  </p>
                </body>
                </html>
              `,
            })
          }

          suspensions++
        } catch (suspendError) {
          console.error(`Error suspending ${provider.name}:`, suspendError)
        }
      }
    }

    return NextResponse.json({
      success: true,
      warningsSent,
      suspensions,
      message: `Sent ${warningsSent} warnings, suspended ${suspensions} providers`,
    })
  } catch (error) {
    console.error('Error in availability followup cron:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
