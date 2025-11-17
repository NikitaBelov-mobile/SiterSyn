// @ts-nocheck - Temporary fix for Supabase types issue
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits, tier')
      .eq('id', user.id)
      .single()

    if (profileError) {
      throw profileError
    }

    return NextResponse.json({
      credits: profile?.credits || 0,
      tier: profile?.tier || 'free',
    })
  } catch (error) {
    console.error('Error fetching credits:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, type, description } = await request.json()

    if (!amount || !type) {
      return NextResponse.json(
        { error: 'Amount and type are required' },
        { status: 400 }
      )
    }

    // Use the database function to add credits
    const { error: creditError } = await supabase.rpc('add_credits', {
      p_user_id: user.id,
      p_amount: amount,
    })

    if (creditError) {
      throw creditError
    }

    // Fetch updated credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits, tier')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      success: true,
      credits: profile?.credits || 0,
      tier: profile?.tier || 'free',
    })
  } catch (error) {
    console.error('Error adding credits:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
