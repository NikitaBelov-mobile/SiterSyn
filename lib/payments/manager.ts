import { createStripeCheckoutSession, createStripePortalSession, getPlanDetails, PlanTier } from './stripe'
import { createYooKassaPayment } from './yookassa'

/**
 * Payment provider type
 */
export type PaymentProvider = 'stripe' | 'yookassa'

/**
 * Checkout result
 */
export interface CheckoutResult {
  url: string
  sessionId?: string
  paymentId?: string
  provider: PaymentProvider
}

/**
 * Payment Manager
 * Unified interface for multiple payment providers
 */
export class PaymentManager {
  /**
   * Create checkout session
   */
  async createCheckout(params: {
    provider: PaymentProvider
    tier: PlanTier
    userId: string
    userEmail: string
    successUrl: string
    cancelUrl: string
  }): Promise<CheckoutResult> {
    const { provider, tier, userId, userEmail, successUrl, cancelUrl } = params

    if (tier === 'free') {
      throw new Error('Cannot create checkout for free tier')
    }

    switch (provider) {
      case 'stripe':
        return this.createStripeCheckout({ tier, userId, userEmail, successUrl, cancelUrl })

      case 'yookassa':
        return this.createYooKassaCheckout({ tier, userId, userEmail, successUrl, cancelUrl })

      default:
        throw new Error(`Unknown payment provider: ${provider}`)
    }
  }

  /**
   * Create Stripe checkout
   */
  private async createStripeCheckout(params: {
    tier: PlanTier
    userId: string
    userEmail: string
    successUrl: string
    cancelUrl: string
  }): Promise<CheckoutResult> {
    if (params.tier === 'free') {
      throw new Error('Cannot create Stripe checkout for free tier')
    }

    const session = await createStripeCheckoutSession(params)

    if (!session.url) {
      throw new Error('Stripe checkout session URL is missing')
    }

    return {
      url: session.url,
      sessionId: session.id,
      provider: 'stripe',
    }
  }

  /**
   * Create YooKassa checkout
   */
  private async createYooKassaCheckout(params: {
    tier: 'starter' | 'pro' | 'business'
    userId: string
    userEmail: string
    successUrl: string
    cancelUrl: string
  }): Promise<CheckoutResult> {
    const payment = await createYooKassaPayment({
      tier: params.tier,
      userId: params.userId,
      userEmail: params.userEmail,
      returnUrl: params.successUrl,
    })

    const confirmationUrl = payment.confirmation?.confirmation_url

    if (!confirmationUrl) {
      throw new Error('YooKassa confirmation URL is missing')
    }

    return {
      url: confirmationUrl,
      paymentId: payment.id,
      provider: 'yookassa',
    }
  }

  /**
   * Create customer portal session (Stripe only)
   */
  async createPortalSession(params: {
    customerId: string
    returnUrl: string
  }): Promise<string> {
    const session = await createStripePortalSession(params)
    return session.url
  }

  /**
   * Get plan details
   */
  getPlanDetails(tier: PlanTier) {
    return getPlanDetails(tier)
  }

  /**
   * Get recommended provider based on user location
   */
  getRecommendedProvider(countryCode?: string): PaymentProvider {
    // Recommend YooKassa for Russian users
    if (countryCode === 'RU') {
      return 'yookassa'
    }

    // Default to Stripe for international users
    return 'stripe'
  }

  /**
   * Calculate price in user's currency
   */
  getPriceForProvider(tier: PlanTier, provider: PaymentProvider): { amount: number; currency: string } {
    const plan = getPlanDetails(tier)

    switch (provider) {
      case 'stripe':
        return {
          amount: plan.price,
          currency: 'USD',
        }

      case 'yookassa':
        // Convert USD to RUB (примерный курс)
        return {
          amount: Math.round(plan.price * 95),
          currency: 'RUB',
        }

      default:
        return {
          amount: plan.price,
          currency: 'USD',
        }
    }
  }
}

/**
 * Singleton instance
 */
export const paymentManager = new PaymentManager()
