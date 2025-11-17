// @ts-nocheck - Temporary fix for Supabase types issue
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowUpCircle, Calendar, CreditCard, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

const PLAN_DETAILS = {
  free: {
    name: 'Free',
    price: 0,
    credits: 3,
    color: 'bg-gray-100 text-gray-800',
  },
  starter: {
    name: 'Starter',
    price: 15,
    credits: 15,
    color: 'bg-blue-100 text-blue-800',
  },
  pro: {
    name: 'Pro',
    price: 29,
    credits: 50,
    color: 'bg-purple-100 text-purple-800',
  },
  business: {
    name: 'Business',
    price: 79,
    credits: 'Unlimited',
    color: 'bg-amber-100 text-amber-800',
  },
}

export default async function SubscriptionPage() {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('credits, tier, email')
    .eq('id', user.id)
    .single()

  // Fetch subscription details
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  // Fetch recent transactions
  const { data: transactions } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const currentPlan = PLAN_DETAILS[profile?.tier as keyof typeof PLAN_DETAILS] || PLAN_DETAILS.free

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription & Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and view billing history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Badge className={currentPlan.color}>{currentPlan.name}</Badge>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  ${currentPlan.price}
                  {currentPlan.price > 0 && <span className="text-lg font-normal text-muted-foreground">/mo</span>}
                </div>
              </div>
              {profile?.tier !== 'free' && profile?.tier !== 'business' && (
                <Button asChild className="w-full">
                  <Link href="/pricing">
                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                    Upgrade Plan
                  </Link>
                </Button>
              )}
              {profile?.tier === 'free' && (
                <Button asChild className="w-full">
                  <Link href="/pricing">Get Started</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Credits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold">
                  {profile?.credits === -1 || currentPlan.credits === 'Unlimited'
                    ? '∞'
                    : profile?.credits || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentPlan.credits === 'Unlimited' ? 'Unlimited' : `${currentPlan.credits} per month`}
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width:
                      currentPlan.credits === 'Unlimited'
                        ? '100%'
                        : `${Math.min(100, ((profile?.credits || 0) / currentPlan.credits) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Period */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Billing Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {subscription ? (
                <>
                  <div>
                    <div className="text-sm text-muted-foreground">Current period</div>
                    <div className="font-medium">
                      {new Date(subscription.current_period_start).toLocaleDateString()} -{' '}
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Payment method</div>
                    <div className="font-medium capitalize">{subscription.payment_provider || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                      {subscription.status}
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground">No active subscription</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent credit transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions && transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <div className="font-medium">{transaction.description || transaction.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {transaction.amount > 0 ? '+' : ''}
                    {transaction.amount} credits
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No transactions yet</div>
          )}
        </CardContent>
      </Card>

      {/* Manage Subscription */}
      {subscription && subscription.payment_provider === 'stripe' && subscription.stripe_customer_id && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
            <CardDescription>Update payment method, view invoices, or cancel subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/create-portal-session" method="POST">
              <input type="hidden" name="customerId" value={subscription.stripe_customer_id} />
              <Button type="submit">Manage via Stripe</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {subscription && subscription.payment_provider === 'yookassa' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
            <CardDescription>Manage your YooKassa subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              To manage your subscription, please contact support at support@sitersyn.com
            </p>
            <Button variant="outline" asChild>
              <a href="mailto:support@sitersyn.com">Contact Support</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
