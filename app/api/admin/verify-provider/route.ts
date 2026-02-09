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

    // Update provider to verified (clear any unverified tracking)
    const { error: updateError } = await supabase
      .from('providers')
      .update({
        is_verified: true,
        accepting_new_patients: true,
        verified_at: new Date().toISOString(),
        tier_level: 2, // 0=unclaimed, 1=claimed, 2=verified, 3=premium
        // Clear tracking fields from any previous unverification
        unverified_at: null,
        unverified_reason: null,
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
            subject: `Payment Received - ${provider.name} on GeorgiaGAPP.com`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">Payment Received!</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Thank you for joining GeorgiaGAPP.com</p>
                </div>

                <div style="padding: 30px; background: #f9f9f9;">
                  <p style="font-size: 18px; color: #333; margin-top: 0;">
                    Hi there! We've received your payment for <strong>${provider.name}</strong>.
                  </p>

                  <div style="background: white; border-radius: 8px; padding: 25px; margin: 20px 0; border-left: 4px solid #10B981;">
                    <h2 style="color: #2C3E50; margin-top: 0; font-size: 18px;">What happens next:</h2>
                    <ul style="color: #555; line-height: 2; padding-left: 20px;">
                      <li><strong>Profile update within 24 hours</strong> — Our team will review and activate your full profile within the next business day</li>
                      <li><strong>Verified badge goes live</strong> — Families and case managers will see you as a trusted, verified provider</li>
                      <li><strong>Callback requests enabled</strong> — Families can submit callback requests directly to you through your listing</li>
                    </ul>
                  </div>

                  <div style="background: #EFF6FF; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #3B82F6;">
                    <h3 style="color: #1E40AF; margin: 0 0 10px 0; font-size: 16px;">Weekly Verification Check-In</h3>
                    <p style="color: #1E40AF; margin: 0; font-size: 14px; line-height: 1.6;">
                      Every week, you'll receive a quick check-in email asking if you're still accepting new patients.
                      This is how we keep the directory accurate for families.
                    </p>
                    <ul style="color: #1E40AF; font-size: 14px; margin: 10px 0 0 0; padding-left: 20px; line-height: 1.8;">
                      <li><strong>One click</strong> — Just confirm "Yes, still accepting" to stay visible</li>
                      <li><strong>48-hour window</strong> — You have 48 hours to respond before your listing is temporarily hidden</li>
                      <li><strong>Easy to restore</strong> — If you miss one, just respond to the next email to reappear</li>
                    </ul>
                  </div>

                  <div style="background: #FEF3C7; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <p style="color: #92400E; margin: 0; font-size: 14px;">
                      <strong>No action needed right now.</strong> We'll take care of everything on our end.
                      You'll receive a separate email once your profile is fully live.
                    </p>
                  </div>

                  <p style="color: #666; font-size: 14px;">
                    Questions? Reply to this email or contact us at help@georgiagapp.com
                  </p>

                  <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
                    GeorgiaGAPP.com — Connecting families with GAPP providers across Georgia
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
