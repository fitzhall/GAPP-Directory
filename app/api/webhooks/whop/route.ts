import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Verify Whop webhook signature
function verifyWebhookSignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature) return false

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('whop-signature') || request.headers.get('x-whop-signature')
    const webhookSecret = process.env.WHOP_WEBHOOK_SECRET

    // Verify signature if secret is configured
    if (webhookSecret && !verifyWebhookSignature(payload, signature, webhookSecret)) {
      console.error('Invalid Whop webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(payload)
    console.log('Whop webhook received:', event.action || event.event || 'unknown', JSON.stringify(event, null, 2))

    const supabase = getSupabase()

    // Handle different Whop event types
    // Whop sends events like: membership.went_valid, payment.succeeded, etc.
    const eventType = event.action || event.event || ''

    // Extract relevant data - Whop structure varies by event
    const membership = event.data?.membership || event.membership || event.data || {}
    const product = membership.product || event.data?.product || {}
    const user = membership.user || event.data?.user || event.user || {}

    // Get customer email and product info
    const customerEmail = user.email || membership.email || event.email
    const productId = product.id || membership.product_id || event.product_id
    const productName = (product.name || membership.product_name || '').toLowerCase()

    console.log('Parsed webhook data:', { customerEmail, productId, productName, eventType })

    // Handle successful payment/membership activation
    if (
      eventType === 'membership.went_valid' ||
      eventType === 'payment.succeeded' ||
      eventType === 'membership.created' ||
      eventType === 'checkout.completed'
    ) {
      if (!customerEmail) {
        console.error('No customer email in webhook')
        return NextResponse.json({ error: 'No customer email' }, { status: 400 })
      }

      // Find provider by email
      const { data: provider, error: findError } = await supabase
        .from('providers')
        .select('id, name, email, is_verified, tier_level')
        .eq('email', customerEmail)
        .single()

      if (findError || !provider) {
        console.error('Provider not found for email:', customerEmail)
        // Store the payment for manual processing
        const { error: insertError } = await supabase
          .from('pending_upgrades')
          .insert({
            email: customerEmail,
            product_id: productId,
            product_name: productName,
            event_type: eventType,
            raw_data: event,
            status: 'pending',
          })
        if (insertError) console.error('Could not store pending upgrade:', insertError)

        return NextResponse.json({
          received: true,
          warning: 'Provider not found, stored for manual processing'
        })
      }

      // Determine what to upgrade based on product
      let updates: Record<string, any> = {}

      // Check product name/id to determine tier
      if (
        productName.includes('premium') ||
        productName.includes('featured') ||
        productId === process.env.WHOP_PREMIUM_PRODUCT_ID
      ) {
        // Premium tier
        updates = {
          tier_level: 'premium',
          is_verified: true,
          is_featured: true,
          verified_at: new Date().toISOString(),
          featured_at: new Date().toISOString(),
        }
        console.log(`Upgrading ${provider.name} to PREMIUM`)
      } else if (
        productName.includes('verified') ||
        productName.includes('basic') ||
        productId === process.env.WHOP_VERIFIED_PRODUCT_ID
      ) {
        // Verified tier
        updates = {
          tier_level: 'verified',
          is_verified: true,
          verified_at: new Date().toISOString(),
        }
        console.log(`Upgrading ${provider.name} to VERIFIED`)
      } else {
        // Default to verified if we can't determine
        updates = {
          is_verified: true,
          verified_at: new Date().toISOString(),
        }
        console.log(`Upgrading ${provider.name} to VERIFIED (default)`)
      }

      // Update provider
      const { error: updateError } = await supabase
        .from('providers')
        .update(updates)
        .eq('id', provider.id)

      if (updateError) {
        console.error('Error updating provider:', updateError)
        return NextResponse.json({ error: 'Failed to update provider' }, { status: 500 })
      }

      console.log(`Successfully upgraded provider: ${provider.name} (${customerEmail})`)

      return NextResponse.json({
        success: true,
        provider: provider.name,
        upgradedTo: updates.tier_level || 'verified'
      })
    }

    // Handle membership cancellation/expiration
    if (
      eventType === 'membership.went_invalid' ||
      eventType === 'membership.cancelled' ||
      eventType === 'subscription.cancelled'
    ) {
      if (!customerEmail) {
        return NextResponse.json({ received: true })
      }

      // Find and downgrade provider
      const { data: provider } = await supabase
        .from('providers')
        .select('id, name')
        .eq('email', customerEmail)
        .single()

      if (provider) {
        await supabase
          .from('providers')
          .update({
            tier_level: 'free',
            is_verified: false,
            is_featured: false,
          })
          .eq('id', provider.id)

        console.log(`Downgraded provider: ${provider.name} (membership cancelled)`)
      }

      return NextResponse.json({ received: true, action: 'downgraded' })
    }

    // Acknowledge other events
    return NextResponse.json({ received: true, event: eventType })

  } catch (error) {
    console.error('Whop webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Whop may send GET for verification
export async function GET() {
  return NextResponse.json({ status: 'Whop webhook endpoint active' })
}
