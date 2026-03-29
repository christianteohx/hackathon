'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function ProjectPage() {
  const params = useParams();
  const id = params?.id;
  
  // Mock data — replace with Supabase fetch later
  const [project] = useState({
    id,
    project_name: id === '1' ? 'Project Alpha' : 'Quantum Leaper',
    team_name: 'Team A',
    tagline: 'Revolutionizing the future of hackathons',
    description: 'A comprehensive platform for hackathon organizers and participants. Features include project voting, real-time leaderboards, AI-powered judging, and blind voting modes.',
    demo_url: 'https://example.com',
    github_url: 'https://github.com/example/project',
    votes: 42,
  });

  return (
    <main style={{maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem'}}>
      <div style={{marginBottom: '1.5rem'}}>
        <span style={{fontSize: '0.875rem', color: '#666'}}>🏆 {project.votes} votes</span>
      </div>
      
      <h1 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>
        {project.project_name}
      </h1>
      <p style={{fontSize: '1.1rem', color: '#666', marginBottom: '1.5rem'}}>
        by {project.team_name}
      </p>
      
      <div style={{
        background: '#f9f9f9',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <p style={{lineHeight: '1.7'}}>{project.description}</p>
      </div>
      
      <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
        {project.demo_url && (
          <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
            style={{
              padding: '8px 16px', borderRadius: '6px',
              background: '#3b82f6', color: 'white',
              textDecoration: 'none', fontSize: '0.9rem'
            }}>
            🚀 Live Demo
          </a>
        )}
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noopener noreferrer"
            style={{
              padding: '8px 16px', borderRadius: '6px',
              background: '#333', color: 'white',
              textDecoration: 'none', fontSize: '0.9rem'
            }}>
            🐙 GitHub
          </a>
        )}
        <button
          onClick={() => window.history.back()}
          style={{
            padding: '8px 16px', borderRadius: '6px',
            border: '1px solid #e5e5e5', background: '#fff',
            cursor: 'pointer', fontSize: '0.9rem'
          }}>
          ← Back
        </button>
      </div>
    </main>
  );
}
