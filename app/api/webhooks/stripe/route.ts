// @ts-nocheck - Temporary fix for Supabase types issue
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/payments/stripe'
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
  const signature = req.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('[Stripe Webhook]', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Stripe Webhook] Error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: any) {
  const userId = session.metadata.user_id
  const tier = session.metadata.tier

  console.log('[Stripe] Checkout completed:', { userId, tier })

  // Update user profile
  await supabase.from('profiles').update({ tier }).eq('id', userId)

  // Create or update subscription record
  await supabase.from('subscriptions').upsert({
    user_id: userId,
    stripe_customer_id: session.customer,
    stripe_subscription_id: session.subscription,
    tier,
    status: 'active',
    payment_provider: 'stripe',
  })

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
    description: `${tier} plan subscription via Stripe`,
  })
}

async function handleSubscriptionUpdated(subscription: any) {
  console.log('[Stripe] Subscription updated:', subscription.id)

  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)
}

async function handleSubscriptionDeleted(subscription: any) {
  console.log('[Stripe] Subscription deleted:', subscription.id)

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single()

  if (sub) {
    // Downgrade to free tier
    await supabase.from('profiles').update({ tier: 'free' }).eq('id', sub.user_id)

    await supabase
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('stripe_subscription_id', subscription.id)
  }
}

async function handlePaymentSucceeded(invoice: any) {
  const subscriptionId = invoice.subscription

  if (!subscriptionId) return

  console.log('[Stripe] Payment succeeded for subscription:', subscriptionId)

  // Find subscription
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id, tier')
    .eq('stripe_subscription_id', subscriptionId)
    .single()

  if (sub) {
    // Renew credits for the new billing period
    const credits = TIER_CREDITS[sub.tier as keyof typeof TIER_CREDITS] || 0

    await supabase.rpc('add_credits', {
      p_user_id: sub.user_id,
      p_amount: credits,
    })

    await supabase.from('credit_transactions').insert({
      user_id: sub.user_id,
      amount: credits,
      type: 'subscription',
      description: `${sub.tier} plan renewal via Stripe`,
    })
  }
}

async function handlePaymentFailed(invoice: any) {
  const subscriptionId = invoice.subscription

  if (!subscriptionId) return

  console.log('[Stripe] Payment failed for subscription:', subscriptionId)

  // Mark subscription as past_due
  await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId)
}
