import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCsvSection(title: string, headers: string[], rows: Record<string, unknown>[]): string {
  const headerRow = headers.join(',');
  const bodyRows = rows.map((row) => headers.map((h) => escapeCsv(row[h])).join(',')).join('\n');
  return `# ${title}\n${headerRow}${bodyRows ? `\n${bodyRows}` : ''}`;
}

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const [projectsRes, votesRes, judgeRes] = await Promise.all([
      supabase
        .from('projects')
        .select('id, name, tagline, description, demo_url, github_url, join_code, tags, elo_rating, created_at, updated_at')
        .order('created_at', { ascending: true }),
      supabase
        .from('votes')
        .select('id, left_project_id, right_project_id, winner_project_id, session_id, created_by_user_id, hackathon_id, created_at')
        .order('created_at', { ascending: true }),
      supabase
        .from('judge_scores')
        .select('id, project_id, judge_name, innovation, technical, presentation, impact, feedback, created_at')
        .order('created_at', { ascending: true }),
    ]);

    if (projectsRes.error || votesRes.error || judgeRes.error) {
      return NextResponse.json(
        {
          error: 'Failed to export data',
          details: projectsRes.error?.message || votesRes.error?.message || judgeRes.error?.message,
        },
        { status: 500 }
      );
    }

    const projects = projectsRes.data || [];
    const votes = votesRes.data || [];
    const judgeScores = judgeRes.data || [];

    const csv = [
      buildCsvSection(
        'Projects',
        ['id', 'name', 'tagline', 'description', 'demo_url', 'github_url', 'join_code', 'tags', 'elo_rating', 'created_at', 'updated_at'],
        projects
      ),
      '',
      buildCsvSection(
        'Votes',
        ['id', 'left_project_id', 'right_project_id', 'winner_project_id', 'session_id', 'created_by_user_id', 'hackathon_id', 'created_at'],
        votes
      ),
      '',
      buildCsvSection(
        'Judge Scores',
        ['id', 'project_id', 'judge_name', 'innovation', 'technical', 'presentation', 'impact', 'feedback', 'created_at'],
        judgeScores
      ),
      '',
    ].join('\n');

    const timestamp = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename=hackathon-export-${timestamp}.csv`,
      },
    });
  } catch (error) {
    console.error('Admin export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
