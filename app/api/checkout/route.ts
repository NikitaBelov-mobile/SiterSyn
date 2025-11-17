// @ts-nocheck - Temporary fix for Supabase types issue
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { paymentManager, PaymentProvider } from '@/lib/payments/manager'
import { PlanTier } from '@/lib/payments/stripe'

interface CheckoutRequest {
  tier: PlanTier
  provider: PaymentProvider
}

export async function POST(req: NextRequest) {
  try {
    const { tier, provider } = (await req.json()) as CheckoutRequest

    // Validate tier
    if (!tier || tier === 'free') {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    // Validate provider
    if (!provider || !['stripe', 'yookassa'].includes(provider)) {
      return NextResponse.json({ error: 'Invalid payment provider' }, { status: 400 })
    }

    // Check authentication
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, tier')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check if already subscribed to same or higher tier
    const tierOrder = ['free', 'starter', 'pro', 'business']
    const currentTierIndex = tierOrder.indexOf(profile.tier)
    const newTierIndex = tierOrder.indexOf(tier)

    if (currentTierIndex >= newTierIndex && profile.tier !== 'free') {
      return NextResponse.json(
        { error: 'You are already subscribed to this or a higher tier' },
        { status: 400 }
      )
    }

    // Create checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const checkoutResult = await paymentManager.createCheckout({
      provider,
      tier,
      userId: user.id,
      userEmail: profile.email || user.email || '',
      successUrl: `${baseUrl}/dashboard?payment=success`,
      cancelUrl: `${baseUrl}/pricing?payment=canceled`,
    })

    return NextResponse.json({
      success: true,
      url: checkoutResult.url,
      sessionId: checkoutResult.sessionId,
      paymentId: checkoutResult.paymentId,
      provider: checkoutResult.provider,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
