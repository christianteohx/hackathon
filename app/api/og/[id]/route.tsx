import { ImageResponse } from 'next/og';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();

    const { data: project } = await supabase
      .from('projects')
      .select('id, name, tagline, team_name, elo_rating')
      .eq('id', id)
      .single();

    if (!project) {
      return new Response('Project not found', { status: 404 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(140deg, #0f172a 0%, #1d4ed8 45%, #22d3ee 100%)',
            color: 'white',
            padding: '56px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 24,
              }}
            >
              H
            </div>
            <div style={{ fontSize: 30, fontWeight: 700 }}>Hackathon Platform</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.02, letterSpacing: -1.6 }}>
              {project.name}
            </div>
            <div style={{ fontSize: 30, opacity: 0.92, maxWidth: 1060 }}>
              {project.tagline || 'See this project on the live leaderboard'}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              {project.team_name ? (
                <div
                  style={{
                    fontSize: 24,
                    padding: '8px 16px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.2)',
                  }}
                >
                  Team {project.team_name}
                </div>
              ) : null}
              <div style={{ fontSize: 24, opacity: 0.95 }}>#{id.slice(0, 8)}</div>
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                padding: '10px 18px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.2)',
              }}
            >
              Elo {Math.round(project.elo_rating ?? 1000)}
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch {
    return new Response('Failed to generate image', { status: 500 });
  }
}
