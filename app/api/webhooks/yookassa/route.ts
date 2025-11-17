// @ts-nocheck - Temporary fix for Supabase types issue
import { NextRequest, NextResponse } from 'next/server'
import { verifyYooKassaWebhook } from '@/lib/payments/yookassa'
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Credits allocation by tier
 */
const TIER_CREDITS = {
  starter: 15,
  pro: 50,
  business: 999999, // Unlimited represented as very large number
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-yookassa-signature') || ''

  // Verify webhook signature (optional but recommended)
  if (process.env.YOOKASSA_SECRET_KEY && signature) {
    const isValid = verifyYooKassaWebhook(body, signature)
    if (!isValid) {
      console.error('[YooKassa] Webhook signature verification failed')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
  }

  let event
  try {
    event = JSON.parse(body)
  } catch (err) {
    console.error('[YooKassa] Invalid JSON:', err)
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('[YooKassa Webhook]', event.event)

  try {
    switch (event.event) {
      case 'payment.succeeded':
        await handlePaymentSucceeded(event.object)
        break

      case 'payment.canceled':
        await handlePaymentCanceled(event.object)
        break

      case 'payment.waiting_for_capture':
        // Payment is authorized but not captured yet
        console.log('[YooKassa] Payment waiting for capture:', event.object.id)
        break

      case 'refund.succeeded':
        await handleRefundSucceeded(event.object)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[YooKassa Webhook] Error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handlePaymentSucceeded(payment: any) {
  const userId = payment.metadata?.user_id
  const tier = payment.metadata?.tier
  const isRecurring = payment.metadata?.recurring === 'true'

  if (!userId || !tier) {
    console.error('[YooKassa] Missing metadata:', payment.metadata)
    return
  }

  console.log('[YooKassa] Payment succeeded:', { userId, tier, paymentId: payment.id })

  // Update user profile
  await supabase.from('profiles').update({ tier }).eq('id', userId)

  // Create or update subscription record
  const subscriptionData: any = {
    user_id: userId,
    tier,
    status: 'active',
    payment_provider: 'yookassa',
  }

  // Store payment method ID for recurring payments
  if (payment.payment_method?.id) {
    subscriptionData.yookassa_payment_method_id = payment.payment_method.id
  }

  // Calculate period (1 month from now)
  const now = new Date()
  const periodEnd = new Date(now)
  periodEnd.setMonth(periodEnd.getMonth() + 1)

  subscriptionData.current_period_start = now.toISOString()
  subscriptionData.current_period_end = periodEnd.toISOString()

  // Check if subscription already exists
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .eq('payment_provider', 'yookassa')
    .single()

  if (existingSub) {
    await supabase
      .from('subscriptions')
      .update(subscriptionData)
      .eq('id', existingSub.id)
  } else {
    await supabase.from('subscriptions').insert(subscriptionData)
  }

  // Grant credits based on tier
  const credits = TIER_CREDITS[tier as keyof typeof TIER_CREDITS] || 0
  await supabase.rpc('add_credits', {
    p_user_id: userId,
    p_amount: credits,
  })

  // Log transaction
  await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount: credits,
    type: 'subscription',
    description: `${tier} plan ${isRecurring ? 'renewal' : 'subscription'} via YooKassa`,
  })
}

async function handlePaymentCanceled(payment: any) {
  const userId = payment.metadata?.user_id

  if (!userId) {
    console.error('[YooKassa] Missing user_id in metadata')
    return
  }

  console.log('[YooKassa] Payment canceled:', { userId, paymentId: payment.id })

  // Optionally handle cancelation (e.g., send notification)
}

async function handleRefundSucceeded(refund: any) {
  const paymentId = refund.payment_id

  console.log('[YooKassa] Refund succeeded:', { paymentId, refundId: refund.id })

  // Find related subscription and handle refund
  // This is a simplified implementation
  // In production, you'd want to track refunds more carefully
}
