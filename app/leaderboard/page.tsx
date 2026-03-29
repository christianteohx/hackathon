'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';

type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  team_name: string | null;
  demo_url: string | null;
  github_url: string | null;
  elo_rating: number;
  join_code: string;
};

export default function LeaderboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('id, name, tagline, description, team_name, demo_url, github_url, elo_rating, join_code')
        .order('elo_rating', { ascending: false })
        .limit(50);

      if (fetchError) {
        console.error('Error fetching leaderboard:', fetchError);
        setError('Could not load leaderboard. Please try again.');
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { bg: '#fef9c3', border: '#eab308', medal: '#eab308' };
    if (rank === 2) return { bg: '#f1f5f9', border: '#94a3b8', medal: '#94a3b8' };
    if (rank === 3) return { bg: '#fed7aa', border: '#c2410c', medal: '#c2410c' };
    return { bg: '#f9f9f9', border: '#e5e5e5', medal: '#e5e5e5' };
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  return (
    <AppShell title="🏆 Leaderboard" subtitle="Ranked by Elo rating — updated after every vote">
      {loading && (
        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
          Loading leaderboard...
        </p>
      )}

      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '1rem',
          color: '#dc2626',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div style={{
          background: '#f9f9f9',
          border: '1px solid #e5e5e5',
          borderRadius: '8px',
          padding: '3rem',
          textAlign: 'center',
          color: '#666',
        }}>
          <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No projects yet</p>
          <p style={{ fontSize: '0.875rem' }}>
            <a href="/submit" style={{ color: '#3b82f6' }}>Submit the first project</a> to get voting started!
          </p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {projects.map((project, idx) => {
            const rank = idx + 1;
            const style = getRankStyle(rank);
            const medal = getMedalEmoji(rank);

            return (
              <div key={project.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.875rem 1rem',
                borderRadius: '8px',
                background: style.bg,
                border: `1px solid ${style.border}`,
                transition: 'transform 0.1s',
              }}>
                {/* Rank */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  background: medal ? style.medal : '#e5e5e5',
                  color: medal ? 'white' : '#666',
                  fontSize: medal ? '1.1rem' : '0.875rem',
                }}>
                  {medal || rank}
                </div>

                {/* Project Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                    {project.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {project.team_name && (
                      <span style={{ background: '#ede9fe', color: '#6b21a8', padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>
                        {project.team_name}
                      </span>
                    )}
                    {project.tagline && (
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {project.tagline}
                      </span>
                    )}
                  </div>
                </div>

                {/* Elo Rating */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#3b82f6' }}>
                    {Math.round(project.elo_rating)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#888' }}>Elo</div>
                </div>

                {/* Links */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: '#3b82f6', color: 'white', textDecoration: 'none' }}
                    >
                      Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: '#333', color: 'white', textDecoration: 'none' }}
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#666', textAlign: 'center' }}>
          {projects.length} project{projects.length !== 1 ? 's' : ''} · Leaderboard updates after every vote
        </p>
      )}
    </AppShell>
  );
}
