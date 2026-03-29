'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalVotes: 0,
    activeHackers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topProjects, setTopProjects] = useState<{ name: string; elo_rating: number; team_name: string | null }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      const [projectsRes, votesRes, profilesRes, leaderboardRes] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('votes').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase
          .from('projects')
          .select('name, elo_rating, team_name')
          .order('elo_rating', { ascending: false })
          .limit(5),
      ]);

      if (projectsRes.error) console.error('projects error:', projectsRes.error);
      if (votesRes.error) console.error('votes error:', votesRes.error);
      if (profilesRes.error) console.error('profiles error:', profilesRes.error);
      if (leaderboardRes.error) console.error('leaderboard error:', leaderboardRes.error);

      setStats({
        totalProjects: projectsRes.count || 0,
        totalVotes: votesRes.count || 0,
        activeHackers: profilesRes.count || 0,
      });

      if (leaderboardRes.data) {
        setTopProjects(leaderboardRes.data);
      }

      const hasError = projectsRes.error || votesRes.error || profilesRes.error;
      if (hasError) {
        setError('Some data could not be loaded. Showing partial results.');
      }

      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects, emoji: '📁' },
    { label: 'Total Votes Cast', value: stats.totalVotes, emoji: '🗳️' },
    { label: 'Active Hackers', value: stats.activeHackers, emoji: '👥' },
  ];

  return (
    <AppShell title="🏁 Organizer Dashboard" subtitle="Overview of the current hackathon event">
      {loading && (
        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>Loading stats...</p>
      )}

      {error && (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          color: '#92400e',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {statCards.map(({ label, value, emoji }) => (
          <div key={label} style={{
            background: '#f9f9f9',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            padding: '1.25rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{emoji}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{loading ? '—' : value}</div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Top Projects */}
      {!loading && topProjects.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem' }}>🏆 Top Projects</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {topProjects.map((project, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 1rem',
                background: idx === 0 ? '#fef9c3' : idx === 1 ? '#f1f5f9' : idx === 2 ? '#fed7aa' : '#f9f9f9',
                borderRadius: '6px',
                border: '1px solid #e5e5e5',
              }}>
                <span style={{ fontWeight: 'bold', width: '24px', textAlign: 'center' }}>
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                </span>
                <span style={{ flex: 1, fontWeight: '500' }}>{project.name}</span>
                {project.team_name && (
                  <span style={{ fontSize: '0.75rem', background: '#ede9fe', color: '#6b21a8', padding: '2px 6px', borderRadius: '4px' }}>
                    {project.team_name}
                  </span>
                )}
                <span style={{ fontWeight: 'bold', color: '#3b82f6', fontSize: '0.875rem' }}>
                  {Math.round(project.elo_rating)} Elo
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <a
          href="/leaderboard"
          style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', textDecoration: 'none', color: '#333', fontSize: '0.875rem' }}
        >
          📊 View Leaderboard
        </a>
        <a
          href="/vote"
          style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', textDecoration: 'none', color: '#333', fontSize: '0.875rem' }}
        >
          🗳️ Start Voting
        </a>
        <a
          href="/submit"
          style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', textDecoration: 'none', color: '#333', fontSize: '0.875rem' }}
        >
          ➕ Add Project
        </a>
      </div>
    </AppShell>
  );
}
