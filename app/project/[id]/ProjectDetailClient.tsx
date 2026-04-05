'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProjectQR from '@/components/ProjectQR';
import { AppShell } from '@/components/AppShell';

type ProjectDetail = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  team_name: string | null;
  demo_url: string | null;
  github_url: string | null;
  elo_rating: number;
  join_code: string;
  created_at: string;
  tags?: string[];
};

export default function ProjectDetailClient({ id }: { id: string }) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) {
          throw new Error('Project not found');
        }
        const data = await res.json();
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }

  function shareProject(name: string, url: string) {
    if (navigator.share) {
      navigator.share({ title: name, url }).catch(() => {
        navigator.clipboard.writeText(url);
        showToast('Link copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard!');
    }
  }

  if (loading) {
    return (
      <AppShell title="Loading..." subtitle="">
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          Loading project details...
        </div>
      </AppShell>
    );
  }

  if (error || !project) {
    return (
      <AppShell title="Project Not Found" subtitle="">
        <div style={{
          background: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          color: '#dc2626'
        }}>
          {error || 'Project not found'}
        </div>
        <Link href="/leaderboard" style={{ color: '#3b82f6' }}>
          ← Back to Leaderboard
        </Link>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={project.name}
      subtitle={project.tagline || undefined}
    >
      {/* Project meta */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <span style={{
          fontSize: '0.875rem',
          color: '#666',
          background: '#f3f4f6',
          padding: '4px 10px',
          borderRadius: '6px'
        }}>
          🏆 {Math.round(project.elo_rating)} Elo
        </span>
        {project.team_name && (
          <span style={{
            fontSize: '0.875rem',
            color: '#6b21a8',
            background: '#ede9fe',
            padding: '4px 10px',
            borderRadius: '6px'
          }}>
            by {project.team_name}
          </span>
        )}
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '0.75rem',
                color: '#374151',
                background: '#e5e7eb',
                padding: '2px 8px',
                borderRadius: '9999px'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      <div style={{
        background: '#f9f9f9',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>
          About this project
        </h2>
        <p style={{ lineHeight: '1.7', color: '#4b5563' }}>
          {project.description || 'No description provided.'}
        </p>
      </div>

      {/* Action links */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {project.demo_url && (
          <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
            style={{
              padding: '10px 18px', borderRadius: '8px',
              background: '#3b82f6', color: 'white',
              textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500'
            }}>
            🚀 Live Demo
          </a>
        )}
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noopener noreferrer"
            style={{
              padding: '10px 18px', borderRadius: '8px',
              background: '#1f2937', color: 'white',
              textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500'
            }}>
            🐙 GitHub
          </a>
        )}
        <button
          onClick={() => shareProject(project.name, window.location.href)}
          style={{
            padding: '10px 18px', borderRadius: '8px',
            border: '1px solid #d1d5db', background: '#fff',
            cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500'
          }}>
          🔗 Share
        </button>
        <Link href="/vote" style={{
          padding: '10px 18px', borderRadius: '8px',
          border: '1px solid #d1d5db', background: '#fff',
          textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500',
          color: '#374151', display: 'inline-flex', alignItems: 'center'
        }}>
          🗳️ Vote for this project
        </Link>
      </div>

      {/* QR Code */}
      <ProjectQR projectId={project.id} projectName={project.name} />

      {/* External QR Code for easy sharing */}
      <div className="mt-6">
        <p className="text-xs font-semibold text-[var(--muted-foreground)] mb-2">Scan to share</p>
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}/project/${project.id}`)}`}
          alt="QR code for sharing this project"
          width={200}
          height={200}
          className="rounded-xl"
        />
      </div>

      <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#9ca3af' }}>
        Join code: <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{project.join_code}</code>
      </p>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--foreground)] text-[var(--background)] shadow-lg">
            <svg className="w-4 h-4 text-[var(--success)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">{toast}</span>
          </div>
        </div>
      )}
    </AppShell>
  );
}
