'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProjectQR from '@/components/ProjectQR';
import { AppShell } from '@/components/AppShell';

type JudgeFeedback = {
  score: number;
  verdict: string;
  strengths: string[];
  concerns: string[];
};

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

type SimilarProject = {
  id: string;
  name: string;
  tagline: string;
  tags: string[];
  elo_rating: number;
};

function normalizeExternalUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function normalizeProject(raw: any): ProjectDetail {
  return {
    id: raw.id,
    name: raw.name,
    tagline: raw.tagline || '',
    description: raw.description || '',
    team_name: raw.team_name ?? null,
    demo_url: normalizeExternalUrl(raw.demo_url ?? raw.demoUrl ?? null),
    github_url: normalizeExternalUrl(raw.github_url ?? raw.githubUrl ?? null),
    elo_rating: Number(raw.elo_rating ?? raw.eloRating ?? 0),
    join_code: raw.join_code ?? raw.joinCode ?? '',
    created_at: raw.created_at ?? raw.createdAt ?? '',
    tags: Array.isArray(raw.tags)
      ? raw.tags
      : typeof raw.tags === 'string'
      ? raw.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : [],
  };
}

export default function ProjectDetailClient({ id }: { id: string }) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [similarProjects, setSimilarProjects] = useState<SimilarProject[]>([]);

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
        setProject(normalizeProject(data));
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

  async function copyProjectLink(url: string) {
    await navigator.clipboard.writeText(url);
    showToast('Link copied to clipboard!');
  }

  function shareToTwitter(name: string, url: string) {
    const text = encodeURIComponent(`Check out this hackathon project: ${name}`);
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  }

  useEffect(() => {
    if (!project?.id) return;

    const fetchSimilarProjects = async () => {
      try {
        const res = await fetch(`/api/projects/${project.id}/similar`);
        if (!res.ok) return;
        const data = await res.json();
        setSimilarProjects(Array.isArray(data) ? data : []);
      } catch {
        setSimilarProjects([]);
      }
    };

    fetchSimilarProjects();
  }, [project?.id]);

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
            🚀 View Live
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
          onClick={() => copyProjectLink(window.location.href)}
          style={{
            padding: '10px 18px', borderRadius: '8px',
            border: '1px solid #d1d5db', background: '#fff',
            cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500'
          }}>
          📋 Copy Link
        </button>
        <button
          onClick={() => shareToTwitter(project.name, window.location.href)}
          style={{
            padding: '10px 18px', borderRadius: '8px',
            border: '1px solid #d1d5db', background: '#fff',
            cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500'
          }}>
          ✖️ Share on X
        </button>
        <Link href="/vote" style={{
          padding: '10px 18px', borderRadius: '8px',
          border: '1px solid #d1d5db', background: '#fff',
          textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500',
          color: '#374151', display: 'inline-flex', alignItems: 'center'
        }}>
          🗳️ Go to voting
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

      {/* Similar projects */}
      {similarProjects.length > 0 && (
        <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#374151' }}>
            Similar Projects
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {similarProjects.map((similar) => (
              <Link
                key={similar.id}
                href={`/project/${similar.id}`}
                style={{
                  display: 'block',
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  padding: '0.9rem 1rem',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.2rem' }}>{similar.name}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>{similar.tagline || 'No tagline provided'}</p>
                  </div>
                  <span style={{ color: '#6b7280', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    🏆 {Math.round(similar.elo_rating)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#9ca3af' }}>
        Join code: <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{project.join_code}</code>
      </p>

      {/* AI Judge Feedback Section */}
      <AIPanel project={project} />

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

function AIPanel({ project }: { project: ProjectDetail }) {
  const [feedback, setFeedback] = useState<JudgeFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: project.name,
          tagline: project.tagline,
          description: project.description,
          demoUrl: project.demo_url,
          githubUrl: project.github_url,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback(data.data);
      } else {
        setError(data.error || 'Failed to generate feedback.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 bg-[var(--muted)] hover:bg-[var(--muted)]/80 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🤖</span>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">AI Judge Feedback</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              {feedback ? 'Powered by Vertex AI (Gemini)' : 'Get instant feedback from our AI judge'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {feedback && (
            <span className="px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-bold">
              {feedback.score}/100
            </span>
          )}
          <svg
            className={`w-4 h-4 text-[var(--muted-foreground)] transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-6 py-5">
          {!feedback && !loading && !error && (
            <div className="text-center">
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Get an instant AI-powered evaluation of your project based on innovation, technical quality, and impact.
              </p>
              <button
                type="button"
                onClick={handleGenerate}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                <span>🤖</span>
                Get AI Feedback
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-4">
              <div className="w-8 h-8 border-3 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-[var(--muted-foreground)]">Analyzing your project with AI...</p>
            </div>
          )}

          {error && (
            <div className="text-center">
              <p className="text-sm text-[var(--error)] mb-3">{error}</p>
              <button
                type="button"
                onClick={handleGenerate}
                className="text-sm text-[var(--primary)] underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          )}

          {feedback && (
            <div className="space-y-4">
              {/* Score */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="var(--muted)"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="3"
                      strokeDasharray={`${feedback.score}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-[var(--foreground)]">
                    {feedback.score}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">AI Score</p>
                  <p className="text-xs text-[var(--muted-foreground)]">out of 100</p>
                </div>
              </div>

              {/* Verdict */}
              <div className="rounded-xl bg-[var(--muted)]/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] mb-1.5">
                  Verdict
                </p>
                <p className="text-sm text-[var(--foreground)] leading-relaxed">{feedback.verdict}</p>
              </div>

              {/* Strengths */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--success)] mb-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Strengths
                </p>
                <ul className="space-y-1.5">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-[var(--success)] mt-0.5">✓</span>
                      <span className="text-[var(--foreground)]">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Concerns */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--warning)] mb-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Areas for Improvement
                </p>
                <ul className="space-y-1.5">
                  {feedback.concerns.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-[var(--warning)] mt-0.5">→</span>
                      <span className="text-[var(--foreground)]">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  🔄 Regenerate feedback
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
