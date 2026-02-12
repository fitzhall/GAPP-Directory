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
          claimed_by_email,
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
        const recipientEmail = provider?.claimed_by_email || provider?.email
        if (!recipientEmail) continue

        try {
          // Build response URLs (same token, still valid)
          const availableUrl = `${baseUrl}/availability/${token.token}?response=available`
          const notAvailableUrl = `${baseUrl}/availability/${token.token}?response=not_available`

          // Send warning email
          await resend.emails.send({
            from: 'GeorgiaGAPP <noreply@georgiagapp.com>',
            to: recipientEmail,
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
          console.error(`Error sending warning to ${recipientEmail}:`, emailError)
        }
      }
    }

    // ========================================
    // STEP 2: Soft suspend (48hr mark)
    // ========================================
    // Find verified providers who:
    // - Were pinged more than 48 hours ago
    // - Were warned (warning_sent_at is not null)
    // - Still haven't responded (token not used)
    // - NOT already processed (suspension_processed_at is null)
    //
    // IMPORTANT: We do NOT remove is_verified. Provider stays verified
    // so they keep getting weekly pings and can self-recover.
    // We only set is_available = false to hide them from case manager searches.

    const { data: needsSuspension, error: suspensionError } = await supabase
      .from('availability_tokens')
      .select(`
        id,
        provider_id,
        providers!inner (
          id,
          name,
          email,
          claimed_by_email,
          is_verified,
          is_featured
        )
      `)
      .is('used_at', null)
      .is('suspension_processed_at', null)
      .not('warning_sent_at', 'is', null)
      .lt('created_at', fortyEightHoursAgo.toISOString())
      .eq('providers.is_verified', true)

    const suspendedProviders: { name: string; email: string; isFeatured: boolean }[] = []

    if (suspensionError) {
      console.error('Error fetching providers for suspension:', suspensionError)
    } else if (needsSuspension && needsSuspension.length > 0) {
      for (const token of needsSuspension) {
        const provider = token.providers as any
        if (!provider?.id) continue

        const recipientEmail = provider.claimed_by_email || provider.email

        try {
          // Soft suspend: hide from searches but keep verified status
          await supabase
            .from('providers')
            .update({
              is_available: false,
              accepting_new_patients: false,
              missed_checkin_at: now.toISOString(),
            })
            .eq('id', provider.id)

          // Mark token as processed
          await supabase
            .from('availability_tokens')
            .update({ suspension_processed_at: now.toISOString() })
            .eq('id', token.id)

          // Send suspension notification to provider
          if (recipientEmail) {
            await resend.emails.send({
              from: 'GeorgiaGAPP <noreply@georgiagapp.com>',
              to: recipientEmail,
              subject: 'You\'ve been hidden from case manager searches',
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
                    Because we didn't hear back on your weekly availability check,
                    your listing has been temporarily hidden from case manager searches.
                  </p>

                  <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0; color: #1e293b;">What this means:</h3>
                    <ul style="color: #475569; padding-left: 20px;">
                      <li>Case managers won't see you in search results this week</li>
                      <li>You're still a verified provider — your badge is intact</li>
                      <li>You'll get another check-in next Monday</li>
                    </ul>
                  </div>

                  <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0; color: #166534;">How to get back in searches:</h3>
                    <p style="color: #166534; margin: 0;">
                      Just respond to next Monday's availability email and you'll be
                      back in case manager searches immediately. That's it — one click.
                    </p>
                  </div>

                  <p style="font-size: 14px; color: #666; margin-top: 30px;">
                    We do these weekly check-ins so case managers know which providers
                    are actively taking new cases. It keeps the directory useful for everyone.
                  </p>

                  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

                  <p style="font-size: 12px; color: #999; text-align: center;">
                    Questions? Reply to this email or contact help@georgiagapp.com
                  </p>
                </body>
                </html>
              `,
            })
          }

          suspendedProviders.push({
            name: provider.name,
            email: recipientEmail || 'no email',
            isFeatured: provider.is_featured || false,
          })
          suspensions++
        } catch (suspendError) {
          console.error(`Error suspending ${provider.name}:`, suspendError)
        }
      }
    }

    // ========================================
    // STEP 3: Notify admin of suspensions
    // ========================================
    if (suspendedProviders.length > 0) {
      const adminEmail = 'help@georgiagapp.com'
      try {
        const providerRows = suspendedProviders
          .map(p => `
            <tr>
              <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${p.name}</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${p.email}</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${p.isFeatured ? 'Premium' : 'Verified'}</td>
            </tr>
          `).join('')

        await resend.emails.send({
          from: 'GeorgiaGAPP System <noreply@georgiagapp.com>',
          to: adminEmail,
          subject: `${suspendedProviders.length} provider(s) hidden from searches — missed check-in`,
          html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"></head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2C3E50;">Weekly Check-In Report</h2>

              <p>The following <strong>${suspendedProviders.length}</strong> provider(s) missed their 48-hour check-in window and have been hidden from case manager searches:</p>

              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                  <tr style="background: #f8fafc;">
                    <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Provider</th>
                    <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Email</th>
                    <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Tier</th>
                  </tr>
                </thead>
                <tbody>
                  ${providerRows}
                </tbody>
              </table>

              <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>What happened:</strong> These providers are still verified but hidden from searches.
                  They'll get another ping next Monday and can re-appear by responding.
                  No action needed unless you want to reach out to them directly.
                </p>
              </div>

              <p>
                <a href="https://www.georgiagapp.com/admin" style="color: #3b82f6;">Open Admin Panel</a>
              </p>

              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="font-size: 12px; color: #999;">Automated report from GeorgiaGAPP.com</p>
            </body>
            </html>
          `,
        })
      } catch (adminEmailError) {
        console.error('Error sending admin notification:', adminEmailError)
      }
    }

    return NextResponse.json({
      success: true,
      warningsSent,
      suspensions,
      message: `Sent ${warningsSent} warnings, soft-suspended ${suspensions} providers`,
    })
  } catch (error) {
    console.error('Error in availability followup cron:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
