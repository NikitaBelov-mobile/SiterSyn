// @ts-nocheck - Temporary fix for Supabase types issue
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for cron jobs
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Cron job to cleanup old draft sites
 * Runs daily at 2 AM
 */
export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Delete draft sites older than 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: deletedSites, error: deleteError } = await supabase
      .from('sites')
      .delete()
      .eq('status', 'draft')
      .lt('created_at', thirtyDaysAgo.toISOString())
      .select('id')

    if (deleteError) throw deleteError

    // Clean up old credit transactions (older than 1 year)
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    const { data: deletedTransactions, error: txError } = await supabase
      .from('credit_transactions')
      .delete()
      .lt('created_at', oneYearAgo.toISOString())
      .select('id')

    if (txError) throw txError

    // Clean up old generations (older than 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const { data: deletedGenerations, error: genError } = await supabase
      .from('generations')
      .delete()
      .lt('created_at', sixMonthsAgo.toISOString())
      .select('id')

    if (genError) throw genError

    return NextResponse.json({
      success: true,
      deleted: {
        sites: deletedSites?.length || 0,
        transactions: deletedTransactions?.length || 0,
        generations: deletedGenerations?.length || 0,
      },
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { error: 'Cleanup failed' },
      { status: 500 }
    )
  }
}
