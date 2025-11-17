// @ts-ignore - YooKassa types are not available
import YooKassa from 'yookassa'
import crypto from 'crypto'

/**
 * Get YooKassa client (lazy initialization)
 */
function getYooKassaClient() {
  if (!process.env.YOOKASSA_SHOP_ID || !process.env.YOOKASSA_SECRET_KEY) {
    throw new Error('YooKassa credentials not configured')
  }

  // @ts-ignore
  return new YooKassa.YooCheckout({
    shopId: process.env.YOOKASSA_SHOP_ID,
    secretKey: process.env.YOOKASSA_SECRET_KEY,
  })
}

/**
 * Plan prices in RUB (примерный курс 1$ = 95 RUB)
 */
export const YOOKASSA_PRICES = {
  starter: 1425, // ~15 USD
  pro: 2755, // ~29 USD
  business: 7505, // ~79 USD
} as const

/**
 * Create YooKassa payment
 */
export async function createYooKassaPayment(params: {
  tier: 'starter' | 'pro' | 'business'
  userId: string
  userEmail: string
  returnUrl: string
}) {
  const { tier, userId, userEmail, returnUrl } = params

  const amount = YOOKASSA_PRICES[tier]
  const idempotenceKey = crypto.randomUUID()

  const yookassa = getYooKassaClient()
  const payment = await yookassa.createPayment(
    {
      amount: {
        value: amount.toString(),
        currency: 'RUB',
      },
      confirmation: {
        type: 'redirect',
        return_url: returnUrl,
      },
      capture: true,
      description: `SiterSyn ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan Subscription`,
      metadata: {
        user_id: userId,
        tier,
        payment_provider: 'yookassa',
      },
      receipt: {
        customer: {
          email: userEmail,
        },
        items: [
          {
            description: `Подписка ${tier.toUpperCase()}`,
            quantity: '1',
            amount: {
              value: amount.toString(),
              currency: 'RUB',
            },
            vat_code: 1, // НДС не облагается
          },
        ],
      },
    },
    idempotenceKey
  )

  return payment
}

/**
 * Get payment info
 */
export async function getYooKassaPayment(paymentId: string) {
  const yookassa = getYooKassaClient()
  const payment = await yookassa.getPayment(paymentId)
  return payment
}

/**
 * Create recurring payment (for subscriptions)
 */
export async function createYooKassaRecurringPayment(params: {
  tier: 'starter' | 'pro' | 'business'
  userId: string
  userEmail: string
  paymentMethodId: string
}) {
  const { tier, userId, userEmail, paymentMethodId } = params

  const amount = YOOKASSA_PRICES[tier]
  const idempotenceKey = crypto.randomUUID()

  const yookassa = getYooKassaClient()
  const payment = await yookassa.createPayment(
    {
      amount: {
        value: amount.toString(),
        currency: 'RUB',
      },
      payment_method_id: paymentMethodId,
      capture: true,
      description: `SiterSyn ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan - Monthly`,
      metadata: {
        user_id: userId,
        tier,
        payment_provider: 'yookassa',
        recurring: 'true',
      },
      receipt: {
        customer: {
          email: userEmail,
        },
        items: [
          {
            description: `Подписка ${tier.toUpperCase()} (месяц)`,
            quantity: '1',
            amount: {
              value: amount.toString(),
              currency: 'RUB',
            },
            vat_code: 1,
          },
        ],
      },
    },
    idempotenceKey
  )

  return payment
}

/**
 * Verify webhook signature
 */
export function verifyYooKassaWebhook(body: string, signature: string): boolean {
  const secretKey = process.env.YOOKASSA_SECRET_KEY || ''
  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(body)
    .digest('hex')

  return hash === signature
}
