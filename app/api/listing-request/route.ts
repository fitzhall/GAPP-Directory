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

interface ListingRequestBody {
  contactName: string
  contactEmail: string
  contactPhone?: string
  businessName: string
  city: string
  website?: string
  servicesOffered: string[]
  countiesServed: string[]
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ListingRequestBody = await request.json()

    // Validate required fields
    if (!body.contactName || !body.contactEmail || !body.businessName || !body.city) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Check if this email already has a pending request
    const { data: existingRequest } = await supabase
      .from('listing_requests')
      .select('id, status')
      .eq('contact_email', body.contactEmail)
      .eq('status', 'pending')
      .single()

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending listing request. We will review it soon.' },
        { status: 400 }
      )
    }

    // Insert the listing request
    const { data: listingRequest, error: insertError } = await supabase
      .from('listing_requests')
      .insert({
        contact_name: body.contactName,
        contact_email: body.contactEmail,
        contact_phone: body.contactPhone || null,
        business_name: body.businessName,
        city: body.city,
        website: body.website || null,
        services_offered: body.servicesOffered || [],
        counties_served: body.countiesServed || [],
        notes: body.notes || null,
        status: 'pending',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating listing request:', insertError)
      return NextResponse.json(
        { error: 'Failed to submit listing request' },
        { status: 500 }
      )
    }

    // Send confirmation email to requester
    const resend = getResend()
    if (resend) {
      try {
        await resend.emails.send({
          from: 'GeorgiaGAPP.com <noreply@georgiagapp.com>',
          to: body.contactEmail,
          subject: `Listing Request Received: ${body.businessName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #FF8A80; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Request Received!</h1>
              </div>

              <div style="padding: 30px; background: #f9f9f9;">
                <p style="font-size: 16px; color: #333;">
                  Hi ${body.contactName},
                </p>
                <p style="font-size: 16px; color: #333;">
                  We've received your request to be listed on GeorgiaGAPP.com as <strong>${body.businessName}</strong>.
                </p>

                <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <h2 style="color: #2C3E50; margin-top: 0;">What happens next?</h2>
                  <ol style="color: #555; line-height: 1.8;">
                    <li>Our team will review your request within 24-48 hours</li>
                    <li>We may contact you to verify your GAPP provider status</li>
                    <li>Once approved, we'll create your profile and send you a link to claim it</li>
                    <li>You can then upgrade to verified status for enhanced visibility</li>
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
        console.error('Error sending confirmation email:', emailError)
      }

      // Notify admin
      try {
        await resend.emails.send({
          from: 'GeorgiaGAPP.com <noreply@georgiagapp.com>',
          to: 'help@georgiaGAPP.com',
          subject: `New Listing Request: ${body.businessName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #17a2b8; padding: 15px; border-radius: 5px 5px 0 0;">
                <h2 style="color: white; margin: 0;">New Listing Request</h2>
              </div>
              <div style="padding: 20px; background: #f9f9f9; border: 1px solid #ddd; border-top: none;">
                <p><strong>Business Name:</strong> ${body.businessName}</p>
                <p><strong>City:</strong> ${body.city}</p>
                <p><strong>Contact:</strong> ${body.contactName}</p>
                <p><strong>Email:</strong> ${body.contactEmail}</p>
                <p><strong>Phone:</strong> ${body.contactPhone || 'Not provided'}</p>
                <p><strong>Website:</strong> ${body.website || 'Not provided'}</p>
                <p><strong>Services:</strong> ${body.servicesOffered?.join(', ') || 'None specified'}</p>
                <p><strong>Counties:</strong> ${body.countiesServed?.join(', ') || 'None specified'}</p>
                ${body.notes ? `<p><strong>Notes:</strong> ${body.notes}</p>` : ''}
                <p style="margin-top: 20px;">
                  <a href="https://georgiagapp.com/admin" style="background: #17a2b8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Review in Admin
                  </a>
                </p>
              </div>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Error sending admin notification:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Listing request submitted successfully',
      requestId: listingRequest.id,
    })

  } catch (error) {
    console.error('Listing request API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
