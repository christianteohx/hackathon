'use client';

import { useState } from 'react';

// Mock data — replace with Supabase fetch later
const mockProjects = [
  { rank: 1, name: 'Project Alpha', team: 'Team A', votes: 42 },
  { rank: 2, name: 'Quantum Leaper', team: 'Team B', votes: 38 },
  { rank: 3, name: 'DataMind', team: 'Team C', votes: 31 },
  { rank: 4, name: 'SwiftNav', team: 'Team D', votes: 27 },
  { rank: 5, name: 'CloudBridge', team: 'Team E', votes: 22 },
];

export default function LeaderboardPage() {
  const [projects] = useState(mockProjects);

  return (
    <main style={{maxWidth: '640px', margin: '0 auto', padding: '2rem 1rem'}}>
      <h1 style={{fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem'}}>
        🏆 Leaderboard
      </h1>
      
      <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
        {projects.map((p) => (
          <div key={p.rank} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.875rem 1rem',
            borderRadius: '8px',
            background: p.rank <= 3 ? (
              p.rank === 1 ? '#fef9c3' : 
              p.rank === 2 ? '#f1f5f9' : 
              '#fed7aa'
            ) : 'var(--card-bg, #f9f9f9)',
            border: '1px solid var(--border, #e5e5e5)',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold',
              background: p.rank === 1 ? '#eab308' : p.rank === 2 ? '#94a3b8' : p.rank === 3 ? '#c2410c' : '#e5e5e5',
              color: p.rank <= 3 ? 'white' : '#666',
              fontSize: '0.875rem',
            }}>
              {p.rank}
            </div>
            <div style={{flex: 1}}>
              <div style={{fontWeight: '600'}}>{p.name}</div>
              <div style={{fontSize: '0.8rem', color: '#666'}}>{p.team}</div>
            </div>
            <div style={{fontWeight: 'bold', color: 'var(--accent, #3b82f6)'}}>
              {p.votes} votes
            </div>
          </div>
        ))}
      </div>
      
      <p style={{marginTop: '1.5rem', fontSize: '0.875rem', color: '#666', textAlign: 'center'}}>
        Leaderboard updates as votes come in.
      </p>
    </main>
  );
}
