'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, CreditCard } from 'lucide-react'

export const dynamic = 'force-dynamic'

const plans = [
  {
    tier: 'free',
    name: 'Free',
    price: { usd: 0, rub: 0 },
    credits: 3,
    sites: 1,
    features: ['3 site generations', '1 active site', 'Basic templates', 'Community support'],
    popular: false,
  },
  {
    tier: 'starter',
    name: 'Starter',
    price: { usd: 15, rub: 1425 },
    credits: 15,
    sites: 3,
    features: ['15 site generations/month', '3 active sites', 'All templates', 'Email support'],
    popular: false,
  },
  {
    tier: 'pro',
    name: 'Pro',
    price: { usd: 29, rub: 2755 },
    credits: 50,
    sites: 10,
    features: [
      '50 site generations/month',
      '10 active sites',
      'Priority support',
      'Custom domains',
      'Advanced analytics',
    ],
    popular: true,
  },
  {
    tier: 'business',
    name: 'Business',
    price: { usd: 79, rub: 7505 },
    credits: -1,
    sites: -1,
    features: [
      'Unlimited generations',
      'Unlimited sites',
      'White label',
      'Dedicated support',
      'SLA guarantee',
      'Custom integrations',
    ],
    popular: false,
  },
]

function PricingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<string | null>(null)
  const [paymentProvider, setPaymentProvider] = useState<'stripe' | 'yookassa'>('stripe')

  const handleSubscribe = async (tier: string) => {
    if (tier === 'free') {
      router.push('/signup')
      return
    }

    setLoading(tier)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier,
          provider: paymentProvider,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout')
      }

      // Redirect to checkout
      window.location.href = data.url
    } catch (error) {
      console.error('Checkout error:', error)
      alert(error instanceof Error ? error.message : 'Failed to start checkout')
      setLoading(null)
    }
  }

  const paymentCanceled = searchParams.get('payment') === 'canceled'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              SiterSyn
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Choose the plan that works best for you
            </p>

            {paymentCanceled && (
              <div className="max-w-md mx-auto mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                Payment was canceled. Feel free to try again when ready.
              </div>
            )}

            {/* Payment Provider Selection */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
                <button
                  onClick={() => setPaymentProvider('stripe')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    paymentProvider === 'stripe'
                      ? 'bg-background shadow-sm font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <CreditCard className="inline-block h-4 w-4 mr-2" />
                  International (USD)
                </button>
                <button
                  onClick={() => setPaymentProvider('yookassa')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    paymentProvider === 'yookassa'
                      ? 'bg-background shadow-sm font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <CreditCard className="inline-block h-4 w-4 mr-2" />
                  Russia (RUB)
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.tier}
                className={`relative ${plan.popular ? 'border-blue-600 border-2 shadow-lg' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    <div className="text-3xl font-bold mt-4">
                      {paymentProvider === 'stripe' ? (
                        <>
                          ${plan.price.usd}
                          {plan.price.usd > 0 && <span className="text-lg font-normal text-muted-foreground">/mo</span>}
                        </>
                      ) : (
                        <>
                          ₽{plan.price.rub}
                          {plan.price.rub > 0 && <span className="text-lg font-normal text-muted-foreground">/мес</span>}
                        </>
                      )}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan.tier)}
                    disabled={loading !== null}
                  >
                    {loading === plan.tier
                      ? 'Loading...'
                      : plan.tier === 'free'
                        ? 'Get Started'
                        : 'Subscribe'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I cancel anytime?</h3>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of
                  your billing period.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept credit cards through Stripe (international) and YooKassa (for Russian users). Both support
                  all major credit and debit cards.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Do unused credits roll over?</h3>
                <p className="text-muted-foreground">
                  No, credits reset at the beginning of each billing cycle. We recommend the plan that best matches
                  your monthly needs.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I upgrade or downgrade?</h3>
                <p className="text-muted-foreground">
                  Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take
                  effect at the next billing cycle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PricingContent />
    </Suspense>
  )
}
