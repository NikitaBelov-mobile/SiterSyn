import Stripe from 'stripe'

/**
 * Stripe client singleton
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-10-29.clover',
})

/**
 * Stripe Price IDs from environment
 */
export const STRIPE_PRICE_IDS = {
  starter: process.env.STRIPE_STARTER_PRICE_ID || '',
  pro: process.env.STRIPE_PRO_PRICE_ID || '',
  business: process.env.STRIPE_BUSINESS_PRICE_ID || '',
} as const

/**
 * Plan details
 */
export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    credits: 3,
    sites: 1,
    features: ['3 site generations', '1 active site', 'Basic templates'],
  },
  starter: {
    name: 'Starter',
    price: 15,
    credits: 15,
    sites: 3,
    features: ['15 site generations/month', '3 active sites', 'All templates', 'Email support'],
  },
  pro: {
    name: 'Pro',
    price: 29,
    credits: 50,
    sites: 10,
    features: ['50 site generations/month', '10 active sites', 'Priority support', 'Custom domains'],
  },
  business: {
    name: 'Business',
    price: 79,
    credits: -1, // Unlimited
    sites: -1, // Unlimited
    features: ['Unlimited generations', 'Unlimited sites', 'White label', 'Dedicated support', 'SLA'],
  },
} as const

export type PlanTier = keyof typeof PLANS

/**
 * Get plan details
 */
export function getPlanDetails(tier: PlanTier) {
  return PLANS[tier]
}

/**
 * Create Stripe checkout session
 */
export async function createStripeCheckoutSession(params: {
  tier: PlanTier
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl: string
}) {
  const { tier, userId, userEmail, successUrl, cancelUrl } = params

  if (tier === 'free') {
    throw new Error('Cannot create checkout for free tier')
  }

  const priceId = STRIPE_PRICE_IDS[tier]
  if (!priceId) {
    throw new Error(`No Stripe price ID configured for tier: ${tier}`)
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: userEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      user_id: userId,
      tier,
      payment_provider: 'stripe',
    },
  })

  return session
}

/**
 * Create Stripe customer portal session
 */
export async function createStripePortalSession(params: {
  customerId: string
  returnUrl: string
}) {
  const { customerId, returnUrl } = params

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

/**
 * Cancel Stripe subscription
 */
export async function cancelStripeSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId)
  return subscription
}
