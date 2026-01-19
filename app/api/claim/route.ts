import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

interface ClaimRequest {
  providerId: string
  email: string
  name: string
  phone?: string
  website?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ClaimRequest = await request.json()

    if (!body.providerId || !body.email || !body.name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Get the provider
    const { data: provider, error: fetchError } = await supabase
      .from('providers')
      .select('id, name, slug, is_claimed, is_verified, email')
      .eq('id', body.providerId)
      .single()

    if (fetchError || !provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }

    // Check if already claimed (if column exists)
    if (provider.is_claimed || provider.is_verified) {
      return NextResponse.json(
        { error: 'This profile has already been claimed' },
        { status: 400 }
      )
    }

    // Update provider with claim data
    const { error: updateError } = await supabase
      .from('providers')
      .update({
        email: body.email,
        ...(body.website && { website: body.website }),
        is_claimed: true,
        claimed_at: new Date().toISOString(),
        claimed_by_email: body.email,
        tier_level: 1, // 0=unclaimed, 1=claimed, 2=verified, 3=premium
      })
      .eq('id', body.providerId)

    if (updateError) {
      console.error('Error updating provider:', updateError)
      console.error('Provider ID:', body.providerId)
      console.error('Update payload:', { email: body.email, is_claimed: true, claimed_by_email: body.email })
      return NextResponse.json(
        { error: 'Failed to claim profile: ' + updateError.message },
        { status: 500 }
      )
    }

    // Verify the update worked
    const { data: verifyData } = await supabase
      .from('providers')
      .select('is_claimed, claimed_by_email')
      .eq('id', body.providerId)
      .single()

    console.log('Claim verification:', { providerId: body.providerId, result: verifyData })

    // Send confirmation email
    const resend = getResend()
    if (resend) {
      try {
        await resend.emails.send({
          from: 'GeorgiaGAPP.com <noreply@georgiagapp.com>',
          to: body.email,
          subject: `Claim Received: ${provider.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #FF8A80; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Claim Received!</h1>
              </div>

              <div style="padding: 30px; background: #f9f9f9;">
                <p style="font-size: 16px; color: #333;">
                  Hi ${body.name},
                </p>
                <p style="font-size: 16px; color: #333;">
                  We've received your request to claim the profile for <strong>${provider.name}</strong> on GeorgiaGAPP.com.
                </p>

                <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <h2 style="color: #2C3E50; margin-top: 0;">What happens next?</h2>
                  <ol style="color: #555; line-height: 1.8;">
                    <li>Our team will review your claim within 24-48 hours</li>
                    <li>We may call to verify your association with ${provider.name}</li>
                    <li>Once verified, your profile will be fully visible</li>
                    <li>You'll start receiving callback requests from families</li>
                  </ol>
                </div>

                <p style="color: #666; font-size: 14px;">
                  If you have any questions, reply to this email or contact us at help@georgiaGAPP.com
                </p>

                <p style="color: #999; font-size: 12px; margin-top: 30px;">
                  GeorgiaGAPP.com - Connecting families with GAPP providers
                </p>
              </div>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Error sending email:', emailError)
        // Don't fail the request if email fails
      }

      // Also notify admin
      try {
        await resend.emails.send({
          from: 'GeorgiaGAPP.com <noreply@georgiagapp.com>',
          to: 'help@georgiaGAPP.com',
          subject: `New Claim: ${provider.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>New Profile Claim</h2>
              <p><strong>Provider:</strong> ${provider.name}</p>
              <p><strong>Claimed by:</strong> ${body.name}</p>
              <p><strong>Email:</strong> ${body.email}</p>
              <p><strong>Phone:</strong> ${body.phone || 'Not provided'}</p>
              <p><strong>Website:</strong> ${body.website || 'Not provided'}</p>
              <p style="margin-top: 20px;">
                <a href="https://georgiagapp.com/admin" style="background: #FF8A80; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                  Review in Admin
                </a>
              </p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Error sending admin notification:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Claim submitted successfully'
    })

  } catch (error) {
    console.error('Claim API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
