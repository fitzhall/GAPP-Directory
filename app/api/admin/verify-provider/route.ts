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

export async function POST(request: NextRequest) {
  try {
    const { providerId } = await request.json()

    if (!providerId) {
      return NextResponse.json({ error: 'Provider ID required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Get the provider
    const { data: provider, error: fetchError } = await supabase
      .from('providers')
      .select('id, name, email, claimed_by_email, is_verified')
      .eq('id', providerId)
      .single()

    if (fetchError || !provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 })
    }

    if (provider.is_verified) {
      return NextResponse.json({ error: 'Provider already verified' }, { status: 400 })
    }

    // Update provider to verified
    const { error: updateError } = await supabase
      .from('providers')
      .update({
        is_verified: true,
        accepting_new_patients: true,
        verified_at: new Date().toISOString(),
        tier_level: 'verified',
      })
      .eq('id', providerId)

    if (updateError) {
      console.error('Error verifying provider:', updateError)
      return NextResponse.json({ error: 'Failed to verify provider' }, { status: 500 })
    }

    // Send verification confirmation email
    const recipientEmail = provider.claimed_by_email || provider.email
    if (recipientEmail) {
      const resend = getResend()
      if (resend) {
        try {
          await resend.emails.send({
            from: 'GeorgiaGAPP.com <noreply@georgiagapp.com>',
            to: recipientEmail,
            subject: `You're Verified! ${provider.name} is now live`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">✓ You're Verified!</h1>
                </div>

                <div style="padding: 30px; background: #f9f9f9;">
                  <p style="font-size: 18px; color: #333; margin-top: 0;">
                    Great news! <strong>${provider.name}</strong> is now verified on GeorgiaGAPP.com.
                  </p>

                  <div style="background: white; border-radius: 8px; padding: 25px; margin: 20px 0; border-left: 4px solid #10B981;">
                    <h2 style="color: #2C3E50; margin-top: 0; font-size: 18px;">What this means for you:</h2>
                    <ul style="color: #555; line-height: 2; padding-left: 20px;">
                      <li><strong>Case managers can find you</strong> — You now appear in case manager searches when they're placing clients</li>
                      <li><strong>Weekly availability check</strong> — Every Monday, you'll get a quick email asking if you're accepting new cases</li>
                      <li><strong>One-click confirmation</strong> — Just click "Yes" to stay visible to case managers that week</li>
                      <li><strong>Verified badge</strong> — Families see you're a trusted, responsive provider</li>
                    </ul>
                  </div>

                  <div style="background: #FEF3C7; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <p style="color: #92400E; margin: 0; font-size: 14px;">
                      <strong>Important:</strong> Watch for your first availability email on Monday.
                      Responding keeps you visible — not responding for 48 hours temporarily hides you from searches.
                    </p>
                  </div>

                  <p style="color: #666; font-size: 14px;">
                    Questions? Reply to this email or contact us at help@georgiaGAPP.com
                  </p>

                  <div style="text-align: center; margin-top: 30px;">
                    <a href="https://georgiagapp.com/case-managers"
                       style="background: #10B981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                      See How Case Managers Find You
                    </a>
                  </div>

                  <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
                    GeorgiaGAPP.com — Connecting families with GAPP providers
                  </p>
                </div>
              </div>
            `,
          })
        } catch (emailError) {
          console.error('Error sending verification email:', emailError)
          // Don't fail the request if email fails
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Provider verified and notification sent',
    })

  } catch (error) {
    console.error('Verify provider error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
