// @ts-nocheck - Temporary fix for Supabase types issue
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for analytics access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Get total generations
    const { count: totalGenerations } = await supabase
      .from('generations')
      .select('*', { count: 'exact', head: true })

    // Get total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Get cache hit rate
    const { data: generations } = await supabase.from('generations').select('cached')

    const cachedCount = generations?.filter((g) => g.cached).length || 0
    const cacheHitRate = totalGenerations ? cachedCount / totalGenerations : 0

    // Get average cost
    const { data: costs } = await supabase.from('generations').select('cost')

    const totalCost = costs?.reduce((sum, g) => sum + (g.cost || 0), 0) || 0
    const averageCost = totalGenerations ? totalCost / totalGenerations : 0

    // Get active subscriptions count
    const { count: activeSubscriptions } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Calculate total revenue (approximate)
    const tierPrices = { starter: 15, pro: 29, business: 79 }
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('status', 'active')

    const totalRevenue =
      subscriptions?.reduce((sum, sub) => {
        return sum + (tierPrices[sub.tier as keyof typeof tierPrices] || 0)
      }, 0) || 0

    // Get generations by method
    const { data: methodData } = await supabase.from('generations').select('method')

    const generationsByMethod = {
      template: methodData?.filter((g) => g.method === 'template').length || 0,
      hybrid: methodData?.filter((g) => g.method === 'hybrid').length || 0,
      ai: methodData?.filter((g) => g.method === 'ai').length || 0,
    }

    return NextResponse.json({
      totalGenerations: totalGenerations || 0,
      totalUsers: totalUsers || 0,
      cacheHitRate,
      averageCost,
      totalRevenue,
      activeSubscriptions: activeSubscriptions || 0,
      generationsByMethod,
      recentActivity: [], // TODO: implement time-series data
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      {
        totalGenerations: 0,
        totalUsers: 0,
        cacheHitRate: 0,
        averageCost: 0,
        totalRevenue: 0,
        activeSubscriptions: 0,
        generationsByMethod: { template: 0, hybrid: 0, ai: 0 },
        recentActivity: [],
      },
      { status: 200 }
    )
  }
}
