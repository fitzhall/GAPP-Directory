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

    const { data: provider, error: fetchError } = await supabase
      .from('providers')
      .select('id, name, slug, email, claimed_by_email, is_verified, is_featured')
      .eq('id', providerId)
      .single()

    if (fetchError || !provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 })
    }

    if (!provider.is_verified) {
      return NextResponse.json({ error: 'Provider is not verified yet' }, { status: 400 })
    }

    const recipientEmail = provider.claimed_by_email || provider.email
    if (!recipientEmail) {
      return NextResponse.json({ error: 'No email address on file' }, { status: 400 })
    }

    const resend = getResend()
    if (!resend) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const profileUrl = `https://www.georgiagapp.com/provider/${provider.slug}`
    const tierLabel = provider.is_featured ? 'Featured Provider' : 'Verified Provider'
    const tierColor = provider.is_featured ? '#7C3AED' : '#10B981'

    await resend.emails.send({
      from: 'GeorgiaGAPP.com <noreply@georgiagapp.com>',
      to: recipientEmail,
      subject: `Your Profile Is Live! - ${provider.name} on GeorgiaGAPP.com`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, ${tierColor} 0%, ${tierColor}dd 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Your Profile Is Live!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">${tierLabel} on GeorgiaGAPP.com</p>
          </div>

          <div style="padding: 30px; background: #f9f9f9;">
            <p style="font-size: 18px; color: #333; margin-top: 0;">
              Great news! <strong>${provider.name}</strong> is now fully live on GeorgiaGAPP.com.
            </p>

            <div style="background: white; border-radius: 8px; padding: 25px; margin: 20px 0; border-left: 4px solid ${tierColor};">
              <h2 style="color: #2C3E50; margin-top: 0; font-size: 18px;">Your listing is active:</h2>
              <ul style="color: #555; line-height: 2; padding-left: 20px;">
                <li><strong>${tierLabel} badge</strong> — Families can see you're a trusted provider</li>
                <li><strong>Callback requests</strong> — Families can request callbacks directly through your profile</li>
                <li><strong>Search visibility</strong> — You now appear in directory searches by county and service type</li>
                ${provider.is_featured ? '<li><strong>Featured placement</strong> — Your listing appears at the top of search results</li>' : ''}
              </ul>
            </div>

            <div style="text-align: center; margin: 25px 0;">
              <a href="${profileUrl}"
                 style="background: ${tierColor}; color: white; padding: 14px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                View Your Profile
              </a>
            </div>

            <div style="background: #EFF6FF; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #3B82F6;">
              <h3 style="color: #1E40AF; margin: 0 0 10px 0; font-size: 16px;">Reminder: Weekly Check-In</h3>
              <p style="color: #1E40AF; margin: 0; font-size: 14px; line-height: 1.6;">
                Each week you'll get a quick email asking if you're still accepting new patients.
                Just click to confirm — it takes 5 seconds and keeps your listing visible to families.
                If you don't respond within 48 hours, your listing will be temporarily hidden until you check back in.
              </p>
            </div>

            <p style="color: #666; font-size: 14px;">
              If anything looks off on your profile, just reply to this email and we'll fix it.
            </p>

            <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
              GeorgiaGAPP.com — Connecting families with GAPP providers across Georgia
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Profile live email sent',
    })

  } catch (error) {
    console.error('Send live email error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
