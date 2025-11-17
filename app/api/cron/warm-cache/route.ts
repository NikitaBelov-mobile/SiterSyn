// @ts-nocheck - Temporary fix for Supabase types issue
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { CacheManager } from '@/lib/cache/manager'
import { HybridGenerator } from '@/lib/generators/hybrid'

// Use service role key for cron jobs
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Cron job to warm cache with popular patterns
 * Runs every 30 minutes
 */
export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get popular TOON patterns from recent generations
    const { data: patterns, error } = await supabase
      .from('generations')
      .select('toon_spec')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    const cacheManager = new CacheManager()
    const hybridGenerator = new HybridGenerator()
    let warmedCount = 0

    // Get unique patterns
    const uniquePatterns = [...new Set(patterns?.map((p) => p.toon_spec) || [])]

    for (const toonSpec of uniquePatterns) {
      try {
        // Check if already cached
        const cached = await cacheManager.get(toonSpec)
        if (cached) continue

        // Generate and cache
        const decision = hybridGenerator.decideMethod(toonSpec, '')
        const result = await hybridGenerator.generate(
          { siteType: 'lp', sections: [] },
          decision,
          `Generate from TOON: ${toonSpec}`
        )

        await cacheManager.set(toonSpec, result)
        warmedCount++

        // Rate limit to avoid overwhelming Claude API
        await new Promise((resolve) => setTimeout(resolve, 2000))
      } catch (error) {
        console.error(`Failed to warm cache for ${toonSpec}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      warmed: warmedCount,
      total: uniquePatterns.length,
    })
  } catch (error) {
    console.error('Cache warming error:', error)
    return NextResponse.json(
      { error: 'Cache warming failed' },
      { status: 500 }
    )
  }
}
