import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Lazy-initialized clients to avoid build-time errors
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

interface CallbackRequest {
  parentName: string
  phone: string
  email?: string
  zipCode: string
  county: string
  serviceNeeded: string
  urgency: string
  preferredCallbackTime?: string
  specialNeeds?: string
  providerId: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CallbackRequest = await request.json()

    // Validate required fields
    if (!body.parentName || !body.phone || !body.zipCode || !body.serviceNeeded || !body.urgency || !body.providerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Get provider info for email
    const { data: provider, error: providerError } = await supabase
      .from('providers')
      .select('id, name, email, phone')
      .eq('id', body.providerId)
      .single()

    if (providerError || !provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }

    // Insert callback request
    const { data: callback, error: insertError } = await supabase
      .from('callback_requests')
      .insert({
        parent_name: body.parentName,
        phone: body.phone,
        email: body.email || null,
        zip_code: body.zipCode,
        county: body.county || 'Unknown',
        service_needed: body.serviceNeeded,
        urgency: body.urgency,
        preferred_callback_time: body.preferredCallbackTime || null,
        special_needs: body.specialNeeds || null,
        provider_id: body.providerId,
        status: 'new',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting callback:', insertError)
      return NextResponse.json(
        { error: 'Failed to save callback request' },
        { status: 500 }
      )
    }

    // Send email notification to provider if they have an email
    const resend = getResend()
    if (provider.email && resend) {
      const urgencyText = {
        'asap': 'AS SOON AS POSSIBLE',
        'this_month': 'Within the next month',
        'researching': 'Just researching'
      }[body.urgency] || body.urgency

      const serviceText = {
        'RN': 'Nursing (RN)',
        'LPN': 'Nursing (LPN)',
        'PCS': 'Personal Care Services',
        'not_sure': 'Not sure yet'
      }[body.serviceNeeded] || body.serviceNeeded

      const callbackTimeText = {
        'morning': 'Morning (8am - 12pm)',
        'afternoon': 'Afternoon (12pm - 5pm)',
        'evening': 'Evening (5pm - 8pm)'
      }[body.preferredCallbackTime || ''] || 'Any time'

      try {
        await resend.emails.send({
          from: 'GeorgiaGAPP.com <leads@georgiagapp.com>',
          to: provider.email,
          subject: `New Lead: ${body.parentName} needs ${serviceText}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #FF8A80; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">New Callback Request</h1>
              </div>

              <div style="padding: 30px; background: #f9f9f9;">
                <p style="font-size: 16px; color: #333;">
                  A family has requested a callback from <strong>${provider.name}</strong> through GeorgiaGAPP.com
                </p>

                <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <h2 style="color: #2C3E50; margin-top: 0; border-bottom: 2px solid #FF8A80; padding-bottom: 10px;">
                    Family Information
                  </h2>

                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #666; width: 140px;">Name:</td>
                      <td style="padding: 8px 0; color: #333; font-weight: bold;">${body.parentName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666;">Phone:</td>
                      <td style="padding: 8px 0; color: #333; font-weight: bold;">
                        <a href="tel:${body.phone}" style="color: #FF8A80;">${body.phone}</a>
                      </td>
                    </tr>
                    ${body.email ? `
                    <tr>
                      <td style="padding: 8px 0; color: #666;">Email:</td>
                      <td style="padding: 8px 0; color: #333;">
                        <a href="mailto:${body.email}" style="color: #FF8A80;">${body.email}</a>
                      </td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 8px 0; color: #666;">ZIP Code:</td>
                      <td style="padding: 8px 0; color: #333;">${body.zipCode}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666;">County:</td>
                      <td style="padding: 8px 0; color: #333;">${body.county}</td>
                    </tr>
                  </table>
                </div>

                <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <h2 style="color: #2C3E50; margin-top: 0; border-bottom: 2px solid #87CEEB; padding-bottom: 10px;">
                    Care Needs
                  </h2>

                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #666; width: 140px;">Service Needed:</td>
                      <td style="padding: 8px 0; color: #333; font-weight: bold;">${serviceText}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666;">Urgency:</td>
                      <td style="padding: 8px 0; color: ${body.urgency === 'asap' ? '#FF8A80' : '#333'}; font-weight: bold;">
                        ${urgencyText}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666;">Best Callback Time:</td>
                      <td style="padding: 8px 0; color: #333;">${callbackTimeText}</td>
                    </tr>
                    ${body.specialNeeds ? `
                    <tr>
                      <td style="padding: 8px 0; color: #666; vertical-align: top;">Special Notes:</td>
                      <td style="padding: 8px 0; color: #333;">${body.specialNeeds}</td>
                    </tr>
                    ` : ''}
                  </table>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                  <a href="tel:${body.phone}"
                     style="display: inline-block; background: #FF8A80; color: white; padding: 15px 40px;
                            text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
                    Call ${body.parentName} Now
                  </a>
                </div>

                <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                  This lead was submitted through GeorgiaGAPP.com<br>
                  Please respond promptly to provide the best service.
                </p>
              </div>
            </div>
          `,
        })
      } catch (emailError) {
        // Log email error but don't fail the request - lead is still saved
        console.error('Error sending email notification:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      id: callback.id
    })

  } catch (error) {
    console.error('Callback API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
