'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [stats] = useState({
    totalProjects: 12,
    totalVotes: 147,
    activeHackers: 34,
  });

  return (
    <main style={{maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem'}}>
      <h1 style={{fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>
        🏁 Organizer Dashboard
      </h1>
      <p style={{color: '#666', marginBottom: '2rem'}}>Overview of the current hackathon</p>

      {/* Stats Grid */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
        {[
          { label: 'Total Projects', value: stats.totalProjects, emoji: '📁' },
          { label: 'Total Votes Cast', value: stats.totalVotes, emoji: '🗳️' },
          { label: 'Active Hackers', value: stats.activeHackers, emoji: '👥' },
        ].map(({ label, value, emoji }) => (
          <div key={label} style={{
            background: '#f9f9f9',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            padding: '1.25rem',
            textAlign: 'center',
          }}>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>{emoji}</div>
            <div style={{fontSize: '2rem', fontWeight: 'bold'}}>{value}</div>
            <div style={{fontSize: '0.875rem', color: '#666'}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem'}}>
        <button style={{padding: '8px 16px', borderRadius: '6px', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer'}}>
          📊 Export Data
        </button>
        <button style={{padding: '8px 16px', borderRadius: '6px', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer'}}>
          🔗 Share Voting Link
        </button>
        <button style={{padding: '8px 16px', borderRadius: '6px', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer'}}>
          📢 Announce Winner
        </button>
      </div>

      <p style={{fontSize: '0.875rem', color: '#999', marginTop: '2rem'}}>
        Note: Stats shown are placeholders. Connect to Supabase to show live data.
      </p>
    </main>
  );
}
