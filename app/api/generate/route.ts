// @ts-nocheck - Temporary fix for Supabase types issue
/**
 * API Route: Generate Site
 * Handles AI generation requests for creating new sites
 */

import { NextRequest, NextResponse } from 'next/server';
import { TOONEncoder } from '@/lib/ai/toon/encoder';
import { getClaudeService } from '@/lib/ai/claude';
import { createClient } from '@/lib/supabase/server';

interface GenerateRequest {
  prompt: string;
  style?: string;
  siteType?: string;
}

interface GenerateResponse {
  success: boolean;
  site?: {
    id: string;
    title: string;
    slug: string;
    code: string;
    toon_spec: string;
  };
  toon?: string;
  confidence?: number;
  method?: string;
  cost?: number;
  error?: string;
}

interface UserProfile {
  credits: number;
  tier: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<GenerateResponse>> {
  const startTime = Date.now();

  try {
    // Parse request body
    const body: GenerateRequest = await req.json();
    const { prompt, style, siteType } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Prompt is required',
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
          error: 'Unauthorized. Please login to generate sites.',
        },
        { status: 401 }
      );
    }

    // Check credits
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('credits, tier')
      .eq('id', user.id)
      .single();

    if (profileError || !profileData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch user profile',
        },
        { status: 500 }
      );
    }

    const profile = profileData as UserProfile;

    if (profile.credits < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Insufficient credits. Please purchase more credits or upgrade your plan.',
        },
        { status: 402 }
      );
    }

    // Encode prompt to TOON
    const encoder = new TOONEncoder();
    let encodingResult;

    if (siteType) {
      // Use explicit encoding if siteType provided
      encodingResult = encoder.encodeExplicit({
        siteType: siteType as any,
        style: style as any,
        sections: ['h', 'f', 'ct'] as any,
      });
    } else {
      // Encode from natural language prompt
      encodingResult = encoder.encode(prompt);
    }

    const { toon, spec, confidence, method, warnings } = encodingResult;

    // Check confidence threshold
    if (confidence < 0.5) {
      return NextResponse.json(
        {
          success: false,
          error: `Could not understand prompt with sufficient confidence (${(confidence * 100).toFixed(0)}%). Please be more specific about what type of site you want to create.`,
        },
        { status: 400 }
      );
    }

    // Generate site with Claude
    const claude = getClaudeService();
    const generationResult = await claude.generateSite(toon);

    const { code, usage, cost } = generationResult;

    // Validate generated code
    const validation = claude.validateCode(code);
    if (!validation.valid) {
      console.error('Generated code validation failed:', validation.errors);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to generate valid code. Please try again.',
        },
        { status: 500 }
      );
    }

    // Generate slug
    const slug = generateSlug();

    // Extract title from prompt
    const title = extractTitle(prompt);

    // Create site record
    const { data: siteData, error: siteError } = await supabase
      .from('sites')
      .insert({
        user_id: user.id,
        title,
        slug,
        code,
        toon_spec: toon,
        status: 'draft',
      } as any)
      .select()
      .single();

    if (siteError || !siteData) {
      console.error('Failed to create site record:', siteError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save site. Please try again.',
        },
        { status: 500 }
      );
    }

    const site = siteData as any;

    // Deduct credit
    const { error: deductError } = await supabase.rpc('deduct_credit', {
      user_id: user.id,
      amount: 1,
    } as any);

    if (deductError) {
      console.error('Failed to deduct credit:', deductError);
      // Don't fail the request, just log it
    }

    // Log generation
    const duration = Date.now() - startTime;
    const { error: logError } = await supabase.from('generations').insert({
      user_id: user.id,
      site_id: site.id,
      toon_spec: toon,
      method: method,
      cost: cost,
      duration: duration,
      cached: false,
    } as any);

    if (logError) {
      console.error('Failed to log generation:', logError);
      // Don't fail the request
    }

    // Return success response
    return NextResponse.json({
      success: true,
      site: {
        id: site.id,
        title: site.title,
        slug: site.slug,
        code: site.code,
        toon_spec: site.toon_spec,
      },
      toon,
      confidence,
      method,
      cost,
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error. Please try again.',
      },
      { status: 500 }
    );
  }
}

/**
 * Generate a unique slug
 */
function generateSlug(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `site-${timestamp}-${random}`;
}

/**
 * Extract title from prompt
 */
function extractTitle(prompt: string): string {
  // Remove common prefixes
  let title = prompt
    .replace(/^(create|make|build|generate)\s+/i, '')
    .replace(/^(a|an|the)\s+/i, '');

  // Take first sentence or first 50 chars
  const firstSentence = title.split(/[.!?]/)[0];
  title = firstSentence.substring(0, 50);

  // Capitalize first letter
  title = title.charAt(0).toUpperCase() + title.slice(1);

  return title.trim();
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
