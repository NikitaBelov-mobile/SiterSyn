/**
 * API Route: Sites [ID]
 * Handles operations for individual sites
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET - Get a single site by ID
 */
export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch site
    const { data: site, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json({ site });
  } catch (error) {
    console.error('Site GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update a site
 */
export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, code, status, custom_domain } = body;

    // Build update object
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updates.title = title;
    if (code !== undefined) updates.code = code;
    if (status !== undefined) {
      updates.status = status;
      if (status === 'published' && !body.published_at) {
        updates.published_at = new Date().toISOString();
      }
    }
    if (custom_domain !== undefined) updates.custom_domain = custom_domain;

    // Update site
    const { data: site, error: updateError } = await supabase
      .from('sites')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError || !site) {
      console.error('Failed to update site:', updateError);
      return NextResponse.json(
        { error: 'Failed to update site' },
        { status: 500 }
      );
    }

    return NextResponse.json({ site });
  } catch (error) {
    console.error('Site PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete a site
 */
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete site
    const { error: deleteError } = await supabase
      .from('sites')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Failed to delete site:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete site' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Site DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
