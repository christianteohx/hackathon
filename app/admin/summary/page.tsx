'use client';
import { useState } from 'react';
import { generateEventSummary } from '@/app/actions/eventSummary';

export default function EventSummaryPage() {
  const [summary, setSummary] = useState<{
    winner: string;
    audience_favorite: string;
    hidden_gem: string;
    recap: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    const mockLeaderboard = [
      { project_name: 'Project Alpha', team_name: 'Team A', votes: 42 },
      { project_name: 'Quantum Leaper', team_name: 'Team B', votes: 38 },
      { project_name: 'DataMind', team_name: 'Team C', votes: 31 },
    ];
    const result = await generateEventSummary(mockLeaderboard);
    setSummary(result);
    setLoading(false);
  }

  return (
    <main style={{maxWidth: '640px', margin: '0 auto', padding: '2rem 1rem'}}>
      <h1 style={{fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem'}}>
        🎉 Event Summary Generator
      </h1>
      
      <button onClick={handleGenerate} disabled={loading}
        style={{padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '1.5rem'}}>
        {loading ? 'Generating...' : '🎯 Generate Summary'}
      </button>

      {summary && (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <div style={{background: '#fef9c3', padding: '1rem', borderRadius: '8px', border: '1px solid #eab308'}}>
            <strong>🏆 Winner:</strong> {summary.winner}
          </div>
          <div style={{background: '#f0f9ff', padding: '1rem', borderRadius: '8px', border: '1px solid #0ea5e9'}}>
            <strong>👏 Audience Favorite:</strong> {summary.audience_favorite}
          </div>
          <div style={{background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #22c55e'}}>
            <strong>💎 Hidden Gem:</strong> {summary.hidden_gem}
          </div>
          <div style={{background: '#f9f9f9', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e5e5', lineHeight: '1.6'}}>
            <strong>📝 Recap:</strong><br/>{summary.recap}
          </div>
        </div>
      )}
    </main>
  );
}
