/**
 * API Route: Iterate
 * Handles AI-powered design iterations via chat
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClaudeService } from '@/lib/ai/claude';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

interface IterateRequest {
  siteId: string;
  instruction: string;
}

interface IterateResponse {
  success: boolean;
  code?: string;
  cost?: number;
  error?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<IterateResponse>> {
  const startTime = Date.now();

  try {
    // Parse request
    const body: IterateRequest = await req.json();
    const { siteId, instruction } = body;

    if (!siteId || !instruction) {
      return NextResponse.json(
        {
          success: false,
          error: 'Site ID and instruction are required',
        },
        { status: 400 }
      );
    }

    // Check authentication
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    // Fetch site
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('*')
      .eq('id', siteId)
      .eq('user_id', user.id)
      .single();

    if (siteError || !site) {
      return NextResponse.json(
        {
          success: false,
          error: 'Site not found',
        },
        { status: 404 }
      );
    }

    // Check if site has code
    if (!site.code) {
      return NextResponse.json(
        {
          success: false,
          error: 'Site has no code to iterate on',
        },
        { status: 400 }
      );
    }

    // Check credits (iterations cost credits too)
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (!profile || profile.credits < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Insufficient credits',
        },
        { status: 402 }
      );
    }

    // Iterate with Claude
    const claude = getClaudeService();
    const result = await claude.iterateDesign(site.code, instruction);

    const { code, cost, usage } = result;

    // Validate code
    const validation = claude.validateCode(code);
    if (!validation.valid) {
      console.error('Iterated code validation failed:', validation.errors);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to generate valid code. Please try again.',
        },
        { status: 500 }
      );
    }

    // Update site with new code
    const { error: updateError } = await supabase
      .from('sites')
      .update({
        code,
        updated_at: new Date().toISOString(),
      })
      .eq('id', siteId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Failed to update site:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save changes',
        },
        { status: 500 }
      );
    }

    // Deduct credit
    await supabase.rpc('deduct_credit', {
      user_id: user.id,
      amount: 1,
    });

    // Log iteration
    const duration = Date.now() - startTime;
    await supabase.from('generations').insert({
      user_id: user.id,
      site_id: siteId,
      toon_spec: `iteration: ${instruction.substring(0, 100)}`,
      method: 'ai',
      cost,
      duration,
      cached: false,
    });

    return NextResponse.json({
      success: true,
      code,
      cost,
    });
  } catch (error) {
    console.error('Iteration error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
