import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Fetch scores for a project or all scores
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id');

  try {
    if (projectId) {
      const { data, error } = await (supabase as any)
        .from('judge_scores')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    } else {
      // Return all scores grouped by project
      const { data, error } = await (supabase as any)
        .from('judge_scores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }
  } catch (error) {
    console.error('Error fetching judge scores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch judge scores' },
      { status: 500 }
    );
  }
}

// POST: Submit a judge score
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_id, judge_name, innovation, technical, presentation, impact, feedback } = body;

    if (!project_id || !judge_name || innovation === undefined || technical === undefined || presentation === undefined || impact === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (innovation < 1 || innovation > 10 || technical < 1 || technical > 10 || presentation < 1 || presentation > 10 || impact < 1 || impact > 10) {
      return NextResponse.json(
        { error: 'Scores must be between 1 and 10' },
        { status: 400 }
      );
    }

    const { data, error } = await (supabase as any)
      .from('judge_scores')
      .insert({
        project_id,
        judge_name,
        innovation,
        technical,
        presentation,
        impact,
        feedback: feedback || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error submitting judge score:', error);
    return NextResponse.json(
      { error: 'Failed to submit score' },
      { status: 500 }
    );
  }
}
