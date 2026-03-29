'use client';
import { useState, useEffect } from 'react';
import { generateEventSummary } from '@/app/actions/eventSummary';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';

type LeaderboardEntry = {
  project_name: string;
  team_name: string;
  votes: number;
  elo_rating: number;
};

export default function EventSummaryPage() {
  const [summary, setSummary] = useState<{
    winner: string;
    audience_favorite: string;
    hidden_gem: string;
    recap: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setFetchingData(true);
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('name, team_name, elo_rating')
        .order('elo_rating', { ascending: false })
        .limit(20);

      if (fetchError) {
        setError('Could not load leaderboard: ' + fetchError.message);
      } else if (data) {
        // Map elo_rating to votes for the summary generator
        // elo_rating starts at 1200, so we use it directly as a proxy
        setLeaderboard(data.map(p => ({
          project_name: p.name,
          team_name: p.team_name || '',
          votes: Math.round(p.elo_rating - 1200), // convert Elo to vote-like score
          elo_rating: p.elo_rating,
        })));
      }
      setFetchingData(false);
    };

    fetchLeaderboard();
  }, []);

  async function handleGenerate() {
    if (leaderboard.length === 0) return;
    setLoading(true);
    const result = await generateEventSummary(leaderboard);
    setSummary(result);
    setLoading(false);
  }

  return (
    <AppShell title="🎉 Event Summary Generator" subtitle="Generate an AI-powered recap of the hackathon">
      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          color: '#dc2626',
          marginBottom: '1rem',
          fontSize: '0.875rem',
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>📊 Current Leaderboard (Top 10)</h2>
        {fetchingData ? (
          <p style={{ color: '#666', fontSize: '0.875rem' }}>Loading...</p>
        ) : leaderboard.length === 0 ? (
          <p style={{ color: '#999', fontSize: '0.875rem' }}>No projects found. Submit some projects first!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {leaderboard.slice(0, 10).map((p, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: '0.5rem',
                fontSize: '0.8rem',
                padding: '4px 8px',
                background: idx < 3 ? (idx === 0 ? '#fef9c3' : idx === 1 ? '#f1f5f9' : '#fed7aa') : '#f9f9f9',
                borderRadius: '4px',
              }}>
                <span style={{ fontWeight: 'bold', width: '20px' }}>#{idx + 1}</span>
                <span style={{ flex: 1 }}>{p.project_name}</span>
                {p.team_name && <span style={{ color: '#888' }}>{p.team_name}</span>}
                <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>{Math.round(p.elo_rating)} Elo</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || fetchingData || leaderboard.length === 0}
        style={{
          padding: '10px 20px',
          background: (loading || fetchingData || leaderboard.length === 0) ? '#9ca3af' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: (loading || fetchingData || leaderboard.length === 0) ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '0.875rem',
          marginBottom: '1.5rem',
        }}
      >
        {loading ? '🤖 Generating with AI...' : fetchingData ? 'Loading data...' : '🎯 Generate AI Summary'}
      </button>

      {summary && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#fef9c3', padding: '1rem', borderRadius: '8px', border: '1px solid #eab308' }}>
            <strong>🏆 Winner:</strong> {summary.winner}
          </div>
          <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
            <strong>👏 Audience Favorite:</strong> {summary.audience_favorite}
          </div>
          <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #22c55e' }}>
            <strong>💎 Hidden Gem:</strong> {summary.hidden_gem}
          </div>
          <div style={{
            background: '#f9f9f9',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #e5e5e5',
            lineHeight: '1.6',
            fontSize: '0.9rem',
          }}>
            <strong>📝 Recap:</strong><br />{summary.recap}
          </div>
        </div>
      )}
    </AppShell>
  );
}
