// @ts-nocheck - Temporary fix for Supabase types issue
/**
 * API Route: Sites
 * Handles CRUD operations for sites
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET - List all sites for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Build query
    let query = supabase
      .from('sites')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    const { data: sites, error, count } = await query;

    if (error) {
      console.error('Failed to fetch sites:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sites' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sites,
      total: count,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Sites GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a new site (manual creation, not AI generation)
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, code, toon_spec } = body;

    if (!title || !code) {
      return NextResponse.json(
        { error: 'Title and code are required' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = generateSlug(title);

    // Create site
    const { data: site, error: createError } = await supabase
      .from('sites')
      .insert({
        user_id: user.id,
        title,
        slug,
        code,
        toon_spec,
        status: 'draft',
      })
      .select()
      .single();

    if (createError) {
      console.error('Failed to create site:', createError);
      return NextResponse.json(
        { error: 'Failed to create site' },
        { status: 500 }
      );
    }

    return NextResponse.json({ site }, { status: 201 });
  } catch (error) {
    console.error('Sites POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Generate slug from title
 */
function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 30);

  const random = Math.random().toString(36).substring(2, 6);
  return `${base}-${random}`;
}
