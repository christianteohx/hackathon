import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

type ProjectRow = {
  id: string;
  name: string;
  tagline: string;
  tags: string | null;
  elo_rating: number | null;
};

function parseTags(tags: string | null | undefined): string[] {
  if (!tags) return [];
  return tags
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();

    const { data: currentProject, error: currentError } = await supabase
      .from('projects')
      .select('id, tags')
      .eq('id', id)
      .maybeSingle();

    if (currentError || !currentProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const currentTags = parseTags(currentProject.tags as string | null);

    const { data: candidates, error: candidatesError } = await supabase
      .from('projects')
      .select('id, name, tagline, tags, elo_rating')
      .neq('id', id)
      .order('elo_rating', { ascending: false })
      .limit(100);

    if (candidatesError) {
      return NextResponse.json({ error: 'Failed to load similar projects' }, { status: 500 });
    }

    const scored = ((candidates || []) as ProjectRow[])
      .map((p) => {
        const tags = parseTags(p.tags);
        const overlap = tags.filter((tag) => currentTags.includes(tag)).length;
        return {
          id: p.id,
          name: p.name,
          tagline: p.tagline,
          tags,
          elo_rating: p.elo_rating ?? 0,
          overlap,
        };
      })
      .filter((p) => p.overlap > 0)
      .sort((a, b) => {
        if (b.overlap !== a.overlap) return b.overlap - a.overlap;
        return b.elo_rating - a.elo_rating;
      })
      .slice(0, 3);

    // Fallback: if tags are sparse, fill with top-rated projects
    if (scored.length < 3) {
      const used = new Set(scored.map((p) => p.id));
      const fallback = ((candidates || []) as ProjectRow[])
        .filter((p) => !used.has(p.id))
        .slice(0, 3 - scored.length)
        .map((p) => ({
          id: p.id,
          name: p.name,
          tagline: p.tagline,
          tags: parseTags(p.tags),
          elo_rating: p.elo_rating ?? 0,
          overlap: 0,
        }));
      scored.push(...fallback);
    }

    return NextResponse.json(scored);
  } catch (error) {
    console.error('Similar projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
