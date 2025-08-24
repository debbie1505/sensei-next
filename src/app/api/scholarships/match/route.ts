import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { matchScholarshipsLLM } from '@/llm/provider';
import { type Profile } from '@/llm/schemas';
import { validateScholarshipMatch, validateProfile } from '@/llm/validation';

export async function POST(request: NextRequest) {
  try {
    const { profile, tags }: { profile: Profile; tags: string[] } = await request.json();
    
    if (!profile || !tags) {
      return NextResponse.json(
        { error: 'Missing required fields: profile and tags' },
        { status: 400 }
      );
    }

    // Get user from auth
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // First, try to get matches from our curated database
    const { data: dbMatches, error: dbError } = await supabase
      .from('kb_items')
      .select('*')
      .eq('kind', 'scholarship')
      .overlaps('tags', tags)
      .gte('deadline', new Date().toISOString().split('T')[0])
      .order('deadline', { ascending: true })
      .limit(10);

    if (dbError) {
      console.error('Database query error:', dbError);
    }

    // Validate profile
    const validatedProfile = validateProfile(profile);

    // Also get AI-generated matches using structured outputs
    const aiMatches = await matchScholarshipsLLM(validatedProfile, tags);

    // Validate the AI matches
    const validatedAiMatches = validateScholarshipMatch(aiMatches);

    // Combine and deduplicate matches
    const allMatches = [
      ...(dbMatches || []).map(item => ({
        ...item,
        source: 'database',
        fit_score: 8 // High score for curated items
      })),
      ...validatedAiMatches.items.map(item => ({
        ...item,
        source: 'ai'
      }))
    ];

    // Remove duplicates based on title
    const uniqueMatches = allMatches.filter((item, index, self) => 
      index === self.findIndex(t => t.title === item.title)
    );

    return NextResponse.json({
      success: true,
      data: {
        matches: uniqueMatches.slice(0, 20), // Limit to 20 results
        total: uniqueMatches.length
      }
    });

  } catch (error) {
    console.error('Scholarship matching error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get all available scholarships (for browsing)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kind = searchParams.get('kind') || 'scholarship';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = await createClient();

    let query = supabase
      .from('kb_items')
      .select('*')
      .eq('kind', kind)
      .gte('deadline', new Date().toISOString().split('T')[0])
      .order('deadline', { ascending: true });

    if (limit) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data: items, error } = await query;

    if (error) {
      console.error('Scholarships fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch scholarships' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        items,
        pagination: {
          limit,
          offset,
          hasMore: items.length === limit
        }
      }
    });

  } catch (error) {
    console.error('Scholarships fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
