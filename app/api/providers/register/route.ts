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
    const body = await request.json()
    const { agencyName, contactName, email, phone, county, services, message } = body

    // Validate required fields
    if (!agencyName || !contactName || !email || !phone || !county || !services?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()
    const resend = getResend()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://georgiagapp.com'

    // Store the inquiry in the database
    const { data: inquiry, error: dbError } = await supabase
      .from('provider_inquiries')
      .insert({
        agency_name: agencyName,
        contact_name: contactName,
        email,
        phone,
        county,
        services,
        message: message || null,
        status: 'pending',
      })
      .select()
      .single()

    if (dbError) {
      // If table doesn't exist, just continue with email
      console.error('Database error (may not have inquiries table):', dbError)
    }

    // Send confirmation email to provider
    if (resend) {
      try {
        await resend.emails.send({
          from: 'GeorgiaGAPP.com <noreply@georgiagapp.com>',
          to: email,
          subject: 'We received your listing request!',
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

              <h2 style="color: #2C3E50; margin-bottom: 10px;">Thanks for your interest, ${contactName}!</h2>

              <p style="font-size: 16px; margin-bottom: 20px;">
                We've received your request to list <strong>${agencyName}</strong> on GeorgiaGAPP.com.
              </p>

              <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h3 style="margin-top: 0; color: #1e293b; font-size: 16px;">What you submitted:</h3>
                <table style="width: 100%; font-size: 14px;">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b;">Agency:</td>
                    <td style="padding: 8px 0; font-weight: 500;">${agencyName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b;">Contact:</td>
                    <td style="padding: 8px 0; font-weight: 500;">${contactName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b;">County:</td>
                    <td style="padding: 8px 0; font-weight: 500;">${county}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b;">Services:</td>
                    <td style="padding: 8px 0; font-weight: 500;">${services.join(', ')}</td>
                  </tr>
                </table>
              </div>

              <h3 style="color: #1e293b; font-size: 16px;">What happens next?</h3>
              <ol style="padding-left: 20px; color: #475569;">
                <li style="margin-bottom: 10px;">We'll review your submission within 1-2 business days</li>
                <li style="margin-bottom: 10px;">We'll call you at ${phone} to verify your information</li>
                <li style="margin-bottom: 10px;">Once verified, your listing goes live within 24 hours</li>
              </ol>

              <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
                Questions? Reply to this email or contact us at
                <a href="mailto:help@georgiagapp.com" style="color: #3b82f6;">help@georgiagapp.com</a>
              </p>

              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

              <p style="font-size: 12px; color: #94a3b8; text-align: center;">
                GeorgiaGAPP.com - Connecting families with quality GAPP providers
              </p>
            </body>
            </html>
          `,
        })
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError)
      }

      // Send notification to admin
      try {
        await resend.emails.send({
          from: 'GeorgiaGAPP.com <noreply@georgiagapp.com>',
          to: 'help@georgiagapp.com',
          subject: `New Provider Listing Request: ${agencyName}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2C3E50;">New Provider Listing Request</h2>

              <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <strong>Action Required:</strong> Call to verify and add to directory
              </div>

              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px 0; color: #64748b; width: 120px;">Agency:</td>
                  <td style="padding: 12px 0; font-weight: 600;">${agencyName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px 0; color: #64748b;">Contact:</td>
                  <td style="padding: 12px 0;">${contactName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px 0; color: #64748b;">Email:</td>
                  <td style="padding: 12px 0;"><a href="mailto:${email}" style="color: #3b82f6;">${email}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px 0; color: #64748b;">Phone:</td>
                  <td style="padding: 12px 0;"><a href="tel:${phone}" style="color: #3b82f6;">${phone}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px 0; color: #64748b;">County:</td>
                  <td style="padding: 12px 0;">${county}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px 0; color: #64748b;">Services:</td>
                  <td style="padding: 12px 0;">${services.join(', ')}</td>
                </tr>
                ${message ? `
                <tr>
                  <td style="padding: 12px 0; color: #64748b; vertical-align: top;">Message:</td>
                  <td style="padding: 12px 0;">${message}</td>
                </tr>
                ` : ''}
              </table>

              <div style="margin-top: 30px;">
                <a href="${baseUrl}/admin"
                   style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                  Go to Admin Dashboard
                </a>
              </div>

              <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">
                Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET
              </p>
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
      message: 'Registration submitted successfully',
    })
  } catch (error) {
    console.error('Error in provider registration:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
